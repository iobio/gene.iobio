/*
 * FeatureMatrixCard.vue
 *
 */
<style lang="sass">
@import ../../../assets/sass/variables

#matrix-card

  #show-legend
      margin-left: 40px
      i
        font-size: 18px
        vertical-align: middle

  g.bookmark
    fill: #3773A7
    opacity: .7

  .matrix-note-text
    margin-top: -7px
    color: $hint-color
    font-style: italic

  #low-quality-legend
    font-size: 12px
    margin-left: 20px
    font-style: italic
    clear:both
    overflow: visible
    float: left

    #low-quality-legend-box
      display: inline-block
      width: 15px
      height: 15px
      background-color: $low-quality-cell-color
      border: solid thin $cell-border-color
      vertical-align: bottom
      float: left
      margin-top: 5px


  #low-quality-legend-text
    width: 160px
    float: left
    margin-left: 5px
    margin-bottom: 0px
    color:  $hint-color
    font-style: italic
    line-height: 13px


  #zero-variants
    color: white
    font-size: 14px
    text-align: center
    margin-bottom: 10px
    background-color:  $warning-background-color
    border: thin solid $warning-border-color
    width: 300px
    margin-left: auto
    margin-right: auto

    &.zero-filtered-variants
      color: $text-color
      background-color: $filter-summary-background-color
      border: solid thin $filter-summary-border-color

  #feature-matrix-note
    padding-left: 50px
    font-size: 12px
    margin-top: -15px

  #move-rows
    float: right
    font-size: 13px !important
    color: $text-color !important
    margin-top: 0px

  .show-settings-button
    margin-left: 5px
    margin-right: 0px
    margin-top: -5px
    margin-bottom: 0px
    float: right

</style>

<template>

  <v-card tile id="matrix-card" class="app-card">
    <div style="width:100%">
        <span style="float:left">
          Ranked Variants for {{ selectedGene.gene_name }}
        </span>
        <div id="rank-variants-title" class="hide card-label" style="">Evaluate Variants</div>

        <v-btn flat fab small slot="activator" class="show-settings-button" @click="showSettings = !showSettings"
        light>
          <v-icon style="font-size:17px" >settings</v-icon>
        </v-btn>
        <a v-if="showSettings" id="move-rows" class="level-edu level-basic" v-bind:class="{ hide: featureMatrixModel.rankedVariants.length == 0 }" href="javascript:void(0)" @click="toggleMoveRows">
           <i class="material-icons">swap_vert</i>
          Reorder
        </a>






    </div>

    <div style="clear:both;width:100%;margin-top:-10px">


      <div id="matrix-panel"  style="clear:both;min-height:30px"
        class="fullview" aria-expanded="true">


        <div id="feature-matrix" style="overflow-x: auto;">

          <feature-matrix-viz id="feature-matrix-viz"
            ref="featureMatrixVizRef"
            v-bind:class="{ hide: featureMatrixModel.rankedVariants.length == 0 }"
            :data="featureMatrixModel.rankedVariants"
            :matrixRows="featureMatrixModel.filteredMatrixRows"
            :annotationScheme="featureMatrixModel.cohort.annotationScheme"
            :width="width"
            :margin="margin"
            :cellSize="cellSize"
            :cellWidth="cellWidth"
            :cellHeights="featureMatrixModel.getCellHeights()"
            :columnLabel="columnLabel"
            :columnLabelHeight="columnLabelHeight"
            :columnLabelClass="columnLabelClass"
            :columnLabelSymbol="columnLabelSymbol"
            :rowLabelWidth="rowLabelWidth"
            :adjustTooltipCoordinates="adjustTooltipCoordinates"
            @featureMatrixRowUp="onFeatureMatrixRowUp"
            @featureMatrixRowDown="onFeatureMatrixRowDown"
            @variantClick="onVariantClick"
            @variantHover="onVariantHover"
            @variantHoverEnd="onVariantHoverEnd"
          >
          </feature-matrix-viz>
        </div>



        <div id="feature-matrix-note" v-bind:class="{ hide: featureMatrixModel.rankedVariants.length == 0 }" >

          <div style="display:inline-block;margin-left:130px">
            <svg style="height: 10px;width:108px">
              <g transform="translate(8,6)">
                <line x1="0" y1="0" x2="100" y2="0" style="stroke: lightgrey;stroke-width: 4;"></line>
              </g>
              <g transform="translate(-10,0),rotate(-90,10,0)">
                <polygon points="0,8 4,2 8,8" style="fill: lightgrey; stroke: lightgrey; stroke-width: 1px; opacity: 1;"></polygon>
              </g>
            </svg>

            <div class="matrix-note-text level-edu level-basic">
              More likely causative
            </div>
            <div id="matrix-harmful-note" class="matrix-note-text hide level-basic level-edu">
              Most harmful
            </div>

          </div>


        </div>


      </div>

      <div style="text-align: center;clear: both;">
        <div class="loader featureMatrixLoader"
        v-bind:class="{hide: featureMatrixModel.inProgress
          && !featureMatrixModel.inProgress.loadingVariants
          && !featureMatrixModel.inProgress.rankingVariants}" style="display: inline-block;">
          <span class="loader-label">
            {{ featureMatrixModel.getProgressText() }}
          </span>
          <img src="../../../assets/images/wheel.gif">
        </div>
      </div>
      <div  class="label label-warning level-edu" v-bind:class="{ hide: featureMatrixModel.warning.length == 0 }">
        {{ featureMatrixModel.warning }}
      </div>

    </div>
  </v-card>



</template>


<script>
import FeatureMatrixViz    from "../viz/FeatureMatrixViz.vue"


export default {
  name: 'feature-matrix-card',
  components: {
    FeatureMatrixViz
  },
  props: {
    name: "",
    featureMatrixModel: {},
    selectedGene: null,
    selectedTranscript: null,
    selectedVariant: null,
    relationship: null,
    variantTooltip: null,
    width: 0
  },
  data() {
    return {
      CELL_SIZE_SMALL: 18,
      CELL_SIZE_LARGE: 22,
      CELL_SIZE_EDU: 23,
      CELL_WIDTH_BASIC: 160,
      COLUMN_LABEL_HEIGHT: 28,
      COLUMN_LABEL_HEIGHT_BASIC: 30,
      ROW_LABEL_WIDTH: 165,
      ROW_LABEL_WIDTH_BASIC: 25,
      ROW_LABEL_WIDTH_EDU: 130,
      CELL_SIZE: null,


      margin: {top: 0, right: 40, bottom: 7, left: 0},
      cellSize: null,
      cellWidth: null,
      columnLabelHeight: null,
      rowLabelWidth: null,
      columnLabel: this.getVariantLabel,
      columnLabelClass: this.getVariantLabelClass,
      columnLabelSymbol: this.columnHeaderSymbol,
      adjustTooltipCoordinates: function(variant) {
      },

      showSettings: false


    }
  },



  methods: {

    toggleMoveRows: function() {
      $('#feature-matrix .y.axis .tick text').removeClass("current");
      if ($('#feature-matrix.shift-rows').length > 0) {
        $('#move-rows').text("Reorder");
      } else {
        $('#move-rows').text("Done");
      }
      $('#feature-matrix').toggleClass("shift-rows");
    },

    setCellSize: function(sizeEnum) {
      var toggle = false;
      if (sizeEnum == 'small' && this.CELL_SIZE != this.CELL_SIZE_SMALL) {
        this.CELL_SIZE = this.CELL_SIZE_SMALL;
        toggle = true;
      } else if (sizeEnum == 'large' && this.CELL_SIZE != this.CELL_SIZE_LARGE) {
        this.CELL_SIZE = this.CELL_SIZE_LARGE;
        toggle = true;
      }

      if (toggle && this.featureMatrix) {
        this.featureMatrix.cellSize(this.CELL_SIZE);
        if (getProbandVariantCard().model && getProbandVariantCard().model.vcfData) {
          this.promiseFillFeatureMatrix(getProbandVariantCard().model.vcfData);
        }
      }

    },



    getVariantLabelClass: function(variant, i) {
      if (variant.hasOwnProperty("fbCalled") && variant.fbCalled == "Y") {
        return "called"
      } else {
        return "";
      }
    },

    getVariantLabel: function(variant, i) {
      return (i+1).toString();
    },

    columnHeaderSymbol: function(selection, options) {
      options = options || {};
      if (!options.cellSize) {
        options.cellSize = this.CELL_SIZE;
      }

      selection.each(function(d) {
        var colhdr = d3.select(this);
        if (d.hasOwnProperty("fbCalled") && d.fbCalled == "Y") {
              colhdr.append("g")
                     .attr("transform", "translate(" + (options.cellSize - 17)/2 + ",-25)")
                     .append("use")
                     .attr("id", "checkmark-called")
                     .attr("xlink:href", "#circle-checkmark-symbol")
                     .attr("width",  17)
                     .attr("height", 17)
                     .style("pointer-events", "none");

        }

      })
    },

    onFeatureMatrixRowUp: function(i) {
      let self = this;
      if (isLevelEdu  || isLevelBasic) {
        return;
      }
      var column = null;
      var columnPrev = null;
      self.featureMatrixModel.filteredMatrixRows.forEach(function(col) {
        if (col.order == i) {
          column = col;
        } else if (col.order == i - 1) {
          columnPrev = col;
        }
      });
      if (column && columnPrev) {
        column.order = column.order - 1;
        columnPrev.order = columnPrev.order + 1;
      }
      self.$emit("variantRankChange");
    },

    onFeatureMatrixRowDown: function(i) {
      let self = this;
      if (isLevelEdu  || isLevelBasic) {
        return;
      }
      var column = null;
      var columnNext = null;
      self.featureMatrixModel.filteredMatrixRows.forEach(function(col) {
        if (col.order == i) {
          column = col;
        } else if (col.order == i + 1) {
          columnNext = col;
        }
      });
      if (column && columnNext) {
        column.order = column.order + 1;
        columnNext.order = columnNext.order - 1;
      }
      self.$emit("variantRankChange");
    },

    selectVariant: function(variant, clazz) {
      this.$refs.featureMatrixVizRef.selectVariant(variant, clazz);
    },

    onVariantClick: function(variant) {
      //this.showVariantTooltip(variant, true);
      this.hideVariantTooltip();
      this.$emit('cohortVariantClick', variant, this, 'proband');
    },

    onVariantHover: function(variant) {
      this.showVariantTooltip(variant, false);
      this.$emit('cohortVariantHover', variant, this);
    },

    onVariantHoverEnd: function() {
      this.hideVariantTooltip();
      this.$emit('cohortVariantHoverEnd', this);
    },

    showVariantTooltip: function(variant, lock) {
      let self = this;

      let tooltip = d3.select("#main-tooltip");

      if (lock) {
        tooltip.style("pointer-events", "all");
      } else {
        tooltip.style("pointer-events", "none");
      }
      var x = variant.screenXMatrix;
      var y = variant.screenYMatrix;
      var coord = {'x':                  x,
                   'y':                  y,
                   'height':             self.$el.offsetHeight,
                    // tooltip can span across width of main window
                   'parentWidth':        self.$el.parentNode.parentNode.offsetWidth,
                   'preferredPositions': [ {top:    ['center', 'right', 'left' ]},
                                           {right:  ['middle', 'top',   'bottom']},
                                           {left:   ['middle', 'top',   'bottom']},
                                           {bottom: ['right',  'left',  'center']} ]
                  };

      self.variantTooltip.fillAndPositionTooltip(tooltip,
        variant,
        self.selectedGene,
        self.selectedTranscript,
        lock,
        coord,
        'proband',
        self.featureMatrixModel.cohort.affectedInfo,
        self.featureMatrixModel.cohort.mode,
        self.featureMatrixModel.cohort.maxAlleleCount);

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
    },

    hideVariantTooltip() {
      let tooltip = d3.select("#main-tooltip");
      tooltip.transition()
           .duration(500)
           .style("opacity", 0)
           .style("z-index", 0)
           .style("pointer-events", "none");
    },

  },


  filters: {
  },

  computed: {
  },

  watch: {
  },

  mounted: function() {
  },

  created: function() {
    this.setCellSize('small');
    this.cellSize = isLevelEdu ? this.CELL_SIZE_EDU : (isLevelBasic ? null : this.CELL_SIZE);
    this.cellWidth = isLevelBasic ? this.CELL_WIDTH_BASIC : null;
    this.columnLabelHeight = isLevelEdu  || isLevelBasic ?  this.COLUMN_LABEL_HEIGHT_BASIC : this.COLUMN_LABEL_HEIGHT;
    this.rowLabelWidth = isLevelEdu  ? this.ROW_LABEL_WIDTH_EDU : (isLevelBasic ? this.ROW_LABEL_WIDTH_BASIC : this.ROW_LABEL_WIDTH);
  }



}
</script>

