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

#badge-interpretation
  font-family: $app-font
  padding-left: 3px
  padding-right: 3px
  font-size: 13px
  color: white
  width: 175px
  margin-bottom: 3px
  padding-top: 2px
  padding-bottom: 2px
  border-radius: 4px

  -webkit-box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.02), 0px 2px 2px 0px rgba(0, 0, 0, 0.07), 0px 1px 5px 0px rgba(0, 0, 0, 0.14)
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.02), 0px 2px 2px 0px rgba(0, 0, 0, 0.07), 0px 1px 5px 0px rgba(0, 0, 0, 0.14)

  &.not-reviewed
    background-color: $not-reviewed-color

  &.sig
    background-color: $significant-color

  &.not-sig
    background-color: $not-significant-color

  &.poor-qual
    background-color: $poor-qual-color

  &.unknown-sig
    background-color: $unknown-significance-color



</style>

<template>

  <div
  id="badge-interpretation"
  :class="{
          'not-reviewed': interpretation == 'not-reviewed',
          'not-sig'     : interpretation == 'not-sig',
          'sig'         : interpretation == 'sig',
          'unknown-sig' : interpretation == 'unknown-sig',
          'poor-qual'   : interpretation == 'poor-qual'}"
  >
    <v-icon class="interpretation sig" v-if="interpretation == 'sig'">verified_user</v-icon>
    <v-icon class="interpretation unknown-sig" v-if="interpretation == 'unknown-sig'">help</v-icon>
    <v-icon class="interpretation not-sig" v-if="interpretation == 'not-sig'">thumb_down</v-icon>
    <v-icon class="interpretation poor-qual" v-if="interpretation == 'poor-qual'">trending_down</v-icon>
    <v-icon class="interpretation not-reviewed" v-if="interpretation == 'not-reviewed'">visibility_off</v-icon>
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
  }
}
</script>
