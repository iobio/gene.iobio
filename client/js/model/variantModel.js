// Create a variant model class
// Constructor
function VariantModel() {
  this.vcf = null;
  this.bam = null;

  this.vcfData = null;
  this.fbData = null;
  this.bamData = null;


  this.vcfUrlEntered = false;
  this.vcfFileOpened = false;
  this.getVcfRefName = null;
  this.isMultiSample = false;

  this.bamUrlEntered = false;
  this.bamFileOpened = false;
  this.getBamRefName = null;

  this.name = "";
  this.vcfRefNamesMap = {};
  this.sampleName = "";
  this.isGeneratedSampleName = false;
  this.defaultSampleName = null;
  this.relationship = null;
  this.affectedStatus = null;

  this.lastVcfAlertify = null;
  this.lastBamAlertify = null;

  this.cohort = null;

  this.debugMe = false;

  this.loadedVariants = null;
  this.coverage = [[]];


}




VariantModel.prototype.getSampleIdentifier = function(theSampleName) {
  var id = this.relationship + "&&" + this.sampleName + "&&" + theSampleName;
}

VariantModel.prototype.promiseSetLoadState = function(theVcfData, taskName) {
  var me = this;

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
       },
       function(error) {
        var msg = "A problem occurred in VariantModel.promiseSetLoadState(): " + error;
        console.log(msg);
        reject(msg);
       })

    }
  })
}

VariantModel.prototype.getAnnotators = function() {
  return this.vcf ? this.vcf.getAnnotators() : [];
}

VariantModel.prototype.isLoaded = function() {
  return this.vcf != null && this.vcfData != null;
}


VariantModel.prototype.isReadyToLoad = function() {
  return (this.isVcfReadyToLoad() && this.isSampleSelected()) || this.isBamReadyToLoad();
}

VariantModel.prototype.isBamReadyToLoad = function() {
  return this.bam != null && (this.bamUrlEntered || this.bamFileOpened);
}

VariantModel.prototype.isVcfReadyToLoad = function() {
  return this.vcf != null && (this.vcfUrlEntered || this.vcfFileOpened);
}

VariantModel.prototype.isSampleSelected = function() {
  return !this.isMultiSample || (this.sampleName && this.sampleName.length > 0);
}


VariantModel.prototype.isBamLoaded = function() {
  return this.bam && (this.bamUrlEntered || (this.bamFileOpened && this.getBamRefName));
}

VariantModel.prototype.isVcfLoaded = function() {
  return this.vcf && (this.vcfUrlEntered || this.vcfFileOpened);
}


VariantModel.prototype.isInheritanceLoaded = function() {
  return (this.vcfData != null && this.vcfData.loadState != null && this.vcfData.loadState['inheritance']);
}

VariantModel.prototype.promiseGetVcfData = function(geneObject, selectedTranscript, whenEmptyUseFbData=true) {
  var me = this;
  var dataKind = CacheHelper.VCF_DATA;
  return new Promise(function(resolve, reject) {
    if (geneObject == null) {
      reject("Empty geneObject in VariantModel.promiseGetVcfData()");
    }

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
      if (theGetRefNameFunction(geneObject.chr) == me[dataKind].ref &&
        geneObject.start == me[dataKind].start &&
        geneObject.end == me[dataKind].end &&
        geneObject.strand == me[dataKind].strand) {
        theVcfData = me[dataKind];
        resolve({model: me, vcfData: theVcfData});
      }
    }

    if (theVcfData == null) {
      // Find vcf data in cache
      me._promiseGetData(dataKind, geneObject.gene_name, selectedTranscript)
       .then(function(data) {
        if (data != null && data != '') {
          me[dataKind] = data;
          theVcfData = data;
          resolve({model: me, vcfData: theVcfData});
        } else {
          // If the vcf data is null, see if there are called variants in the cache.  If so,
          // copy the called variants into the vcf data.
          if (whenEmptyUseFbData && me.isAlignmentsOnly()) {
            me.promiseGetFbData(geneObject, selectedTranscript)
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


              }
              resolve({model: me, vcfData: theVcfData});

             },
             function(error) {
              var msg = "Problem occurred in VariantModel.promiseGetVcfData: " + error;
              console.log(msg);
              reject(error);
             });
          } else {
            resolve({model: me, vcfData: theVcfData});
          }

        }

       })
    }



  });
}


VariantModel.prototype.promiseGetFbData = function(geneObject, selectedTranscript, reconstiteFromVcfData=false) {
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
              var msg = "An error occurred in VariantModel.promiseGetFbData: " + error;
              console.log(msg);
              reject(msg);
             })

           },
           function(error) {
              var msg = "An error occurred in VariantModel.promiseGetFbData: " + error;
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
      var msg = "Problem in VariantModel.promiseGetFbData(): " + error;
      console.log(msg);
      reject(msg);
     })

  })


}

VariantModel.prototype.reconstituteFbData = function(theVcfData) {
  var me = this;
  var theFbData = $.extend({}, theVcfData);
  theFbData.features = [];
  theFbData.loadState = {clinvar: true, coverage: true, inheritance: true};
  // Add the unique freebayes variants to vcf data to include
  // in feature matrix
  theVcfData.features.forEach( function(v) {
    if (v.hasOwnProperty('fbCalled') && v.fbCalled == 'Y') {
      var variantObject = $.extend({}, v);
        theFbData.features.push(variantObject);
        variantObject.source = v;
    }
  });
  return theFbData;
}

VariantModel.prototype.promiseGetKnownVariants = function(geneObject, transcript, binLength) {
  var me = this;
  return new Promise( function(resolve, reject) {
    var refName = me._stripRefName(geneObject.chr);
    me.vcf.promiseGetKnownVariants(refName, geneObject, transcript, binLength)
            .then(function(results) {
              resolve(results);
              /*
              if (transcript) {
            var exonBins = me.binKnownVariantsByExons(geneObject, transcript, binLength, results);
            resolve(exonBins);
          } else {
                resolve(results);
          }
          */
            },
            function(error) {
              reject(error);
            });
  })
}

VariantModel.prototype.binKnownVariantsByExons = function(geneObject, transcript, binLength, results) {
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




VariantModel.prototype.promiseGetGeneCoverage = function(geneObject, transcript) {
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
          me.bam.getGeneCoverage(geneObject,
            transcript,
            [me.bam],
            function(theData, trRefName, theGeneObject, theTranscript) {
              var geneCoverageObjects = me._parseGeneCoverage(theData);
              if (geneCoverageObjects.length > 0) {
                me._setGeneCoverageExonNumbers(transcript, geneCoverageObjects);
                me.setGeneCoverageForGene(geneCoverageObjects, theGeneObject, theTranscript);
                resolve({model: me, gene: theGeneObject, transcript: theTranscript, 'geneCoverage': geneCoverageObjects});
              } else {
                console.log("Cannot get gene coverage for gene " + theGeneObject.gene_name);
                resolve({model: me, gene: theGeneObject, transcript: theTranscript, 'geneCoverage': []});
              }
            }
          );
        }
      }

     },
     function(error) {
      reject(error);
     });



  });
}

VariantModel.prototype._setGeneCoverageExonNumbers = function(transcript, geneCoverageObjects) {
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

VariantModel.prototype._parseGeneCoverage = function(theData) {
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

VariantModel.prototype.promiseGetCachedGeneCoverage = function(geneObject, selectedTranscript) {
  return this._promiseGetData(CacheHelper.GENE_COVERAGE_DATA, geneObject.gene_name, selectedTranscript);
}

VariantModel.prototype.setGeneCoverageForGene = function(geneCoverage, geneObject, transcript) {
  geneObject = geneObject ? geneObject : window.gene;
  transcript = transcript ? transcript : window.selectedTranscript;
  this._promiseCacheData(geneCoverage, CacheHelper.GENE_COVERAGE_DATA, geneObject.gene_name, transcript);
}



VariantModel.prototype.promiseGetBamData = function(geneObject) {
  var me = this;
  return new Promise(function(resolve, reject) {

    var data = null;

    if (geneObject == null) {
      reject("Error VariantModel.promiseGetBamData(): geneObject is null");
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
        var msg = "An error occurred in VariantModel.promiseGetBamData(): " + error;
        reject(msg);
       })
    }

  })
}


VariantModel.prototype.promiseGetDangerSummary = function(geneName) {
  return this._promiseGetData(CacheHelper.DANGER_SUMMARY_DATA, geneName, null);
}

VariantModel.prototype.promiseGetVariantCount = function(data) {
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
       },
       function(error) {
        var msg = "Problem in VariantModel.promiseGetVariantCount(): " + error;
        console.log(msg);
        reject(msg);
       })
    }
  })

}


VariantModel.prototype.promiseSummarizeDanger = function(geneName, theVcfData, options, geneCoverageAll, filterModel) {
  var me = this;
  return new Promise(function(resolve, reject) {
    var dangerSummary = VariantModel._summarizeDanger(geneName, theVcfData, options, geneCoverageAll, filterModel);
    me.promiseCacheDangerSummary(dangerSummary, geneName).then(function() {
      resolve(dangerSummary);
    },
    function(error) {
      reject(error);
    })
  })
}


VariantModel._summarizeDanger = function(geneName, theVcfData, options = {}, geneCoverageAll, filterModel) {
  var dangerCounts = $().extend({}, options);
  dangerCounts.geneName = geneName;
  VariantModel.summarizeDangerForGeneCoverage(dangerCounts, geneCoverageAll, filterModel);

  if (theVcfData == null ) {
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
  var consequenceClasses = {};
  var inheritanceClasses = {};
  var afClazz = null;
  var afField = null;
  var lowestAf = 999;
  dangerCounts.harmfulVariantsInfo = [];


  theVcfData.features.forEach( function(variant) {


      for (key in variant.highestImpactSnpeff) {
        if (translator.impactMap.hasOwnProperty(key) && translator.impactMap[key].badge) {
          impactClasses[key] = impactClasses[key] || {};
          impactClasses[key][variant.type] = variant.highestImpactSnpeff[key]; // key = effect, value = transcript id
        }
      }

      for (key in variant.highestImpactVep) {
        if (translator.impactMap.hasOwnProperty(key) && translator.impactMap[key].badge) {
          consequenceClasses[key] = consequenceClasses[key] || {};
          consequenceClasses[key][variant.type] = variant.highestImpactVep[key]; // key = consequence, value = transcript id
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

      if (variant.inheritance && variant.inheritance != 'none') {
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
    for (clazz in clazzes) {
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

  dangerCounts.CONSEQUENCE = getLowestImpact(consequenceClasses);
  dangerCounts.IMPACT = annotationScheme.toLowerCase() == 'vep' ? dangerCounts.CONSEQUENCE : getLowestImpact(impactClasses);
  dangerCounts.CLINVAR = getLowestClinvarClazz(clinvarClasses);
  dangerCounts.INHERITANCE = inheritanceClasses;

  var afSummaryObject = {};
  if (afClazz != null) {
    afSummaryObject[afClazz] = {field: afField, value: lowestAf};
  }
  dangerCounts.AF = afSummaryObject;

  dangerCounts.featureCount = theVcfData.features.length;
  dangerCounts.loadedCount  = theVcfData.features.filter(function(d) {
    if (d.hasOwnProperty('zygosity') && d.zygosity != null) {
      return d.zygosity.toUpperCase() != 'HOMREF' && !d.hasOwnProperty("fbCalled") || d.fbCalled != 'Y';
    } else {
      return !d.hasOwnProperty("fbCalled") || d.fbCalled != 'Y';
    }
  }).length;
  dangerCounts.calledCount  = theVcfData.features.filter(function(d) {
    if (d.hasOwnProperty('zygosity') && d.zygosity != null) {
      return d.zygosity.toUpperCase() != 'HOMREF' && d.hasOwnProperty("fbCalled") && d.fbCalled == 'Y';
    } else {
      return d.hasOwnProperty("fbCalled") && d.fbCalled == 'Y';
    }
  }).length;

  // Indicate if the gene pass the filter (if applicable)
  dangerCounts.failedFilter = filterModel.hasFilters() && dangerCounts.featureCount == 0;

  return dangerCounts;
}

VariantModel.summarizeDangerForGeneCoverage = function(dangerObject, geneCoverageAll, filterModel, clearOtherDanger=false, refreshOnly=false ) {
  dangerObject.geneCoverageInfo = {};
  dangerObject.geneCoverageProblem = false;


  if (geneCoverageAll && Object.keys(geneCoverageAll).length > 0) {
    for (relationship in geneCoverageAll) {
      var geneCoverage = geneCoverageAll[relationship];
      if (geneCoverage) {
        geneCoverage.forEach(function(gc) {
          if (gc.region != 'NA') {
            if (filterModel.isLowCoverage(gc)) {
              dangerObject.geneCoverageProblem = true;


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

VariantModel.summarizeError =  function(theError) {
  var summaryObject = {};

  summaryObject.CONSEQUENCE = {};
  summaryObject.IMPACT = {};
  summaryObject.CLINVAR = {}
  summaryObject.INHERITANCE = {};
  summaryObject.ERROR = theError;
  summaryObject.featureCount = 0;

  return summaryObject;
}


VariantModel.prototype.filterBamDataByRegion = function(coverage, regionStart, regionEnd) {
  return coverage.filter(function(d) {
    return (d[0] >= regionStart && d[0] <= regionEnd);
  });
}

VariantModel.prototype.reduceBamData = function(coverageData, numberOfPoints) {
  var factor = d3.round(coverageData.length / numberOfPoints);
  var xValue = function(d) { return d[0]; };
  var yValue = function(d) { return d[1]; };
  return this.bam.reducePoints(coverageData, factor, xValue, yValue);
}

VariantModel.prototype.setLoadedVariants = function(theVcfData) {
  this.vcfData = theVcfData;
}


VariantModel.prototype.setCalledVariants = function(theFbData, cache=false) {
  this.fbData = theFbData;
  if (cache) {
    this._promiseCacheData(theFbData, CacheHelper.FB_DATA, window.gene.gene_name, window.selectedTranscript);
  }
}

VariantModel.prototype.promiseGetCalledVariantCount = function() {
  var me = this;
  return new Promise(function(resolve, reject) {
    me.promiseGetFbData(window.gene, window.selectedTranscript, true)
     .then(function(data) {
      var theFbData = data.fbData;
      if (theFbData && theFbData.features ) {
        var count = theFbData.features
         .filter(function(d) {
          // Filter homozygous reference for proband only
          if (d.zygosity && d.zygosity.toLowerCase() == 'homref') {
            return false;
          }
          return true;
         }).length;
         resolve(count);
      } else {
        resolve(0);
      }

     },
     function(error) {
      var msg = "Problem in VariantModel.prototype.getCalledVariantCount(): " + error;
      console.log(msg);
      reject(msg);
     });
  })

}


VariantModel.prototype.promiseHasCalledVariants = function() {
  var me = this;
  return new Promise(function(resolve,reject) {
    if (me.fbData != null ) {
      resolve(me.fbData != null && me.fbData.features != null && me.fbData.features.length > 0);
    } else {
      me.promiseGetFbData(window.gene, window.selectedTranscript, true)
       .then(function(data) {
        resolve(data.fbData != null && data.fbData.features != null && data.fbData.features.length > 0);
       },
       function(error) {
        var msg = "Problem in VariantModel.promiseHasCalledVariants(): " + error;
        console.log(msg);
        reject(msg);
       })
    }

  })
}



VariantModel.prototype.promiseVariantsHaveBeenCalled = function() {
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
        var msg = "Problem in VariantModel.promiseVariantsHaveBeenCalled(): " + error;
        console.log(msg);
        reject(msg);
       });
    }
  })

}




VariantModel.prototype.getName = function() {
  return this.name;
}

VariantModel.prototype.setName = function(theName) {
  if (theName) {
    this.name = theName;
  }
}

VariantModel.prototype.setRelationship = function(theRelationship) {
  this.relationship = theRelationship;
}


VariantModel.prototype.isAffected = function() {
  return this.affectedStatus && this.affectedStatus == 'affected' ? true : false;
}


VariantModel.prototype.setAffectedStatus = function(theAffectedStatus) {
  this.affectedStatus = theAffectedStatus;
}


VariantModel.prototype.getRelationship = function() {
  return this.relationship;
}


VariantModel.prototype.setSampleName = function(sampleName) {
  this.sampleName = sampleName;
}

VariantModel.prototype.setGeneratedSampleName = function(sampleName) {
  this.sampleName = sampleName;
  this.isGeneratedSampleName = true;
}



VariantModel.prototype.getSampleName = function() {
  return this.sampleName;
}

VariantModel.prototype.getVcfSampleName = function() {
  // Returns a sample name if provided in the vcf header; otherwise returns null.
  return !this.isGeneratedSampleName ? (this.sampleName == "" ? null : this.sampleName) : null;
}


VariantModel.prototype.setDefaultSampleName = function(sampleName) {
  this.defaultSampleName = sampleName;
}


VariantModel.prototype.getDefaultSampleName = function() {
  return this.defaultSampleName;
}


VariantModel.prototype.getAffectedInfo = function() {
  return this.cohort.affectedInfo;
}


VariantModel.prototype.init = function(cohort) {
  var me = this;

  // init vcf.iobio
  this.cohort = cohort;
  this.vcf = vcfiobio();
  this.vcf.setEndpoint(this.cohort.endpoint);
};

VariantModel.prototype.getGeneModel = function() {
  return this.cohort.geneModel;
}

VariantModel.prototype.promiseBamFilesSelected = function(event) {
  var me = this;
  return new Promise(function(resolve, reject) {
    me.bamData = null;
    me.fbData = null;

    me.bam = new Bam();
    me.bam.openBamFile(event, function(success, message) {
      if (me.lastBamAlertify) {
        me.lastBamAlertify.dismiss();
      }
      if (success) {
        me.bamFileOpened = true;
        me.getBamRefName = me._stripRefName;
        resolve(me.bam.bamFile.name);

      } else {
        if (me.lastBamAlertify) {
          me.lastBamAlertify.dismiss();
        }
        var msg = "<span style='font-size:18px'>" + message + "</span>";
            alertify.set('notifier','position', 'top-right');
        me.lastBamAlertify = alertify.error(msg, 15);

        reject(message);

      }
    });

  });


}

VariantModel.prototype.onBamUrlEntered = function(bamUrl, baiUrl, callback) {
  var me = this;
  this.bamData = null;
  this.fbData = null;

  if (bamUrl == null || bamUrl.trim() == "") {
    this.bamUrlEntered = false;
    this.bam = null;

  } else {

    this.bamUrlEntered = true;
    this.bam = new Bam(this.cohort.endpoint, bamUrl, baiUrl);

    this.bam.checkBamUrl(bamUrl, baiUrl, function(success, errorMsg) {
      if (me.lastBamAlertify) {
        me.lastBamAlertify.dismiss();
      }
      if (!success) {
        this.bamUrlEntered = false;
        this.bam = null;
        var msg = "<span style='font-size:18px'>" + errorMsg + "</span><br><span style='font-size:12px'>" + bamUrl + "</span>";
            alertify.set('notifier','position', 'top-right');
        me.lastBamAlertify = alertify.error(msg, 15);
      }
      if(callback) {

        callback(success);
      }
    });

  }

    this.getBamRefName = this._stripRefName;

}

VariantModel.prototype.promiseVcfFilesSelected = function(event) {
  var me = this;

  return new Promise( function(resolve, reject) {
    me.sampleName = null;
    me.vcfData = null;

    me.vcf.openVcfFile( event,
      function(success, message) {
        if (me.lastVcfAlertify) {
          me.lastVcfAlertify.dismiss();
        }
        if (success) {


          me.vcfFileOpened = true;
          me.vcfUrlEntered = false;
          me.getVcfRefName = null;
          me.isMultiSample = false;

          // Get the sample names from the vcf header
            me.vcf.getSampleNames( function(sampleNames) {
              me.isMultiSample = sampleNames && sampleNames.length > 1 ? true : false;
              resolve({'fileName': me.vcf.getVcfFile().name, 'sampleNames': sampleNames});
            });
        } else {

          var msg = "<span style='font-size:18px'>" + message + "</span>";
            alertify.set('notifier','position', 'top-right');
            me.lastVcfAlertify = alertify.error(msg, 15);

          reject(message);
        }
      }
    );

  });
}

VariantModel.prototype.clearVcf = function(cardIndex) {

  this.vcfData = null;
  this.vcfUrlEntered = false;
  this.vcfFileOpened = false;
  this.sampleName = null;
  window.utility.removeUrl('sample'+ cardIndex);
  window.utility.removeUrl('vcf' + cardIndex);
  window.utility.removeUrl('name'+ cardIndex);
  this.vcf.clear();
}

VariantModel.prototype.clearBam = function(cardIndex) {

  this.bamData = null;
  this.bamUrlEntered = false;
  this.bamFileOpened = false;
  window.utility.removeUrl('bam' + cardIndex);
  if (this.bam) {
    this.bam.clear();
  }
}

VariantModel.prototype.onVcfUrlEntered = function(vcfUrl, tbiUrl, callback) {
  var me = this;
  this.vcfData = null;
  var success = true;
  this.sampleName = null;

  if (vcfUrl == null || vcfUrl == '') {
    this.vcfUrlEntered = false;
    success = false;

  } else {
    me.vcfUrlEntered = true;
      me.vcfFileOpened = false;
      me.getVcfRefName = null;
      me.isMultiSample = false;

      success = this.vcf.openVcfUrl(vcfUrl, tbiUrl, function(success, errorMsg) {
        if (me.lastVcfAlertify) {
          me.lastVcfAlertify.dismiss();
        }
        if (success) {

        me.vcfUrlEntered = true;
          me.vcfFileOpened = false;
          me.getVcfRefName = null;
          // Get the sample names from the vcf header
          me.vcf.getSampleNames( function(sampleNames) {
            me.isMultiSample = sampleNames && sampleNames.length > 1 ? true : false;
            callback(success, sampleNames);
          });
        } else {
          me.vcfUrlEntered = false;
          var msg = "<span style='font-size:18px'>" + errorMsg + "</span><br><span style='font-size:12px'>" + vcfUrl + "</span>";
          alertify.set('notifier','position', 'top-right');
          me.lastVcfAlertify = alertify.error(msg, 15);
          callback(success);
        }
      });

  }

}


VariantModel.prototype._promiseVcfRefName = function(ref) {
  var me = this;
  var theRef = ref != null ? ref : window.gene.chr;
  return new Promise( function(resolve, reject) {

    if (me.getVcfRefName != null) {
      // If we can't find the ref name in the lookup map, show a warning.
      if (me.vcfRefNamesMap[me.getVcfRefName(theRef)] == null) {
        reject();
      } else {
        resolve();
      }
    } else {
      me.vcfRefNamesMap = {};
      me.vcf.getReferenceLengths(function(refData) {
        var foundRef = false;
        refData.forEach( function(refObject) {
          var refName = refObject.name;

          if (refName == theRef) {
            me.getVcfRefName = me._getRefName;
            foundRef = true;
          } else if (refName == me._stripRefName(theRef)) {
            me.getVcfRefName = me._stripRefName;
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

          // If we didn't find the matching ref name, show a warning.
          reject();
        }

      });
    }
  });

}



VariantModel.prototype._getRefName = function(refName) {
  return refName;
}

VariantModel.prototype._stripRefName = function(refName) {
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
  return strippedName;
}


VariantModel.prototype.promiseGetMatchingVariant = function(variant) {
  var me = this;
  return new Promise(function(resolve, reject) {
    var theVcfData = me.promiseGetVcfData(window.gene, window.selectedTranscript)
     .then(function(data) {
      var theVcfData = data.vcfData;
      var matchingVariant = null;
      if (theVcfData && theVcfData.features) {
        theVcfData.features.forEach(function(v) {
          if (v.start == variant.start
              && v.end == variant.end
              && v.ref == variant.ref
              && v.alt == variant.alt
              && v.type.toLowerCase() == variant.type.toLowerCase()) {
            matchingVariant = v;
          }
        });
      }
      resolve(matchingVariant);
     },
     function(error) {
      var msg = "A problem occurred in VariantModel.promiseGetMatchingVariant(): " + error;
      console.log(msg);
      reject(msg);
     })

  });
}

/*
* A gene has been selected. Clear out the model's state
* in preparation for getting data.
*/
VariantModel.prototype.wipeGeneData = function () {
  var me = this;
  this.vcfData = null;
  this.fbData = null;
  this.bamData = null;
}



VariantModel.prototype.getBamDepth = function(gene, selectedTranscript, callbackDataLoaded) {
  var me = this;


  if (!this.isBamLoaded()) {
    if (callbackDataLoaded) {
      callbackDataLoaded();
    }
    return;
  }

  var performCallbackForCachedData = function(regions, theVcfData, coverageData) {
    if (regions.length > 0) {
      me._refreshVariantsWithCoverage(theVcfData, coverageData, function() {
        if (callbackDataLoaded) {
              callbackDataLoaded(coverageData);
            }
      });
    } else {
      if (callbackDataLoaded) {
            callbackDataLoaded(coverageData);
          }
    }
  }

  var performCallback = function(regions, theVcfData, coverageForRegion, coverageForPoints) {
    if (regions.length > 0) {
      me._refreshVariantsWithCoverage(theVcfData, coverageForPoints, function() {
        if (callbackDataLoaded) {
              callbackDataLoaded(coverageForRegion);
            }
      });
    } else {
      if (callbackDataLoaded) {
            callbackDataLoaded(coverageForRegion, CacheHelper.BAM_DATA);
          }
    }
  }


  // A gene has been selected.  Read the bam file to obtain
  // the read converage.
  var refName = this.getBamRefName(gene.chr);
  this.promiseGetVcfData(gene, selectedTranscript)
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
        me.bam.getCoverageForRegion(refName, gene.start, gene.end, regions, 2000, useServerCache,
          function(coverageForRegion, coverageForPoints) {
            if (coverageForRegion != null) {
            me.bamData = {gene: gene.gene_name,
                        ref: refName,
                        start: gene.start,
                        end: gene.end,
                        coverage: coverageForRegion};

            // Use browser cache for storage coverage data if app is not relying on
            // server-side cache
            if (!useServerCache) {
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

        });
      }

     })

   })
}



VariantModel.prototype.promiseAnnotated = function(theVcfData) {
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

VariantModel.prototype.promiseAnnotatedAndCoverage = function(theVcfData) {
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

VariantModel.prototype.promiseGetVariantExtraAnnotations = function(theGene, theTranscript, variant, format, getHeader = false, sampleNames) {
  var me = this;

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
      if (format && format == 'csv') {
        // Exporting data requires additional data to be returned to link
        // the extra annotations back to the original bookmarked entries.
        resolve([variant, variant, ""]);
      } else {
        resolve(variant);
      }
    } else {
      me._promiseVcfRefName(theGene.chr).then( function() {
        me.vcf.promiseGetVariants(
           me.getVcfRefName(theGene.chr),
           fakeGeneObject,
             theTranscript,
             null,   // regions
             false,  // is multi-sample
             me._getSamplesToRetrieve(),  // sample names
             annotationScheme.toLowerCase(), // annot scheme
             translator.clinvarMap,  // clinvar map
             me.getGeneModel().geneSource == 'refseq' ? true : false,
             true,  // hgvs notation
             true,  // rsid
             false, // vep af
             useServerCache // serverside cache
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

            if (theVcfData != null && theVcfData.features != null && theVcfData.features.length > 0) {
              // Now update the hgvs notation on the variant
              var matchingVariants = theVcfData.features.filter(function(aVariant) {
                var matches =
                     ( variant.start == aVariant.start &&
                       variant.alt   == aVariant.alt &&
                       variant.ref   == aVariant.ref );
                return matches;
              });
              if (matchingVariants.length > 0) {
                var v = matchingVariants[0];
                if (format && format == 'csv') {
                  resolve([v, variant, vcfRecords]);
                } else if (format && format == 'vcf') {
                  if (vcfRecords) {
                    resolve([v, variant, vcfRecords]);
                  } else {
                    reject('Cannot find vcf record for variant ' + theGene.gene_name + " " + variant.start + " " + variant.ref + "->" + variant.alt);
                  }
                } else {
                  me._promiseGetData(CacheHelper.VCF_DATA, theGene.gene_name, theTranscript)
                   .then(function(cachedVcfData) {
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
                        theVariant.extraAnnot = true;
                        theVariant.vepHGVSc = v.vepHGVSc;
                        theVariant.vepHGVSp = v.vepHGVSp;
                        theVariant.vepVariationIds = v.vepVariationIds;

                        // re-cache the data
                        me._promiseCacheData(cachedVcfData, CacheHelper.VCF_DATA, theGene.gene_name, theTranscript)
                         .then(function() {
                          // return the annotated variant
                        resolve(theVariant);
                         }, function(error) {
                          var msg = "Problem caching data in VariantModel.promiseGetVariantExtraAnnotations(): " + error;
                          console.log(msg);
                          reject(msg);
                         });

                      } else {
                        var msg = "Cannot find corresponding variant to update HGVS notation for variant " + v.chrom + " " + v.start + " " + v.ref + "->" + v .alt;
                        console.log(msg);
                        reject(msg);
                      }
                    } else {
                      var msg = "Unable to update gene vcfData cache with updated HGVS notation for variant " + v.chrom + " " + v.start + " " + v.ref + "->" + v.alt;
                      console.log(msg);
                      reject(msg);

                    }

                   })

                }
              } else {
                reject('Cannot find vcf record for variant ' + theGene.gene_name + " " + variant.start + " " + variant.ref + "->" + variant.alt);
              }


            } else {
              var msg = "Empty results returned from VariantModel.promiseGetVariantExtraAnnotations() for variant " + variant.chrom + " " + variant.start + " " + variant.ref + "->" + variant.alt;
              console.log(msg);
              if (format == 'csv' || format == 'vcf') {
                resolve([variant, variant, []]);
              }
              reject(msg);
            }

        });
      });
    }
  });

}

VariantModel.prototype.promiseGetImpactfulVariantIds = function(theGeneObject, theTranscript) {
  var me = this;


  return new Promise( function(resolve, reject) {

    var trRefName = null;

    me._promiseVcfRefName(theGeneObject.chr)
     .then( function() {
      trRefName = me.getVcfRefName(theGeneObject.chr);

      // Get the coords for variants of high or moder impact
      return me._promiseGetData(CacheHelper.VCF_DATA, theGeneObject.gene_name, theTranscript)
     })
     .then( function(theVcfData) {

      var regions   = theVcfData.features.filter(function(variant) {
        if (variant.fbCalled == 'Y')  {
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
             annotationScheme.toLowerCase(), // annot scheme
             translator.clinvarMap,  // clinvar map
             me.getGeneModel().geneSource == 'refseq' ? true : false,
             true,  // hgvs notation
             true,  // rsid
             false, // vep af
             useServerCache // serverside cache
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
                var msg = "Problem caching data in VariantModel.promiseGetImpactfulVariantIds(): " + error;
                console.log(msg);
                reject(msg);
               })
            } else {
              var msg = "Empty results returned from VariantModel.promiseGetImpactfulVariantIds() for gene " + theGeneObject.gene_name;
              console.log(msg);
              reject(msg);
            }

        });

      } else {
        var alreadyAnnotVariants = theVcfData.features.filter(function(variant) {
          return (variant.fbCalled != 'Y' && variant.extraAnnot);
        });
        resolve(alreadyAnnotVariants);
      }

     },
     function(error) {
      var msg = "A problem occurred in VariantModel.promiseGetImpactfulVariantIds(): " + error;
      console.log(msg);
      reject(msg);
     })


  });

}




VariantModel.prototype.promiseAnnotateVariants = function(theGene, theTranscript, variantModels, isMultiSample, isBackground, onVcfData) {
  var me = this;


    // If this is the refseq gene model, set the annotation
    // scheme on the filter card to 'VEP' since snpEff will
    // be bypassed at this time.
    if (me.getGeneModel().geneSource == 'refseq') {
      annotationScheme = "VEP";
    }

  return new Promise( function(resolve, reject) {

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
    //.then(function() {
    //  return Promise.all(bookmarkPromises)
    //})
    .then(function() {
      if (Object.keys(resultMap).length == variantModels.length) {
        resolve(resultMap);
      } else {

        // We don't have the variants for the gene in cache,
        // so call the iobio services to retreive the variants for the gene region
        // and annotate them.
        me._promiseVcfRefName(theGene.chr)
        .then( function() {
          return me.vcf.promiseGetVariants(
             me.getVcfRefName(theGene.chr),
             theGene,
             theTranscript,
             null,   // regions
             isMultiSample, // is multi-sample
             me._getSamplesToRetrieve(),
             me.getRelationship() == 'known-variants' ? 'none' : annotationScheme.toLowerCase(),
             translator.clinvarMap,
             me.getGeneModel().geneSource == 'refseq' ? true : false,
             window.isLevelBasic || global_getVariantIdsForGene,  // hgvs notation
             global_getVariantIdsForGene,  // rsid
             global_vepAF    // vep af
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

            // Associate the correct gene with the data
            var theGeneObject = null;
            for( var key in me.getGeneModel().geneObjects) {
              var geneObject = me.getGeneModel().geneObjects[key];
              if (me.getVcfRefName(geneObject.chr) == data.ref &&
                geneObject.start == data.start &&
                geneObject.end == data.end &&
                geneObject.strand == data.strand) {
                theGeneObject = geneObject;
              }
            }
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

                  theVcfData.gene = theGeneObject;
                  resultMap[model.relationship] = theVcfData;


                  // Flag any bookmarked variants
                  //me._promiseDetermineVariantBookmarks(theVcfData, theGeneObject, theTranscript).then(function() {


                      if (!isBackground) {
                        model.vcfData = theVcfData;
                      }
                      idx++;
                      postProcessNextVariantCard(idx, callback);

                  //})

                }
              }

              postProcessNextVariantCard(idx, function() {

                resolve(resultMap);

              });

            } else {
              var error = "ERROR - cannot locate gene object to match with vcf data " + data.ref + " " + data.start + "-" + data.end;
              console.log(error);
              reject(error);
            }
          } else {
            var error = "ERROR - empty vcf results for " + theGene.gene_name;;
            console.log(error);
            reject(error);
          }


        },
        function(error) {
          reject("missing reference")
        });
      }
    },
    function(error) {
      reject(error);
    });

  });

}


VariantModel.prototype._promiseDetermineVariantBookmarks = function(theVcfData, theGeneObject, theTranscript) {
  var me = this;

  if (me.getRelationship() == 'proband') {
    return bookmarkCard.promiseDetermineVariantBookmarks(theVcfData, theGeneObject, theTranscript);
  } else {
    return new Promise(function(resolve, reject) {
      resolve();
    })
  }

}


VariantModel.prototype.determineAffectedStatus = function(data, theGene, theTranscript, affectedInfo, callback) {
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
      return info.status == 'affected' && info.relationship != 'proband';
    })
    me._determineAffectedStatusImpl(theVcfData, 'affected', affectedSibs)

    var unaffectedSibs = affectedInfo.filter(function(info) {
      return info.status == 'unaffected' && info.relationship != 'proband';
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
    var msg = "An error occurred in VariantModel.determineAffectedStatus(): " + error;
    console.log(msg);
    if (callback) {
      callback(null);
    }
  })


}


VariantModel.prototype.assessVariantImpact = function(theVcfData, theTranscript) {
  var me = this;
  if (theVcfData == null || theVcfData.features == null) {
    return;
  }

  theVcfData.features.forEach(function(variant) {

    variant.harmfulVariantLevel = 'none';
    variant.harmfulVariant = null;
    variant.afFieldHighest = null;
    variant.afHighest = '.';

    var variantDanger = {meetsAf: false, af: false, impact: false,  clinvar: false, sift: false, polyphen: false, inheritance: false};

      // For ExAC levels, differentiate between af not found and in
      // coding region (level = private) and af not found and intronic (non-coding)
      // region (level = unknown)
      if (variant.afExAC == 0) {
      variant.afExAC = -100;
        me.getGeneModel().getCodingRegions(theTranscript).forEach(function(codingRegion) {
          if (variant.start >= codingRegion.start && variant.end <= codingRegion.end) {
            variant.afExAC = 0;
          }
        });
      }
      if (variant.afgnomAD == '.') {
        variant.afgnomAD = 0;
      }


      for (key in variant.highestImpactVep) {
        if (translator.impactMap.hasOwnProperty(key) && translator.impactMap[key].badge) {
          if (key == 'HIGH' || key == 'MODERATE') {
            variantDanger.impact = key.toLowerCase();
          }
        }
      }

      for (key in variant.highestSIFT) {
      if (translator.siftMap.hasOwnProperty(key) && translator.siftMap[key].badge) {
        variantDanger.sift = key.split("_").join(" ").toLowerCase();
      }
      }

      for (key in variant.highestPolyphen) {
        if (translator.polyphenMap.hasOwnProperty(key) && translator.polyphenMap[key].badge) {
        variantDanger.polyphen = key.split("_").join(" ").toLowerCase();
        }
      }

      if (variant.hasOwnProperty('clinvar')) {
        var clinvarEntry = null;
        var clinvarDisplay = null;
        var clinvarKey = null;
        for (var key in translator.clinvarMap) {
          var self = translator.clinvarMap[key];
          if (self.clazz == variant.clinvar) {
            clinvarEntry = self;
            clinvarDisplay = key;
            clinvarKey = key;
          }
        }
        if (clinvarEntry && clinvarEntry.badge) {
        variantDanger.clinvar = clinvarDisplay;
        }
      }

      if (variant.inheritance && variant.inheritance != 'none') {
        variantDanger.inheritance = true;
      }

      // Figure out which is the highest AF between exac, 1000g, and gnomAD
    me._determineHighestAf(variant);

    // Determine if the highest AF is in a range that we consider 'rare'
    if (variant.afFieldHighest) {
      translator.afHighestMap.forEach( function(rangeEntry) {
        if (+variant.afHighest > rangeEntry.min && +variant.afHighest <= rangeEntry.max) {
          if (rangeEntry.badge) {
            variantDanger.af = +variant.afHighest;
            variantDanger.meetsAf = true;
          }
        }
      });
    }

    // Turn on flag for harmful variant if one is found
    if (variantDanger.meetsAf && (variantDanger.impact || variantDanger.clinvar || variantDanger.sift || variantDanger.polyphen)) {
      variant.harmfulVariant = {
                'type'       : variant.type,
                  'clinvar'    : variantDanger.clinvar,
                  'polyphen'   : variantDanger.polyphen,
                  'SIFT'       : variantDanger.sift,
                'impact'     : variantDanger.impact,
                  'inheritance': variant.inheritance && variant.inheritance != 'none' ? variant.inheritance : false,
                  'level'      : variantDanger.clinvar ? 1 : (variantDanger.impact == 'high' ? 2 : 3)
      };
      variant.harmfulVariantLevel = variant.harmfulVariant.level;
    }
  });

}

VariantModel.prototype._determineHighestAf = function(variant) {
  var me = this;
  // Find the highest value (the least rare AF) betweem exac and 1000g to evaluate
  // as 'lowest' af for all variants in gene
  var afHighest = null;
  if ($.isNumeric(variant.afExAC) && $.isNumeric(variant.af1000G)) {
    // Ignore exac n/a.  If exac is higher than 1000g, evaluate exac
    if (variant.afExAC > -100 && variant.afExAC >= variant.af1000G) {
      variant.afFieldHighest = 'afExAC';
    } else {
      variant.afFieldHighest = 'af1000G';
    }
  } else if ($.isNumeric(variant.afExAC)) {
    variant.afFieldHighest = 'afExAC';

  } else if ($.isNumeric(variant.af1000G)) {
    variant.afFieldHighest = 'af1000G';
  }
  afHighest = me.getHighestAf(variant);

  if (global_vepAF) {
    if ($.isNumeric(variant.vepAf.gnomAD.AF) && afHighest) {
      if (variant.vepAf.gnomAD.AF >= afHighest) {
        variant.afFieldHighest = 'afgnomAD';
      }
    } else if ($.isNumeric(variant.vepAf.gnomAD.AF)) {
      variant.afFieldHighest = 'afgnomAD';
    }
  }
  variant.afHighest = me.getHighestAf(variant);
}

VariantModel.prototype.getHighestAf = function(variant) {
  var me = this;
  if (variant.afFieldHighest) {
    var subfields = variant.afFieldHighest.split(".");
    var current = variant;
    subfields.forEach(function(subfield) {
      current = current[subfield];
    })
    return current;
  } else {
    return null;
  }
}


VariantModel.prototype._determineAffectedStatusImpl = function(theVcfData, affectedStatus, affectedInfo) {
  var me = this;
  theVcfData.features.forEach( function(variant) {
    VariantModel._determineAffectedStatusForVariant(variant, affectedStatus, affectedInfo);
  });
}

VariantModel._determineAffectedStatusForVariant = function(variant, affectedStatus, affectedInfo) {

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


VariantModel.prototype.promiseIsCached = function(geneName, transcript) {
  var me = this;

  return new Promise(function(resolve, reject) {
    var key = me._getCacheKey(CacheHelper.VCF_DATA, geneName.toUpperCase(), transcript);
    cacheHelper.promiseGetData(key)
     .then(function(data) {
      resolve(data != null && data != "");
     },
     function(error) {
      reject(error);
     })

  })
}

VariantModel.prototype.promiseIsCachedAndInheritanceDetermined = function(geneObject, transcript, checkForCalledVariants) {
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
      var msg = "A problem occurred in VariantModel.promiseIsCachedAndInheritanceDetermined(): " + error;
      console.log(msg);
      reject(msg);
     });

  })
}



VariantModel.prototype._getCacheKey = function(dataKind, geneName, transcript) {
  return cacheHelper.getCacheKey(
    {relationship: this.getRelationship(),
     sample: (this.sampleName != null ? this.sampleName : "null"),
     gene: (geneName != null ? geneName : gene.gene_name),
     transcript: (transcript != null ? transcript.transcript_id : "null"),
     annotationScheme: (annotationScheme.toLowerCase()),
     dataKind: dataKind
    }
  );

}
VariantModel.prototype.promiseCacheDangerSummary = function(dangerSummary, geneName) {
  return this._promiseCacheData(dangerSummary, CacheHelper.DANGER_SUMMARY_DATA, geneName);
}

VariantModel.prototype.clearCacheItem = function(dataKind, geneName, transcript) {
  var me = this;
  var key = me._getCacheKey(dataKind, geneName, transcript);
  cacheHelper.promiseRemoveCacheItem(dataKind, key);
}

/*
VariantModel.prototype.pruneIntronVariants = function(data) {
  if (data.features.length > 500) {
    filterCard.setExonicOnlyFilter();
  } else {
    filterCard.setExonicOnlyFilter(false);
  }
}
*/

VariantModel.prototype._getSamplesToRetrieve = function() {
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

      } else if (info.model.getVcfSampleName() && me._otherSampleInThisVcf(info.model) ) {
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

VariantModel.prototype._otherSampleInThisVcf = function(otherModel) {
  var me = this;
  var theVcfs = {};

  var pushVcfFile = function(model) {
    if (model.vcfUrlEntered) {
      theVcfs[model.vcf.getVcfURL()] = true;
    } else {
      theVcfs[model.vcf.getVcfFile().name] = true;
    }
  }

  pushVcfFile(me);
  pushVcfFile(otherModel);

  return Object.keys(theVcfs).length == 1;
}






VariantModel.prototype._pileupVariants = function(features, start, end) {
  var me = this;
  var width = 1000;
  var theFeatures = features;
  theFeatures.forEach(function(v) {
    v.level = 0;
  });

  var featureWidth = isLevelEdu || isLevelBasic ? EDU_TOUR_VARIANT_SIZE : 4;
  var posToPixelFactor = Math.round((end - start) / width);
  var widthFactor = featureWidth + (isLevelEdu || isLevelBasic ? EDU_TOUR_VARIANT_SIZE * 2 : 4);
  var maxLevel = this.vcf.pileupVcfRecords(theFeatures, start, posToPixelFactor, widthFactor);
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
      maxLevel = me.vcf.pileupVcfRecords(theFeatures, start, factor, featureWidth + 1);
      if (maxLevel <= 50) {
        i = posToPixelFactor;
        break;
      }
    }
  }
  return { 'maxLevel': maxLevel, 'featureWidth': featureWidth };
}


VariantModel.prototype.flagDupStartPositions = function(variants) {
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

VariantModel.prototype._refreshVariantsWithCoverage = function(theVcfData, coverage, callback) {
  var me = this;
  var vcfIter = 0;
  var covIter = 0;
  if (theVcfData == null) {
    callback();
  }
  var recs = theVcfData.features;

    me.flagDupStartPositions(recs);

  for( var vcfIter = 0, covIter = 0; vcfIter < recs.length; null) {
    // Bypass duplicates
    if (recs[vcfIter].dup) {
      recs[vcfIter].bamDepth = recs[vcfIter-1].bamDepth;
      vcfIter++;
    }
    if (vcfIter >= recs.length) {

    } else {
          if (covIter >= coverage.length) {
            recs[vcfIter].bamDepth = "";
            vcfIter++;
        } else {
        var coverageRow = coverage[covIter];
        var coverageStart = coverageRow[0];
        var coverageDepth = coverageRow[1];

        // compare curr variant and curr coverage record
        if (recs[vcfIter].start == coverageStart) {
          recs[vcfIter].bamDepth = +coverageDepth;
          vcfIter++;
          covIter++;
        } else if (recs[vcfIter].start < coverageStart) {
          recs[vcfIter].bamDepth = "";
          vcfIter++;
        } else {
          //console.log("no variant corresponds to coverage at " + coverageStart);
          covIter++;
        }

          }
    }

  }
  if (!theVcfData.hasOwnProperty('loadState')) {
    theVcfData.loadState = {};
  }
  theVcfData.loadState['coverage'] = true;
  callback();


}

VariantModel.prototype._refreshVariantsWithVariantIds = function(theVcfData, annotatedVcfData) {

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
            variant.vepHGVSc        = annotatedRec.vepHGVSc;
            variant.vepHGVSp        = annotatedRec.vepHGVSp;
            variant.vepVariationIds = annotatedRec.vepVariationIds;

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
  var sortedFeatures      = theVcfData.features.sort(VariantModel.orderVariantsByPosition);
  var sortedAnnotVariants = annotatedVcfData.features.sort(VariantModel.orderVariantsByPosition)
  loadVariantIds(sortedFeatures, sortedAnnotVariants);
}

VariantModel.prototype._refreshVariantsWithClinvarEutils = function(theVcfData, clinVars) {
  var me = this;
  var clinVarIds = clinVars.uids;
  if (theVcfData == null) {
    return;
  }

  var loadClinvarProperties = function(recs) {
    for( var vcfIter = 0, clinvarIter = 0; vcfIter < recs.length && clinvarIter < clinVarIds.length; null) {
      var uid = clinVarIds[clinvarIter];
      var clinVarStart = clinVars[uid].variation_set[0].variation_loc.filter(function(v){return v["assembly_name"] == genomeBuildHelper.getCurrentBuildName()})[0].start;
      var clinVarAlt   = clinVars[uid].variation_set[0].variation_loc.filter(function(v){return v["assembly_name"] == genomeBuildHelper.getCurrentBuildName()})[0].alt;
      var clinVarRef   = clinVars[uid].variation_set[0].variation_loc.filter(function(v){return v["assembly_name"] == genomeBuildHelper.getCurrentBuildName()})[0].ref;


      // compare curr variant and curr clinVar record
      if (recs[vcfIter].clinvarStart == clinVarStart) {
        // add clinVar info to variant if it matches
        if (recs[vcfIter].clinvarAlt == clinVarAlt &&
          recs[vcfIter].clinvarRef == clinVarRef) {
          me._addClinVarInfoToVariant(recs[vcfIter], clinVars[uid]);
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
  var sortedFeatures = theVcfData.features.sort(VariantModel.orderVariantsByPosition);
  loadClinvarProperties(sortedFeatures);

}


VariantModel.prototype._refreshVariantsWithClinvarVCFRecs= function(theVcfData, clinvarVariants) {
  var me = this;
  if (theVcfData == null) {
    return;
  }


  var loadClinvarProperties = function(recs, clinvarRecs) {
    for( var vcfIter = 0, clinvarIter = 0; vcfIter < recs.length && clinvarIter < clinvarRecs.length; null) {

      var clinvarRec = clinvarRecs[clinvarIter];

      // compare curr variant and curr clinVar record
      if (recs[vcfIter].start == +clinvarRec.pos) {


        // add clinVar info to variant if it matches
        if (recs[vcfIter].alt == clinvarRec.alt &&
          recs[vcfIter].ref == clinvarRec.ref) {
          var variant = recs[vcfIter];

          var result = me.vcf.parseClinvarInfo(clinvarRec.info, translator.clinvarMap);
          for (var key in result) {
            variant[key] = result[key];
          }

          vcfIter++;
          clinvarIter++;
        } else {
          // If clinvar entry didn't match the variant, figure out if the vcf
          // iter (multiple vcf recs with same position as 1 clinvar rec) or
          // the clinvar iter needs to be advanced (multiple clinvar recs with same
          // position as 1 vcf rec)
          if (vcfIter+1 < recs.length && recs[vcfIter+1].start == +clinvarRec.pos) {
            vcfIter++;
          } else {
            clinvarIter++;
          }
        }

      } else if (recs[vcfIter].start < +clinvarRec.pos) {
        vcfIter++;
      } else {
        clinvarIter++;
      }
    }
  }

  // Load the clinvar info for the variants loaded from the vcf
  var sortedFeatures = theVcfData.features.sort(VariantModel.orderVariantsByPosition);
  var sortedClinvarVariants = clinvarVariants.sort(VariantModel.orderVariantsByPosition)
  loadClinvarProperties(sortedFeatures, sortedClinvarVariants);

}


VariantModel.prototype._addClinVarInfoToVariant = function(variant, clinvar) {
  variant.clinVarUid = clinvar.uid;

  if (!variant.clinVarAccession) {
    variant.clinVarAccession = clinvar.accession;
  }

  var clinSigObject = variant.clinVarClinicalSignificance;
  if (clinSigObject == null) {
    variant.clinVarClinicalSignificance = {"none": "0"};
  }

  var clinSigString = clinvar.clinical_significance.description;
  var clinSigTokens = clinSigString.split(", ");
  var idx = 0;
  clinSigTokens.forEach( function(clinSigToken) {
    if (clinSigToken != "") {
      // Replace space with underlink
      clinSigToken = clinSigToken.split(" ").join("_").toLowerCase();
      variant.clinVarClinicalSignificance[clinSigToken] = idx.toString();
      idx++;

      // Get the clinvar "classification" for the highest ranked clinvar
      // designation. (e.g. "pathogenic" trumps "benign");
      var mapEntry = translator.clinvarMap[clinSigToken];
      if (mapEntry != null) {
        if (variant.clinvarRank == null ||
          mapEntry.value < variant.clinvarRank) {
          variant.clinvarRank = mapEntry.value;
          variant.clinvar = mapEntry.clazz;
        }
      }
    }

  });



  var phenotype = variant.clinVarPhenotype;
  if (phenotype == null) {
    variant.clinVarPhenotype = {};
  }

  var phTokens = clinvar.trait_set.map(function(d) { return d.trait_name; }).join ('; ')
  if (phTokens != "") {
    var tokens = phTokens.split("; ");
    var idx = 0;
    tokens.forEach(function(phToken) {
      // Replace space with underlink
      phToken = phToken.split(" ").join("_");
      variant.clinVarPhenotype[phToken.toLowerCase()] = idx.toString();
      idx++;
    });
  }
}




VariantModel.prototype.loadCalledTrioGenotypes = function(theVcfData, theFbData) {
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


/*
VariantModel.prototype._prepareVcfAndFbData = function(theFbData, theVcfData) {
  var me = this;
  var theFbData = theFbData ? theFbData : me.fbData;
  var theVcfData = theVcfData ? theVcfData : me.vcfData;
  // Deal with case where no variants were loaded
  if (!me.isVcfLoaded()) {
    // If no variants are loaded, create a dummy vcfData with 0 features
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
      return me.addCalledVariantsToVcfData(theVcfData, theFbData);
     })
     .then(function() {
      // Flag the variants as called by Freebayes and add unique to vcf
      // set
      theVcfData.features = theVcfData.features.filter( function(feature) {
          return feature.fbCalled == null;
        });

      // This may not be the first time we call freebayes, so to
      // avoid duplicate variants, get rid of the ones
      // we added last round.
      theVcfData.features = theVcfData.features.filter( function(d) {
        return d.consensus != 'unique2';
      });
     },
     function(error) {
      console.log("A problem occurred in VariantModel._prepareVcfAndFbData(): " + error);
     })
  }
}
*/

VariantModel.prototype.isAlignmentsOnly = function() {
  return !this.isVcfReadyToLoad() && this.isBamLoaded();
}


/*
 *  For trios, mother and father vcf data cache was cleared out, so now
 *  we need to reconstruct vcf data to equal loaded variants + unique freebayes
 *  variants
 */
VariantModel.prototype.addCalledVariantsToVcfData = function(theVcfData, theFbData) {
  var me = this;

  // Exit if there are no cached called variants
  if (theFbData == null || theFbData.features.length == 0) {
    return;
  }


  // We have to order the variants in both sets before comparing
  theVcfData.features = theVcfData.features.sort(VariantModel.orderVariantsByPosition);
  theFbData.features  = theFbData.features.sort(VariantModel.orderVariantsByPosition);

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


VariantModel.prototype._determineUniqueFreebayesVariants = function(geneObject, theTranscript, theVcfData, theFbData) {
  var me = this;


  if (theVcfData == null) {
    theVcfData = me.vcfData;
  }
  if (theFbData == null) {
    theFbData = me.fbData;
  }


  // We have to order the variants in both sets before comparing
  theVcfData.features = theVcfData.features.sort(VariantModel.orderVariantsByPosition);
  theFbData.features  = theFbData.features.sort(VariantModel.orderVariantsByPosition);

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

  // Figure out max level (lost for some reason)
  var maxLevel = 1;
  theVcfData.features.forEach(function(feature) {
    if (feature.level > maxLevel) {
      maxLevel = feature.level;
    }
  });
  theVcfData.maxLevel = maxLevel;

  pileupObject = me._pileupVariants(theFbData.features, geneObject.start, geneObject.end);
  theFbData.maxLevel = pileupObject.maxLevel + 1;
  theFbData.featureWidth = pileupObject.featureWidth;

}



VariantModel.prototype.filterVariants = function(data, filterObject, start, end, bypassRangeFilter) {
  var me = this;

  if (data == null || data.features == null) {
    console.log("Empty data/features");
    return;
  }

  if (me.relationship == 'known-variants') {
    return me.filterKnownVariants(data, start, end, bypassRangeFilter);
  }


  var impactField = annotationScheme.toLowerCase() === 'snpeff' ? 'impact' : IMPACT_FIELD_TO_FILTER;
  var effectField = annotationScheme.toLowerCase() === 'snpeff' ? 'effect' : 'vepConsequence';

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
      for (key in d[impactField]) {
        if (key.toLowerCase() == 'high' || key.toLowerCase() == 'moderate') {
          meetsExonic = true;
        }
      }
      if (!meetsExonic) {
        for (key in d[effectField]) {
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
    for (key in filterObject.annotsToInclude) {
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
          for (avKey in annotValue) {
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
    for (key in evaluations) {
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
    for (key in evaluations) {
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

  var pileupObject = this._pileupVariants(filteredFeatures, start, end);

  var vcfDataFiltered = {
    intronsExcludedCount: intronsExcludedCount,
    end: end,
    features: filteredFeatures,
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

VariantModel.prototype.filterKnownVariants = function(data, start, end, bypassRangeFilter, filterModel) {
  var me = this;

  var theFilters = filterModel.getModelSpecificFilters('known-variants').filter(function(theFilter) {
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

VariantModel.calcMaxAlleleCount = function(theVcfData, maxAlleleCount=0) {
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



VariantModel.prototype.promiseCompareVariants = function(theVcfData, compareAttribute, matchAttribute, matchFunction, noMatchFunction ) {
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
           annotationScheme.toLowerCase(),
           translator.clinvarMap,
           me.getGeneModel().geneSource == 'refseq' ? true : false)
        .then( function(data) {

          if (data != null && data.features != null) {
            var annotatedRecs = data[0];
              me.vcfData = data[1];

            me.vcfData.features = me.vcfData.features.sort(VariantModel.orderVariantsByPosition);
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
      }, function(error) {
        console.log("missing reference");
        reject("missing reference");
      });

    } else {
      me.vcfData.features = me.vcfData.features.sort(VariantModel.orderVariantsByPosition);
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




VariantModel.prototype._promiseGetData = function(dataKind, geneName, transcript) {
  var me = this;
  return new Promise(function(resolve, reject) {

    if (geneName == null) {
      var msg = "VariantModel._promiseGetData(): empty gene name";
      console.log(msg);
      reject(msg);
    } else {
      var key = me._getCacheKey(dataKind, geneName.toUpperCase(), transcript)
      cacheHelper.promiseGetData(key)
       .then(function(data) {
        resolve(data);
       },
       function(error) {
        var msg = "An error occurred in VariantModel._promiseGetData(): " + error;
        console.log(msg);
        reject(msg);
       })
    }
  })
}

VariantModel.prototype._promiseCacheData = function(data, dataKind, geneName, transcript) {
  var me = this;
  return new Promise(function(resolve, reject) {
    var key = me._getCacheKey(dataKind, geneName.toUpperCase(), transcript);
    cacheHelper.promiseCacheData(key, data)
     .then(function() {
      resolve();
     },
     function(error) {
      CacheHelper.showError(key, error);
        genesCard.hideGeneBadgeLoading(geneName);
        genesCard.clearGeneGlyphs(geneName);
        genesCard.setGeneBadgeError(geneName);
        alertify.set('notifier','position', 'top-right');
        alertify.error("Error occurred when compressing analyzed data before caching.", 15);
      reject(error);
     })
  })
}






/*
*  Evaluate the highest impacts for a variant across all transcripts.
*  Cull the impact if it already annotated for the canonical transcript
*  or the impact is less severe than the one for the canonical
*  transcripts.  Returns an object that looks like this:
*  {HIGH: {frameshift:
*            {
*       transcripts: [ENST000245.1,ENSTxxxx],
*       display: 'ENST000241.1,ENSTxxxx'
*     }
*     stop_gain:
*       {
*       transcripts: [ENST000245.1,ENSTxxxx],
*       display: 'ENST000241.1,ENSTxxxx'
*     }
*     }
* }
*/
VariantModel.getNonCanonicalHighestImpactsVep = function(variant) {
  var vepHighestImpacts = {};
  for (var impactKey in variant.highestImpactVep) {
    var nonCanonicalEffects = [];
    var allEffects = variant.highestImpactVep[impactKey];

    var lowestImpactValue = 99;
    for (key in variant.vepImpact) {
      var value = translator.impactMap[key].value;
      if (value < lowestImpactValue) {
        lowestImpactValue = value;
      }
    }

    var theValue = translator.impactMap[impactKey].value;
    if (theValue < lowestImpactValue) {
      for (effectKey in allEffects) {
        var allTranscripts = allEffects[effectKey];
        if (Object.keys(allTranscripts).length > 0) {
          var ncObject = {};
          var transcriptUrls = "";
          for(transcriptId in allTranscripts) {
            if (transcriptUrls.length > 0) {
              transcriptUrls += ", ";
            }
            var url = '<a href="javascript:void(0)" onclick="selectTranscript(\'' + transcriptId + '\')">' + transcriptId + '</a>';
            transcriptUrls += url;
          }
          ncObject[effectKey] = {transcripts: Object.keys(allTranscripts), display: Object.keys(allTranscripts).join(","), url: transcriptUrls};
          nonCanonicalEffects.push(ncObject);
        }

      }

      if (nonCanonicalEffects.length > 0) {
        vepHighestImpacts[impactKey] = nonCanonicalEffects;
      }
    }
  }
  return vepHighestImpacts;
}


VariantModel.orderVariantsByPosition = function(a, b) {
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

VariantModel.orderVcfRecords = function(rec1, rec2) {


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





