<style lang="sass">
@import ../../../assets/sass/variables

#flagged-variants-card
  margin: 10px

  .flagged-variants-panel
    margin-top: 10px

  button
    color: $text-color
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

  #edit-bookmarks
    color: $text-color
  #done-edit-bookmarks
    color: $text-color

.bookmark-dialog-body
  .card__text
    padding-top: 0px
    padding-bottom: 20px

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

.bookmark-button
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
    Variants


    <div>
      <v-btn raised @click="showOpenDialog = true">
        <v-icon>open_in_browser</v-icon>
        Open
      </v-btn>

      <v-btn v-if="flaggedGenes && flaggedGenes.length > 0" raised
        @click="showSaveDialog = true">
        <v-icon>save</v-icon>
        Save
      </v-btn>
    </div>


    <div class="flagged-variants-panel">

      <flagged-gene
      v-for="flaggedGene in flaggedGenes"
      :key="flaggedGene.gene_name"
      :flaggedGene="flaggedGene"
      @flagged-variant-selected="onVariantSelected"
      >
      </flagged-gene>

    </div>

    <v-dialog v-model="showOpenDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Open bookmarks file</v-card-title>
        <v-card-text class="bookmark-dialog-body">
          <div id="bookmark-file" >
            <v-radio-group hide-details v-model="bookmarkFileType" >
                  <v-radio label="gene.iobio (comma separated)" value="gene"></v-radio>
                  <v-radio label="gemini (tab delimited)" value="gemini"></v-radio>
                  <v-radio label="Tab delimited" value="tsv"></v-radio>
            </v-radio-group>

            <div v-if="bookmarkFileType == 'gene'">
              <input type="text" readonly=""   placeholder="choose .csv file..." >
              <input type="file"  @change="onFileSelected"  accept=".csv">
            </div>

            <div v-if="bookmarkFileType != 'gene'">
              <input type="text" readonly=""    placeholder="choose txt file..." >
              <input type="file"  @change="onFileSelected"  accept=".txt, .tsv">
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn raised class="bookmark-button" @click.native="showOpenDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="showSaveDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Save bookmarks file</v-card-title>
        <v-card-text class="bookmark-dialog-body">
          <div id="bookmark-save" >
            <v-radio-group hide-details v-model="exportFormat" >
                  <v-radio label="Comma separated" value="csv"></v-radio>
                  <v-radio label="VCF" value="vcf"></v-radio>
            </v-radio-group>

          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="!readyToDownload"
            class="bookmark-button" raised @click="onSaveFile">
            <v-icon>save</v-icon>
            Save
          </v-btn>
          <a id="download-bookmarks"
          v-bind:class="(!readyToDownload ? 'hide' : '') + ' btn bookmark-button'"
          download="gene-iobio-variants.csv" href="#">
            <i class="material-icons" style="font-size:20px">file_download</i>
            <span>Download file</span>
          </a>
          <v-btn class="bookmark-button" raised @click="showSaveDialog = false;readyToDownload = false;">Close</v-btn>
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
    flaggedVariants: null,
    cohortModel: null
  },
  data () {
    return {
      showOpenDialog: false,
      showSaveDialog: false,
      exportFormat: 'csv',
      bookmarkFileType: 'gene',
      readyToDownload: false
    }
  },
  methods: {
    onVariantSelected: function(variant) {
      this.$emit("flagged-variant-selected", variant);
    },
    onFileSelected: function(fileSelection) {
      let self = this;
      self.cohortModel.onFlaggedVariantsFileSelected(fileSelection, self.bookmarkFileType,
      function() {
        self.$emit("flagged-variants-imported");
        self.showOpenDialog = false;

      });
    },
    onSaveFile: function() {
      let self = this;
      this.cohortModel.promiseExportFlaggedVariants(self.exportFormat)
      .then(function(output) {
        utility.createDownloadLink("#download-bookmarks",
          output,
          "gene-iobio-flagged-variants." + self.exportFormat );
        self.readyToDownload = true;
      })
    }
  },
  mounted: function() {

  },
  computed: {
    flaggedGenes: function() {
      let self = this;
      if (this.flaggedVariants) {
        let genes = {};
        this.flaggedVariants.forEach(function(variant) {
          let flaggedGene = genes[variant.gene.gene_name];
          if (flaggedGene == null) {
            flaggedGene = {};
            flaggedGene.gene = variant.gene;
            flaggedGene.transcript = variant.transcript;
            flaggedGene.variants = [];
            genes[variant.gene.gene_name] = flaggedGene;
          }
          flaggedGene.variants.push(variant);
        })
        let geneNames = Object.keys(genes);
        geneNames = geneNames.sort(function(a,b) {
          return self.cohortModel.geneModel.compareDangerSummary(a,b);
        })
        let theFlaggedGenes = geneNames.map(function(geneName) {
          return genes[geneName];
        })
        let i = 0;
        theFlaggedGenes.forEach(function(flaggedGene) {
          flaggedGene.variants.forEach(function(variant) {
            variant.index = i;
            i++;
          })
        })
        return theFlaggedGenes;
      } else {
        return [];
      }

    }
  },
  watch: {
  }
}

</script>