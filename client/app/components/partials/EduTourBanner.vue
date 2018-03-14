<style lang="sass">
@import ../../../assets/sass/variables

$tour-button-color:      rgba(165, 185, 65, 1)
$tour-hilite-color:      #F05B5B

#edu-tour-banner
  background-color:  $tour-background-color
  display: block !important
  height: 70px
  width: 100%
  text-align: center
  padding-top: 10px
  position: fixed
  top: 0px
  z-index: 1900

  #start-over
    float: left !important
    margin-left: 5px !important
    margin-right: -190px !important
    font-size: 23px !important
    padding: 4px !important
    margin-top: 5px !important
    color: white !important
    background-color: $tour-button-color !important
    width:  178px

  .btn.btn-raised
    color: white !important
    background-color: $tour-data-button-color !important
    margin-left: 15px !important
    font-size: 24px !important
    padding: 4px !important
    padding-left: 10px !important
    padding-right: 10px !important
    margin-top: 10px !important

  .card-label
    color: white !important
    font-size: 20px !important

  .edu-tour-button
    width: 108px

    i.material-icons
      display: none

    &.active
      background-color: $tour-button-color !important

      i.material-icons
        display: none
        color: white !important
        font-size: 15px
        padding-bottom: 3px
        padding-right: 0px !important
        float: none !important

    &.emphasize
      background-color: $tour-theme-color !important
      color: white !important

    &.healthy
      background-color: #4E86B7 !important
      color: white !important

body#tlypageguide-open
  overflow-y: hidden !important

#tlyPageGuideWrapper
  #tlyPageGuideMessages
    background-color: $tour-background-color !important
    margin-left: 0px !important
    margin-right: 0px !important
    width: 100% !important
    padding-bottom: 10px !important
    padding-left: 0px !important
    padding-right: 0px !important
    padding-top: 10px !important
    z-index: 2000 !important
    min-height: 50px !important

    .tlypageguide_text
      margin-left: 10px !important
      margin-right: 50px !important
      margin-bottom: 0px !important
      margin-top: 0px !important

    .pageguide-nav
      bottom:  initial !important
      top: 30px !important
      margin-top: 0px !important


    a.pageguide-close
      color: white !important
      background-color: rgba(165, 185, 65, 1)
      text-align: left
      vertical-align: top
      margin-left: 90%
      -webkit-border-radius: 3px 3px 3px 3px
      -moz-border-radius: 3px 3px 3px 3px
      -o-border-radius: 3px 3px 3px 3px
      border-radius: 3px 3px 3px 3px
      display: inline-block
      font-size: 28px
      height: 39px
      padding-left: 9px
      padding-right: 10px
      text-align: center
      text-decoration: none
      width: 85px
      margin-top: -75px

    a.pageguide-prev
      visibility: hidden


.tlypageguide_shadow

  &.tlypageguide-active
    background-color: transparent !important
    webkit-box-shadow: none !important
    box-shadow: none !important
    border: $tour-hilite-color solid 6px !important

.tlyPageGuideStepIndex
  opacity: 0 !important

.tlypageguide-active
  .tlyPageGuideStepIndex
    opacity: 1 !important

.tlypageguide_text
  font-size: 23px !important
  text-align: center !important
  line-height: 25px !important


  .checkbox
    label
      font-size: 25px !important
      line-height: 25px !important
      color: #FFFFFF !important
      webkit-box-shadow: none !important
      box-shador: none

  .answers
    padding-left: 60px
    min-height: 160px
    max-height: 160px
    vertical-align: top
    text-align: left
    display: inline-block
    width:  280px

    &.custom-checkbox
      padding:  10px
      margin-right: 30px
      min-height: initial
      max-height: initial
      width:  initial

    &.selected
      border: solid 3px #a5b941

      .answer-label
        color: #a5b941 !important
        font-weight: bold !important


.tlypageguide_index
  display: none !important

.tlypageguide-active .tlyPageGuideStepIndex
  color: transparent !important
  border: #F96262 solid 6px !important

.edu-tour-answer
  color: $tour-button-color !important
  font-size: 20px !important


.edu-tour-answer.incorrect
  color: $tour-hilite-color !important
  font-size: 20px !important



span.arrow
  opacity: 0
  transition: all 0.5s ease
  position: absolute
  height: 0
  width: 0
  border: 20px solid transparent

span.arrow
  &:after
    transition: all 0.5s ease
    background-color: rgba(165, 185, 65, 1)

.tlypageguide-active
  span.arrow
    opacity: 1

</style>

<template>
  <div id="edu-tour-banner">

    <div id="edu-tour-0" class="hide">
    </div>

    <div id="edu-tour-1" v-bind:class="tourNumber != 1 ? 'hide' : ''">
      <button  id="start-over" class="icon-button-sm btn btn-default btn-raised"
      @click="exhibitStartOver()" >
          Return to Start
      </button>


      <span id="edu-tour-label" class="card-label" style="padding:4px;">Hunt for a cancer gene in a family</span>

      <span style="inline-block">


          <button id="button-load-father-data"
          v-bind:class="getButtonClass(1, 0)"
          @click="onInitTourSample(1, 0)">
            <span>
              <i class="material-icons" >star</i>
              Father
            </span>
          </button>

          <span id="children-buttons" class="edu-tour-1-child-buttons" style="display:inline-block;">
             <span id="jimmy-and-sarah-buttons" style="display:inline-block;">
            <button id="button-load-jimmy-data"
            v-bind:class="getButtonClass(1, 1)"
            @click="onInitTourSample(1, 1)">
              <span>
                <i class="material-icons" >star</i>
                Jimmy
              </span>
            </button>

            <button
            v-bind:class="getButtonClass(1, 2)"
            @click="onInitTourSample(1, 2)">
              <span>
                <i class="material-icons" >star</i>
                Bobby
              </span>
            </button>
           </span>

            <button
            v-bind:class="getButtonClass(1, 3)"
            style="margin-right:20px;"
            @click="onInitTourSample(1, 3)">
            <span>
                <i class="material-icons" >star</i>
                Sarah
              </span>

            </button>


          </span>


      </span>

      <audio id="tour1-recording1" src="../../../assets/audio/tour1-recording1.m4v" ></audio>
      <audio id="tour1-recording2" src="../../../assets/audio/tour1-recording2.m4v"></audio>
      <audio id="tour1-recording3" src="../../../assets/audio/tour1-recording3.m4v"></audio>
      <audio id="tour1-recording4" src="../../../assets/audio/tour1-recording4.m4v"></audio>
      <audio id="tour1-recording5" src="../../../assets/audio/tour1-recording5.m4v"></audio>


    </div>

    <div id="edu-tour-2"  v-bind:class="tourNumber != 2 ? 'hide' : ''">
      <button  id="start-over" class="icon-button-sm btn btn-default btn-raised"
      @click="exhibitStartOver()" >
          Return to Start
      </button>

      <span class="card-label" style="padding-right:10px;" id="edu-tour-2-label">Decide how much medicine to give a patient</span>

      <span id="child-buttons-tour2" style="display:inline-block">

          <button id="button-load-john-data"
           v-bind:class="getButtonClass(2, 0)"
           @click="onInitTourSample(2, 0)">
          <span>
              <i class="material-icons" >star</i>
              John
            </span>

          </button>

          <button id="button-load-diego-data"
           v-bind:class="getButtonClass(2, 1)"
           @click="onInitTourSample(2, 1)">
            <span>
              <i class="material-icons" >star</i>
              Diego
            </span>
          </button>

          <button id="button-load-anna-data"
           v-bind:class="getButtonClass(2, 2)"
           style="margin-right:20px;"
           @click="onInitTourSample(2, 2)">
            <span>
              <i class="material-icons" >star</i>
              Anna
            </span>
          </button>


      </span>


      <audio id="tour2-recording1" src="../../../assets/audio/tour2-recording1.m4v"></audio>
      <audio id="tour2-recording2" src="../../../assets/audio/tour2-recording2.m4v"></audio>
      <audio id="tour2-recording3" src="../../../assets/audio/tour2-recording3.m4v"></audio>


    </div>

  </div>
</template>


<script>



export default {
  name: 'edu-tour-banner',
  components: {
  },
  props: {
    geneModel: null,
    tourNumber: null
  },
  data () {
    return {
      activeButtons: [
        [true, false, false, false],
        [true, false, false]
      ],
      names: [
        ['father', 'jimmy', 'bobby', 'sarah'],
        ['john', 'diego', 'anna']
      ]
    }
  },
  methods: {
    onInitTourSample: function(tour, sampleIndex) {
      let self = this;
      var tourIdx = parseInt(tour) - 1;
      var buttonCount = tourIdx == 0 ? 4 : 3;

      var buttons = [];
      for (var i = 0; i < buttonCount; i++) {
        buttons.push( (i == sampleIndex ? true : false) );
      }
      self.$set(self.activeButtons, tourIdx, buttons);


      $('.answers').removeClass('selected');
      $('#' + self.names[tourIdx][sampleIndex] + '-answers').addClass('selected');

      this.$emit("init-tour-sample", tour, sampleIndex);
    },
    exhibitStartOver: function() {
      this.$router.push({ name: 'exhibit' });
    },
    completeTour: function() {
      if (isLevelEdu) {
        completedEduTourNumber = eduTourNumber;
        eduTourNumber = completedEduTourNumber == "1" ? "2" : "1";
        this.$router.push(
        { name: 'exhibit-case-complete',
          query: {mode: 'edu', tour: eduTourNumber}
        });
      }
    },
    getButtonClass: function(tour, sampleIndex) {
      let self = this;
      var tourIndex = parseInt(tour) - 1;
      return [
        {'active': self.activeButtons[tourIndex][sampleIndex]},
        'edu-tour-button', 'icon-button-sm', 'btn', 'btn-default', 'btn-raised'
      ];

    }
  }
}

</script>