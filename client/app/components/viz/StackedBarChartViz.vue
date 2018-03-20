<style lang="sass">
</style>


<template>
    <div class="stacked-barchart">

    </div>
</template>

<script>

import stackedBarChartD3 from '../../d3/StackedBarChart.d3.js'

export default {

    name: 'stacked-bar-chart-viz',
    props: {
      data: {},
      regionStart: {
        default: 0,
        type: Number
      },
      regionEnd: {
        default: 0,
        type: Number
      },
      height: {
        default: 50,
        type: Number
      },
      margin:{
        type: Object,
        default: {top: 10, bottom: 10, left: 10, right: 10}
      },
      showXAxis: {
        type: Boolean,
        default: true
      },
      options: {
        type: Object,
        default: function() {
          return {transition: {'pushUp': true}, featureBarWidth: true};
        }
      },
      width: {
        type: Number,
        default: 0
      },
      xTickCount: {
        type: Number,
        default: 0
      },
      yTickCount: {
        type: Number,
        default: 3
      },
      xValue: {
        type: Function,
        default: function(d, i)
        {
          return d.point
        }
      },
      xValueStart: {
        type: Function,
        default: function(d, i) {
          return d.start
        }
      },
      xValueEnd: {
        type: Function,
        default: function(d, i) {
          return d.end
        }
      },
      barWidthMin: {
        type: Number,
        default: 4
      },
      barHeightMin: {
        type: Number,
        default: 3
      },
      categories: {
        type: Array,
        default: function() {
          return [];
        }
      },
      margin: {
        type: Object,
        default: function() {
          return {top: 7, right:  2, bottom: 0, left: 4};
        }
      },
      tooltipText: {
        type: Function,
        default: function() {
          return "";
        }
      },
      barWidth: {
        type: Number,
        default: 0
      },
      xStart: {
        type: Number,
        default: 0
      },
      xEnd: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        barchart: {}
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

        this.barchart =  stackedBarChartD3()
          .widthPercent("100%")
          .heightPercent("100%")
          .width(self.width)
          .height(self.height)
          .showXAxis(self.showXAxis)
          .xTickCount(self.xTickCount)
          .yTickCount(self.yTickCount)
          .xValue(self.xValue)
          .xValueStart(self.xValueStart)
          .xValueEnd(self.xValueEnd)
          .barWidthMin(self.barWidthMin)
          .barHeightMin(self.barHeightMin)
          .categories(self.categories)
          .margin(self.margin)
          .tooltipText(self.tooltipText);

          this.setBarChart();
      },
      update: function() {
        var self = this;
        if (self.data) {

          self.barchart.xStart(self.xStart);
          self.barchart.xEnd(self.xEnd);
          self.barchart.barWidth(self.barWidth);

          var selection = d3.select(self.$el).datum( self.data );
          self.barchart(selection, self.options);
        }
      },
      setBarChart: function() {
        this.$emit('updateChart', this.barchart);
      },

    },
    watch: {
      data: function() {
        this.update();
      }

    }

}
</script>