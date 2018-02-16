/*
 * Variant.vue
 *
 */
<style lang="sass">

@import ../../../assets/sass/variables

#bam-track
  margin-top: -5px

#variant-card
  #gene-viz
    .axis
      padding-left: 0px
      padding-right: 0px
      margin-top: -10px
      margin-bottom: 0px
      padding-bottom: 0px
      text
        font-size: 11px
        fill: rgb(120, 120, 120)
      line, path
        fill: none
        stroke: lightgrey
        shape-rendering: crispEdges
        stroke-width: 1px
      &.x
        .tick
          line
            transform: translateY(-14px)
          text
            transform: translateY(6px)
        path
          transform: translateY(-20px)
          display: none

  .clinvar-switch
    margin-left: 25px

    label
      padding-left: 7px
      line-height: 18px
      font-size: 14px
      font-weight: normal
      padding-top: 2px
      color: $text-color

</style>

<style lang="css">

</style>


<template>

  <v-card tile id="variant-card" class="app-card">
    <v-card-title primary-title>
      {{ sampleModel.name }}

      <v-switch class="clinvar-switch"
      v-if="sampleModel.relationship == 'proband'"
      v-bind:label="`Display all ${selectedGene.gene_name} ClinVar variants`"
      v-model="showKnownVariantsCard"
      >
      </v-switch>

      <div style="width:100%">

        <div style="text-align: center;clear: both;">
          <div class="loader vcfloader" v-bind:class="{ hide: !sampleModel.inProgress.loadingVariants }" style="display: inline-block;">
            <span class="loader-label">Annotating variants</span>
            <img src="../../../assets/images/wheel.gif">
          </div>
          <div class="loader fbloader" v-bind:class="{ hide: !sampleModel.inProgress.callingVariants }" style="display: inline-block;padding-left: 20px;">
            <span class="loader-label">Calling variants</span>
            <img src="../../../assets/images/wheel.gif">
          </div>
          <div class="loader covloader" v-bind:class="{ hide: !sampleModel.inProgress.loadingCoverage }"style="display: inline-block;padding-left: 20px;">
            <span class="loader-label">Analyzing gene coverage</span>
            <img src="../../../assets/images/wheel.gif">
          </div>
        </div>

        <known-variants-toolbar
          v-if="sampleModel.relationship == 'known-variants'"
          @knownVariantsVizChange="onKnownVariantsVizChange"
          @knownVariantsFilterChange="onKnownVariantsFilterChange"
        >
        </known-variants-toolbar>

        <variant-viz id="called-variant-viz"
          v-if="showVariantViz && sampleModel.calledVariants.length > 0"
          ref="calledVariantVizRef"
          :data="sampleModel.calledVariants"
          :regionStart="regionStart"
          :regionEnd="regionEnd"
          :annotationScheme="annotationScheme"
          :width="width"
          :margin="variantVizMargin"
          :variantHeight="variantSymbolHeight"
          :variantPadding="variantSymbolPadding"
          :showBrush="false"
          :showXAxis="true"
          :classifySymbolFunc="classifyVariantSymbolFunc"
          @variantClick="onVariantClick"
          @variantHover="onVariantHover"
          @variantHoverEnd="onVariantHoverEnd">
        </variant-viz>

        <variant-viz id="loaded-variant-viz"
          v-if="showVariantViz"
          ref="variantVizRef"
          :data="sampleModel.loadedVariants"
          :regionStart="regionStart"
          :regionEnd="regionEnd"
          :annotationScheme="annotationScheme"
          :width="width"
          :margin="variantVizMargin"
          :variantHeight="variantSymbolHeight"
          :variantPadding="variantSymbolPadding"
          :showBrush="false"
          :showXAxis="true"
          :classifySymbolFunc="classifyVariantSymbolFunc"
          @variantClick="onVariantClick"
          @variantHover="onVariantHover"
          @variantHoverEnd="onVariantHoverEnd">
        </variant-viz>

        <div id="bam-track">
          <depth-viz
            v-if="showDepthViz"
            ref="depthVizRef"
            :data="sampleModel.coverage"
            :coverageMedian="sampleModel.cohort.filterModel.geneCoverageMedian"
            :coverageDangerRegions="coverageDangerRegions"
            :currentPoint="coveragePoint"
            :maxDepth="sampleModel.maxDepth"
            :regionStart="regionStart"
            :regionEnd="regionEnd"
            :width="width"
            :margin="depthVizMargin"
            :height="60"
            :showTooltip="false"
            :showXAxis="false"
            :regionGlyph="depthVizRegionGlyph"
            @region-selected="showExonTooltip"
          >
          </depth-viz>
        </div>

        <gene-viz id="gene-viz"
          v-bind:class="{ hide: !showGeneViz }"
          :data="[selectedTranscript]"
          :margin="geneVizMargin"
          :width="width"
          :height="40"
          :trackHeight="geneVizTrackHeight"
          :cdsHeight="geneVizCdsHeight"
          :regionStart="regionStart"
          :regionEnd="regionEnd"
          :showBrush="false"
          :featureClass="getExonClass"
          @feature-selected="showExonTooltip"
          >
        </gene-viz>

      </div>
    </v-card-title>

  </v-card>



</template>

<script>


import GeneViz              from "../viz/GeneViz.vue"
import VariantViz           from "../viz/VariantViz.vue"
import DepthViz             from "../viz/DepthViz.vue"
import KnownVariantsToolbar from "../partials/KnownVariantsToolbar.vue"


export default {
  name: 'variant-card',
  components: {
    VariantViz,
    GeneViz,
    DepthViz,
    KnownVariantsToolbar
  },
  props: {
    sampleModel: null,
    annotationScheme: null,
    classifyVariantSymbolFunc: null,

    variantTooltip: null,
    selectedGene: {},
    selectedTranscript: {},

    selectedVariant: null,
    regionStart: 0,
    regionEnd: 0,
    width: 0,


    showVariantViz: true,
    showGeneViz: true,
    showDepthViz: true
  },




  data() {
    return {
      margin: {
        top: isLevelBasic || isLevelEdu ? 0 : 20,
        right: isLevelBasic || isLevelEdu ? 7 : 2,
        bottom: 18,
        left: isLevelBasic || isLevelEdu ? 9 : 4
      },
      variantVizMargin: {
        top: 0,
        right: isLevelBasic || isLevelEdu ? 7 : 2,
        bottom: 5,
        left: isLevelBasic || isLevelEdu ? 9 : 4
      },
      variantSymbolHeight: isLevelEdu  || isLevelBasic ? EDU_TOUR_VARIANT_SIZE : 8,
      variantSymbolPadding: 2,

      geneVizMargin: {
        top: 0,
        right: isLevelBasic || isLevelEdu ? 7 : 2,
        bottom: 18, left:
        isLevelBasic || isLevelEdu ? 9 : 4
      },
      geneVizTrackHeight: isLevelEdu || isLevelBasic ? 32 : 16,
      geneVizCdsHeight: isLevelEdu || isLevelBasic ? 24 : 12,
      depthVizMargin: {
        top: 22,
        right: isLevelBasic || isLevelEdu ? 7 : 2,
        bottom: 0,
        left: isLevelBasic || isLevelEdu ? 9 : 4
      },
      depthVizYTickFormatFunc: null,
      coveragePoint: null,
      relationship: null,
      selectedExon: null,

      showKnownVariantsCard: false

    }
  },


  methods: {
    depthVizYTickFormat: function(val) {
      if (val == 0) {
        return "";
      } else {
        return val + "x";
      }
    },
    depthVizRegionGlyph: function(exon, regionGroup, regionX) {
      var exonId = 'exon' + exon.exon_number.replace("/", "-");
      if (regionGroup.select("g#" + exonId).empty()) {
        regionGroup.append('g')
              .attr("id", exonId)
              .attr('class',      'region-glyph coverage-problem-glyph')
              .attr('transform',  'translate(' + (regionX - 12) + ',-16)')
              .data([exon])
              .append('use')
              .attr('height',     '22')
              .attr('width',      '22')
              .attr('href', '#long-arrow-down-symbol')
              .attr('xlink','http://www.w3.org/1999/xlink')
              .data([exon]);
      }
    },
    onVariantClick: function(variant) {
      if (this.showDepthViz) {
        this.showCoverageCircle(variant);
      }
      if (this.showVariantViz) {
        this.showVariantCircle(variant);
        this.showVariantTooltip(variant, true);
      }
      this.$emit('cohortVariantClick', variant, this);
    },
    onVariantHover: function(variant, showTooltip=true) {
      if (this.selectedVariant == null) {
        if (this.showDepthViz) {
          this.showCoverageCircle(variant);
        }
        if (this.showVariantViz) {
          this.showVariantCircle(variant);
          this.showVariantTooltip(variant, false);
        }
        this.$emit('cohortVariantHover', variant, this);
      }
    },
    onVariantHoverEnd: function() {
      if (this.selectedVariant == null) {
        if (this.showDepthViz) {
          this.hideCoverageCircle();
        }
        if (this.showVariantViz) {
          this.hideVariantCircle();
          this.hideVariantTooltip(this);
        }
        this.$emit('cohortVariantHoverEnd');
      }

    },
    showVariantTooltip: function(variant, lock) {
      let self = this;

      let tooltip = d3.select("#main-tooltip");

      if (lock) {
        tooltip.style("pointer-events", "all");
      } else {
        tooltip.style("pointer-events", "none");
      }


      var x = variant.screenX;
      var y = variant.screenY;

      var coord = {'x':                  x,
                   'y':                  y,
                   'height':             33,
                   'parentWidth':        self.$el.offsetWidth,
                   'preferredPositions': [ {top:    ['center', 'right','left'  ]},
                                           {right:  ['middle', 'top',  'bottom']},
                                           {left:   ['middle', 'top',  'bottom']},
                                           {bottom: ['center', 'right','left'  ]} ] };


      self.variantTooltip.fillAndPositionTooltip(tooltip,
        variant,
        lock,
        coord,
        self.sampleModel.relationship,
        self.sampleModel.getAffectedInfo(),
        self.sampleModel.cohort.mode,
        self.sampleModel.cohort.maxAlleleCount);

      tooltip.selectAll("#unpin").on('click', function() {
        self.unpin(null, true);
      });
      tooltip.selectAll("#tooltip-scroll-up").on('click', function() {
        self.tooltipScroll("up");
      });
      tooltip.selectAll("#tooltip-scroll-down").on('click', function() {
        self.tooltipScroll("down");
      });
      tooltip.selectAll("#flag-variant").on('click', function() {
        self.unpin(null, true);
        self.selectedVariant.isFlagged = true;
        self.$emit('flag-variant', self.selectedVariant);
      });
      tooltip.selectAll("#remove-flagged-variant").on('click', function() {
        self.unpin(null, true);
        self.selectedVariant.isFlagged = false;
        self.$emit('remove-flagged-variant', self.selectedVariant);
      });

    },
    tooltipScroll(direction) {
      this.variantTooltip.scroll(direction, "#main-tooltip");
    },
    unpin(saveClickedVariant, unpinMatrixTooltip) {
      this.$emit("cohortVariantClickEnd", this);

      this.hideVariantTooltip();
      this.hideVariantCircle();
      this.hideCoverageCircle();

      //if (unpinMatrixTooltip) {
      //  matrixCard.unpin();
      //}
    },
    hideVariantTooltip: function() {
      let tooltip = d3.select("#main-tooltip");
      tooltip.transition()
           .duration(500)
           .style("opacity", 0)
           .style("z-index", 0)
           .style("pointer-events", "none");
    },
    showVariantCircle: function(variant) {
      if (this.showVariantViz) {
        this.$refs.variantVizRef.showVariantCircle(variant,this.getVariantSVG(variant),false);
      }
    },
    hideVariantCircle: function() {
      if (this.showVariantViz) {
        var container = d3.select(this.$el).select('#loaded-variant-viz > svg');
        this.$refs.variantVizRef.hideVariantCircle(container);
        container = d3.select(this.$el).select('#called-variant-viz > svg');
        this.$refs.variantVizRef.hideVariantCircle(container);
      }
    },
    getVariantSVG: function(variant) {
      return variant.fbCalled && variant.fbCalled == 'Y'
          ? d3.select(this.$el).select('#called-variant-viz > svg')
          : d3.select(this.$el).select('#loaded-variant-viz > svg');
    },
    hideCoverageCircle: function() {
      if (this.showDepthViz) {
        this.$refs.depthVizRef.hideCurrentPoint();
      }
    },
    showCoverageCircle: function(variant) {
      let self = this;

      if (self.showDepthViz && self.sampleModel.coverage != null) {
        let theDepth = null;
        if (variant.bamDepth != null && variant.bamDepth != '') {
          theDepth = variant.bamDepth;
        } else {
          var matchingVariants = self.sampleModel.loadedVariants.features.filter(function(v) {
            return v.start == variant.start && v.alt == variant.alt && v.ref == variant.ref;
          })

          if (matchingVariants.length > 0) {
            theDepth = matchingVariants[0].bamDepth;
            // If samtools mpileup didn't return coverage for this position, use the variant's depth
            // field.
            if (theDepth == null || theDepth == '') {
              theDepth = matchingVariants[0].genotypeDepth;
            }
          }
        }

        if (theDepth) {
          self.$refs.depthVizRef.showCurrentPoint({pos: variant.start, depth: theDepth});
        }
      }


    },
    onKnownVariantsVizChange: function(viz) {
      this.$emit("knownVariantsVizChange", viz);
    },
    onKnownVariantsFilterChange: function(selectedCategories) {
      this.$emit("knownVariantsFilterChange", selectedCategories);
    },
    showFlaggedVariant: function(variant) {
      if (this.showVariantViz) {
        var container = d3.select(this.$el).select('#loaded-variant-viz > svg');
        this.$refs.variantVizRef.showFlaggedVariant(variant, container);
      }
    },
    getExonClass: function(exon, i) {
      if (this.showDepthViz && exon.danger) {
        return exon.feature_type.toLowerCase() + (exon.danger[this.sampleModel.relationship] ? " danger" : "");
      } else {
        return exon.feature_type.toLowerCase();
      }
    },
    showExonTooltip: function(featureObject, feature, lock) {
      let self = this;
      let tooltip = d3.select("#exon-tooltip");

      if (featureObject == null) {
        self.hideExonTooltip();
        return;
      }

      if (self.selectedExon) {
        return;
      }

      if (lock) {
        self.selectedExon = feature;
        tooltip.style("pointer-events", "all");
        tooltip.classed("locked", true);
      } else {
        tooltip.style("pointer-events", "none");
        tooltip.classed("locked", false);
      }

      var coverageRow = function(fieldName, coverageVal, covFields) {
        var row = '<div>';
        row += '<span style="padding-left:10px;width:60px;display:inline-block">' + fieldName   + '</span>';
        row += '<span style="width:40px;display:inline-block">' + d3.round(coverageVal) + '</span>';
        row += '<span class="' + (covFields[fieldName] ? 'danger' : '') + '">' + (covFields[fieldName] ? covFields[fieldName]: '') + '</span>';
        row += "</div>";
        return row;
      }

      var html = '<div>'
               + '<span id="exon-tooltip-title"' + (lock ? 'style="margin-top:8px">' : '>') + (feature.hasOwnProperty("exon_number") ? "Exon " + feature.exon_number : "") + '</span>'
               + (lock ? '<a href="javascript:void(0)" id="exon-tooltip-close">X</a>' : '')
               + '</div>';
      html     += '<div style="clear:both">' + feature.feature_type + ' ' + utility.addCommas(feature.start) + ' - '       + utility.addCommas(feature.end) + '</div>';

      if (feature.geneCoverage && feature.geneCoverage[self.sampleModel.getRelationship()]) {
          var covFields = self.sampleModel.cohort.filterModel.whichLowCoverage(feature.geneCoverage[self.sampleModel.getRelationship()]);
          html += "<div style='margin-top:4px'>" + "Coverage:"
               +  coverageRow('min',    feature.geneCoverage[self.sampleModel.getRelationship()].min, covFields)
               +  coverageRow('median', feature.geneCoverage[self.sampleModel.getRelationship()].median, covFields)
               +  coverageRow('mean',   feature.geneCoverage[self.sampleModel.getRelationship()].mean, covFields)
               +  coverageRow('max',    feature.geneCoverage[self.sampleModel.getRelationship()].max, covFields)
               +  coverageRow('sd',     feature.geneCoverage[self.sampleModel.getRelationship()].sd, covFields)

      }
      if (lock) {
        html += '<div style="text-align:right;margin-top:8px">'
        + '<a href="javascript:void(0)" id="exon-tooltip-thresholds" class="danger" style="float:left"  >Set cutoffs</a>'
        + '</div>'
      }
      tooltip.html(html);
      if (lock) {
        //tooltip.select("#exon-tooltip-thresholds").on("click", function() {
          //$('#filter-track #coverage-thresholds').addClass('attention');
        //})
        tooltip.select("#exon-tooltip-close").on("click", function() {
          self.selectedExon = null;
          self.hideExonTooltip(true);
        })
      }

      var coord = utility.getTooltipCoordinates(featureObject.node(),
        tooltip, self.$el.offsetWidth, $('nav.toolbar').outerHeight());
      tooltip.style("left", coord.x + "px")
             .style("text-align", 'left')
             .style("top", (coord.y-60) + "px");

      tooltip.style("z-index", 1032);
      tooltip.transition()
             .duration(200)
             .style("opacity", .9);
    },
    hideExonTooltip: function(force) {
      let self = this;
      let tooltip = d3.select("#exon-tooltip");
      if (force || !self.selectedExon) {
        tooltip.classed("locked", false);
        tooltip.classed("black-arrow-left", false);
        tooltip.classed("black-arrow-right", false);
        tooltip.style("pointer-events", "none");
        tooltip.transition()
           .duration(500)
           .style("opacity", 0);
      }
    }

  },


  filters: {
  },

  computed: {
    depthVizHeight: function() {
      this.showDepthViz ? 0 : 60;
    },
    coverageDangerRegions: function() {
      let self = this;
      if (self.selectedTranscript.features) {
        var regions = [];
        self.selectedTranscript.features
        .filter( function(feature) {
            return feature.feature_type == 'CDS' || feature.feature_type == 'UTR';
        })
        .forEach(function(feature) {
          if (feature.danger[self.sampleModel.getRelationship()]) {
            regions.push(feature)
          }
        })
        return regions;
      } else {
        return [];
      }
    }

  },

  watch: {
    showKnownVariantsCard: function() {
      this.$emit("show-known-variants-card", this.showKnownVariantsCard);
    }
  },




  mounted: function() {
    this.relationship = this.sampleModel.relationship;

  },

  created: function() {
    this.depthVizYTickFormatFunc = this.depthVizYTickFormat ? this.depthVizYTickFormat : null;
  }



}
</script>
