<style lang="sass">
@import ../../../assets/sass/variables

#sfari-variants-toolbar
  display: inline-block
  padding-top: 0px
  margin-left: 10px
  margin-top: -6px

  .input-group.radio
    margin-top: 0px
    margin-bottom: 0px

  .radio label
    line-height: 20px
    left: 24px
    font-size: 12px

  .v-input--radio-group
    height: 30px
    margin-top: 0px
    padding-top: 0px

    .v-input--radio-group__input
      label
        margin-bottom: 0px
        font-size: 14px

      .v-select__selection--comma 
        color: $text-color
        font-size: 13px

  .v-select__selection.v-select__selection--comma
    color: $text-color
    font-size: 13px

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



#select-sfari-variants-filter-box
  width: 200px
  display: inline-block
  margin-left: 0px
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
    <div id="sfari-variants-toolbar">
      <div id="sfari-filter-box" style="width:200px;float:left"
       v-if="viz === 'variants'">
        <v-select
                label="Filter by impact..."
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
  name: 'sfari-variants-toolbar',
  components: {
  },
  props: {
  },
  data () {
    return {

      VARIANT_DISPLAY_THRESHOLD: 300,

      viz: null,

      categories: [
        {'key': 'vepImpact', 'selected': true,  value: 'HIGH',   text: 'High' },
        {'key': 'vepImpact', 'selected': true,  value: 'MODERATE',  text: 'Moderate' },
        {'key': 'vepImpact', 'selected': false,  value: 'MODIFIER',     text: 'Modifier' },
        {'key': 'vepImpact', 'selected': false,  value: 'LOW',     text: 'Low'}
      ],
      selectedCategories: ['HIGH', 'MODERATE']

    }
  },
  watch: {
    viz: function() {
      this.$emit("sfariVariantsVizChange", this.viz);
    },
    selectedCategories: function() {
      this.$emit("sfariVariantsFilterChange", this.selectedCategories);
    }

  },
  methods: {
  },
  mounted: function() {
    this.viz = 'variants';
    this.$emit("sfariVariantsFilterChange", this.selectedCategories);
  }
}

</script>