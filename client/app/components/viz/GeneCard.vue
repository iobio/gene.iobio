<style lang="css">
  .card {
    width: 100%;
    min-height: 50px;
    padding-left: 10px;
    padding-right: 10px;

  }
</style>

<template>

  <v-card tile id="gene-track track">
   <v-card-title primary-title>Gene {{ selectedGene.gene_name }}</v-card-title>
   <gene-viz id="gene-viz"
    :data="[selectedTranscript]"
    :margin="geneVizMargin"
    :height=40
    :trackHeight="geneVizTrackHeight"
    :cdsHeight="geneVizCdsHeight"
    :regionStart="selectedGene.start"
    :regionEnd="selectedGene.end">
  </gene-viz>
  </v-card>

</template>

<script>

import GeneViz from '../viz/GeneViz.vue'


export default {
  name: 'gene-card',
  components: {
    GeneViz
  },
  props: ['selectedGene'],
  data() {
    return {
      geneVizMargin: {
        top: isLevelBasic || isLevelEdu ? 0 : 20,
        right: isLevelBasic || isLevelEdu ? 7 : 2,
        bottom: 18,
        left: isLevelBasic || isLevelEdu ? 9 : 4
      },
      geneVizTrackHeight: (isLevelEdu || isLevelBasic ? 32 : 22),
      geneVizCdsHeight: (isLevelEdu  || isLevelBasic  ? 24 : 18)
    }
  },

  computed: {
    selectedTranscript: function() {
      return geneModel.getCanonicalTranscript(this.selectedGene);
    }
  },

  created: function() {

  },

  methods: {
  }
}
</script>


