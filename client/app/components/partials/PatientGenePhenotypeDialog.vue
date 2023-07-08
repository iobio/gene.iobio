<style lang="sass">
@import ../../../assets/sass/variables



#patient-gene-phenotype-container
  #patient-gene-phenotype-dialog-divider
    margin-top: 10px !important
    margin-bottom: 5px !important

  #gene-name-chip
    background-color: $button-color
    color: white
    font-weight: 600
    margin-left: 8px
    border-radius: 10px
    font-size: 15px

  .close-button
    right: 10px !important
    top: 15px !important
    position: absolute !important
    min-width: 40px !important

    
</style>

<template>
    <v-dialog
    width="550" persistent
    :close-on-content-click="false"
    v-model="showPatientGenePhenotypeDialog"
    >

      <v-card class="full-width" id="patient-gene-phenotype-container">
        <div class="container" >
          <v-btn flat @click="onCancel" class="close-button">
            <v-icon>close</v-icon>
          </v-btn>
          <v-card-title class="headline" style="padding-top: 10px;">
              <span style="padding-left:3px">
                Phenotypes Associations
              </span>
          </v-card-title>
        </div>
        <v-divider id="patient-gene-phenotype-dialog-divider"></v-divider>
        <v-card-text style="padding-bottom: 0px;margin-top:-10px">
          <div class="container">

            <div class="row">
              <div class="col-md-12">
                <patient-phenotype-table 
                 v-if="launchedFromHub"
                 titleText="Patient Phenotypes"
                 :cohortModel="cohortModel"
                 :selectedGene="selectedGene">
                </patient-phenotype-table>
              </div>
            </div>
            <div class="row mt-3" v-if="selectedGene">
              <div class="col-md-12">
                <gene-phenotype-table 
                 :selectedGene="selectedGene"
                 :geneModel="cohortModel.geneModel"
                 :cohortModel="cohortModel"
                 :highlightMatches="false"
                 :showDetailsButton="false"
                 :showTitle="true"
                 :titleText="selectedGene.gene_name + ` Phenotype Associations`">
                </gene-phenotype-table>
              </div>
            </div>            
            <div class="row mt-3"  v-if="selectedGene">
              <div class="col-md-12">
                <gene-disease-table 
                 :selectedGene="selectedGene"
                 :geneModel="cohortModel.geneModel"
                 :titleText="selectedGene.gene_name + ` Disease Associations`">
                </gene-disease-table>
              </div>
            </div>            
          </div>
        </v-card-text>

      </v-card>
    </v-dialog>
</template>

<script>
import PatientPhenotypeTable  from '../partials/PatientPhenotypeTable.vue'
import GenePhenotypeTable     from '../partials/GenePhenotypeTable.vue'
import GeneDiseaseTable  from '../partials/GeneDiseaseTable.vue'

export default {
  name: 'patient-gene-phenotype-dialog',
  components: {
    'patient-phenotype-table': PatientPhenotypeTable,
    'gene-phenotype-table': GenePhenotypeTable,
    'gene-disease-table': GeneDiseaseTable
  },
  props: {
    cohortModel: null,
    showDialog: null,
    selectedGene: null
  },
  data () {
    return {
      showPatientGenePhenotypeDialog: false,
    }
  },
  methods: {
    onCancel: function() {
      this.$emit("hide-patient-gene-phenotype-dialog")
      this.showPatientGenePhenotypeDialog = false;
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
      this.showPatientGenePhenotypeDialog = this.showDialog
    }, 

  }
}
</script>