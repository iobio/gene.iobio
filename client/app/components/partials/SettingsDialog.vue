<style lang="sass">
@import ../../../assets/sass/variables

#settings-panel
  padding-left: 20px
  padding-right: 20px

  .settings-title
    color:  $app-color
    font-size: 15px




  #apply-button, #cancel-button
    padding: 0px
    height: 30px !important
    min-width: 100px !important
    margin: 0px
    margin-left: 20px

    &.disabled
      opacity: 0.20 !important

    &.v-btn--disabled
      opacity: 0.20 !important

  #apply-button
    background-color: $app-button-color !important
    color: white !important

  .coding-variants-only-switch
    margin-top: -4px
    margin-left: 0px
    margin-right: 0px

    label
      line-height: 18px !important
      color: $text-color !important
      font-weight: normal !important
      font-size: 13px !important
      padding-left: 2px !important
      padding-top: 6px !important

    .v-input--selection-controls__input
      margin-right: 0px 

</style>

<template>
  <v-dialog v-model="showSettingsDialog" persistent max-width="400">
    <v-card id="settings-panel" class="full-width">

      <v-card-title class="headline">Settings</v-card-title>

      <v-card-text>

          <v-layout v-if="!settingsCoverageOnly" row wrap class="">
            <v-flex xs6>
              <v-select
                label="Genome Build"
                hide-details
                v-model="buildName"
                :items="buildList"
              ></v-select>
            </v-flex>
          </v-layout>

          <v-layout v-if="!settingsCoverageOnly" row wrap class="mt-4">
            <v-flex xs6>
              <v-select
                v-bind:items="geneSources"
                v-model="geneSource"
                label="Gene source"
                item-value="text"
                :hide-details="true"
                @input="onGeneSourceSelected">
              </v-select>

            </v-flex>
          </v-layout>


          <v-layout v-if="!settingsCoverageOnly" row wrap class="mt-4">
            <v-flex xs12>
              <v-switch 
                class="coding-variants-only-switch"
                label="Analyze variants in coding regions only"
                v-model="analyzeCodingVariantsOnly"
                >
              </v-switch>
            </v-flex>
          </v-layout>

          <v-layout row wrap class="mt-2">
            <v-flex xs12>
            Sequence coverage cutoffs
            </v-flex>
          </v-layout>
          <filter-settings-coverage
            ref="filterSettingsCoverageRef"
            :filterModel="filterModel"
            :filter="coverageFilter"
            :showApplyButton="false"
             @apply-filter="onApplyFilter"
             @gene-coverage-min-changed="onGeneCoverageMinChanged"
             @gene-coverage-mean-changed="onGeneCoverageMeanChanged"
             @gene-coverage-median-changed="onGeneCoverageMedianChanged">
          </filter-settings-coverage>

          <v-layout v-if="!settingsCoverageOnly" row wrap class="mt-4 mb-2">
            <v-flex xs8 id="phenolyzer-top-input">            
                <v-combobox
                v-model="phenolyzerTop"
                label="Keep top n genes from phenotype search"
                :hide-details="true"
                hint="Number of genes to keep from phenotype-based search"
                combobox
                :items="phenolyzerTopCounts"
                >
                </v-combobox>
              </v-flex>
            </v-flex>
          </v-layout>




      </v-card-text>

      <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn id="apply-button" raised class="action-button" @click.native="onApply">Apply</v-btn>
          <v-btn id="cancel-button" raised class="action-button" @click.native="onCancel">Cancel
          </v-btn>
      </v-card-actions>
  
    </v-card>
  </v-dialog>
</template>

<script>
import FilterSettingsCoverage from '../partials/FilterSettingsCoverage.vue'


export default {
  name: 'settings-dialog',
  components: {
    FilterSettingsCoverage
  },
  props: {
    showDialog: null,
    genomeBuildHelper: null,
    cohortModel: null,
    geneModel: null,
    filterModel: null,
    settingsCoverageOnly: null

  },
  data () {
    return {
      showSettingsDialog: false,
      speciesList: [],
      speciesName: null,
      buildName: null,

      geneSource: null,
      geneSources: ['gencode', 'refseq'],

      phenolyzerTop: null,
      phenolyzerTopCounts: [5, 10, 20, 30, 50, 80, 100],

      coverageFilter: null,
      geneCoverageMin: null,
      geneCoverageMean: null,
      geneCoverageMax: null,

      analyzeCodingVariantsOnly: false,

      emitCodingVariantsOnlyEvent: false,
      emitGeneSourceEvent: false,
      emitCoverageCutoffEvent: false,
      emitGenomeBuildEvent: false,
      emitPhenolyzerTopEvent: false
    }
  },
  watch: {
    showDialog: function(showIt) {
      this.showSettingsDialog = showIt;
    },
    phenolyzerTop: function(newValue, oldValue) {
      if (oldValue != null) {
        this.emitPhenolyzerTopEvent = newValue != oldValue;
      }
    },
    buildName: function(newValue, oldValue) {
      if (oldValue != null) {
        this.emitGenomeBuildEvent = newValue != oldValue;
      }
    },
    analyzeCodingVariantsOnly: function(newValue, oldValue) {
      if (oldValue != null) {
        this.emitCodingVariantsOnlyEvent = newValue != oldValue;
      }
    }
  },
  computed: {
    buildList: function() {
      if (this.speciesName && this.cohortModel.genomeBuildHelper) {
        return this.cohortModel.genomeBuildHelper.speciesToBuilds[this.speciesName].map(function(gb) {
          return gb.name;
        })
      } else {
        return [];
      }
    },
  },
  methods: {
    onApply: function() {
      let self = this;

      if (this.emitCoverageCutoffEvent) {
        this.filterModel.geneCoverageMin         = +this.geneCoverageMin;
        this.filterModel.geneCoverageMean        = +this.geneCoverageMean;
        this.filterModel.geneCoverageMedian      = +this.geneCoverageMedian;

        this.$emit("coverage-threshold-applied");
      }
      if (this.emitGeneSourceEvent) {
        self.$emit('gene-source-selected', self.geneSource);
      }
      if (this.emitPhenolyzerTopEvent) {
        self.$emit('phenolyzer-top-changed', self.phenolyzerTop)
      }
      if (this.emitCodingVariantsOnlyEvent) {
        self.$emit('coding-variants-only-changed', self.analyzeCodingVariantsOnly)
      }
      if (this.emitGenomeBuildEvent) {
        self.$emit("genome-build-selected", self.buildName)
      }

      this.$emit('hide-settings')
    },
    onCancel: function() {
      this.$emit('hide-settings')
    },
    onGeneSourceSelected: function() {
      this.emitGeneSourceEvent = true;
    },
    onAnalyzeCodingVariantsOnly: function() {
      this.emitCodingVariantsOnlyEvent = true;
    },
    onApplyFilter: function() {
      this.emitCoverageCutoffEvent = true;
    },
    onGeneCoverageMinChanged: function(min) {
      this.geneCoverageMin = min;
      this.emitCoverageCutoffEvent = true;
    },
    onGeneCoverageMeanChanged: function(mean) {
      this.geneCoverageMean = mean;
      this.emitCoverageCutoffEvent = true;
    },
    onGeneCoverageMedianChanged: function(median) {
      this.geneCoverageMedian = median;
      this.emitCoverageCutoffEvent = true;
    },
    init: function() {
      let self = this;
      this.buildName   =  this.cohortModel.genomeBuildHelper.getCurrentBuildName();
      this.speciesName =  this.cohortModel.genomeBuildHelper.getCurrentSpeciesName();
      this.speciesList =  this.cohortModel.genomeBuildHelper.speciesList.map(function(sp) {
          return sp.name;
        }).filter(function(name) {
          return name == 'Human';
        });

      this.geneSource = this.geneModel.geneSource;

      this.geneCoverageMin    = this.filterModel.geneCoverageMin;
      this.geneCoverageMean   = this.filterModel.geneCoverageMean;
      this.geneCoverageMedian = this.filterModel.geneCoverageMedian;

      if (this.$refs && this.$refs.filterSettingsCoverageRef) {
        this.$refs.filterSettingsCoverageRef.init();
      }

      this.analyzeCodingVariantsOnly = this.cohortModel.analyzeCodingVariantsOnly;

      if (this.geneModel.phenolyzerTopGenesToKeep) {
        if (this.phenolyzerTopCounts.indexOf(this.geneModel.phenolyzerTopGenesToKeep) < 0) {
          this.phenolyzerTopCounts.push(this.geneModel.phenolyzerTopGenesToKeep)
        }
      }
      setTimeout(function() {
        self.phenolyzerTop = self.geneModel.phenolyzerTopGenesToKeep;
      }, 500)

    }
  },
  mounted: function() {
    this.init();

    this.coverageFilter = 
      {name: 'coverage', display: 'Insufficient coverage',
       showTooltip: false, showEdit: false, custom: false, tooltip: ''};
  
  }
}

</script>