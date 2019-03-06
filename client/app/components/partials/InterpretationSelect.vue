<style lang="sass">
@import ../../../assets/sass/variables

#interpretation-multi-select
  .input-group__selections__comma
    font-size: 12px
    line-height: 13px
    text-align: center
    padding-left: 4px
    padding-right: 0px
    white-space: normal
    display: inline-block

</style>

<template>

  <v-select
  id="interpretation-multi-select"
  label="Show Only"
  :items="interpretations"
  :class="interpretation + ' ' + (showInterpretationLabel ? 'show-interpretation-label' : '')"
  v-model="interpretation"
  :hide-details="true"
  multiple
  >

  </v-select>

</template>

<script>



export default {
  name: 'interpretation-select',
  components: {

  },
  props: {
    defaultInterpretations: null,
    showInterpretationLabel: null,
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
      this.$emit("apply-interpretation", this.interpretation);
    },
    init: function() {
      let self = this;

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
        this.onApply();
    }

  }
}
</script>
