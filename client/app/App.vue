<style lang="sass">
@import "../assets/sass/site.sass";

.container
  margin-top: 0px
  margin-bottom: 10px
  margin-right: 0px
  margin-left: 0px
  width: 100%
  padding: 0px 5px 0px 5px

button
  color: $text-color

.theme--light
  .content--wrap
    .btn
      color: $text-color
      padding-top: 2px
      padding-bottom: 2px
      height: 30px

.chip
  background-color:  $default-badge-color
  .chip__content
    color: white
    background-color:  $default-badge-color
    font-size: 14px
    height: 22px

.progress-linear__background.primary
  background-color: $amber-lighten-4 !important
.progress-linear__bar__indeterminate--active
  .progress-linear__bar__indeterminate
    background-color: $amber-lighten-3 !important


.toolbar
  .input-group__details
    .progress-linear__background
      background-color: $amber-lighten-3 !important
    .progress-linear__bar__indeterminate--active
      .progress-linear__bar__indeterminate
        background-color: $amber-lighten-2 !important


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


