<style lang="sass">
@import ../../../assets/sass/variables

#flagged-variants-card
  margin: 10px

  .flagged-variants-panel
    margin-top: 10px


</style>

<template>
  <div id="flagged-variants-card">
    Variants


    <div class="flagged-variants-panel">

      <flagged-gene
      v-for="flaggedGene in flaggedGenes"
      :key="flaggedGene.gene_name"
      :flaggedGene="flaggedGene"
      @flagged-variant-selected="onVariantSelected"
      >
      </flagged-gene>

    </div>

  </div>
</template>

<script>

import FlaggedGene from '../partials/FlaggedGene.vue'

export default {
  name: 'flagged-variants-card',
  components: {
    FlaggedGene
  },
  props: {
    cohortModel: null
  },
  data () {
    return {
    }
  },
  methods: {
    onVariantSelected: function(variant) {
      this.$emit("flagged-variant-selected", variant);
    }
  },
  mounted: function() {

  },
  computed: {
    flaggedGenes: function() {
      if (this.cohortModel && this.cohortModel.flaggedVariants) {
        let genes = {};
        this.cohortModel.flaggedVariants.forEach(function(variant) {
          let theGene = genes[variant.gene.gene_name];
          if (theGene == null) {
            theGene = {};
            theGene.gene = variant.gene;
            theGene.variants = [];
            genes[variant.gene.gene_name] = theGene;
          }
          theGene.variants.push(variant);
        })
        let geneNames = Object.keys(genes).sort();
        let flaggedGenes = geneNames.map(function(geneName) {
          return genes[geneName];
        })
        let i = 0;
        flaggedGenes.forEach(function(flaggedGene) {
          flaggedGene.variants.forEach(function(variant) {
            variant.index = i;
            i++;
          })
        })
        return flaggedGenes;
      } else {
        return [];
      }

    }
  },
  watch: {
  }
}

</script>