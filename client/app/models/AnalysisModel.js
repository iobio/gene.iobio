import CacheHelper      from './CacheHelper.js'
class AnalysisModel {

  constructor(globalApp, geneModel, cohortModel, cacheHelper, 
    genomeBuildHelper, filterModel, hubSession) {

    this.globalApp = globalApp;
    this.geneModel = geneModel;
    this.cohortModel = cohortModel;
    this.cacheHelper = cacheHelper;
    this.genomeBuildHelper = genomeBuildHelper;
    this.filterModel = filterModel;
    this.hubSession = hubSession;
    this.analysis = null

    this.dispatch = d3.dispatch("showInProgress", "hideInProgress", 
                                "phenolyzerTopGenesSet", "appAlertsSet",
                                "specifyFilesForAnalysis");
    d3.rebind(this, this.dispatch, "on");
  }


  promiseLoadAnalysisFromFile(fileSelection, dataIsCompressed=true, options) {
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

          var getInitPromise = function() {
            if (hasModelInfo) {
              return self.cohortModel.promiseInit(data.modelInfos)
            } else {
              return Promise.resolve();
            }
          }


          self.dispatch.showInProgress("Initializing session data")
          getInitPromise().then(function() {
            self.cohortModel.isLoaded = false;
            return self.cacheHelper.promiseLoadCache(data.cache, dataIsCompressed, options)
          })
          .then(function() {
            self.cohortModel.isLoaded = hasModelInfo;
            self.dispatch.hideInProgress();

            // If local files were used when analysis was saved, we need to prompt
            // user to choose these files.
            if (!hasModelInfo) {
              self.dispatch.specifyFilesForAnalysis(specifyFilesMsg);
              resolve(false)
            } else {
              resolve(true)
            }
          })
          .catch(function(error) {
            self.dispatch.hideInProgress();
            console.log("Unable to load data from saved analysis file " + analysisFile)
            console.log(error)
            let msg = 'Unable to load data files due to error: ' + error;
            reject(msg)
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




  promiseSaveAnalysis(analysis, appAlerts, options) {
    let self = this

    return new Promise(function(resolve, reject) {
      self.analysis = analysis;

      self.analysis.payload.settings = {
       'geneSource':        self.geneModel.geneSource, 
       'coverageThresholds': {'min':    self.filterModel.geneCoverageMin,
                              'median': self.filterModel.geneCoverageMedian,
                              'mean':   self.filterModel.geneCoverageMean
                              },
       'analyzeCodingVariantsOnly': self.cohortModel.analyzeCodingVariantsOnly,
       'phenolyzerTopGenes': self.geneModel.phenolyzerTopGenesToKeep
      };

      self.analysis.payload.appAlerts = appAlerts;

      self.promiseOutputAnalysisCache()
      .then(function(cacheItemsCompressed) {

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
            self.setDirty(false);
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
      let data = {'settings': {}, 'modelInfos': {}, 'appAlerts': [], 'cache': []};
      data.modelInfos = self.cohortModel.getModelInfos();

      data.settings = {'genomeBuild':        currentBuildName, 
                       'geneSource':         currentGeneSource,
                       'coverageThresholds': {'min':    self.filterModel.geneCoverageMin,
                                              'median': self.filterModel.geneCoverageMedian,
                                              'mean':   self.filterModel.geneCoverageMean
                                              },
                       'analyzeCodingVariantsOnly': self.cohortModel.analyzeCodingVariantsOnly,
                       'phenolyzerTopGenes': self.geneModel.phenolyzerTopGenesToKeep
                      };

      data.appAlerts = self.appAlerts;

      self.promiseOutputAnalysisCache()
      .then(function(cacheItemsCompressed) {

        data.cache = cacheItemsCompressed;

        let dataStr = JSON.stringify(data, function(key, value) {
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

  promiseOutputAnalysisCache() {
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
