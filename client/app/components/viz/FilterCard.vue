<style lang="sass">
@import ../../../assets/sass/variables


#filter-card
  padding-top: 0px
  padding-bottom: 0px
  padding-left: 30px
  padding-right: 30px
  min-height: 200px
  width: -webkit-fill-available


  #gene-count-badges
    text-align: center

  .filter-form
    padding-left: 10px;
    padding-right: 10px;

  .filter-action-button
    padding: 0px
    height: 30px !important
    color: $text-color

</style>

<template>
  <v-card tile id="filter-card" >
    <v-card-title class="headline" style="padding-top: 5px;margin-left:-5px">Filters</v-card-title>
    <div style="margin-top:5px">

        <filter-badges
         ref="filterBadgesRef"
         :isFullAnalysis="isFullAnalysis"
         :badgeCounts="badgeCounts"
         :filterModel="filterModel"
         :showCoverageCutoffs="showCoverageCutoffs"
         @filter-settings-applied="onFilterSettingsApplied"
         @badge-click="onBadgeClick"
         @filter-settings-closed="onFilterSettingsClosed">
        </filter-badges>

        <filter-settings
            v-show="currentFilter && currentFilter.name != 'coverage'"
            ref="filterSettingsRef"
            :filterModel="filterModel"
            :filter="currentFilter">
        </filter-settings>

        <filter-settings-coverage
          v-show="currentFilter && currentFilter.name == 'coverage'"
          ref="coverageFilterSettingsRef"
          :filterModel="filterModel"
          :filter="currentFilter">
        </filter-settings-coverage>

    </div>

    <v-card-actions style="padding:10px 0px">
      <v-spacer></v-spacer>
      <v-btn v-if="currentFilter" class="filter-action-button" @click="onApplyFilter">
        Apply
      </v-btn>
      <v-btn v-if="currentFilter" class="filter-action-button" @click="onCancelFilter">
        Cancel
      </v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>

import FilterBadges from '../partials/FilterBadges.vue'
import FilterSettings from '../partials/FilterSettings.vue'
import FilterSettingsCoverage from '../partials/FilterSettingsCoverage.vue'

export default {
  name: 'filter-card',
  components: {
    FilterBadges,
    FilterSettings,
    FilterSettingsCoverage
  },
  props: {
    isFullAnalysis: null,
    launchedFromClin: null,
    geneNames: null,
    loadedDangerSummaries: null,
    geneModel: null,
    isLoaded: null,
    hasAlignments: null,
    filterModel: null,
    showCoverageCutoffs: null

  },
  data () {
    return {
      badgeCounts: {},
      currentFilter: null
    }
  },
  methods: {

    updateGeneBadgeCounts: function() {
      let self = this;
      self.badgeCounts = {};

      let filteredGeneNames = null;
      if (self.geneNames) {
        filteredGeneNames = self.geneNames.filter(function(geneName) {
          if (self.isFullAnalysis) {
            return true;
          } else {
            return self.geneModel.isCandidateGene(geneName);
          }
        })
      }

      for (var key in self.filterModel.flagCriteria) {
        if (self.filterModel.flagCriteria[key].active) {
          self.badgeCounts[key] = 0;
        }
      }
      let prevCoverageCount = self.badgeCounts.coverage ? self.badgeCounts.coverage : 0;
      self.badgeCounts.coverage = 0;
      self.badgeCounts.flagged = 0;

      if (filteredGeneNames) {
        filteredGeneNames.forEach(function(geneName) {
          var dangerSummary = self.geneModel.getDangerSummary(geneName);

          if (dangerSummary) {
            for (var badge in self.badgeCounts) {
              // Tally up variants that pass the filter
              if (dangerSummary.badges[badge] && dangerSummary.badges[badge].length > 0) {
                self.badgeCounts[badge] += dangerSummary.badges[badge].length;
              }
            }
            // Tally up genes that have insufficient coverage
            if (dangerSummary.geneCoverageProblem) {
              self.badgeCounts.coverage++;
            }
          }
        })
      }
      if (self.badgeCounts.coverage && prevCoverageCount != self.badgeCounts.coverage) {
        self.$emit("on-insufficient-coverage", self.badgeCounts.coverage);
      }
    },
    refresh: function() {
      let self = this;
      self.updateGeneBadgeCounts();
    },
    onBadgeClick: function(filter) {
      let self = this;
      self.currentFilter = filter;
    },
    onFilterSettingsApplied: function() {
      this.$emit("filter-settings-applied");
    },
    clearFilter: function() {
      let self = this;
      this.$emit("filter-applied", null);
    },
    onFilterSettingsClosed: function() {
      this.$emit('filter-settings-closed');
    },
    onApplyFilter: function() {
      let self = this;
      if (self.currentFilter) {
        let refName = this.currentFilter.name == 'coverage' ? + 'coverageFilterSettingsRef' : 'filterSettingsRef';
        self.$refs[refName].apply();
        self.$emit('filter-settings-applied');
        self.$emit('filter-settings-closed');
      }
    },
    onCancelFilter: function() {
      if (this.currentFilter) {
        this.currentFilter = null;
      }
    }

  },
  mounted: function() {
  }
}

</script>