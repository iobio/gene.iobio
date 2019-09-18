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
      min-width: 150px
      max-width: 220px
      margin-bottom: 0px
      margin-right: 10px
      padding-top: 0px
      padding-bottom: 0px


      &.last
        border-right: none

      .variant-column-header
        font-size: 14px
        color:  $app-color
        margin-top: 5px
        margin-bottom: 15px

        hr
          margin-top: 2px
          margin-bottom: 5px
          background-color: #cbcbcb

      .variant-row
        display: flex
        flex-direction: row
        font-size: 13px
        margin-bottom: 10px
        max-width: 260px

        &.last
          margin-bottom: 0px

      .pheno-search-term
        max-width: 90px
        display: inline-block
        vertical-align: top
        line-height: 14px

      #qual-track
        margin-top: -20px
        #depth-viz
          .circle-label
            font-size: 13px !important

          .y.axis
            .tick
              text
                font-size: 10px !important

          .coverage-problem-glyph
            fill: $coverage-problem-glyph-color

        .gene-viz
          svg
            .transcript.current
              outline: none !important

      #conservation-track
        .gene-viz
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

  .conservation-scores-barchart
    .marker
      circle
        stroke: $arrow-color
        stroke-width: 2px
        fill: $current-color
      text
        fill: $arrow-color
        font-size: 12px
        font-weight: bold

  .multi-align-chart
    .marker
      rect
        stroke: $current-color
        stroke-width: 2px
        stroke-opacity: 1
        fill: none

  .pedigree-chart
    .proband
      stroke: $current-color
      stroke-width: 5px


</style>

<style lang="css">

.conservation-scores-barchart .axis text {
  font-family: 'Raleway';
  font-size: 11px;
  fill: #717171;
}
.multi-align-chart .axis text {
  font-family: 'Raleway';
  font-size: 11px;
  fill: #717171;
}

.conservation-scores-barchart  .bar {
    fill: #bcbcbc;
    opacity: .8;
    stroke: #797979;
}

.conservation-scores-barchart .bar.negative {
  fill: rgba(20, 20, 20, 0.58);
  stroke: rgba(36, 36, 36, 0.3);
}


.multi-align-chart .sequence text {
  font-family: 'Raleway';
  font-size: 11px;
  font-weight: 500;
  fill: #34c1fe;
  cursor: pointer;
}

.multi-align-chart .sequence g.diff text {
  fill: black !important;
  font-weight: bold;
}

.multi-align-chart .sequence rect {
  fill: white;
  stroke: none;
  cursor: pointer;
}

.multi-align-chart .sequence g.diff rect {
  fill: rgb(191, 191, 191);
}


.multi-align-chart text.sequence-name {
  font-family: 'Raleway';
  font-size: 11px;
  font-weight: normal !important;
  fill: rgb(186, 186, 186);
}

.pedigree-chart circle {
  fill: none;
  stroke: black;
  stroke-width: 1px;
}

.pedigree-chart rect {
  stroke: black;
  stroke-width: 1px;
  fill: none;
}

.pedigree-chart .half-circle  path {
  fill: none;
  stroke: black;
  stroke-width: 1px;

}

.pedigree-chart rect.het {
  stroke: none !important;
}

.pedigree-chart .het,
.pedigree-chart .hom,
.pedigree-chart .half-circle  .het.path
 {
  fill: #c5c5c5 !important;
  stroke: black;
}

.pedigree-chart .het.critical.proband,
.pedigree-chart .hom.critical.proband,
.pedigree-chart .half-circle  .het.path.proband {
  fill: #ad151985 !important;
}




.pedigree-chart line {
  stroke: black !important;
}

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

      <span v-if="info.HGVSpLoading && info.HGVScLoading" class="pl-4 loader vcfloader" >
        <img src="../../../assets/images/wheel.gif">
        HGVS...
      </span>

      <variant-aliases-menu
      v-show="!info.HGVSpLoading || !info.HGVScLoading"
      class="pl-4"
      :label="hgvsLabel"
      :selectedGene="selectedGene"
      :selectedVariant="selectedVariant"
      :geneModel="cohortModel.geneModel"
      :info="info">
      </variant-aliases-menu>


    </div>



    <div class="variant-inspect-body">
      <div class="variant-inspect-column" v-if="selectedVariantRelationship != 'known-variants'">
          <div class="variant-column-header">
            Quality
            <v-divider></v-divider>
          </div>
          <variant-inspect-quality-row
            :info="getQualityInfo()"  >
          </variant-inspect-quality-row>


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
            <gene-viz id="qual-gene-viz" class="gene-viz"
              v-if="cohortModel && hasAlignments"
              v-show="filteredTranscript && filteredTranscript.features && filteredTranscript.features.length > 0"
              :data="[filteredTranscript]"
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
      <div class="variant-inspect-column">
          <div class="variant-column-header">
            Pathogenicity
            <v-divider></v-divider>
          </div>
          <variant-inspect-row  v-for="clinvar,clinvarIdx in info.clinvarLinks" :key="clinvarIdx"
            :clazz="getClinvarClass(clinvar.significance)" :value="clinvar.clinsig" :label="`ClinVar`" :link="clinvar.url" >
          </variant-inspect-row>

          <div v-if="info.clinvarTrait.length > 0" class="variant-row no-icon no-top-margin">
            <span>{{ info.clinvarTrait }} </span>
          </div>

          <variant-inspect-row
            :clazz="getImpactClass(info.vepImpact)" :value="info.vepConsequence"  :label="`VEP`"  >
          </variant-inspect-row>

          <variant-inspect-row
             v-if="info.vepHighestImpactValue.length > 0 && info.vepImpact.toUpperCase() != info.vepHighestImpactValue.toUpperCase()"
            :clazz="getImpactClass(info.vepHighestImpactValue)" :value="getNonCanonicalImpact(info.vepHighestImpactValue)" :label=" `Impact VEP (non-canonical transcript)`"  >
          </variant-inspect-row>


          <variant-inspect-row v-if="info.revel != '' && info.revel"
            :clazz="getRevelClass(info)" :value="info.revel"   :label="`REVEL`" >
          </variant-inspect-row>
      </div>
      <div class="variant-inspect-column">
          <div class="variant-column-header">
            Frequency
            <v-divider></v-divider>
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

      <div class="variant-inspect-column" style="min-width:90px" v-if="selectedVariantRelationship != 'known-variants'">
          <div class="variant-column-header">
            Inheritance Mode
            <v-divider></v-divider>
          </div>
          <div class="variant-row " style="margin-top:-2px"  v-if="selectedVariant.inheritance != 'none'">
            <app-icon :icon="selectedVariant.inheritance" style="margin-right:4px" width="16" height="16"></app-icon>
            <span>{{ selectedVariant.inheritance == 'denovo' ? 'de novo' : selectedVariant.inheritance }}</span>
          </div>
          <div class="pedigree-chart">
            <app-icon class="hide" icon="affected"></app-icon>
            <pedigree-genotype-viz
             style="width:85px"
             :margin="{left: 30, right: 4, top: 30, bottom: 4}"
             :data="pedigreeGenotypeData">
            </pedigree-genotype-viz>
          </div>
      </div>
      <div class="variant-inspect-column" v-if="showGenePhenotypes" >
          <div class="variant-column-header">
            Gene to Phenotype
            <v-divider></v-divider>
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
      <div class="variant-inspect-column last"
        v-if="selectedVariantRelationship != 'known-variants'"
        >
          <div class="variant-column-header" v-show="showConservation">
            Conservation
            <v-divider></v-divider>
          </div>
          <variant-inspect-row
            v-show="multiAlignModel && multiAlignModel.selectedScore && showConservation"
            :clazz="getConservationClass(multiAlignModel.selectedScore)"
            :value="getConservationScore(multiAlignModel.selectedScore)"   >
          </variant-inspect-row>
          <div id="conservation-track">
            <div style="display:flex;flex-direction: column;width:130px">

              <div class="conservation-scores-barchart exon">
              </div>
              <gene-viz id="conservation-gene-viz" class="gene-viz"
                v-if="cohortModel && hasAlignments && showConservation"
                v-show="filteredTranscript && filteredTranscript.features && filteredTranscript.features.length > 0"
                :data="[filteredTranscript]"
                :margin="conservationGeneVizMargin"
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

              <div class="multi-align-chart variant" style="margin-top:10px;">
              </div>
            </div>
          </div>
      </div>


    </div>

    <variant-assessment  style="margin-top:20px;" v-if="selectedVariantRelationship == 'proband'"
      :variant="selectedVariant"
      :variantInterpretation="interpretation"
      :interpretationMap="interpretationMap"
      :variantNotes="notes"
      :user="user"
      @apply-variant-interpretation="onApplyVariantInterpretation"
      @apply-variant-notes="onApplyVariantNotes">
    </variant-assessment>

  </v-card>
</template>

<script>

import Vue                      from 'vue'
import AppIcon                  from "../partials/AppIcon.vue"
import VariantAssessment        from "../partials/VariantAssessment.vue"
import VariantInspectRow        from "../partials/VariantInspectRow.vue"
import VariantInspectQualityRow from "../partials/VariantInspectQualityRow.vue"
import VariantLinksMenu         from "../partials/VariantLinksMenu.vue"
import VariantAliasesMenu       from "../partials/VariantAliasesMenu.vue"
import VariantAlleleCountsMenu  from "../partials/VariantAlleleCountsMenu.vue"
import InfoPopup                from "../partials/InfoPopup.vue"
import TranscriptsMenu          from '../partials/TranscriptsMenu.vue'
import DepthViz                 from "../viz/DepthViz.vue"
import GeneViz                  from "../viz/GeneViz.vue"
import PedigreeGenotypeViz      from "../viz/PedigreeGenotypeViz.vue"


import BarChartD3               from '../../d3/BarChart.d3.js'
import MultiAlignD3             from '../../d3/MultiAlign.d3.js'
import MultiAlignModel          from "../../models/MultiAlignModel.js"


export default {
  name: 'variant-inspect-card',
  components: {
    AppIcon,
    InfoPopup,
    VariantLinksMenu,
    VariantAliasesMenu,
    VariantInspectRow,
    VariantInspectQualityRow,
    VariantAlleleCountsMenu,
    VariantAssessment,
    DepthViz,
    GeneViz,
    PedigreeGenotypeViz
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
    user: null
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

      filteredTranscript: null,

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
      conservationGeneVizMargin: {
        top: 0,
        right: 2,
        bottom: 0,
        left: 4
      },
      geneVizTrackHeight: 16,
      geneVizCdsHeight: 12,

      multiAlignModel: new MultiAlignModel(),

      pedigreeGenotypeData: null,

      showConservation: false


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

    getQualityInfo: function() {
      let self  = this;
      let genotype = self.selectedVariant.genotype;

      var zyg       =  genotype.zygosity.toLowerCase();
      var altAndRef = +genotype.refCount + +genotype.altCount;
      var altRatio  = (+genotype.altCount / +genotype.genotypeDepth);

      var info = {clazz: '', depthClazz: '', altRatioClazz: '', reason: ''}

      var depthThreshold = {'good':     self.cohortModel.filterModel.geneCoverageMin,
                            'moderate': self.cohortModel.filterModel.geneCoverageMin - 5};

      var altRatioThreshold = { 'good':     {'het': .1,   'hom': .6, 'homref': 0},
                                'moderate': {'het': .05,  'hom': .4, 'homref': 0} };

      var depthClazz = '';
      var altRatioClazz = '';

      if (+genotype.genotypeDepth >= depthThreshold.good) {
        info.depthClazz = 'good';
      } else if (+genotype.genotypeDepth >= depthThreshold.moderate) {
        info.depthClazz = 'moderate';
        info.reason += "Questionable sequence depth";
      } else {
        info.depthClazz = 'poor';
        info.reason += "Poor sequence depth";
      }

      if (altRatio >= altRatioThreshold.good[zyg]) {
        info.altRatioClazz = 'good';
      } else if (+genotype.genotypeDepth >= depthThreshold.moderate[zyg]) {
        info.altRatioClazz = 'moderate';
        if (info.reason.length > 0) {
          info.reason += ", ";
        }
        info.reason += "Questionable evidence of alternate allele";
      } else {
        info.altRatioClazz = 'poor';
        if (info.reason.length > 0) {
          info.reason += ", ";
        }
        info.reason += "Poor evidence of alternate allele";
      }

      if (info.depthClazz == 'good' && info.altRatioClazz == 'good') {
        info.clazz = 'good';
        info.reason = 'Sufficient depth and allele counts'
      } else if (info.depthClazz == 'poor' || info.altRatioClazz == 'poor') {
        info.clazz = 'poor';
      } else {
        info.clazz = 'moderate';
      }

      return info;
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
    getConservationScore: function(score) {
      if (score == null) {
        return "";
      } else {
        if (score.y > 2) {
          return 'Highly conserved'
        } else if (score.y > 0) {
          return 'Moderately conserved'
        } else {
          return 'Not conserved';
        }
      }
    },
    getConservationClass: function(score) {
      if (score == null) {
        return "";
      } else {
        if (score.y > 2) {
          return 'level-high'
        } else if (score.y > 0) {
          return 'level-medium'
        } else {
          return 'level-unremarkable';
        }
      }
    },
    loadData: function() {
      let self = this;
      if (self.selectedVariant) {
        self.initPedigreeGenotypes();
        self.initGenePhenotypeHits();
        self.promiseInitCoverage()
        .then(function() {
          self.showMultiAlignments();
        })
      }
    },

    initPedigreeGenotypes() {
      let self = this;
      self.pedigreeGenotypeData = {};
      self.cohortModel.sampleModels.forEach(function(model) {
        if (model.relationship != 'known-variants') {
          let gtObject = {};
          gtObject.rel = model.relationship;
          gtObject.sex = model.sex
          gtObject.affectedStatus = model.affectedStatus;
          if (self.selectedVariant.genotypes && self.selectedVariant.genotypes[model.sampleName]) {
            gtObject.zygosity = self.selectedVariant.genotypes[model.sampleName].zygosity.toLowerCase();
          } else {
            gtObject.zygosity = "unknown"
          }
          gtObject.inheritance = self.selectedVariant.inheritance;

          self.pedigreeGenotypeData[gtObject.rel] = gtObject;
        }
      })
      let affectedStatusList = ['affected', 'unaffected'];
      affectedStatusList.forEach(function(affectedStatus) {
        if (self.cohortModel.sampleMapSibs[affectedStatus]) {
          self.cohortModel.sampleMapSibs[affectedStatus].forEach(function(model) {
            let gtObject = {};
            gtObject.rel = model.relationship;
            gtObject.sex = model.sex
            gtObject.affectedStatus = model.affectedStatus;
            if (self.selectedVariant.genotypes && self.selectedVariant.genotypes[model.sampleName]) {
              gtObject.zygosity = self.selectedVariant.genotypes[model.sampleName].zygosity.toLowerCase();
            } else {
              gtObject.zygosity = "unknown"
            }
            gtObject.inheritance = self.selectedVariant.inheritance;

            self.pedigreeGenotypeData['sibling-' + model.name] = gtObject;

          })

        }

      })
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
    promiseInitCoverage: function() {
      let self = this;
      return new Promise(function(resolve, reject) {

        if (self.selectedVariant) {
          self.exon                = self.getExon();
          self.coverageRegionStart = self.getCoverageRegionStart();
          self.coverageRegionEnd   = self.getCoverageRegionEnd();

          let theCoverage = self.cohortModel.getModel(self.selectedVariantRelationship).coverage.filter(function(coveragePoint) {
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
            resolve();
          }, 100)


        } else {
          self.exon = null;
          self.converageRegionStart = null;
          self.coverageRegionEnd = null;
          self.coverage = [];
          resolve();
        }
      })
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

          self.filteredTranscript = $.extend({}, self.selectedTranscript);
          self.filteredTranscript.features = theExon;

          if (theExon && theExon.length > 0) {
            return theExon[0];
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        if (self.selectedTranscript) {
          self.filteredTranscript = $.extend({}, self.selectedTranscript);
          self.filteredTranscript.features = [];
        }
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

    showMultiAlignments: function() {
      let self = this;
      self.showConservation = false;

      let promises = [];
      let p1 = self.multiAlignModel.promiseShowConservationScores(self.coverageRegionStart,
                                                  self.coverageRegionEnd,
                                                  self.selectedGene,
                                                  self.selectedVariant)
      promises.push(p1)

      let p2 = self.multiAlignModel.promiseShowMultiAlignments(self.selectedGene, self.selectedVariant);
      promises.push(p2)

      Promise.all(promises)
      .then(function() {
        let hasScores = self.multiAlignModel.hasConservationScores(self.coverageRegionStart,
                                                                    self.coverageRegionEnd,
                                                                    self.selectedGene);
        let hasAligns = self.multiAlignModel.hasMultiAlignments(self.selectedGene, self.selectedVariant);
        self.showConservation = hasScores || hasAligns;
      })

    }
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
      if (this.selectedVariant.extraAnnot && this.globalApp.gnomADExtra) {
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
        this.loadData();
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


