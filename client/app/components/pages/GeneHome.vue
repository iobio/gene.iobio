/*
 * GeneHome.vue
 *
 */
<style lang="sass">

@import ../../../assets/sass/variables



main.content, main.v-content
  margin-top: 52px

  #gene-card-container
    margin-top: 10px
    margin-bottom: 10px
    padding-bottom: 10px

main.content.clin, main.v-content.clin
  margin-top: 0px


.app-card
  margin-bottom: 10px

.full-width
  max-width: -moz-available !important
  max-width: -webkit-fill-available !important

#data-sources-loader, #session-data-loader
  margin-top: 30px
  margin-left: auto
  margin-right: auto
  text-align: center
  width: 400px
  height: 95px
  padding-top: 15px
  padding-bottom: 15px



.tabs__container
  height: 31px !important
  margin-left: 0px

  .tabs__item
    color: $app-color
    font-size: 15px

  .tabs__item--active
    color:  $app-color


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

#pileup-container
  margin: 0px
  padding-top: 0px
  padding-bottom: 0px
  width: calc(100% - 10px)
  margin-left: -10px

  .card
    margin: 0px
    padding: 0px
    -webkit-box-shadow: none !important
    box-shadow: none !important

    .layout.row
      margin-left: 20px
      margin-right: 20px

    .igv-root-div
      margin-left: -10px

    .igv-right-hand-gutter
      right: -10px
      left: initial

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
      :filteredGeneNames="filteredGeneNames"
      :activeFilterName="activeFilterName"
      :launchedFromClin="launchedFromClin"
      :isClinFrameVisible="isClinFrameVisible"
      :isFullAnalysis="isFullAnalysis"
      :isLoaded="cohortModel && cohortModel.isLoaded"
      :hasAlignments="cohortModel && cohortModel.isLoaded && cohortModel.hasAlignments()"
      :bringAttention="bringAttention"
      :phenotypeLookupUrl="phenotypeLookupUrl"
      :lastPhenotypeTermEntered="phenotypeTerm"
      :geneNames="geneModel.sortedGeneNames"
      :genesInProgress="cohortModel.genesInProgress"
      :interpretationMap="interpretationMap"
      :toClickVariant="toClickVariant"
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
      @analyze-coding-variants-only="onAnalyzeCodingVariantsOnly"
      @show-known-variants="onShowKnownVariantsCard"
      @show-filters="onShowFilters"
    >
    </navigation>


    <v-content  :class="launchedFromClin ? 'clin' : '' ">
      <v-container fluid>


        <modal name="pileup-modal"
            width="50%"
            height="540"
            >

          <v-card class='full-width' style="overflow-y:auto;height:height:-moz-available;height:100%">
            <pileup id="pileup-container"
              :heading="pileupInfo.title"
              :referenceURL="pileupInfo.referenceURL"
              :tracks="pileupInfo.tracks"
              :locus="pileupInfo.coord"
              :visible="pileupInfo.show"
              :showLabels=true
            />
          </v-card>

        </modal>


        <intro-card v-if="forMyGene2"
        class="full-width"
        :closeIntro="closeIntro"
        :isBasicMode="isBasicMode"
        :siteConfig="siteConfig"
        :defaultingToDemoData="cohortModel ? cohortModel.defaultingToDemoData : false"
        @on-advanced-mode="onAdvancedMode"
        @on-basic-mode="onBasicMode">
        </intro-card>





        <genes-card
         style="margin-bottom:10px"
         v-if="geneModel"
         v-show="false && filterModel && (!launchedFromClin && !isFullAnalysis)"
         v-bind:class="{hide : (showWelcome && !isEduMode), 'full-width': true}"
         ref="genesCardRef"
         :isEduMode="isEduMode"
         :isBasicMode="isBasicMode"
         :isFullAnalysis="isFullAnalysis"
         :launchedFromClin="launchedFromClin"
         :launchedFromHub="launchedFromHub"
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
         :phenotypeLookupUrl="phenotypeLookupUrl"
         :showSfariTrackToggle="cohortModel && cohortModel.isSfariProject"
         @gene-selected="onGeneClicked"
         @remove-gene="onRemoveGene"
         @analyze-all="onAnalyzeAll"
         @call-variants="callVariants"
         @sort-genes="onSortGenes"
         @filter-selected="onFilterSelected"
         @filter-settings-applied="onFilterSettingsApplied"
         @filter-settings-closed="onFilterSettingsClose"
         @apply-genes="onApplyGenes"
         @stop-analysis="onStopAnalysis"
         @show-known-variants="onShowKnownVariantsCard"
         @show-sfari-variants="onShowSfariVariantsCard"
         @on-insufficient-coverage="onInsufficientCoverage">
        </genes-card>


        <gene-variants-card
          v-bind:class="{hide : showWelcome, 'full-width': true}"
          v-if="cohortModel && cohortModel.isLoaded && selectedGene && Object.keys(selectedGene).length > 0"
          :selectedGene="selectedGene"
          :selectedTranscript="analyzedTranscript"
          :genomeBuildHelper="genomeBuildHelper"
          :cohortModel="cohortModel"
          :isEduMode="isEduMode"
          :isBasicMode="isBasicMode"
          :isFullAnalysis="isFullAnalysis"
          :launchedFromClin="launchedFromClin"
          :launchedFromHub="launchedFromHub"
          :showSfariTrackToggle="cohortModel && cohortModel.isSfariProject"
          :isLoaded="cohortModel && cohortModel.isLoaded"
          @transcript-selected="onTranscriptSelected"
          @gene-source-selected="onGeneSourceSelected"
          @gene-region-buffer-change="onGeneRegionBufferChange"
          @show-known-variants="onShowKnownVariantsCard"
          @show-sfari-variants="onShowSfariVariantsCard">
        </gene-variants-card>


        <variant-inspect-card
        ref="variantInspectRef"
        v-if="cohortModel && cohortModel.isLoaded && selectedGene && Object.keys(selectedGene).length > 0"
        v-show="selectedVariant"
        :selectedGene="selectedGene"
        :selectedTranscript="analyzedTranscript"
        :selectedVariant="selectedVariant"
        :selectedVariantNotes="selectedVariantNotes"
        :selectedVariantInterpretation="selectedVariantInterpretation"
        :selectedVariantRelationship="selectedVariantRelationship"
        :interpretationMap="interpretationMap"
        :genomeBuildHelper="genomeBuildHelper"
        :cohortModel="cohortModel"
        :info="selectedVariantInfo"
        :selectedVariantKey="selectedVariantKey"
        :showGenePhenotypes="launchedFromClin || phenotypeTerm"
        :coverageDangerRegions="cohortModel.getProbandModel().coverageDangerRegions"
        @show-pileup-for-variant="onShowPileupForVariant"
        @apply-variant-interpretation="onApplyVariantInterpretation"
        @apply-variant-notes="onApplyVariantNotes"
        >
        </variant-inspect-card>




        <welcome
         class="full-width"
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
        class="loader full-width"
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
        { 'full-width': true, 'hide': showWelcome || Object.keys(selectedGene).length === 0 || !cohortModel  || cohortModel.inProgress.loadingDataSources
          || (model.relationship === 'known-variants' && showKnownVariantsCard === false) || (model.relationship === 'sfari-variants' && showSfariVariantsCard === false),
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
        :classifyVariantSymbolFunc="model.relationship === 'known-variants' ? model.classifyByClinvar : model.classifyByImpact"
        :variantTooltip="variantTooltip"
        :selectedGene="selectedGene"
        :selectedTranscript="analyzedTranscript"
        :selectedVariant="selectedVariant"
        :regionStart="geneRegionStart"
        :regionEnd="geneRegionEnd"
        :featureMatrixModel="featureMatrixModel"
        :width="cardWidth"
        :showGeneViz="true"
        :showDepthViz="model.relationship !== 'known-variants' && model.relationship !== 'sfari-variants'"
        :showVariantViz="(model.relationship !== 'known-variants' || showKnownVariantsCard) || (model.relationship !== 'sfari-variants' || showSfariVariantsCard)"
        :geneVizShowXAxis="model.relationship === 'proband' || model.relationship === 'known-variants' || model.relationship === 'sfari-variants'"
        :blacklistedGeneSelected="blacklistedGeneSelected"
        @cohort-variant-click="onCohortVariantClick"
        @cohort-variant-outside-click="onCohortVariantOutsideClick"
        @cohort-variant-hover="onCohortVariantHover"
        @cohort-variant-hover-end="onCohortVariantHoverEnd"
        @known-variants-viz-change="onKnownVariantsVizChange"
        @known-variants-filter-change="onKnownVariantsFilterChange"
        @sfari-variants-viz-change="onSfariVariantsVizChange"
        @sfari-variants-filter-change="onSfariVariantsFilterChange"
        @gene-region-zoom="onGeneRegionZoom"
        @gene-region-zoom-reset="onGeneRegionZoomReset"
        @show-coverage-cutoffs="showCoverageCutoffs = true;showFilters = true"
        @show-pileup-for-variant="onShowPileupForVariant"
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
            <v-icon>close</v-icon>
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

    <save-button
      v-if="launchedFromHub && !launchedFromSFARI"
      :showing-save-modal="showSaveModal"
      @save-modal:set-visibility="toggleSaveModal"
    />
    <save-analysis-popup
     :showIt="showSaveModal"
     :analysis="analysis"
     @on-save-analysis="promiseSaveAnalysis"
     @on-cancel-analysis="onCancelAnalysis">
    </save-analysis-popup>


    <v-dialog v-model="showFilters" persistent max-width="650">
      <filter-card
       ref="filterCardRef"
       v-if="geneModel"
       :geneModel="geneModel"
       :isFullAnalysis="isFullAnalysis"
       :launchedFromClin="launchedFromClin"
       :geneNames="geneModel.sortedGeneNames"
       :loadedDangerSummaries="Object.keys(geneModel.geneDangerSummaries)"
       :isLoaded="cohortModel && cohortModel.isLoaded"
       :hasAlignments="cohortModel && cohortModel.isLoaded && cohortModel.hasAlignments()"
       :filterModel="cohortModel.filterModel"
       :showCoverageCutoffs="showCoverageCutoffs"
       @filter-settings-applied="onFilterSettingsApplied"
       @filter-settings-closed="onFilterSettingsClose">
     </filter-card>


    </v-dialog>

  </div>

</template>


<script>


import Navigation         from  '../viz/Navigation.vue'
import EduTourBanner      from  '../viz/EduTourBanner.vue'
import Welcome            from  '../viz/Welcome.vue'
import IntroCard          from  '../viz/IntroCard.vue'
import GeneCard           from  '../viz/GeneCard.vue'
import VariantInspectCard  from  '../viz/VariantInspectCard.vue'
import GenesCard          from  '../viz/GenesCard.vue'
import FilterCard          from '../viz/FilterCard.vue'
import GeneVariantsCard   from  '../viz/GeneVariantsCard.vue'
import FeatureMatrixCard  from  '../viz/FeatureMatrixCard.vue'
import VariantCard        from  '../viz/VariantCard.vue'
import AppTour            from  '../viz/AppTour.vue'

import HubSession         from  '../../models/HubSession.js'
import HubSessionDeprecated from  '../../models/HubSessionDeprecated.js'
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
import acmgBlacklist from '../../../data/ACMG_blacklist.json'
import SplitPane          from '../partials/SplitPane.vue'
import ScrollButton       from '../partials/ScrollButton.vue'

import SaveButton  from '../partials/SaveButton.vue'
import SaveAnalysisPopup  from '../partials/SaveAnalysisPopup.vue'

import VuePileup          from 'vue-pileup'



export default {
  name: 'home',
  components: {
      EduTourBanner,
      Navigation,
      IntroCard,
      Welcome,
      GenesCard,
      GeneCard,
      GeneVariantsCard,
      ScrollButton,
      VariantInspectCard,
      FeatureMatrixCard,
      VariantCard,
      SplitPane,
      AppTour,
      SaveButton,
      SaveAnalysisPopup,
      pileup: VuePileup,
      FilterCard
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
    paramSampleUuid:       null,
    paramIsPedigree:       null,
    paramSource:           null,
    paramIobioSource:      null,
    paramAnalysisId:       null,

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
    let self = this;
    return {
      greeting: 'gene.iobio',

      launchedFromClin:   false,
      isFullAnalysis:     false,
      isClinFrameVisible: false,

      launchedFromHub: false,
      launchedFromSFARI: false,
      isHubDeprecated: false,
      sampleId: null,
      projectId: null,
      launchedWithUrlParms: false,
      clinSetData: null,
      clinPersistCache: true,
      analysis: null,
      showSaveModal: false,
      showFilters: false,

      hubToIobioSources: {
        "https://mosaic.chpc.utah.edu":          {iobio: "mosaic.chpc.utah.edu", batchSize: 10},
        "https://mosaic-dev.genetics.utah.edu":  {iobio: "mosaic.chpc.utah.edu", batchSize: 10},
        "http://mosaic-dev.genetics.utah.edu":   {iobio: "mosaic.chpc.utah.edu", batchSize: 10},
        "https://staging.frameshift.io":         {iobio: "nv-prod.iobio.io",     batchSize: 10}
      },

      sfariSource:  "https://viewer.sfari.org",


      interpretationMap: {
        'sig': 'Significant',
        'unknown-sig': 'Unknown significance',
        'not-sig': 'Not significant',
        'poor-qual': 'Poor quality',
        'not-reviewed': 'Not reviewed'
      },


      allGenes: allGenesData,
      acmgBlacklist: acmgBlacklist,
      blacklistedGeneSelected: false,

      selectedGene: {},
      selectedTranscript: {},
      analyzedTranscript: {},
      geneRegionStart: null,
      geneRegionEnd: null,

      genesInProgress: {},

      activeFilterName: null,
      filteredGeneNames: null,

      modelInfos: null,
      rawPedigree: null,

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
      selectedVariantKey: null,
      selectedVariantNotes: null,
      selectedVariantInterpretation: null,
      selectedVariantRelationship: null,
      toClickVariant: null,

      showKnownVariantsCard: false,
      showSfariVariantsCard: false,

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

      clinIobioUrls: ["http://localhost:4030", "http://tony.iobio.io:4030", "http://clin.iobio.io", "https://clin.iobio.io", "https://dev.clin.iobio.io", "http://dev.clin.iobio.io"],
      clinIobioUrl: null,

      forceLocalStorage: null,

      phenotypeLookupUrl: null,

      pileupInfo: {
        // This controls how many base pairs are displayed on either side of
        // the center of the locus.
        SPAN: 200,
        // These are the reference URLs for the human genome builds currently supported
        referenceURLs: {
          'GRCh37': 'https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/hg19/hg19.fasta',
          'GRCh38': 'https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/hg38/hg38.fa'
        },

        // Show the pileup dialog
        show: false,
        // Title in the pileup dialog
        title: 'Pileup View',
        // The bam file
        alignmentURL: null,
        alignmentIndexURL: null,
        // The vcf file
        // TODO: update this dynamically
        variantURL: null,
        variantIndexURL: null,
        // The reference URL (for the current genome build)
        referenceURL: 'https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/hg19/hg19.fasta',


      }
    }
  },

  created: function() {
    let self = this;
    if (self.paramLaunchedFromClin) {
      self.launchedFromClin = true;
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

        self.geneModel.on("geneDangerSummarized", function(dangerSummary) {
          self.geneModel.promiseGetCachedGeneObject(dangerSummary.geneName)
          .then(function(theGeneObject) {
            self.cohortModel.captureFlaggedVariants(dangerSummary, theGeneObject)
            if (self.$refs.navRef && self.$refs.navRef.$refs.flaggedVariantsRef) {
              self.$refs.navRef.$refs.flaggedVariantsRef.populateGeneLists()
            }
          })
        })

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
              self.promiseInitFromMosaic()
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

    promiseInitFromMosaic: function() {
      let self = this;
      return new Promise(function(resolve, reject) {
        self.hubSession = self.isHubDeprecated ? new HubSessionDeprecated() : new HubSession();
        let isPedigree = self.paramIsPedigree && self.paramIsPedigree == 'true' ? true : false;

        // Workaround until launch from Mosaic analysis can pass in is_pedigree
        if (self.paramAnalysisId && self.paramAnalysisId.length > 0 && !isPedigree) {
          isPedigree = true;
        }

        self.cohortModel.setHubSession(self.hubSession);
        self.hubSession.promiseInit(self.sampleId, self.paramSource, isPedigree, self.projectId)
        .then(data => {
          self.modelInfos = data.modelInfos;
          self.rawPedigree = data.rawPedigree;

          return self.promiseGetAnalysis(self.projectId, self.paramAnalysisId)
        })
        .then(analysis => {

          if (self.analysis.payload.phenotypeTerm) {
            self.phenotypeTerm = self.analysis.payload.phenotypeTerm
          }
            return self.hubSession.promiseGetProject(self.projectId)
        })
        .then(projObj => {
            self.isSfariProject = false;
            // Note: going off of names per CM for now until we can get a Sfari project db flag
            if (projObj && projObj.name === 'SSC GRCh37 WGS' || projObj.name === 'SSC GRCh38 WGS') {
              self.isSfariProject = true;
            } else if (projObj.name === 'SSC GRCh37 WES') {

                isSfariProject = true;
            }
            return self.cohortModel.promiseInit(self.modelInfos, self.projectId, isSfariProject)
        })
        .then(function() {
          self.models = self.cohortModel.sampleModels;
          var genePromises = []
          if (self.analysis.payload.genes && self.analysis.payload.genes.length > 0) {
            self.analysis.payload.genes.forEach(function(geneName) {
              genePromises.push( self.geneModel.promiseAddGeneName(geneName) );
            })
            return Promise.all(genePromises);
          } else {
            return Promise.resolve();
          }
        })
        .then(function() {

          if (self.analysis.payload.variants && self.analysis.payload.variants.length > 0 ) {
            self.cohortModel.promiseMergeImportedVariants(self.analysis.payload.variants)
            .then(function() {
              self.promiseSelectFirstFlaggedVariant()
              .then(function() {
                self.$refs.navRef.onShowVariantsTab();
                self.cacheHelper.analyzeAll(self.cohortModel);
                resolve();
              })

            })
          } else {

            if (self.geneModel.geneNames.length > 0) {
              let transcript = self.geneModel.getCanonicalTranscript(self.geneModel.geneNames[0]);
              self.promiseLoadGene(self.geneModel.geneNames[0], transcript)
              .then(function() {
                self.showLeftPanelForGenes();
                self.cacheHelper.analyzeAll(self.cohortModel);
                resolve();
              })
            } else {
              self.onShowSnackbar( {message: 'Enter a gene name or enter a phenotype term.', timeout: 5000});
              self.bringAttention = 'gene';
              resolve();
            }
          }
        })
        .catch(function(error) {
          reject(error);
        })

      })
    },

    promiseInitCache: function() {
      let self = this;
      return new Promise(function(resolve, reject) {
        self.cacheHelper = new CacheHelper(self.globalApp, self.forceLocalStorage);
        window.cacheHelper = self.cacheHelper;
        self.cacheHelper.on("geneAnalyzed", function(theGene, transcript) {


          if (self.launchedFromClin || self.launchedFromHub) {
            let flaggedVariantsForGene = self.cohortModel.getFlaggedVariantsForGene(theGene.gene_name);
            if (flaggedVariantsForGene.length > 0) {
              flaggedVariantsForGene.forEach(function(flaggedVariant) {
                if (self.launchedFromClin) {
                  self.sendFlaggedVariantToClin(flaggedVariant);
                } else if (self.launchedFromHub) {
                  self.promiseUpdateAnalysisVariant(flaggedVariant);
                }
              })
            }
            if (self.launchedFromClin) {
              self.sendCacheToClin(theGene.gene_name);
            }
          }

          if (self.selectedGene && self.selectedGene.hasOwnProperty("gene_name")
              && theGene.gene_name == self.selectedGene.gene_name) {
            self.promiseLoadData();
          }

        });
        self.cacheHelper.on("analyzeAllCompleted", function() {

          if (!self.isEduMode) {
            if (self.activeFilterName && self.activeFilterName == 'coverage' && self.launchedFromClin) {
              if (self.$refs.genesCardRef && self.$refs.genesCardRef.$refs.filterBadgesRef) {
                  self.$refs.genesCardRef.$refs.filterBadgesRef.onBadgeClick({name: 'coverage', display: 'Insufficient coverage'});
              }
              self.showLeftPanelForGenes();
            } else if (self.cacheHelper.analyzeAllInProgress) {
              self.showLeftPanelForGenes();
            } else {
              self.promiseSelectFirstFlaggedVariant()
              .then(function() {
                self.$refs.navRef.onShowVariantsTab();
              })

            }
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
      self.cohortModel.clearFlaggedVariants();

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
      var target = window.document.URL.indexOf("dev.gene.iobio") > 0 || window.document.URL.indexOf("localhost") > 0 ? 'dev' : 'prod';

      return new Promise(function(resolve, reject) {

        $.ajax({
            url: self.globalApp.siteConfigUrl[target],
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

        if (self.models && self.models.length > 0 && !(self.cohortModel.isSfariProject && self.blacklistedGeneSelected)) {
            self.cardWidth = $('#genes-card').innerWidth();
            var options = {'getKnownVariants': self.showKnownVariantsCard,
                'getSfariVariants': (self.showSfariVariantsCard && !self.blacklistedGeneSelected),
                'blacklistedGeneSelected': self.blacklistedGeneSelected };

            self.cohortModel.promiseLoadData(self.selectedGene, self.selectedTranscript, options)
                .then(function(resultMap) {
                    self.calcFeatureMatrixWidthPercent();

                    self.filterModel.populateEffectFilters(resultMap);
                    self.filterModel.populateRecFilters(resultMap);

                    self.cohortModel.promiseMarkCodingRegions(self.selectedGene, self.selectedTranscript)
                        .then(function(data) {
                            self.analyzedTranscript = data.transcript;
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
        self.promiseLoadData()
        .then(function() {
          return self.cohortModel.promiseJointCallVariants(self.selectedGene,
            self.selectedTranscript,
            self.cohortModel.getCurrentTrioVcfData(),
            {checkCache: false, isBackground: false})
        })

      }
    },

    onFilesLoaded: function(analyzeAll, callback) {
      let self = this;

      self.showWelcome = false;
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
      self.activeGeneVariantTab = "0";
      self.showLeftPanelForGenes();
      self.promiseLoadGene(geneName)
      .then(function() {
        self.showLeftPanelForGenes();
        self.onSendGenesToClin();
        self.setUrlGeneParameters();

      })
    },

    onGeneClicked: function(geneName) {
      var self = this;

      self.deselectVariant();

      self.promiseLoadGene(geneName)
      .then(function() {
        self.setUrlGeneParameters();
      })
      self.activeGeneVariantTab = "0";

    },

    onGeneSelected: function(geneName) {
      var self = this;
      self.deselectVariant();
      self.promiseLoadGene(geneName);
      self.activeGeneVariantTab = "0";
    },

    showLeftPanelWhenFlaggedVariantsForGene: function() {
      let self = this;
      if (self.cohortModel.flaggedVariants && self.cohortModel.flaggedVariants.length > 0) {
        let matchingVariants = self.cohortModel.getFlaggedVariantsForGene(self.selectedGene.gene_name);
        if (!self.isEduMode && matchingVariants.length > 0 && !self.isLeftDrawerOpen) {
          if (self.$refs.navRef) {
            self.$nextTick(function() {
              self.$refs.navRef.onShowVariantsTab();
            });
          }
        } else if (!self.isEduMode && matchingVariants.length > 0) {
          self.$nextTick(function() {
            self.$refs.navRef.activeTab = 1;
          })
        }
      }
    },

    showLeftPanelWhenFlaggedVariants: function() {
      let self = this;
      if (!self.isEduMode && self.cohortModel.flaggedVariants && self.cohortModel.flaggedVariants.length > 0 && !self.isLeftDrawerOpen) {
        if (self.$refs.navRef) {
          self.$nextTick(function() {
            self.$refs.navRef.onShowVariantsTab();
          });
        }
      } else if (!self.isEduMode && self.cohortModel.flaggedVariants && self.cohortModel.flaggedVariants.length > 0) {
        self.$nextTick(function() {
          self.$refs.navRef.activeTab = 1;
        })
      }
    },

    showLeftPanelForGenes: function() {
      let self = this;
      if (self.geneModel && self.geneModel.sortedGeneNames.length > 0) {
        if (self.$refs.navRef) {
          if (!self.isLeftDrawerOpen) {
            self.$nextTick(function() {
              self.$refs.navRef.onShowGenesTab();
            });
          } else if (self.$refs.navRef) {
            self.$nextTick(function() {
              self.$refs.navRef.activeTab = 0;
            })
          }
        }
      }

    },

    promiseLoadGene: function(geneName, theTranscript) {
      let self = this;

      this.showWelcome = false;

      if (self.acmgBlacklist[geneName] != null) {
        self.blacklistedGeneSelected = true;
      } else {
          self.blacklistedGeneSelected = false;
      }

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
        .then(function(justAdded) {
          if (justAdded && self.launchedFromHub) {
            return self.promiseUpdateAnalysisGenesData();
          } else {
            return Promise.resolve();
          }
        })
        .then(function() {
          return self.geneModel.promiseGetGeneObject(geneName)
        }).then(function(theGeneObject) {

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

        if (self.selectedGene) {
          self.geneModel.adjustGeneRegion(self.selectedGene);
          self.geneRegionStart = self.selectedGene.start;
          self.geneRegionEnd   = self.selectedGene.end;
        }

        self.calcFeatureMatrixWidthPercent();
        self.$set(self, selectedVariant, variant);
        self.$set(self, selectedVariantKey, self.getVariantKey(self.selectedVariant));
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
    getVariantKey(variant) {
      if (variant) {
        return  {'chrom': variant.chrom, 'start': variant.start, 'ref': variant.ref, 'alt': variant.alt};
      } else {
        return null;
      }
    },
    onCohortVariantOutsideClick(sourceComponent, sourceRelationship) {
      if (sourceRelationship == 'proband') {
        self.deselectedVariant();
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
      self.selectedVariantKey = null;
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
        if (relationship === 'known-variants') {
          self.cohortModel
              .getModel(relationship)
              .promiseGetVariantExtraAnnotations(self.selectedGene, self.selectedTranscript, self.selectedVariant)
              .then( function(refreshedVariant) {
                self.refreshVariantExtraAnnots(variant, [refreshedVariant]);
              })
        } else if (relationship !== 'sfari-variants'){
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
                  .promiseGetVariantExtraAnnotations(self.selectedGene, self.selectedTranscript, variant)
                  .then( function(refreshedVariant) {
                    self.refreshVariantExtraAnnots(variant, [refreshedVariant]);
                  })
              })
            });
        }
      }
    },

    refreshVariantExtraAnnots: function(variant, annotatedVariants, callbackNotFoundOrAnnotated) {
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

        if (annotatedVariant.extraAnnot) {
          variant.extraAnnot      = true;
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
            'vepAf',
            'highestImpactVep',
            'highestSIFT',
            'highestPolyphen',
            'gnomAD'
            ];
          extraAnnotFields.forEach(function(field) {
            variant[field]        = annotatedVariant[field];
          })
        } else {
          if (callbackNotFoundOrAnnotated) {
            callbackNotFoundOrAnnotated();
          }
        }


      } else {
        if (callbackNotFoundOrAnnotated) {
          callbackNotFoundOrAnnotated();
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
    onSfariVariantsVizChange: function(viz) {
        let self = this;
        if (viz) {
            self.cohortModel.sfariVariantsViz = viz;
        }
        if (self.showSfariVariantsCard && self.cohortModel && self.cohortModel.isLoaded && Object.keys(self.selectedGene).length > 0
            && self.acmgBlacklist[self.selectedGene.gene_name] == null) {
            self.cohortModel.promiseLoadSfariVariants(self.selectedGene, self.selectedTranscript);
        }
    },
    onKnownVariantsFilterChange: function(selectedCategories) {
      let self = this;
      self.filterModel.setModelFilter('known-variants', 'clinvar', selectedCategories);
      self.cohortModel.setLoadedVariants(self.selectedGene, 'known-variants');
    },
    onSfariVariantsFilterChange: function(selectedCategories) {
        let self = this;
        self.filterModel.setModelFilter('sfari-variants', 'vepImpact', selectedCategories);
        self.cohortModel.setLoadedVariants(self.selectedGene, 'sfari-variants');
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
      } else if (self.launchedFromHub && flaggedVariantsToDelete.length > 0) {
        self.promiseDeleteAnalysisVariants( flaggedVariantsToDelete)
      } else if (self.launchedFromHub) {
        self.promiseUpdateAnalysisGenesData();
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
          self.selectedVariantKey = null;
          self.selectedVariantRelationship = null;
          self.selectedVariantNotes = null;
          self.selectedVariantInterpretation = null;
          self.activeGeneVariantTab = "0";

          let genesToReapply = $.extend([], self.geneModel.sortedGeneNames);

          self.geneModel.clearAllGenes();
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

      if (options == null) {
        options = {isFromClin: false};
      } else if (!options.hasOwnProperty("isFromClin")) {
        options.isFromClin = false;
      }

      if (!options.isFromClin) {
        self.clearFilter();
      }

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
        self.showLeftPanelForGenes();
        let oldGeneNames = $.extend([], self.geneModel.sortedGeneNames);
        self.applyGenesImpl(genesString, options, function() {
          if (options && options.replace) {
            self.onGenesReplaced(oldGeneNames, self.geneModel.sortedGeneNames);
          }
          if (!options.isFromClin) {
            self.onSendGenesToClin();
          }
          if (self.launchedFromHub) {
            self.promiseUpdateAnalysisGenesData(self.phenotypeTerm)
          }
          if (callback) {
            callback();
          }
        })
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
        let geneNameToSelect = null;

        if (self.launchedFromClin) {
          if (self.geneModel.geneNames && self.geneModel.geneNames.length > 0) {
            let applicableGenes = self.geneModel.geneNames.filter(function(geneName) {
              if (self.isFullAnalysis) {
                return !self.geneModel.isCandidateGene(geneName);
              } else {
                return self.geneModel.isCandidateGene(geneName);
              }
            })
            if (applicableGenes.length > 0) {
              geneNameToSelect = applicableGenes[0];
            }
          }

        } else {
          if (self.geneModel.sortedGeneNames && self.geneModel.sortedGeneNames.length > 0) {
            geneNameToSelect = self.geneModel.sortedGeneNames[0];
          }
        }

        if (geneNameToSelect) {
          return self.promiseLoadGene(geneNameToSelect);
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
      if (self.paramSampleId && self.paramSampleId.length > 0) {
        self.sampleId = self.paramSampleId;
      } else if (self.paramSampleUuid && self.paramSampleUuid.length > 0) {
        self.sampleId = self.paramSampleUuid;
      }
      if (self.paramProjectId && self.paramProjectId.length > 0) {
        self.projectId = self.paramProjectId;
      }
      if (self.paramIobioSource && self.paramIobioSource.length > 0) {
        self.globalApp.IOBIO_SOURCE = self.paramIobioSource;
      }
      if (localStorage.getItem('hub-iobio-tkn') && localStorage.getItem('hub-iobio-tkn').length > 0
        && self.sampleId && self.paramSource) {
        self.launchedFromHub = true;

        if (self.paramSource == self.sfariSource) {
          self.launchedFromSFARI = true;
        }

        // Figure out which IOBIO backend we should be using.
        // TODO - This should be a URL parameter from hub
        if (self.paramIobioSource == null && self.hubToIobioSources[self.paramSource]) {
          self.globalApp.IOBIO_SOURCE = self.hubToIobioSources[self.paramSource].iobio;
          self.globalApp.DEFAULT_BATCH_SIZE = self.hubToIobioSources[self.paramSource].batchSize;
        }

        if (self.projectId) {
          self.isHubDeprecated = false;
        } else {
          self.isHubDeprecated = true;
        }
      }

      if (self.paramTour) {
        self.tourNumber = self.paramTour;
      }

      self.globalApp.initServices();
      self.phenotypeLookupUrl = self.globalApp.hpoLookupUrl;
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
          self.cohortModel.promiseInit(modelInfos, self.projectId)
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

      variant.gene = this.selectedGene;
      variant.transcript = this.selectedTranscript;
      self.cohortModel.addUserFlaggedVariant(self.selectedGene, self.selectedTranscript, variant);


      // Refresh the loaded variants so that the ranked variants table
      // reflects the flagged variants
      self.promiseLoadGene(self.selectedGene.gene_name)
      .then(function() {
        self.onCohortVariantClick(variant, self.$refs.variantCardRef[0], 'proband');
      })

      if (self.launchedFromClin) {
        self.sendFlaggedVariantToClin(variant);
      } else if (self.launchedFromHub) {
        self.promiseUpdateAnalysisVariant(variant);
      }

    },
    onRemoveUserFlaggedVariant: function(variant) {
      let self = this;

      variant.isFlagged = false;
      variant.featureClass = "";
      self.cohortModel.removeUserFlaggedVariant(self.selectedGene, self.selectedTranscript, variant);


      if (!self.isEduMode) {
        self.$refs.navRef.onShowVariantsTab();
      }
      // Refresh the loaded variants so that the ranked variants table
      // reflects the flagged variants
      self.promiseLoadGene(self.selectedGene.gene_name)
      .then(function() {
        self.onCohortVariantClick(variant, self.$refs.variantCardRef[0], 'proband');
      })

      if (self.launchedFromClin) {
        self.sendFlaggedVariantToClin(variant, 'delete');
      } else if (self.launchedFromHub) {
        self.promiseDeleteAnalysisVariants([variant]);
      }


    },
    onFlaggedVariantsImported: function() {
      this.bringAttention = null;
      this.showLeftPanelWhenFlaggedVariants()
      this.promiseSelectFirstFlaggedVariant()
    },
    onApplyVariantNotes: function(variant) {
      let self = this;

      // Set the flagged variant notes and interpretation
      if (self.launchedFromClin) {
        self.sendFlaggedVariantToClin(variant);
      } else if (self.launchedFromHub) {
        self.promiseUpdateAnalysisVariant(variant);
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
      } else if (self.launchedFromHub) {
        self.promiseUpdateAnalysisVariant(variant);
      }

      if (variant == self.selectedVariant) {
        self.$set(self, "selectedVariantInterpretation", variant.interpretation);
      }

      let theTranscript = variant.transcript ? variant.transcript : self.geneModel.getCanonicalTranscript(variant.gene)
      self.cohortModel.setVariantInterpretation(variant.gene, theTranscript, variant);
    },
    onFlaggedVariantSelected: function(flaggedVariant, callback) {
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
        self.selectedGene = flaggedVariant.gene;
        genePromise = Promise.resolve();
      } else if (flaggedVariant.transcript
        && self.selectedTranscript.transcript_id == flaggedVariant.transcript.transcript_id) {
        // No need to reselect the gene if the same transcript on the same gene is already selecte
        self.selectedGene = flaggedVariant.gene;
        genePromise = Promise.resolve();
      } else {
        self.geneModel.adjustGeneRegion(flaggedVariant.gene);
        self.geneRegionStart = flaggedVariant.gene.start;
        self.geneRegionEnd   = flaggedVariant.gene.end;
        self.selectedGene = flaggedVariant.gene;
        if (flaggedVariant.transcript) {
          self.selectedTranscript = flaggedVariant.transcript;
        } else {
          self.selectedTranscript = self.geneModel.getCanonicalTranscript(self.selectedGene);
        }
        self.selectedVariant = null;
        self.selectedVariantKey = null;
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


            matchingVariantPromise
            .then(function(matchingVariant) {

              if (matchingVariant && !matchingVariant.isProxy) {
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
                  if (self.launchedFromClin) {
                    self.sendFlaggedVariantToClin(flaggedVariant);
                  } else if (self.launchedFromHub) {
                    self.promiseUpdateAnalysisVariant(flaggedVariant);
                  }

                }


                self.$set(self, "selectedVariant", null);
                self.$set(self, "selectedVariant", flaggedVariant);
                self.$set(self, "selectedVariantKey", null);
                self.$set(self, "selectedVariantKey", flaggedVariant);
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
                self.$refs.variantInspectRef.refresh();

                if (callback) {
                  callback();
                }

              }


            })
            .catch(function(error) {
              console.log("GeneHome.onFlaggedVariantSelected. Unable to get matching variant");
              if (callback) {
                callback();
              }
            })
          },
          500);

      });
    },
    onShowFilters: function(showIt) {
      let self = this;
      self.showFilters = showIt;
      if (self.$refs.filterCardRef) {
        self.$refs.filterCardRef.refresh()
      }
    },
    onShowKnownVariantsCard: function(showIt) {
      let self = this;
      self.showKnownVariantsCard = showIt;
      if (self.showKnownVariantsCard) {
        self.onKnownVariantsVizChange();
      }
    },
    onShowSfariVariantsCard: function(showIt) {
        let self = this;
        self.showSfariVariantsCard = showIt;
        if (self.showSfariVariantsCard) {
            self.onSfariVariantsVizChange();
        }
    },
    onAnalyzeCodingVariantsOnly: function(analyzeCodingVariantsOnly) {
      this.cohortModel.analyzeCodingVariantsOnly = analyzeCodingVariantsOnly;
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
        if (!self.isEduMode && self.cohortModel.flaggedVariants && self.cohortModel.flaggedVariants.length > 0) {
          self.$refs.navRef.onShowVariantsTab();
        }
        if (self.selectedGene && self.selectedGene.gene_name) {
          self.onGeneSelected(self.selectedGene.gene_name);
        }

        if (self.$refs.filterCardRef) {
          self.$refs.filterCardRef.refresh()
        }
        if (self.launchedFromClin) {
          self.onSendFiltersToClin();
        }
      })
    },
    onFilterSettingsClose: function() {
      this.showFilters = false;
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

    onShowPileupForVariant: function(relationship="proband", variant) {
      let self = this;
      let theVariant = variant ? variant : this.selectedVariant;
      if (theVariant) {
        let variantInfo = this.globalApp.utility.formatDisplay(variant, this.cohortModel.translator, this.isEduMode);

        // Format the coordinate for the variant
        const chrom = this.globalApp.utility.stripRefName(theVariant.chrom);
        const start = theVariant.start - this.pileupInfo.SPAN;
        const end   = theVariant.start + this.pileupInfo.SPAN;
        this.pileupInfo.coord =  'chr' + chrom + ':' + start + '-' + end;


        this.pileupInfo.tracks = [];

        // Set the bam, vcf, and references
        this.cohortModel.getCanonicalModels().forEach(function(model) {
          let track               = {name: model.relationship};
          track.variantURL        = model.vcf.getVcfURL();
          track.variantIndexURL   = model.vcf.getTbiURL();
          track.alignmentURL      = model.bam.bamUri;
          track.alignmentIndexURL = model.bam.baiUri;
          self.pileupInfo.tracks.push(track);
        })


        // Set the reference
        this.pileupInfo.referenceURL = this.pileupInfo.referenceURLs[this.genomeBuildHelper.getCurrentBuildName()];

        // set the title
        const titleParts = []
        titleParts.push("Read pileup");
        titleParts.push(this.selectedGene.gene_name);
        titleParts.push((variant.type ? variant.type.toUpperCase() + " " : "")
          + theVariant.chrom + ":" + theVariant.start + " " + theVariant.ref + "->" + theVariant.alt);
        titleParts.push(variantInfo.HGVSpAbbrev);
        this.pileupInfo.title = titleParts.join(' ')

        this.pileupInfo.show         = true;

        this.$modal.show('pileup-modal');
      }
      else {
        return '';
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

      if (!this.isClinFrameVisible) {
        this.isClinFrameVisible = clinObject.isFrameVisible;
      }

      if (clinObject.type == 'apply-genes' && !self.isFullAnalysis) {

        self.applyGenesClin(clinObject);


      } else if (clinObject.type == 'set-data') {
        if (self.cohortModel == null || !self.cohortModel.isLoaded) {
          console.log("gene.iobio set-data cohort model not yet loaded")
          self.init(function() {
            self.geneModel.setRankedGenes({'gtr': clinObject.gtrFullList, 'phenolyzer': clinObject.phenolyzerFullList })
            self.geneModel.setGenePhenotypeHitsFromClin(clinObject.genesReport);

            console.log("gene.iobio set-data promiseInitClin")
            self.promiseInitClin(clinObject)
            .then(function() {
              console.log("gene.iobio set-data finished promiseInitClin")
            })
          })
        } else {
          console.log("gene.iobio set-data cohort model already loaded")
          self.geneModel.setRankedGenes({'gtr': clinObject.gtrFullList, 'phenolyzer': clinObject.phenolyzerFullList })
          self.promiseInitClin(clinObject).
          then(function() {
              console.log("gene.iobio set-data finished promiseInitClin")
          })
        }
      } else if (clinObject.type == 'show') {

        if (self.cohortModel && self.cohortModel.isLoaded) {


          self.$set(self, "isFullAnalysis", clinObject.receiver == 'genefull' ? true : false);
          self.filterModel.isFullAnalysis = self.isFullAnalysis;

          if (self.cacheHelper.analyzeAllInProgress) {
            self.showLeftPanelForGenes();
          } else {
            self.showLeftPanelWhenFlaggedVariants();
          }

          self.promiseShowClin();
        } else {
          console.log("** bypassing showData cohort NOT loaded **");
        }

      } else if (clinObject.type == 'show-coverage') {
        if (self.$refs.genesCardRef && self.$refs.genesCardRef.$refs.filterBadgesRef) {
          self.activeFilterName = 'coverage';
          self.onAnalyzeAll();
        }
      } else if (clinObject.type == 'show-review' || clinObject.type == 'show-review-full') {
        console.log("gene.iobio show-review")
        if (self.$refs.genesCardRef && self.$refs.genesCardRef.$refs.filterBadgesRef) {
          self.$refs.genesCardRef.$refs.filterBadgesRef.onClearFilter();

          if (self.cacheHelper.analyzeAllInProgress) {
            self.showLeftPanelForGenes();
          } else {
            self.showLeftPanelWhenFlaggedVariants();
          }
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


    onInsufficientCoverage: function(theGeneCount) {
      let self = this;
      if (this.launchedFromClin) {
        var msgObject = {
            success: true,
            type:   'insufficient-coverage',
            app:    'gene',
            sender: 'gene.iobio.io',
            geneCount:  theGeneCount};
        window.parent.postMessage(JSON.stringify(msgObject), self.clinIobioUrl);
      }

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

    sendFlaggedVariantToClin: function(varianToReplace, action="update", callback) {
      let self = this;
      if (callback) {
        callback();
      }
      /*
      self.analysis.payload.datetime_last_modified = self.globalApp.utility.getCurrentDateTime();
      self.cohortModel.promiseExportFlaggedVariant('json', variantToReplace)
      .then(function(exportedVariants) {

        let matchingIdx = self.findAnalysisVariantIndex(exportedVariants[0]);
        if (matchingIdx != -1) {
          self.analysis.payload.variants[matchingIdx] = exportedVariants[0];
        } else {
          self.analysis.payload.variants.push(exportedVariants[0]);
        }
        if (callback) {
          callback()
        }
      })
      */
    },



    sendFlaggedVariantToClinOld: function(variant, action="update", callback) {
      let self = this;

      if (this.launchedFromClin) {
        self.cohortModel.promiseExportFlaggedVariant('json', variant)
        .then(function(data) {
          var msgObject = {
              success:  true,
              type:     'save-variants',
              sender:   'gene.iobio.io',
              action:   action,
              app:      'self.isFullAnalysis' ? 'genefull' : 'gene',
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
      if (importedVariants.length > 0) {
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
            //window.parent.postMessage(JSON.stringify(msgObject), self.clinIobioUrl);
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
      if (this.launchedFromClin) {
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

        // If cache should not persist, bypass this functionality
        if (!self.clinPersistCache) {
          return;
        }

        console.log(" **** getting cache from clin **** ");

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

    sendConfirmSetDataToClin: function() {
      let self = this;
      if (this.launchedFromClin) {
        var msgObject = {
          success: true,
          type:   'confirm-set-data',
          sender: 'gene.iobio.io',
          app:    self.isFullAnalysis ? 'genefull' : 'gene'
        };
        window.parent.postMessage(JSON.stringify(msgObject), self.clinIobioUrl);
      }
    },

    promiseSetCacheFromClin: function(clinObject) {
      let self = this;

      // If cache should not persist, bypass this functionality
      if (!self.clinPersistCache) {
        self.clinSetData.isCacheSet = true;
        return Promise.resolve();
      }

      return new Promise(function(resolve, reject) {
        let cachePromises = [];
        let summarizePromises = [];
        let genesToAdd = [];

        if (clinObject.cache && clinObject.cache.length > 0) {
          clinObject.cache.forEach(function(cacheItem) {
            let newCacheKey = cacheHelper.convertClinCacheKey(cacheItem.cache_key);
            let p = self.cacheHelper.promiseCacheData(newCacheKey, cacheItem.cache, {compress: false})
            .then(function(theKey) {
              let theKeyObject = CacheHelper._parseCacheKey(theKey);

              if (theKeyObject.dataKind == 'dangerSummary') {

                var dp = self.cacheHelper.promiseGetData(theKey)
                .then(function(data) {
                  if (data && data.geneName) {
                    self.geneModel.setDangerSummary(data.geneName.toUpperCase(), data);
                    genesToAdd.push(data.geneName);

                  }
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
        //.then(function() {
        //  self.onShowSnackbar({message: 'Getting gene info...', timeout: 5000})
        //  return self.geneModel.promiseCopyPasteGenes(genesToAdd.join(","), {replace: true, warnOnDup: false});
        //})
        .then(function() {
          self.clinSetData.isCacheSet = true;
          resolve();
        })
        .catch(function(error) {
          self.clinSetData.isCacheSet = true;
          let msg = "Problem in GeneHome.promiseSetCacheFromClin(): " + error;
          console.log(msg);
          reject(msg);
        })

      })

    },

    setIobioConfigFromClin: function(clinObject) {
      let self = this;

      self.clinPersistCache = clinObject.persistCache;

      if (clinObject.batchSize) {
        self.globalApp.DEFAULT_BATCH_SIZE = clinObject.batchSize;
      }


      if (clinObject.iobioSource) {
        self.globalApp.IOBIO_SOURCE = clinObject.iobioSource;
        self.globalApp.initServices();
      }


      let endpoint = new EndpointCmd(self.globalApp,
        self.cacheHelper.launchTimestamp,
        self.genomeBuildHelper,
        self.globalApp.utility.getHumanRefNames
      );

      self.cohortModel.endpoint = endpoint;

    },

    promiseInitClin: function(clinObject) {
      let self = this;
      return new Promise(function(resolve, reject) {
        self.isClinFrameVisible = true;
        self.clinSetData = clinObject;

        self.setIobioConfigFromClin(self.clinSetData);
        self.cohortModel.promiseInit(self.clinSetData.modelInfos)
        .then(function() {

          self.sendConfirmSetDataToClin();

          self.onSendFiltersToClin();

          self.models = self.cohortModel.sampleModels;
          self.geneModel.setCandidateGenes(self.clinSetData.genes);
          return self.promiseSetCacheFromClin(self.clinSetData)

        })
        .then(function() {
          return self.promiseShowClin();
        })
        .then(function() {
          resolve();
        })
        .catch(function(error) {
          reject(error);
        })

      })
    },


    promiseShowClin: function() {
      let self = this;

      return new Promise(function(resolve, reject) {
        self.promiseImportClin()
        .then(function() {
          resolve();
        })
        .catch(function(error) {
          reject(error);
        })
      })
    },


    applyGenesClin: function(clinObject) {
      let self = this;

      if (self.clinSetData == null || !self.clinSetData.isImported || !self.clinSetData.isCacheSet) {
        return;
      }

      let genesToProcess = [];
      let candidateGenesOld = $.extend({}, self.geneModel.candidateGenes);
      self.geneModel.setCandidateGenes(clinObject.genes);

      self.geneModel.setGenePhenotypeHitsFromClin(clinObject.genesReport);
      self.geneModel.setRankedGenes({'gtr': clinObject.gtrFullList, 'phenolyzer': clinObject.phenolyzerFullList })

      if (clinObject.genes && Array.isArray(clinObject.genes)) {
        let deprecatedGenes = {};
        for (var oldGene in candidateGenesOld) {
          if (!self.geneModel.candidateGenes[oldGene]) {
            deprecatedGenes[oldGene] = true;
          }
        }

        self.geneModel.sortedGeneNames.forEach(function(gene) {
          if (!deprecatedGenes[gene]) {
            genesToProcess.push(gene);
          }
        })
        clinObject.genes.forEach(function(gene) {
          genesToProcess.push(gene);
        })
      }

      if (genesToProcess) {
        let genesString = genesToProcess ? genesToProcess.join(" ") : "";
        let phenotypeTerms = clinObject.searchTerms && Array.isArray(clinObject.searchTerms) ? clinObject.searchTerms.join(",") : (clinObject.searchTerms ? clinObject.searchTerms : "");

        if (genesString.length > 0 ) {
          let options = { isFromClin: true, replace: true, warnOnDup: false, phenotypes: phenotypeTerms }
          this.onApplyGenes(genesString, options, function() {
            if (self.cohortModel && self.cohortModel.isLoaded) {



              self.cacheHelper.promiseGetGenesToAnalyze()
              .then(function(genesToAnalyze) {
                if (genesToAnalyze.length > 0) {
                  self.showLeftPanelForGenes();
                  self.cacheHelper.promiseAnalyzeSubset(self.cohortModel, genesToAnalyze, null, false, false);
                }
              })
            }
          });
        }

      }


    },


    promiseSelectFirstFlaggedVariant: function() {
      let self = this;
      return new Promise(function(resolve, reject) {

        let getGeneName = function(variant) {
          if (variant.geneName && variant.geneName.length > 0) {
            return variant.geneName;
          } else if (self.globalApp.utility.isObject(variant.gene)) {
            return variant.gene.gene_name;
          } else {
            return variant.gene;
          }
        }

        // Find first flagged variant in list
        let firstFlaggedVariant = null;
        let sortedFilters = self.cohortModel.organizeVariantsByFilterAndGene(null, self.isFullAnalysis);
        sortedFilters.forEach(function(filterObject) {
          filterObject.genes.forEach(function(geneList) {
            if (!firstFlaggedVariant && geneList.variants && geneList.variants.length > 0) {
              firstFlaggedVariant = geneList.variants[0];
            }
          })
        })

        if (firstFlaggedVariant) {
          self.promiseLoadGene(getGeneName(firstFlaggedVariant))
          .then(function() {
            self.showLeftPanelWhenFlaggedVariants();
            self.toClickVariant = firstFlaggedVariant;
            self.onFlaggedVariantSelected(firstFlaggedVariant, function() {
              resolve()
            });
          })
        } else {
          setTimeout(function() {
            self.showLeftPanelForGenes();
          },1000)
          resolve();
        }

      })
    },

    promiseImportClin: function() {
      let self = this;

      return new Promise(function(resolve, reject) {

        if (!self.clinSetData.importInProgress && !self.clinSetData.isImported) {

          self.clinSetData.importInProgress = true;
          self.clinSetData.isImported = false;

          self.showLeftPanelForGenes();


          self.importVariantData(self.clinSetData.variantData,
          function(importedVariants, importedGenes) {

            let theGenes = self.clinSetData.genes.slice();
            importedGenes.forEach(function(geneName) {
              if (theGenes.indexOf(geneName) == -1) {
                theGenes.push(geneName);
              }
            })

            self.onApplyGenes( theGenes.join(" "),
            {isFromClin: true, replace: true, warnOnDup: false, phenotypes: self.clinSetData.phenotypes.join(",")},
            function() {

              if (self.clinSetData.variants.length > 0) {
                self.cohortModel.importFlaggedVariants('json', self.clinSetData.variants,
                function() {




                  self.clinSetData.isImported = true;

                  resolve();


                },
                function() {
                  self.clinSetData.importInProgress = false;
                  // When analyzeSubset and variants have been cached
                  self.cacheHelper.analyzeAll(self.cohortModel, false);
                })
              } else {

                self.cohortModel.promiseMergeImportedVariants(importedVariants)
                .then(function() {
                  self.clinSetData.isImported = true;
                  self.clinSetData.importInProgress = false;

                  self.cacheHelper.analyzeAll(self.cohortModel, false);

                  resolve();

                })

              }
            })
          })

        } else {
          self.cacheHelper.promiseGetGenesToAnalyze()
          .then(function(genesToAnalyze) {
            if (genesToAnalyze.length > 0) {
              self.promiseSelectFirstFlaggedVariant()
              .then(function() {
                self.cacheHelper.promiseAnalyzeSubset(self.cohortModel, genesToAnalyze, null, false, false);
              })
            } else {
              self.promiseSelectFirstFlaggedVariant()
              .then(function() {
                if (self.$refs.navRef) {
                  self.$refs.navRef.onShowVariantsTab();
                }
              })
            }
            resolve();
          })
        }

      })
    },

    importVariantData: function(variantData, callback) {
      let self = this;
      let theImportedGenes = [];
      let theImportedVariants = [];

      if (self.clinSetData.variants.length > 0) {
        if (callback) {
          self.clinSetData.variants.forEach(function(v) {
            if (theImportedGenes.indexOf(v.gene) == -1) {
              theImportedGenes.push(v.gene);
            }
          })
          callback([], theImportedGenes)
        }
      } else {
        if (variantData) {
          self.cohortModel.importFlaggedVariants('gemini', variantData,
          function() {

            // clone the imported variants array
            theImportedVariants = self.cohortModel.flaggedVariants.slice();

            theImportedVariants.forEach(function(v) {
              if (theImportedGenes.indexOf(v.geneName) == -1) {
                theImportedGenes.push(v.geneName);
              }
            })

            // sequentially send each imported variant to clin to be saved
            self.sendNextImportedVariantToClin(theImportedVariants, function() {

            });


            if (callback) {
              callback(theImportedVariants, theImportedGenes);
            }

          },
          function() {



          })
        } else {
          callback(theImportedGenes, theImportedVariants);
        }


      }



    },


    promiseGetAnalysis: function(idProject, idAnalysis, options={}) {
      let self = this;
      return new Promise(function(resolve, reject) {

        if (idAnalysis && idAnalysis.length > 0) {

          self.hubSession.promiseGetAnalysis(idProject, idAnalysis)
          .then(function(analysis) {
            if (analysis) {
              self.analysis = analysis;
              resolve(self.analysis);

            } else {
              reject("Unable to find/create an analysis " + idAnalysis);
            }
          })
          .catch(function(err) {
            reject(err);
          })

        } else {
          var newAnalysis = {};
          newAnalysis.title = "variant analysis";
          newAnalysis.description = "";
          newAnalysis.project_id = idProject;
          newAnalysis.sample_id  = self.paramSampleId;
          newAnalysis.payload = {};
          newAnalysis.payload.project_id = idProject;
          newAnalysis.payload.sample_id = self.paramSampleId;
          newAnalysis.payload.is_pedigree = self.paramIsPedigree;
          newAnalysis.payload.datetime_created = self.globalApp.utility.getCurrentDateTime();
          newAnalysis.payload.genes = [];
          newAnalysis.payload.variants = [];
          self.analysis = newAnalysis;

          resolve(self.analysis)

        }

      });
    },


    toggleSaveModal(bool) {
      this.showSaveModal = bool;
    },

    promiseSaveAnalysis: function() {
      let self = this;

      return new Promise(function(resolve, reject) {
        if (self.analysis.id ) {

          self.hubSession.promiseUpdateAnalysisTitle(self.analysis)
          .then(function(analysis) {
            self.showSaveModal = false;
            return self.hubSession.promiseUpdateAnalysis(self.analysis)
          })
          .then(function(analysis) {
            self.onShowSnackbar( {message: 'Analysis  \'' + self.analysis.title + '\'  saved.', timeout: 3000});
            self.analysis = analysis;
            resolve();
          })
          .catch(function(error) {
            self.onShowSnackbar( {message: 'Unable to update analysis.', timeout: 6000});
            reject(error);
          })

        } else {

          self.hubSession.promiseAddAnalysis(self.analysis.project_id, self.analysis)
          .then(function(analysis) {
            console.log("**********  adding mosaic analysis " + self.analysis.id + " " + " **************")
            self.onShowSnackbar( {message: 'New analysis  \'' + self.analysis.title + '\'  saved.', timeout: 3000});
            self.analysis = analysis;
            resolve();
          })
          .catch(function(error) {
            self.onShowSnackbar( {message: 'Unable to add analysis.', timeout: 6000});
            reject(error);
          })
        }

      })


    },

    onCancelAnalysis: function() {
      let self = this;
      self.showSaveModal = false
    },

    promiseAutosaveAnalysis() {
      let self = this;
      if (self.analysis.id ) {
        return self.promiseSaveAnalysis({notify: false});
      } else {

      }

    },


    promiseUpdateAnalysisGenesData: function(phenolyzerSearchTerm) {
      let self = this;
      self.analysis.payload.genes              = this.geneModel.geneNames;
      if (phenolyzerSearchTerm && phenolyzerSearchTerm.length > 0) {
        self.analysis.payload.phenotypeTerm      = phenolyzerSearchTerm;
      }

      self.analysis.payload.datetime_last_modified = self.globalApp.utility.getCurrentDateTime();
      return self.promiseAutosaveAnalysis();
    },

    promiseDeleteAnalysisVariants(variantsToRemove) {
      let self = this;
      let toRemove = [];
      if (variantsToRemove && self.analysis.payload.variants) {
        variantsToRemove.forEach(function(variantToRemove) {
          let matchingIdx = self.findAnalysisVariantIndex(variantToRemove);
          if (matchingIdx != -1) {
            toRemove.push($.extend({}, variantToRemove));
          }
        })
      }
      toRemove.forEach(function(v) {
        let idx = self.findAnalysisVariantIndex(v, self.analysis.payload.variants);
        self.analysis.payload.variants.splice(idx, 1);
      })
      self.analysis.payload.datetime_last_modified = self.globalApp.utility.getCurrentDateTime();
      self.promiseAutosaveAnalysis()
      .then(function() {
        // Now update the gene list
         return self.promiseUpdateAnalysisGenesData()
      })

    },


    promiseUpdateAnalysisVariant: function(variantToReplace) {
      let self = this;

      self.analysis.payload.datetime_last_modified = self.globalApp.utility.getCurrentDateTime();
      self.cohortModel.promiseExportFlaggedVariant('json', variantToReplace)
      .then(function(exportedVariants) {

        let matchingIdx = self.findAnalysisVariantIndex(exportedVariants[0]);
        if (matchingIdx != -1) {
          self.analysis.payload.variants[matchingIdx] = exportedVariants[0];
        } else {
          self.analysis.payload.variants.push(exportedVariants[0]);
        }
        return self.promiseAutosaveAnalysis();

      })
    },

    findAnalysisVariantIndex(variant) {
      let self = this;

      let getGeneName = function(variant) {
        if (self.globalApp.utility.isObject(variant.gene)) {
          return variant.gene.gene_name;
        } else {
          return variant.gene;
        }
      }

      let matchingIdx = -1;
      let idx = 0;
      if (self.analysis && self.analysis.payload.variants) {
        self.analysis.payload.variants.forEach(function(v) {


          if (matchingIdx == -1
              && getGeneName(v) == getGeneName(variant)
              && v.start == variant.start
              && v.ref == variant.ref
              && v.alt == variant.alt ) {
            matchingIdx = idx;
          }
          idx++;
        })
      }
      return matchingIdx;
    },

  }
}
</script>
