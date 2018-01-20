var recordedCacheErrors = {};
var cacheErrorTypes = {};

function CacheHelper() {

  this.genesToCache = [];
  this.cacheQueue = [];
  this.batchSize = null;
  this.showCallAllProgress = false;
  this.KEY_DELIM = "^";
  this.start = null;
  this.cacheIndexStore = new CacheIndexStore();


}


CacheHelper.VCF_DATA            = "vcfData";
CacheHelper.BAM_DATA            = "bamData";
CacheHelper.FB_DATA             = "fbData";
CacheHelper.DANGER_SUMMARY_DATA = "dangerSummary";
CacheHelper.GENE_COVERAGE_DATA  = "geneCoverage";

CacheHelper.prototype.setLoaderDisplay = function(loaderDisplay) {
  this.geneBadgeLoaderDisplay = loaderDisplay;
}

CacheHelper.prototype.promiseInit = function() {
  return this.cacheIndexStore.promiseInit();
}


CacheHelper.prototype.isolateSession = function() {
  this.launchTimestamp = Date.now().valueOf();
}

CacheHelper.prototype.promiseClearStaleCache = function() {
  var me = this;
  return new Promise(function(resolve, reject) {

    var staleSessions = localStorage["gene.iobio.stale"];
    if (staleSessions && staleSessions.length > 0) {
      var promises = [];
      staleSessions.split(",").forEach(function(timestamp) {
        var p = me._promiseClearCache(timestamp, false, false);
        promises.push(p);
      });
      Promise.all(promises).then(function() {
        localStorage["gene.iobio.stale"] = "";
        resolve();
      },
      function(error) {
        reject();
      })
    } else {
      resolve();
    }
  })
}

CacheHelper.prototype.promiseCheckCacheSize = function() {
  var me = this;

  var clearCacheAndResolve = function(resolve, reject, counts) {
      if (counts.otherSessions > 0) {
        me._promiseClearCache(null, true, false)
         .then(function() {
          resolve();
         },
         function(error) {
          reject(error);
         })
      }
      if (counts.otherUse > 0) {
        me._promiseClearCache(null, false, true)
         .then(function() {
          resolve();
         },
         function(error) {
          reject(error);
         })
      }
  }

  return new Promise(function(resolve, reject) {
    me.promiseGetCacheSize(false)
     .then(function(counts) {

      if (counts.otherSessions > 0 || counts.otherUse > 0) {
        if (isLevelEdu || (isMygene2 && isLevelBasic)) {
          clearCacheAndResolve(resolve, reject, counts);
        } else {
          alertify.confirm("Before proceeding, it is recommended that the browser's cache be cleared.", function (e) {
              if (e) {
                // user clicked "ok", clear the cache for other, and other app
                clearCacheAndResolve(resolve, reject, counts);
              }
          }, function() {
            // user clicked cancel
            me.openDialog();
            resolve();
          })
          .set('labels', {ok:'Yes, clear cache', cancel:'No, show me more details'});

        }
      } else {
        resolve();
      }

     })


  })

}

CacheHelper.prototype.showAnalyzeAllProgress = function(clearStandardFilterCounts) {
  var me = this;

  me.getAnalyzeAllCounts(function(counts) {
    me.showGeneCounts(counts, clearStandardFilterCounts)
  });
}

CacheHelper.prototype.showGeneCounts = function(counts, clearStandardFilterCounts) {
  var me = this;
  if (counts.geneCount == 0) {
    $('#analyzed-progress-bar').addClass("hide");
    $('#total-genes-label').addClass("hide");
    return;
  }
  $('#analyzed-progress-bar').removeClass("hide");


  $('#total-genes-label').removeClass("hide");
  $('#total-genes-label').text(counts.geneCount + " genes");


  me.fillProgressBar($("#analyze-all-progress"), counts, 'loaded', clearStandardFilterCounts);


  if (!filterCard.applyLowCoverageFilter && (me.showCallAllProgress || counts.called.analyzed > 0 || counts.called.error > 0) ) {
    me.fillProgressBar($("#call-all-progress"), counts, 'called', clearStandardFilterCounts);
  } else {
    $('#call-all-progress').addClass("hide");
  }

}

CacheHelper.prototype.fillProgressBar = function(progressBar, countObject, field, clearStandardFilterCounts) {
  var me = this;
  var geneCount = countObject.geneCount;
  var counts    = countObject[field];

  progressBar.removeClass("hide");
  if (counts.analyzed == 0) {
    progressBar.find(".text").removeClass("hide");
    progressBar.find(".text").text("0 analyzed");
  } else {
    progressBar.find(".text").html("&nbsp;");
  }


  if (counts.analyzed == geneCount) {
    progressBar.addClass("done");
    progressBar.find(".text").text(counts.analyzed + " analyzed");
    if (me.geneBadgeLoaderDisplay) {
      me.geneBadgeLoaderDisplay.clearAll();
    }
  } else {
    progressBar.removeClass("done");
  }

  var notAnalyzedCount        = geneCount - counts.analyzed;
  var analyzedNotPassedCount  = counts.analyzed - counts.pass;

  var analyzed                = Math.round(counts.analyzed / geneCount * 100) / 100;
  var notAnalyzed             = 1 - analyzed;

  var analyzedPassed          = filterCard.hasFilters() && counts.analyzed > 0 ? Math.round(counts.pass / counts.analyzed * 100) / 100 : 1;
  var analyzedNotPassed       = filterCard.hasFilters() ? 1 - analyzedPassed : 0;

  progressBar.find('#analyzed-bar'           ).css("width", utility.percentage(analyzed));
  progressBar.find('#not-analyzed-bar'       ).css("width", utility.percentage(notAnalyzed));

  progressBar.find('#passed-filter-bar'      ).css("width", utility.percentage(analyzedPassed));
  progressBar.find('#not-passed-filter-bar'  ).css("width", utility.percentage(analyzedNotPassed));

  if (geneCount > counts.analyzed && counts.analyzed > 0) {
    progressBar.find('#not-analyzed-bar'       ).text(notAnalyzedCount);

  } else {
    progressBar.find('#not-analyzed-bar'       ).text("");
  }

  // Show analyze progress counts on hover
  progressBar.find('#passed-filter-bar').attr("data-toggle", "tooltip");
  progressBar.find('#passed-filter-bar').attr("data-placement", "top");

  progressBar.find('#not-passed-filter-bar').attr("data-toggle", "tooltip");
  progressBar.find('#not-passed-filter-bar').attr("data-placement", "top");

  progressBar.find('#not-analyzed-bar').attr("data-toggle", "tooltip");
  progressBar.find('#not-analyzed-bar').attr("data-placement", "top");


  if (counts.analyzed > 0) {
    if (filterCard.hasFilters()) {
      progressBar.find('#passed-filter-bar'      ).text(counts.pass > 0 ? counts.pass : "");


      progressBar.find('#not-passed-filter-bar'  ).text(analyzedNotPassedCount > 0 ? analyzedNotPassedCount : "");

      progressBar.find('#passed-filter-bar'    ).attr("title", counts.pass > 0             ? counts.pass + " pass filter" : "");
      progressBar.find('#not-passed-filter-bar').attr("title", analyzedNotPassedCount > 0  ? analyzedNotPassedCount +  " fail filter" : "");

      progressBar.find('#not-analyzed-bar'     ).attr("title", notAnalyzedCount > 0        ? notAnalyzedCount + " not analyzed" : "");
      progressBar.find('.text').html("&nbsp;");


    } else {
      progressBar.find('#not-passed-filter-bar'    ).text("");
      progressBar.find('#not-passed-filter-bar'    ).attr("title", "");

      if (geneCount > counts.analyzed) {
        progressBar.find('#passed-filter-bar'  ).text(counts.analyzed);
      } else {
        progressBar.find('#passed-filter-bar'  ).text("");
        progressBar.find("#analyze-all-progress .text").text(counts.analyzed + " analyzed");
      }

      progressBar.find('#passed-filter-bar').attr("title", counts.analyzed  + " analyzed");
      progressBar.find('#not-analyzed-bar' ).attr("title", notAnalyzedCount + " not analyzed");

    }
  } else {
      progressBar.find('#passed-filter-bar').text("");
      progressBar.find('#passed-filter-bar'    ).attr("title", "");

      progressBar.find('#not-passed-filter-bar').text("");
      progressBar.find('#not-passed-filter-bar').attr("title", "");

      progressBar.find('#not-analyzed-bar'     ).attr("title", notAnalyzedCount + " not analyzed");
  }



  // Refresh the standard filter count if it applies
  filterCard.setStandardFilterCount(field, counts, notAnalyzedCount, clearStandardFilterCounts);


}

CacheHelper.prototype.hideAnalyzeAllProgress = function() {
  $("#analyze-all-progress .bar").css("width", "0%");

  $("#call-all-progress .bar").css("width", "0%");
  $("#call-all-progress #not-analyzed-bar").text("");
}


CacheHelper.prototype.analyzeAll = function(analyzeCalledVariants = false) {
  var me = this;

  if (isAlignmentsOnly()) {
    analyzeCalledVariants = true;
  }

  // Show the freebayes runtime args dialog first if dialog has not
  // yet been visited.   Note:  showFreebayesSettingsDialog() is a
  // pass-through if global settings allowFreebayesSettings is set
  // to false.
  if (analyzeCalledVariants && !freebayesSettings.visited) {
    freebayesSettings.showDialog(function() {
      me._analyzeAllImpl(analyzeCalledVariants)
    })
  } else {
    me._analyzeAllImpl(analyzeCalledVariants)
  }
}

CacheHelper.prototype._analyzeAllImpl = function(analyzeCalledVariants) {
  var me = this;

  this.start = new Date();

  if (analyzeCalledVariants) {
    me.showCallAllProgress = true;
  }

  me.showAnalyzeAllProgress();

  // Start over with a new queue of genes to be analyzed
  // is all of the genes that need to be analyzed (and cached.)
  me.genesToCache = [];
  me.cacheQueue = [];

  genesCard.getGeneNames().forEach(function(geneName) {
    me.genesToCache.push(geneName);
  });
  me.cacheGenes(analyzeCalledVariants, function() {

    console.log("");
    console.log("******   ANALYZE ALL ELAPSED TIME *******");
    console.log((new Date() - me.start) / 1000 + " seconds ");
    console.log("*******************************************")
    console.log("");

    // After all genes have been cached, refresh the gene badges in case
    // filters were applied while genes were still in the process of being
    // analyzed.
    filterCard.filterGenes();
  });

}



CacheHelper.prototype.cacheGenes = function(analyzeCalledVariants, callback) {
  var me = this;

  // If there are no more genes to cache,
  if (me.genesToCache.length == 0 && me.cacheQueue.length == 0) {
    if (callback) {
      callback();
    }
  }


  // If we are already have the max size of genes in the queue, don't
  // queue anymore.
  if (me.cacheQueue.length >= DEFAULT_BATCH_SIZE) {
    return;
  }


  // Figure out how much to replinish in the cache queue
  var sizeToQueue = DEFAULT_BATCH_SIZE - me.cacheQueue.length;

  // Just queue genes to the end of the (unanalyzed) genes list
  if (sizeToQueue > me.genesToCache.length) {
    sizeToQueue = me.genesToCache.length;
  }
  var startingPos = me.cacheQueue.length == 0 ? 0 : me.cacheQueue.length;

  // Place next batch of genes in caching queue
  for (var i = 0; i < sizeToQueue; i++) {
    me.cacheQueue.push(me.genesToCache[i]);
  }
  // Remove this batch of genes from the list of all genes to be cached
  for (var i = 0; i < sizeToQueue; i++) {
    me.genesToCache.shift();
  }
  // Make sure we are still showing the genes as 'loading...' that are still in the cache
  //for (var idx = 0; idx < startingPos; idx++) {
  //   genesCard._geneBadgeLoading(me.cacheQueue[idx], true);
  //}

  // Invoke method to cache each of the genes in the queue
  var count = 0;
  for (var i = startingPos; i < DEFAULT_BATCH_SIZE && count < sizeToQueue; i++) {
    me.promiseCacheGene(me.cacheQueue[i], analyzeCalledVariants)
    .then(function(theGeneObject) {
      me.cacheNextGene(theGeneObject.gene_name, analyzeCalledVariants, callback);
    },
    function(error) {
      // An error occurred.  Set the gene badge with an error glyph
      // and move on to analyzing the next gene
      genesCard.setGeneBadgeError(error.geneName);
      console.log("problem caching data for gene " + error.geneName + ". " + error.message);
      genesCard._geneBadgeLoading(error.geneName, false);

      getProbandVariantCard().promiseSummarizeError(error.geneName, error.message)
      .then(function(dangerObject) {
        // take this gene off of the queue and see
        // if next batch of genes should be analyzed
        me.cacheNextGene(error.geneName, analyzeCalledVariants, callback);
      },
      function(error) {
        var msg = "A problem ocurred while summarizing error in CacheHelper.prototype.cacheGene(): " + error;
        console.log(msg);
        me.cacheNextGene(error.geneName, analyzeCalledVariants, callback);
      })
    })
    count++;
  }


}



CacheHelper.prototype.promiseCacheGene = function(geneName, analyzeCalledVariants, callback) {
  var me = this;

  return new Promise(function(cacheResolve, cacheReject) {
    var theGeneName = geneName;
    var geneObject = null;
    var transcript = null;
    var geneCoverageAll = null;
    var isCached = false;
    var trioVcfData = null;
    var trioFbData = null;
    var shouldCallVariants = analyzeCalledVariants;

    geneModel.promiseGetGeneObject(geneName)
    .then( function(data) {
      // Get the gene model
      geneObject = data;
      me.geneBadgeLoaderDisplay.setPageCount(genesCard.getPageCount())
      me.geneBadgeLoaderDisplay.addGene(geneName, genesCard.pageNumberForGene(geneName));
      geneModel.adjustGeneRegion(geneObject);
      transcript = geneModel.getCanonicalTranscript(geneObject);

      return geneModel.promiseMarkCodingRegions(geneObject, transcript);
    })
    .then(function() {
      // Find out if this gene has already been analyzed
      return me.promiseIsCachedForProband(geneObject, transcript, analyzeCalledVariants)
    })
    .then(function(data) {
      isCached = data.isCached;
      if (isCached) {
        // if the gene has already been analyzed, move on to next gene
        cacheResolve(geneObject);
      } else {
        // Get the gene coverage stats
        return promiseGetCachedGeneCoverage(geneObject, transcript, false);
      }
    })
    .then(function(data) {
      // Load and annotate the variants
      geneCoverageAll = data.geneCoverage;

      // Show that we are working on this gene
      genesCard._geneBadgeLoading(geneObject.gene_name, true);

      // The gene is ready to be analyzed. Annotate the variants
      if (isAlignmentsOnly()) {
        return Promise.resolve(trioVcfData);
      } else {
        return promiseAnnotateVariants(geneObject, transcript, dataCard.mode == 'trio' && samplesInSingleVcf(), true)
      }
    })
    .then(function(data) {
      trioVcfData = data;

      // Joint call variants if we are calling variants for all genes in 'Analyze All'
      if (analyzeCalledVariants) {
        return promiseJointCallVariants(geneObject, transcript, trioVcfData, {checkCache: true, isBackground: true})
      } else {
        return Promise.resolve({'trioFbData': trioFbData, 'trioVcfData': trioVcfData});
      }
    })
    .then(function(data) {

      // Now determine inheritance and cache the annotated loaded and called variants
      trioFbData = data.trioFbData;
      trioVcfData = data.trioVcfData;

      return promiseAnnotateInheritance(geneObject, transcript, trioVcfData, {isBackground: true, cacheData: true})

    })
    .then(function(data) {

      // Now summarize the danger for the  gene
      return promiseSummarizeDanger(geneObject, transcript, trioVcfData.proband, {'CALLED': analyzeCalledVariants})
    })
    .then(function() {
      // Now clear out mother and father from cache (localStorage browser cache only)
      if (window.gene == null || window.gene.gene_name != geneObject.gene_name) {
        if (CacheHelper.useLocalStorage()) {
          getVariantCard("mother" ).model.clearCacheItem(CacheHelper.VCF_DATA, geneObject.gene_name, transcript);
          getVariantCard("father" ).model.clearCacheItem(CacheHelper.VCF_DATA, geneObject.gene_name, transcript);
        }
      }
      // Clear out the called variants cache since this is now cached in vcf data
      if (analyzeCalledVariants) {
        getVariantCard("proband" ).model.clearCacheItem(CacheHelper.FB_DATA, geneObject.gene_name, transcript);
      }

      // We have analyzed the gene, now move on to another gene
      if (window.gene && window.gene.gene_name == geneObject.gene_name) {
        genesCard.selectGene(geneObject.gene_name);
      }

      // We are done analyzing this gene.  Move on to the next one.
      cacheResolve(geneObject);

    },
    function(error) {
      cacheReject({'geneName': theGeneName, 'message': error});
    });
  })


}


CacheHelper.prototype.isGeneInProgress = function(geneName) {
  return this.cacheQueue.indexOf(geneName) >= 0;
}

CacheHelper.prototype.cacheNextGene = function(geneName, analyzeCalledVariants, callback) {
  this.showAnalyzeAllProgress();

  // Take the analyzed (and cached) gene off of the cache queue
  var idx = this.cacheQueue.indexOf(geneName);
  if (idx >= 0) {
    this.cacheQueue.splice(idx,1);
    this.geneBadgeLoaderDisplay.setPageCount(genesCard.getPageCount())
                               .removeGene(geneName);
  } else {
    idx = this.cacheQueue.indexOf(geneName.toUpperCase());
    if (idx >= 0) {
      this.cacheQueue.splice(idx,1);
      this.geneBadgeLoaderDisplay.setPageCount(genesCard.getPageCount())
                                 .removeGene(geneName);
    } else {
      console.log("Unexpected error occurred during caching of genes.  Could not remove " + geneName + " from cache queue");
      if (callback) {
        callback();
      }
      return;
    }
  }
  // Invoke cacheGenes, which will kick off the next batch
  // of genes to analyze once all of the genes in
  // the current batch have been analyzed.
  this.cacheGenes(analyzeCalledVariants, callback);
}

CacheHelper.prototype.promiseIsCachedForProband = function(geneObject, transcript, checkForCalledVariants) {
  return new Promise(function(resolve, reject) {
    getProbandVariantCard().promiseGetDangerSummary(geneObject.gene_name)
    .then(function(dangerSummary) {
      var isCached = dangerSummary == null ? false : (checkForCalledVariants ? dangerSummary.CALLED : true);
      resolve({geneObject: geneObject, transcript: transcript, shouldCallVariants: checkForCalledVariants, 'isCached': isCached})
    })
  })
}


CacheHelper.prototype.getAnalyzeAllCounts = function(callback) {
  var me = this;
  var counts = {
    geneCount: 0,
    all:    {analyzed: 0, unanalyzed: 0, error: 0, pass: 0},
    loaded: {analyzed: 0, unanalyzed: 0, error: 0, pass: 0},
    called: {analyzed: 0, unanalyzed: 0, error: 0, pass: 0}
  }

  // Clone the array of gene names
  var genesToCount = genesCard.getGeneNames().slice(0);

  // Sequentially examine the danger summary for each gene (recursive).
  // When all genes have been examined, the callback will be invoked
  // with the counts object.
  me.getNextGeneCounts(genesToCount, counts, callback);


}


CacheHelper.prototype.getNextGeneCounts = function(genesToCount, counts, callback) {
  var me = this;


  var incrementLoadedVsCalled = function(danger, counts, field) {
    if (danger) {
      counts.all[field]++;
      if (!isAlignmentsOnly() ) {
        counts.loaded[field]++;
      }
      if (danger.CALLED) {
        counts.called[field]++;
      }
    }
  }

  if (genesToCount.length == 0) {
    callback(counts);
  } else {
    // Remove the next gene from the list
    var geneName = genesToCount.splice(0,1);

    counts.geneCount++;

    var key = getProbandVariantCard().model._getCacheKey(CacheHelper.DANGER_SUMMARY_DATA, geneName);

    // Get danger summary for gene
      me.promiseGetData(key)
        .then(function(danger) {
        if (danger != null) {

          // Increment the loaded variants count for the gene
          incrementLoadedVsCalled(danger, counts, 'analyzed');

          // Increment the called variant count for the gene
          if (danger.featureCount && danger.featureCount > 0) {
            counts.all.pass++;
            if (!isAlignmentsOnly() && danger.loadedCount && danger.loadedCount > 0) {
              counts.loaded.pass++;
            }
            if (danger.calledCount && danger.calledCount > 0) {
              counts.called.pass++;
            }
          }


        } else {
          // We don't have a danger summary for the gene.  Increment the unanlyzed count
          incrementLoadedVsCalled(danger, counts, 'unanalyzed');
        }

        // Now get the counts for the next gene in the list
        me.getNextGeneCounts(genesToCount, counts, callback);

        },
        function(error) {
          console.log("An error occurred in getAnalyzeAllCounts when calling promiseGetData: " + error);
          callback(counts);
        });
  }


}


CacheHelper.prototype.refreshGeneBadges = function(callback) {
  var me = this;
  var geneCount = {total: 0, pass: 0};

  $('#gene-badges-loader').removeClass("hide");

  var theGeneNames = {};
  genesCard.getGeneNames().forEach(function(geneName) {
    theGeneNames[geneName] = true;
  });

  var dataKind = CacheHelper.VCF_DATA;

  me.promiseGetKeys()
   .then(function(allKeys) {
    var keys = [];

    allKeys.forEach(function(key) {
      keyObject = CacheHelper._parseCacheKey(key);
      if (keyObject && keyObject.launchTimestamp == me.launchTimestamp) {

          if (keyObject.dataKind == dataKind && keyObject.relationship == "proband" && theGeneNames[keyObject.gene]) {
            keys.push({'key': key, 'keyObject': keyObject});
          }
       }
    })

    me.refreshNextGeneBadge(keys, geneCount, function() {
      genesCard.sortGenes();

      $('#gene-badges-loader').addClass("hide");

      if (callback) {
        callback();
      }

    });

   },
   function(error) {
    var msg = "A problem occurred in CacheHelper.refreshGeneBadges(): " + error;
    console.log(msg);
    if (callback) {
      callback();
    }
   })

}


CacheHelper.prototype.promiseRefreshGeneBadgesGeneCoverage = function(refreshOnly=false) {
  var me = this;

  return new Promise(function(resolve, reject) {
    var counts = {
      geneCount: 0,
      all:    {analyzed: 0, unanalyzed: 0, error: 0, pass: 0},
      loaded: {analyzed: 0, unanalyzed: 0, error: 0, pass: 0},
      called: {analyzed: 0, unanalyzed: 0, error: 0, pass: 0}
    }

    $('#gene-badges-loader').removeClass("hide");

    var theGeneNames = {};
    genesCard.getGeneNames().forEach(function(geneName) {
      theGeneNames[geneName] = true;
    });


    me.promiseGetKeys()
     .then(function(allKeys) {

      var thePromises = [];
      var dangerPromises = [];

      allKeys.forEach(function(key) {
        keyObject = CacheHelper._parseCacheKey(key);
        if (keyObject && keyObject.launchTimestamp == me.launchTimestamp) {

            if (keyObject.dataKind == CacheHelper.VCF_DATA && keyObject.relationship == "proband" && theGeneNames[keyObject.gene]) {
              counts.geneCount++;

              var geneObject   = geneModel.geneObjects[keyObject.gene];
              var p = promiseGetCachedGeneCoverage(geneObject, {transcript_id: keyObject.transcript})
              .then(function(data) {
                var geneCoverageAll = data.geneCoverage;

                var dp = getProbandVariantCard().promiseGetDangerSummary(data.gene.gene_name)
                .then(function(dangerObject) {
                  if (geneCoverageAll && dangerObject) {
                    var clearOtherDanger = refreshOnly ? false : true;

                    VariantModel.summarizeDangerForGeneCoverage(dangerObject, geneCoverageAll, clearOtherDanger, refreshOnly);

                    counts.all.analyzed++;
                    if (isAlignmentsOnly()) {
                      counts.called.analyzed++;
                    } else {
                      counts.loaded.analyzed++;
                    }

                    if (dangerObject.geneCoverageProblem) {
                      counts.all.pass++;
                      if (isAlignmentsOnly()) {
                        counts.called.pass++;
                      } else {
                        counts.loaded.pass++;
                      }
                    }

                    getProbandVariantCard().model.promiseCacheDangerSummary(dangerObject, data.gene.gene_name).then(function() {
                      genesCard.setGeneBadgeGlyphs(data.gene.gene_name, dangerObject, false);
                    })
                  } else {
                    counts.all.unanalyzed++;
                    if (isAlignmentsOnly()) {
                      counts.called.unanalyzed++;
                    } else {
                      counts.loaded.unanalyzed++;
                    }

                  }
                })
                dangerPromises.push(dp);

              }, function(error) {
                var msg = "Problem encountered in CacheHelper.refreshGeneBadgesGeneCoverage() " + error;
                console.log(msg);
                reject(msg);

              });

              thePromises.push(p);
            }
        }

      })

      Promise.all(thePromises).then(function() {
        Promise.all(dangerPromises).then(function() {
          if (!refreshOnly) {
            genesCard.sortGenes(genesCard.LOW_COVERAGE_OPTION, true);
          }

          $('#gene-badges-loader').addClass("hide");
          resolve(counts);

        },
        function(error) {
          reject(error);
        })
      },
      function(error) {
        reject(error);
      })
     },
     function(error) {
      var msg = "A problem occurred in CacheHelper.promiseRefreshGeneBadgesGeneCoverage(): " + error;
      console.log(msg);
      reject(msg);

    });


  })


}



CacheHelper.prototype.promiseClearCache = function(launchTimestampToClear) {
  var me = this;
  return new Promise(function(resolve, reject) {
    if (keepLocalStorage) {
      resolve();

    } else {
      me._promiseClearCache(launchTimestampToClear, false, false)
       .then(function() {
        me.genesToCache = [];
        resolve();
       },
       function(error) {
        reject(error);
       })
    }
  })

}

CacheHelper.prototype.refreshNextGeneBadge = function(keys, geneCount, callback) {
  var me = this;
  if (keys.length == 0) {
    callback();
  } else {
    var theKey    = keys.splice(0,1)[0];
    var key       = theKey.key;
    var keyObject = theKey.keyObject;


    me.promiseGetDataThreaded(key, keyObject).then(function(cachedData) {
      var theVcfData    = cachedData.data;
      var theKeyObject  = cachedData.keyObject;
      var theGeneObject = geneModel.geneObjects[theKeyObject.gene];

      var filteredVcfData = getVariantCard('proband').model.filterVariants(theVcfData, filterCard.getFilterObject(), theGeneObject.start, theGeneObject.end, true);

      geneCount.total++;
      if (filteredVcfData.features.length > 0) {
        geneCount.pass++;
      }

      var theFbData = null;
      getVariantCard("proband").promiseGetDangerSummary(theGeneObject.gene_name).then(function(ds) {
        if (theVcfData && theVcfData.features && ds && ds.CALLED) {
          theFbData = getVariantCard("proband").model.reconstituteFbData(theVcfData);
        }

        var options = {};
        if (theFbData) {
          options.CALLED = true;
        }

        promiseGetCachedGeneCoverage(theGeneObject, {transcript_id: theKeyObject.transcript}).then(function(data) {
          var geneCoverageAll = data.geneCoverage;
          getVariantCard("proband").promiseSummarizeDanger(data.gene.gene_name, filteredVcfData, options, geneCoverageAll).then(function(dangerObject) {
            genesCard.setGeneBadgeGlyphs(data.gene.gene_name, dangerObject, false);
            me.refreshNextGeneBadge(keys, geneCount, callback);
          })
        })
      })
     });

  }
}

CacheHelper.prototype.getCacheKey = function(cacheObject) {
  var key =  "gene.iobio"
    + cacheHelper.KEY_DELIM + this.launchTimestamp
    + cacheHelper.KEY_DELIM + cacheObject.relationship
    + cacheHelper.KEY_DELIM + cacheObject.sample
    + cacheHelper.KEY_DELIM + cacheObject.gene
    + cacheHelper.KEY_DELIM + cacheObject.transcript
    + cacheHelper.KEY_DELIM + cacheObject.dataKind;
  if (cacheObject.dataKind != CacheHelper.GENE_COVERAGE_DATA) {
      key += cacheHelper.KEY_DELIM + cacheObject.annotationScheme;
  }
  return key;
}


CacheHelper.prototype.promiseGetCacheSize = function(format=true) {  // provide the size in bytes of the data currently stored
  var me = this;

  return new Promise(function(resolve, reject) {
    var size = 0;
    var coverageSize = 0;

    var otherSessionsSize = 0;
    var otherSessionsInfo = {};

    var otherUseSize = 0;
    me.promiseGetAllKeys()
     .then(function(allKeys) {
      var promises = []
      allKeys.forEach(function(key) {
        var keyObject = CacheHelper._parseCacheKey(key);
        if (keyObject) {
            var p = me.promiseGetData(key, false)
             .then(function(data) {
              if (data != null) {
              if (keyObject.launchTimestamp == me.launchTimestamp) {
                size += data.length;
                  if (keyObject.dataKind == CacheHelper.BAM_DATA) {
                    coverageSize +=  data.length;
                  }

              } else {
                otherSessionsSize += data.length;


                var sessionTotal = otherSessionsInfo[keyObject.launchTimestamp];
                if (sessionTotal == null) {
                  sessionTotal = 0;
                }
                sessionTotal += data.length;
                otherSessionsInfo[keyObject.launchTimestamp] = sessionTotal;
              }
              }
          });
            promises.push(p);
        } else {
          // TODO - How to determine size of cache items for other apps?
          otherUseSize += 0;
        }
      })
      Promise.all(promises).then(function() {

          resolve({ total:           format ? (CacheHelper._sizeMB(size) + " MB") : size,
                    coverage:        format ? (CacheHelper._sizeMB(coverageSize) + " MB") : coverageSize,
                    otherSessions:   format ? (CacheHelper._sizeMB(otherSessionsSize) + " MB") : otherSessionsSize,
                    otherUse:        format ? (CacheHelper._sizeMB(otherUseSize) + " MB") : otherUseSize,
                    'otherSessionsInfo':  otherSessionsInfo
                  });



      },
      function(error) {
        var msg = "A problem ocurred in CacheHelper.promiseGetCacheSize(): +  " + error;
        console.log(msg);
        reject(msg);
      })

     },
     function(error) {
      reject(error);
     })


  })

}

CacheHelper.prototype.cleanupCacheOnClose = function(launchTimestampToClear) {
  var me = this;
  if (launchTimestampToClear == null) {
    launchTimestampToClear = me.launchTimestamp;
  }
  if (CacheHelper.useLocalStorage() && localStorage) {
    var keys = [];
    for (var i=0; i<=localStorage.length-1; i++)  {
      var key = localStorage.key(i);
      var keyObject = CacheHelper._parseCacheKey(key);
      if (keyObject && keyObject.launchTimestamp == launchTimestampToClear) {
        keys.push(key);
      }
    }

    keys.forEach(function(key) {
      localStorage.removeItem(key);
    })
  } else {
    var key = 'gene.iobio.stale';
    var staleSessions = localStorage[key];
    if (staleSessions == null || staleSessions == "") {
      staleSessions = launchTimestampToClear;
    } else {
      staleSessions += "," + launchTimestampToClear;
    }
    localStorage[key] = staleSessions;
  }
}


CacheHelper.prototype._promiseClearCache = function(launchTimestampToClear, clearOther, clearOtherApp) {
  var me = this;

  return new Promise(function(resolve, reject) {


    var clearCurrentSessionCache = false;
    if (launchTimestampToClear == me.launchTimestamp) {
      clearCurrentSessionCache = true;
    }
    var theLaunchTimeStamp = launchTimestampToClear ? launchTimestampToClear : me.launchTimestamp;
    var keysToRemove = [];
    me.promiseGetAllKeys()
     .then(function(allKeys) {
      allKeys.forEach(function(key) {
        var keyObject = CacheHelper._parseCacheKey(key);
        if (keyObject) {
          if (keyObject.launchTimestamp == theLaunchTimeStamp && !clearOther && !clearOtherApp) {
            keysToRemove.push(key);
            if (keyObject.gene && keyObject.relationship == 'proband') {
              genesCard.clearGeneGlyphs(keyObject.gene);
              genesCard.clearGeneInfo(keyObject.gene);

            }
          } else if (keyObject.launchTimestamp != theLaunchTimeStamp && clearOther && !clearOtherApp) {
            keysToRemove.push(key);
          }
        } else if (clearOtherApp) {
          keysToRemove.push(key);
        }
      })

      var promises = [];
      keysToRemove.forEach( function(key) {
        var keyObject = CacheHelper._parseCacheKey(key);
        var p = me.promiseRemoveCacheItem(keyObject.dataKind, key);
        promises.push(p);
      })

      Promise.all(promises).then(function() {
        if (clearCurrentSessionCache) {
          window.gene = null;
          genesCard._hideCurrentGene();

          filterCard.clearFilters();
          if (window.variantCards && window.variantCards.length > 0) {
            filterVariants();
          }
          filterCard.resetStandardFilterCounts();

          me.hideAnalyzeAllProgress();
        }

        //if (clearOther || clearOtherApp) {
        //  me.checkCacheSize();
        //}
        resolve();

      })

     },
     function(error) {
      reject(error);
     })

  });

}

CacheHelper.prototype.clearAll = function() {
  var me = this;
  // confirm dialog
  alertify.confirm("Clear all cached data for this session?", function (e) {
      if (e) {
      // user clicked "ok"
      me._promiseClearCache(me.launchTimestampToClear, false, false)
       .then(function() {
        cacheHelper.showAnalyzeAllProgress();
          me.refreshDialog();
       });

      }
  }, function() {
    // user clicked "cancel"
  })
  .set('labels', {ok:'OK', cancel:'Cancel'});       ;
}
CacheHelper.prototype.clearOther = function() {
  var me = this;
  // confirm dialog
  alertify.confirm("Clear all cached data for other gene.iobio sessions?  IMPORTANT: To save analysis, bookmark any variants of interest in other browser tabs before clearing the cache.", function (e) {
      if (e) {
      // user clicked "ok"
      me._promiseClearCache(null, true, false)
       .then(function() {
          me.refreshDialog();
       })

      }

  })
  .set('labels', {ok:'OK', cancel:'Cancel'});
}
CacheHelper.prototype.clearOtherApp = function() {
  var me = this;
  // confirm dialog
  alertify.confirm("Clear all cached data for other web applications?", function (e) {
      if (e) {
      // user clicked "ok"
      me._promiseClearCache(null, false, true)
       .then(function() {
          me.refreshDialog();

       })

      }

  }) .set('labels', {ok:'OK', cancel:'Cancel'});
}

CacheHelper.prototype.promiseClearCoverageCache = function() {
  var me = this;

  return new Promise(function(resolve, reject) {
    me.promiseGetKeys()
     .then(function(allKeys) {
      var promises = [];
      allKeys.forEach(function(key) {
        var keyObject = CacheHelper._parseCacheKey(key);
          if (keyObject && keyObject.launchTimestamp == me.launchTimestamp) {
          if (keyObject.dataKind == CacheHelper.BAM_DATA) {
            var p = me.promiseRemoveCacheItem(keyObject.dataKind, key);
            promises.push(p);
          }
          }

      })
      Promise.all(promises).then(function() {
        me.refreshDialog();
        resolve();
      })

     },
     function(error) {
      reject(error);
     })

  })
}


CacheHelper.prototype.refreshDialog = function() {
  var me = this;
  return new Promise(function(resolve, reject) {
    var formatOtherSessions = function(otherSessions) {
      var html = "";
      var sortedDates = Object.keys(otherSessions).sort();
      sortedDates.forEach(function(theDate) {
        var size = otherSessions[theDate];
        html += '<div><span style="display:inline-block;width:140px">' + utility.formatDate(new Date(theDate * 1)) + '</span><span style="display:inline-block;width:100px">' + CacheHelper._sizeMB(size, 1) + " MB</span>" + "<a href='javascript:void(0)' + onclick='cacheHelper.clearCache(" + theDate + ",true)'>Clear</a></div>";
      });
      return html;
    }

    me.promiseGetCacheSize(false)
     .then(function(counts) {
      $('#other-use-cache-alert').addClass("hide");
      $("#other-use-cache-panel").removeClass("attention");

      $('#other-sessions-cache-alert').addClass("hide");
      $("#other-sessions-cache-panel").removeClass("attention-warning");

      if (counts.otherSessions > 0) {
        $('#other-sessions-cache-alert').removeClass("hide");
        $("#other-sessions-cache-panel").addClass("attention-warning");
        $("#other-sessions-cache-detail-link").attr("aria-expanded", true);
        $("#other-sessions-cache-detail").attr("aria-expanded", true);
        $("#other-sessions-cache-detail").addClass("in");
      }

      if (counts.otherUse > 0) {
        $('#other-use-cache-alert').removeClass("hide");
        $("#other-app-use-cache-panel").addClass("attention");
        $("#other-app-use-cache-detail-link").attr("aria-expanded", true);
        $("#other-app-use-cache-detail").attr("aria-expanded", true);
        $("#other-app-use-cache-detail").addClass("in");
      }


      $("#cache-size").text(CacheHelper._sizeMB(counts.total) + " MB");
      $("#coverage-size").text(CacheHelper._sizeMB(counts.coverage) + " MB");
      $("#other-sessions-cache-size").text(CacheHelper._sizeMB(counts.otherSessions) + " MB");
      $('#other-sessions-cache-info').html(formatOtherSessions(counts.otherSessionsInfo));
      $("#other-use-cache-size").text(CacheHelper._sizeMB(counts.otherUse) + " MB");
      resolve();
     })
  })

}

CacheHelper.prototype.openDialog = function() {
  this.refreshDialog()
   .then(function() {
    $('#manage-cache-modal').modal('show');
   })
}



CacheHelper.prototype.clearCacheForGene = function(geneName) {
  var me = this;

  return new Promise(function(resolve, reject) {
    me.promiseGetKeys()
     .then(function(allKeys) {
      var keys = [];
      allKeys.forEach(function(key) {
        var keyObject = CacheHelper._parseCacheKey(key);
        if (keyObject && keyObject.launchTimestamp == me.launchTimestamp) {
          if (keyObject.gene == geneName) {
            keys.push(key);
          }
        }
      })

      var promises = [];
      keys.forEach( function(key) {
        var keyObject = CacheHelper._parseCacheKey(key);
        var p = me.promiseRemoveCacheItem(keyObject.dataKind, key);
        promises.push(p);
      });

      Promise.all(promises).then(function() {
        // Clear out the loading message by the page control for this gene
        me.geneBadgeLoaderDisplay.setPageCount(genesCard.getPageCount())
                     .removeGene(geneName);

        // Clear the gene out from the cache 'analyze all' queue
        if (me.isGeneInProgress(geneName)) {
          me.cacheNextGene(geneName);
        }

        resolve();

      })

     },
     function(error) {
      reject(error);
     })

  })


}



CacheHelper.prototype._isProbandVariantCache = function(key) {
  var cacheObject = CacheHelper._parseCacheKey(key);
  return (cacheObject
    && cacheObject.launchTimestamp == this.launchTimestamp
    && ( cacheObject.dataKind == CacheHelper.VCF_DATA  || cacheObject.dataKind == CacheHelper.FB_DATA)
    && cacheObject.relationship == "proband");

}




CacheHelper._sizeMB = function(size, decimalPlaces=1) {
  var multiplier = Math.pow(10, decimalPlaces+1);
  var _sizeMB = size / (1024*1024);
  return  Math.round(_sizeMB * multiplier) / multiplier;
}



CacheHelper._parseCacheKey = function(cacheKey) {
  if (cacheKey.indexOf(cacheHelper.KEY_DELIM) > 0) {
    var tokens = cacheKey.split(cacheHelper.KEY_DELIM);
    if (tokens.length >= 7 && tokens[0] == "gene.iobio") {
      var keyObject = {
           app: tokens[0],
           launchTimestamp: tokens[1],
           relationship: tokens[2],
           sample: tokens[3],
           gene: tokens[4],
           transcript: tokens[5],
           dataKind: tokens[6]
      };
      if (tokens.length == 8) {
        keyObject.annotationScheme = tokens[7];
      }
      return keyObject;

    } else {
      return null;
    }

  } else {
    return null;
  }

}

CacheHelper.showError = function(key, cacheError) {
  var cacheObject = CacheHelper._parseCacheKey(key);
  if (cacheObject) {

    var errorCount = cacheErrorTypes[cacheError.name];
    if (errorCount == null) {
      errorCount = 0;
    }
    errorCount++;
    cacheErrorTypes[cacheError.name] = errorCount;

    var errorType = cacheError.name && cacheError.name.length > 0 ? cacheError.name : "A problem";
    var errorKey = cacheObject.gene + cacheHelper.KEY_DELIM + errorType;

    var consoleMessage = errorType + " occurred when caching analyzed " + cacheObject.dataKind + " data for gene " + cacheObject.gene + ". Click on 'Clear cache...' link to clear cache."
      console.log(consoleMessage);
      console.log(cacheError.toString());

      // Only show the error once
      if (!recordedCacheErrors[errorKey] ) {
        recordedCacheErrors[errorKey] = message;
        var message = errorType + " occurred when caching analyzed data for gene " + cacheObject.gene + ". Unable to analyze remaining genes.  Click on 'Clear cache...' link to clear cache.";
        // If we have shown this kind of cache error 2 times already, just show in right hand corner instead
        // of showning dialog with ok/cancel.
      if (errorCount < 3) {
        alertify.alert(message, function() {
          recordedCacheErrors[errorKey] = null;
        });
      } else if (errorCount < 8) {
          var msg = "<span style='font-size:12px'>" + message + "</span>";
          alertify.set('notifier','position', 'top-right');
          alertify.error(msg,  5);
        recordedCacheErrors[errorKey] = null;
      }
      }
  }

}


CacheHelper.useLocalStorage = function() {
  return window.global_browserCache == BROWSER_CACHE_LOCAL_STORAGE;
}
CacheHelper.useIndexedDB = function() {
  return window.global_browserCache == BROWSER_CACHE_INDEXED_DB;
}

CacheHelper.promiseCompressData = function(data) {
  return new Promise(function(resolve, reject) {
    if (data && data != "") {
      var dataString = JSON.stringify(data);
      var dataStringCompressed = null;
      try {
        dataStringCompressed = LZString.compressToUTF16(dataString);
        resolve(dataStringCompressed);
      }   catch(error) {
        reject("Unable to compress data: " + error);
      }
    } else {
      resolve(null);
    }
  });

}

CacheHelper.promiseDecompressData = function(dataCompressed, decompressIt) {
  return new Promise(function(resolve, reject) {
    if (decompressIt && dataCompressed != null && dataCompressed != "") {
      var dataString = null;
      var data = null;
      try {
         dataString = LZString.decompressFromUTF16(dataCompressed);
         data =  JSON.parse(dataString);
         resolve(data);
      } catch(e) {
        var errorMsg = "an error occurred when uncompressing data";
        console.log(errorMsg);
        reject(errorMsg);
      }
    } else {
      resolve(dataCompressed);
    }
  });
}

CacheHelper.prototype.promiseCacheData = function(key, data) {
  var me = this;

  return new Promise(function(resolve, reject) {

    if (CacheHelper.useLocalStorage()) {
      if (localStorage) {

          CacheHelper.promiseCompressData(data)
           .then(function(dataStringCompressed) {
          localStorage.setItem(key, dataStringCompressed);
          resolve();
           },
           function(error) {
            reject(error);
           });
      } else {
        reject("no local storage found")
      }
    } else if (CacheHelper.useIndexedDB()) {
      CacheHelper.promiseCompressData(data)
         .then(function(dataStringCompressed) {
        var keyObject = CacheHelper._parseCacheKey(key);
        return me.cacheIndexStore.promiseSetData(keyObject.dataKind, keyObject.gene, key, dataStringCompressed)
         })
         .then(function() {
          resolve();
         },
         function(error) {
          var msg = "A problem occurred in CacheHelper.promiseCacheData() when calling cacheIndexStore.promiseSetData(): " + error;
        console.log(msg);
        reject(msg);
         });
    } else {
      reject("Unable to determine browser cache method")
    }

  })

}

CacheHelper.prototype.promiseGetData = function(key, decompressIt=true) {
  var me = this;
  return new Promise(function(resolve, reject) {

    if (CacheHelper.useLocalStorage()) {
      if (localStorage) {
            var dataCompressed = localStorage.getItem(key);
            CacheHelper.promiseDecompressData(dataCompressed, decompressIt).then(function(data) {
              resolve(data);
            },
            function(error) {
              var errorMsg = "an error occurred when uncompressing data for key " + key;
              console.log(errorMsg);
              reject(errorMsg);
            });
        }
    } else if (CacheHelper.useIndexedDB()) {
      var keyObject = CacheHelper._parseCacheKey(key);
      me.cacheIndexStore.promiseGetData(keyObject.dataKind, key, decompressIt)
       .then(function(dataCompressed) {
            CacheHelper.promiseDecompressData(dataCompressed, decompressIt)
             .then(function(data) {
              resolve(data);
             },
             function(error) {
          var errorMsg = "an error occurred when uncompressing data for key " + key;
          console.log(errorMsg);
          reject(errorMsg);
             });
       })
    } else {
      reject("Unable to determine browser cache method")
    }
  })

}


CacheHelper.prototype.promiseGetDataThreaded = function(key, keyObject) {
  var me = this;

  return new Promise(function(resolve, reject) {
    cacheHelper.promiseGetData(key, false)
     .then(function(dataCompressed) {

          if (dataCompressed != null) {

        var worker = new Worker('./app/model/cacheHelperWorker.js');

        worker.onmessage = function(e) {
          resolve(e.data);
        };

        // We will also want to be notified if the worker runs into trouble
        worker.onerror = function(e) {
          console.log("An error occurred when uncompressing data for key " + key);
          var msg = 'An error occurred while decompressing cached data:' + e;
          console.log(msg)
          reject(msg);
        };

        // Start the worker!
        worker.postMessage( { 'cmd': 'start', 'compressedData': dataCompressed, 'keyObject': keyObject });
      } else {
        resolve(null);
      }

     },
     function(error) {
      var msg = "An error occurred in CacheHelper.promiseGetDataThreaded(): " + error;
      console.log(msg);
      reject(msg);
     });
  })

}

CacheHelper.prototype.promiseRemoveCacheItem = function(dataKind, key) {
  var me = this;

  return new Promise(function(resolve, reject) {

    if (CacheHelper.useLocalStorage()) {
      if (localStorage) {
        localStorage.removeItem(key);
        }
    } else if (CacheHelper.useIndexedDB()) {
      me.cacheIndexStore.promiseRemoveData(dataKind, key)
       .then(function() {
        resolve();
       },
       function(error) {
        reject(error);
       })
    } else {
      reject("Unknown caching method")
    }
  });
}


CacheHelper.prototype.promiseGetKeys = function() {
  var me = this;
  return new Promise(function(resolve, reject) {

    me.promiseGetAllKeys()
     .then(function(allKeys) {

      var filteredKeys = allKeys.filter(function(key) {
        var keyObject = CacheHelper._parseCacheKey(key);
        return keyObject && (keyObject.launchTimestamp == me.launchTimestamp);
      })
      resolve(filteredKeys);
     },
     function(error) {
      reject(error);
     })

  });

}


CacheHelper.prototype.promiseGetAllKeys = function() {
  var me = this;
  return new Promise(function(resolve, reject) {

    if (CacheHelper.useLocalStorage()) {
      if (localStorage) {
        var keys = [];
        for (var i=0; i<=localStorage.length-1; i++)  {
          var key = localStorage.key(i);
          keys.push(key);
        }
        resolve(keys);
      } else {
        reject("No local storage found");
      }

    } else if (CacheHelper.useIndexedDB()) {
      me.cacheIndexStore.promiseGetAllKeys()
       .then(function(allKeys) {
        resolve(allKeys);
       },
       function(error) {
        reject(error);
       });
    }
  });

}

CacheHelper.prototype.logCacheContents = function(filterObject, showData=false) {
  var me = this;
  me.promiseGetKeys()
   .then(function(keys) {
    me._logCacheContents(keys, filterObject, showData);
   });
}

CacheHelper.prototype.logAllCacheContents = function(filterObject, showData=false) {
  var me = this;
  me.promiseGetAllKeys()
   .then(function(allKeys) {
    me._logCacheContents(allKeys, filterObject, showData);
   });
}


CacheHelper.prototype._logCacheContents = function(keys, filterObject, showData=false) {
  var me = this;

  var itemSize = 0;
  var recs = [];
  var totalKb = 0;

  var promises = [];
  keys.forEach(function(key) {
    var keyObject = CacheHelper._parseCacheKey(key);
    var keep = true;
    if (filterObject && Object.keys(filterObject).length > 0) {
      keep = false;
      var matchesRel = true;
      if (filterObject.hasOwnProperty('relationship')) {
        if (keyObject.relationship != filterObject.relationship) {
          matchesRel = false;
        }
      }
      var matchesGene = true;
      if (filterObject.hasOwnProperty('gene')) {
        if (keyObject.gene != filterObject.gene) {
          matchesGene = false;
        }
      }
      var matchesDataKind = true;
      if (filterObject.hasOwnProperty('dataKind')) {
        if (keyObject.dataKind != filterObject.dataKind) {
          matchesDataKind = false;
        }
      }
      keep = matchesRel && matchesGene && matchesDataKind;
    }
    if (keep) {
      var p = me.promiseGetData(key, false)
       .then(function(dataCompressed) {

        if (dataCompressed) {

          var dataSize = dataCompressed.length + key.length;
          itemSize =  (dataSize/1024);
          totalKb += itemSize;

          var rec = {'key': key, 'size': itemSize.toFixed(2) + " KB"};
          if (showData) {
            CacheHelper.promiseDecompressData(dataCompressed, true).then(function(data) {
              rec.data = data;
            });
          }

          recs.push(rec);
        } else {
          recs.push({'key': key, 'size': '0 KB'});
        }
       })
       promises.push(p);

    }

  })
  Promise.all(promises).then(function() {
    recs.forEach(function(rec) {
      if (showData) {
        console.log(rec.key);
        console.log(rec.data);
      } else {
        console.log(rec.key + "=" + rec.size);
      }

    });
    if (totalKb > 1024){
      console.log("Total = " + (totalKb/1024).toFixed(2)+ " MB");
    } else {
      console.log("Total = " + totalKb.toFixed(2)+ " KB");
    }
  });
}

CacheHelper.prototype.logData = function(key) {
  var me = this;
  me.promiseGetData(key)
   .then(function(data) {
    console.log(data);
   })
}




