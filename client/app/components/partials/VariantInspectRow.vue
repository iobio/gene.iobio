<style lang="sass" >
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
        color:  $link-color !important
        cursor: pointer
        font-size: 13px !important

      &.no-icon
        padding-left: 22px

        span
          line-height: 14px
          padding-top: 4px

      &.no-top-margin
        margin-top: -10px
        font-size: 12px

      .material-icons
        font-size: 18px
        margin-right: 4px
        color: $unremarkable-color
        margin-top: -2px

        &.level-high
          color: $level-high-color
        &.level-medium
          color: $moderate-impact-color
        &.sufficient
          color: $success-color
        &.level-unremarkable
          color: $not-significant-color

      .material-icons.link-icon
        font-size: 14px
        margin-left: -1px
        margin-right: 0px
        color: $link-color
        margin-bottom: 2px

      .chip, .v-chip
        vertical-align: top
        margin-top: 0px
        margin-bottom: 0px
        margin-right: 0px
        .chip__content, .v-chip__content
          padding: 0 0px
          height: 15px
          width: 34px
          font-size: 12px
          justify-content: center
          color: $text-color
        &.high
          .chip__content, .v-chip__content
            background-color:  $danger-color
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
    <v-icon v-if="clazz != 'level-unremarkable'" :class="clazz">
      check_circle
    </v-icon>
    <app-icon v-if="clazz == 'level-unremarkable'" :class="clazz" width="18" height="18" style="padding-right: 4px" icon="not-significant">
    </app-icon>

    <span class="variant-text">
      {{ capitalize(value) }} {{ label }}
      <a style="padding-left:4px" v-if="link" :href="link" :target="target">
        <v-icon class="link-icon">open_in_new</v-icon>
      </a>
    </span>
  </div>
</template>


<script>

import AppIcon                  from "../partials/AppIcon.vue"

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
    return {
    }
  },


  methods: {

    capitalize: function(buf) {
      if (buf) {
        return this.globalApp.utility.capitalizeFirstLetter(buf);
      } else {
        return "";
      }
    },


  },


  computed: {
    target: function() {
      if (this.label && this.label.length > 0) {
        return this.label.split(" ").join("_");
      } else {
        return "_target";
      }
    }

  },

  watch: {

  },

  filters: {




  },

  updated: function() {

  },

  mounted: function() {
  },

  created: function() {
  }


}
</script>