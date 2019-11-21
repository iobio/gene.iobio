
export default class HubSession {
  constructor() {
    this.vcf = null;
    this.samples = null;
    this.url = null;
    this.apiVersion =  '/apiv1';
    this.client_application_id = null;
    this.variantSetTxtCols = [
      "chrom",
      "start",
      "end",
      "ref",
      "alt",
      "allelicBalance",
      "slivarFilter",
      "gene",
      "afgnomAD"
    ]
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


          let pedigree    = isPedigree ? data.pedigree : {'proband': data.proband};
          let rawPedigree = data.rawPedigree;

          // Let's get the proband info first
          let probandSample = isPedigree ? pedigree.proband : data.proband;
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
                    console.log(theSample)



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
                        'affectedStatus': isPedigree ? theSample.pedigree.affection_status == 2 ? 'affected' : 'unaffected' : 'affected',
                        'sex':            isPedigree ? theSample.pedigree.sex == 1 ? 'male' : (theSample.pedigree.sex == 2 ? 'female' : 'unknown') : 'unknown',
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

              let buf = "";
              modelInfos.forEach(function(modelInfo) {
                if (modelInfo.sample == null || modelInfo.sample == "") {
                  buf += "The sample " + modelInfo.name + "  (" + modelInfo.relationship + ")   is has an empty vcf_sample_name. Unable to properly filter variants for this sample.<br><br>";
                }
              })
              if (buf.length > 0) {
                alertify.alert("Error", buf)
              }

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

  hasVariantSets(modelInfos, rel='proband') {
    let proband = modelInfos.filter(function(mi) {
      return mi.relationship == rel;
    })
    if (proband && proband.length > 0) {
      let fileInfos = proband[0].txt;
      return fileInfos && fileInfos.length > 0
    } else {
      return false;
    }
  }

  promiseParseVariantSets(modelInfos, rel='proband') {
    let self = this;
    return new Promise(function(resolve,reject) {
      let proband = modelInfos.filter(function(mi) {
        return mi.relationship == rel;
      })
      let variantSets = {};
      if (proband && proband.length > 0) {
        var promises = [];
        let fileInfos = proband[0].txt;
        fileInfos.forEach(function(fileInfo) {
          let p = self.promiseParseVariantSetFile(fileInfo)
          .then(function(data) {
            variantSets[data.nickname] = data.records;
          })
          promises.push(p);
        })
        Promise.all(promises)
        .then(function() {
          resolve(variantSets)
        })
      } else {
        resolve(variantSets);
      }

    })
  }

  promiseParseVariantSetFile(fileInfo) {
    let self = this;
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: fileInfo.url
      })
      .done(data => {
        let variants = [];
        if (data && data.length > 0) {
          let records = data.split("\n");
          records.map(function(record) {
            let fields = record.split("\t");
            if (fields.length >= self.variantSetTxtCols.length) {
              let variant = {};
              self.variantSetTxtCols.forEach(function(col, i) {
                variant[col] = fields[i];
              })
              if (variant.gene == "" || variant.gene == null || variant.gene.trim().length == 0) {
                console.log("promiseParseVariantSets: missing gene field.  bypassing record " + record);
              } else {
                variant.isProxy = true;
                variant.variant_id = variant.gene + "^" + variant.start + "^" + variant.ref + "^" + variant.alt;
                if (variant.slivarFilter.indexOf("comphet") >= 0) {
                  variant.inheritance = "compound het"
                  variant.filtersPassed = "compoundHet"
                } else {
                  variant.inheritance = variant.slivarFilter;
                  variant.filtersPassed = variant.inheritance;
                }
                
                let matched = variants.filter(function(v) {
                  return v.variant_id == variant.variant_id;
                })
                if (matched.length == 0) {
                  variants.push(variant)                                              
                }
              }
            } else {
              console.log("promiseParseVariantSets: insufficient record fields.  bypassinging record " + record);
            }
          })
        }
        resolve({nickname: fileInfo.name, records: variants});
      })
      .fail(error => {
        console.log("Unable to get file " + file.url)
        reject(error);
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
      .done(data => {
        console.log(data)
        let clientApps = data.data;
        let matchingApp = clientApps.filter(function(clientApp) {
          return clientApp.display_name == 'Gene.iobio';
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
        files.filter(file => {
          return file.type 
        })
        .forEach(file => {

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
                if (file.vcf_sample_name == null || file.vcf_sample_name == "") {
                  alertify.error("Missing vcf_sample_name for file " + file.name, 20)
                } else {
                  sample.vcf_sample_name = file.vcf_sample_name;
                }
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
      data: self.stringifyAnalysis(newAnalysisData),
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
      data: self.stringifyAnalysis(newAnalysisData),
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
      data: self.stringifyAnalysis(newAnalysisData),
      contentType: 'application/json',
      headers: {
        Authorization: localStorage.getItem('hub-iobio-tkn'),
      },
    });
  }
  
  stringifyAnalysis(analysisData) {
    var cache = [];
    let analysisString = JSON.stringify(analysisData, function(key, value) {
      if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
              // Circular reference found, discard key
              return;
          }
          // Store value in our collection
          cache.push(value);
      }
      return value;
    });    
    cache = [];
    return analysisString;
  }


}