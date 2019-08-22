<style lang="sass">

@import ../../../assets/sass/variables

#variant-allele-counts-menu-button
  padding: 0px
  font-size: 13px
  min-width: 100px
  margin: 0px

  .btn__content
    color:  $text-color
    padding-left: 0px

    i.material-icons
      color: $text-color
      font-size: 17px
      padding-right: 3px


#allele-counts
  display: flex
  flex-direction: column
  padding: 20px
  font-size: 12px

  .sample-allele-count
    display: flex
    flex-direction: row

    .progress-counts
      padding-left: 4px
      font-size: 11px
      color: $text-color
      min-width: 60px
      max-width: 150px

      &.other
        font-style: italic
        color: #a2a0a0

    .affected-icon
      min-width: 20px
      max-width: 20px
      .material-icons
        font-size: 16px
        color:  $danger-color

    .progress-bar-label
      margin-right: 4px
      min-width: 90px
      max-width: 90px
      font-size: 13px

    .zyg
      min-width: 55px
      max-width: 55px
      font-size: 11px

    .loaded-progress
      min-width: 160px
      max-width: 160px
      margin-top: 0px
      margin-bottom: 10px
      margin-left: 0px
      margin-right: 0px
      .progress-linear__bar__determinate
        background-color: $current-color !important
      .progress-linear__background
        background-color: $current-color !important
        height: 20px !important
    .other-progress
      min-width: 160px
      max-width: 160px
      margin-top: 0px
      margin-bottom: 10px
      margin-left: 0px
      margin-right: 0px
      .progress-linear__bar__determinate
        background-color: $multi-allelic-color !important
      .progress-linear__background
        background-color: $multi-allelic-color !important
        height: 20px !important

</style>


<template>

  <v-menu id="variant-allele-counts-menu"
    offset-x
    :close-on-content-click="false"
    :nudge-width="300"
    top
    v-model="showMenu">

      <v-btn id="variant-allele-counts-menu-button" class="variant-action-button"
       raised
       slot="activator">
        <v-icon>bar_chart</v-icon>
        <span>Allele counts</span>
      </v-btn>


      <div id="allele-counts">
        <div class="sample-allele-count" v-for="alleleCount in sampleAlleleCounts" :key="alleleCount.name">

          <div class="affected-icon">
            <v-icon v-if="alleleCount.affected">spellcheck</v-icon>
          </div>
          <span class="progress-bar-label">{{ alleleCount.name }}</span>
          <span class="zyg">{{ alleleCount.zyg }}</span>
          <div>
            <div style="display:flex">
              <v-progress-linear  class="loaded-progress" height="14"  v-model="alleleCount.altRatio">
              </v-progress-linear>
              <span class="progress-counts">
                {{ alleleCount.altCount }} of {{ alleleCount.totalCount }}
              </span>
            </div>
            <div style="display:flex;margin-top:-10px" v-if="alleleCount.otherCount > 0">
              <v-progress-linear  class="other-progress" height="14"  v-model="alleleCount.otherRatio">
              </v-progress-linear>
              <span class="progress-counts other">
                {{ alleleCount.otherCount }} of {{ alleleCount.totalCount }} (multi-allelic)
              </span>
            </div>
          </div>

        </div>
      </div>
  </v-menu>

</template>

<script>



export default {
  name: 'variant-allele-counts-menu',
  components: {
  },
  props: {
    selectedVariant: null,
    affectedInfo: null,
    relationship: null,
    cohortMode: null
  },
  data () {
    return {
      showMenu: null
    }
  },
  watch: {
  },
  methods: {
  },
  computed: {
    sampleAlleleCounts: function() {
      let self = this;
      var sampleAlleleCounts = [];
      self.affectedInfo.forEach(function(info) {

        var affectedStatus = info.status;
        var sampleName     = info.model.getSampleName();
        var genotype       = self.selectedVariant.genotypes ? self.selectedVariant.genotypes[sampleName] : null;

        if (genotype == null || genotype.absent && self.cohortMode == 'single') {
          // If vcf doesn't have any genotypes, skip showing this

        } else {

          var selectedClazz  = self.cohortMode == 'trio' && info.model.relationship == self.relationship ? 'selected' : '';

          var rel     = info.relationship;
          var display = (info.relationship == 'sibling' ? 'Sib' : self.globalApp.utility.capitalizeFirstLetter(info.relationship))
                        + " "
                        + (info.relationship == 'sibling' ? sampleName : '')
          var zyg = genotype ? (!genotype.hasOwnProperty('zygosity') || genotype.zygosity == null || genotype.zygosity == "gt_unknown" ? "unknown" : genotype.zygosity.toLowerCase()) : "none";

          var altAndRef = +genotype.refCount + +genotype.altCount;
          var altRatio  = (+genotype.altCount / +genotype.genotypeDepth) * 100;
          var otherCount = 0;
          var otherRatio = 0;
          if (altAndRef < +genotype.genotypeDepth) {
            otherCount  = +genotype.genotypeDepth - altAndRef;
            otherRatio  = (otherCount / +genotype.genotypeDepth) * 100;
          }

          sampleAlleleCounts.push(
            {
              name:       display,
              zyg:        zyg,
              affected:   affectedStatus == 'affected' ? true : false,
              altRatio:   altRatio,
              altCount:   genotype.altCount,
              otherCount: otherCount,
              otherRatio: otherRatio,
              refCount:   genotype.refCount,
              totalCount: genotype.genotypeDepth

            }
          )
        }
      })
      return sampleAlleleCounts;
    }

  },
  created: function() {
  },
  mounted: function() {
  },
  updated: function() {
  }
}
</script>