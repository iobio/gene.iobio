
export default class HubSession {
  constructor() {
    this.vcf = null;
    this.samples = null;
    this.url = null;
    this.apiVersion =  '/apiv1';
  }

  promiseInit(sampleId, source) {
    let self = this;
    self.api = source + self.apiVersion;

    return new Promise((resolve, reject) => {
      let modelInfos = [];

      // Get pedigree for sample
      self.getPedigreeForSample(sampleId).done(data => {
        let pedigree = self.parsePedigree(data);

        let promises = [];
        for (var rel in pedigree) {
          let samples = [];
          if (Array.isArray(pedigree[rel])) {
            samples = pedigree[rel];
          } else {
            samples = [pedigree[rel]];
          }
          samples.forEach(s => {
            let p =  self.promiseGetFileMapForSample(s, rel).then(data => {
              let theSample = data.sample;
              theSample.files = data.fileMap;

              // TEMPORARY WORKAROUND - get rid of .exome from sample id
              if (theSample.id.indexOf(".exome") > 0) {
                theSample.id = theSample.id.substr(0,theSample.id.indexOf(".exome"));
              }
              var modelInfo = {
                'relationship':   data.relationship == 'siblings' ? 'sibling' : data.relationship,
                'affectedStatus': theSample.pedigree.affection_status == 1 || theSample.pedigree.affection_status == 2 ? 'affected' : 'unaffected',
                'name':           theSample.id,
                'sample':         theSample.id,
                'vcf':            theSample.files.vcf,
                'tbi':            theSample.files.tbi.indexOf(theSample.files.vcf) == 0 ? null : theSample.files.tbi,
                'bam':            theSample.files.bam,
                'bai':            theSample.files.bai.indexOf(theSample.files.bam) == 0 ? null : theSample.files.bai };
              modelInfos.push(modelInfo);
            })
            promises.push(p);
          })

        }

        Promise.all(promises).then(response => {
          console.log(pedigree);
          resolve(modelInfos);
        })
        .catch(error => {
          reject(error);
        })
      })
    })




  }

  parsePedigree(raw_pedigree) {
    // This assumes only 1 proband. If there are multiple affected samples then
    // the proband will be overwritten
    // This also assume no grandparents/grandchildren

    let pedigree = {}

    const probandIndex = raw_pedigree.findIndex(d => (d.pedigree.affection_status == 1 || d.pedigree.affection_status == 2)
                                                      && (d.pedigree.maternal_id && d.pedigree.maternal_id.length > 0
                                                          && d.pedigree.paternal_id && d.pedigree.paternal_id.length > 0) );
    if (probandIndex != -1) {
      const proband  = raw_pedigree.splice(probandIndex, 1)[0];

      // Get mother
      const motherIndex = raw_pedigree.findIndex(d => d.uuid == proband.pedigree.maternal_id)
      pedigree['mother'] = raw_pedigree.splice(motherIndex, 1)[0]

      // Get mother
      const fatherIndex = raw_pedigree.findIndex(d => d.uuid == proband.pedigree.paternal_id)
      pedigree['father'] = raw_pedigree.splice(fatherIndex, 1)[0]

      // Proband
      pedigree['proband'] = proband;
    }


    raw_pedigree.forEach(sample => {
      if (sample.pedigree.maternal_id != null || sample.pedigree.paternal_id != null) {
        pedigree['siblings'] = (pedigree['siblings'] || [])
        pedigree['siblings'].push(sample);
      } else {
        pedigree['unparsed'] = (pedigree['siblings'] || []).push(sample)
      }
    })

    return pedigree;
  }

  getPedigreeForSample(sample_uuid) {
    let self = this;
    return $.ajax({
      url: self.api + '/samples/' + sample_uuid + '/pedigree',
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': localStorage.getItem('hub-iobio-tkn')
      }
    });
  }


  promiseGetFileMapForSample(sample, relationship) {
    let self = this;
    return new Promise((resolve,reject) => {
      var promises = [];
      var fileMap = {};
      var currentSample = sample;
      self.promiseGetFilesForSample(currentSample.uuid)
      .then(files => {
        files.forEach(file => {
          var p = self.promiseGetSignedUrlForFile(file)
          .then(signed => {
            fileMap[file.type] = signed.url;
          })
          promises.push(p);
        })
        Promise.all(promises)
        .then(response => {
          resolve({'sample': sample, 'relationship': relationship, 'fileMap': fileMap});
        })
        .catch(error => {
          reject(error);
        })
      })
    })
  }



  promiseGetFilesForSample(sample_uuid) {
    let self = this;
    return new Promise((resolve,reject) => {
      self.getFilesForSample(sample_uuid)
      .done(response => {
        resolve(response.data);
      })
      .fail(error => {
        console.log("Unable to get files for sample " + sample_uuid)
        reject(error);
      })
    })
  }


  getFilesForSample(sample_uuid) {
    let self = this;
    return $.ajax({
      url: self.api + '/samples/' + sample_uuid + '/files',
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': localStorage.getItem('hub-iobio-tkn')
      }
    });
  }

  promiseGetSignedUrlForFile(file) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.getSignedUrlForFile(file)
      .done(file => {
        resolve(file);
      })
      .fail(error => {
        reject(error);
      })
    })
  }

  getSignedUrlForFile (file) {
    let self = this;
    return $.ajax({
      url: self.api + '/files/' + file.uuid + '/url',
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': localStorage.getItem('hub-iobio-tkn')
      }
    });
  }











}