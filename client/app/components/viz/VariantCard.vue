/*
 * Variant.vue
 *
 */
<style lang="sass">

#bam-track
  margin-top: -5px

#variant-card
  #gene-viz
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

</style>

<style lang="css">

</style>


<template>

  <v-card tile id="variant-card" class="app-card">
    <v-card-title primary-title>
      {{ name }}
      <div style="width:100%">

        <div style="text-align: center;clear: both;">
          <div class="loader vcfloader" v-bind:class="{ hide: !inProgress }" style="display: inline-block;">
            <span class="loader-label">Annotating variants</span>
            <img src="../../../assets/images/wheel.gif">
          </div>
          <div class="loader fbloader hide" style="display: inline-block;padding-left: 20px;">
            <span class="loader-label">Calling variants</span>
            <img src="../../../assets/images/wheel.gif">
          </div>
          <div class="loader covloader hide" style="display: inline-block;padding-left: 20px;">
            <span class="loader-label">Analyzing gene coverage</span>
            <img src="../../../assets/images/wheel.gif">
          </div>
        </div>

        <variant-viz
          v-if="showVariantViz"
          :data="loadedVariants"
          :regionStart="regionStart"
          :regionEnd="regionEnd"
          :width="width"
          :margin="variantVizMargin"
          :variantHeight="variantSymbolHeight"
          :variantPadding="variantSymbolPadding"
          :showBrush="false"
          :showXAxis="true"
          @variantHover="showCoverageCircle">
        </variant-viz>

        <div id="bam-track">
          <depth-viz
            v-if="showDepthViz"
            :data="coverage"
            :currentPoint="coveragePoint"
            :maxDepth="maxDepth"
            :width="width"
            :margin="depthVizMargin"
            :height="60"
            :showTooltip="false"
            :showXAxis="false"
          >
          </depth-viz>
        </div>

        <gene-viz id="gene-viz"
          v-bind:class="{ hide: !showGeneViz }"
          :data="[selectedTranscript]"
          :margin="geneVizMargin"
          :width="width"
          :height="40"
          :trackHeight="geneVizTrackHeight"
          :cdsHeight="geneVizCdsHeight"
          :regionStart="regionStart"
          :regionEnd="regionEnd"
          :showBrush="false"
          >
        </gene-viz>

      </div>
    </v-card-title>

  </v-card>



</template>

<script>


import GeneViz    from "../viz/GeneViz.vue"
import VariantViz from "../viz/VariantViz.vue"
import DepthViz   from "../viz/DepthViz.vue"


export default {
  name: 'variant-card',
  components: {
    VariantViz,
    GeneViz,
    DepthViz
  },
  props: {
    name: "",
    relationship: "",
    loadedVariants: {},
    coverage: {
      type: Array,
      default: function() {
        return [[0,0]];
      }
    },
    maxDepth: 0,
    selectedGene: {},
    selectedTranscript: {},
    regionStart: 0,
    regionEnd: 0,
    width: 0,
    inProgress: false,
    showVariantViz: true,
    showGeneViz: true,
    showDepthViz: true
  },
  data() {
    return {
      margin: {
        top: isLevelBasic || isLevelEdu ? 0 : 20,
        right: isLevelBasic || isLevelEdu ? 7 : 2,
        bottom: 18,
        left: isLevelBasic || isLevelEdu ? 9 : 4
      },
      variantVizMargin: {
        top: 0,
        right: isLevelBasic || isLevelEdu ? 7 : 2,
        bottom: 5,
        left: isLevelBasic || isLevelEdu ? 9 : 4
      },
      variantSymbolHeight: isLevelEdu  || isLevelBasic ? EDU_TOUR_VARIANT_SIZE : 8,
      variantSymbolPadding: 2,

      geneVizMargin: {
        top: 0,
        right: isLevelBasic || isLevelEdu ? 7 : 2,
        bottom: 18, left:
        isLevelBasic || isLevelEdu ? 9 : 4
      },
      geneVizTrackHeight: isLevelEdu || isLevelBasic ? 32 : 16,
      geneVizCdsHeight: isLevelEdu || isLevelBasic ? 24 : 12,
      depthVizMargin: {
        top: 22,
        right: isLevelBasic || isLevelEdu ? 7 : 2,
        bottom: 0,
        left: isLevelBasic || isLevelEdu ? 9 : 4
      },
      depthVizYTickFormatFunc: null,
      coveragePoint: null

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
    showCoverageCircle: function(variant) {
      let self = this;

      if (self.coverage != null) {
        let theDepth = null;
        if (variant.bamDepth != null && variant.bamDepth != '') {
          theDepth = variant.bamDepth;
        } else {
          var matchingVariants = self.loadedVariants.features.filter(function(v) {
            return v.start == variant.start && v.alt == variant.alt && v.ref == variant.ref;
          })

          if (matchingVariants.length > 0) {
            theDepth = matchingVariants[0].bamDepth;
            // If samtools mpileup didn't return coverage for this position, use the variant's depth
            // field.
            if (theDepth == null || theDepth == '') {
              theDepth = matchingVariants[0].genotypeDepth;
            }
          }
        }

        if (theDepth) {
          self.coveragePoint = {pos: variant.start, depth: theDepth};
        }
      }


    }

  },


  filters: {
  },

  computed: {
    depthVizHeight: function() {
      this.showDepthViz ? 0 : 60;
    }

  },

  watch: {
  },




  mounted: function() {


  },

  created: function() {
    this.depthVizYTickFormatFunc = this.depthVizYTickFormat ? this.depthVizYTickFormat : null;
  }



}
</script>
