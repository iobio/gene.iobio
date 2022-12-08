<style lang="sass">
@import ../../../assets/sass/variables

#alert-panel
  margin-left: 10px
  margin-right: 10px
  margin-top: 5px
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

    .show-details-button, .hide-details-button
      margin: 0px
      margin-top: 0px
      height: 20px
      font-size: 11px
      .v-btn__content
        color: $link-color !important
</style>

<template>
  <div id="alert-panel" >



    <div class="alert-title"  :style="isBasicMode || isSimpleMode ? 'margin-bottom:10px;' : 'margin-bottom:20px'">
    Notifications
    </div>

    <v-alert v-for="alert in alerts"
      class="alert-item"
      :key="alert.key"
      :value="true"
      :color="getColor(alert)"
      :icon="getIcon(alert)"
      :outline="alert.type == 'error' ? false : true"
    >
      {{alert.message}}

      <div v-if="alert.details" style="display:flex;justify-content:flex-end" >
        <v-btn v-if="!alert.showDetails" class="show-details-button" flat @click="alert.showDetails = true">
          Show details
        </v-btn>
        <v-btn v-if="alert.showDetails" class="hide-details-button" flat @click="alert.showDetails = false">
          Hide details
        </v-btn>
      </div>
      <div v-if="alert.showDetails">
        <div v-for="detail in alert.details" :key="detail">
           {{ detail }}
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
    alerts: null
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
      } else if (alert.type == 'error') {
        return 'error'
      } 
    }
  },
  mounted: function() {
  }
}

</script>