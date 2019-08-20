<style lang="sass">
@import ../../../assets/sass/variables


i.material-icons.interpretation
  color: white !important
  font-size: 18px
  padding-top: 0px

.interpretation-label
  color: white  !important
  padding-left: 5px

#select-interpretation
  &.no-wrap
    .input-group__selections__comma
      width: initial

.interpretation-slot
  width: 100%
  padding: 2px

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

#select-interpretation
  font-family: $app-font
  margin: 0px
  padding: 0px
  width: 18px
  height: auto
  font-size: 12px
  margin-top: 0px

  &.show-interpretation-label
    width: initial

    .interpretation-label
      color: white !important
      font-size: 13px

  &.not-reviewed
    .input-group__input
      background-color: $not-reviewed-color

  &.sig
    .input-group__input
      background-color: $significant-color

  &.not-sig
    .input-group__input
      background-color: $not-significant-color

  &.poor-qual
    .input-group__input
      background-color: $poor-qual-color

  &.unknown-sig
    .input-group__input
      background-color: $unknown-significance-color

  .input-group__input
    min-height: 21px
    border: solid 1px #e6e6e6
    padding: 2px

  &.input-group--hide-details
    .input-group__details
      display: none


  .input-group__selections
    min-width: 22px

  .input-group__selections__comma
    font-size: 12px
    line-height: 13px
    text-align: center
    padding-left: 4px
    padding-right: 0px
    white-space: normal
    display: inline-block

  .input-group__append-icon
    line-height: 20px
    color: white !important
    width: 20px
    padding-left: 10px
    padding-right: 1px


</style>

<template>

  <v-select
  id="select-interpretation"
  :items="interpretations"
  :class="{'interpretation': true, 'show-interpretation-label' : showInterpretationLabel,
          'not-reviewed': interpretation == 'not-reviewed',
          'not-sig'     : interpretation == 'not-sig',
          'sig'         : interpretation == 'sig',
          'unknown-sig' : interpretation == 'unknown-sig',
          'poor-qual'   : interpretation == 'poor-qual'}"
  v-model="interpretation"
  :hide-details="true"
  single-line
  >


    <template slot="selection" slot-scope="data">
      <div :class="{'interpretation-slot': true,
          'not-reviewed': data.item.value == 'not-reviewed',
          'not-sig'     : data.item.value == 'not-sig',
          'sig'         : data.item.value == 'sig',
          'unknown-sig' : data.item.value == 'unknown-sig',
          'poor-qual'   : data.item.value == 'poor-qual'}">
        <v-icon class="interpretation sig" v-if="data.item.value == 'sig'">verified_user</v-icon>
        <v-icon class="interpretation unknown-sig" v-if="data.item.value == 'unknown-sig'">help</v-icon>
        <v-icon class="interpretation not-sig" v-if="data.item.value == 'not-sig'">thumb_down</v-icon>
        <v-icon class="interpretation poor-qual" v-if="data.item.value == 'poor-qual'">trending_down</v-icon>
        <v-icon class="interpretation not-reviewed" v-if="data.item.value == 'not-reviewed'">visibility_off</v-icon>
        <span v-if="showInterpretationLabel" class="interpretation-label"> {{ data.item.text }} </span>
      </div>
    </template>

    <template slot="item" slot-scope="data">
      <div :class="{'interpretation-slot': true,
          'not-reviewed': data.item.value == 'not-reviewed',
          'not-sig'     : data.item.value == 'not-sig',
          'sig'         : data.item.value == 'sig',
          'unknown-sig' : data.item.value == 'unknown-sig',
          'poor-qual'   : data.item.value == 'poor-qual'}">
        <v-icon class="interpretation sig" v-if="data.item.value == 'sig'">verified_user</v-icon>
        <v-icon class="interpretation unknown-sig" v-if="data.item.value == 'unknown-sig'">help</v-icon>
        <v-icon class="interpretation not-sig" v-if="data.item.value == 'not-sig'">thumb_down</v-icon>
        <v-icon class="interpretation poor-qual" v-if="data.item.value == 'poor-qual'">trending_down</v-icon>
        <v-icon class="interpretation not-reviewed" v-if="data.item.value == 'not-reviewed'">visibility_off</v-icon>
        <span class="interpretation-label"> {{ data.item.text }} </span>
      </div>
    </template>

  </v-select>

</template>

<script>



export default {
  name: 'variant-interpretation',
  components: {

  },
  props: {
    interpretationMap: null,
    variant: null,
    variantInterpretation: null,
    showInterpretationLabel: null,
    wrap: null
  },
  data () {
    return {
      interpretation: null

    }
  },
  watch: {
  },
  computed: {

    interpretations: function() {
      let self = this;
      var theInterpretations = [];
      for (var key in self.interpretationMap) {
        theInterpretations.push({ 'value': key, 'text': self.interpretationMap[key]});
      }
      return theInterpretations;
    },
    interpretationDisplay: function() {
      return this.interpretation ? this.interpretationMap[this.interpretation] : this.interpretationMap['not-reviewed'] ;
    }
  },
  methods: {
    onApply: function() {
      this.variant.interpretation = this.interpretation;
      this.$emit("apply-variant-interpretation", this.variant);
    },
    init: function() {
      let self = this;
      self.interpretation = self.variant.interpretation && self.variant.interpretation.length > 0 ? self.variant.interpretation : 'not-reviewed';
    }
  },
  created: function() {
  },
  mounted: function() {
    let self = this;
    self.init();
  },
  updated: function() {
  },
  watch: {
    interpretation: function(newInterpretation, oldInterpretation) {
      if (oldInterpretation != null && oldInterpretation.length > 0 && oldInterpretation != newInterpretation) {
        this.onApply();
      }
    },
    variantInterpretation: function(newInterpretation, oldInterpretation) {
      this.init();
    },

  }
}
</script>
