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
      modelName: {
        type: String,
        default: ""
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
      maxDepthProp: {
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
        default: function(d,i,regionX, modelName) {
        }
      },
      formatCircleText: {
        type: Function,
        default: function(pos, depth, depthSource) {
          return  + depth + (depthSource && depthSource == "average_base_coverage" ? "x" : " reads");
        }
      }

    },
    data() {
      return {
        depthChart: {},
        maxDepth: 0,
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
          .modelName(this.modelName)
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
          .formatCircleText(this.formatCircleText)
          .regionGlyph(function(d, i, regionX, modelName) {
            var parent = d3.select(this.parentNode);
            return self.regionGlyph(d, parent, regionX, modelName);
          })
          .on("d3region", function(featureObject, feature, lock) {
            self.$emit("region-selected", featureObject, feature, lock);
          })

          this.setDepthChart();
          this.update();
      },
      update: function() {
        var self = this;

        if (self.data && self.data.length > 1 && self.data[0].length > 0) {
          $(self.$el).removeClass("hide");
          self.depthChart.maxDepth(self.maxDepth);
          self.depthChart.xStart(self.regionStart);
          self.depthChart.xEnd(self.regionEnd);
          self.depthChart.width(self.width);
          self.depthChart.height(self.height);
          var selection = d3.select(self.$el).datum( self.data );
          self.depthChart(selection);
        }
      },
      setDepthChart: function() {
        this.$emit('updateDepthChart', this.depthChart);
      },
      showCurrentPoint: function(point) {
        this.depthChart.showCircle()(point.pos, point.depth, point.altCount, point.depthSource);
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
        let self = this;
        
        d3.select(self.$el).select(".circle-label")
            .transition()
            .duration(2000)
            .style("opacity", 0);
        d3.select(self.$el).selectAll("circle.circle")
            .transition()
            .duration(2000)
            .style("opacity", 0);
        if (self.data) {
          let coverage = self.data
          if(self.regionStart && self.regionEnd){
            self.maxDepth = 0;
            coverage = self.data.filter(function(d){
              return d[0] >= self.regionStart && d[0] <= self.regionEnd;
            });
          }
          var max = d3.max(coverage, function(d,i) { return d[1]});
          if (max > self.maxDepth) {
            self.maxDepth = max;
          }
          if(self.maxDepth === 0){
            self.maxDepth = 1;
          }
        }
        this.update();

      },
      maxDepthProp: function() {
        this.maxDepth = this.maxDepthProp;
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
