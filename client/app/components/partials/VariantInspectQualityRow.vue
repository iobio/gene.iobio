<style lang="sass" >
@import ../../../assets/sass/variables
#variant-inspect
  .variant-inspect-body
    .variant-quality-row
      display: flex
      flex-direction: row
      font-size: 13px
      margin-bottom: 10px


      .variant-text
        line-height: 15px
        max-width: 120px

      a
        color:  $link-color !important
        cursor: pointer
        font-size: 13px !important

      &.no-icon
        padding-left: 22px

      &.no-top-margin
        margin-top: -10px
        font-size: 12px

      .material-icons
        font-size: 22px
        margin-right: 4px
        color: $unremarkable-color
        margin-top: -2px
        align-self: flex-start

        &.poor
          color: $level-high-color
          font-size: 28px
        &.moderate
          color: $moderate-impact-color
          font-size: 28px
        &.good
          color: $success-color

      .material-icons.link-icon
        font-size: 14px
        margin-left: -1px
        margin-right: 0px
        color: $link-color
        margin-bottom: 2px






</style>

<template>
  <div class="variant-quality-row">
    <v-icon :class="info.clazz">
      {{ info.clazz == 'good' ? 'check_circle' : ( info.clazz == 'poor' ? 'warning' : 'warning') }}
    </v-icon>

    <span class="variant-text">
      {{ info.reason }}
    </span>
  </div>
</template>


<script>

export default {
  name: 'variant-inspect-quality-row',
  components: {
  },
  props: {
    info: null,
  },
  data() {
    return {
    }
  },


  methods: {


  },


  computed: {

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