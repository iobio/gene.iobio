<style lang="sass">
@import ../../../assets/sass/variables

#genes-card

  #analyze-all-button
    display: inline-block
    vertical-align: top
    margin-top: 10px
    margin-left: 0px
    margin-right: 10px
    float: left

  #call-variants-dropdown
    display: inline-block
    vertical-align: top
    margin-right: 0px
    text-align: left
    float: left

    button
      margin-top: 10px
      margin-left: 0px

  .btn__content
    padding: 0 4px

  #genes-toolbar
    margin-top: 6px
    margin-bottom: 10px
    display: inline-block
    width: 100%
    text-align: center

    .stop-analysis-button
      float: left
      position: relative
      min-width: 0px
      height: 20px
      padding: 0px
      margin-top: 15px
      margin-right: 20px
      margin-left: 0px

      i.material-icons
        font-size: 18px


    #analyze-genes-progress
      float: right
      display: inline-block
      margin-right: 0px
      margin-left: 0px
      margin-top: 5px
      margin-bottom: 15px

      #total-genes-label
        float: left
        font-size: 14px
        color: $text-color
        margin-left: 5px
        margin-right: 15px
        margin-top: 10px
        display: inline-block

      #analyzed-progress-bar
        float: left

      .progress-bar-label
        float: left
        margin-right: 4px
        width: 40px
        font-size: 12px

      .loaded-progress
        .progress-linear__bar__determinate
          background-color: $loaded-variant-color !important
        .progress-linear__background
          background-color: $loaded-variant-color !important
          height: 20px !important

      .called-progress
        .progress-linear__bar__determinate
          background-color: $called-variant-color !important
        .progress-linear__background
          background-color: $called-variant-color !important
          height: 20px !important

      .progress-linear
        margin: 1px 0

  #genes-panel
    margin-top: 5px

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

  #gene-badge-container
    max-height: 120px
    overflow-y: scroll



  #analyzing-indeterminate-bar
    margin: 0px
    .progress-linear__bar__indeterminate


</style>

<template>
  <v-card tile id="genes-card" class="app-card" style="padding-top:0px">

    <v-progress-linear
    v-if="analyzeAllInProgress || callAllInProgress"
    id="analyzing-indeterminate-bar"
    :indeterminate="true"
    height="4"
    color="lime "
    background-color="grey lighten-3">
    </v-progress-linear>

    <v-card-title v-if="!isEduMode" primary-title>

      <div id="genes-toolbar" v-bind:class="isEduMode || isBasicMode ? 'hide' : ''">


            <v-btn  id="analyze-all-button"
            v-if="isLoaded"
            class="level-edu"
            raised
            @click="onAnalyzeAll"
            v-tooltip.top-center="`Analyze variants in all genes`" >
              Analyze all
            </v-btn>


            <v-btn
            v-if="analyzeAllInProgress"
            class="stop-analysis-button"
            @click="onStopAnalysis" small raised
            v-tooltip.top-center="`Stop analysis`" >
              <v-icon>stop</v-icon>
            </v-btn>


            <div id="call-variants-dropdown"
              v-if="isLoaded && hasAlignments"
            >
              <v-menu offset-y>
                <v-btn raised slot="activator"
                v-tooltip.top-center="`Call variants from alignments`">Call variants</v-btn>
                <v-list>
                    <v-list-tile v-for="action in callVariantsActions" :key="action" @click="onCallVariants(action)">
                    <v-list-tile-title>{{ action }}</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </div>

            <v-btn
            v-if="callAllInProgress"
            class="stop-analysis-button"
            @click="onStopAnalysis" small raised
            v-tooltip.top-center="`Stop calling variants`" >
              <v-icon>stop</v-icon>
            </v-btn>


          <filter-badges v-if="isLoaded"
           :badgeCounts="badgeCounts"
           :filterModel="filterModel"
           @filter-applied="onFilterApplied"
           @badge-click="onBadgeClick">
          </filter-badges>

          <div id="analyze-genes-progress"
          v-if="isLoaded"
          class="level-edu level-basic">
            <span id="total-genes-label">{{ geneNames.length }} genes</span>
            <div v-if="!isLeftDrawerOpen || analyzeAllInProgress || callAllInProgress" id="analyzed-progress-bar" >
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
          </div>

        </div>

    </v-card-title>

      <genes-menu style="padding-left:16px"
       v-if="isEduMode && tourNumber == '1'"
       id="app-tour-genes-menu"
       :geneModel="geneModel"
       :isEduMode="isEduMode"
       @apply-genes="onApplyGenes">
      </genes-menu>

      <div id="genes-panel"  class="nav-center">






<!--

          <div id="genes-sort-dropdown"
           v-if="isLoaded">
            <v-select
              label="Order by"
              v-bind:items="sortCategories"
              v-model="sortBy"
              max-height="auto"
              autocomplete
            >
            </v-select>
          </div>
-->






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
  </v-card>
</template>

<script>

import GeneBadge from '../partials/GeneBadge.vue'
import FilterBadges from '../partials/FilterBadges.vue'
import GenesMenu from '../partials/GenesMenu.vue'

export default {
  name: 'genes-card',
  components: {
    GeneBadge,
    FilterBadges,
    GenesMenu
  },
  props: {
    isEduMode: null,
    isBasicMode: null,
    tourNumber: null,
    geneNames: null,
    genesInProgress: null,
    loadedDangerSummaries: null,
    geneModel: null,
    selectedGene: null,
    isLoaded: null,
    hasAlignments: null,
    filterModel: null,
    isLeftDrawerOpen: null,
    analyzeAllInProgress: null,
    callAllInProgress: null
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
      sortBy: "harmful variants",
      callVariantsActions: ['All genes', 'Selected gene'],
      badgeCounts: {},

      flaggedGeneNames: [],
      flaggedVariants: [],

      filteredGeneNames: []

    }
  },
  methods: {
    onAnalyzeAll: function() {
      this.$emit("analyze-all");
    },
    updateGeneSummaries: function() {
      let self = this;

      // Create an array of gene summaries for the genes to show in the genes card
      var theGeneNames = self.filteredGeneNames.length > 0 ? self.filteredGeneNames : self.geneNames;
      if (theGeneNames) {
        self.geneSummaries = theGeneNames.map(function(geneName) {
          let inProgress = self.genesInProgress ? self.genesInProgress.indexOf(geneName) >= 0 : false;

          var dangerSummary = self.geneModel.getDangerSummary(geneName);
          var isFlagged = self.flaggedGeneNames.indexOf(geneName) >= 0;

          return {'name': geneName,
          'isFlagged': isFlagged,
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
    updateGeneBadgeCounts: function() {
      let self = this;
      self.badgeCounts = {};

      for (var key in self.filterModel.flagCriteria) {
        if (self.filterModel.flagCriteria[key].active) {
          self.badgeCounts[key] = 0;
        }
      }
      self.badgeCounts.coverage = 0;
      self.badgeCounts.flagged = 0;

      if (self.geneNames) {
        self.geneNames.forEach(function(geneName) {
          var dangerSummary = self.geneModel.getDangerSummary(geneName);

          if (dangerSummary) {
            for (var badge in self.badgeCounts) {
              if (dangerSummary.badges[badge] && dangerSummary.badges[badge].length > 0) {
                self.badgeCounts[badge] ++;
              }
            }
            if (dangerSummary.geneCoverageProblem) {
              self.badgeCounts.coverage++;
            }
          }
        })
      }
    },
    onGeneSelected: function(geneName) {
      this.$emit('gene-selected', geneName);
    },
    onRemoveGene: function(geneName) {
      this.geneModel.removeGene(geneName);
      this.$emit('remove-gene', geneName);
    },
    onCallVariants: function(action) {
      this.$emit("call-variants", action == 'All genes' ? null : this.selectedGene)
    },
    onBadgeClick: function(badge) {
      let self = this;
      self.determineFlaggedGenes(badge);
      if (badge) {
        self.filteredGeneNames = self.flaggedGeneNames;
      } else {
        self.filteredGeneNames = [];
      }
      self.updateGeneSummaries();
    },
    onFilterApplied: function(badge) {
      this.$emit("filter-applied", badge);
    },
    determineFlaggedGenes: function(badge) {
      let self = this;

      self.flaggedGeneNames = [];
      self.flaggedVariants = [];

      if (badge && badge == 'coverage') {
        self.flaggedGeneNames = self.geneNames.filter(function(geneName) {
          var dangerSummary = self.geneModel.getDangerSummary(geneName);
          return dangerSummary && dangerSummary.geneCoverageProblem;
        });
      } else {
        var theBadge = badge ? badge : 'flagged';
        self.flaggedGeneNames = self.geneNames.filter(function(geneName) {
          var dangerSummary = self.geneModel.getDangerSummary(geneName);
          if (dangerSummary && dangerSummary.badges
            && dangerSummary.badges[theBadge] && dangerSummary.badges[theBadge].length > 0) {
            dangerSummary.badges[theBadge].forEach(function(variant) {
              variant.geneName = geneName;
              self.flaggedVariants.push(variant);
            })
            return true;
          }
        });
      }

      self.$emit("add-flagged-variants", self.flaggedVariants);

      self.$emit("register-flagged-variants", self.flaggedGeneNames, self.flaggedVariants);

    },
    onApplyGenes: function(genesToApply, phenotypeTerm) {
      this.$emit("apply-genes", genesToApply, phenotypeTerm);
    },
    onStopAnalysis: function() {
      this.$emit("stop-analysis");
    }

  },
  mounted: function() {
    this.updateGeneSummaries();
  },
  watch: {
    geneNames: function(newGeneNames, oldGeneNames) {
      this.updateGeneSummaries();
      this.updateGeneBadgeCounts();
    },
    genesInProgress: function() {
      this.updateGeneSummaries();
      this.updateGeneBadgeCounts();
    },
    badgeCounts: function(newBadgeCounts, oldBadgeCounts) {
    },
    sortBy: function() {
      this.$emit("sort-genes", this.sortBy);
    }
  }
}

</script>