<style lang="sass">
@import ../../../assets/sass/variables

#gene-count-badges
  display: inline-block
  vertical-align: top
  margin-right: 35px

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

      &.flagged
        color: $bookmark-color
        opacity: .7

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

    .gene-badge-coverage-problem
      color: $coverage-problem-color
      fill: $coverage-problem-color


  .btn--floating.btn--small
    height: 20px
    width: 20px
    margin-left: 25px
    margin-top: -35px
    position: relative
    padding: 0px
    min-width: 20px

  .badge-wrapper
    display: inline-block
    width: 50px

</style>

<template>
  <div  id="gene-count-badges" >



  <v-layout row>

    <span class="badge-wrapper">
      <v-btn flat ref="flagged"
       v-bind:class="badgeCounts.flagged == 0 ? 'disabled' : ''"
       @click="onBadgeClick('flagged')" >
        <v-badge class="flagged"  right >
          <span   slot="badge">{{ badgeCounts.flagged }}</span>
          <v-icon>bookmark</v-icon>
        </v-badge>
      </v-btn>
    </span>


    <span class="badge-wrapper">
      <v-btn  flat ref="pathogenic"
      v-bind:class="badgeCounts.pathogenic == 0 ? 'disabled' : ''"
      @click="onBadgeClick('pathogenic')" slot="activator" flat
      >
        <v-badge right >
          <span slot="badge"> {{ badgeCounts.pathogenic }} </span>
          <span>
            <svg>
              <g transform="translate(1,0)">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#clinvar-symbol" width="18" height="18" style="pointer-events: none; fill: rgb(173, 73, 74);">
                </use>
              </g>
            </svg>
          </span>
        </v-badge>
      </v-btn>
      <filter-menu
      ref="pathogenic-menu"
      :filterModel="filterModel"
      :badge="`pathogenic`"
      @filter-applied="onFilterApplied"
      @filter-menu-open="onFilterMenuOpen">
      </filter-menu>
    </span>

  <span class="badge-wrapper">
      <v-btn flat ref="recessive"
        v-bind:class="badgeCounts.recessive == 0 ? 'disabled' : ''"
        @click="onBadgeClick('recessive')"
      >
        <v-badge   right>
          <span  slot="badge">{{ badgeCounts.recessive }}</span>
          <span>
            <svg id="recessive-badge" class="inheritance-badge">
              <g transform="translate(0,0)">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#recessive-symbol" width="20" height="20" style="pointer-events: none;">
                </use>
              </g>
            </svg>
          </span>
        </v-badge>
      </v-btn>
      <filter-menu
      ref="recessive-menu"
      :filterModel="filterModel"
      :badge="`recessive`"
      @filter-applied="onFilterApplied"
      @filter-menu-open="onFilterMenuOpen">
      </filter-menu>
  </span>


  <span class="badge-wrapper">
      <v-btn flat ref="denovo"
       v-bind:class="badgeCounts.denovo == 0 ? 'disabled' : ''"
      @click="onBadgeClick('denovo')" >
        <v-badge  right >
          <span   slot="badge">{{ badgeCounts.denovo }}</span>
          <span>
            <svg id="denovo-badge" class="inheritance-badge">
              <g transform="translate(0,0)">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#denovo-symbol" width="20" height="20" style="pointer-events: none;">
                </use>
              </g>
            </svg>
          </span>
        </v-badge>
      </v-btn>
      <filter-menu
      ref="denovo-menu"
      :filterModel="filterModel"
      :badge="`denovo`"
      @filter-applied="onFilterApplied"
      @filter-menu-open="onFilterMenuOpen">
      </filter-menu>

  </span>


  <span class="badge-wrapper">
      <v-btn flat ref="highOrModerate"
       v-bind:class="badgeCounts.highOrModerate == 0 ? 'disabled' : ''"
       @click="onBadgeClick('highOrModerate')"
      >
        <v-badge  right >
          <span   slot="badge">{{ badgeCounts.highOrModerate }}</span>
          <span>
            <svg>
              <g transform="translate(0,8)">
                <rect width="9" height="9" class="filter-symbol impact_HIGH snp" style="pointer-events: none;"></rect>
              </g>
              <g transform="translate(10,8)">
                <rect width="9" height="9" class="filter-symbol impact_MODERATE snp" style="pointer-events: none;"></rect>
              </g>
            </svg>
          </span>
        </v-badge>
      </v-btn>
      <filter-menu
      ref="highOrModerate-menu"
      :filterModel="filterModel"
      :badge="`highOrModerate`"
      @filter-applied="onFilterApplied"
      @filter-menu-open="onFilterMenuOpen">
      </filter-menu>

  </span>



  <span class="badge-wrapper">
    <v-btn flat ref="coverage"
       v-bind:class="badgeCounts.coverage == 0 ? 'disabled' : ''"
       @click="onBadgeClick('coverage')"
      >
        <v-badge  right >
          <span   slot="badge">{{ badgeCounts.coverage }}</span>
          <span>
          <svg class="gene-badge-coverage-problem" >
            <g transform="translate(0,1)">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#trending-down-symbol" width="17" height="17"  style="pointer-events: none;">
              </use>
            </g>
          </svg>
         </span>
        </v-badge>
    </v-btn>
    <filter-coverage-menu
      ref="coverage-menu"
      :filterModel="filterModel"
      :badge="`coverage`"
      @filter-applied="onFilterApplied"
      @filter-menu-open="onFilterMenuOpen">
    </filter-coverage-menu>

  </span>

  </v-layout>
  </div>
</template>

<script>
import FilterMenu         from '../partials/FilterMenu.vue'
import FilterCoverageMenu from '../partials/FilterCoverageMenu.vue'

export default {
  name: 'gene-count-badges',
  components: {
    FilterMenu,
    FilterCoverageMenu
  },
  props: {
    badgeCounts: null,
    filterModel: null
  },
  data () {
    return {
      badge: 'pathogenic'
    }
  },
  methods: {
    onBadgeClick: function(badge) {
      let self = this;
      for (var name in this.$refs) {
        if (name == badge) {
          $(self.$refs[name].$el).toggleClass("selected");
        } else {
          $(self.$refs[name].$el).removeClass("selected");
        }
      }
      self.$emit("badge-click", $(self.$refs[badge].$el).hasClass("selected") ? badge : null);
    },
    onFilterMenuOpen: function(badge) {
      let self = this;
      var badgeRefs = ['pathogenic', 'recessive', 'denovo', 'highOrModerate'];
      badgeRefs.forEach(function(refName) {
        if (refName != badge) {
          self.$refs[refName + "-menu"].close();
        }
      })
    },
    onFilterApplied: function(badge) {
      this.$emit('filter-applied', badge);
    }
  }
}
</script>
