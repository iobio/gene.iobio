<style lang="sass">

.variant
  opacity: 1
  stroke: #000
  stroke-width: 1px
  stroke-opacity: .3

  &.current
    stroke: #036DB7 !important
    stroke-width: 1.5px !important
    stroke-opacity: 1 !important

.ibo-variant
  .reference
    stroke: rgb(150, 150, 150)

  .name
    font-size: 18px
    fill: rgb(120, 120, 120)

  .arrow
    stroke: rgb(150, 150, 150)
    fill: none

  .axis
    path, line
      fill: none
      stroke: lightgrey
      shape-rendering: crispEdges

    font-size: 13px

</style>


<template>
    <div>

    </div>
</template>

<script>


export default {
    name: 'variant-viz',
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
      variantHeight: {
        default: 8,
        type: Number
      },
      variantPadding: {
        default: 2,
        type: Number
      },
      margin:{
        type: Object,
        default: function() {
          return {top: 10, bottom: 10, left: 10, right: 10}
        }
      },
      showXAxis: {
        type: Boolean,
        default: true
      },
      showTransition: {
        type: Boolean,
        default: false
      },
      showBrush: {
        type: Boolean,
        default: false
      },
      width: {
        type: Number,
        default: 0
      },
      xTickFormat: {
        type: Function,
        default: function(d, i) {
          return "";
        }
      },
      tooltipHTML: {
        type: Function,
        default: function(d, i) {
          return "";
        }
      },
      clazz: null
    },
    data() {
      return {
        variantChart: {},
        classifyFunc: null
      }
    },
    created: function() {
    },
    mounted: function() {
      this.classifyFunc = this.clazz ? this.clazz : this.classifySymbolsByImpact;
      this.draw();
    },
    methods: {
      draw: function() {
        var self = this;

        this.variantChart =  variantD3()
          .width(this.width)
          .clazz(this.classifyFunc)
          .margin(this.margin)
          .showXAxis(this.showXAxis)
          .xTickFormat(this.xTickFormat)
          .variantHeight(this.variantHeight)
          .verticalPadding(this.variantPadding)
          .showBrush(this.showBrush)
          .showTransition(this.showTransition)
          .tooltipHTML(this.tooltipHTML)
          .regionStart(this.regionStart)
          .regionEnd(this.regionEnd)
          .on("d3rendered", function() {
          })
          .on('d3click', function(d) {
          })
          .on('d3mouseover', function(d) {
          })
          .on('d3mouseout', function() {
          })


          this.setVariantChart();
      },
      update: function() {
        var self = this;
        if (self.data) {

          // Set the vertical layer count so that the height of the chart can be recalculated
          if (self.data.maxLevel == null) {
            self.data.maxLevel = d3.max(self.data.features, function(d) { return d.level; });
          }
          self.variantChart.verticalLayers(self.data.maxLevel);
          self.variantChart.lowestWidth(self.data.featureWidth);
          if (self.data.features == null || self.data.features.length == 0) {
            self.variantChart.showXAxis(false);
          } else {
            self.variantChart.showXAxis(self.showXAxis);
          }

          var selection = d3.select(self.$el).datum( [self.data] );
          self.variantChart(selection);
        }
      },
      setVariantChart: function() {
        this.$emit('updateVariantChart', this.variantChart);
      },
      classifySymbolsByImpact: function(d,i) {
        var impacts = "";
        var colorimpacts = "";
        var effects = "";
        var sift = "";
        var polyphen = "";
        var regulatory = "";

        var effectList = (annotationScheme == null || annotationScheme.toLowerCase() == 'snpeff' ? d.effect : d.vepConsequence);
        for (var key in effectList) {
          if (annotationScheme.toLowerCase() == 'vep' && key.indexOf("&") > 0) {
              var tokens = key.split("&");
              tokens.forEach( function(token) {
              effects += " " + token;

              });
            } else {
              effects += " " + key;
            }
          }
          var impactList =  (annotationScheme == null || annotationScheme.toLowerCase() == 'snpeff' ? d.impact : d[IMPACT_FIELD_TO_FILTER]);
          for (var key in impactList) {
            impacts += " " + key;
          }
          var colorImpactList =  (annotationScheme == null || annotationScheme.toLowerCase() == 'snpeff' ? d.impact : d[IMPACT_FIELD_TO_COLOR]);
          for (var key in colorImpactList) {
            colorimpacts += " " + 'impact_'+key;
          }
          if (colorimpacts == "") {
            colorimpacts = "impact_none";
          }
          for (var key in d.sift) {
            sift += " " + key;
          }
          for (var key in d.polyphen) {
            polyphen += " " + key;
          }
          for (var key in d.regulatory) {
            regulatory += " " + key;
          }

        return  'variant ' + d.type.toLowerCase()  + ' ' + d.zygosity.toLowerCase() + ' ' + (d.inheritance ? d.inheritance.toLowerCase() : "") + ' ua_' + d.ua + ' '  + sift + ' ' + polyphen + ' ' + regulatory +  ' ' + + ' ' + d.clinvar + ' ' + impacts + ' ' + effects + ' ' + d.consensus + ' ' + colorimpacts;
      }
    },
    watch: {
      data: function() {
        console.log("VariantViz data has changed")
        this.update();
      }

    }
}
</script>