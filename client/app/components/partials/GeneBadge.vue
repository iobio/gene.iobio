<style lang="sass">
@import ../../../assets/sass/variables


#gene-badge-button
  font-size: 13px
  padding: 3px 1px 1px 1px
  margin: 0px
  color: $text-color
  line-height: 15px
  border: thin solid #e8e6e6

  &.flagged
    border: 2px solid $app-color-light

  #gene-badge-symbols
    height: 14px
    padding-left: 3px
    padding-top: 0px
    float: left

  #gene-badge-phenotype-symbol
    float: right
    height: 14px
    padding-top: 1px
    display: none

  .gene-badge-loader
    width: 14px
    height: 14px
    float: left
    padding-top: 1px
    display: none

  #recessive-badge
    display: none

  #denovo-badge
    display: none

  #gene-badge-clinvar
    display: none

#gene-badge
  margin-top: 0px
  margin-bottom: 8px
  margin-right: 10px
  height: 21px
  display: inline-block

  &.visited
    #gene-badge-loaded
      display: inline
    #gene-badge-name
      color: $sidebar-text-color !important

  &.loaded
    #gene-badge-loaded
      display: inline

  &.called
    #gene-badge-called
      display: inline

  &.has-called-variants
    #gene-badge-has-called-variants
      display: inline

  &.is-flagged
    #gene-badge-bookmark
      display: inline

  &.in-progress
    .gene-badge-loader
      display: inline

  &.is-pathogenic
    #gene-badge-clinvar
      display: inline-block

  &.has-coverage-problem
    #gene-badge-coverage-problem
      display: inline-block

  &.has-phenotypes
    #gene-badge-phenotype-symbol
      display: inline-block

  &.inheritance-recessive
    #recessive-badge
      display: inline

  &.inheritance-denovo
    #denovo-badge
      display: inline

  &:hover #gene-badge-remove
    visibility: visible

  &.visited.error
    #gene-badge-loaded
      display: none
    #gene-badge-error
      display: inline
  &.called.error
    #gene-badge-called
      display: none
  &.has-called-variants.error
    #gene-badge-has-called-variants
      display: none

  &.visited.warning
    #gene-badge-loaded
      display: none
    #gene-badge-warning
      display: inline
  &.called.warning
    #gene-badge-called
      display: none
  &.has-called-variants.warning
    #gene-badge-has-called-variants
      display: none
  a
    color:  $sidebar-text-color !important

    &:hover
      text-decoration: underline !important


#gene-badge.failed-filter
  opacity: .65

#gene-badge.loading
  border-left: #d8d8d8  solid 10px
  //height: 22px


#gene-badge.loading.selected
  border-left: $app-color solid 12px


#gene-badge.selected
  border-left:  $app-color solid 12px
  //height: 22px
  #gene-badge-button
    //box-shadow: 0 6px 10px rgba(0, 0, 0, 0.23), 0 10px 10px rgba(0, 0, 0, 0.19)

  #gene-badge-name, #gene-badge-danger-count, #gene-badge-remove i
    font-weight: bold

#gene-badge.phenolyzer
  #gene-badge-button
    border: solid 1px #9FC2D0

#gene-badge-loaded
  font-size: 14px
  color: $heading-color
  font-weight: bold
  float: left
  display: none

#gene-badge-called
  font-size: 14px
  font-weight: bold
  color: $called-variant-color-darker
  float: left
  display: none

#gene-badge-has-called-variants
  font-size: 14px
  color: $called-variant-color
  float: left
  display: none

#gene-badge-bookmark
  color: $bookmark-color
  opacity: .7
  font-size: 14px
  vertical-align: top
  float: left
  padding-right: 2px
  display: none

#gene-badge-warning
  float: left
  font-size: 12px
  color: rgba(230, 126, 30, 0.84)
  padding-top: 0px
  padding-bottom: 1px
  padding-right: 2px
  display: none

#gene-badge-error
  float: left
  font-size: 12px
  color: rgba(204, 29, 7, 0.67)
  padding-top: 0px
  padding-right: 2px
  padding-left: 1px
  display: none

#gene-badge-coverage-problem
  font-size: 15px
  margin-top: -1px
  margin-left: 0px
  float: left
  color: $coverage-problem-color
  fill: $coverage-problem-color
  display: none

  &.dropdown-item
    display: inline-block
    margin-right: 3px
    margin-top: 1px

.coverage-problem-glyph
  fill: $coverage-problem-color

#gene-badge-harmful-variant
  font-size: 15px
  margin-top: -1px
  margin-left: 2px
  float: left
  color: #c70001
  display: none

  &.dropdown-item
    display: inline-block
    margin-right: 3px
    margin-top: 1px


.gene-badge-harmful-variant
  font-size: 15px
  margin-top: -1px
  margin-left: 2px
  float: left


#gene-badge-harmful1-variant
  display: none
  fill: #9d2024



#gene-badge-remove
  i
    color: #E0292B !important
    font-weight: bold
    font-size: 13px

  visibility: hidden

</style>

<template>

<div id="gene-badge" v-bind:class="classObject" >

  <a id="gene-badge-button"
    v-bind:class="gene.isFlagged ? 'flagged' : ''"
    style="display:inline-block" @click="selectGene"
    rel="tooltip"   data-html="true" href="#"
    data-placement="bottom">


        <img class="gene-badge-loader  glyph" src="../../../assets/images/wheel.gif">

        <i id="gene-badge-loaded" class="material-icons glyph">done</i>
        <i id="gene-badge-called" class="level-edu material-icons glyph">done</i>
        <i id="gene-badge-has-called-variants" class="level-edu material-icons glyph">check_circle</i>


        <i id="gene-badge-warning" class="material-icons glyph">warning</i>
        <i id="gene-badge-error" class="material-icons glyph">report_problem</i>


        <span id="gene-badge-name" style="float:left;margin-left:2px;margin-right:2px">
          {{ gene.name }}
        </span>
        <span id="gene-badge-phenotype-symbol" class="glyph" style="float:left;height:14px;">
          <svg class="phenotype-badge" height="14" width="14">
            <g class="phenotype" transform="translate(0,-1)">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#phenotype-symbol" width="13" height="13">
              </use>
            </g>
          </svg>
        </span>

        <i id="gene-badge-bookmark" class="material-icons">bookmark</i>



      <span id="gene-badge-symbols" class="glyph">

          <svg id="gene-badge-clinvar" class=" level-edu glyph" width="13" height="14">
              <g transform="translate(0,0)">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#clinvar-symbol" width="11.5"   height="11.5" style="fill: rgb(173, 73, 74);pointer-events: none;">
                  </use>
              </g>
          </svg>
          <svg id="recessive-badge" class="inheritance-badge" height="15" width="15">
            <g transform="translate(0,0)">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#recessive-symbol" width="15" height="15" style="pointer-events: none;">
              </use>
            </g>
          </svg>
          <svg id="denovo-badge" class="inheritance-badge" height="15" width="15">
            <g transform="translate(0,0)">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#denovo-symbol" width="15" height="15" style="pointer-events: none;">
              </use>
            </g>
          </svg>

          <svg
           v-if="getImpactClass({'snp': true, 'mnp': true}) != null"
           class="impact-badge" height="12" width="13">
            <g transform="translate(0,2)">
              <rect width="8" height="8"
              v-bind:class="getImpactClass({'snp': true, 'mnp': true})"
              style="pointer-events: none;"></rect>
            </g>
          </svg>

          <svg
           v-if="getImpactClass({'del': true}) != null"
           class="impact-badge" height="12" width="13">
            <g transform="translate(5,3)">
              <path d="M0,-4.161791450287817L4.805622828269509,4.161791450287817 -4.805622828269509,4.161791450287817Z"
              v-bind:class="getImpactClass({'del': true})">
              </path>
            </g>
          </svg>

          <svg
           v-if="getImpactClass({'ins': true}) != null"
           class="impact-badge" height="12" width="13">
            <g transform="translate(5,3)">
              <path d="M0,3.5682482323055424A3.5682482323055424,3.5682482323055424 0 1,1 0,-3.5682482323055424A3.5682482323055424,3.5682482323055424 0 1,1 0,3.5682482323055424Z"
              v-bind:class="getImpactClass({'ins': true})">
              </path>
            </g>
          </svg>

          <svg
           v-if="getImpactClass({'complex': true}) != null"
           class="impact-badge" height="13" width="13">
            <g transform="translate(4,6)">
              <path d="M0,-5.885661912765424L3.398088489694245,0 0,5.885661912765424 -3.398088489694245,0Z"
              v-bind:class="getImpactClass({'complex': true})">
              </path>
            </g>
          </svg>


        </span>

        <svg id="gene-badge-coverage-problem" class="gene-badge-coverage-problem level-edu glyph" width="14" height="14">
            <g transform="translate(1,2)">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#trending-down-symbol" width="11"   height="11" style="pointer-events: none;">
                </use>
            </g>
        </svg>

  </a>

  <div id="gene-badge-remove" href="javascript:void(0)"
    @click="removeGene"
    style="display: inline-block;cursor: pointer;float:right">
      <i style="vertical-align:middle" class="material-icons">close</i>

  </div>

</div>
</template>

<script>

export default {
  name: 'gene-badge',
  components: {
  },
  props: {
    gene: null,
    phenotypes: null,
    selectedGene: null,
  },
  data () {
    return {
    }
  },
  watch: {
  },
  methods: {
    selectGene: function() {
      this.$emit("gene-selected", this.gene.name);
    },
    removeGene: function() {
      let self = this;
      let theGeneName = self.gene.name;
      alertify.confirm("",
        "Are you sure you want to remove gene " + theGeneName + "?",
        function (e) {
          // ok
          self.$emit("remove-gene", theGeneName);
        },
        function() {
          // cancel
        }

      ).set('labels', {ok:'OK', cancel:'Cancel'});

    },
    getImpactClass: function(variantTypes) {
      var self = this;
      var clazz = null;
      if (self.gene.dangerSummary && this.gene.dangerSummary.badges.highOrModerate.length > 0 ) {
        for (var variantType in variantTypes) {
          if (self.gene.dangerSummary.IMPACT.HIGH && self.gene.dangerSummary.IMPACT.HIGH[variantType]) {
            clazz = 'filter-symbol impact_HIGH';
          } else if (self.gene.dangerSummary.IMPACT.MODERATE && self.gene.dangerSummary.IMPACT.MODERATE[variantType]) {
            clazz = 'filter-symbol impact_MODERATE';
          }
        }
      }
      return clazz;
    }
  },
  computed: {
    classObject: function () {
      return {

        'selected':              this.selectedGene && this.selectedGene.gene_name == this.gene.name,
        'in-progress':           this.gene.inProgress,
        'loaded':                this.gene.dangerSummary != null,
        'called':                this.gene.dangerSummary && this.gene.dangerSummary.CALLED && this.gene.dangerSummary.calledCount == 0,
        'has-called-variants':   this.gene.dangerSummary && this.gene.dangerSummary.CALLED && this.gene.dangerSummary.calledCount > 0,
        'has-phenotypes':        this.phenotypes && this.phenotypes.length > 0,
        'is-flagged':         this.gene.dangerSummary && this.gene.dangerSummary.badges && this.gene.dangerSummary.badges.flagged.length > 0,
        'is-pathogenic':         this.gene.dangerSummary && this.gene.dangerSummary.badges.pathogenic.length > 0,
        'inheritance-recessive': this.gene.dangerSummary && this.gene.dangerSummary.badges.recessive.length > 0,
        'inheritance-denovo':    this.gene.dangerSummary && this.gene.dangerSummary.badges.denovo.length > 0,
        'has-coverage-problem':  this.gene.dangerSummary && this.gene.dangerSummary.geneCoverageProblem
      }
    }
  },
  mounted: function() {
  }
}

</script>