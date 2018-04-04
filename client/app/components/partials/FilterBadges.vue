<style lang="sass">
@import ../../../assets/sass/variables

#gene-count-badges
  display: inline-block
  vertical-align: top
  margin-top: -5px

  button
    padding-left: 0px
    padding-right: 0px
    min-width: 50px
    margin-left: 0px
    margin-right: 0px

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


    svg
      width: 20px
      height: 20px

    .badge__badge
      font-weight: normal
      font-size: 12px
      width: 15px
      height: 15px
      right: -7px
      top: -6px
      background-color: #ababab !important



  .btn--floating.btn--small
    height: 18px
    width: 16px
    position: relative
    padding: 0px
    min-width: 20px
    margin-left: 25px
    margin-top: -35px

  .badge-wrapper
    display: inline-block
    height: 45px

  .custom-badge
    color: $app-color
    font-size: 11px


</style>

<template>
  <div  id="gene-count-badges" >

    <v-layout row>
     <v-flex xs12 class="text-xs-center" >
      Filters
     </v-flex>
    </v-layout>


    <v-layout row>

      <span
       v-for="filter in filters"
       :key="filter"
       class="badge-wrapper">
        <v-btn  flat
        v-bind:ref="filter"
        v-bind:id="filter"
        v-bind:class="badgeCounts[filter] == 0 ? 'disabled' : ''"
        @click="onBadgeClick(filter)" slot="activator" flat
        >
          <v-badge right >
            <span slot="badge"> {{ badgeCounts[filter] }} </span>
            <filter-icon v-bind:icon="filter">
            </filter-icon>
          </v-badge>
        </v-btn>

      </span>




      <span class="badge-wrapper">
        <v-btn flat ref="coverage"
           id="coverage"
           v-bind:class="badgeCounts.coverage == 0 ? 'disabled' : ''"
           @click="onBadgeClick('coverage')"
          >
            <v-badge  right >
              <span   slot="badge">{{ badgeCounts.coverage }}</span>
              <filter-icon icon="coverage">
              </filter-icon>
            </v-badge>
        </v-btn>


      </span>


      <span class="badge-wrapper"
       v-for="customBadge in customBadges"
       :key="customBadge"
       >
          <v-btn flat v-bind:ref="customBadge"
           v-bind:id="customBadge"
           v-bind:class="badgeCounts[customBadge] && badgeCounts[customBadge] == 0 ? 'disabled' : badgeCounts[customBadge] == null ? 'hide' : ''"
           @click="onBadgeClick(customBadge)"
          >
            <v-badge class="custom" right >
              <span  slot="badge">{{ badgeCounts[customBadge] }}</span>
              <span  class="custom-badge">
                {{ filterModel.flagCriteria[customBadge].name }}
              </span>
            </v-badge>
          </v-btn>

      </span>


      <filter-settings-menu
       class="ml-2"
       :filterModel="filterModel"
       @filter-applied="onFilterApplied">
      </filter-settings-menu>

    </v-layout>
  </div>
</template>

<script>
import FilterIcon         from '../partials/FilterIcon.vue'
import FilterSettingsMenu from '../partials/FilterSettingsMenu.vue'


export default {
  name: 'filter-badges',
  components: {
    FilterIcon,
    FilterSettingsMenu
  },
  props: {
    badgeCounts: null,
    filterModel: null
  },
  data () {
    return {
      badge: null,
      showCustomMenu: false,
      customBadges: null,
      filters: [
        'pathogenic',
        'autosomalDominant',
        'denovo',
        'recessive',
        'xlinked',
        'compoundHet',
        'highOrModerate'
      ]
    }
  },
  computed: {

  },
  methods: {
    onBadgeClick: function(badge) {
      let self = this;
      $(self.$el).find("#" + badge).toggleClass("selected");
      for (var key in  (self.filterModel.flagCriteria)) {
        if (key != badge) {
         $(self.$el).find("#" + key).removeClass("selected");
        }
      }
      if (badge != 'coverage') {
         $(self.$el).find("#coverage").removeClass("selected");
      }
      self.$emit("badge-click", $(self.$el).find("#" + badge).hasClass("selected") ? badge : null);
    },
    onFilterApplied: function(badge) {
      let self = this;

      self.customBadges = [];
      for (var badge in self.filterModel.flagCriteria) {
        if (self.filterModel.flagCriteria[badge].active && self.filterModel.flagCriteria[badge].custom) {
          self.customBadges.push(badge);
        }
      }

      this.$emit('filter-applied', badge);
    }
  }
}
</script>
