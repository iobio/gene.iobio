<style lang="sass" >
@import ../../../assets/sass/variables
#variant-inspect
  padding-left: 10px
  padding-top: 10px
  padding-right: 10px
  padding-bottom: 10px
  margin-bottom: 10px

  #notes-input
    margin-top: 8px
    .input-group input
      color: $text-color
    .input-group
      padding: 10px 0 0
    .input-group
      label
        font-size: 13px
        line-height: 14px
        height: 18px
        top: 8px
        font-weight: normal
    .input-group__input
      min-height: 0px
      margin-top: 8px
    .input-group--text-field input
      font-size: 13px
      height: 14px
    .input-group
      padding-top: 0px
    .input-group__details:before
      background-color: $text-color
    .input-group__details:after
      background-color: $text-color


  .variant-inspect-body
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: space-between
    padding-top: 5px

    .variant-inspect-column
      display: flex
      flex-direction: column
      padding: 5px
      padding-left: 0px
      min-width: 190px
      margin-bottom: 0px
      margin-right: 5px
      padding-top: 0px
      padding-bottom: 0px


      &.last
        border-right: none

      .variant-column-header
        font-size: 14px
        color:  $app-color
        margin-bottom: 10px

      .variant-row
        display: flex
        flex-direction: row
        font-size: 13px
        margin-bottom: 10px
        max-width: 260px

        &.last
          margin-bottom: 0px

      .pheno-search-term
        max-width: 160px
        display: inline-block
        vertical-align: top

      #qual-track
        margin-top: -20px
        #depth-viz
          .circle-label
            font-size: 12px !important

          .y.axis
            .tick
              text
                font-size: 10px !important

          .coverage-problem-glyph
            fill: $coverage-problem-glyph-color

        #gene-viz
          svg
            .transcript.current
              outline: none !important

  .rel-header
    font-style: italic


  #variant-heading
    color: $app-color
    padding-bottom: 5px
    font-size: 16px
    padding-top: 0px
    width: 154px
    display: flex
    justify-content: flex-start


  .variant-action-button
      padding: 0px
      height: 22px !important
      margin: 0px
      min-width: 110px !important
      max-width: 110px

      .btn__content
        color: $text-color !important
        padding-left: 8px
        padding-right: 8px
        font-size: 12px




</style>


<template>

  <v-card v-if="selectedVariant && info" tile id="variant-inspect" class="app-card full-width">

    <div style="display:flex;align-items:baseline;justify-content:flex-start">
      <div  id="variant-heading" v-if="selectedVariant" class="text-xs-left">
        <span class="pr-1" v-if="selectedVariantRelationship != 'proband'">
          <span class="rel-header">{{ selectedVariantRelationship | showRelationship }}</span>
        </span>

        Variant

        <variant-links-menu
        :selectedGene="selectedGene"
        :selectedVariant="selectedVariant"
        :geneModel="cohortModel.geneModel"
        :info="info">
        </variant-links-menu>


      </div>



      <span class="variant-heading" style="margin-left:10px" >

        <span>{{ selectedVariant.type ? selectedVariant.type.toUpperCase() : "" }}</span>
        <span class="pl-1">{{ info.coord }}</span>
        <span class="pl-1 refalt">{{ refAlt  }}</span>

        <app-icon
         style="padding-right:4px;padding-left:4px"
         icon="zygosity" v-if="selectedVariant.zygosity"
         :type="selectedVariant.zygosity.toLowerCase() + '-large'"
         height="14" width="35">
        </app-icon>

        <span v-if="info.rsId && info.rsId != ''" class="pl-4">{{ info.rsId }}</span>

      </span>

      <span v-if="!selectedVariant.extraAnnot" class="pl-4 loader vcfloader" >
        <img src="../../../assets/images/wheel.gif">
        HGVS...
      </span>

      <variant-aliases-menu
      v-show="selectedVariant.extraAnnot"
      class="pl-4"
      :label="hgvsLabel"
      :selectedGene="selectedGene"
      :selectedVariant="selectedVariant"
      :geneModel="cohortModel.geneModel"
      :info="info">
      </variant-aliases-menu>


    </div>



    <div class="variant-inspect-body">
      <div class="variant-inspect-column">
          <div class="variant-column-header">
            Pathogenicity
          </div>
          <variant-inspect-row  v-for="clinvar,clinvarIdx in info.clinvarLinks" :key="clinvarIdx"
            :clazz="getClinvarClass(clinvar.significance)" :value="clinvar.clinsig" :label="`ClinVar`" :link="clinvar.url" >
          </variant-inspect-row>

          <div v-if="info.clinvarTrait.length > 0" class="variant-row no-icon no-top-margin">
            <span>{{ info.clinvarTrait }} </span>
          </div>

          <variant-inspect-row
            :clazz="getImpactClass(info.vepImpact)" :value="info.vepImpact" :label="`Impact VEP`"  >
          </variant-inspect-row>

          <variant-inspect-row
             v-if="info.vepHighestImpactValue.length > 0 && info.vepImpact.toUpperCase() != info.vepHighestImpactValue.toUpperCase()"
            :clazz="getImpactClass(info.vepHighestImpactValue)" :value="getNonCanonicalImpact(info.vepHighestImpactValue)" :label=" `Impact VEP (non-canonical transcript)`"  >
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
      <div class="variant-inspect-column" v-if="selectedVariantRelationship != 'known-variants'">
          <div class="variant-column-header">
            Inheritance
          </div>
          <div class="variant-row ">
            <app-icon :icon="selectedVariant.inheritance" style="margin-right:4px" width="16" height="16"></app-icon>
            <span>{{ selectedVariant.inheritance == 'denovo' ? 'de novo' : selectedVariant.inheritance }}</span>
          </div>
      </div>
      <div class="variant-inspect-column" v-if="showGenePhenotypes" >
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
      <div class="variant-inspect-column last" v-if="selectedVariantRelationship != 'known-variants'">
          <div class="variant-column-header">
            Quality
          </div>


          <div id="qual-track" style="width:130px;margin-bottom:15px !important">
            <depth-viz
              v-if="cohortModel && hasAlignments"
              ref="depthVizRef"
              :data="coverage"
              :coverageMedian="cohortModel.filterModel.geneCoverageMedian"
              :coverageDangerRegions="coverageDangerRegions"
              :currentPoint="coveragePoint"
              :maxDepth="cohortModel.maxDepth"
              :regionStart="coverageRegionStart"
              :regionEnd="coverageRegionEnd"
              :width="130"
              :margin="depthVizMargin"
              :height="80"
              :showTooltip="false"
              :showXAxis="false"
              :regionGlyph="depthVizRegionGlyph"
              :showAlleleBar="true"
              @region-selected="showExonTooltip"

            >
            </depth-viz>
            <gene-viz id="gene-viz"
              v-if="cohortModel && hasAlignments"
              :data="[selectedTranscript]"
              :margin="geneVizMargin"
              :width="130"
              :height="16"
              :trackHeight="geneVizTrackHeight"
              :cdsHeight="geneVizCdsHeight"
              :regionStart="coverageRegionStart"
              :regionEnd="coverageRegionEnd"
              :showXAxis="false"
              :showBrush="false"
              :featureClass="getExonClass"
              @feature-selected="showExonTooltip"
              >
            </gene-viz>
          </div>

          <div class="variant-row">
            <variant-allele-counts-menu
              v-if="selectedVariantRelationship != 'known-variants' && cohortModel.getModel(selectedVariantRelationship ? selectedVariantRelationship : 'proband').isBamLoaded()"
              :selectedVariant="selectedVariant"
              :affectedInfo="cohortModel.affectedInfo"
              :cohortModel="cohortModel.mode"
              :relationship="selectedVariantRelationship">
            </variant-allele-counts-menu>
          </div>
          <div class="variant-row last">
            <v-btn v-if="selectedVariantRelationship != 'known-variants' && cohortModel.getModel(selectedVariantRelationship ? selectedVariantRelationship : 'proband').isBamLoaded() "
            class="variant-action-button"  @click="onShowPileup">
             <v-icon>format_align_center</v-icon>
             Read Pileup
            </v-btn>
          </div>
      </div>

    </div>

    <variant-assessment  v-if="selectedVariantRelationship == 'proband'"
      :variant="selectedVariant"
      :variantInterpretation="interpretation"
      :interpretationMap="interpretationMap"
      :variantNotes="notes"
      @apply-variant-notes="onApplyVariantNotes">
    </variant-assessment>

  </v-card>
</template>

<script>

import Vue                      from 'vue'
import AppIcon                  from "../partials/AppIcon.vue"
import VariantAssessment        from "../partials/VariantAssessment.vue"
import VariantInspectRow        from "../partials/VariantInspectRow.vue"
import VariantLinksMenu         from "../partials/VariantLinksMenu.vue"
import VariantAliasesMenu       from "../partials/VariantAliasesMenu.vue"
import VariantAlleleCountsMenu  from "../partials/VariantAlleleCountsMenu.vue"
import InfoPopup                from "../partials/InfoPopup.vue"
import TranscriptsMenu          from '../partials/TranscriptsMenu.vue'
import DepthViz                 from "../viz/DepthViz.vue"
import GeneViz                  from "../viz/GeneViz.vue"


export default {
  name: 'variant-inspect-card',
  components: {
    AppIcon,
    InfoPopup,
    VariantLinksMenu,
    VariantAliasesMenu,
    VariantInspectRow,
    VariantAlleleCountsMenu,
    VariantAssessment,
    DepthViz,
    GeneViz
  },
  props: {
    selectedGene: null,
    selectedTranscript: null,
    selectedVariant: null,
    selectedVariantKey: null,
    selectedVariantNotes: null,
    selectedVariantInterpretation: null,
    selectedVariantRelationship: null,
    interpretationMap: null,
    genomeBuildHelper: null,
    cohortModel: null,
    showGenePhenotypes: null,
    info: null,
    coverageDangerRegions: null,
  },
  data() {
    return {
      genePhenotypeHits: null,

      coverageRegionStart: null,
      coverageRegionEnd: null,
      exon: null,
      coverage: null,
      coveragePoint: null,
      selectedExon: null,

      depthVizMargin: {
        top: 30,
        right: 2,
        bottom: 0,
        left: 4
      },
      geneVizMargin: {
        top: 0,
        right: 2,
        bottom: 0,
        left: 4
      },
      geneVizTrackHeight: 16,
      geneVizCdsHeight: 12


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





    getNonCanonicalImpact: function(vepHighestImpact) {
      return this.globalApp.utility.capitalizeFirstLetter(vepHighestImpact.toLowerCase());
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
      if (self.selectedGene) {
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
    initCoverage: function() {
      let self = this;
      if (self.selectedVariant) {
        self.exon                = this.getExon();
        self.coverageRegionStart = this.getCoverageRegionStart();
        self.coverageRegionEnd   = this.getCoverageRegionEnd();

        let theCoverage = self.cohortModel.getModel(this.selectedVariantRelationship).coverage.filter(function(coveragePoint) {
          return coveragePoint[0] >= self.coverageRegionStart && coveragePoint[0] <= self.coverageRegionEnd;
        })
        let clonedCoverage = [];
        theCoverage.forEach(function(covPoint) {
          let newPoint = []
          newPoint.push(covPoint[0])
          newPoint.push(covPoint[1])
          clonedCoverage.push(newPoint)
        })
        self.coverage = clonedCoverage
        setTimeout(function() {
          self.showCoverageAlleleBar();
        }, 100)


      } else {
        self.exon = null;
        self.converageRegionStart = null;
        self.coverageRegionEnd = null;
        self.coverage = [];
      }
    },
    showCoverageAlleleBar: function() {
      let self = this;
      let theDepth = self.selectedVariant.bamDepth;
      let theAltCount = null;
      // If samtools mpileup didn't return coverage for this position, use the variant's depth
      // field.
      if (theDepth == null || theDepth == '') {
        theDepth = self.selectedVariant.genotypeDepth;
      }
      if (self.selectedVariant.genotype && self.selectedVariant.genotype.altCount) {
        theAltCount = self.selectedVariant.genotype.altCount;
      }

      if (self.$refs.depthVizRef) {
        self.$refs.depthVizRef.showCurrentPoint({pos: self.selectedVariant.start, depth: theDepth, altCount: theAltCount});
      }

    },
    onApplyVariantNotes: function(variant) {
      this.$emit("apply-variant-notes", variant);
    },
    onApplyVariantInterpretation: function(variant) {
      this.$emit("apply-variant-interpretation", variant);
    },



    depthVizRegionGlyph: function(exon, regionGroup, regionX) {
      var exonId = 'exon' + exon.exon_number.replace("/", "-");
      if (regionGroup.select("g#" + exonId).empty()) {
        regionGroup.append('g')
              .attr("id", exonId)
              .attr('class',      'region-glyph coverage-problem-glyph')
              .attr('transform',  'translate(' + (regionX - 6) + ',-25)')
              .data([exon])
              .append('use')
              .attr('height',     '12')
              .attr('width',      '12')
              .attr('href', '#coverage-problem-symbol')
              .attr('xlink','http://www.w3.org/1999/xlink')
              .data([exon]);
      }
    },
    getExonClass: function(exon, i) {
      if (exon && exon.danger) {
        return exon.feature_type.toLowerCase() + (exon.danger.proband ? " danger" : "");
      } else {
        return exon.feature_type.toLowerCase();
      }
    },
    getExonNumber: function() {
      if (this.selectedVariant.hasOwnProperty("vepExon") && !$.isEmptyObject(this.selectedVariant.vepExon)) {
        return Object.keys(this.selectedVariant.vepExon)[0];
      } else {
        return null;
      }
    },

    getExon: function() {
      let self = this;
      let exonNumber = self.getExonNumber();
      if (exonNumber != null) {
        if (self.selectedTranscript) {
          var exons = self.selectedTranscript.features.filter(function(feature) {
            if ( feature.transcript_type == 'protein_coding'
                || feature.transcript_type == 'mRNA'
                || feature.transcript_type == 'transcript'
                || feature.transcript_type == 'primary_transcript') {
              return feature.feature_type.toLowerCase() == 'utr' || feature.feature_type.toLowerCase() == 'cds';
            } else {
              return feature.feature_type.toLowerCase() == 'exon';
            }
          })

          let theExon = exons.filter(function(feature) {
            return +feature.start <= +self.selectedVariant.start && +feature.end >= +self.selectedVariant.start;
          })
          if (theExon && theExon.length > 0) {
            return theExon[0];
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    },
    getCoverageRegionStart: function() {
      let self = this;

      if (self.exon) {
        let exonWidth = +self.exon.end  -  +self.exon.start;
        return +self.exon.start - (exonWidth * .60);
      } else  {
        return +self.selectedVariant.start - 1000;
      }
    },
    getCoverageRegionEnd: function() {
      let self = this;
      if (self.exon) {
        let exonWidth = +self.exon.end  -  +self.exon.start;
        return +self.exon.end + (exonWidth * .60);
      } else  {
        return +self.selectedVariant.start + 1000;
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

      let html = self.globalApp.utility.formatExonTooltip(self.cohortModel.filterModel,
                                                          self.selectedVariantRelationship,
                                                          coverageRow,
                                                          feature,
                                                          lock)

      tooltip.html(html);
      if (lock) {
        tooltip.select("#exon-tooltip-thresholds").on("click", function() {
          self.$emit("show-coverage-cutoffs");
        })
        tooltip.select("#exon-tooltip-close").on("click", function() {
          self.selectedExon = null;
          self.hideExonTooltip(true);
        })
      }

      var coord = self.globalApp.utility.getTooltipCoordinates(featureObject.node(),
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
    },
  },


  computed: {
    sampleModel: function() {
      return this.cohortModel.getModel(this.selectedVariantRelationship);
    },
    hasAlignments: function() {
      return this.cohortModel.getModel(this.selectedVariantRelationship).isBamLoaded();
    },
    hgvsLabel: function() {
      if (this.selectedVariant.extraAnnot && this.info.HGVSpAbbrev && this.info.HGVSpAbbrev.length > 0) {
        return this.info.HGVSpAbbrev;
      } else {
        return 'HGVS';
      }
    },




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
    },
    notes: function() {
      return this.selectedVariantNotes && this.selectedVariantNotes.length > 0 ? this.selectedVariantNotes : null;
    },
    interpretation: function() {
      return this.selectedVariantInterpretation && this.selectedVariantInterpretation.length > 0 ? this.selectedVariantInterpretation : 'not-reviewed';
    }
  },

  watch: {
    selectedVariant: function() {
      this.$nextTick(function() {
        this.initGenePhenotypeHits();
        this.initCoverage();
      })
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


