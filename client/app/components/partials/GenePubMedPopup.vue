<style lang="sass" >
@import ../../../assets/sass/variables

#show-all-pubmed-button
  margin: 0px
  margin-top: -1px
  margin-left: 10px
  height: 20px
  .v-btn__content
    color: $link-color
    font-size: 13px
    font-weight: 500

.pubmed-popup
  padding-top: 10px
  #pubmed-table
    .v-input.v-text-field
      max-width: 370px !important
      min-width: 370px !important
    .pubmed-rows
      max-height: 500px !important
      min-height: 500px !important
      overflow-y: scroll !important
      margin-top: 10px !important
      font-size: 13px !important
    .v-text-field.v-input
      margin-top: -10px !important
    .pubmed-row 
      .pubmed-title
        min-width: 630px !important
        max-width: 630px !important
      .pubmed-pub-author
        min-width: 80px !important
        max-width: 80px !important
      .pubmed-pub-source
        min-width: 100px !important
        max-width: 100px !important
      .pubmed-pub-date
        min-width: 80px !important
        max-width: 80px !important

</style>
<template>

    <v-dialog  width="970"  v-model="showPubMedDialog" lazy >
      <v-card class="pubmed-popup full-width">
        <v-card-title v-if="selectedGene" style="justify-content:space-between">
          <span class="info-title">{{ selectedGene.gene_name }} PubMed Entries
          </span>
          <v-btn  @click="onClose" flat class="close-button">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>

        <div>
          <gene-pubmed-table ref="pubMedTableRef"
           v-if="selectedGene && geneModel"
           :selectedGene="selectedGene" 
           :geneModel="geneModel"
           :showDetailsButton="false"
           :showAll="true"
           :showAuthor="true"
           :showSource="true"
           :showFullDate="true">
          </gene-pubmed-table>
        </div>


      </v-card>
    </v-dialog>

</template>

<script>
import GenePubMedTable      from '../partials/GenePubMedTable.vue'
export default {
    name: 'gene-pubmed-popup',
    components: {     
      'gene-pubmed-table': GenePubMedTable
    },
    props: {
      geneModel: null,
      selectedGene: null,
      showDialog: null
    },
    data() {
      return {
        showPubMedDialog: false
      }
    },
    methods: {

      onClose: function() {
        this.$emit("hide-pubmed-dialog")
      }
    },
    watch: {
      showDialog: function() {
        this.showPubMedDialog = this.showDialog;
        if (this.showPubMedDialog) {
          if (this.$refs.pubMedTableRef) {
            this.$refs.pubMedTableRef.getPubMedEntries();
          }
        }
      },

    }
}

</script>
