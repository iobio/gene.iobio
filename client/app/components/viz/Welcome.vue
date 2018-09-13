/*
 * Welcome.vue
 *
 */
<style lang="sass">

@import ../../../assets/sass/variables


#welcome-area
  text-align: center
  margin-top: 25px
  display: flex
  justify-content: space-around
  flex-direction: column
  align-items: center

  .welcome-panel
    background-color: white
    padding-bottom: 15px
    padding-top: 15px
    padding-left: 10px
    padding-right: 10px
    margin-top: 20px
    width:  850px


    #welcome-label
      color: $text-color
      font-size: 22px

    #welcome-label-small
      color: $text-color
      font-size: 16px

    #what-is-new-link
      font-size: 18px

    #helpful-articles-link
      font-size: 18px

    button
      font-size: 16px !important
      margin-left: 7px
      margin-right: 7px
      height: 40px
      margin-bottom: 10px

    #welcome-panel-content
      display: flex
      justify-content: center
      margin-top: 0px

      .feature-container
        display: flex
        justify-content: flex-start
        flex: 1 1 0
        min-height: 131px


        .feature-item
          margin-left: 0px
          margin-right: 0px
          text-align: center

          .feature-icon
            width: 140px
            text-align: center

          .bullet-item
            display: inline-block
            word-wrap: break-word
            width: 140px
            white-space: normal
            margin-left: 5px
            margin-bottom: 15px
            line-height: 22px
            font-size: 16px
            padding-top: 10px
            text-align: center



      .description-paragraph
        width: 100%
        margin-left: 40px
        margin-right: 40px
        margin-top: 60px

        li
          padding-bottom: 10px

          li
            padding-bottom: 4px


      #video-thumbprint-heading
        font-size: 18px
        color: $text-color
        margin-top: 0px
        margin-bottom: 3px

      #video-thumbprint-panel
        margin-top: 0px
        margin-bottom: 10px


      #video-thumbprint-content
        display: flex
        flex-wrap: wrap


      .video-thumbprint-well
        position: relative
        width: 110px
        text-align: center
        margin-left: 0px

        .video-title
          margin-top: 10px
          margin-left: 10px
          margin-right: 10px
          color: $welcome-header-color
          font-size: 14px
          line-height: 17px
          height: 65px
          border: $welcome-border-color solid thin
          padding: 5px
          width: 100px
          padding-top: 15px
          background-color: white

          &.three-line
            padding-top: 5px

          #play-button
            cursor: pointer
            opacity: 0.4
            color: $play-button-color
            font-size: 50px
            position: absolute
            top: 18px
            left: 30px


        .video-thumbprint
          width: 90px
          height: 50px
          margin-top: 5px
          margin-left: 10px
          background-color: grey
          background-size: cover
          display: none

          #play-button
            cursor: pointer
            opacity: 0.5
            color: rgba(70, 70, 70, 0.9)
            font-size: 60px
            position: absolute
            top: 0px
            left: 25px

        #welcome-screencast-panel-multigene-analysis
          background-image: url('../../../assets/images/thumbprint-multigene.png')

        #welcome-screencast-panel-saving-analysis
          background-image: url('../../../assets/images/thumbprint-bookmarks.png')


        #welcome-screencast-panel-coverage-analysis
          background-image: url('../../../assets/images/thumbprint-coverage.png')


      #video-thumbprint-heading-large
        font-size: 20px
        color: $text-color
        position: relative
        top: 55px
        cursor: default



      .video-thumbprint-well-large
        position: relative
        width: 250px
        height: 160px !important
        text-align: center
        margin-left: 0px

        .video-title
          margin-top: 10px
          margin-left: 10px
          margin-right: 10px
          color: white
          font-size: 16px
          line-height: 17px


        .video-thumbprint-large
          background-color: grey
          background-size: cover

          #play-button
            cursor: pointer
            opacity: .4
            color: $play-button-color
            font-size: 90px
            position: absolute
            top: 40px
            left: 80px
            cursor: pointer


        #welcome-screencast-panel-intro
          background-color: white

#screencast-panel
  text-align: center
  margin-top: 50px
  overflow: visible

  .video-container
    height: 430px
    width: 680px
    background-color: white
    margin-left: auto
    margin-right: auto

    h4
      font-size: 21px
      padding-top: 10px
      margin-right: 50px

    .video-stop-button
      float: left
      margin-left: 10px
      padding-left: 0
      margin-top:  5px
      margin-bottom: 0px

      i.material-icons
        text-align: left

    .iframe-placeholder
      position: relative
      height: 0
      padding-bottom: 75.0%




</style>

<template>
  <div>
    <div id="screencast-panel" class="hide">



      <div id="screencast-intro" class="hide video-container">
        <button  class="video-stop-button btn " @click="stopVideo('screencast-intro')">
          <i class="material-icons">arrow_back</i>
        </button>
        <h4>Introducing gene.iobio</h4>
        <div id="screencast-intro-iframe-placeholder"></div>
      </div>

      <div id="screencast-coverage-analysis" class="hide video-container" >
          <button class="video-stop-button btn " @click="stopVideo('screencast-coverage-analysis')">
            <i class="material-icons">arrow_back</i>
          </button>
          <h4>Assessing insufficient coverage</h4>
          <div id="screencast-coverage-analysis-iframe-placeholder"></div>
      </div>

      <div id="screencast-saving-analysis" class="hide video-container" >
          <button class="video-stop-button btn btn-default" @click="stopVideo('screencast-saving-analysis')">
            <i class="material-icons">arrow_back</i>
          </button>
          <h4>Saving your variant analysis</h4>
          <div id="screencast-saving-analysis-iframe-placeholder"></div>
      </div>

      <div id="screencast-multi-gene-analysis" class="hide video-container" >
          <button class="video-stop-button btn btn-default" @click="stopVideo('screencast-multi-gene-analysis')">
            <i class="material-icons" style="text-align: left;">
              arrow_back
            </i>
          </button>
          <h4>Multi-gene analysis</h4>
          <div id="screencast-multi-gene-analysis-iframe-placeholder"></div>
      </div>
    </div>





    <div id="welcome-area" class="">

      <div class="welcome-panel" >
        <transition-group  name="fadeDown" >
          <div v-if="showWelcomeLabel" style="animation-duration: 1s" key="welcome-label" id="welcome-label">
            A web tool for disease-causing variant interrogation
          </div>
        </transition-group>
        <div id="welcome-panel-content">


          <div class="description-paragraph">
            <div style="display:flex;justify-content:space-between">

              <transition-group  name="fadeDown" tag="div" class="feature-container">
                <div v-show="showWelcomeFeature" style="animation-duration: 1s" class="feature-item" v-for="feature in appFeatures" :key="feature.key">
                  <app-icon :icon="feature.icon" width="40" height="40" style="display: block;margin: auto"></app-icon>
                  <div  class="bullet-item" v-html="feature.display"></div>
                </div>
              </transition-group>
            </div>

          </div>

        </div>




        <transition-group  name="fadeDown" tag="div" >
          <div v-if="showWelcomeButton" key="welcome-button" style="animation-duration: 1s;margin-top:30px">
            <v-btn id="load-demo-data"  @click="onLoadDemoData">
              Try it with demo data
            </v-btn>
            <v-btn   @click="onAppTour">
              Take guided tour
            </v-btn>
          </div>

        </transition-group>
      </div>

      <div class="welcome-panel" style="padding:0px;background:transparent;margin-top:20px">
        <div id="welcome-label-small">
          Videos
        </div>
        <div id="welcome-panel-content"  style="display:flex;justify-content:space-around">



          <div id="video-thumbprint-panel">
            <div id="video-thumbprint-content">


              <div class="video-thumbprint-well ">
                <div id="welcome-screencast-panel-coverage-analysis" class="video-thumbprint shadow-z-2" >
                  <i class="material-icons" id="play-button" @click="playVideo('screencast-intro')">play_arrow
                  </i>
                </div>
                <div class="video-title">
                  <i class="material-icons" id="play-button" @click="playVideo('screencast-intro')">play_arrow
                  </i>
                  Introducing gene.iobio
                </div>
              </div>


              <div class="video-thumbprint-well ">
                <div id="welcome-screencast-panel-multigene-analysis" class="video-thumbprint shadow-z-2">
                </div>
                <div class="video-title">
                  <i class="material-icons" id="play-button" @click="playVideo('screencast-multi-gene-analysis')">play_arrow
                  </i>
                 Multi-gene analysis
                 </div>
              </div>


              <div class="video-thumbprint-well ">
                <div id="welcome-screencast-panel-coverage-analysis" class="video-thumbprint shadow-z-2" >
                  <i class="material-icons" id="play-button" @click="playVideo('screencast-coverage-analysis')">play_arrow
                  </i>
                </div>
                <div class="video-title">
                  <i class="material-icons" id="play-button" @click="playVideo('screencast-coverage-analysis')">play_arrow
                  </i>
                  Coverage analysis
                </div>
              </div>



              <div class="video-thumbprint-well ">
                <div id="welcome-screencast-panel-saving-analysis" class="video-thumbprint shadow-z-2" >
                  <i class="material-icons" id="play-button" @click="playVideo('screencast-saving-analysis')">play_arrow
                  </i>
                </div>
                <div class="video-title">
                  <i class="material-icons" id="play-button" @click="playVideo('screencast-saving-analysis')">play_arrow
                  </i>
                  Saving your analysis

                </div>
              </div>







            </div>
          </div>
        </div>



      </div>

      <div class="welcome-panel" style="background:transparent;margin-top:0px;padding-top:10px">
        <div id="welcome-label-small">
          Blog Posts
        </div>
        <div id="welcome-panel-content"  style="display:flex;justify-content:space-around">


          <div id="video-thumbprint-panel">
            <div id="video-thumbprint-content">



              <a href="http://iobio.io/2018/07/20/gene_3.0/" target="_new">
                <div class="video-thumbprint-well ">
                  <div class="video-thumbprint shadow-z-2" >

                  </div>
                  <div class="video-title three-line">
                    New gene.iobio 3.0
                  </div>
                </div>
              </a>



              <a href="http://iobio.io/2017/09/27/loading-data/" target="_new">
                <div class="video-thumbprint-well ">
                  <div class="video-thumbprint shadow-z-2" >
                    <img src="http://iobio.io/public/images/blog/loading_data/blog_image_data.jpg" width="100%" height="100%">
                  </div>
                  <div class="video-title">
                    How to load your data
                  </div>
                </div>
              </a>


              <a href="http://iobio.io/2017/04/26/gene_2.3.0/" target="_new">
                <div class="video-thumbprint-well ">
                  <div class="video-thumbprint shadow-z-2" >
                    <img src="http://iobio.io/public/images/blog/gene_2.3.0/main.png" width="100%" height="100%">
                  </div>
                  <div class="video-title three-line">
                    Saving and loading your analysis
                  </div>
                </div>
              </a>



              <a href="http://iobio.io/2017/07/11/coverage/" target="_new">
                <div class="video-thumbprint-well ">
                  <div class="video-thumbprint shadow-z-2" >
                    <img src="http://iobio.io/public/images/blog/coverage/main.png" width="100%" height="100%">
                  </div>
                  <div class="video-title">
                    Coverage analysis
                  </div>
                </div>
              </a>


              <a href="http://iobio.io/2017/09/29/gene_2.5.0/" target="_new">
                <div class="video-thumbprint-well ">
                  <div class="video-thumbprint shadow-z-2" >
                    <img src="http://iobio.io/public/images/blog/gene_2.5.0/banner.png" width="100%" height="100%">
                  </div>
                  <div class="video-title">
                    ClinVar and gnomAD
                  </div>
                </div>
              </a>







            </div>
          </div>
        </div>



      </div>
    </div>
  </div>
</template>


<script>

import AppIcon         from  '../partials/AppIcon.vue'

export default {
  name: 'welcome',
  components: {
    AppIcon
  },
  props: {
    isBasicMode: null,
    isEduMode: null,
    launchedFromClin: null
  },
  data() {
    return {
      appFeatures: [
        {key: 1, display: 'Analyze in<br>real-time',            icon: "feature-realtime"},
        {key: 2, display: 'Annotate and segregate variants',    icon: "feature-analysis"},
        {key: 3, display: 'Visualize<br>data',                  icon: "feature-viz"},
        {key: 4, display: 'Inspect<br>coverage',                icon: "feature-coverage"},
        {key: 5, display: 'Recall<br>variants',                 icon: "feature-on-demand"},
      ],
      showWelcomeLabel: false,
      showWelcomeFeature: false,
      showWelcomeButton: false,
      videoPlayer: null,
      videoStyle: "position:absolute;width:100%;height:100%;left:0",
      videoConfigs : {
        'screencast-intro': {
          src: "https://www.youtube.com/embed/1R3kuXh6seQ?autoplay=1&rel=0&ecver=2",
          videoId: '1R3kuXh6seQ',
          width: 623,
          height: 369,
          frameborder: "0",
          allowfullscreen: ""
        },
        'screencast-coverage-analysis': {
          src: "https://www.youtube.com/embed/dnq8HtthDgU?autoplay=1&rel=0&ecver=2",
          videoId: 'dnq8HtthDgU',
          width: 623,
          height: 369,
          frameborder: "0",
          allowfullscreen: ""
        },
        'screencast-saving-analysis': {
          src: "https://www.youtube.com/embed/6T8DkrJWd6w?autoplay=1&rel=0&ecver=2",
          videoId: '6T8DkrJWd6w',
          width: 623,
          height: 369,
          frameborder: "0",
          allowfullscreen: ""
        },
        'screencast-multi-gene-analysis': {
          src: "https://www.youtube.com/embed/EW2Sm4HEAPg?autoplay=1&rel=0&ecver=2",
          videoId: 'EW2Sm4HEAPg',
          width: 623,
          height: 369,
          frameborder: "0",
          allowfullscreen: ""
        }
      }
    }
  },
  mounted: function() {
    let self = this;
    let delay = 0;

    this.showWelcomeLabel = true;
    self.showWelcomeButton = true;
    if (!this.launchedFromClin && !this.isBasicMode && !this.isEduMode) {
      self.showWelcomeFeature = true;


    }



  },
  methods: {
    playVideo: function(videoName) {
      let self = this;

      var videoContainer = $('#' + videoName);
      var config = this.videoConfigs[videoName];
      var videoFrame = videoName + "-iframe-placeholder";

      // Hide the welcome panel and show the video panel
      $('#welcome-area').addClass('hide');
      $('#screencast-panel').removeClass('hide');
      $('.video-container').addClass('hide');

      videoContainer.removeClass('hide');

      // Load the video if the iframe doesn't exist
      if (videoContainer.find("iframe").length == 0) {

        self.videoPlayer = new YT.Player(videoFrame, {
          height: config.height,
          width: config.width,
          videoId: config.videoId,
          playerVars: {
            start: 0,
            ecver: 2,
            autoplay: 1
          },
          events: {
            'onReady': self.onPlayerReady,
            'onStateChange': self.onPlayerStateChange
          }
        });
      } else {
        self.videoPlayer.seekTo(0);
        self.videoPlayer.playVideo();
      }


    },

    onPlayerReady: function(event) {
      let self = this;
      event.target.playVideo();
    },

    onPlayerStateChange: function() {
      let self = this;
      var eventData = JSON.parse(event.data);
      if (eventData && eventData.hasOwnProperty("info")) {
        if (eventData.info == YT.PlayerState.ENDED) {
          $('#welcome-area').removeClass('hide');
          $('#screencast-panel').addClass('hide');
        }
      }

    },

    stopVideo: function(videoName) {
      let self = this;

      self.videoPlayer.pauseVideo();
      $('#welcome-area').removeClass('hide');
      $('#screencast-panel').addClass('hide');
    },

    onLoadDemoData: function() {
      this.$emit("load-demo-data");
    },

    onAppTour: function() {
      this.$emit("take-app-tour");
    }
  }
}
</script>