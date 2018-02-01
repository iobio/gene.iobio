class FilterModel {

  constructor(affectedInfo) {
    this.affectedInfo = affectedInfo;

    this.clickedAnnotIds = new Object();
    this.annotsToInclude = new Object();

    this.regionStart = null;
    this.regionEnd = null;

    this.pathogenicityScheme = "clinvar";

    this.annotClasses     = ".type, .impact, ." + IMPACT_FIELD_TO_FILTER + ", .effect, .vepConsequence, .sift, .polyphen, .regulatory, .zygosity, .inheritance, .clinvar, .uasibs, .recfilter";
    this.annotClassLabels = "Type, Impact, VEP Impact, Effect, VEP Consequence, SIFT, PolyPhen, Regulatory, Zygosity, Inheritance mode, ClinVar, Unaffected Sibs, VCF Filter Status";

    this.applyLowCoverageFilter = false;

    // standard filters
    this.KNOWN_CAUSATIVE           = "known_causative";
    this.DENOVO                    = "denovo";
    this.RECESSIVE                 = "recessive";
    this.FUNCTIONAL_IMPACT         = "functional_impact";
    this.LOW_COVERAGE              = "low_coverage";

    this.snpEffEffects = {};
    this.vepConsequences = {};
    this.exonicOnlyFilter = false;
    this.recFilters = {};

    this.geneCoverageMin           = 10;
    this.geneCoverageMean          = 30;
    this.geneCoverageMedian        = 30;


    this.modelFilters = {
      'known-variants': {
        'clinvar': []
      }
    }
  }

  getFilterObject() {
    let self = this;
    // For mygene2 beginner mode, return a fixed filter of AF < 1% and PASS filter.
    if (isLevelBasic) {
      var annots =  {
        clinvar_path:     {key: 'clinvar',       state: true, value: 'clinvar_path'},
        clinvar_lpath:    {key: 'clinvar',       state: true, value: 'clinvar_lpath'}
      }
      //annots.PASS = {key: 'recfilter', state: true, value: 'PASS'};

      return { afMin: 0, afMax: .01, annotsToInclude: annots };
    }

    //var afMin = $('#afhighest-range-filter #af-amount-start').val() != '' ? +$('#afhighest-range-filter #af-amount-start').val() / 100 : null;
    //var afMax = $('#afhighest-range-filter #af-amount-end').val()   != '' ? +$('#afhighest-range-filter #af-amount-end').val()   / 100 : null;
    //var coverageMin = +$('#coverage-min').val();
    var afMin = 0;
    var afMax = 1;
    var coverageMin = 0;

    return {
      'coverageMin': coverageMin,
      'afMin': afMin,
      'afMax': afMax,
      'annotsToInclude': this.annotsToInclude,
      'exonicOnly': $('#exonic-only-cb').is(":checked"),
      'loadedVariants': $('#loaded-variants-cb').is(":checked"),
      'calledVariants': $('#called-variants-cb').is(":checked"),
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
    var filterObject = self.getFilterObject();


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
    if (filterObject.affectedInfo) {
      affectedFilters = filterObject.affectedInfo.filter(function(info) {
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
    if (filterObject.affectedInfo) {
      unaffectedFilters = filterObject.affectedInfo.filter(function(info) {
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



//    if ($('#exonic-only-cb').is(":checked")) {
//      filterString += AND(filterString) + filterBox("not intronic");
//    }

    if (filterObject.afMin != null && filterObject.afMax != null) {
      if (filterObject.afMin >= 0 && filterObject.afMax < 1) {
        filterString += AND(filterString) + filterBox("Allele freqency between " + filterObject.afMin + " and  " + filterObject.afMax);
      }
    }

    if (filterObject.coverageMin && filterObject.coverageMin > 0) {
      if (filterString.length > 0) {
        filterString += AND(filterString) +  filterBox("coverage at least " + filterObject.coverageMin + "X");
      }
    }


    var annots = {};
    for (key in filterObject.annotsToInclude) {
      var annot = filterObject.annotsToInclude[key];
      if (annot.state) {
        var annotObject = annots[annot.key];
        if (annotObject == null) {
          annotObject = {values: [], label: annot.label};
          annots[annot.key] = annotObject;
        }
        annotObject.values.push((annot.not ? "NOT " : "") + annot.valueDisplay);
      }
    }

    for (key in annots) {
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
          if (filterEntries.indexOf(variant[key]) >= 0) {
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


}

export default FilterModel;
