/*
 * Variant.vue
 *
 */
<style lang="sass">

@import ../../../assets/sass/variables

#bam-track
  margin-top: -15px

#variant-card.proband
  padding-top: 6px

#variant-card
  #sample-label
    vertical-align: top
    display: inline-block
    min-width: 193px
    max-width: 193px
    padding-top: 2px
    color: $heading-color
    font-size: 17px

  #loaded-count
    color: $text-color

  #sample-identifier
    width: 130px
    display: inline-block
    vertical-align: middle
    padding-top: 5px
    line-height: 13px
    white-space: normal
    font-size: 13px !important
    color: $text-color !important


  .header-spacer
    width: 30px


  .variant-action-button
    background-color: white
    padding: 0
    height: 22px !important
    min-width: 70px
    vertical-align: top
    margin: 4px 0 0 15px

    .btn__content, .v-btn__content
      color: $app-color !important
      padding-left: 8px
      padding-right: 8px
      font-size: 13px

      i.material-icons
        color: $app-color
        font-size: 14px
        padding-right: 2px
        padding-top: 0


  .coverage-problem-glyph
    fill: $coverage-problem-glyph-color

  .gene-viz, .gene-viz-zoom
    .transcript.current
      outline: none !important
      font-weight: normal !important
    .axis
      padding-left: 0
      padding-right: 0
      margin-top: -10
      margin-bottom: 0
      padding-bottom: 0
      text
        font-size: 11px
        fill: rgb(120, 120, 120)
      line, path
        fill: none
        stroke: lightgrey
        shape-rendering: crispEdges
        stroke-width: 1px
      &.x
        .tick
          line
            transform: translateY(-14px)
          text
            transform: translateY(6px)
        path
          transform: translateY(-20px)
          display: none


  .chart-label
    font-size: 13px
    color: $heading-color


  .gene-viz-zoom
    .current
      outline: none

    .cds, .exon, .utr
      fill: rgba(159, 159, 159, 0.63)
      stroke: rgb(159, 159, 159)


  .zoom-switch
    display: inline-block
    padding-top: 0 !important
    margin-top: 0 !important
    margin-right: 20px
    margin-left: 40px

    label
      padding-left: 0
      line-height: 18px
      font-family: Poppins, sans-serif !important
      font-size: 13px !important
      font-weight: normal !important
      padding-top: 7px
      color: $text-color

  .badge, .v-badge
    background-color: transparent !important
    color: $text-color
    font-weight: normal
    font-size: 13px
    padding: 2px 7px 3px

    &.called
      vertical-align: top
      padding-top: 4px
      .badge__badge, .v-badge__badge
        background-color: #efeeee !important
        border: thin solid #bfbdbd !important
        color: $text-color !important
    &.loaded
      padding-top: 4px
      padding-left: 0
      margin-left: 10px
      .badge__badge, .v-badge__badge
        background-color: #efeeee !important
        border: thin solid #bfbdbd !important
        color: $text-color !important
    &.coverage-problem
      vertical-align: top
      .badge__badge, .v-badge__badge
        background-color: $coverage-problem-color !important

    .badge__badge, .v-badge__badge
      font-size: 11px
      font-weight: normal
      width: 24px
      top: 0
      background-color: $light-badge-color !important

  #known-variants-chart
    padding: 0
    margin-top: 0
    margin-bottom: 0


    svg
      vertical-align: bottom
      .axis
        text
          font-size: 12px !important
        &.axis--x
          .tick
            visibility: hidden
      .layer.benign
        .stacked-element
          fill: rgba(156, 194, 49, 1)
          stroke: $text-color
          stroke-width: .5px
      .layer.path
        .stacked-element
          fill: #ad494A
          stroke: $text-color
          stroke-width: .5px
      .layer.other
        .stacked-element
          fill: rgba(231, 186, 82, 1)
          stroke: $text-color
          stroke-width: .5px
      .layer.unknown
        .stacked-element
          fill: rgb(189, 189, 189)
          stroke: $text-color
          stroke-width: .5px


  #sfari-variants-chart
    padding: 0
    margin-top: 0
    margin-bottom: 0

  #sfari-chip
    .chip__content
      font-size:  12px !important
      background-color:  white !important
      color:  red !important
    .btn
      padding: 0
      margin: 0

  #sfari-menu
    .menu__content
      padding: 5px
      overflow-x: auto

    svg
      vertical-align: bottom
      .axis
        text
          font-size: 12px !important

        &.axis--x
          .tick
            visibility: hidden

      .layer.benign
        .stacked-element
          fill: rgba(156, 194, 49, 1)
          stroke: $text-color
          stroke-width: .5px

      .layer.path
        .stacked-element
          fill: #ad494A
          stroke: $text-color
          stroke-width: .5px

      .layer.other
        .stacked-element
          fill: rgba(231, 186, 82, 1)
          stroke: $text-color
          stroke-width: .5px

      .layer.unknown
        .stacked-element
          fill: rgb(189, 189, 189)
          stroke: $text-color
          stroke-width: .5px

  .other-samples
    background-color: #dcdcdc42

    .other-samples-header
      background-color: white

    .ibo-variant
      .circle.pinned
        stroke: #868686 !important
      .arrow-line
        stroke: #868686 !important
      .arrow.pinned
        .arrow
          stroke: #868686 !important

      .axis.x
        path.domain
          opacity: .5

    #loaded-variant-viz-known-variants
      .axis.x
        path.domain
          opacity: .3 !important
          stroke: #a9a9a9 !important

    #depth-viz
      min-height: 0 !important
      .circle
        fill: #404040 !important
      .circle-label
        fill: #868686 !important

  .btn__content, .v-btn__content
    padding: 0

    i.material-icons
      font-size: 18px
      color: $link-color
      opacity: .6

.close-button
  margin: 0 !important
  padding: 0 !important
  min-width: 25px !important
  height: 25px !important
  margin-bottom: 15px !important

  .btn__content, .v-btn__content
    padding: 0
    max-width: 25px
    max-height: 25px

    i.material-icons
      font-size: 25px
      color: $text-color

.info-title
  font-size: 20px
  color: $app-color
  margin-bottom: 15px

.info-card
  padding: 15px 15px 20px 15px

.info-description
  font-size: 13px

.info-publication
  margin-top: 20px
  font-size: 13px
  a
    font-style: italic
    font-size: 13px
    line-height: 16px

</style>
<template>
  <v-card tile id="variant-card" class="app-card">
    <div style="display: flex;margin-bottom: 0px;">
      <span
         id="sample-label"
         v-bind:class="sampleModel.relationship">
        <span style="display:inline-block"
        v-if="selectedGene"> {{ selectedGene.gene_name }} {{ sampleRelLabel }}</span>
      </span>

      <div>
        <div style="height: 4px"></div>
        <v-badge  id="loaded-count" style="padding-top: 2px; margin-left: 10 !important"
        v-if="!isEduMode && !isBasicMode && sampleModel.loadedVariants && selectedGene && sampleModel.cohort.geneModel.geneDangerSummaries[selectedGene.gene_name] && !(sampleModel.isSfariSample && blacklistedGeneSelected)" class="loaded mr-4 " >
          <span slot="badge" style="padding-top: 0" > {{ sampleModel.relationship !== 'known-variants' || knownVariantsViz === 'variants' ? sampleModel.loadedVariants.features.length : sampleModel.variantHistoCount  }} </span>
          {{ isBasicMode || sampleModel.relationship === 'known-variants' ? 'Count' : 'Variants' }}
        </v-badge>
        <v-badge id="called-count"
          v-if="sampleModel.relationship !== 'known-variants' && selectedGene && sampleModel.cohort.geneModel.geneDangerSummaries[selectedGene.gene_name] && sampleModel.cohort.geneModel.geneDangerSummaries[selectedGene.gene_name].CALLED "
          class="mr-4  called">
          <span v-if="sampleModel.loadedVariants"  slot="badge"> {{ sampleModel.calledVariants.features.length }} </span>
          Called
        </v-badge>
        <v-badge  v-if="!isSimpleMode && !isBasicMode && sampleModel.loadedVariants && coverageDangerRegions.length > 0 && !(sampleModel.isSfariSample && blacklistedGeneSelected)" class="ml-2 mr-2 coverage-problem" >
          <span slot="badge"> {{ coverageDangerRegions.length }} </span>
          Low coverage exons
        </v-badge>
      </div>


      <v-switch
              v-if="sampleModel.relationship === 'proband' && sampleModel.loadedVariants && selectedGene && sampleModel.cohort.geneModel.geneDangerSummaries[selectedGene.gene_name]  && isSimpleMode"
              class="zoom-switch" style="max-width:80px;"
              label="Zoom"
              v-model="showZoom"
              :hide-details="true">
      </v-switch>

      <v-spacer></v-spacer>

      <sfari-variants-toolbar
        v-if="sampleModel.relationship === 'sfari-variants'"
        @sfariVariantsVizChange="onSfariVariantsVizChange"
        @sfariVariantsFilterChange="onSfariVariantsFilterChange">
      </sfari-variants-toolbar>

      <div style="margin-top:8px;margin-left: 20px;margin-right: 0px;margin-bottom:-20px" >
        <variant-toggle
                v-if="!isBasicMode && !isSimpleMode && !isEduMode && showVariantViz && (isMother || isFather)"
                :variants="sampleModel.loadedVariants"
                :filterModel="sampleModel.cohort.filterModel"
                :geneLists="geneLists"
                :selectedGene="selectedGene"
                :selected-variant="selectedVariant"
                @filtered-variants-update="onFilteredVariantsUpdate"
                @show-filter="onShowFilter">
        </variant-toggle>
      </div>

    </div>


    <div style="width:100%">
      <div style="text-align: center;clear: both;">
        <div class="loader vcfloader" v-bind:class="{ hide: !sampleModel.inProgress.loadingVariants }" style="display: inline-block;padding-bottom:10px">
          <span class="loader-label">Annotating variants</span>
          <img src="../../../assets/images/wheel.gif" alt="Loading wheel">
        </div>
        <div class="loader fbloader" v-bind:class="{ hide: !sampleModel.inProgress.callingVariants }" style="display: inline-block;padding-left: 20px;padding-bottom:10px">
          <span class="loader-label">Calling variants</span>
          <img src="../../../assets/images/wheel.gif" alt="Loading wheel">
        </div>
        <div class="loader covloader" v-bind:class="{ hide: !sampleModel.inProgress.loadingCoverage }" style="display: inline-block;padding-left: 20px;padding-bottom:10px">
          <span class="loader-label">Analyzing gene coverage</span>
          <img src="../../../assets/images/wheel.gif" alt="Loading wheel">
        </div>
        <v-badge v-if="showZoom" class="info" style="margin-bottom:5px">{{ zoomMessage }}</v-badge>
      </div>
    </div>

    <div style="width:100%;margin-top:0px">
      <gene-viz class="gene-viz-zoom"
      v-if="showZoom"
      :data="[selectedTranscript]"
      :modelName="sampleModel.name"
      :margin="geneZoomVizMargin"
      :width="width"
      :height="40"
      :showXAxis="false"
      :trackHeight="geneVizTrackHeight + 20"
      :cdsHeight="geneVizCdsHeight + 20"
      :regionStart="parseInt(selectedGene.start)"
      :regionEnd="parseInt(selectedGene.end)"
      :showBrush="true"
      :featureClass="getExonClass"
      @region-zoom="onRegionZoom"
      @region-zoom-reset="onRegionZoomReset">
      </gene-viz>
      <div class="chart-label"
      v-if="showVariantViz && !isSimpleMode && selectedGene && sampleModel.cohort.geneModel.geneDangerSummaries[selectedGene.gene_name] && sampleModel.cohort.geneModel.geneDangerSummaries[selectedGene.gene_name].CALLED && sampleModel.calledVariants && sampleModel.calledVariants.features.length > 0">
        {{ sampleLabel }} called variants
      </div>

      <div
        v-if="showVariantViz && !isSimpleMode && selectedGene && sampleModel.cohort.geneModel.geneDangerSummaries[selectedGene.gene_name] && sampleModel.cohort.geneModel.geneDangerSummaries[selectedGene.gene_name].CALLED && sampleModel.calledVariants && sampleModel.calledVariants.features.length === 0">
          <v-badge class="info mb-3">
            No called variants
          </v-badge>
      </div>

      <variant-viz id="called-variant-viz"
        ref="calledVariantVizRef"
        v-if="showVariantViz"
        v-bind:class="{hide: (sampleModel.relationship === 'known-variants' && knownVariantsViz !== 'variants') ||
        (sampleModel.relationship === 'sfari-variants' && sfariVariantsViz !== 'variants')}"
        :data="sampleModel.calledVariants"
        :model="sampleModel"
        :regionStart="regionStart"
        :regionEnd="regionEnd"
        :annotationScheme="annotationScheme"
        :width="width"
        :margin="variantVizMargin"
        :variantHeight="variantSymbolHeight"
        :variantPadding="variantSymbolPadding"
        :showBrush="false"
        :showXAxis="true"
        :showWhenEmpty="false"
        :showTransition="true"
        :classifySymbolFunc="classifyVariantSymbolFunc"
        vizRef="calledVariants"
        @variantClick="onVariantClick"
        @variantOutsideClick="onVariantOutsideClick"
        @variantHover="onVariantHover"
        @variantHoverEnd="onVariantHoverEnd">
      </variant-viz>

      <div class="chart-label"
      v-show="!isEduMode && !isBasicMode && showVariantViz && sampleModel.loadedVariants && sampleModel.relationship !== 'known-variants' && sampleModel.relationship !== 'sfari-variants' && !(sampleModel.isSfariSample && blacklistedGeneSelected)"
      >
        {{ isSimpleMode ? '' : sampleLabel }} {{ isSimpleMode ? '' : ' variants'}}
      </div>

      <div v-if="(sampleModel.relationship === 'sfari-variants' || sampleModel.isSfariSample) && blacklistedGeneSelected"
          style="text-align: center; padding-bottom: 20px; padding-top: 20px">
        <v-chip id="sfari-chip" class="red red--text" small outline style="font-size: 12px">
          Unauthorized SFARI Gene
          <v-menu id="sfari-menu" open-on-hover transition="slide-x-transition" max-width="400px">
            <v-btn flat icon small slot="activator">
              <v-icon small color="red">info_outline</v-icon>
            </v-btn>
            <div class="text-xs-center" style="padding: 5px">
              The SFARI program does not authorize this gene to be viewed or analyzed. Please select another gene.
            </div>
          </v-menu>
        </v-chip>
      </div>

      <variant-viz v-else-if="showVariantViz" id="loaded-variant-viz"
        ref="variantVizRef"
         v-bind:class="{hide: (sampleModel.relationship === 'known-variants' && knownVariantsViz !== 'variants') ||
          (sampleModel.relationship === 'sfari-variants' && sfariVariantsViz !== 'variants')}"
        :data="sampleModel.loadedVariants"
        :filtered-variants="filteredVariants"
        :selected-variant="selectedVariant"
        :selected-variant-relationship="selectedVariantRelationship"
        :selected-gene="selectedGene"
        :model="sampleModel"
        :showFilter="showFilter"
        :regionStart="regionStart"
        :regionEnd="regionEnd"
        :annotationScheme="annotationScheme"
        :width="width"
        :margin="variantVizMargin"
        :variantHeight="variantSymbolHeight"
        :variantPadding="variantSymbolPadding"
        :showBrush="false"
        :showXAxis="true"
        :showWhenEmpty="true"
        :showTransition="false"
        :classifySymbolFunc="classifyVariantSymbolFunc"
        vizRef="loadedVariants"
        @variantClick="onVariantClick"
        @variantHover="onVariantHover"
        @variantHoverEnd="onVariantHoverEnd">
      </variant-viz>

      <div class="chart-label"
      v-if="showDepthViz && sampleModel.coverage && sampleModel.coverage.length > 1 && !(sampleModel.isSfariSample && blacklistedGeneSelected)">
        {{ isSimpleMode ? '' : sampleModel.name }} coverage
      </div>

      <div id="bam-track">
        <depth-viz
          v-if="showDepthViz && !(sampleModel.isSfariSample && blacklistedGeneSelected)"
          ref="depthVizRef"
          :data="sampleModel.coverage"
          :modelName="sampleModel.name"
          :coverageMedian="sampleModel.cohort.filterModel.geneCoverageMedian"
          :coverageDangerRegions="!isSimpleMode && !isBasicMode ? coverageDangerRegions : []"
          :currentPoint="coveragePoint"
          :maxDepth="sampleModel.cohort.maxDepth"
          :regionStart="regionStart"
          :regionEnd="regionEnd"
          :width="width"
          :margin="depthVizMargin"
          :height="60"
          :showTooltip="false"
          :showXAxis="false"
          :regionGlyph="depthVizRegionGlyph"
          :showAlleleBar="false"
          @region-selected="showExonTooltip">
        </depth-viz>
      </div>

      <gene-viz class="gene-viz"
        :style="isEduMode ? `margin-top: 20px` : `margin-top:-5px`"
        v-bind:class="{ hide: !showGeneViz && !(sampleModel.isSfariSample && blacklistedGeneSelected) }"
        :data="[selectedTranscript]"
        :modelName="sampleModel.name"
        :relationship="sampleModel.relationship"
        :margin="geneVizMargin"
        :width="width"
        :height="40"
        :trackHeight="geneVizTrackHeight"
        :cdsHeight="geneVizCdsHeight"
        :regionStart="regionStart"
        :regionEnd="regionEnd"
        :showXAxis="geneVizShowXAxis"
        :showBrush="false"
        :featureClass="getExonClass"
        @feature-selected="showExonTooltip">
      </gene-viz>

      <optional-tracks-menu
              v-show="!isEduMode && !isBasicMode && !isSimpleMode"
              style="margin-top:-5px"
              :forceKnownVariantsViz="forceKnownVariantsViz"
              :condensedView="false"
              @show-known-variants-card="onShowKnownVariantsCard"
              @show-sfari-variants-card="onShowSfariVariantsCard"
              @show-mother-card="onShowMotherCard"
              @show-father-card="onShowFatherCard"
              @optional-track-close="onOptionalTrackClose"
              @known-variants-viz-change="onKnownVariantsVizChange"
              @known-variants-filter-change="onKnownVariantsFilterChange"
              @sfari-variants-viz-change="onSfariVariantsVizChange"
              @sfari-variants-filter-change="onSfariVariantsFilterChange"
              :isMother="isMother"
              :isFather="isFather"
      ></optional-tracks-menu>


      <div class="other-samples" style="margin-top:0" v-for="model in otherModels" :key="model.relationship">

        <div class="other-samples-header">
          <span class="chart-label"> {{ getSampleRelLabelOther(model) }}</span>
        </div>
        <variant-viz
          :id="`loaded-variant-viz-` + model.relationship"
          v-bind:class="{hide: (model.relationship === 'known-variants' && knownVariantsViz !== 'variants') ||
        (model.relationship === 'sfari-variants' && sfariVariantsViz !== 'variants')}"
          style="margin-top:-5px"
          ref="otherVariantVizRef"
          :model="model"
          :data="model.loadedVariants"
          :filtered-variants="filteredVariants"
          :selected-variant="selectedVariant"
          :selected-gene="selectedGene"
          :showFilter="showFilter"
          :regionStart="regionStart"
          :regionEnd="regionEnd"
          :annotationScheme="annotationScheme"
          :width="width"
          :margin="geneVizMargin"
          :variantHeight="variantSymbolHeightOther"
          :variantPadding="variantSymbolPadding"
          :showBrush="false"
          :showXAxis="true"
          :showWhenEmpty="false"
          vizRef="loadedVariants"
          :classifySymbolFunc="model.relationship === 'known-variants' ? model.classifyByClinvar : model.classifyByImpact"
          @variantClick="onVariantClick"
          @variantHover="onVariantHoverOther"
          @variantHoverEnd="onVariantHoverEnd">
        </variant-viz>
        <div class="loader vcfloader" v-bind:class="{ hide: !model.inProgress.loadingVariants }" style="text-align: center; clear: both;width: 100%;display: inline-block;padding-top:10px; padding-bottom: 5px">
          <span v-if="model.relationship == 'known-variants'" class="loader-label">
            Loading ClinVar variants for {{selectedGene.gene_name}}
          </span>
          <span v-if="model.relationship == 'sfari-variants'" class="loader-label">
            Loading SFARI variants for {{selectedGene.gene_name}}
          </span>
          <img src="../../../assets/images/wheel.gif" alt="Loading wheel">
        </div>
        <stacked-bar-chart-viz
          id="known-variants-chart"
          style="width:100%"
          v-if="model.relationship === 'known-variants' && knownVariantsViz !== 'variants'"
          :data="model.variantHistoData"
          :width="width"
          :xStart="selectedGene.start"
          :xEnd="selectedGene.end"
          :regionStart="regionStart"
          :regionEnd="regionEnd"
          :categories="['unknown', 'other', 'benign', 'path']"
        >
        </stacked-bar-chart-viz>
        <depth-viz
          v-if="showDepthViz && !(model.isSfariSample && blacklistedGeneSelected)"
          ref="otherDepthVizRef"
          :data="model.coverage"
          :modelName="model.name"
          :coverageMedian="model.cohort.filterModel.geneCoverageMedian"
          :coverageDangerRegions="!isSimpleMode ? model.coverageDangerRegions : []"
          :currentPoint="coveragePoint"
          :maxDepth="model.cohort.maxDepth"
          :regionStart="regionStart"
          :regionEnd="regionEnd"
          :width="width"
          :margin="depthVizMarginOther"
          :height="40"
          :showTooltip="false"
          :showXAxis="false"
          :regionGlyph="depthVizRegionGlyph"
          :showAlleleBar="false"
          @region-selected="showExonTooltip"
        >
        </depth-viz>

      </div>
    </div>
  </v-card>
</template>

<script>


import GeneViz              from "../viz/GeneViz.vue"
import TranscriptsMenu      from '../partials/TranscriptsMenu.vue'
import VariantViz           from "../viz/VariantViz.vue"
import DepthViz             from "../viz/DepthViz.vue"
import RankedVariantsMenu   from "../viz/RankedVariantsMenu.vue"
import StackedBarChartViz   from "../viz/StackedBarChartViz.vue"
import KnownVariantsToolbar from "../partials/KnownVariantsToolbar.vue"
import SfariVariantsToolbar from "../partials/SfariVariantsToolbar.vue"
import OptionalTracksMenu   from "../partials/OptionalTracksMenu.vue"
import VariantToggle        from "../partials/VariantToggle.vue"
import InfoPopup            from "../partials/InfoPopup.vue";

export default {
  name: 'variant-all-card',
  components: {
    InfoPopup,
    VariantToggle,
    VariantViz,
    GeneViz,
    DepthViz,
    RankedVariantsMenu,
    KnownVariantsToolbar,
    SfariVariantsToolbar,
    StackedBarChartViz,
    OptionalTracksMenu,
    TranscriptsMenu
  },
  props: {
    globalAppProp: null,  //For some reason, global mixin not working on variant card.  possible cause for-item?
    isEduMode: null,
    isBasicMode: null,
    isSimpleMode: null,
    clearZoom: null,
    sampleModel: null,
    annotationScheme: null,
    classifyVariantSymbolFunc: null,
    coverageDangerRegions: null,
    otherModels: null,
    isMother: null,
    isFather: null,

    variantTooltip: null,
    selectedGene: {},
    selectedTranscript: {},

    selectedVariant: null,
    selectedVariantRelationship: null,
    regionStart: 0,
    regionEnd: 0,
    width: 0,


    showVariantViz: true,
    forceKnownVariantsViz: null,
    showGeneViz: true,
    showDepthViz: true,
    geneVizShowXAxis: null,

    featureMatrixModel: null,

    blacklistedGeneSelected: false,  // True if selected gene falls in SFARI ACMG blacklist
    geneLists: null,
    launchedFromClin: null,


  },

  data() {
    let self = this;
    return {
      margin: {
        top: self.isBasicMode || self.isEduMode ? 0 : 20,
        right: self.isBasicMode || self.isEduMode ? 7 : 2,
        bottom: 18,
        left: self.isBasicMode || self.isEduMode ? 9 : 4
      },
      variantVizMargin: {
        top: 0,
        right: self.isBasicMode || self.isEduMode ? 7 : 2,
        bottom: 10,
        left: self.isBasicMode || self.isEduMode ? 9 : 4
      },
      variantSymbolHeight: self.isEduMode  || self.isBasicMode ? self.globalAppProp.eduModeVariantSize : 12,
      variantSymbolHeightOther: self.isEduMode  || self.isBasicMode ? self.globalAppProp.eduModeVariantSize : 12,
      variantSymbolPadding: 2,
      geneVizMargin: {
        top: 0,
        right: self.isBasicMode || self.isEduMode ? 7 : 2,
        bottom: self.geneVizShowXAxis ? 18 : 0,
        left: self.isBasicMode || self.isEduMode ? 9 : 4
      },
      geneVizTrackHeight: self.isEduMode || self.isBasicMode ? 42 : 16,
      geneVizCdsHeight: self.isEduMode || self.isBasicMode ? 34 : 12,
      geneZoomVizMargin: {
        top: 10,
        right: 2,
        bottom: 10,
        left: 4
      },
      zoomStart: null,
      zoomEnd: null,

      depthVizMargin: {
        top: 32,
        right: self.isBasicMode || self.isEduMode ? 7 : 2,
        bottom: 0,
        left: self.isBasicMode || self.isEduMode ? 9 : 4
      },
      depthVizMarginOther: {
        top: 12,
        right: self.isBasicMode || self.isEduMode ? 7 : 2,
        bottom: 0,
        left: 4
      },
      depthVizYTickFormatFunc: null,
      coveragePoint: null,
      relationship: null,
      selectedExon: null,
      knownVariantsViz: null,
      sfariVariantsViz: null,
      showZoom: false,
      zoomMessage: "Drag to zoom",
      showRankedVariantsMenu: false,
      filteredVariants: null,
      pileupStyle: {},
      showFilter: false,
      showPopup: false,


      geneSource: null,
      noTranscriptsWarning: null,
      showNoTranscriptsWarning: false,
      analyzedTranscript: null


    }
  },

  methods: {
    depthVizYTickFormat: function(val) {
      if (val === 0) {
        return "";
      } else {
        return val + "x";
      }
    },
    depthVizRegionGlyph: function(exon, regionGroup, regionX, modelName) {
      if (exon.hasOwnProperty('exon_number') && exon.exon_number && exon.exon_number.length > 0) {
        let exonId = 'exon' + exon.exon_number.replace("/", "-");
        if (regionGroup.select("g#" + exonId).empty()) {
          regionGroup.append('g')
                .attr("id", exonId)
                .attr('class',      'region-glyph coverage-problem-glyph')
                .attr("modelName", modelName)
                .attr('transform',  'translate(' + (regionX - 6) + ',-6)')
                .data([exon])
                .append('use')
                .attr('height',     '16')
                .attr('width',      '16')
                .attr('href', '#coverage-problem-symbol')
                .attr('xlink','http://www.w3.org/1999/xlink')
                .data([exon])
                  .attr("modelName", this.sampleModel.name);
        }
        
      }
    },
    onVariantClick: function(variant, model) {
      if (this.showDepthViz) {
        if (variant) {
          this.showCoverageCircle(variant);
        }
      }
      if (this.showVariantViz) {
        if (variant) {
          this.showVariantCircle(variant, true);
        }
      }
      if (variant) {
        let left = variant.screenX - this.$el.offsetLeft - 50;
        let top  = variant.screenY - this.$el.offsetTop - this.variantSymbolHeight - 30;
        this.pileupStyle =  {display: 'flex', 'left': left + 'px', 'top': top + 'px'};
      }
      this.$emit('cohort-variant-click', variant, this, model.relationship);
    },

    onFilteredVariantsUpdate: function(filteredVariants){
      this.filteredVariants = filteredVariants;
    },

    onClose: function() {
      this.showPopup = false;
    },

    onVariantOutsideClick: function(model) {
      if (this.showDepthViz) {
        this.hideCoverageCircle();
      }
      if (this.showVariantViz) {
        this.hideVariantCircle(false);
        this.hideVariantTooltip(this);
      }
    },

    onShowFilter(showFilter){
      this.showFilter = showFilter;
    },

    onVariantHover: function(variant) {
      if (this.showDepthViz) {
        this.showCoverageCircle(variant);
      }
      if (this.showVariantViz) {
        this.showVariantCircle(variant);
        this.showVariantTooltip(variant, false);
      }
      this.$emit('cohort-variant-hover', variant, this);
    },
    onVariantHoverOther: function(variant) {
      if (this.showDepthViz) {
        this.showCoverageCircle(variant);
      }
      if (this.showVariantViz) {
        this.showVariantCircle(variant);
        this.showVariantTooltipOther(variant, false);
      }
    },
    onVariantHoverEnd: function() {
      if (this.showDepthViz) {
        this.hideCoverageCircle();
      }
      if (this.showVariantViz) {
        this.hideVariantCircle(false);
        this.hideVariantTooltip(this);
      }
      this.$emit('cohort-variant-hover-end');

    },
    onShowPileupForVariant: function() {
      this.$emit("show-pileup-for-variant", this.sampleModel.relationship, this.selectedVariant);
    },
    showVariantTooltip: function(variant, lock) {
      let self = this;

      if (this.isBasicMode || this.isEduMode || this.sampleModel.relationship === 'known-variants' || this.sampleModel.relationship === 'sfari-variants') {
        let tooltip = d3.select("#main-tooltip");

        if (lock) {
          tooltip.style("pointer-events", "all");
        } else {
          tooltip.style("pointer-events", "none");
        }
        const x = variant.screenX;
        const y = variant.screenY;
        const coord = {'x':                  x,
                     'y':                  y,
                     'height':             33,
                     'parentWidth':        self.$el.offsetWidth,
                     'preferredPositions': [ {top:    ['right', 'left','center'  ]},
                                             {right:  ['middle', 'top',  'bottom']},
                                             {left:   ['middle', 'top',  'bottom']},
                                             {bottom: ['center', 'right','left'  ]} ] };
        self.variantTooltip.fillAndPositionTooltip(tooltip,
          variant,
          self.selectedGene,
          self.selectedTranscript,
          lock,
          coord,
          self.sampleModel.relationship,
          self.sampleModel.getAffectedInfo(),
          self.sampleModel.cohort.mode,
          self.sampleModel.cohort.maxAlleleCount);
      }
    },
    showVariantTooltipOther: function(variant, lock) {
      let self = this;
      if (self.$refs.otherVariantVizRef == null) {
        return;
      }
      self.$refs.otherVariantVizRef.forEach(function(vizRef) {
        if (vizRef.model.relationship === 'known-variants'
          || vizRef.model.relationship === 'sfari-variants') {
          let tooltip = d3.select("#main-tooltip");
          if (lock) {
            tooltip.style("pointer-events", "all");
          } else {
            tooltip.style("pointer-events", "none");
          }
          const x = variant.screenX - 40;
          const y = variant.screenY - 2;
          const coord = {'x':                  x,
                       'y':                  y,
                       'height':             33,
                       'parentWidth':        self.$el.offsetWidth,
                       'preferredPositions': [ {top:    ['right', 'left','center'  ]},
                                               {right:  ['middle', 'top',  'bottom']},
                                               {left:   ['middle', 'top',  'bottom']},
                                               {bottom: ['center', 'right','left'  ]} ] };
          self.variantTooltip.fillAndPositionTooltip(tooltip,
            variant,
            self.selectedGene,
            self.selectedTranscript,
            lock,
            coord,
            vizRef.model.relationship,
            vizRef.model.getAffectedInfo(),
            vizRef.model.cohort.mode,
            vizRef.model.cohort.maxAlleleCount);
        }
      })
    },
    tooltipScroll(direction) {
      this.variantTooltip.scroll(direction, "#main-tooltip");
    },
    hideVariantTooltip: function() {
      let tooltip = d3.select("#main-tooltip");
      tooltip.transition()
           .duration(500)
           .style("opacity", 0)
           .style("z-index", 0)
           .style("pointer-events", "none");
    },
    showVariantCircle: function(variant, lock) {
      if (this.showVariantViz) {
        let vizRef = this.getVariantViz(variant);
        if (vizRef != null) {
          let matchingVariant = vizRef.showVariantCircle(variant,this.getVariantSVG(variant),lock);
          if (lock && matchingVariant && matchingVariant.screenX && matchingVariant.screenY) {
              let left = matchingVariant.screenX - this.$el.offsetLeft - 50;
              let top  = matchingVariant.screenY - this.$el.offsetTop - this.variantSymbolHeight - 30;
              this.pileupStyle =  {display: 'flex', 'left': left + 'px', 'top': top + 'px'};
          } else if (lock && !matchingVariant) {
              this.pileupStyle =  {display: 'none'};
          }
        }
      }
      this.showVariantCircleOther(variant, lock);
    },
    showVariantCircleOther: function(variant, lock) {
      let self = this;
      if (self.$refs.otherVariantVizRef == null) {
        return;
      }

      self.$refs.otherVariantVizRef.forEach(function(vizRef) {
        let matchingVariant = vizRef.showVariantCircle(
                                      variant,
                                      self.getOtherVariantSVG(variant, vizRef.model.relationship),lock);
        if (lock && matchingVariant && matchingVariant.screenX && matchingVariant.screenY) {
            let left = matchingVariant.screenX - self.$el.offsetLeft - 50;
            let top  = matchingVariant.screenY - self.$el.offsetTop - self.variantSymbolHeightOther - 30;
            self.pileupStyle =  {display: 'flex', 'left': left + 'px', 'top': top + 'px'};
        } else if (lock && !matchingVariant) {
            self.pileupStyle =  {display: 'none'};
        }
      })
    },
    hideVariantCircle: function(lock) {
      if (this.showVariantViz) {
        let container = d3.select(this.$el).select('#loaded-variant-viz > svg');
        // Have to check that container exists for when we hide SFARI track variants for blacklisted genes to prevent circling errors
        if (container && container[0] && container[0][0] != null) {
            this.$refs.variantVizRef.hideVariantCircle(container, lock, false, this.selectedVariant);
        }
        container = d3.select(this.$el).select('#called-variant-viz > svg');
        if (container && container[0] && container[0][0] != null) {
            this.$refs.variantVizRef.hideVariantCircle(container, lock, true, this.selectedVariant);
        }
      }
      this.hideVariantCircleOther(lock);
    },
    hideVariantCircleOther: function(variant, lock) {
      let self = this;

      if (self.$refs.otherVariantVizRef == null) {
        return;
      }
      self.$refs.otherVariantVizRef.forEach(function(vizRef) {
        let container = d3.select(self.$el).select('#loaded-variant-viz-'
                                                   + vizRef.model.relationship + ' > svg');
        // Have to check that container exists for when we hide SFARI track variants for blacklisted genes to prevent circling errors
        if (container && container[0] && container[0][0] != null) {
            vizRef.hideVariantCircle(container, lock);
        }
        container = d3.select(self.$el).select('#called-variant-viz-'
                                               + vizRef.model.relationship + ' > svg');
        if (container && container[0] && container[0][0] != null) {
            vizRef.hideVariantCircle(container, lock);
        }
      })
    },
    getVariantViz: function(variant) {
      return variant.fbCalled && variant.fbCalled === 'Y'
          ? this.$refs.calledVariantVizRef
          : this.$refs.variantVizRef;
    },
    getVariantSVG: function(variant) {
      return variant.fbCalled && variant.fbCalled === 'Y'
          ? d3.select(this.$el).select('#called-variant-viz > svg')
          : d3.select(this.$el).select('#loaded-variant-viz > svg');
    },
    getOtherVariantSVG: function(variant, relationship) {
      return variant.fbCalled && variant.fbCalled === 'Y'
          ? d3.select(this.$el).select('#called-variant-viz-' + relationship + ' > svg')
          : d3.select(this.$el).select('#loaded-variant-viz-' + relationship + ' > svg');
    },
    hideCoverageCircle: function() {
      if (this.showDepthViz && this.$refs.depthVizRef) {
        this.$refs.depthVizRef.hideCurrentPoint();
      }
      this.hideCoverageCircleOther();
    },
    hideCoverageCircleOther: function() {
      let self = this;
      if (self.$refs.otherDepthVizRef == null) {
        return;
      }
      self.$refs.otherDepthVizRef.forEach(function(depthVizRef) {
        depthVizRef.hideCurrentPoint();
      })
    },
    showCoverageCircle: function(variant) {
      let self = this;

      if (self.showDepthViz && self.sampleModel.coverage != null) {
        let theDepth = null;
        let theAltCount = null;
        const matchingVariants = self.sampleModel.loadedVariants.features.filter(function(v) {
          return v.start === variant.start && v.alt === variant.alt && v.ref === variant.ref;
        })
        if (matchingVariants.length > 0) {
          theDepth = matchingVariants[0].bamDepth;
          // If samtools mpileup didn't return coverage for this position, use the variant's depth field
          if (theDepth == null || theDepth === '') {
            theDepth = matchingVariants[0].genotypeDepth;
          }
          if (matchingVariants[0].genotype && matchingVariants[0].genotype.altCount) {
            theAltCount = matchingVariants[0].genotype.altCount;
          }
        }
        // If we have the exact depth for this variant, show it.  Otherwise, we will show
        // the calculated (binned, averaged) depth at this position.
        let currentPoint = {pos: variant.start, depth: theDepth, altCount: theAltCount}
        self.$refs.depthVizRef.showCurrentPoint(currentPoint);
      }
      self.showCoverageCircleOther(variant);
    },
    showCoverageCircleOther(variant) {
      let self = this;
      if (self.$refs.otherDepthVizRef == null) {
        return;
      }
      self.$refs.otherDepthVizRef.forEach(function(depthVizRef) {
        if (depthVizRef && depthVizRef.model && depthVizRef.model.coverage  && depthVizRef.model.coverage.length > 0) {
          let theDepth = null;
          let theAltCount = null;
          let matchingVariants = depthVizRef.model.loadedVariants.features.filter(function(v) {
            return v.start === variant.start && v.alt === variant.alt && v.ref === variant.ref;
          });
          if (matchingVariants.length > 0) {
            theDepth = matchingVariants[0].bamDepth;
            // If samtools mpileup didn't return coverage for this position, use the variant's depth field
            if (theDepth == null || theDepth === '') {
              theDepth = matchingVariants[0].genotypeDepth;
            }
            if (matchingVariants[0].genotype && matchingVariants[0].genotype.altCount) {
              theAltCount = matchingVariants[0].genotype.altCount;
            }
          }

          // If we have the exact depth for this variant, show it.  Otherwise, we will show
          // the calculated (binned, averaged) depth at this position.
          let currentPoint = {pos: variant.start, depth: theDepth, altCount: theAltCount}
          depthVizRef.showCurrentPoint(currentPoint);
        }
      })

    },
    onKnownVariantsVizChange: function(viz, selectedCategories) {
      this.knownVariantsViz = viz;
      this.$emit("known-variants-viz-change", viz, selectedCategories);
    },
    onKnownVariantsFilterChange: function(selectedCategories) {
      this.$emit("known-variants-filter-change", selectedCategories);
    },
    onSfariVariantsVizChange: function(viz) {
      this.sfariVariantsViz = viz;
      this.$emit("sfari-variants-viz-change", viz);
    },
    onSfariVariantsFilterChange: function(selectedCategories) {
        this.$emit("sfari-variants-filter-change", selectedCategories);
    },
    onOptionalTrackClose: function() {
      this.$emit("optional-track-close");
    },
    onShowMotherCard: function(showIt) {
      let self = this;
      self.$emit("show-mother-card", showIt);
    },
    onShowFatherCard: function(showIt) {
      let self = this;
      self.$emit("show-father-card", showIt);
    },
    onShowKnownVariantsCard: function(showIt, selectedCategories) {
      let self = this;
      self.$emit("show-known-variants-card", showIt, selectedCategories);
    },
    onShowSfariVariantsCard: function(showIt) {
      let self = this;
      self.$emit("show-sfari-variants-card", showIt);
    },
    showFlaggedVariant: function(variant) {
      if (this.showVariantViz) {
        this.getVariantViz(variant).showFlaggedVariant(variant, this.getVariantSVG(variant));
      }
    },
    getExonClass: function(exon, i, relationship) {
      if (this.showDepthViz && exon.danger) {
        return exon.feature_type.toLowerCase() + (exon.danger[relationship] ? " danger" : "");
      } else {
        return exon.feature_type.toLowerCase();
      }
    },
    getSampleFromHover: function(e){
      let modelName = "";
      if(e[0][0].attributes.modelName) {
        modelName = e[0][0].attributes.modelName.value;
      }
      for(let i = 0; i < this.otherModels.length; i++){
        if(modelName === this.otherModels[i].name){
          return this.otherModels[i];
        }
      }
      if(modelName === this.sampleModel.name){
        return this.sampleModel;
      }
      return this.sampleModel;
    },
    showExonTooltip: function(featureObject, feature, lock) {
      let self = this;
      let tooltip = d3.select("#exon-tooltip");

      if (featureObject == null) {
        self.hideExonTooltip();
        return;
      }

      if (self.selectedExon) {
        return;
      }

      if (lock) {
        self.selectedExon = feature;
        tooltip.style("pointer-events", "all");
        tooltip.classed("locked", true);
      } else {
        tooltip.style("pointer-events", "none");
        tooltip.classed("locked", false);
      }

      const coverageRow = function(fieldName, coverageVal, covFields) {
        let row = '<div>';
        row += '<span style="padding-left:10px;width:60px;display:inline-block">' + fieldName   + '</span>';
        row += '<span style="width:40px;display:inline-block">' + d3.round(coverageVal) + '</span>';
        row += '<span class="' + (covFields[fieldName] ? 'danger' : '') + '">' + (covFields[fieldName] ? covFields[fieldName]: '') + '</span>';
        row += "</div>";
        return row;
      };
      let sample = self.getSampleFromHover(featureObject);

      let html = self.globalAppProp.utility.formatExonTooltip(sample.cohort.filterModel,
                                                              sample.relationship,
                                                              coverageRow,
                                                              feature,
                                                              lock);
      tooltip.html(html);
      if (lock) {
        tooltip.select("#exon-tooltip-thresholds").on("click", function() {
          self.$emit("show-coverage-cutoffs");
          self.selectedExon = null;
          self.hideExonTooltip(true);
        })
        tooltip.select("#exon-tooltip-close").on("click", function() {
          self.selectedExon = null;
          self.hideExonTooltip(true);
        })
      }

      const coord = self.globalAppProp.utility.getTooltipCoordinates(featureObject.node(),
        tooltip, self.$el.offsetWidth, 0);

      tooltip.style("left", (coord.x) + "px")
             .style("text-align", 'left')
             .style("top", coord.y + "px");
      tooltip.style("z-index", 1032);
      tooltip.transition()
             .duration(200)
             .style("opacity", .9);
    },
    hideExonTooltip: function(force) {
      let self = this;
      let tooltip = d3.select("#exon-tooltip");
      if (force || !self.selectedExon) {
        tooltip.classed("locked", false);
        tooltip.classed("black-arrow-left", false);
        tooltip.classed("black-arrow-right", false);
        tooltip.style("pointer-events", "none");
        tooltip.transition()
           .duration(500)
           .style("opacity", 0);
      }
    },
    onRegionZoom: function(regionStart, regionEnd) {
      this.zoomMessage = "Click to zoom out";
      this.zoomStart = regionStart;
      this.zoomEnd = regionEnd;
      this.$emit('gene-region-zoom', regionStart, regionEnd);
    },
    onRegionZoomReset: function() {
      this.showZoom = false;
      this.zoomMessage = "Drag to zoom";
      this.$emit('gene-region-zoom-reset');
    },
    onRankedVariantClick: function(variant) {
      this.showVariantCircle(variant, true);
      this.$emit('cohort-variant-click', variant, this, this.sampleModel.relationship);
      this.showRankedVariantsMenu = false;
    },
    onRankedVariantHover: function(variant, sourceComponent) {
      this.$emit("cohort-variant-hover", variant, sourceComponent);
    },
    onRankedVariantHoverEnd: function(sourceVariantCard) {
      this.$emit("cohort-variant-hover-end", sourceVariantCard);
    },
    getSampleRelLabelOther: function(model) {
      let self = this;
      let label = "";
      if (model.relationship === 'known-variants' && self.selectedGene && self.selectedGene.hasOwnProperty('gene_name')) {
        label = "Known ClinVar variants across population in " + self.selectedGene.gene_name
      } else if (model.relationship === 'known-variants') {
        label = "ClinVar variants"
      } else if (model === 'sfari-variants') {
        label = "SFARI"
      } else {
        if (model.cohort.mode === 'trio' &&  model.relationship !== 'known-variants'
            && model.relationship !== 'sfari-variants' && model.relationship !== model.name) {
          label = self.globalApp.utility.capitalizeFirstLetter(model.relationship) + " ";
          label += "  " + model.name;
        }
      }
      return label;
    }

  },


  computed: {
    sampleRelLabel: function() {
      let self = this;
      let label = "";
      if (self.isEduMode) {
        label = self.globalApp.utility.capitalizeFirstLetter(this.sampleModel.name) + "'s Variants";
      } else if (this.sampleModel.relationship === 'proband') {
        label = "Variants"
      } else if (this.sampleModel.isAlignmentsOnly()) {
        label += this.globalApp.utility.capitalizeFirstLetter(this.sampleModel.relationship);
        label += " Proband Variants in " + this.selectedGene.gene_name;
      } else {
        if (this.sampleModel.relationship === 'known-variants') {
          label = "ClinVar Variants"
        } else if (this.sampleModel.relationship === 'sfari-variants') {
          label = "SFARI Variants"
        } else {
          if (this.sampleModel.cohort.mode === 'trio' && this.sampleModel.relationship !== 'known-variants'
              && this.sampleModel.relationship !== 'sfari-variants' && this.sampleModel.relationship !== this.sampleModel.name) {
            label = this.globalApp.utility.capitalizeFirstLetter(this.sampleModel.relationship) + " ";
          }
          label += "Variants ";
        }
      }
      return label.toUpperCase();
    },
    sampleLabel: function() {
      let label = "";
      if (this.sampleModel.isAlignmentsOnly()) {
      } else {
        if (this.sampleModel.relationship === 'known-variants') {
        } else if (this.sampleModel.relationship === 'sfari-variants') {
        } else {
          label += this.sampleModel.name;
        }
      }
      return label;
    }
  },

  watch: {
    regionStart: function(){
      if(this.zoomStart !== this.regionStart && this.showZoom) {
        this.$emit('gene-region-zoom', this.zoomStart, this.zoomEnd);
      }
    },
    regionEnd: function(){
      if(this.zoomEnd !== this.regionEnd && this.showZoom) {
        this.$emit('gene-region-zoom', this.zoomStart, this.zoomEnd);
      }
    },
    showZoom: function() {
      if (!this.showZoom) {
        this.zoomMessage = "Drag to zoom";
        this.$emit('gene-region-zoom-reset');
      }
    },
    clearZoom: function() {
      this.showZoom = false;
      this.zoomMessage = "Drag to zoom";
    }
  },

  mounted: function() {
  },

  created: function() {
    this.depthVizYTickFormatFunc = this.depthVizYTickFormat ? this.depthVizYTickFormat : null;
  }
}
</script>
