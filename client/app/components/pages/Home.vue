
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
          v-on:gene-source-selected="onGeneSourceSelected">
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
      selectedTranscript: {}
    }
  },

  created: function() {
    genomeBuildHelper.promiseInit({DEFAULT_BUILD: null});
  },

  methods: {
    onGeneSelected: function(geneObject) {
      var self = this;
      geneModel.promiseGetGeneObject(geneObject.gene_name)
      .then(function(theGeneObject) {
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
      geneModel.promiseGetGeneObject(self.selectedGene.gene_name)
      .then(function(theGeneObject) {
        self.selectedGene = theGeneObject;
        self.selectedTranscript = geneModel.getCanonicalTranscript(self.selectedGene);
      })
    }

  }
}
</script>
