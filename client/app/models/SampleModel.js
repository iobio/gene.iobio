import CacheHelper      from './CacheHelper.js';
import Bam              from './Bam.iobio.js';
import vcfiobio         from './Vcf.iobio.js';

class SampleModel {

  constructor(globalApp) {
    this.globalApp = globalApp;
    this.vcf = null;
    this.sfariVcfs = []; // Used for sfari variant track: 1x sample model w/ multiple vcf endpoints
    this.bam = null;

    this.CODING_REGION_BUFFER = 20;

    this.vcfData = null;
    this.fbData = null;
    this.bamData = null;

    this.isBasicMode = null;
    this.isEduMode = null;
    this.isSfariSample = false;  // True if sample sourced from Mosaic SSC projects (WGS 37/38 or WES 37)

    this.vcfUrlEntered = false;
    this.vcfFileOpened = false;
    this.getVcfRefName = null;
    this.isMultiSample = false;

    this.bamUrlEntered = false;
    this.bamFileOpened = false;
    this.getBamRefName = null;

    this.samples = null;

    this.name = "";
    this.vcfRefNamesMap = {};
    this.sampleName = "";
    this.isGeneratedSampleName = false;
    this.defaultSampleName = null;
    this.relationship = null;
    this.affectedStatus = null;
    this.sex = null;

    this.hpoTerms = null;

    this.cohort = null;

    this.debugMe = false;

    this.loadedVariants = null;
    this.variantHistoData = null;
    this.coverage = [[]];
    this.coverageDangerRegions = [];
    this.helpMsg = "If this error persists, Please email <a href='mailto:iobioproject@gmail.com'>iobioproject@gmail.com</a> for help resolving this issue.";
    this.helpMsgRefNotFound = "The gene resides on a chromosome that is not included in the variant file. Please email <a href='mailto:iobioproject@gmail.com'>iobioproject@gmail.com</a> with questions.";

    this.lastFetchedPathoFilters = null;
    this.lastFetchedClinvarGene = null;
    this.lastFetchedClinvarTrans = null;

    this.inProgress = {
      'loadingVariants': false,
      'callingVariants': false,
      'loadingCoverage': false
    };
  }


  getModelInfo() {
    let self = this;
    let modelInfo = {
      "relationship":   self.relationship,
      "affectedStatus": self.affectedStatus,
      "name":           self.name,
      "sample":         self.sampleName,
      "sex":            self.sex,
      "vcf":            self.vcf ? self.vcf.getVcfURL() : null,
      "tbi":            self.vcf ? self.vcf.getTbiURL() : null,
      "bam":            self.bam ? self.bam.bamUri : null,
      "bai":            self.bam ? self.bam.baiUri : null
    }
    return modelInfo;
  }

  getSampleIdentifier(theSampleName) {
    var id = this.relationship + "&&" + this.sampleName + "&&" + theSampleName;
  }

  promiseSetLoadState(theVcfData, taskName) {
    const me = this;

    var resolveIt = function(resolve, theVcfData) {
      if (theVcfData != null) {
        if (theVcfData.loadState == null) {
          theVcfData.loadState = {};
        }
        theVcfData.loadState[taskName] = true;
      }
      resolve();
    }

    return new Promise(function(resolve, reject) {
      if (theVcfData != null) {
        resolveIt(resolve, theVcfData);
      } else {
        me.promiseGetVcfData(window.gene, window.selectedTranscript)
         .then(function(data) {
          resolveIt(resolve, data.vcfData);
         })
         .catch( function(error) {
           console.log(error);
           reject(error);
         });
      }
    })
  }

  getAnnotators() {
    return this.vcf ? this.vcf.getAnnotators() : [];
  }

  isLoaded() {
    return this.vcf != null && this.vcfData != null;
  }


  isReadyToLoad() {
    if (this.isVcfReadyToLoad()) {
      return this.isSampleSelected();
    } else {
      return this.isBamReadyToLoad();
    }
  }

  isBamReadyToLoad() {
    return this.bam != null && (this.bamUrlEntered || this.bamFileOpened);
  }

  isVcfReadyToLoad() {
    return this.vcf != null && (this.vcfUrlEntered || this.vcfFileOpened);
  }

  isSampleSelected() {
    return !this.isMultiSample || (this.sampleName && this.sampleName.length > 0);
  }


  isBamLoaded() {
    return this.bam && (this.bamUrlEntered || (this.bamFileOpened && this.getBamRefName));
  }

  isVcfLoaded() {
    return this.vcf && (this.vcfUrlEntered || this.vcfFileOpened);
  }


  isInheritanceLoaded() {
    return (this.vcfData != null && this.vcfData.loadState != null && this.vcfData.loadState['inheritance']);
  }


  getGeneModel() {
    return this.cohort.geneModel;
  }



  getAffectedInfo() {
    return this.cohort.affectedInfo;
  }

  getTranslator() {
    return this.cohort.translator;
  }

  getCacheHelper() {
    return this.cohort.cacheHelper;
  }


  getGenomeBuildHelper() {
    return this.cohort.genomeBuildHelper;
  }

  getAnnotationScheme() {

      // If this is the refseq gene model, set the annotation
      // scheme on the filter card to 'VEP' since snpEff will
      // be bypassed at this time.
      if (this.getGeneModel().geneSource == 'refseq') {
        return "VEP";
      } else {
        return this.cohort.annotationScheme;
      }
  }



  promiseGetVcfData(geneObject, selectedTranscript, whenEmptyUseFbData=true) {
    const me = this;
    var dataKind = CacheHelper.VCF_DATA;
    return new Promise(function(resolve, reject) {
      if (geneObject == null) {
        reject("Empty geneObject in SampleModel.promiseGetVcfData()");
      }
      let theGeneObject = geneObject;
      let theTranscript = selectedTranscript;

      // If only alignments have specified, but not variant files, we will need to use the
      // getBamRefName function instead of the getVcfRefName function.
      var theGetRefNameFunction = me.getVcfRefName != null ? me.getVcfRefName : me.getBamRefName;
      if (theGetRefNameFunction == null) {
        theGetRefNameFunction = me._stripRefName;
      }
      if (theGetRefNameFunction == null) {
        var msg = "No function defined to parse ref name from file";
        console.log(msg);
        reject(msg);
      }

      var theVcfData = null;


      if (me[dataKind] != null && me[dataKind].features && me[dataKind].features.length > 0) {
        if (theGetRefNameFunction.apply(me, [geneObject.chr]) == me[dataKind].ref &&
          geneObject.start == me[dataKind].start &&
          geneObject.end == me[dataKind].end &&
          geneObject.strand == me[dataKind].strand) {
          theVcfData = me[dataKind];
          resolve({model: me, vcfData: theVcfData, 'gene': theGeneObject, 'transcript': theTranscript});
        }
      }


      if (theVcfData == null) {
        // Find vcf data in cache
        me._promiseGetData(dataKind, theGeneObject.gene_name, theTranscript)
         .then(function(data) {
          if (data != null && data != '') {
            me[dataKind] = data;
            theVcfData = data;
            resolve({model: me, vcfData: theVcfData, 'gene': theGeneObject, 'transcript': theTranscript});
          } else {
            // If the vcf data is null, see if there are called variants in the cache.  If so,
            // copy the called variants into the vcf data.
            if (whenEmptyUseFbData && me.isAlignmentsOnly()) {
              me.promiseGetFbData(theGeneObject, theTranscript)
              .then(function(theFbData) {
                // If no variants are loaded, create a dummy vcfData with 0 features
                if (theFbData && theFbData.features) {
                  theVcfData = $.extend({}, theFbData);
                  theVcfData.features = [];
                  me.promiseSetLoadState(theVcfData, 'clinvar')
                   .then(function() {
                    return me.promiseSetLoadState(theVcfData, 'coverage');
                   })
                   .then(function() {
                    return me.promiseSetLoadState(theVcfData, 'inheritance');
                   })
                   .then(function() {
                    me.addCalledVariantsToVcfData(theVcfData, theFbData);
                   })
                   .catch(function(error) {
                     reject(error)
                   })


                }
                resolve({model: me, vcfData: theVcfData, 'gene': theGeneObject, 'transcript': theTranscript});

               })
               .catch(function (error) {
                 let msg = "Problem getting fb data in SampleModel.promiseGetVcfData()."
                 console.log(msg);
                 reject(error);
               });
            } else {
              resolve({model: me, vcfData: theVcfData, 'gene': theGeneObject, 'transcript': theTranscript});
            }

          }

         })
      }



    });
  }


  promiseGetFbData(geneObject, selectedTranscript, reconstiteFromVcfData=false) {
    var me = this;
    return new Promise(function(resolve, reject) {
      me._promiseGetData(CacheHelper.FB_DATA, geneObject.gene_name, selectedTranscript)
       .then(function(theFbData) {
        if (reconstiteFromVcfData) {
          // Reconstitute called variants from vcf data that contains called variants
          if (theFbData == null || theFbData.features == null) {
            me.promiseGetVcfData(geneObject, selectedTranscript, false)
            .then(function(data) {
              var theVcfData = data.vcfData;
              var dangerSummary = me.promiseGetDangerSummary(geneObject.gene_name)
               .then(function(dangerSummary) {
                if (theVcfData && theVcfData.features) {
                  theFbData = me.reconstituteFbData(theVcfData);
                  resolve({fbData: theFbData, model: me});
                } else {
                  resolve({fbData: theFbData, model: me});
                }
               },
               function(error) {
                var msg = "An error occurred in SampleModel.promiseGetFbData: " + error;
                console.log(msg);
                reject(msg);
               })

            })
            .catch( function(error) {
                console.log(msg);
                reject(msg);
            });
          } else {
            resolve({fbData: theFbData, model: me});
          }
        } else {
          resolve({fbData: theFbData, model: me});

        }

       },
       function(error) {
        var msg = "Problem in SampleModel.promiseGetFbData(): " + error;
        console.log(msg);
        reject(msg);
       })

    })


  }

  reconstituteFbData(theVcfData) {
    var me = this;
    var theFbData = $.extend({}, theVcfData);
    theFbData.features = [];
    theFbData.loadState = {clinvar: true, coverage: true, inheritance: true};
    // Add the unique freebayes variants to vcf data to include
    // in feature matrix
    theVcfData.features.forEach( function(v) {
      if (v == null) {
        console.log("empty variant!")
      } else {
        if (v.hasOwnProperty('fbCalled') && v.fbCalled == 'Y') {
          var variantObject = $.extend({}, v);
            theFbData.features.push(variantObject);
            variantObject.source = v;
        }
      }
    });
    return theFbData;
  }

  promiseGetKnownVariantHistoData(geneObject, transcript, binLength) {
    var me = this;
    return new Promise( function(resolve, reject) {
      var refName = me._stripRefName(geneObject.chr);
      me.vcf.promiseGetKnownVariantsHistoData(refName, geneObject, binLength == null ? transcript : null, binLength)
      .then(function(results) {
        if (binLength == null) {
          var exonBins = me.binKnownVariantsByExons(geneObject, transcript, binLength, results);
          resolve(exonBins);
        } else {
          resolve(results);
        }
      })
      .catch(function(error) {
        reject(error);
      })
    })
  }

  binKnownVariantsByExons(geneObject, transcript, binLength, results) {
    var exonBins = [];
    transcript.features.filter(function(feature) {
      return feature.feature_type.toUpperCase() == 'CDS' || feature.feature_type.toUpperCase() == 'CDS';
    }).forEach(function(exon) {
      var exonBin = {point: (+exon.start + ((+exon.end - +exon.start)/2)), start: exon.start, end: exon.end, total: +0, path: +0, benign: +0, unknown: +0, other: +0};
       results.forEach(function(rec) {
        if (+rec.start >= +exon.start && +rec.end <= +exon.end) {
          exonBin.total    += +rec.total;
          exonBin.path     += +rec.path;
          exonBin.benign   += +rec.benign;
          exonBin.other    += +rec.other;
          exonBin.unknown  += +rec.unknown;
        }
      })
      exonBins.push(exonBin);
    })
    return exonBins;
  }




  promiseGetGeneCoverage(geneObject, transcript) {
    var me = this;

    return new Promise( function(resolve, reject) {
      me.promiseGetCachedGeneCoverage(geneObject, transcript)
       .then( function(cachedGeneCoverage) {
        if (cachedGeneCoverage) {
          resolve({model: me, 'geneCoverage': cachedGeneCoverage})
        } else {
          if (transcript.features == null || transcript.features.length == 0) {
            resolve({model: me, gene: geneObject, transcript: transcript, 'geneCoverage': []});
          } else {
            me.bam.promiseGetGeneCoverage(geneObject,
              transcript,
              [me.bam])
            .then(function(data) {
              let theData = data.geneCoverage;
              let trRefName = data.refName;
              let theGeneObject = data.geneObject;
              let theTranscript = data.transcript;

              var geneCoverageObjects = me._parseGeneCoverage(theData);
              if (geneCoverageObjects.length > 0) {
                me._setGeneCoverageExonNumbers(transcript, geneCoverageObjects);
                me.setGeneCoverageForGene(geneCoverageObjects, theGeneObject, theTranscript);
                resolve({model: me, gene: theGeneObject, transcript: theTranscript, 'geneCoverage': geneCoverageObjects});
              } else {
                console.log("Cannot get gene coverage for gene " + theGeneObject.gene_name);
                resolve({model: me, gene: theGeneObject, transcript: theTranscript, 'geneCoverage': []});
              }
            })
            .catch(function(error) {
              reject(error)
            })

          }
        }

       },
       function(error) {
        reject(error);
       });



    });
  }


  _setGeneCoverageExonNumbers(transcript, geneCoverageObjects) {
    var me = this;
    transcript.features.forEach(function(feature) {
      var gc = null;
      var matchingFeatureCoverage = geneCoverageObjects.filter(function(gc) {
        return feature.start == gc.start && feature.end == gc.end;
      });
      if (matchingFeatureCoverage.length > 0) {
        gc = matchingFeatureCoverage[0];
      }
      if (gc) {
        gc.exon_number = feature.exon_number;
      }

    });
  }

  _parseGeneCoverage(theData) {
    var geneCoverageObjects = [];
    if (theData && theData.length > 0) {
      var fieldNames = [];
      theData.split("\n").forEach(function(rec) {
        if (rec.indexOf("#") == 0 && fieldNames.length == 0) {
          rec.split("\t").forEach(function(field) {
            if (field.indexOf("#") == 0) {
              field = field.substring(1);
            }
            fieldNames.push(field);
          })
        } else {
          var fields = rec.split("\t");
          if (fields.length == fieldNames.length) {
            var gc = {};
            for (var i = 0; i < fieldNames.length; i++) {
              gc[fieldNames[i]] = fields[i];
              if (fieldNames[i] == 'region') {
                if (fields[i] != "NA") {
                  var parts  = fields[i].split(":");
                  gc.chrom   = parts[0];
                  var region = parts[1].split("-");
                  gc.start   = region[0];
                  gc.end     = region[1];
                }
              }
            }
            geneCoverageObjects.push(gc);
          }
        }
      })
    }

    return geneCoverageObjects;
  }

  promiseGetCachedGeneCoverage(geneObject, selectedTranscript) {
    return this._promiseGetData(CacheHelper.GENE_COVERAGE_DATA, geneObject.gene_name, selectedTranscript);
  }

  setGeneCoverageForGene(geneCoverage, geneObject, transcript) {
    geneObject = geneObject ? geneObject : window.gene;
    transcript = transcript ? transcript : window.selectedTranscript;
    this._promiseCacheData(geneCoverage, CacheHelper.GENE_COVERAGE_DATA, geneObject.gene_name, transcript);
  }

  determineCoverageDangerRegions(transcript) {
    let self = this;
    self.coverageDangerRegions = [];
    transcript.features
    .filter( function(feature) {
        return feature.feature_type == 'CDS' || feature.feature_type == 'UTR';
    })
    .forEach(function(feature) {
      if (feature.danger[self.getRelationship()]) {
        self.coverageDangerRegions.push(feature);
      }
    })
  }



  promiseGetBamData(geneObject) {
    var me = this;
    return new Promise(function(resolve, reject) {

      var data = null;

      if (geneObject == null) {
        reject("Error SampleModel.promiseGetBamData(): geneObject is null");
      }

      if (me.bamData != null) {
        if (me.getBamRefName(geneObject.chr) == me.bamData.ref &&
          geneObject.start == me.bamData.start &&
          geneObject.end == me.bamData.end) {
          data = me.bamData;
          resolve(data.coverage);
        }
      }
      if (data == null) {
        // Find in cache
        me._promiseGetData(CacheHelper.BAM_DATA, geneObject.gene_name, null)
         .then(function(data) {
          if (data != null && data != '') {
            me.bamData = data;
          }
          resolve( data ? data.coverage : null);
         },
         function(error) {
          var msg = "An error occurred in SampleModel.promiseGetBamData(): " + error;
          reject(msg);
         })
      }

    })
  }


  promiseGetDangerSummary(geneName) {
    return this._promiseGetData(CacheHelper.DANGER_SUMMARY_DATA, geneName, null);
  }

  promiseGetVariantCount(data) {
    var me = this;

    var resolveIt = function(resolve, theVcfData) {
      var loadedVariantCount = 0;
      if (theVcfData && theVcfData.features) {
        theVcfData.features.forEach(function(variant) {
          if (variant.fbCalled == 'Y') {

          } else if (variant.zygosity && variant.zygosity.toLowerCase() == "homref") {

          } else {
            loadedVariantCount++;
          }
        });
      }
      resolve(loadedVariantCount);

    }
    return new Promise(function(resolve, reject) {
      var theVcfData = null;
      if (data != null && data.features != null) {
        resolveIt(resolve, data);
      } else {
        me.promiseGetVcfData(window.gene, window.selectedTranscript)
        .then(function(theData) {
          theVcfData = theData.vcfData;
          resolveIt(resolve, theData.vcfData);
        })
        .catch(function(error) {
          console.log(error);
          reject(error);
        })
      }
    })

  }


  promiseSummarizeDanger(geneObject, theVcfData, options, geneCoverageAll, filterModel, transcript, notFoundVariants=null, dangerSummaryExisting=null) {
    var me = this;
    return new Promise(function(resolve, reject) {
      var dangerSummary = SampleModel._summarizeDanger(geneObject.gene_name, theVcfData, options, geneCoverageAll, filterModel, me.getTranslator(), me.getAnnotationScheme(), transcript, me.isAlignmentsOnly());

      me.cohort.captureFlaggedVariants(dangerSummary, geneObject)

      // We need to restore the 'notFound' variants in the badges that we discovered when
      // the variants were imported. Since they are not in the vcf file, we will lose
      // this information unless we restore it here.
      if (notFoundVariants && dangerSummary.badges) {
        dangerSummary.badges.notFound = notFoundVariants;
      }

      var isDirty = true;
      if (dangerSummaryExisting && !me.isEduMode) {
        isDirty = me._isDifferentDangerSummary(dangerSummaryExisting, dangerSummary)
      }

      if (isDirty) {
        me.promiseCacheDangerSummary(dangerSummary, geneObject.gene_name)
        .then(function() {
          resolve({'dangerSummary': dangerSummary, 'isDirty': true});
        },
        function(error) {
          reject(error);
        })
      } else {
        resolve({'dangerSummary': dangerSummary, 'isDirty': false})
      }
    })
  }

  _isDifferentDangerSummary(ds1, ds2) {
    let self = this;
    let match = true;
    ['CALLED', 'GENECOVERAGE','AF', 'CLINVAR', 'CONSEQUENCE', 'IMPACT', 'INHERITANCE', 'calledCount', 'loadedCount', 'isAlignmentsOnly']
    .forEach(function(field) {
      if (ds1.hasOwnProperty(field)
        && ds2.hasOwnProperty(field)
        && ds1[field]
        && ds2[field]
        && typeof ds1[field] == 'object'
        && typeof ds2[field] == 'object') {
        if (JSON.toString(ds1[field]) != JSON.toString(ds2[field])) {
          match = false;
        }
      } else {
        if (ds1[field] != ds2[field]) {
          match = false;
        }
      }
    })
    if (match) {
      Object.keys(self.cohort.filterModel.flagCriteria).forEach(function(filter) {
        if (match) {
          let length1 = ds1.badges[filter] ? ds1.badges[filter].length : 0;
          let length2 = ds2.badges[filter] ? ds2.badges[filter].length : 0;

          let variants1 = [];
          if (ds1.badges[filter]) {
            variants1 = ds1.badges[filter].map(function(variant) {
              if (variant) {
                let variantNotes = variant.notes ? variant.notes.map(function(elem) {
                  return elem.note;
                }).join(",") : "";
                return variant.start + "-" + variant.ref + "-" +  variant.alt
                       + "-" + variant.interpretation + "-" + variantNotes;
              } else {
                return "?"
              }
            })
          }
          let variants2 = [];
          if (ds2.badges[filter]) {
            variants2 = ds2.badges[filter].map(function(variant) {
              if (variant) {
                let variantNotes = variant.notes ? variant.notes.map(function(elem) {
                  return elem.note;
                }).join(",") : "";
                return variant.start + "-" + variant.ref + "-" +  variant.alt
                       + "-" + variant.interpretation + "-" + variantNotes;
              } else {
                return "?"
              }
            })
          }

          if (length1 != length2) {
            match = false;
          } else if (variants1.join(",") != variants2.join(",")) {
            match = false;
          }
        }
      })
    }
    return !match;
  }

  promiseSummarizeError(geneName, error) {
    var me = this;
    return new Promise(function(resolve, reject) {
      var theGeneName = geneName
      var dangerSummary = SampleModel.summarizeError(geneName, error);
      me.promiseCacheDangerSummary(dangerSummary, theGeneName)
       .then(function() {
        resolve(dangerSummary);
       },
       function(error) {
        reject(error);
       })
    })
  }

  filterBamDataByRegion(coverage, regionStart, regionEnd) {
    return coverage.filter(function(d) {
      return (d[0] >= regionStart && d[0] <= regionEnd);
    });
  }

  reduceBamData(coverageData, numberOfPoints) {
    var factor = d3.round(coverageData.length / numberOfPoints);
    var xValue = function(d) { return d[0]; };
    var yValue = function(d) { return d[1]; };
    return this.bam.reducePoints(coverageData, factor, xValue, yValue);
  }

  setLoadedVariants(theVcfData) {
    this.vcfData = theVcfData;
  }


  setCalledVariants(theFbData, cache=false) {
    this.fbData = theFbData;
    if (cache) {
      this._promiseCacheData(theFbData, CacheHelper.FB_DATA, window.gene.gene_name, window.selectedTranscript);
    }
  }

  promiseGetCalledVariantCount() {
    var me = this;
    return new Promise(function(resolve, reject) {
      me.promiseGetFbData(window.gene, window.selectedTranscript, true)
       .then(function(data) {
        var theFbData = data.fbData;
        if (theFbData && theFbData.features ) {
          var count = theFbData.features
           .filter(function(d) {
              return !SampleModel.bypassZyg(d, me.relationship);
           }).length;
           resolve(count);
        } else {
          resolve(0);
        }

       },
       function(error) {
        var msg = "Problem in getCalledVariantCount(): " + error;
        console.log(msg);
        reject(msg);
       });
    })

  }


  promiseHasCalledVariants() {
    var me = this;
    return new Promise(function(resolve,reject) {
      if (me.fbData != null ) {
        resolve(me.fbData != null && me.fbData.features != null && me.fbData.features.length > 0);
      } else {
        me.promiseGetFbData(window.gene, window.selectedTranscript, true)
         .then(function(data) {
          if (data.fbData && data.fbData.features) {
            var calledVariants = data.fbData.features.filter(function(variant) {
              return !SampleModel.bypassZyg(variant, me.relationship);
            })
            resolve(calledVariants.length > 0);
          } else {
            resolve(false);
          }
         },
         function(error) {
          var msg = "Problem in SampleModel.promiseHasCalledVariants(): " + error;
          console.log(msg);
          reject(msg);
         })
      }

    })
  }



  promiseVariantsHaveBeenCalled() {
    var me = this;
    return new Promise(function(resolve, reject) {
      if (me.fbData) {
        resolve(true);
      } else {
        me.promiseGetFbData(window.gene, window.selectedTranscript, true)
         .then(function(data) {
          resolve(data.fbData != null);
         },
         function(error) {
          var msg = "Problem in SampleModel.promiseVariantsHaveBeenCalled(): " + error;
          console.log(msg);
          reject(msg);
         });
      }
    })

  }




  getName() {
    return this.name;
  }

  setName(theName) {
    if (theName) {
      this.name = theName;
    }
  }

  setRelationship(theRelationship) {
    this.relationship = theRelationship;
  }


  isAffected() {
    return this.affectedStatus && this.affectedStatus == 'affected' ? true : false;
  }


  setAffectedStatus(theAffectedStatus) {
    this.affectedStatus = theAffectedStatus;
  }


  getRelationship() {
    return this.relationship;
  }


  setSampleName(sampleName) {
    this.sampleName = sampleName;
  }

  setGeneratedSampleName(sampleName) {
    this.sampleName = sampleName;
    this.isGeneratedSampleName = true;
  }



  getSampleName() {
    let self = this;
    if (this.sampleName) {
      return this.sampleName;
    } else if (this.isAlignmentsOnly()) {
      let sampleName = self.bam.getHeaderSample();
      if (sampleName == null || sampleName.length == 0) {
        sampleName = self.relationship;
      }
      return sampleName;
    } else {
      return self.relationship;
    }
  }

  getVcfSampleName() {
    // Returns a sample name if provided in the vcf header; otherwise returns null.
    return !this.isGeneratedSampleName ? (this.sampleName == "" ? null : this.sampleName) : null;
  }


  setDefaultSampleName(sampleName) {
    this.defaultSampleName = sampleName;
  }


  getDefaultSampleName() {
    return this.defaultSampleName;
  }

  init(cohort) {
    var me = this;

    // init vcf.iobio
    this.cohort = cohort;
    this.vcf = vcfiobio(this.globalApp);
    this.vcf.setEndpoint(this.cohort.endpoint);
    this.vcf.setGenericAnnotation(this.cohort.genericAnnotation);
    this.vcf.setGenomeBuildHelper(this.cohort.genomeBuildHelper);
    this.vcf.setIsEduMode(this.cohort.isEduMode);
  };

  initSfariSample(numVcfEndpts, cohort) {
      // init vcf.iobio
      this.sfariVcfs = [];
      this.cohort = cohort;
      for (let i = 0; i < numVcfEndpts; i++) {
        let currVcf = vcfiobio(this.globalApp);
        this.sfariVcfs.push(currVcf);
        currVcf.setEndpoint(this.cohort.endpoint);
        currVcf.setGenericAnnotation(this.cohort.genericAnnotation);
        currVcf.setGenomeBuildHelper(this.cohort.genomeBuildHelper);
        currVcf.setIsEduMode(this.cohort.isEduMode);
      }
  }

  promiseBamFilesSelected(fileSelection) {
    var me = this;
    return new Promise(function(resolve, reject) {
      me.bamData = null;
      me.fbData = null;
      me.vcfData = null;

      if (fileSelection == null) {
        me.bam = new Bam(me.globalApp);
        me.bamFileOpened = false;
        me.bamRefName = null;
        resolve();
      } else {
        me.bam = new Bam(me.globalApp, me.cohort.endpoint);
        me.bam.openBamFile(fileSelection, function(success, message) {
          if (success) {
            me.bamFileOpened = true;
            me.getBamRefName = me._stripRefName;
            resolve(me.bam.bamFile.name);

          } else {
            reject(message);
          }
        });
      }
    });


  }

  promiseLoadBamUrl(bamUrl, baiUrl) {
    var me = this;

    return new Promise(function(resolve, reject) {
      me.bamData = null;
      me.fbData = null;
      me.vcfData = null;

      if (bamUrl == null || bamUrl.trim() == "") {
        me.bamUrlEntered = false;
        me.bam = null;
        reject("No URL provided for bam")
      } else {

        me.bamUrlEntered = true;
        me.bam = new Bam(me.globalApp, me.cohort.endpoint, bamUrl, baiUrl);

        me.bam.checkBamUrl(bamUrl, baiUrl, function(success, errorMsg) {
          if (!success) {
            me.bamUrlEntered = false;
            me.bam = null;
            reject(errorMsg)
          } else {
            me.getBamRefName = me._stripRefName;
            resolve();
          }
        });

      }
    })

  }

  promiseVcfFilesSelected(fileSelection) {
    var me = this;

    return new Promise( function(resolve, reject) {
      me.sampleName = null;
      me.vcfData = null;

      if (fileSelection == null) {
        me.vcfFileOpened = false;
        me.vcfUrlEntered = false;
        me.getVcfRefName = null;
        me.isMultiSample = false;
        me.vcf.clearVcfFile();
        resolve();
      } else {
        me.vcf.openVcfFile( fileSelection,
        function(success, message) {
          if (success) {
            me.vcfFileOpened = false;
            me.vcfUrlEntered = true;
            me.getVcfRefName = null;
            me.isMultiSample = false;

            // Get the sample names from the vcf header
            me.vcf.promiseGetSampleNames()
            .then(function(sampleNames) {
                me.sampleNames = sampleNames;
                me.isMultiSample = sampleNames && sampleNames.length > 1 ? true : false;
                resolve({'fileName': me.vcf.getVcfFile().name, 'sampleNames': sampleNames});
            })
            .catch(function(error) {
              reject(error)
            })
          } else {
            reject(message);
          }
        });
      }


    });
  }

  clearVcf(cardIndex) {

    this.vcfData = null;
    this.vcfUrlEntered = false;
    this.vcfFileOpened = false;
    this.sampleName = null;
    this.globalApp.utility.removeUrl('sample'+ cardIndex);
    this.globalApp.utility.removeUrl('vcf' + cardIndex);
    this.globalApp.utility.removeUrl('name'+ cardIndex);
    this.vcf.clear();
  }

  clearBam(cardIndex) {

    this.bamData = null;
    this.bamUrlEntered = false;
    this.bamFileOpened = false;
    this.globalApp.utility.removeUrl('bam' + cardIndex);
    if (this.bam) {
      this.bam.clear();
    }
  }

  promiseLoadVcfUrl(vcfUrl, tbiUrl) {
    var me = this;

    return new Promise(function(resolve, reject) {
      me.vcfData = null;
      var success = true;
      me.sampleName = null;

      if (vcfUrl == null || vcfUrl == '') {
        me.vcfUrlEntered = false;
        me.vcf.clearVcfURL();
        resolve([])

      } else {
        me.vcfUrlEntered = true;
        me.vcfFileOpened = false;
        me.getVcfRefName = null;
        me.isMultiSample = false;

        me.vcf.promiseOpenVcfUrl(vcfUrl, tbiUrl)
        .then( function(headerRecs) {
          me.vcfUrlEntered = true;
          me.vcfFileOpened = false;
          me.getVcfRefName = null;
          // Get the sample names from the vcf header
          me.vcf.promiseGetSampleNames()
          .then( function(sampleNames) {
            me.samples = sampleNames;
            me.isMultiSample = sampleNames && sampleNames.length > 1 ? true : false;
            resolve(sampleNames);
          })
          .catch(function(error) {
            reject(error)
          })
        })
        .catch(function(error) {
          reject(error)
        })
      }
    })
  }
  
   
  promiseGetHeaderRecs() {
    let me = this;
    return new Promise(function(resolve, reject) {
      if (me.vcfUrlEntered) {
        me.vcf.promiseGetHeaderRecs()
        .then(function(headerRecs){
          resolve(headerRecs)
        })
        .catch(function(error) {
          reject(error)
        })
      } else {
        reject("Cannot get header recs. No vcf URL provided.")
      }
    })
  }


  /* Takes in two stably sorted lists of vcfs and tbis. Performs similar functions as onVcfUrlEntered above,
   * but accommodates multiple vcf files that will be apart of a single sample model. Used specifically for Sfari track. */
  onHubVcfUrlsEntered(vcfUrls, tbiUrls, callback) {
    var self = this;
    self.vcfData = null;
    let success = true;
    self.sampleName = null;
    self.samples = [];

    // For each vcf url, clear vcf object or openVcfUrl then get sample names from header
    for (let i = 0; i < vcfUrls.length; i++) {
      let currVcf = vcfUrls[i];
      let currTbi = tbiUrls[i];

      if (currVcf == null || currVcf === '') {
        // If we don't have a url, clear vcf endpt
        self.sfariVcfs[i].clearVcfURL();

        // Set flags
        self.vcfUrlEntered = false;
        self.vcfFileOpened = false;
        self.getVcfRefName = null;
        self.isMultiSample = false;

        // Return negative success status
        success = false;
        break;
      } else {
        // Try to open
        self.sfariVcfs[i].openVcfUrl(currVcf.url, currTbi.url, function(success, errorMsg) {
            if (success) {
                // Get the sample names from the vcf header
                self.sfariVcfs[i].getSampleNames(function(sampleNames) {
                    sampleNames.forEach((sampleName) => {
                      self.samples.push(sampleName);
                    });
                });
            } else {
                // If we have a hiccup on one, return false for all
                self.vcfUrlEntered = false;
                reject(errorMsg)
            }
        });
      }
    }
      // Set flags & return
      if (success === true && callback) {
          self.vcfUrlEntered = true;
          self.vcfFileOpened = false;
          self.getVcfRefName = null;
          self.isMultiSample = true;
          callback(success, self.sampleNames);
      } else if (callback) {
          callback(success);
      }
  }


  _promiseVcfRefName(ref, sfariMode = false) {
    var me = this;
    return new Promise( function(resolve, reject) {

      var theRef = ref != null ? ref : window.gene.chr;
      if (me.getVcfRefName != null) {
        // If we can't find the ref name in the lookup map, show a warning.
        if (me.vcfRefNamesMap[me.getVcfRefName(theRef)] == null) {
          reject();
        } else {
          resolve();
        }
      } else {

        me.vcfRefNamesMap = {};
        let currVcf = me.vcf;
        if (sfariMode) {
          currVcf = me.sfariVcfs[0];
        }
        currVcf.promiseGetReferenceLengths()
        .then(function(refData) {
          var foundRef = false;
          refData.forEach( function(refObject) {
            var refName = refObject.name;

            if (refName == theRef) {
              me.getVcfRefName = me._getRefName;
              foundRef = true;
            } else if (refName == me._stripRefName(theRef)) {
              me.getVcfRefName = me._stripRefName;
              foundRef = true;
            } else if (theRef == 'chrMT' && refName == 'chrM') {
              me.getVcfRefName = me._getRefName;
              me.vcfRefNamesMap[me.getVcfRefName(theRef)] = refName;
              foundRef = true;
            } else if (theRef == 'chrMT' && refName == 'M') {
              me.getVcfRefName = me._stripRefName;
              me.vcfRefNamesMap[me.getVcfRefName(theRef)] = refName;
              foundRef = true;
            } else if (theRef == 'chrM' && refName == 'chrMT') {
              me.getVcfRefName = me._getRefName;
              me.vcfRefNamesMap[me.getVcfRefName(theRef)] = refName;
              foundRef = true;
            } else if (theRef == 'chrM' && refName == 'MT') {
              me.getVcfRefName = me._stripRefName;
              me.vcfRefNamesMap[me.getVcfRefName(theRef)] = refName;
              foundRef = true;
            } 
          });
          // Load up a lookup table.  We will use me for validation when
          // a new gene is loaded to make sure the ref exists.
          if (foundRef) {
            refData.forEach( function(refObject) {
              var refName = refObject.name;
              var theRefName = me.getVcfRefName(refName);
              me.vcfRefNamesMap[theRefName] = refName;
            });
            resolve();
          } else  {
            if (theRef.endsWith("_alt")) {
              me.vcfRefName = theRef;
              me.vcfRefNamesMap[theRef] = theRef;
              me.getVcfRefName = me._getRefName;
              resolve()
            } else {
              // If we didn't find the matching ref name, show a warning.
              reject();

            }
          }
         })
         .catch(function(error) {
            reject(error)
         })

      }
    });

  }



  _getRefName(refName) {
    let me = this;
    return me._translateRefName(refName);
  }

  _stripRefName(refName) {
    let me = this;
    var tokens = refName.split("chr");
    var strippedName = refName;
    if (tokens.length > 1) {
      strippedName = tokens[1];
    } else {
      tokens = refName.split("ch");
      if (tokens.length > 1) {
        strippedName = tokens[1];
      }
    }
    return me._translateRefName(strippedName);
  }
  
  _translateRefName(refName) {
    let me = this;
    let theRefName = me.vcfRefNamesMap[refName]
    if (theRefName) {
      return theRefName;
    } else {
      return refName;
    }
  }


  promiseGetMatchingVariant(variant, geneObject, transcript) {
    var me = this;
    return new Promise(function(resolve, reject) {
      var theVcfData = me.promiseGetVcfData(geneObject, transcript)
       .then(function(data) {
        if (data != null && data.vcfData != null) {
          var theVcfData = data.vcfData;
          var matchingVariant = null;
          if (theVcfData && theVcfData.features) {
            theVcfData.features.forEach(function(v) {
              if (v.start == variant.start
                  && v.ref == variant.ref
                  && v.alt == variant.alt) {
                matchingVariant = v;
              }
            });
          }
          resolve(matchingVariant);
        } else {
          var msg = "Unable to get vcf data in SampleModel.promiseGetMatchingVariant() for gene " + geneObject.gene_name;
          console.log(msg);
          if (variant.isProxy && variant.notFound) {
            resolve(variant);
          } else {
            reject(msg);
          }
        }
       })
       .catch( function(error) {
          console.log(error);
          if (variant.isProxy && variant.notFound) {
            resolve(variant);
          } else {
            reject(error);
          }
       })

    });
  }

  /*
  * A gene has been selected. Clear out the model's state
  * in preparation for getting data.
  */
  wipeGeneData() {
    var me = this;
    this.vcfData = null;
    this.fbData = null;
    this.bamData = null;
  }



  promiseGetBamDepth(gene, selectedTranscript) {
    var me = this;

    return new Promise(function(resolve, reject) {
      if (!me.isBamLoaded()) {
        reject("Cannot get bam depth because file or URL not specified");
      }

      var performCallbackForCachedData = function(regions, theVcfData, coverageData) {
        if (regions.length > 0) {
          me._refreshVariantsWithCoverage(theVcfData, coverageData, function() {
            resolve({'coverageData': coverageData, 'model': me})
          });
        } else {
          resolve({'coverageData': coverageData, 'model': me})
        }
      }

      var performCallback = function(regions, theVcfData, coverageForRegion, coverageForPoints) {
        if (regions.length > 0) {
          me._refreshVariantsWithCoverage(theVcfData, coverageForPoints, function() {
            resolve({'coverageData': coverageForRegion, 'model': me})
          });
        } else {
          resolve({'coverageData': coverageForRegion, 'model': me})
        }
      }


      // A gene has been selected.  Read the bam file to obtain
      // the read coverage.
      var refName = me.getBamRefName(gene.chr);
      me.promiseGetVcfData(gene, selectedTranscript)
      .then(function(data) {
        var theVcfData = data.vcfData;
        var regions = [];
        // We we have variants, get the positions for each variant.  This will
        // be provided for the service to get coverage data so that specific
        // base coverage is also returned.
        if (theVcfData != null) {
          me.flagDupStartPositions(theVcfData.features);
          if (theVcfData) {
            theVcfData.features.forEach( function(variant) {
              if (!variant.dup) {
                regions.push({name: refName, start: variant.start - 1, end: variant.start });
              }
            });
          }
        }
        // Get the coverage data for the gene region
        // First the gene vcf data has been cached, just return
        // it.  (No need to retrieve the variants from the iobio service.)
        me._promiseGetData(CacheHelper.BAM_DATA, gene.gene_name)
        .then(function(data) {
          if (data != null && data != '') {
            me.bamData = data;

            performCallbackForCachedData(regions, theVcfData, data.coverage);

          } else {
            me.bam.promiseGetCoverageForRegion(refName, gene.start, gene.end, regions, 2000, me.globalApp.useServerCache)
            .then( function(data) {
              let coverageForRegion = data.coverageForRegion;
              let coverageForPoints = data.coverageForPoints;

              if (coverageForRegion != null) {
              me.bamData = {gene: gene.gene_name,
                          ref: refName,
                          start: gene.start,
                          end: gene.end,
                          coverage: coverageForRegion};

              // Use browser cache for storage coverage data if app is not relying on
              // server-side cache
              if (!me.globalApp.useServerCache) {
                me._promiseCacheData(me.bamData, CacheHelper.BAM_DATA, gene.gene_name)
                 .then(function() {
                  performCallback(regions, theVcfData, coverageForRegion, coverageForPoints);
                 })
              } else {
                performCallback(regions, theVcfData, coverageForRegion, coverageForPoints);
              }
              } else {
                performCallback(regions, theVcfData, coverageForRegion, coverageForPoints);
              }

            })
            .catch(function (error) {
              reject(error)
            })
          }

         })
         .catch(function(error) {
          reject(error)
         })

       })
       .catch(function(error) {
        reject(error)
       })



    })


  }



  promiseAnnotated(theVcfData) {
    var me = this;
    return new Promise( function(resolve, reject) {
      if (theVcfData != null &&
        theVcfData.features != null &&
        theVcfData.loadState != null &&
         //(dataCard.mode == 'single' || theVcfData.loadState['inheritance'] == true) &&
        theVcfData.loadState['clinvar'] == true ) {

        resolve();

      } else {
        reject();
      }

    });

  }

  promiseAnnotatedAndCoverage(theVcfData) {
    var me = this;
    return new Promise( function(resolve, reject) {
      if (theVcfData != null &&
        theVcfData.features != null &&
        theVcfData.loadState != null &&
         (dataCard.mode == 'single' || theVcfData.loadState['inheritance'] == true) &&
        theVcfData.loadState['clinvar'] == true  &&
        (!me.isBamLoaded() || theVcfData.loadState['coverage'] == true)) {

        resolve();

      } else {
        reject();
      }

    });

  }

  promiseGetVariantExtraAnnotations(theGene, theTranscript, variant, format, getHeader = false, sampleNames) {
    const me = this;

    return new Promise( function(resolve, reject) {


      // Create a gene object with start and end reduced to the variants coordinates.
      var fakeGeneObject = $().extend({}, theGene);
      fakeGeneObject.start = variant.start;
      fakeGeneObject.end = variant.end;

      if ((variant.fbCalled == 'Y' || variant.extraAnnot) && format != "vcf") {
        // We already have the hgvs and rsid for this variant, so there is
        // no need to call the services again.  Just return the
        // variant.  However, if we are returning raw vcf records, the
        // services need to be called so that the info field is formatted
        // with all of the annotations.
        if (format && (format == 'csv' || format == 'json')) {
          // Exporting data requires additional data to be returned to link
          // the extra annotations back to the original bookmarked entries.
          resolve([variant, variant, ""]);
        } else {
          resolve(variant);
        }
      } else {
        var sourceVariant = variant;
        me._promiseVcfRefName(theGene.chr).then( function() {
          me.vcf.promiseGetVariants(
             me.getVcfRefName(theGene.chr),
             fakeGeneObject,
               theTranscript,
               null,   // regions
               false,  // is multi-sample
               me._getSamplesToRetrieve(),  // sample names
               me.getAnnotationScheme().toLowerCase(), // annot scheme
               me.getTranslator().clinvarMap,  // clinvar map
               me.getGeneModel().geneSource == 'refseq' ? true : false,
               true,  // hgvs notation
               true,  // rsid
               me.globalApp.useServerCache, // serverside cache
               false, // sfari mode
               true // decompose
            ).then( function(data) {

              var rawVcfRecords = data[0];
              var vcfRecords = rawVcfRecords.filter(function(record) {
                if (record.indexOf("#") == 0) {
                  if (getHeader) {
                    return true;
                  } else {
                    return false;
                  }
                } else if (record != "") {
                  var fields = record.split("\t");
                  var chrom = fields[0];
                  var start = fields[1];
                  var ref   = fields[3];
                  var alt   = fields[4];
                  var found = false;
                  alt.split(",").forEach(function(theAlt) {
                    if (!found &&
                      me.getVcfRefName(theGene.chr) == chrom &&
                      start    == variant.start &&
                        theAlt   == variant.alt &&
                      ref      == variant.ref) {
                      found = true;
                    }

                  })
                  return found;
                }
              });


              var theVcfData = data[1];

              // todo: left off thinking maybe give tabix the -0 option to indicate zero based coordinate system?
              if (theVcfData != null && theVcfData.features != null && theVcfData.features.length > 0) {
                // Now update the hgvs notation on the variant
                var matchingVariants = theVcfData.features.filter(function(aVariant) {
                  var matches =
                       ( +variant.start == aVariant.start &&
                         variant.alt   == aVariant.alt &&
                         variant.ref   == aVariant.ref );
                  return matches;
                });
                if (matchingVariants.length > 0) {
                  var v = matchingVariants[0];
                  if (format && (format == 'csv' || format == 'json')) {
                    resolve([v, variant, vcfRecords]);
                  } else if (format && format == 'vcf') {
                    if (vcfRecords) {
                      resolve([v, variant, vcfRecords]);
                    } else {
                      reject('Cannot find vcf record for variant ' + theGene.gene_name + " " + variant.start + " " + variant.ref + "->" + variant.alt);
                    }
                  } else {
                    me.promiseGetVcfData(theGene, theTranscript)
                    .then(function(data) {
                      var cachedVcfData = data.vcfData;
                      if (cachedVcfData) {
                        var theVariants = cachedVcfData.features.filter(function(d) {
                          if (d.start == v.start &&
                            d.alt == v.alt &&
                            d.ref == v.ref) {
                            return true;
                          } else {
                            return false;
                          }
                        });
                        if (theVariants && theVariants.length > 0) {
                          var theVariant = theVariants[0];

                          // set the hgvs and rsid on the existing variant
                          theVariant.extraAnnot      = true;
                          sourceVariant.extraAnnot   = true;
                          var extraAnnotFields = [
                            'vepConsequence',
                            'vepImpact',
                            'vepExon',
                            'vepHGVSc',
                            'vepHGVSp',
                            'vepAminoAcids',
                            'vepVariationIds',
                            'vepSIFT',
                            'vepPolyPhen',
                            'vepRegs',
                            'regulatory',
                            'highestImpactVep',
                            'highestSIFT',
                            'highestPolyphen',
                            'gnomAD'
                            ];
                          extraAnnotFields.forEach(function(field) {
                            theVariant[field]        = v[field];
                            sourceVariant[field]     = v[field];
                          })



                          // re-cache the data
                          me._promiseCacheData(cachedVcfData, CacheHelper.VCF_DATA, theGene.gene_name, theTranscript)
                          .then(function() {
                            // return the annotated variant
                            resolve(theVariant);
                           })
                          .catch( function(error) {
                            let msg = "Problem caching data in SampleModel.promiseGetVariantExtraAnnotations(). Try refreshing the page.";
                            console.log(msg);
                            reject(msg);
                          });
                          resolve(theVariant);

                        } else {
                          var msg = "Cannot find corresponding variant to update HGVS notation for variant <pre>" + v.chrom + " " + v.start + " " + v.ref + "->" + v .alt + "</pre> in gene <pre>" + theGene.gene_name + "</pre>";
                          console.log(msg)
                          reject(msg);
                        }
                      } else {
                        var msg = "Unable to update gene vcfData cache with updated HGVS notation for variant <pre>" + v.chrom + " " + v.start + " " + v.ref + "->" + v.alt + "</pre> in gene <pre>" + theGene.gene_name + "</pre>";
                        console.log(msg);
                        reject(msg);

                      }

                    })
                    .catch(function(error) {
                      console.log(error)
                      reject(error)
                    })
                  }
                } else {
                  var msg = "Cannot find matching vcf records SampleModel.promiseGetVariantExtraAnnotations() for variant <pre>" + variant.chrom + " " + variant.start + " " + variant.ref + "->" + variant.alt +"</pre>. Try refreshing the page.";
                  console.log(msg);
                  if (format == 'gemini' || format == 'csv' || format == 'json' || format == 'vcf') {
                    variant.notFound = true;
                    variant.isUserFlagged = false;
                    resolve([variant, variant, []]);
                  } else {
                   reject(msg);
                  }
                }
              } else {
                var msg = "Empty results returned from SampleModel.promiseGetVariantExtraAnnotations() for variant <code>" + variant.chrom + " " + variant.start + " " + variant.ref + "->" + variant.alt + "</code>";
                console.log(msg);
                if (format == 'gemini' || format == 'csv' || format == 'json' || format == 'vcf') {
                  variant.notFound = true;
                  variant.isUserFlagged = false;
                  resolve([variant, variant, []]);
                }
                reject(msg);
              }

          });
        });
      }
    });

  }

  promiseGetImpactfulVariantIds(theGeneObject, theTranscript) {
    var me = this;


    return new Promise( function(resolve, reject) {

      var trRefName = null;

      me._promiseVcfRefName(theGeneObject.chr)
       .then( function() {
        trRefName = me.getVcfRefName(theGeneObject.chr);

        // Get the coords for variants of high or moder impact
        return me.promiseGetVcfData(theGeneObject, theTranscript)
       })
       .then( function(data) {
        var theVcfData = data.vcfData;

        var regions   = theVcfData.features.filter(function(variant) {
          if (variant.gnomAD.hasOwnProperty('af')) {
            // This is a pre 4.11 variant. Refresh so that gnomAD fields
            // are in expected format
            return true;
          } else if (variant.fbCalled == 'Y')  {
            return false;
          } else if (variant.extraAnnot) {
            return false;
          } else {
            return (variant.vepImpact['HIGH'] || variant.vepImpact['MODERATE']);
          }
        }).map(function(variant) {
          return {name: trRefName, start: variant.start, end: variant.end};
        })



        if (regions.length > 0) {

          me.vcf.promiseGetVariants(
             trRefName,
             theGeneObject,
               theTranscript,
               regions,   // regions
               false,        // is multi-sample
               me._getSamplesToRetrieve(),  // sample names
               me.getAnnotationScheme().toLowerCase(), // annot scheme
               me.getTranslator().clinvarMap,  // clinvar map
               me.getGeneModel().geneSource == 'refseq' ? true : false,
               true,  // hgvs notation
               true,  // rsid
               me.globalApp.useServerCache, // serverside cache
               false, // sfari mode
               true // decompose
            ).then( function(data) {

              var annotVcfData = data[1];

              if (annotVcfData != null && annotVcfData.features != null && annotVcfData.features.length > 0) {
                // refresh the variants with the variant ids
                me._refreshVariantsWithVariantIds(theVcfData, annotVcfData);
                me._promiseCacheData(theVcfData, CacheHelper.VCF_DATA, theGeneObject.gene_name, theTranscript)
                 .then(function() {
                  me.theVcfData = theVcfData;
                  resolve(theVcfData.features);
                 },
                 function(error) {
                  var msg = "Problem caching data in SampleModel.promiseGetImpactfulVariantIds(): " + error;
                  console.log(msg);
                  reject(msg);
                 })
              } else {
                var msg = "Empty results returned from SampleModel.promiseGetImpactfulVariantIds() for gene " + theGeneObject.gene_name;
                console.log(msg);
                resolve(theVcfData.features);
              }

          });

        } else {
          resolve(theVcfData.features);
        }

       })
       .catch( function(error) {
        console.log(error);
        reject(error);
       })


    });

  }


  promiseAnnotateSfariVariants(theGene, theTranscript, sampleModels, options) {
      let self = this;

      return new Promise(function (resolve, reject) {
          let isMultiSample = options.isMultiSample;
          let isBackground = options.isBackground;

          let resultMap = {};
          let dataPromises = [];
          sampleModels.forEach((model) => {
              let p = model._promiseGetData(CacheHelper.VCF_DATA, theGene.gene_name, theTranscript)
                  .then(function (vcfData) {
                      if (vcfData != null && vcfData !== '') {
                          resultMap[model.relationship] = vcfData;

                          if (!isBackground) {
                              model.vcfData = vcfData;
                              model.fbData = self.reconstituteFbData(vcfData);
                          }
                      }
                  });
              dataPromises.push(p);
          });
          Promise.all(dataPromises)
            .then(function () {
                if (Object.keys(resultMap).length === sampleModels.length) {
                    resolve(resultMap);
                } else {
                    // We don't have the variants for the gene in cache,
                    // so call the iobio services to retrieve the variants for the gene region
                    // and annotate them.
                    self._promiseVcfRefName(theGene.chr, true)  // True for sfariMode
                        .then(() => {
                            let annoPromises = [];
                            let annoResults = [];
                            self.sfariVcfs.forEach((vcf) => {
                                let p = vcf.promiseGetVariants(
                                    self.getVcfRefName(theGene.chr),
                                    theGene,
                                    theTranscript,
                                    null,   // regions
                                    isMultiSample, // is multi-sample
                                    self.samples,   // want variants for all sfari samples
                                    self.getRelationship() === 'known-variants' ? 'none' : self.getAnnotationScheme().toLowerCase(),
                                    self.getTranslator().clinvarMap,
                                    self.getGeneModel().geneSource === 'refseq',
                                    false,  // hgvs notation
                                    false,  // rsid
                                    false,  // server-side cache
                                    true, // sfariMode
                                    false // decompose
                                    ).then((results) => {
                                      let unwrappedResults = results[1];
                                      unwrappedResults.gene = theGene;
                                      annoResults.push(unwrappedResults);
                                    })
                                annoPromises.push(p);
                            });
                            Promise.all(annoPromises)
                              .then(() => {
                                  self.promiseCombineVariants(annoResults)
                                      .then((combinedVcfData) => {
                                        self.vcfData = combinedVcfData;
                                        let resultMap = {};
                                        resultMap['sfari-variants'] = combinedVcfData;
                                        resolve(resultMap);
                                      })
                                      .catch((error) => {
                                        reject('Problem in combining variants: ' + error);
                                      })
                              })
                              .catch((error) => {
                                reject("Problem in getting SFARI variants: " + error)
                              })
                        });
                }
            })
      })
  }

  /* Given a list of annotationResults, combines the feature subobjects within. When variants are combined, we
   * only take the FIRST instance of the variant with that matching information. We do NOT combine any information
   * across multiple files. Returns an annotation object with the features subobject containing the combined, ordered variant list. */
  promiseCombineVariants(annotationResults) {
    return new Promise((resolve, reject) => {

      // If we only have one vcf, just return the first object;
      if (annotationResults.length === 1) {
        resolve(annotationResults[0]);
      } else {

        // Iniitalize combined list
        let combinedFeatures = annotationResults[0].features;

        // Initialize hash to avoid dups
        let combinedHash = {};
        combinedFeatures.forEach((feature) => {
            combinedHash[feature.id] = true;
          });
        // Add remaining unique vars
        for (let i = 1; i < annotationResults.length; i++) {
            let currFeatures = annotationResults[i].features;
            currFeatures.forEach((currFeature) => {
              if (!combinedHash[currFeature.id]) {
                combinedHash[currFeature.id] = true;
                combinedFeatures.push(currFeature);
              }
            });
        }
        // Reassign features for first vcf object & return
        annotationResults[0].features = combinedFeatures;
        annotationResults[0].count = combinedFeatures.length;
        resolve(annotationResults[0]);
      }
    })
  }

  /* Returns existing cached ClinVar variants if they exist and match the pathogenicityCategories provided.
   * Otherwise, returns null. */
  _checkExistingClinvarData(pathogenicityCategories, selectedGene, selectedTranscript, variantModel) {
    const me = this;

    if (_.isEqual(pathogenicityCategories, me.lastFetchedPathoFilters) && selectedGene === me.lastFetchedClinvarGene
      && selectedTranscript === me.lastFetchedClinvarTrans) {
      return variantModel.vcfData;
    } else {
      return null;
    }
  }

  promiseGetClinvarVariants(theGene, theTranscript, variantModel, pathogenicityCategories) {
    const me = this;

    // Check to see if pathogenicityCats empty - this can happen when switching genes with clinvar track open
    // If so, default to last ones set
    if (pathogenicityCategories == null) {
      pathogenicityCategories = this.lastFetchedPathoFilters;
    }

    return new Promise((resolve, reject) => {
      let resultMap = {};

      // If we haven't changed pathogenicity filters, can re-display variants pulled back
      let vcfData = me._checkExistingClinvarData(pathogenicityCategories, theGene.gene_name, theTranscript.transcript_id, variantModel);
      if (vcfData != null && vcfData != '') {
        resultMap[variantModel.relationship] = vcfData;
        variantModel.vcfData = vcfData;
        variantModel.fbData = me.reconstituteFbData(vcfData);
        resolve(resultMap);
      } else {
        // Otherwise call service
        me._promiseVcfRefName(theGene.chr)
        .then(() => {
          let refName = me.getVcfRefName(theGene.chr);
          let regions = null;
          return me.vcf.promiseGetClinvarVariants(
              refName,
              theGene,
              theTranscript,
              regions,   // regions
              me.getTranslator().clinvarMap,
              pathogenicityCategories
          );
        })
        .then(function (results) {
          if (results) {
            let data = results[1];
            let theGeneObject = me.getGeneModel().geneObjects[data.gene.toUpperCase()];
            if (theGeneObject) {
              let resultMap = {};
              let model = variantModel;

              // Set the gene object on each variant
              data.gene = theGeneObject;
              data.features.forEach(function (variant) {
                variant.gene = theGeneObject;
              })
              resultMap[model.relationship] = data;
              model.vcfData = data;

              // Set the af and highest allele freq for all variants
              for (var key in resultMap) {
                let theVcfData = resultMap[key];
                if (theVcfData && theVcfData.features) {
                  theVcfData.features.forEach(function (variant) {
                    me._determineHighestAf(variant);
                    me._determineAf(variant);
                  })
                  model.vcfData['count'] = model.vcfData.features.length;
                }
              }

              // Log last fetched pathogenicity categories
              me.lastFetchedPathoFilters = pathogenicityCategories;
              me.lastFetchedClinvarGene = theGene.gene_name;
              me.lastFetchedClinvarTrans = theTranscript.transcript_id;

              resolve(resultMap);

            } else {
              let msg = "Cannot locate gene object to match with vcf data <pre>" + data.ref + " " + data.start + "-" + data.end + "</pre> Try refreshing the page.";
              console.log(msg);
              reject(msg);
            }
          } else {
            let msg = "Empty clinvar vcf results for " + theGene.gene_name;
            reject(msg, theGene.gene_name)
          }
        })
        .catch(error => {
          reject(error)
        });
      }
    });
  }

  promiseAnnotateVariants(theGene, theTranscript, variantModels, options, onVcfData) {
    var me = this;

    return new Promise( function(resolve, reject) {

      let isMultiSample = options.isMultiSample;
      let isBackground = options.isBackground;
      let refName = null;



      me._promiseVcfRefName(theGene.chr)
      .then( function() {
        refName = me.getVcfRefName(theGene.chr);

        // First the gene vcf data has been cached, just return
        // it.  (No need to retrieve the variants from the iobio service.)
        var resultMap = {};
        var promises = [];
        var bookmarkPromises = [];
        variantModels.forEach(function(model) {
          var p = model._promiseGetData(CacheHelper.VCF_DATA, theGene.gene_name, theTranscript)
           .then(function(vcfData) {
            if (vcfData != null && vcfData != '') {
              resultMap[model.relationship] = vcfData;

              if (!isBackground) {
                model.vcfData = vcfData;
                model.fbData = me.reconstituteFbData(vcfData);
              }
            }
           })
           promises.push(p);
        })



        Promise.all(promises)
        .then(function() {
          if (Object.keys(resultMap).length === variantModels.length || me.isAlignmentsOnly()) {
            resolve(resultMap);
          } else {

            // We don't have the variants for the gene in cache,
            // so call the iobio services to retrieve the variants for the gene region
            // and annotate them.
            me._promiseVcfRefName(theGene.chr)
            .then( function() {
              let refName = me.getVcfRefName(theGene.chr);

              var regions = null;
              if (options.analyzeCodingVariantsOnly) {
                var exons = theTranscript.features.filter(function(feature) {
                  return (feature.feature_type.toUpperCase() == 'CDS');
                });

                // Capture only of the exon regions with a (5 bp range before and after exon) from the transcript
                regions =  exons.map(function(feature, i) {
                  var start = +feature.start - me.CODING_REGION_BUFFER;
                  var end   = +feature.end + me.CODING_REGION_BUFFER;
                  if (i > 0) {
                    var prevFeature = exons[i-1];
                    if (+prevFeature.end >= start) {
                      start = +prevFeature.end - (+prevFeature.end - start);
                    }
                  }
                  return {name: refName, start: start, end: end};
                }).sort(function(a,b) {
                    return a.start - b.start
                });
              }

              return me.vcf.promiseGetVariants(
                 refName,
                 theGene,
                 theTranscript,
                 regions,   // regions
                 isMultiSample, // is multi-sample
                 me._getSamplesToRetrieve(),
                 'none',
                 me.getTranslator().clinvarMap,
                 me.getGeneModel().geneSource === 'refseq' ? true : false,
                 options.getKnownVariants ? false : (me.isBasicMode || me.globalApp.getVariantIdsForGene),  // hgvs notation
                 options.getKnownVariants ? false : me.globalApp.getVariantIdsForGene,  // rsid
                 false, // serverside cache
                 false, // sfari mode
                 !me.isEduMode, // decompose
                 options.bypassAnnotate ? true : false
                );
            })
            .then( function(data) {

              var annotatedRecs = data[0];
              var results = data[1];

              if (!isMultiSample) {
                results = [results];
              }

              if (results && results.length > 0) {
                var data = results[0];

                var theGeneObject = me.getGeneModel().geneObjects[data.gene.toUpperCase()];
                if (theGeneObject) {

                  var resultMap = {};
                  var idx = 0;

                  var postProcessNextVariantCard = function(idx, callback) {
                    if (idx == variantModels.length) {
                      if (callback) {
                        callback();
                      }
                      return;
                    } else {
                      var model          = variantModels[idx];
                      var theVcfData  = results[idx];
                      if (theVcfData == null) {
                        if (callback) {
                          callback();
                        }
                        return;
                      }

                      // Set the gene object on each variant
                      theVcfData.gene = theGeneObject;
                      theVcfData.features.forEach(function(variant) {
                        variant.gene = theGeneObject;
                      })
                      resultMap[model.relationship] = theVcfData;

                      if (!isBackground) {
                        model.vcfData = theVcfData;
                      }
                      idx++;
                      postProcessNextVariantCard(idx, callback);

                    }
                  }

                  postProcessNextVariantCard(idx, function() {


                    // Set the af and highest allele freq for all variants
                    for (var key in resultMap) {
                      var theVcfData = resultMap[key];
                      if (theVcfData && theVcfData.features) {
                        theVcfData.features.forEach(function(variant) {
                          me._determineHighestAf(variant);
                          me._determineAf(variant);
                        })
                      }
                    }


                    resolve(resultMap);

                  });

                } else {
                  let msg = "Cannot locate gene object to match with vcf data " + data.ref + " " + data.start + "-" + data.end + ".";
                  reject(msg);
                }
              } else {
                let msg = "Empty vcf results for " + theGene.gene_name;
                reject(msg)
              }
            })
            .catch( function(error) {
              let msg = "Could not annotate variants due to server error. Error: " + error;
              reject(msg)
            });
          }
        })
        .catch(function(error) {
          let msg = "Could not annotate variants. An error occurred when getting cached vcf data. Error:  " + error;
          console.log(msg);
          reject(msg)
        });

      })
      .catch( function(error) {
        let msg = "Could not annotate variants. The variant file does not contain the reference <pre>" + theGene.chr;
        msg += "</pre> for gene <pre>" + theGene.gene_name + "</pre>.";

        if (theGene.chr.indexOf('alt') > 0 && theGene.gene_name.indexOf("HLA") == 0) {
          msg += " Many HLA genes reside in a region of the genome that is highly polymorphic. "
          + "These regions are represented in alternative references and are often omitted from "
          + "variant calling pipelines. "
          + "This variant file does not contain this alternative reference; "
          + "therefore no information can be shown."
        } else if (theGene.chr.indexOf('alt') > 0) {
          msg += "  There are some 'alternative contigs' that are alternative sequences that are seen in "
          + "some individuals. Some genes only fall in these alternative contigs, but "
          + "gene.iobio can only show variants that appear on the main reference."
        }
        console.log(msg);
        console.log(error)
        reject(msg)

      })


    });

  }

  determineAffectedStatus(data, theGene, theTranscript, affectedInfo, callback) {
    var me = this;


    var promise = null;
    if (data != null) {
      promise = new Promise(function(resolve, reject) {
        resolve(data);
      })
    } else {
      promise = me._promiseGetData(CacheHelper.VCF_DATA, theGene.gene_name, theTranscript);
    }

    var theVcfData = null;

    promise.then(function(data) {
      theVcfData = data;

      var affectedSibs = affectedInfo.filter(function(info) {
        return info.status == 'affected' && info.relationship == 'sibling';
      })
      me._determineAffectedStatusImpl(theVcfData, 'affected', affectedSibs)

      var unaffectedSibs = affectedInfo.filter(function(info) {
        return info.status == 'unaffected' && info.relationship == 'sibling';
      })
      me._determineAffectedStatusImpl(theVcfData, 'unaffected', unaffectedSibs)

      // For some reason, vcf data is reset to pre determineSibStatus unless we clear out vcfData
      // at this point
      //me.vcfData = null;

      if (callback) {
        callback(theVcfData);
      }

    },
    function(error) {
      var msg = "An error occurred in SampleModel.determineAffectedStatus(): " + error;
      console.log(msg);
      if (callback) {
        callback(null);
      }
    })


  }

  promiseDetermineCompoundHets(data, theGene, theTranscript) {
    var me = this;

    return new Promise(function(resolve, reject) {

      var dataPromise = null;
      if (data != null) {
        dataPromise = Promise.resolve(data);
      } else {
        dataPromise = me._promiseGetData(CacheHelper.VCF_DATA, theGene.gene_name, theTranscript);
      }

      dataPromise.then(function(data) {
        var theVcfData = data;
        var candidateVariants = {
          'mother': [],
          'father': []
        }

        theVcfData.features.forEach(function(variant) {
          let passes = me.cohort.filterModel.determinePassCriteria('compoundHet', variant, {'ignore': ['inheritance']});
          if (passes.all && variant.inheritance.indexOf('n/a') >= 0 && variant.zygosity && variant.zygosity.toUpperCase() != 'HOMREF') {
            // Create a bag of candidate variants inherited from mother and another one for variants
            // inherited by father
            var fromMother = false;
            if (variant.motherZygosity && (variant.motherZygosity.toLowerCase() == 'het' || variant.motherZygosity.toLowerCase() == 'hom')) {
              fromMother = true;
            }
            var fromFather = false;
            if (variant.fatherZygosity && (variant.fatherZygosity.toLowerCase() == 'het' || variant.fatherZygosity.toLowerCase() == 'hom')) {
              fromFather = true;
            }
            if (fromMother && fromFather) {
              // ignore variants that are inherited from both mom and dad
            } else if (fromMother) {
              candidateVariants.mother.push(variant);
            } else if (fromFather) {
              candidateVariants.father.push(variant);
            }
          }
        })



        // Associate all possible compoundHet variants with a variant
        for (var key in candidateVariants) {
          var theVariants = candidateVariants[key];
          theVariants.forEach(function(theVariant) {
            for (var otherKey in candidateVariants) {
              if (otherKey != key) {
                var otherVariants = candidateVariants[otherKey];
                otherVariants.forEach(function(otherVariant) {
                  if (theVariant != otherVariant) {
                    if (theVariant.compoundHets == null) {
                      theVariant.compoundHets = [];
                    }
                    if (theVariant.inheritance == null || theVariant.inheritance.indexOf('n/a') >= 0) {
                      theVariant.inheritance = 'compound het';
                    }
                    let proxyVariant = {
                      chrom: otherVariant.chrom,
                      start: otherVariant.start,
                      ref:   otherVariant.ref,
                      alt:   otherVariant.alt
                    }
                    theVariant.compoundHets.push(proxyVariant);
                  }
                })
              }
            }
          })
        }

        resolve(theVcfData);


      })
      .catch(function(error) {
        var msg = "An error occurred in SampleModel.determineCompoundHets(): " + error;
        console.log(msg);
        reject(msg);
      })
    })



  }



  _determineAf(variant) {
    var me = this;
    // Find the gnomAD af (summarized)
    variant.af = "unknown";
    variant.afSource = "";

    if (variant.gnomAD.genomes && variant.gnomAD.genomes.af) {
      variant.af = $.isNumeric(variant.gnomAD.genomes.af) ? variant.gnomAD.genomes.af : ".";
      variant.afSource = 'gnomAD genomes';
    } else {
      variant.af = null;
      variant.afSource = 'gnomAD genomes';
    }
  }

  _calculateCombinedAf(alleleCounts, alleleTotals) {
    let acTot = alleleCounts.reduce(function(tot, ac) {
              return tot + ((ac && $.isNumeric(ac)) ? +ac : 0);
            }, 0)
    let anTot = alleleTotals.reduce(function(tot, an) {
      return tot + ((an && $.isNumeric(an)) ? +an : 0);
    }, 0)

    let afTot = anTot > 0 ? (acTot / anTot) : 0;
    return afTot;
  }

  _determineHighestAf(variant) {
    var me = this;
    // Find the highest value (the least rare AF)
    variant.afHighest = "unknown";
    variant.afFieldHighest = null;

    if (variant.gnomAD.genomes
      && variant.gnomAD.genomes.afPopMax
      && $.isNumeric(variant.gnomAD.genomes.afPopMax)) {
      variant.afFieldHighest = 'gnomAD.genomes.afPopMax';
      variant.afHighest = me.getHighestAf(variant);
    } else if (variant.gnomAD.genomes
      && variant.gnomAD.genomes.afPopMax
      && variant.gnomAD.genomes.afPopMax == '.') {
      variant.afFieldHighest = 'gnomAD.genomes.afPopMax';
      variant.afHighest = 0;
    } else {
      variant.afFieldHighest = null;
      variant.afHighest = 'unknown';
    }
  }

  getHighestAf(variant) {
    var me = this;
    if (variant.afFieldHighest) {
      var subfields = variant.afFieldHighest.split(".");
      var current = variant;
      subfields.forEach(function(subfield) {
        current = current[subfield];
      })
      if (current && $.isNumeric(current)) {
        return +current;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }


  _determineAffectedStatusImpl(theVcfData, affectedStatus, affectedInfo) {
    var me = this;
    theVcfData.features.forEach( function(variant) {
      SampleModel._determineAffectedStatusForVariant(variant, affectedStatus, affectedInfo);
    });
  }




  promiseIsCached(geneName, transcript) {
    var me = this;

    return new Promise(function(resolve, reject) {
      var key = me._getCacheKey(CacheHelper.VCF_DATA, geneName.toUpperCase(), transcript);
      me.getCacheHelper().promiseGetData(key)
       .then(function(data) {
        resolve(data != null && data != "");
       },
       function(error) {
        reject(error);
       })

    })
  }

  promiseIsCachedAndInheritanceDetermined(geneObject, transcript, checkForCalledVariants) {
    var me = this;
    return new Promise(function(resolve, reject) {
      me._promiseGetData(CacheHelper.VCF_DATA, geneObject.gene_name, transcript)
       .then(function(theVcfData) {
        me.promiseGetFbData(geneObject, transcript, true)
         .then(function(data) {
          var theFbData = data.fbData;
          var vcfDataCached = theVcfData && theVcfData.loadState != null && (dataCard.mode == 'single' || theVcfData.loadState['inheritance']);
          resolve(vcfDataCached && (!checkForCalledVariants || (theFbData && theFbData.features)));
         })
       },
       function(error) {
        var msg = "A problem occurred in SampleModel.promiseIsCachedAndInheritanceDetermined(): " + error;
        console.log(msg);
        reject(msg);
       });

    })
  }



  _getCacheKey(dataKind, geneName, transcript) {
    var me = this;
    return me.getCacheHelper().getCacheKey(
      {relationship: this.getRelationship(),
       sample: (this.sampleName != null ? this.sampleName : "null"),
       gene: (geneName != null ? geneName : gene.gene_name),
       transcript: (transcript != null ? transcript.transcript_id : "null"),
       annotationScheme: (me.getAnnotationScheme().toLowerCase()),
       dataKind: dataKind
      }
    );

  }
  promiseCacheDangerSummary(dangerSummary, geneName) {
    return this._promiseCacheData(dangerSummary, CacheHelper.DANGER_SUMMARY_DATA, geneName);
  }

  clearCacheItem(dataKind, geneName, transcript) {
    var me = this;
    var key = me._getCacheKey(dataKind, geneName, transcript);
    me.getCacheHelper().promiseRemoveCacheItem(dataKind, key);
  }

  /*
  pruneIntronVariants = function(data) {
    if (data.features.length > 500) {
      filterCard.setExonicOnlyFilter();
    } else {
      filterCard.setExonicOnlyFilter(false);
    }
  }
  */

  _getSamplesToRetrieve() {
    var me = this;
    var samplesToRetrieve = [];

    if (me.getVcfSampleName()) {
      samplesToRetrieve.push( {vcfSampleName: me.getVcfSampleName(),
                             sampleName:    me.getSampleName() } );

      // Include all of the sample names for the proband
      me.getAffectedInfo().forEach(function(info) {
        if (info.model == me) {
          // ignore the affected info for this sample.  We already added it
          // to the list of samples to retrieve

        } else if (info.model.getVcfSampleName() && me.doesContainOtherSample(info.model) ) {
          // If the 'other' sample exists in the sample multi-sample vcf as this sample,
          // add it to the list of samples to retrieve.  For example, an affected sib could be in the
          // mother's vcf file.   In this case, we will retreive both the mother and affected sib at
          // the same time so we can obtain the genotype for the affected sib and sync up to the
          // proband later (when inheritance is determined)
          samplesToRetrieve.push( {vcfSampleName: info.model.getVcfSampleName(),
                                 sampleName:    info.model.getSampleName() } );
        }
      })

    } else {
      samplesToRetrieve.push( {vcfSampleName: "",
                             sampleName:    me.getSampleName() } );
    }

    return samplesToRetrieve;

  }

  doesContainOtherSample(otherModel) {
    let self = this;
    let hasSample = false;

    if (self.samples && otherModel.sampleName) {
      hasSample = self.samples.indexOf(otherModel.sampleName) >= 0;
    }

    return hasSample;
  }


  _pileupVariants(features, start, end) {
    var me = this;
    var width = 1000;
    var theFeatures = features;
    theFeatures.forEach(function(v) {
      v.level = 0;
    });

    let currVcf = me.vcf;
    if (me.name === 'SFARI') {
      currVcf = me.sfariVcfs[0];
    }

    var featureWidth = me.isEduMode || me.isBasicMode ? me.globalApp.eduModeVariantSize : 4;
    var posToPixelFactor = Math.round((end - start) / width);
    var widthFactor = featureWidth + ( me.isEduMode || me.isBasicMode ? me.globalApp.eduModeVariantSize * 2 : 4);
    var maxLevel = currVcf.pileupVcfRecords(theFeatures, start, posToPixelFactor, widthFactor);
    if ( maxLevel > 30) {
      for(var i = 1; i < posToPixelFactor; i++) {
        // TODO:  Devise a more sensible approach to setting the min width.  We want the
        // widest width possible without increasing the levels beyond 30.
        if (i > 4) {
          featureWidth = 1;
        } else if (i > 3) {
          featureWidth = 2;
        } else if (i > 2) {
          featureWidth = 3;
        } else {
          featureWidth = 4;
        }

        features.forEach(function(v) {
            v.level = 0;
        });
        var factor = posToPixelFactor / (i * 2);
        maxLevel = currVcf.pileupVcfRecords(theFeatures, start, factor, featureWidth + 1);
        if (maxLevel <= 50) {
          i = posToPixelFactor;
          break;
        }
      }
    }
    return { 'maxLevel': maxLevel, 'featureWidth': featureWidth };
  }


  flagDupStartPositions(variants) {
    // Flag variants with same start position as this will throw off comparisons
    for (var i =0; i < variants.length - 1; i++) {
          var variant = variants[i];
          var nextVariant = variants[i+1];
          if (i == 0) {
            variant.dup = false;
          }
          nextVariant.dup = false;

          if (variant.start == nextVariant.start) {
            nextVariant.dup = true;
        }
    }

  }

  getBamDepthAtVariantPosition(variant, coverage) {

    let covIter = 0;
    let matchingCoverage = null;
    let currCoverage = null;
    let nextCoverage = null;
    for (; covIter < coverage.length && !matchingCoverage && coverage[covIter][0] <= variant.start;
         ) {

      currCoverage = coverage[covIter]
      nextCoverage = (covIter < coverage.length - 1) ? coverage[covIter+1] : null;

      // Variant matches coverage when variant.start == coverage position
      // or variant.start is between coverage and nextCoverage positions.
      if (variant.start == currCoverage[0]) {
        matchingCoverage = currCoverage;
      } else if (nextCoverage &&
        (variant.start >= currCoverage[0] && variant.start < nextCoverage[0]) ) {
        matchingCoverage = currCoverage;
      }
      covIter++;
    }

    if (matchingCoverage) {
      return matchingCoverage[1];
    } else {
      return null;
    }
  }

  _refreshVariantsWithCoverage(theVcfData, coverage, callback) {
    var me = this;
    if (theVcfData == null || coverage == null) {
      callback();
    }

    let theVariants = theVcfData.features;

    let vcfIter = 0;
    let covIter = 0;
    let currCoverage = null;
    let nextCoverage = null;

    // Iterate through the variants, advancing the index by one each loop. In the case
    // of multiple variants with the same start position, we advance the index
    // multiple times (for each duplicate)
    for(; vcfIter < theVariants.length;) {
      let variant = theVariants[vcfIter];
      let nextVariant = (vcfIter < theVariants.length - 1) ? theVariants[vcfIter+1] : null;

      let matchingCoverage = null;

      // Keep iterating through the coverage records until there are no more
      // coverage records, we found a coverage interval for the variant, or
      // we have advanced past a coverage position that is beyond the variant's
      // start position
      //
      // coverage is a 2 element array: first element=pos, second element=depth
      //
      for (; covIter < coverage.length && !matchingCoverage && coverage[covIter][0] <= variant.start;
           ) {

        currCoverage = coverage[covIter]
        nextCoverage = (covIter < coverage.length - 1) ? coverage[covIter+1] : null;

        // Variant matches coverage when variant.start == coverage position
        // or variant.start is between coverage and nextCoverage positions.
        if (variant.start == currCoverage[0]) {
          matchingCoverage = currCoverage;
        } else if (nextCoverage &&
          (variant.start >= currCoverage[0] && variant.start < nextCoverage[0]) ) {
          matchingCoverage = currCoverage;
        }

        if (!matchingCoverage) {
          covIter++;
        }
      }

      // We found a coverage that spans the interval that contains
      // the variant start position
      if (matchingCoverage) {
        variant.bamDepth = matchingCoverage[1];

        // If the next variant has the same start position,
        // don't advance to the next coverage as it will match
        // the variant on the next variant iteration
        if (nextVariant && nextVariant.dup) {
          //console.log("when finding matching bam depth record, we encountered a variant w the same start position " + variant.start)
        }
      } else {
        console.log("no matching coverage record for variant at start pos " + variant.start + " for gene " + theVcfData.gene)
      }

      // Advance to next variant
      vcfIter++;

    }
    if (!theVcfData.hasOwnProperty('loadState')) {
      theVcfData.loadState = {};
    }
    theVcfData.loadState['coverage'] = true;
    callback();
  }



  _refreshVariantsWithVariantIds(theVcfData, annotatedVcfData) {

    var me = this;
    if (theVcfData == null) {
      return;
    }
    var loadVariantIds = function(recs, annotedRecs) {
      for( var vcfIter = 0, annotIter = 0; vcfIter < recs.length && annotIter < annotedRecs.length; null) {

        var annotatedRec = annotedRecs[annotIter];

        // compare curr variant and curr clinVar record
        if (recs[vcfIter].start == +annotatedRec.start) {

          // add clinVar info to variant if it matches
          if (recs[vcfIter].alt == annotatedRec.alt &&
            recs[vcfIter].ref == annotatedRec.ref) {

            var variant = recs[vcfIter];

            // set the hgvs and rsid on the existing variant
            variant.extraAnnot      = true;

            // set the hgvs and rsid on the existing variant
            var extraAnnotFields = [
              'vepConsequence',
              'vepImpact',
              'vepExon',
              'vepHGVSc',
              'vepHGVSp',
              'vepAminoAcids',
              'vepVariationIds',
              'vepSIFT',
              'vepPolyPhen',
              'vepRegs',
              'regulatory',
              'highestImpactVep',
              'highestSIFT',
              'highestPolyphen',
              'gnomAD'
              ];
            extraAnnotFields.forEach(function(field) {
              variant[field]        = annotatedRec[field];
            })

            vcfIter++;
            annotIter++;
          } else {
            // If clinvar entry didn't match the variant, figure out if the vcf
            // iter (multiple vcf recs with same position as 1 clinvar rec) or
            // the clinvar iter needs to be advanced (multiple clinvar recs with same
            // position as 1 vcf rec)
            if (vcfIter+1 < recs.length && recs[vcfIter+1].start == +annotatedRec.start) {
              vcfIter++;
            } else {
              annotIter++;
            }
          }

        } else if (recs[vcfIter].start < +annotatedRec.start) {
          vcfIter++;
        } else {
          annotIter++;
        }
      }
    }

    // Load the clinvar info for the variants loaded from the vcf
    var sortedFeatures      = theVcfData.features.sort(SampleModel.orderVariantsByPosition);
    var sortedAnnotVariants = annotatedVcfData.features.sort(SampleModel.orderVariantsByPosition)
    loadVariantIds(sortedFeatures, sortedAnnotVariants);
  }

  _refreshVariantsWithClinvarEutils(theVcfData, clinVars) {
    var me = this;
    var clinVarIds = clinVars.uids;
    if (theVcfData == null) {
      return;
    }

    var loadClinvarProperties = function(recs) {
      for( var vcfIter = 0, clinvarIter = 0; vcfIter < recs.length && clinvarIter < clinVarIds.length; null) {
        var uid = clinVarIds[clinvarIter];
        var clinVarStart = clinVars[uid].variation_set[0].variation_loc.filter(function(v){return v["assembly_name"] == me.getGenomeBuildHelper().getCurrentBuildName()})[0].start;
        var clinVarAlt   = clinVars[uid].variation_set[0].variation_loc.filter(function(v){return v["assembly_name"] == me.getGenomeBuildHelper().getCurrentBuildName()})[0].alt;
        var clinVarRef   = clinVars[uid].variation_set[0].variation_loc.filter(function(v){return v["assembly_name"] == me.getGenomeBuildHelper().getCurrentBuildName()})[0].ref;


        // compare curr variant and curr clinVar record
        if (recs[vcfIter].clinvarStart == clinVarStart) {
          // add clinVar info to variant if it matches
          if (recs[vcfIter].clinvarAlt == clinVarAlt &&
            recs[vcfIter].clinvarRef == clinVarRef) {
            me._addClinvarEutilInfoToVariant(recs[vcfIter], clinVars[uid]);
            vcfIter++;
            clinvarIter++;
          } else {
            // If clinvar entry didn't match the variant, figure out if the vcf
            // iter (multiple vcf recs with same position as 1 clinvar rec) or
            // the clinvar iter needs to be advanced (multiple clinvar recs with same
            // position as 1 vcf rec)
            if (vcfIter+1 < recs.length && recs[vcfIter+1].clinvarStart == clinVarStart) {
              vcfIter++;
            } else {
              clinvarIter++;
            }
          }
        } else if (recs[vcfIter].start < clinVarStart) {
          vcfIter++;
        } else {
          clinvarIter++;
        }
      }
    }

    // Load the clinvar info for the variants loaded from the vcf
    var sortedFeatures = theVcfData.features.sort(SampleModel.orderVariantsByPosition);
    loadClinvarProperties(sortedFeatures);

  }


  loadCalledTrioGenotypes(theVcfData, theFbData) {
    var me = this;

    theVcfData = theVcfData ? theVcfData : this.vcfData;
    if (theVcfData == null || theVcfData.features == null) {
      return;
    }
    theFbData = theFbData ? theFbData : this.fbData;


    var sourceVariants = theVcfData.features
                 .filter(function (variant) {
                  return variant.fbCalled == 'Y';
                 })
                 .reduce(function(object, variant) {
                  var key = variant.type + " " + variant.start + " " + variant.ref + " " + variant.alt;
                    object[key] = variant;
                    return object;
                 }, {});
    if (theFbData) {
      theFbData.features.forEach(function (fbVariant) {
        var key = fbVariant.type + " " + fbVariant.start + " " + fbVariant.ref + " " + fbVariant.alt;
        var source = sourceVariants[key];
        if (source) {
          fbVariant.inheritance                 = source.inheritance;
          fbVariant.genotypeRefCountMother      = source.genotypeRefCountMother;
          fbVariant.genotypeAltCountMother      = source.genotypeAltCountMother;
          fbVariant.genotypeDepthMother         = source.genotypeDepthMother;
          fbVariant.bamDepthMother              = source.bamDepthMother;
          fbVariant.genotypeRefCountFather      = source.genotypeRefCountFather;
          fbVariant.genotypeAltCountFather      = source.genotypeAltCountFather;
          fbVariant.genotypeDepthFather         = source.genotypeDepthFather;
          fbVariant.bamDepthFather              = source.bamDepthFather;
          fbVariant.fatherZygosity              = source.fatherZygosity;
          fbVariant.motherZygosity              = source.motherZygosity;
          fbVariant.uasibsZygosity              = source.uasibsZygosity;
          ['affected', 'unaffected']
          .forEach(function(affectedStatus) {
            ['summary', 'zygosity', 'genotypeAltCount', 'genotypeRefCount', 'genotypeDepth', 'bamDepth']
            .forEach(function(field) {
              var attr = affectedStatus + "_" + field;
              fbVariant[attr]  = source[attr];
            })
          })
          if (me.relationship != 'proband') {
            fbVariant.genotypeRefCountProband      = source.genotypeRefCountProband;
            fbVariant.genotypeAltCountProband      = source.genotypeAltCountProband;
            fbVariant.genotypeDepthProband         = source.genotypeDepthProband;
            fbVariant.probandZygosity              = source.probandZygosity;
          }
        }


      });



    }
  }


  isAlignmentsOnly() {
    return !this.isVcfReadyToLoad() && this.isBamLoaded();
  }

  /*
   *  For trios, mother and father vcf data cache was cleared out, so now
   *  we need to reconstruct vcf data to equal loaded variants + unique freebayes
   *  variants
   */
  addCalledVariantsToVcfData(theVcfData, theFbData) {
    var me = this;

    // Exit if there are no cached called variants
    if (theFbData == null || theFbData.features.length == 0) {
      return;
    }


    // We have to order the variants in both sets before comparing
    theVcfData.features = theVcfData.features.sort(SampleModel.orderVariantsByPosition);
    theFbData.features  = theFbData.features.sort(SampleModel.orderVariantsByPosition);

    // We will call this multiple times, so clear out any called variants from the
    // vcf data to start fresh
    theVcfData.features  = theVcfData.features.filter(function(d,i) {
      return !d.hasOwnProperty("fbCalled") || d.fbCalled != 'Y';
    })


    // Compare the variant sets, marking the variants as unique1 (only in vcf),
    // unique2 (only in freebayes set), or common (in both sets).
    if (me.isVcfLoaded()) {
      // Compare fb data to vcf data
      me.vcf.compareVcfRecords(theVcfData, theFbData);

      // Add unique freebayes variants to vcfData
        theFbData.features = theFbData.features.filter(function(d) {
          return d.consensus == 'unique2';
        });
    }


    // Add the unique freebayes variants to vcf data to include
    // in feature matrix
    theFbData.features.forEach( function(v) {
      var variantObject = $.extend({}, v);
        theVcfData.features.push(variantObject);
        v.source = variantObject;
      });

      return theVcfData;
  }


  _determineUniqueFreebayesVariants(geneObject, theTranscript, theVcfData, theFbData) {
    var me = this;


    if (theVcfData == null) {
      theVcfData = me.vcfData;
    }
    if (theFbData == null) {
      theFbData = me.fbData;
    }


    // We have to order the variants in both sets before comparing
    theVcfData.features = theVcfData.features.sort(SampleModel.orderVariantsByPosition);
    theFbData.features  = theFbData.features.sort(SampleModel.orderVariantsByPosition);

    // Compare the variant sets, marking the variants as unique1 (only in vcf),
    // unique2 (only in freebayes set), or common (in both sets).
    if (me.isVcfLoaded()) {
      // Compare fb data to vcf data
      me.vcf.compareVcfRecords(theVcfData, theFbData);

      // Add unique freebayes variants to vcfData
        theFbData.features = theFbData.features.filter(function(d) {
          return d.consensus == 'unique2';
        });
    }


    // Add the unique freebayes variants to vcf data to include
    // in feature matrix
    theFbData.features.forEach( function(v) {
      var variantObject = $.extend({}, v);
      theVcfData.features.push(variantObject);
      v.source = variantObject;
    });
  }



  filterVariants(data, filterObject, start, end, bypassRangeFilter, filterModel) {
    var me = this;

    if (data == null || data.features == null) {
      console.log("Empty data/features");
      return;
    }

    var impactField = me.getAnnotationScheme().toLowerCase() === 'snpeff' ? 'impact' : me.globalApp.impactFieldToFilter;
    var effectField = me.getAnnotationScheme().toLowerCase() === 'snpeff' ? 'effect' : 'vepConsequence';

    // coverageMin is always an integer or NaN
    var coverageMin = filterObject.coverageMin;
    var intronsExcludedCount = 0;

    var affectedFilters = null;
    if (filterObject.affectedInfo) {
      affectedFilters = filterObject.affectedInfo.filter(function(info) {
        return info.filter;
      });
    } else {
      affectedFilters = {};
    }


    var filteredFeatures = data.features.filter(function(d) {

      var passAffectedStatus = true;
      if (me.getRelationship() == 'proband' && affectedFilters.length > 0) {
        affectedFilters.forEach(function(info) {
          var genotype = d.genotypes[info.variantCard.getSampleName()];
          var zygosity = genotype && genotype.zygosity ? genotype.zygosity : "gt_unknown";

          if (info.status == 'affected') {
            if (zygosity.toUpperCase() != 'HET' && zygosity.toUpperCase() != 'HOM') {
              passAffectedStatus = false;
            }
          } else if (info.status == 'unaffected') {
            if (zygosity.toUpperCase() == 'HET' || zygosity.toUpperCase() == 'HOM') {
              passAffectedStatus = false;
            }
          }
        })
      }


      // We don't want to display homozygous reference variants in the variant chart
      // or feature matrix (but we want to keep it to show trio allele counts).
      var isHomRef = (d.zygosity != null && (d.zygosity.toLowerCase() == 'gt_unknown' || d.zygosity.toLowerCase() == 'homref')) ? true : false;
      var isGenotypeAbsent = d.genotype == null ? true :(d.genotype.absent ? d.genotype.absent : false);

      var meetsRegion = true;
      if (!bypassRangeFilter) {
        if (start != null && end != null ) {
          meetsRegion = (d.start >= start && d.start <= end);
        }
      }

      // Allele frequency Exac - Treat null and blank af as 0
      var variantAf = d.afHighest && d.afHighest != "." ? d.afHighest : 0;
      var meetsAf = true;
      if ($.isNumeric(filterObject.afMin) && $.isNumeric(filterObject.afMax)) {
        meetsAf = (variantAf >= filterObject.afMin && variantAf <= filterObject.afMax);
      }

      var meetsLoadedVsCalled = false;
      if (filterObject.loadedVariants && filterObject.calledVariants) {
        meetsLoadedVsCalled = true;
      } else if (!filterObject.loadedVariants && !filterObject.calledVariants) {
        meetsLoadedVsCalled = true;
      } else if (filterObject.loadedVariants) {
        if (!d.hasOwnProperty("fbCalled") || d.fbCalled != 'Y') {
          meetsLoadedVsCalled = true;
        }
      } else if (filterObject.calledVariants) {
        if (d.hasOwnProperty("fbCalled") && d.fbCalled == 'Y') {
          meetsLoadedVsCalled = true;
        }
      }

      var meetsExonic = false;
      if (filterObject.exonicOnly) {
        for (var key in d[impactField]) {
          if (key.toLowerCase() == 'high' || key.toLowerCase() == 'moderate') {
            meetsExonic = true;
          }
        }
        if (!meetsExonic) {
          for (var key in d[effectField]) {
            if (key.toLowerCase() != 'intron_variant' && key.toLowerCase() != 'intron variant' && key.toLowerCase() != "intron") {
              meetsExonic = true;
            }
          }
        }
        if (!meetsExonic) {
          intronsExcludedCount++;
        }
      } else {
        meetsExonic = true;
      }


      // Evaluate the coverage for the variant to see if it meets min.
      var meetsCoverage = true;
      if (coverageMin && coverageMin > 0) {
        if ($.isNumeric(d.bamDepth)) {
          meetsCoverage = d.bamDepth >= coverageMin;
        } else if ($.isNumeric(d.genotypeDepth)) {
          meetsCoverage = d.genotypeDepth >= coverageMin;
        }
      }

      var incrementEqualityCount = function(condition, counterObject) {
        var countAttribute = condition ? 'matchCount' : 'notMatchCount';
        counterObject[countAttribute]++;
      }
      // Iterate through the clicked annotations for each variant. The variant
      // needs to match
      // at least one of the selected values (e.g. HIGH or MODERATE for IMPACT)
      // for each annotation (e.g. IMPACT and ZYGOSITY) to be included.
      var evaluations = {};
      for (var key in filterObject.annotsToInclude) {
        var annot = filterObject.annotsToInclude[key];
        if (annot.state) {
          var evalObject = evaluations[annot.key];
          if (!evalObject) {
            evalObject = {};
            evaluations[annot.key] = evalObject;
          }

          var annotValue = d[annot.key] || '';

          // Keep track of counts where critera should be true vs counts
          // for critera that should be false.
          //
          // In the simplest case,
          // the filter is evalated for equals, for example,
          // clinvar == pathogenic or clinvar == likely pathogenic.
          // In this case, if a variant's clinvar = pathogenic, the
          // evaluations will look like this:
          //  evalEquals: {matchCount: 1, notMatchCount: 0}
          // When variant's clinvar = benign
          //  evalEquals: {matchCount: 0, notMatchCount: 1}
              //
          // In a case where the filter is set to clinvar NOT EQUAL 'pathogenic'
          // AND NOT EQUAL 'likely pathogenic'
          // the evaluation will be true on if the variant's clinvar is NOT 'pathogenic'
          // AND NOT 'likely pathogenic'
          // When variant's clinvar is blank:
          //  evalNotEquals: {matchCount: 0, notMatchCount: 2}
          //
          // If variant's clinvar is equal to pathogenic
          //  evalNotEquals: {matchCount: 1, notMatchCount 1}
          //
          var evalKey = 'equals';
          if (annot.hasOwnProperty("not") && annot.not) {
            evalKey = 'notEquals';
          }
          if (!evalObject.hasOwnProperty(evalKey)) {
            evalObject[evalKey] = {matchCount: 0, notMatchCount: 0};
          }
          if ($.isPlainObject(annotValue)) {
            for (let avKey in annotValue) {
              var doesMatch = avKey.toLowerCase() == annot.value.toLowerCase();
              incrementEqualityCount(doesMatch, evalObject[evalKey])
            }
          } else {
            var doesMatch = annotValue.toLowerCase() == annot.value.toLowerCase();
            incrementEqualityCount(doesMatch, evalObject[evalKey])
          }
        }
      }

      // If zero annots to evaluate, the variant meets the criteria.
      // If annots are to be evaluated, the variant must match
      // at least one value for each annot to meet criteria
      var meetsAnnot = true;
      for (var key in evaluations) {
        var evalObject = evaluations[key];

        // Bypass evaluation for non-proband on inheritance mode.  This only
        // applied to proband.
        if (key == 'inheritance' && me.getRelationship() != 'proband') {
          continue;
        }
        if (evalObject.hasOwnProperty("equals") && evalObject["equals"].matchCount == 0) {
          meetsAnnot = false;
          break;
        }
      }

      // For annotations set to 'not equal', any case where the annotation matches (matchCount > 0),
      // we set that the annotation critera was not met.  Example:  When filter is
      // clinvar 'not equal' pathogenic, and variant.clinvar == 'pathogenic' matchCount > 0,
      // so the variants does not meet the annotation criteria
      var meetsNotEqualAnnot = true
      for (var key in evaluations) {
        var evalObject = evaluations[key];

        // Bypass evaluation for non-proband on inheritance mode.  This only
        // applied to proband.
        if (key == 'inheritance' && me.getRelationship() != 'proband') {
          continue;
        }
        // Any case where the variant attribute matches value on a 'not equal' filter,
        // we have encountered a condition where the criteria is not met.
        if (evalObject.hasOwnProperty("notEquals") && evalObject["notEquals"].matchCount > 0) {
          meetsNotEqualAnnot = false;
          break;
        }
      }


      return (!isHomRef || isGenotypeAbsent) && meetsRegion && meetsAf && meetsCoverage && meetsAnnot && meetsNotEqualAnnot && meetsExonic && meetsLoadedVsCalled && passAffectedStatus;
    });


    var vcfDataFiltered = {
      intronsExcludedCount: intronsExcludedCount,
      end: end,
      features: filteredFeatures,
      name: data.name,
      start: start,
      strand: data.strand,
      variantRegionStart: start,
      genericAnnotators: data.genericAnnotators
    };
    return vcfDataFiltered;
  }

  filterKnownVariants(data, start, end, bypassRangeFilter, filterModel) {
    var me = this;

    var theFilters = filterModel.modelFilters['known-variants'].filter(function(theFilter) {
      return theFilter.value == true;
    })

    var filteredVariants = data.features.filter(function (d) {

      var meetsRegion = true;
      if (!bypassRangeFilter) {
        if (start != null && end != null ) {
          meetsRegion = (d.start >= start && d.start <= end);
        }
      }

      var meetsFilter = true;
      if (theFilters.length > 0) {
        var meetsFilter = false;
        theFilters.forEach( function(theFilter) {
          if (d[theFilter.key] == theFilter.clazz) {
            meetsFilter = true;
          }
        });
      }

      return meetsRegion && meetsFilter;

    })

    var pileupObject = this._pileupVariants(filteredVariants, start, end);

    var vcfDataFiltered = {
      intronsExcludedCount: 0,
      end: end,
      features: filteredVariants,
      maxLevel: pileupObject.maxLevel + 1,
      featureWidth: pileupObject.featureWidth,
      name: data.name,
      start: start,
      strand: data.strand,
      variantRegionStart: start,
      genericAnnotators: data.genericAnnotators
    };
    return vcfDataFiltered;
  }

  filterSfariVariants(data, start, end, bypassRangeFilter, filterModel) {
      var me = this;

      var theFilters = filterModel.getModelSpecificFilters('sfari-variants').filter(function(theFilter) {
          return theFilter.value === true;
      })

      var filteredVariants = data.features.filter(function (d) {

          var meetsRegion = true;
          if (!bypassRangeFilter) {
              if (start != null && end != null ) {
                  meetsRegion = (d.start >= start && d.start <= end);
              }
          }

          var meetsFilter = true;
          if (theFilters.length > 0) {
              var meetsFilter = false;
              theFilters.forEach( function(theFilter) {
                  if (d[theFilter.key] == theFilter.clazz) {
                      meetsFilter = true;
                  }
              });
          }

          return meetsRegion && meetsFilter;

      });

      var pileupObject = this._pileupVariants(filteredVariants, start, end);

      var vcfDataFiltered = {
          intronsExcludedCount: 0,
          end: end,
          features: filteredVariants,
          maxLevel: pileupObject.maxLevel + 1,
          featureWidth: pileupObject.featureWidth,
          name: data.name,
          start: start,
          strand: data.strand,
          variantRegionStart: start,
          genericAnnotators: data.genericAnnotators
      };
      return vcfDataFiltered;
  }




  promiseCompareVariants(theVcfData, compareAttribute, matchAttribute, matchFunction, noMatchFunction ) {
    var me = this;

    return new Promise( function(resolve, reject) {
      if (me.vcfData == null) {
        me._promiseVcfRefName().then( function() {

          me.vcf.promiseGetVariants(
             me.getVcfRefName(window.gene.chr),
             window.gene,
             window.selectedTranscript,
             null,     // regions
             false,    // is multi-sample
             me._getSamplesToRetrieve(),
             me.getAnnotationScheme().toLowerCase(),
             me.getTranslator().clinvarMap,
             me.getGeneModel().geneSource == 'refseq' ? true : false,
             false,  // hgvs notation
             false,  // rsid
             false, // serverside cache
             false, // sfari mode
             false, // get extra gnomad,
             true // decompose
          )
          .then( function(data) {

            if (data != null && data.features != null) {
              var annotatedRecs = data[0];
                me.vcfData = data[1];

              me.vcfData.features = me.vcfData.features.sort(SampleModel.orderVariantsByPosition);
              me.vcfData.features.forEach( function(feature) {
                feature[compareAttribute] = '';
              });
              me.vcf.compareVcfRecords(theVcfData, me.vcfData, compareAttribute, matchFunction, noMatchFunction);
              resolve();
            } else {
              var error = 'promiseCompareVariants() has null data returned from promiseGetVariants';
              console.log(error);
              reject(error);
            }
          }, function(error) {
            var message = 'error occurred when getting variants in promiseCompareVariants: ' + error;
            console.log(message);
            reject(message);
          });
        })
        .catch(function(error) {
          let msg = "Could not annotate variants due to missing reference file";
          console.log("missing reference");
          reject("missing reference");
        });

      } else {
        me.vcfData.features = me.vcfData.features.sort(SampleModel.orderVariantsByPosition);
        if (compareAttribute) {
          me.vcfData.features.forEach( function(feature) {
            feature[compareAttribute] = '';
          });
        }
        me.vcf.compareVcfRecords(theVcfData, me.vcfData, compareAttribute, matchFunction, noMatchFunction);
        resolve();
      }

    });


  }

  classifyByImpact(d, annotationScheme) {
    let self = this;
    var impacts = "";
    var colorimpacts = "";
    var effects = "";
    var sift = "";
    var polyphen = "";
    var regulatory = "";

    var effectList = (annotationScheme == null || annotationScheme.toLowerCase() == 'snpeff' ? d.effect : d.vepConsequence);
    for (var key in effectList) {
      if (annotationScheme.toLowerCase() == 'vep' && key.indexOf("&") > 0) {
          var tokens = key.split("&");
          tokens.forEach( function(token) {
          effects += " " + token;

          });
      } else {
        effects += " " + key;
      }
    }
    var impactList =  (annotationScheme == null || annotationScheme.toLowerCase() == 'snpeff' ? d.impact : d[self.globalApp.impactFieldToFilter]);
    for (var key in impactList) {
      impacts += " " + key;
    }
    var colorImpactList =  (annotationScheme == null || annotationScheme.toLowerCase() == 'snpeff' ? d.impact : d[self.globalApp.impactFieldToColor]);
    for (var key in colorImpactList) {
      colorimpacts += " " + 'impact_'+key;
    }
    if (colorimpacts == "") {
      colorimpacts = "impact_none";
    }
    for (var key in d.sift) {
      sift += " " + key;
    }
    for (var key in d.polyphen) {
      polyphen += " " + key;
    }
    for (var key in d.regulatory) {
      regulatory += " " + key;
    }

    return  'variant ' + d.type.toLowerCase()  + ' ' + d.zygosity.toLowerCase() + ' ' + (d.inheritance ? d.inheritance.toLowerCase() : "") + ' ua_' + d.ua + ' '  + sift + ' ' + polyphen + ' ' + regulatory +  ' ' + + ' ' + d.clinvar + ' ' + impacts + ' ' + effects + ' ' + d.consensus + ' ' + colorimpacts;
  }

  classifyByClinvar(d) {
    return  'variant ' + d.type.toLowerCase()  +  ' '  + d.clinvar + ' colorby_' + d.clinvar;
  }




  _promiseGetData(dataKind, geneName, transcript) {
    var me = this;
    return new Promise(function(resolve, reject) {

      if (geneName == null) {
        var msg = "SampleModel._promiseGetData(): empty gene name";
        console.log(msg);
        reject(msg);
      } else {
        var key = me._getCacheKey(dataKind, geneName.toUpperCase(), transcript)
        me.getCacheHelper().promiseGetData(key)
         .then(function(data) {
          if (data) {
            data.cacheState = 'cached'
          }
          resolve(data);
         },
         function(error) {
           let msg = "Could not get sample data for gene " +  geneName + ". Try refreshing the page";
          console.log(msg);
          reject(msg);
         })
      }
    })
  }

  _promiseCacheData(data, dataKind, geneName, transcript) {
    var me = this;
    return new Promise(function(resolve, reject) {
      var key = me._getCacheKey(dataKind, geneName.toUpperCase(), transcript);

      // In order to avoid circular references that cause vcfData.features
      // to have null elements, we just blank out the 'features' property
      // on every variant
      if (dataKind == 'vcfData' || dataKind == 'fbData') {
        if (data.features) {
          data.features.forEach(function(f) {
            delete f.features;
          })
        }
      }

      me.getCacheHelper().promiseCacheData(key, data)
       .then(function() {
        resolve();
       },
       function(error) {
        CacheHelper.showError(key, error);
        reject("Error occurred when compressing analyzed data before caching." + error);
       })
    })
  }

  getSampleNamesToGenotype() {
    var sampleNames = null;
    var me = this;
    if (this.getRelationship() == 'proband') {
      sampleNames = [];
      me.getAffectedInfo().forEach(function(info) {
        sampleNames.push(info.model.getSampleName());
      })
    }
    return sampleNames;
  }

}


SampleModel._summarizeDanger = function(geneName, theVcfData, options = {}, geneCoverageAll, filterModel, translator, annotationScheme, transcript, isAlignmentsOnly) {
  var dangerCounts = $().extend({}, options);

  // For comparing danger summaries, we need to make sure this field is always initialized
  // the same way so that it doesn't show up as different (and needing to be cached)
  // when in fact it is the same.
  if (dangerCounts.CALLED == null) {
    dangerCounts.CALLED = false;
  }
  dangerCounts.CONSEQUENCE = {};
  dangerCounts.IMPACT = {};
  dangerCounts.CLINVAR = {};
  dangerCounts.INHERITANCE = {};
  dangerCounts.AF = {};
  dangerCounts.featureCount = 0;
  //if (options && options.CALLED && ) {
    dangerCounts.calledCount  = 0;
  //}
  dangerCounts.loadedCount  = 0;
  dangerCounts.harmfulVariantsInfo = [];
  dangerCounts.failedFilter = false;
  dangerCounts.geneName = geneName;
  dangerCounts.isAlignmentsOnly = isAlignmentsOnly;

  SampleModel.summarizeDangerForGeneCoverage(dangerCounts, geneCoverageAll, filterModel, transcript);

  dangerCounts.badges = filterModel.flagVariants(theVcfData);


  if (theVcfData == null || theVcfData.features == null ) {
    console.log("unable to summarize danger due to null data");
    dangerCounts.error = "unable to summarize danger due to null data";
    return dangerCounts;
  } else if (theVcfData.features.length == 0) {
    dangerCounts.failedFilter = filterModel.hasFilters();
    return dangerCounts;
  }


  var siftClasses = {};
  var polyphenClasses = {};
  var clinvarClasses = {};
  var impactClasses = {};
  var inheritanceClasses = {};
  var afClazz = null;
  var afField = null;
  var lowestAf = 999;
  dangerCounts.harmfulVariantsInfo = [];


  theVcfData.features.forEach( function(variant) {

      for (key in variant.highestImpactVep) {
        if (translator.impactMap.hasOwnProperty(key) && translator.impactMap[key].badge) {
          impactClasses[key] = impactClasses[key] || {};
          impactClasses[key][variant.type] = true; // key = consequence, value = transcript id
        }
      }

      for (key in variant.highestSIFT) {
        if (translator.siftMap.hasOwnProperty(key) && translator.siftMap[key].badge) {
          var clazz = translator.siftMap[key].clazz;
          dangerCounts.SIFT = {};
          dangerCounts.SIFT[clazz] = {};
          dangerCounts.SIFT[clazz][key] = variant.highestSIFT[key];
        }
      }

      for (key in variant.highestPolyphen) {
        if (translator.polyphenMap.hasOwnProperty(key) && translator.polyphenMap[key].badge) {
        var clazz = translator.polyphenMap[key].clazz;
        dangerCounts.POLYPHEN = {};
        dangerCounts.POLYPHEN[clazz] = {};
        dangerCounts.POLYPHEN[clazz][key] = variant.highestPolyphen[key];
      }
      }

      if (variant.hasOwnProperty('clinvar')) {
        var clinvarEntry = null;
        var clinvarDisplay = null;
        var clinvarKey = null;
        for (var key in translator.clinvarMap) {
          var me = translator.clinvarMap[key];
          if (clinvarEntry == null && me.clazz == variant.clinvar) {
            clinvarEntry = me;
            clinvarDisplay = key;
            clinvarKey = key;
          }
        }
        if (clinvarEntry && clinvarEntry.badge) {
        clinvarClasses[clinvarKey] = clinvarEntry;
        }
      }

      if (variant.inheritance && variant.inheritance.indexOf('n/a') == -1) {
        var clazz = translator.inheritanceMap[variant.inheritance].clazz;
        inheritanceClasses[clazz] = variant.inheritance;
      }



      if (variant.afFieldHighest) {
      translator.afHighestMap.forEach( function(rangeEntry) {
        if (+variant.afHighest > rangeEntry.min && +variant.afHighest <= rangeEntry.max) {
          if (rangeEntry.value < lowestAf) {
            lowestAf = rangeEntry.value;
            afClazz = rangeEntry.clazz;
            afField = variant.afFieldHighest;
          }
        }
      });
    }

    // Turn on flag for harmful variant if one is found
    if (variant.harmfulVariant) {
      dangerCounts.harmfulVariantsInfo.push(variant.harmfulVariant);
    }
  });

  var getLowestClinvarClazz = function(clazzes) {
    var lowestOrder = 9999;
    var lowestClazz = null;
    var dangerObject = null;
    for (var clazz in clazzes) {
      var object = clazzes[clazz];
      if (object.value < lowestOrder) {
        lowestOrder = object.value;
        lowestClazz = clazz;
      }
    }
    if (lowestClazz) {
      dangerObject = {};
      dangerObject[lowestClazz] =  clazzes[lowestClazz];
    }
    return dangerObject;
  }

  var getLowestImpact = function(impactClasses) {
    var classes = ['HIGH', 'MODERATE', 'MODIFIER', 'LOW'];
    for(var i = 0; i < classes.length; i++) {
      var impactClass = classes[i];
      if (impactClasses[impactClass]) {
        var lowestImpact = {};
        lowestImpact[impactClass] = impactClasses[impactClass];
        return lowestImpact;
      }
    }
    return {};
  }

  var hvLevel = dangerCounts.harmfulVariantsInfo
                .map( d => d.level )
                .reduce( (min, cur) => Math.min( min, cur ), Infinity );
  dangerCounts.harmfulVariantsLevel = hvLevel == Infinity ? null : hvLevel;

  dangerCounts.IMPACT = getLowestImpact(impactClasses);
  dangerCounts.CLINVAR = getLowestClinvarClazz(clinvarClasses);
  dangerCounts.INHERITANCE = inheritanceClasses;

  var afSummaryObject = {};
  if (afClazz != null) {
    afSummaryObject[afClazz] = {field: afField, value: lowestAf};
  }
  dangerCounts.AF = afSummaryObject;

  dangerCounts.featureCount = theVcfData.features.length;
  dangerCounts.loadedCount  = theVcfData.features.filter(function(d) {
    var bypassZyg = SampleModel.isZygosityToBypass(d, 'proband');
    return (!d.hasOwnProperty("fbCalled") || d.fbCalled != 'Y') && !bypassZyg;
  }).length;
  //if (options && options.CALLED) {
    dangerCounts.calledCount  = theVcfData.features.filter(function(d) {
      var bypassZyg = SampleModel.isZygosityToBypass(d, 'proband');
      return d.hasOwnProperty("fbCalled") && d.fbCalled == 'Y' && !bypassZyg;
    }).length;
  //}

  // Indicate if the gene pass the filter (if applicable)
  dangerCounts.failedFilter = filterModel.hasFilters() && dangerCounts.featureCount == 0;

  return dangerCounts;
}

SampleModel.isZygosityToBypass = function(variant, relationship) {
  return variant.zygosity == null
         || variant.zygosity.toUpperCase() == "HOMREF"
         || variant.zygosity.toUpperCase() == "NONE"
         || (variant.zygosity.toUpperCase() == "GT_UNKNOWN" && relationship != 'known-variants')
         || variant.zygosity == "";
}



SampleModel._determineAffectedStatusForVariant = function(variant, affectedStatus, affectedInfo) {
  var matchesCount = 0;
  var summaryField    = affectedStatus + "_summary";

  variant[summaryField]                         = "none";

  affectedInfo.forEach(function(info) {
    var sampleName  = info.model.getSampleName();
    var genotype    = variant.genotypes[sampleName];

    if (genotype) {

      var zyg  = genotype.zygosity ? genotype.zygosity : "none";
      if (zyg.toLowerCase() != 'none' && zyg.toLowerCase() != 'gt_unknown' && zyg.toLowerCase() != 'homref') {
        matchesCount++;
      }
    }
  })

  if (matchesCount > 0 && matchesCount == affectedInfo.length) {
    variant[summaryField] = "present_all";
  }  else if (matchesCount > 0) {
    variant[summaryField] = "present_some"
  }  else {
    variant[summaryField] = "present_none";
  }
}





SampleModel.summarizeDangerForGeneCoverage = function(dangerObject, geneCoverageAll, filterModel, transcript, clearOtherDanger=false, refreshOnly=false ) {
  dangerObject.geneCoverageInfo = {};
  dangerObject.geneCoverageProblem = false;
  dangerObject.geneCoverageProblemNonProband = false;


  if (geneCoverageAll && Object.keys(geneCoverageAll).length > 0) {
    for (var relationship in geneCoverageAll) {
      var geneCoverage = geneCoverageAll[relationship];
      if (geneCoverage) {
        geneCoverage.forEach(function(gc) {
          if (gc.region != 'NA') {
            if (filterModel.isLowCoverage(gc)) {

              if (relationship == 'proband') {
                dangerObject.geneCoverageProblem = true;
              } else {
                dangerObject.geneCoverageProblemNonProband = true;
              }

              // build up the geneCoveragerInfo to show exon numbers with low coverage
              // and for which samples
              //   example:  {'Exon 1/10': {'proband'}, 'Exon 9/10': {'proband', 'mother'}}
              var exon = null;
              if (gc.exon_number) {
                exon =  +gc.exon_number.split("\/")[0];
              } else {
                exon = +gc.id;
              }
              if (dangerObject.geneCoverageInfo[exon] == null) {
                dangerObject.geneCoverageInfo[exon] = {};
              }
              dangerObject.geneCoverageInfo[exon][relationship] = true;

            }

          }
        })
      }
    }

  }

  // When we are just showing gene badges for low coverage and not reporting on status of
  // filtered variants, clear out the all of the danger summary object related to variants
  if (clearOtherDanger) {
    dangerObject.CONSEQUENCE = {};
    dangerObject.IMPACT = {};
    dangerObject.CLINVAR = {};
    dangerObject.INHERITANCE = {};
    dangerObject.AF = {};
    dangerObject.featureCount = 0;
    dangerObject.loadedCount  = 0;
    dangerObject.calledCount  = 0;
    dangerObject.harmfulVariantsInfo = [];
    // If a gene filter is being applied (refreshOnly=false)
    // The app is applying the standard filter of 'has exon coverage problems', so
    // indicate that gene didn't pass filter if there is NOT a coverage problem
    dangerObject.failedFilter = refreshOnly ? false : !dangerObject.geneCoverageProblem;
  }

  return dangerObject;
}

SampleModel.summarizeError =  function(geneName, theError) {
  var summaryObject = {};

  summaryObject.geneName = geneName;
  summaryObject.CONSEQUENCE = {};
  summaryObject.IMPACT = {};
  summaryObject.CLINVAR = {}
  summaryObject.INHERITANCE = {};
  summaryObject.ERROR = theError;
  summaryObject.featureCount = 0;
  summaryObject.badges = {}

  return summaryObject;
}



SampleModel.calcMaxAlleleCount = function(theVcfData, maxAlleleCount=0) {
  if (theVcfData && theVcfData.features) {
    theVcfData.features.forEach(function(theVariant) {
      if (theVariant.genotypeDepth) {
        if ((+theVariant.genotypeDepth) > maxAlleleCount) {
          maxAlleleCount = +theVariant.genotypeDepth;
        }
      }
    })
  }
  return maxAlleleCount;
}



SampleModel.orderVariantsByPosition = function(a, b) {
  var refAltA = a.ref + "->" + a.alt;
  var refAltB = b.ref + "->" + b.alt;

  var chromA = a.chrom.indexOf("chr") == 0 ? a.chrom.split("chr")[1] : a.chrom;
  var chromB = b.chrom.indexOf("chr") == 0 ? b.chrom.split("chr")[1] : b.chrom;
  if (!$.isNumeric(chromA)) {
    chromA = chromA.charCodeAt(0);
  };
  if (!$.isNumeric(chromB)) {
    chromB = chromB.charCodeAt(0);
  };

  if (+chromA == +chromB) {
    if (a.start == b.start) {
      if (refAltA == refAltB) {
        return 0;
      } else if ( refAltA < refAltB ) {
        return -1;
      } else {
        return 1;
      }
    } else if (a.start < b.start) {
      return -1;
    } else {
      return 1;
    }
  } else {
    if (+chromA < +chromB) {
      return -1;
    } else if (+chromA > +chromB) {
      return 1;
    }
  }


}

SampleModel.orderVcfRecords = function(rec1, rec2) {


  var fields1 = rec1.split("\t");
  var fields2 = rec2.split("\t");

  var chrom1 = fields1[0].indexOf("chr") == 0 ? fields1[0].split("chr")[1] : fields1[0];
  var chrom2 = fields2[0].indexOf("chr") == 0 ? fields2[0].split("chr")[1] : fields2[0];
  if (!$.isNumeric(chrom1)) {
    chrom1 = chrom1.charCodeAt(0);
  };
  if (!$.isNumeric(chrom2)) {
    chrom2 = chrom2.charCodeAt(0);
  };

  var start1  = +fields1[1];
  var start2  = +fields2[1];

  var refalt1 = fields1[3] + fields1[4];
  var refalt2 = fields2[3] + fields2[4];


  if (+chrom1 < +chrom2) {
    return -1;
  } else if (+chrom1 > +chrom2) {
    return 1;
  } else {
    if (+start1 < +start2) {
      return -1;
    } else if (+start1 > +start2) {
      return 1;
    } else {
      if (refalt1 > refalt2) {
        return -1;
      } else if (refalt1 > refalt2) {
        return 1;
      } else {
        return 0;
      }
    }
  }

}
export default SampleModel




