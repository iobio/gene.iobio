<style lang="sass">
@import ../../../assets/sass/variables
#genes-panel
  margin-top: 10px !important
  padding-bottom: 30px

  #analyze-all-buttons
    margin-bottom: 10px

    #analyze-all-button
      display: inline-block
      vertical-align: top
      margin-top: 10px
      margin-left: 0px
      color: $text-color
      padding-top: 2px
      padding-bottom: 2px
      height: 28px
      padding-left: 10px
      padding-right: 10px

    #call-variants-dropdown
      display: inline-block
      vertical-align: top
      text-align: left

      button
        margin-top: 10px
        margin-left: 0px
        color: $text-color
        padding-top: 2px
        padding-bottom: 2px
        height: 28px
        width: 80px
        padding-left: 10px
        padding-right: 10px

    .btn__content, .v-btn__content
      padding: 0 4px


    .stop-analysis-button
      display: inline-block
      position: relative
      min-width: 0px
      margin-top: 10px
      height: 22px
      margin-right: 10px
      margin-left: 0px
      color: $text-color

      i.material-icons
        font-size: 18px

  #analyze-genes-progress
    margin-top: 10px
    margin-bottom: 20px

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

.call-variants-button
    width: 100px !important

.source-expansion-panel
  // bottom: 0
  margin-top: 45px
  // position: fixed
  width: 100%
  
.expansion-panel__header, .v-expansion-panel__header
  border-top: #e1e1e1
  border-top-style: solid
  border-top-width: 1px
  padding:  6px 10px 6px 2px
  background-color: #f3f3f3

.v-expansion-panel__header
  min-height: 28px
  padding-left: 10px
  padding-right: 8px

  .header__icon
    i.material-icons
      color: $app-color
  
</style>

<template>
  <div id="genes-panel"  class="nav-center">

    <div id="analyze-all-buttons" :class="{'clin': launchedFromClin}">

        <v-btn  id="analyze-all-button"
        v-if="isLoaded && !isFullAnalysis && !isSimpleMode"
        class="level-edu"
        raised
        @click="onAnalyzeAll"
        v-tooltip.top-center="`Analyze variants in all genes`" >
          Analyze all
        </v-btn>


        <v-btn
        v-if="analyzeAllInProgress && !isFullAnalysis && !isSimpleMode"
        class="stop-analysis-button"
        @click="onStopAnalysis" small raised
        v-tooltip.top-center="`Stop analysis`" >
          <v-icon>stop</v-icon>
        </v-btn>


        <div id="call-variants-dropdown"
          v-if="isLoaded && hasAlignments && !isFullAnalysis && !isSimpleMode"
        >
          <v-menu offset-y>
            <v-btn raised slot="activator"
            v-tooltip.top-center="`Call variants from alignments`"
            class="call-variants-button">Call variants</v-btn>
            <v-list>
                <v-list-tile v-for="action in callVariantsActions" :key="action" @click="onCallVariants(action)">
                <v-list-tile-title>{{ action }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </div>

        <v-btn
        v-if="callAllInProgress && !isFullAnalysis"
        class="stop-analysis-button"
        @click="onStopAnalysis" small raised
        v-tooltip.top-center="`Stop calling variants`" >
          <v-icon>stop</v-icon>
        </v-btn>
    </div>
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

    <div v-if="launchedFromClin">
      <div style="margin-left: 82%">
        Source
      </div>
    </div>
    <div id="gene-badge-container" class="level-basic" style="clear:both;">



      <gene-badge
       v-for="gene in geneSummaries"
       :key="gene.name"
       :gene="gene"
       :isSimpleMode="isSimpleMode"
       :phenotypes="geneModel.genePhenotypes[gene.name]"
       :selectedGene="selectedGene"
       :isBasicMode="isBasicMode"
       :isEduMode="isEduMode"
       :launchedFromClin="launchedFromClin"
       :geneModel="geneModel"
       :geneSource="getGeneSource(gene.name)"
       @gene-selected="onGeneSelected"
       @remove-gene="onRemoveGene"
      >
      </gene-badge>
    </div>

    <div class="source-expansion-panel" v-if="launchedFromClin">
      <v-expansion-panel expand v-model="expansionControl">
        <v-expansion-panel-content
        >
          <template v-slot:header>
            <div>Source</div>
          </template>
          <v-card>
            <v-card-text>
                <div class="chart-label">
                  1. Variants defined in imported set 
                  <br>
                  2. Gene list generated from phenotypes
                </div>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
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
    isSimpleMode: null,
    isFullAnalysis: null,
    launchedFromClin: null,
    analyzeAllInProgress: null,
    callAllInProgress: null,
    isLoaded: null,
    hasAlignments: null,
    geneNames: null,
    filteredGeneNames: null,
    genesInProgress: null,
    loadedDangerSummaries: null,
    geneModel: null,
    selectedGene: null
  },
  data () {
    return {
      callVariantsActions: ['All genes', 'Selected gene'],
      geneSummaries: [],
      loadedPercentage: 0,
      calledPercentage: 0,
      loadedCount: 0,
      calledCount: 0,
      totalCount: 0,
      expansionControl: [true]
    }
  },
  methods: {
    onAnalyzeAll: function() {
      this.$emit("analyze-all");
    },
    onCallVariants: function(action) {
      this.$emit("call-variants", action == 'All genes' ? null : this.selectedGene)
    },
    onStopAnalysis: function() {
      this.$emit("stop-analysis");
    },

    updateGeneSummaries: function() {
      let self = this;

      // Create an array of gene summaries for the genes to show in the genes card
      var theGeneNames = self.filteredGeneNames && self.filteredGeneNames.length > 0 ? self.filteredGeneNames : self.geneNames;
      let geneNamesToDisplay = null;
      if (theGeneNames) {
        geneNamesToDisplay = theGeneNames.filter(function(geneName) {
          return self.geneModel.isCandidateGene(geneName);
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
    },
    getGeneSource: function(gene) {
      if(this.launchedFromClin) {
        return this.geneModel.getSourceForGenes()[gene].sourceIndicator.join(", ")
      }
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