<style lang="sass">
@import ../../../assets/sass/variables



#depth-viz .circle-label
  fill: $arrow-color
  font-size: 13px
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


export default {
    name: 'depth-viz',
    props: {
      data: {
        type: Array,
        default: function() {
          return [[0,0]];
        }
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
      xStart: {
        type: Number,
        default: 0
      },
      xEnd: {
        type: Number,
        default: 0
      },
      showTooltip: {
        type: Boolean,
        default: false
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
          .showTooltip(this.showTooltip)
          .formatCircleText( function(pos, depth) {
            return depth + 'x' ;
          })
          /*
          .regionGlyph(function(d,i,regionX) {
            var parent = d3.select(this.parentNode);
            var exonId = 'exon' + d.exon_number.replace("/", "-");
            if (parent.select("g#" + exonId).empty()) {
                parent.append('g')
                      .attr("id", exonId)
                      .attr('class',      'region-glyph coverage-problem-glyph')
                      .attr('transform',  'translate(' + (regionX - 12) + ',-16)')
                      .data([d])
                      .append('use')
                      .attr('height',     '22')
                      .attr('width',      '22')
                      .attr('href', '#long-arrow-down-symbol')
                      .attr('xlink','http://www.w3.org/1999/xlink')
                      .data([d]);
            }
          })
*/

          this.setDepthChart();
      },
      update: function() {
        var self = this;
        if (self.data) {
          self.depthChart.maxDepth(self.maxDepth);
          var selection = d3.select(self.$el).datum( self.data );
          self.depthChart(selection);
        } else {
          var selection = d3.select(self.$el).datum( [[0,0]] );
          self.depthChart(selection);
        }
      },
      setDepthChart: function() {
        this.$emit('updateDepthChart', this.depthChart);
      }
    },
    watch: {
      data: function() {
        this.update();
      },
      currentPoint: function() {
        let self = this;
        if (self.currentPoint) {
          self.depthChart.showCircle()(self.currentPoint.pos, self.currentPoint.depth);
        }
      }
    }
}
</script>