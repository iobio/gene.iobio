<style lang="sass">
@import ../../../assets/sass/variables

.chip.not-reviewed
  .chip__content
    background-color: $not-reviewed-color !important
.chip.sig
  .chip__content
    background-color: $significant-color !important
.chip.unknown-sig
  .chip__content
    background-color: $unknown-significance-color !important
.chip.not-sig
  .chip__content
    background-color: $not-significant-color !important


#select-interpretation
  &.no-wrap
    .input-group__selections__comma
      width: initial

#select-interpretation
  font-family: 'Open sans'
  margin: 0px
  padding: 0px
  width: auto
  height: auto
  font-size: 12px
  margin-top: 0px
  border-radius: 28px
  color: white !important
  background-color: $not-reviewed-color  !important


  .input-group__input
    min-height: 21px

  &.input-group--hide-details
    .input-group__details
      display: none


  .input-group__selections__comma
    color: white
    font-size: 12px
    line-height: 13px
    text-align: center
    padding-left: 4px
    padding-right: 0px
    width: 91px
    white-space: normal
    display: inline-block

  .input-group__append-icon
    line-height: 20px
    line-height: 20px
    padding-left: 0px
    padding-right: 1px
    color: white !important

  &.not-reviewed
    background-color: $not-reviewed-color !important
  &.sig
    background-color: $significant-color !important
  &.unknown-sig
    background-color: $unknown-significance-color !important
  &.not-sig
    background-color: $not-significant-color !important



</style>

<template>

  <v-select
  id="select-interpretation"
  :items="interpretations"
  :class="interpretation"
  v-model="interpretation"
  :hide-details="true"
  single-line
  >

    <template slot="item" slot-scope="data">
      <v-chip :class="data.item.value"
      >
        {{ data.item.text }}
      </v-chip>
    </template>

  </v-select>

</template>

<script>



export default {
  name: 'variant-interpretation',
  components: {

  },
  props: {
    variant: null,
    wrap: null
  },
  data () {
    return {
      interpretation: null,
      interpretationMap: {
        'sig': 'Significant',
        'unknown-sig': 'Unknown significance',
        'not-sig': 'Not significant',
        'not-reviewed': 'Not reviewed'
      }

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
    }
  },
  created: function() {
  },
  mounted: function() {
    let self = this;
    self.interpretation = self.variant.interpretation == null || self.variant.interpretation.length == 0 ? 'not-reviewed' : self.variant.interpretation;
  },
  updated: function() {
  },
  watch: {
    variant: function() {
      let self = this;
      self.interpretation = self.variant.interpretation == null || self.variant.interpretation.length == 0 ? 'not-reviewed' : self.variant.interpretation;
    },
    interpretation: function() {
      this.onApply();
    }
  }
}
</script>
