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
    width="750" persistent
    :close-on-content-click="false"
    v-model="showPatientPhenotypesDialog"
    >

      <v-card class="full-width">
        <div class="container">
          <v-btn flat @click="onCancel" class="close-button">
            <v-icon>close</v-icon>
          </v-btn>
          <v-card-title class="headline" style="padding-top: 10px;">
              <span>Patient Phenotypes</span>
          </v-card-title>
        </div>
        <v-divider id="patient-phenotypes-dialog-divider"></v-divider>
        <v-card-text style="padding-bottom: 0px">
          <div class="container">
            <div class="row">

              <div class="col-md-12">
                <patient-phenotype-table 
                 :cohortModel="cohortModel">
                </patient-phenotype-table>
              </div>
            </div>
        
          </div>
        </v-card-text>

      </v-card>
    </v-dialog>
</template>

<script>
import PatientPhenotypeTable  from '../partials/PatientPhenotypeTable.vue'


export default {
  name: 'patient-phenotype-dialog',
  components: {
    'patient-phenotype-table': PatientPhenotypeTable,
  },
  props: {
    cohortModel: null,
    showDialog: null,
    selectedGene: null
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
    onCancel: function() {
      this.$emit("hide-patient-phenotypes")
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