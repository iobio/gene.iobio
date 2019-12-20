<style lang="sass">
@import ../../../assets/sass/variables


#filter-card
  padding-top: 0px
  padding-bottom: 0px
  padding-left: 30px
  padding-right: 30px
  width: -webkit-fill-available

  .close-button
    right: 10px !important
    top: 3px !important
    position: absolute !important
    min-width: 40px !important

  #gene-count-badges
    text-align: center

  .filter-form, .filter-coverage-form
    padding-left: 10px;
    padding-right: 10px;


</style>

<template>
  <v-card tile id="filter-card" >
    <v-btn  class="close-button" @click="onClose" flat>
      <v-icon>close</v-icon>
    </v-btn>

    <v-card-title class="headline" style="padding-top: 5px;margin-left:-5px">Filters</v-card-title>
    <div style="margin-top:5px">

        <filter-badges
         style="margin-bottom:10px"
         ref="filterBadgesRef"
         :isFullAnalysis="isFullAnalysis"
         :badgeCounts="badgeCounts"
         :filters="filters"
         :showCoverageCutoffs="showCoverageCutoffs"
         @badge-click="onBadgeClick"
         @apply-filter="onApplyFilter"
         @new-filter="onNewFilter">
        </filter-badges>


        <div :key="filter.name"  v-for="filter in filters">
          <filter-settings
            v-if="filter.name != 'coverage'"
            v-show="currentFilter && currentFilter.name == filter.name"
            :ref="filter.name + 'FilterSettingsRef'"
            :filterModel="filterModel"
            :filter="filter"
            @apply-filter="onApplyFilter"
            @remove-filter="onRemoveFilter">
          </filter-settings>

          <filter-settings-coverage
            v-if="filter.name == 'coverage'"
            v-show="currentFilter && currentFilter.name == filter.name"
            ref="coverageFilterSettingsRef"
            :filterModel="filterModel"
            :filter="filter"
             @apply-filter="onApplyFilter">
          </filter-settings-coverage>

        </div>



    </div>


  </v-card>
</template>

<script>

import FilterBadges           from '../partials/FilterBadges.vue'
import FilterSettings         from '../partials/FilterSettings.vue'
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
      filters: null,
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
      let filterSettingsRef = filter.name + "FilterSettingsRef";
      if (self.$refs[filterSettingsRef]) {
        self.$refs[filterSettingsRef][0].init();
      }
      self.currentFilter = filter;
    },
    clearFilter: function() {
      let self = this;
      self.currentFilter = null;
    },
    onFilterSettingsClosed: function() {
      this.$emit('filter-settings-closed');
    },
    onApplyFilter: function() {
      let self = this;
      this.$emit("filter-settings-applied");
    },
    onRemoveFilter: function(filterName) {
      this.filters = this.filters.filter(function(filter) {
        return filter.name != filterName
      })
      this.$emit("filter-settings-applied");
    },
    onNewFilter: function() {
      let self = this;
      let nonCustomCount = self.filters.filter(function(f) {
        return !f.custom;
      }).length;

      let newFilter = {
          name: 'custom-filter-' + (self.filters.length - nonCustomCount),
          display: 'custom',
          active: true,
          custom: true,
          showTooltip: false,
          tooltip: '',
          showEdit: true,
          tooltip: ''
      };
      self.currentFilter = newFilter;

      let flagCriteria = {};
      flagCriteria.custom = true;
      flagCriteria.active = false;
      flagCriteria.name = newFilter.name;
      flagCriteria.maxAf = null;
      flagCriteria.minRevel = null;
      flagCriteria.clinvar = null;
      flagCriteria.impact = null;
      flagCriteria.consequence = null;
      flagCriteria.inheritance = null;
      flagCriteria.zygosity = null;
      flagCriteria.genotypeDepth = null;
      self.filterModel.flagCriteria[newFilter.name] = flagCriteria;


      self.filters.push(newFilter);
      self.onBadgeClick(newFilter);
      this.$emit("filter-settings-applied")
    },
    onClose: function() {
      this.$emit('filter-settings-closed');
    }
  },
  mounted: function() {
    let self = this;
    let sortedFilters = self.filterModel.getSortedActiveFilters().map(function(filter) {
      return {'name': filter.key, 'display': filter.title, 'custom': filter.custom, showTooltip: false, showEdit: false, tooltip: '' };
    }).filter(function(filter) {
      return filter.name != 'userFlagged';
    })
    sortedFilters.push(
      {name: 'coverage', display: 'Insufficient coverage',   showTooltip: false, showEdit: false, custom: false, tooltip: ''}
    );
    self.filters = sortedFilters;
  }
}

</script>