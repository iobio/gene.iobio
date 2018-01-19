/*
 * Home.vue
 *
 */
<style lang="sass">

</style>



<template>

  <div>
    <navigation v-on:input="onGeneSelected"></navigation>
    <v-content>
      <v-container fluid>
        <gene-card
          v-bind:selectedGene="selectedGene"
          v-bind:selectedTranscript="selectedTranscript"
          v-on:transcript-selected="onTranscriptSelected"
          v-on:gene-source-selected="onGeneSourceSelected"
          v-on:gene-region-buffer-change="onGeneRegionBufferChange"
          v-on:gene-region-zoom="onGeneRegionZoom"
          v-on:gene-region-zoom-reset="onGeneRegionZoomReset"
          >
        </gene-card>
      </v-container>
    </v-content>
  </div>

</template>


<script>

import Navigation from '../partials/Navigation.vue'
import GeneCard  from '../viz/GeneCard.vue'



export default {
  name: 'home',
  components: {
      Navigation,
      GeneCard
  },
  props: [],
  data() {
    return {
      greeting: 'gene.iobio.vue',
      selectedGene: {},
      selectedTranscript: {},
      geneRegionBuffer: 1000,
      geneRegionStart: null,
      geneRegionEnd: null
    }
  },

  created: function() {
    genomeBuildHelper.promiseInit({DEFAULT_BUILD: null});
  },

  methods: {
    onGeneSelected: function(geneObject) {
      var self = this;
      geneModel.addGeneName(geneObject.gene_name);
      geneModel.promiseGetGeneObject(geneObject.gene_name)
      .then(function(theGeneObject) {
        geneModel.adjustGeneRegion(theGeneObject, parseInt(self.geneRegionBuffer));
        self.selectedGene = theGeneObject;
        self.selectedTranscript = geneModel.getCanonicalTranscript(self.selectedGene);
      })
    },
    onTranscriptSelected: function(transcript) {
      var self = this;
      self.selectedTranscript = transcript;
    },
    onGeneSourceSelected: function(theGeneSource) {
      var self = this;
      geneModel.geneSource = theGeneSource;
      this.onGeneSelected(this.selectedGene);
    },
    onGeneRegionBufferChange: function(theGeneRegionBuffer) {
      this.geneRegionBuffer = theGeneRegionBuffer;
      this.onGeneSelected(this.selectedGene);
    },
    onGeneRegionZoom: function(theStart, theEnd) {
      this.geneRegionStart = theStart;
      this.geneRegionEnd = theEnd;
      console.log("gene region zoom = " + this.geneRegionStart + '-' + this.geneRegionEnd);
    },
    onGeneRegionZoomReset: function() {
      console.log("gene region zoom reset ");
      this.geneRegionStart = null;
      this.geneRegionEnd = null;
    }

  }
}
</script>
