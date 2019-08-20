<style lang="sass">
@import ../../../assets/sass/variables


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
    margin-top: -25px

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




</style>

<template>

  <div id="variant-assessment">
    <div class="variant-column-header">
      Assessed
    </div>
    <div>
      <variant-interpretation
      style="width: 220px;display: inline-block"
       wrap="true"
       :variant="variant"
       :variantInterpretation="interpretation"
       :interpretationMap="interpretationMap"
       :showInterpretationLabel="true"
       @apply-variant-interpretation="onApplyVariantInterpretation">
      </variant-interpretation>

      <div id="enter-notes-input">
        <v-text-field
          id="notes-input"
          multi-line
          rows="2"
          label="Notes"
          v-model="notes"
          :hide-details="true"
          @change="onApplyVariantNotes">
        </v-text-field>
      </div>

    </div>






  </div>
</template>

<script>

import VariantInterpretation from '../partials/VariantInterpretation.vue'

export default {
  name: 'variant-assessment',
  components: {
    VariantInterpretation
  },
  props: {
    interpretationMap: null,
    variant: null,
    variantNotes: null,
    variantInterpretation: null,
    wrap: null,
  },
  data () {
    return {

      notes: null,
      interpretation: null,

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
    onApply: function() {
      this.variant.notes = this.notes;
      this.variant.interpretation = this.interpretation;
      this.$emit("apply-variant-notes", this.variant);
      this.showNotesMenu = false;
    },
    onApplyVariantInterpretation: function() {
      this.interpretation = this.variant.interpretation;
      // We don't want to propogate this event because
      // the update of interpretation doesn't take effect
      // until user presses 'Apply' button
    },
    onApplyVariantNotes: function() {
      this.variant.notes = this.notes;
      this.$emit("apply-variant-notes", this.variant)
    },
    onCancel: function() {
      this.variant.interpretation = this.variantInterpretationOrig;
      this.showNotesMenu = false;
    },
    init: function() {
      let self = this;
      if (self.variant) {
        self.notes = self.variant.notes;
        self.interpretation = self.variant.interpretation  && self.variant.interpretation.length > 0 ? self.variant.interpretation : "not-reviewed";
      } else {
        self.notes = "";
        self.interpretation = 'not-reviewed';
      }
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
