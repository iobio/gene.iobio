
<style lang="sass" >
@import ../../../assets/sass/variables
#variant-detail
  padding-left: 30px
  min-height: 208px
  max-height: 208px
  padding-top: 0px

  .content
    font-size: 12px
    max-height: 180px
    padding-left: 10px
    padding-right: 50px
    overflow-x: scroll
    width: calc(100% - 330px)
    float: left

  .field-label
    color: #b4b3b3
    font-style: italic
    padding-right: 10px
    text-align: right

  .field-value
    padding-right: 10px
    word-break: break-word

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

    .tooltip-allele-count-bar
      text
        font-size: 11px !important
        fill:  $text-color

    #allele-count-legend
      padding-top: 0px

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

</style>


<template>

  <v-card tile id="variant-detail" class="app-card">
    <v-card-title primary-title style="width:100%">
      <span style="display:inline-block" v-if="showTitle ">Variant</span>
    </v-card-title>

      <div class="ref-alt text-xs-center" style="padding-bottom: 4px;">
        {{ selectedGene.gene_name }}
        {{ selectedVariant.type ? selectedVariant.type.toUpperCase() : "" }}
        {{ info.refalt  }}
        {{ info.coord }}
        {{ info.exon }}
        <span v-if="info.dbSnpLink" v-html="info.dbSnpLink"></span>
        <span id="inheritance" class="pl-1">{{ info.inheritance }}</span>
      </div>

    <v-layout class="content" column nowrap>
      <v-flex>
        <v-layout row>
           <v-flex xs4 class="field-label">Impact</v-flex>
           <v-flex xs8 class="field-value">{{ info.vepImpact }} - {{ info.vepConsequence }}</v-flex>
        </v-layout>
      </v-flex>
      <v-flex v-if="info.vepHighestImpact != ''">
        <v-layout row >
           <v-flex xs4 class="field-label">Most severe impact</v-flex>
           <v-flex xs8 class="field-value" v-html="info.vepHighestImpact"></v-flex>
        </v-layout>
      </v-flex>
      <v-flex >
        <v-layout row v-if="info.clinvarLink != ''">
           <v-flex xs4 class="field-label">Clinvar</v-flex>
           <v-flex xs8 class="field-value" v-html="info.clinvarLink"></v-flex>
        </v-layout>
      </v-flex>
      <v-flex >
        <v-layout row v-if="info.phenotype != ''">
           <v-flex xs4 class="field-label"></v-flex>
           <v-flex xs8 class="field-value">{{ info.phenotype }}</v-flex>
        </v-layout>
      </v-flex>
      <v-flex >
        <v-layout row>
           <v-flex xs4 class="field-label">HGVSc </v-flex>
           <v-flex xs8 class="field-value">{{ info.HGVSc }}</v-flex>
        </v-layout>
      </v-flex>
      <v-flex  >
        <v-layout row>
           <v-flex xs4 class="field-label">HGVSp </v-flex>
           <v-flex xs8>{{ info.HGVSp }}</v-flex>
        </v-layout>
      </v-flex>
      <v-flex   v-if="info.polyphen != ''">
        <v-layout row  >
           <v-flex xs4 class="field-label">Polyphen</v-flex>
           <v-flex xs8 class="field-value">{{ info.polyphen }}</v-flex>
        </v-layout>
      </v-flex>
      <v-flex v-if="info.sift != ''" >
        <v-layout row>
           <v-flex xs4 class="field-label">SIFT</v-flex>
           <v-flex xs8 class="field-value">{{ info.sift }}</v-flex>
        </v-layout>
      </v-flex>
      <v-flex  v-if="info.regulatory != ''">
        <v-layout row>
           <v-flex xs4 class="field-label">Regulatory</v-flex>
           <v-flex xs8 class="field-value">{{ info.regulatory }}</v-flex>
        </v-layout>
      </v-flex>

      <v-flex >
        <v-layout row>
           <v-flex xs4 class="field-label">gnomAD</v-flex>
           <v-flex xs8 class="field-value" v-html="afGnomAD"></v-flex>
        </v-layout>
      </v-flex>


      <v-flex   v-if="selectedVariant.afExAC && genomeBuildHelper.getCurrentBuildName() != 'GRCh37'" xs6>
        <v-layout row>
           <v-flex xs4 class="field-label">ExAC</v-flex>
           <v-flex xs8 class="field-value" v-html="afExAC"></v-flex>
        </v-layout>
      </v-flex>


      <v-flex v-if="selectedVariant.af1000G">
        <v-layout  row>
           <v-flex xs4 class="field-label">1000G</v-flex>
           <v-flex xs8 class="field-value" v-html="af1000G"></v-flex>
        </v-layout>
      </v-flex>


    </v-layout>

    <div  id="coverage-svg">
    </div>
  </v-card>

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
    genomeBuildHelper: null,
    cohortModel: null,
    variantTooltip: null,
    info: null,
    showTitle: null
  },
  data() {
    return {
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
      this.variantTooltip.createAlleleCountSVGTrio(selection,
        this.selectedVariant,
        'proband',   // FIXME - This needs to be passed in from event that sends variant selected event
        this.cohortModel.affectedInfo,
        this.cohortModel.mode,
        this.cohortModel.maxAlleleCount,
        this.variantTooltip.WIDTH_ALLELE_COUNT_BAR);

    },
    addInheritanceGlyph: function() {
      let self = this;
      if (self.selectedVariant && self.selectedVariant.inheritance != '') {
        var clazz = self.cohortModel.translator.inheritanceMap[self.selectedVariant.inheritance].clazz;
        var symbolFunction = self.cohortModel.translator.inheritanceMap[self.selectedVariant.inheritance].symbolFunction;
        var display = self.cohortModel.translator.inheritanceMap[self.selectedVariant.inheritance].display;
        $(self.$el).find("#inheritance").html("");
        $(self.$el).find("#inheritance").append("<svg class=\"inheritance-badge\"  height=\"15\" width=\"16\">");
        var options = {width:15, height:15, transform: 'translate(0,2)'};
        var selection = d3.select(self.$el).select("#inheritance .inheritance-badge").data([{clazz: clazz}]);
        symbolFunction(selection, options);
        d3.select(self.$el).select("#inheritance").append("span").text(display);
      }
    }
  },


  computed: {
    afGnomAD: function(af) {
      if (this.selectedVariant.vepAf.gnomAD.AF == ".") {
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


