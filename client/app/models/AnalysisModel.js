import CacheHelper      from './CacheHelper.js'
class AnalysisModel {

  constructor(globalApp, geneModel, cohortModel, cacheHelper, 
    genomeBuildHelper, filterModel) {

    this.globalApp = globalApp;
    this.geneModel = geneModel;
    this.cohortModel = cohortModel;
    this.cacheHelper = cacheHelper;
    this.genomeBuildHelper = genomeBuildHelper;
    this.filterModel = filterModel;
    this.hubSession;
    this.analysis = null

    this.dispatch = d3.dispatch("showInProgress", "hideInProgress", 
                                "phenolyzerTopGenesSet", "appAlertsSet",
                                "specifyFilesForAnalysis");
    d3.rebind(this, this.dispatch, "on");
  }

  setHubSession(hubSession) {
    this.hubSession = hubSession;
  }


  promiseGetAnalysis(idAnalysis, idProject, idSample, isPedigree) {
    let self = this;
    return new Promise(function(resolve, reject) {

      if (idAnalysis && +idAnalysis > 0) {

        self.hubSession.promiseGetAnalysis(idProject, idAnalysis)
        .then(function(analysis) {
          if (analysis) {
            self.analysis = analysis;

            // Workaround - remove null variants
            if (self.analysis.payload.hasOwnProperty('variants')) {
              self.analysis.payload.variants = self.analysis.payload.variants.filter(function(v) {
                return v != null;
              })
            }
            resolve(self.analysis);
          } else {
            reject("Unable to find/create an analysis " + idAnalysis);
          }
        })
        .catch(function(error) {
          self.onShowSnackbar( {message: error, timeout: 15000});
          reject(error);
        })

      } else {
        var newAnalysis = {};
        newAnalysis.title = "";
        newAnalysis.description = "";
        newAnalysis.project_id = idProject;
        newAnalysis.sample_id  = idSample;
        newAnalysis.payload = {};
        newAnalysis.payload.project_id = idProject;
        newAnalysis.payload.sample_id = idSample;
        newAnalysis.payload.is_pedigree = isPedigree;
        newAnalysis.payload.datetime_created = self.globalApp.utility.getCurrentDateTime();
        newAnalysis.payload.genes = [];
        if (self.paramGeneName && self.paramGeneName !== '') {
          newAnalysis.payload.genes.push(self.paramGeneName)
        }
        newAnalysis.payload.variants = [];
        newAnalysis.payload.filters = self.filterModel.flagCriteria;
        self.analysis = newAnalysis;

        resolve(self.analysis)
      }

    });
  }


  promiseInitAnalysisAndCohort(data, modelInfos, projectId, isSfariProject) {
    let self = this;

    return new Promise(function(resolve, reject) {
      let isLaunchedFromMosaic = projectId && +projectId > 0 && modelInfos;

      if (data.hasOwnProperty('settings')) {
        if (data.settings.genomeBuild) {
          self.genomeBuildHelper.setCurrentBuild(data.settings.genomeBuild);
        }
        if (data.settings.geneSource) {
          self.geneModel.geneSource = data.settings.geneSource;
        }
        if (data.settings.coverageThresholds) {
          self.filterModel.geneCoverageMin    = data.settings.coverageThresholds.min;
          self.filterModel.geneCoverageMedian = data.settings.coverageThresholds.median;
          self.filterModel.geneCoverageMean   = data.settings.coverageThresholds.mean;
        }
        if (data.settings.analyzeCodingVariantsOnly) {
          self.cohortModel.analyzeCodingVariantsOnly = data.settings.analyzeCodingVariantsOnly;
        }
        if (data.settings.phenolyzerTopGenes) {
          self.dispatch.phenolyzerTopGenesSet(data.settings.phenolyzerTopGenes)
        }
      }

      if (data.hasOwnProperty('appAlerts')) {
        self.dispatch.appAlertsSet(data.appAlerts)
      }

      if (data.hasOwnProperty('filters') && data.filters && Object.keys(data.filters).length > 0) {
        self.filterModel.flagCriteria = data.filters;
      }


      let hasModelInfo = false;
      let specifyFilesMsg = null;
      if (data.modelInfos) {
        let info = self._prepareAnalysisModelInfos(data)
        hasModelInfo = info.hasModelInfo;
        specifyFilesMsg = info.specifyFilesMsg;
      }

      var getInitPromise = function() {
        if (modelInfos) {
          return self.cohortModel.promiseInit(modelInfos, projectId, isSfariProject)
        } else if (hasModelInfo) {
          return self.cohortModel.promiseInit(data.modelInfos)
        } else {
          return Promise.resolve();
        }
      }

      self.dispatch.showInProgress("Initializing session data")
      getInitPromise().then(function() {
        self.cohortModel.isLoaded = false;

        let dataIsAlreadyCompressed = true;

        let options = {}
        if (isLaunchedFromMosaic) {
          options[self.cacheHelper.BAM_DATA] =  true;
          options[self.cacheHelper.GENE_COVERAGE_DATA] = true;    

          data.cache = JSON.parse(data.cache)      
        }

        return self.cacheHelper.promiseLoadCache(data.cache, dataIsAlreadyCompressed, options)
      })
      .then(function() {
        self.cohortModel.isLoaded = modelInfos || hasModelInfo;
        self.dispatch.hideInProgress();

        // If local files were used when analysis was saved, we need to prompt
        // user to choose these files.
        if (!hasModelInfo && specifyFilesMsg) {
          self.dispatch.specifyFilesForAnalysis(specifyFilesMsg);
          resolve(false)
        } else {
          resolve(true)
        }
      })
      .catch(function(error) {
        self.dispatch.hideInProgress();
        console.log("Unable to init analysis model and cohort model")
        console.log(error)
        let msg = 'Unable to load analysis due to error: ' + error;
        reject(msg)
      }) 
    })

  }

  _prepareAnalysisModelInfos(data) {
    
    let proxies = [];
    let specifyFilesMsg = "";
    if (data.modelInfos) {
      let relToFileName = {}
      proxies = data.modelInfos.filter(function(modelInfo) {
        let vcfProxy = modelInfo.vcf && modelInfo.vcf.indexOf('proxy') > 0;
        let bamProxy = modelInfo.bam && modelInfo.bam.indexOf('proxy') > 0;
        return vcfProxy || bamProxy;
      }) 
      specifyFilesMsg = "Analysis loaded. Please specify the following files to proceed:"
      data.modelInfos.forEach(function(modelInfo) {
        if (modelInfo.vcf && modelInfo.vcf.length > 0) {
          if (modelInfo.vcf.indexOf('proxy') > 0 ) {                
            let regexp = /http[s]:\/\/lf-proxy.iobio.io.*\/(.*vcf\.gz)/g;
            let matches = modelInfo.vcf.matchAll(regexp);
            for (let match of matches) {
              if (match.length == 2) {
                specifyFilesMsg += "<div style='margin-left: 20px'>" 
                + "For "
                + modelInfo.relationship + ', ' 
                + ' choose local variant file ' 
                + '<pre>' + match[1] + '</pre>' 
                + " and select sample " + '<pre>' +modelInfo.sample + '</pre>' 
                + "</div>"
              }
            }
          } 
        }
        if (modelInfo.bam && modelInfo.bam.length > 0) {
          if (modelInfo.bam.indexOf('proxy') > 0 ) {                
            let regexp = /http[s]:\/\/lf-proxy.iobio.io.*\/(.*\.bam)/g;
            let matches = modelInfo.vcf.matchAll(regexp);
            for (let match of matches) {
              if (match.length == 2) {
                specifyFilesMsg += '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For ' 
                + modelInfo.relationship + ', ' 
                + ' choose local alignment file ' 
                + match[1] 
              }
            }
          } 
        }
      })
    } else {
      specifyFilesMsg = "Analysis loaded. Please specify the variant and alignment files to proceed."            
    }

    let hasModelInfo = data.modelInfos && data.modelInfos.length > 0 && proxies.length == 0 ? true : false;
    
    return {'hasModelInfo': hasModelInfo, 'specifyFilesMsg': specifyFilesMsg}
  }


  promiseLoadAnalysisFromFile(fileSelection) {
    var self = this;
    self.cohortModel.isLoaded = false;
    self.dispatch.showInProgress("Loading analysis file")

    return new Promise(function(resolve, reject) {
      var files = fileSelection.currentTarget.files;
      // Check for the various File API support.
      if (window.FileReader) {
        var analysisFile = files[0];
        var reader = new FileReader();

        reader.readAsText(analysisFile);

        // Handle errors load
        reader.onload = function(event) {
          self.dispatch.hideInProgress()
          fileSelection.value = null;
          var dataStr = event.target.result;
          let data = JSON.parse(dataStr);

          self.promiseInitAnalysisAndCohort(data, null, null, false)
          .then(function(modelInfoProvided) {
            resolve(modelInfoProvided);
          })
          .catch(function(error) {
            reject(error)
          })
        }
        reader.onerror = function(event) {
          self.dispatch.hideInProgress();
          let msg = "Cannot read file. Error: " + event.target.error.name
          console.log(msg);
          console.log(event.toString())
          reject(msg)
        }

      } else {
        self.dispatch.hideInProgress();
        let msg = 'FileReader are not supported in this browser.'
        console.log(msg)
        reject(msg);
      }

    })

  }


  _promisePrepareToSaveAnalysis(payload, appAlerts, stringifyCache) {
    let self = this;

    return new Promise(function(resolve, reject) {
      payload.settings = {
       'geneSource':        self.geneModel.geneSource, 
       'coverageThresholds': {'min':    self.filterModel.geneCoverageMin,
                              'median': self.filterModel.geneCoverageMedian,
                              'mean':   self.filterModel.geneCoverageMean
                              },
       'analyzeCodingVariantsOnly': self.cohortModel.analyzeCodingVariantsOnly,
       'phenolyzerTopGenes': self.geneModel.phenolyzerTopGenesToKeep
      };

      payload.appAlerts = appAlerts;

      payload.filters = self.filterModel.flagCriteria

      self._promiseOutputAnalysisCache()
      .then(function(cacheItemsCompressed) {

        if (stringifyCache) {
          let cacheItemsStr = JSON.stringify(cacheItemsCompressed, function(key, value) {
            if (value && value != '') {
              if (key == 'gene' && typeof value === 'object' && value.hasOwnProperty('gene_name')) {
                return value.gene_name
              } else {
                return value
              }
            } else {
              return
            }
          }, 2)

          resolve(cacheItemsStr)          
        } else {
          resolve(cacheItemsCompressed)
        }
      })
      .catch(function(error) {
        reject(error)
      })
    })
  }

  promiseSaveAnalysis(analysis, appAlerts, options) {
    let self = this

    return new Promise(function(resolve, reject) {
      self.analysis = analysis;

      self._promisePrepareToSaveAnalysis(analysis.payload, appAlerts, true)
      .then(function(cacheItemsStr) {
        self.analysis.payload.cache = cacheItemsStr;

        self.analysis.payload.genePhenotypeHits = self.geneModel.genePhenotypeHits;
        if (self.analysis.payload.hasOwnProperty('variants')) {
          delete self.analysis.payload.variants;
        }
        if (self.analysis.payload.hasOwnProperty('genes')) {
          delete self.analysis.payload.genes;
        }

        if (self.analysis.id ) {
          self.hubSession.promiseUpdateAnalysis(self.analysis)
          .then(function(analysis) {
            self.analysis = analysis;
            resolve(analysis);
          })
          .catch(function(error) {
            self.onShowSnackbar( {message: error, timeout: 15000});
            reject(error);
          })
        } else {

          self.hubSession.promiseAddAnalysis(self.analysis.project_id, self.analysis)
          .then(function(analysis) {
            self.analysis = analysis;
            console.log("* adding mosaic analysis " + self.analysis.id + " " + " *")
            resolve(analysis);
          })
          .catch(function(error) {
            reject(error);
          })
        }
      })

      

    })


  }

  promiseSaveAnalysisFile(appAlerts, currentBuildName, currentGeneSource) {
    let self = this;

    return new Promise(function(resolve, reject) {
      let analysis = {'settings': {}, 'modelInfos': {}, 'filters': [], 'appAlerts': [], 'cache': []};
      analysis.modelInfos = self.cohortModel.getModelInfos();

      self._promisePrepareToSaveAnalysis(analysis, appAlerts, false)
      .then(function(cacheItemsCompressed) {

        analysis.cache = cacheItemsCompressed;

        let dataStr = JSON.stringify(analysis, function(key, value) {
          if (value && value != '') {
            if (key == 'gene' && typeof value === 'object' && value.hasOwnProperty('gene_name')) {
              return value.gene_name
            } else {
              return value
            }
          } else {
            return
          }
        }, 2)

        let jsonFileName = "gene.iobio.analysis." + 
                            self.globalApp.utility.formatCurrentDateYMD() + 
                            ".json"
        resolve( {'dataStr': dataStr, 'jsonFileName': jsonFileName})
      })
      .catch(function(error) {
        reject(error)
      })
    })

  }

  _promiseOutputAnalysisCache() {
    let self = this;

    return new Promise(function(resolve, reject) {
      let start = new Date();
      let options = {}
      options.decompress = false;
      options[self.cacheHelper.BAM_DATA] =  true;
      options[self.cacheHelper.GENE_COVERAGE_DATA] = true;

      self.cacheHelper.promiseOutputCache(options)
      .then(function(cacheItemsCompressed) {

        let elapsed = (new Date() - start) / 1000;
        console.log("Session cache ready to save. Elapsed time = " + elapsed + 
          " seconds, size = " + new Blob([cacheItemsCompressed]).size + " bytes.")

        resolve(cacheItemsCompressed)
      })
      .catch(function(error) {
        console.log("Unable to save cache session to analysis" + error)
        reject(error)
      })

    })

  }

}
export default AnalysisModel;
