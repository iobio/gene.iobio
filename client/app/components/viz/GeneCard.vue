<style lang="css" >
  #gene-viz .current {
    outline: none;
  }
  .content .btn__content. .v-content .v-btn__content {
    color:  rgb(113,113,113);
  }
  .content .input-group, .v-content .v-input-group {
    padding: 0px;
  }
  .content .input-group__messages, .v-content .v-input-group__messages {
    display: none;
  }
  .content  .input-group--text-field input,
  .v-content  .v-input-group--text-field input  {
    height: 20px;
  }
  .content .input-group__input,
  .v-content .v-input-group__input  {
    min-height: 20px;
  }
  .content .input-group__details,
  .v-content .v-input-group__details {
    min-height: 0px;
  }
</style>

<style lang="sass">
  @import ../../../assets/sass/variables
  #gene-track
    margin-bottom: 0px
    .card-title
      color: $app-color
      font-size: 15px
      margin-right: 1px
    &.full
      max-height: initial
    #gene-summary-box
      display: flex
      min-height: 108px
      max-height: 108px
      overflow-y: scroll
    #gene-card-title
      display:inline-block
      vertical-align: middle
    #gene-name
      margin-left: 0px
      color:  $app-color
      margin-top: 0px
      font-size: 15px
      display:inline-block
      vertical-align: middle
    #gene-chr
      margin-left: 5px
      vertical-align: middle
    #gene-region
      margin-left: 3px
      vertical-align: middle
    #region-buffer-box
      vertical-align: middle
      .input-group--text-field, .v-text-field__slot
        input
          font-size: 14px
          color: $text-color
          fill:  $text-color
    #select-transcripts-box
      margin-right: 30px
      vertical-align: middle !important
    #non-protein-coding
      clear: both;
      padding-bottom: 0px;
      display: block;
      padding-top: 2px;
    #ncbi-summary
      min-width: 60%
      flex: 1 1 0
      margin-top: 0px
      margin-right: 20px
      #ncbi-heading
        text-align: left
        margin-left: auto
        margin-right: auto
        width: 100%
        display: inline-block
        margin-top: 0px
        font-size: 12px
        font-weight: bold
        vertical-align: top
        color: $app-color
      #ncbi-text
        font-size: 12px
        line-height: 18px
    #phenotypes
      margin-top: 0px
      flex: 1 1 0
      #phenotypes-heading
        text-align: left
        margin-left: auto
        margin-right: auto
        width: 100%
        display: inline-block
        margin-top: 0px
        font-size: 12px
        font-weight: bold
        vertical-align: top
        color: $app-color
      #phenotype-terms
        font-size: 12px
        line-height: 18px
</style>


<template>

  <div tile id="gene-track" :class="{'app-card': true, 'full': showGeneViz}">

    <div>
      <span class="card-title" id="gene-card-title">Gene</span>
      <span id="gene-name"  class="level-basic gene-card-label heading ">
        {{ selectedGene.gene_name }}
      </span>
      <div :style="isBasicMode || isEduMode ? 'display:inline-block;vertical-align:middle' : 'display:inline-block;vertical-align:top;margin-top:-4px'">

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
        <transcripts-menu
                v-if="!isEduMode && !isBasicMode"
                v-bind:class="{ hide: !showGene }"
                :selectedGene="selectedGene"
                :selectedTranscript="selectedTranscript"
                :geneSources="geneModel.geneSources"
                :geneModel="geneModel"
                @transcriptSelected="onTranscriptSelected"
                @gene-source-selected="onGeneSourceSelected">
        </transcripts-menu>

      </div>

    </div>

    <gene-links-menu
            v-if="showGene && !isBasicMode && !isEduMode"
            :expanded="true"
            :geneModel="geneModel"
            :selectedGene="selectedGene">
    </gene-links-menu>

    <!-- Non protein-coding gene badges -->
    <div id="non-protein-coding"  v-if="!isBasicMode && !isEduMode" class="level-edu level-basic">
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
                :featureClass="getExonClass"

      >
      </gene-viz>



    </div>

    <div id="gene-summary-box" v-if="!isEduMode" >


      <div  v-if="showGene && ncbiSummary" id="ncbi-summary">
        <div id="ncbi-heading">NCBI summary</div>
        <div id="ncbi-text">
          {{ ncbiSummary.summary }}
        </div>
      </div>

      <div id="phenotypes" v-if="showGene && phenotypes && !isBasicMode && !isEduMode">
        <span id="phenotypes-heading" style="text-align:left">
          Phenotypes (HPO)
        </span>
        <div id="phenotype-terms">
          {{ phenotypeTerms }}
        </div>
      </div>
    </div>

  </div>



</template>

<script>
  import GeneViz              from '../viz/GeneViz.vue'
  import GeneLinksMenu        from '../partials/GeneLinksMenu.vue'
  import TranscriptsMenu      from '../partials/TranscriptsMenu.vue'
  import ScrollButton         from '../partials/ScrollButton.vue'
  import Vue from 'vue'
  export default {
    name: 'gene-card',
    components: {
      GeneViz,
      GeneLinksMenu,
      TranscriptsMenu,
      ScrollButton
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
        noTranscriptsWarning: '',
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
      getExonClass: function(exon, i) {
        if (this.showDepthViz && exon.danger) {
          return exon.feature_type.toLowerCase() + (exon.danger[this.sampleModel.relationship] ? " danger" : "");
        } else {
          return exon.feature_type.toLowerCase();
        }
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
        let self = this;
        if (self.selectedGene && self.selectedGene.gene_name) {
          self.ncbiSummary = self.geneModel.geneNCBISummaries[self.selectedGene.gene_name];
          if (self.ncbiSummary == null || self.ncbiSummary.summary == ' ') {
            setTimeout(function() {
              self.geneModel.promiseGetNCBIGeneSummary(self.selectedGene.gene_name)
                      .then(function(data) {
                        self.ncbiSummary = data;
                      })
            }, 500)
          }
          self.phenotypes  = self.geneModel.genePhenotypes[self.selectedGene.gene_name]
          if (self.phenotypes) {
            self.phenotypeTerms =  self.phenotypes.map(function(d) {
              return d.hpo_term_name;
            }).join(", ");
          }
        } else {
          self.ncbiSummary = null;
          self.phenotypes = null;
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
        if (this.selectedGene != null
                && Object.keys(this.selectedGene).length > 0
                && this.selectedGene.gene_type
                && this.selectedGene.gene_type != "null") {
          if ( this.selectedGene.gene_type != 'protein_coding'
                  && this.selectedGene.gene_type != 'gene')
            return true;
        } else {
          return false;
        }
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
      selectedGene: function(newGene, oldGene) {
        if (newGene.gene_name != oldGene.gene_name) {
          this.initSummaryInfo();
        }
      }
    },
    mounted: function() {
      this.geneSource = this.geneModel.geneSource;
      this.initSummaryInfo();
    },
    updated: function() {
    },
    created: function() {
    }
  }
</script>



