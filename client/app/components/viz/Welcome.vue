/*
 * Welcome.vue
 *
 */
<style lang="sass">

@import ../../../assets/sass/variables


$button-font:                    Montserrat
$landing-page-font:              Raleway


$accent-color:          $color-1
$accent-color-light:    $color-1
$powered-by-accent-color: $color-1

$accent-color-bright: #14c39a

$header-color:       #818181

$brown-gray:         #393c40
$mid-blue-color:     #416b9a
$light-gray-color:   #f0f1f3

.image-shadow
  -webkit-box-shadow: 6px 11px 68px -7px rgba(0,0,0,0.49)
  box-shadow: 6px 11px 68px -7px rgba(0,0,0,0.49)



.buttons-group
    margin-top: 0px !important
    padding-left: 40px

#welcome-area
  margin-top: -5px
  display: flex
  justify-content: space-around
  flex-direction: column
  align-items: center
  margin-left: -5px
  margin-right: -5px

  .welcome-panel
    padding-bottom: 0px



    &.main
      //background: linear-gradient(128deg, #74aadb 0%, #7eb1dd 8%, #6d92bb 20%, #4e658d 36%);
      background: white
      display: flex
      flex-direction: row
      align-items: flex-start
      justify-content: space-between
      width: 100%

      .main-headline
        display: flex
        flex-direction: row
        padding-top: 70px
        margin-left: 80px
        margin-right: 30px
        width: 40%

        .main-headline-card
          //padding-top: 20px
          //padding-left: 30px
          //padding-right: 30px
          //box-shadow: 3px 3px 20px 0px rgba(0, 0, 0, 0.36)
          //border-radius: 20px


    &.videos-and-blogs
      //background: linear-gradient(262deg, rgba(43,70,101,1) 23%, rgba(61,99,142,1) 73%, rgba(73,132,170,1) 95%, rgba(52,80,96,1) 100%)
      background: white
      padding-top: 20px
      padding-bottom: 20px
      padding-left: 30px
      padding-right: 30px
      width: 100%
    &.how-it-works
      width: 60%
      flex-grow: 2
      //background: linear-gradient(262deg, rgba(43,70,101,1) 23%, rgba(61,99,142,1) 73%, rgba(73,132,170,1) 95%, rgba(52,80,96,1) 100%)
      //background: linear-gradient(304deg, rgba(43,70,101,1) 14%, rgba(61,99,142,1) 68%, rgba(94,141,184,1) 85%)
      background-color: white
    &.features
      background-color: white

    &.resources
      background-color: $brown-gray
      padding-top: 20px
      padding-bottom: 20px

    &.collaborations
      background-color: $mid-blue-color


    #welcome-label
      //color: white
      color:          $header-color
      font-size:      40px
      line-height:    45px
      font-family:    $landing-page-font
      font-weight:    normal
      padding-bottom: 10px

    #welcome-label-small
      color:          white
      font-size:      28px
      font-family:    $landing-page-font
      font-weight:    normal
      padding-bottom: 30px
      font-weight:    normal
      padding-left:   30px

      &.accent-label
        color:        $app-color


    .buttons-group
      margin-top: 0px !important
      padding-top: 30px
      display: flex
      flex-direction: column
      align-items: center


    button.welcome-button
      font-size: 16px !important
      margin-left: 7px
      margin-right: 7px
      height: 40px
      width: 270px
      margin-bottom: 10px
      background-color: $accent-color
      color: $accent-color
      font-family: $landing-page-font
      margin-bottom: 30px
      font-family:  $button-font

      i.material-icons
        font-size: 26px
        width: 26px
        color: white
        margin-right: 7px

      .btn__content
        color: white

    button.welcome-button-outline
      font-family:  $button-font
      font-size: 16px !important
      margin-left: 7px
      margin-right: 7px
      height: 40px
      width: 230px
      margin-bottom: 10px
      background-color: white
      color: $accent-color
      font-family: $landing-page-font
      border: thin solid $accent-color

      i.material-icons
        font-size: 26px
        width: 26px
        color: $accent-color
        margin-right: 7px

      .btn__content
        color: $accent-color



    #welcome-panel-content
      display: flex
      justify-content: center
      margin-top: 0px

.resources-panel
  flex-wrap: wrap
  justify-content: center !important
  .avatar
    min-height: 120px
    min-width: 120px
    margin-bottom: 30px
    margin-left: 30px
    margin-right: 30px
    background-color: transparent !important
    border: 2px solid white
    border-color: $powered-by-accent-color !important



    span
      font-size: 18px

.resources-panel, .collaborators-panel
  padding-top: 20px
  display: flex
  justify-content: space-around
  flex-direction: row

  div
    color: white
    font-family: $landing-page-font
    font-size: 18px
    margin-left: 25px
    margin-right: 25px
    text-align: center
    line-height: 22px





.how-it-works-panel, .features-panel
  clear: both
  display: flex
  flex-direction: column
  justify-content: space-between
  flex-wrap: wrap
  padding: 30px
  padding-top: 25px

  .divider
    background-color: transparent
    max-width: 90%
    margin-top: 20px
    margin-bottom: 15px

  div.features-item
    margin-bottom: 40px

    i.material-icons
      display: inline
      margin-right: 8px
      color: $color-3
      font-size: 28px


  div.how-it-works-item
    margin-bottom: 30px

  div.how-it-works-item, div.features-item
    display: flex

    .avatar
      margin-right: 10px
      background-color: $color-1 !important
      width: 48px !important
      height: 48px !important

      &.color1
        background-color: $color-1 !important
      &.color2
        background-color: $color-3 !important
      &.color3
        background-color: $color-2 !important
      &.color4
        background-color: $color-4 !important

      i.material-icons
        color: white !important
        font-size: 25px


      span.headline
        font-size: 15px !important
        color: white !important

    .how-it-works-image, .features-image
      margin-right: 0px

      img
        max-width: 400px
        min-width: 200px
        -webkit-box-shadow: 6px 11px 68px -7px rgba(0,0,0,0.49)
        box-shadow: 6px 11px 68px -7px rgba(0,0,0,0.49)



    .how-it-works-title, .features-title
      font-family:  $landing-page-font
      font-size:    18px
      display:      inline-block
      line-height:  24px
      margin-right: 30px
      width: 270px

    .how-it-works-title, .features-title
      margin-right: 10px
      min-width: 250px
      max-width: 250px

      &.long
        min-width: 100%
        max-width: 100%
        padding-top: 10px


    .features-title
      color: $header-color
      font-weight: 500

    .how-it-works-title
      color: $header-color
      font-weight: 500



#blog-post-content, .video-content
  display: flex
  flex-wrap: wrap
  flex-direction: row
  justify-content: space-between
  align-items: center
  padding-bottom: 40px
  padding-top: 20px
  padding-left: 40px
  padding-right: 20px


  .blog-post
    height: 100px
    width:  200px
    margin-bottom: 50px

    .blog-post-title
      font-family: $landing-page-font
      color: $app-color
      font-size: 20px
      padding-top: 15px
      text-align: center
      padding-bottom: 5px
      font-weight: 500

    .blog-post-well
      position: relative
      cursor: pointer
      position: relative
      text-align: center
      margin-left: 0px
      outline: thin solid lightgray



  .video-item
    margin-right: 30px
    margin-bottom: 20px
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
    font-size: 20px
    font-family: $landing-page-font
    cursor: pointer
    color: $app-color
    padding-bottom: 5px
    text-align: center
    font-weight: 500









#screencast-panel
  margin-top: -5px
  display: flex
  height: -webkit-fill-available
  justify-content: space-around
  flex-direction: column
  align-items: center
  margin-left: -5px
  margin-right: -5px
  background: linear-gradient(180deg, rgba(49,82,120,1) 11%, rgba(61,99,142,1) 84%, rgba(22,129,167,1) 97%)

  .video-container
    height: 500px
    width: 780px
    margin-left: auto
    margin-right: auto
    text-align: center

    h4
      font-size: 24px
      padding-top: 10px
      margin-right: 90px
      font-family:  $landing-page-font
      color: white

    i.material-icons
      color: white !important

    .video-stop-button
      float: left
      margin-left: 10px
      padding-left: 0
      margin-top:  5px
      margin-bottom: 0px

      i.material-icons
        text-align: left
        color: white !important

    .iframe-placeholder
      position: relative
      height: 0
      padding-bottom: 75.0%

.one
  background-color: #FAFAFA
  background-image: -webkit-linear-gradient(55deg, #FAFAFA 50%, #258AD5 50%)
  min-height: 500px
  margin-top: -35px

</style>

<style>

@media only screen and (max-width: 1130px) {
.how-it-works .how-it-works-panel .how-it-works-image img {
    max-width: 300px !important;
}
}

@media only screen and (max-width: 1000px) {
.welcome-panel.main img ,
.welcome-panel.main .image-shadow {
    display: none
}
.how-it-works-panel {
  padding: 0px;
}
}

@media only screen and (max-width: 768px) {
.welcome-panel.how-it-works  {
    padding-left: 20px;
  }
}

@media only screen and (max-width: 600px) {


#welcome-area .welcome-panel.main {
  flex-direction: column !important;
}


#welcome-area .welcome-panel.how-it-works {
  width: 100%;
}
.how-it-works-panel {
  align-items: center;
}
#welcome-area .welcome-panel.main .main-headline {
  padding-top: 15px;
  width: fit-content;
}

.welcome-panel.main img,
.welcome-panel.main .image-shadow,
.welcome-panel.how-it-works img,
.welcome-panel.features img,
.how-it-works-image,
.features-image {
  display: none
}
.how-it-works-panel {
  padding: 30px;
}

}

</style>

<template>
  <div style="background-color:white">
    <div id="welcome-area" style="background-color:white">

      <div class="welcome-panel main">
        <div class="main-headline">

          <div class="main-headline-card">
            <transition-group  name="fadeDown" >
              <div v-if="showWelcomeLabel" style="animation-duration: 1s; " key="welcome-label" id="welcome-label">
                <div>
                  <center>
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

        </div>

        <div class="welcome-panel how-it-works  " >


          <div class="how-it-works-panel">



            <div class="how-it-works-item">
              <v-avatar class="color2" >
                <v-icon>search</v-icon>
              </v-avatar>
              <span class="how-it-works-title long">Search on a gene or a phenotype</span>
            </div>


            <div class="how-it-works-item">
              <v-avatar class="color4" >
                <v-icon>track_changes</v-icon>
              </v-avatar>
              <span class="how-it-works-title">Gene by gene, variants and coverage are are analyzed on powerful IOBIO servers.</span>
              <div class="how-it-works-image" >
                <img  src="../../../assets/images/landing_page/analyzing_genes.gif" style="max-width:160px;min-width:160px"></img>
              </div>
            </div>

            <div class="how-it-works-item">
              <v-avatar class="color3">
                <v-icon>filter</v-icon>
              </v-avatar>
              <span class="how-it-works-title">Click on a gene and visualize the variants, colored by impact.  See coverage levels across the gene.</span>
              <div class="how-it-works-image" >
                <img  src="../../../assets/images/landing_page/variant_card_cropped.png" style="width:100%"></img>
              </div>
            </div>


            <div class="how-it-works-item">
              <v-avatar class="color1" >
                <v-icon>highlight</v-icon>
              </v-avatar>
              <span class="how-it-works-title long">Inspect the most up-to-date annotations including ClinVar, VEP, gnomAD.</span>
            </div>

          </div>
        </div>

      </div>


      <v-divider style="margin-top:0px"></v-divider>


      <div class="welcome-panel features ">
        <div id="welcome-label-small" class="accent-label">
          Features
        </div>


        <div class="features-panel ">

          <div class="features-item">
            <v-icon class="color4">check_circle</v-icon>
            <span class="features-title">Examine the alignments for a variant in the pileup view.</span>
            <div class="features-image">
              <img  src="../../../assets/images/landing_page/pileup.png" style="width:100%"></img>
            </div>
          </div>


          <div class="features-item">
            <v-icon class="color4">check_circle</v-icon>
            <span class="features-title">Examine the gene in detail.  Change the transcript and annotations across the variants are reassessed.</span>
            <div class="features-image">
              <img  src="../../../assets/images/landing_page/gene_card.png" style="width:100%%"></img>
            </div>
          </div>



          <div class="features-item">
            <v-icon class="color4">check_circle</v-icon>
            <span class="features-title">Change the transcript and annotations across the variants are reassessed.</span>
            <div class="features-image">
              <img  src="../../../assets/images/landing_page/transcript_selection.png" style="width:100%"></img>
            </div>
          </div>


          <div class="features-item">
            <v-icon class="color4">check_circle</v-icon>
            <span class="features-title">Examine all variants across the gene.  This is especially useful for compound hets and pinpointing data quality issues</span>
            <div class="features-image">
              <img src="../../../assets/images/landing_page/ranked_variants.png" style="width: 280px;"></img>
            </div>
          </div>

          <div class="features-item">
            <v-icon class="color4">check_circle</v-icon>
            <span class="features-title">Display the ClinVar track to examine your variant in the context of nearby pathogenic variants</span>
            <div class="features-image">
              <img  src="../../../assets/images/landing_page/clinvar_track.png" style="width:100%"></img>
            </div>
          </div>


          <div class="features-item">
            <v-icon class="color4"> check_circle</v-icon>
            <span class="features-title">Customize the filters and the filtered variants are instantly reassessed.</span>
            <div class="features-image">
              <img src="../../../assets/images/landing_page/filters_customize.png" style="width:300px"></img>
            </div>
          </div>

          <div class="features-item">
            <v-icon  class="color4">check_circle</v-icon>
            <span class="features-title">Click on the 'Insufficient Coverage' filter, set the coverage thresholds.  Now examine the pinpointed genes in detail.</span>
            <div class="features-image">
              <img  src="../../../assets/images/landing_page/insufficient_coverage_tooltip.png" style="width:300px"></img>
            </div>
          </div>


          <div class="features-item">
            <v-icon class="color4">check_circle</v-icon>
            <span class="features-title">Look for missed variants by calling variants in real-time</span>
            <div class="features-image">
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
          <v-avatar color="teal" >
              <span class="white--text">Variant Effect Predictor</span>
          </v-avatar>
          <v-avatar color="teal" >
              <span class="white--text">Samtools</span>
          </v-avatar>
          <v-avatar color="teal" >
              <span class="white--text">Tabix</span>
          </v-avatar>
          <v-avatar color="teal" >
              <span class="white--text">vt</span>
          </v-avatar>
          <v-avatar color="teal" >
              <span class="white--text">ClinVar</span>
          </v-avatar>
          <v-avatar color="teal" >
              <span class="white--text">GNomAD</span>
          </v-avatar>
          <v-avatar color="teal" >
              <span class="white--text">1000 Genomes</span>
          </v-avatar>
          <v-avatar color="teal" >
              <span class="white--text">Phenolyzer</span>
          </v-avatar>
          <v-avatar color="teal" >
              <span class="white--text">RefSeq</span>
          </v-avatar>
          <v-avatar color="teal" >
              <span class="white--text">Gencode</span>
          </v-avatar>
          <v-avatar color="teal" >
              <span class="white--text">Human Phenotype Ontology</span>
          </v-avatar>
          <v-avatar color="teal" >
              <span class="white--text">igv.js</span>
          </v-avatar>
        </div>
      </div>

      <div class="welcome-panel videos-and-blogs" style="padding-bottom:40px">
        <div id="welcome-label-small" class="accent-label">
         Learn about gene.iobio
        </div>

        <div class="video-content">
          <div class="video-item">
              <div class="video-text-title" @click="playVideo('screencast-multi-gene-analysis')">Multi-gene analysis</div>
              <div class="video-thumbnail-placeholder">
                <img src="../../../assets/images/landing_page/thumbnail_genes.png" alt="">
                <i class="material-icons" id="play-button" @click="playVideo('screencast-multi-gene-analysis')">play_arrow
                </i>
              </div>
          </div>

          <div class="video-item">
              <div class="video-text-title" @click="playVideo('screencast-coverage-analysis')">Coverage analysis</div>
              <div class="video-thumbnail-placeholder">
                <img src="../../../assets/images/landing_page/thumbnail_coverage.png" alt="">
                <i class="material-icons" id="play-button" @click="playVideo('screencast-coverage-analysis')">play_arrow
                </i>
              </div>
          </div>

          <div class="video-item">
              <div class="video-text-title" @click="playVideo('screencast-saving-analysis')">Saving your analysis</div>
              <div class="video-thumbnail-placeholder">
                <img src="../../../assets/images/landing_page/thumbnail_saving.png" alt="">
                <i class="material-icons" id="play-button" @click="playVideo('screencast-saving-analysis')">play_arrow
                </i>
              </div>
          </div>
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
              Loading your data
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
              Saving results
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
              ClinVar &amp; gnomAD
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
