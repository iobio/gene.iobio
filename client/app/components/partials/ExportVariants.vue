<style lang="sass">
@import ../../../assets/sass/variables



.variant-file-body
  padding-top: 0
  padding-bottom: 18px
  margin-bottom: 20px
  margin-top: 20px

  .v-input--radio-group__input
    label
      margin-bottom: 0

  .radio-group.radio-group--column
    margin-top: 0
    padding-top: 0
    padding-bottom: 0

    >.input-group__input
      margin-top: 0

  .input-group--select
    .input-group__selections__comma
      font-size: 14px
      padding: 0 0 0 0

  .input-group, .v-input--radio-group
    label
      font-size: 14px
      line-height: 20px
      height: 20px

  .input-group__input
    min-height: 0
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
        height: 0

.variant-file-button
  color: $text-color !important
  height: 28px
  margin-top: 10px
  margin-bottom: 10px
  margin-left: 0
  padding: 0


  i.material-icons
    font-size: 16px
    padding-right: 4px


</style>

<template>

  <v-dialog v-model="showSaveDialog" max-width="400" >

    <v-card class="full-width">
      <v-card-title class="headline">
       Export flagged variants
      </v-card-title>
      <v-card-text class="variant-file-body">
        Export all variants in the left panel
        <div id="save-format" >
          <v-radio-group hide-details v-model="exportFormat" >
                <v-radio label="Comma separated" value="csv"></v-radio>
                <v-radio label="VCF" value="vcf"></v-radio>
          </v-radio-group>

        </div>
        <div style="text-align:center;margin-top:10px"
          v-if="exportInProgress" >
            <img style="width:22px;height:22px"
                 class="loader  glyph" src="../../../assets/images/wheel.gif" alt="Loading Wheel"/>
            Saving variants to file...
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            v-show="!exportInProgress"
          class="variant-file-button" raised @click="onSaveFile">
          <v-icon>save</v-icon>
          Save
        </v-btn>
        <a id="download-file"
        v-show="false"
        download="gene-iobio-variants.csv" href="#">
          <i class="material-icons" style="padding-right:0;font-size:20px">file_download</i>
          <span style="padding-right:8px">Download file</span>
        </a>
        <v-btn class="variant-file-button" raised @click="onClose">Close</v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>


</template>


<script>


import FileChooser from '../partials/FileChooser.vue'


export default {
  name: 'export-variants',
  components: {
    FileChooser
  },
  props: {
    showDialog: null,
    cohortModel: null
  },
  data() {
    return {
      showSaveDialog: false,
      exportFormat: 'csv',
      fileType: 'gene',
      exportInProgress: false,
      readyToDownload: false
    }
  },
  methods: {
    onClickSave: function() {
      let self = this;
      self.showSaveDialog = true;
      this.$emit("close-export-variants");
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
        document.getElementById('download-file').click();
        self.onClose()
      })
    },
    onClose: function() {
      this.showSaveDialog = false;
      this.readyToDownload = false;
      this.$emit("close-export-variants");
    }

  },
  mounted: function() {

  },
  computed: {

  },
  watch: {
    showDialog: function() {
      this.showSaveDialog = this.showDialog;
    }
  }
}

</script>
