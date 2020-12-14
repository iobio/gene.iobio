<style lang="sass">
@import ../../../assets/sass/variables
#variant-inspect
  .variant-inspect-body
    .variant-row
      display: flex
      flex-direction: row
      font-size: 13px
      margin-bottom: 10px


      .variant-text
        line-height: 15px
        max-width: 190px

      a
        color: $link-color !important
        cursor: pointer
        font-size: 13px !important

      &.no-icon
        padding-left: 22px

        span
          line-height: 14px
          padding-top: 4px

      &.no-top-margin
        margin-top: -10px

      &.small-font
        font-size: 12px

      .material-icons
        font-size: 22px
        margin-right: 4px
        color: $unremarkable-color
        margin-top: -3px

        &.level-high
          color: $level-high-color

        &.level-medium
          color: $moderate-impact-color

        &.sufficient
          color: $success-color

        &.level-unremarkable
          color: $not-significant-color

      .material-icons.link-icon
        font-size: 15px
        margin-top: -2px
        margin-left: -1px
        margin-right: 0px
        color: $link-color

      .chip, .v-chip
        vertical-align: top
        margin-top: 0px
        margin-bottom: 0px
        margin-right: 0px

        .chip__content, .v-chip__content
          padding: 10px !important
          height: 18px !important
          width: 70px !important
          font-size: 11px !important
          justify-content: center
          color: $text-color

        &.high
          .chip__content, .v-chip__content
            background-color: $danger-color
            color: white

      .pheno-source
        width: 40px
        display: inline-block
        font-size: 12px
        font-style: italic
        vertical-align: top

      .pheno-search-term


</style>

<template>
  <div class="variant-row">
    <span v-if="label === 'ClinVar'">
      <app-icon :class="getClinVarClass(value)" width="16" height="16" icon="clinvar" style="margin-right: 1px !important"></app-icon>
    </span>

    <app-icon v-if=" label !== 'ClinVar'" :class="getEvidenceClass(clazz, value)" width="19" height="19" icon="evidence"></app-icon>


    <div v-if="clazz === 'level-unremarkable'" style="padding-left: 4px">
    <span class="variant-text">
      {{ capitalize(value) }} {{ label }}
      <a style="padding-left:4px" v-if="link" :href="link" :target="target">
        <v-icon class="link-icon">open_in_new</v-icon>
      </a>
    </span>
    </div>

    <span class="variant-text" v-if="clazz !== 'level-unremarkable'" style="padding-top: 2px; padding-left: 4px">
      {{ capitalize(value) }} {{ label }}
      <a style="padding-left:4px" v-if="link" :href="link" :target="target">
        <v-icon class="link-icon">open_in_new</v-icon>
      </a>
    </span>

  </div>
</template>


<script>

import AppIcon from "../partials/AppIcon.vue"

export default {
  name: 'variant-inspect-row',
  components: {
    AppIcon
  },
  props: {
    value: null,
    label: null,
    clazz: null,
    link: null
  },
  data() {
    return {}
  },


  methods: {

    capitalize: function (buf) {
      if (buf) {
        return this.globalApp.utility.capitalizeFirstLetter(buf);
      } else {
        return "";
      }
    },

    //Todo: refactor to return Pathogenic evidence impact based on evidence
    getEvidenceClass: function(clazz, evidence){
      return clazz
    },

    getClinVarClass: function(val){
      if(val === "Pathogenic"){
        return "level-high";
      }
      else if(val === "Pathogenic/likely pathogenic"){
        return "level-likely-high";
      }
      else if (val === "Likely pathogenic"){
        return "level-likely-high";
      }
      else if (val === "Uncertain significance"){
        return "level-unknown-significance";
      }
      else if (val === "Likely benign"){
        return "level-likely-low";
      }
      else if (val === "Benign/likely benign"){
        return "level-likely-low";
      }
      else if(val === "Conflicting interpretations of pathogenicity"){
        return "level-conflicting";
      }
      else if(val === "Benign"){
        return "level-low"
      }
      else{
        return "level-other"
      }
    },


  },

  computed: {
    target: function () {
      if (this.label && this.label.length > 0) {
        return this.label.split(" ").join("_");
      } else {
        return "_target";
      }
    }

  },

  watch: {},

  filters: {},

  updated: function () {

  },

  mounted: function () {
  },

  created: function () {
  }


}
</script>
