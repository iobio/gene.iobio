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

  #gene-source-box {
    margin-top: 0px;
    margin-left: 5px;
    display: inline-block;
    width: 115px;
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
    max-height: 74px;
    overflow-y: scroll;
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

  <v-card tile id="gene-track" class="app-card">
    <v-card-title primary-title style="width:100%">
      <span style="display:inline-block">Gene</span>
    </v-card-title>
    <div>
      <div style="display:inline-block;margin-right:auto;">
        <a id="gene-name" target="_genecards" class="level-basic gene-card-label heading " data-toggle="tooltip" data-placement="right" >{{ selectedGene.gene_name }}</a>

        <span id="gene-chr"  v-if="showGene"   class="level-basic gene-card-label keep-case" >{{ selectedGene.chr }}</span>

        <span id="gene-region"  v-if="showGene"  class="level-edu level-basic gene-card-label keep-case">
        {{ selectedGene.startOrig | formatRegion }} - {{ selectedGene.endOrig | formatRegion }}
        </span>

        <span id="minus-strand"  v-if="selectedGene.strand == '-'"  class=" level-edu level-basic" style="font-size:12px;padding-left: 5px;font-style: italic;">reverse strand</span>

        <span  id="gene-plus-minus-label"  v-if="showGene"  class="level-edu level-basic fullview  " style="padding-left: 15px">+  -</span>

        <div id="region-buffer-box" style="display:inline-block;width:50px;height:21px"  v-if="showGene" >
            <v-text-field
                id="gene-region-buffer-input"
                class="sm level-edu level-basic  fullview"
                v-model="regionBuffer"
                v-on:change="onGeneRegionBufferChange">
            </v-text-field>
        </div>
      </div>
      <div id="gene-info-box" class="level-edu level-basic" style="margin-left:30px;clear:both;display:inline-block;">
            <transcripts-viz
              v-bind:class="{ hide: !showGene }"
              :selectedGene="selectedGene"
              :selectedTranscript="selectedTranscript"
              @transcriptSelected="onTranscriptSelected">
            </transcripts-viz>
            <v-icon style="margin-left:20px;font-size:17px" @click="showSettings = !showSettings">settings</v-icon>
            <div id="gene-source-box" v-if="showGene && showSettings">
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


      <span id="zoom-hint"  v-if="showGene"  class="level-edu hint todo" style="margin-top: 0px;display: block;text-align: center;">
          (drag to zoom)
      </span>


      <div id="top-coordinate-frame" class="hide">
        <svg height="23" width="28">
            <g  transform="translate(0,0)">
              <rect class="coordinate-arrow" x="9" y="1" width="10" height="8">
              </rect>
            </g>
            <g transform="translate(24,23),rotate(180)">
              <polygon class="coordinate-arrow" points="0,14 10,0 20,14" x="0" y="0">
              </polygon>
            </g>
        </svg>
      </div>


      <gene-viz id="gene-viz"
        :data="[selectedTranscript]"
        :margin="margin"
        :trackHeight="trackHeight"
        :cdsHeight="cdsHeight"
        :regionStart="parseInt(selectedGene.start)"
        :regionEnd="parseInt(selectedGene.end)"
        :showBrush=true
        @region-zoom="onRegionZoom"
        @region-zoom-reset="onRegionZoomReset"
        >
      </gene-viz>



    </div>


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

  </v-card>



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
    selectedGene: {},
    selectedTranscript: {},
    geneRegionStart: null,
    geneRegionEnd: null,
    geneModel: null,
    showGeneViz: null
  },
  data() {
    return {
      margin: {
        top: isLevelBasic || isLevelEdu ? 0 : 20,
        right: isLevelBasic || isLevelEdu ? 7 : 2,
        bottom: 18,
        left: isLevelBasic || isLevelEdu ? 9 : 4
      },
      trackHeight: (isLevelEdu || isLevelBasic ? 32 : 22),
      cdsHeight: (isLevelEdu  || isLevelBasic  ? 24 : 18),


      geneSource: null,
      geneSources: ['gencode', 'refseq'],

      noTranscriptsWarning: null,
      showNoTranscriptsWarning: false,

      geneRegionBuffer: null,

      phenotypes: null,
      phenotypeTerms: null,
      ncbiSummary: null,
      showSettings: false
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
    }

  },


  filters: {
    formatRegion: function (value) {
      return !value ? '' : utility.formatRegion()(value);
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

  mounted: function() {
    this.geneSource = this.geneModel.geneSource;

  },

  created: function() {
  }


}
</script>


