<style lang="sass">
@import ../../../assets/sass/variables



#depth-viz .circle-label
  fill: $arrow-color
  font-size: 15px
  font-weight: bold
  stroke: none
  pointer-events: none

#depth-viz
  .y.axis
    line
      stroke-width: .5px
    .tick
      text
        font-size: 11px

#depth-viz path.line
  stroke: rgba(128,128,128,.81)
  stroke-width: 1
  fill: none

.area-chart-gradient-top
  stop-color: grey
  stop-opacity: 0.1

.area-chart-gradient-bottom
  stop-color: grey
  stop-opacity: 0.6

#depth-viz
  text-align: left
  margin-top: 0px
  min-height: 30px

  .circle
    stroke: none
    fill: $current-color
    pointer-events: none

  .region
    stroke-width: 1px
    stroke: $coverage-problem-region-color
    fill: $coverage-problem-region-color

  .threshold
    line
      stroke-width: 1px
      stroke: lightgray
      stroke-dasharray: 5,5
    text
      font-size: 12px
      fill: $text-color
      cursor: pointer

</style>


<template>
    <div id="depth-viz">

    </div>
</template>

<script>

import lineD3 from '../../d3/Line.d3.js'

export default {
    name: 'depth-viz',
    props: {
      data: {
        type: Array,
        default: function() {
          return [[]];
        }
      },
      coverageDangerRegions: {
        type: Array,
        default: function() {
          return [];
        }
      },
      coverageMedian: {
        type: Number,
        default: 0
      },
      maxDepth: {
        type: Number,
        default: 0
      },
      currentPoint: {
        type: Object,
        default: function() {
          return null;
        }
      },
      width: {
        type: Number,
        default: 0
      },
      height: {
        type: Number,
        default: 0
      },
      kind: {
        type: String,
        default: 'area'
      },
      margin: {
        type: Object,
        default: {}
      },
      showXAxis: {
        type: Boolean,
        default: true
      },
      showYAxis: {
        type: Boolean,
        default: true
      },
      showYAxis: {
        type: Boolean,
        default: true
      },
      yAxisLine: {
        type: Boolean,
        default: false
      },
      yTicks: {
        type: Number,
        default: 3
      },
      regionStart: {
        type: Number,
        default: 0
      },
      regionEnd: {
        type: Number,
        default: 0
      },
      regionGlyph: {
        type: Function,
        default: function(d,i,regionX) {
        }
      }

    },
    data() {
      return {
        depthChart: {}
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

        this.depthChart =  lineD3()
          .width(this.width)
          .height(this.height)
          .widthPercent("100%")
          .heightPercent("100%")
          .kind(this.kind)
          .margin(this.margin)
          .showXAxis(this.showXAxis)
          .showYAxis(this.showYAxis)
          .yAxisLine(this.yAxisLine)
          .yTicks(this.yTicks)
          .pos( function(d) { return d[0] })
          .depth( function(d) { return d[1] })
          .maxDepth(this.maxDepth)
          .yTickFormat(function(val) {
            if (val == 0) {
              return "";
            } else {
              return val + "x";
            }
          })
          .formatCircleText( function(pos, depth) {
            return depth + 'x' ;
          })
          .regionGlyph(function(d, i, regionX) {
            var parent = d3.select(this.parentNode);
            return self.regionGlyph(d, parent, regionX);
          })
          .on("d3region", function(featureObject, feature, lock) {
            self.$emit("region-selected", featureObject, feature, lock );
          })

          this.setDepthChart();
      },
      update: function() {
        var self = this;
        if (self.data && self.data.length > 0 && self.data[0].length > 0) {
          $(self.$el).removeClass("hide");
          self.depthChart.maxDepth(self.maxDepth);
          self.depthChart.xStart(self.regionStart);
          self.depthChart.xEnd(self.regionEnd);
          self.depthChart.width(self.width);
          self.depthChart.height(self.height);
          var selection = d3.select(self.$el).datum( self.data );
          self.depthChart(selection);
        } else {
          $(self.$el).addClass("hide");
          var selection = d3.select(self.$el).datum( [[0,0]] );
          self.depthChart(selection);
        }
      },
      setDepthChart: function() {
        this.$emit('updateDepthChart', this.depthChart);
      },
      showCurrentPoint: function(point) {
        this.depthChart.showCircle()(point.pos, point.depth);
      },
      hideCurrentPoint: function(point) {
        this.depthChart.hideCircle()();
      }
    },
    watch: {
      data: function() {
        this.update();
      },
      coverageDangerRegions: function() {
        let self = this;
        self.depthChart.highlightRegions(self.coverageDangerRegions,
          {},
          self.regionStart,
          self.regionEnd,
          self.coverageMedian);
      }
    }
}
</script>