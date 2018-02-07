/*
 * Home.vue
 *
 */
<style lang="sass">

  .app-card
    margin-bottom: 10px

  #data-sources-loader
    margin-top: 20px
    margin-left: auto
    margin-right: auto
    text-align: center

</style>



<template>

  <div>


    <navigation
      v-if="geneModel"
      ref="navRef"
      :geneModel="geneModel"
      :bookmarkModel="bookmarkModel"
      @input="onGeneSelected"
      @load-demo-data="onLoadDemoData"
      @clear-cache="clearCache"
      @copy-paste-genes="onCopyPasteGenes"
      @bookmark-selected="onBookmarkSelected"
    >
    </navigation>
    <v-content>
      <v-container fluid>

        <genes-card
         v-if="geneModel && geneModel.geneNames.length > 0"
         :geneModel="geneModel"
         :selectedGene="selectedGene"
         :geneNames="geneModel.sortedGeneNames"
         :loadedGeneNames="Object.keys(geneModel.geneDangerSummaries)"
         :genesInProgress="cacheHelper.cacheQueue"
         :isLoaded="cohortModel && cohortModel.isLoaded"
         @gene-selected="onGeneSelected"
         @remove-gene="onRemoveGene"
         @analyze-all="onAnalyzeAll"
         @sort-genes="onSortGenes"
        >
        </genes-card>

        <gene-card
          v-if="geneModel && Object.keys(selectedGene).length > 0"
          :geneModel="geneModel"
          :selectedGene="selectedGene"
          :selectedTranscript="selectedTranscript"
          @transcript-selected="onTranscriptSelected"
          @gene-source-selected="onGeneSourceSelected"
          @gene-region-buffer-change="onGeneRegionBufferChange"
          @gene-region-zoom="onGeneRegionZoom"
          @gene-region-zoom-reset="onGeneRegionZoomReset"
          >
        </gene-card>


        <div
        id="data-sources-loader"
        class="loader"
        v-bind:class="{ hide: !cohortModel ||  !cohortModel.inProgress.loadingDataSources }">
          <span class="loader-label">Loading files</span>
          <img src="../../../assets/images/wheel.gif">
        </div>

        <feature-matrix-card
        v-if="featureMatrixModel && featureMatrixModel.rankedVariants"
        v-bind:class="{ hide: Object.keys(selectedGene).length == 0 || !cohortModel  || cohortModel.inProgress.loadingDataSources || models.length == 0 }"
        :featureMatrixModel="featureMatrixModel"
        :selectedVariant="selectedVariant"
        :relationship="PROBAND"
        :variantTooltip="variantTooltip"
        :width="cardWidth"
        @cohortVariantClick="onCohortVariantClick"
        @cohortVariantClickEnd="onCohortVariantClickEnd"
        @cohortVariantHover="onCohortVariantHover"
        @cohortVariantHoverEnd="onCohortVariantHoverEnd"
        @bookmark-variant="onBookmarkVariant"
        @variantRankChange="featureMatrixModel.promiseRankVariants(cohortModel.getModel('proband').loadedVariants);"
        >
        </feature-matrix-card>

        <variant-card
        ref="variantCardRef"
        v-for="model in models"
        :key="model.relationship"
        v-bind:class="{ hide: Object.keys(selectedGene).length == 0 || !cohortModel  || cohortModel.inProgress.loadingDataSources }"
        :sampleModel="model"
        :classifyVariantSymbolFunc="model.relationship == 'known-variants' ? model.classifyByClinvar : model.classifyByImpact"
        :variantTooltip="variantTooltip"
        :selectedGene="selectedGene"
        :selectedTranscript="selectedTranscript"
        :selectedVariant="selectedVariant"
        :regionStart="geneRegionStart"
        :regionEnd="geneRegionEnd"
        :width="cardWidth"
        :showGeneViz="model.relationship == 'proband' || model.relationship == 'known-variants'"
        :showDepthViz="model.relationship != 'known-variants'"
        :showVariantViz="model.relationship != 'known-variants' || showClinvarVariants"
        @cohortVariantClick="onCohortVariantClick"
        @cohortVariantClickEnd="onCohortVariantClickEnd"
        @cohortVariantHover="onCohortVariantHover"
        @cohortVariantHoverEnd="onCohortVariantHoverEnd"
        @bookmark-variant="onBookmarkVariant"
        @knownVariantsVizChange="onKnownVariantsVizChange"
        @knownVariantsFilterChange="onKnownVariantsFilterChange"
        >
        </variant-card>

      </v-container>
    </v-content>


  </div>

</template>


<script>


import Navigation         from '../partials/Navigation.vue'
import GeneCard           from  '../viz/GeneCard.vue'
import GenesCard          from  '../viz/GenesCard.vue'
import FeatureMatrixCard  from  '../viz/FeatureMatrixCard.vue'
import VariantCard        from  '../viz/VariantCard.vue'

import SampleModel        from  '../../models/SampleModel.js'
import CohortModel        from  '../../models/CohortModel.js'
import FeatureMatrixModel from  '../../models/FeatureMatrixModel.js'
import FilterModel        from  '../../models/FilterModel.js'
import GeneModel          from  '../../models/GeneModel.js'
import BookmarkModel      from  '../../models/BookmarkModel.js'

import allGenesData from '../../../data/genes.json'


export default {
  name: 'home',
  components: {
      Navigation,
      GenesCard,
      GeneCard,
      FeatureMatrixCard,
      VariantCard
  },
  props: {
    paramGene:             null,
    paramGenes:            null,
    paramSpecies:          null,
    paramBuild:            null,
    paramBatchSize:        null,
    paramGeneSource:       null,
    paramMyGene2:          null,
    paramMode:             null,
    paramAffectedSibs:     null,
    paramUnaffectedSibs:   null,

    paramRelationships:    null,
    paramSamples:          null,
    paramNames:            null,
    paramBams:             null,
    paramBais:             null,
    paramVcfs:             null,
    paramTbis:             null,
    paramAffectedStatuses: null
  },
  data() {
    return {
      greeting: 'gene.iobio.vue',

      allGenes: allGenesData,

      selectedGene: {},
      selectedTranscript: {},
      geneRegionStart: null,
      geneRegionEnd: null,


      cohortModel: null,
      models: [],
      featureMatrixModel: null,
      geneModel: null,
      bookmarkModel: null,
      filterModel: null,
      cacheHelper: null,
      genomeBuildHelper: null,

      variantTooltip: null,

      cardWidth: 0,

      selectedVariant: null,
      showClinvarVariants: false,

      inProgress: {},

      activateBookmarksDrawer: null,

      PROBAND: 'proband'

    }
  },

  created: function() {

  },

  mounted: function() {
    let self = this;

    self.cardWidth = self.$el.offsetWidth;

    self.genomeBuildHelper = new GenomeBuildHelper();
    self.genomeBuildHelper.promiseInit({DEFAULT_BUILD: 'GRCh37'})
    .then(function() {
      return self.promiseInitCache();
    })
    .then(function() {
      return self.cacheHelper.promiseClearStaleCache();
    })
    .then(function() {
      let glyph = new Glyph();
      let translator = new Translator(glyph);
      let genericAnnotation = new GenericAnnotation(glyph);

      self.geneModel = new GeneModel();
      self.geneModel.geneSource = siteGeneSource;
      self.geneModel.genomeBuildHelper = self.genomeBuildHelper;
      self.geneModel.setAllKnownGenes(self.allGenes);
      self.geneModel.translator = translator;


      // Instantiate helper class than encapsulates IOBIO commands
      let endpoint = new EndpointCmd(useSSL,
        IOBIO,
        self.cacheHelper.launchTimestamp,
        self.genomeBuildHelper,
        utility.getHumanRefNames);

      self.bookmarkModel = new BookmarkModel();

      self.cohortModel = new CohortModel(endpoint,
        genericAnnotation,
        translator,
        self.geneModel,
        self.bookmarkModel,
        self.cacheHelper,
        self.genomeBuildHelper,
        new FreebayesSettings());
      self.bookmarkModel.cohort = self.cohortModel;

      self.inProgress = self.cohortModel.inProgress;


      self.featureMatrixModel = new FeatureMatrixModel(self.cohortModel);
      self.featureMatrixModel.init();

      self.variantTooltip = new VariantTooltip(genericAnnotation,
        glyph,
        translator,
        self.cohortModel.annotationScheme,
        self.genomeBuildHelper);

    })
    .then(function() {
      self.models = self.cohortModel.sampleModels;
      self.filterModel = new FilterModel(self.cohortModel.affectedInfo);
      self.cohortModel.filterModel = self.filterModel;

      self.initFromUrl();
    },
    function(error) {

    })
  },

  computed: {
    maxDepth: function() {
      if (this.cohortModel && this.cohortModel.maxDepth) {
        return this.cohortModel.maxDepth;
      } else {
        return 0;
      }
    }
  },

  watch: {
  },

  methods: {


    promiseInitCache: function() {
      let self = this;
      return new Promise(function(resolve, reject) {
        self.cacheHelper = new CacheHelper();
        self.cacheHelper.promiseInit()
         .then(function() {
          self.cacheHelper.isolateSession();
          resolve();
         })
         .catch(function(error) {
          var msg = "A problem occurred in promiseInitCache(): " + error;
          console.log(msg);
          reject(msg);
         })
      })
    },

    promiseClearCache: function() {
      let self = this;
      return self.cacheHelper._promiseClearCache(self.cacheHelper.launchTimestampToClear);
    },

    onLoadDemoData: function() {
      let self = this;
      self.geneModel.copyPasteGenes(self.cohortModel.demoGenes.join(", "));
      self.onGeneSelected(self.cohortModel.demoGenes[0]);
      self.cohortModel.promiseInitDemo()
      .then(function() {
        self.models = self.cohortModel.sampleModels;
        if (self.selectedGene && Object.keys(self.selectedGene).length > 0) {
          self.promiseLoadData();
        }
      })
    },


    promiseLoadData: function() {
      let self = this;


      return new Promise(function(resolve, reject) {


        if (self.models && self.models.length > 0) {

          self.featureMatrixModel.inProgress.loadingVariants = true;
          var options = {'getKnownVariants': self.showClinvarVariants};

          self.cohortModel.promiseLoadData(self.selectedGene,
            self.selectedTranscript,
            options)
          .then(function(resultMap) {
              self.featureMatrixModel.inProgress.loadingVariants = false;
              self.featureMatrixModel.promiseRankVariants(self.cohortModel.getModel('proband').loadedVariants);
              self.filterModel.populateEffectFilters(resultMap);
              self.filterModel.populateRecFilters(resultMap);
              //var bp = me._promiseDetermineVariantBookmarks(vcfData, theGene, theTranscript);
              //bookmarkPromises.push(bp);

              resolve();
          })
          .catch(function(error) {
            reject(error);
          })
        } else {
          Promise.resolve();
        }

      })
    },

    onGeneSelected: function(geneName) {
      var self = this;

      self.deselectVariant();
      self.promiseLoadGene(geneName);
    },

    promiseLoadGene: function(geneName) {
      let self = this;

      return new Promise(function(resolve, reject) {
        if (self.cohortModel) {
          self.cohortModel.clearLoadedData();
        }
        if (self.featureMatrixModel) {
          self.featureMatrixModel.clearRankedVariants();
        }

        self.geneModel.addGeneName(geneName);
        self.geneModel.promiseGetGeneObject(geneName)
        .then(function(theGeneObject) {
          self.geneModel.adjustGeneRegion(theGeneObject);
          self.geneRegionStart = theGeneObject.start;
          self.geneRegionEnd   = theGeneObject.end;
          self.selectedGene = theGeneObject;
          self.selectedTranscript = self.geneModel.getCanonicalTranscript(self.selectedGene);
          self.promiseLoadData()
          .then(function() {
            resolve();
          })
        })
        .catch(function(error) {
          reject(error);
        })
      })
    },
    onTranscriptSelected: function(transcript) {
      var self = this;
      self.selectedTranscript = transcript;
    },
    onGeneSourceSelected: function(theGeneSource) {
      var self = this;
      self.geneModel.geneSource = theGeneSource;
      this.onGeneSelected(this.selectedGene.gene_name);
    },
    onGeneRegionBufferChange: function(theGeneRegionBuffer) {
      let self = this;
      self.geneModel.geneRegionBuffer = theGeneRegionBuffer;
      // We have to clear the cache since the gene regions change
      self.promiseClearCache()
      .then(function() {
        self.onGeneSelected(self.selectedGene.gene_name);
      })
    },
    onGeneRegionZoom: function(theStart, theEnd) {
      this.geneRegionStart = theStart;
      this.geneRegionEnd = theEnd;

      this.featureMatrixModel.setRankedVariants(this.geneRegionStart, this.geneRegionEnd);

      this.filterModel.regionStart = this.geneRegionStart;
      this.filterModel.regionEnd = this.geneRegionEnd;
      this.cohortModel.setLoadedVariants(this.selectedGene);

      this.cohortModel.setCoverage(this.geneRegionStart, this.geneRegionEnd);
    },
    onGeneRegionZoomReset: function() {
      this.geneRegionStart = this.selectedGene.start;
      this.geneRegionEnd = this.selectedGene.end;

      this.featureMatrixModel.setRankedVariants();

      this.filterModel.regionStart = null;
      this.filterModel.regionEnd = null;
      this.cohortModel.setLoadedVariants(this.selectedGene);

      this.cohortModel.setCoverage();
    },
    onCohortVariantClick: function(variant, sourceComponent) {
      let self = this;
      self.selectedVariant = variant;
      self.showVariantExtraAnnots(sourceComponent, variant);
      self.$refs.variantCardRef.forEach(function(variantCard) {
        if (variantCard != sourceComponent) {
          variantCard.showVariantCircle(variant);
          variantCard.showCoverageCircle(variant);
        }
      })
    },
    onCohortVariantClickEnd: function(sourceVariantCard) {
      let self = this;
      self.selectedVariant = null;
      self.$refs.variantCardRef.forEach(function(variantCard) {
        variantCard.hideVariantCircle();
        variantCard.hideCoverageCircle();
      })
    },
    onCohortVariantHover: function(variant, sourceVariantCard) {
      let self = this;
      if (self.selectedVariant == null) {
        self.$refs.variantCardRef.forEach(function(variantCard) {
          if (variantCard != sourceVariantCard) {
            variantCard.showVariantCircle(variant);
            variantCard.showCoverageCircle(variant);
          }
        })
      }
    },
    onCohortVariantHoverEnd: function(sourceVariantCard) {
      let self = this;
      if (self.selectedVariant == null && self.$refs.variantCardRef) {
        self.$refs.variantCardRef.forEach(function(variantCard) {
          variantCard.hideVariantCircle();
          variantCard.hideCoverageCircle();
        })
      }
    },
    deselectVariant: function() {
      let self = this;
      self.selectedVariant = null;
      if (self.$refs.variantCardRef) {
        self.$refs.variantCardRef.forEach(function(variantCard) {
          variantCard.hideVariantTooltip();
          variantCard.hideVariantCircle();
          variantCard.hideCoverageCircle();
        })
      }
    },
    showVariantExtraAnnots: function(sourceComponent, variant) {
      let self = this;
      if (!isLevelEdu && !isLevelBasic)  {

        self.cohortModel
          .getModel(sourceComponent.relationship)
          .promiseGetImpactfulVariantIds(self.selectedGene, self.selectedTranscript)
          .then( function(annotatedVariants) {
            // If the clicked variant is in the list of annotated variants, show the
            // tooltip; otherwise, the callback will get the extra annots for this
            // specific variant
            self.showVariantTooltipExtraAnnots(sourceComponent, variant, annotatedVariants, function() {
              // The clicked variant wasn't annotated in the batch of variants.  Get the
              // extra annots for this specific variant.
              self.cohortModel
                .getModel(sourceComponent.relationship)
                .promiseGetVariantExtraAnnotations(self.selectedGene, self.selectedTranscript, self.selectedVariant)
                .then( function(refreshedVariant) {
                  self.showVariantTooltipExtraAnnots(sourceComponent, variant, [refreshedVariant]);
                })
            })
          });

      }
    },
    showVariantTooltipExtraAnnots: function(sourceComponent, variant, annotatedVariants, callbackNotFound) {
      let self = this;
      var targetVariants = annotatedVariants.filter(function(v) {
        return variant &&
               variant.start == v.start &&
               variant.ref   == v.ref &&
               variant.alt   == v.alt;
      });
      if (targetVariants.length > 0) {
        var annotatedVariant = targetVariants[0];
        annotatedVariant.screenX = variant.screenX;
        annotatedVariant.screenY = variant.screenY;
        annotatedVariant.screenXMatrix = variant.screenXMatrix;
        annotatedVariant.screenYMatrix = variant.screenYMatrix;

        variant.extraAnnot      = true;
        variant.vepHGVSc        = annotatedVariant.vepHGVSc;
        variant.vepHGVSp        = annotatedVariant.vepHGVSp;
        variant.vepVariationIds = annotatedVariant.vepVariationIds;

        sourceComponent.showVariantTooltip(variant, true);
      } else {
        if (callbackNotFound) {
          callbackNotFound();
        }
      }

    },
    onKnownVariantsVizChange: function(viz) {
      let self = this;
      self.showClinvarVariants = viz == 'variants';
      if (self.showClinvarVariants) {
        self.cohortModel.promiseLoadKnownVariants(self.selectedGene, self.selectedTranscript);
      }
    },
    onKnownVariantsFilterChange: function(selectedCategories) {
      let self = this;
      self.filterModel.setModelFilter('known-variants', 'clinvar', selectedCategories);

      self.cohortModel.setLoadedVariants(self.selectedGene, 'known-variants');
    },
    onRemoveGene: function(geneName) {
      this.cacheHelper.clearCacheForGene(geneName);
    },
    onAnalyzeAll: function() {
      this.cacheHelper.analyzeAll(this.cohortModel);
    },
    clearCache: function() {
      this.cacheHelper.promiseClearCache(this.cacheHelper.launchTimestamp);
    },
    onCopyPasteGenes: function(genesString) {
      this.geneModel.copyPasteGenes(genesString);
    },
    onSortGenes: function(sortBy) {
      this.geneModel.sortGenes(sortBy);
    },
    initFromUrl: function() {
      let self = this;

      if ( self.paramMygene2 && self.paramMygene2 != "" ) {
        isMygene2   = self.paramMygene2 == "false" || self.paramMygene2.toUpperCase() == "N" ? false : true;
      }
      if (self.paramMode && self.paramMode != "") {
        isLevelBasic     = self.paramMode == "basic" ? true : false;
        isLevelEdu       = (self.paramMode == "edu" || self.paramMode == "edutour") ? true : false;
      }


      if (self.paramGeneSource) {
        self.geneModel.geneSource = self.paramGeneSource;
      }
      if (self.paramGenes) {
        self.paramGenes.split(",").forEach( function(geneName) {
          self.geneModel.addGeneName(geneName);
        });
      }
      if (self.paramGene) {
        self.geneModel.addGeneName(self.paramGene);
        self.onGeneSelected(self.paramGene);
      }
      if (self.paramSpecies) {
        self.genomeBuildHelper.setCurrentSpecies(self.paramSpecies);
      }
      if (self.paramBuild) {
        self.genomeBuildHelper.setCurrentBuild(self.paramBuild);
      }
      if (self.paramBatchSize) {
        DEFAULT_BATCH_SIZE = self.paramBatchSize;
      }

      var modelInfos = [];
      for (var i = 0; i < self.paramRelationships.length; i++) {
        var rel  = self.paramRelationships[i];
        if (rel) {
          var modelInfo = {'relationship': rel};
          modelInfo.name           = self.paramNames[i];
          modelInfo.vcf            = self.paramVcfs[i];
          modelInfo.tbi            = self.paramTbis[i];
          modelInfo.bam            = self.paramBams[i];
          modelInfo.bai            = self.paramBais[i];
          modelInfo.sample         = self.paramSamples[i];
          modelInfo.affectedStatus = self.paramAffectedStatuses[i];
          modelInfos.push(modelInfo);
        }
      }
      if (modelInfos.length > 0) {
        self.cohortModel.promiseInit(modelInfos)
        .then(function() {

          self.models = self.cohortModel.sampleModels;
          if (self.selectedGene && Object.keys(self.selectedGene).length > 0) {
            self.promiseLoadData();
          }

        })
      }


    },
    onBookmarkVariant: function(variant) {
      this.$refs.navRef.onBookmarks();
      let bookmark = this.bookmarkModel.addBookmark(variant, this.selectedGene, this.selectedTranscript);

      // This will refresh the loaded variants so that the ranked variants and variant
      // chart flag the bookmarked variants
      this.onBookmarkSelected(bookmark);
    },
    onBookmarkSelected: function(bookmark) {
      let self = this;
      self.selectedVariant = bookmark.variant;
      self.selectedGene = bookmark.gene;
      self.selectedTranscript = bookmark.transcript;
      self.onGeneSelected(self.selectedGene.gene_name);
      self.promiseLoadGene(self.selectedGene.gene_name)
      .then(function() {
        self.$refs.variantCardRef.forEach(function(variantCard) {
          if (variantCard.relationship == 'proband') {
            variantCard.showBookmark(bookmark.variant);
          }
        })
      });
    }


  }
}
</script>
