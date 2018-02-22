<style lang="sass">
@import ../../../assets/sass/variables

#known-variants-toolbar
  display: inline-block
  padding-top: 0px
  float: left
  margin-left: 20px

  .input-group.radio
    margin-top: 0px
    margin-bottom: 0px

  .radio label
    line-height: 20px
    left: 28px
    font-size: 12px


  .input-group.radio-group
    padding-top: 0px

  .input-group__selections__comma
    font-size: 12px

  .input-group--select
    .input-group__input
      margin-top: 10px

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
      <div style="width:180px;float:left;padding-top:10px;margin-top:0px">
        <v-radio-group v-model="viz" row>
              <v-radio label="Variants" value="variants"></v-radio>
              <v-radio label="Counts" value="counts"></v-radio>
        </v-radio-group>
      </div>


      <div id="clinvar-filter-box" style="margin-left:10px;width:400px;float:left">
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
  },
  data () {
    return {
      VIZ_VARIANTS: 'variants',
      VIZ_COUNTS: 'counts',
      VIZ_NONE: 'none',

      CHART_TYPE_EXON: 'exon-bar',
      CHART_TYPE_AREA: 'area',
      CHART_TYPE_BAR: 'bar',

      VARIANT_DISPLAY_THRESHOLD: 300,

      BIN_SPAN:  {'bar': +6, 'exon-bar': +2,  'area': +6},
      BAR_WIDTH:  {'bar': +6, 'exon-bar': +6,  'area': +6},

      viz: null,
      chart: null,
      chartType: null,
      areaChart: null,
      barChart: null,
      tooManyVariants: false,

      categories: [
        {'key': 'clinvar', 'selected': true,  value: 'clinvar_path',   text: 'Pathogenic' },
        {'key': 'clinvar', 'selected': true,  value: 'clinvar_lpath',  text: 'Likely pathogenic' },
        {'key': 'clinvar', 'selected': true,  value: 'clinvar_uc',     text: 'Uncertain significance' },
        {'key': 'clinvar', 'selected': true,  value: 'clinvar_cd',     text: 'Conflicting data'},
        {'key': 'clinvar', 'selected': false, value: 'clinvar_other',  text: 'Other' },
        {'key': 'clinvar', 'selected': false, value: 'clinvar_benign', text: 'Benign'},
        {'key': 'clinvar', 'selected': false, value: 'clinvar_lbenign',text: 'Likely benign' }
      ],
      selectedCategories: ['clinvar_path', 'clinvar_lpath']

    }
  },
  watch: {
    viz: function() {
      this.$emit("knownVariantsVizChange", this.viz);
    },
    selectedCategories: function() {
      this.$emit("knownVariantsFilterChange", this.selectedCategories);
    }

  },
  methods: {
  },
  mounted: function() {
    this.viz = this.VIZ_VARIANTS;
    this.chartType = this.CHART_TYPE_EXON;
    this.$emit("knownVariantsFilterChange", this.selectedCategories);
  }
}

</script>