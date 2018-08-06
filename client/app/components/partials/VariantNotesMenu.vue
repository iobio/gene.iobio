<style lang="sass">
@import ../../../assets/sass/variables

#show-notes-button
  min-width: 20px
  margin: 0px
  padding: 0px
  height: 18px
  margin-top: -12px

  .btn__content
    padding: 0px
    margin: 0px

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
       slot="activator"
       @mouseover="onMouseOver()"
       @mouseleave="onMouseLeave()"
       v-tooltip.top-center="{content: tooltipContent, show: showTooltipFlag, trigger: 'manual'}"
      >
        <v-icon :class="{'has-notes': variant.notes && variant.notes.length > 0}">
          {{ variant.notes && variant.notes.length > 0 ? "comment" : "add_comment" }}
        </v-icon>
      </v-btn>


      <v-card>

          <div id="enter-notes-input">
            <v-text-field
              id="notes-input"
              multi-line
              rows="12"
              label="Notes"
              v-model="notes"
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

      notes: null,

      showTooltipFlag: false,
      tooltipContent: null

    }
  },
  watch: {
  },
  methods: {
    onApply: function() {
      this.variant.notes = this.notes;
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
        this.notes = self.variant.notes;
      }
    }
  }
}
</script>
