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
      <h2>Use gene.iobio to help patients.</h2>

      <div id="button-container">
        <button id="case-study-1" @click="showCaseStudy(1)" class="exhibit-button fat large btn btn-raised">
          <div style="padding-top:0px;padding-right:0px;">
            <app-icon
            icon="search-dna"
            height="38"
            width="38"
            fill="white"
            >
            </app-icon>
          </div>
          Hunt for a cancer gene in a family
        </button>
        <button id="case-study-2" @click="showCaseStudy(2)" class="exhibit-button fat large btn btn-raised">
          <div>
            <i class="material-icons" style="font-size:34px;">local_pharmacy</i>
          </div>
          Decide how much medicine to give a patient
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

import AppIcon from "../partials/AppIcon.vue"

export default {
  name: 'exhibit-cases',
  components: {
    AppIcon

  },
  props: {

  },
  data() {
    return {

    }
  },
  methods: {
    exhibitStartOver: function() {
      this.$router.replace({ name: 'exhibit' });
    },
    showCaseStudy: function(tourNumber) {
      let self = this;
      self.globalApp.tour = tourNumber;
      self.$router.replace(
      { name: 'home',
        query: {mode: 'edu', tour: tourNumber}
      });
    }
  }

}
</script>