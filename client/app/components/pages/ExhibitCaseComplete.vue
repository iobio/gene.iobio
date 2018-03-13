<style lang="css">

@import '../../../assets/css/exhibit.css';

</style>


<template>

  <v-content id="edu-tour-welcome">
    <v-container fluid>
      <div id="banner">
        <button id="start-over" @click="exhibitStartOver()" class="exhibit-button btn btn-raised">
          Start Over
        </button>
      </div>
      <h3 style="margin-top:80px;margin-bottom:60px;">Congratulations.  You've treated all the patients that need your help today.</h3>

      <div id="button-container">
        <button  @click="showNextCaseStudy()" class="exhibit-button large btn btn-raised">
          Help more patients
        </button>
      </div>



    </div>

      <div id="thankyou" class="">
        <div style="text-align:center">
          <div id="header">
            Creators: Tonya DiSera, Alistair Ward, Yi Qiao, Mary Anne Karren, and Gabor Marth (USTAR Center for Genetic Discovery, University of Utah); Brett Thompson (Pixelcrane)
          </div>

        </div>
      </div>

    </v-container>
  </v-content>

</template>

<script>

export default {
  name: 'exhibit-case-complete',
  components: {

  },
  props: {

  },
  data() {
    return {

    }
  },
  methods: {
    exhibitStartOver: function() {
      this.$router.push({ name: 'exhibit' });
    },
    showNextCaseStudy: function() {
      completedEduTourNumber = eduTourNumber;
      eduTourNumber = completedEduTourNumber == "1" ? "2" : "1";
      this.$router.push(
      { name: 'home',
        query: {mode: 'edu', tour: eduTourNumber}
      });
    }
  }

}
</script>

