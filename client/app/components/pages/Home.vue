
<style lang="sass">

</style>



<template>

  <div>
    <navigation v-on:input="onGeneSelected"></navigation>
    <v-content>
      <v-container fluid>
        <gene-card v-bind:selectedGene="selectedGene"></gene-card>
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
      })
    }

  }
}
</script>
