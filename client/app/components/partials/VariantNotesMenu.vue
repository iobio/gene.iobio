<style lang="sass">
@import ../../../assets/sass/variables

#select-interpretation
  label
    display: initial !important
  .chip .chip__content
    border-radius: none !important
    background-color: $not-reviewed-color  !important

  &.not-reviewed
    .chip
      .chip__content
        background-color: $not-reviewed-color !important
  &.sig
    .chip
      .chip__content
        background-color: $significant-color !important
  &.unknown-sig
    .chip
      .chip__content
        background-color: $unknown-significance-color !important
  &.not-sig
    .chip
      .chip__content
        background-color: $not-significant-color !important

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
  height: 18px
  font-size: 12px
  margin-top: 0px
  border-radius: 28px
  color: white !important
  background-color: $not-reviewed-color  !important

  &.not-reviewed
    background-color: $not-reviewed-color !important
  &.sig
    background-color: $significant-color !important
  &.unknown-sig
    background-color: $unknown-significance-color !important
  &.not-sig
    background-color: $not-significant-color !important


  .btn__content
    padding: 0px
    margin: 0px
    color: white !important

    span
      padding-left: 3px
      padding-right: 3px

    .material-icons
      font-size: 18px
      color: $text-color

      &.has-notes
        color: $app-color

</style>

<template>
    <v-menu
    offset-y
    :close-on-content-click="false"
    :nudge-width="400"
    top
    v-model="showNotesMenu"
    >

      <v-btn id="show-notes-button"
       flat
       small
       :class="variant.interpretation ? variant.interpretation : 'not-reviewed'"
       slot="activator"
       @mouseover="onMouseOver()"
       @mouseleave="onMouseLeave()"
       v-tooltip.top-center="{content: tooltipContent, show: showTooltipFlag, trigger: 'manual'}"
      >

        <span>
          {{ variant.interpretation ? interpretationMap[variant.interpretation] : interpretationMap['not-reviewed'] }}
        </span>
      </v-btn>


      <v-card>

          <v-select
          id="select-interpretation"
          :items="interpretations"
          :class="interpretation"
          v-model="interpretation"
          label="Interpretation"
          single-line
          chips
          >
          </v-select>

          <div id="enter-notes-input">
            <v-text-field
              id="notes-input"
              multi-line
              rows="5"
              label="Notes"
              v-model="notes"
              prepend-icon="comment"
            >
            </v-text-field>
          </div>
          <div>
              <v-btn style="float:right" @click="onCancel">
               Cancel
             </v-btn>
              <v-btn style="float:right" @click="onApply">
               Apply
             </v-btn>
          </div>


      </v-card>
    </v-menu>
</template>

<script>



export default {
  name: 'variant-notes-menu',
  components: {

  },
  props: {
    variant: null,
    cohortModel: null
  },
  data () {
    return {
      showNotesMenu: null,

      interpretation: null,
      notes: null,

      showTooltipFlag: false,
      tooltipContent: null,

      interpretationMap: {
        'sig': 'Significant',
        'unknown-sig': 'Unknown significance',
        'not-sig': 'Not significant',
        'not-reviewed': 'Not reviewed'
      }

    }
  },
  watch: {
  },
  computed: {

    interpretations: function() {
      let self = this;
      var theInterpretations = [];
      for (var key in self.interpretationMap) {
        theInterpretations.push({ 'value': key, 'text': self.interpretationMap[key]});
      }
      return theInterpretations;
    },
    interpretationDisplay: function() {
      return this.interpretation ? this.interpretationMap[this.interpretation] : this.interpretationMap['not-reviewed'] ;
    }
  },
  methods: {
    onApply: function() {
      this.variant.notes = this.notes;
      this.variant.interpretation = this.interpretation;
      this.$emit("apply-variant-notes", this.variant);
      this.showNotesMenu = false;
    },
    onCancel: function() {
      this.showNotesMenu = false;
    },
    onMouseOver: function() {
      this.showTooltipFlag = true;
      this.tooltipContent = this.variant.notes && this.variant.notes.length > 0 ? this.variant.notes : "Click this button to enter notes for the variant."
    },
    onMouseLeave: function() {
      this.showTooltipFlag = false;
    },
    showTooltip: function(tooltip) {
      let self = this;
      self.showTooltipFlag = true;
      self.tooltipContent = tooltip;
    },
    hideTooltip: function() {
      let self = this;
      this.showTooltipFlag = false;
    }
  },
  created: function() {
  },
  mounted: function() {
  },
  updated: function() {
  },
  watch: {
    showNotesMenu: function() {
      let self = this;
      if (self.showNotesMenu && self.variant) {
        self.notes = self.variant.notes;
        self.interpretation = self.variant.interpretation == null || self.variant.interpretation.length == 0 ? 'not-reviewed' : self.variant.interpretation;
      }
    }
  }
}
</script>
