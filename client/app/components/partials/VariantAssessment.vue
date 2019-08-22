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

  .variant-column-header
    font-size: 14px
    color:  $app-color
    margin-bottom: 10px

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
    flex-flow: row
    flex-wrap: wrap
    justify-content: flex-start

    .individual-note
      border-right: solid 1px #e6e3e3
      padding-left: 15px
      padding-right: 15px
      font-size: 12px
      max-height: 108px
      overflow-y: scroll
      margin-top: 10px
      min-width: 45%
      max-width: 45%

      .note-header
        display: flex
        justify-content: flex-start
        font-style: italic

        .note-author
          margin-left:  20px
          padding-top: 6px

        .note-datetime
          margin-left:  20px
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

  <div id="variant-assessment">
    <div class="variant-column-header">
      Assessed
    </div>
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
        style="display:inline-block;margin-left:20px; padding-top: 4px"
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


          <div v-if="note.author" class="note-author">
            {{ note.author }}
          </div>

          <div v-if="note.datetime" class="note-datetime">
            {{ note.datetime }}
          </div>
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
      // We don't want to propogate this event because
      // the update of interpretation doesn't take effect
      // until user presses 'Apply' button
    },
    onAddVariantNote: function(aNote) {
      let self = this;
      if (this.notes == null || this.notes == "") {
        this.notes = []
      }
      this.notes.push({'author': '',
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
    }
  }
}
</script>
