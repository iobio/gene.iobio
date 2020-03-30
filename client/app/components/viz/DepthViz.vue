<style lang="sass">
@import ../../../assets/sass/variables



#depth-viz .circle-label
  fill: $arrow-color
  font-size: 16px
  font-weight: 500
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
    fill: $arrow-color
    pointer-events: none

  .coverage-bar
    stroke: black
    fill: white
    pointer-events: none

  .alt-bar
    stroke: black
    fill:   $current-color
    pointer-events: none

  .region
    stroke-width: 1px
    stroke: $coverage-problem-region-border-color
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
      model: {
        type: Object,
        default: function() {
          return null;
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
      showAlleleBar: {
        type: Boolean,
        default: false
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
        default: function(d,i,regionX, model) {
        }
      }

    },
    data() {
      return {
        depthChart: {},
        regionSpan: null
      }
    },
    created: function() {
    },
    mounted: function() {
      this.draw();
      this.regionSpan = this.regionStart + "-" + this.regionEnd;
    },
    methods: {
      draw: function() {
        let self = this;
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
          .showAlleleBar(this.showAlleleBar)
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
          .regionGlyph(function(d, i, regionX, model) {
            var parent = d3.select(this.parentNode);
            console.log("regionX", regionX);
            return self.regionGlyph(d, parent, regionX, model);
          })
          .on("d3region", function(featureObject, feature, lock) {
            self.$emit("region-selected", featureObject, feature, lock);
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
        this.depthChart.showCircle()(point.pos, point.depth, point.altCount);
      },
      hideCurrentPoint: function(point) {
        this.depthChart.hideCircle()();
      },
      refreshDangerRegions: function() {
        let self = this;
        self.depthChart.highlightRegions(self.coverageDangerRegions,
          {},
          self.regionStart,
          self.regionEnd,
          self.coverageMedian);
      }
    },
    watch: {
      data: function() {
        this.update();
      },

      regionStart: function() {
        this.regionSpan = this.regionStart + "-" + this.regionEnd;
      },
      regionEnd: function() {
        this.regionSpan = this.regionStart + "-" + this.regionEnd;
      },
      regionSpan: function() {
        this.refreshDangerRegions();
      },
      coverageDangerRegions: function() {
        this.refreshDangerRegions();
      }
    }
}
</script>
