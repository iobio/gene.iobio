<style lang="sass">


.container
  margin-top: 0px
  margin-bottom: 10px
  margin-right: 0px
  margin-left: 0px
  width: 100%
  padding: 0px 5px 0px 5px


  @import '../assets/sass/site.sass';
</style>

<template>

  <div id="app">

    <v-app light>
      <router-view></router-view>
    </v-app>


  </div>
</template>

<script>



export default {
  name: 'app',
  data() {
    return {
    }
  }
}
</script>


