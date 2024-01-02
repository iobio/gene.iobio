<style lang="sass">
@import ../../../assets/sass/variables

#gene-associations-dialog-content
  .chip, .v-chip
    vertical-align: top
    margin-top: 2px
    margin-bottom: 0px
    margin-right: 0px
    &.high_gene_rank
      .chip__content, .v-chip__content
        background-color:  $danger-color !important
        color: white
        padding: 6px
        height: 18px
        width: 40px
        font-size: 12px
        justify-content: center

  .close-button
    right: 10px !important
    top: 15px !important
    position: absolute !important
    min-width: 40px !important

  #gene-associations-dialog-divider
    margin-top: 10px !important
    margin-bottom: 5px !important
    
  .phenotype-search-term
    max-width: 200px
    display: inline-block
    vertical-align: top
    line-height: 14px
    padding-top: 5px  
    overflow-wrap: normal  
  
</style>

<template>
    <v-dialog
    width="1000" persistent
    :close-on-content-click="false"
    v-model="showGeneAssociationDialog"
    >

      <v-card class="full-width" id="gene-associations-dialog-content">
        <div class="container">
          <v-btn flat @click="onCancel" class="close-button">
            <v-icon>close</v-icon>
          </v-btn>
          <v-card-title class="headline" style="padding-top: 10px;">Gene:Phenotype Associations in {{ selectedGene }}</v-card-title>
        </div>
        <v-divider id="gene-associations-dialog-divider"></v-divider>
        <v-card-text style="padding-bottom: 0px">
          <div class="container">
            <div class="row">
              <div class="col-md-4">
                <table class="table">
                  <thead>
                    <tr> <strong>GTR</strong></tr>
                  </thead>
                  <tbody v-if="gtrHits.length">
                    <tr v-for="(term, i) in gtrHits" :key="i">
                      <td>
                        <v-chip class="high_gene_rank mr-1">
                          #{{ term.geneRanks[0].rank}}
                        </v-chip> 
                        <span class="phenotype-search-term">{{ term.searchTerm | to-firstCharacterUppercase }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-if="gtrHits.length<1">
                  <span><i>Not associated with selected GTR conditions...</i></span>
                </div>

              </div>
              <div class="col-md-4">
                <table class="table">
                  <thead>
                    <tr> <strong>Phenolyzer</strong></tr>
                  </thead>
                  <tbody v-if="phenolyzerHits.length">
                    <tr v-for="(term, i) in phenolyzerHits" :key="i">
                      <td>
                        <v-chip class="high_gene_rank mr-1">
                          #{{ term.geneRanks[0].rank}}
                        </v-chip> 
                        <span class="phenotype-search-term">{{ term.searchTerm | to-firstCharacterUppercase }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-if="phenolyzerHits.length<1">
                  <span><i>Not associated with selected phenotypes...</i></span>
                </div>
              </div>
              <div class="col-md-4">
                <table class="table">
                  <thead>
                    <tr> <strong>HPO</strong></tr>
                  </thead>
                  <tbody v-if="hpoHits.length">
                    <tr v-for="(term, i) in hpoHits" :key="i">
                      <td>{{ term.geneRanks[0].hpoPhenotype }} <i> ({{ term.searchTerm | to-firstCharacterUppercase }})</i></td>
                    </tr>
                  </tbody>
                </table>
                <div v-if="hpoHits.length<1">
                  <span><i>Not associated with selected HPO terms...</i></span>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn  @click="onCancel">
            Cancel
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>
</template>

<script>


export default {
  name: 'gene-associations-dialog',
  components: {
  },
  props: {
    sourceNotes: null,
    sourceIndex: null,
    showDialog: null,
    genePhenotypeHits: null,
    selectedGene: null
  },
  data () {
    return {
      showGeneAssociationDialog: true,
      notes: null, 
      gtrHits: [], 
      phenolyzerHits: [], 
      hpoHits: [], 
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    onApply: function() {
      if (this.sourceNotes == '') {
        this.$emit("add-variant-note", this.notes);
      } else {
        this.$emit("edit-variant-note", this.sourceIndex, this.notes)
      }
      this.showGeneAssociationDialog = false;
    },
    onCancel: function() {
      this.showGeneAssociationDialog = false;
      this.$emit("close-gene-association-dialog", this.showGeneAssociationDialog)
    }, 
    arrangeData: function() {
      this.genePhenotypeHits.map(geneHit => {
        if(geneHit.geneRanks[0].source === "GTR"){
          this.gtrHits.push(geneHit)
        }
        else if(geneHit.geneRanks[0].source === "Phenolyzer"){
          this.phenolyzerHits.push(geneHit)
        }
        else if(geneHit.geneRanks[0].source === "HPO"){
          this.hpoHits.push(geneHit)
        }
      })
    }
  },
  created: function() {
  },
  mounted: function() {
    this.arrangeData();
  },
  updated: function() {
  },
  watch: {
    showGeneAssociationDialog: function() {
      let self = this;
      if (self.showGeneAssociationDialog) {
        self.notes = self.sourceNotes;
      }
    },
    sourceNotes: function() {
      this.notes = this.sourceNotes;
    },
    showDialog: function() {
      this.showGeneAssociationDialog = this.showDialog
    }, 

  }
}
</script>
