<style lang="sass">
@import ../../../assets/sass/variables

.individual_note_menu_items
  padding-bottom: 0px

  i.material-icons
    font-size: 15px

  a
    font-size: 13px
    height: 40px

#variant-assessment



  #notes-input
    font-size: 13px
    color: $text-color

  #enter-notes-input
    display: inline-block
    vertical-align: top
    margin-left: 20px
    width: calc(100% - 250px)
    margin-top: -35px

    label
      font-size:  12px

    .input-group--text-field.input-group--prepend-icon
      .input-group__prepend-icon
        padding-right: 0px
        justify-content: flex-start
        display: inline-block
        align-self: start
        font-size: 18px


    .input-group__details:before
      background-color: #dbdbdb !important

  .individual-notes-container
    display: flex
    flex-flow: column
    justify-content: flex-start

    .individual-note
      border-bottom: solid 1px #e6e3e3
      padding-left: 0px
      padding-bottom: 20px
      font-size: 12px
      overflow-y: scroll
      margin-top: 10px
      min-width: 100%
      max-width: 100%

      .note-header
        display: flex
        justify-content: flex-start
        font-style: italic

        .note-author
          margin-right:  20px
          padding-top: 6px

        .note-datetime
          margin-right:  20px
          padding-top: 6px

        .button-actions
          min-width: 30px
          margin: 2px
          padding: 0px
          height: 22px
          margin-left: -5px

          .btn__content
            padding: 0px

            i.material-icons
              font-size: 17px



      .note-body
        padding-top: 5px




</style>

<template>

  <div id="variant-assessment" class="app-card">
    <div>
      <variant-interpretation
      style="width: 210px;display: inline-block"
       wrap="true"
       :variant="variant"
       :variantInterpretation="interpretation"
       :interpretationMap="interpretationMap"
       :showInterpretationLabel="true"
       @apply-variant-interpretation="onApplyVariantInterpretation">
      </variant-interpretation>

      <variant-notes-dialog
        style="display:inline-block;; padding-top: 10px"
        class="variant-notes"
        :sourceNotes="``"
        :sourceIndex="``"
        :showDialog="``"
        @add-variant-note="onAddVariantNote">
      </variant-notes-dialog>


    </div>
    <div class="individual-notes-container">
      <div class="individual-note" v-for="(note, noteIndex) in notes">

        <variant-notes-dialog
          :v-if="note.showEditDialog"
          class="variant-notes"
          :showDialog="note.showEditDialog"
          :sourceNotes="note.note"
          :sourceIndex="noteIndex"
          @edit-variant-note="onEditVariantNote">
        </variant-notes-dialog>

        <div class="note-header">


          <div v-if="note.datetime" class="note-datetime">
            {{ note.datetime }}
          </div>


          <div v-if="note.author" class="note-author">
            {{ note.author }}
          </div>

          <v-spacer></v-spacer>


          <v-menu
            offset-y
            :close-on-content-click="false"
            bottom
            v-model="note.showMenu">
              <v-btn  class="button-actions" flat slot="activator">
                <v-icon>more_vert</v-icon>
              </v-btn>
              <v-list class="individual_note_menu_items">
                <v-list-tile  @click="onShowEditVariantNote(note)">
                  <v-list-tile-title>
                    <v-icon>edit</v-icon>
                    Edit
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile  @click="onRemoveVariantNote(noteIndex)">
                  <v-list-tile-title>
                    <v-icon>delete</v-icon>
                    Remove
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
          </v-menu>

        </div>
        <div class="note-body">
          {{ note.note }}
        </div>


      </div>
    </div>






  </div>
</template>

<script>

import VariantInterpretation from '../partials/VariantInterpretation.vue'
import VariantNotesDialog    from '../partials/VariantNotesDialog.vue'

export default {
  name: 'variant-assessment',
  components: {
    VariantInterpretation,
    VariantNotesDialog
  },
  props: {
    interpretationMap: null,
    variant: null,
    variantInterpretation: null,
    wrap: null,
    user: null
  },
  data () {
    return {
      interpretation: null,
      notes: null,

      showTooltipFlag: false,
      tooltipContent: null,

      variantInterpretationOrig: null


    }
  },
  watch: {
  },
  computed: {
    interpretationDisplay: function() {
      if (this.interpretation) {
        return this.interpretationMap[this.interpretation];
      } else {
        return this.interpretationMap['not-reviewed'];
      }
    }
  },
  methods: {
    onApplyVariantInterpretation: function() {
      this.interpretation = this.variant.interpretation;
      this.$emit("apply-variant-interpretation", this.variant)
    },
    onAddVariantNote: function(aNote) {
      let self = this;
      if (this.notes == null || this.notes == "") {
        this.notes = []
      }
      this.notes.push({'author': this.user ? this.user.first_name + " " + this.user.last_name : '',
        'datetime': self.getCurrentDateAndTime(),
        'note': aNote,
        'showDialog': false,
        'showEditDialog': false})
      this.variant.notes = this.notes
      this.$emit("apply-variant-notes", this.variant)
    },
    onShowEditVariantNote: function(note) {
      let self = this;
      note.showEditDialog = true;
    },
    onRemoveVariantNote: function(index) {
      let self = this;
      if (this.notes && this.notes.length > index) {
        this.notes.splice(index, 1)
      }
      this.variant.notes = this.notes;
      this.$emit("apply-variant-notes", this.variant)
    },
    onEditVariantNote: function(index, aNote) {
      let self = this;
      if (this.notes && this.notes.length > index) {
        this.notes[index].note = aNote
        this.notes[index].datetime = self.getCurrentDateAndTime();
        this.notes[index].showEditDialog = false;
      }
      this.variant.notes = this.notes;
      this.$emit("apply-variant-notes", this.variant)
    },
    init: function() {
      let self = this;
      if (self.variant) {
        self.interpretation = self.variant.interpretation  && self.variant.interpretation.length > 0 ? self.variant.interpretation : "not-reviewed";
        self.notes = self.variant.notes;
      } else {
        self.interpretation = 'not-reviewed';
      }
    },
    getCurrentDateAndTime: function() {
      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes();
      return date + ' ' + time;
    }
  },
  created: function() {
  },
  mounted: function() {
    this.init();
  },
  updated: function() {
  },
  watch: {
    variantNotes: function() {
      this.init();
    },
    variantInterpretation: function() {
      this.init();
    },
    variant: function() {
      this.init();
    }
  }
}
</script>
