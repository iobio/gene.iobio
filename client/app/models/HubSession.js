
export default class HubSession {
  constructor() {
    this.vcf = null;
    this.samples = null;
    this.url = null;
    this.apiVersion =  '/apiv1';
    this.client_application_id = null;
  }

  promiseInit(sampleId, source, isPedigree, projectId ) {
    let self = this;
    self.api = source + self.apiVersion;

    return new Promise((resolve, reject) => {
      let modelInfos = [];

      self.promiseGetClientApplication()
      .then(function() {
        self.promiseGetSampleInfo(projectId, sampleId, isPedigree).then(data => {


          let promises = [];

          let pedigree    = data.pedigree;
          let rawPedigree = data.rawPedigree;

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
                        'tbi':            theSample.files.tbi == null || theSample.files.tbi.indexOf(theSample.files.vcf) == 0 ? null : theSample.files.tbi,
                        'txt':            theSample.files.txt
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
              // Don't want to expose db info here?
              //console.log(pedigree);

              resolve({'modelInfos': modelInfos, 'rawPedigree': rawPedigree});
            })
            .catch(error => {
              reject(error);
            })
          })




        })
      })

    })

  }

  promiseGetClientApplication() {
    let self = this;
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: self.api + '/client-applications',
        type: 'GET',
        contentType: 'application/json',
        headers: {
          Authorization: localStorage.getItem('hub-iobio-tkn'),
        },
      })
      .done(clientApps => {
        console.log(clientApps)
        let matchingApp = clientApps.filter(function(clientApp) {
          return clientApp.uid == 'gene';
        })
        if (matchingApp.length > 0) {
          console.log("client_appplication_id = " + matchingApp[0].id)
          self.client_application_id = matchingApp[0].id;
          resolve();
        } else {
          reject("Cannot find Mosaic client_application for gene")
        }

      })
      .fail(error => {
        console.log("Error getting applications ");
        console.log(error);
        reject(error);
      })

    })
  }


  promiseGetProject(project_id) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.getProject(project_id)
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
        if (pedigree) {
          resolve({pedigree: pedigree, rawPedigree: rawPedigreeOrig});
        } else {
          reject("Error parsing pedigree");
        }
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
      probandIndex = raw_pedigree.findIndex(d => ( d.pedigree.affection_status == 2 && d.pedigree.maternal_id && d.pedigree.paternal_id ) );
    }
    // If the sample selected doesn't have a mother and father (isn't a proband), find
    // the proband by looking for a child with mother and father filled in and unknown affected status
    if (probandIndex == -1) {
      probandIndex = raw_pedigree.findIndex(d => ( d.pedigree.affection_status == 0 && d.pedigree.maternal_id && d.pedigree.paternal_id ) );
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
      alertify.alert("Error", "Could not load the trio.  Unable to identify a proband (offspring) from this pedigree.")
      return null;
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
            if (file.type == 'txt') {
              var files = fileMap[file.type];
              if (files == null) {
                files = [];
                fileMap[file.type] = files;
              }
              files.push({'url': signed.url, 'name': file.nickname});

            } else {
              fileMap[file.type] = signed.url
              if (file.type == 'vcf') {
                sample.vcf_sample_name = file.vcf_sample_name;
              }
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

  promiseGetAnalysis(projectId, analysisId) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.getAnalysis(projectId, analysisId)
      .done(response => {
        resolve(response)
      })
      .fail(error => {
        reject("Error getting analysis " + analysisId + ": " + error);
      })
    })

  }
  promiseAddAnalysis(projectId, analysis) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.addAnalysis(projectId, analysis)
      .done(response => {
        resolve(response)
      })
      .fail(error => {
        reject("Error adding analysis for project " + projectId + ": " + error);
      })
    })

  }

  promiseUpdateAnalysis(analysis) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.updateAnalysis(analysis.project_id, analysis.id, analysis)
      .done(response => {
        resolve(response)
      })
      .fail(error => {
        reject("Error updating analysis " + analysis.id  + ": " + error);
      })
    })

  }

  promiseUpdateAnalysisTitle(analysis) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.updateAnalysisTitle(analysis.project_id, analysis.id, analysis)
      .done(response => {
        resolve(response)
      })
      .fail(error => {
        reject("Error updating analysis title " + analysis.id + ": " + error);
      })
    })

  }

  getAnalysis(projectId, analysisId) {
    let self = this;
    return $.ajax({
      url: self.api + '/projects/' + projectId  + '/analyses/' + analysisId,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        Authorization: localStorage.getItem('hub-iobio-tkn'),
      },
    })
  }




  addAnalysis(projectId, newAnalysisData) {
    let self = this;
    return $.ajax({
      url: self.api + '/projects/' + projectId + '/analyses/?client_application_id=' + this.client_application_id,
      type: 'POST',
      data: JSON.stringify(newAnalysisData),
      contentType: 'application/json',
      headers: {
        Authorization: localStorage.getItem('hub-iobio-tkn'),
      },
    });
  }

  updateAnalysisTitle(projectId, analysisId, newAnalysisData) {
    let self = this;
    return $.ajax({
      url: self.api + '/projects/' + projectId + '/analyses/' + analysisId,
      type: 'PUT',
      data: JSON.stringify(newAnalysisData),
      contentType: 'application/json',
      headers: {
        Authorization: localStorage.getItem('hub-iobio-tkn'),
      },
    });
  }


  updateAnalysis(projectId, analysisId, newAnalysisData) {
    let self = this;
    return $.ajax({
      url: self.api + '/projects/' + projectId + '/analyses/' + analysisId
            + '?client_application_id=' + this.client_application_id,
      type: 'PUT',
      data: JSON.stringify(newAnalysisData),
      contentType: 'application/json',
      headers: {
        Authorization: localStorage.getItem('hub-iobio-tkn'),
      },
    });
  }

}