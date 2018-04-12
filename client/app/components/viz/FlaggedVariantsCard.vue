<style lang="sass">
@import ../../../assets/sass/variables

#flagged-variants-card

  .toolbar
    width: calc(100% - 1px)
    padding-right: 20px

    .toolbar__title
      font-family: inherit
      font-size: 15px
      min-width: initial
      padding-right: 30px

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



    <div class="filtered-variants-panel">
      <v-subheader inset>
        <span v-if="!isBasicMode">
          Variants passing filters
        </span>
        <span v-if="isBasicMode">
          Variants in clinvar with &lt; 1% population frequency
        </span>
      </v-subheader>
      <v-divider style="margin-top:0px;margin-bottom:0px">
      </v-divider>

      <flagged-gene
      v-for="filteredGene in filteredGenes"
      :key="filteredGene.gene_name"
      :flaggedGene="filteredGene"
      :isEduMode="isEduMode"
      :isBasicMode="isBasicMode"
      @flagged-variant-selected="onVariantSelected"
      >
      </flagged-gene>


    </div>

    <div
    v-if="!isBasicMode && userFlaggedGenes.length > 0"
    class="user-flagged-variants-panel">

      <v-subheader inset>
        Variants flagged by user
      </v-subheader>
      <v-divider style="margin-top:0px;margin-bottom:0px">
      </v-divider>


      <flagged-gene
      v-for="flaggedGene in userFlaggedGenes"
      :key="flaggedGene.gene_name"
      :flaggedGene="flaggedGene"
      :isEduMode="isEduMode"
      :isBasicMode="isBasicMode"
      @flagged-variant-selected="onVariantSelected"
      >
      </flagged-gene>


    </div>

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
              <div v-if="fileType == 'gene'">
                <input type="text" readonly=""   placeholder="choose .csv file..." >
                <input type="file" id="input-csv-file"  @change="onFileSelected"  accept=".csv">
              </div>

              <div v-if="fileType != 'gene'">
                <input type="text" readonly=""    placeholder="choose txt file..." >
                <input type="file" id="input-txt-file"class="btn btn-raised"  @change="onFileSelected"  accept=".txt, .tsv">
              </div>
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

import FlaggedGene from '../partials/FlaggedGene.vue'

export default {
  name: 'flagged-variants-card',
  components: {
    FlaggedGene
  },
  props: {
    isEduMode: null,
    isBasicMode: null,
    flaggedVariants: null,
    cohortModel: null
  },
  data () {
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
    }
  },
  mounted: function() {

  },
  computed: {
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