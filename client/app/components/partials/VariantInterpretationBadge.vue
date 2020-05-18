<style lang="sass">
@import ../../../assets/sass/variables


i.material-icons.interpretation
  color: white !important
  font-size: 13px
  padding-top: 0px
  padding-bottom: 3px
  padding-right: 4px
  padding-left: 4px

.interpretation-label
  color: white  !important
  padding-left: 0px
  font-weight: 500

#badge-interpretation
  font-family: $app-font
  padding-left: 3px
  padding-right: 3px
  font-size: 13px
  color: white
  width: 185px
  margin-bottom: 3px
  padding-top: 2px
  padding-bottom: 1px
  border-radius: 4px
  background-color:  $app-button-color

  i.material-icons
    padding-right: 0px
    font-size: 18px

  &.not-reviewed
    i.material-icons
      color: $not-reviewed-color !important

  &.sig
    i.material-icons
      color: $significant-color !important

  &.not-sig
    i.material-icons
      color: $not-significant-color !important

  &.poor-qual
    i.material-icons
      color: $poor-qual-color !important

  &.unknown-sig
    i.material-icons
      color: $unknown-significance-color !important



</style>

<template>

  <div
  id="badge-interpretation"
  v-if="interpretation && interpretation !== 'not-reviewed'"
  v-show="interpretation && interpretation !== 'not-reviewed'"

  :class="{
          'not-sig'     : interpretation == 'not-sig',
          'sig'         : interpretation == 'sig',
          'unknown-sig' : interpretation == 'unknown-sig',
          'poor-qual'   : interpretation == 'poor-qual'}"
  >
    <v-icon class="interpretation sig" v-if="interpretation == 'sig'">verified_user</v-icon>
    <v-icon class="interpretation unknown-sig" v-if="interpretation == 'unknown-sig'">help</v-icon>
    <v-icon class="interpretation not-sig" v-if="interpretation == 'not-sig'">thumb_down</v-icon>
    <v-icon class="interpretation poor-qual" v-if="interpretation == 'poor-qual'">trending_down</v-icon>
    <span  class="interpretation-label"> {{ intepretationDisplay }} </span>

  </div>


</template>

<script>



export default {
  name: 'variant-interpretation-badge',
  components: {

  },
  props: {
    interpretation: null,
    interpretationMap: null
  },
  data () {
    return {
    }
  },
  watch: {
  },
  computed: {
    intepretationDisplay: function() {
      let self = this;
      return self.interpretationMap[self.interpretation];
    }
  },
  methods: {
  },
  created: function() {
  },
  mounted: function() {
  },
  updated: function() {
  },
  watch: {
    interpretation: function(){
    }
  }
}
</script>
