<style lang="sass">
@import ../../../assets/sass/variables

#flagged-variants-card
  padding-left: 5px
  padding-bottom: 20px

  .gene-ranks
    .chip
      margin-top: 0px
      margin-bottom: 2px
      margin-left: 0px
    .chip__content
      font-size:  11px
      background-color:  $info-chip-color
      height: 16px
      padding-left: 4px
      padding-right: 4px
      color:  $text-color


  #clinvar-symbol
    display: inline-block
    vertical-align: top
    margin-top: 2px


  .variant-toolbar
    width: calc(100% - 1px)
    padding-right: 20px
    background-color: white
    margin-bottom: 20px
    margin-top: 20px

    #mygene2-basic-title
      word-break: break-word
      display: inline-block
      white-space: normal
      line-height: 18px
      margin-left: 10px
      margin-right: 10px
      color: $text-color
      margin-bottom: 10px



    .toolbar__title, .v-toolbar__title
      font-family: inherit
      font-size: 15px
      min-width: initial
      padding-top: 10px
      display: inline-block
      color:  $text-color
      margin-top: 5px
      margin-left: 0px
      padding-right: 0px

      span
        padding-right: 30px
        margin-left: 8px
        white-space: normal
        font-size: 14px
        line-height: 15px
        display: inline-block
        color: $app-color


    .toolbar-button
      min-width: 70px
      color: $text-color
      margin-right: 5px
      margin-left: 0px
      font-size: 13px
      height: 30px
      margin-top: -7px

      .btn__content, .v-btn__content
        padding: 0px

      i.material-icons
        font-size: 16px
        padding-right: 4px


  .filtered-variants-panel
    margin-top: 10px
    margin-left: 10px

  .user-flagged-variants-panel
    margin-top: 30px
    margin-left: 10px


  #mygene2-basic-none
    display: inline-block
    white-space: normal
    line-height: 18px
    font-style: italic
    margin-left: 20px

  .gene-list


  .expansion-panel, .v-expansion-panel
    -webkit-box-shadow : none
    box-shadow: none

  .expansion-panel__body, .v-expansion-panel-content
    padding-left: 3px
    padding-right: 4px



  li.selected
    border-color: $current-color
    border-width: 2px
    border-style: solid
    border-radius: 4px

  .subheader
    color: $text-color
    height: initial
    padding: 0 6px 0 6px

    span
      width: 100%
      text-align: center
      background-color: #f2f1f1

  .expansion-panel__header, .v-expansion-panel__header
    border-top: #e1e1e1
    border-top-style: solid
    border-top-width: 1px
    padding:  12px 10px 10px 2px
    background-color: #e9eaeb

  .v-expansion-panel__header
    min-height: 28px
    padding-left: 10px

    .header__icon
      i.material-icons
        color: $app-color

  .expansion-panel__container, .v-expansion-panel__container
    border-top: none


    .badge, .v-badge
      background-color: transparent

      span.filter-label
        color: $app-color
        border-color: none
        font-size: 15px
        font-weight: normal
        display: inline-block
        text-align: left


    .badge__badge.primary, .v-badge__badge.primary
      background-color: $light-badge-color !important
      font-size: 10px
      color: white
      top: 2px
      width: 17px
      height: 17px


  .filter-variant-count
    float: right
    padding-right: 8px
    font-size: 12px
    color: $text-color

  .list--three-line, .v-list--three-line
    margin-bottom: 10px
    padding-top: 5px

    .filter-subheader
      margin-left: -20px

    .subheader
      height: initial
      font-size: 13px
      margin-left: 0px
      text-color: $text-color
      margin-top: 5px
      padding: 0 12px 0 5px

    .avatar
      width: 32px !important
      height: 32px !important

    li
      margin-left: 0px

    .list__tile__avatar, .v-list__tile__avatar
      margin-left: 0px

    .list__tile__content, .v-list__tile__content
      margin-left: 0px

    hr
      margin-bottom: 4px
      margin-top: 4px

    .divider--inset
      margin-left: 22px
      width: calc(100% - 42px)

    .list__tile, .v-list__tile
      padding: 0px
      height: initial
      padding-left: 0px
      padding-top: 10px

    .list__tile__avatar, .v-list__tile__avatar
      min-width: initial

    .list__tile__sub-title, .v-list__tile__sub-title
      height: initial
      line-height: 18px

    .list__tile__title, .v-list__tile__title
      height: auto
      line-height: 18px
      padding-bottom: 5px

    .variant-number
      margin-right: 0px
      margin-left: 0px
      display: inline-block
      vertical-align: top
      margin-bottom: 0px
      background-color: transparent
      width: 18px !important
      height: 18px !important

      .chip__content, .v-chip__content
        width: 18px !important
        height: 18px !important
        justify-content: space-around
        padding: 0px
        font-size: 11px
        background-color: transparent
        color: $text-color
        border: #d5d5d5 solid thin

    #select-interpretation
      width: 22px

    .af-small
      display: inline-block
      width: 50px
      font-size: 12px
      margin-left: 4px
      vertical-align: top
      padding-top: 0px
      line-height: 12px

      &.level-high
        color: $high-impact-color  !important
      &.level-medium
        color: $moderate-impact-color !important

    .revel
      display: inline-block
      vertical-align: top
      font-size: 12px

    .vep-consequence
      display: inline-block
      width: 133px
      line-height: 12px
      vertical-align: top
      font-size: 12px
      white-space: normal

    .variant-label
      font-size: 12px
      color: $text-color !important


      .coord
        display: inline-block
        width: 115px
        line-height: 12px
        vertical-align: top
      .hgvsp
        display: inline-block
        width: 115px
        line-height: 12px
        vertical-align: top



      .rsid
        display: inline-block
        width: 103px
        line-height: 12px
        vertical-align: top

      .af
        display: inline-block
        width: 60px
        vertical-align: top
        line-height: 12px


      .hgvsc
        display: inline-block
        width: 228px
        line-height: 12px
        vertical-align: top


    .variant-symbols
      .variant-moniker
        width: 170px
        display: inline-block

        .gene-name
          display: inline-block
          vertical-align: top
          font-weight: bold
          font-size: 13px
          margin-right: 4px
          padding-top: 2px

        .variant-glyphs
          display: inline-block
          padding-top: 0px

        .has-called-variants
          font-size: 15px
          color: $called-variant-color
          margin-top: 0px
          margin-left: 0px


      .variant-notes
        margin-top: -6px




.variant-file-body
  padding-top: 0px
  padding-bottom: 18px
  margin-bottom: 20px
  margin-top: 20px

  .radio-group.radio-group--column
    margin-top: 0px
    padding-top: 0px
    padding-bottom: 0px

    >.input-group__input
      margin-top: 0px

  .input-group--select
    .input-group__selections__comma
      font-size: 14px
      padding: 0px 0px 0px 0px

  .input-group
    label
      font-size: 14px
      line-height: 20px
      height: 20px

  .input-group__input
    min-height: 0px
    margin-top: 10px

  .input-group__input
    .input-group__selections__comma
      font-size: 14px

  .input-group--text-field
    label
      top: 6px

  .input-group.input-group--selection-controls
    height: 24px
    .input-group__input
      .icon--selection-control
        height: 0px

.variant-file-button
  color: $text-color !important
  height: 28px
  margin-top: 10px
  margin-bottom: 10px
  margin-left: 0px
  padding-left: 0px
  padding-right: 0px
  padding-top: 0px
  padding-bottom: 0px


  i.material-icons
    font-size: 16px
    padding-right: 4px

#flagged-variants-card.basic

  .toolbar__title, .v-toolbar__title
    margin-top: 0px
    padding-top: 0px
    padding-left: 3px

  .expansion-panel, .v-expansion-panel
    -webkit-box-shadow : none
    box-shadow: none
    margin-top: 0px


  .expansion-panel__header, .v-expansion-panel__header
    display: none

  .list--three-line, .v-list--three-line
    li
      margin-left: 0px




</style>

<template>
  <v-card  style="padding: 0px" id="flagged-variants-card" :class="{basic: isBasicMode}">


    <div class="variant-toolbar" >


      <span  v-show="isBasicMode && !launchedFromClin && variantCount > 0" id="mygene2-basic-title">
        Clinvar Pathogenic/Likely Pathogenic Variants &lt; 1% frequency
      </span>
      <v-btn  v-if="!isBasicMode && !launchedFromClin" flat
        class="toolbar-button"
        @click="importInProgress = false;clearFileInputs();showOpenDialog = true">
        <v-icon>open_in_browser</v-icon>
        Open
      </v-btn>

      <v-btn v-if="!isBasicMode && !launchedFromClin && variantCount > 0" flat
        class="toolbar-button"
        @click="onClickSave">
        <v-icon>save</v-icon>
        Save
      </v-btn>




    </div>


    <span id="mygene2-basic-none" v-show="isBasicMode && variantCount == 0">
      (none)
    </span>

    <div v-if="false && !isBasicMode && isFullAnalysis && variantCount != 0"
      style="margin-top:-25px;margin-bottom:20px;margin-left:20px">
        <interpretation-select  style="width:250px"
        :interpretationMap="interpretationMap"
        @apply-interpretation="onApplyInterpretationFilter">
        </interpretation-select>
    </div>



  <v-expansion-panel expand >
    <v-expansion-panel-content v-for="geneList in geneLists"  :key="geneList.label"
      :value="geneList.expand"
      v-if="geneList.show">
      <div slot="header" v-show="!isBasicMode">

        <span v-show="geneList.genes.length > 0" class="filter-subheader">
          <filter-icon v-if="false" :icon="geneList.name"></filter-icon>


          <v-badge>
            <span  class="filter-badge-count" slot="badge">{{ geneList.variantCount }}</span>
            <span class="filter-label">{{ geneList.label }}</span>
          </v-badge>


        </span>


      </div>
      <v-list three-line>
        <template
         v-for="flaggedGene in geneList.genes">

          <!-- <v-subheader :key="flaggedGene.gene.gene_name">{{ flaggedGene.gene.gene_name }}</v-subheader>
        -->

          <template v-for="variant in flaggedGene.variants">

            <v-list-tile
            :key="variant.start + ' ' + variant.ref + ' ' + variant.alt"
            ripple
            :class="{selected: clickedVariant == variant ? true : false}"
            @click="onVariantSelected(variant)">


              <v-list-tile-avatar >
               <v-chip class="variant-number" >
                {{ variant.ordinalFilter  }}
               </v-chip>
              </v-list-tile-avatar>

              <v-list-tile-content>

                <v-list-tile-title>

                  <div style="float:left">


                    <div class="variant-symbols">

                      <span class="variant-moniker">
                        <span class="gene-name"> {{ flaggedGene.gene.gene_name }}</span>

                        <span class="variant-glyphs">
                          <app-icon
                           icon="clinvar"
                           v-if="clinvar(variant) == 'clinvar_path' || clinvar(variant) == 'clinvar_lpath'"
                           :level="clinvar(variant) == 'clinvar_path' ? 'high' : 'likely-high'"
                           class="clinvar-badge" height="13" width="13">
                          </app-icon>

                          <app-icon
                          style="width: 15px;height: 15px;display: inline-block;margin-top: 2px;"
                           :icon="variant.inheritance"
                           v-if="!isBasicMode && variant.inheritance && variant.inhertance != '' && variant.inheritance != 'none'"
                           class="inheritance-badge" height="15" width="15">
                          </app-icon>

                          <app-icon
                           icon="impact"
                           v-if="false && variant.type"
                           :type="variant.type.toLowerCase()"
                           :clazz="highestImpactClass(variant)"
                           class="impact-badge" height="15" width="11">
                          </app-icon>

                          <app-icon
                           icon="zygosity" v-if="!isBasicMode && zygosity(variant).toLowerCase() == 'hom'"
                           :type="zygosity(variant).toLowerCase()"
                           height="14" width="24">
                          </app-icon>
                        </span>

                        <v-icon v-if="variant.fbCalled == 'Y'" class="has-called-variants">
                          check_circle
                        </v-icon>


                      </span>



                    </div>
                    <div  class="gene-ranks" v-if="!isBasicMode && !variant.notFound && launchedFromClin">

                      <span v-show="geneRankGTR(flaggedGene.gene.gene_name) != ''">
                        <v-chip class="white--text" >
                          {{ geneRankGTR(flaggedGene.gene.gene_name) }} GTR
                        </v-chip>
                      </span>
                      <span v-show="geneRankPhenolyzer(flaggedGene.gene.gene_name) != ''">
                        <v-chip class="white--text" >
                          {{ geneRankPhenolyzer(flaggedGene.gene.gene_name) }} Phenolyzer
                        </v-chip>
                      </span>
                    </div>
                    <div style="line-height:12px">
                      <div  v-if="!isBasicMode && !variant.notFound"
                      style="display:inline-block">
                        <span class="vep-consequence">
                          <span v-if="highestImpactRecs(variant).length == 0">
                            {{ vepConsequence(variant) }}
                          </span>

                          <span
                           v-for="(impactRec, idx) in highestImpactRecs(variant)" :key="impactRec.impact">
                            <span v-for="(effectRec, idx1) in impactRec.effects" :key="effectRec.key">
                              {{ getNonCanonicalEffectDisplay(idx1, effectRec) }}
                            </span>

                          </span>

                        </span>
                        <span v-if="false" :class="getAfClass(variant)">{{ afDisplay(variant) }}</span>
                      </div>
                    </div>
                    <div  v-if="!isBasicMode && !variant.notFound && launchedFromClin">
                      <span class="revel">{{ revel(variant) }}</span>
                    </div>
                  </div>


                  <div style="float-left;">

                    <variant-interpretation
                      style="float:left;"
                       v-if="false && !isBasicMode && !forMyGene2 && !variant.notFound"
                       class="variant-notes"
                       wrap="true"
                       :interpretationMap="interpretationMap"
                       :variant="variant"
                       :variantInterpretation="variant.interpretation"
                       @apply-variant-interpretation="onApplyVariantInterpretation">
                    </variant-interpretation>

                    <variant-notes-menu
                      v-if="false && !isBasicMode && !forMyGene2 && !variant.notFound"
                      style="float:left;padding-top: 4px"
                      class="variant-notes"
                      :showNotesIcon="true"
                      :variant="variant"
                      :interpretationMap="interpretationMap"
                      :variantInterpretation="variant.interpretation"
                      :variantNotes="variant.notes"
                      @apply-variant-notes="onApplyVariantNotes">
                    </variant-notes-menu>

                    <span v-if="variant.notFound && isFullAnalysis"
                      class="coord"> {{ coord(flaggedGene, variant) }} </span>
                    </span>


                  </div>



                </v-list-tile-title>

                <v-list-tile-sub-title v-if="isBasicMode" >
                  <div class="variant-label">
                    <div v-if="isBasicMode" style="display:inline-block;" >
                      <span class="coord"> {{ coord(flaggedGene, variant) }} </span>
                    </div>
                    <div style="display:inline-block;vertical-align:top">
                      <span class="vep-consequence">{{ vepConsequence(variant) }}</span>
                    </div>
                    <span v-if="isBasicMode" class="af">{{ afDisplay(variant) }}</span>
                  </div>
                  <div class="variant-label" v-if="isBasicMode">
                    <div style="display:inline-block;" >
                      <span class="hgvsc">  {{ hgvsC(variant) }} </span>
                    </div>
                  </div>
                  <div class="variant-label" >
                    <div style="display:inline-block;" v-if="isBasicMode" >
                      <span class="hgvsp">  {{ hgvsP(variant) }} </span>
                    </div>

                  </div>
                </v-list-tile-sub-title>

              </v-list-tile-content>

            </v-list-tile>


          </template>

        </template>
      </v-list>
    </v-expansion-panel-content>
  </v-expansion-panel>

    <v-menu
    offset-y
    :close-on-content-click="false"
    :nudge-width="400"
    bottom
    v-model="showOpenDialog"
    >



      <v-card class="full-width">
        <v-card-title class="headline">Open variants file</v-card-title>
        <v-card-text class="variant-file-body">
          <div id="open-variant-file" >
            <v-radio-group hide-details v-model="fileType" >
                  <v-radio label="gene.iobio (comma separated)" value="gene"></v-radio>
                  <v-radio label="gemini (tab delimited)" value="gemini"></v-radio>
                  <v-radio label="Tab delimited" value="tsv"></v-radio>
            </v-radio-group>





            <div style="margin-top:10px;margin-bottom:20px">


              <file-chooser
                v-if="fileType == 'gene'"
                title="Choose .csv file"
                :isMultiple="false" :accept="`.csv`"
                showLabel="true"
                @file-selected="onFileSelected">
              </file-chooser>

              <file-chooser
                v-if="fileType != 'gene'"
                title="Choose .txt file"
                :isMultiple="false"
                :accept="`.txt, .tsv`"
                showLabel="true"
                @file-selected="onFileSelected">
              </file-chooser>

              <div style="text-align:center;margin-top:10px"
              v-if="importInProgress" >
                <img style="width:22px;height:22px"
                     class="loader  glyph" src="../../../assets/images/wheel.gif"/>
                Loading variants...
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn raised class="variant-file-button" @click.native="showOpenDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>





    <v-menu
    offset-y
    :close-on-content-click="false"
    :nudge-width="400"
    bottom
    v-model="showSaveDialog"
    >

      <v-card class="full-width">
        <v-card-title class="headline">
         Save variants file
        </v-card-title>
        <v-card-text class="variant-file-body">
          <div id="save-format" >
            <v-radio-group hide-details v-model="exportFormat" >
                  <v-radio label="Comma separated" value="csv"></v-radio>
                  <v-radio label="VCF" value="vcf"></v-radio>
            </v-radio-group>

          </div>
          <div style="text-align:center;margin-top:10px"
            v-if="exportInProgress" >
              <img style="width:22px;height:22px"
                   class="loader  glyph" src="../../../assets/images/wheel.gif"/>
              Saving variants to file...
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="!readyToDownload"
            class="variant-file-button" raised @click="onSaveFile">
            <v-icon>save</v-icon>
            Save
          </v-btn>
          <a id="download-file"
          v-bind:class="(!readyToDownload ? 'hide' : '') + ' btn variant-file-button'"
          download="gene-iobio-variants.csv" href="#">
            <i class="material-icons" style="padding-right:0px;font-size:20px">file_download</i>
            <span style="padding-right:8px">Download file</span>
          </a>
          <v-btn class="variant-file-button" raised @click="showSaveDialog = false;readyToDownload = false;">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>

  </v-card>
</template>


<script>


import FileChooser from '../partials/FileChooser.vue'
import AppIcon from '../partials/AppIcon.vue'
import FilterIcon from '../partials/FilterIcon.vue'
import VariantNotesMenu from '../partials/VariantNotesMenu.vue'
import VariantInterpretation from '../partials/VariantInterpretation.vue'
import InterpretationSelect from '../partials/InterpretationSelect.vue'


export default {
  name: 'flagged-variants-card',
  components: {
    FileChooser,
    AppIcon,
    FilterIcon,
    VariantNotesMenu,
    VariantInterpretation,
    InterpretationSelect
  },
  props: {
    isEduMode: null,
    isBasicMode: null,
    forMyGene2: null,
    activeFilterName: null,
    cohortModel: null,
    launchedFromClin: null,
    isFullAnalysis: null,
    geneNames: null,
    genesInProgress: null,
    interpretationMap: null
  },
  data() {
    return {
      showOpenDialog: false,
      showSaveDialog: false,
      exportFormat: 'csv',
      fileType: 'gene',
      readyToDownload: false,
      importInProgress: false,
      exportInProgress: false,
      geneLists: null,
      clickedVariant: null,
      variantCount: 0,
      interpretationFilters: null
    }
  },
  methods: {
    onApplyInterpretationFilter: function(interpretation) {
      this.interpretationFilters = interpretation
      this.populateGeneLists();
    },
    onVariantSelected: function(variant) {
      this.clickedVariant = variant;
      this.$emit("flagged-variant-selected", variant);
    },
    onFileSelected: function(fileSelection) {
      let self = this;
      self.importInProgress = true;
      self.cohortModel.onFlaggedVariantsFileSelected(fileSelection, self.fileType,
      function() {
        self.importInProgress = false;
        self.$emit("flagged-variants-imported");
        self.showOpenDialog = false;
      });
    },
    onClickSave: function() {
      let self = this;
      self.showSaveDialog = true;
    },
    onSaveFile: function() {
      let self = this;
      self.exportInProgress = true;
      this.cohortModel.promiseExportFlaggedVariants(self.exportFormat)
      .then(function(output) {
        self.exportInProgress = false;
        self.globalApp.utility.createDownloadLink("#download-file",
          output,
          "gene-iobio-flagged-variants." + self.exportFormat );
        self.readyToDownload = true;
      })
    },
    clearFileInputs: function() {

      this.clearFileInput($("#input-csv-file")[0]);
      this.clearFileInput($("input-txt-file")[0]);
    },
    clearFileInput: function(ctrl) {
      try {
        ctrl.value = null;
      } catch(ex) { }
    },
    populateGeneLists: function() {
      let self = this;
      self.geneLists = [];
      self.variantCount = 0;

      var filters = self.cohortModel.organizeVariantsByFilterAndGene(self.activeFilterName, self.isFullAnalysis, self.interpretationFilters);
      self.geneLists = filters.map(function(filterObject, idx) {
        self.variantCount += filterObject.variantCount;
        return {
          name:  filterObject.key,
          label: filterObject.filter.title,
          show:  filterObject.genes.length > 0,
          genes: filterObject.genes,
          variantCount: filterObject.variantCount,
          expand: self.isFullAnalysis ? (filterObject.key == 'pathogenic' || idx == 0 ?  true : false) : true
        }
      })
      self.$emit("count-changed", self.variantCount);
    },
    onApplyVariantNotes: function(variant) {
      this.$emit("apply-variant-notes", variant);
    },
    onApplyVariantInterpretation: function(variant) {
      this.$emit("apply-variant-interpretation", variant);
    },


    coord: function(flaggedGene, variant) {
      return this.globalApp.utility.stripRefName(flaggedGene.gene.chr) + ":" + variant.start + " " + variant.ref + ">" + variant.alt;
    },

    clinvar: function(variant) {
      if (variant.isProxy) {
        if (variant.clinvarClinSig == "pathogenic") {
          return "clinvar_path";
        } else if (variant.clinvarClinSig == "likely pathogenic") {
          return "clinvar_lpath";
        } else {
          return "";
        }
      } else {
        return variant.clinvar ? variant.clinvar : "";
      }
    },
    rsId: function(variant) {
      if (variant.isProxy) {
        return variant.rsId;
      } else {
        return this.globalApp.utility.getRsId(variant);
      }
    },
    revel: function(variant) {
      if (variant.isProxy) {
        return variant.REVEL && variant.REVEL.length > 0 ?  "REVEL " + variant.REVEL : "";
      } else {
        if (variant.vepREVEL && Object.keys(variant.vepREVEL).join(",").length > 0) {
          return "REVEL " + Object.keys(variant.vepREVEL).join(",");
        } else {
          return "";
        }
      }
    },
    hgvsP: function(variant) {
      if (variant.isProxy) {
        return this.globalApp.utility.formatHgvsP(variant, variant.HGVSp);
      } else {
        return variant.extraAnnot ? this.globalApp.utility.formatHgvsP(variant, variant.vepHGVSp) : "";
      }
    },
    hgvsC: function(variant) {
      if (variant.isProxy) {
        return this.globalApp.utility.formatHgvsC(variant, variant.HGVSc, false);
      } else {
        return variant.extraAnnot ? this.globalApp.utility.formatHgvsC(variant, variant.vepHGVSc, false) : "";
      }
    },
    vepConsequence: function(variant) {
      if (variant.isProxy) {
        return variant.consequence;
      } else {
        return variant.vepConsequence ? Object.keys(variant.vepConsequence).join(" ").split("_").join(" ") : "";
      }
    },
    highestImpactClass: function(variant) {
      let clazz = "filter-symbol";
      if (variant.isProxy) {
        clazz += " impact_" + (variant.impact && variant.impact.length > 0 ? variant.impact.toUpperCase() : 'none');
      } else {
        if (variant.highestImpactVep) {
          for (var impact in variant.highestImpactVep) {
            if (clazz.length > 0) {
              clazz += " ";
            }
            clazz += "impact_" + impact.toUpperCase();
          }
        }
      }
      return clazz;
    },
    highestImpactRecs: function(variant) {
      let self = this;
      let info = {};
      this.globalApp.utility.formatHighestImpactInfo(variant, info, self.cohortModel.translator);
      return info.vepHighestImpactRecs;
    },
    getNonCanonicalImpactDisplay: function(idx, impactRec) {
      let buf = "";
      if (idx > 0) {
        buf += " | ";
      }
      buf += impactRec.impact.toLowerCase() + ' impact - ';
      return buf;
    },
    getNonCanonicalEffectDisplay: function(idx, effectRec) {
      let buf = "";
      if (idx > 0) {
        buf += " ,";
      }
      buf += effectRec.display + " in non-canonical transcripts ";
      return buf;
    },
    afDisplay: function(variant) {
      var label = this.isBasicMode ? "freq " : "af ";
      if (variant.isProxy) {
        return  label +  this.globalApp.utility.percentage(variant.afgnomAD ? variant.afgnomAD : 0);
      } else {
        return  label +  this.globalApp.utility.percentage(variant.afHighest ? variant.afHighest : 0);
      }
    },
    zygosity: function(variant) {
      if (variant.isProxy) {
        return variant.zygosityProband ? variant.zygosityProband.toUpperCase() : (variant.zygosity ? variant.zygosity.toUpperCase() : "");
      } else {
        return variant.zygosity ? variant.zygosity.toUpperCase() : "";
      }
    },
    getAfClass: function(variant) {
      let af = null;
      if (variant.isProxy) {
        af = variant.afgnomAD ? variant.afgnomAD : 0;
      } else {
        af = variant.afHighest ? variant.afHighest : 0;
      }

      if (af <= .01) {
        return 'af-small level-high';
      } else if (af <= .05) {
        return 'af-small level-medium';
      } else {
        return '';
      }
    },
    geneRankGTR: function(geneName) {
      let rankInfo = this.cohortModel.geneModel.getGeneRank(geneName);
      let buf = "";
      if (rankInfo) {
        if (rankInfo.gtrRank) {
          buf += "#" + rankInfo.gtrRank;
        }
      }
      return buf;
    },
    geneRankPhenolyzer: function(geneName) {
      let rankInfo = this.cohortModel.geneModel.getGeneRank(geneName);
      let buf = "";
      if (rankInfo) {
        if (rankInfo.phenolyzerRank) {
          buf += "#" + rankInfo.phenolyzerRank;
        }
      }
      return buf;
    },

  },
  mounted: function() {

  },
  computed: {

  },
  watch: {
    geneNames: function(newGeneNames, oldGeneNames) {
      this.populateGeneLists();
    },
    isFullAnalysis: function() {
      this.populateGeneLists();
    }
  }
}

</script>