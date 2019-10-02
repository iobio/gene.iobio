<style lang="sass">
@import ../../../assets/sass/variables



.multialign-seq-viz
  .marker
    rect
      stroke: $current-color
      stroke-width: 2px
      stroke-opacity: 1
      fill: none

  .axis
    text
      font-family: 'Raleway'
      font-size: 11px
      fill: $text-color



  .sequence
    text
      font-family: 'Raleway'
      font-size: 11px
      font-weight: 500
      fill: $text-color
      cursor: pointer

    g.diff
      text
        fill: black !important
        font-weight: bold

      rect
        fill: rgb(191, 191, 191)

    rect
      fill: white
      stroke: none
      cursor: pointer


  text.sequence-name
    font-family: 'Raleway'
    font-size: 11px
    font-weight: normal !important
    fill: $text-color




</style>


<template>
    <div class="multialign-seq-viz ">

    </div>
</template>

<script>

import MultiAlignD3 from '../../d3/MultiAlign.d3.js'

export default {
    name: 'multialign-seq-viz',
    props: {
      data: {
        type: Array,
        default: function() {
          return [];
        }
      },
      selectedBase: {
        type: Object,
        default: function() {
          return {}
        }
      },
      options: {
        type: Object,
        default: function() {
          return {scrollable: false, showXAxis: false};
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
          return {top: 0, right: 0, bottom: 0, left: 70};
        }
      },
      xValue: {
        type: Function,
        default: function(d) {
          return d.start;
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

        this.chart =  MultiAlignD3()
        this.chart.xValue(this.xValue)
                  .margin(this.margin);

        this.setChart();
      },
      update: function() {
        var self = this;
        var container = d3.select(self.$el);
        self.chart(container, self.data, self.options);
      },
      setChart: function() {
        this.$emit('update-chart', this.chart);
      },
      setMarker: function() {
        if (this.selectedBase) {
          this.chart.setMarker()(this.selectedBase);
        }
      }
    },
    watch: {
      data: function() {
        this.update();
      },
      selectedBase: function() {
        this.setMarker()
      }
    }
}
</script>