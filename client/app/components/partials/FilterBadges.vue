<style lang="sass">
@import ../../../assets/sass/variables

#gene-count-badges
  display: inline-block
  vertical-align: top
  margin-top: -5px

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




  #coverage
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

    span
      padding-top: 4px
      display: inline-block
      margin-right: -40px

    button
     float: right
     margin: 0px
     margin-right: 15px

    .btn__content
      color: $text-color !important


</style>

<template>
  <div  id="gene-count-badges" >

    <v-layout row>
     <v-flex xs12class="text-xs-center" >
      Filters
     </v-flex>
    </v-layout>


    <v-layout row style="margin-top:-5px">

     <v-menu
       v-if="!isFullAnalysis || isFullAnalysis == filter.isFullAnalysis"
       v-for="filter in filters"
       :key="filter.name"
       open-on-hover bottom offset-y>
      <span
       slot="activator"
       :id="filter.name"
       v-if="!isFullAnalysis || isFullAnalysis == filter.isFullAnalysis"
       class="badge-wrapper"
       @mouseover="onMouseOver(filter)"
       @mouseleave="onMouseLeave(filter)"
       v-tooltip.top-center="{content: filter.tooltip, show: filter.showTooltip, trigger: 'manual'}"
       >
        <v-btn  flat
        v-bind:ref="filter.name"
        v-bind:id="filter.name"
        v-bind:class="{'disabled' : badgeCounts[filter.name] == 0, 'custom-filter' : filter.custom}"
         slot="activator" flat
        >
          <v-badge right  >
            <span slot="badge"> {{ badgeCounts[filter.name] }} </span>
            <filter-icon v-if="!filter.custom" v-bind:icon="filter.name">
            </filter-icon>
            <filter-icon v-if="filter.custom" icon="filter" :iconClass="filter.name">
            </filter-icon>
          </v-badge>
        </v-btn>

      </span>
      <v-list>
        <v-list-tile v-if="filter.name != 'userFlagged'" @click="onEditFilter(filter)">
          <v-list-tile-title>Customize filter</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="onBadgeClick(filter)">
          <v-list-tile-title>Show '{{ filter.display.toLowerCase() }}' {{ filter.name == 'coverage' ? ' genes' : ' variants' }}</v-list-tile-title>
        </v-list-tile>
      </v-list>

    </v-menu>



    <v-btn flat @click="onNewFilter">
      <v-icon>add</v-icon>
    </v-btn>





    </v-layout>
    <v-alert   id="active-filter-info"
      :value="showFilterInfo"
      transition="scale-transition"
    >
      <span>{{ showFilterInfo ? activeFilter.display : "" }}</span>
      <v-btn flat @click="onClearFilter">CLEAR FILTER</v-btn>
    </v-alert>

    <v-layout row justify-center v-if="currentFilter && currentFilter.showEdit" class="text-xs-center">
      <v-dialog persistent
        v-model="currentFilter.showEdit"
        width="500"
      >

        <v-card>
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
            <v-btn @click="onApplyFilter">
              Apply
            </v-btn>
            <v-btn @click="onCancelFilter">
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
      self.$emit("badge-click", $(self.$el).find("#" + filter.name).hasClass("selected") ? filter.name : null);
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
      this.currentFilter.showEdit = true;
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
