<style lang="sass">
@import ../../../assets/sass/variables


#gene-badge-button
  font-size: 13px
  padding: 3px 1px 1px 1px
  margin: 0px
  color: $text-color
  line-height: 15px
  border: thin solid #e8e6e6
  display: flex
  width: 180px


  #gene-badge-symbols
    height: 14px
    padding-left: 4px
    padding-top: 0px
    padding-right: 2px
    display: flex




#gene-badge
  margin-top: 0px
  margin-bottom: 8px
  margin-right: 10px
  height: 21px
  display: flex
  width: 275px

  #gene-status
    display: flex
    min-width: 50px
    justify-content: flex-start
    align-items: center
    padding-top: 5px

  .gene-badge-loader
    width: 14px
    height: 14px
    padding-top: 1px
    display: none


  &.loaded
    #gene-badge-loaded
      display: inline

  &.called
    #gene-badge-called
      display: inline

  &.has-called-variants
    #gene-badge-has-called-variants
      display: inline

  &.has-coverage-problem
    #gene-badge-coverage-problem
      display: initial !important


  &.in-progress
    .gene-badge-loader
      display: inline


  &.has-error
    #gene-badge-error
      display: inline
      cursor: pointer

  &.has-warning
    #gene-badge-warning
      display: inline
      cursor: pointer

  &:hover #gene-badge-remove
    cursor: pointer
    visibility: visible
    i
      color: #E0292B !important
      font-weight: bold


  a
    color:  $text-color !important

    &:hover
      text-decoration: underline !important

  #variant-count
    width:         25px
    display:       inline-block
    margin-right:  2px
    margin-left:   2px
    font-size:     11px
    margin-top:    4px
    text-align:    right


#gene-badge.failed-filter
  opacity: .65

#gene-badge.loading
  border-left: #d8d8d8  solid 10px
  height: 22px


#gene-badge.loading.selected
  border-left: $app-color solid 12px


#gene-badge.selected
  border-width:  2px
  border-color: $current-color

  #gene-badge-name, #gene-badge-danger-count, #gene-badge-remove i
    font-weight: bold

#gene-badge.phenolyzer
  #gene-badge-button
    border: solid 1px #9FC2D0

#gene-badge-loaded
  font-size: 14px
  color: $loaded-variant-color
  font-weight: bold
  display: none

#gene-badge-called
  font-size: 14px
  font-weight: bold
  color: $called-variant-color-darker
  display: none

#gene-badge-has-called-variants
  font-size: 14px
  color: $called-variant-color
  display: none

#coverage-problem-icon
  display: none

#gene-badge-warning
  font-size: 16px
  color: $badge-warning-color
  padding-top: 0px
  padding-bottom: 1px
  padding-right: 2px
  display: none

#gene-badge-error
  font-size: 16px
  color: $badge-error-color
  padding-top: 0px
  padding-right: 2px
  padding-left: 1px
  display: none

#gene-badge-coverage-problem
  font-size: 15px
  margin-top: -1px
  margin-left: 0px
  color: $coverage-problem-color
  fill: $coverage-problem-color
  display: none

  &.dropdown-item
    display: inline-block
    margin-right: 3px
    margin-top: 1px




.impact-badge
  vertical-align: top

#gene-badge-remove
  margin-top: 3px
  i
    color: $text-color
    font-size: 13px

  visibility: visible

.myBadge
  background-color: #efeeee
  border-radius: 90px
  height: 16px
  color: #717171
  margin-left: 1px
  text-align: center
  vertical-align: middle
  width: 16px
  display: inline-block
  font-size: 11px
  font-family: raleway
</style>

<template>

<div id="gene-badge" v-bind:class="classObject" >

  <div id="gene-status">

        <i id="gene-badge-loaded" class="material-icons glyph">done</i>

        <img class="gene-badge-loader glyph" src="../../../assets/images/wheel.gif">

        <i id="gene-badge-called" class="level-edu material-icons glyph">done</i>
        <i id="gene-badge-has-called-variants" class="level-edu material-icons glyph">check_circle</i>

        <i id="gene-badge-warning" @click="onShowGeneAlerts" class="material-icons glyph">warning</i>
        <i id="gene-badge-error" @click="onShowGeneAlerts" class="material-icons glyph">error</i>

  </div>

  <a id="gene-badge-button"
    href="javascript:void(0)"
    v-bind:class="gene.isFlagged ? 'flagged' : ''"
    @click="selectGene"
    rel="tooltip"   data-html="true"
    data-placement="bottom">


        <span id="gene-badge-name" style="margin-left:2px;margin-right:2px">
          {{ gene.name }}
        </span>





      <span id="gene-badge-symbols" class="glyph">

          <app-icon
           id="gene-badge-user-flagged"
           v-if="hasFilteredVariants('userFlagged')"
           icon="user-flagged"
           class=" level-edu glyph"
           width="15" height="15">
          </app-icon>

          <app-icon
           v-if="gene && gene.dangerSummary && gene.dangerSummary.badges && showClinvar()"
           icon="clinvar"
           :level="getClinvarLevel()"
           id="gene-badge-clinvar"
           class=" level-edu glyph"
           width="13" height="14">
          </app-icon>

          <app-icon
           v-if="hasFilteredVariants('autosomalDominant')"
           icon="autosomal dominant"
           class=" level-edu glyph gene-badge-inheritance"
           width="15" height="15">
          </app-icon>


          <app-icon
           id=""
           v-if="hasFilteredVariants('recessive')"
           icon="recessive"
           class=" level-edu glyph gene-badge-inheritance"
           width="15" height="15">
          </app-icon>


          <app-icon
           v-if="hasFilteredVariants('denovo')"
           icon="denovo"
           class=" level-edu glyph gene-badge-inheritance"
           width="15" height="15">
          </app-icon>

          <app-icon
           v-if="hasFilteredVariants('xlinked')"
           :icon="getXLinkedIconName()"
           class=" level-edu glyph gene-badge-inheritance"
           width="15" height="15">
          </app-icon>


          <app-icon
           v-if="hasFilteredVariants('compoundHet')"
           icon="compound het"
           class=" level-edu glyph gene-badge-inheritance"
           width="15" height="15">
          </app-icon>



          <app-icon
           v-if="getImpactClass({'snp': true, 'mnp': true}) != null"
           icon="impact"
           type="snp"
           :clazz="getImpactClass({'snp': true, 'mnp': true})"
           width="15" height="15">
          </app-icon>


          <app-icon style="vertical-align:top"
           v-if="getImpactClass({'del': true}) != null"
           icon="impact"
           type="del"
           :clazz="getImpactClass({'del': true})"
           width="15" height="15">
          </app-icon>

          <app-icon style="vertical-align:top"
           v-if="getImpactClass({'ins': true}) != null"
           icon="impact"
           type="ins"
           :clazz="getImpactClass({'ins': true})"
           width="15" height="15">
          </app-icon>


          <app-icon style="vertical-align:top"
           v-if="getImpactClass({'complex': true}) != null"
           icon="impact"
           type="complex"
           :clazz="getImpactClass({'complex': true})"
            width="15" height="15">
          </app-icon>



          <app-icon id="gene-badge-coverage-problem"
           style="display:none;vertical-align:top"
           v-if="!isSimpleMode"
           icon="coverage"
           class=" level-edu glyph"
           width="12" height="11">
          </app-icon>



      </span>

  </a>


  <div id="variant-count" v-if="!launchedFromClin && !isEduMode && !isBasicMode && !isSimpleMode && gene && gene.dangerSummary" >
      {{ variantCount }}
  </div>

  <v-spacer/>



  <span class="d-flex ml-1"  v-if="launchedFromClin">
    <span v-for="(source, idx) in selectedGeneSources.sourceIndicator" :key="idx">
      <span
        v-tooltip.top-center="`${selectedGeneSources.source[idx]}`"
        class="mr-1">
        <div left color="grey lighten-1" class="myBadge">
          <span> {{ source }}</span>
        </div>
      </span>
    </span>
  </span>


  <div id="gene-badge-remove" v-if="!isEduMode" href="javascript:void(0)"
    @click="removeGene">
      <i style="vertical-align:middle" class="material-icons">close</i>
  </div>

</div>
</template>

<script>

import AppIcon         from '../partials/AppIcon.vue'


export default {
  name: 'gene-badge',
  components: {
    AppIcon
  },
  props: {
    gene: null,
    phenotypes: null,
    selectedGene: null,
    isEduMode: null,
    isBasicMode: null,
    launchedFromClin: null,
    isSimpleMode: null,
    geneModel: null,
    geneSource: null,
  },
  data () {
    return {
      selectedGeneSources: {},
      // geneSource: null,
      // launchedFromClin: false
    }
  },
  watch: {
    geneSource: function(){
      this.getSourceIndicatorBadge(this.gene.name)
    }
  },
  methods: {
    selectGene: function() {
      this.$emit("gene-selected", this.gene.name);
    },
    removeGene: function() {
      let self = this;
      let theGeneName = self.gene.name;
      self.$emit("remove-gene", theGeneName);

    },
    onShowGeneAlerts: function() {
      this.$emit('show-alerts-for-gene', this.gene.name)
    },
    getClinvarLevel: function() {
      var self = this;
      var theLevel = null;
      if (self.gene.dangerSummary && self.gene.dangerSummary.badges) {
        Object.keys(self.gene.dangerSummary.badges).forEach(function(filterName) {
          self.gene.dangerSummary.badges[filterName].forEach(function(variant) {
            let levelObj = self.globalApp.utility.getClinvarLevelAndOrdinal(variant)
            if (theLevel == null || levelObj.ordinal < theLevel.ordinal) {
              theLevel = levelObj;
            }
          })
        })
      }
      if (theLevel) {
        return Object.keys(theLevel)[0];
      } else {
        return "none";
      }
    },
    showClinvar: function() {
      var self = this;
      var theLevel = null;
      if (self.gene.dangerSummary && self.gene.dangerSummary.badges) {
        Object.keys(self.gene.dangerSummary.badges).forEach(function(filterName) {
          self.gene.dangerSummary.badges[filterName].forEach(function(variant) {
            let levelObj = self.globalApp.utility.getClinvarLevelAndOrdinal(variant)
            if (theLevel == null || levelObj.ordinal < theLevel.ordinal) {
              theLevel = levelObj;
            }
          })
        })
      }
      if (theLevel) {
        return Object.values(theLevel)[0]  <= 4;
      } else {
        return false;
      }
    },
    getImpactClass: function(variantTypes) {
      var self = this;
      var clazz = null;
      if (self.gene.dangerSummary && self.gene.dangerSummary.badges) {
        for (var variantType in variantTypes) {
          Object.keys(self.gene.dangerSummary.badges).forEach(function(filterName) {
            self.gene.dangerSummary.badges[filterName].forEach(function(variant) {
              if (variant.type.toUpperCase() == variantType.toUpperCase()) {
                if (clazz == null) {
                  if (variant.highestImpactVep.HIGH) {
                    clazz = 'filter-symbol impact_HIGH';
                  } else {
                    clazz = 'filter-symbol impact_MODERATE';
                  }
                }
              }
            })
          })
        }
      }
      return clazz;
    },
    hasFilteredVariants: function(filterName) {
      return this.gene
        && this.gene.dangerSummary
        && this.gene.dangerSummary.badges
        && this.gene.dangerSummary.badges[filterName]
        && this.gene.dangerSummary.badges[filterName].length > 0;
    },
    getXLinkedIconName: function() {
      let variantGlyphs = {}
      this.gene.dangerSummary.badges['xlinked'].forEach(function(variant) {
        if (variant.inheritanceGlyph) {
          variantGlyphs[variant.inheritanceGlyph] = true
        }
      })
      if (Object.keys(variantGlyphs).length == 1) {
        return Object.keys(variantGlyphs)[0]
      } else {
        return 'x-linked'
      }
    },
    getSourceIndicatorBadge: function(gene_name) {
      if(this.launchedFromClin){
        this.selectedGeneSources.source = this.geneModel.getSourceForGenes()[gene_name].source_gene_tab;
        this.selectedGeneSources.sourceIndicator = this.geneModel.getSourceForGenes()[gene_name].sourceIndicator;
      }
    },
  },
  computed: {
    classObject: function () {
      let hasError = false;
      if (this.gene.dangerSummary && this.gene.dangerSummary.ERROR && this.gene.dangerSummary.ERROR.length > 0) {
        hasError = true;
      } else if (this.gene.appErrors && this.gene.appErrors.length > 0) {
        hasError = true;
      }

      let hasWarning = false;
      if (!hasError) {
        hasWarning = this.gene.appWarnings && this.gene.appWarnings.length > 0;
      }

      return {

        'selected':              this.selectedGene && this.selectedGene.gene_name == this.gene.name,
        'in-progress':           this.gene.inProgress,
        'loaded':                this.gene.dangerSummary != null && !hasError,
        'called':                this.gene.dangerSummary && this.gene.dangerSummary.CALLED && this.gene.dangerSummary.calledCount == 0,
        'has-called-variants':   this.gene.dangerSummary && this.gene.dangerSummary.CALLED && this.gene.dangerSummary.calledCount > 0,
        'has-error':             hasError,
        'has-warning':           hasWarning,
        'has-phenotypes':        false,  //this.phenotypes && this.phenotypes.length > 0,
        'has-coverage-problem':  this.gene.dangerSummary && this.gene.dangerSummary.geneCoverageProblem
      }
    },
    variantCount: function() {
      if (this.gene.dangerSummary.isAlignmentsOnly) {
        if (this.gene.dangerSummary.CALLED) {
          return this.gene.dangerSummary.calledCount;
        } else {
          return "";
        }
      } else {
        return this.gene.dangerSummary.loadedCount != null ? this.gene.dangerSummary.loadedCount : "";
      }
    }


  },
  mounted: function() {
    this.getSourceIndicatorBadge(this.gene.name)
  }
}

</script>