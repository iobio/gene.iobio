class CohortModel {

  constructor(geneModel) {
    this.geneModel = geneModel;

    this.sampleModels  = [];
    this.sampleMap = {};

    this.demoVcf = "https://s3.amazonaws.com/iobio/samples/vcf/platinum-exome.vcf.gz";
    this.demoBams = {
      'proband': 'https://s3.amazonaws.com/iobio/samples/bam/NA12878.exome.bam',
      'mother':  'https://s3.amazonaws.com/iobio/samples/bam/NA12892.exome.bam',
      'father':  'https://s3.amazonaws.com/iobio/samples/bam/NA12891.exome.bam'
    }
    this.mode = 'single';
    this.maxAlleleCount = null;
    this.affectedInfo = null;
   }

  promiseInitDemo() {
    let self = this;

    return new Promise(function(resolve, reject) {
      self.sampleModels = [];
      self.mode = 'trio';

      self.promiseAddDemoSample('proband', 'NA12878')
      .then(function(sample) {

        self.promiseAddDemoSample('mother', 'NA12892')
        .then(function(sample) {

          self.promiseAddDemoSample('father', 'NA12891')
          .then(function(sample) {

            self.promiseAddClinvarSample()
            .then(function(sample) {
              self.setAffectedInfo();
              resolve(self.sampleModels);
            })
            .catch(function(error) {
              reject(error);
            })
          })
        })
      })

    })
  }

  promiseAddDemoSample(rel, sampleName) {
    let self = this;
    return new Promise(function(resolve,reject) {
      var vm = new VariantModel();
      vm.init(self);
      vm.setRelationship(rel);
      vm.onVcfUrlEntered(self.demoVcf, null, function() {
        vm.setSampleName(sampleName);
        vm.setName(rel + " " + sampleName)
        vm.onBamUrlEntered(self.demoBams[rel], null, function() {

          self.sampleModels.push(vm);

          let sample = {'relationship': rel, 'model': vm};
          self.sampleMap[rel] = sample;

          resolve(sample);
        })
      },
      function(error) {
        reject(error);
      });

    })
  }

  promiseAddClinvarSample() {
    let self = this;
    return new Promise(function(resolve,reject) {
      var vm = new VariantModel();
      vm.init(self);
      vm.setRelationship('known-variants');
      vm.setName('Clinvar')
      var clinvarUrl = genomeBuildHelper.getBuildResource(genomeBuildHelper.RESOURCE_CLINVAR_VCF_S3);
      vm.onVcfUrlEntered(clinvarUrl, null, function() {
        self.sampleModels.push(vm);

        var sample = {'relationship': 'known-variants', 'model': vm};
        self.sampleMap['known-variants'] = sample;

        resolve(sample);
      },
      function(error) {
        reject(error);
      });

    })
  }



  setAffectedInfo(forceRefresh) {
    let self = this;
    if (self.affectedInfo == null || forceRefresh) {
      self.affectedInfo = [];
      for (var rel in self.sampleMap) {
        var model = self.sampleMap[rel].model;
        if (model && model.getRelationship() != 'known-variants') {
          var info = {};
          info.model = model;
          info.relationship = model.getRelationship();
          info.status = model.isAffected() ? 'affected' : 'unaffected';
          info.label  = model.getRelationship();

          info.id = info.status + "-_-" + model.getRelationship() + "-_-" + model.getSampleName();

          self.affectedInfo.push(info);
        }
      }
      /*
      var sibIdx = 0;
      for (var status in variantCardsSibs) {
        var sibs = variantCardsSibs[status];
        sibs.forEach(function(vc) {
          var info = {};
          info.relationship = vc.getRelationship();
          info.status = status;
          info.variantCard = vc;
          info.label = vc.getRelationship() + " " + vc.getSampleName();
          info.id = info.status + "-_-" + vc.getRelationship() + "-_-" + vc.getSampleName();

          window.affectedInfo.push(info);
        })
      }
      */

    }
  }


  getProbandModel() {
    return this.sampleMap['proband'].model;
  }

  getModel(relationship) {
    return this.sampleMap[relationship].model;
  }



  isAlignmentsOnly(callback) {
    var theModels = this.sampleModels.filter(function(model) {
      return model.isAlignmentsOnly();
    });
    return theModels.length == this.sampleModels.length;
  }


  samplesInSingleVcf() {
    var theVcfs = {};
    var cards = this.sampleModels.forEach(function(model) {
      if (!model.isAlignmentsOnly() && model.getRelationship() != 'known-variants') {
        if (model.vcfUrlEntered) {
          theVcfs[model.vcf.getVcfURL()] = true;
        } else {
          theVcfs[model.vcf.getVcfFile().name] = true;
        }

      }
    });
    return Object.keys(theVcfs).length == 1;
  }


  promiseLoadData(theGene, theTranscript, filterModel, options) {
    let self = this;

    return new Promise(function(resolve, reject) {
      self.clearLoadedVariants();

      let cohortResultMap = null;
      self.promiseAnnotateVariants(theGene, theTranscript, self.mode == 'trio' && self.samplesInSingleVcf(), false, options.getKnownVariants)
      .then(function(resultMap) {
        cohortResultMap = resultMap;
        // the variants are fully annotated so determine inheritance (if trio).
        return self.promiseAnnotateInheritance(theGene, theTranscript, cohortResultMap, {isBackground: false, cacheData: true})
      })
      .then(function(data) {
        cohortResultMap = data.resultMap;
        // determine if there is insufficient coverage in any of the sample's coding regions
        return self.promiseGetCachedGeneCoverage(theGene, theTranscript, true);
      })
      .then(function() {

        // Now summarize the danger for the selected gene
        self.promiseSummarizeDanger(theGene, theTranscript, cohortResultMap.proband, null, filterModel)
        .then(function() {
          self.setLoadedVariants(theGene);
          resolve();
        })
      })
    })

  }


  clearLoadedVariants() {
    let self = this;
    self.sampleModels.forEach(function(model) {
      model.loadedVariants = {loadState: {}, features: [], maxLevel: 1, featureWidth: 0};
    });
  }

  setLoadedVariants(theGene, regionStart, regionEnd) {
    let self = this;
    self.sampleModels.forEach(function(model) {
      if (model.vcfData && model.vcfData.features) {
        var loadedVariants = $.extend({}, model.vcfData);
        loadedVariants.features = model.vcfData.features.filter( function(feature) {
          var loaded = feature.fbCalled == null;
          var inRegion = true;
          if (regionStart && regionEnd) {
            inRegion = feature.start >= regionStart && feature.start <= regionEnd;
          }
          return loaded && inRegion;
        });

        var pileupObject = model._pileupVariants(loadedVariants.features, theGene.start, theGene.end);
        loadedVariants.maxLevel = pileupObject.maxLevel + 1;
        loadedVariants.featureWidth = pileupObject.featureWidth;

        model.loadedVariants = loadedVariants;

      } else {
        model.loadedVariants = {loadState: {}, features: []};
      }
    })
  }



  promiseAnnotateVariants(theGene, theTranscript, isMultiSample, isBackground, getKnownVariants) {
    let self = this;
    return new Promise(function(resolve, reject) {
      var annotatePromises = [];
      var theResultMap = {};
      if (isMultiSample) {
        p = self.sampleMap['proband'].model.promiseAnnotateVariants(theGene, theTranscript, self.sampleModels, isMultiSample, isBackground)
        .then(function(resultMap) {
          theResultMap = resultMap;
        })
        annotatePromises.push(p);
      } else {
        for (var rel in self.sampleMap) {
          var model = self.sampleMap[rel].model;
          if (model.isVcfReadyToLoad() || vc.model.isLoaded()) {
            if (rel != 'known-variants') {
              var p = model.promiseAnnotateVariants(theGene, theTranscript, [model], isMultiSample, isBackground)
              .then(function(resultMap) {
                for (var rel in resultMap) {
                  theResultMap[rel] = resultMap[rel];
                }
              })
              annotatePromises.push(p);
            }
          }
        }
      }


      if (getKnownVariants) {
        let p = self.sampleMap['known-variants'].model.promiseAnnotateVariants(theGene, theTranscript, [self.sampleMap['known-variants'].model], false, isBackground)
        .then(function(resultMap) {
          for (var rel in resultMap) {
            theResultMap[rel] = resultMap[rel];
          }
        })
        annotatePromises.push(p);
      }


      Promise.all(annotatePromises)
      .then(function() {

        self.promiseAnnotateWithClinvar(theResultMap, theGene, theTranscript, isBackground)
        .then(function(data) {
          resolve(data)
        })

      });
    })
  }




  promiseAnnotateWithClinvar(resultMap, geneObject, transcript, isBackground) {
    let self = this;
    var formatClinvarKey = function(variant) {
      var delim = '^^';
      return variant.chrom + delim + variant.ref + delim + variant.alt + delim + variant.start + delim + variant.end;
    }

    var formatClinvarThinVariant = function(key) {
      var delim = '^^';
      var tokens = key.split(delim);
      return {'chrom': tokens[0], 'ref': tokens[1], 'alt': tokens[2], 'start': tokens[3], 'end': tokens[4]};
    }



    var refreshVariantsWithClinvarLookup = function(theVcfData, clinvarLookup) {
      theVcfData.features.forEach(function(variant) {
        var clinvarAnnot = clinvarLookup[formatClinvarKey(variant)];
        if (clinvarAnnot) {
          for (var key in clinvarAnnot) {
            variant[key] = clinvarAnnot[key];
          }
        }
      })
      if (theVcfData.loadState == null) {
        theVcfData.loadState = {};
      }
      theVcfData.loadState['clinvar'] = true;
    }



    return new Promise(function(resolve, reject) {

      // Combine the trio variants into one set of variants so that we can access clinvar once
      // instead of on a per sample basis
      var uniqueVariants = {};
      var unionVcfData = {features: []}
      for (var rel in resultMap) {
        var vcfData = resultMap[rel];
        if (!vcfData.loadState['clinvar'] && rel != 'known-variants') {
         vcfData.features.forEach(function(feature) {
            uniqueVariants[formatClinvarKey(feature)] = true;
         })
        }
      }
      if (Object.keys(uniqueVariants).length == 0) {
        resolve(resultMap);
      } else {

        for (var key in uniqueVariants) {
          unionVcfData.features.push(formatClinvarThinVariant(key));
        }

        var refreshVariantsFunction = isClinvarOffline || clinvarSource == 'vcf'
          ? self.getProbandModel()._refreshVariantsWithClinvarVCFRecs.bind(self.getProbandModel(), unionVcfData)
          : self.getProbandModel()._refreshVariantsWithClinvarEutils.bind(self.getProbandModel(), unionVcfData);

        self.getProbandModel().vcf.promiseGetClinvarRecords(
            unionVcfData,
            self.getProbandModel()._stripRefName(geneObject.chr),
            geneObject,
            self.geneModel.clinvarGenes,
            refreshVariantsFunction)
        .then(function() {

            // Create a hash lookup of all clinvar variants
            var clinvarLookup = {};
            unionVcfData.features.forEach(function(variant) {
              var clinvarAnnot = {};

              for (var key in self.getProbandModel().vcf.getClinvarAnnots()) {
                  clinvarAnnot[key] = variant[key];
                  clinvarLookup[formatClinvarKey(variant)] = clinvarAnnot;
              }
            })

            var refreshPromises = [];

            // Use the clinvar variant lookup to initialize variants with clinvar annotations
            for (var rel in resultMap) {
              var vcfData = resultMap[rel];
              if (!vcfData.loadState['clinvar']) {
                var p = refreshVariantsWithClinvarLookup(vcfData, clinvarLookup);
                if (!isBackground) {
                  self.getModel(rel).vcfData = vcfData;
                }
                //var p = getVariantCard(rel).model._promiseCacheData(vcfData, CacheHelper.VCF_DATA, vcfData.gene.gene_name, vcfData.transcript);
                refreshPromises.push(p);
              }
            }

            Promise.all(refreshPromises)
            .then(function() {
              resolve(resultMap);
            })
            .catch(function(error) {
              reject(error);
            })

        })
      }


    })
  }

  promiseAnnotateInheritance(geneObject, theTranscript, resultMap, options={isBackground: false, cacheData: true}) {
    let self = this;

    var resolveIt = function(resolve, resultMap, geneObject, theTranscript, options) {

      // Now that inheritance mode has been determined, we can assess each variant's impact
      self.sampleModels.forEach(function(model) {
        if (resultMap[model.getRelationship()]) {
          model.assessVariantImpact(resultMap[model.getRelationship()], theTranscript);
        }
      })


      self.promiseCacheCohortVcfData(geneObject, theTranscript, CacheHelper.VCF_DATA, resultMap, options.cacheData)
      .then(function() {
        resolve({'resultMap': resultMap, 'gene': geneObject, 'transcript': theTranscript});
      })

    }

    return new Promise(function(resolve,reject) {

      if (self.isAlignmentsOnly() && !autocall && (resultMap == null || resultMap.proband == null)) {
          resolve({'resultMap': {'proband': {features: []}}, 'gene': geneObject, 'transcript': theTranscript});
      } else {


        if (self.mode == 'single') {
          // Determine harmful variants, cache data, etc.
          resolveIt(resolve, resultMap, geneObject, theTranscript, options);
        } else {

          // Set the max allele count across all variants in the trio.  We use this to properly scale
          // the allele counts bars in the tooltip
          self.maxAlleleCount = 0;
          for(var rel in resultMap) {
            self.maxAlleleCount = VariantModel.calcMaxAlleleCount(resultMap[rel], self.maxAlleleCount);
          }


          // We only pass in the affected info if we need to sync up genotypes because samples
          // where in separate vcf files
          var affectedInfoToSync = self.isAlignmentsOnly() || self.samplesInSingleVcf() ? null : self.affectedInfo;

          var trioModel = new VariantTrioModel(resultMap.proband, resultMap.mother, resultMap.father, null, affectedInfoToSync);

          // Compare the mother and father variants to the proband, setting the inheritance
          // mode on the proband's variants
          trioModel.compareVariantsToMotherFather(function() {

            // Now set the affected status for the family on each variant of the proband
            self.getProbandModel().determineAffectedStatus(resultMap.proband, geneObject, theTranscript, self.affectedInfo, function() {

              // Determine harmful variants, cache data, etc.
              resolveIt(resolve, resultMap, geneObject, theTranscript, options);

            });


          })
        }

      }


    })

  }


  promiseCacheCohortVcfData(geneObject, theTranscript, dataKind, resultMap, cacheIt) {
    let self = this;
    return new Promise(function(resolve, reject) {
      // Cache vcf data for trio
      var cachePromise = null;
      if (cacheIt) {
        var cachedPromises = [];
        self.sampleModels.forEach(function(model) {
          if (resultMap[model.getRelationship()]) {
            var p = model._promiseCacheData(resultMap[model.getRelationship()], dataKind, geneObject.gene_name, theTranscript);
            cachedPromises.push(p);
          }
        })
        Promise.all(cachedPromises).then(function() {
          resolve();
        })
      } else {
        resolve();
      }

    })

  }

  promiseSummarizeDanger(geneObject, theTranscript, probandVcfData, options, filterModel) {
    let self = this;

    return new Promise(function(resolve, reject) {

      self.promiseGetCachedGeneCoverage(geneObject, theTranscript, false)
      .then(function(data) {

        var geneCoverageAll = data.geneCoverage;

        self.getProbandModel().promiseGetDangerSummary(geneObject.gene_name)
        .then(function(dangerSummary) {

            // Summarize the danger for the gene based on the filtered annotated variants and gene coverage
            var filteredVcfData = null;
            var filteredFbData = null;
            if (probandVcfData.features && probandVcfData.features.length > 0) {
              filteredVcfData = self.getProbandModel().filterVariants(probandVcfData, filterModel.getFilterObject(), geneObject.start, geneObject.end, true);
              filteredFbData  = self.getProbandModel().reconstituteFbData(filteredVcfData);
            }
            var theOptions = $.extend({}, options);
            if ((dangerSummary && dangerSummary.CALLED) || (filteredFbData && filteredFbData.features.length > 0)) {
                theOptions.CALLED = true;
            }

            return self.getProbandModel().promiseSummarizeDanger(geneObject.gene_name, filteredVcfData, theOptions, geneCoverageAll, filterModel);
        })
        .then(function(theDangerSummary) {

          resolve();
        })
        .catch(function(error) {
          var msg = "An error occurred in promiseSummarizeDanger() when calling VariantModel.promiseGetDangerSummary(): " + error;
          console.log(msg);
          reject(msg);
        })


      })
      .catch(function(error) {
        var msg = "An error occurred in CohortModel.promiseSummarizeDanger() when calling promiseGetCachedGeneCoverage(): " + error;
        console.log(msg);
        reject(msg);
      });

    });


  }


  promiseGetCachedGeneCoverage(geneObject, transcript, showProgress = false) {
    let self = this;
    return new Promise(function(resolve, reject) {
      var geneCoverageAll = {gene: geneObject, transcript: transcript, geneCoverage: {}};

      var promises = [];
      self.sampleModels.forEach(function(model) {
        if (model.isBamLoaded()) {
          if (showProgress) {
            //vc.showBamProgress("Analyzing coverage in coding regions");
          }
          var promise = model.promiseGetGeneCoverage(geneObject, transcript)
           .then(function(data) {
            var gc = data.geneCoverage;
            geneCoverageAll.geneCoverage[data.model.getRelationship()] = gc;
            if (showProgress) {
              //getVariantCard(data.model.getRelationship()).endBamProgress();
            }
           })
           .catch(function(error) {
            reject(error);
           })
          promises.push(promise);
        }

      })
      Promise.all(promises).then(function() {
        resolve(geneCoverageAll);
      })
    })

  }


}

export default CohortModel;
