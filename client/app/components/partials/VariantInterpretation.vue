<style lang="sass">
@import ../../../assets/sass/variables

input#select-interpretation
  padding-top: 0px
  padding-bottom: 0px

i.material-icons.interpretation
  color: white !important
  font-size: 14px
  padding-top: 0px
  padding-bottom: 3px
  padding-right: 4px
  padding-left: 4px

.interpretation-label
  color: white  
  padding-left: 4px
  padding-right: 4px
  font-size: 12px

.not-reviewed
  .interpretation-label
    color: $not-reviewed-text-color !important


.select-interpretation
  height: 24px
  border-radius: 4px
  -webkit-box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)
  box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)
  background-color: $interpretation-background-color
  color: white !important
  caret-color: white !important
  max-width: 175px
  min-width: 175px

  &.not-reviewed
    background-color: $not-reviewed-color !important

    .interpretation-label 
      color: $not-reviewed-text-color !important
  &.sig 
    background-color: $significant-color !important
  &.not-sig 
    background-color: $not-significant-color !important
  &.unknown-sig
    background-color: $unknown-significance-color !important
  &.uncertain-sig
    background-color: $unknown-significance-color !important

  .v-input__control
    border-radius: 4px

  &.no-wrap
    .input-group__selections__comma, .v-input__control
      width: initial

  .v-input__append-inner
    .v-input__icon--append
      i.material-icons
        color: white !important

  .v-input__slot:before
    border-color: transparent !important

.interpretation-choices
  width: 100%
  background-color:  $interpretation-background-color
  padding-top: 2px
  padding-bottom: 2px
  padding-left: 4px
  padding-right: 10px
  border-radius: 5px

  &.not-reviewed
    background-color: $not-reviewed-color !important
  &.sig 
    background-color: $significant-color !important
  &.not-sig 
    background-color: $not-significant-color !important
  &.poor-qual
    background-color: $poor-qual-color !important
  &.unknown-sig
    background-color: $unknown-significance-color !important
  &.uncertain-sig
    background-color: $unknown-significance-color !important

  i.material-icons
    padding-right: 2px
    font-size: 14px !important
    color: white !important



.select-interpretation
  font-family: $app-font
  margin: 0px
  padding: 0px
  height: 24px !important
  font-size: 12px
  margin-top: 0px


  .v-input__control
    max-height: 22px
    min-height: 22px

  .v-input__slot
    max-height: 22px




  &.show-interpretation-label
    width: initial

    .interpretation-label
      color: white 
      font-size: 12px
      font-weight: 500
      padding-left: 4px

  .v-input__icon--append
    i.material-icons
      color: white !important

  .interpretation-selection
    i.material-icons
      padding-right: 2px
      font-size: 14px !important

  
  &.unknown-sig, &.not-reviewed, &.sig,  &.not-sig, &.poor-qual, &.uncertain-sig
    .v-input__append-inner
      .v-input__icon--append
        i.material-icons
          color: white !important
          margin-top: -4px
  &.not-reviewed
    .v-input__append-inner
      .v-input__icon--append
        i.material-icons
          color: $not-reviewed-text-color !important

  .v-input__icon
    i.material-icons
      color: white !important

  .input-group__input, .v-input__control
    min-height: 26px

  &.input-group--hide-details
    .input-group__details, .v-input__control
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
  :class="{'interpretation': true, 'select-interpretation': true, 'show-interpretation-label' : showInterpretationLabel,
          'not-reviewed': interpretation == 'not-reviewed',
          'not-sig'     : interpretation == 'not-sig',
          'sig'         : interpretation == 'sig',
          'uncertain-sig' : interpretation == 'uncertain-sig'}"
  v-model="interpretation"
  hide-details
  single-line
  >

    <template v-slot:selection="{ item, index }">
      <div :class="{'interpretation-selection': true,
          'not-reviewed': item.value == 'not-reviewed',
          'not-sig'     : item.value == 'not-sig',
          'sig'         : item.value == 'sig',
          'uncertain-sig' : item.value == 'uncertain-sig'}">

        <span v-if="showInterpretationLabel" class="interpretation-label"> {{ item.text }} </span>
      </div>
    </template>

    <template slot="item" slot-scope="data">
      <div :class="{'interpretation-choices': true,
          'not-reviewed': data.item.value == 'not-reviewed',
          'not-sig'     : data.item.value == 'not-sig',
          'sig'         : data.item.value == 'sig',
          'uncertain-sig' : data.item.value == 'uncertain-sig'}">

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
