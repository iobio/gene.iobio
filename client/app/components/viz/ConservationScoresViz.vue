<style lang="sass">
@import ../../../assets/sass/variables

.conservation-scores-viz
  .marker
    circle
      stroke: $arrow-color
      stroke-width: 2px
      fill: $current-color
    text
      fill: $arrow-color
      font-size: 12px
      font-weight: bold

.conservation-scores-viz
  .axis
    text
    font-family: 'Raleway'
    font-size: 11px
    fill: $text-color

.conservation-scores-viz
  .bar
    fill: #d56369
    opacity: .8
    stroke: #797979


.conservation-scores-viz
  .bar.negative
    fill: rgba(20, 20, 20, 0.38)
    stroke: rgba(36, 36, 36, 0.3)



</style>


<template>
    <div class="conservation-scores-viz exon">

    </div>
</template>

<script>

import BarchartD3 from '../../d3/BarChart.d3.js'

export default {
    name: 'conservation-scores-viz',
    props: {
      data: {
        type: Array,
        default: function() {
          return [[]];
        }
      },
      options: {
        type: Object,
        default: function() {
          return {}
        }
      },
      targetScore: {
        type: Object,
        default: function() {
          return {}
        }
      },
      exactScore: {
        type: Object,
        default: function() {
          return {}
        }
      },
      width: {
        type: Number,
        default: 130
      },
      height: {
        type: Number,
        default: 70
      },
      margin: {
        type: Object,
        default: function() {
          return {top: 2, right: 2, bottom: 5, left: 4}
        }
      },
      xValue: {
        type: Function,
        default: function(d) {
          return d.x;
        }
      },
      yValue: {
        type: Function,
        default: function(d) {
          return d.y;
        }
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

        this.chart =  BarchartD3()
        this.chart.xValue(this.xValue)
                  .yValue(this.yValue)
                  .width(this.width)
                  .height(this.height)
                  .margin(this.margin);




        this.setChart();
      },
      update: function() {
        var self = this;
        var container = d3.select(self.$el);

        self.chart(container, self.data, self.exactScore, self.options);

        setTimeout(function() {
          self.setMarker();
        },1000)
      },
      setChart: function() {
        this.$emit('update-chart', this.chart);
      },
      setMarker: function() {
        if (this.targetScore && this.exactScore) {
          this.chart.setMarker()(this.targetScore, this.exactScore);
        } else {
          this.chart.clearMarker()();
        }
      }
    },
    watch: {
      data: function() {
        this.update();
      }
    }
}
</script>