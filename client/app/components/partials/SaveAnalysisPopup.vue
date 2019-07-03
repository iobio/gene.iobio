<style lang="sass" >
@import ../../../assets/sass/variables

.save-analysis-dialog
  position: fixed
  right: 150px
  bottom: 0
  z-index: 999


.save-analysis-content
  padding: 15px 15px 15px 15px

  textarea
    font-size: 13px !important
  input
    font-size: 13px !important

  .close-button
    margin: 0px !important
    padding: 0px !important
    min-width: 20px !important
    height: 20px !important
    margin-bottom: 15px !important

    .btn__content
      padding: 0px
      max-width: 20px
      max-height: 20px

      i.material-icons
        font-size: 20px
        color: $text-color

  .layout
    padding-left: 15px
    padding-right: 15px

  .info-title
    font-size: 14px
    color: $app-color
    margin-bottom: 15px



</style>



<template>

    <v-dialog  content-class="save-analysis-dialog" width="400" persistent v-model="showPopup" >

      <v-card v-if="analysis" class="save-analysis-content full-width">
        <v-card-title style="justify-content:space-between">
          <span class="info-title"> {{ analysis.id ? 'Name and description of this analysis' : 'Add this analysis to Mosaic' }}</span>
          <v-btn  @click="onClose" flat class="close-button">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
          <v-layout row wrap>


              <v-flex xs12>
                <v-text-field :hide-details="true" v-model="analysisName" label="Name" type="text">
                </v-text-field>
              </v-flex>

              <v-flex class="mt-2" xs12>
                <v-text-field
                  multi-line
                  rows="3"
                  :hide-details="true"
                  label="Description"
                  v-model="analysisDescription"
                >
                </v-text-field>
              </v-flex>


              <v-flex class="text-xs-right mt-4" xs12>
                <v-btn class="primary" @click="onSave">{{ analysis.id ? 'Apply' : 'Save' }}</v-btn>
                <v-btn @click="onClose">Cancel</v-btn>
              </v-flex>

          </v-layout>
        <v-card-text>
        </v-card-text>
      </v-card>
    </v-dialog>

</template>

<script>

export default {
    name: 'save-analysis-popup',
    props: {
      analysis: null,
      showIt: false
    },
    data() {
      return {
        showPopup: false,
        analysisName: null,
        analysisDescription: null
      }
    },
    watch: {
      showIt: function() {
        if (this.showIt) {
          this.analysisName = this.analysis.title;
          this.analysisDescription = this.analysis.description;
          this.showPopup = true;
        }
      },
      showPopup: function() {
        if (this.showPopup) {
          this.analysisName = this.analysis.title;
          this.analysisDescription = this.analysis.description;
        }
      }
    },
    created() {
    },
    mounted() {
    },
    methods: {
      onSave: function() {
        this.analysis.title = this.analysisName;
        this.analysis.description = this.analysisDescription;
        this.$emit("on-save-analysis", this.analysis)
        this.showPopup = false;
      },
      onClose: function() {
        this.$emit("on-cancel-analysis")
        this.showPopup = false;
      }
    }
}

</script>