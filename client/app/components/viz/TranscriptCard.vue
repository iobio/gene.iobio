 <style lang="sass">
@import ../../../assets/sass/variables


#transcript-card

  #sample-label
    vertical-align: top
    display: inline-block
    min-width: 193px
    max-width: 193px
    padding-top: 2px
    color: $heading-color
    font-size: 17px
    margin-right: 4px 
    padding-top: 2px 
    display: flex 
    align-items: center

  #edit-transcript-button
    .v-badge.info 
      background-color: transparent !important

  .hint 
    font-style: italic 
    font-size: 13px
    padding-left: 10px
    padding-right: 10px
    margin-top: 8px
    border: thin solid #e7e7e7 !important

    &.emphasize
      background-color: $hint-background-color !important
      border: thin solid #a7a3a3 !important
      font-weight: 500


</style>

<template>
  <v-card id="transcript-card" @click="onClickOutsideBoundingBox">
    <div style="display:flex;margin-bottom:5px;align-items:center">
      <div id="sample-label">
        <div>{{ selectedGene.gene_name }} TRANSCRIPT</div>
      </div>

      <div style="display: flex;align-items: center;padding-top: 8px;">
          <transcripts-menu v-if="selectedGene && Object.keys(selectedGene).length > 0 && selectedTranscript && selectedTranscript.transcript_id && analyzedTranscript && analyzedTranscript.transcript_id"
          :selectedGene="selectedGene"
          :selectedTranscript="selectedTranscript"
          :geneSources="cohortModel.geneModel.geneSources"
          :geneModel="cohortModel.geneModel"
          @transcriptSelected="onTranscriptSelected"
          @show-settings-for-gene-source="onShowSettingsForGeneSource">
          </transcripts-menu>


      </div>

      <div  :class="zoomClass" style="margin-left: 30px">{{ zoomMessage }}</div>

    </div>

    <div @click.stop="">

      <gene-viz class="gene-viz-transcript-card"
      v-if="showZoom"
      :data="[selectedTranscript]"
      :margin="geneVizMargin"
      :height="geneVizTrackHeight"
      :width="cardWidth"
      :isStandalone="true"
      :showXAxis="true"
      :trackHeight="geneVizTrackHeight"
      :cdsHeight="geneVizCdsHeight"
      :regionStart="regionStart"
      :regionEnd="regionEnd"
      :showBrush="true"
      @region-zoom="onRegionZoom"
      @region-zoom-reset="onRegionZoomReset">
      </gene-viz>

    </div>
  </v-card>
</template>

<script>
import GeneViz         from '../viz/GeneViz.vue'
import TranscriptsMenu from '../partials/TranscriptsMenu.vue'

export default {
  name: 'transcript-card',
  components: {
    GeneViz,
    TranscriptsMenu
  },
  props: {
    selectedGene: null,
    selectedTranscript: null,
    analyzedTranscript: null,
    cohortModel: null,
    geneVizMargin: null,
    geneVizWidth: null,
    geneVizCdsHeight: null,
    geneVizTrackHeight: null,
    regionStart: null,
    regionEnd: null,
    cardWidth: null,
  },
  data () {
    return {
      showZoom: true,
      zoomMessage: "Click and drag to zoom into a region",
      zoomStart: null,
      zoomEnd: null,
      zoomClass: 'hint'
    }
  },
  watch: {
    regionStart: function(){
      if(this.zoomStart !== this.regionStart) {
        this.$emit('gene-region-zoom', this.zoomStart, this.zoomEnd);
      }
    },
    regionEnd: function(){
      if(this.zoomEnd !== this.regionEnd) {
        this.$emit('gene-region-zoom', this.zoomStart, this.zoomEnd);
      }
    },
    clearZoom: function() {
      this.zoomClass = "hint"
      this.zoomMessage = "Click and drag to zoom into a region";
    },
    selectedGene: function() {
      this.onClickOutsideBoundingBox();
    }

  },
  methods: {
    onShowSettingsForGeneSource: function() {
      this.$emit('show-settings-for-gene-source')
    },
    onTranscriptSelected: function(transcript) {
      this.$emit("transcriptSelected", transcript)
    },
    getExonClass: function(exon, i, relationship) {
      if (exon.danger) {
        return exon.feature_type.toLowerCase() + (exon.danger[relationship] ? " danger" : "");
      } else {
        return exon.feature_type.toLowerCase();
      }
    },
    onRegionZoom: function(regionStart, regionEnd) {
      this.zoomMessage = "Click outside of bounding box to zoom out";
      this.zoomStart = regionStart;
      this.zoomEnd = regionEnd;
      this.zoomClass = "hint emphasize"
      this.$emit('gene-region-zoom', regionStart, regionEnd);
    },
    onRegionZoomReset: function() {
      
      this.zoomClass = "hint"
      this.zoomMessage = "Click and drag to zoom into a region";
      this.$emit('gene-region-zoom-reset');
    },
    onClickOutsideBoundingBox: function() {
      let self = this;
      this.showZoom = false;
      this.zoomClass = "hint"
      this.zoomMessage = "Click and drag to zoom into a region";
      this.$emit('gene-region-zoom-reset');

      this.showZoom = false;
      setTimeout(function() {
        self.zoomStart = null;
        self.zoomEnd = null;
        self.showZoom = true;
      }, 500)
    }


  },
  mounted: function() {
  },
  computed: {
  }
}

</script>