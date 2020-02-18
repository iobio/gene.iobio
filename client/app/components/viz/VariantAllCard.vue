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
    color: $app-color
    font-size: 16px

  #sample-identifier
    width: 130px
    display: inline-block
    vertical-align: middle
    padding-top: 5px
    line-height: 13px
    white-space: normal
    font-size: 13px !important
    color: $text-color !important

  #variant-pileup-button
    position: absolute
    top: 0px
    left: 0px
    display: none !important

  .variant-action-button
    background-color: white
    padding: 0px
    height: 22px !important
    min-width: 70px
    margin-left: 15px
    margin-right: 0px
    margin-bottom: 0px
    vertical-align: top
    margin-top: 4px

    .btn__content, .v-btn__content
      color: $app-color !important
      padding-left: 8px
      padding-right: 8px
      font-size: 13px

      i.material-icons
        color: $app-color
        font-size: 14px
        padding-right: 2px
        padding-top: 0px


  .coverage-problem-glyph
    fill: $coverage-problem-glyph-color


  #gene-viz, #gene-viz-zoom
    .transcript.current
      outline: none !important
      font-weight: normal !important
    .axis
      padding-left: 0px
      padding-right: 0px
      margin-top: -10px
      margin-bottom: 0px
      padding-bottom: 0px
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
    font-size: 12px
    color: $app-color


  #gene-viz-zoom
    .current
      outline: none

    .cds, .exon, .utr
      fill: rgba(159, 159, 159, 0.63)
      stroke: rgb(159, 159, 159)


  .zoom-switch
    margin-left: 5px
    display: inline-block
    margin-top: 0px !important
    max-width: 80px
    float: right
    margin-right: 20px
    margin-left: 30px
    padding-top: 0px

    label
      padding-left: 0px
      line-height: 18px
      font-size: 13px
      font-weight: 400
      padding-top: 5px
      color: $text-color

  .badge, .v-badge
    padding: 0px 5px 0px 0px
    padding: 3px 7px
    background-color: white
    color: $text-color
    font-weight: normal
    font-size: 13px
    padding-top: 2px

    &.called
      vertical-align: top
      padding-top: 4px
      .badge__badge, .v-badge__badge
        background-color: #efeeee !important
        border: thin solid #bfbdbd !important
        color: $text-color !important
    &.loaded
      vertical-align: top
      padding-top: 4px
      padding-left: 0px
      margin-left: 15px
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
      top: 0px
      background-color: $light-badge-color !important

  #known-variants-chart
    padding: 0px
    margin-top: 0px
    margin-bottom: 0px


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
    padding: 0px
    margin-top: 0px
    margin-bottom: 0px

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
      min-height: 0px !important
      .circle
        fill: #404040 !important
      .circle-label
        fill: #868686 !important

</style>

<style lang="css">

</style>


<template>

  <v-card tile id="variant-card" class="app-card">
    <div style="display: flex;align-items: center;margin-bottom: 5px;">
      <span
         id="sample-label"
         v-bind:class="sampleModel.relationship">
        <span style="display:inline-block"> {{ sampleRelLabel }} in {{ selectedGene.gene_name }}</span>




      </span>


        <optional-tracks-menu
            v-show="!isEduMode && !isBasicMode"
            @show-known-variants-card="onShowKnownVariantsCard"
            @show-sfari-variants-card="onShowSfariVariantsCard"
            @show-mother-card="onShowMotherCard"
            @show-father-card="onShowFatherCard"
            @optional-track-close="onOptionalTrackClose"
            @known-variants-viz-change="onKnownVariantsVizChange"
            @known-variants-filter-change="onKnownVariantsFilterChange"
            @sfari-variants-viz-change="onSfariVariantsVizChange"
            @sfari-variants-filter-change="onSfariVariantsFilterChange"
        ></optional-tracks-menu>


        <ranked-variants-menu v-if="sampleModel && sampleModel.relationship == 'proband'"
          v-show="!isEduMode && !isBasicMode"
          :isEduMode="isEduMode"
          :isBasicMode="isBasicMode"
          :featureMatrixModel="featureMatrixModel"
          :selectedGene="selectedGene"
          :selectedTranscript="selectedTranscript"
          :selectedVariant="selectedVariant"
          :variantTooltip="variantTooltip"
          @ranked-variant-click="onRankedVariantClick"
          @ranked-variant-hover="onRankedVariantHover"
          @ranked-variant-hover-end="onRankedVariantHoverEnd"
        >
        </ranked-variants-menu>


        <v-badge  id="loaded-count"
        v-if="!isEduMode && !isBasicMode && sampleModel.loadedVariants && sampleModel.cohort.geneModel.geneDangerSummaries[selectedGene.gene_name] && !(sampleModel.isSfariSample && blacklistedGeneSelected)" class="loaded mr-4 " >
          <span slot="badge"> {{ sampleModel.relationship != 'known-variants' || knownVariantsViz == 'variants' ? sampleModel.loadedVariants.features.length : sampleModel.variantHistoCount  }} </span>
          {{ isBasicMode || sampleModel.relationship == 'known-variants' ? 'Count' : 'Variants' }}
        </v-badge>
        <v-badge id="called-count"
          v-if="sampleModel.relationship != 'known-variants' && sampleModel.cohort.geneModel.geneDangerSummaries[selectedGene.gene_name] && sampleModel.cohort.geneModel.geneDangerSummaries[selectedGene.gene_name].CALLED "
          class="mr-4  called">
          <span v-if="sampleModel.loadedVariants"  slot="badge"> {{ sampleModel.calledVariants.features.length }} </span>
          Called
        </v-badge>
        <v-badge  v-if="sampleModel.loadedVariants && coverageDangerRegions.length > 0 && !(sampleModel.isSfariSample && blacklistedGeneSelected)" class="ml-4 mr-4 coverage-problem" >
          <span slot="badge"> {{ coverageDangerRegions.length }} </span>
          Exons with insufficient coverage
        </v-badge>





      <v-switch v-if="sampleModel.relationship == 'proband' && sampleModel.loadedVariants && sampleModel.cohort.geneModel.geneDangerSummaries[selectedGene.gene_name]  && !isEduMode && !isBasicMode && !(sampleModel.isSfariSample && blacklistedGeneSelected)" class="zoom-switch" style="max-width:80px"
      label="Zoom"
      v-model="showZoom"
      :hide-details="true"
      >
      </v-switch>


      <v-btn id="variant-pileup-button"
       class="variant-action-button"
       v-if="sampleModel.isBamLoaded() && selectedVariant && sampleModel.relationship !== 'known-variants'
        && sampleModel.relationship !== 'sfari-variants' && !isEduMode && !isBasicMode && !(sampleModel.isSfariSample && blacklistedGeneSelected)"
       :style="pileupStyle"
       @click="onShowPileupForVariant">
        <v-icon>line_style</v-icon>
        Pileup
      </v-btn>



      <sfari-variants-toolbar
        v-if="sampleModel.relationship === 'sfari-variants'"
        @sfariVariantsVizChange="onSfariVariantsVizChange"
        @sfariVariantsFilterChange="onSfariVariantsFilterChange">
      </sfari-variants-toolbar>

    </div>





      <div style="width:100%">

        <div style="text-align: center;clear: both;">
          <div class="loader vcfloader" v-bind:class="{ hide: !sampleModel.inProgress.loadingVariants }" style="display: inline-block;padding-bottom:10px">
            <span class="loader-label">Annotating variants</span>
            <img src="../../../assets/images/wheel.gif">
          </div>
          <div class="loader fbloader" v-bind:class="{ hide: !sampleModel.inProgress.callingVariants }" style="display: inline-block;padding-left: 20px;adding-bottom:10px">
            <span class="loader-label">Calling variants</span>
            <img src="../../../assets/images/wheel.gif">
          </div>
          <div class="loader covloader" v-bind:class="{ hide: !sampleModel.inProgress.loadingCoverage }" style="display: inline-block;padding-left: 20px;padding-bottom:10px">
            <span class="loader-label">Analyzing gene coverage</span>
            <img src="../../../assets/images/wheel.gif">
          </div>
          <v-badge v-if="showZoom" class="info" style="margin-bottom:5px">{{ zoomMessage }}</v-badge>
        </div>


      </div>

      <div style="width:100%">
        <gene-viz id="gene-viz-zoom"
        v-if="showZoom"
        :data="[selectedTranscript]"
        :margin="geneZoomVizMargin"
        :width="width"
        :showXAxis="false"
        :trackHeight="geneVizTrackHeight + 20"
        :cdsHeight="geneVizCdsHeight + 20"
        :regionStart="parseInt(selectedGene.start)"
        :regionEnd="parseInt(selectedGene.end)"
        :showBrush="true"
        @region-zoom="onRegionZoom"
        @region-zoom-reset="onRegionZoomReset"
        >
        </gene-viz>

        <div class="chart-label"
        v-if="showVariantViz && sampleModel.cohort.geneModel.geneDangerSummaries[selectedGene.gene_name] && sampleModel.cohort.geneModel.geneDangerSummaries[selectedGene.gene_name].CALLED && sampleModel.calledVariants && sampleModel.calledVariants.features.length > 0"
        >
          called variants
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
          @variantClick="onVariantClick"
          @variantOutsideClick="onVariantOutsideClick"
          @variantHover="onVariantHover"
          @variantHoverEnd="onVariantHoverEnd">
        </variant-viz>

        <div class="chart-label"
        v-show="!isEduMode && !isBasicMode && showVariantViz && sampleModel.loadedVariants && sampleModel.relationship !== 'known-variants' && sampleModel.relationship !== 'sfari-variants' && !(sampleModel.isSfariSample && blacklistedGeneSelected)"
        >
          Proband variants  {{ sampleLabel }}
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
          :showWhenEmpty="true"
          :showTransition="true"
          :classifySymbolFunc="classifyVariantSymbolFunc"
          @variantClick="onVariantClick"
          @variantHover="onVariantHover"
          @variantHoverEnd="onVariantHoverEnd">
        </variant-viz>

        <div class="chart-label"
        v-if="showDepthViz && sampleModel.coverage && sampleModel.coverage.length > 1 && !(sampleModel.isSfariSample && blacklistedGeneSelected)"
        >
          Proband coverage
        </div>

        <div id="bam-track">

          <depth-viz
            v-if="showDepthViz && !(sampleModel.isSfariSample && blacklistedGeneSelected)"
            ref="depthVizRef"
            :data="sampleModel.coverage"
            :coverageMedian="sampleModel.cohort.filterModel.geneCoverageMedian"
            :coverageDangerRegions="coverageDangerRegions"
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
            @region-selected="showExonTooltip"
          >
          </depth-viz>
        </div>

        <gene-viz id="gene-viz"
          :style="isEduMode ? `margin-top: 20px` : `margin-top:-5px`"
          v-bind:class="{ hide: !showGeneViz && !(sampleModel.isSfariSample && blacklistedGeneSelected) }"
          :data="[selectedTranscript]"
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
          @feature-selected="showExonTooltip"
          >
        </gene-viz>



        <div class="other-samples" style="margin-top:0px" v-for="model in otherModels" :key="model.relationship">
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
            :regionStart="regionStart"
            :regionEnd="regionEnd"
            :annotationScheme="annotationScheme"
            :width="width"
            :margin="variantVizMargin"
            :variantHeight="variantSymbolHeightOther"
            :variantPadding="variantSymbolPadding"
            :showBrush="false"
            :showXAxis="true"
            :showWhenEmpty="false"
            :classifySymbolFunc="model.relationship === 'known-variants' ? model.classifyByClinvar : model.classifyByImpact"
            @variantClick="onVariantClick"
            @variantHover="onVariantHoverOther"
            @variantHoverEnd="onVariantHoverEnd">
          </variant-viz>

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
            :model="model"
            :coverageMedian="model.cohort.filterModel.geneCoverageMedian"
            :coverageDangerRegions="model.coverageDangerRegions"
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
import VariantViz           from "../viz/VariantViz.vue"
import DepthViz             from "../viz/DepthViz.vue"
import RankedVariantsMenu   from "../viz/RankedVariantsMenu.vue"
import StackedBarChartViz   from "../viz/StackedBarChartViz.vue"
import KnownVariantsToolbar from "../partials/KnownVariantsToolbar.vue"
import SfariVariantsToolbar from "../partials/SfariVariantsToolbar.vue"
import OptionalTracksMenu   from "../partials/OptionalTracksMenu.vue"

export default {
  name: 'variant-all-card',
  components: {
    VariantViz,
    GeneViz,
    DepthViz,
    RankedVariantsMenu,
    KnownVariantsToolbar,
    SfariVariantsToolbar,
    StackedBarChartViz,
    OptionalTracksMenu
  },
  props: {
    globalAppProp: null,  //For some reason, global mixin not working on variant card.  possible cause for-item?
    isEduMode: null,
    isBasicMode: null,
    clearZoom: null,
    sampleModel: null,
    annotationScheme: null,
    classifyVariantSymbolFunc: null,
    coverageDangerRegions: null,
    otherModels: null,

    variantTooltip: null,
    selectedGene: {},
    selectedTranscript: {},

    selectedVariant: null,
    regionStart: 0,
    regionEnd: 0,
    width: 0,


    showVariantViz: true,
    showGeneViz: true,
    showDepthViz: true,
    geneVizShowXAxis: null,

    featureMatrixModel: null,

    blacklistedGeneSelected: false,  // True if selected gene falls in SFARI ACMG blacklist

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
      geneVizTrackHeight: self.isEduMode || self.isBasicMode ? 32 : 16,
      geneVizCdsHeight: self.isEduMode || self.isBasicMode ? 24 : 12,

      geneZoomVizMargin: {
        top: 10,
        right: 2,
        bottom: 10,
        left: 4
      },

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

      pileupStyle: {}


    }
  },


  methods: {
    depthVizYTickFormat: function(val) {
      if (val == 0) {
        return "";
      } else {
        return val + "x";
      }
    },
    depthVizRegionGlyph: function(exon, regionGroup, regionX) {
      var exonId = 'exon' + exon.exon_number.replace("/", "-");
      if (regionGroup.select("g#" + exonId).empty()) {
        regionGroup.append('g')
              .attr("id", exonId)
              .attr('class',      'region-glyph coverage-problem-glyph')
              .attr('transform',  'translate(' + (regionX - 6) + ',-32)')
              .data([exon])
              .append('use')
              .attr('height',     '16')
              .attr('width',      '16')
              .attr('href', '#coverage-problem-symbol')
              .attr('xlink','http://www.w3.org/1999/xlink')
              .data([exon]);
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
    onVariantOutsideClick: function(model) {
      if (this.showDepthViz) {
        this.hideCoverageCircle();
      }
      if (this.showVariantViz) {
        this.hideVariantCircle(false);
        this.hideVariantTooltip(this);
      }

      this.$emit('cohort-variant-outside-click', this, model.relationship);
    },
    onVariantHover: function(variant, showTooltip=true) {
      if (this.showDepthViz) {
        this.showCoverageCircle(variant);
      }
      if (this.showVariantViz) {
        this.showVariantCircle(variant);
        this.showVariantTooltip(variant, false);
      }
      this.$emit('cohort-variant-hover', variant, this);
    },
    onVariantHoverOther: function(variant, showTooltip=true) {
      if (this.showDepthViz) {
        this.showCoverageCircle(variant);
      }
      if (this.showVariantViz) {
        this.showVariantCircle(variant);
        this.showVariantTooltipOther(variant, false);
      }
    },
    onVariantHoverEnd: function(lock) {
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


        var x = variant.screenX;
        var y = variant.screenY;

        var coord = {'x':                  x,
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


          var x = variant.screenX - 40;
          var y = variant.screenY - 2;

          var coord = {'x':                  x,
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
            this.$refs.variantVizRef.hideVariantCircle(container, lock);
        }

        container = d3.select(this.$el).select('#called-variant-viz > svg');
        if (container && container[0] && container[0][0] != null) {
            this.$refs.variantVizRef.hideVariantCircle(container, lock);
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
      return variant.fbCalled && variant.fbCalled == 'Y'
          ? this.$refs.calledVariantVizRef
          : this.$refs.variantVizRef;
    },
    getVariantSVG: function(variant) {
      return variant.fbCalled && variant.fbCalled == 'Y'
          ? d3.select(this.$el).select('#called-variant-viz > svg')
          : d3.select(this.$el).select('#loaded-variant-viz > svg');
    },
    getOtherVariantSVG: function(variant, relationship) {
      return variant.fbCalled && variant.fbCalled == 'Y'
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
        var matchingVariants = self.sampleModel.loadedVariants.features.filter(function(v) {
          return v.start == variant.start && v.alt == variant.alt && v.ref == variant.ref;
        })

        if (matchingVariants.length > 0) {
          theDepth = matchingVariants[0].bamDepth;
          // If samtools mpileup didn't return coverage for this position, use the variant's depth
          // field.
          if (theDepth == null || theDepth == '') {
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

        if (depthVizRef.model.coverage != null && depthVizRef.model.coverage.length > 0) {
          let theDepth = null;
          let theAltCount = null;
          var matchingVariants = depthVizRef.model.loadedVariants.features.filter(function(v) {
            return v.start == variant.start && v.alt == variant.alt && v.ref == variant.ref;
          })

          if (matchingVariants.length > 0) {
            theDepth = matchingVariants[0].bamDepth;
            // If samtools mpileup didn't return coverage for this position, use the variant's depth
            // field.
            if (theDepth == null || theDepth == '') {
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
    onKnownVariantsVizChange: function(viz) {
      this.knownVariantsViz = viz;
      this.$emit("known-variants-viz-change", viz);
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
    onShowKnownVariantsCard: function(showIt) {
      let self = this;
      self.$emit("show-known-variants-card", showIt);
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
    getExonClass: function(exon, i) {
      if (this.showDepthViz && exon.danger) {
        return exon.feature_type.toLowerCase() + (exon.danger[this.sampleModel.relationship] ? " danger" : "");
      } else {
        return exon.feature_type.toLowerCase();
      }
    },
    showExonTooltip: function(featureObject, feature, lock) {
      let self = this;
      let tooltip = d3.select("#exon-tooltip");


      console.log("showExonTooltip 4 inside VariantAllCard");

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

      var coverageRow = function(fieldName, coverageVal, covFields) {
        var row = '<div>';
        row += '<span style="padding-left:10px;width:60px;display:inline-block">' + fieldName   + '</span>';
        row += '<span style="width:40px;display:inline-block">' + d3.round(coverageVal) + '</span>';
        row += '<span class="' + (covFields[fieldName] ? 'danger' : '') + '">' + (covFields[fieldName] ? covFields[fieldName]: '') + '</span>';
        row += "</div>";
        return row;
      }

      let html = self.globalAppProp.utility.formatExonTooltip(self.sampleModel.cohort.filterModel,
                                                              self.sampleModel.getRelationship(),
                                                              coverageRow,
                                                              feature,
                                                              lock)

      tooltip.html(html);
      if (lock) {
        tooltip.select("#exon-tooltip-thresholds").on("click", function() {
          self.$emit("show-coverage-cutoffs");
        })
        tooltip.select("#exon-tooltip-close").on("click", function() {
          self.selectedExon = null;
          self.hideExonTooltip(true);
        })
      }

      var coord = self.globalAppProp.utility.getTooltipCoordinates(featureObject.node(),
        tooltip, self.$el.offsetWidth, 15);

      console.log("coord", coord);


      tooltip.style("left", (coord.x - 25) + "px")
             .style("text-align", 'left')
             .style("top", coord.y + "px");

      console.log("VariantAllCard 4, x and y");
      console.log("coord.x, coord.y", coord.x, coord.y);

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
      this.$emit('gene-region-zoom', regionStart, regionEnd);
    },
    onRegionZoomReset: function() {
      this.zoomMessage = "Drag to zoom";
      this.$emit('gene-region-zoom-reset');
    },
    onRankedVariantClick: function(variant, sourceComponent, sourceRelationship) {
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
      var label = "";
      if (model.relationship == 'known-variants') {
        label = "ClinVar"
      } else if (model == 'sfari-variants') {
        label = "SFARI"
      } else {
        if (model.cohort.mode === 'trio' &&  model.relationship !== 'known-variants'
            && model.relationship !== 'sfari-variants' && model.relationship !== model.name) {
          label = self.globalApp.utility.capitalizeFirstLetter(model.relationship) + " ";
          label += "  " + model.name;
        }
      }
      return label;
    },

  },


  filters: {
  },

  computed: {
    sampleRelLabel: function() {
      let self = this;
      var label = "";
      if (self.isEduMode) {
        label = self.globalApp.utility.capitalizeFirstLetter(this.sampleModel.name) + "'s Variants";
      } else if (this.sampleModel.relationship == 'proband') {
        label = "Variants"
      } else if (this.sampleModel.isAlignmentsOnly()) {
        label += this.globalApp.utility.capitalizeFirstLetter(this.sampleModel.relationship);
        label += " Proband Variants in " + this.selectedGene.gene_name;
      } else {
        if (this.sampleModel.relationship == 'known-variants') {
          label = "ClinVar Variants"
        } else if (this.sampleModel.relationship == 'sfari-variants') {
          label = "SFARI Variants"
        } else {
          if (this.sampleModel.cohort.mode === 'trio' && this.sampleModel.relationship !== 'known-variants'
              && this.sampleModel.relationship !== 'sfari-variants' && this.sampleModel.relationship !== this.sampleModel.name) {
            label = this.globalApp.utility.capitalizeFirstLetter(this.sampleModel.relationship) + " ";
          }
          label += "Variants ";

        }
      }
      return label;
    },
    sampleLabel: function() {
      var label = "";
      if (this.sampleModel.isAlignmentsOnly()) {
      } else {
        if (this.sampleModel.relationship == 'known-variants') {
        } else if (this.sampleModel.relationship == 'sfari-variants') {
        } else {
          label += this.sampleModel.name;
        }
      }
      return label;
    },
    depthVizHeight: function() {
      this.showDepthViz ? 0 : 60;
    }

  },

  watch: {
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
    this.relationship = this.sampleModel.relationship;

  },

  created: function() {
    this.depthVizYTickFormatFunc = this.depthVizYTickFormat ? this.depthVizYTickFormat : null;
  }



}
</script>
