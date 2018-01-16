<style lang="css">

  #select-transcripts-box .theme--light .btn,
  #select-transcripts-box.application .theme--light.btn {
    color:  rgb(113,113,113);
  }

  #select-transcripts-box .btn {
    margin: 0px;
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
</style>

<template>


  <div id="select-transcripts-box"  style="vertical-align:top;margin-top:-5px;margin-left:20px;display:inline-block">
    <v-layout row justify-center>
      <v-dialog  v-model="showTranscriptsDialog"   width="700px">
          <v-btn  raised slot="activator" @click="showTranscriptsDialog = true"
          light>{{ selectedTranscript.transcript_id }}</v-btn>
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
                  v-on:selection="onTranscriptSelected">
                </gene-viz>

            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn color="blue darken-1" flat @click.native="onTranscriptVizClose">Close</v-btn>
            </v-card-actions>
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
      self.showTranscriptsDialog = false;
      self.$emit('selection', self.newTranscript);
    }

  },



}
</script>


