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
    font-size: 13px 
    padding: 4px


</style>

<template>
  <div id="alert-panel" >



    <div class="alert-title"  :style="isBasicMode || isSimpleMode ? 'margin-bottom:10px;' : 'margin-bottom:20px'">
    Notifications
    </div>

    <v-alert v-for="alert in alerts"
      :key="alert.timestamp"
      :value="true"
      :color="getColor(alert)"
      :icon="getIcon(alert)"
      :outline="alert.type == 'error' ? false : true"
    >
      {{alert.message}}
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