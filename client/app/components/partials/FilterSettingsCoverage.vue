
<style lang="sass" >
@import ../../../assets/sass/variables
.filter-coverage-form
  .input-group
    label
      font-size: 13px

  .filter-action-button
    padding: 0px
    height: 30px !important
    color: $app-color
    min-width: 150px !important
    margin: 0px

</style>

<template>


      <v-layout row wrap class="filter-coverage-form" >

        <v-flex  xs12 class="mb-3" >
          <v-spacer></v-spacer>
          <v-btn :class="{'disabled': !isDirty, 'filter-action-button': true}" @click="apply">
            Apply
          </v-btn>
        </v-flex>

        <v-flex  xs3 class="coverage-threshold mb-3 pr-4" >
            <v-text-field label="Min"  suffix="X" v-model="minCoverage" hide-details>
            </v-text-field>
        </v-flex>
        <v-flex  xs3 class="coverage-threshold mb-3 pr-4" >
            <v-text-field label="Mean"  suffix="X" v-model="meanCoverage" hide-details>
            </v-text-field>
        </v-flex>
        <v-flex  xs3 class="coverage-threshold mb-3" >
            <v-text-field label="Median"  suffix="X" v-model="medianCoverage" hide-details>
            </v-text-field>
        </v-flex>

      </v-layout>


  </v-menu>
</template>

<script>



export default {
  name: 'filter-settings-coverage',
  components: {
  },
  props: {
    filterModel: null
  },
  data () {
    return {
      minCoverage: null,
      meanCoverage: null,
      medianCoverage: null,
      isDirty: false
    }
  },
  watch: {
  },
  methods: {
    init: function() {
      let self = this;
      this.minCoverage               = this.filterModel.geneCoverageMin;
      this.meanCoverage              = this.filterModel.geneCoverageMean;
      this.medianCoverage            = this.filterModel.geneCoverageMedian;

      this.$nextTick(function() {
        self.isDirty = false;
      })
    },
    apply: function() {
      this.filterModel.geneCoverageMin         = +this.minCoverage;
      this.filterModel.geneCoverageMean        = +this.meanCoverage;
      this.filterModel.geneCoverageMedian      = +this.medianCoverage;

      this.isDirty = false;
      this.$emit("apply-filter")
    }
  },
  computed: {
  },
  watch: {
    minCoverage: function() {
      this.isDirty = true;
    },
    maxCoverage: function() {
      this.isDirty = true;
    },
    meanCoverage: function() {
      this.isDirty = true;
    },
  },
  created: function() {
  },
  mounted: function() {
    this.init();
  }
}
</script>
