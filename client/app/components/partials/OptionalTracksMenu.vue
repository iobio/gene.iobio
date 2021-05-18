<style lang="sass">

@import ../../../assets/sass/variables


#show-optional-tracks-button
  margin: 0px 0px 0px 0px
  font-size: 13px
  height: 26px
  margin-bottom: 0px
  padding-left: 0px
  padding-right: 4px

  .btn__content, .v-btn__content
    color:  $link-color
    padding-left: 5px
    padding-right: 5px
    font-weight: 500

    i.material-icons
      color: $link-color
      font-size: 20px
      padding-right: 3px

.optional-tracks
  .checkbox
    max-height: 24px
    label
      padding-top: 4px
      font-size: 13px

  .v-input__slot
    margin-bottom: 0px

  .v-input__slot
    label
      font-size: 14px
      margin-bottom: 0px
      font-weight: 500


#known-variants-toolbar
  display: flex !important
  flex-flow: column !important

</style>

<template>
    <v-menu
    offset-y
    :close-on-content-click="false"
    bottom
    v-model="showMenu"
    >

      <v-btn id="show-optional-tracks-button"
       flat
       slot="activator"
       v-tooltip.top-center="`Show other tracks`"
      >
        <v-icon>line_style</v-icon>
        Other tracks
      </v-btn>

      <div class="optional-tracks" style="padding: 20px;" >

        <div style="display:flex;flex-flow:column">
          <v-checkbox label="Mother" v-if="isMother"  v-model="showMotherCard"></v-checkbox>
        </div>
        <div style="display:flex;flex-flow:column">
          <v-checkbox label="Father" v-if="isFather"  v-model="showFatherCard"></v-checkbox>
        </div>

        <div style="display:flex;flex-flow:column">
          <v-checkbox label="ClinVar" v-model="showKnownVariantsCard"></v-checkbox>
          <known-variants-toolbar
            v-if="showKnownVariantsCard"
            :forceViz="forceKnownVariantsViz"
            @knownVariantsVizChange="onKnownVariantsVizChange"
            @knownVariantsFilterChange="onKnownVariantsFilterChange"
          >
          </known-variants-toolbar>
        </div>
      </div>

    </v-menu>

</template>

<script>

import KnownVariantsToolbar from "../partials/KnownVariantsToolbar.vue"
import SfariVariantsToolbar from "../partials/SfariVariantsToolbar.vue"


export default {
  name: 'optional-tracks-menu',
  components: {
    KnownVariantsToolbar,
    SfariVariantsToolbar
  },
  props: {
    isMother: null,
    isFather: null,
    forceKnownVariantsViz: null
  },
  data () {
    return {
      showMenu: null,
      showMotherCard: false,
      showFatherCard: false,
      showKnownVariantsCard: false,
      showSfariVariantsCard: false
    }
  },
  watch: {
  },
  methods: {
    onKnownVariantsVizChange: function(viz) {
      this.$emit("known-variants-viz-change", viz);
    },
    onKnownVariantsFilterChange: function(selectedCategories) {
      this.$emit("known-variants-filter-change", selectedCategories);
    },
    onSfariVariantsVizChange: function(viz) {
      this.sfariVariantsViz = viz;
      this.$emit("sfari-variants-viz-change", viz);
    },
    onSfariVariantsFilterChange: function(selectedCategories) {
        this.$emit("sfari-variants-filter-change", selectedCategories);
    },


  },
  created: function() {
  },
  mounted: function() {
  },
  updated: function() {
  },
  computed: {

  },
  watch: {
    showMotherCard: function() {
      let self = this;
      self.$emit("show-mother-card", self.showMotherCard);
    },
    showFatherCard: function() {
      let self = this;
      self.$emit("show-father-card", self.showFatherCard);
    },
    showKnownVariantsCard: function() {
      let self = this;
      self.$emit("show-known-variants-card", self.showKnownVariantsCard);
    },
    showSfariVariantsCard: function() {
      let self = this;
      self.$emit("show-sfari-variants-card", self.showSfariVariantsCard);
    },
    showMenu: function() {
      if (!this.showMenu) {
        this.$emit("optional-track-close");
      }
    }
  }
}
</script>
