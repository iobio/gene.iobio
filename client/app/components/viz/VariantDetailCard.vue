
<style lang="sass" >
@import ../../../assets/sass/variables
#variant-detail
  padding-left: 30px
  min-height: 218px
  max-height: 218px
  padding-top: 0px
  overflow-x: scroll

  .content
    font-size: 12px
    padding-left: 10px
    margin-bottom: 10px
    float: left
    max-width: 350px
    min-width: 350px

  .field-label
    color: #b4b3b3
    font-style: italic
    padding-left: 6px
    text-align: left

  .field-value
    padding-right: 25px
    word-break: break-word

  #inheritance
    height: 18px

  #coverage-svg
    float: left

    rect
      &.alt-count
        stroke: black !important

      &.ref-count
        stroke: black !important
        fill: none !important

      &.alt-count
        fill: #6A9C2F !important

      &.other-count
        stroke: black !important
        fill: rgb(132,132,132) !important

    text
      font-size: 12px !important

      &.alt-count
        fill: white !important

      &.alt-count-under
        fill: $text-color !important

      &.other-count
        fill: white  !important
        font-style: italic !important

      &.other-count-under
        fill: $text-color  !important
        font-style: italic !important

      &.ref-count
        fill: $text-color  !important

    .header-small
      overflow-wrap: break-word
      text-align: left
      width: 85px
      float: left
      color: $tooltip-label-color
      fill:  $tooltip-label-color

    .allele-count-bar
      text
        font-size: 11px !important
        fill:  $text-color

    #allele-count-legend
      padding-top: 0px


    .affected-symbol
      font-size: 14px
      color: $danger-color !important
      float: right
      padding-right: 2px


    .allele-count-bar
      overflow-wrap: break-word
      float: left
      width: 120px
      min-height: 25px

    .ped-info
      width: 270px
      clear: both
      line-height: 13px !important

    .ped-label
      padding-top: 0px
      vertical-align: top
      text-align: left
      width: 69px
      float: left
      font-size: 12px
      color: $text-color

    .ped-zygosity
      width: 75px
      float: left

    .zygosity
      float: left
      font-size: 9px
      font-weight: normal !important
      padding-top: 1px !important
      padding-bottom: 0px !important
      padding-right: 0px !important
      padding-left: 0px !important
      background-color: #D3D5D8 !important
      margin-right: 2px
      margin-top: 0px !important
      width: 39px !important
      color: black
      border: solid thin rgba(0, 0, 0, 0.22)
      cursor: none
      pointer-events: none

    .zygosity
      &.hom
        background-color: rgba(165, 48, 48, 0.76) !important
        color: white


      &.homref
        background-color: #5D809D !important
        color: rgba(255,255,255,1)

      &.unknown
        background-color: #b9edf3 !important

      &.none
        background-color: transparent !important
        border: solid thin #5D809D !important



</style>


<template>

  <div tile id="variant-detail" class="app-card">
    <div style="width:100%">
      <span style="display:inline-block" v-if="showTitle ">Variant</span>
    </div>

      <div  v-if="selectedVariant" class="mt-1 text-xs-center" style="padding-bottom: 4px;">
        <span>{{ selectedVariantRelationship | capitalize }}</span>
        <span class="pl-1">{{ selectedGene.gene_name }}</span>
        <span class="pl-1">{{ selectedVariant.type ? selectedVariant.type.toUpperCase() : "" }}</span>
        <span class="pl-1 refalt">{{ info.refalt  }}</span>
        <span class="pl-1">{{ info.HGVSpAbbrev }}</span>
        <span class="pl-3">{{ info.coord }}</span>
        <span class="pl-1">{{ info.exon }}</span>
        <span class="pl-3" v-if="info.dbSnpLink" v-html="info.dbSnpLink"></span>
      </div>

    <v-layout  v-if="selectedVariant" class="content" column nowrap>
      <v-flex v-if="selectedVariant.inheritance != '' && selectedVariant.inheritance != 'none' ">
        <v-layout row>
           <v-flex xs4 class="field-label">Inheritance</v-flex>
           <v-flex id="inheritance" xs9 class="field-value"></v-flex>
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout row>
           <v-flex xs4 class="field-label">Impact</v-flex>
           <v-flex xs9 class="field-value">{{ info.vepImpact }} - {{ info.vepConsequence }}</v-flex>
        </v-layout>
      </v-flex>
      <v-flex v-if="info.vepHighestImpact != ''">
        <v-layout row >
           <v-flex xs4 class="field-label">Most severe impact</v-flex>
           <v-flex xs9 class="field-value" v-html="info.vepHighestImpact"></v-flex>
        </v-layout>
      </v-flex>
      <v-flex >
        <v-layout row v-if="info.clinvarLink != ''">
           <v-flex xs4 class="field-label">Clinvar</v-flex>
           <v-flex xs9 class="field-value" v-html="info.clinvarLink"></v-flex>
        </v-layout>
      </v-flex>
      <v-flex >
        <v-layout row v-if="info.phenotype != ''">
           <v-flex xs4 class="field-label"></v-flex>
           <v-flex xs9 class="field-value">{{ info.phenotype }}</v-flex>
        </v-layout>
      </v-flex>
      <v-flex >
        <v-layout  row>
           <v-flex xs4 class="field-label">HGVSc </v-flex>
           <v-flex xs9 class="field-value">{{ info.HGVSc }}</v-flex>
        </v-layout>
      </v-flex>
      <v-flex  >
        <v-layout row>
           <v-flex xs4 class="field-label">HGVSp </v-flex>
           <v-flex xs9 class="field-value">{{ info.HGVSp }}</v-flex>
        </v-layout>
      </v-flex>
      <v-flex   v-if="info.polyphen != ''">
        <v-layout row  >
           <v-flex xs4 class="field-label">Polyphen</v-flex>
           <v-flex xs9 class="field-value">{{ info.polyphen }}</v-flex>
        </v-layout>
      </v-flex>
      <v-flex v-if="info.sift != ''" >
        <v-layout row>
           <v-flex xs4 class="field-label">SIFT</v-flex>
           <v-flex xs9 class="field-value">{{ info.sift }}</v-flex>
        </v-layout>
      </v-flex>
      <v-flex  v-if="info.regulatory != ''">
        <v-layout row>
           <v-flex xs4 class="field-label">Regulatory</v-flex>
           <v-flex xs9  v-html="info.regulatory" class="field-value"></v-flex>
        </v-layout>
      </v-flex>

      <v-flex>
        <v-layout row>
           <v-flex xs4 class="field-label">gnomAD</v-flex>
           <v-flex xs9 class="field-value" v-html="afGnomAD"></v-flex>
        </v-layout>
      </v-flex>


      <v-flex   v-if="selectedVariant.afExAC && genomeBuildHelper.getCurrentBuildName() != 'GRCh37'" xs6>
        <v-layout row>
           <v-flex xs4 class="field-label">ExAC</v-flex>
           <v-flex xs9 class="field-value" v-html="afExAC"></v-flex>
        </v-layout>
      </v-flex>


      <v-flex v-if="selectedVariant.af1000G">
        <v-layout  row>
           <v-flex xs4 class="field-label">1000G</v-flex>
           <v-flex xs9 class="field-value" v-html="af1000G"></v-flex>
        </v-layout>
      </v-flex>


    </v-layout>

    <div  id="coverage-svg">
    </div>
  </div>

</template>

<script>

import Vue from 'vue'

export default {
  name: 'variant-detail-card',
  components: {
  },
  props: {
    selectedGene: null,
    selectedTranscript: null,
    selectedVariant: null,
    selectedVariantRelationship: null,
    genomeBuildHelper: null,
    cohortModel: null,
    variantTooltip: null,
    info: null,
    showTitle: null
  },
  data() {
    return {
      WIDTH_ALLELE_COUNT_BAR: 120,
      WIDTH_ALLELE_COUNT_ROW: 270,
      AFFECTED_GLYPH: "<i class='material-icons affected-symbol'>spellcheck</i>"

    }
  },


  methods: {
    formatPopAF: function(afObject) {
      var popAF = "";
      if (afObject['AF'] != ".") {
        for (var key in afObject) {
          if (key != "AF") {
            var label = key.split("_")[0];
            if (popAF.length > 0) {
              popAF += ", ";
            }
            popAF += label + " " + (afObject[key] == "." ? "0%" : utility.percentage(afObject[key]));
          }
        }
      }
      return popAF;
    },
    refreshGlyphs: function() {
      if (this.selectedVariant) {
        this.createAlleleCountsSVG();
        this.addInheritanceGlyph();
      }
    },
    createAlleleCountsSVG: function() {
      var selection = d3.select("#variant-detail #coverage-svg");
      selection.selectAll(".ped-info").remove();
      this.createAlleleCountSVGTrio(selection,
        this.selectedVariant,
        'proband',   // FIXME - This needs to be passed in from event that sends variant selected event
        this.cohortModel.affectedInfo,
        this.cohortModel.mode,
        this.cohortModel.maxAlleleCount,
        this.WIDTH_ALLELE_COUNT_BAR);

    },
    addInheritanceGlyph: function() {
      let self = this;
      d3.select("#variant-detail #inheritance span").remove();
      d3.select("#variant-detail #inheritance .inheritance-badge").remove();
      if (self.selectedVariant && self.selectedVariant.inheritance != '') {
        var clazz = self.cohortModel.translator.inheritanceMap[self.selectedVariant.inheritance].clazz;
        var symbolFunction = self.cohortModel.translator.inheritanceMap[self.selectedVariant.inheritance].symbolFunction;
        var display = self.cohortModel.translator.inheritanceMap[self.selectedVariant.inheritance].display;
        $(self.$el).find("#inheritance").html("");
        $(self.$el).find("#inheritance").append("<svg class=\"inheritance-badge\"  height=\"15\" width=\"15\">");
        var options = {width:15, height:15, transform: 'translate(0,2)'};
        var selection = d3.select(self.$el).select("#inheritance .inheritance-badge").data([{clazz: clazz}]);
        symbolFunction(selection, options);
        d3.select(self.$el).select("#inheritance").append("span").text(display);
      }
    },



    createAlleleCountSVGTrio: function(container, variant, relationship, affectedInfo, cohortMode, maxAlleleCount, barWidth) {
      var me = this;


      container.select("div.ped-info").remove();

      var firstTime = true;
      affectedInfo.forEach(function(info) {

        var affectedStatus = info.status;
        var sampleName     = info.model.getSampleName();
        var genotype       = variant.genotypes[sampleName];

        if (genotype == null || genotype.absent && cohortMode == 'single') {
          // If vcf doesn't have any genotypes, skip showing this

        } else {

          var selectedClazz  = cohortMode == 'trio' && info.model.relationship == relationship ? 'selected' : '';

          var rel      = info.relationship;
          var row = container.append("div")
                             .attr("class", rel + "-alt-count ped-info");

              if (firstTime) {
                me._appendReadCountHeading(row);
                firstTime = false;
              }
          row.append("div")
               .attr("class", rel + "-alt-count header-small ")
               .html("<span class='ped-label "
                + selectedClazz + "'>"
                + " " + (rel == 'sibling' ? 'Sib' : utility.capitalizeFirstLetter(rel))
                + " " + (rel == 'sibling' ? sampleName : '')
                + "</span>"
                + (affectedStatus == 'affected' ? me.AFFECTED_GLYPH : ''));

              var zyg = genotype ? (!genotype.hasOwnProperty('zygosity') || genotype.zygosity == null || genotype.zygosity == "gt_unknown" ? "unknown" : genotype.zygosity.toLowerCase()) : "none";
          row.append("div")
             .attr("class",  "zygosity label " + zyg)
             .text(utility.capitalizeFirstLetter(zyg));


          var barContainer = row.append("div")
                                  .attr("class", rel + "-alt-count allele-count-bar")
          if (genotype) {
            me._appendAlleleCountSVG(barContainer,
              genotype.altCount,
              genotype.refCount,
              genotype.genotypeDepth,
              null,
              barWidth,
              maxAlleleCount);
          }
        }


      });


    },




    _appendReadCountHeading: function(container) {
      var me = this;
      var svg = container.append("div")
                 .attr("id", "allele-count-legend")
                   .append("svg")
                   .attr("width", me.WIDTH_ALLELE_COUNT_ROW)
                       .attr("height", "20");
      svg.append("text")
           .attr("x", "0")
           .attr("y", "14")
           .attr("anchor", "start")
           .attr("class", "header-small")
           .text("Read Counts");

      var g = svg.append("g")
                 .attr("transform", "translate(86,1)");

      g.append("text")
           .attr("x", "13")
           .attr("y", "9")
           .attr("class", "alt-count-under")
           .attr("anchor", "start")
           .text("alt");
      g.append("text")
           .attr("x", "37")
           .attr("y", "9")
           .attr("class", "other-count-under")
           .attr("anchor", "start")
           .text("other");
      g.append("text")
           .attr("x", "70")
           .attr("y", "9")
           .attr("class", "ref-count")
           .attr("anchor", "start")
           .text("ref");
      g.append("text")
           .attr("x", "90")
           .attr("y", "14")
           .attr("class", "ref-count")
           .attr("anchor", "start")
           .text("total");

      g.append("rect")
         .attr("x", "1")
         .attr("y", "10")
         .attr("height", 4)
         .attr("width",28)
         .attr("class", "alt-count");
      g.append("rect")
         .attr("x", "29")
         .attr("y", "10")
         .attr("height", 4)
         .attr("width",28)
         .attr("class", "other-count");
      g.append("rect")
         .attr("x", "57")
         .attr("y", "10")
         .attr("height", 4)
         .attr("width",28)
         .attr("class", "ref-count");

    },

    _appendAlleleCountSVG: function(container, genotypeAltCount,
      genotypeRefCount, genotypeDepth, bamDepth, barWidth, maxAlleleCount) {
      var me = this;

      var MAX_BAR_WIDTH = barWidth ? barWidth : me.ALLELE_COUNT_BAR_WIDTH;
      var PADDING = 20;
      var BAR_WIDTH = 0;
      if ((genotypeDepth == null || genotypeDepth == '') && (genotypeAltCount == null || genotypeAltCount.indexOf(",") >= 0)) {
        container.text("");
        var svg = container
                  .append("svg")
                  .attr("width", MAX_BAR_WIDTH + PADDING)
                  .attr("height", "21");
          return;
      }



      if (genotypeAltCount == null || genotypeAltCount.indexOf(",") >= 0) {
        BAR_WIDTH = d3.round(MAX_BAR_WIDTH * (genotypeDepth / maxAlleleCount));
        container.select("svg").remove();
        var svg = container
                  .append("svg")
                  .attr("width", MAX_BAR_WIDTH + PADDING)
                  .attr("height", "12");
        svg.append("rect")
           .attr("x", "1")
               .attr("y", "1")
             .attr("height", 10)
           .attr("width",BAR_WIDTH)
           .attr("class", "ref-count");

        svg.append("text")
           .attr("x", BAR_WIDTH + 5)
           .attr("y", "9")
           .text(genotypeDepth);

        var g = svg.append("g")
                   .attr("transform", "translate(0,0)");
        g.append("text")
            .attr("x", BAR_WIDTH / 2)
            .attr("y", "9")
            .attr("text-anchor", "middle")
            .attr("class", "ref-count")
            .text("?");
        return;
      }

      var totalCount = genotypeDepth;
      var otherCount = totalCount - (+genotypeRefCount + +genotypeAltCount);

      // proportion the widths of alt, other (for multi-allelic), and ref
      BAR_WIDTH      = d3.round((MAX_BAR_WIDTH) * (totalCount / maxAlleleCount));
      if (BAR_WIDTH < 10) {
        BAR_WIDTH = 10;
      }
      if (BAR_WIDTH > PADDING + 10) {
        BAR_WIDTH = BAR_WIDTH - PADDING;
      }
      var altPercent = +genotypeAltCount / totalCount;
      var altWidth   = d3.round(altPercent * BAR_WIDTH);
      var refPercent = +genotypeRefCount / totalCount;
      var refWidth   = d3.round(refPercent * BAR_WIDTH);
      var otherWidth = BAR_WIDTH - (altWidth+refWidth);

      // Force a separate line if the bar width is too narrow for count to fit inside or
      // this is a multi-allelic.
      var separateLineForLabel = (altWidth > 0 && altWidth / 2 < 11) || (refWidth > 0 && refWidth / 2 < 11) || (otherWidth > 0);

      container.select("svg").remove();
      var svg = container
                  .append("svg")
                  .attr("width", MAX_BAR_WIDTH + PADDING)
                  .attr("height", separateLineForLabel ? "21" : "12");

      if (altWidth > 0) {
        svg.append("rect")
         .attr("x", "1")
         .attr("y", "1")
         .attr("height", 10)
         .attr("width",altWidth)
         .attr("class", "alt-count");

      }

      if (otherWidth > 0) {
        svg.append("rect")
           .attr("x", altWidth)
           .attr("y", "1")
           .attr("height", 10)
           .attr("width", otherWidth)
           .attr("class", "other-count");
      }

      if (refWidth > 0) {
        svg.append("rect")
         .attr("x",  altWidth + otherWidth)
         .attr("y", "1")
         .attr("height", 10)
         .attr("width", refWidth)
         .attr("class", "ref-count");
      }



      svg.append("text")
         .attr("x", BAR_WIDTH + 5)
         .attr("y", "9")
         .text(totalCount);



      var altX = 0;
      var otherX = 0;
      var refX = 0;
      var g = svg.append("g")
                 .attr("transform", (separateLineForLabel ? "translate(-6,11)" : "translate(0,0)"));
      if (altWidth > 0) {
        var altX = d3.round(altWidth / 2);
        if (altX < 6) {
          altX = 6;
        }
         g.append("text")
           .attr("x", altX)
           .attr("y", "9")
           .attr("text-anchor", separateLineForLabel ? "start" : "middle")
           .attr("class", separateLineForLabel ? "alt-count-under" : "alt-count")
           .text(genotypeAltCount);

      }

      if (otherCount > 0) {
        otherX = altWidth  + d3.round(otherWidth / 2);
        // Nudge the multi-allelic "other" count over to the right if it is
        // too close to the alt count.
        if (otherX - 11 < altX) {
          otherX = altX + 10;
        }
        g.append("text")
           .attr("x", otherX)
           .attr("y", "9")
           .attr("text-anchor", separateLineForLabel ? "start" : "middle")
           .attr("class", separateLineForLabel ? "other-count-under" : "other-count")
           .text(otherCount);

        var gNextLine = g.append("g")
                         .attr("transform", "translate(-15,9)");
        svg.attr("height", 31);
        gNextLine.append("text")
                 .attr("x", otherX < 20 ? 20 : otherX)
             .attr("y", "9")
             .attr("text-anchor", "start")
             .attr("class", "other-count-under" )
             .text("(multi-allelic)");
      }
      if (genotypeRefCount > 0  && (altWidth > 0 || otherWidth > 0)) {
        refX = altWidth + otherWidth + d3.round(refWidth / 2);
        if (refX - 11 < otherX || refX - 11 < altX) {
          refX = refX + 10;
        }
        g.append("text")
             .attr("x", refX)
             .attr("y", "9")
             .attr("text-anchor", separateLineForLabel ? "start" : "middle")
             .attr("class", "ref-count")
             .text(genotypeRefCount);
      }

    }

  },


  computed: {
    afGnomAD: function(af) {
      if (this.selectedVariant.vepAf.gnomAD.AF == null) {
        return "unknown";
      } else if (this.selectedVariant.vepAf.gnomAD.AF == ".") {
        return "0%";
      } else  {
        var af = utility.percentage(this.selectedVariant.vepAf.gnomAD.AF);
        var link = "<a target='_gnomad' href='http://gnomad.broadinstitute.org/variant/" + this.selectedVariant.chrom + "-" + this.selectedVariant.start + "-" + this.selectedVariant.ref + "-" + this.selectedVariant.alt + "'>" + af + "</a>";
        link += "&nbsp;&nbsp;" + this.formatPopAF(this.selectedVariant.vepAf.gnomAD);
        return link;
      }
    },
    af1000G: function(af) {
      if (this.selectedVariant.af1000G == null) {
        return "0%";
      } else  {
        var af = utility.percentage(this.selectedVariant.af1000G);
        var popAF = this.formatPopAF(this.selectedVariant.vepAf['1000G']);
        return af + "&nbsp;&nbsp;" + popAF;
      }
    },
    afExAC: function() {
      return this.selectedVariant.afExAC ? utility.percentage(this.selectedVariant.afExAC) : "";
    }
  },

  watch: {
    selectedVariant: function() {
      if (this.selectedVariant) {
        this.createAlleleCountsSVG();
        this.addInheritanceGlyph();

      }

    }
  },

  filters: {
    capitalize: function(buf) {
      return utility.capitalizeFirstLetter(buf);
    }


  },

  updated: function() {
    if (this.selectedVariant) {
      this.createAlleleCountsSVG();
      this.addInheritanceGlyph();
    }
  },

  mounted: function() {
  },

  created: function() {
  }


}
</script>


