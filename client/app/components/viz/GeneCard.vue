<style lang="css">
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

  #gene-track .label-warning {
    max-width: 300px;
    min-width: 100px;
    margin: auto;
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


</style>


<template>

  <v-card tile id="gene-track" class="app-card">
    <v-card-title primary-title>Selected Gene</v-card-title>

    <div id="gene-info-box" class="level-edu level-basic" style="clear:both;margin-top:-25px">


        <div style="text-align:center;display:inline-block;width:100%;padding-top:5px">
          <div style="vertical-align:top;display:inline-block">

            <a id="gene-name" target="_genecards" class="level-basic gene-card-label heading " data-toggle="tooltip" data-placement="right" >{{ selectedGene.gene_name }}</a>
            <span id="gene-chr"  v-if="showGene"   class="level-basic gene-card-label keep-case" >{{ selectedGene.chr }}</span>

            <span id="gene-region"  v-if="showGene"  class="level-edu level-basic gene-card-label keep-case">
            {{ selectedGene.startOrig | formatRegion }} - {{ selectedGene.endOrig | formatRegion }}
            </span>

            <span id="minus_strand"  v-if="selectedGene.strand == '-'"  class=" level-edu level-basic" style="font-size:12px;padding-left: 5px;font-style: italic;">reverse strand</span>

            <span  id="gene-plus-minus-label"  v-if="showGene"  class="level-edu level-basic fullview  " style="padding-left: 15px">+  -</span>

            <div id="region-buffer-box" style="display:inline-block;width:50px"  v-if="showGene" >
                <v-text-field
                    id="gene-region-buffer-input"
                    class="sm level-edu level-basic  fullview"
                    v-model="regionBuffer"
                    v-on:change="onGeneRegionBufferChange">
                </v-text-field>
            </div>


          </div>

          <div id="gene-source-box" v-if="showGene" style="margin-top:-7px;margin-left:20px;display:inline-block;width:150px">
            <v-select
                v-bind:items="geneSources"
                v-model="geneSource"
                label="Gene source"
                class="input-group--focused"
                item-value="text"
                @input="onGeneSourceSelected">
            </v-select>
          </div>

          <transcripts-viz
            v-bind:class="{ hide: !showGene }"
            :selectedGene="selectedGene"
            :selectedTranscript="selectedTranscript"
            @transcriptSelected="onTranscriptSelected">
          </transcripts-viz>

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

    <div id="transcript-panel" class="level-edu fullview" >

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
        :height=40
        :trackHeight="trackHeight"
        :cdsHeight="cdsHeight"
        :regionStart="parseInt(selectedGene.start)"
        :regionEnd="parseInt(selectedGene.end)"
        :showBrush=true
        @region-zoom="onRegionZoom"
        @region-zoom-reset="onRegionZoomReset"
        >
      </gene-viz>

      <span id="zoom-hint"  v-if="showGene"  class="level-edu hint todo" style="margin-top: 0px;display: block;text-align: center;">
          To zoom into region, drag over gene model.
      </span>
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
    selectedTranscript: {}
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


      geneSource: 'gencode',
      geneSources: ['gencode', 'refseq'],

      noTranscriptsWarning: null,
      showNoTranscriptsWarning: false,

      geneRegionBuffer: 1000
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
      if (geneModel.refseqOnly[self.selectedGene.gene_name] && self.geneSource != 'refseq') {
        switchMsg = 'Gene ' + self.selectedGene.gene_name + ' only in RefSeq. Switching to this transcript set.';
        self.geneSource = 'refseq';
      } else if (geneModel.gencodeOnly[self.selectedGene.gene_name] && self.geneSource != 'gencode') {
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
      this.$emit('gene-region-buffer-change', newGeneRegionBuffer);
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
      if (transcript.transcript_type.indexOf("transcript") < 0) {
        return transcript.transcript_type + " transcript";
      } else {
        return transcript.transcript_type;
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



  mounted: function() {


  },

  created: function() {
  }


}
</script>


