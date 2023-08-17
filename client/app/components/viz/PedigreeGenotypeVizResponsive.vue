
<template>
    <div class="pedigree-genotype-chart" ref="popupPedigreeChartContainer">

    </div>
</template>

<script>

import PedigreeGenotypeChartResponsiveD3 from '../../d3/PedigreeGenotypeChartResponsive.d3.js'

export default {

    name: 'pedigree-genotype-viz-responsive',
    props: {
      data: {},
      margin:{
        type: Object,
        default: function() {
          return {top: 10, bottom: 10, left: 10, right: 10};
        }
      },
      options: {
        type: Object,
        default: function() {
          return {};
        }
      },
      nodeWidth: {
        type: Number,
        default: 58
      },
      nodePadding: {
        type: Number,
        default: 58
      },
      nodeVerticalPadding: {
        type: Number,
        default: 50
      }
    },
    data() {
      return {
        chart: {}
      }
    },
    created: function() {
    },
    mounted: function() {
      this.draw();
    },
    methods: {
      draw: function() {
        var self = this;

        this.chart =  PedigreeGenotypeChartResponsiveD3()
          .margin(self.margin)
          .nodeWidth(self.nodeWidth)
          .nodePadding(self.nodePadding)
          .nodeVerticalPadding(self.nodeVerticalPadding)

          this.setChart();
      },
      update: function() {
        var self = this;
        if (self.data) {
          var selection = d3.select(self.$refs.popupPedigreeChartContainer);
          self.chart(selection, self.data, self.options);
        }
      },
      setChart: function() {
        this.$emit('updateChart', this.chart);
      },

    },
    watch: {
      data: function() {
        this.update();
      }

    }

}
</script>

<style lang="sass" scoped>
  .pedigree-genotype-chart
    width: 100%
</style>
