<style lang="sass">
@import ../../../assets/sass/variables
#genes-panel
  margin-top: 5px
</style>

<template>
  <div id="genes-panel"  class="nav-center">


    <div id="gene-badge-container" class="level-basic" style="clear:both;">



      <gene-badge
       v-for="gene in geneSummaries"
       :key="gene.name"
       :gene="gene"
       :phenotypes="geneModel.genePhenotypes[gene.name]"
       :selectedGene="selectedGene"
       @gene-selected="onGeneSelected"
       @remove-gene="onRemoveGene"
      >
      </gene-badge>
    </div>


  </div>
</template>
<script>

import GeneBadge from '../partials/GeneBadge.vue'

export default {
  name: 'genes-panel',
  components: {
    GeneBadge
  },
  props: {
    isEduMode: null,
    isBasicMode: null,
    isFullAnalysis: null,
    geneNames: null,
    genesInProgress: null,
    loadedDangerSummaries: null,
    geneModel: null,
    selectedGene: null
  },
  data () {
    return {
      geneSummaries: [],
      filteredGeneNames: []

    }
  },
  methods: {
    updateGeneSummaries: function() {
      let self = this;

      // Create an array of gene summaries for the genes to show in the genes card
      var theGeneNames = self.filteredGeneNames.length > 0 ? self.filteredGeneNames : self.geneNames;
      if (theGeneNames) {
        self.geneSummaries = theGeneNames.map(function(geneName) {
          let inProgress = self.genesInProgress ? self.genesInProgress.indexOf(geneName) >= 0 : false;

          var dangerSummary = self.geneModel.getDangerSummary(geneName);

          return {'name': geneName,
          'isFlagged': false,
          'dangerSummary': dangerSummary,
          'inProgress': inProgress};
        })

      } else {
        self.geneSummaries = [];
      }

      // Determine loaded gene and called gene progress
      if (self.geneNames && self.geneNames.length > 0) {
        let calledCount = 0;
        let loadedCount = 0;
        self.geneNames.forEach(function(geneName) {
          var dangerSummary = self.geneModel.getDangerSummary(geneName);
          if (dangerSummary) {
            loadedCount++;
          }
          if (dangerSummary && dangerSummary.CALLED) {
            calledCount++;
          }
        })

        self.loadedPercentage = loadedCount >  0 ? (loadedCount / self.geneNames.length) * 100 : 0;
        self.calledPercentage = calledCount >  0 ? (calledCount / self.geneNames.length) * 100 : 0;
      } else {
        self.loadedPercentage = 0;
      }

    },
    onGeneSelected: function(geneName) {
      this.$emit('gene-selected', geneName);
    },
    onRemoveGene: function(geneName) {
      this.$emit('remove-gene', geneName);
    }

  },
  mounted: function() {
    this.updateGeneSummaries();
  },
  watch: {
    geneNames: function(newGeneNames, oldGeneNames) {
      this.updateGeneSummaries();
    },
    genesInProgress: function() {
      this.updateGeneSummaries();
    }
  }
}

</script>