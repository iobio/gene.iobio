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
        max-width: 260px


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

      <div style="display:inline-block;width:220px">
        <variant-links-menu
        :selectedGene="selectedGene"
        :selectedVariant="selectedVariant"
        :geneModel="cohortModel.geneModel"
        :info="info">
        </variant-links-menu>
      </div>

      <span class="pr-1 pl-1" v-if="selectedVariantRelationship == 'known-variants'">
        <app-icon
          icon="clinvar" width="16" height="16">
        </app-icon>
        <span class="rel-header">{{ selectedVariantRelationship | showRelationship }}</span>
      </span>

      <span  >
        <span>{{ selectedVariant.type ? selectedVariant.type.toUpperCase() : "" }}</span>
        <span class="pl-1">{{ info.coord }}</span>
        <span class="pl-1 refalt">{{ refAlt  }}</span>
        <span class="pl-2">{{ info.HGVSpAbbrev }}</span>
      </span>


    </div>

    <div class="variant-inspect-body">
      <div class="variant-inspect-column">
          <div class="variant-column-header">
            Pathogenicity
          </div>
          <variant-inspect-row  v-for="clinvar in info.clinvarLinks"
            :clazz="getClinvarClass(clinvar.significance)" :value="clinvar.clinsig" :label="`ClinVar`" :link="clinvar.url" >
          </variant-inspect-row>

          <variant-inspect-row
            :clazz="getImpactClass(info.vepImpact)" :value="info.vepImpact" :label="`Impact VEP`"  >
          </variant-inspect-row>

          <variant-inspect-row
            :clazz="getImpactClass(info.vepImpact)" :value="info.vepConsequence"   >
          </variant-inspect-row>

          <variant-inspect-row v-if="info.revel != '' && info.revel"
            :clazz="getRevelClass(info)" :value="info.revel"   :label="`REVEL`" >
          </variant-inspect-row>
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
      <div class="variant-inspect-column"  >
          <div class="variant-column-header">
            Gene Phenotypes
          </div>
          <div v-if="geneHits" v-for="geneHit in genePhenotypeHits" :key="geneHit.key" class="variant-row" style="flex-flow:column">
            <div v-for="geneRank in geneHit.geneRanks" :key="geneRank.rank">
              <div>
                <v-chip class="high">#{{ geneRank.rank }}</v-chip>
                <span v-if="geneRank.source" class="pheno-source">{{ geneRank.source }}</span>
                <span v-if="geneHit.searchTerm" class="pheno-search-term">{{ geneHit.searchTerm }}</span>
              </div>
            </div>
          </div>
      </div>
      <div class="variant-inspect-column">
          <div class="variant-column-header">
            Quality
          </div>
          <div class="variant-row">
            <variant-allele-counts-menu
              :selectedVariant="selectedVariant"
              :affectedInfo="cohortModel.affectedInfo"
              :cohortModel="cohortModel.mode"
              :relationship="selectedVariantRelationship">
            </variant-allele-counts-menu>
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

import Vue                      from 'vue'
import AppIcon                  from "../partials/AppIcon.vue"
import VariantInspectRow        from "../partials/VariantInspectRow.vue"
import VariantLinksMenu         from "../partials/VariantLinksMenu.vue"
import VariantAlleleCountsMenu  from "../partials/VariantAlleleCountsMenu.vue"
import InfoPopup                from "../partials/InfoPopup.vue"
import TranscriptsMenu          from '../partials/TranscriptsMenu.vue'

export default {
  name: 'variant-inspect-card',
  components: {
    AppIcon,
    InfoPopup,
    VariantLinksMenu,
    VariantInspectRow,
    VariantAlleleCountsMenu
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
      genePhenotypeHits: null


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
      let clazz = null;
      self.cohortModel.translator.revelMap.forEach(function(revelRange) {
      if (info.revel >= revelRange.min && info.revel < revelRange.max) {
          clazz = revelRange.clazz;
        }
      })

      if (clazz) {
        if (clazz == 'revel_high') {
          return 'level-high';
        } else if (clazz == 'revel_moderate') {
          return 'level-medium';
        } else {
          return 'level-unremarkable';
        }
      } else {
        return 'level-unremarkable';
      }

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
        return 'level-unremarkable';
      }
    },
    getClinvarClass: function(significance) {
      if (significance == 'clinvar_path' || significance == 'clinvar_lpath') {
        return 'level-high';
      } else if(significance == 'clinvar_cd') {
        return 'level-medium';
      } else if (significance == 'clinvar_benign' || significance == 'clinvar_lbenign') {
        return 'level-unremarkable';
      } else {
        return '';
      }
    },
    initGenePhenotypeHits: function() {
      let self = this;
      self.genePhenotypeHits = [];
      let searchTermRecs = self.cohortModel.geneModel.getGenePhenotypeHits(self.selectedGene.gene_name);
      if (searchTermRecs) {
        for (var searchTerm in searchTermRecs) {
          let searchTermLabel = searchTerm.split("_").join(" ");
          var rankRecs        = searchTermRecs[searchTerm];
          self.genePhenotypeHits.push( {key: searchTerm, searchTerm: searchTermLabel, geneRanks: rankRecs } );
        }
      }
    }

  },


  computed: {
    refAlt: function() {
      let self = this;
      var refAlt = "";
      if (self.selectedGene && self.selectedGene.strand && self.selectedVariant) {
        if (self.isEduMode) {
          if (self.selectedGene.strand == "-") {
            refAlt = self.globalApp.utility.switchGenotype(self.selectedVariant.eduGenotype)
          } else {
            refAlt = self.selectedVariant.eduGenotype;
          }
        } else {
          refAlt =   self.info.refalt;
        }
      }
      return refAlt;
    },
    afGnomAD: function() {
      if (this.selectedVariant.extraAnnot) {
        if (this.selectedVariant.gnomAD == null || this.selectedVariant.gnomAD.af == null) {
          return {percent: "?", link: null, class: ""};
        } else if (this.selectedVariant.gnomAD.af  == '.') {
          return {percent: "0%", link: null, class: "level-high"};
        } else  {
          var gnomAD = {};
          gnomAD.link =  "http://gnomad.broadinstitute.org/variant/"
            + this.selectedVariant.chrom + "-"
            + this.selectedVariant.start + "-"
            + this.selectedVariant.ref + "-"
            + this.selectedVariant.alt;

          gnomAD.percent       = this.globalApp.utility.percentage(this.selectedVariant.gnomAD.af);
          gnomAD.class         = this.getAfClass(this.selectedVariant.gnomAD.af);
          gnomAD.percentPopMax = this.globalApp.utility.percentage(this.selectedVariant.gnomAD.afPopMax);
          gnomAD.altCount      = this.selectedVariant.gnomAD.altCount;
          gnomAD.totalCount    = this.selectedVariant.gnomAD.totalCount;
          gnomAD.homCount      = this.selectedVariant.gnomAD.homCount;
          return gnomAD;
        }

      } else {
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

          gnomAD.percent       = this.globalApp.utility.percentage(this.selectedVariant.vepAf.gnomAD.AF);
          gnomAD.class         = this.getAfClass(this.selectedVariant.vepAf.gnomAD.AF);
          gnomAD.percentPopMax = 0;
          gnomAD.altCount      = 0;
          gnomAD.totalCount    = 0;
          gnomAD.homCount      = 0;
          return gnomAD;
        }

      }
    },
    geneHits: function() {
      return [
        { searchTerm: 'Smith Magenis',
          geneRanks: [
           {rank: 41, source: 'GTR'},
           {rank: 78, source: 'Phen.'},
          ]
        },
        { searchTerm: 'Scoliosis',
          geneRanks: [
           {rank: 115, source: 'Phen.'}
          ]
        },

      ]
    }
  },

  watch: {
    selectedVariant: function() {
      this.initGenePhenotypeHits();
    }

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
    },



  },

  updated: function() {

  },

  mounted: function() {
  },

  created: function() {
  }


}
</script>


