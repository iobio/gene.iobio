<style lang="sass">
@import ../../../assets/sass/variables
#genes-panel
  margin-top: 5px

  #analyze-genes-progress
    margin-top: 10px
    margin-bottom: 15px

    .progress-bar-label
      float: left
      margin-right: 4px
      width: 55px
      font-size: 12px

    .loaded-progress
      height: 5px
      width: 150px
      display: inline-block
      .progress-linear__bar__determinate
        background-color: $loaded-variant-color !important
      .progress-linear__background
        background-color: $loaded-variant-color !important
        height: 20px !important

    .called-progress
      height: 5px
      width: 150px
      display: inline-block
      .progress-linear__bar__determinate
        background-color: $called-variant-color !important
      .progress-linear__background
        background-color: $called-variant-color !important
        height: 20px !important

    .progress-linear
        margin: 1px 0

</style>

<template>
  <div id="genes-panel"  class="nav-center">

    <div id="analyze-genes-progress">
      <div>
        <div>
          <span class="progress-bar-label">Analyzed</span>
          <v-progress-linear  class="loaded-progress"   v-model="loadedPercentage">
          </v-progress-linear>
        </div>
        <div style="clear:both">
          <span v-show="callAllInProgress || calledPercentage > 0" class="progress-bar-label">Called</span>
          <v-progress-linear v-show="callAllInProgress || calledPercentage > 0" class="called-progress"  v-model="calledPercentage">
          </v-progress-linear>
        </div>
      </div>
    </div>


    <div id="gene-badge-container" class="level-basic" style="clear:both;">



      <gene-badge
       v-for="gene in geneSummaries"
       :key="gene.name"
       :gene="gene"
       :phenotypes="geneModel.genePhenotypes[gene.name]"
       :selectedGene="selectedGene"
       :isBasicMode="isBasicMode"
       :isEduMode="isEduMode"
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
    analyzeAllInProgress: null,
    callAllInProgress: null,
    geneNames: null,
    filteredGeneNames: null,
    genesInProgress: null,
    loadedDangerSummaries: null,
    geneModel: null,
    selectedGene: null
  },
  data () {
    return {
      geneSummaries: [],
      loadedPercentage: 0,
      calledPercentage: 0
    }
  },
  methods: {
    updateGeneSummaries: function() {
      let self = this;

      // Create an array of gene summaries for the genes to show in the genes card
      var theGeneNames = self.filteredGeneNames && self.filteredGeneNames.length > 0 ? self.filteredGeneNames : self.geneNames;
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
    filteredGeneNames: function(newGeneNames, oldGeneNames) {
      this.updateGeneSummaries();
    },
    genesInProgress: function() {
      this.updateGeneSummaries();
    }
  }
}

</script>