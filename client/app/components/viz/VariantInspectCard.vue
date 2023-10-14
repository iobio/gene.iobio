<style lang="sass" >
@import ../../../assets/sass/variables
#pedigree-genotype-popup
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  position: absolute
  background-color: white
  padding: 1em
  z-index: 100
  top: 50%
  left: 50%
  width: 80%
  height: 90%
  max-width: 1000px
  transform: translate(-50%, -50%)
  border: 1px solid #c5c5c5 !important
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12) !important

  .variant-column-header
    width: 100%
    text-align: center
    padding: 1px
    height: 10%

  .variant-column-header hr
    margin-top: 0px
    margin-bottom: 0px
    height: 1px

  .popup-pedigree-chart
    width: 100%
    height: 80%
    max-width: 800px
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    .pedigree-genotype-chart
      width: 100%
      .allele-count-bar
        text
          font-size: 15px
    
  div .variant-row
    display: flex
    flex-direction: row
    margin-top: 5px
    margin-bottom: 5px

.pedigree-popup-hidden
  visibility: hidden

.pedigree-popup-show
  visibility: visible
.popup-variant-header
  display: flex
  flex-direction: row
  justify-content: center
  position: relative
  #close-pedigree-genotype-popup
    margin-left: auto
    height: 5%
    z-index: 1
    right: 0px
    top: -5px
    position: absolute
  *:first-child
    flex: 1
    text-align: center
    margin: 0px 0px 0px 0px

#variant-inspect
  padding-left: 10px
  padding-top: 10px
  padding-right: 10px
  padding-bottom: 10px
  margin-bottom: 7px

  .multialign-loader
    font-size: 12px

  .refalt
    max-width: 200px
    white-space: normal
    display: inline-block
    word-break: break-all
    min-width: 100px

  .aa-change
    max-width: 200px
    white-space: normal
    display: inline-block
    word-break: break-all
    min-width: 100px

  #show-assessment-button
    padding: 0px
    height: 26px !important
    background-color: white !important
    margin: 0px
    padding-left: 10px
    padding-right: 10px
    color: $link-color !important
    margin-left: 41px

    .v-btn__content
      font-size: 13px
      font-weight: 500
  
  .subheader
    padding-bottom: 10px
    font-size: 13px
    color: $app-color
    margin-top: -5px


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
    justify-content: space-around
    padding-top: 10px

    #hpo-term-table 
      .hpo-row
        .hpo-launch
          min-width: 80px 
          max-width: 80px
        .hpo-name 
          min-width: 100px
          max-width: 100px
        .match-chip
          margin-right: 5px

    #conservation-track
      .variant-text
        max-width: 120px

    .variant-inspect-column
      display: flex
      flex-direction: column
      padding: 5px
      padding-left: 0px
      min-width: 150px
      max-width: 210px
      margin-bottom: 0px
      margin-right: 15px
      padding-top: 0px
      padding-bottom: 0px
      #expand-popup-button
        font-weight: 500
        color: #30638e
        display: flex
        flex-direction: row
        align-items: center
        justify-content: center
        i
          margin: 3px 2px 1px 3px
        p
          margin: 3px 3px 1px 1px
          
      #qual-track
        display: flex
        flex-direction: column
        align-items: center
        justify-content: center
        .variant-row
          display: flex
          flex-direction: row
          align-items: center
          justify-content: center



      &.last
        border-right: none

      .variant-column-header
        font-size: 14px
        color:  $app-color
        margin-top: 5px
        margin-bottom: 5px

        hr
          margin-top: 1px
          margin-bottom: 5px
          height: 1px

      .variant-column-hint
        font-size: 13px
        line-height: 14px
        margin-top: -5px
        font-style: italic
        height: 48px

      .variant-column-subheader
        font-size: 12px
        font-weight: 500
        font-style: normal
        margin-bottom: 5px
        color: $app-color
    
      .variant-column-loading
        font-size: 12px
        font-style: italic
        margin-bottom: 10px

      .variant-row
        display: flex
        flex-direction: row
        font-size: 13px
        margin-bottom: 10px
        max-width: 260px
        align-items: flex-start

        &.last
          margin-bottom: 0px

      .pheno-search-term
        max-width: 100px
        display: inline-block
        vertical-align: top
        line-height: 14px
        overflow-wrap: break-word

      #qual-track
        margin-top: 0px
        #depth-viz
          margin-left: 3px
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
        .conservation-score-label
          font-size: 12px
        .gene-viz
          svg
            .transcript.current
              outline: none !important

  .rel-header
    font-weight: 600
    padding-right: 4px

  .variant-header
    color: $app-color
    font-size: 14px

  #variant-heading
    color: $heading-color
    padding-bottom: 5px
    font-size: 17px
    padding-top: 0px
    min-width: 193px
    display: flex
    justify-content: flex-start


  .variant-action-button
      min-width: 110px !important
      font-weight: 500
      font-size: 13px
      color: $link-color
      .btn__content, .v-btn__content
        color: $link-color !important
        i.material-icons
          color: $link-color !important

  .variant-action-button-dbSnp
      color: rgb(113,113,113)
      font-size: 13px
      padding-left: 0
      padding-right: 15px
      height: 22px !important
      margin: 0px
      min-width: 110px !important
      max-width: 110px
      font-weight: 500

      .btn__content, .v-btn__content
          padding-right: 8px
          font-size: 12px

          i.material-icons
              color: $link-color !important

  .change-transcript-button
    font-size: 13px
    color: $link-color
    margin: 0px
    padding: 0px
    height: 22px

  .rsid
    padding-right: 20px
    padding-top: 2px
    min-width: 130px

    .rsid-link
      padding-left: 2px

  .pedigree-chart
    circle
      fill: none
      stroke: black
      stroke-width: 1px

    rect
      stroke: black
      stroke-width: 1px
      fill: none

    .half-circle
      path
        fill: none
        stroke: black
        stroke-width: 1px

    .half-diamond
      path
        fill: none
        stroke: black
        stroke-width: 1px

    rect.het
      stroke: none !important

    .het, .hom
      fill: #c5c5c5 !important
      stroke: black

    .half-circle
      path.het
        fill: #c5c5c5 !important
        stroke: black
    .half-diamond
      path.het
        fill: #c5c5c5 !important
        stroke: black


    .het.critical.proband, .hom.critical.proband
      fill: #c5c5c5 !important

    .half-diamond
      path.het.critical.proband
        fill: #c5c5c5 !important

    line
      stroke: black !important


    .proband
      stroke: $current-color !important
      stroke-width: 2px !important

    .allele-count-bar
      rect.alt-count
        fill: $current-color
        opacity: .65

      text
        font-size: 9px
        text-anchor: middle

#show-more-gene-association-button
  margin: 0px 0px 0px 0px
  font-size: 13px
  height: 26px
  margin-bottom: 0px
  padding-left: 0px
  padding-right: 4px
  float: right
  margin-right: 10px

  .btn__content, .v-btn__content
    color:  $link-color
    padding-left: 5px
    padding-right: 5px
    font-weight: 500

    i.material-icons
      color: $link-color
      font-size: 17px
      padding-right: 5px

#source-indicator-text
  // content: "\a"
  // white-space: pre
  font-size: 12px
  color: $app-color

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


.select-annotations-button
  min-width: 70px !important
  font-weight: 500
  font-size: 13px
  color: $link-color
  padding: 0px
  margin-top: 2px !important
  margin-bottom: 2px !important
  margin-left: 4px !important
  height: 22px !important
  .btn__content, .v-btn__content
    color: $link-color !important
    margin: 0px
    i.material-icons
      color: $link-color !important
    
.value-row-container 
  display: flex
  justify-content: space-between

  .value-rows
    display: flex
    flex-direction: column
    justify-content: space-between

  .row
    font-size: 13px
    line-height: 15px
    >span
      display: inline-block
      vertical-align: top
      line-height: 15px

    .checkbox-id
      font-size: 13px
      color: $text-color
      margin-right: 5px
      min-width: 250px
      max-width: 250px

    .label-text
      font-size: 13px
      color: $text-color
      min-width: 100px
      max-width: 100px


.small-icon
  font-size: 16px
  color: #30638e !important

</style>

<template>

  <v-card v-show="selectedVariant" id="variant-inspect" class="app-card full-width">

    <v-card id="pedigree-genotype-popup" :class="showPedigreePopup ? 'pedigree-popup-show' : 'pedigree-popup-hidden'" style="min-width:90px;" v-if="!isSimpleMode && selectedVariant">


        <div class="variant-column-header">
          <div class="popup-variant-header">
            <p>Inheritance</p>
            <button id="close-pedigree-genotype-popup" @click="togglePedigreePopup">
              <v-icon>close</v-icon>
            </button>
          </div>

          <v-divider></v-divider>
        </div>

        <variant-inspect-inheritance-row :selectedVariant="selectedVariant">
        </variant-inspect-inheritance-row>

        <div class="pedigree-chart popup-pedigree-chart">
            <app-icon class="hide" icon="affected"></app-icon>
            <pedigree-genotype-viz id="popup-pedigree-genotype-viz"
             ref="popupPedigreeGenotypeViz"
             :margin="{left: 15, right: 14, top: 30, bottom: 4}"
             :nodeWidth="60"
             :nodePadding="40"
             :nodeVerticalPadding="40"
             :data="pedigreeGenotypeData"
             :options="{context: 'popup'}">
            </pedigree-genotype-viz>
        </div>

    </v-card>

    <div style="display:flex;align-items:flex-start;justify-content:flex-start;margin-bottom:5px">
      <div  id="variant-heading" v-if="selectedVariant" class="text-xs-left" >
        <span v-if="selectedVariantRelationship != 'proband'" class="rel-header">
           {{ selectedVariantRelationship | showRelationship }}</span>
        </span>

        <span>{{ selectedGene.gene_name }} VARIANT</span>
      </div>

      <span v-if="selectedVariant" class="variant-header" style="margin-top:2px">

        <span style="vertical-align:top">{{ selectedVariant.type ? selectedVariant.type.toUpperCase() : "" }}</span>
        <span style="vertical-align:top" class="pl-1">{{ coord }}</span>
        <span class="pl-1 pr-2 refalt">{{ refAlt  }}</span>


      </span>

      <app-icon
       style="min-width:70px;margin-top:1px;margin-right:5px;padding-top: 1px;margin-right:10px"
       icon="zygosity" v-if="selectedVariant && selectedVariant.zygosity"
       :type="selectedVariant.zygosity.toLowerCase() + '-large'"
       :isSimpleMode="isSimpleMode"
       height="14" :width="isSimpleMode ? 90 : 35">
      </app-icon>

      <v-badge class="info" style="margin-top:2px;margin-right:10px" v-if="!isSimpleMode && selectedVariant && selectedVariant.multiallelic && selectedVariant.multiallelic.length > 0">multiallelic</v-badge>


      <div v-if="info && info.rsId"  class="variant-header rsid"> {{info.rsId}}
        <a  v-bind:href="info.dbSnpUrl" target="ClinVar" class="rsid-link">
            <i aria-hidden="true" class="v-icon link-icon material-icons theme--light" style="font-size: 15px;color: #30638e; padding-bottom: 3px">open_in_new</i>
        </a>
      </div>

     

      <span v-if="!info || (info.HGVSpLoading && info.HGVScLoading) && !isSimpleMode"
        style="font-size:13px;margin-top:2px;min-width:80px;margin-left:0px;margin-right:0px"
        v-show="selectedVariantRelationship != 'known-variants'" class=" loader vcfloader" >
        <img src="../../../assets/images/wheel.gif">
        HGVS
      </span>
      <variant-aliases-menu
      v-show="selectedVariant && (!info.HGVSpLoading || !info.HGVScLoading)"
      v-if="selectedVariant && selectedVariantRelationship != 'known-variants' && !isSimpleMode"
      :label="`HGVS`"
      :selectedGene="selectedGene"
      :selectedVariant="selectedVariant"
      :geneModel="cohortModel.geneModel"
      :info="info">
      </variant-aliases-menu>

      <span class="pl-3 variant-header aa-change" style="margin-top:2px">{{ aminoAcidChange }}</span>




      <variant-links-menu
      v-if="selectedVariant && info"
      :selectedGene="selectedGene"
      :selectedVariant="selectedVariant"
      :geneModel="cohortModel.geneModel"
      :info="info">
      </variant-links-menu>
    </div>

    <div style="display:flex;align-items:flex-start;justify-content:flex-start;margin-bottom:0px;margin-left:193px" v-if="selectedVariantRelationship == 'proband'">
      <variant-interpretation 
       v-if="!isSimpleMode && selectedVariant"
       style="margin-bottom:4px;margin-right:5px;display: inline-block"
       wrap="true"
       :variant="selectedVariant"
       :variantInterpretation="interpretation"
       :interpretationMap="interpretationMap"
       :showInterpretationLabel="true"
       @apply-variant-interpretation="onApplyVariantInterpretation">
      </variant-interpretation>
      
      <v-btn v-if="!isSimpleMode && selectedVariant && !showAssessment"  flat id="show-assessment-button" @click="onEnterComments">
        <v-icon style="margin-right:4px">speaker_notes</v-icon>
        Notes...
      </v-btn>


    </div>


    
    <span v-if="launchedFromClin && selectedGene.gene_name">
      <div>
        <span id="source-indicator-text" class="chart-label">Source: </span>
        <span v-for="(source, idx) in getSourceIndicatorBadge" :key="idx">
          <span
            v-tooltip.top-center="`${selectedGeneSources.source[idx]}`"
            class="ml-1 mr-1">
            <div left color="grey lighten-1" class="myBadge">
              <span> {{ source }}</span>
            </div>
          </span>
        </span>
      </div>
    </span>


    <div class="variant-inspect-body">
      <div class="variant-inspect-column" v-if="selectedVariantRelationship != 'known-variants'">
          <div class="variant-column-header">
            Quality
            <v-divider></v-divider>
          </div>
          <div class='variant-column-hint' v-if="isSimpleMode">
            Sequencing data quality.
          </div>
          <variant-inspect-quality-row
            :info="getQualityInfo()"  >
          </variant-inspect-quality-row>


          <div id="qual-track" style="width:130px;">
            <depth-viz
              v-if="cohortModel && hasAlignments"
              ref="depthVizRef"
              :data="coverage"
              :coverageMedian="cohortModel.filterModel.geneCoverageMedian"
              :coverageDangerRegions="coverageDangerRegions"
              :currentPoint="coveragePoint"
              :maxDepthProp="coverageMaxDepth"
              :regionStart="coverageRegionStart"
              :regionEnd="coverageRegionEnd"
              :width="150"
              :margin="depthVizMargin"
              :height="120"
              :showTooltip="false"
              :showXAxis="false"
              :regionGlyph="depthVizRegionGlyph"
              :showAlleleBar="true"
              :formatCircleText="formatQCCircleText"
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

            <div class="variant-row " >
              <v-btn flat v-if="selectedVariantRelationship != 'known-variants' && cohortModel.getModel(selectedVariantRelationship ? selectedVariantRelationship : 'proband').isBamLoaded()  && !isSimpleMode "
              class="variant-action-button"  @click="onShowPileup">
               <v-icon>format_align_center</v-icon>
               Read Pileup
              </v-btn>
            </div>
          </div>

      </div>
      <div class="variant-inspect-column " v-if="selectedVariant && (showGenePhenotypes || matchingGenePhenotypes.length > 0)" style="min-width:250px;max-width:250px" >
          <div class="variant-column-header" >
            Gene:Phenotype Associations
            <v-divider></v-divider>
          </div>
          <div v-if="matchingGenePhenotypes.length > 0">
            <gene-phenotype-table 
                 :selectedGene="selectedGene"
                 :geneModel="cohortModel.geneModel"
                 :cohortModel="cohortModel"
                 :highlightMatches="true"
                 :showDetailsButton="true"
                 :genePatientPhenotypes="matchingGenePhenotypes"
                 :showTitle="false"
                 @show-patient-phenotypes-dialog="onShowPatientGenePhenotypeDialog(true)">
            </gene-phenotype-table>
          </div>
          <div v-if="genePhenotypeHits && genePhenotypeHits!==null && genePhenotypeHits.length" >
            <div>Phenotype based search hits</div>
            <div v-for="(geneHit, index) in genePhenotypeHits.slice(0,3)" :key="geneHit.key" class="variant-row" style="flex-flow:column">
              <div v-for="geneRank in geneHit.geneRanks" :key="geneRank.rank">
                <div>
                  <v-chip v-if="geneRank.rank" class="high">
                    <span class="mr-1">#{{ geneRank.rank  }}</span>
                    <span v-if="geneRank.source">{{  geneRank.source }}</span>
                  </v-chip>
                  <v-chip v-else class="high">
                    <span v-if="geneRank.source"> {{ geneRank.source }}</span>
                  </v-chip>
                  <span v-if="geneHit.searchTerm && geneRank.source!=='HPO'" class="pheno-search-term">
                    {{ geneHit.searchTerm | firstCharacterToUppercase }}
                  </span>
                  <span v-else-if="geneRank.source==='HPO' && geneRank.hpoPhenotype" class="pheno-search-term">
                    {{ geneRank.hpoPhenotype | firstCharacterToUppercase }}
                  </span>
                </div>
              </div>
            </div>            
          </div>
          <div v-if="genePhenotypeHits!==null && genePhenotypeHits.length>=4">
            <v-btn id="show-more-gene-association-button"
              flat small
              slot="activator"
              v-tooltip.bottom-center="`Show all associations for this variant`"
              @click="showMoreGeneAssociationsDialog=true">
                <v-icon>zoom_out_map</v-icon>Show more
            </v-btn>
          </div>
          <div>
            <gene-associations-dialog
              v-if="showMoreGeneAssociationsDialog"
              :showDialog="showMoreGeneAssociationsDialog"
              :genePhenotypeHits="genePhenotypeHits"
              :selectedGene="selectedGene.gene_name"
              @close-gene-association-dialog="onCloseGeneAssociationDialog($event)">
            </gene-associations-dialog>
          </div>
      </div>
      <div class="variant-inspect-column" v-if="selectedVariant && info">
          <div class="variant-column-header">
            Pathogenicity
            <v-divider></v-divider>
          </div>
          <div class='variant-column-hint' v-if="isSimpleMode">
            Clinical significance based on variant type, location, and documentation in ClinVar.
          </div>
          <variant-inspect-row  v-for="(clinvar,clinvarIdx) in info.clinvarLinks" :key="clinvarIdx"
          :value="clinvar.clinsig" :label="`ClinVar`" :link="clinvar.url" 
          :translator="cohortModel.translator">
          </variant-inspect-row>

          <div v-if="showClinvarTrait(info)"
            class="variant-row no-icon no-top-margin small-font">
            <span>{{ info.clinvarTrait }} </span>
          </div>

          <variant-inspect-row v-if="info.vepImpact && info.vepImpact !== ''"
            :clazz="getImpactClass(info.vepImpact)" :value="info.vepConsequence"  :label="``"  >
          </variant-inspect-row>

          <variant-inspect-row
             v-if="info.vepHighestImpactValue.length > 0 && info.vepImpact.toUpperCase() != info.vepHighestImpactValue.toUpperCase() && !isSimpleMode"
            :clazz="getImpactClass(info.vepHighestImpactValue)" :label=" `Most severe impact in non-canonical transcript`"  >
          </variant-inspect-row>

          <div v-if="info.vepHighestImpactValue.length > 0 && info.vepImpact.toUpperCase() != info.vepHighestImpactValue.toUpperCase() && !isSimpleMode" class="variant-row no-icon no-top-margin">

                    <span v-for="(impactRec, idx) in info.vepHighestImpactRecs" :key="impactRec.impact">
                      <div style="padding-top:5px" v-for="(effectRec, idx1) in impactRec.effects" :key="effectRec.key">
                        {{ getNonCanonicalEffectDisplay(idx1, effectRec) }}
                        <v-btn class="change-transcript-button" flat v-for="transcriptId in effectRec.transcripts"
                         :key="transcriptId"
                         @click="selectTranscript(transcriptId)">
                          {{ transcriptId }}
                        </v-btn>
                      </div>
                    </span>

          </div>

          <variant-inspect-row v-if="info.revel != '' && info.revel"
            :clazz="getRevelClass(info)" :value="info.revel"   :label="`REVEL`" >
          </variant-inspect-row>
      </div>


      <div class="variant-inspect-column" v-if="selectedVariant">
          <div class="variant-column-header">
              Population Frequency
              <v-divider></v-divider>
          </div>
          <div class="variant-column-hint" v-if="isSimpleMode">
            Common variants typically don’t cause diseases.
          </div>

          <div class="variant-column-loading"  v-if="afGnomAD.loading">
            <span v-if="!info || (info.HGVSpLoading && info.HGVScLoading) && !isSimpleMode"
              style="margin-top:2px;min-width:80px;margin-left:0px;margin-right:0px"
               class=" loader vcfloader" >
              <img src="../../../assets/images/wheel.gif">
              {{ afGnomAD.loading }} 
            </span>
          </div>

          <div class="variant-column-subheader"  v-if="!isSimpleMode">
            <span>{{ afGnomAD.source }}</span>
          </div>
          <variant-inspect-row :clazz="afGnomAD.class" :value="gnomadFreq" :label="afGnomAD.label" :link="afGnomAD.link" >
          </variant-inspect-row>
          <variant-inspect-row v-if="!isSimpleMode && afGnomAD.freqPopMax" :clazz="afGnomAD.class" :value="gnomadFreqPopMax" :label="`Population max allele frequency`" >
          </variant-inspect-row>
          <div v-if="!isSimpleMode && afGnomAD.totalCount >= 0" class="variant-row no-icon">
            <span>{{ afGnomAD.altCount }} alt of {{ afGnomAD.totalCount }} total</span>
          </div>
          <div v-if="!isSimpleMode && afGnomAD.homCount >= 0"  class="variant-row no-icon">
            <span>{{ afGnomAD.homCount }} homozygotes</span>
          </div>

          <variant-af-pop-menu 
              v-if="!isSimpleMode && selectedVariant.hasOwnProperty('gnomAD') && selectedVariant.gnomAD.hasOwnProperty('pop') && selectedVariant.gnomAD.af != '.'" 
              :selectedVariant="selectedVariant">
          </variant-af-pop-menu>
          
          <div v-if="!isSimpleMode && afGnomAD.hasOwnProperty('freqExomes')"
          style="margin-top: 0px"  class="variant-column-subheader" >
            <span>gnomAD exomes</span>
          </div>
          <variant-inspect-row 
            v-if="!isSimpleMode && afGnomAD.hasOwnProperty('freqExomes')"
            clazz="level-blank" :value="afGnomAD.freqExomes" label="Allele frequency" >
          </variant-inspect-row>

      </div>

      <div class="variant-inspect-column" style="min-width:90px" v-if="!isSimpleMode && selectedVariant && selectedVariantRelationship == 'proband'">
          <div class="variant-column-header">
            Inheritance
            <v-divider></v-divider>
          </div>

          <variant-inspect-inheritance-row :selectedVariant="selectedVariant" >
          </variant-inspect-inheritance-row>


          <div class="pedigree-chart">
            <app-icon class="hide" icon="affected"></app-icon>
            <pedigree-genotype-viz
             ref="pedigreeGenotypeViz"
             style="width:139px"
             :margin="{left: 15, right: 14, top: 30, bottom: 4}"
             :nodeWidth="30"
             :nodePadding="40"
             :nodeVerticalPadding="30"
             :data="pedigreeGenotypeData">
            </pedigree-genotype-viz>
          </div>
          <v-btn id="expand-popup-button" v-if="pedigreeGenotypeData && Object.keys(pedigreeGenotypeData).length > 5" small flat light @click="togglePedigreePopup">
            <i aria-hidden="true" class="v-icon link-icon material-icons theme--light" style="font-size: 20px; color: rgb(48, 99, 142);">open_in_new</i>
            <p>Expand</p>
          </v-btn>

      </div>

      <div class="variant-inspect-column last" v-if="selectedVariant" style="min-width:130px;max-width:320px">
          <div class="variant-column-header" >
            Conservation
            <v-divider></v-divider>
          </div>
          <div class="variant-column-hint" v-if="isSimpleMode">
            Changes at genome locations that are conserved across species are more likely to be clinically significant.
          </div>
          <div id="conservation-track" style="display:flex;">
            <div style="display:flex;flex-direction: column;max-width:130px;min-width:130px;margin-right: 10px">

              <variant-inspect-row
                v-show="multiAlignModel && multiAlignModel.selectedScore && showConservation"
                :clazz="getConservationClass(conservationExactScore)"
                :value="getConservationScore(conservationExactScore)"   >
              </variant-inspect-row>

              <div class="conservation-score-label"
                v-if="!isSimpleMode && conservationScores && conservationScores.length > 0">
                phyloP scores
              </div>

              <conservation-scores-viz v-if="!isSimpleMode" class="conservation-scores-barchart exon"
               :data=conservationScores
               :options=conservationOptions
               :exactScore=conservationExactScore
               :targetScore=conservationTargetScore
               :margin="{top: 10, right: 2, bottom: 15, left: 4}"
               :width="130"
               :height="60">
              </conservation-scores-viz>

              <gene-viz id="conservation-gene-viz" class="gene-viz"
                v-if="!isSimpleMode && cohortModel && showConservation"
                v-show="filteredTranscript && filteredTranscript.features && filteredTranscript.features.length > 0"
                :data="[filteredTranscript]"
                :margin="conservationGeneVizMargin"
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
            <div style="min-width:190px" >


              <toggle-button
                v-if="false && hasConservationAligns"
                name1="Nuc"
                name2="AA"
                label="Sequence"
                buttonWidth="90"
               @click="onToggleConservationNucAA">
              </toggle-button>


              <span v-if="multialignInProgress" class="pt-4 loader multialign-loader" >
                  <img src="../../../assets/images/wheel.gif">
                  Loading sequence
              </span>

              <multialign-seq-viz style="margin-top:10px;"
              :data="multialignSequences"
              :margin="{top: 15, right: 0, bottom: 0, left: 70}"
              :selectedBase="multialignSelectedBase">
              </multialign-seq-viz>

            </div>
          </div>   
      </div>

      <div class="variant-inspect-column" v-if="selectedVariant" style="min-width:250px;max-width:400px" >
        <div class="header-and-button" style="display: flex; align-items:center;">
          
          <div class="variant-column-header" >
            Annotations
            <v-divider></v-divider>
          </div>
        
          <v-btn flat @click="openVariantAnnotDialog" class="select-annotations-button" style="position: relative; z-index: 1;">
            <v-icon style="font-size:22px">search</v-icon>
            Select
          </v-btn>
      
        </div>
        <div style="max-height: 180px; overflow-y: scroll;">
          <div class="value-row-container" style="margin-left:10px; margin-top:0px; padding-bottom: 10px;">
            <div class="value-rows" style="margin-left: 3px;">
              <div v-for="item in mergedInfoAndFormat" :key="item.id" class="row">
                <v-tooltip right color="rgba(0, 0, 0, 0.7)" max-width="200px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="small-icon"
                      v-bind="attrs"
                      v-on="on"
                    >
                    article
                    </v-icon>
                  </template>
                  <span>{{ item.description }}</span>
                </v-tooltip>
                <span class="checkbox-id">{{ item.key }}</span>
                <span class="label-text">{{ item.value }} </span> 
              </div>

              <div v-if="mosaicValuesMap" v-for="item in mosaicValuesMap" :key="item.id" class="row">
                <v-tooltip right color="rgba(0, 0, 0, 0.7)" max-width="200px">
                  <template v-slot:activator="{ on, attrs }">
                    <span class="small-icon"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <img src="assets/images/mosaic_icon.png" alt="Custom Icon" style="width: 11px; height: 11px; margin-left: 2px; margin-right: 2px" />
                    </span>
                  </template>
                  <span>{{ item.description }}</span>
                </v-tooltip>
                <span class="checkbox-id">{{ item.description }}</span>
                <span class="label-text">{{ item.value }} </span>  
              </div> 
            </div>
          </div>
        </div>
       
        
       
      </div>
      
    </div>

    <select-variant-annotations-dialog
      :showDialog="showSelectVariantAnnotationDialog"
      :cohortModel="cohortModel"
      :selectedVariantRelationship="selectedVariantRelationship"
      :variantAnnotationsMap="variantAnnotationsMap"
      :selectedVariantInfo="selectedInfo"
      :selectedVariantFormat="selectedFormat"
      :selectedVariantMosaic="selectedVariantMosaic"
      :selectedVariantAllAnnots="selectedAll"
      @close-variant-annot-dialog="closeVariantAnnotDialog"
      @apply-variant-annot-dialog="applyVariantAnnotDialog">
    </select-variant-annotations-dialog>

    <patient-gene-phenotype-dialog
         :showDialog="showPatientGenePhenotypeDialog"
         :cohortModel="cohortModel"
         :selectedGene="selectedGene"
         :launchedFromHub="launchedFromHub"
         @hide-patient-gene-phenotype-dialog="onShowPatientGenePhenotypeDialog(false)">
    </patient-gene-phenotype-dialog>

  </v-card>

</template>

<script>

import Vue                      from "vue"
import AppIcon                  from "../partials/AppIcon.vue"
import VariantInterpretation    from '../partials/VariantInterpretation.vue'
import VariantInspectRow        from "../partials/VariantInspectRow.vue"
import VariantInspectQualityRow from "../partials/VariantInspectQualityRow.vue"
import VariantInspectInheritanceRow from "../partials/VariantInspectInheritanceRow.vue"
import VariantLinksMenu         from "../partials/VariantLinksMenu.vue"
import VariantAliasesMenu       from "../partials/VariantAliasesMenu.vue"
import VariantAfPopMenu         from "../partials/VariantAfPopMenu.vue"
import InfoPopup                from "../partials/InfoPopup.vue"
import ToggleButton             from '../partials/ToggleButton.vue'
import DepthViz                 from "../viz/DepthViz.vue"
import GeneViz                  from "../viz/GeneViz.vue"
import PedigreeGenotypeViz      from "../viz/PedigreeGenotypeViz.vue"
import ConservationScoresViz    from "../viz/ConservationScoresViz.vue"
import MultialignSeqViz         from "../viz/MultialignSeqViz.vue"
import GeneAssociationsDialog   from "../partials/GeneAssociationsDialog.vue"
import GenePhenotypeTable       from "../partials/GenePhenotypeTable.vue"
import PatientGenePhenotypeDialog      from '../partials/PatientGenePhenotypeDialog.vue'

import SelectVariantAnnotationsDialog from '../partials/SelectVariantAnnotationsDialog.vue'

import BarChartD3               from '../../d3/BarChart.d3.js'
import MultiAlignD3             from '../../d3/MultiAlign.d3.js'
import MultiAlignModel          from "../../models/MultiAlignModel.js"


export default {
  name: 'variant-inspect-card',
  components: {
    AppIcon,
    InfoPopup,
    VariantAfPopMenu,
    VariantLinksMenu,
    VariantAliasesMenu,
    VariantInterpretation,
    VariantInspectRow,
    VariantInspectQualityRow,
    VariantInspectInheritanceRow,
    DepthViz,
    GeneViz,
    PedigreeGenotypeViz,
    ToggleButton,
    ConservationScoresViz,
    MultialignSeqViz,
    GeneAssociationsDialog,
    GenePhenotypeTable,
    'patient-gene-phenotype-dialog': PatientGenePhenotypeDialog,

    SelectVariantAnnotationsDialog,

  },
  props: {
    selectedGene: null,
    selectedTranscript: null,
    selectedVariant: null,
    selectedVariantKey: null,
    selectedVariantInterpretation: null,
    selectedVariantRelationship: null,
    selectedPhenotype: null,
    isSimpleMode: null,
    genomeBuildHelper: null,
    cohortModel: null,
    showGenePhenotypes: null,
    info: null,
    coverageDangerRegions: null,
    user: null,
    showAssessment: null,
    launchedFromClin: null,    
    interpretationMap: null,
    //mosaicVariantInterpretation: null
    variantAnnotationsMap: Object,
    selectedVariantInfo: null,
    selectedVariantFormat: null,
    selectedVariantMosaic: null,
    selectedVariantAllAnnots: Boolean,
    mosaicVariant: Object, 
    launchedFromHub: null
  },
  data() {
    return {
      genePhenotypeHits: null,
      showPedigreePopup: false,
      coverageRegionStart: null,
      coverageRegionEnd: null,
      exon: null,
      coverage: null,
      coveragePoint: null,
      selectedExon: null,
      coverageMaxDepth: null,

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

      showConservation: false,
      hasConservationScores: false,
      hasConservationAligns: false,

      conservationSeqType: 'nuc',

      conservationScores: null,
      conservationOptions: null,
      conservationTargetScore: null,
      conservationExactScore: null,

      multialignSequences: null,
      multialignSelectedBase: null,
      multialignInProgress: false,

      enterCommentsClicked: false,
      showMoreGeneAssociationsDialog: false,
      selectedGeneSources: {},

      gnomADFieldToLabel: {
        'vepAf.gnomADg.faf95_popmax': 'gnomAD genomes pop max allele freq (95% CI)',
        'vepAf.gnomADg.AF_popmax'   : 'gnomAD genomes pop max allele freq',
        'vepAf.gnomADe.AF_popmax'   : 'gnomAD exomes pop max allele freq',
        'gnomAD.afPopMax'           : 'gnomAD genomes pop max allele freq',
        'vepAf.MAX.AF'              : 'gnomAD (exomes only) pop max allele freq',
        'vepAf.gnomAD.AF'           : 'gnomAD (exomes only) allele freq'
      },

      interpretation: null,

      matchingGenePhenotypes: [],

      showPatientGenePhenotypeDialog: false,
      
      showSelectVariantAnnotationDialog: false,
      showVariantAnnotationInfoDialog: false,

      selectedInfo: this.selectedVariantInfo,
      selectedFormat: this.selectedVariantFormat,
      selectedMosaicVariantAnnotations: this.selectedVariantMosaic,
      selectedAll: this.selectedVariantAllAnnots,
      
      hoveredDescription: '',

      



      

    }
  },
  methods: {

    openVariantAnnotationInfoDialog() {
      console.log("openVariantAnnotationInfoDialog");
      this.showVariantAnnotationInfoDialog = true;
    },

    closeVariantAnnotationInfoDialog() {
      this.showVariantAnnotationInfoDialog = false;

    },

    openVariantAnnotDialog() {
      this.showSelectVariantAnnotationDialog = true;
    },

    closeVariantAnnotDialog(selectedInfo, selectedFormat, selectedMosaicVariantAnnotations, selectedAll) {
      this.selectedInfo = selectedInfo;
      this.selectedFormat = selectedFormat;
      this.selectedMosaicVariantAnnotations = selectedMosaicVariantAnnotations;
      this.showSelectVariantAnnotationDialog = false;
      this.selectedAll = selectedAll;
      this.$emit("variant-annotations-selected", this.selectedInfo, this.selectedFormat, this.selectedMosaicVariantAnnotations, this.selectedAll);
    },

    applyVariantAnnotDialog(selectedInfo, selectedFormat, selectedMosaicVariantAnnotations, selectedAll) {
      this.selectedInfo = selectedInfo;
      this.selectedFormat = selectedFormat;
      this.selectedMosaicVariantAnnotations = selectedMosaicVariantAnnotations;
      this.showSelectVariantAnnotationDialog = false;
      this.selectedAll = selectedAll;

      this.$emit("variant-annotations-selected", this.selectedInfo, this.selectedFormat, this.selectedMosaicVariantAnnotations, this.selectedAll);
    },

    refresh: function() {

    },

    annotateClinVarVariant(){
      this.refreshSelectedVariantInfo();
    },

    onShowPatientGenePhenotypeDialog(show) {
      this.showPatientGenePhenotypeDialog = show;
    },

    refreshSelectedVariantInfo: function() {
      if (this.selectedVariant) {
        this.selectedVariantInfo =  this.globalApp.utility.formatDisplay(this.selectedVariant,this.cohortModel.translator, this.isEduMode)
      } else {
        this.selectedVariantInfo = null;
      }
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
            popAF += label + " " + (afObject[key] == "." ? "0" : d3.format('.3n')(afObject[key]));
          }
        }
      }
      return popAF;
    },
    togglePedigreePopup() {
      if (this.showPedigreePopup) {
        this.showPedigreePopup = false;
      } else {
        this.showPedigreePopup = true;
      }
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
      buf += this.globalApp.utility.capitalizeFirstLetter(effectRec.display) + " in ";
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
      if (self.selectedVariant == null) {
        return {clazz: '', depthClazz: '', altRatioClazz: '', reason: ''};
      }
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
      if (impact && impact.toLowerCase() == 'high') {
        return 'level-high'
      } else if (impact && impact.toLowerCase() == 'moderate') {
        return 'level-medium'
      } else {
        return 'level-unremarkable';
      }
    },
    showClinvarTrait: function(info) {
      let self = this;
      let levelSignificant = false;
      info.clinvarLinks.forEach(function(clinvar) {
        let clazz = self.globalApp.utility.getClinvarLevel(clinvar.significance)
        if (clazz != 'low' && clazz != 'none') {
          levelSignificant = true;
        }
      })
      return info.clinvarTrait.length > 0 && (levelSignificant || !this.isSimpleMode);
    },
    getConservationScore: function(score) {
      if (score == null) {
        return "";
      } else {
        if (score.y > 1.5) {
          return 'Highly conserved ' + (!this.isSimpleMode ? score.y : '');
        } else if (score.y > 1) {
          return 'Moderately conserved ' + (!this.isSimpleMode ? score.y : '');
        } else if (score.y > 0) {
          return 'Marginally conserved ' + (!this.isSimpleMode ? score.y : '');
        } else {
          return 'Not conserved ' + (!this.isSimpleMode ? score.y : '');
        }
      }
    },
    getConservationClass: function(score) {
      if (score == null) {
        return "";
      } else {
        if (score.y > 1.5) {
          return 'level-high'
        } else if (score.y > 1) {
          return 'level-medium'
        } else if (score.y > 0) {
          return 'level-low'
        } else {
          return 'level-unremarkable';
        }
      }
    },
    loadData: function() {
      let self = this;
      if (self.selectedVariant) {
        self.enterCommentsClicked = false;
        self.initPedigreeGenotypes();
        self.initGenePhenotypeHits();
        self.promiseInitCoverage()
        .then(function() {
          return self.showMultiAlignments();
        })
        .then(function() {
          self.cohortModel.promiseGetGenePhenotypeAssociations(self.selectedGene.gene_name, true)
          .then(function(data) {
            self.matchingGenePhenotypes = data.hpoEntries;
          })
        })
      }
    },

    initPedigreeGenotypes() {
      let self = this;
      self.$set(self, "pedigreeGenotypeData", {});
      let thePedigreeGenotypeData = {}
      self.cohortModel.sampleModels.forEach(function(model) {
        if (model.relationship != 'known-variants' && model.relationship != 'sfari-variants') {
          let gtObject = {};
          gtObject.rel = model.relationship;
          gtObject.sex = model.sex
          gtObject.affectedStatus = model.affectedStatus;
          if (self.selectedVariant.genotypes && self.selectedVariant.genotypes[model.getSampleName()]) {
            let gt = self.selectedVariant.genotypes[model.getSampleName()];
            gtObject.zygosity = gt.zygosity.toLowerCase();

            var altAndRef = +gt.refCount + +gt.altCount;
            var altRatio  = (+gt.altCount / +gt.genotypeDepth);
            var otherCount = 0;
            var otherRatio = 0;
            if (altAndRef < +gt.genotypeDepth) {
              otherCount  = +gt.genotypeDepth - altAndRef;
              otherRatio  = (otherCount / +gt.genotypeDepth);
            }
            gtObject.altRatio   = altRatio;
            gtObject.altCount   = gt.altCount;
            gtObject.otherCount = otherCount;
            gtObject.otherRatio = otherRatio;
            gtObject.refCount   = gt.refCount;
            gtObject.totalCount = gt.genotypeDepth;


          } else {
            gtObject.zygosity = "unknown"
          }
          gtObject.inheritance = self.selectedVariant.inheritance;

          thePedigreeGenotypeData[gtObject.rel] = gtObject;
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
            if (self.selectedVariant.genotypes && self.selectedVariant.genotypes[model.getSampleName()]) {
              let gt = self.selectedVariant.genotypes[model.getSampleName()];
              gtObject.zygosity = gt.zygosity.toLowerCase();

              var altAndRef = +gt.refCount + +gt.altCount;
              var altRatio  = (+gt.altCount / +gt.genotypeDepth);
              var otherCount = 0;
              var otherRatio = 0;
              if (altAndRef < +gt.genotypeDepth) {
                otherCount  = +gt.genotypeDepth - altAndRef;
                otherRatio  = (otherCount / +gt.genotypeDepth);
              }
              gtObject.altRatio   = altRatio;
              gtObject.altCount   = gt.altCount;
              gtObject.otherCount = otherCount;
              gtObject.otherRatio = otherRatio;
              gtObject.refCount   = gt.refCount;
              gtObject.totalCount = gt.genotypeDepth;
            } else {
              gtObject.zygosity = "unknown"
            }
            gtObject.inheritance = self.selectedVariant.inheritance;

            thePedigreeGenotypeData['sibling-' + model.name] = gtObject;

          })

        }

      })
      self.$set(self, "pedigreeGenotypeData", thePedigreeGenotypeData);


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
          self.conservationSeqType = "nuc";
          self.coverageMaxDepth    = 0;

          let theCoverage = self.cohortModel.getModel(self.selectedVariantRelationship).coverage.filter(function(coveragePoint) {
            return coveragePoint[0] >= self.coverageRegionStart && coveragePoint[0] <= self.coverageRegionEnd;
          })
          let clonedCoverage = [];
          theCoverage.forEach(function(covPoint) {
            let newPoint = []
            newPoint.push(covPoint[0])
            newPoint.push(covPoint[1])
            clonedCoverage.push(newPoint)
            if (covPoint[1] > self.coverageMaxDepth) {
              self.coverageMaxDepth = +covPoint[1]
            }
          })
          self.coverageMaxDepth = self.coverageMaxDepth +  (Math.round(self.coverageMaxDepth*.2));
          self.coverage = clonedCoverage
          setTimeout(function() {
            self.showCoverageAlleleBar();
            resolve();
          }, 100)


        } else {
          self.exon = null;
          self.coverageRegionStart = null;
          self.coverageRegionEnd = null;
          self.coverage = [];
          resolve();
        }
      })
    },
    showCoverageAlleleBar: function() {
      let self = this;
      let theDepth = null;
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
    onAddVariantNote: function(aNote) {
      let self = this;
      if (this.selectedVariant.notes == null || this.selectedVariant.notes == "") {
        this.selectedVariant.notes = []
      }
      this.selectedVariant.notes.push({'author': this.user ? this.user.first_name + " " + this.user.last_name : '',
        'datetime': self.getCurrentDateAndTime(),
        'note': aNote,
        'showDialog': false,
        'showEditDialog': false})
      this.$emit("apply-variant-notes", this.selectedVariant)
    },
    
    getCurrentDateAndTime: function() {
      var today = new Date();
      var date = today.getFullYear()
                 + '-'
                 + String(today.getMonth()+1).padStart(2, "0") 
                 + '-'
                 + String(today.getDate()).padStart(2, "0");
      var time = String(today.getHours()).padStart(2, "0") 
                 + ":" 
                 + String(today.getMinutes()).padStart(2, "0");
      return date + ' ' + time;
    },

    onApplyVariantNotes: function(variant) {
      this.$emit("apply-variant-notes", variant);
    },
    onApplyVariantInterpretation: function(variant) {
      this.$emit("apply-variant-interpretation", variant);
    },

    formatQCCircleText: function(pos, depth) {
      return depth + ' reads'
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
        if (self.selectedTranscript && self.selectedTranscript.features) {
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
        return +self.exon.start - exonWidth;
      } else  {
        return +self.selectedVariant.start - 1000;
      }
    },
    getCoverageRegionEnd: function() {
      let self = this;
      if (self.exon) {
        let exonWidth = +self.exon.end  -  +self.exon.start;
        return +self.exon.end + exonWidth;
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
        tooltip, self.$el.offsetWidth, 15);
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
      if (this.selectedGene.strand == "-") {
        self.selectedVariant.refAlt = self.globalApp.utility.getReverseStrandComplement(this.selectedVariant.ref, this.selectedVariant.alt)
      } else {
        self.selectedVariant.refAlt = {ref: self.selectedVariant.ref, alt: self.selectedVariant.alt}
      }
      self.showConservation = false;
      self.hasConservationScores = false;
      self.hasConservationAligns = false;
      self.conservationTargetScore = null;
      self.conservationExactScore = null;
      self.conservationScores = null;
      self.conservationOptions = null;
      self.multialignSequences = null;
      self.multialignSelectedBase = null;
      self.multialignInProgress = true;

      let promises = [];
      let p1 = self.multiAlignModel.promiseGetConservationScores(self.coverageRegionStart,
                                                  self.coverageRegionEnd,
                                                  self.selectedGene,
                                                  self.selectedVariant,
                                                  self.genomeBuildHelper.getBuildAlias(self.genomeBuildHelper.ALIAS_UCSC))
      .then(function(data) {
        if (data) {
          self.conservationExactScore  = data.selectedScore;
          self.conservationTargetScore = data.targetScore;
          self.conservationScores      = data.scores;
          self.conservationOptions     = data.options;
          self.hasConservationScores   = self.multiAlignModel.hasConservationScores(self.coverageRegionStart,
                                                                                    self.coverageRegionEnd,
                                                                                    self.selectedGene);
          self.showConservation =  self.hasConservationScores || self.hasConservationAligns;
        }
      });
      promises.push(p1);


      let p2 = self.multiAlignModel.promiseGetMultiAlignments(self.selectedGene,
                                                  self.selectedVariant,
                                                  self.genomeBuildHelper.getBuildAlias(self.genomeBuildHelper.ALIAS_UCSC),
                                                  self.conservationSeqType,
                                                  self.selectedGene.strand)
      .then(function(data) {
        if (data) {
          self.multialignSelectedBase = data.selectedBase;
          self.multialignSequences    = data.sequences;
          self.hasConservationAligns  = data.sequences.length > 0;
          self.multialignInProgress = false;
        }
      })
      .catch(function(error) {
        self.multialignInProgress = false;
      })
      promises.push(p2)

      Promise.all(promises)
      .then(function() {
        self.showConservation =  self.hasConservationScores || self.hasConservationAligns;
      })

    },
    onToggleConservationNucAA: function(seqType) {
      let self = this;
      if (self.selectedVariant) {
        self.multialignInProgress = true;
        self.conservationSeqType = seqType.toLowerCase();
        self.multiAlignModel.promiseGetMultiAlignments(self.selectedGene,
                                                    self.selectedVariant,
                                                    self.genomeBuildHelper.getBuildAlias(self.genomeBuildHelper.ALIAS_UCSC),
                                                    self.conservationSeqType)
        .then(function(data) {
          if (data) {
            self.multialignInProgress   = false;
            self.multialignSequences    = data.sequences;
            self.multialignSelectedBase = data.selectedBase;
          }
        })
        .catch(function(data) {
          self.multialignInProgress = false;
        })
      }
    },
    onEnterComments: function() {
      this.$emit("show-variant-assessment", true)
      this.enterCommentsClicked = true;
    },
    onCloseGeneAssociationDialog: function(data){
      this.showMoreGeneAssociationsDialog = false;
    },
    getAfFilterInfo: function(additionalText) {
      let self = this;
      if (self.selectedVariant.afFieldHighest) {
        let afPct = self.selectedVariant.afHighest && $.isNumeric(self.selectedVariant.afHighest) && self.selectedVariant.afHighest != 0 ? d3.format(".3%")(self.selectedVariant.afHighest) : '0%' 
        let msg =  "For filtering purposes, " 
        + self.gnomADFieldToLabel[self.selectedVariant.afFieldHighest] 
        + " " + afPct + " was used. ";       
        msg += (additionalText ? additionalText : "");
        return msg;
      } else {
        let msg =  "For filtering purposes, an allele frequency of 0%, indicating the annotation was not found in gnomAD. "
        msg += (additionalText ? additionalText : "");
        return msg;
      }
    },
    refreshVariantInterpretation: function() {
      this.interpretation = this.selectedVariant.interpretation;
    },


  },


  computed: {

    annotValues : function(){
      return this.selectedVariant ? this.selectedVariant.allAnnots : {};
 
    },

    formatValues : function(){
      return this.selectedVariant ? this.selectedVariant.formatMap : {};
    },


    mergedInfoAndFormat() {
      const merged = [];
    
      for (const item of this.selectedInfo) {
        if (this.selectedVariant && this.selectedVariant.allAnnots)  {
          let value = "";
          if (this.selectedVariant.allAnnots.hasOwnProperty(item.key) == false){
            value = "None";
          }else{
            value = this.selectedVariant.allAnnots[item.key];
          }
          merged.push({
            key: item.key,
            value: value,
            description: item.value,
            id: "info" + item.key
          });
        }
      }

      for (const item of this.selectedFormat) {
        if (this.selectedVariant && this.selectedVariant.formatMap) {
          let value = "";
          if (this.selectedVariant.formatMap.hasOwnProperty(item.key) == false){
            value = "None";
          }else{
            value = this.selectedVariant.formatMap[item.key];
          }
          merged.push({
            key: item.key,
            value: value,
            description: item.value,
            id: "format" + item.key
          });
        }
      }
      return merged; 
    },

    mosaicValuesMap() {
      const mosaicValues = [];
      for (const item of this.selectedMosaicVariantAnnotations) {
        if (this.mosaicVariant && this.mosaicVariant.hasOwnProperty(item.key)) {
          let value = "";
          if (this.mosaicVariant[item.key].length > 0){
            value = this.mosaicVariant[item.key].join(", ");
          }else{
            value = "None";
          }
         
          mosaicValues.push({
            key: item.key,
            value: value,
            description: item.value,
            id: "mosaic" + item.key
          });
        }
      }
      return mosaicValues;
    },

    hasAlignments: function() {
      if (this.selectedVariantRelationship) {
        return this.cohortModel.getModel(this.selectedVariantRelationship).isBamLoaded();
      } else {
        return false;
      }
    },
    hgvsLabel: function() {
      if (this.selectedVariant && this.selectedVariant.extraAnnot && this.info.HGVSpAbbrev && this.info.HGVSpAbbrev.length > 0) {
        return this.info.HGVSpAbbrev;
      } else {
        return 'HGVS';
      }
    },
    gnomadFreqPopMax: function() {
      return this.afGnomAD ? d3.format('.3n')(this.afGnomAD.freqPopMax) : '-';
    },
    gnomadFreq: function() {
      return this.afGnomAD ? d3.format('.3n')(this.afGnomAD.freq) : '-';
    },

      coord: function() {
      let self = this;
      if (self.selectedVariant) {
        return self.selectedVariant.chrom + ":" + self.selectedVariant.start;
      } else {
        return "";
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
        } else if (self.isSimpleMode) {
          if (self.selectedGene.strand == "-") {
            let refAltCompl = self.globalApp.utility.getReverseStrandComplement(self.selectedVariant.ref, self.selectedVariant.alt)
            refAlt =   refAltCompl.ref + "->" + refAltCompl.alt;
          } else {
            refAlt =   self.selectedVariant.ref + "->" + self.selectedVariant.alt;
          }
        } else {
          refAlt =   self.selectedVariant.ref + "->" + self.selectedVariant.alt;
          if (self.selectedVariant.ref == '' && self.selectedVariant.alt == '') {
            refAlt = '(' + variant.len + ' bp)';
          }

        }
      }
      return refAlt;
    },
    aminoAcidChange: function() {
      let self = this;
      let aaPos = "";
      let altRefAA = null;
      if (self.selectedVariant && self.selectedVariant.vepAminoAcids && Object.keys(self.selectedVariant.vepAminoAcids).join("").length > 0) {
        for (let aa in self.selectedVariant.vepAminoAcids) {
          altRefAA = self.globalApp.utility.formatAminoAcidChange(aa)
        }
        if (Object.keys(self.selectedVariant.vepProteinPosition).join("").length > 0) {
          aaPos += Object.keys(self.selectedVariant.vepProteinPosition).join(" ");
        }
      }
      if (altRefAA && aaPos) {
        return altRefAA.ref + aaPos + altRefAA.alt;
      } else {
        return "";
      }
    },
    afGnomAD: function() {
      if (this.selectedVariant) {
        if (this.globalApp.gnomADExtraMethod == this.globalApp.GNOMAD_METHOD_CUSTOM_VEP
          && this.selectedVariant.vepAf.gnomADg 
          && Object.keys(this.selectedVariant.vepAf.gnomADg).length > 0
          && this.selectedVariant.vepAf.gnomADe 
          && Object.keys(this.selectedVariant.vepAf.gnomADe).length > 0) {
            let gnomADSource = "";

            if (this.selectedVariant.vepAf.gnomADe 
              && this.selectedVariant.vepAf.gnomADe.present 
              && this.selectedVariant.vepAf.gnomADg 
              && this.selectedVariant.vepAf.gnomADg.present ) {
              gnomADSource = "gnomAD exomes + genomes";
            } else if (this.selectedVariant.vepAf.gnomADg 
              && this.selectedVariant.vepAf.gnomADg.present) {
              gnomADSource = "gnomAD genomes"
            } else if (this.selectedVariant.vepAf.gnomADg 
              && this.selectedVariant.vepAf.gnomADg.present) {
              gnomADSource = "gnomAD exomes"
            } else {
              gnomADSource = "gnomAD exomes + genomes"              
            }


            // For gnomAD 3.1, we would prefer to use popmax AF (95 CI) rather
            // than raw popmax AF.
            let popmax_gnomADg = null;
            if (this.selectedVariant.vepAf.gnomADg.faf95_popmax 
              && $.isNumeric(this.selectedVariant.vepAf.gnomADg.faf95_popmax)) {
              popmax_gnomADg = this.selectedVariant.vepAf.gnomADg.faf95_popmax
            } else {
              popmax_gnomADg = this.selectedVariant.vepAf.gnomADg.AF_popmax
            }

            let afAll        = [this.selectedVariant.vepAf.gnomADg.AF,
                             this.selectedVariant.vepAf.gnomADe.AF]
            let anAll        = [this.selectedVariant.vepAf.gnomADg.AN,
                             this.selectedVariant.vepAf.gnomADe.AN]
            let acAll        = [this.selectedVariant.vepAf.gnomADg.AC,
                             this.selectedVariant.vepAf.gnomADe.AC]
            let nHomAll      = [this.selectedVariant.vepAf.gnomADg.nhomalt_raw,
                                this.selectedVariant.vepAf.gnomADg['nhomalt-raw'],
                                this.selectedVariant.vepAf.gnomADe.nhomalt_raw]

            let acTot = acAll.reduce(function(tot, ac) {
              return tot + ((ac && $.isNumeric(ac)) ? +ac : 0);
            }, 0)
            let anTot = anAll.reduce(function(tot, an) {
              return tot + ((an && $.isNumeric(an)) ? +an : 0);
            }, 0)
            let nHomTot = nHomAll.reduce(function(tot, nHom) {
              return tot + ((nHom && $.isNumeric(nHom)) ? +nHom : 0);
            }, 0)
            let afTot = anTot > 0 ? (acTot / anTot) : 0;

            // We prefer to show the popmax from genomes, if available
            let afPopMax = 0;
            if (popmax_gnomADg && $.isNumeric(popmax_gnomADg)) {
              afPopMax = popmax_gnomADg
            } else if (this.selectedVariant.vepAf.gnomADe.AF_popmax && $.isNumeric(this.selectedVariant.vepAf.gnomADe.AF_popmax)) {
              afPopMax = this.selectedVariant.vepAf.gnomADe.AF_popmax;
            }
            


            var gnomAD = {};
            gnomAD.label = "Allele frequency"
            gnomAD.freq       = afTot == 0 ? '0' : d3.format(".3n")(afTot);
            gnomAD.class         = this.getAfClass(afTot);
            gnomAD.freqPopMax    = afPopMax == 0 ? '0' : d3.format(".3n")(afPopMax);
            gnomAD.altCount      = acTot;
            gnomAD.totalCount    = anTot;
            gnomAD.homCount      = nHomTot;
            gnomAD.source        = gnomADSource;
            gnomAD.loading       = null
            gnomAD.infoPopup     = "gnomADExtraVepCustom"
            gnomAD.extraInfo1 =  
                  ' Annotations shown for variant are from gnomAD ' 
                  + this.globalApp.getGnomADSourceName(this.genomeBuildHelper.getCurrentBuildName(), 'genomes')
                  + " genomes, "
                  + this.globalApp.getGnomADSourceName(this.genomeBuildHelper.getCurrentBuildName(), 'exomes')
                  + " exomes."
            gnomAD.extraInfo2 = this.getAfFilterInfo();

            gnomAD.link =  "http://gnomad.broadinstitute.org/variant/"
                          + this.selectedVariant.chrom + "-"
                          + this.selectedVariant.start + "-"
                          + this.selectedVariant.ref + "-"
                          + this.selectedVariant.alt;

            if (this.genomeBuildHelper.getCurrentBuildName() == 'GRCh38') {
              gnomAD.link += "?dataset=gnomad_r3"
            };

            return gnomAD;

        }
        else if (this.globalApp.gnomADExtraMethod == this.globalApp.GNOMAD_METHOD_MERGED_ANNOTS &&
          (this.globalApp.gnomADExtraAll || (this.globalApp.gnomADExtra && this.selectedVariant.extraAnnot))) {
          let source      =  "gnomAD genomes"
          let infoPopup   = "gnomAD"
          let extraInfo1  =  
                  ' Annotations shown for variant are from gnomAD ' 
                  + this.globalApp.getGnomADSourceName(this.genomeBuildHelper.getCurrentBuildName(), 'genomes')
                  + " genomes."
          let extraInfo2 = this.getAfFilterInfo();

          // We will  show the AF from VEP (exomes) below the AF from gnomAD genomes so that
          // the user understands that that filtering used this AF rather than the
          // one from the gnomAD genomes
          let afExomes = 0
          if (this.selectedVariant.vepAf.gnomAD.AF == "." 
            && this.selectedVariant.vepAf.MAX.present ) {
            afExomes = this.selectedVariant.vepAf.MAX.AF == "."  ? 0 : this.selectedVariant.vepAf.MAX.AF 
          } else {
            afExomes = this.selectedVariant.vepAf.gnomAD.AF == "." ? 0 : this.selectedVariant.vepAf.gnomAD.AF;
          }

          if (this.selectedVariant.gnomAD == null || this.selectedVariant.gnomAD.af == null) {
            return {
              link: null,
              label: "Allele frequency",
              freq: "?", 
              class: "",
              freqPopMax: '0',
              altCount: '0', 
              totalCount: '0',
              homCount: '0',
              source: source,
              loading: null,
              infoPopup: infoPopup, 
              extraInfo1: extraInfo1, 
              extraInfo2: extraInfo2,
              afExomes: afExomes
            };
          } else if (this.selectedVariant.gnomAD.af  == '.') {
            return {
              link: null,
              label: "Allele frequency",
              freq: '0',  
              class: "level-high",
              freqPopMax: '0',
              altCount: '0', 
              totalCount: '0',
              homCount: '0',
              source: source,
              loading: null,
              infoPopup: infoPopup, 
              extraInfo1: extraInfo1, 
              extraInfo2: extraInfo2,
              afExomes: afExomes
            };
          } else  {
            var gnomAD = {};
            gnomAD.link =  "http://gnomad.broadinstitute.org/variant/"
              + this.selectedVariant.chrom + "-"
              + this.selectedVariant.start + "-"
              + this.selectedVariant.ref + "-"
              + this.selectedVariant.alt;

            if (this.genomeBuildHelper.getCurrentBuildName() == 'GRCh38') {
              gnomAD.link += "?dataset=gnomad_r3"
            };

            gnomAD.label = "Allele frequency"
            gnomAD.freq       = d3.format('.3n')(this.selectedVariant.gnomAD.af);
            gnomAD.class         = this.getAfClass(this.selectedVariant.gnomAD.af);
            gnomAD.freqPopMax    = this.selectedVariant.gnomAD.afPopMax != '.' ? this.selectedVariant.gnomAD.afPopMax : '0.0';
            gnomAD.altCount      = this.selectedVariant.gnomAD.altCount;
            gnomAD.totalCount    = this.selectedVariant.gnomAD.totalCount;
            gnomAD.homCount      = this.selectedVariant.gnomAD.homCount;
            gnomAD.source        = source;
            gnomAD.loading       = null;
            gnomAD.infoPopup     = infoPopup;
            gnomAD.extraInfo1    = extraInfo1;
            gnomAD.extraInfo2    = extraInfo2;
            gnomAD.afExomes      =  afExomes
            
            return gnomAD;

          }
        } else {
          let source = "gnomAD exomes";


          if (this.selectedVariant.vepAf == null || this.selectedVariant.vepAf.gnomAD.AF == null) {
            return {freq: "?", link: null, class: "", source: source, infoPopup: "gnomAD"};
          } else  {
            var gnomAD = {};
            gnomAD.link = null;
            if ( this.selectedVariant.vepAf.gnomAD.AF != ".") {
              gnomAD.link = "http://gnomad.broadinstitute.org/variant/"
              + this.selectedVariant.chrom + "-"
              + this.selectedVariant.start + "-"
              + this.selectedVariant.ref + "-"
              + this.selectedVariant.alt;
            }

            if (this.genomeBuildHelper.getCurrentBuildName() == 'GRCh38') {
              gnomAD.link += "?dataset=gnomad_r3"
            };

            let af = 0;
            // If the vepAF.gnomAD is filled in use that; otherwise, default the the vepAF MAX af
            if (this.selectedVariant.vepAf.gnomAD.AF == "." 
              && this.selectedVariant.vepAf.MAX.present ) {
              af = this.selectedVariant.vepAf.MAX.AF == "."  ? 0 : this.selectedVariant.vepAf.MAX.AF 
            } else {
              af = this.selectedVariant.vepAf.gnomAD.AF == "." ? 0 : this.selectedVariant.vepAf.gnomAD.AF;
            }

             
            gnomAD.freq       = d3.format('.3n')(af);
            gnomAD.class         = this.getAfClass(af);
            gnomAD.label         = "Allele frequency"
            gnomAD.source        = source;

            gnomAD.freqPopMax = 0;
            gnomAD.altCount      = 0;
            gnomAD.totalCount    = 0;
            gnomAD.homCount      = 0;
            
            if (this.globalApp.gnomADExtra 
              && !this.globalApp.gnomADExtraAll 
              && !this.selectedVariant.extraAnnot) {
              if (this.globalApp.gnomADExtraMethod == this.globalApp.GNOMAD_METHOD_MERGE_ANNOTS) {
                gnomAD.loading = 'gnomAD genomes'
                gnomAD.class = "level-blank"
                gnomAD.infoPopup  = "gnomAD";
                gnomAD.extraInfo1 =  
                  'Annotations shown for variant are from gnomAD ' 
                  + this.globalApp.getGnomADSourceName(this.genomeBuildHelper.getCurrentBuildName(), 'genomes')
                  + " genomes."
                
              } else {
                 gnomAD.loading = 'loading annotations'
                 gnomAD.infoPopup     = "gnomADExtraVepCustom"
                 gnomAD.extraInfo1 =  
                  'Annotations show for variant are from gnomAD ' 
                  + this.globalApp.getGnomADSourceName(this.genomeBuildHelper.getCurrentBuildName(), 'genomes')
                  + " genomes, "
                  + this.globalApp.getGnomADSourceName(this.genomeBuildHelper.getCurrentBuildName(), 'exomes')
                  + " exomes."
                
              }
            } else {
              gnomAD.infoPopup     = "gnomAD"     
              gnomAD.extraInfo1 = null         
            }
            gnomAD.extraInfo2 = this.getAfFilterInfo();


            return gnomAD
          }

        }
      }
    },
    sourceIndicatorLabel: function() {
      if(this.launchedFromClin) {
        let label = "Variants defined in ";
        let gene_name = this.selectedGene.gene_name;
        let source = this.cohortModel.geneModel.getSourceForGenes()[gene_name].source.join(", ");
        label += source
        return label;
      }
    },
    
    getSourceIndicatorBadge: function() {
      if(this.launchedFromClin){
        this.selectedGeneSources.source = this.cohortModel.geneModel.getSourceForGenes()[this.selectedGene.gene_name].source;
        this.selectedGeneSources.sourceIndicator = this.cohortModel.geneModel.getSourceForGenes()[this.selectedGene.gene_name].sourceIndicator;
        return this.cohortModel.geneModel.getSourceForGenes()[this.selectedGene.gene_name].sourceIndicator;
      }
    },


  },

  watch: {

    //mosaicVariantInterpretation: function() {
    //  let self = this;
    //  if (self.interpretation == null || self.interpretation == 'not-reviewed') {
    //    self.$nextTick(function() {
    //      self.selectedVariant.interpretation = self.mosaicVariantInterpretation;
    //      self.interpretation = self.mosaicVariantInterpretation;            
    //    })
    //  }
    //},
    selectedPhenotype: function(){
        this.initGenePhenotypeHits();
    },

    selectedVariant: function() {
      let self = this;
      this.$nextTick(function() {
          self.loadData();
          if (self.selectedVariantRelationship === "known-variants") {
              self.annotateClinVarVariant(self.selectedVariant);
          }
      })
    },
  },

  filters: {

    firstCharacterToUppercase(s) {
      if(s){
      return s.charAt(0).toUpperCase() + s.slice(1)
      }
    },

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
    let self = this;
    if(this.selectedVariant){
        self.$nextTick(function() {
          self.loadData();
          if (self.selectedVariantRelationship === "known-variants") {
              self.annotateClinVarVariant(self.selectedVariant);
          }
          self.interpretation = self.selectedVariant.interpretation  && self.selectedVariant.interpretation.length > 0 ? self.selectedVariant.interpretation : "not-reviewed";
        })
    }

    
  },

  created: function() { 
    
  },

}
</script>
