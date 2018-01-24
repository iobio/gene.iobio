/*
 * Variant.vue
 *
 */
<style lang="sass">



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
          :data="loadedVariants"
          :regionStart="regionStart"
          :reginEnd="regionEnd"
          :width="width"
          :margin="variantVizMargin"
          :variantHeight="variantSymbolHeight"
          :variantPadding="variantSymbolPadding"
          :showBrush="false"
          :showXAxis="true">
        </variant-viz>

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
          :showBrush=false
          >
        </gene-viz>
      </div>
    </v-card-title>

  </v-card>



</template>

<script>


import GeneViz    from '../viz/GeneViz.vue'
import VariantViz from '../viz/VariantViz.vue'


export default {
  name: 'variant-card',
  components: {
    VariantViz,
    GeneViz
  },
  props: {
    name: "",
    relationship: "",
    loadedVariants: {},
    selectedGene: {},
    selectedTranscript: {},
    regionStart: 0,
    regionEnd: 0,
    width: 0,
    inProgress: false,
    showGeneViz: false
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
      geneVizCdsHeight: isLevelEdu || isLevelBasic ? 24 : 12

    }
  },


  methods: {

  },


  filters: {
  },

  computed: {

  },

  watch: {
  },




  mounted: function() {


  },

  created: function() {
  }



}
</script>
