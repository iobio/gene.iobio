<style lang="sass" >
@import ../../../assets/sass/variables

#optional-tracks-card
  .card-label
    vertical-align: top
    display: inline-block
    min-width: 180px
    max-width: 180px
    padding-top: 2px
    color: $app-color
    font-size: 16px

  .optional-track-switch
    padding: 0px
    max-width: 180px
    display: inline-block
    vertical-align: top
    text-align: left
    margin-right: 10px

    label
      padding-left: 7px
      line-height: 18px
      font-size: 13px
      font-weight: normal
      padding-top: 7px
      color: $text-color
</style>

<template>
    <v-card id="optional-tracks-card" style="margin-bottom:10px" >

      <div style="display:flex">
        <span class="card-label">Other Tracks</span>

        <v-switch
          :class="{'optional-track-switch': true, 'full-analysis': isFullAnalysis, 'clin': launchedFromClin}"
          v-if="cohortModel.isLoaded && !isEduMode && !isBasicMode "
          label="ClinVar variants"
          :hide-details="true"
          v-model="showKnownVariantsCard"
          >
        </v-switch>

        <v-switch class="optional-track-switch"
                  v-if="cohortModel.isLoaded && !isEduMode && !isBasicMode && launchedFromHub && cohortModel.isSfariProject"
                  label="SFARI variants"
                  :hide-details="true"
                  v-model="showSfariVariantsCard"
        >
        </v-switch>


        <v-switch class="optional-track-switch"
                  v-if="cohortModel.isLoaded && !isEduMode && !isBasicMode && cohortModel.mode == 'trio'"
                  label="Mother variants"
                  :hide-details="true"
                  v-model="showMotherCard"
        >
        </v-switch>

        <v-switch class="optional-track-switch"
                  v-if="cohortModel.isLoaded && !isEduMode && !isBasicMode && cohortModel.mode == 'trio'"
                  label="Father variants"
                  :hide-details="true"
                  v-model="showFatherCard"
        >
        </v-switch>

      </div>
    </v-card>
</template>

<script>
export default {
  name: 'optional-tracks-card',
  components: {
  },
  props: {
    isEduMode: null,
    isBasicMode: null,
    cohortModel: null,
    isFullAnalysis: null,
    launchedFromHub: null,
    launchedFromClin: null
  },
  data () {
    return {
      showMotherCard: true,
      showFatherCard: true,
      showKnownVariantsCard: false,
      showSfariVariantsCard: false
    }
  },
  methods: {
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
    }
  }
}
</script>