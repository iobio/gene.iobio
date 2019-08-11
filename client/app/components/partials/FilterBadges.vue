<style lang="sass">
@import ../../../assets/sass/variables


.filter-action-button

  padding: 0px
  height: 30px !important

#gene-count-badges
  display: inline-block
  vertical-align: top


  .layout.row
    flex-wrap: wrap !important

  button
    padding-left: 0px
    padding-right: 0px
    min-width: 45px
    margin-left: 0px
    margin-right: 0px

    &.custom-filter
      margin-top: 0px

      .badge__badge
        right: -12px

    .btn__content
      padding: 0px

    &.selected
      border: thick solid #717171 !important
      height: 50px
      margin-top: -10px

      .btn__content
        padding-top: 5px;

    &.disabled
      opacity: .6
      pointer-events: none

      .badge__badge
        display: none

    .badge
      padding: 0px 5px 0px 0px
      background-color: transparent

      &.custom
        padding: 3px 7px

      &.flagged
        color: $app-color
        padding: 3px 7px

        i.material-icons
          font-size: 21px



    .badge__badge
      font-weight: normal
      font-size: 12px
      width: 15px
      height: 15px
      right: -7px
      top: -6px
      background-color: $default-badge-color !important




  #coverage, #pathogenic
    .badge__badge
      top: -10px

  .btn--floating.btn--small
    height: 18px
    width: 16px
    position: relative
    padding: 0px
    min-width: 20px
    margin-left: 25px
    margin-top: -35px

  .badge-wrapper
    display: flex
    height: 45px
    flex-flow: column

  .custom-badge
    color: $app-color
    font-size: 11px

  #active-filter-info
    padding: 0px
    background-color: $info-color !important
    color: $text-color !important
    border-width: .5px
    width: 250px
    background-color: $info-chip-color !important
    border-color: #d9d9d9 !important

    span
      padding-top: 8px
      display: inline-block
      margin-right: -40px

    button
     float: right
     margin: 0px
     margin-right: 0px

    .btn__content
      color: $text-color !important


</style>

<template>
  <div  id="gene-count-badges" >


    <v-layout row >


    <template v-for="filter in filters">

       <div
         :key="filter.name">
        <span
         :id="filter.name"
         class="badge-wrapper"
         v-tooltip.top-center="{content: filter.tooltip, show: filter.showTooltip, trigger: 'manual'}"
         >
          <v-btn  flat
          v-bind:ref="filter.name"
          v-bind:id="filter.name"
          v-bind:class="{ 'custom-filter' : filter.custom}"
          @click="onBadgeClick(filter)" flat
          >
            <v-badge right  >
              <span v-if="badgeCounts[filter.name] && badgeCounts[filter.name] > 0"
                slot="badge">{{ badgeCounts[filter.name] }}</span>
              <filter-icon v-if="!filter.custom" v-bind:icon="filter.name">
              </filter-icon>
              <filter-icon v-if="filter.custom" icon="filter" :iconClass="filter.name">
              </filter-icon>
            </v-badge>
          </v-btn>

        </span>

      </div>

    </template>



    <v-btn flat @click="onNewFilter">
      <v-icon>add</v-icon>
    </v-btn>





    </v-layout>
    <v-alert   id="active-filter-info"
      :value="showFilterInfo"
      transition="scale-transition"
    >
      <span>{{ showFilterInfo ? activeFilter.display : "" }}</span>
      <v-btn flat @click="onClearFilter"><v-icon>close</v-icon></v-btn>
    </v-alert>

    <v-layout row justify-center v-if="currentFilter && currentFilter.showEdit" class="text-xs-center">
      <v-dialog persistent id="filter-settings-dialog"
        v-model="currentFilter.showEdit"
        width="605"
      >

        <v-card class="full-width">
        <v-card-text>

          <filter-settings
            v-if="currentFilter.name != 'coverage'"
            v-bind:ref="currentFilter.name + 'SettingsRef'"
            :filterModel="filterModel"
            :filter="currentFilter">
          </filter-settings>
          <filter-settings-coverage
            v-if="currentFilter.name == 'coverage'"
            v-bind:ref="currentFilter.name + 'SettingsRef'"
            :filterModel="filterModel">
          </filter-settings-coverage>
        </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="filter-action-button" @click="onApplyFilter">
              Apply
            </v-btn>
            <v-btn class="filter-action-button" @click="onCancelFilter">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

  </div>



</template>

<script>
import FilterIcon         from '../partials/FilterIcon.vue'

import FilterSettings         from '../partials/FilterSettings.vue'
import FilterSettingsCoverage from '../partials/FilterSettingsCoverage.vue'



export default {
  name: 'filter-badges',
  components: {
    FilterIcon,
    FilterSettings,
    FilterSettingsCoverage
  },
  props: {
    badgeCounts: null,
    filterModel: null,
    showCoverageCutoffs: null,
    isFullAnalysis: null
  },
  data () {
    let self = this;
    return {
      customFilters: null,
      filters:  self.initFilters(),
      activeFilter: null,
      currentFilter: null,
      showFilterInfo: false
    }
  },
  computed: {

  },
  methods: {
    initFilters: function() {
      let self = this;
      let sortedFilters = self.filterModel.getSortedActiveFilters().map(function(filter) {
        return {'name': filter.key, 'display': filter.title, 'custom': filter.custom, showTooltip: false, showEdit: false, tooltip: '' };
      })
      sortedFilters.push(
        {name: 'coverage', display: 'Insufficient coverage',   showTooltip: false, showEdit: false, custom: false, tooltip: ''}
      );
      return sortedFilters;
    },
    onBadgeClick: function(filter) {
      let self = this;
      /*
      $(self.$el).find("#" + filter.name).toggleClass("selected");
      for (var key in  (self.filterModel.flagCriteria)) {
        if (key != filter.name) {
         $(self.$el).find("#" + key).removeClass("selected");
        }
      }
      if (filter.name != 'coverage') {
         $(self.$el).find("#coverage").removeClass("selected");
      }
      self.activeFilter = $(self.$el).find("#" + filter.name).hasClass("selected") ? filter : null;
      self.showFilterInfo = self.activeFilter != null ? true : false;
      */
      self.$emit("badge-click", filter);
    },
    onClearFilter: function() {
      let self = this;
      self.clearFilter();
      self.$emit("badge-click", null);
    },
    clearFilter: function() {
      let self = this;
      if (self.activeFilter) {
        $(self.$el).find("#" + self.activeFilter.name).toggleClass("selected");
        self.showFilterInfo = false;
        self.activeFilter = null;
      }
    },
    onEditFilter: function(filter) {
      this.filters.forEach(function(f) {
        f.showEdit = false;
      })
      this.currentFilter = filter;

      //this.currentFilter.showEdit = true;
      this.$emit("badge-click", filter);

    },
    onApplyFilter: function() {
      let self = this;
      if (self.currentFilter) {
        let refName = this.currentFilter.name + 'SettingsRef';
        self.$refs[refName].apply();
        self.currentFilter.showEdit = false
        self.$emit('filter-settings-applied');
        self.$emit('filter-settings-closed');
      }
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
      self.filters.push(newFilter);
      self.$emit('filter-settings-applied');
      self.$emit('filter-settings-closed');
    },
    onCancelFilter: function() {
      if (this.currentFilter) {
        this.currentFilter.showEdit = false;
        this.currentFilter = null;
      }
    },
    onFilterSettingsApplied: function() {
      let self = this;

      self.customFilters = [];
      for (var filterName in self.filterModel.flagCriteria) {
        if (self.filterModel.flagCriteria[filterName].active && self.filterModel.flagCriteria[filterName].custom) {
          self.customFilters.push({name: filterName, display: self.filterModel.flagCriteria[filterName].name});
        }
      }

      this.$emit('filter-settings-applied');
    },
    onMouseOver: function(filter) {
      let self = this;

      filter.showTooltip = true;
      filter.showMenu = true;
      filter.tooltip = filter.display;

    },
    onMouseLeave: function(filter) {
      let self = this;

      filter.showTooltip = false;
      filter.showMenu = false;
    },
    showTooltip: function(filterName, tooltip) {
      let self = this;
      let filter = self.filters.filter(function(f) {
        return f.name == filterName;
      })[0];
      filter.showTooltip = true;
      filter.tooltip = tooltip;
    },
    hideTooltip: function(filterName) {
      let self = this;
      let filter = self.filters.filter(function(f) {
        return f.name == filterName;
      })[0];
      filter.showTooltip = false;
    }

  }
}
</script>
