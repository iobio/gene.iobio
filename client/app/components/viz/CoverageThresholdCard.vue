<style lang="sass">
@import ../../../assets/sass/variables


#coverage-threshold-card
  padding-top: 0px
  padding-bottom: 0px
  padding-left: 30px
  padding-right: 30px
  width: -webkit-fill-available

  .close-button
    right: 10px !important
    top: 3px !important
    position: absolute !important
    min-width: 40px !important

  #gene-count-badges
    text-align: center

  .filter-form, .filter-coverage-form
    padding-left: 10px;
    padding-right: 10px;


</style>

<template>
  <v-card tile id="coverage-threshold-card" >
    <v-btn  class="close-button" @click="onClose" flat style="padding-top:10px">
      <v-icon>close</v-icon>
    </v-btn>

    <v-card-title class="headline" style="padding-top: 10px;">Assess Sequence Coverage</v-card-title>

    <div style="margin-top: 35px;padding: 10px;padding-bottom: 0px;">



      <filter-settings-coverage
        :filterModel="filterModel"
        :filter="coverageFilter"
         @apply-filter="onApplyFilter">
      </filter-settings-coverage>





    </div>


  </v-card>
</template>

<script>

import FilterSettingsCoverage from '../partials/FilterSettingsCoverage.vue'

export default {
  name: 'coverage-threshold-card',
  components: {
    FilterSettingsCoverage
  },
  props: {    
    filterModel: null
  },
  data () {
    return {
      coverageFilter: null
    }
  },
  methods: {

    onApplyFilter: function() {
      let self = this;
      this.$emit("coverage-threshold-applied");
      this.$emit('coverage-threshold-closed');
    },
    onClose: function() {
      this.$emit('coverage-threshold-closed');
    }
  },
  mounted: function() {
    let self = this;
    self.coverageFilter = 
      {name: 'coverage', display: 'Insufficient coverage',   showTooltip: false, showEdit: false, custom: false, tooltip: ''};
  
  }
}

</script>