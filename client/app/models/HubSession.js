
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
        let pedigree = self.parsePedigree(data, sampleId);

        let promises = [];

        // Let's get the proband info first
        let probandSample = pedigree.proband;
        self.promiseGetFileMapForSample(probandSample, 'proband').then(data => {
          probandSample.files = data.fileMap;
        })
        .then( () => {
          for (var rel in pedigree) {
            if (rel != 'unparsed') {
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



                  // gene.iobio only supports siblings in same multi-sample vcf as proband.
                  // bypass siblings in their own vcf.
                  let bypass = false;
                  if (data.relationship == 'siblings' && theSample.files.vcf != probandSample.files.vcf) {
                    bypass = true;
                    console.log("Bypassing sibling " + theSample.id + ".  This sample must reside in the same vcf as the proband in order to be processed.")
                  }

                  if (!bypass) {
                    // TEMPORARY WORKAROUND - get rid of .exome from sample id
                    if (theSample.id.indexOf(".exome") > 0) {
                      theSample.id = theSample.id.substr(0,theSample.id.indexOf(".exome"));
                    }
                    var modelInfo = {
                      'relationship':   data.relationship == 'siblings' ? 'sibling' : data.relationship,
                      'affectedStatus': theSample.pedigree.affection_status == 2 ? 'affected' : 'unaffected',
                      'name':           theSample.id,
                      'sample':         theSample.id,
                      'vcf':            theSample.files.vcf,
                      'tbi':            theSample.files.tbi.indexOf(theSample.files.vcf) == 0 ? null : theSample.files.tbi,
                      'bam':            theSample.files.bam,
                      'bai':            theSample.files.bai.indexOf(theSample.files.bam) == 0 ? null : theSample.files.bai };
                    modelInfos.push(modelInfo);
                  }

                })
                promises.push(p);
              })
            }


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
    })




  }

  parsePedigree(raw_pedigree, sample_uuid) {
    // This assumes only 1 proband. If there are multiple affected samples then
    // the proband will be overwritten
    // This also assume no grandparents/grandchildren

    let pedigree = {}

    // Look for proband, which should have mother and father filled in and is the sample selected
    let probandIndex = raw_pedigree.findIndex(d => ( d.uuid == sample_uuid && d.pedigree.maternal_id && d.pedigree.paternal_id ) );
    // If the sample selected doesn't have a mother and father (isn't a proband), find
    // the proband by looking for a child with mother and father filled in and affected status
    if (probandIndex == -1) {
      probandIndex = raw_pedigree.findIndex(d => ( d.affection_status == 2 && d.pedigree.maternal_id && d.pedigree.paternal_id ) );
    }
    // If the sample selected doesn't have a mother and father (isn't a proband), find
    // the proband by looking for a child with mother and father filled in and unknown affected status
    if (probandIndex == -1) {
      probandIndex = raw_pedigree.findIndex(d => ( d.affection_status == 0 && d.pedigree.maternal_id && d.pedigree.paternal_id ) );
    }

    if (probandIndex != -1) {
      // Proband
      const proband  = raw_pedigree.splice(probandIndex, 1)[0];
      pedigree['proband'] = proband;

      // Get mother
      const motherIndex = raw_pedigree.findIndex(d => d.uuid == proband.pedigree.maternal_id)
      if (motherIndex != -1) {
        pedigree['mother'] = raw_pedigree.splice(motherIndex, 1)[0]
      }

      // Get mother
      const fatherIndex = raw_pedigree.findIndex(d => d.uuid == proband.pedigree.paternal_id)
      if (fatherIndex != -1) {
        pedigree['father'] = raw_pedigree.splice(fatherIndex, 1)[0]
      }

    } else {
      // If we can't find a full trio with a proband, mother, and father, just load the selected sample
      let idx = raw_pedigree.findIndex(d => ( d.pedigree.uuid == sample_uuid ) );
      let proband    = raw_pedigree.splice(idx, 1)[0];
      pedigree['proband'] = proband;
    }


    raw_pedigree.forEach(sample => {
      if (sample.pedigree.maternal_id != null || sample.pedigree.paternal_id != null
          && sample.pedigree.uuid != pedigree.proband.uuid) {
        pedigree['siblings'] = (pedigree['siblings'] || [] )
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