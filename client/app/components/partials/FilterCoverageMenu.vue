
<style lang="sass" >

.filter-coverage-form
  .input-group
    label
      font-size: 13px

</style>

<template>
  <v-menu
  id="filter-coverage-menu"
  offset-y
  :close-on-content-click="false"
  :close-on-click="false"
  :nudge-width="300"
  v-model="showFilterMenu"
  >

    <v-btn slot="activator" fab small flat>
      <v-icon>more_vert</v-icon>
    </v-btn>


      <v-layout row wrap class="filter-coverage-form mt-3 mx-2 px-2" style="max-width:300px;">
        <v-flex  xs12 class="mb-3" >
            Coverage Thresholds
        </v-flex>

        <v-flex  xs4 class="coverage-threshold mb-3 pr-4" >
            <v-text-field label="Min"  suffix="X" v-model="minCoverage" hide-details>
            </v-text-field>
        </v-flex>
        <v-flex  xs4 class="coverage-threshold mb-3 pr-4" >
            <v-text-field label="Mean"  suffix="X" v-model="medianCoverage" hide-details>
            </v-text-field>
        </v-flex>
        <v-flex  xs4 class="coverage-threshold mb-3" >
            <v-text-field label="Median"  suffix="X" v-model="medianCoverage" hide-details>
            </v-text-field>
        </v-flex>

        <v-flex xs12 class="mt-1 text-xs-right">
          <v-btn
            @click="onApply">
            Apply
          </v-btn>

          <v-btn @click="onCancel">
           Cancel
         </v-btn>
        </v-flex>
      </v-layout>


  </v-menu>
</template>

<script>



export default {
  name: 'filter-coverage-menu',
  components: {
  },
  props: {
    badge: null,
    filterModel: null
  },
  data () {
    return {
      showFilterMenu: false,

      maxCoverage: null,
      meanCoverage: null,
      medianCoverage: null
    }
  },
  watch: {
    showFilterMenu: function() {
      if (this.showFilterMenu) {
        this.$emit("filter-menu-open", this.badge);

        this.minCoverage               = this.filterModel.geneCoverageMin;
        this.meanCoverage              = this.filterModel.geneCoverageMean;
        this.medianCoverage            = this.filterModel.geneCoverageMedian;
      }
    }
  },
  methods: {
    onApply: function() {

      filterModel.geneCoverageMin         = this.minCoverage;
      filterModel.geneCoverageMean        = this.meanCoverage;
      filterModel.geneCoverageMedian      = this.medianCoverage;

      this.$emit("filter-applied", this.badge);

      this.showFilterMenu = false;
    },
    onCancel: function() {
      this.showFilterMenu = false;
    },
    close: function() {
      this.showFilterMenu = false;
    }
  },
  computed: {
  },
  created: function() {
  },
  mounted: function() {
  }
}
</script>
