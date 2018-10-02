/*
 * GeneHome.vue
 *
 */
<style lang="sass">

@import ../../../assets/sass/variables



main.content
  margin-top: 55px

.app-card
  margin-bottom: 10px

#data-sources-loader, #session-data-loader
  margin-top: 30px
  margin-left: auto
  margin-right: auto
  text-align: center
  width: 400px
  height: 80px
  padding-top: 15px

.tabs__container
  height: 31px !important
  margin-left: 0px

  .tabs__item
    color: $text-color

.tabs.basic
  .tabs__container
    .tabs__slider
      background-color: transparent !important
      border-color: transparent !important

    .tabs__item
      margin-left: -10px

.tabs__div
  text-transform: none !important

.tabs__slider
  background-color: $app-color !important
  border-color: $app-color !important

.gene-badge-coverage-problem
  color: $coverage-problem-color
  fill: $coverage-problem-color

.split-pane-item
  height: initial !important
  display: flex !important


.switch
  &.accent--text
    color:  $app-color !important

.radio
  &.accent--text
    color:  $app-color !important

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
      :analyzeAllInProgress="cacheHelper.analyzeAllInProgress"
      :callAllInProgress="cacheHelper.callAllInProgress"
      :selectedGene="selectedGene"
      :selectedVariant="selectedVariant"
      :cohortModel="cohortModel"
      :cacheHelper="cacheHelper"
      :geneModel="geneModel"
      :flaggedVariants="flaggedVariants"
      :filteredGeneNames="filteredGeneNames"
      :activeFilterName="activeFilterName"
      :launchedFromClin="launchedFromClin"
      :isFullAnalysis="isFullAnalysis"
      :bringAttention="bringAttention"
      @input="onGeneNameEntered"
      @load-demo-data="onLoadDemoData"
      @clear-cache="promiseClearCache"
      @apply-genes="onApplyGenes"
      @on-start-search-genes="onStartSearchGenes"
      @clear-all-genes="onClearAllGenes"
      @flagged-variants-imported="onFlaggedVariantsImported"
      @flagged-variant-selected="onFlaggedVariantSelected"
      @apply-variant-notes="onApplyVariantNotes"
      @apply-variant-interpretation="onApplyVariantInterpretation"
      @on-files-loaded="onFilesLoaded"
      @on-left-drawer="onLeftDrawer"
      @on-show-welcome="onShowWelcome"
      @show-snackbar="onShowSnackbar"
      @hide-snackbar="onHideSnackbar"
      @gene-selected="onGeneClicked"
      @remove-gene="onRemoveGene"
    >
    </navigation>


    <v-content>
      <v-container fluid>

        <intro-card v-if="forMyGene2"
        :closeIntro="closeIntro"
        :isBasicMode="isBasicMode"
        :siteConfig="siteConfig"
        :defaultingToDemoData="cohortModel ? cohortModel.defaultingToDemoData : false"
        @on-advanced-mode="onAdvancedMode"
        @on-basic-mode="onBasicMode">
        </intro-card>



        <genes-card
         v-if="geneModel"
         v-bind:class="{hide : showWelcome && !isEduMode}"
         ref="genesCardRef"
         :isEduMode="isEduMode"
         :isBasicMode="isBasicMode"
         :isFullAnalysis="isFullAnalysis"
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
         :analyzeAllInProgress="cacheHelper.analyzeAllInProgress"
         :callAllInProgress="cacheHelper.callAllInProgress"
         :showCoverageCutoffs="showCoverageCutoffs"
         @gene-selected="onGeneClicked"
         @remove-gene="onRemoveGene"
         @analyze-all="onAnalyzeAll"
         @call-variants="callVariants"
         @sort-genes="onSortGenes"
         @add-flagged-variants="onAddFlaggedVariants"
         @register-flagged-variants="onRegisterFlaggedVariants"
         @filter-selected="onFilterSelected"
         @filter-settings-applied="onFilterSettingsApplied"
         @filter-settings-closed="showCoverageCutoffs = false"
         @apply-genes="onApplyGenes"
         @stop-analysis="onStopAnalysis"
         @show-known-variants="onShowKnownVariantsCard"
        >
        </genes-card>

        <v-card style="margin-top:10px;margin-bottom:10px;padding-bottom:10px"
            v-if="geneModel && Object.keys(selectedGene).length > 0"
          v-bind:class="{hide : showWelcome }">
          <gene-card
            :showTitle="false"
            :isEduMode="isEduMode"
            :isBasicMode="isBasicMode"
            :geneModel="geneModel"
            :selectedGene="selectedGene"
            :selectedTranscript="selectedTranscript"
            :geneRegionStart="geneRegionStart"
            :geneRegionEnd="geneRegionEnd"
            :showGeneViz="!isEduMode && !isBasicMode && (cohortModel == null || !cohortModel.isLoaded)"
            @transcript-selected="onTranscriptSelected"
            @gene-source-selected="onGeneSourceSelected"
            @gene-region-buffer-change="onGeneRegionBufferChange"
            @gene-region-zoom="onGeneRegionZoom"
            @gene-region-zoom-reset="onGeneRegionZoomReset"
            >
          </gene-card>
        </v-card>

        <div
          v-if="geneModel && Object.keys(selectedGene).length > 0 && (!isBasicMode || selectedVariant != null)"
          style="height:auto;margin-bottom:10px"
          v-bind:class="{hide : showWelcome }"
          >

            <v-card v-if="geneModel && cohortModel.isLoaded && Object.keys(selectedGene).length > 0"
            id="gene-and-variant-tabs" slot="right"
            style="min-height:auto;max-height:auto;margin-bottom:0px;padding-top:0px;margin-top:0px;overflow-y:scroll">


              <v-tabs

                v-model="activeGeneVariantTab"
                light
                :class="{'basic': isBasicMode}"
              >
                <v-tab v-if="!isBasicMode">
                  Ranked Variants in Gene
                </v-tab>
                <v-tab v-if="!isEduMode" >
                  Variant
                </v-tab>

                <v-tab-item v-if="!isBasicMode" style="margin-top:5px;margin-bottom:0px;overflow-y:scroll">

                 <feature-matrix-card   style="min-width:300px;min-height:auto;max-height:auto;overflow-y:scroll"
                  ref="featureMatrixCardRef"
                  v-bind:class="{ hide: !cohortModel || !cohortModel.isLoaded || !featureMatrixModel || !featureMatrixModel.rankedVariants }"
                  :isEduMode="isEduMode"
                  :isBasicMode="isBasicMode"
                  :featureMatrixModel="featureMatrixModel"
                  :selectedGene="selectedGene"
                  :selectedTranscript="analyzedTranscript"
                  :selectedVariant="selectedVariant"
                  :relationship="PROBAND"
                  :variantTooltip="variantTooltip"
                  :width="cardWidth"
                  @cohort-variant-click="onCohortVariantClick"
                  @cohort-variant-hover="onCohortVariantHover"
                  @cohort-variant-hover-end="onCohortVariantHoverEnd"
                  @variant-rank-change="featureMatrixModel.promiseRankVariants(cohortModel.getModel('proband').loadedVariants);"
                  >
                  </feature-matrix-card>


                </v-tab-item>
                <v-tab-item  style="margin-top:0px;margin-bottom:0px;overflow-y:scroll">
                  <variant-detail-card
                  ref="variantDetailCardRef"
                  :isEduMode="isEduMode"
                  :isBasicMode="isBasicMode"
                  :forMyGene2="forMyGene2"
                  :showTitle="false"
                  :selectedGene="selectedGene"
                  :selectedTranscript="analyzedTranscript"
                  :selectedVariant="selectedVariant"
                  :selectedVariantNotes="selectedVariantNotes"
                  :selectedVariantInterpretation="selectedVariantInterpretation"
                  :selectedVariantRelationship="selectedVariantRelationship"
                  :genomeBuildHelper="genomeBuildHelper"
                  :variantTooltip="variantTooltip"
                  :cohortModel="cohortModel"
                  :info="selectedVariantInfo"
                  @transcript-id-selected="onTranscriptIdSelected"
                  @flag-variant="onFlagVariant"
                  @remove-flagged-variant="onRemoveFlaggedVariant"
                  @apply-variant-notes="onApplyVariantNotes"
                  @apply-variant-interpretation="onApplyVariantInterpretation"
                  >
                  </variant-detail-card>

                  <scroll-button ref="scrollButtonRefVariant" :parentId="`variant-detail`">
                  </scroll-button>


                </v-tab-item>
              </v-tabs>
            </v-card>


        </div>


        <welcome
         v-if="showWelcome"
         :launchedFromClin="launchedFromClin"
         :isBasicMode="isBasicMode"
         :isEduMode="isEduMode"
         @load-demo-data="onLoadDemoData"
         @take-app-tour="onTakeAppTour"
         >
        </welcome>

        <v-card
        id="data-sources-loader"
        class="loader"
        v-bind:class="{ hide: !cohortModel ||  !cohortModel.inProgress.loadingDataSources }">
          <span class="loader-label">Loading files</span>
          <img src="../../../assets/images/wheel.gif">
        </v-card>

        <v-card
        id="session-data-loader"
        class="loader"
        v-show="launchedFromClin && (!cohortModel || (!cohortModel.isLoaded && !cohortModel.inProgress.loadingDataSources))">
          <span class="loader-label">Initializing session data</span>
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
        :clearZoom="clearZoom"
        :sampleModel="model"
        :coverageDangerRegions="model.coverageDangerRegions"
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
        @cohort-variant-click="onCohortVariantClick"
        @cohort-variant-hover="onCohortVariantHover"
        @cohort-variant-hover-end="onCohortVariantHoverEnd"
        @known-variants-viz-change="onKnownVariantsVizChange"
        @known-variants-filter-change="onKnownVariantsFilterChange"
        @gene-region-zoom="onGeneRegionZoom"
        @gene-region-zoom-reset="onGeneRegionZoomReset"
        @show-coverage-cutoffs="showCoverageCutoffs = true"
        >
        </variant-card>



        <v-snackbar
          :timeout="snackbar.timeout"
          bottom
          auto-height
          v-model="showSnackbar"

         >
          <span v-html="snackbar.message"></span>
          <v-btn flat color="white"  @click.native="showSnackbar = false">
          </v-btn>
        </v-snackbar>

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

import HubSession         from  '../../models/HubSession.js'
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
import ScrollButton       from '../partials/ScrollButton.vue'



export default {
  name: 'home',
  components: {
      EduTourBanner,
      Navigation,
      IntroCard,
      Welcome,
      GenesCard,
      GeneCard,
      ScrollButton,
      VariantDetailCard,
      FeatureMatrixCard,
      VariantCard,
      SplitPane,
      AppTour,
  },
  props: {
    paramGene:             null,
    paramGeneName:         null,
    paramGenes:            null,
    paramSpecies:          null,
    paramBuild:            null,
    paramBatchSize:        null,
    paramGeneSource:       null,
    paramMyGene2:          null,
    paramMode:             null,
    paramLaunchedFromClin: null,
    paramTour:             null,
    paramProjectId:        null,
    paramSampleId:         null,
    paramIsPedigree:       null,
    paramSource:           null,

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
      greeting: 'gene.iobio',

      launchedFromClin: false,
      isFullAnalysis:  false,

      launchedFromHub: false,
      launchedWithUrlParms: false,


      allGenes: allGenesData,

      selectedGene: {},
      selectedTranscript: {},
      analyzedTranscript: {},
      geneRegionStart: null,
      geneRegionEnd: null,

      genesInProgress: {},

      flaggedVariants: [],
      activeFilterName: null,
      filteredGeneNames: null,

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
      selectedVariantNotes: null,
      selectedVariantInterpretation: null,
      selectedVariantRelationship: null,

      showKnownVariantsCard: false,

      inProgress: {},

      PROBAND: 'proband',
      activeGeneVariantTab: null,
      isLeftDrawerOpen: null,
      showWelcome: false,

      cardWidth: 0,
      mainContentWidth: null,
      featureMatrixWidthPercent: 0,

      showSnackbar: false,
      snackbar: {message: '', timeout: 0},
      bringAttention: null,

      clearZoom: false,

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

      siteConfig: null,

      showCoverageCutoffs: false,

      clinIobioUrls: ["http://localhost:4030", "http://clin.iobio.io", "https://clin.iobio.io", "https://dev.clin.iobio.io", "http://dev.clin.iobio.io"],
      clinIobioUrl: null,

      forceLocalStorage: null

    }
  },

  created: function() {
    let self = this;
    if (self.paramLaunchedFromClin) {
      self.launchedFromClin = true;
      if (self.paramMode && self.paramMode == 'full') {
        self.isFullAnalysis = true;
      }
    }
    window.addEventListener("message", self.receiveClinMessage, false);
  },


  mounted: function() {
    let self = this;
    self.init();
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
    isLeftDrawerOpen: function() {
      let self = this;
      setTimeout(function() {
        self.onResize();
      }, 1000)
    }
  },

  methods: {

    init: function(callback) {
      let self = this;

      self.cardWidth = self.$el.offsetWidth;
      self.cardWidth = window.innerWidth;

      self.mainContentWidth = $('main.content .container').outerWidth();
      $(window).resize(function() {
        self.onResize();
      });

      document.addEventListener("visibilitychange", function() {
        if (!document.hidden) {
          setTimeout(function() {
            self.onResize();
          },1000)
        }
      }, false);

      // Safari can't use IndexedDB in iframes, so in this situation, use
      // local storage instead.
      if (window != top && self.utility.detectSafari()) {
        self.forceLocalStorage = true;
      }

      self.setAppMode();

      self.genomeBuildHelper = new GenomeBuildHelper(self.globalApp);
      self.genomeBuildHelper.promiseInit({DEFAULT_BUILD: 'GRCh37'})
      .then(function() {
        return self.promiseInitCache();
      })
      .then(function() {
          return self.cacheHelper.promiseClearOlderCache();
      })
      .then(function() {
        return self.promiseLoadSiteConfig();
      })
      .then(function() {
        let glyph = new Glyph();
        let translator = new Translator(self.globalApp, glyph);
        let genericAnnotation = new GenericAnnotation(glyph);

        self.geneModel = new GeneModel(self.globalApp, self.forceLocalStorage);
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

        self.filterModel = new FilterModel(self.globalApp, self.cohortModel.affectedInfo, self.isBasicMode, self.isFullAnalysis);
        self.cohortModel.filterModel = self.filterModel;


        self.promiseInitFromUrl()
        .then(function() {
            if (self.isEduMode && self.tourNumber) {
              self.$refs.appTourRef.startTour(self.tourNumber);
            }

            if (self.launchedFromHub) {
              self.onShowSnackbar( {message: 'Loading data...', timeout: 5000});
              self.hubSession = new HubSession();
              let isPedigree = self.paramIsPedigree && self.paramIsPedigree == 'true' ? true : false;
              self.hubSession.promiseInit(self.paramProjectId, self.paramSampleId, self.paramSource, isPedigree )
              .then(modelInfos => {
                self.modelInfos = modelInfos;

                self.cohortModel.promiseInit(self.modelInfos)
                .then(function() {
                  self.models = self.cohortModel.sampleModels;
                  if (self.selectedGene && Object.keys(self.selectedGene).length > 0) {
                    self.promiseLoadData()
                    .then(function() {
                      self.showLeftPanelWhenFlaggedVariants();
                    })
                  } else {
                    self.onShowSnackbar( {message: 'Enter a gene name or enter a phenotype term.', timeout: 5000});
                    self.bringAttention = 'gene';
                  }
                })
              })
            } else {
              self.models = self.cohortModel.sampleModels;
              if (self.selectedGene && Object.keys(self.selectedGene).length > 0) {
                self.promiseLoadData()
                .then(function() {
                  self.showLeftPanelWhenFlaggedVariants();
                })
              } else {
                if  (self.launchedWithUrlParms && self.geneModel.sortedGeneNames.length == 0 ) {
                  self.onShowSnackbar( {message: 'Enter a gene name or enter a phenotype term.', timeout: 5000});
                  self.bringAttention = 'gene';
                }

                if (!self.isEduMode && !self.isBasicMode && !self.launchedFromHub && !self.launchedFromClin && !self.launchedWithUrlParms && self.geneModel.sortedGeneNames.length == 0 ) {
                  self.showWelcome = true;
                }
              }
            }
            if (callback) {
              callback();
            }

        })

      },
      function(error) {
        if (callback) {
          callback();
        }

      })

    },

    promiseInitCache: function() {
      let self = this;
      return new Promise(function(resolve, reject) {
        self.cacheHelper = new CacheHelper(self.globalApp, self.forceLocalStorage);
        window.cacheHelper = self.cacheHelper;
        self.cacheHelper.on("geneAnalyzed", function(geneName) {
          if (!self.launchedFromClin) {
            self.$refs.genesCardRef.determineFlaggedGenes();
          }

          if (self.launchedFromClin) {
            let flaggedVariantsForGene = self.cohortModel.getFlaggedVariantsForGene(geneName);
            if (flaggedVariantsForGene.length > 0) {
              flaggedVariantsForGene.forEach(function(flaggedVariant) {
                self.sendFlaggedVariantToClin(flaggedVariant);
              })
            }
            self.sendCacheToClin(geneName);
          }

          if (self.selectedGene && self.selectedGene.hasOwnProperty("gene_name")
              && geneName == self.selectedGene.gene_name) {
            self.promiseLoadData();
          }
        });
        self.cacheHelper.on("analyzeAllCompleted", function() {
          if (self.launchedFromClin && !self.isFullAnalysis) {
            self.$refs.genesCardRef.determineFlaggedGenes();
          }
          if (!self.isEduMode) {
            self.$refs.navRef.onShowFlaggedVariants();
          }
          if (self.launchedFromClin && !self.isFullAnalysis) {
            self.onSendFiltersToClin();
          }
        });

        self.globalApp.cacheHelper = self.cacheHelper;
        window.globalCacheHelper = self.cacheHelper;

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

      this.clearFilter();
      this.flaggedVariants = [];

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
        self.showLeftPanelForGenes();
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

          self.cardWidth = $('#genes-card').innerWidth();
          var options = {'getKnownVariants': self.showKnownVariantsCard};

          self.cohortModel.promiseLoadData(self.selectedGene,
            self.selectedTranscript,
            options)
          .then(function(resultMap) {
              self.calcFeatureMatrixWidthPercent();

              self.filterModel.populateEffectFilters(resultMap);
              self.filterModel.populateRecFilters(resultMap);

              self.cohortModel.promiseMarkCodingRegions(self.selectedGene, self.selectedTranscript)
              .then(function(data) {
                self.analyzedTranscript = data.transcript;
                if (self.$refs.genesCard) {
                  self.$refs.genesCardRef.determineFlaggedGenes();
                }
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
        self.showLeftPanelForGenes();
        self.cacheHelper.analyzeAll(self.cohortModel, true);
      } else {
        self.cohortModel.promiseJointCallVariants(self.selectedGene,
          self.selectedTranscript,
          self.cohortModel.getCurrentTrioVcfData(),
          {checkCache: false, isBackground: false})
        .then(function() {
          self.$refs.genesCardRef.determineFlaggedGenes();
        })
      }
    },

    onFilesLoaded: function(analyzeAll, callback) {
      let self = this;
      self.setUrlParameters();
      self.showLeftPanelForGenes();

      self.promiseClearCache()
      .then(function() {
        self.featureMatrixModel.init();
        return self.promiseResetAllGenes();
      })
      .then(function() {
        if (self.selectedGene && self.selectedGene.gene_name) {
          self.promiseLoadGene(self.selectedGene.gene_name)
          .then(function() {
            if (callback) {
              callback();
            }
          })

          if (analyzeAll) {
            if (self.cohortModel && self.cohortModel.isLoaded) {
              self.cacheHelper.analyzeAll(self.cohortModel, false);
            }
          }
        } else if (self.geneModel.sortedGeneNames && self.geneModel.sortedGeneNames.length > 0) {
          self.onGeneSelected(self.geneModel.sortedGeneNames[0]);
          if (callback) {
            callback();
          }
        } else {
          self.onShowSnackbar( {message: 'Enter a gene name or a phenotype term.', timeout: 5000});
          self.bringAttention = 'gene';
          if (callback) {
            callback();
          }
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

      let self = this;

      var queryObjectExisting = this.$route.query;
      var queryObject = $().extend({}, queryObjectExisting);

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
      queryObject.gene = geneName;
      queryObject.geneNames = geneNames;

      self.$router.replace({ query: queryObject });


    },

    onGeneNameEntered: function(geneName) {
      let self = this;
      self.clearFilter();
      self.deselectVariant();
      self.promiseLoadGene(geneName)
      .then(function() {
        self.showLeftPanelForGenes();
        self.onSendGenesToClin();
        self.activeGeneVariantTab = "0";
        self.setUrlGeneParameters();
        self.showLeftPanelWhenFlaggedVariants();
      })
    },

    onGeneClicked: function(geneName) {
      var self = this;

      self.deselectVariant();

      self.promiseLoadGene(geneName)
      .then(function() {
        self.setUrlGeneParameters();
        self.showLeftPanelWhenFlaggedVariants();
      })
      self.activeGeneVariantTab = "0";

    },

    onGeneSelected: function(geneName) {
      var self = this;

      self.deselectVariant();
      self.promiseLoadGene(geneName);
      self.activeGeneVariantTab = "0";

    },

    showLeftPanelWhenFlaggedVariants: function() {
      let self = this;
      if (!self.isEduMode && self.flaggedVariants && self.flaggedVariants.length > 0 && !self.isLeftDrawerOpen) {
        if (self.$refs.navRef) {
          setTimeout(function() {
            self.$refs.navRef.onShowFlaggedVariants();
          }, 3000);
        }
      }
    },

    showLeftPanelForGenes: function() {
      let self = this;
      if (self.geneModel && self.geneModel.sortedGeneNames.length > 0) {
        if (self.$refs.navRef) {
          if (!self.isLeftDrawerOpen) {
            setTimeout(function() {
              self.$refs.navRef.onShowGenes();
            }, 2000);
          } else if (self.$refs.navRef) {
            self.$refs.navRef.activeTab = 0;
          }
        }
      }

    },

    promiseLoadGene: function(geneName, theTranscript) {
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

        self.clearZoom = true;

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
          if (self.bringAttention == 'gene') {
            self.bringAttention = null;
          }
          self.geneModel.adjustGeneRegion(theGeneObject);
          self.geneRegionStart = theGeneObject.start;
          self.geneRegionEnd   = theGeneObject.end;
          self.selectedGene = theGeneObject;

          if (theTranscript) {
            // If we have selected a flagged variant, we want to use the flagged
            // variant's transcript
            self.selectedTranscript = theTranscript;
          } else {
            // Determine the transcript that should be selected for this gene
            // If the transcript wasn't previously selected for this gene,
            // set it to the canonical transcript
            let latestTranscript = self.geneModel.getLatestGeneTranscript(geneName);
            if (latestTranscript == null) {
              self.selectedTranscript = self.geneModel.getCanonicalTranscript(self.selectedGene);
              self.geneModel.setLatestGeneTranscript(geneName, self.selectedTranscript);
            } else {
              self.selectedTranscript = latestTranscript;
            }

          }

          if (self.$refs.scrollButtonRefGene) {
            self.$refs.scrollButtonRefGene.showScrollButtons();
          }
          if (self.cohortModel.isLoaded) {
            self.promiseLoadData()
            .then(function() {
              self.clearZoom = false;
              resolve();
            })
            .catch(function(err) {
              console.log(err)
              reject(err);
            })
          } else {
            resolve();
          }
        })
        .catch(function(error) {
          console.log(error);
          self.geneModel.removeGene(geneName);
          self.onShowSnackbar({message: 'Bypassing ' + geneName + '. Unable to find transcripts.', timeout: 60000})
        })
      })
    },
    onTranscriptIdSelected: function(transcriptId) {
      var self = this;
      let theTranscript = null;
      self.selectedGene.transcripts.filter(function(transcript) {
        if (transcript.transcript_id.indexOf(transcriptId) == 0) {
          theTranscript = transcript;
        }
      })
      if (theTranscript != null) {
        self.onTranscriptSelected(theTranscript);
      }
    },
    onTranscriptSelected: function(transcript) {
      var self = this;
      self.selectedTranscript = transcript;
      self.geneModel.setLatestGeneTranscript(self.selectedGene.gene_name, self.selectedTranscript);
      self.onGeneSelected(self.selectedGene.gene_name);
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
        self.calcFeatureMatrixWidthPercent();
        self.selectedVariant = variant;
        self.selectedVariantRelationship = sourceRelationship;
        self.selectedVariantNotes = variant.notes;
        self.selectedVariantInterpretation = variant.interpretation;
        self.activeGeneVariantTab = self.isBasicMode ? "0" : "1";
        self.showVariantExtraAnnots(sourceComponent.relationship, variant);

        self.$refs.variantCardRef.forEach(function(variantCard) {
          if (sourceComponent == null || variantCard != sourceComponent) {
            variantCard.hideVariantCircle(true);
            variantCard.showVariantCircle(variant, true);
            variantCard.showCoverageCircle(variant);
          }
        })
        if (!self.isBasicMode && self.$refs.featureMatrixCardRef) {
          if (sourceComponent == null || self.$refs.featureMatrixCardRef != sourceComponent) {
            self.$refs.featureMatrixCardRef.selectVariant(self.selectedVariant);
          }
        }
        if (self.isEduMode) {
          self.$refs.appTourRef.checkVariant(variant);
        }
        if (self.$refs.scrollButtonRefVariant) {
          self.$refs.scrollButtonRefVariant.showScrollButtons();
        }

      } else {
        self.deselectVariant();
      }
    },
    onCohortVariantHover: function(variant, sourceComponent) {
      let self = this;
      self.$refs.variantCardRef.forEach(function(variantCard) {
        if (variantCard != sourceComponent) {
          variantCard.showVariantCircle(variant, false);
          variantCard.showCoverageCircle(variant);
        }
      })
      if (!self.isBasicMode && self.$refs.featureMatrixCardRef) {
        if (self.$refs.featureMatrixCardRef != sourceComponent) {
          self.$refs.featureMatrixCardRef.selectVariant(variant, 'highlight');
        }
      }
    },
    onCohortVariantHoverEnd: function(sourceVariantCard) {
      let self = this;
      if (self.$refs.variantCardRef) {
        self.$refs.variantCardRef.forEach(function(variantCard) {
          variantCard.hideVariantCircle(false);
          variantCard.hideCoverageCircle();
        })
        if (!self.isBasicMode && self.$refs.featureMatrixCardRef) {
          self.$refs.featureMatrixCardRef.selectVariant(null, 'highlight');
        }

      }
    },
    deselectVariant: function() {
      let self = this;
      self.selectedVariant = null;
      self.selectedVariantNotes = null;
      self.selectedVariantInterpretation = null;
      self.selectedVariantRelationship = null;
      self.activeGeneVariantTab = "0";
      if (self.$refs.variantCardRef) {
        self.$refs.variantCardRef.forEach(function(variantCard) {
          variantCard.hideVariantTooltip();
          variantCard.hideVariantCircle(true);
          variantCard.hideCoverageCircle();
        })
      }
      if (self.$refs.featureMatrixCardRef) {
        self.$refs.featureMatrixCardRef.selectVariant(null);
      }
    },
    showVariantExtraAnnots: function(relationship, variant) {
      let self = this;
      if (!self.isEduMode && !self.cohortModel.getModel(relationship).isAlignmentsOnly() )  {
        if (relationship == 'known-variants') {
          self.cohortModel
              .getModel(relationship)
              .promiseGetVariantExtraAnnotations(self.selectedGene, self.selectedTranscript, self.selectedVariant)
              .then( function(refreshedVariant) {
                self.refreshVariantExtraAnnots(variant, [refreshedVariant]);
              })
        } else {
          self.cohortModel
            .getModel(relationship)
            .promiseGetImpactfulVariantIds(self.selectedGene, self.selectedTranscript)
            .then( function(annotatedVariants) {
              // If the clicked variant is in the list of annotated variants, show the
              // tooltip; otherwise, the callback will get the extra annots for this
              // specific variant
              self.refreshVariantExtraAnnots(variant, annotatedVariants, function() {
                // The clicked variant wasn't annotated in the batch of variants.  Get the
                // extra annots for this specific variant.
                self.cohortModel
                  .getModel(relationship)
                  .promiseGetVariantExtraAnnotations(self.selectedGene, self.selectedTranscript, self.selectedVariant)
                  .then( function(refreshedVariant) {
                    self.refreshVariantExtraAnnots(variant, [refreshedVariant]);
                  })
              })
            });


        }
      }
    },

    refreshVariantExtraAnnots: function(variant, annotatedVariants, callbackNotFound) {
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
      let self = this;
      let msg = "";
      var filters = this.cohortModel.getFlaggedVariantsByFilter(geneName);
      filters.forEach(function(filter) {
        msg += filter.variants.length
            + (filter.variants.length  > 1 ? " variants " : " variant ")
            + " marked as '"
            + filter.filter.title
            + "' "
            + (filter.variants.length  > 1 ? " exist in gene " : " exists in gene ")
            + geneName + ".<br><br>";
      })
      msg += "Are you sure you want to remove gene " + geneName + "?"
      alertify.confirm("",
        msg,
        function (e) {
          // ok
          self.removeGeneImpl(geneName);
        },
        function() {
          // cancel
        }

      ).set('labels', {ok:'OK', cancel:'Cancel'});

    },

    removeGeneImpl: function(geneName) {
      let self = this;
      let flaggedVariantsToDelete = self.cohortModel.getFlaggedVariantsForGene(geneName);

      self.geneModel.removeGene(geneName);
      self.cohortModel.removeFlaggedVariantsForGene(geneName);
      self.clearFilter();
      self.cacheHelper.clearCacheForGene(geneName);
      self.onSendGenesToClin();
      if (self.launchedFromClin && flaggedVariantsToDelete.length > 0) {
        flaggedVariantsToDelete.forEach(function(v) {
          self.sendFlaggedVariantToClin(v, 'delete');
        })
      }
      var newGeneToSelect = null;
      if (geneName == this.selectedGene.gene_name && this.geneModel.sortedGeneNames.length > 0) {
        newGeneToSelect = this.geneModel.sortedGeneNames[0];
        self.deselectVariant();
        self.promiseLoadGene(newGeneToSelect)
        .then(function() {
          self.activeGeneVariantTab = "0";
          self.setUrlGeneParameters();
        })
      } else {
        self.setUrlGeneParameters();
      }

    },

    onGenesReplaced: function(oldGeneNames, newGeneNames) {
      let self = this;

      var removedGeneNames = oldGeneNames.filter(function(geneName) {
        return newGeneNames.indexOf(geneName) == -1;
      })

      removedGeneNames.forEach(function(geneName) {
        self.cohortModel.removeFlaggedVariantsForGene(geneName);
        self.clearFilter();
        self.cacheHelper.clearCacheForGene(geneName);
      })
      self.onSendGenesToClin();
    },

    onAnalyzeAll: function() {
      this.showLeftPanelForGenes();
      this.cacheHelper.analyzeAll(this.cohortModel);
    },
    onClearAllGenes: function() {
      this.clearFilter();
      this.selectedGene = {};
      this.geneModel.clearAllGenes();
      this.flaggedVariants = [];
      this.cohortModel.flaggedVariants = [];
    },
    onStartSearchGenes: function() {
      this.bringAttention = null;
    },
    promiseResetAllGenes: function() {
      let self = this;
      if (self.geneModel.sortedGeneNames == null || self.geneModel.sortedGeneNames.length == 0) {
        return Promise.resolve();
      } else {
        return new Promise(function(resolve, reject) {
          self.clearFilter();
          let geneToSelect   = $.extend(self.selectedGene);
          self.selectedGene = {};
          self.selectedTranscript = null;
          self.selectedVariant = null;
          self.selectedVariantRelationship = null;
          self.selectedVariantNotes = null;
          self.selectedVariantInterpretation = null;
          self.activeGeneVariantTab = "0";

          let genesToReapply = $.extend([], self.geneModel.sortedGeneNames);

          self.geneModel.clearAllGenes();
          self.flaggedVariants = [];
          self.cohortModel.flaggedVariants = [];

          self.applyGenesImpl(genesToReapply.join(","), {replace: true, warnOnDup: false, isFromClin: false},
          function() {
            self.selectedGene = geneToSelect;
            resolve();
          });
        })
      }
    },
    clearFilter: function() {
      if (this.$refs.genesCardRef) {
        this.$refs.genesCardRef.clearFilter();
      }
    },
    onApplyGenes: function(genesString, options, callback) {
      let self = this;

      self.clearFilter();

      let existingGeneCount = self.geneModel.sortedGeneNames.length;
      let existingPhenotypeTerm = self.phenotypeTerm;

      self.phenotypeTerm = options ? options.phenotypes : null;
      var theOptions = $.extend(
        {
          isFromClin: false,
          replace: self.geneModel.geneNames.length == 0 ? false : true,
          warnOnDup: false
        },
        options);


      let genesToApplyCount = self.geneModel.getCopyPasteGeneCount(genesString);

      let doIt = function() {
        let oldGeneNames = $.extend([], self.geneModel.sortedGeneNames);
        self.applyGenesImpl(genesString, options, function() {
          if (options && options.replace) {
            self.onGenesReplaced(oldGeneNames, self.geneModel.sortedGeneNames);
          }
          if (!options.isFromClin) {
            self.onSendGenesToClin();
          }
          if (callback) {
            callback();
          }
        })
        if (self.phenotypeTerm && self.phenotypeTerm.length > 0) {
          self.onShowSnackbar({message: "Adding genes associated with '" + self.phenotypeTerm + "'", timeout: 6000})
        }
      }

      if (self.phenotypeTerm && !options.isFromClin && existingGeneCount > 0 && existingPhenotypeTerm != self.phenotypeTerm) {
        let msg = "Replace existing genes with the " + genesToApplyCount + " genes associated with <br>'" + self.phenotypeTerm + "'?";
        alertify.confirm("",
          msg,
          function (e) {
            // ok
            options.replace = true;
            doIt();
          },
          function() {
            // cancel
            options.replace = false;
            doIt();
          }

        ).set('labels', {ok:'Replace gene list', cancel:'Combine genes with current list'});

      } else {
        doIt();
      }


    },
    applyGenesImpl: function(genesString, options, callback) {
      let self = this;
      self.selectedGene = {};
      self.geneModel.promiseCopyPasteGenes(genesString, options)
      .then(function() {
        if (!self.launchedFromClin) {
          self.setUrlGeneParameters();
        }
        if (self.geneModel.sortedGeneNames && self.geneModel.sortedGeneNames.length > 0) {
          let geneName = self.geneModel.sortedGeneNames[0];
          return self.promiseLoadGene(geneName);
        } else {
          return Promise.resolve();
        }
      })
      .then(function() {
        if (!self.launchedFromClin) {
          if (self.geneModel.sortedGeneNames && self.geneModel.sortedGeneNames.length > 0) {
            if (self.cohortModel && self.cohortModel.isLoaded && !self.isEduMode) {
              self.showLeftPanelForGenes();
              self.cacheHelper.analyzeAll(self.cohortModel, false);
              if (callback) {
                callback();
              }
            }
          }
        } else {
          if (callback) {
            callback();
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
      if (localStorage.getItem('hub-iobio-tkn') && localStorage.getItem('hub-iobio-tkn').length > 0 && self.paramSampleId && self.paramSource) {
        self.launchedFromHub = true;
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
        } else if (self.paramGeneName) {
          self.geneModel.promiseAddGeneName(self.paramGeneName);
          self.onGeneSelected(self.paramGeneName);
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
            self.launchedWithUrlParms = true;

          }
        }

        if (self.paramUnaffectedSibs && self.paramUnaffectedSibs.length > 0 && modelInfos.length > 0) {
          self.paramUnaffectedSibs.split(",").forEach(function(sibId) {
            var sibModelInfo = $.extend({}, modelInfos[0]);
            sibModelInfo.name = sibId;
            sibModelInfo.sample = sibId;
            sibModelInfo.relationship = 'sibling';
            sibModelInfo.affectedStatus = 'unaffected';
            sibModelInfo.bam = null;
            sibModelInfo.bai = null;
            modelInfos.push(sibModelInfo);
          })
        }
        if (self.paramAffectedSibs && self.paramAffectedSibs.length > 0 && modelInfos.length > 0) {
          self.paramAffectedSibs.split(",").forEach(function(sibId) {
            var sibModelInfo = $.extend({}, modelInfos[0]);
            sibModelInfo.name = sibId;
            sibModelInfo.sample = sibId;
            sibModelInfo.relationship = 'sibling';
            sibModelInfo.affectedStatus = 'affected';
            sibModelInfo.bam = null;
            sibModelInfo.bai = null;
            modelInfos.push(sibModelInfo);
          })
        }
        if (modelInfos.length > 0) {
          self.cohortModel.promiseInit(modelInfos)
          .then(function() {
            self.showLeftPanelForGenes();
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
      variant.isFlagged = true;
      variant.featureClass = "flagged";
      variant.gene = this.selectedGene;
      variant.transcript = this.selectedTranscript;
      self.cohortModel.addFlaggedVariant(self.selectedGene, self.selectedTranscript, variant);
      self.flaggedVariants = this.cohortModel.flaggedVariants;
      // Refresh the loaded variants so that the ranked variants table
      // reflects the flagged variants
      self.promiseLoadGene(self.selectedGene.gene_name)
      .then(function() {
        self.onCohortVariantClick(variant, self.$refs.variantCardRef[0], 'proband');
      })

      if (self.launchedFromClin) {
        self.sendFlaggedVariantToClin(variant);
      }
    },
    onRemoveFlaggedVariant: function(variant) {
      let self = this;
      variant.isFlagged = false;
      variant.featureClass = "";
      self.cohortModel.removeFlaggedVariant(self.selectedGene, self.selectedTranscript, variant);
      self.flaggedVariants = this.cohortModel.flaggedVariants;
      if (!self.isEduMode) {
        self.$refs.navRef.onShowFlaggedVariants();
      }
      // Refresh the loaded variants so that the ranked variants table
      // reflects the flagged variants
      self.promiseLoadGene(self.selectedGene.gene_name)
      .then(function() {
        self.onCohortVariantClick(variant, self.$refs.variantCardRef[0], 'proband');
      })

      if (self.launchedFromClin) {
        self.sendFlaggedVariantToClin(variant, 'delete');
      }

    },
    onAddFlaggedVariants: function(flaggedVariants) {
      let self = this;
      flaggedVariants.forEach(function(variant) {
        variant.gene = self.geneModel.geneObjects[variant.geneName];
        if (self.selectedGene && Object.keys(self.selectedGene).length > 0) {
          self.cohortModel.addFlaggedVariant(self.selectedGene, self.selectedTranscript, variant);
        }
      })
    },
    onRegisterFlaggedVariants: function(flaggedGeneNames, flaggedVariants, filterName) {
      let self = this;
      self.flaggedVariants = [];
      self.flaggedVariants = flaggedVariants;
      if (this.launchedFromClin && !this.isFullAnalysis) {
        self.sendAllFlaggedVariantsToClin(self.flaggedVariants);
      }

    },
    onFlaggedVariantsImported: function() {
      let self = this;
      self.flaggedVariants = [];
      self.flaggedVariants = this.cohortModel.flaggedVariants;

      let showFlaggedVariants = function() {
        if (self.$refs.genesCardRef) {
          self.$refs.genesCardRef.determineFlaggedGenes();
          self.$refs.genesCardRef.updateGeneBadgeCounts();
        }
        if (self.$refs.navRef && self.$refs.navRef.$refs.flaggedVariantsRef) {
          self.$refs.navRef.$refs.flaggedVariantsRef.populateGeneLists();
        }
      }

      showFlaggedVariants();


    },
    onApplyVariantNotes: function(variant) {
      let self = this;

      // Set the flagged variant notes and interpretation
      let flaggedVariant = this.cohortModel.getFlaggedVariant(variant);
      if (flaggedVariant) {
        if (self.$refs.navRef && self.$refs.navRef.$refs.flaggedVariantsRef) {
          self.$refs.navRef.$refs.flaggedVariantsRef.populateGeneLists();
        }
      }

      if (self.launchedFromClin) {
        self.sendFlaggedVariantToClin(variant);
      }
      if (variant == self.selectedVariant) {
        self.$set(self, "selectedVariantNotes", variant.notes);
      }

      let theTranscript = variant.transcript ? variant.transcript : self.geneModel.getCanonicalTranscript(variant.gene)
      self.cohortModel.setVariantInterpretation(variant.gene, theTranscript, variant);

    },
    onApplyVariantInterpretation: function(variant) {
      let self = this;

      if (self.launchedFromClin) {
        self.sendFlaggedVariantToClin(variant);
      }

      if (variant == self.selectedVariant) {
        self.$set(self, "selectedVariantInterpretation", variant.interpretation);
      }

      let theTranscript = variant.transcript ? variant.transcript : self.geneModel.getCanonicalTranscript(variant.gene)
      self.cohortModel.setVariantInterpretation(variant.gene, theTranscript, variant);

    },
    onFlaggedVariantSelected: function(flaggedVariant) {
      let self = this;


      let canonicalTranscript = self.geneModel.getCanonicalTranscript(flaggedVariant.gene);

      // Only select the gene if it hasn't previously been selected or the transcript is different
      let genePromise = null;
      if (self.selectedGene.gene_name == flaggedVariant.gene.gene_name) {
        genePromise = Promise.resolve();
      } else if (flaggedVariant.transcript == null
        && self.selectedTranscript
        && self.selectedTranscript.transcript_id == canonicalTranscript.transcript_id) {
        // No need to reselect the gene if the canonical transcript is already selected for the same gene
        genePromise = Promise.resolve();
      } else if (flaggedVariant.transcript
        && self.selectedTranscript.transcript_id == flaggedVariant.transcript.transcript_id) {
        // No need to reselect the gene if the same transcript on the same gene is already selecte
        genePromise = Promise.resolve();
      } else {
        self.selectedGene = flaggedVariant.gene;
        if (flaggedVariant.transcript) {
          self.selectedTranscript = flaggedVariant.transcript;
        } else {
          self.selectedTranscript = self.geneModel.getCanonicalTranscript(self.selectedGene);
        }
        self.selectedVariant = null;
        self.selectedVariantNotes = null;
        self.selectedVariantInterpretation = null;
        self.selectedVariantRelationship = null;
        genePromise = self.promiseLoadGene(self.selectedGene.gene_name, self.selectedTranscript);
      }

      genePromise
      .then(function() {

        setTimeout(
          function() {

            let matchingVariantPromise = null;
            self.calcFeatureMatrixWidthPercent();
            if (flaggedVariant.isProxy) {
              matchingVariantPromise = self.cohortModel.getProbandModel().promiseGetMatchingVariant(flaggedVariant, flaggedVariant.gene, flaggedVariant.transcript);
            } else {
              matchingVariantPromise = Promise.resolve(flaggedVariant);
            }


            matchingVariantPromise.then(function(matchingVariant) {

              self.showVariantExtraAnnots('proband', matchingVariant);

              if (flaggedVariant.isProxy) {
                var isUserFlagged = flaggedVariant.isUserFlagged;
                var notes = flaggedVariant.notes;
                var interpretation = flaggedVariant.interpretation;
                flaggedVariant = $.extend(flaggedVariant, matchingVariant);
                flaggedVariant.isFlagged = true;
                flaggedVariant.isUserFlagged = isUserFlagged;
                flaggedVariant.notes = notes;
                flaggedVariant.interpretation = interpretation;
                flaggedVariant.isProxy = false;
              }

              self.$set(self, "selectedVariant", flaggedVariant);
              self.$set(self, "selectedVariantNotes", flaggedVariant.notes);
              self.$set(self, "selectedVariantInterpretation", flaggedVariant.interpretation);
              self.$refs.variantCardRef.forEach(function(variantCard) {
                if (variantCard.relationship == 'proband') {
                  variantCard.showFlaggedVariant(flaggedVariant);
                }
              })

              if (!self.isBasicMode && self.$refs.featureMatrixCardRef) {
                self.$refs.featureMatrixCardRef.selectVariant(flaggedVariant);
              }


              self.$refs.variantCardRef.forEach(function(variantCard) {
                  variantCard.showVariantCircle(flaggedVariant, true);
                  variantCard.showCoverageCircle(flaggedVariant);
              })


              self.activeGeneVariantTab = self.isBasicMode ? "0" : "1";
              self.$refs.variantDetailCardRef.refreshGlyphs();

            })
          },
          500);

      });
    },
    onShowKnownVariantsCard: function(showIt) {
      let self = this;
      self.showKnownVariantsCard = showIt;
      if (self.showKnownVariantsCard) {
        self.onKnownVariantsVizChange();
      }
    },
    onFilterSelected: function(filterName, filteredGeneNames) {
      this.activeFilterName = filterName;
      this.filteredGeneNames = filteredGeneNames;
      if (filterName == 'coverage') {
        this.showLeftPanelForGenes();
        this.onGeneSelected(this.selectedGene.gene_name);
      }
    },
    onFilterSettingsApplied: function() {
      let self = this;
      self.cohortModel.cacheHelper.refreshGeneBadges(function() {
        if (self.$refs.genesCardRef) {
          self.$refs.genesCardRef.updateGeneBadgeCounts();
          self.$refs.genesCardRef.determineFlaggedGenes();
          self.cohortModel.flaggedVariants = self.flaggedVariants;
        }
        if (!self.isEduMode && self.cohortModel.flaggedVariants && self.cohortModel.flaggedVariants.length > 0) {
          self.$refs.navRef.onShowFlaggedVariants();
        }
        self.onGeneSelected(self.selectedGene.gene_name);

        if (self.launchedFromClin) {
          self.onSendFiltersToClin();
        }
      })
    },
    onLeftDrawer: function(isOpen) {
      if (!this.isEduMode) {
        this.isLeftDrawerOpen = isOpen;
      }
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


        var geneName = null;
        if (self.selectedGene && self.selectedGene.gene_name) {
          geneName = self.selectedGene.gene_name;
        }
        self.selectedGene = {};

        self.cohortModel.isLoaded = false;
        self.calcFeatureMatrixWidthPercent();
        self.cohortModel.promiseInitEduTour(tour, sampleIndex)
        .then(function() {
          self.models = self.cohortModel.sampleModels;

          if (geneName == null) {
            if (self.geneModel.sortedGeneNames && self.geneModel.sortedGeneNames.length > 0) {
              geneName = self.geneModel.sortedGeneNames[0];
            }
          }

          if (geneName) {
            self.promiseLoadGene(geneName)
            .then(function() {
              self.onGeneSelected(geneName);
              self.calcFeatureMatrixWidthPercent();
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
      let self = this;
      this.isBasicMode = false;
      this.featureMatrixModel.isBasicMode = false;
      this.filterModel.isBasicMode = false;
      this.calcFeatureMatrixWidthPercent();
      this.onFilesLoaded(true, function() {
        self.$router.push( { name: 'home', query: { mode: 'advanced', mygene2: self.forMyGene2 ? true : false} })
      });
    },
    onBasicMode: function() {
      let self = this;
      this.isBasicMode = true;
      this.featureMatrixModel.isBasicMode = true;
      this.filterModel.isBasicMode = true;
      this.calcFeatureMatrixWidthPercent();
      this.onFilesLoaded(true, function() {
        self.$router.push( { name: 'home', query: {mode: 'basic', mygene2: self.forMyGene2 ? true : false } })
      });
    },
    onStopAnalysis: function() {
      this.cohortModel.stopAnalysis();
      this.cacheHelper.stopAnalysis();
    },
    onShowSnackbar: function(snackbar) {
      if (snackbar && snackbar.message) {
        this.showSnackbar = true;

        this.snackbar = snackbar;

        if (this.snackbar.timeout == null) {
          this.snackbar.timeout = 6000;
        }
      }
    },
    onHideSnackbar: function() {
      this.showSnackbar = false;
    },

    onResize: function() {
      let self = this;
      self.mainContentWidth = $('main.content .container').outerWidth();
      self.calcFeatureMatrixWidthPercent();
      if (self.mainContentWidth > 905) {
        $('main.content .container').removeClass("small");
      } else {
        $('main.content .container').addClass("small");
      }

    },

    calcFeatureMatrixWidthPercent: function() {
      let self = this;
      if (self.cohortModel && self.cohortModel.isLoaded
          && self.featureMatrixModel && self.featureMatrixModel.rankedVariants) {
        self.mainContentWidth = $('main.content .container').outerWidth();
        if (self.isBasicMode) {
          self.featureMatrixWidthPercent = 0;
        }
        else if (self.isEduMode ) {
          self.featureMatrixWidthPercent = 50;
        } else {
          let minVariantDetailWidth = 50;
          if ($('#variant-detail').length > 0) {
            minVariantDetailWidth = +$('#variant-detail').css('min-width').split("px")[0];
          } else {
            minVariantDetailWidth = 652;
          }

          let minFeatureMatrixWidth = 0;
          if ($('#matrix-card').length > 0) {
            minFeatureMatrixWidth = +$('#matrix-card').css('min-width').split("px")[0];
          } else {
            minFeatureMatrixWidth = 300;
          }

          let fullFeatureMatrixWidth = 0;
          if ($('#feature-matrix-viz svg').length > 0) {
            fullFeatureMatrixWidth = +$('#feature-matrix-viz svg').outerWidth();
          }

          let width1 = minFeatureMatrixWidth;
          let width2 = minVariantDetailWidth;
          var remaining = +self.mainContentWidth - (minFeatureMatrixWidth + minVariantDetailWidth);
          if (remaining > 0) {
            var remaining = +self.mainContentWidth - (minFeatureMatrixWidth + minVariantDetailWidth);
            // If there are more ranked variants than min feature matrix width, give
            // remaining to feature matrix
            if (fullFeatureMatrixWidth > minFeatureMatrixWidth) {
              width1 = minFeatureMatrixWidth + remaining;
            } else {
              width2 = minVariantDetailWidth + remaining;
            }
          } else if (remaining < 0) {
            // If there isn't enough width for the min feature matrix width and variant card width,
            // make sure that feature matrix min is met;
            width1 = minFeatureMatrixWidth;
            width2 = +self.mainContentWidth - minFeatureMatrixWidth;
          }

          self.featureMatrixWidthPercent = Math.round((width1 / self.mainContentWidth) * 100);
        }
      } else {
        self.featureMatrixWidthPercent = 0;
      }

    },
    receiveClinMessage: function(event)
    {
      let self = this;
      // Do we trust the sender of this message?
      if (this.clinIobioUrls.indexOf(event.origin) == -1) {
        return;
      }
      this.clinIobioUrl = event.origin;
      this.launchedFromClin = true;

      var clinObject = JSON.parse(event.data);

      if (clinObject.type == 'apply-genes' && !self.isFullAnalysis) {
        let genesString = clinObject.genes && Array.isArray(clinObject.genes) ? clinObject.genes.join(" ") : "";
        let phenotypeTerms = clinObject.searchTerms && Array.isArray(clinObject.searchTerms) ? clinObject.searchTerms.join(",") : (clinObject.searchTerms ? clinObject.searchTerms : "");
        if (genesString.length > 0) {
          let options = { isFromClin: true, replace: true, warnOnDup: false, phenotypes: phenotypeTerms }
          this.onApplyGenes(genesString, options, function() {
            if (self.cohortModel.isLoaded) {
              self.showLeftPanelForGenes();
              self.cacheHelper.analyzeAll(self.cohortModel, false);
            }
          });
        }
      } else if (clinObject.type == 'set-data' && !self.isFullAnalysis) {
        if (self.cohortModel == null) {
          self.init(function() {
            self.setDataFromClin(clinObject);
          })
        } else {
          self.setDataFromClin(clinObject);
        }
      } else if (clinObject.type == 'set-data' && self.isFullAnalysis) {

        if (self.cohortModel == null) {
          self.init(function() {
            self.setDataFullAnalysisFromClin(clinObject);
          })
        } else {
          self.setDataFullAnalysisFromClin(clinObject);
        }

      } else if (clinObject.type == 'show-tooltip') {
        if (clinObject.task.key == 'genes-menu') {
          if (self.$refs.navRef && self.$refs.navRef.$refs.genesMenuRef) {
            self.$refs.navRef.$refs.genesMenuRef.showTooltip(clinObject.task.tooltip);
          }
        } else {
          if (self.$refs.genesCardRef && self.$refs.genesCardRef.$refs.filterBadgesRef) {
            self.$refs.genesCardRef.$refs.filterBadgesRef.showTooltip(clinObject.task.key, clinObject.task.tooltip);
          }
        }
      } else if (clinObject.type == 'hide-tooltip') {
        if (clinObject.task.key == 'genes-menu') {
          if (self.$refs.navRef && self.$refs.navRef.$refs.genesMenuRef) {
            self.$refs.navRef.$refs.genesMenuRef.hideTooltip();
          }
        } else {
          if (self.$refs.genesCardRef && self.$refs.genesCardRef.$refs.filterBadgesRef) {
            self.$refs.genesCardRef.$refs.filterBadgesRef.hideTooltip(clinObject.task.key);
          }
        }
      }


      var responseObject = {success: true, type: 'message-received', sender: 'gene.iobio.io'};
      window.parent.postMessage(JSON.stringify(responseObject), this.clinIobioUrl);
    },


    onSendGenesToClin: function() {
      let self = this;
      if (this.launchedFromClin && this.paramMode == null) {
        var msgObject = {
            success: true,
            type:   'apply-genes',
            app:    'gene',
            sender: 'gene.iobio.io',
            genes:   self.geneModel.sortedGeneNames};
        window.parent.postMessage(JSON.stringify(msgObject), self.clinIobioUrl);
      }
    },

    sendAllFlaggedVariantsToClin: function(variants, callback) {
      let self = this;
      if (this.launchedFromClin) {
        self.cohortModel.promiseExportFlaggedVariants('json', variants)
        .then(function(data) {
          var msgObject = {
              success:  true,
              type:     'save-variants',
              sender:   'gene.iobio.io',
              action:   'replace',
              app:      'gene',
              variants: data};
          window.parent.postMessage(JSON.stringify(msgObject), self.clinIobioUrl);

          if (callback) {
            callback();
          }
        })
        .catch(function(error) {
          alertify.alert("Error", error);
        })
      }

    },


    sendFlaggedVariantToClin: function(variant, action="update", callback) {
      let self = this;
      if (this.launchedFromClin) {
        self.cohortModel.promiseExportFlaggedVariant('json', variant)
        .then(function(data) {
          var msgObject = {
              success:  true,
              type:     'save-variants',
              sender:   'gene.iobio.io',
              action:   action,
              app:      self.isFullAnalysis ? 'genefull' : 'gene',
              variants: data};
          window.parent.postMessage(JSON.stringify(msgObject), self.clinIobioUrl);

          if (callback) {
            callback();
          }
        })
        .catch(function(error) {
          alertify.alert("Error", error);
        })
      }
    },

    sendNextImportedVariantToClin: function(importedVariants, callback) {
      let self = this;
      if (importedVariants.length >= 0) {
        var importedVariant = importedVariants.splice(0,1);
          self.cohortModel.promiseExportFlaggedVariant('json', importedVariant[0])
          .then(function(data) {
            var msgObject = {
                success:  true,
                type:     'save-variants',
                sender:   'gene.iobio.io',
                action:   'update',
                app:      self.isFullAnalysis ? 'genefull' : 'gene',
                variants: data};
            window.parent.postMessage(JSON.stringify(msgObject), self.clinIobioUrl);
            self.sendNextImportedVariantToClin(importedVariants, callback);
          })
          .catch(function() {
            console.log("Unable to send imported variant to clin ");
            console.log(importedVariant);
            self.sendNextImportedVariantToClin(importedVariants, callback);
          })
      } else {
        if (callback) {
          callback();
        }
      }
    },

    onSendFiltersToClin: function() {
      let self = this;
      if (this.launchedFromClin && !this.isFullAnalysis) {
        var msgObject = {
          success: true,
          type: 'save-filters',
          sender: 'gene.iobio.io',
          filters: self.filterModel.flagCriteria
        };
        window.parent.postMessage(JSON.stringify(msgObject), self.clinIobioUrl);
      }
    },

    sendCacheToClin: function(geneName) {
      let self = this;
      if (this.launchedFromClin) {

        self.cacheHelper.promiseGetClinCacheItems(geneName, ['vcfData', 'dangerSummary', 'geneCoverage'])
        .then(function(cacheItems) {
          var msgObject = {
            'success':       true,
            'type':          'save-cache',
            'sender':        'gene.iobio.io',
            'app':           self.isFullAnalysis ? 'genefull' : 'gene',
            'cache':         cacheItems
          };
          window.parent.postMessage(JSON.stringify(msgObject), self.clinIobioUrl);
        })
        .catch(function(error) {
          var msg = "An error occurred in sendCacheToClin: " + error;
          console.log(msg);
        });

      }
    },

    promiseSetCacheFromClin: function(clinObject) {
      let self = this;

      return new Promise(function(resolve, reject) {
        self.onShowSnackbar({message: 'Setting analysis cache...', timeout: 5000})
        let cachePromises = [];
        let summarizePromises = [];
        let genesToAdd = [];

        if (clinObject.cache && clinObject.cache.length > 0) {
          console.log(" **** number of cache items from clin **** " + clinObject.cache.length);
          clinObject.cache.forEach(function(cacheItem) {
            let newCacheKey = cacheHelper.convertClinCacheKey(cacheItem.cache_key);
            let p = self.cacheHelper.promiseCacheData(newCacheKey, cacheItem.cache, {compress: false})
            .then(function(theKey) {
              let theKeyObject = CacheHelper._parseCacheKey(theKey);

              if (theKeyObject.dataKind == 'dangerSummary') {

                var dp = self.cacheHelper.promiseGetData(theKey)
                .then(function(data) {
                  self.geneModel.setDangerSummary(data.geneName.toUpperCase(), data);
                  genesToAdd.push(data.geneName);
                })
                summarizePromises.push(dp);
              }
            })
            cachePromises.push(p);
          })
        } else {
          cachePromises.push(Promise.resolve());
        }

        Promise.all(cachePromises)
        .then(function() {
          return Promise.all(summarizePromises)
        })
        .then(function() {
          self.onShowSnackbar({message: 'Getting gene info...', timeout: 5000})
          return self.geneModel.promiseCopyPasteGenes(genesToAdd.join(","), {replace: true, warnOnDup: false});
        })
        .then(function() {
          console.log("gene summaries " + Object.keys(self.geneModel.geneDangerSummaries).length );
          resolve();
        })
        .catch(function(error) {
          let msg = "Problem in GeneHome.promiseSetCacheFromClin(): " + error;
          reject();
        })

      })

    },

    setDataFromClin: function(clinObject) {
      let self = this;
      self.cohortModel.promiseInit(clinObject.modelInfos)
      .then(function() {
        self.models = self.cohortModel.sampleModels;

        return self.promiseSetCacheFromClin(clinObject)

      })
      .then(function() {

        self.onApplyGenes(
            clinObject.genes.join(" "),
            {isFromClin: true, replace: true, warnOnDup: false, phenotypes: clinObject.phenotypes.join(",")},
        function() {
          self.cohortModel.importFlaggedVariants('json', clinObject.variants,
          function() {
            // When all variants have been imported
            self.onFlaggedVariantsImported();
            self.$refs.navRef.onShowFlaggedVariants();


          },
          function() {
            // When analyzeSubset and variants have been cached
            self.$refs.navRef.onShowFlaggedVariants();
            self.cacheHelper.analyzeAll(self.cohortModel, false);
          })
        });

      })
      .catch(function(error) {
        console.log(error);
      })

    },

    setDataFullAnalysisFromClin: function(clinObject) {
      let self = this;
      self.cohortModel.promiseInit(clinObject.modelInfos)
      .then(function() {
        self.models = self.cohortModel.sampleModels;
        return self.promiseSetCacheFromClin(clinObject);
      })
      .then(function() {
        let variantData = null;
        let fileType = null;
        if (clinObject.variants && clinObject.variants.length > 0) {
          fileType = 'json';
          variantData = clinObject.variants;
          self.onShowSnackbar({message: 'Importing variants from full analysis..', timeout: 7000})
        } else {
          fileType = 'gemini';
          variantData = clinObject.variantData;
          self.onShowSnackbar({message: 'Importing records from full analysis..', timeout: 7000})
        }

        self.cohortModel.importFlaggedVariants(fileType, variantData,
        function() {
          if (fileType == 'gemini') {
            self.sendNextImportedVariantToClin(self.cohortModel.flaggedVariants, function() {
              self.onShowSnackbar({message: 'Saving imported variants to clin..', timeout: 7000})
            });

          } else if (fileType == 'json') {
            self.onFlaggedVariantsImported();
            self.$refs.navRef.onShowFlaggedVariants();
          }
        },
        function() {
          self.onShowSnackbar({message:  self.cohortModel.flaggedVariants.length + ' variants imported.', timeout: 3000})
          self.onFlaggedVariantsImported();
          if (fileType != 'json') {
            self.$refs.navRef.onShowFlaggedVariants();
          }
        })
      })
      .catch(function(error) {
        console.log(error);
      })

    }



  }
}
</script>
