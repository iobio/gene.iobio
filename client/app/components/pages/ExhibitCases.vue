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
            <svg height="38" width="38">
                    <g transform="translate(0,0)">
                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#search-dna-symbol" width="38" height="38" fill="white"></use>
                    </g>
                  </svg>
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

export default {
  name: 'exhibit-cases',
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
    showCaseStudy: function(tourNumber) {
      this.$router.push(
      { name: 'home',
        query: {mode: 'edu', tour: tourNumber}
      });
    }
  }

}
</script>