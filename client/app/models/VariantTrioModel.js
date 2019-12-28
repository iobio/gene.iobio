import SampleModel      from './SampleModel.js'

export default class VariantTrioModel {
  constructor(probandVcfData, motherVcfData, fatherVcfData, sibsVcfData, syncGenotypes, affectedInfo) {
    this.probandVcfData = probandVcfData;
    this.motherVcfData = motherVcfData;
    this.fatherVcfData = fatherVcfData;
    this.sibsVcfData = sibsVcfData;
    this.syncGenotypes = syncGenotypes;

    // This is only passed in when the genotypes must be 'stitched together' because
    // samples of mother and father are in separate vcf files
    this.affectedInfo = affectedInfo;
    this.motherAffectedInfo = null;
    this.fatherAffectedInfo = null;
    this.probandAffectedInfo = null;
    if (this.affectedInfo && motherVcfData) {
      this.motherAffectedInfo = this.affectedInfo.filter(function(info) {
        return info.relationship == 'mother';
      })[0];
    }
    if (this.affectedInfo && fatherVcfData) {
      this.fatherAffectedInfo = this.affectedInfo.filter(function(info) {
        return info.relationship == 'father';
      })[0];
    }
    if (this.affectedInfo && probandVcfData) {
      this.probandAffectedInfo = this.affectedInfo.filter(function(info) {
        return info.relationship == 'proband';
      })[0];
    }

    this.sibsVcfDataTransient = [];

  }


  compareVariantsToMotherFather(callback) {
    var me = this;

    // Clear out the inheritance, mother/father zygosity, mother/father genotype fields
    // stored in proband variants
    me.probandVcfData.features.forEach(function(variant) {
      variant.compareMother = null;
      variant.compareFather = null;
      variant.compareMotherFather = null;
      variant.inheritance = 'n/a';
      variant.fatherZygosity = null;
      variant.motherZygosity = null;
      variant.genotypeAltCountFather = null;
      variant.genotypeRefCountFather = null;
      variant.genotypeDepthFather    = null;
      variant.bamDepthFather         = null;
      variant.genotypeAltCountMother = null;
      variant.genotypeRefCountMother = null;
      variant.genotypeDepthMother    = null;
      variant.bamDepthMother         = null;

    });

    // Only continue with comparison if mother and father
    // variant cards are present
    if (me.motherVcfData == null || me.fatherVcfData == null) {
      callback(me.probandVcfData);
      return;
    }
    // Clear out the inheritance, mother/father zygosity, mother/father genotype fields
    // stored in proband variants
    me.motherVcfData.features.forEach(function(variant) {
      variant.compareMotherFather     = null;
      variant.probandZygosity         = null;
      variant.fatherZygosity          = null;
      variant.genotypeAltCountProband = null;
      variant.genotypeRefCountProband = null;
      variant.genotypeDepthProband    = null;
      variant.bamDepthProband         = null;
      variant.genotypeAltCountFather  = null;
      variant.genotypeRefCountFather  = null;
      variant.genotypeDepthFather     = null;
      variant.bamDepthFather          = null;


    });
    me.fatherVcfData.features.forEach(function(variant) {
      variant.compareMotherFather     = null;
      variant.probandZygosity         = null;
      variant.motherZygosity          = null;
      variant.genotypeAltCountProband = null;
      variant.genotypeRefCountProband = null;
      variant.genotypeDepthProband    = null;
      variant.bamDepthProband         = null;
      variant.genotypeAltCountMother  = null;
      variant.genotypeRefCountMother  = null;
      variant.genotypeDepthMother     = null;
      variant.bamDepthMother          = null;


    });


    // Sort the variants
    me.probandVcfData.features = me.probandVcfData.features.sort(SampleModel.orderVariantsByPosition);

    // Compare the proband's variants to the mother's variants
    me.promiseCompareVariants(
      me.probandVcfData,
      me.motherVcfData,
        // This is the attribute on variant a (proband) and variant b (mother)
      // that will store whether the variant is unique or matches.
        'compareMother',
        // This is the callback function called every time we find the same variant
        // in both sets. Here we take the mother variant's af and store it in the
        // proband's variant for further sorting/display in the feature matrix.
        function(variantA, variantB) {
          variantA.motherZygosity = variantB.zygosity != null ? variantB.zygosity : '';
          variantA.genotypeAltCountMother = variantB.genotypeAltCount;
          variantA.genotypeRefCountMother = variantB.genotypeRefCount;
          variantA.genotypeDepthMother    = variantB.genotypeDepth;
          variantA.bamDepthMother         = variantB.bamDepth;

          variantB.probandZygosity         = variantA.zygosity != null ? variantA.zygosity : '';
          variantB.genotypeAltCountProband = variantA.genotypeAltCount;
          variantB.genotypeRefCountProband = variantA.genotypeRefCount;
          variantB.genotypeDepthProband    = variantA.genotypeDepth;
          variantB.bamDepthProband         = variantA.bamDepth;

          me._syncGenotypes(variantA, variantB,
          me.probandAffectedInfo ? me.probandAffectedInfo.model.getSampleName() : null,
          me.motherAffectedInfo  ? me.motherAffectedInfo.model.getSampleName() : null);

        }
    ).then( function() {

       // Compare the proband variants to the father's variants
       return me.promiseCompareVariants(
        me.probandVcfData,
        me.fatherVcfData,
             // This is the attribute on variant a (proband) and variant b (father)
            // that will store whether the variant is unique or matches.
            'compareFather',
          // This is the callback function called every time we find the same variant
          // in both sets. Here we take the father variant's zygosity and store it in the
          // proband's variant for further sorting/display in the feature matrix.
            function(variantA, variantB) {
              variantA.fatherZygosity = variantB.zygosity != null ? variantB.zygosity : '';
              variantA.genotypeAltCountFather = variantB.genotypeAltCount;
              variantA.genotypeRefCountFather = variantB.genotypeRefCount;
              variantA.genotypeDepthFather    = variantB.genotypeDepth;
              variantA.bamDepthFather         = variantB.bamDepth;

              variantB.probandZygosity         = variantA.zygosity != null ? variantA.zygosity : '';
              variantB.genotypeAltCountProband = variantA.genotypeAltCount;
              variantB.genotypeRefCountProband = variantA.genotypeRefCount;
              variantB.genotypeDepthProband    = variantA.genotypeDepth;
              variantB.bamDepthProband         = variantA.bamDepth;

              me._syncGenotypes(variantA, variantB,
              me.probandAffectedInfo ? me.probandAffectedInfo.model.getSampleName() : null,
              me.fatherAffectedInfo  ? me.fatherAffectedInfo.model.getSampleName() : null);


            });

    }, function(error) {
      console.log("error occured when comparing proband variants to mother?");
    }).then( function() {
      // This is the function that is called after the proband variants have been compared
        // to the father variant set.

      // Fill in the inheritance mode.
      me.probandVcfData.features.forEach(function(variant) {
        VariantTrioModel.determineInheritance(variant, 'compareMother', 'compareFather', me.motherAffectedInfo.status, me.fatherAffectedInfo.status);
      });

      if (me.probandVcfData) {
        if (!me.probandVcfData.loadState) {
          me.probandVcfData.loadState = {};
        }
        me.probandVcfData.loadState['inheritance'] = true;
      }
      //filterCard.enableInheritanceFilters(me.probandVcfData);

      callback(me.probandVcfData);
    },
    function(error) {
      console.log("error occured after comparison of proband to mother and father");

    });


    //
    // Now compare mother's variant to father's variants
    //
    me.promiseCompareVariants(
      me.motherVcfData,
      me.fatherVcfData,
        // This is the attribute on variant a (proband) and variant b (mother)
      // that will store whether the variant is unique or matches.
        'compareMotherFather',
        // This is the callback function called every time we find the same variant
        // in both sets. Here we take the mother variant's af and store it in the
        // proband's variant for further sorting/display in the feature matrix.
        function(variantMother, variantFather) {
          variantMother.fatherZygosity = variantFather.zygosity != null ? variantFather.zygosity : '';
          variantMother.genotypeAltCountFather = variantFather.genotypeAltCount;
          variantMother.genotypeRefCountFather = variantFather.genotypeRefCount;
          variantMother.genotypeDepthFather    = variantFather.genotypeDepth;
          variantMother.bamDepthFather         = variantFather.bamDepth;

          variantFather.motherZygosity         = variantMother.zygosity != null ? variantMother.zygosity : '';
          variantFather.genotypeAltCountMother = variantMother.genotypeAltCount;
          variantFather.genotypeRefCountMother = variantMother.genotypeRefCount;
          variantFather.genotypeDepthMother    = variantMother.genotypeDepth;
          variantFather.bamDepthMother         = variantMother.bamDepth;

          me._syncGenotypes(variantMother, variantFather);

      }
    ).then( function() {

    }, function(error) {
      console.log("error occured when comparing proband variants to mother?");
    })

  }

  _syncGenotypes(variantA, variantB, polyFillSampleA, polyFillSampleB) {
    var me = this;
    if (me.syncGenotypes) {
      if (polyFillSampleA && polyFillSampleB) {
        // Polyfill the genotypes for the trio if the samples for parent in separate file from proband
        variantA.genotypes[polyFillSampleB] = variantB.genotype;
        variantB.genotypes[polyFillSampleA] = variantA.genotype;
      }
      // Sync up the genotypes across all samples.  There may be affected/unaffected sib genotypes
      // in the parent vcf, so sync both proband->parent and parent->proband
      for (var sampleName in variantA.genotypes) {
        if (!variantB.genotypes[sampleName]) {
          variantB.genotypes[sampleName] = variantA.genotypes[sampleName];
        }
      }
      for (var sampleName in variantB.genotypes) {
        if (!variantA.genotypes[sampleName]) {
          variantA.genotypes[sampleName] = variantB.genotypes[sampleName];
        }
      }
    }
  }




  promiseCompareVariants(vcfData, otherVcfData, compareAttribute, onMatchFunction, onNoMatchFunction ) {
    var me = this;

    return new Promise( function(resolve, reject) {



        var set1Label = 'unique1';
        var set2Label = 'unique2';
        var commonLabel = 'common';
        var comparisonAttribute = compareAttribute;
        if (comparisonAttribute == null) {
          comparisonAttribute = 'consensus';
        }

        otherVcfData.features = otherVcfData.features.sort(SampleModel.orderVariantsByPosition);
        if (comparisonAttribute) {
          otherVcfData.features.forEach( function(feature) {
            feature[comparisonAttribute] = '';
          });
        }

        var variants1 = vcfData;
        var variants2 = otherVcfData;

        variants1.count = variants1.features.length;
        variants2.count = variants2.features.length;

        var features1 = variants1.features;
        var features2 = variants2.features;

        // Flag duplicates as this will throw off comparisons.  Also bypass homrefs
        var flagDups = function(features) {
          for (var i =0; i < features.length - 1; i++) {
            var variant = features[i];

            var nextVariant = features[i+1];
            if (i == 0) {
              variant.dup = false;
            }
            nextVariant.dup = false;

            if (variant.start == nextVariant.start) {
                 var refAlt = variant.type.toLowerCase() + ' ' + variant.ref + "->" + variant.alt;
                 var nextRefAlt = nextVariant.type.toLowerCase() + ' ' + nextVariant.ref + "->" + nextVariant.alt;

                 if (refAlt == nextRefAlt) {
                    nextVariant.dup = true;
                 }
            }
          }
        }

        var flagHomRefs = function(features) {
          features.forEach(function(variant) {
            if (variant.zygosity != null && variant.zygosity.toLowerCase() == 'homref') {
                variant.ignore = true;
              } else {
                variant.ignore == false;
              }
          });
        }
        flagDups(features1);
        flagDups(features2);
        //flagHomRefs(features1);
        //flagHomRefs(features2);


        // Iterate through the variants from the first set,
        // marking the consensus field based on whether a
        // matching variant from the second list is encountered.
        var idx1 = 0;
        var idx2 = 0;
        while (idx1 < features1.length && idx2 < features2.length) {
          // Bypass duplicates
          if (features1[idx1].dup || features1[idx1].ignore) {
            idx1++;
          }
          if (features2[idx2].dup || features2[idx2].ignore) {
            idx2++;
          }

          if (idx1 >= features1.length || idx2 >= features2.length) {
            continue;
          }

          variant1 = features1[idx1];
          variant2 = features2[idx2];

          var refAlt1 = variant1.type.toLowerCase() + ' ' + variant1.ref + "->" + variant1.alt;
          var refAlt2 = variant2.type.toLowerCase() + ' ' + variant2.ref + "->" + variant2.alt;

          if (variant1.start == variant2.start) {

            if (refAlt1 == refAlt2) {
              variant1[comparisonAttribute] =  commonLabel;
              variant2[comparisonAttribute] =  commonLabel;

              if (onMatchFunction) {
                onMatchFunction(variant1, variant2);
              }
              idx1++;
              idx2++;
            } else if (refAlt1 < refAlt2) {
              variant1[comparisonAttribute] = set1Label;
              if (onNoMatchFunction) {
                onNoMatchFunction(variant1, null);
              }
              idx1++;
            } else {
              variant2[comparisonAttribute] = set2Label;
              if (onNoMatchFunction) {
                onNoMatchFunction(null, variant2);
              }
              idx2++;
            }
          } else if (variant1.start < variant2.start) {
            variant1[comparisonAttribute] = set1Label;
            if (onNoMatchFunction) {
                onNoMatchFunction(variant1, null);
            }
            idx1++;
          } else if (variant2.start < variant1.start) {
            variant2[comparisonAttribute] = set2Label;
            if (onNoMatchFunction) {
                onNoMatchFunction(null, variant2);
            }
            idx2++;
          }

        }


        // If we get to the end of one set before the other,
        // mark the remaining as unique
        //
        if (idx1 < features1.length) {
          for(x = idx1; x < features1.length; x++) {
            var variant1 = features1[x];
            variant1[comparisonAttribute] = set1Label;
            if (onNoMatchFunction) {
                onNoMatchFunction(variant1, null);
            }
          }
        }
        if (idx2 < features2.length) {
          for(var x = idx2; x < features2.length; x++) {
            var variant2 = features2[x];
            variant2[comparisonAttribute] = set2Label;
            if (onNoMatchFunction) {
                onNoMatchFunction(null, variant2);
            }
          }
        }


      resolve();

    });


  }

}

/*
 *  Set the inhertance field on the variant.
 *  recessive  - if mom and dad are het and proband is hom
 *  denovo     - proband has variant, but not present in mom and dad
 *             (homref parents are also the same as variant not being present)
 */
VariantTrioModel.determineInheritance = function(variant, fieldCompareMother, fieldCompareFather, motherAffectedStatus, fatherAffectedStatus) {
  if (variant.zygosity != null && variant.zygosity.toLowerCase() == 'hom'
    && variant.motherZygosity != null && variant.motherZygosity.toLowerCase() == 'het'
    && variant.fatherZygosity != null && variant.fatherZygosity.toLowerCase() == 'het'
    && motherAffectedStatus == "unaffected"
    && fatherAffectedStatus == "unaffected") {
    variant.inheritance = 'recessive';
  } else if (fieldCompareMother && fieldCompareFather
         && (variant[fieldCompareMother] == 'unique1' || (variant[fieldCompareMother]  == 'common' && variant.motherZygosity != null && variant.motherZygosity.toLowerCase() == 'homref'))
         && (variant[fieldCompareFather] == 'unique1' || (variant[fieldCompareFather]  == 'common' && variant.fatherZygosity != null && variant.fatherZygosity.toLowerCase() == 'homref'))
         && motherAffectedStatus == "unaffected"
         && fatherAffectedStatus == "unaffected") {
    variant.inheritance = 'denovo';
  } else if (fieldCompareMother == null && fieldCompareFather == null
        && (variant.motherZygosity != null && variant.motherZygosity.toLowerCase() == 'homref')
         && (variant.fatherZygosity != null && variant.fatherZygosity.toLowerCase() == 'homref')
         && motherAffectedStatus == "unaffected"
         && fatherAffectedStatus == "unaffected") {
    variant.inheritance = 'denovo';
  } else if (variant.zygosity != null && (variant.zygosity != null && variant.zygosity.toLowerCase() == 'hom' || variant.zygosity.toLowerCase() == 'het')
     &&  motherAffectedStatus == "affected"
     &&  (variant.motherZygosity != null && (variant.motherZygosity.toLowerCase() == 'het' || variant.motherZygosity.toLowerCase() == 'hom')) ) {
    variant.inheritance = 'autosomal dominant';
  } else if (variant.zygosity != null && (variant.zygosity.toLowerCase() == 'hom' || variant.zygosity.toLowerCase() == 'het')
     && fatherAffectedStatus == "affected"
     && (variant.fatherZygosity != null && (variant.fatherZygosity.toLowerCase() == 'het' || variant.fatherZygosity.toLowerCase() == 'hom')) ) {
    variant.inheritance = 'autosomal dominant';
  } else if (
    (variant.chrom == "X" || variant.chrom == "chrX")
    && variant.zygosity != null && variant.zygosity.toLowerCase() == 'hom'
    && (
           (variant.motherZygosity != null && (variant.motherZygosity.toLowerCase() == 'het' || variant.motherZygosity.toLowerCase() == 'hom'))
        || (variant.fatherZygosity != null && variant.fatherZygosity.toLowerCase() == 'hom')
       )
    ){
    variant.inheritance = 'x-linked';
  } else {
    if (variant.zygosity != null && (variant.zygosity.toLowerCase() == 'het' || variant.zygosity.toLowerCase() == 'hom')) {
      if (
        (variant.motherZygosity != null && (variant.motherZygosity.toLowerCase() == 'het' || variant.motherZygosity.toLowerCase() == 'hom')) && 
        (variant.fatherZygosity != null && (variant.fatherZygosity.toLowerCase() == 'het' || variant.fatherZygosity.toLowerCase() == 'hom')) 
      ) {
        variant.inheritance = "n/a paternal or maternal"
      } else if (variant.motherZygosity != null && (variant.motherZygosity.toLowerCase() == 'het' || variant.motherZygosity.toLowerCase() == 'hom'))  {
        variant.inheritance = "n/a maternal"
      } else if (variant.fatherZygosity != null && (variant.fatherZygosity.toLowerCase() == 'het' || variant.fatherZygosity.toLowerCase() == 'hom'))  {
        variant.inheritance = "n/a paternal"
      } else {
        variant.inheritance = "n/a"
      }

    } else if (variant.zygosity != null && variant.zygosity.toLowerCase() == 'homref') {
      if (
        (variant.motherZygosity != null && variant.motherZygosity.toLowerCase() == 'homref' ) && 
        (variant.fatherZygosity != null && variant.fatherZygosity.toLowerCase() == 'homref') 
      ) {
        variant.inheritance = "n/a paternal or maternal"
      } else if (variant.motherZygosity != null && variant.motherZygosity.toLowerCase() == 'homref')  {
        variant.inheritance = "n/a maternal"
      } else if (variant.fatherZygosity != null && variant.fatherZygosity.toLowerCase() == 'homref')  {
        variant.inheritance = "n/a paternal"
      } else {
        variant.inheritance = "n/a"
      }

    } else {
      variant.inheritance = "n/a"
    }

  }
}




