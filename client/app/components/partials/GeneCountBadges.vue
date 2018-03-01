<style lang="sass">
@import ../../../assets/sass/variables

#gene-count-badges
  display: inline-block
  vertical-align: top
  margin-right: 35px
  margin-top: -20px

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
    height: 18px
    width: 16px
    position: relative
    padding: 0px
    min-width: 20px
    margin-left: 25px
    margin-top: -35px

  .badge-wrapper
    display: inline-block
    width: 50px
    height: 45px

  .custom-badge
    color: $app-color
    font-size: 11px

  #filter-menu, #filter-coverage-menu
    .menu__activator
</style>

<template>
  <div  id="gene-count-badges" >

  <v-layout row>
   <v-flex xs12 class="text-xs-center" style="font-size:12px;">
    Flagged Genes
   </v-flex>
  </v-layout>


  <v-layout row>

    <span class="badge-wrapper">
      <v-btn flat ref="flagged"
       id="flagged"
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
      id="pathogenic"
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
      :showAddActivator="false"
      @filter-applied="onFilterApplied"
      @filter-menu-open="onFilterMenuOpen">
      </filter-menu>
    </span>




  <span class="badge-wrapper">
      <v-btn flat ref="denovo"
       id="denovo"
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
      :showAddActivator="false"
      @filter-applied="onFilterApplied"
      @filter-menu-open="onFilterMenuOpen">
      </filter-menu>

  </span>

  <span class="badge-wrapper">
      <v-btn flat ref="recessive"
       id="recessive"
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
      :showAddActivator="false"
      @filter-applied="onFilterApplied"
      @filter-menu-open="onFilterMenuOpen">
      </filter-menu>
  </span>

  <span class="badge-wrapper">
      <v-btn flat ref="xlinked"
       id="xlinked"
       v-bind:class="badgeCounts.xlinked == 0 ? 'disabled' : ''"
      @click="onBadgeClick('xlinked')" >
        <v-badge  right >
          <span   slot="badge">{{ badgeCounts.xlinked }}</span>
          <span>
            <svg id="xlinked-badge" class="inheritance-badge">
              <g transform="translate(0,0)">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#x-linked-symbol" width="20" height="20" style="pointer-events: none;">
                </use>
              </g>
            </svg>
          </span>
        </v-badge>
      </v-btn>
      <filter-menu
      ref="xlinked-menu"
      :filterModel="filterModel"
      :badge="`xlinked`"
      :showAddActivator="false"
      @filter-applied="onFilterApplied"
      @filter-menu-open="onFilterMenuOpen">
      </filter-menu>
  </span>

  <span class="badge-wrapper">
      <v-btn flat ref="compoundHet"
       id="compoundHet"
       v-bind:class="badgeCounts.compoundHet == 0 ? 'disabled' : ''"
      @click="onBadgeClick('compoundHet')" >
        <v-badge  right >
          <span   slot="badge">{{ badgeCounts.compoundHet }}</span>
          <span>
            <svg id="compoundHet-badge" class="inheritance-badge">
              <g transform="translate(0,0)">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#compound-het-symbol" width="20" height="20" style="pointer-events: none;">
                </use>
              </g>
            </svg>
          </span>
        </v-badge>
      </v-btn>
      <filter-menu
      ref="compoundHet-menu"
      :filterModel="filterModel"
      :badge="`compoundHet`"
      :showAddActivator="false"
      @filter-applied="onFilterApplied"
      @filter-menu-open="onFilterMenuOpen">
      </filter-menu>
  </span>

  <span class="badge-wrapper">
      <v-btn flat ref="highOrModerate"
       id="highOrModerate"
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
      :showAddActivator="false"
      @filter-applied="onFilterApplied"
      @filter-menu-open="onFilterMenuOpen">
      </filter-menu>

  </span>



  <span class="badge-wrapper">
    <v-btn flat ref="coverage"
       id="coverage"
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
      :showAddActivator="false"
      @filter-applied="onFilterApplied"
      @filter-menu-open="onFilterMenuOpen">
    </filter-coverage-menu>

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
      <filter-menu
      v-bind:ref="customBadge + `-menu`"
      :filterModel="filterModel"
      :badge="customBadge"
      :showAddActivator="false"
      @filter-applied="onFilterApplied"
      @filter-menu-open="onFilterMenuOpen">
      </filter-menu>

  </span>

  <span class="badge-wrapper" >

      <filter-menu
      ref="custom-menu"
      :filterModel="filterModel"
      :badge="`add-custom`"
      :idx="customBadges ? customBadges.length : 0"
      :showMenu="showCustomMenu"
      :showAddActivator="true"
      @filter-applied="onFilterApplied"
      @filter-menu-open="onFilterMenuOpen">
      </filter-menu>

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
      badge: null,
      showCustomMenu: false,
      customBadges: null
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
    onFilterMenuOpen: function(badge) {
      let self = this;
      var badgeRefs = Object.keys(self.filterModel.flagCriteria);
      badgeRefs.forEach(function(refName) {
        if (refName != badge) {
          self.$refs[refName + "-menu"].close();
        }
      })
      if (badge != 'coverage') {
        self.$refs['coverage-menu'].close();
      }
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
