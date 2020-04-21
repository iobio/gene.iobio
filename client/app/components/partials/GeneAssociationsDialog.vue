<style lang="sass">
@import ../../../assets/sass/variables

</style>

<template>
    <v-dialog
    width="400" persistent
    :close-on-content-click="false"
    v-model="showGeneAssociationDialog"
    >

      <v-card class="full-width">
        <v-card-text id="enter-notes-input">
          {{ genePhenotypeHits }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn  @click="onApply">
            Apply
          </v-btn>
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
      notes: null
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
    }
  },
  created: function() {
  },
  mounted: function() {
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
