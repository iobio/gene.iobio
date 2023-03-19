<style lang="sass">
@import ../../../assets/sass/variables

#known-variants-toolbar
  display: inline-block
  padding-top: 0px
  margin-left: 0px
  margin-top: 4px

  .v-input--radio-group
    height: 30px
    margin-top: 0px
    padding-top: 0px

    .v-input--radio-group__input
      label
        margin-bottom: 0px
        font-size: 13px

      .v-select__selection--comma 
        color: $text-color
        font-size: 13px

  .v-select__selection.v-select__selection--comma
    color: $text-color
    font-size: 13px


  #clinvar-filter-box
    margin-top: 3px
    margin-left: 10px
    width: 400px
    float: left

  .input-group.radio
    margin-top: 0px
    margin-bottom: 0px

  .radio label
    line-height: 20px
    left: 24px
    font-size: 12px
    padding-top: 5px


  .input-group.radio-group
    padding-top: 0px

  .input-group__selections__comma
    font-size: 12px

  .input-group--select
    .input-group__input
      margin-top: -5px

  .input-group--text-field
    label
      font-size: 12px
      top: 5px

  .input-group--text-field.input-group--dirty.input-group--select
    label
      top: 18px
      -webkit-transform: translate(0, -20px) scale(0.75)
      transform: translate(0, -20px) scale(0.75)

  .input-group--text-field.input-group--dirty:not(.input-group--textarea)
    label
      top: 18px
      -webkit-transform: translate(0, -20px) scale(0.75)
      transform: translate(0, -20px) scale(0.75)



  text
    color: $text-color
    fill:  $text-color
    font-size: 12px

  svg.known-variants-clinvar
    margin-right:  10px



#select-known-variants-filter-box
  min-width: 200px
  max-width: 500px
  display: inline-block
  margin-left: 10px
  float: left

  .selectize-input
    input
      width: 120px !important


      &::-webkit-input-placeholder
        font-size: 12px !important

      &::-moz-placeholder
        font-size: 12px !important

      &input:-moz-placeholder
        font-size: 12px !important

    &.has-items
      input
        width: 4px !important

  .selectize-control.multi
    .selectize-input.has-items
      padding: 3px 8px 0px
</style>

<template>
    <div id="known-variants-toolbar">
      <div style="width:450px;float:left;padding-top:5px;margin-top:0px;margin-right:10px">
        <v-radio-group v-model="viz" row style="height:30px">
            <v-radio label="Variants" :hide-details="true" value="variants"></v-radio>
            <v-radio label="Counts" :hide-details="true" value="histo"></v-radio>
            <v-radio style="min-width: 125px" :hide-details="true" label="Counts in Exons" value="histoExon"></v-radio>
        </v-radio-group>
      </div>


      <div id="clinvar-filter-box"
       v-if="viz == 'variants'">
        <v-select
                label="Filter by clinical significance..."
                v-bind:items="categories"
                v-model="selectedCategories"
                multiple
        >
        </v-select>
      </div>
    </div>
</template>

<script>

export default {
  name: 'known-variants-toolbar',
  components: {
  },
  props: {
    forceViz: null
  },
  data () {
    return {

      VARIANT_DISPLAY_THRESHOLD: 300,

      viz: null,

      categories: [
        {'key': 'clinvar', 'selected': true,  value: 'clinvar_path',   text: 'Pathogenic' },
        {'key': 'clinvar', 'selected': true,  value: 'clinvar_lpath',  text: 'Likely pathogenic' },
        {'key': 'clinvar', 'selected': false,  value: 'clinvar_uc',     text: 'Uncertain significance' },
        {'key': 'clinvar', 'selected': false, value: 'clinvar_lbenign',text: 'Likely benign' },
        {'key': 'clinvar', 'selected': false, value: 'clinvar_benign', text: 'Benign' },
        {'key': 'clinvar', 'selected': false, value: 'clinvar_affects', text: 'Affects', description: 'For variants that cause a non-disease phenotype, such as lactose intolerance' },
        {'key': 'clinvar', 'selected': false, value: 'clinvar_assoc', text: 'Association', description: 'For variants identified in a GWAS study and further interpreted for their clinical significance' },
        {'key': 'clinvar', 'selected': false, value: 'clinvar_no_assoc', text: 'Association not found' },
        {'key': 'clinvar', 'selected': false, value: 'clinvar_confers_sens', text: 'Confers sensitivity' },
        {'key': 'clinvar', 'selected': false,  value: 'clinvar_cd',     text: 'Conflicting interpretations', description: 'Only for submissions from a consortium, where groups within the consortium have conflicting intepretations of a variant but provide a single submission to ClinVar' },
        {'key': 'clinvar', 'selected': false, value: 'clinvar_drug_resp', text: 'Drug response', description: 'A general term for a variant that affects a drug response, not a disease' },
        {'key': 'clinvar', 'selected': false, value: 'clinvar_other',  text: 'Other' },
        {'key': 'clinvar', 'selected': false, value: 'clinvar_not_provided', text: 'Not provided' },
        {'key': 'clinvar', 'selected': false, value: 'clinvar_protective', text: 'Protective', description: 'For variants that decrease the risk of a disorder, including infections' },
        {'key': 'clinvar', 'selected': false, value: 'clinvar_risk_factor', text: 'Risk factor', description: 'For variants that are interpreted not to cause a disorder but to increase the risk' },
      ],
      selectedCategories: ['clinvar_path', 'clinvar_lpath']
    }
  },
  watch: {
    viz: function() {
      this.$emit("knownVariantsVizChange", this.viz, this.selectedCategories);
    },
    selectedCategories: function() {
      this.$emit("knownVariantsFilterChange", this.selectedCategories);
    },
    forceViz: function(newViz) {
      let self = this;
      if (newViz && self.viz != newViz) {
        self.viz = newViz
      }
    }

  },
  methods: {
  },
  mounted: function() {
    this.viz = 'variants';
    this.$emit("knownVariantsFilterChange", this.selectedCategories);
  }
}

</script>