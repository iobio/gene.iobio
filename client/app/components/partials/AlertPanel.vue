<style lang="sass">
@import ../../../assets/sass/variables

#alert-panel
  margin-left: 10px
  margin-right: 10px
  margin-top: 5px
  margin-bottom: 0px

  .alert-item
    clear: both

  #clear-all-button
    margin: 0px
    height: 20px
    float: right
    padding-left: 3px 
    padding-right: 3px
    min-width: 50px
    max-width: 50px
    margin-right: 0px

    .v-btn__content
      color: $link-color
      font-size: 12px

  #clear-alert-button
    max-width: 20px
    min-width: 20px
    max-height: 20px
    margin: 0
    float: right
    padding-left: 3px 
    padding-right: 3px

    .v-btn__content
      padding-right: 0px !important

      i.material-icons
        color: $text-color !important
        font-size: 13px

  pre 
    display: inline-block
    vertical-align: top
    padding-top: 0px
    padding-bottom: 0px
    font-size: 11px
    color: black
    margin-bottom: 0px
    padding-left: 2px 
    padding-right: 2px
    white-space: normal

  .alert-title
    color:  $app-color
    font-size: 15px
    margin-bottom: 10px

  .v-alert 
    font-size: 12px 
    padding: 4px
    border: none !important

    .v-alert__icon
      margin-right: 8px !important
      font-size: 18px !important
      align-self: flex-start !important

    div 
      padding-right: 0px
      max-width: 280px
      overflow-wrap: break-word

    &.success--text
      div
        color: $text-color !important
    &.info--text
      div
        color: $text-color !important
      i.material-icons
        color: #6c6c6c !important    

    &.info-coverage--text 
      color: $text-color !important
      i.material-icons
        color: $coverage-problem-color !important    

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



    <div class="alert-title">
    Notifications
    </div>

    <div>
      <v-btn v-if="appAlerts && appAlerts.length > 0" id="clear-all-button" flat @click="clearAllAlerts">
        Clear all
      </v-btn>
    </div>

    <v-alert v-for="alert in appAlerts"
      class="alert-item"
      :key="alert.key"
      :value="true"
      :color="getColor(alert)"
      :icon="getIcon(alert)"
      :outline="true"
      
    >
      <v-btn  id="clear-alert-button" flat @click="clearAlert(alert)">
        <v-icon>close</v-icon>
      </v-btn>

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
        return 'info_outline'
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
        return 'info-coverage'
      } else if (alert.type == 'error') {
        return 'error'
      } 
    },
    clearAlert: function(alert) {
      this.$emit("clear-app-alert", alert.key)
    },
    clearAllAlerts: function(alert) {
      let self = this;
      let msg = "Are you sure you want to clear all notifications?"
      alertify.confirm("",
        msg,
        function () {
          // ok
          self.$emit("clear-all-app-alerts")
        },
        function() {
          // cancel
        }
      ).set('labels', {ok:'OK', cancel:'Cancel'});
    }
  },
  mounted: function() {
  }
}

</script>