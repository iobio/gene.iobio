
<style lang="sass" >

.filter-form
  .input-group
    label
      font-size: 13px

</style>

<template>
  <v-menu
  id="filter-menu"
  offset-y
  :close-on-content-click="false"
  :close-on-click="false"
  :nudge-width="500"
  v-model="showFilterMenu"
  >

    <v-btn slot="activator" v-if="!showAddActivator" v-bind:class="showAddActivator ? 'hide' : ''" fab small flat>
      <v-icon  >more_vert</v-icon>
    </v-btn>

    <v-btn slot="activator" v-if="showAddActivator" v-bind:class="!showAddActivator ? 'hide' : ''" fab medium flat>
      <v-icon color="grey darken-2">add</v-icon>
    </v-btn>



      <v-layout row wrap class="filter-form mt-3 mx-2 px-2" style="max-width:500px;">
         <v-flex id="name" xs12 class="mb-3" >
          <v-text-field label="Name"  v-model="name" hide-details>
          </v-text-field>
        </v-flex>

        <v-flex id="max-af" xs4 class="mb-3" >
          <v-text-field label="Max Allele Freq" suffix="%" v-model="maxAf" hide-details>
          </v-text-field>
        </v-flex>
        <v-flex xs4>
        </v-flex>
        <v-flex  id="max-genotype-depth" xs4 class="mb-3" >
          <v-text-field label="Min Coverage"  suffix="X" v-model="minGenotypeDepth" hide-details>
          </v-text-field>
        </v-flex>

        <v-flex xs12 class="mb-3" >
          <v-select
                label="Clinical significance"
                v-bind:items="clinvarCategories"
                v-model="selectedClinvarCategories"
                multiple
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
                hide-details
          >
          </v-select>
        </v-flex>


        <v-flex xs12 class="mt-1 text-xs-right">
          <v-btn
            @click="onApply">
            Apply
          </v-btn>

          <v-btn @click="onCancel">
           Cancel
         </v-btn>
        </v-flex>
      </v-layout>


  </v-menu>
</template>

<script>



export default {
  name: 'filter-menu',
  components: {
  },
  props: {
    badge: null,
    filterModel: null,
    showAddActivator: false,
    showMenu: null,
    idx: null
  },
  data () {
    return {
      showFilterMenu: false,

      theBadge: null,

      name: null,
      maxAf: null,
      selectedClinvarCategories: null,
      selectedImpacts: null,
      selectedZygosity: null,
      selectedInheritanceModes: null,
      selectedConsequences: null,
      minGenotypeDepth: null,

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
        {text: 'recessive', value:'recessive'},
        {text: 'de novo',   value: 'denovo'}
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
  watch: {
    showFilterMenu: function() {
      if (this.showFilterMenu) {
        if (this.badge == 'add-custom') {
          this.theBadge = 'custom' + this.idx;
        }


        this.$emit("filter-menu-open", this.theBadge);

        let flagCriteria = this.filterModel.flagCriteria[this.theBadge];
        if (flagCriteria == null) {
          flagCriteria = {};
          flagCriteria.custom = true;
          flagCriteria.active = false;
          flagCriteria.name = 'unknown';
          flagCriteria.maxAf = null;
          flagCriteria.clinvar = null;
          flagCriteria.impact = null;
          flagCriteria.consequence = null;
          flagCriteria.inheritance = null;
          flagCriteria.zygosity = null;
          flagCriteria.genotypeDepth = null;
          this.filterModel.flagCriteria[this.theBadge] = flagCriteria;
        }
        this.name                      = flagCriteria.name;
        this.maxAf                     = flagCriteria.maxAf ? flagCriteria.maxAf * 100 : null;
        this.selectedClinvarCategories = flagCriteria.clinvar;
        this.selectedImpacts           = flagCriteria.impact;
        this.selectedConsequences      = flagCriteria.consequence;
        this.selectedInheritanceModes  = flagCriteria.inheritance;
        this.selectedZygosity          = flagCriteria.zygosity;
        this.minGenotypeDepth          = flagCriteria.minGenotypeDepth;


      }
    },
    showMenu: function() {
      if (this.showMenu) {
        this.showFilterMenu = true;
      }
    }
  },
  methods: {
    onApply: function() {
      let flagCriteria = this.filterModel.flagCriteria[this.theBadge];

      flagCriteria.name             = this.name;
      flagCriteria.maxAf            = this.maxAf ? this.maxAf / 100 : null;
      flagCriteria.clinvar          = this.selectedClinvarCategories;
      flagCriteria.impact           = this.selectedImpacts;
      flagCriteria.consequence      = this.selectedConsequences;
      flagCriteria.inheritance      = this.selectedInheritanceModes;
      flagCriteria.zygosity         = this.selectedZygosity;
      flagCriteria.minGenotypeDepth = this.minGenotypeDepth;
      flagCriteria.active           = true;

      this.$emit("filter-applied", this.theBadge);

      this.showFilterMenu = false;
    },
    onCancel: function() {
      this.showFilterMenu = false;
    },
    close: function() {
      this.showFilterMenu = false;
    }
  },
  computed: {
  },
  created: function() {
    this.theBadge = this.badge;
  },
  mounted: function() {
  }
}
</script>
