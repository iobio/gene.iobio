<style lang="sass" >
@import ../../../assets/sass/variables
#variant-inspect
  padding-left: 10px
  padding-top: 0px
  padding-right: 10px
  padding-bottom: 10px
  margin-bottom: 10px
  min-height: 200px


  .variant-inspect-body
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: space-between

    .variant-inspect-column
      display: flex
      flex-direction: column


      .variant-column-header
        font-size: 14px
        color:  $text-color
        margin-bottom: 10px

      .variant-row
        display: flex
        flex-direction: row
        font-size: 13px
        margin-bottom: 10px


  .rel-header
    font-style: italic


  #variant-heading
    color: $app-color
    padding-bottom: 10px
    font-size: 15px
    padding-top: 5px


  .variant-action-button
      padding: 0px
      height: 22px !important
      margin: 0px
      min-width: 100px !important
      max-width: 100px

      .btn__content
        color: $text-color !important
        padding-left: 8px
        padding-right: 8px
        font-size: 12px




</style>


<template>

  <v-card v-if="selectedVariant && info" tile id="variant-inspect" class="app-card full-width">

    <div  id="variant-heading" v-if="selectedVariant" class="text-xs-left">

      <span>Variant</span>

      <span class="pr-1 pl-1" v-if="selectedVariantRelationship == 'known-variants'">
        <app-icon
          icon="clinvar" width="16" height="16">
        </app-icon>
        <span class="rel-header">{{ selectedVariantRelationship | showRelationship }}</span>
      </span>



      <variant-links-menu
      :selectedGene="selectedGene"
      :selectedVariant="selectedVariant"
      :geneModel="cohortModel.geneModel"
      :info="info">
      </variant-links-menu>

      <gene-menu
      :selectedGene="selectedGene"
      :selectedTranscript="selectedTranscript"
      :geneModel="cohortModel.geneModel"
      @transcript-selected="onTranscriptSelected"
      @gene-source-selected="onGeneSourceSelected"
      @gene-region-buffer-change="onGeneRegionBufferChange">
      </gene-menu>

    </div>

    <div class="variant-inspect-body">
      <div class="variant-inspect-column">
          <div class="variant-column-header">
            Pathogenicity
          </div>
          <div class="variant-row">
            <v-icon class="high">check_circle</v-icon>
            <span>ClinVar Likely Pathogenic</span>
          </div>
          <div class="variant-row">
            <v-icon class="moderate">check_circle</v-icon>
            <span>High impact</span>
          </div>
          <div class="variant-row">
            <v-icon >check_circle</v-icon>
            <span>Stop gain</span>
          </div>
          <div class="variant-row">
            <v-icon class="high">check_circle</v-icon>
            <span>.83 REVEL</span>
          </div>
      </div>
      <div class="variant-inspect-column">
          <div class="variant-column-header">
            Frequency
          </div>
          <variant-inspect-row :clazz="afGnomAD.class" :value="afGnomAD.percent" :label="`gnomAD`" :link="afGnomAD.link" >
          </variant-inspect-row>
          <div v-if="afGnomAD.totalCount > 0" class="variant-row no-icon">
            <span>{{ afGnomAD.altCount }} out of {{ afGnomAD.totalCount }}</span>
          </div>
          <div v-if="afGnomAD.totalCount > 0"  class="variant-row no-icon">
            <span>{{ afGnomAD.homCount }} hom</span>
          </div>
      </div>
      <div class="variant-inspect-column">
          <div class="variant-column-header">
            Inheritance
          </div>
          <div class="variant-row ">
            <app-icon :icon="selectedVariant.inheritance" style="margin-right:4px" width="16" height="16"></app-icon>
            <span>{{ selectedVariant.inheritance == 'denovo' ? 'de novo' : selectedVariant.inheritance }}</span>
          </div>
      </div>
      <div class="variant-inspect-column">
          <div class="variant-column-header">
            Gene Phenotypes
          </div>
          <div class="variant-row ">
            <div>
              <div>
                <v-chip class="high">#14</v-chip>
                <span class="pheno-source">GTR</span>
                <span class="pheno-search-term">Smith Magenis Syndrome</span>
              </div>
              <div>
                <v-chip class="high">#28</v-chip>
                <span class="pheno-source">Phen.</span>
              </div>
            </div>
          </div>
          <div class="variant-row">
            <div>
              <div>
                <v-chip class="high">#114</v-chip>
                <span class="pheno-source">Phen.</span>
                <span class="pheno-search-term">Scoliosis</span>
              </div>
            </div>
          </div>
      </div>
      <div class="variant-inspect-column">
          <div class="variant-column-header">
            Quality
          </div>
          <div class="variant-row">
            <v-icon class="sufficient">check_circle</v-icon>
            <span>Allele counts</span>
            <v-icon>more_vert</v-icon>
          </div>
          <div class="variant-row">
            <v-btn v-if="selectedVariantRelationship != 'known-variants' && cohortModel.getModel(selectedVariantRelationship ? selectedVariantRelationship : 'proband').isBamLoaded() "
            class="variant-action-button"  @click="onShowPileup">
             Read Pileup...
            </v-btn>
          </div>
      </div>
    </div>

  </v-card>
</template>

<script>

import Vue               from 'vue'
import AppIcon           from "../partials/AppIcon.vue"
import VariantInspectRow from "../partials/VariantInspectRow.vue"
import VariantLinksMenu  from "../partials/VariantLinksMenu.vue"
import InfoPopup         from "../partials/InfoPopup.vue"
import GeneMenu          from "../partials/GeneMenu.vue"

export default {
  name: 'variant-inspect-card',
  components: {
    AppIcon,
    InfoPopup,
    VariantLinksMenu,
    VariantInspectRow,
    GeneMenu
  },
  props: {
    selectedGene: null,
    selectedTranscript: null,
    selectedVariant: null,
    selectedVariantRelationship: null,
    genomeBuildHelper: null,
    cohortModel: null,
    info: null
  },
  data() {
    return {


    }
  },


  methods: {
    refresh: function() {

    },
    formatPopAF: function(afObject) {
      let self = this;
      var popAF = "";
      if (afObject['AF'] != ".") {
        for (var key in afObject) {
          if (key != "AF") {
            var label = key.split("_")[0];
            if (popAF.length > 0) {
              popAF += ", ";
            }
            popAF += label + " " + (afObject[key] == "." ? "0%" : self.globalApp.utility.percentage(afObject[key]));
          }
        }
      }
      return popAF;
    },
    selectTranscript: function(transcriptId) {
      this.$emit("transcript-id-selected", transcriptId);
    },
    getNonCanonicalImpactDisplay: function(idx, impactRec) {
      let buf = "";
      if (idx > 0) {
        buf += " | ";
      }
      buf += impactRec.impact.toLowerCase() + ' impact ';
      return buf;
    },
    getNonCanonicalEffectDisplay: function(idx, effectRec) {
      let buf = "";
      if (idx > 0) {
        buf += " ,";
      } else {
        buf += " - ";
      }
      buf += effectRec.display + " in non-canonical transcripts ";
      return buf;
    },
    onShowPileup: function() {
      this.$emit("show-pileup-for-variant",
        this.selectedVariantRelationship ? this.selectedVariantRelationship : 'proband',
        this.selectedVariant);
    },



    formatCanonicalTranscript: function() {
      if (this.selectedTranscript) {
        return this.globalApp.utility.stripTranscriptPrefix(this.selectedTranscript.transcript_id);
      } else {
        return "";
      }
    },







    getRevelClass: function(info) {
      let self = this;
      let clazz = "field-value revel-field";
      self.cohortModel.translator.revelMap.forEach(function(revelRange) {
      if (info.revel >= revelRange.min && info.revel < revelRange.max) {
          clazz += " " + revelRange.clazz;
        }
      })
      return clazz;
    },
    getAfClass: function(af) {
      if (af <= .01) {
        return 'level-high';
      } else if (af <= .05) {
        return 'level-medium';
      } else {
        return 'level-unremarkable';
      }
    },
    getImpactClass: function(impact) {
      if (impact == 'high') {
        return 'level-high'
      } else if (impact == 'moderate') {
        return 'level-medium'
      } else {
        return '';
      }
    },

    onTranscriptSelected: function(transcript) {
      var self = this;
      self.$emit('transcript-selected', transcript);
    },


    onGeneSourceSelected: function(geneSource) {
      let self = this;
      self.$emit('gene-source-selected', geneSource);
    },

    onGeneRegionBufferChange: function(theGeneRegionBuffer) {
      this.$emit("gene-region-buffer-change", theGeneRegionBuffer);
    }
  },


  computed: {
    impactAndConsequence: function() {
      return "<span class='" + this.getImpactClass(this.info.vepImpact) + "'>"
       + this.info.vepImpact
       + " - "
       +  this.info.vepConsequence
       + "</span>"
    },
    afGnomAD: function() {
      if (this.selectedVariant.vepAf == null || this.selectedVariant.vepAf.gnomAD.AF == null) {
        return {percent: "?", link: null, class: ""};
      } else if (this.selectedVariant.vepAf.gnomAD.AF == ".") {
        return {percent: "0%", link: null, class: "level-high"};
      } else  {
        var gnomAD = {};
        gnomAD.link =  "http://gnomad.broadinstitute.org/variant/"
          + this.selectedVariant.chrom + "-"
          + this.selectedVariant.start + "-"
          + this.selectedVariant.ref + "-"
          + this.selectedVariant.alt;
        if (this.selectedVariant.gnomAD != null) {
          gnomAD.percent       = this.globalApp.utility.percentage(this.selectedVariant.gnomAD.af);
          gnomAD.class         = this.getAfClass(this.selectedVariant.gnomAD.af);
          gnomAD.percentPopMax = this.globalApp.utility.percentage(this.selectedVariant.gnomAD.afPopMax);
          gnomAD.altCount      = this.selectedVariant.gnomAD.altCount;
          gnomAD.totalCount    = this.selectedVariant.gnomAD.totalCount;
          gnomAD.homCount      = this.selectedVariant.gnomAD.homCount;
        } else {
          gnomAD.percent       = this.globalApp.utility.percentage(this.selectedVariant.vepAF.gnomAD.AF);
          gnomAD.class         = this.getAfClass(this.selectedVariant.vepAF.gnomAD.AF);
          gnomAD.percentPopMax = 0;
          gnomAD.altCount      = 0;
          gnomAD.totalCount    = 0;
          gnomAD.homCount      = 0;
        }
        return gnomAD;
      }
    },
    af1000G: function(af) {
      if (this.selectedVariant.af1000G == null) {
        return "0%";
      } else  {
        var af = this.globalApp.utility.percentage(this.selectedVariant.af1000G);
        var popAF = this.formatPopAF(this.selectedVariant.vepAf['1000G']);
        return "<span class='"
        + this.getAfClass(this.selectedVariant.af1000G) + "'>"
        + af
        + "</span>"
        +"<span style='margin-left:2px''>"
        + popAF
        + "</span>";
      }
    },
    afExAC: function() {
      return this.selectedVariant.afExAC ? this.globalApp.utility.percentage(this.selectedVariant.afExAC) : "";
    }
  },

  watch: {

  },

  filters: {
    showRelationship: function(buf) {
      if (buf == null) {
        return "";
      } else if (buf == 'known-variants') {
        return 'ClinVar';
      } else {
        // Capitalize first letter
        return buf.charAt(0).toUpperCase() + buf.slice(1);
      }
    }


  },

  updated: function() {

  },

  mounted: function() {
  },

  created: function() {
  }


}
</script>


