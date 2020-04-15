<style lang="sass">
@import ../../../assets/sass/variables



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


</style>

<template>
  <v-dialog v-model="showOpenDialog" max-width="400" >

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
        <v-btn raised class="variant-file-button" @click="onClose">Close</v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>
</template>


<script>


import FileChooser from '../partials/FileChooser.vue'


export default {
  name: 'import-variants',
  components: {
    FileChooser
  },
  props: {
    showDialog: null,
    cohortModel: null
  },
  data() {
    return {
      showOpenDialog: false,
      fileType: 'gene',
      importInProgress: false,
    }
  },
  methods: {
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
    clearFileInputs: function() {

      this.clearFileInput($("#input-csv-file")[0]);
      this.clearFileInput($("input-txt-file")[0]);
    },
    clearFileInput: function(ctrl) {
      try {
        ctrl.value = null;
      } catch(ex) { }
    },
    onClose: function() {
      this.showOpenDialog = false;
      this.$emit("close-import-variants");
    }

  },
  mounted: function() {

  },
  computed: {

  },
  watch: {
    showDialog: function() {
      this.showOpenDialog = this.showDialog;
    }
  }
}

</script>