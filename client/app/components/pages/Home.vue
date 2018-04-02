/*
 * Home.vue
 *
 */
<style lang="sass">

@import ../../../assets/sass/variables

.app-card
  margin-bottom: 10px

#data-sources-loader
  margin-top: 20px
  margin-left: auto
  margin-right: auto
  text-align: center

.tabs__container
  height: 32px !important
  margin-left: 0px

  .tabs__item
    color: $text-color



.tabs__div
  text-transform: none !important

.tabs__slider
  background-color: $app-color !important
  border-color: $app-color !important

</style>



<template>
  <div>

    <edu-tour-banner
     v-if="isEduMode"
     :tourNumber="tourNumber"
     :geneModel="geneModel"
     @init-tour-sample="onInitTourSample"
     @tour-start-over="onTourStartOver">
    </edu-tour-banner>

    <navigation
      v-if="geneModel"
      ref="navRef"
      :isEduMode="isEduMode"
      :isBasicMode="isBasicMode"
      :forMyGene2="forMyGene2"
      :cohortModel="cohortModel"
      :geneModel="geneModel"
      :flaggedVariants="flaggedVariants"
      @input="onGeneSelected"
      @load-demo-data="onLoadDemoData"
      @clear-cache="promiseClearCache"
      @apply-genes="onApplyGenes"
      @clear-all-genes="onClearAllGenes"
      @flagged-variants-imported="onFlaggedVariantsImported"
      @flagged-variant-selected="onFlaggedVariantSelected"
      @on-files-loaded="onFilesLoaded"
      @on-left-drawer="onLeftDrawer"
      @on-show-welcome="onShowWelcome"
    >
    </navigation>


    <v-content>
      <v-container fluid>

        <intro-card v-if="forMyGene2"
        :closeIntro="closeIntro"
        :isBasicMode="isBasicMode"
        @on-advanced-mode="onAdvancedMode"
        @on-basic-mode="onBasicMode">
        </intro-card>

        <genes-card
         v-if="geneModel && (geneModel.geneNames.length > 0 || isEduMode)"
         v-bind:class="{hide : showWelcome && !isEduMode}"
         ref="genesCardRef"
         :isEduMode="isEduMode"
         :isBasicMode="isBasicMode"
         :tourNumber="tourNumber"
         :geneModel="geneModel"
         :selectedGene="selectedGene"
         :geneNames="geneModel.sortedGeneNames"
         :loadedDangerSummaries="Object.keys(geneModel.geneDangerSummaries)"
         :genesInProgress="cohortModel.genesInProgress"
         :isLoaded="cohortModel && cohortModel.isLoaded"
         :hasAlignments="cohortModel && cohortModel.isLoaded && cohortModel.hasAlignments()"
         :filterModel="cohortModel.filterModel"
         :isLeftDrawerOpen="isLeftDrawerOpen"
         @gene-selected="onGeneSelected"
         @remove-gene="onRemoveGene"
         @analyze-all="onAnalyzeAll"
         @call-variants="callVariants"
         @sort-genes="onSortGenes"
         @add-flagged-variants="onAddFlaggedVariants"
         @register-flagged-variants="onRegisterFlaggedVariants"
         @filter-applied="onFilterApplied"
         @apply-genes="onApplyGenes"
        >
        </genes-card>



        <div
          v-if="geneModel && Object.keys(selectedGene).length > 0" style="height:251px;margin-bottom:10px"
          v-bind:class="{hide : showWelcome }"
          >
         <split-pane :leftPercent="(!isBasicMode && cohortModel && cohortModel.isLoaded && featureMatrixModel && featureMatrixModel.rankedVariants ? (isEduMode ? 50 : (this.isLeftDrawerOpen ?  45 : 35)) : 0)">
            <feature-matrix-card slot="left" style="min-width:310px;min-height:251px;max-height:251px;overflow-y:scroll"
            ref="featureMatrixCardRef"
            v-bind:class="{ hide: isBasicMode || !cohortModel || !cohortModel.isLoaded || !featureMatrixModel || !featureMatrixModel.rankedVariants }"
            :isEduMode="isEduMode"
            :isBasicMode="isBasicMode"
            :featureMatrixModel="featureMatrixModel"
            :selectedGene="selectedGene"
            :selectedTranscript="analyzedTranscript"
            :selectedVariant="selectedVariant"
            :relationship="PROBAND"
            :variantTooltip="variantTooltip"
            :width="cardWidth"
            @cohortVariantClick="onCohortVariantClick"
            @cohortVariantClickEnd="onCohortVariantClickEnd"
            @cohortVariantHover="onCohortVariantHover"
            @cohortVariantHoverEnd="onCohortVariantHoverEnd"
            @flag-variant="onFlagVariant"
            @remove-flagged-variant="onRemoveFlaggedVariant"
            @variantRankChange="featureMatrixModel.promiseRankVariants(cohortModel.getModel('proband').loadedVariants);"
            >
            </feature-matrix-card>

            <v-card slot="right" style="min-height:251px;max-height:251px;overflow-y:scroll">

              <v-tabs
                v-if="geneModel && Object.keys(selectedGene).length > 0"
                v-model="activeGeneVariantTab"
                light
              >
                <v-tab>
                  Gene
                </v-tab>
                <v-tab >
                  Variant
                </v-tab>
                <v-tab-item style="margin-top:10px;max-height:190px;overflow-y:scroll">
                  <gene-card
                    v-if="geneModel && Object.keys(selectedGene).length > 0"
                    :showTitle="false"
                    :isEduMode="isEduMode"
                    :isBasicMode="isBasicMode"
                    :geneModel="geneModel"
                    :selectedGene="selectedGene"
                    :selectedTranscript="selectedTranscript"
                    :geneRegionStart="geneRegionStart"
                    :geneRegionEnd="geneRegionEnd"
                    :showGeneViz="cohortModel == null || !cohortModel.isLoaded"
                    @transcript-selected="onTranscriptSelected"
                    @gene-source-selected="onGeneSourceSelected"
                    @gene-region-buffer-change="onGeneRegionBufferChange"
                    @gene-region-zoom="onGeneRegionZoom"
                    @gene-region-zoom-reset="onGeneRegionZoomReset"
                    >
                  </gene-card>
                </v-tab-item>
                <v-tab-item  style="max-height:210px;overflow-y:scroll">
                  <variant-detail-card
                  ref="variantDetailCardRef"
                  :isEduMode="isEduMode"
                  :isBasicMode="isBasicMode"
                  :showTitle="false"
                  :selectedGene="selectedGene"
                  :selectedTranscript="analyzedTranscript"
                  :selectedVariant="selectedVariant"
                  :selectedVariantRelationship="selectedVariantRelationship"
                  :genomeBuildHelper="genomeBuildHelper"
                  :variantTooltip="variantTooltip"
                  :cohortModel="cohortModel"
                  :info="selectedVariantInfo"
                  >
                  </variant-detail-card>
                </v-tab-item>
              </v-tabs>
            </v-card>

         </split-pane>
        </div>


        <welcome
         v-if="showWelcome && !isEduMode && !forMyGene2"
         @load-demo-data="onLoadDemoData"
         @take-app-tour="onTakeAppTour"
         >
        </welcome>

        <v-card style="width:400px;height:50px;padding-top:15px"
        id="data-sources-loader"
        class="loader"
        v-bind:class="{ hide: !cohortModel ||  !cohortModel.inProgress.loadingDataSources }">
          <span class="loader-label">Loading files</span>
          <img src="../../../assets/images/wheel.gif">
        </v-card>



        <variant-card
        ref="variantCardRef"
        v-for="model in models"
        :key="model.relationship"
        v-bind:class="[
        { 'hide': showWelcome || Object.keys(selectedGene).length == 0 || !cohortModel  || cohortModel.inProgress.loadingDataSources || (model.relationship == 'known-variants' && showKnownVariantsCard == false),
          'edu' : isEduMode
        },
        model.relationship
        ]"
        :globalAppProp="globalApp"
        :isEduMode="isEduMode"
        :isBasicMode="isBasicMode"
        :sampleModel="model"
        :classifyVariantSymbolFunc="model.relationship == 'known-variants' ? model.classifyByClinvar : model.classifyByImpact"
        :variantTooltip="variantTooltip"
        :selectedGene="selectedGene"
        :selectedTranscript="analyzedTranscript"
        :selectedVariant="selectedVariant"
        :regionStart="geneRegionStart"
        :regionEnd="geneRegionEnd"
        :width="cardWidth"
        :showGeneViz="true"
        :showDepthViz="model.relationship != 'known-variants'"
        :showVariantViz="model.relationship != 'known-variants' || showKnownVariantsCard"
        :geneVizShowXAxis="model.relationship == 'proband' || model.relationship == 'known-variants'"
        @show-known-variants-card="onShowKnownVariantsCard"
        @cohortVariantClick="onCohortVariantClick"
        @cohortVariantClickEnd="onCohortVariantClickEnd"
        @cohortVariantHover="onCohortVariantHover"
        @cohortVariantHoverEnd="onCohortVariantHoverEnd"
        @flag-variant="onFlagVariant"
        @remove-flagged-variant="onRemoveFlaggedVariant"
        @knownVariantsVizChange="onKnownVariantsVizChange"
        @knownVariantsFilterChange="onKnownVariantsFilterChange"
        @gene-region-zoom="onGeneRegionZoom"
        @gene-region-zoom-reset="onGeneRegionZoomReset"
        >
        </variant-card>

      </v-container>
    </v-content>

    <app-tour
     ref="appTourRef"
      :isEduMode="isEduMode"
      :tourNumber="tourNumber"
      :selectedGene="selectedGene"
      :selectedVariant="selectedVariant"
      :phenotypeTerm="phenotypeTerm"
      @circle-variant="onCircleVariant"
    ></app-tour>

  </div>

</template>


<script>

/*
import pako          from '../../third-party/pako_deflate.min.js'
import jsbgzf        from '../../third-party/jsbgzf.js'
import jsbvsampling  from '../../third-party/js-bv-sampling.js'
import jslocalvcf    from '../../third-party/js-local-vcf.js'
import jsbvcommon    from '../../third-party/js-bv-common.js'
import jslocalbam    from '../../third-party/js-local-bam.js'
import readBinaryVCF from '../../third-party/binary-vcf.js'
*/

import Navigation         from  '../viz/Navigation.vue'
import EduTourBanner      from  '../viz/EduTourBanner.vue'
import Welcome            from  '../viz/Welcome.vue'
import IntroCard          from  '../viz/IntroCard.vue'
import GeneCard           from  '../viz/GeneCard.vue'
import VariantDetailCard  from  '../viz/VariantDetailCard.vue'
import GenesCard          from  '../viz/GenesCard.vue'
import FeatureMatrixCard  from  '../viz/FeatureMatrixCard.vue'
import VariantCard        from  '../viz/VariantCard.vue'
import AppTour            from  '../viz/AppTour.vue'

import Bam                from  '../../models/Bam.iobio.js'
import vcfiobio           from  '../../models/Vcf.iobio.js'
import Translator         from  '../../models/Translator.js'
import EndpointCmd        from  '../../models/EndpointCmd.js'
import GenericAnnotation  from  '../../models/GenericAnnotation.js'
import CacheHelper        from  '../../models/CacheHelper.js'
import CohortModel        from  '../../models/CohortModel.js'
import FeatureMatrixModel from  '../../models/FeatureMatrixModel.js'
import FilterModel        from  '../../models/FilterModel.js'
import GeneModel          from  '../../models/GeneModel.js'
import GenomeBuildHelper  from  '../../models/GenomeBuildHelper.js'
import VariantExporter    from  '../../models/VariantExporter.js'
import FreebayesSettings  from  '../../models/FreebayesSettings.js'

import Glyph              from '../../partials/Glyph.js'
import VariantTooltip     from '../../partials/VariantTooltip.js'

import allGenesData       from '../../../data/genes.json'
import SplitPane          from '../partials/SplitPane.vue'



export default {
  name: 'home',
  components: {
      EduTourBanner,
      Navigation,
      IntroCard,
      Welcome,
      GenesCard,
      GeneCard,
      VariantDetailCard,
      FeatureMatrixCard,
      VariantCard,
      SplitPane,
      AppTour
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
    paramTour:             null,

    paramFileId:           null,

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
      analyzedTranscript: {},
      coverageDangerRegions: null,
      geneRegionStart: null,
      geneRegionEnd: null,

      genesInProgress: {},

      flaggedVariants: [],

      cohortModel: null,
      models: [],
      featureMatrixModel: null,
      geneModel: null,
      filterModel: null,
      cacheHelper: null,
      genomeBuildHelper: null,

      variantTooltip: null,
      appTour: null,

      selectedVariant: null,
      selectedVariantRelationship: null,

      showKnownVariantsCard: false,

      inProgress: {},

      PROBAND: 'proband',
      cardWidth: 0,
      activeGeneVariantTab: null,
      isLeftDrawerOpen: null,
      showWelcome: false,


      /*
      * This variable controls special behavior for running gene.iobio education edition, with
      * a simplified interface and logic.
      */
      isEduMode:  false,
      tourNumber: null,

      /*
      * These flags control special behavior for running gene.iobio basic mode, with
      * a simplified interface and logic.
      */
      isBasicMode: false,
      forMyGene2: false,


      closeIntro: false,

      phenotypeTerm: null,

      siteConfig: null
    }
  },

  created: function() {


  },

  mounted: function() {
    let self = this;

    self.cardWidth = self.$el.offsetWidth;

    self.setAppMode();

    self.genomeBuildHelper = new GenomeBuildHelper(self.globalApp);
    self.genomeBuildHelper.promiseInit({DEFAULT_BUILD: 'GRCh37'})
    .then(function() {
      return self.promiseInitCache();
    })
    .then(function() {
      return self.cacheHelper.promiseClearStaleCache();
    })
    .then(function() {
      return self.promiseLoadSiteConfig();
    })
    .then(function() {
      let glyph = new Glyph();
      let translator = new Translator(self.globalApp, glyph);
      let genericAnnotation = new GenericAnnotation(glyph);

      self.geneModel = new GeneModel(self.globalApp);
      self.geneModel.geneSource = self.forMyGene2 ? "refseq" : "gencode";
      self.geneModel.genomeBuildHelper = self.genomeBuildHelper;
      self.geneModel.setAllKnownGenes(self.allGenes);
      self.geneModel.translator = translator;


      // Instantiate helper class than encapsulates IOBIO commands
      let endpoint = new EndpointCmd(self.globalApp,
        self.cacheHelper.launchTimestamp,
        self.genomeBuildHelper,
        self.globalApp.utility.getHumanRefNames);

      self.variantExporter = new VariantExporter(self.globalApp);

      self.cohortModel = new CohortModel(
        self.globalApp,
        self.isEduMode,
        self.isBasicMode,
        endpoint,
        genericAnnotation,
        translator,
        self.geneModel,
        self.variantExporter,
        self.cacheHelper,
        self.genomeBuildHelper,
        new FreebayesSettings());

      self.cacheHelper.cohort = self.cohortModel;

      self.variantExporter.cohort = self.cohortModel;

      self.inProgress = self.cohortModel.inProgress;


      self.featureMatrixModel = new FeatureMatrixModel(self.globalApp, self.cohortModel, self.isEduMode, self.isBasicMode, self.tourNumber);
      self.featureMatrixModel.init();
      self.cohortModel.featureMatrixModel = self.featureMatrixModel;

      self.variantTooltip = new VariantTooltip(
        self.globalApp,
        self.isEduMode,
        self.isBasicMode,
        self.tourNumber,
        genericAnnotation,
        glyph,
        translator,
        self.cohortModel.annotationScheme,
        self.genomeBuildHelper);

      self.filterModel = new FilterModel(self.globalApp, self.cohortModel.affectedInfo, self.isBasicMode);
      self.cohortModel.filterModel = self.filterModel;

      self.promiseInitFromUrl()
      .then(function() {
          if (self.isEduMode && self.tourNumber) {
            self.$refs.appTourRef.startTour(self.tourNumber);
          }
          self.models = self.cohortModel.sampleModels;
          if (self.selectedGene && Object.keys(self.selectedGene).length > 0) {
            self.promiseLoadData();
          }
      })
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
    },
    selectedVariantInfo: function() {
      if (this.selectedVariant) {
        return this.globalApp.utility.formatDisplay(this.selectedVariant, this.cohortModel.translator, this.isEduMode)
      } else {
        return null;
      }
    }

  },

  watch: {
  },

  methods: {


    promiseInitCache: function() {
      let self = this;
      return new Promise(function(resolve, reject) {
        self.cacheHelper = new CacheHelper(self.globalApp);
        self.cacheHelper.on("geneAnalyzed", function(geneName) {
          self.$refs.genesCardRef.determineFlaggedGenes();
          if (geneName == self.selectedGene.gene_name) {
            self.promiseLoadData();
          }
        });
        self.cacheHelper.on("analyzeAllCompleted", function() {
          self.$refs.navRef.onShowFlaggedVariants();
        });
        self.globalApp.cacheHelper = self.cacheHelper;
        self.cacheHelper.promiseInit()
         .then(function() {
          self.cacheHelper.isolateSession(self.isEduMode);
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

      return new Promise(function(resolve, reject) {
        if (self.isEduMode) {
          resolve();
        } else {
          self.geneModel.clearDangerSummaries();
          self.cacheHelper.promiseClearCache(self.cacheHelper.launchTimestampToClear)
          .then(function() {
            self.cohortModel.cacheHelper.refreshGeneBadges(function() {
              resolve();
            })
          })
          .catch(function(error) {
            resolve(error);
          })

        }

      })
    },

    promiseLoadSiteConfig: function() {
      let self = this;
      return new Promise(function(resolve, reject) {

        $.ajax({
            url: self.globalApp.siteConfigUrl,
            type: "GET",
            crossDomain: true,
            dataType: "json",
            success: function( res ) {
              self.siteConfig = res;
              resolve();
            },
            error: function( xhr, status, errorThrown ) {
              console.log( "Error: " + errorThrown );
              console.log( "Status: " + status );
              console.log( xhr );
              reject("Error " + errorThrown + " occurred in promiseLoadSiteConfig() when attempting get siteConfig.json ");
            }
        });

      });

    },

    onLoadDemoData: function() {
      let self = this;
      self.promiseClearCache()
      .then(function() {
        self.onGeneSelected(self.cohortModel.demoGenes[0]);
        return self.cohortModel.promiseInitDemo()
      })
      .then(function() {
        self.models = self.cohortModel.sampleModels;
        if (self.selectedGene && Object.keys(self.selectedGene).length > 0) {
          self.promiseLoadData()
          .then(function() {
            if (self.cohortModel && self.cohortModel.isLoaded && !self.isEduMode) {
              self.cacheHelper.analyzeAll(self.cohortModel, false);
            }
          });
        }
      })
    },


    promiseLoadData: function() {
      let self = this;


      return new Promise(function(resolve, reject) {


        if (self.models && self.models.length > 0) {


          var options = {'getKnownVariants': self.showKnownVariantsCard};

          self.cohortModel.promiseLoadData(self.selectedGene,
            self.selectedTranscript,
            options)
          .then(function(resultMap) {

              self.filterModel.populateEffectFilters(resultMap);
              self.filterModel.populateRecFilters(resultMap);

              self.cohortModel.promiseMarkCodingRegions(self.selectedGene, self.selectedTranscript)
              .then(function(data) {
                self.analyzedTranscript = data.transcript;
                self.coverageDangerRegions = data.dangerRegions;
                self.$refs.genesCardRef.determineFlaggedGenes();
                resolve();
              })
          })
          .catch(function(error) {
            reject(error);
          })
        } else {
          Promise.resolve();
        }

      })
    },


    callVariants: function(theGene) {
      let self = this;
      if (theGene == null) {
        self.cacheHelper.analyzeAll(self.cohortModel, true);
      } else {
        self.cohortModel.promiseJointCallVariants(self.selectedGene,
          self.selectedTranscript,
          self.cohortModel.getCurrentTrioVcfData(),
          {checkCache: false, isBackground: false})
        .then(function() {
        })
      }
    },

    onFilesLoaded: function(analyzeAll) {
      let self = this;
      this.setUrlParameters();
      self.promiseClearCache()
      .then(function() {
        if (self.selectedGene && self.selectedGene.gene_name) {
          self.promiseLoadGene(self.selectedGene.gene_name);
          if (analyzeAll) {
            if (self.cohortModel && self.cohortModel.isLoaded) {
              self.cacheHelper.analyzeAll(self.cohortModel, false);
            }
          }
        } else if (self.geneModel.sortedGeneNames && self.geneModel.sortedGeneNames.length > 0) {
          self.onGeneSelected(self.geneModel.sortedGeneNames[0]);
        } else {
          alertify.set('notifier','position', 'top-left');
          alertify.warning("Please enter a gene name");
        }
      })
    },

    setUrlParameters: function() {
      let self = this;

      let geneName = "";
      let geneNames = "";
      if (self.selectedGene && self.selectedGene.gene_name) {
        geneName = self.selectedGene.gene_name
      } else if (self.geneModel.sortedGeneNames && self.geneModel.sortedGeneNames.length > 0) {
        geneName = self.geneModel.sortedGeneNames[0];
      }
      if (self.geneModel.sortedGeneNames && self.geneModel.sortedGeneNames.length > 0)  {
        geneNames = self.geneModel.sortedGeneNames.join(",");
      }

      var affectedSibIds = self.cohortModel.sampleMapSibs.affected.map(function(model) {
        return model.sampleName;
      }).join(",");
      var unaffectedSibIds = self.cohortModel.sampleMapSibs.unaffected.map(function(model) {
        return model.sampleName;
      }).join(",");


      var queryObject = {
          gene: geneName,
          genes: geneNames,
          species: self.genomeBuildHelper.getCurrentSpeciesName(),
          build:   self.genomeBuildHelper.getCurrentBuildName(),
          affectedSibs: affectedSibIds,
          unaffectedSibs: unaffectedSibIds
      };

      var i = 0;
      self.cohortModel.getCanonicalModels().forEach(function(model) {
        queryObject['rel'+i]    = model.relationship;
        queryObject['vcf'+i]    = model.vcf && model.vcf.getVcfURL() ? model.vcf.getVcfURL() : "";
        queryObject['tbi'+i]    = model.vcf && model.vcf.getTbiURL() ? model.vcf.getTbiURL() : "";
        queryObject['bam'+i]    = model.bam && model.bam.bamUri ? model.bam.bamUri : "";
        queryObject['bai'+i]    = model.bam && model.bam.baiUri ? model.bam.baiUri : "";
        queryObject['sample'+i] = model.sampleName ? model.sampleName : "";
        queryObject['affectedStatus'+i] = model.affectedStatus;
        i++;
      })


      self.$router.replace({ query: queryObject });



    },

    setUrlGeneParameters() {
      /*
      let self = this;
      let geneName = "";
      let geneNames = "";
      if (self.selectedGene && self.selectedGene.gene_name) {
        geneName = self.selectedGene.gene_name
      } else if (self.geneModel.sortedGeneNames && self.geneModel.sortedGeneNames.length > 0) {
        geneName = self.geneModel.sortedGeneNames[0];
      }
      if (self.geneModel.sortedGeneNames && self.geneModel.sortedGeneNames.length > 0)  {
        geneNames = self.geneModel.sortedGeneNames.join(",");
      }
      var queryObject = {
          gene: geneName,
          genes: geneNames
      };
      self.$router.replace({ query: queryObject });
      */

    },

    onGeneSelected: function(geneName) {
      var self = this;

      self.deselectVariant();
      self.promiseLoadGene(geneName);
      self.activeGeneVariantTab = "0";

    },

    promiseLoadGene: function(geneName) {
      let self = this;

      this.showWelcome = false;

      return new Promise(function(resolve, reject) {

        if (self.forMyGene2) {
          if (!self.closeIntro) {
            setTimeout(function() {
              self.closeIntro = true;
            }, 2000);
          }
        }

        if (self.cohortModel) {
          self.cohortModel.clearLoadedData();
        }
        if (self.featureMatrixModel) {
          self.featureMatrixModel.clearRankedVariants();
        }

        self.geneModel.promiseAddGeneName(geneName)
        .then(function() {
          return self.geneModel.promiseGetGeneObject(geneName)
        })
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
    onCircleVariant: function(idx) {
      let self = this;
      var variant = self.cohortModel.getProbandModel().loadedVariants.features[2];
      self.onCohortVariantClick(variant, null, 'proband');
    },
    onCohortVariantClick: function(variant, sourceComponent, sourceRelationship) {
      let self = this;
      if (variant) {
        self.selectedVariant = variant;
        self.selectedVariantRelationship = sourceRelationship;
        self.activeGeneVariantTab = "1";
        self.showVariantExtraAnnots(sourceComponent, variant);
        self.$refs.variantCardRef.forEach(function(variantCard) {
          if (sourceComponent == null || variantCard != sourceComponent) {
            variantCard.showVariantCircle(variant);
            variantCard.showCoverageCircle(variant);
          }
        })
        if (sourceComponent == null || self.$refs.featureMatrixCardRef != sourceComponent) {
          self.$refs.featureMatrixCardRef.selectVariant(self.selectedVariant);
        }
        if (self.isEduMode) {
          self.$refs.appTourRef.checkVariant(variant);
        }
      } else {
        self.deselectVariant();
      }
    },
    onCohortVariantClickEnd: function(sourceComponent) {
      this.deselectVariant();
    },
    onCohortVariantHover: function(variant, sourceComponent) {
      let self = this;
      self.$refs.variantCardRef.forEach(function(variantCard) {
        if (variantCard != sourceComponent) {
          variantCard.showVariantCircle(variant);
          variantCard.showCoverageCircle(variant);
        }
      })
      if (self.$refs.featureMatrixCardRef != sourceComponent) {
        self.$refs.featureMatrixCardRef.selectVariant(variant);
      }
    },
    onCohortVariantHoverEnd: function(sourceVariantCard) {
      let self = this;
      if (self.$refs.variantCardRef) {
        self.$refs.variantCardRef.forEach(function(variantCard) {
          variantCard.hideVariantCircle();
          variantCard.hideCoverageCircle();
        })
        if (self.selectedVariant == null) {
          self.$refs.featureMatrixCardRef.selectVariant(null);
        }

      }
    },
    deselectVariant: function() {
      let self = this;
      self.selectedVariant = null;
      self.selectedVariantRelationship = null;
      self.activeGeneVariantTab = "0";
      if (self.$refs.variantCardRef) {
        self.$refs.variantCardRef.forEach(function(variantCard) {
          variantCard.hideVariantTooltip();
          variantCard.hideVariantCircle();
          variantCard.hideCoverageCircle();
        })
      }
      if (self.$refs.featureMatrixCardRef) {
        self.$refs.featureMatrixCardRef.selectVariant(null);
      }
    },
    showVariantExtraAnnots: function(sourceComponent, variant) {
      let self = this;
      if (!self.isEduMode && !self.isBasicMode)  {

        self.cohortModel
          .getModel(sourceComponent.relationship)
          .promiseGetImpactfulVariantIds(self.selectedGene, self.selectedTranscript)
          .then( function(annotatedVariants) {
            // If the clicked variant is in the list of annotated variants, show the
            // tooltip; otherwise, the callback will get the extra annots for this
            // specific variant
            self.refreshVariantExtraAnnots(sourceComponent, variant, annotatedVariants, function() {
              // The clicked variant wasn't annotated in the batch of variants.  Get the
              // extra annots for this specific variant.
              self.cohortModel
                .getModel(sourceComponent.relationship)
                .promiseGetVariantExtraAnnotations(self.selectedGene, self.selectedTranscript, self.selectedVariant)
                .then( function(refreshedVariant) {
                  self.refreshVariantExtraAnnots(sourceComponent, variant, [refreshedVariant]);
                })
            })
          });

      }
    },

    refreshVariantExtraAnnots: function(sourceComponent, variant, annotatedVariants, callbackNotFound) {
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


      } else {
        if (callbackNotFound) {
          callbackNotFound();
        }
      }

    },
    onKnownVariantsVizChange: function(viz) {
      let self = this;
      if (viz) {
        self.cohortModel.knownVariantsViz = viz;
      }
      if (self.showKnownVariantsCard && self.cohortModel && self.cohortModel.isLoaded && Object.keys(self.selectedGene).length > 0) {
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
    onClearAllGenes: function() {
      this.selectedGene = {};
      this.geneModel.clearAllGenes();
      this.flaggedVariants = [];
      this.cohortModel.flaggedVariants = [];
    },
    onApplyGenes: function(genesString, phenotypeTerm) {
      let self = this;
      if (phenotypeTerm) {
        self.phenotypeTerm = phenotypeTerm;
      }
      var replace = false;
      var message = null;
      /*
      if (self.geneModel.geneNames.length > 0) {
        var count = self.geneModel.getCopyPasteGeneCount(genesString);
        if (phenotypeTerm && phenotypeTerm.length > 0) {
          message = count + " genes for phenotype " + phenotypeTerm + " ready to apply.  Remove currently listed genes first?";
        } else {
          message = count + " genes ready to apply.  Remove currently listed genes first?";
        }
        alertify.confirm(message,
                function(){
                  replace = true;
                  self.applyGenesImpl(genesString, replace)
                },
                function(){
                  replace = false;
                  self.applyGenesImpl(genesString, replace)
                }).set('labels', {ok:'Yes', cancel:'No'});
      } else {
        */
        self.applyGenesImpl(genesString, false);

      //}

    },
    applyGenesImpl: function(genesString, replace) {
      let self = this;
      self.selectedGene = {};
      self.geneModel.promiseCopyPasteGenes(genesString, replace)
      .then(function() {
        self.setUrlGeneParameters();
        if (self.geneModel.sortedGeneNames && self.geneModel.sortedGeneNames.length > 0) {
          let geneName = self.geneModel.sortedGeneNames[0];
          return self.promiseLoadGene(geneName);
        } else {
          return Promise.resolve();
        }
      })
      .then(function() {
        if (self.geneModel.sortedGeneNames && self.geneModel.sortedGeneNames.length > 0) {
          if (self.cohortModel && self.cohortModel.isLoaded && !self.isEduMode) {
            self.cacheHelper.analyzeAll(self.cohortModel, false);
          }
        }
      })

    },
    onSortGenes: function(sortBy) {
      this.geneModel.sortGenes(sortBy);
    },
    setAppMode: function() {
      let self = this;
      if ( self.paramMyGene2 && self.paramMyGene2 != "" ) {
        self.forMyGene2   = self.paramMyGene2 == "false" || self.paramMyGene2.toUpperCase() == "N" ? false : true;
      }
      if (self.paramMode && self.paramMode != "") {
        self.isBasicMode  = self.paramMode == "basic" ? true : false;
        self.isEduMode    = (self.paramMode == "edu" || self.paramMode == "edutour") ? true : false;
      }
      if (!self.isEduMode && !self.isBasicMode) {
        self.showWelcome = true;
      }
      if (self.paramTour) {
        self.tourNumber = self.paramTour;
      }
    },
    promiseInitFromUrl: function() {
      let self = this;

      return new Promise(function(resolve, reject) {
        if (self.paramGeneSource) {
          self.geneModel.geneSource = self.paramGeneSource;
        }
        if (self.paramGenes) {
          self.paramGenes.split(",").forEach( function(geneName) {
            self.geneModel.promiseAddGeneName(geneName);
          });
        }
        if (self.paramGene) {
          self.geneModel.promiseAddGeneName(self.paramGene);
          self.onGeneSelected(self.paramGene);
        }
        if (self.paramSpecies) {
          self.genomeBuildHelper.setCurrentSpecies(self.paramSpecies);
        }
        if (self.paramBuild) {
          self.genomeBuildHelper.setCurrentBuild(self.paramBuild);
        }
        if (self.paramBatchSize) {
          self.globalApp.DEFAULT_BATCH_SIZE = self.paramBatchSize;
        }

        var modelInfos = [];
        for (var i = 0; i < self.paramRelationships.length; i++) {
          var rel  = self.paramRelationships[i];
          if (rel) {
            var modelInfo            = {'relationship': rel};
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
            resolve();
          }).
          catch(function(error) {
            reject(error);
          })
        } else if (self.isEduMode && self.tourNumber != '') {
          self.promiseInitTourSample(self.tourNumber, 0)
          .then(function() {
            resolve();
          })
        } else if (self.forMyGene2) {
          self.promiseInitMyGene2()
          .then(function() {
            resolve();
          })
        } else {
          resolve();
        }
      })

    },
    onFlagVariant: function(variant) {
      let self = this;
      variant.gene = this.selectedGene;
      variant.transcript = this.selectedTranscript;
      self.cohortModel.addFlaggedVariant(variant);
      self.flaggedVariants = this.cohortModel.flaggedVariants;
      // Refresh the loaded variants so that the ranked variants table
      // reflects the flagged variants
      self.promiseLoadGene(self.selectedGene.gene_name)
    },
    onRemoveFlaggedVariant: function(variant) {
      let self = this;
      variant.isFlagged = false;
      self.cohortModel.removeFlaggedVariant(variant);
      self.flaggedVariants = this.cohortModel.flaggedVariants;
      self.$refs.navRef.onShowFlaggedVariants();
      // Refresh the loaded variants so that the ranked variants table
      // reflects the flagged variants
      self.promiseLoadGene(self.selectedGene.gene_name)

    },
    onAddFlaggedVariants: function(flaggedVariants) {
      let self = this;
      flaggedVariants.forEach(function(variant) {
        variant.gene = self.geneModel.geneObjects[variant.geneName];
        variant.transcript =  self.geneModel.getCanonicalTranscript(variant.gene);
        self.cohortModel.addFlaggedVariant(variant);
      })
    },
    onRegisterFlaggedVariants: function(flaggedGeneNames, flaggedVariants) {
      let self = this;
      self.flaggedVariants = [];
      self.flaggedVariants = flaggedVariants;
      //self.$refs.navRef.onShowFlaggedVariants();

    },
    onFlaggedVariantsImported: function() {
      let self = this;
      self.flaggedVariants = [];
      self.flaggedVariants = this.cohortModel.flaggedVariants;
      self.$refs.genesCardRef.determineFlaggedGenes();
      self.$refs.genesCardRef.updateGeneBadgeCounts();
    },
    onFlaggedVariantSelected: function(flaggedVariant) {
      let self = this;
      self.selectedGene = flaggedVariant.gene;
      self.selectedTranscript = flaggedVariant.transcript;
      self.onGeneSelected(self.selectedGene.gene_name);
      self.promiseLoadGene(self.selectedGene.gene_name)
      .then(function() {
        setTimeout(
          function(){
            self.$set(self, "selectedVariant", flaggedVariant);
            self.$refs.variantCardRef.forEach(function(variantCard) {
              if (variantCard.relationship == 'proband') {
                variantCard.showFlaggedVariant(flaggedVariant);
              }
            })
            self.$refs.featureMatrixCardRef.selectVariant(flaggedVariant, "flagged");
            self.activeGeneVariantTab = "1";
            self.$refs.variantDetailCardRef.refreshGlyphs();
          },
          500);

      });
    },
    onShowKnownVariantsCard: function(show) {
      let self = this;
      self.showKnownVariantsCard = show;
      if (self.showKnownVariantsCard) {
        self.onKnownVariantsVizChange();
      }
    },
    onFilterApplied: function(badge) {
      let self = this;
      self.cohortModel.cacheHelper.refreshGeneBadges(function() {
        self.$refs.genesCardRef.determineFlaggedGenes();
        self.$refs.genesCardRef.updateGeneBadgeCounts();
        self.$refs.navRef.onShowFlaggedVariants();
      })
    },
    onLeftDrawer: function(isOpen) {
      this.isLeftDrawerOpen = isOpen;
    },
    onShowWelcome: function() {
      this.showWelcome = true;
    },
    promiseInitMyGene2: function() {
      let self = this;
      return new Promise(function(resolve, reject) {
        self.cohortModel.promiseInitMyGene2(self.siteConfig, self.paramFileId)
        .then(function() {
          self.models = self.cohortModel.sampleModels;
          var geneName = null;
          if (self.selectedGene && self.selectedGene.gene_name) {
            geneName = self.selectedGene.gene_name;
          } else if (self.geneModel.sortedGeneNames && self.geneModel.sortedGeneNames.length > 0) {
            geneName = self.geneModel.sortedGeneNames[0];
          }
          if (geneName) {
            self.promiseLoadGene(geneName)
            .then(function() {
              self.cacheHelper.analyzeAll(self.cohortModel, false);
              resolve();
            })
            .catch(function(error) {
              reject(error);
            })
          } else {
            resolve();
          }
        })
      })
    },

    onTakeAppTour: function() {
      this.onLoadDemoData();
      this.$refs.appTourRef.startTour("main");
    },
    onInitTourSample: function(tour, sampleIndex) {
      let self = this;
      self.promiseInitTourSample(tour, sampleIndex)
    },
    promiseInitTourSample: function(tour, sampleIndex) {
      let self = this;
      return new Promise(function(resolve, reject) {
        self.cohortModel.promiseInitEduTour(tour, sampleIndex)
        .then(function() {
          self.models = self.cohortModel.sampleModels;
          var geneName = null;
          if (self.selectedGene && self.selectedGene.gene_name) {
            geneName = self.selectedGene.gene_name;
          } else if (self.geneModel.sortedGeneNames && self.geneModel.sortedGeneNames.length > 0) {
            geneName = self.geneModel.sortedGeneNames[0];
          }
          if (geneName) {
            self.promiseLoadGene(geneName)
            .then(function() {
              resolve();
            })
            .catch(function(error) {
              reject(error);
            })
          } else {
            resolve();
          }
        })
      })
    },
    onTourStartOver: function() {
      this.$refs.appTourRef.completeTour();
      this.$router.push({ name: 'exhibit' });
    },
    onAdvancedMode: function() {
      this.isBasicMode = false;
      this.$router.push( { name: 'home', query: {mygene2: this.forMyGene2 ? true : false } })
    },
    onBasicMode: function() {
      this.isBasicMode = true;
      this.$router.push( { name: 'home', query: {mode: 'basic', mygene2: this.forMyGene2 ? true : false } })
    }


  }
}
</script>
