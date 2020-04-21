<style lang="sass">
@import ../../../assets/sass/variables

</style>

<template>
    <v-dialog
    width="750" persistent
    :close-on-content-click="false"
    v-model="showGeneAssociationDialog"
    >

      <v-card class="full-width">
        <v-card-text>
          <div class="container">
            <div class="row">
              <div class="col-md-4">
                <table class="table">
                  <thead>
                    <tr> <strong>GTR</strong></tr>
                  </thead>
                  <tbody v-if="gtrHits.length">
                    <tr v-for="(term, i) in gtrHits" :key="i">
                      <td><v-chip small>{{ term.geneRanks[0].rank}}</v-chip> {{ term.searchTerm }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="col-md-4">
                <table class="table">
                  <thead>
                    <tr> <strong>Phenolyzer</strong></tr>
                  </thead>
                  <tbody v-if="phenolyzerHits.length">
                    <tr v-for="(term, i) in phenolyzerHits" :key="i">
                      <td><v-chip small>{{ term.geneRanks[0].rank}}</v-chip> {{ term.searchTerm }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="col-md-4">
                <table class="table">
                  <thead>
                    <tr> <strong>HPO</strong></tr>
                  </thead>
                  <tbody v-if="hpoHits.length">
                    <tr v-for="(term, i) in hpoHits" :key="i">
                      <td>{{ term.searchTerm }}</td>
                    </tr>
                  </tbody>
                </table>
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
    genePhenotypeHits: null
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
        console.log("geneHit", geneHit)
        if(geneHit.geneRanks[0].source === "GTR"){
          this.gtrHits.push(geneHit)
        }
        else if(geneHit.geneRanks[0].source === "Phen."){
          this.phenolyzerHits.push(geneHit)
        }
        else if(geneHit.geneRanks[0].source === "HPO"){
          this.hpoHits.push(geneHit)
        }
      })
      console.log("this.hpoHits", this.hpoHits); 
      console.log("this.gtrHits", this.gtrHits); 
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
