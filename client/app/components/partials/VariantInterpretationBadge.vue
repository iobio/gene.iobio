<style lang="sass">
@import ../../../assets/sass/variables


i.material-icons.interpretation
  color: white !important
  font-size: 12px
  padding-top: 0px
  padding-bottom: 3px
  padding-right: 4px
  padding-left: 4px

.interpretation-label
  color: white !important
  padding-left: 4px
  font-weight: 500

#badge-interpretation
  font-size: 12px
  width: fit-content
  margin-bottom: 1px
  border-radius: 4px
  

  i.material-icons
    padding-right: 0px
    font-size: 14px
    color: white !important

  &.not-reviewed
    background-color: $not-reviewed-color !important
  &.sig 
    background-color: $significant-color !important
  &.not-sig 
    background-color: $not-significant-color !important
  &.uncertain-sig
    background-color: $unknown-significance-color !important




</style>

<template>

  <div
  id="badge-interpretation"
  v-if="interpretation && interpretation !== 'not-reviewed'"
  v-show="interpretation && interpretation !== 'not-reviewed'"

  :class="{
          'not-sig'     : interpretation == 'not-sig',
          'sig'         : interpretation == 'sig',
          'uncertain-sig' : interpretation == 'uncertain-sig'}"
  >
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
