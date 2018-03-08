<style lang="css">

  #select-transcripts-box .theme--light .btn,
  #select-transcripts-box.application .theme--light.btn {
    color:  rgb(113,113,113);
  }



  .dialog__content hr {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .dialog__content .card__text {
    padding: 0px
  }


</style>

<style lang="sass">
@import "../../../assets/sass/_variables.sass";
#select-transcript-viz

  .selected
    .selection-box
      stroke: $current-color
      stroke-width: 2px
      cursor: pointer

  .current
    .selection-box
      font-weight: bold
      outline: solid 2px $current-color

#select-transcripts-box
  .btn--floating.btn--small
    height: 20px !important
    width: 22px !important
    padding: 0px !important
    margin: 0px;
    margin-left: 4px;

  .btn--floating.btn--small .btn__content
    padding: 0px


</style>

<template>


  <div id="select-transcripts-box"  style="vertical-align:top;display:inline-block">
    <v-layout row justify-center>
      <span style="display:inline-block;margin-left:15px">{{ `Transcript ` + selectedTranscript.transcript_id }}</span>
      <v-dialog  v-model="showTranscriptsDialog"   width="700px">

          <v-btn id="show-transcripts-button" raised fab small slot="activator" @click="showTranscriptsDialog = true"
          light>
            <v-icon style="font-size:20px" >expand_more</v-icon>
          </v-btn>

          <v-card>
            <v-card-title>Select transcript</v-card-title>
            <v-divider></v-divider>
            <v-card-text style="min-height:100px;max-height: 300px;overflow-y:scroll">
                <gene-viz id="select-transcript-viz"
                  :data="selectedGene.transcripts"
                  :margin=margin
                  :trackHeight=trackHeight
                  :cdsHeight=cdsHeight
                  :showLabel=true
                  :fixedWidth=600
                  :regionStart="selectedGene.start"
                  :regionEnd="selectedGene.end"
                  :showBrush=false
                  :showXAxis=false
                  @transcript-selected="onTranscriptSelected">
                </gene-viz>

            </v-card-text>
            <v-divider></v-divider>
            <v-flex xs12 class="text-xs-right">
                <v-btn raised @click.native="onTranscriptVizClose">Close</v-btn>
            </v-flex>
          </v-card>
      </v-dialog>
    </v-layout>
  </div>



  </v-card>



</template>

<script>

import GeneViz from '../viz/GeneViz.vue'


export default {
  name: 'transcripts-viz',
  components: {
    GeneViz
  },
  props: {
    selectedGene: {},
    selectedTranscript: {}
  },
  data() {
    return {
      margin: {top: 5, right: 5, bottom: 5, left: 200},
      trackHeight: 20,
      cdsHeight: 15,
      showTranscriptsDialog: false,
      newTranscript: null
    }
  },

  methods: {
    onTranscriptSelected: function(theTranscript) {
      this.newTranscript = theTranscript;
      this.onTranscriptVizClose();
    },
    onTranscriptVizClose: function() {
      var self = this;
      if (self.newTranscript == null) {
        self.newTranscript = self.selectedTranscript;
      }
      self.$emit('transcriptSelected', self.newTranscript);
      self.showTranscriptsDialog = false;
    }

  },



}
</script>


