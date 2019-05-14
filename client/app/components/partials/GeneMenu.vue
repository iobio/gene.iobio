<style lang="css" >
  #gene-viz .current {
      outline: none;
  }

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
<style lang="sass">

@import ../../../assets/sass/variables

.gene-info
  padding-top: 20px
  padding-left: 20px
  padding-right: 20px
  padding-bottom: 15px

  .card-title
    color: $app-color
    font-size: 15px
    margin-right: 1px

  &.full
    max-height: initial



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
    margin-left: 0px
    vertical-align: middle
    color:  $app-color

  #gene-region
    margin-left: 3px
    vertical-align: middle
    color:  $app-color

  #region-buffer-box
    vertical-align: middle
    .input-group--text-field
      input
        font-size: 14px
        color: $app-color
        fill:  $app-color


  #select-transcripts-box
    margin-right: 30px
    vertical-align: middle !important
</style>

<template>
    <v-menu
    offset-x
    :close-on-content-click="false"
    :nudge-width="200"
    left
    v-model="showGeneMenu"
    >

      <v-btn id="show-gene-button"
       flat
       slot="activator">
        <span>
          Gene {{ selectedGene.gene_name }}
        </span>
        <v-icon >more_vert</v-icon>
      </v-btn>

    <div class="gene-info">
      <div>
        <span class="card-title" id="gene-card-title">Gene</span>
        <span id="gene-name"  class="gene-card-label heading ">
          {{ selectedGene.gene_name }}
        </span>
      </div>

      <div style="margin-top:15px">
        <span id="gene-chr" class="gene-card-label keep-case" >{{ selectedGene.chr }}</span>
        <span id="gene-region"   class="gene-card-label keep-case">
        {{ selectedGene.startOrig | formatRegion }} - {{ selectedGene.endOrig | formatRegion }}
        </span>
        <span id="minus-strand"  v-if="selectedGene.strand == '-'"  style="font-size:12px;padding-left: 5px;font-style: italic;">reverse strand</span>
        <span  id="gene-plus-minus-label"  style="padding-left: 15px">+  -</span>
        <div id="region-buffer-box" style="display:inline-block;width:50px;height:21px;margin-right:15px"  >
            <v-text-field
                id="gene-region-buffer-input"
                class="sm fullview"
                v-model="regionBuffer"
                v-on:change="onGeneRegionBufferChange">
            </v-text-field>
        </div>
      </div>

      <div style="margin-top:10px">
        <transcripts-menu
          :selectedGene="selectedGene"
          :selectedTranscript="selectedTranscript"
          :geneSources="geneSources"
          :geneModel="geneModel"
          @transcriptMenuOpened="onClickTranscript"
          @transcriptSelected="onTranscriptSelected"
          @gene-source-selected="onGeneSourceSelected">
        </transcripts-menu>
      </div>



    </div>
    <hr style="margin-top:0px;margin-bottom:0px"/>
      <v-list style="margin-left:5px">

          <v-list-tile
           v-for="link in links"
           :key="link.name">

            <v-list-tile-title @click="onClickLink">
              <v-icon style="font-size:14px;margin-right:3px">open_in_new</v-icon>
              <a
                :href="link.url"
                :target="`_` + link.name"
                class="gene-link"
                >
                  {{ link.display }}
              </a>
            </v-list-tile-title>

          </v-list-tile>

      </v-list>


    </v-menu>
</template>

<script>

import TranscriptsMenu      from '../partials/TranscriptsMenu.vue'


export default {
  name: 'gene-menu',
  components: {
    TranscriptsMenu
  },
  props: {
    geneModel: null,
    selectedGene: null,
    selectedTranscript: null
  },
  data () {
    return {
      showGeneMenu: null,
      links: null,

      geneRegionBuffer: null,
      geneSource: null,
      geneSources: ['gencode', 'refseq'],

      noTranscriptsWarning: null,
      showNoTranscriptsWarning: false
    }
  },
  watch: {
  },
  computed: {
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
  methods: {
    onClickLink: function(link) {
    },
    initLinks: function() {
      if (this.selectedGene && this.geneModel) {
        this.links = this.geneModel.getLinks(this.selectedGene.gene_name);
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
  created: function() {
  },
  mounted: function() {
  },
  updated: function() {
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
  watch: {
    showGeneMenu: function() {
      this.initLinks();
    },
    selectedGene: function() {
      this.initLinks();
    },
    geneModel: function() {
      this.geneRegionBuffer = this.geneModel ? this.geneModel.geneRegionBuffer : 0;
    },
  }
}
</script>
