
<style lang="css" >
  #gene-viz .current {
      outline: none;
  }

  .content .btn__content {
    color:  rgb(113,113,113);
  }
  .content .input-group {
    padding: 0px;
  }
  .content .input-group__messages {
    display: none;
  }
  .content  .input-group--text-field input {
    height: 20px;
  }
  .content .input-group__input {
    min-height: 20px;
  }
  .content .input-group__details {
    min-height: 0px;
  }

  #zoom-hint {
    font-size: 12px
  }

  #gene-name {
    margin-left: 0px;
    font-weight: bold;
  }

  #gene-chr {
    margin-left: 5px
  }

  #gene-region {
    margin-left: 3px
  }

  #region-buffer-box .input-group--text-field input{
      font-size: 14px;
      color: rgb(113,113,113);
      fill:  rgb(113,113,113);
  }

  #gene-track #non-protein-coding {
    clear: both;
    padding-bottom: 0px;
    display: block;
    padding-top: 2px;
  }

  #select-transcripts-box {
    margin-right: 25px;
    vertical-align: middle !important;
  }

  #gene-source-box {
    margin-top: -5px;
    margin-left: 0px;
    display: inline-block;
    width: 115px;
    vertical-align: initial;
  }

  #gene-source-box .input-group--select .input-group__selections__comma {
    font-size: 14px;
    padding: 0px 0px 0px 0px;

  }
  #gene-source-box .input-group label {
    font-size: 14px;
    line-height: 25px;
    height: 25px;
  }
  #gene-source-box .input-group__input {
    min-height: 0px;
    margin-top: 10px;
  }

  #phenotypes {
    margin-top: 8px;
  }

  #phenotypes-heading {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    display: inline-block;
    margin-top: 5px;
    font-size: 12px;
    font-weight: bold;
  }
  #phenotype-terms {
    font-size: 12px;
  }

  #phenotypes .btn--floating.btn--small {
    height: 18px !important;
    width: 16px !important;
    padding: 0px !important;
    margin: 0px;
    margin-left: 3px;
  }
  #phenotypes .btn--floating.btn--small .btn__content {
    padding: 0px;
  }
  #ncbi-summary {
    margin-top: 5px;
    font-size: 12px;
    font-weight: normal;
  }


</style>

<style lang="sass">
@import ../../../assets/sass/variables
#gene-name
  color: $app-color !important
</style>


<template>

  <div tile id="gene-track" class="app-card">
    <div primary-title style="width:100%">
      <span style="display:inline-block" v-if="showTitle ">Gene</span>
    </div>
    <div>
      <div style="display:inline-block;margin-right:auto;">
        <a id="gene-name" target="_genecards" class="level-basic gene-card-label heading " data-toggle="tooltip" data-placement="right" >{{ selectedGene.gene_name }}</a>

        <span id="gene-chr"  v-if="showGene"   class="level-basic gene-card-label keep-case" >{{ selectedGene.chr }}</span>

        <span id="gene-region"  v-if="showGene"  class="level-edu level-basic gene-card-label keep-case">
        {{ selectedGene.startOrig | formatRegion }} - {{ selectedGene.endOrig | formatRegion }}
        </span>

        <span id="minus-strand"  v-if="selectedGene.strand == '-'"  class=" level-edu level-basic" style="font-size:12px;padding-left: 5px;font-style: italic;">reverse strand</span>

        <span  id="gene-plus-minus-label"  v-if="showGene && !isEduMode && !isBasicMode"  class="level-edu level-basic fullview  " style="padding-left: 15px">+  -</span>

        <div v-if="showGene && !isEduMode && !isBasicMode" id="region-buffer-box" style="display:inline-block;width:50px;height:21px;margin-right:15px"  >
            <v-text-field
                id="gene-region-buffer-input"
                class="sm level-edu level-basic  fullview"
                v-model="regionBuffer"
                v-on:change="onGeneRegionBufferChange">
            </v-text-field>
        </div>
        <transcripts-viz
          v-if="!isEduMode && !isBasicMode"
          v-bind:class="{ hide: !showGene }"
          :selectedGene="selectedGene"
          :selectedTranscript="selectedTranscript"
          @transcriptSelected="onTranscriptSelected">
        </transcripts-viz>

        <div id="gene-source-box" v-if="showGene">
          <v-select
              v-bind:items="geneSources"
              v-model="geneSource"
              label="Gene source"
              item-value="text"
              @input="onGeneSourceSelected">
          </v-select>
        </div>

      </div>

    </div>

    <!-- Non protein-coding gene badges -->
    <div id="non-protein-coding" class="level-edu level-basic">
        <div id="no-gene-selected-badge" class="hide label label-warning" style="display:block;margin-bottom:2px;">
          Enter a gene name
        </div>
        <div id="gene-type-badge"
          v-if="showGeneTypeWarning"
          class="label label-warning"
          style="display:block;margin-bottom:2px;">
          {{ selectedGene.gene_type }}
        </div>
        <div id="transcript-type-badge"
          v-if="showTranscriptTypeWarning"
          class=" label label-warning"
          style="display:block;">
          {{ selectedTranscript | formatTranscriptType }}
        </div>
        <div id="no-transcripts-badge"
          v-if="showNoTranscriptsWarning"
          class=" label label-warning" style="display:block;">
          {{ noTranscriptsWarning }}
        </div>
    </div>

    <div id="transcript-panel"  v-if="showGeneViz" class="level-edu fullview" >


      <gene-viz id="gene-viz"
        :data="[selectedTranscript]"
        :margin="margin"
        :trackHeight="trackHeight"
        :cdsHeight="cdsHeight"
        :regionStart="parseInt(selectedGene.start)"
        :regionEnd="parseInt(selectedGene.end)"
        :showBrush=false
        @region-zoom="onRegionZoom"
        @region-zoom-reset="onRegionZoomReset"
        >
      </gene-viz>



    </div>

    <div style="min-height:180px;max-height:180px;overflow-y:scroll">
      <div v-if="showGene && ncbiSummary" id="ncbi-summary">
        {{ ncbiSummary.summary }}
      </div>

      <div id="phenotypes" v-if="showGene && phenotypes">


        <span id="phenotypes-heading" style="text-align:left">
          Phenotypes
        </span>
        <div id="phenotype-terms">
        {{ phenotypeTerms }}
        </div>
      </div>
    </div>

  </div>



</template>

<script>

import GeneViz from '../viz/GeneViz.vue'
import TranscriptsViz from '../viz/TranscriptsViz.vue'
import Vue from 'vue'

export default {
  name: 'gene-card',
  components: {
    GeneViz,
    TranscriptsViz
  },
  props: {
    isEduMode: null,
    isBasicMode: null,
    selectedGene: {},
    selectedTranscript: {},
    geneRegionStart: null,
    geneRegionEnd: null,
    geneModel: null,
    showGeneViz: null,
    showTitle: null
  },
  data() {
    let self = this;
    return {
      margin: {
        top: self.isBasicMode || self.isEduMode ? 0 : 20,
        right: self.isBasicMode || self.isEduMode ? 7 : 2,
        bottom: 18,
        left: self.isBasicMode || self.isEduMode ? 9 : 4
      },
      trackHeight: (self.isEduMode || self.isBasicMode ? 32 : 22),
      cdsHeight: (self.isEduMode  || self.isBasicMode  ? 24 : 18),


      geneSource: null,
      geneSources: ['gencode', 'refseq'],

      noTranscriptsWarning: null,
      showNoTranscriptsWarning: false,

      geneRegionBuffer: null,

      phenotypes: null,
      phenotypeTerms: null,
      ncbiSummary: null
    }
  },


  methods: {
    onTranscriptSelected: function(transcript) {
      var self = this;
      self.$emit('transcript-selected', transcript);
    },


    onGeneSourceSelected: function() {
      let self = this;

      var switchMsg = null;
      if (self.geneModel.refseqOnly[self.selectedGene.gene_name] && self.geneSource != 'refseq') {
        switchMsg = 'Gene ' + self.selectedGene.gene_name + ' only in RefSeq. Switching to this transcript set.';
        self.geneSource = 'refseq';
      } else if (self.geneModel.gencodeOnly[self.selectedGene.gene_name] && self.geneSource != 'gencode') {
        switchMsg = 'Gene ' + self.selectedGene.gene_name + ' only in Gencode. Switching to this transcript set.';
        self.geneSource = 'gencode';
      }
      if (switchMsg) {
        self.noTranscriptsWarning = switchMsg;
        self.showNoTranscriptsWarning = true;
      }
      self.$emit('gene-source-selected', self.geneSource);
    },

    onGeneRegionBufferChange: _.debounce(function (newGeneRegionBuffer) {
      this.$emit('gene-region-buffer-change', parseInt(newGeneRegionBuffer));
    }, 100),

    onRegionZoom: function(regionStart, regionEnd) {
      this.$emit('gene-region-zoom', regionStart, regionEnd);
    },
    onRegionZoomReset: function() {
      this.$emit('gene-region-zoom-reset');
    },
    initSummaryInfo: function() {
      if (this.selectedGene && this.selectedGene.gene_name) {
        this.ncbiSummary = this.geneModel.geneNCBISummaries[this.selectedGene.gene_name];
        this.phenotypes = this.geneModel.genePhenotypes[this.selectedGene.gene_name]
        if (this.phenotypes) {
          this.phenotypeTerms =  this.phenotypes.map(function(d) {
            return d.hpo_term_name;
          }).join(", ");
        }
      } else {
        this.ncbiSummary = null;
        this.phenotypes = null;
      }
    }

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

  computed: {


    showGene: function() {
      return this.selectedGene != null && Object.keys(this.selectedGene).length > 0
    },

    showGeneTypeWarning: function() {
      return  this.selectedGene != null
        && Object.keys(this.selectedGene).length > 0
        && this.selectedGene.gene_type != 'protein_coding'
        && this.selectedGene.gene_type != 'gene';
    },

    showTranscriptTypeWarning: function() {
      if (this.selectedTranscript == null || this.selectedTranscript.transcript_type == 'protein_coding'
       || this.selectedTranscript.transcript_type == 'mRNA'
       || this.selectedTranscript.transcript_type == 'transcript') {
       return false;
      } else {
        if (this.selectedGene.gene_type != this.selectedTranscript.transcript_type) {
          return true;
        } else {
          return false;
        }
      }
    },

    regionBuffer: {
      get() {
        return this.value == undefined ? 1000 : this.value
      },
      set(val) {
        Vue.nextTick(() => {
          this.$emit('input', val)
        })
      }
    }


  },

  watch: {
    geneModel: function() {
      this.geneRegionBuffer = this.geneModel ? this.geneModel.geneRegionBuffer : 0;
    },
    geneRegionStart: function() {

    },
    geneRegionEnd: function() {

    },
    selectedGene: function() {
      this.initSummaryInfo();
    }
  },

  mounted: function() {
    this.geneSource = this.geneModel.geneSource;
    this.initSummaryInfo();

  },

  created: function() {
  }


}
</script>


