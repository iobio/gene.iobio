/*
 * Welcome.vue
 *
 */
<style lang="sass">

@import ../../../assets/sass/variables


$teal-color: #009688
$dark-navy: #223b59
$gray-navy: #495f77
$blue-button-color: #425875
// $accent-color:      #a7be3a
// $accent-color-dark: #889f11
$accent-color:      $teal-color
$accent-color-dark: $teal-color
$heading-font:      Cabin
$blue-background-color: #6fa2d4
$gray-background-color: #b3b3b3
$navy-background-color: #416b9a
$green-background-color: #b5c672
$dark-background-color: #484848
$cyan-background-color: #2fa8b7
$teal-background-color: #009688




.video-thumbnail-placeholder
  height: 132px
  width:  252px
  cursor: pointer
  outline: 1px solid lightgray
  position: relative

  img
    width: 250px
    height: 130px

  #play-button
    cursor: pointer
    color: $app-color
    font-size: 80px
    top: 30px
    left: 90px
    opacity: .7
    position: absolute

.video-text-title
  font-size: 18px
  font-family: $heading-font
  cursor: pointer
  color: white
  padding-bottom: 5px


#welcome-area
  margin-top: -5px
  display: flex
  justify-content: space-around
  flex-direction: column
  align-items: center
  margin-left: -5px
  margin-right: -5px

  .welcome-panel
    padding-bottom: 35px
    padding-top: 40px
    padding-left: 50px
    padding-right: 50px
    width: 100%



    &.main
      background-color: $blue-background-color
      //background: linear-gradient(132deg, rgba(0,174,217,1) 0%, rgba(253,187,45,1) 100%)
    &.videos-and-blogs
      background-color: $dark-navy
      //background:  linear-gradient(353deg, rgba(87,85,85,1) 27%, rgba(66,125,235,1) 100%)
    &.how-it-works
      background-color: $navy-background-color
    &.resources
      background-color: $gray-navy
    &.collaborations
      background-color: $navy-background-color


    #welcome-label
      color:          white
      font-size:      36px
      line-height:    40px
      font-family:    $heading-font
      font-weight:    600
      padding-left:   10px
      padding-bottom: 70px

    #welcome-label-small
      color:          white
      font-size:      28px
      font-family:    $heading-font
      font-weight:    normal
      padding-bottom: 10px


    .buttons-group
      margin-top: 0px !important
      padding-left: 10px

    button.welcome-button
      font-size: 16px !important
      margin-left: 7px
      margin-right: 7px
      height: 45px
      width: 230px
      margin-bottom: 10px
      background-color: white
      color: $accent-color
      font-family: $heading-font

      i.material-icons
        font-size: 26px
        width: 26px
        color: $accent-color-dark
        margin-right: 7px



    button.welcome-button-outline
      color: $accent-color
      border-color: $accent-color-dark
      width: 200px
      height: 40px
      margin-top: 0px
      font-family: $heading-font
      font-size: 16px

      i.material-icons
        font-size: 30px
        width: 30px
        color: $accent-color-dark
        margin-right: 4px


    #welcome-panel-content
      display: flex
      justify-content: center
      margin-top: 0px

.resources-panel, .collaborators-panel
  display: flex
  justify-content: space-around
  flex-direction: row

  div
    color: white
    font-family: $heading-font
    font-size: 18px
    margin-left: 25px
    margin-right: 25px

.how-it-works-panel
  clear: both
  display: flex
  flex-direction: column
  justify-content: space-between
  flex-wrap: wrap
  padding: 30px

  .divider
    background-color: rgba(152, 189, 69, 0.21)
    max-width: 90%
    margin-top: 40px
    margin-bottom: 40px

  div.how-it-works-item
    margin-left: 5px
    width: 100%
    display: flex
    justify-content: center

    .avatar
      margin-right: 10px

    .how-it-works-image
      max-width: 50%
      min-width: 50%

      img
        width: 60%
        box-shadow: -3px 3px 1px -2px rgba(0, 0, 0, 0.72), 0px 2px 12px 0px rgba(0, 0, 0, 0.56), 0px 0 10px 0px rgba(0, 0, 0, 0.38)



    .how-it-works-title
      color:        white
      font-family:  Cabin
      font-size:    20px
      display:      inline-block
      line-height:  24px
      max-width:    300px
      margin-right: 40px



#blog-post-content
  display: flex
  flex-wrap: wrap
  flex-direction: row
  justify-content: space-between
  align-items: center
  padding-bottom: 40px
  padding-top: 20px
  padding-left: 20px
  padding-right: 20px

  .blog-post
    height: 100px
    width:  200px

    .blog-post-title
      font-family: $heading-font
      color: white
      font-size: 18px
      padding-top: 15px
      text-align: center
      padding-bottom: 5px


    .blog-post-well
      position: relative
      cursor: pointer
      position: relative
      text-align: center
      margin-left: 0px
      outline: thin solid lightgray











#screencast-panel
  text-align: center
  margin-top: 50px
  overflow: visible

  .video-container
    height: 500px
    width: 780px
    background-color: white
    margin-left: auto
    margin-right: auto

    h4
      font-size: 22px
      padding-top: 10px
      margin-right: 90px
      font-family:  $heading-font

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




    <div id="welcome-area" class="">

      <div class="welcome-panel main">
        <div style="display:flex;flex-direction:row;justify-content:center;align-items: center;">

          <div style="padding-right: 40px">
            <transition-group  name="fadeDown" >
              <div v-if="showWelcomeLabel" style="animation-duration: 1s; " key="welcome-label" id="welcome-label">
                <div>
                  <center style="padding-bottom:15px">
                    Analyze Genomic Variants <br> in Real-time
                  </center>


                </div>
              </div>
            </transition-group>

            <transition-group  name="fadeDown" tag="div" >
              <div v-if="showWelcomeButton" key="welcome-button" class="buttons-group"
                   style="text-align:center;animation-duration: 1s;">
                <v-btn class="welcome-button"  id="load-demo-data"  @click="onLoadDemoData">
                  <i class="material-icons">explore</i>
                  RUN WITH DEMO DATA
                </v-btn>
                <v-btn  class="welcome-button"  @click="playVideo('screencast-intro')">
                  <i class="material-icons">play_circle_filled_white</i>
                  WATCH THE VIDEO
                </v-btn>
              </div>
            </transition-group>
          </div>

          <div>
            <img width="650px" src="../../../assets/images/landing_page/gene-iobio.png"></img>
          </div>
        </div>
      </div>

      <div class="welcome-panel how-it-works" style="">
        <div id="welcome-label-small" style="float:left">How it works</div>

        <v-btn class="welcome-button"  style="float:right" @click="onAppTour">
          TAKE GUIDED APP TOUR
        </v-btn>

        <div class="how-it-works-panel">

          <div class="how-it-works-item">
            <v-avatar color="teal">
              <span class="white--text headline">1</span>
            </v-avatar>
            <span class="how-it-works-title">
               Point to your variant and alignment files for an individual genome, or a family</span>
            <div class="how-it-works-image">
              <img src="../../../assets/images/landing_page/files_dialog.png"></img>
            </div>
          </div>

          <v-divider></v-divider>

          <div class="how-it-works-item">
            <v-avatar color="teal">
              <span class="white--text headline">2</span>
            </v-avatar>
            <span class="how-it-works-title">Enter on a gene or search on a phenotype</span>
            <div>
              <div class="how-it-works-image" style="max-width: 150px;min-width: 150px;float: left;margin-right: 30px;">
                <img src="../../../assets/images/landing_page/search_on_gene.png"  style="width:150px"></img>
              </div>
              <div class="how-it-works-image" style="max-width: 450px;min-width: 450px;float: left;">
                <img src="../../../assets/images/landing_page/search_on_phenotype.png" style="width:100%"></img>
              </div>
            </div>
          </div>

          <v-divider></v-divider>

          <div class="how-it-works-item">
            <v-avatar color="teal">
              <span class="white--text headline">3</span>
            </v-avatar>
            <span class="how-it-works-title">Gene by gene, variants and coverage are are analyzed on powerful IOBIO servers.</span>
            <div class="how-it-works-image">
              <img src="../../../assets/images/landing_page/genes_being_analyzed.png" style="width:230px"></img>
            </div>
          </div>

          <v-divider></v-divider>

          <div class="how-it-works-item">
            <v-avatar color="teal">
              <span class="white--text headline">4</span>
            </v-avatar>
            <span class="how-it-works-title">Within seconds, results are returned for each gene.  Variants are annotated with the most UP-TO-DATE information available</span>
            <div class="how-it-works-image">
              <img src="../../../assets/images/landing_page/variant_detail_card.png" style="width:95%"></img>
            </div>
          </div>

          <v-divider></v-divider>

          <div class="how-it-works-item">
            <v-avatar color="teal">
              <span class="white--text headline">5</span>
            </v-avatar>
            <span class="how-it-works-title">Click on a gene and visualize the variants, colored by impact.  When alignments are provided, see coverage leverages across the gene.</span>
            <div class="how-it-works-image">
              <img src="../../../assets/images/landing_page/variant_card_wgs.png" style="width:95%"></img>
            </div>
          </div>

          <v-divider></v-divider>

          <div class="how-it-works-item">
            <v-avatar color="teal">
              <span class="white--text headline">6</span>
            </v-avatar>
            <span class="how-it-works-title">Examine the gene in detail.  Change the transcript and annotations across the variants are reassessed.</span>
            <div class="how-it-works-image">
              <img src="../../../assets/images/landing_page/gene_card.png" style="width:95%"></img>
            </div>
          </div>

          <v-divider></v-divider>

          <div class="how-it-works-item">
            <v-avatar color="teal">
              <span class="white--text headline">7</span>
            </v-avatar>
            <span class="how-it-works-title">Examine all variants across the gene.  This is especially useful for compound hets and pinpointing data quality issues</span>
            <div class="how-it-works-image">
              <img src="../../../assets/images/landing_page/ranked_variants.png" style="width: 280px;"></img>
            </div>
          </div>

          <v-divider></v-divider>

          <div class="how-it-works-item">
            <v-avatar color="teal">
              <span class="white--text headline">8</span>
            </v-avatar>
            <span class="how-it-works-title">Display the ClinVar track to examine your variant in the context of nearby pathogenic variants</span>
            <div class="how-it-works-image">
              <img src="../../../assets/images/landing_page/clinvar_track.png" style="width:94%"></img>
            </div>
          </div>

          <v-divider></v-divider>


          <div class="how-it-works-item">
            <v-avatar color="teal">
              <span class="white--text headline">9</span>
            </v-avatar>
            <span class="how-it-works-title">As genes are being analyzed, filters are pinpointing out the most interesting variants for closer examination. Customize the filters and the filtered variants are instantly reassessed.</span>
            <div class="how-it-works-image">
              <img src="../../../assets/images/landing_page/filters.png"></img>
            </div>
          </div>

          <v-divider></v-divider>

          <div class="how-it-works-item">
            <v-avatar color="teal">
              <span class="white--text headline">10</span>
            </v-avatar>
            <span class="how-it-works-title">When all genes have been analyzed, review each filtered variant to assess pathogenicity and association with known phenotypes.</span>
            <div class="how-it-works-image">
              <img src="../../../assets/images/landing_page/flagged_variants.png" style="width: 270px;"></img>
            </div>
          </div>

          <v-divider></v-divider>

          <div class="how-it-works-item">
            <v-avatar color="teal">
              <span class="white--text headline">11</span>
            </v-avatar>
            <span class="how-it-works-title">Click on the 'Insufficient Coverage' filter, set the coverage thresholds.  Now examine the pinpointed genes in detail.</span>
            <div class="how-it-works-image">
              <img src="../../../assets/images/landing_page/insufficient_coverage_multiple_exons.png" style="width:50%"></img>
            </div>
          </div>

          <v-divider></v-divider>

          <div class="how-it-works-item">
            <v-avatar color="teal">
              <span class="white--text headline">12</span>
            </v-avatar>
            <span class="how-it-works-title">Look for missed variants by calling variants in real-time</span>
            <div class="how-it-works-image">
              <img src="../../../assets/images/landing_page/called_variants.png" style="width:300px"></img>
            </div>
          </div>
        </div>

      </div>

      <div class="welcome-panel resources">
        <div id="welcome-label-small">
          IOBIO.  Powered by state-of-the-art bioinformatics tools.
        </div>
        <div class="resources-panel">
          <div>Variant Effect Predictor</div>
          <div>Samtools</div>
          <div>Tabix</div>
          <div>vt</div>
          <div>GNomAD</div>
          <div>1000 Genomes</div>
          <div>Phenolyzer</div>
          <div>RefSeq</div>
          <div>Gencode</div>
        </div>
      </div>

      <div class="welcome-panel collaborations">
        <div id="welcome-label-small">
          Sites
        </div>
        <div class="collaborators-panel">
          <div>MyGene2</div>
          <div>Gencove</div>
        </div>
      </div>

      <div class="welcome-panel videos-and-blogs" style="padding-bottom:40px">
        <div id="welcome-label-small">
         More info
        </div>

        <div class="videos-section">
          <v-layout row wrap>
            <v-flex xs4>
              <center>
                <div class="video-text-title" @click="playVideo('screencast-multi-gene-analysis')">Multi-gene analysis</div>
                <div class="video-thumbnail-placeholder">
                  <img src="../../../assets/images/landing_page/thumbnail_genes.png" alt="">
                  <i class="material-icons" id="play-button" @click="playVideo('screencast-multi-gene-analysis')">play_arrow
                  </i>
                </div>
              </center>

            </v-flex>
            <v-flex xs4>
              <center>
                <div class="video-text-title" @click="playVideo('screencast-coverage-analysis')">Coverage analysis</div>
                <div class="video-thumbnail-placeholder">
                  <img src="../../../assets/images/landing_page/thumbnail_coverage.png" alt="">
                  <i class="material-icons" id="play-button" @click="playVideo('screencast-coverage-analysis')">play_arrow
                  </i>
                </div>
              </center>
            </v-flex>
            <v-flex xs4>
              <center>
                <div class="video-text-title" @click="playVideo('screencast-saving-analysis')">Saving your analysis</div>
                <div class="video-thumbnail-placeholder">
                  <img src="../../../assets/images/landing_page/thumbnail_saving.png" alt="">
                  <i class="material-icons" id="play-button" @click="playVideo('screencast-saving-analysis')">play_arrow
                  </i>
                </div>
              </center>
            </v-flex>
          </v-layout>
        </div>


        <div id="blog-post-content">



          <div class="blog-post">
            <div class="blog-post-title ">
              New gene.iobio 3.0
            </div>
            <a href="http://iobio.io/2018/07/20/gene_3.0/" target="_new">
              <div class="blog-post-well ">
                <div class="blog-post shadow-z-2" >
                    <img src="http://iobio.io/public/images/blog/gene_3.0/banner.png" width="100%" height="100%">
                </div>
              </div>
            </a>
          </div>



          <div class="blog-post ">
            <div class="blog-post-title">
              How to load your data
            </div>
            <a href="http://iobio.io/2017/09/27/loading-data/" target="_new">
              <div class="blog-post-well ">
                <div class="blog-post shadow-z-2" >
                  <img src="http://iobio.io/public/images/blog/loading_data/blog_image_data.jpg" width="100%" height="100%">
                </div>
              </div>
            </a>
          </div>



          <div class="blog-post ">
            <div class="blog-post-title ">
              Saving &amp; loading results
            </div>
            <a href="http://iobio.io/2017/04/26/gene_2.3.0/" target="_new">
              <div class="blog-post-well ">
                <div class="blog-post shadow-z-2" >
                  <img src="http://iobio.io/public/images/blog/gene_2.3.0/main.png" width="100%" height="100%">
                </div>
              </div>
            </a>
          </div>



          <div class="blog-post ">
            <div class="blog-post-title">
              Coverage analysis
            </div>
            <a href="http://iobio.io/2017/07/11/coverage/" target="_new">
              <div class="blog-post-well ">
                <div class="blog-post shadow-z-2" >
                  <img src="http://iobio.io/public/images/blog/coverage/main.png" width="100%" height="100%">
                </div>
              </div>
            </a>
          </div>


          <div class="blog-post ">
            <div class="blog-post-title">
              ClinVar and gnomAD
            </div>
            <a href="http://iobio.io/2017/09/29/gene_2.5.0/" target="_new">
              <div class="blog-post-well ">
                <div class="blog-post shadow-z-2" >
                  <img src="http://iobio.io/public/images/blog/gene_2.5.0/banner.png" width="100%" height="100%">
                </div>
              </div>
            </a>
          </div>







        </div>

      </div>

    </div>








    <div id="screencast-panel" class="hide">


      <div id="screencast-intro" class="hide video-container">
        <v-btn style="float:left"   flat @click="stopVideo('screencast-intro')">
          <i class="material-icons">arrow_back</i>
        </v-btn>
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

  </div>
</template>


<script>


export default {
  name: 'welcome',
  components: {
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
          width: 670,
          height: 420,
          frameborder: "0",
          allowfullscreen: ""
        },
        'screencast-coverage-analysis': {
          src: "https://www.youtube.com/embed/dnq8HtthDgU?autoplay=1&rel=0&ecver=2",
          videoId: 'dnq8HtthDgU',
          width: 670,
          height: 420,
          frameborder: "0",
          allowfullscreen: ""
        },
        'screencast-saving-analysis': {
          src: "https://www.youtube.com/embed/6T8DkrJWd6w?autoplay=1&rel=0&ecver=2",
          videoId: '6T8DkrJWd6w',
          width: 670,
          height: 420,
          frameborder: "0",
          allowfullscreen: ""
        },
        'screencast-multi-gene-analysis': {
          src: "https://www.youtube.com/embed/EW2Sm4HEAPg?autoplay=1&rel=0&ecver=2",
          videoId: 'EW2Sm4HEAPg',
          width: 670,
          height: 420,
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
      $('#background-img-container').addClass('hide');
      $('#diagonal-background').addClass('hide');


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
      $('#background-img-container').removeClass('hide');
      $('#diagonal-background').removeClass('hide');
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
