<style lang="sass">
@import ../../../assets/sass/variables

#gene-count-badges
  display: inline-block
  vertical-align: top
  margin-right: 35px

  button
    padding-left: 0px
    padding-right: 0px
    min-width: 46px
    margin-left: 0px
    margin-right: 0px

    .btn__content
      padding: 0px

    &.selected
      background-color: lightgray !important
    &.disabled
      opacity: .6
      pointer-events: none

      .badge__badge
        display: none

    .badge
      padding: 0px 5px 0px 0px
      background-color: transparent

      &.bookmark
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
      top: -9px
      background-color: #ababab !important

    .gene-badge-coverage-problem
      color: $coverage-problem-color
      fill: $coverage-problem-color



  #max-af
    .input-group label
      font-size: 14px
      line-height: 25px
      height: 25px
    .input-group__input
      min-height: 0px
      margin-top: 13px
    .input-group--text-field input
      font-size: 14px
      color: $text-color


</style>

<template>
  <div  id="gene-count-badges" >



      <v-btn flat ref="bookmark"
       v-bind:class="badgeCounts.bookmark == 0 ? 'disabled' : ''"
       @click="onBadgeClick('bookmark')" >
        <v-badge class="bookmark"  right >
          <span   slot="badge">{{ badgeCounts.bookmark }}</span>
          <v-icon>bookmark</v-icon>
        </v-badge>
      </v-btn>

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


      <v-btn flat ref="high"
       v-bind:class="badgeCounts.high == 0 ? 'disabled' : ''"
       @click="onBadgeClick('high')"
      >
        <v-badge  right >
          <span   slot="badge">{{ badgeCounts.high }}</span>
          <span>
            <svg id="denovo-badge" class="inheritance-badge">
              <g transform="translate(4,5)">
                <rect width="13" height="13" class="filter-symbol impact_HIGH snp" style="pointer-events: none;"></rect>
              </g>
            </svg>
          </span>
        </v-badge>
      </v-btn>

<!--
      <v-btn flat ref="moderate"
       v-bind:class="badgeCounts.moderate == 0 ? 'disabled' : ''"
       @click="onBadgeClick('moderate')" >
        <v-badge  right >
          <span   slot="badge">{{ badgeCounts.moderate }}</span>
          <span>
            <svg id="denovo-badge" class="inheritance-badge">
              <g transform="translate(4,5)">
                <rect width="13" height="13" class="filter-symbol impact_MODERATE snp" style="pointer-events: none;"></rect>
              </g>
            </svg>
          </span>
        </v-badge>
      </v-btn>
-->

      <!--
      <div id="max-af" style="display:inline-block;width:85px;margin-right: 10px">
        <v-text-field label="Allele Freq" prefix="<" suffix="%" v-model="af">
        </v-text-field>
      </div>
      -->




    <v-btn flat ref="coverage"  style="margin-left:20px"
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
  </div>
</template>

<script>
export default {
  name: 'gene-count-badges',
  components: {
  },
  props: {
    badgeCounts: null
  },
  data () {
    return {
      badge: 'pathogenic',
      af: 5
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
    }
  }
}
</script>
