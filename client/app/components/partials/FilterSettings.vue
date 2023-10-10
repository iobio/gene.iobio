
<style lang="sass" >

@import ../../../assets/sass/variables

.filter-form
  padding: 10px 35px 5px 35px

  .v-text-field__slot
    height: 24px
    .v-label
      font-size: 13px
    label
      font-size: 13px
    input
      font-size: 14px
      color: $text-emphasize-color !important
      font-weight: 500 !important
      padding-top: 0px
      padding-bottom: 0px


  .v-select__selection
    font-size: 13px
    input
      padding-top: 0px
      padding-bottom: 0px
  .v-select__selections
    input
      padding-top: 0px
      padding-bottom: 0px
  .v-select__selection.v-select__selection--comma
    padding-bottom: 0px
    color: $text-emphasize-color !important
    font-weight: 500 !important
    font-size: 14px


  .filter-action-button
    padding: 0px
    height: 30px !important
    background-color: $app-button-color !important
    color: white !important
    min-width: 150px !important
    margin: 0px

    &.disabled
      opacity: 0.30 !important

    &.cancel-button
      background-color: white !important
      color: $app-color !important
      min-width: 100px !important
      margin-left: 15px
      min-width: 90px

  #max-af
    .v-input.v-text-field 
      min-width: 220px

  #max-homozygotes
    .v-input.v-text-field 
      min-width: 220px

  .input-group
    label
      font-style: italic !important
      color: $text-color !important
      font-weight: normal !important

  .input-group--text-field
    input
      font-size: 14px !important
      color: $app-color !important
      font-weight: bold

  .input-group__selections__comma
    font-size: 14px !important
    color: $app-color !important
    font-weight: bold

.filter-title
  font-size: 16px
  color: $link-color
  margin-bottom: 15px
  font-weight: 500

.revel-progress-bar
    display: inline-block
    margin-bottom: 0px
    width: 100px
    margin-right: 4px
    margin-top: 0px

    .progress-linear__bar__determinate
      background-color:  $app-gray !important
      border-color:  $app-gray !important

    &.revel_high
      .progress-linear__bar__determinate
        background-color:  $high-impact-color !important
        border-color:  $high-impact-color !important

    &.revel_moderate
      .progress-linear__bar__determinate
        background-color:  $moderate-impact-color !important
        border-color:  $moderate-impact-color !important

.clin_dialog_scroll
  height: 475px
</style>

<template>

  <v-card-text :class="{ clin_dialog_scroll: launchedFromClin }" >

    <v-layout row wrap class=" filter-form">


      <v-flex id="name" xs12  >
        <v-text-field label="Name"  
        @input="onChangeName" 
        v-model="name" 
        :rules=[rules.noDuplicates]>
        </v-text-field>
      </v-flex>



      <v-flex xs12 >
        <v-select
              label="Inheritance"
              v-bind:items="inheritanceModes"
              :item-text="capitalize"
              v-model="selectedInheritanceModes"
              multiple
              small-chips
              deletable-chips
              clearable
              hide-details
        >
        </v-select>
      </v-flex>

      <v-flex xs12 >
        <v-select
              label="Zygosity"
              v-bind:items="zygosities"
              v-model="selectedZygosity"
              single
              clearable
              hide-details
        >
        </v-select>
      </v-flex>

      <v-flex xs12 style="margin-top:10px;margin-bottom: 5px"  >

        <v-flex id="max-af"   >
          <v-text-field style="display:inline-block" label="Max Population Allele Freq" :rules="numericRules" v-model="maxAf" hide-details>
          </v-text-field>
          <info-popup :name="gnomADInfoPopup"></info-popup>
        </v-flex>
        <div v-if="maxAf && maxAf != '' && gnomADExomesOnly "
            class="amber lighten-5" 
            style="margin-top: 5px;padding: 3px;font-size:13px">
            To speed up filtering, the gnomAD <span style='font-style: italic; font-weight:bold'> exomes only </span> pop max allele frequency is used. Allele frequencies from gnomAD exomes are less complete, so variants may pass this filter and have a higher allele frequency in gnomAD genomes. (After clicking on a variant, the allele frequency from gnomAD genomes will be shown.)
        </div>

      </v-flex>

      <v-flex xs12 style="margin-top:10px;margin-bottom: 5px"  >
        <v-flex id="max-homozygotes"   >
          <v-text-field style="display:inline-block" label="Max Population Homozygotes" :rules="wholeNumRules" v-model="maxHomozygotes" hide-details>
          </v-text-field>
        </v-flex>
      </v-flex>

      <v-flex xs12  >
        <v-select
              label="ClinVar clinical significance"
              v-bind:items="clinvarCategories"
              v-model="selectedClinvarCategories"
              multiple
              small-chips
              deletable-chips
              hide-details
              clearable
        >
        </v-select>
      </v-flex>




      <v-flex xs12 >
        <v-select
              label="Impact"
              v-bind:items="impacts"
              v-model="selectedImpacts"
              multiple
              hide-details
              small-chips
              deletable-chips
              clearable
        >
        </v-select>
      </v-flex>

      <v-flex xs12  >
        <v-autocomplete
              label="Consequence"
              v-bind:items="consequences"
              v-model="selectedConsequences"
              multiple
              autocomplete
              hide-details
        >
        </v-autocomplete>
      </v-flex>

      <v-flex id="min-revel" xs12 class="mb-2 mt-4 mr-4" >

            <div style="display: inline-block;margin-right:15px;font-weight:500">
              Min REVEL score (for missense variants)
              <info-popup name="revel"></info-popup>
            </div>


            <v-text-field :hide-details="true"  style="padding-top:0px;margin-left: 10px;vertical-align:top;width:50px;display:inline-block" v-model="minRevel" >
            </v-text-field>

            <div v-if="minRevel && minRevel != ''"
                class="amber lighten-5" 
                style="margin-top: 5px; padding: 3px;font-size: 13px">
                REVEL scores apply to <span style='font-style: italic; font-weight:bold'> missense variants </span>  only.  Variants of other consequences will automatically be filtered out.
            </div>

      </v-flex>




      <v-flex  id="min-genotype-depth" xs3 class="mt-3 mb-4 mr-4" >
        <v-text-field label="Min Coverage"  suffix="X" v-model="minGenotypeDepth" hide-details>
        </v-text-field>
      </v-flex>

      <v-flex  id="min-genotype-alt-count" xs4 class="mt-3 mb-4 mr-4" >
        <v-text-field label="Min Alt Count"  suffix="" v-model="minGenotypeAltCount" hide-details>
        </v-text-field>
      </v-flex>


      <v-flex style="display:flex" xs12 class="mt-1 mb-1" >
        <v-spacer></v-spacer>
        <v-btn :disabled="!isDirty || !isValidFilter" :class="{'disabled': !isDirty || !isValidFilter, 'filter-action-button': true}" @click="apply">
          Apply
        </v-btn>

        <v-btn class="filter-action-button cancel-button" @click="onCancel">
        Cancel
        </v-btn>


      </v-flex>
    </v-layout>

  </v-card-text>

</template>

<script>

import InfoPopup from "../partials/InfoPopup.vue"

export default {
  name: 'filter-settings',
  components: {
    InfoPopup
  },
  props: {
    filter: null,
    filterModel: null,
    idx: null,
    launchedFromClin: null
  },
  data () {
    return {
      isDirty: false,
      name: null,
      maxAf: null,
      maxHomozygotes: null,
      minRevel: null,
      selectedClinvarCategories: null,
      selectedImpacts: null,
      selectedZygosity: null,
      selectedInheritanceModes: null,
      selectedConsequences: null,
      minGenotypeDepth: null,
      minGenotypeAltCount: null,

      revelProgress: 100,

      clinvarCategories: [
        {'key': 'clinvar', 'selected': true,  value: 'clinvar_path',   text: 'Pathogenic' },
        {'key': 'clinvar', 'selected': true,  value: 'clinvar_lpath',  text: 'Likely pathogenic' },
        {'key': 'clinvar', 'selected': true,  value: 'clinvar_uc',     text: 'Uncertain significance' },
        {'key': 'clinvar', 'selected': true,  value: 'clinvar_cd',     text: 'Conflicting data'},
        {'key': 'clinvar', 'selected': false, value: 'clinvar_other',  text: 'Other' },
        {'key': 'clinvar', 'selected': false, value: 'clinvar_benign', text: 'Benign'},
        {'key': 'clinvar', 'selected': false, value: 'clinvar_lbenign',text: 'Likely benign' }
      ],
      impacts: ['HIGH', 'MODERATE', 'MODIFIER', 'LOW'],
      inheritanceModes: [
        {text: 'autosomal dominant',   value: 'autosomal dominant'},
        {text: 'recessive', value:'recessive'},
        {text: 'de novo',   value: 'denovo'},
        {text: 'compound het',   value: 'compound het'},
        {text: 'x-linked',   value: 'x-linked'}
      ],
      zygosities: ['HOM', 'HET'],
      consequences: [
        '3_prime_UTR_variant',
        '5_prime_UTR_variant',
        'coding_sequence_variant',
        'downstream_gene_variant',
        'feature_elongation',
        'feature_truncation',
        'frameshift_variant',
        'incomplete_terminal_codon_variant',
        'inframe_deletion',
        'inframe_insertion',
        'intergenic_variant',
        'intron_variant',
        'mature_miRNA_variant',
        'missense_variant',
        'NMD_transcript_variant',
        'non_coding_transcript_exon_variant',
        'non_coding_transcript_variant',
        'protein_altering_variant',
        'regulatory_region_ablation',
        'regulatory_region_amplification',
        'regulatory_region_variant',
        'splice_acceptor_variant',
        'splice_donor_variant',
        'splice_region_variant',
        'start_lost',
        'stop_gained',
        'stop_lost',
        'stop_retained_variant',
        'synonymous_variant',
        'TF_binding_site_variant',
        'TFBS_ablation',
        'TFBS_amplification',
        'transcript_ablation',
        'transcript_amplification',
        'upstream_gene_variant'
      ],
      numericRules: [
        v => {
          let valid = v ? (+v > 0.0 && +v < 1.0) : true;
          return valid || 'Freq must be between 0.0-1.0';
        }
      ],
      wholeNumRules: [
        v => {
          let valid = v ? (+v > 0) : true;
          return valid || 'Must be a whole number';
        }
      ],
      rules: {
          noDuplicates: value => !this.isDuplicateName() || 'Another filter already has this name. Please enter a filter name not already in use.'
      }
    }
  },
  methods: {
    init: function() {
      let self = this;


      let flagCriteria = this.filterModel.flagCriteria[this.filter.key];
      if (flagCriteria == null) {
        flagCriteria = {};
        flagCriteria.key = this.filter.key;
        flagCriteria.custom = true;
        flagCriteria.active = false;
        flagCriteria.name = this.filter.display;
        flagCriteria.maxAf = null;
        flagCriteria.maxHomozygotes = null;
        flagCriteria.minRevel = null;
        flagCriteria.clinvar = null;
        flagCriteria.impact = null;
        flagCriteria.consequence = null;
        flagCriteria.inheritance = null;
        flagCriteria.zygosity = null;
        flagCriteria.genotypeDepth = null;
        this.filterModel.flagCriteria[this.filter.key] = flagCriteria;
      }
      this.name                      = flagCriteria.name;
      this.key                       = flagCriteria.key + flagCriteria.name;
      this.maxAf                     = flagCriteria.maxAf;
      this.maxHomozygotes            = flagCriteria.maxHomozygotes;
      this.minRevel                  = flagCriteria.minRevel;
      this.selectedClinvarCategories = flagCriteria.clinvar;
      this.selectedImpacts           = flagCriteria.impact;
      this.selectedConsequences      = flagCriteria.consequence;
      this.selectedInheritanceModes  = flagCriteria.inheritance;
      this.selectedZygosity          = flagCriteria.zygosity;
      this.minGenotypeDepth          = flagCriteria.minGenotypeDepth;
      this.minGenotypeAltCount       = flagCriteria.minGenotypeAltCount;

      this.$nextTick(function() {
        self.isDirty = false;
      })


    },
    apply: function() {

      let flagCriteria = this.filterModel.flagCriteria[this.filter.name];

      if(this.filter.key){
        flagCriteria = this.filterModel.flagCriteria[this.filter.key];
      }

      flagCriteria.name             = this.name;
      if (flagCriteria.custom) {
        flagCriteria.title = this.name;
      }

      flagCriteria.key = this.key;
      flagCriteria.maxAf            = this.maxAf;
      flagCriteria.maxHomozygotes   = this.maxHomozygotes;
      flagCriteria.minRevel         = this.minRevel;
      flagCriteria.clinvar =          this.selectedClinvarCategories;
      flagCriteria.impact           = this.selectedImpacts;
      flagCriteria.consequence      = this.selectedConsequences;
      flagCriteria.inheritance      = this.selectedInheritanceModes;
      flagCriteria.zygosity         = this.selectedZygosity;
      flagCriteria.minGenotypeDepth = this.minGenotypeDepth;
      flagCriteria.minGenotypeAltCount = this.minGenotypeAltCount;
      flagCriteria.active           = true;

      this.isDirty = false;
      this.$emit("apply-filter")

    },
    onCancel: function() {
      this.$emit("cancel-filter")
    },
    onChangeName: function() {
      this.isDirty = true;
      this.filter.display = this.name;

    },
    isDuplicateName: function() {
      let self = this;
      if (self.filter == null || self.filter.title == null) {
        return false;
      }
      let dups = Object.keys(this.filterModel.flagCriteria).filter(function(key) {
        let filter = self.filterModel.flagCriteria[key];
        return filter.key != self.filter.key  // don't evaluate this filter entry for dups
               && filter.title == self.filter.title.trim();  // is there another filter with the same name?
      })
      return dups.length > 0;
    },
    capitalize: function(buf) {
      if (buf) {
        return this.globalApp.utility.capitalizeFirstLetter(buf.text);
      } else {
        return "";
      }
    },
  },
  computed: {
    gnomADExomesOnly: function() {
      return !this.globalApp.gnomADExtraAll;
    },
    isValidFilter: function() {
      return (!this.isDuplicateName()) &&
             (
               (this.maxAf && this.maxAf > 0 && this.maxAf < 1) ||
               (this.maxHomozygotes && this.maxHomozygotes > 0) ||
               this.minRevel ||
               (this.selectedClinvarCategories && this.selectedClinvarCategories.length > 0) ||
               (this.selectedImpacts && this.selectedImpacts.length > 0) ||
               (this.selectedConsequences && this.selectedConsequences.length > 0) ||
               (this.selectedInheritanceModes && this.selectedInheritanceModes.length > 0) ||
               (this.selectedZygosity && this.selectedZygosity.length > 0) ||
               this.minGenotypeDepth ||
               this.minGenotypeAltCount
             );

    },
    gnomADInfoPopup: function() {
      if (this.globalApp.gnomADExtraAll
       && this.globalApp.gnomADExtraMethod == this.globalApp.GNOMAD_METHOD_CUSTOM_VEP) {
        return "filterAf"
      } if (this.globalApp.gnomADExtraAll
       && this.globalApp.gnomADExtraMethod == this.globalApp.GNOMAD_METHOD_MERGE_ANNOTS) {
        return "filterAfGenomesOnly"
      } else  {
        return "filterAfExomesOnly"
      }
    }
  },
  watch: {

    maxAf: function() {
      this.isDirty = true;
    },
    maxHomozygotes: function() {
      this.isDirty = true;
    },
    selectedClinvarCategories: function() {
      this.isDirty = true;
    },
    selectedInheritanceModes: function() {
      this.isDirty = true;
    },
    selectedZygosity: function() {
      this.isDirty = true;
    },
    selectedImpacts: function() {
      this.isDirty = true;
    },
    selectedConsequences: function() {
      this.isDirty = true;
    },
    minRevel: function() {
      self = this;
      self.isDirty = true;
      if (self.minRevel != "") {
        if (self.selectedConsequences == null) {
          self.selectedConsequences = []
        }
        if (self.selectedConsequences.indexOf("missense_variant") == -1) {
          self.selectedConsequences.push("missense_variant")
        }
      }
    },
    minGenotypeDepth: function() {
      this.isDirty = true;
    },
    minGenotypeAltCount: function() {
      this.isDirty = true;
    }
  },
  created: function() {
  },
  mounted: function() {
  }
}
</script>
