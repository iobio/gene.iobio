<style lang="sass">
@import ../../../assets/sass/variables

#alert-panel
  margin-left: 10px
  margin-right: 10px
  margin-top: 5px
  margin-bottom: 0px

  pre 
    display: inline-block
    vertical-align: top
    padding-top: 0px
    padding-bottom: 0px
    font-size: 13px
    color: black
    margin-bottom: 0px

  .alert-title
    color:  $app-color
    font-size: 15px

  .v-alert 
    font-size: 12px 
    padding: 4px
    border: none !important

    .v-alert__icon
      margin-right: 8px !important
      font-size: 18px !important
      align-self: flex-start !important

    div 
      padding-right: 10px
      max-width: 280px
      overflow-wrap: break-word

    &.success--text
      div
        color: $text-color !important
    &.info--text
      div
        color: $text-color !important
    &.warning--text
      div
        color: $text-color !important
    &.coverage--text
      div
        color: $coverage-problem-color !important
    &.error--text
      border-color: #b32f2f !important
      border-style: solid !important
      border-width: 0.5px !important
      color: $danger-color !important
      div
        color: $text-color !important
        font-weight: 500 !important

    .show-details-button, .hide-details-button
      margin: 0px
      margin-top: 0px
      height: 20px
      font-size: 11px
      max-width: 56px
      .v-btn__content
        padding-right: 0px
        color: $link-color !important
</style>

<template>
  <div id="alert-panel" >



    <div class="alert-title"  :style="isBasicMode || isSimpleMode ? 'margin-bottom:10px;' : 'margin-bottom:20px'">
    Notifications
    </div>

    <v-alert v-for="alert in appAlerts"
      class="alert-item"
      :key="alert.key"
      :value="true"
      :color="getColor(alert)"
      :icon="getIcon(alert)"
      :outline="true"
      
    >
      <div v-html="alert.message"></div>

      <div v-if="alert.details" style="padding-right:0px ;margin-top:-2px;display:flex;justify-content:flex-end" >
        <v-btn v-if="!alert.showDetails" class="show-details-button" flat @click="alert.showDetails = true">
          Show details
        </v-btn>
        <v-btn v-if="alert.showDetails" class="hide-details-button" flat @click="alert.showDetails = false">
          Hide details
        </v-btn>
      </div>
      <div v-if="alert.showDetails" >
        <div v-for="detail, detailIndex in alert.details" :key="detailIndex" v-html="detail">
        </div>
      </div>
    </v-alert>
    

  </div>
</template>

<script>


export default {
  name: 'alert-panel',
  components: {
  },
  props: {
    isBasicMode: null,
    isSimpleMode: null,
    appAlerts: null
  },
  data () {
      return {
      }
  },
  watch: {
  },
  computed: {
  },
  methods: {

    getIcon: function(alert) {
      if (alert.type == 'success') {
        return 'check_circle'
      } else if (alert.type == 'info') {
        return 'info'
      } else if (alert.type == 'warning') {
        return 'warning'
      } else if (alert.type == 'coverage') {
        return 'trending_down'
      } else if (alert.type == 'error') {
        return 'error'
      } 
    },
    getColor: function(alert) {
      if (alert.type == 'success') {
        return 'success'
      } else if (alert.type == 'info') {
        return 'info'
      } else if (alert.type == 'warning') {
        return 'warning'
      } else if (alert.type == 'coverage') {
        return 'info'
      } else if (alert.type == 'error') {
        return 'error'
      } 
    }
  },
  mounted: function() {
  }
}

</script>