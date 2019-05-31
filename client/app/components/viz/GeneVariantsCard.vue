<style lang="css" >

  .gene-info .btn__content {
    color:  rgb(113,113,113);
  }
  .gene-info .input-group {
    padding: 0px;
  }
  .gene-info .input-group__messages {
    display: none;
  }
  .gene-info  .input-group--text-field input {
    height: 20px;
  }
  .gene-info .input-group__input {
    min-height: 20px;
  }
  .gene-info .input-group__details {
    min-height: 0px;
  }



</style>

<style lang="sass" >

@import ../../../assets/sass/variables


#gene-variants-card
  padding-left: 10px
  padding-top: 0px
  padding-right: 10px
  margin-bottom: 10px

  .v-input
    margin-top: -8px
    padding-top: 0px
    .v-input__slot
      margin-bottom: 0px
      input
        padding-bottom: 0px

  #gene-variants-heading
    color: $app-color
    padding-bottom: 0px
    font-size: 15px
    display: flex
    padding-left: 0px
    margin-left: 0px
    padding-top: 7px


  .card-title
    color: $app-color
    font-size: 15px
    margin-right: 1px



  #gene-name
    margin-left: 0px
    color:  $app-color
    margin-top: 0px
    font-size: 15px
    display:inline-block
    vertical-align: middle



  #gene-chr
    margin-left: 0px
    vertical-align: middle
    color:  $app-color

  #gene-region
    margin-left: 3px
    vertical-align: middle
    color:  $app-color

  #region-buffer-box
    vertical-align: middle
    .input-group--text-field, .v-text-field__slot
      input
        font-size: 14px
        color: $app-color
        fill:  $app-color


  #select-transcripts-box
    margin-right: 30px
    vertical-align: middle !important

</style>


<template>

  <v-card v-if="selectedGene" tile id="gene-variants-card" class="app-card full-width">

    <div  id="gene-variants-heading" v-if="selectedGene" class="gene-info text-xs-left">



      <div style="display:inline-block;width:223px">


        <gene-menu
        :selectedGene="selectedGene"
        :selectedTranscript="selectedTranscript"
        :geneModel="cohortModel.geneModel">
        </gene-menu>
      </div>



      <div>
        <span id="gene-chr" class="gene-card-label keep-case" >{{ selectedGene.chr }}</span>
        <span id="gene-region"   class="gene-card-label keep-case">
        {{ selectedGene.startOrig | formatRegion }} - {{ selectedGene.endOrig | formatRegion }}
        </span>
        <span id="minus-strand"  v-if="selectedGene.strand == '-'"  style="font-size:12px;padding-left: 5px;font-style: italic;">reverse strand</span>
        <span  id="gene-plus-minus-label"  style="padding-left: 15px">+  -</span>
        <div id="region-buffer-box" style="display:inline-block;width:40px;height:21px;"  >
            <v-text-field
                id="gene-region-buffer-input"
                class="sm fullview"
                v-model="regionBuffer"
                v-on:change="onGeneRegionBufferChange">
            </v-text-field>
        </div>
      </div>

      <div style="margin-top: -4px;margin-left:30px">
        <transcripts-menu
          v-if="selectedTranscript && selectedTranscript.transcript_id"
          :selectedGene="selectedGene"
          :selectedTranscript="selectedTranscript"
          :geneSources="geneSources"
          :geneModel="cohortModel.geneModel"
          @transcriptMenuOpened="onClickTranscript"
          @transcriptSelected="onTranscriptSelected"
          @gene-source-selected="onGeneSourceSelected">
        </transcripts-menu>
      </div>

    </div>




  </v-card>
</template>

<script>

import GeneMenu          from "../partials/GeneMenu.vue"
import TranscriptsMenu      from '../partials/TranscriptsMenu.vue'


export default {
  name: 'gene-variants-card',
  components: {
    GeneMenu,
    TranscriptsMenu
  },
  props: {
    selectedGene: null,
    selectedTranscript: null,
    genomeBuildHelper: null,
    cohortModel: null,
  },
  data() {
    return {
      geneSource: null,
      geneSources: ['gencode', 'refseq'],

      noTranscriptsWarning: null,
      showNoTranscriptsWarning: false,

      regionBuffer: null

    }
  },


  methods: {
    formatCanonicalTranscript: function() {
      if (this.selectedTranscript) {
        return this.globalApp.utility.stripTranscriptPrefix(this.selectedTranscript.transcript_id);
      } else {
        return "";
      }
    },

    onGeneRegionBufferChange: _.debounce(function (newGeneRegionBuffer) {
      this.$emit('gene-region-buffer-change', parseInt(newGeneRegionBuffer));
    }, 100),
    onClickTranscript: function(link) {
    },
    onTranscriptSelected: function(transcript) {
      var self = this;
      self.$emit('transcript-selected', transcript);
    },
    onGeneSourceSelected: function(geneSource) {
      let self = this;

      var switchMsg = null;
      if (self.geneModel.refseqOnly[self.selectedGene.gene_name] && geneSource != 'refseq') {
        switchMsg = 'Gene ' + self.selectedGene.gene_name + ' only in RefSeq. Switching to this transcript set.';
        self.geneSource = 'refseq';
      } else if (self.geneModel.gencodeOnly[self.selectedGene.gene_name] && geneSource != 'gencode') {
        switchMsg = 'Gene ' + self.selectedGene.gene_name + ' only in Gencode. Switching to this transcript set.';
        self.geneSource = 'gencode';
      } else {
        self.geneSource = geneSource;
      }
      if (switchMsg) {
        self.noTranscriptsWarning = switchMsg;
        self.showNoTranscriptsWarning = true;
      }
      self.$emit('gene-source-selected', self.geneSource);
    },
  },


  computed: {

  },

  watch: {

  },

  filters: {
    formatRegion: function (value) {
      return !value ? '' : d3.format(",")(value);
    },
    formatTranscriptType: function(transcript) {
      if (transcript && transcript.transcript_type.indexOf("transcript") < 0) {
        return transcript.transcript_type + " transcript";
      } else if (transcript) {
        return transcript.transcript_type;
      } else {
        return "";
      }
    }
  },

  updated: function() {

  },

  mounted: function() {
    this.regionBuffer = this.cohortModel.geneModel.geneRegionBuffer;
  },

  created: function() {
  }


}
</script>


