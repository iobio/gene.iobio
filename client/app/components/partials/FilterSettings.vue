
<style lang="sass" >

@import ../../../assets/sass/variables

.filter-form
  .input-group
    label
      font-size: 13px

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

</style>

<template>

  <v-layout row wrap class="filter-form mx-2 px-2" style="max-width:520px;">
     <v-flex id="name" xs12 class="mb-3" >
      <v-text-field label="Name"  @input="onChangeName" v-model="name" hide-details>
      </v-text-field>
    </v-flex>

    <v-flex id="max-af" xs3 class="mb-3 mr-4" >
      <v-text-field label="Max Allele Freq" suffix="%" v-model="maxAf" hide-details>
      </v-text-field>
    </v-flex>


    <v-flex xs12 class="mb-3" >
      <v-select style="z-index:10"
            label="ClinVar clinical significance"
            v-bind:items="clinvarCategories"
            v-model="selectedClinvarCategories"
            multiple
            hide-details
      >
      </v-select>
    </v-flex>

    <v-flex xs6 class="mb-3">
      <v-select
            label="Inheritance"
            v-bind:items="inheritanceModes"
            v-model="selectedInheritanceModes"
            multiple
            hide-details
      >
      </v-select>
    </v-flex>

    <v-flex xs6 class="pl-2 mb-3">
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





    <v-flex xs6 class="mb-3" >
      <v-select
            label="Impact"
            v-bind:items="impacts"
            v-model="selectedImpacts"
            multiple
            hide-details
      >
      </v-select>
    </v-flex>

    <v-flex xs6 class="pl-2 mb-3" >
      <v-select
            label="Consequence"
            v-bind:items="consequences"
            v-model="selectedConsequences"
            multiple
            autocomplete
            hide-details
      >
      </v-select>
    </v-flex>

    <v-flex id="min-revel" xs12 class="mb-2 mt-2 mr-4" >

          <div style="display: inline-block;margin-right:15px">
            Min REVEL score
            <info-popup name="revel"></info-popup>
          </div>

          <div style="display:inline-block">
            <v-slider step="5" snap :hide-details="true" style="padding:0px;width:200px;"  snap v-model="minRevelSlider">
            </v-slider>
            <v-progress-linear class="revel-progress-bar" style="float:left;margin:0px;padding:0px;width:100px;display:inline-block" v-model="revelProgress">
            </v-progress-linear>
            <v-progress-linear class="revel-progress-bar revel_moderate" style="float:left;margin:0px;padding:0px;width:50px;display:inline-block" v-model="revelProgress">
            </v-progress-linear>
            <v-progress-linear class="revel-progress-bar revel_high" style="float:left;margin:0px;padding:0px;width:50px;display:inline-block" v-model="revelProgress">
            </v-progress-linear>
          </div>

          <v-text-field :hide-details="true"  style="margin-left: 10px;vertical-align:top;width:50px;display:inline-block" v-model="minRevel"
          @change="onChangeRevelScore" >
          </v-text-field>

    </v-flex>

    <v-flex  id="min-genotype-depth" xs3 class="mb-3 mr-4" >
      <v-text-field label="Min Coverage"  suffix="X" v-model="minGenotypeDepth" hide-details>
      </v-text-field>
    </v-flex>

    <v-flex  id="min-genotype-alt-count" xs4 class="mb-3 mr-4" >
      <v-text-field label="Min Alt Count"  suffix="" v-model="minGenotypeAltCount" hide-details>
      </v-text-field>
    </v-flex>





  </v-layout>

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
    idx: null
  },
  data () {
    return {
      theFilter: null,

      name: null,
      maxAf: null,
      minRevel: null,
      minRevelSlider: null,
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
        'transcript_ablation',
        'splice_acceptor_variant',
        'splice_donor_variant',
        'stop_gained',
        'frameshift_variant',
        'stop_lost',
        'start_lost',
        'transcript_amplification',
        'inframe_insertion',
        'inframe_deletion',
        'missense_variant',
        'protein_altering_variant',
        'splice_region_variant',
        'incomplete_terminal_codon_variant',
        'stop_retained_variant',
        'synonymous_variant',
        'coding_sequence_variant',
        'mature_miRNA_variant',
        '5_prime_UTR_variant',
        '3_prime_UTR_variant',
        'non_coding_transcript_exon_variant',
        'intron_variant',
        'NMD_transcript_variant',
        'non_coding_transcript_variant',
        'upstream_gene_variant',
        'downstream_gene_variant',
        'TFBS_ablation',
        'TFBS_amplification',
        'TF_binding_site_variant',
        'regulatory_region_ablation',
        'regulatory_region_amplification',
        'feature_elongation',
        'regulatory_region_variant',
        'feature_truncation',
        'intergenic_variant'
      ]
    }
  },
  methods: {
    init: function() {

      let flagCriteria = this.filterModel.flagCriteria[this.theFilter.name];
      if (flagCriteria == null) {
        flagCriteria = {};
        flagCriteria.custom = true;
        flagCriteria.active = false;
        flagCriteria.name = this.theFilter.display;
        flagCriteria.maxAf = null;
        flagCriteria.minRevel = null;
        flagCriteria.clinvar = null;
        flagCriteria.impact = null;
        flagCriteria.consequence = null;
        flagCriteria.inheritance = null;
        flagCriteria.zygosity = null;
        flagCriteria.genotypeDepth = null;
        this.filterModel.flagCriteria[this.theFilter.name] = flagCriteria;
      }
      this.name                      = flagCriteria.name;
      this.maxAf                     = flagCriteria.maxAf ? flagCriteria.maxAf * 100 : null;
      this.minRevel                  = flagCriteria.minRevel ? flagCriteria.minRevel : null;
      this.minRevelSlider            = flagCriteria.minRevel ? flagCriteria.minRevel * 100 : null;
      this.selectedClinvarCategories = flagCriteria.clinvar;
      this.selectedImpacts           = flagCriteria.impact;
      this.selectedConsequences      = flagCriteria.consequence;
      this.selectedInheritanceModes  = flagCriteria.inheritance;
      this.selectedZygosity          = flagCriteria.zygosity;
      this.minGenotypeDepth          = flagCriteria.minGenotypeDepth;
      this.minGenotypeAltCount       = flagCriteria.minGenotypeAltCount;

    },
    apply: function() {
      let flagCriteria = this.filterModel.flagCriteria[this.theFilter.name];

      flagCriteria.name             = this.name;
      if (flagCriteria.custom) {
        flagCriteria.title = this.name;
      }
      flagCriteria.maxAf            = this.maxAf ? this.maxAf / 100 : null;
      flagCriteria.minRevel         = this.minRevel;
      flagCriteria.clinvar          = this.selectedClinvarCategories;
      flagCriteria.impact           = this.selectedImpacts;
      flagCriteria.consequence      = this.selectedConsequences;
      flagCriteria.inheritance      = this.selectedInheritanceModes;
      flagCriteria.zygosity         = this.selectedZygosity;
      flagCriteria.minGenotypeDepth = this.minGenotypeDepth;
      flagCriteria.minGenotypeAltCount = this.minGenotypeAltCount;
      flagCriteria.active           = true;

    },
    onChangeName: function() {
      this.theFilter.display = this.name;
    },
    onChangeRevelScore: function() {
      this.minRevelSlider = this.minRevel * 100;
    }
  },
  computed: {
  },
  watch: {
    minRevelSlider: function() {
      this.minRevel = this.minRevelSlider > 0 ? this.minRevelSlider / 100 : "";
    }
  },
  created: function() {
  },
  mounted: function() {
    this.theFilter = this.filter;
    this.init();
  }
}
</script>
