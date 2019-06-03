
export default class HubSession {
  constructor() {
    this.vcf = null;
    this.samples = null;
    this.url = null;
    this.apiVersion =  '/apiv1';
  }

  promiseInit(sampleId, source, isPedigree, projectId ) {
    let self = this;
    self.api = source + self.apiVersion;

    return new Promise((resolve, reject) => {
      let modelInfos = [];


      self.promiseGetSampleInfo(projectId, sampleId, isPedigree)
      .then( data => {

        let pedigree = data.pedigree;
        let rawPedigree = data.rawPedigree;

        let promises = [];

        // Let's get the proband info first
        let probandSample = pedigree.proband;
        self.promiseGetFileMapForSample(projectId, probandSample, 'proband').then(data => {
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
                let p =  self.promiseGetFileMapForSample(projectId, s, rel).then(data => {
                  let theSample = data.sample;
                  theSample.files = data.fileMap;



                  // gene.iobio only supports siblings in same multi-sample vcf as proband.
                  // bypass siblings in their own vcf.
                  let bypass = false;
                  // TODO:  Need to check if samples exist in proband vcf rather than checking file names
                  // since mosaic generates different vcf url for sample physical file.
                  //if (data.relationship == 'siblings' && theSample.files.vcf != probandSample.files.vcf) {
                  //  bypass = true;
                  //  console.log("Bypassing sibling " + theSample.id + ".  This sample must reside in the same vcf as the proband in order to be processed.")
                  //}

                  if (!bypass) {



                    var modelInfo = {
                      'relationship':   data.relationship == 'siblings' ? 'sibling' : data.relationship,
                      'affectedStatus': theSample.pedigree.affection_status == 2 ? 'affected' : 'unaffected',
                      'name':           theSample.name,
                      'sample':         theSample.files.vcf ? theSample.vcf_sample_name : theSample.name,
                      'vcf':            theSample.files.vcf,
                      'tbi':            theSample.files.tbi == null || theSample.files.tbi.indexOf(theSample.files.vcf) == 0 ? null : theSample.files.tbi
                    }

                    if (theSample.files.bam != null) {
                      modelInfo.bam = theSample.files.bam;
                      if (theSample.files.bai) {
                        modelInfo.bai = theSample.files.bai;
                      }

                    } else if (theSample.files.cram != null) {
                      modelInfo.bam = theSample.files.cram;
                      if (theSample.files.crai) {
                        modelInfo.bai = theSample.files.crai;
                      }
                    }

                    modelInfos.push(modelInfo);
                  }

                })
                promises.push(p);
              })
            }


          }
          Promise.all(promises).then(response => {
            console.log(pedigree);

            resolve({'modelInfos': modelInfos, 'rawPedigree': rawPedigree});
          })
          .catch(error => {
            reject(error);
          })
        })




      })
    })




  }

  promiseGetProject(project_id) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.getProject(idProject)
      .done(data => {
          resolve(data);
      })
      .fail(error => {
        reject("Error getting project " + project_id + ": " + error);
      });
    });
  }

  promiseGetSampleInfo(project_id, sample_id, isPedigree) {
    let self = this;
    if (isPedigree) {
      return self.promiseGetPedigreeForSample(project_id, sample_id);
    } else {
      return self.promiseGetSample(project_id, sample_id, 'proband');
    }
  }

  promiseGetSample(project_id, sample_id, rel) {
    let self = this;

    return new Promise(function(resolve, reject) {
      // Get pedigree for sample
      self.getSample(project_id, sample_id)
      .done(data => {
        if (rel) {
          let sample = {};
          sample[rel] = data;
          resolve(sample);
        } else {
          resolve(data);
        }
      })
      .fail(error => {
        reject("Error getting sample " + sample_id + ": " + error);
      })
    })
  }

  promiseGetPedigreeForSample(project_id, sample_id) {
    let self = this;

    return new Promise(function(resolve, reject) {
      // Get pedigree for sample
      self.getPedigreeForSample(project_id, sample_id)
      .done(rawPedigree => {
        const rawPedigreeOrig = $.extend({}, rawPedigree);
        let pedigree = self.parsePedigree(rawPedigree, sample_id)
        resolve({pedigree: pedigree, rawPedigree: rawPedigreeOrig});
      })
      .fail(error => {
        reject("Error getting pedigree for sample " + sample_id + ": " + error);
      })
    })
  }

  parsePedigree(raw_pedigree, sample_id) {

    let self = this;

    // This assumes only 1 proband. If there are multiple affected samples then
    // the proband will be overwritten
    // This also assume no grandparents/grandchildren

    let pedigree = {}

    // Look for proband, which should have mother and father filled in and is the sample selected
    let probandIndex = raw_pedigree.findIndex(d => ( d.id == sample_id && d.pedigree.maternal_id && d.pedigree.paternal_id ) );
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
      const motherIndex = raw_pedigree.findIndex(d => d.id == proband.pedigree.maternal_id)
      if (motherIndex != -1) {
        pedigree['mother'] = raw_pedigree.splice(motherIndex, 1)[0]
      }

      // Get mother
      const fatherIndex = raw_pedigree.findIndex(d => d.id == proband.pedigree.paternal_id)
      if (fatherIndex != -1) {
        pedigree['father'] = raw_pedigree.splice(fatherIndex, 1)[0]
      }
    } else {
      console.log("Cannot find proband for pedigree of sample " + sample_id);
      console.log("raw pedigree");
      console.log(raw_pedigree);
    }

    raw_pedigree.forEach(sample => {
      if (sample.pedigree.maternal_id != null || sample.pedigree.paternal_id != null
          && sample.pedigree.id != pedigree.proband.id) {
        pedigree['siblings'] = (pedigree['siblings'] || [] )
        pedigree['siblings'].push(sample);
      } else {
        pedigree['unparsed'] = (pedigree['siblings'] || []).push(sample)
      }
    })


    return pedigree;
  }

  getPedigreeForSample(project_id, sample_id) {
    let self = this;
    return $.ajax({
      url: self.api + '/projects/' + project_id +  '/samples/' + sample_id + '/pedigree',
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': localStorage.getItem('hub-iobio-tkn')
      }
    });
  }


  getSample(project_id, sample_id) {
    let self = this;
    return $.ajax({
      url: self.api + '/projects/' + project_id + '/samples/' + sample_id,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': localStorage.getItem('hub-iobio-tkn')
      }
    });
  }


  promiseGetFileMapForSample(project_id, sample, relationship) {
    let self = this;
    return new Promise((resolve,reject) => {
      var promises = [];
      var fileMap = {};
      var currentSample = sample;
      self.promiseGetFilesForSample(project_id, currentSample.id)
      .then(files => {
        files.forEach(file => {
          var p = self.promiseGetSignedUrlForFile(project_id, currentSample.id, file)
          .then(signed => {
            fileMap[file.type] = signed.url;
            if (file.type == 'vcf') {
              sample.vcf_sample_name = file.vcf_sample_name;
            }
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



  promiseGetFilesForSample(project_id, sample_id) {
    let self = this;
    return new Promise((resolve,reject) => {
      self.getFilesForSample(project_id, sample_id)
      .done(response => {
        resolve(response.data);
      })
      .fail(error => {
        console.log("Unable to get files for sample " + sample_id)
        reject(error);
      })
    })
  }


  getFilesForSample(project_id, sample_id) {
    let self = this;
    return $.ajax({
      url: self.api +  '/samples/' + sample_id + '/files',
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': localStorage.getItem('hub-iobio-tkn')
      }
    });
  }

  promiseGetFilesForProject(project_id) {
      let self = this;
      return new Promise((resolve,reject) => {
          self.getFilesForProject(project_id)
              .done(response => {
                  resolve(response);
              })
              .fail(error => {
                  console.log("Unable to get files for project " + project_id);
                  reject(error);
              })
      })
  }


  getFilesForProject(project_id) {
      let self = this;
      return $.ajax({
          url: self.api +  '/projects/' + project_id + '/files',
          type: 'GET',
          contentType: 'application/json',
          headers: {
              'Authorization': localStorage.getItem('hub-iobio-tkn')
          }
      });
  }

  promiseGetSignedUrlForFile(project_id, sample_id, file) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.getSignedUrlForFile(project_id, sample_id, file)
      .done(file => {
        resolve(file);
      })
      .fail(error => {
        reject(error);
      })
    })
  }

  getSignedUrlForFile (project_id, sample_id, file) {
    let self = this;
    return $.ajax({
      url: self.api +  '/projects/' + project_id + '/files/' + file.id + '/url',
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': localStorage.getItem('hub-iobio-tkn')
      }
    });
  }

  getProject(projectId) {
    let self = this;
    return $.ajax({
        url: self.api + '/projects/' + projectId,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': localStorage.getItem('hub-iobio-tkn')
        }
    });
  }


}