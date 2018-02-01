<style lang="sass">
@import ../../../assets/sass/variables

#known-variants-toolbar
  display: inline-block
  padding-top: 0px
  float: left

  #clinvar-filter-box
    .input-group--select
      .input-group__selections__comma
        font-size: 14px
        padding: 0px 0px 0px 0px

    .input-group
      label
        font-size: 14px
        line-height: 25px
        height: 25px

    .input-group__input
      min-height: 0px
      margin-top: 10px

    .input-group__input
      .input-group__selections__comma
        font-size: 14px

    .input-group--text-field
      label
        top: 6px

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
      <div style="width:310px;float:left;margin-top:0px">
        <v-radio-group v-model="viz" row>
              <v-radio label="Variants" value="variants"></v-radio>
              <v-radio label="Counts" value="counts"></v-radio>
              <v-radio label="None" value="none"></v-radio>
        </v-radio-group>
      </div>


      <div id="clinvar-filter-box" style="margin-left:10px;width:400px;float:left">
        <v-select
                label="Filter"
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
      selectedCategories: []
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
    this.viz = this.VIZ_NONE;
    this.chartType = this.CHART_TYPE_EXON;
  }
}

</script>