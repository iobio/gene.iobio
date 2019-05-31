<style lang="sass">
@import ../../../assets/sass/variables
#genes-panel
  margin-top: 5px
  padding-bottom: 30px

  #analyze-genes-progress
    margin-top: 10px
    margin-bottom: 15px

    .progress-counts
      padding-left: 4px
      font-size: 12px
      color: $text-color

    .progress-bar-label
      margin-right: 4px
      width: 55px
      font-size: 12px
      display: inline-block

    .loaded-progress
      height: 5px
      width: 150px
      margin: 1px 0
      display: inline-block
      .progress-linear__bar__determinate, .v-progress-linear__bar__determinate
        background-color: $loaded-variant-color !important
      .progress-linear__background, .v-progress-linear__background
        background-color: $loaded-variant-color !important
        height: 20px !important

    .called-progress
      height: 5px
      width: 150px
      margin: 1px 0
      display: inline-block
      .progress-linear__bar__determinate, .v-progress-linear__bar__determinate
        background-color: $called-variant-color !important
      .progress-linear__background,  .v-progress-linear__background
        background-color: $called-variant-color !important
        height: 20px !important

    .progress-linear, .v-progress-linear
        margin: 1px 0
#genes-card.edu
  #genes-panel
    padding-bottom: 0px


</style>

<template>
  <div id="genes-panel"  class="nav-center">

    <div id="analyze-genes-progress">
      <div>
        <div v-if="totalCount > 0">
          <span class="progress-bar-label">Analyzed</span>
          <v-progress-linear  class="loaded-progress"   v-model="loadedPercentage">
          </v-progress-linear>
          <span class="progress-counts">
            {{ loadedCount }} of {{ totalCount }}
          </span>
        </div>
        <div v-if="totalCount > 0" style="clear:both">
          <span v-show="callAllInProgress || calledPercentage > 0" class="progress-bar-label">Called</span>
          <v-progress-linear v-show="callAllInProgress || calledPercentage > 0" class="called-progress"  v-model="calledPercentage">
          </v-progress-linear>
          <span class="progress-counts" v-show="callAllInProgress || calledPercentage > 0">
            {{ calledCount }} of {{ totalCount }} </span>
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
       :launchedFromClin="launchedFromClin"
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
    launchedFromClin: null,
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
      calledPercentage: 0,
      loadedCount: 0,
      calledCount: 0,
      totalCount: 0
    }
  },
  methods: {
    updateGeneSummaries: function() {
      let self = this;

      // Create an array of gene summaries for the genes to show in the genes card
      var theGeneNames = self.filteredGeneNames && self.filteredGeneNames.length > 0 ? self.filteredGeneNames : self.geneNames;
      let geneNamesToDisplay = null;
      if (theGeneNames) {
        geneNamesToDisplay = theGeneNames.filter(function(geneName) {
          if (self.isFullAnalysis) {
            return !self.geneModel.isCandidateGene(geneName);;
          } else {
            return self.geneModel.isCandidateGene(geneName);
          }
        })
        self.geneSummaries = geneNamesToDisplay.map(function(geneName) {
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
      if (geneNamesToDisplay && geneNamesToDisplay.length > 0) {
        self.calledCount = 0;
        self.loadedCount = 0;
        self.totalCount = geneNamesToDisplay.length;
        geneNamesToDisplay.forEach(function(geneName) {
          var dangerSummary = self.geneModel.getDangerSummary(geneName);
          if (dangerSummary) {
            self.loadedCount++;
          }
          if (dangerSummary && dangerSummary.CALLED) {
            self.calledCount++;
          }
        })

        self.loadedPercentage = self.loadedCount >  0 ? (self.loadedCount / self.totalCount) * 100 : 0;
        self.calledPercentage = self.calledCount >  0 ? (self.calledCount / self.totalCount) * 100 : 0;
      } else {
        self.loadedPercentage = 0;
      }
      self.$emit("count-changed", self.totalCount);


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
    isFullAnalysis: function() {
      this.updateGeneSummaries();
    },
    genesInProgress: function() {
      this.updateGeneSummaries();
    }
  }
}

</script>