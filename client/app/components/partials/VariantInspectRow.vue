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

      a
        color:  $link-color !important
        cursor: pointer
        font-size: 13px !important

      &.no-icon
        padding-left: 20px

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

      .material-icons.link-icon
        font-size: 14px
        margin-left: -1px
        margin-right: 0px
        color: $link-color
        margin-bottom: 2px

      .chip
        margin-top: 0px
        margin-bottom: 0px
        margin-right: 0px
        .chip__content
          padding: 0 0px
          height: 15px
          width: 34px
          font-size: 12px
          justify-content: center
        &.high
          .chip__content
            background-color:  $danger-color

      .pheno-source
        width: 40px
        display: inline-block
        font-size: 12px
        font-style: italic

      .pheno-search-term


</style>

<template>
  <div class="variant-row">
    <v-icon :class="clazz">{{ clazz == 'level-unremarkable' ? 'remove_circle_outline' : 'check_circle' }} </v-icon>

    <span class="variant-text">
      {{ capitalize(value) }} {{ label }}
      <a style="padding-left:4px" v-if="link" :href="link" :target="target">
        <v-icon class="link-icon">open_in_new</v-icon>
      </a>
    </span>
  </div>
</template>


<script>

export default {
  name: 'variant-inspect-row',
  components: {
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