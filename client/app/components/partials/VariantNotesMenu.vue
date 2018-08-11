<style lang="sass">
@import ../../../assets/sass/variables

.chip.not-reviewed
  .chip__content
    background-color: $not-reviewed-color !important
.chip.sig
  .chip__content
    background-color: $significant-color !important
.chip.unknown-sig
  .chip__content
    background-color: $unknown-significance-color !important
.chip.not-sig
  .chip__content
    background-color: $not-significant-color !important

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
  font-family: 'Open sans'
  min-width: 20px
  margin: 0px
  padding: 0px
  height: auto
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
      display: inline-block
      word-break: break-word
      width: 90px
      white-space: normal !important
      word-wrap: break-word !important
      height: auto
      padding-top: 2px
      padding-bottom: 2px

    .material-icons
      font-size: 18px
      color: $text-color

      &.has-notes
        color: $app-color

#show-notes-button
  &.no-wrap

    .btn__content
      padding: 0px
      margin: 0px
      color: white !important

      span
        width: initial
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
       :class="[{'no-wrap' : !wrap}, variant.interpretation ? variant.interpretation : 'not-reviewed']"
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


            <variant-interpretation
               wrap="true"
               :variant="variant"
               @apply-variant-interpretation="onApplyVariantInterpretation">
            </variant-interpretation>

            <template slot="selection" slot-scope="data">
              <v-chip
                :selected="data.selected"
                :key="JSON.stringify(data.item)"
                class="chip--select-multi"
                @input="data.parent.selectItem(data.item)"
              >
                {{ data.item.text }}
              </v-chip>
            </template>
            <template slot="item" slot-scope="data">
              <v-chip :class="data.item.value"
              >
                {{ data.item.text }}
              </v-chip>
            </template>

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

import VariantInterpretation from '../partials/VariantInterpretation.vue'

export default {
  name: 'variant-notes-menu',
  components: {
    VariantInterpretation
  },
  props: {
    variant: null,
    wrap: null
  },
  data () {
    return {
      showNotesMenu: null,

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
      this.$emit("apply-variant-notes", this.variant);
      this.showNotesMenu = false;
    },
    onApplyVariantInterpretation: function() {
      // We don't want to propogate this event because
      // the update of interpretation doesn't take effect
      // until user presses 'Apply' button
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
