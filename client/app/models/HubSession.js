
export default class HubSession {
  constructor(clientApplicationId) {
    this.vcf = null;
    this.samples = null;
    this.url = null;
    this.isMother = false;
    this.isFather = false;
    this.apiVersion =  '/api/v1';
    this.apiDeprecated = null;
    this.apiVersionDeprecated = '/apiv1'
    this.client_application_id = clientApplicationId,
    this.variantSetTxtCols = [
      "chrom",
      "start",
      "end",
      "ref",
      "alt",
      "allelicBalance",
      "slivarFilter",
      "gene",
      "afgnomAD",
      "sampleId",
      "id"
    ]
    this.user = null;

    this.variantSetToFilterName = {
      'compoundhet': 'compoundHet'
    };
    this.globalApp = null;
    this.experiment_id = null;
  }

  init(source) {
    let self = this;
    self.api = source + self.apiVersion;
    self.apiDeprecated = source + self.apiVersionDeprecated
  }

  promiseInit(sampleId, source, isPedigree, projectId, geneSetId, variantSetId, build, experimentId ) {
    let self = this;
    self.api = source + self.apiVersion;
    self.apiDeprecated = source + self.apiVersionDeprecated
    self.experiment_id = experimentId;

    return new Promise((resolve, reject) => {
      let modelInfos = [];
      let geneSet = null;
      let variantSet = null;

      self.promiseGetCurrentUser()
      .then(function(data) {
        self.user = data;
      })
      .catch(function(error) {
        console.log(error)
        reject(error)
      })

      self.promiseGetClientApplication()
      .then(function() {
        if (geneSetId) {
          return self.promiseGetGeneSet(projectId, geneSetId)
        } else {
          return Promise.resolve(null);
        }
      })
      .then(function(data) {
        geneSet = data;

        if (variantSetId) {
          return self.promiseGetVariantSet(projectId, variantSetId, build)
        } else {
          return Promise.resolve(null);
        }

      })
      .then(function(data) {
        variantSet = data;

        self.promiseGetPedigreeForSample(projectId, sampleId, isPedigree).then(data => {


          let promises = [];

          let foundPedigree = data.foundPedigree;

          let pedigree    = foundPedigree ? data.pedigree : {'proband': data.proband};
          let rawPedigree = data.rawPedigree;

          // Let's get the proband info first
          let probandSample = foundPedigree ? pedigree.proband : data.proband;
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
                  let p =  new Promise(function(sampleResolve, sampleReset) {
                    self.promiseGetFileMapForSample(projectId, s, rel).then(data => {
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

                        let tbiUrl = null;
                        if (theSample.files.tbi) {
                          tbiUrl = theSample.files.tbi;
                        } else if (theSample.files.csi) {
                          tbiUrl = theSample.files.csi;
                        } else {
                          tbiUrl = null;
                        }
                        self.promiseGetSampleHPOTerms(projectId, theSample.id)
                        .then(function(hpoTerms) {
                          var modelInfo = {
                            'relationship':   data.relationship == 'siblings' ? 'sibling' : data.relationship,
                            'affectedStatus': foundPedigree ? theSample.pedigree.affection_status == 2 ? 'affected' : 'unaffected' : 'affected',
                            'sex':            foundPedigree ? theSample.pedigree.sex == 1 ? 'male' : (theSample.pedigree.sex == 2 ? 'female' : 'unknown') : 'unknown',
                            'name':           theSample.name,
                            'sample':         theSample.files.vcf ? theSample.vcf_sample_name : theSample.name,
                            'vcf':            theSample.files.vcf,
                            'tbi':            tbiUrl,
                            'txt':            theSample.files.txt,
                            'hpoTerms':       hpoTerms
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
                          sampleResolve();

                        })
                        .catch(function(error) {
                          sampleReset(error)
                        })

                      }

                    })
                  })
                  promises.push(p);
                })
              }


            }
            Promise.all(promises).then(response => {

              let buf = "";
              modelInfos.forEach(function(modelInfo) {
                if (modelInfo.sample == null || modelInfo.sample == "") {
                  buf += "The sample " + modelInfo.name + "  (" + modelInfo.relationship + ")   has an empty vcf_sample_name. Unable to properly filter variants for this sample.<br><br>";
                }
              })
              if (buf.length > 0) {
                reject(buf)
              } else {
                resolve({'modelInfos': modelInfos,
                  'rawPedigree': rawPedigree,
                  'geneSet': geneSet,
                  'variantSet': variantSet,
                  'isMother': self.isMother,
                  'isFather': self.isFather,
                  'foundPedigree': foundPedigree});
              }

            })
            .catch(errorMsg => {
              reject(errorMsg);
            })
          })
          .catch(error => {
            reject(errorMsg)
          })
        })
      })

    })

  }

  getErrorMessage(error) {
    if (error.hasOwnProperty('responseJSON') && error.responseJSON.hasOwnProperty('message')) {
      return error.responseJSON.message;
    } else if (error.hasOwnProperty('responseText')) {
      return error.responseText;
    } else {
      return error.toString()
    }

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

  promiseGetClientApplication() {
    let self = this;

    return new Promise(function(resolve, reject) {
      if(self.client_application_id){
      resolve();
    }
      else{
        reject("Cannot find Mosaic client_application for gene");
      }})
  }


  promiseGetProject(project_id) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.getProject(project_id)
      .done(data => {
          resolve(data);
      })
      .fail(error => {
        let errorMsg = self.getErrorMessage(error);
        reject("Error getting project " + project_id + ": " + errorMsg);
      });
    });
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
        let errorMsg = self.getErrorMessage(error);
        reject("Error getting sample " + sample_id + ": " + errorMsg);
      })
    })
  }

  promiseGetPedigreeForSample(project_id, sample_id, isPedigree) {
    let self = this;

    return new Promise(function(resolve, reject) {
      if (isPedigree) {
        // If the user click 'Pedigree' from the Mosaic launch dialog,
        // get the pedigree for this sample. We will launch gene.iobio
        // for the proband of this pedigree, regardless of which sample
        // was selected. For example, the father could be selected, and
        // the pedigree will be located for the father, and we will launch
        // gene.iobio for the proband of that pedigree.
        self.getPedigreeForSample(project_id, sample_id)
        .done(rawPedigree => {
          const rawPedigreeOrig = $.extend({}, rawPedigree);
          let pedigree = self.parsePedigree(rawPedigree, sample_id)
          if (pedigree) {
            resolve({foundPedigree: true, pedigree: pedigree, rawPedigree: rawPedigreeOrig});
          }
          else {
            self.promiseGetSample(project_id, sample_id, 'proband')
            .then(function(data) {
              data.foundPedigree = false;
              resolve(data);
            })
          }
        })
        .fail(error => {
          let errorMsg = self.getErrorMessage(error);
          reject("Error getting pedigree for sample " + sample_id + ": " + errorMsg);
        })

      } else {
        // If the user clicked 'Individual' from the Mosaic launch dialog, we
        // will treat the selected sample as the proband.
        self.promiseGetSample(project_id, sample_id, 'proband')
        .then(function(data) {
          data.foundPedigree = false;
          resolve(data);
        })

      }
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
      probandIndex = raw_pedigree.findIndex(d => ( d.pedigree.affection_status == 2 && (d.pedigree.maternal_id || d.pedigree.paternal_id )) );
    }
    // If the sample selected doesn't have a mother and father (isn't a proband), find
    // the proband by looking for a child with mother and father filled in and unknown affected status
    if (probandIndex == -1) {
      probandIndex = raw_pedigree.findIndex(d => ( d.pedigree.affection_status == 0 && (d.pedigree.maternal_id || d.pedigree.paternal_id ) ));
    }

    if (probandIndex == -1) {
      // Assume proband if there is only one sample in the pedigree
      if (raw_pedigree.length == 1) {
        probandIndex = 0;
      } else {
        // Assume proband is the sample selected
        probandIndex = raw_pedigree.findIndex(d => (d.id == sample_id));
      }
    }


    if (probandIndex != -1) {
      // Proband
      const proband  = raw_pedigree.splice(probandIndex, 1)[0];
      pedigree['proband'] = proband;

      // Get mother
      const motherIndex = raw_pedigree.findIndex(d => d.id == proband.pedigree.maternal_id)
      if (motherIndex != -1) {
        pedigree['mother'] = raw_pedigree.splice(motherIndex, 1)[0]
        this.isMother = true;
      }

      // Get mother
      const fatherIndex = raw_pedigree.findIndex(d => d.id == proband.pedigree.paternal_id)
      if (fatherIndex != -1) {
        pedigree['father'] = raw_pedigree.splice(fatherIndex, 1)[0]
        this.isFather = true;
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


    } else {
      return null;
    }

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
          if(self.experiment_id){
            return file.experiment_ids.includes(Number(self.experiment_id))
          }
          else {
            return file
          }
        }).filter(file => {
          return file.type
        })
        .forEach(file => {

          var p = self.promiseGetSignedUrlForFile(project_id, currentSample.id, file)
          .then(signed => {
            if (file.type == 'txt' || file.type == 'tsv') {
              var files = fileMap.txt;
              if (files == null) {
                files = [];
                fileMap.txt = files;
              }
              files.push({'url': signed.url, 'name': file.nickname});

            } else {
              fileMap[file.type] = signed.url
              if (file.type == 'vcf') {
                if (file.vcf_sample_name == null || file.vcf_sample_name == "") {
                  reject("Missing vcf_sample_name for file " + file.name)
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
        .catch(errorMsg => {
          reject(errorMsg);
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
        let errorMsg = self.getErrorMessage(error);
        console.log("Unable to get files for sample " + sample_id + " error: " + errorMsg)
        reject(errorMsg);
      })
    })
  }


  getFilesForSample(project_id, sample_id) {
    let self = this;
    return $.ajax({
      url: self.api + '/projects/' + project_id +  '/samples/' + sample_id + '/files',
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
                let errorMsg = self.getErrorMessage(error);
                console.log("Unable to get files for project " + project_id + " error: " + errorMsg);
                reject(errorMsg);
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
        let errorMsg = self.getErrorMessage(error);
        let msg = "Could not get signed url for file_id  " + file.id + " error: " + errorMsg;
        console.log(msg)
        reject(msg);
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

  promiseGetGeneSet(projectId, geneSetId) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.getGeneSet(projectId, geneSetId)
      .done(response => {
        resolve(response)
      })
      .fail(error => {
        let errorMsg = self.getErrorMessage(error);
        console.log("Error getting gene set from Mosaic with gene_set_id " + geneSetId);
        console.log(errorMsg)
        reject("Error getting gene set " + geneSetId + ": " + errorMsg);
      })
    })

  }


  promiseGetVariantSet(projectId, variantSetId, build) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.getVariantSet(projectId, variantSetId, build)
      .done(response => {
        let data = response;

        // The Mosaic variant should have a field gene_name@default.
        let geneNameField = 'gene_name@default';
        // The gene symbol, impact, consequence, and allele frequency values are
        // in a different fields depending on the genome build.
        let geneSymbolField = null
        let impactField = null
        let consequenceField = null
        let afField = null
        if (build === "GRCh38"){
          geneSymbolField  = 'gene_symbol_GRCh38@default';
          impactField      = 'gene_impact_GRCh38@default';
          consequenceField = 'gene_consequence_GRCh38@default';
          afField          = 'gnomad_allele_frequency_GRCh38@default';
        }
        else if (build === "GRCh37"){
          geneSymbolField = 'gene_symbol_GRCh37@default';
          impactField      = 'gene_impact_GRCh37@default';
          consequenceField = 'gene_consequence_GRCh37@default';
          afField          = 'gnomad_allele_frequency_GRCh37@default';
        }
        data.variants.forEach(function(variant) {
          if (variant[geneNameField] && variant[geneNameField].length > 0) {
            variant['gene_symbol'] = variant[geneNameField][0];
          } else if (geneSymbolField &&  variant[geneSymbolField] && variant[geneSymbolField].length > 0 && !variant.hasOwnProperty('gene_symbol')) {
            variant['gene_symbol'] = variant[geneSymbolField][0];
          }
          if (impactField && variant[impactField] && variant[impactField].length > 0) {
            variant['gene_impact'] = variant[impactField][0];
          }
          if (consequenceField && variant[consequenceField] && variant[consequenceField].length > 0) {
            variant['gene_consequence'] = variant[consequenceField][0];
          }
          if (afField && variant.hasOwnProperty(afField) && variant[afField].length > 0) {
            variant['gnomad_allele_frequency'] = variant[afField][0];
          }
          variant['mosaic_id'] = variant.id
        })

        resolve(data)
      })
      .fail(error => {
        let errorMsg = self.getErrorMessage(error);
        console.log("Error getting variant set " + variantSetId + " from Mosaic. This project may not be up to date with the latest variant annotations.");
        console.log();
        reject("Error getting variant set " + variantSetId + ": " + errorMsg);
      })
    })

  }

  promiseGetVariant(projectId, variant_id, includeAnnotationData=true) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.getVariant(projectId, variant_id, includeAnnotationData)
      .done(response => {
        resolve(response)
      })
      .fail(error => {
        let errorMsg = self.getErrorMessage(error);
        reject("Error getting mosaic variant : " + errorMsg + "." )
      })
    })
  }

  promiseLookupVariantByPosition(projectId, variant) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let chr = self.globalApp.utility.stripRefName(variant.chrom)
      self.promiseGetVariantsByPosition(projectId, chr, variant.start, true)
      .then(function(variants) {
        let matching = variants.filter(function(v) {
          if (v.chr == chr &&
              v.r_start == variant.start &&
              v.alt == variant.alt &&
              v.ref == variant.ref) {
            return true;
          } else {
            return false;
          }
        })
        if (matching.length > 0) {
          resolve(matching[0])
        } else {
          reject("Cannot find matching Mosaic variant " + variant.chrom + " " + variant.start )
        }
      })
      .catch(function(error) {
        reject(self.getErrorMessage(error))
      })
    })
  }

  promiseGetVariantsByPosition(projectId, chr, start, includeAnnotationData) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.getVariantsByPosition(projectId, chr, start, includeAnnotationData)
      .done(response => {
        resolve(response)
      })
      .fail(error => {
        let errorMsg = self.getErrorMessage(error);
        reject("Error getting mosaic variants by position: " + errorMsg + "." )
      })
    })

  }

  promiseGetAnalysis(projectId, analysisId) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.getAnalysis(projectId, analysisId)
      .done(response => {
        resolve(response)
      })
      .fail(error => {
        let errorMsg = self.getErrorMessage(error);
        reject("Error getting analysis: " + errorMsg + "." )
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
        let errorMsg = self.getErrorMessage(error);
        reject("Error adding analysis: " + errorMsg + "." )
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
        let errorMsg = self.getErrorMessage(error);
        reject("Error saving analysis: " + errorMsg + "." )
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
        let errorMsg = self.getErrorMessage(error);
        reject("Error updating analysis title " + analysis.id + ": " + errorMsg);
      })
    })

  }


  promiseGetVariantAnnotations(project_id) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.getVariantAnnotations(project_id)
      .done(annotations => {
        // Prepend @default to each field name. Mosaic now uses this convention to
        // distguish between annotation versions. Example: the value of
        // hgvsc_42b345dd is in the field hgvsc_42b345dd@default.
        annotations.forEach(function(annotation) {
          annotation.fieldName = annotation.uid + '@default'
        })

        resolve(annotations)
      })
      .fail(error => {
        let errorMsg = self.getErrorMessage(error);
        console.log("Error getting variant annotations for project " + project_id)
        console.log(errorMsg)
        reject(errorMsg);
      })
    })

  }



  promiseCreateInterpretationAnnotation(project_id) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.createInterpretationAnnotation(project_id)
      .done(response => {
        resolve(response)
      })
      .fail(error => {
        let errorMsg = self.getErrorMessage(error);
        console.log("Error creating variant annotation " + annotationName + " for project " + project_id)
        console.log(errorMsg)
        reject(errorMsg);
      })
    })
  }



  promiseAddVariantAnnotationValue(project_id, variant_id, annotation_id, annotation_value, annotation_version_id='default') {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.addVariantAnnotationValue(project_id, variant_id, annotation_id, annotation_value, annotation_version_id)
      .done(response => {
        resolve(response)
      })
      .fail(error => {
        let errorMsg = self.getErrorMessage(error);
        console.log("Error adding variant annotation value.");
        console.log("variant id=" + variant_id + ", annotation_id=" + annotation.id  + ", project_id=" + project_id + ', annotation_value=' + annotation_value);
        console.log(errorMsg)
        reject(errorMsg);
      })
    })
  }


  promiseDeleteVariantAnnotationValue(project_id, variant_id, annotation_id, annotation_version_id='default') {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.deleteVariantAnnotationValue(project_id, variant_id, annotation_id, annotation_version_id)
      .done(response => {
        resolve(response)
      })
      .fail(error => {
        let errorMsg = self.getErrorMessage(error);
        console.log("Error deleting annotation value.");
        console.log("variant id=" + variant_id + ", annotation_id=" + annotation.id  + ", project_id=" + project_id);
        console.log(errorMsg)
        reject(errorMsg);
      })
    })
  }

  promiseGetSampleHPOTerms(project_id, sample_id) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.getSampleHPOTerms(project_id, sample_id)
      .done(response => {
        resolve(response)
      })
      .fail(error => {
        let errorMsg = self.getErrorMessage(error);
        console.log("Error getting sample HPO terms for project " + project_id + " and sample " + sample_id)
        console.log(errorMsg)
        reject(errorMsg);
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

  promiseGetCurrentUser() {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.getCurrentUser()
        .done(response => {
          resolve(response)
        })
        .fail(error => {
          let errorMsg = error.responseText ? error.responseText : "";
          let msg = "Error getting current Mosaic user.  Your authorization may have expired.  Make sure you are still logged into Mosaic, and relaunch the project."
          reject(msg);
        })
    })
  }

  getCurrentUser() {
    let self = this;

    return $.ajax({
      url: self.api + '/user',
      type: 'GET',
      contentType: 'application/json',
      headers: {
        Authorization: localStorage.getItem('hub-iobio-tkn'),
      },
    });

  }



  getVariant(project_id, variant_id, includeAnnotationData) {
    let self = this;

    return $.ajax({
          url: self.api + '/projects/' + project_id + '/variants/'+ variant_id + "?include_annotation_data=" + (includeAnnotationData ? 'true' : 'false'),
      type: 'GET',
      contentType: 'application/json',
      headers: {
        Authorization: localStorage.getItem('hub-iobio-tkn'),
      },
    });

  }

  getVariantsByPosition(project_id, chr, start, includeAnnotationData) {
    let self = this;

    return $.ajax({
      url: self.api + '/projects/' + project_id + '/variants/position/' + chr + ":" + start + "?include_annotation_data=" + (includeAnnotationData ? 'true' : 'false'),
      type: 'GET',
      contentType: 'application/json',
      headers: {
        Authorization: localStorage.getItem('hub-iobio-tkn'),
      },
    });

  }



  getVariantAnnotations(project_id) {
    let self = this;

    return $.ajax({
      url: self.api + '/projects/' + project_id + '/variants/annotations',
      type: 'GET',
      contentType: 'application/json',
      headers: {
        Authorization: localStorage.getItem('hub-iobio-tkn'),
      },
    });

  }

  createInterpretationAnnotation(project_id) {
    let self = this;
    let annotationObj = {"name": 'Interpretation',
     "value_type": "string",
     "display_type": "badge",
     "privacy_level": "private",
     "severity": {"Significant": 1, "Uncertain significance": 2, "Not significant": 3, "Not reviewed": 4}};
    return $.ajax({
      url: self.api + '/projects/' + project_id + '/variants/annotations',
      type: 'POST',
      data: JSON.stringify(annotationObj),
      contentType: 'application/json',
      headers: {
        Authorization: localStorage.getItem('hub-iobio-tkn'),
      },
    });
  }


  addVariantAnnotationValue(project_id, variant_id, annotation_id, annotation_value, annotation_version_id) {
    let self = this;
    let annotationValObj = {"value": annotation_value};
    return $.ajax({
      url: self.api + '/projects/' + project_id + '/variants/' + variant_id + '/annotations/' + annotation_id + '/versions/' + annotation_version_id,
      type: 'POST',
      data: JSON.stringify(annotationValObj),
      contentType: 'application/json',
      headers: {
        Authorization: localStorage.getItem('hub-iobio-tkn'),
      },
    });
  }

  deleteVariantAnnotationValue(project_id, variant_id, annotation_id, annotation_version_id) {
    let self = this;
    return $.ajax({
      url: self.api + '/projects/' + project_id + '/variants/' + variant_id + '/annotations/' + annotation_id + '/versions/' + annotation_version_id,
      type: 'DELETE',
      contentType: 'application/json',
      headers: {
        Authorization: localStorage.getItem('hub-iobio-tkn'),
      },
    });
  }



  getGeneSet(projectId, geneSetId) {
    let self = this;

    return $.ajax({
      url: self.api + '/projects/' + projectId + '/genes/sets/' + geneSetId,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        Authorization: localStorage.getItem('hub-iobio-tkn'),
      },
    });
  }


  getVariantSet(projectId, variantSetId, build) {
    let self = this;
    return $.ajax({
      url: self.api + '/projects/' + projectId + '/variants/sets/' + variantSetId + "?include_variant_data=true&include_genotype_data=true",
      data: {
      },
      type: 'GET',
      contentType: 'application/json',
      headers: {
        Authorization: localStorage.getItem('hub-iobio-tkn'),
      },
    });
  }



  getSampleHPOTerms(project_id, sample_id) {
    let self = this;

    return $.ajax({
          url: self.api + '/projects/' + project_id + '/samples/'+ sample_id + "/hpo-terms",
      type: 'GET',
      contentType: 'application/json',
      headers: {
        Authorization: localStorage.getItem('hub-iobio-tkn'),
      },
    });
  }

  stringifyAnalysis(analysisData) {
    let self = this;
    var cache = [];

    let analysisDataCopy = $.extend({}, analysisData)

    // First get rid of full gene and transcript objects from variants
    // These are too big to stringify and store
    if (analysisDataCopy.payload.hasOwnProperty('variants')) {
      analysisDataCopy.payload.variants.forEach(function(variant) {
        if (variant.gene && self.globalApp.utility.isObject(variant.gene)) {
          variant.gene = variant.gene.gene_name;
        }
        if (variant.transcript && self.globalApp.utility.isObject(variant.transcript)) {
          variant.transcriptId = variant.transcript.transcript_id;
          variant.transcript = null;
        }
        if (variant.variantInspect && variant.variantInspect.geneObject) {
          variant.variantInspect.geneName = variant.variantInspect.geneObject.gene_name
          variant.variantInspect.geneObject = null;
        }
        if (variant.variantInspect && variant.variantInspect.transcriptObject) {
          variant.variantInspect.transcriptId = variant.variantInspect.transcriptObject.transcript_id
          variant.variantInspect.transcriptObject = null;
        }
      })
    }


    let analysisString = JSON.stringify(analysisDataCopy, function(key, value) {
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
