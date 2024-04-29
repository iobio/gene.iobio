class FilterModel {

  constructor(globalApp, isTrio, affectedInfo, isBasicMode, isFullAnalysis) {
    this.globalApp = globalApp;
    this.isTrio = isTrio;
    this.affectedInfo = affectedInfo;

    this.isBasicMode = isBasicMode;
    this.isFullAnalysis = isFullAnalysis;

    this.regionStart = null;
    this.regionEnd = null;

    this.snpEffEffects = {};
    this.vepConsequences = {};
    //this.exonicOnlyFilter = false;
    this.recFilters = {};

    this.geneCoverageMin           = 10;
    this.geneCoverageMean          = 15;
    this.geneCoverageMedian        = 15;

    this.dispatch = d3.dispatch("variantFlagged");
    d3.rebind(this, this.dispatch, "on");

    this.flagCriterion = {
      gene: {
        'reviewed': {
          active: false,
          custom: false,
          title: "Reviewed",
          name: "Variants with notes and/or interpretation",
          order: 0,
          userFlagged: false,
          maxAf: null,
          maxHomozygotes: null,
          clinvar: null,
          impact: null,
          consequence: null,
          inheritance: null,
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: null
        },
        'pathogenic': {
          active: true,
          custom: false,
          title: "Pathogenic in ClinVar",
          name: "Pathogenic, likely pathogenic ClinVar, low allele freq",
          order: 1,
          userFlagged: false,
          maxAf: .05,
          maxHomozygotes: null,
          clinvar: ['clinvar_path', 'clinvar_lpath'],
          impact: null,
          consequence: null,
          inheritance: null,
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: null
        },
        'autosomalDominant': {
          active: true,
          custom: false,
          title: "Autosomal dominant",
          name: "Autosomal dominant inhertance, low allele freq",
          order: 2,
          userFlagged: false,
          maxAf: .01,
          maxHomozygotes: null,
          clinvar: null,
          impact: ['HIGH', 'MODERATE'],
          consequence: null,
          inheritance: ['autosomal dominant'],
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: ['pathogenic']
        },
        'recessive': {
          active: true,
          custom: false,
          title:"Recessive",
          name: "Recessive inheritance, low allele freq",
          order: 3,
          userFlagged: false,
          maxAf: .01,
          maxHomozygotes: null,
          clinvar: null,
          impact: ['HIGH', 'MODERATE'],
          consequence: null,
          inheritance: ['recessive'],
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: 5,
          minRevel: null,
          isUserFlagged: false,
          exclusiveOf: ['pathogenic']
        },
        'denovo': {
          active: true,
          custom: false,
          title: "De novo",
          name: "De novo inheritance, low allele freq",
          order: 4,
          userFlagged: false,
          maxAf: .01,
          maxHomozygotes: null,
          clinvar: null,
          impact: ['HIGH', 'MODERATE'],
          consequence: null,
          inheritance: ['denovo'],
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: 5,
          minRevel: null,
          exclusiveOf: ['pathogenic']
        },
        'compoundHet': {
          active: true,
          custom: false,
          title: "Compound hets",
          name: "Compound het inheritance, low allele freq",
          order: 5,
          userFlagged: false,
          maxAf: .05,
          maxHomozygotes: null,
          clinvar: null,
          impact: ['HIGH', 'MODERATE'],
          consequence: null,
          inheritance: ['compound het'],
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: ['pathogenic']
        },
        'xlinked': {
          active: true,
          custom: false,
          title: "X-linked recessive",
          name: "X-linked recessive inheritance, low allele freq",
          userFlagged: false,
          order: 6,
          maxAf: .01,
          maxHomozygotes: null,
          clinvar: null,
          impact: ['HIGH', 'MODERATE'],
          consequence: null,
          inheritance: ['x-linked'],
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: ['pathogenic']
        },
        'high': {
          active: true,
          custom: false,
          title: "High or moderate impact",
          name: "High impact, low allele freq",
          order: 7,
          userFlagged: false,
          maxAf: .025,
          maxHomozygotes: null,
          clinvar: null,
          impact: ['HIGH', 'MODERATE'],
          consequence: null,
          inheritance: null,
          zyosity: null,
          isUserFlagged: false,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: ['pathogenic', 'autosomalDominant', 'recessive', 'denovo', 'compoundHet', 'xlinked']
        },
        'userFlagged': {
          active: true,
          custom: false,
          title: "Flagged by user",
          name: "Variants flagged by user",
          order: 8,
          userFlagged: true,
          maxAf: null,
          clinvar: null,
          impact: null,
          consequence: null,
          inheritance: null,
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf:  null
        },
        'notCategorized': {
          // TODO - figure out how to show when variants no longer match filters
          active: false,
          custom: false,
          title: "Imported variants not passing above filters",
          name: "Imported variant that don't pass any gene.iobio filters",
          order: 8,
          userFlagged: false,
          maxAf: null,
          maxHomozygotes: null,
          clinvar: null,
          impact: null,
          consequence: null,
          inheritance: null,
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: null
        },
        'notFound': {
          // TODO - figure out how to show when variants no longer match filters
          active: false,
          custom: false,
          title: "Imported variants not found in variant file",
          name: "Imported variants that not found in the proband variant file",
          order: 9,
          userFlagged: false,
          maxAf: null,
          maxHomozygotes: null,
          clinvar: null,
          impact: null,
          consequence: null,
          inheritance: null,
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: null
        }


      },
      genefull: {
        'reviewed': {
          active: false,
          custom: false,
          title: "Reviewed",
          name: "Variants with notes and/or interpretation",
          order: 0,
          userFlagged: false,
          maxAf: null,
          maxHomozygotes: null,
          clinvar: null,
          impact: null,
          consequence: null,
          inheritance: null,
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: null
        },
        'pathogenic': {
          active: true,
          custom: false,
          title: "Pathogenic in ClinVar",
          name: "Pathogenic, likely pathogenic ClinVar, low allele freq",
          order: 1,
          userFlagged: false,
          maxAf: .01,
          maxHomozygotes: null,
          clinvar: ['clinvar_path', 'clinvar_lpath'],
          impact: null,
          consequence: null,
          inheritance: null,
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: null
        },
        'autosomalDominant': {
          active: true,
          custom: false,
          title: "Autosomal dominant",
          name: "Autosomal dominant inhertance, low allele freq",
          order: 2,
          userFlagged: false,
          maxAf: .01,
          maxHomozygotes: null,
          clinvar: null,
          impact: ['HIGH', 'MODERATE'],
          consequence: null,
          inheritance: ['autosomal dominant'],
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: ['pathogenic']
        },
        'recessive': {
          active: true,
          custom: false,
          title:"Recessive",
          name: "Recessive inheritance, low allele freq",
          order: 3,
          userFlagged: false,
          maxAf: .01,
          maxHomozygotes: null,
          clinvar: null,
          impact: ['HIGH', 'MODERATE'],
          consequence: null,
          inheritance: ['recessive'],
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: 5,
          minRevel: null,
          isUserFlagged: false,
          exclusiveOf: ['pathogenic']
        },
        'denovo': {
          active: true,
          custom: false,
          title: "De novo",
          name: "De novo inheritance, low allele freq",
          order: 4,
          userFlagged: false,
          maxAf: .01,
          maxHomozygotes: null,
          clinvar: null,
          impact: ['HIGH', 'MODERATE'],
          consequence: null,
          inheritance: ['denovo'],
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: 5,
          minRevel: null,
          exclusiveOf: ['pathogenic']
        },
        'compoundHet': {
          active: true,
          custom: false,
          title: "Compound hets",
          name: "Compound het inheritance, low allele freq",
          order: 5,
          userFlagged: false,
          maxAf: .05,
          maxHomozygotes: null,
          clinvar: null,
          impact: ['HIGH', 'MODERATE'],
          consequence: null,
          inheritance: ['compound het'],
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: ['pathogenic']
        },
        'xlinked': {
          active: true,
          custom: false,
          title: "X-linked recessive",
          name: "X-linked recessive inheritance, low allele freq",
          userFlagged: false,
          order: 6,
          maxAf: .01,
          maxHomozygotes: null,
          clinvar: null,
          impact: ['HIGH', 'MODERATE'],
          consequence: null,
          inheritance: ['x-linked'],
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: ['pathogenic']
        },
        'high': {
          active: false,
          custom: false,
          title: "High impact",
          name: "High impact, low allele freq",
          order: 7,
          userFlagged: false,
          maxAf: .01,
          maxHomozygotes: null,
          clinvar: null,
          impact: ['HIGH', ],
          consequence: null,
          inheritance: null,
          zyosity: null,
          isUserFlagged: false,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: ['pathogenic', 'autosomalDominant', 'recessive', 'denovo', 'compoundHet', 'xlinked']
        },
        'notCategorized': {
          // TODO - figure out how to show when variants no longer match filters
          active: false,
          custom: false,
          title: "Filtered variants",
          name: "Variants found during full analysis, but not passing any app filters",
          order: 8,
          userFlagged: false,
          maxAf: null,
          maxHomozygotes: null,
          clinvar: null,
          impact: null,
          consequence: null,
          inheritance: null,
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: null
        },
        'notFound': {
          // TODO - figure out how to show when variants no longer match filters
          active: false,
          custom: false,
          title: "Not found",
          name: "Variants not found",
          order: 9,
          userFlagged: false,
          maxAf: null,
          maxHomozygotes: null,
          clinvar: null,
          impact: null,
          consequence: null,
          inheritance: null,
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: null
        }
      }
    }

    this.flagCriteria = (this.isFullAnalysis ? this.flagCriterion.genefull : this.flagCriterion.gene)

    this.modelFilters = {
      'known-variants': {
        'clinvar': []
      },
      'sfari-variants': {
        'vepImpact': []
      }
    }
  }

  getSortedActiveFilters() {
    let self = this;
    let filters = [];
    for (var filterName in self.flagCriteria) {
      let flagCriteria = self.flagCriteria[filterName];
      if (flagCriteria.active) {
        filters.push($.extend({'key': filterName}, flagCriteria));
      }
    }

    let sortedFilters = filters.sort(function(filterObject1, filterObject2) {
      if (+filterObject1.order < +filterObject2.order) {
        return -1;
      } else if (+filterObject1.order > +filterObject2.order) {
        return 1;
      } else {
        return 0;
      }
    })

    return sortedFilters;
  }


  getDefaultFilter() {
    let self = this;
    // For mygene2 basic mode, return a fixed filter of clinvar path / likely path and AF < 1%
    if (self.isBasicMode) {
      var annots =  {
        clinvar_path:     {key: 'clinvar',       state: true, value: 'clinvar_path'},
        clinvar_lpath:    {key: 'clinvar',       state: true, value: 'clinvar_lpath'}
      }

      return { afMin: 0, afMax: .01, annotsToInclude: annots };
    }

    return {
      'afMin': null,
      'afMax': null,
      'annotsToInclude': null,
      'affectedInfo': self.getAffectedFilterInfo()
    };
  }


  populateEffectFilters(resultMap) {
    let self = this;
    for (var key in resultMap) {
      resultMap[key].features.forEach(function(variant) {
        if (variant.hasOwnProperty('effect')) {
          for (var effect in variant.effect) {
            self.snpEffEffects[effect] = effect;
          }
        }
        if (variant.hasOwnProperty('vepConsequence')) {
          for (var vepConsequence in variant.vepConsequence) {
            self.vepConsequences[vepConsequence] = vepConsequence;
          }
        }
      });
    }
  }

  populateRecFilters(resultMap) {
    let self = this;

    if (self.recFilters == null) {
      self.recFilters = {};
    }
    for (var key in resultMap) {
      resultMap[key].features.forEach( function(variant) {
        if (!variant.hasOwnProperty('fbCalled') || variant.fbCalled != 'Y') {
          self.recFilters[variant.recfilter] = variant.recfilter;
        }
      });
    }
  }


  hasFilters() {
    return this.getFilterString().length > 0;
  }

  getFilterString() {
    let self = this;

    var filterString = "";
    var defaultFilter = self.getDefaultFilter();


    var AND = function(filterString) {
      if (filterString.length > 0) {
        return   " <span class='filter-element'>and</span> ";
      } else {
        return "";
      }
    }

    var filterBox = function(filterString) {
      return "<span class=\"filter-flag filter-element label label-primary\">" + filterString + "</span>";
    }



    // When low coverage filter applied, we only filter on this, not any other criteria.
    if (this.applyLowCoverageFilter) {
      filterString += filterBox("Exon coverage min < " + this.geneCoverageMin + " OR median < " + this.geneCoverageMedian + " OR mean < " + this.geneCoverageMean);
      return filterString;
    }

    var affectedFilters = [];
    if (defaultFilter.affectedInfo) {
      affectedFilters = defaultFilter.affectedInfo.filter(function(info) {
        return info.filter && info.status == 'affected';
      });
      if (affectedFilters.length > 0) {
        var buf = "";
        affectedFilters.forEach(function(info) {
          if (buf.length > 0) {
            buf += ", ";
          }
          buf += info.label;
        })
        filterString +=  AND(filterString) + filterBox("Present in affected: " + buf);
      }
    }

    var unaffectedFilters = [];
    if (defaultFilter.affectedInfo) {
      unaffectedFilters = defaultFilter.affectedInfo.filter(function(info) {
        return info.filter  && info.status == 'unaffected';
      });
      if (unaffectedFilters.length > 0) {
        var buf = "";
        unaffectedFilters.forEach(function(info) {
          if (buf.length > 0) {
            buf += ", ";
          }
          buf += info.label;
        })
        filterString +=  AND(filterString) +  filterBox("Absent in unaffected: " + buf);
      }
    }

    if (defaultFilter.afMin != null && defaultFilter.afMax != null) {
      if (defaultFilter.afMin >= 0 && defaultFilter.afMax < 1) {
        filterString += AND(filterString) + filterBox("Allele freqency between " + defaultFilter.afMin + " and  " + defaultFilter.afMax);
      }
    }

    if (defaultFilter.coverageMin && defaultFilter.coverageMin > 0) {
      if (filterString.length > 0) {
        filterString += AND(filterString) +  filterBox("coverage at least " + defaultFilter.coverageMin + "X");
      }
    }


    var annots = {};
    for (var key in defaultFilter.annotsToInclude) {
      var annot = defaultFilter.annotsToInclude[key];
      if (annot.state) {
        var annotObject = annots[annot.key];
        if (annotObject == null) {
          annotObject = {values: [], label: annot.label};
          annots[annot.key] = annotObject;
        }
        annotObject.values.push((annot.not ? "NOT " : "") + annot.valueDisplay);
      }
    }

    for (var key in annots) {
      var annotObject = annots[key];
      var theValues = "";
      annotObject.values.forEach(function(theValue) {
        if (theValues.length > 0) {
          theValues += ", "
        } else if (annotObject.values.length > 1) {
          theValues +=  "(";
        }
        theValues += theValue;
      });
      if (annotObject.values.length > 1) {
        theValues += ")";
      }

      filterString += AND(filterString) + filterBox(annotObject.label + '&nbsp;&nbsp;' + theValues);
    }
    return filterString;
  }



  passesModelFilter(relationship, variant) {
    let self = this;
    let theFilters = self.modelFilters[relationship];
    if (theFilters) {
      let passCount = 0;
      for (var key in theFilters) {
        let filterEntries = theFilters[key];
        if (filterEntries && filterEntries.length > 0) {
          let varKey = variant[key];
          if (relationship === 'sfari-variants' && Object.keys(varKey)) {
            varKey = Object.values(varKey)[0];
          }
          if (filterEntries.indexOf(varKey) >= 0) {
            passCount++;
          }
        } else {
          passCount++;
        }
      }
      return passCount == Object.keys(theFilters).length;
    } else {
      return true;
    }
  }

  setModelFilter(relationship, key, entries) {
    this.modelFilters[relationship][key] = entries;
  }



  whichLowCoverage(gc) {
    var fields = {};
    fields.min    = +gc.min    < this.geneCoverageMin    ? '' + this.geneCoverageMin : null;
    fields.median = +gc.median < this.geneCoverageMedian ? '' + this.geneCoverageMedian : null;
    fields.mean   = +gc.mean   < this.geneCoverageMean   ? '' + this.geneCoverageMean : null;
    return fields;
  }

  isLowCoverage(gc) {
    return  +gc.min   < this.geneCoverageMin
    || +gc.median < this.geneCoverageMedian
    || +gc.mean   < this.geneCoverageMean;
  }

  getAffectedFilterInfo(refreshedAffectedInfo) {
    var self = this;

    if (refreshedAffectedInfo) {
      self.affectedInfo = refreshedAffectedInfo;
    }

    if (refreshedAffectedInfo) {
      self.affectedInfo.filter(function(info) {
        return info.model.isAffected();
      })
      .forEach(function(info) {
        //var cb = $('#present-in-affected').find("#" + info.id + " input");
        //info.filter = (cb.is(":checked"));
      });

      self.affectedInfo.filter(function(info) {
        return !info.model.isAffected();
      })
      .forEach(function(info) {
        //var cb = $('#absent-in-unaffected').find("#" + info.id + " input");
        //info.filter = (cb.is(":checked"));
      });

    }
    return this.affectedInfo;
  }


  clearAffectedFilters() {
    let self = this;

    if (self.affectedInfo) {
      self.affectedInfo.filter(function(info) {
        return info.model.isAffected() && info.relationship != 'proband';
      })
      .forEach(function(info) {
        //var cb = $('#present-in-affected').find("#" + info.id + " input");
        //cb.prop('checked', false);
        info.filter = false;
      });

      self.affectedInfo.filter(function(info) {
        return !info.model.isAffected();
      })
      .forEach(function(info) {
        //var cb = $('#absent-in-unaffected').find("#" + info.id + " input");
        //cb.prop('checked', false);
        info.filter = false;
      });


      //self.affectedInfo = getAffectedInfo();
    }

    return self.affectedInfo;
  }

  flagVariants(theVcfData) {
    let self = this;
    var badges = {}
    for (var key in this.flagCriteria) {
      if (this.flagCriteria[key].active) {
        badges[key] = [];
      }
    }
    badges.flagged = [];

    if (theVcfData && theVcfData.features) {
      theVcfData.features.filter(function(variant) {
        return variant.zygosity == null || variant.zygosity.toUpperCase() != 'HOMREF';
      })
      .forEach(function(variant) {
        self._flagVariant(variant, badges);
      })

    }
    return badges;
  }

  flagImportedVariants(importedVariants) {
    let self = this;
    var badges = {};
    for (var key in this.flagCriteria) {
      if (this.flagCriteria[key].active) {
        badges[key] = [];
      }
    }
    badges.flagged = [];

    importedVariants.forEach(function(variant) {
      self._flagVariant(variant, badges);
    })

    return badges;
  }

  _flagVariant(variant, badges) {
    let self = this;
    var badgePassState = {};

    for (var key in self.flagCriteria) {
      if (self.flagCriteria[key].active) {
        badgePassState[key] = false;
      }
    }
    badgePassState.flagged = false;

    if (variant.notFound) {
      badgePassState['notFound'] = true;
      if (badges["notFound"] == null) {
        badges["notFound"] = [];
      }
    } else if (variant.isUserFlagged) {
      badgePassState['userFlagged'] = true;
    } else {
      variant.isFlagged = false;
      variant.featureClass = "";
      for (var badge in self.flagCriteria) {
        if (self.flagCriteria[badge].active) {

          var passes = self.determinePassCriteria(badge, variant);

          if (passes.all) {
            badgePassState[badge] = true;
          }
        }
      }

      var filtersPassedAll = [];
      for (var filterName in self.flagCriteria) {
        if (badgePassState[filterName]) {
          filtersPassedAll.push(filterName);
        }
      }
      // If a badge is exclusive of passing other criteria, fail the badge
      // if the other badges passed the criteria for the filter
      // Example:  high is exclusive of the clinvar badge.
      //           So if the variant passes the clinvar criteria, it does
      //           not pass the high criteria.
      for (var badge in self.flagCriteria) {
        var badgeCriteria = self.flagCriteria[badge];
        if (badgeCriteria.exclusiveOf) {
          var matchesOther = false;
          badgeCriteria.exclusiveOf.forEach(function(exclusiveBadge) {
            if (badgePassState[exclusiveBadge]) {
              matchesOther = true;
            }
          })
          if (matchesOther) {
            badgePassState[badge] = false;
          }
        }
      }
    }

    // Now add the variant to any badges that passes the critera
    var filtersPassed = [];
    for (var filterName in self.flagCriteria) {
      if (badgePassState[filterName]) {
          filtersPassed.push(filterName);
          badges[filterName].push(variant);
      }
    }
    if (filtersPassed.length > 0) {
      variant.isFlagged = true;
      variant.featureClass = 'flagged';
      variant.filtersPassed = filtersPassed;
      variant.filtersPassedAll = filtersPassedAll;
    } else if (variant.notFound) {
      variant.isFlagged = true;
      variant.isUserFlagged = false;
      variant.notCategorized = false;
      variant.featureClass = 'flagged';
      self.mapGenomeWideFilter(variant);
      if (badges["notFound"] == null) {
        badges["notFound"] = [];
      }
      badges["notFound"].push($.extend({}, variant))
      // Activate the notFound filter so it shows in the flagged
      // variants panel
      if (self.flagCriteria['notFound'].active == false) {
        self.flagCriteria['notFound'].active = true;
      }

    } else if (variant.isImported) {
      variant.isFlagged = true;
      variant.isUserFlagged = false;
      variant.notCategorized = true;
      variant.featureClass = 'flagged';
      self.mapGenomeWideFilter(variant);
      if (badges["notCategorized"] == null) {
        badges["notCategorized"] = [];
      }
      badges["notCategorized"].push($.extend({}, variant))
      // Activate the 'notCategorized' filter so it shows in the flagged
      // variants panel
      if (self.flagCriteria['notCategorized'].active == false) {
        self.flagCriteria['notCategorized'].active = true;
      }
    }

    if (variant.isFlagged) {
      if (!variant.analysisMode) {
        variant.analysisMode = {gene: false, genefull: false};
      }
      if (self.isFullAnalysis) {
        variant.analysisMode.genefull = true;
      } else {
        variant.analysisMode.gene = true;
      }


      // We clone the variant because when we save the analysis
      // (stringified JSON of the cache), we want to prevent stringify from
      // assuming we have recursive data; otherwise stringify will exclude the
      // variant from the string, showing it as an empty object.
      let clonedVariant = $.extend({}, variant)
      badges.flagged.push(clonedVariant);

      // Dispatch an event so that listener (GeneHome) can
      // update the variant with saved Mosaic variant annotation
      // for 'Interpretation'
      self.dispatch.variantFlagged(variant);
    }

  }

  mapGenomeWideFilter(variant) {
    let self = this;
    if (variant.variantSet && variant.variantSet.length > 0) {
      let filter = self.flagCriteria[variant.variantSet];
      if (filter) {
        variant.filtersPassed = variant.variantSet;
      } else if (variant.notFound) {
        variant.filtersPassed = 'notFound';
      } else {
        variant.filtersPassed = 'notCategorized';
      }
    } else {
      if (variant.notFound) {
        variant.filtersPassed = 'notFound'
      } else {
        variant.filtersPassed = "notCategorized";
      }
    }
  }

  determinePassCriteria(badge, variant, options) {
    let self = this;
    var badgeCriteria = self.flagCriteria[badge];
    var passes = {
      all: false,
      af: false,
      homozygotes: false,
      impact: false,
      consequence: false,
      clinvar: false,
      inheritance: false,
      zygosity: false,
      depth: false,
      altCount: false,
      revel: false,
      userFlagged: false,
      notCategorized: false,
      notFound: false
    };

    if (badge == 'notCategorized') {
      if (variant.notCategorized) {
        passes.notCategorized = true;
        passes.all = true;
      }
    } else if (badge == 'notFound') {
      if (variant.notFound) {
        passes.notFound = true;
        passes.all = true;
      }
    } else if (badgeCriteria.userFlagged == true) {
      if (variant.isUserFlagged) {
        passes.userFlagged = true;
        passes.all = true;
      }
    } else {
      if (badgeCriteria.maxAf == null || badgeCriteria.maxAf == "" || (variant.afHighest <= badgeCriteria.maxAf)) {
        passes.af = true;
      }
      if (badgeCriteria.maxHomozygotes == null || (parseInt(variant.gnomAD.homCount) <= parseInt(badgeCriteria.maxHomozygotes))) {
        passes.homozygotes = true;
      }
      if (badgeCriteria.minRevel == null || badgeCriteria.minRevel == "") {
        passes.revel = true;
      //} //else if (Object.keys(variant.vepREVEL).length == 0) {
        // This isn't a variant with a REVEL score, so don't try to filter
        //passes.revel = true
      } else {
        // This is a variant with a revel score, so make sure it passes
        // the min revel score (if non-blank)
        for (var revel in variant.vepREVEL) {
          if (+revel >= badgeCriteria.minRevel) {
            passes.revel = true;
          }
        }
      }
      if (badgeCriteria.minGenotypeDepth == null || badgeCriteria.minGenotypeDepth == ""  || (+variant.genotypeDepth >= +badgeCriteria.minGenotypeDepth)) {
        passes.depth = true;
      }
      if (badgeCriteria.minGenotypeAltCount == null || badgeCriteria.minGenotypeAltCount == "" ||( +variant.genotypeAltCount >= +badgeCriteria.minGenotypeAltCount)) {
        passes.altCount = true;
      }
      if (badgeCriteria.impact && badgeCriteria.impact.length > 0) {
        badgeCriteria.impact.forEach(function(key) {
          Object.keys(variant.highestImpactVep).forEach(function(highestImpactKey) {
            if (highestImpactKey == key) {
              passes.impact = true;
            }
          })
        })
      } else {
        passes.impact = true;
      }
      if (badgeCriteria.consequence && badgeCriteria.consequence.length > 0) {
        badgeCriteria.consequence.forEach(function(key) {
          if (Object.keys(variant.vepConsequence).indexOf(key) >= 0) {
            passes.consequence = true;
          }
        })
      } else {
        passes.consequence = true;
      }
      if (badgeCriteria.clinvar == null || badgeCriteria.clinvar.length == 0 || badgeCriteria.clinvar.indexOf(variant.clinvar) >= 0) {
        passes.clinvar = true;
      }
      if (badgeCriteria.inheritance == null || badgeCriteria.inheritance.length == 0 || badgeCriteria.inheritance.indexOf(variant.inheritance) >= 0) {
        passes.inheritance = true;
      }
      if (badgeCriteria.zygosity == null || variant.zygosity.toUpperCase() == badgeCriteria.zygosity.toUpperCase() ) {
        passes.zygosity = true;
      }
      if (options && options.ignore) {
        options.ignore.forEach(function(criterion) {
          passes[criterion] = true;
        })
      }
      if (passes.homozygotes && passes.af && passes.revel && passes.depth && passes.altCount && passes.impact && passes.consequence && passes.clinvar && passes.inheritance && passes.zygosity) {
        passes.all = true;
      }
    }

    return passes;
  }


}

export default FilterModel;
