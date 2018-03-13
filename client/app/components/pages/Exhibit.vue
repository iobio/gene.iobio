<style lang="css">

@import '../../../assets/css/exhibit.css';

</style>


<template>

  <v-content id="edu-tour-welcome" class="exhibit-welcome"  transition="slide-y-transition">
    <v-container fluid>


      <div id="banner">
        <button id="start-over" @click="exhibitStartOver()" class="exhibit-button btn btn-raised">
          Start Over
        </button>
        </div>
      <h1 class="app">Explore gene.iobio</h1>
      <h3>Hunt for disease-causing genes. Decide how to treat patients.</h3>

      <div id="button-container">
        <button id="start-here" @click="showVideo()" class="exhibit-button large btn btn-raised">Start here</button>
        <div id="video-container" class="hide">
          <video id="exhibit-video" width="100%" controls="false" height="100%" >
            <source src="../../../assets/video/gene_exhibit_video.mp4" type="video/mp4">
          </video>
        </div>
        <button id="returning-player" @click="showCaseStudies()" class="exhibit-button large btn btn-raised">
          Returning player
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
  name: 'exhibit',
  components: {

  },
  props: {

  },
  data() {
    return {
    }
  },
  methods: {
    showVideo: function() {
      $('#video-container').removeClass('hide');
      $('#start-here').addClass('hide');
      $('h1').addClass('hide');
      $('h3').addClass('hide');
      $('#thankyou').addClass('hide');

      this.playVideo();
    },
    hideVideo: function() {
      $('#video-container').addClass('hide');
      $('#start-here').removeClass('hide');
      $('h1').removeClass('hide');
      $('h3').removeClass('hide');
      $('#thankyou').removeClass('hide');
    },
    playVideo: function() {
      $("#exhibit-video")[0].play();
    },
    pauseVideo: function() {
      $("#exhibit-video")[0].pause();
    },
    stopVideo: function() {
      $("#exhibit-video")[0].pause();
      $("#exhibit-video")[0].currentTime = 0;
      this.hideVideo();
    },
    exhibitStartOver: function() {
      this.stopVideo();
      this.$router.push({ name: 'exhibit' });
    },
    showCaseStudies: function() {
      this.stopVideo();
      this.$router.push({ name: 'exhibit-cases-complete'});
    }

  },
  created: function() {

    // Encapsulate logic for animate.css into a jquery function
    $.fn.extend({
    animateIt: function (animationName, customClassName) {
        $(this).removeClass("hide");
        var additionalClass = customClassName ? ' ' + customClassName : '';
          var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
          $(this).addClass('animated ' + animationName + additionalClass).one(animationEnd, function() {
              $(this).removeClass('animated ' + animationName);
          });
      }
    });

    // Encapsulate logic for animate.css into a jquery function
    $.fn.extend({
      animateVideoDone: function (animationName, customClassName) {
        $(this).removeClass("hide");
        var additionalClass = customClassName ? ' ' + customClassName : '';
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            $(this).addClass('animated ' + animationName + additionalClass).one(animationEnd, function() {
                $(document).addClass("hide");
                //$(this).removeClass('animated ' + animationName);
          //hideVideo();
          showCaseStudies();
            });
      }
    });

    $('body').animateIt('fadeInDown');

  }
}
</script>

