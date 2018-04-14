<style lang="sass">
@import ../../../assets/sass/variables

#flagged-variants-card

  .toolbar
    width: calc(100% - 1px)
    padding-right: 20px

    .toolbar__title
      font-family: inherit
      font-size: 14px
      min-width: initial
      padding-right: 30px
      PADDING-top: 2px
      font-weight: 600

    .toolbar-button
      background-color: #ffffff1f
      min-width: 70px
      color: white
      margin-right: 5px
      margin-left: 0px
      font-size: 13px

      .btn__content
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




  .subheader
    color: $text-color
    height: initial

    span
      width: 100%
      text-align: center

  .list--three-line
    padding-top: 5px
    .subheader
      height: initial
      font-size: 13px
      margin-left: -5px
      text-color: $text-color
      margin-top: 5px

    hr
      margin-bottom: 4px
      margin-top: 4px

    .divider--inset
      margin-left: 22px
      width: calc(100% - 42px)

    .list__tile
      padding: 0px
      height: initial
      padding-left: 3px
      padding-top: 10px

    .list__tile__avatar
      min-width: initial

    .list__tile__sub-title
      height: initial
      line-height: 18px

    .list__tile__title
      height: 22px
      line-height: 22px

    .variant-number
      margin-right: 4px
      margin-left: 0px
      font-size: 11px
      display: inline-block
      vertical-align: top
      margin-bottom: 0px
      margin-top: -2px
      color: white !important
      background: $default-badge-color !important

      .chip__content
        width: 17px
        height: 17px
        justify-content: space-around
        padding: 0px

    .variant-label
      font-size: 12px
      color: $text-color !important


      .coord
        display: inline-block
        width: 105px
        line-height: 12px
        vertical-align: top
      .hgvs
        display: inline-block
        width: 105px
        line-height: 12px
        vertical-align: top
      .vep-consequence
        display: inline-block
        width: 105px
        line-height: 12px
        vertical-align: top
      .rsid
        display: inline-block
        width: 105px
        line-height: 12px
        vertical-align: top

      .af
        display: inline-block
        width: 60px
        vertical-align: top
        line-height: 12px
    .variant-symbols
      .has-called-variants
        font-size: 15px
        color: $called-variant-color
        margin-top: -3px
        margin-left: 2px



.variant-file-body
  padding-top: 0px
  padding-bottom: 18px
  margin-bottom: 20px

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
    height: 20px
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
  width: 140px

  i.material-icons
    font-size: 16px
    padding-right: 4px




</style>

<template>
  <div id="flagged-variants-card">
    <v-toolbar color="light-blue" dark >
      <v-toolbar-title >
        Variants
      </v-toolbar-title>
      <v-btn  v-if="!isBasicMode" flat
        class="toolbar-button"
        @click="importInProgress = false;clearFileInputs();showOpenDialog = true">
        <v-icon>open_in_browser</v-icon>
        Open
      </v-btn>

      <v-btn v-if="!isBasicMode && flaggedVariants && flaggedVariants.length > 0" flat
        class="toolbar-button"
        @click="showSaveDialog = true">
        <v-icon>save</v-icon>
        Save
      </v-btn>
    </v-toolbar>


    <template v-for="geneList in geneLists">
      <v-subheader
      :key="geneList.label"
      v-if="geneList.show"
      :style="geneList.style"
      >
        <span>{{ geneList.label }}</span>
      </v-subheader>
      <v-list three-line>
        <template
         v-for="flaggedGene in geneList.genes">

          <v-subheader :key="flaggedGene.gene.gene_name">{{ flaggedGene.gene.gene_name }}</v-subheader>

          <template v-for="(variant, index) in flaggedGene.variants">

            <v-list-tile
            :key="variant.start + ' ' + variant.ref + ' ' + variant.alt"
            avatar
            ripple
            @click="onVariantSelected(variant)">


              <v-list-tile-avatar>
               <v-chip class="variant-number">
                {{ variant.index + 1 }}.
               </v-chip>
              </v-list-tile-avatar>

              <v-list-tile-content>

                <v-list-tile-title>

                  <div class="variant-symbols">


                    <svg
                     v-if="clinvar(variant) == 'clinvar_path'"
                     class="clinvar-badge" height="15" width="15">
                      <g transform="translate(0,2)">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#clinvar-symbol" width="12" height="12" style="pointer-events: none; fill: rgb(173, 73, 74);"></use>
                      </g>
                    </svg>

                    <svg
                     v-if="clinvar(variant) == 'clinvar_lpath'"
                     class="clinvar-badge" height="15" width="15">
                      <g transform="translate(0,2)">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#clinvar-symbol" width="12" height="12" style="pointer-events: none; fill: rgb(251, 119, 55);"></use>
                      </g>
                    </svg>

                    <svg
                     v-if="variant.inheritance && variant.inheritance == 'autosomal dominant'"
                     class="inheritance-badge" height="15" width="15">
                      <g transform="translate(0,0)">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#autosomal-dominant-symbol" width="16" height="16" style="pointer-events: none;"></use>
                      </g>
                    </svg>
                    <svg
                     v-if="variant.inheritance && variant.inheritance == 'recessive'"
                     class="inheritance-badge" height="15" width="15">
                      <g transform="translate(0,0)">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#recessive-symbol" width="16" height="16" style="pointer-events: none;"></use>
                      </g>
                    </svg>
                    <svg
                     v-if="variant.inheritance && variant.inheritance == 'denovo'"
                     class="inheritance-badge" height="15" width="15">
                      <g transform="translate(0,0)">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#denovo-symbol" width="16" height="16" style="pointer-events: none;"></use>
                      </g>
                    </svg>
                    <svg
                     v-if="variant.inheritance && variant.inheritance == 'x-linked'"
                     class="inheritance-badge" height="15" width="15">
                      <g transform="translate(0,0)">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#x-linked-symbol" width="16" height="16" style="pointer-events: none;"></use>
                      </g>
                    </svg>
                    <svg
                     v-if="variant.inheritance && variant.inheritance == 'compound het'"
                     class="inheritance-badge" height="15" width="15">
                      <g transform="translate(0,0)">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#compound-het-symbol" width="16" height="16" style="pointer-events: none;"></use>
                      </g>
                    </svg>

                    <svg
                     v-if="variant.type.toLowerCase() == 'snp' || variant.type.toLowerCase() == 'mnp'"
                     class="impact-badge" height="15" width="13">
                      <g transform="translate(1,6)">
                        <rect width="8" height="8"
                        v-bind:class="highestImpactClass(variant)"
                        style="pointer-events: none;"></rect>
                      </g>
                    </svg>

                    <svg
                     v-if="variant.type.toLowerCase() == 'del'"
                     class="impact-badge" height="15" width="13">
                      <g transform="translate(5,10)">
                        <path d="M0,-4.161791450287817L4.805622828269509,4.161791450287817 -4.805622828269509,4.161791450287817Z"
                        v-bind:class="highestImpactClass(variant)">
                        </path>
                      </g>
                    </svg>

                    <svg
                     v-if="variant.type.toLowerCase() == 'ins'"
                     class="impact-badge" height="15" width="13">
                      <g transform="translate(5,10)">
                        <path d="M0,3.5682482323055424A3.5682482323055424,3.5682482323055424 0 1,1 0,-3.5682482323055424A3.5682482323055424,3.5682482323055424 0 1,1 0,3.5682482323055424Z"
                        v-bind:class="highestImpactClass(variant)">
                        </path>
                      </g>
                    </svg>

                    <svg
                     v-if="variant.type.toLowerCase() == 'complex'"
                     class="impact-badge" height="15" width="13">
                      <g transform="translate(5,9)">
                        <path d="M0,-5.885661912765424L3.398088489694245,0 0,5.885661912765424 -3.398088489694245,0Z"
                        v-bind:class="highestImpactClass(variant)">
                        </path>
                      </g>
                    </svg>

                    <svg v-if="zygosity(variant).toUpperCase() == 'HOM'" width="24" height="14">
                      <g transform="translate(0,4)">
                        <rect width="24" height="10" class="zyg_hom" style="pointer-events: none;">
                        </rect>
                        <text x="1" y="8" style="fill: white; font-weight: bold; font-size: 9px;">
                        Hom
                        </text>
                      </g>
                    </svg>
                    <svg v-if="zygosity(variant).toUpperCase() == 'HET'" width="24" height="14">
                      <g transform="translate(0,4)">
                        <rect width="24" height="10" class="zyg_het" style="pointer-events: none;">
                        </rect>
                        <text x="2" y="8" style="fill: white; font-weight: bold; font-size: 9px;">
                        Het
                        </text>
                      </g>
                    </svg>

                    <v-icon v-if="variant.fbCalled == 'Y'" class="has-called-variants">
                      check_circle
                    </v-icon>

                  </div>
                </v-list-tile-title>

                <v-list-tile-sub-title >
                  <div class="variant-label">
                    <div style="display:inline-block;" >
                      <span class="coord"> {{ variant.start + " " + variant.ref + "->" + variant.alt }} </span>
                    </div>
                    <div style="display:inline-block;vertical-align:top">
                      <span class="vep-consequence">{{ vepConsequence(variant) }}</span>
                    </div>
                    <span class="af">{{ afDisplay(variant) }}</span>
                  </div>
                  <div class="variant-label">
                    <div style="display:inline-block;" >
                      <span class="hgvs">  {{ hgvsP(variant) }} </span>
                    </div>
                    <div style="display:inline-block;vertical-align:top">
                      <span v-if="!isBasicMode" class="rsid">{{ rsId(variant) }}</span>
                    </div>
                  </div>
                </v-list-tile-sub-title>

              </v-list-tile-content>

            </v-list-tile>
            <v-divider inset  ></v-divider>

          </template>

        </template>
      </v-list>
    </template>


    <v-dialog v-model="showOpenDialog" max-width="400">
      <v-card>
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
    </v-dialog>


    <v-dialog v-model="showSaveDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Save variants file</v-card-title>
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
            <i class="material-icons" style="font-size:20px">file_download</i>
            <span>Download file</span>
          </a>
          <v-btn class="variant-file-button" raised @click="showSaveDialog = false;readyToDownload = false;">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>


<script>

import FileChooser from '../partials/FileChooser.vue'

export default {
  name: 'flagged-variants-card',
  components: {
    FileChooser
  },
  props: {
    isEduMode: null,
    isBasicMode: null,
    flaggedVariants: null,
    cohortModel: null
  },
  data() {
    return {
      showOpenDialog: false,
      showSaveDialog: false,
      exportFormat: 'csv',
      fileType: 'gene',
      readyToDownload: false,
      importInProgress: false,
      exportInProgress: false
    }
  },
  methods: {
    onVariantSelected: function(variant) {
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
    getSortedGeneMap: function(userFlagged) {
      let self = this;
      let geneMap        = {};
      let flaggedGenes   = [];
      this.flaggedVariants.forEach(function(variant) {
        if ((!userFlagged && !variant.isUserFlagged) ||
            (userFlagged && variant.isUserFlagged)) {
          let flaggedGene = geneMap[variant.gene.gene_name];
          if (flaggedGene == null) {
            flaggedGene = {};
            flaggedGene.gene = variant.gene;
            flaggedGene.transcript = variant.transcript;
            flaggedGene.variants = [];
            geneMap[variant.gene.gene_name] = flaggedGene;
            flaggedGenes.push(flaggedGene);
          }
          flaggedGene.variants.push(variant);
        }
      })

      var sortedGenes = flaggedGenes.sort(function(a,b) {
        return self.cohortModel.geneModel.compareDangerSummary(a.gene.gene_name, b.gene.gene_name);
      })
      let i = 0;
      sortedGenes.forEach(function(flaggedGene) {
        flaggedGene.variants.forEach(function(variant) {
          variant.index = i;
          i++;
        })
      });
      return sortedGenes;

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
        return variant.clinvar;
      }
    },
    rsId: function(variant) {
      if (variant.isProxy) {
        return variant.rsId;
      } else {
        return this.globalApp.utility.getRsId(variant);
      }
    },
    hgvsP: function(variant) {
      if (variant.isProxy) {
        return this.globalApp.utility.formatHgvsP(variant, variant.HGVSp);
      } else {
        return variant.extraAnnot ? this.globalApp.utility.formatHgvsP(variant, variant.vepHGVSp) : "";
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
        clazz += " impact_" + variant.impact.toUpperCase();
      } else {
        for (var impact in variant.highestImpactVep) {
          if (clazz.length > 0) {
            clazz += " ";
          }
          clazz += "impact_" + impact.toUpperCase();
        }
      }
      return clazz;
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
        return variant.zygosityProband.toUpperCase();
      } else {
        return variant.zygosity.toUpperCase();
      }
    }
  },
  mounted: function() {

  },
  computed: {
    geneLists: function() {
      let self = this;
      return [
       {
         label: self.isBasicMode ? 'Variants in clinvar with &lt; 1% population frequency' : 'Passing filters',
         show:  true,
         genes: self.filteredGenes,
         style: 'margin-top:10px'
       },
       {
         label: 'Flagged by User',
         show:  self.userFlaggedGenes.length > 0,
         genes: self.userFlaggedGenes,
         style: 'margin-top:30px'
       }
      ]
    },
    filteredGenes: function() {
      let self = this;
      if (this.flaggedVariants) {
        return self.getSortedGeneMap(false);
      } else {
        return [];
      }

    },
    userFlaggedGenes: function() {
      let self = this;
      if (this.flaggedVariants) {
        return self.getSortedGeneMap(true);
      } else {
        return [];
      }

    }
  },
  watch: {
  }
}

</script>