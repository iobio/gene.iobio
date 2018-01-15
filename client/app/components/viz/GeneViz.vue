<style type="text/css">
  @import '../../../assets/css/gene.d3.css';
  .transcript .selection-box {
    fill: transparent;
  }
  .brush .extent {
      stroke: #000;
      fill-opacity: 0.125;
      shape-rendering: crispEdges;
  }
</style>
<template>
    <div>

    </div>
</template>

<script>



export default {
    name: 'gene-viz',
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
        default: 100,
        type: Number
      },
      trackHeight: {
        default: 20,
        type: Number
      },
      cdsHeight: {
        default: 20,
        type: Number
      },
      margin:{
        type: Object,
        default: function() {
          return {top: 10, bottom: 10, left: 10, right: 10}
        }
      },
      featureClass: {
        type: Function,
        default: function(d, i) {
          return d.feature_type.toLowerCase();
        }
      },
      onBrush: {
        type: Function,
        default: function(brush) {
        }

      }

    },
    data() {
      return {
        geneChart: {}
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

        this.geneChart = geneD3()
              .width(this.width)
              .widthPercent("100%")
              .heightPercent("100%")
              .margin(this.margin)
              .showXAxis(true)
              .showBrush(true)
              .trackHeight(this.trackHeight)
              .cdsHeight(this.cdsHeight)
              .showLabel(false)
              .featureClass( this.featureClass )
              .regionStart( this.regionStart)
              .regionEnd( this.regionEnd )
              .on("d3brush", this.onBrush );

        this.setGeneChart();
      },
      update: function() {
        var self = this;
        this.geneChart.regionStart(this.regionStart);
        this.geneChart.regionEnd(this.regionEnd);
        if (self.data && self.data.length > 0 && self.data[0] != null) {
          this.geneChart.width(this.$el.clientWidth);
          var selection = d3.select(this.$el).datum( self.data );
          this.geneChart(selection);
        }
      },
      setGeneChart: function() {
        this.$emit('updateGeneChart', this.geneChart);
      }
    },
    watch: {
      data: function() {
          this.update();
      }
    }
}
</script>