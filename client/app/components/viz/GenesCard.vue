<style lang="sass">
@import ../../../assets/sass/variables

#genes-card

  #genes-toolbar
    margin-top: 6px
    margin-bottom: 10px

    #analyze-all-button
      display: inline-block
      vertical-align: top
      margin-top: 0px
      margin-left: 0px
      margin-right: 15px

    #analyze-genes-progress
      display: inline-block
      margin-right: 15px
      margin-left: 10px
      margin-top: -1px

      #total-genes-label
        float: left
        font-size: 12px
        color: $text-color
        margin-left: 5px
        margin-right: 5px
        margin-top: 10px
        display: inline-block

      #analyzed-progress-bar
        float: left

      .progress-bar-label
        float: left
        margin-right: 4px
        width: 50px
        font-size: 12px

      .loaded-progress
        .progress-linear__bar__determinate
          background-color: $loaded-variant-progress-color !important
        .progress-linear__background
          background-color: $loaded-variant-progress-color !important

      .called-progress
        .progress-linear__bar__determinate
          background-color: $called-variant-color !important
        .progress-linear__background
          background-color: $called-variant-color !important

      .progress-linear
        margin: 1px 0

    #genes-sort-dropdown
      display: inline-block
      width: 200px
      vertical-align: top

      .input-group--select
        .input-group__selections__comma
          font-size: 14px
          padding: 0px 0px 0px 0px

      .input-group label
        font-size: 14px
        line-height: 25px
        height: 25px

      .input-group__input
        min-height: 0px
        margin-top: 10px


</style>

<template>
  <v-card tile id="genes-card" class="app-card">
    <v-card-title primary-title>Selected Genes</v-card-title>
      <div id="genes-panel" class="nav-center">

        <div id="genes-toolbar">

          <button  id="analyze-all-button" class="level-edu  btn btn-default icon-button-sm btn-raised"
          @click="onAnalyzeAll">
            Analyze all genes
          </button>


          <div id="analyze-genes-progress" class="level-edu level-basic">
            <div id="analyzed-progress-bar" >
              <div>
                <span class="progress-bar-label">Loaded</span>
                <v-progress-linear  class="loaded-progress"   style="height:18px;width:150px" v-model="loadedPercentage">
                </v-progress-linear>
              </div>
              <div style="clear:both">
                <span class="progress-bar-label">Called</span>
                <v-progress-linear  class="called-progress"   style="height:18px;width:150px"  v-model="calledPercentage">
                </v-progress-linear>
              </div>
            </div>
            <span id="total-genes-label">{{ geneSummaries.length }} genes</span>
          </div>

          <div id="genes-sort-dropdown">
            <v-select
              label="Order by"
              v-bind:items="sortCategories"
              v-model="selectedSort"
              max-height="auto"
              autocomplete
            >
            </v-select>
          </div>

        </div>

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
          <div id="after-genes" style="display:inline-block;margin-top:5px;"></div>
          <div id="gene-page-control" class="hide level-edu level-basic">
            <div id="gene-badge-loading-display" class="level-edu level-basic"></div>

            <div id="gene-page-selection" class="level-basic"></div>

            <div id="gene-paging-links" class="hide">
              <a href="javascript:void(0)" id="view-50-genes"
                 class="gene-paging-link" onclick="genesCard.viewDefaultsGenesPerPage()" >
                    View 40
              </a>
              <a href="javascript:void(0)" id="view-all-genes"
                 class="gene-paging-link" onclick="genesCard.viewAllGenes()" >
                | all
              </a>
            </div>
          </div>
        </div>
      </div>
  </v-card>
</template>

<script>

import GeneBadge from '../partials/GeneBadge.vue'

export default {
  name: 'genes-card',
  components: {
    GeneBadge
  },
  props: {
    geneNames: null,
    loadedGeneNames: null,
    geneModel: null,
    genesInProgress: null,
    selectedGene: null
  },
  data () {
    return {
      geneSummaries: [],
      loadedPercentage: 0,
      calledPercentage: 0,
      sortCategories: [
        "harmful variants",
        "insufficient coverage",
        "gene name",
        "(original order)",
      ],
      selectedSort: "harmful variants"
    }
  },
  methods: {
    onAnalyzeAll: function() {
      this.$emit("analyze-all");
    },
    updateGeneSummaries: function() {
      let self = this;
      if (self.geneNames) {
        self.geneSummaries = self.geneNames.map(function(geneName) {
          let inProgress = self.genesInProgress ? self.genesInProgress.indexOf(geneName) >= 0 : false;
          return {'name': geneName,
          'dangerSummary': self.geneModel.getDangerSummary(geneName),
          'inProgress': inProgress};
        })
      } else {
        self.geneSummaries = [];
      }
    },
    onGeneSelected: function(geneName) {
      this.$emit('gene-selected', this.geneModel.geneObjects[geneName]);
    },
    onRemoveGene: function(geneName) {
      this.geneModel.removeGene(geneName);
      this.$emit('remove-gene', geneName);
    }

  },
  mounted: function() {
  },
  computed: {
  },
  watch: {
    geneNames: function(newGeneNames, oldGeneNames) {
      this.updateGeneSummaries();
    },
    loadedGeneNames: function(newDangerSummaries, oldDangerSummaries) {
      this.updateGeneSummaries();
    }
  },
  computed: {
  }
}

</script>