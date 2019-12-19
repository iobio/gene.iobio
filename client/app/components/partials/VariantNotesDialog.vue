<style lang="sass">
@import ../../../assets/sass/variables


#notes-input
  font-size: 12px

#enter-notes-input
  .input-group--text-field.input-group--prepend-icon
    .input-group__prepend-icon
      padding-right: 0px
      justify-content: flex-start
      display: inline-block
      align-self: start
      font-size: 18px




#show-notes-button
  min-width: 20px
  margin: 0px
  padding: 0px
  height: auto
  font-size: 13px
  margin-top: 15px
  margin-left: 2px


  .btn__content, .v-btn__content
    padding: 0px
    margin: 0px
    color: $text-color !important
    padding-left: 8px
    padding-right: 10px

    .material-icons
      font-size: 22px
      color: $text-color
      vertical-align: top
      color: $text-color


</style>

<template>
    <v-dialog
    width="400" persistent
    :close-on-content-click="false"
    v-model="showNotesDialog"
    >

      <v-btn id="show-notes-button"
       v-if="sourceNotes == ''"
       small
       raised
       slot="activator"
      >

        <v-icon >
          add
        </v-icon>
        Add note
      </v-btn>


      <v-card class="full-width">
        <v-card-text id="enter-notes-input">
            <v-text-field
              id="notes-input"
              multi-line
              rows="5"
              label="Notes"
              v-model="notes"
            >
            </v-text-field>
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
  name: 'variant-notes-dialog',
  components: {
  },
  props: {
    sourceNotes: null,
    sourceIndex: null,
    showDialog: null
  },
  data () {
    return {
      showNotesDialog: null,
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
      this.showNotesDialog = false;
    },
    onCancel: function() {
      this.showNotesDialog = false;
    }
  },
  created: function() {
  },
  mounted: function() {
  },
  updated: function() {
  },
  watch: {
    showNotesDialog: function() {
      let self = this;
      if (self.showNotesDialog) {
        self.notes = self.sourceNotes;
      }
    },
    sourceNotes: function() {
      this.notes = this.sourceNotes;
    },
    showDialog: function() {
      this.showNotesDialog = this.showDialog
    }

  }
}
</script>
