<style lang="css">

@import '../../../assets/css/exhibit.css';

</style>


<template>

  <v-content id="edu-tour-welcome">
    <v-container fluid>


      <div id="banner">
        <button id="start-over" onclick="hideVideo();exhibitStartOver()" class="exhibit-button btn btn-raised">
          Start Over
        </button>
        </div>

      <h3 style="margin-top:80px;margin-bottom:60px;">Congratulations.  You've treated all the patients that need your help today.</h3>

      <div id="button-container">
        <button  onclick="showCaseStudies()" class="exhibit-button large btn btn-raised">
          Play again
        </button>
      </div>




      <div id="thankyou" class="">
      <div style="text-align:center">
        <span><img width="300px" src="assets/images/edutour/logo_nih-nhgri.png"></span>
        <span style="color: #c70013">marthlab.org</span>
        <span style="color: #61CDE8;">iobio.io</span>
        <span style="color: #8AA9C3;">gene.iobio.io</span>
        <span><img height="55px" src="assets/images/edutour/ucgd-logo-v1.png"/></span>
        <span><img height="45px" src="assets/images/edutour/hs-logo2.svg"/></span>

      </div>
        <div id="header">
          Creators: Tonya DiSera, Alistair Ward, Yi Qiao, Mary Anne Karren, and Gabor Marth (USTAR Center for Genetic Discovery, University of Utah); Brett Thompson (Pixelcrane)
        </div>
    </div>

    </v-container>
  </v-content>

</template>

<script>

export default {
  name: 'exhibit-cases-complete',
  components: {

  },
  props: {

  },
  data() {
    return {
    }
  }
}
</script>

