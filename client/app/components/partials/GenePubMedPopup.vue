<style lang="sass" >
@import ../../../assets/sass/variables

#show-all-pubmed-button
  margin: 0px
  height: 20px
  .v-btn__content
    color: $link-color
    font-size: 13px

.pubmed-popup
  padding-top: 10px
  #pubmed-table
    .v-input.v-text-field
      max-width: 370px
      min-width: 370px
    .pubmed-rows
      max-height: 500px
      min-height: 500px
      overflow-y: scroll
      margin-top: 10px
    .v-text-field.v-input
      margin-top: -10px



</style>
<template>

    <v-dialog  style="margin-left: -230px;" width="700"  v-model="showPopup" lazy >
      <v-btn id="show-all-pubmed-button" flat  slot="activator">
        show all
      </v-btn>
      <v-card class="pubmed-popup full-width">
        <v-card-title v-if="selectedGene" style="justify-content:space-between">
          <span class="info-title">{{ selectedGene.gene_name }} Publications
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
           :showAll="true"
           :showAuthor="true"
           :showSource="true">
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
      selectedGene: null
    },
    data() {
      return {
        showPopup: false
      }
    },
    methods: {

      onClose: function() {
        this.showPopup = false;
      }
    },
    watch: {
      showPopup: function() {
        if (this.showPopup) {
          if (this.$refs.pubMedTableRef) {
            this.$refs.pubMedTableRef.getPubMedEntries();
          }
        }
      },

    }
}

</script>
