<style lang="sass">
@import ../../../assets/sass/variables

.close-button
  right: 10px !important
  top: 15px !important
  position: absolute !important
  min-width: 40px !important

#patient-phenotypes-dialog-divider
  margin-top: 10px !important
  margin-bottom: 5px !important

</style>

<template>
    <v-dialog
    width="500" persistent
    :close-on-content-click="false"
    v-model="showPatientPhenotypesDialog"
    >

      <v-card class="full-width">
        <div class="container">
          <v-btn flat @click="onCancel" class="close-button">
            <v-icon>close</v-icon>
          </v-btn>
          <v-card-title class="headline" style="padding-top: 10px;">Patient Phenotypes</v-card-title>
        </div>
        <v-divider id="patient-phenotypes-dialog-divider"></v-divider>
        <v-card-text style="padding-bottom: 0px">
          <div class="container">
            <div class="row">
              <div class="col-md-12">
              <patient-hpo-term-table 
               :cohortModel="cohortModel">
              </patient-hpo-term-table>
              </div>
            </div>
          </div>
        </v-card-text>

      </v-card>
    </v-dialog>
</template>

<script>
import PatientHPOTermTable  from '../partials/PatientHPOTermTable.vue'

export default {
  name: 'patient-phenotypes-dialog',
  components: {
    'patient-hpo-term-table': PatientHPOTermTable
  },
  props: {
    cohortModel: null,
    showDialog: null,
  },
  data () {
    return {
      showPatientPhenotypesDialog: false,
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    onApply: function() {
      this.showPatientPhenotypesDialog = false;
    },
    onCancel: function() {
      this.showPatientPhenotypesDialog = false;
    }, 
    loadData: function() {
    }
  },
  created: function() {
  },
  mounted: function() {
    this.loadData();
  },
  updated: function() {
  },
  watch: {
    showDialog: function() {
      this.showPatientPhenotypesDialog = this.showDialog
    }, 

  }
}
</script>