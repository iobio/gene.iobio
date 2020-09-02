<style lang="css" >
    .gene-info .btn__content,
    .gene-info .v-btn__content {
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
        padding-top: 5px
        padding-right: 10px
        margin-bottom: 7px
        .gene-info
            display: flex
            align-items: center
        .v-input
            margin-top: -8px
            padding-top: 0px
            .v-input__slot
                margin-bottom: 0px
                input
                  padding-bottom: 0px
        #gene-variants-heading
            color: $app-color
            font-size: 16px
            display: flex
            padding-left: 0px
            margin-left: 0px
            min-width: 170px
            justify-content: flex-start
            padding-top: 5px
            padding-bottom: 5px
            align-items: center
        .pubmed-table-title
          color: $app-color
        .card-title
            color: $app-color
            font-size: 15px
            margin-right: 1px
        #gene-name
            font-size: 16px
            color: $app-color
            margin-left: 5px
            margin-top: 0px
            display:inline-block
            vertical-align: middle
        #gene-chr
            margin-left: 0px
            vertical-align: middle
            color:  $app-color
            font-size: 14px
        #gene-region
            margin-left: 3px
            vertical-align: middle
            color:  $app-color
            font-size:  14px
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
</style>


<template>


	<div v-if="selectedGene">
		<div   class="gene-info text-xs-left">
			<div id="gene-variants-heading">
			Gene
				<span id="gene-name"> {{ selectedGene.gene_name}} </span>
			</div>
			<gene-links-menu v-if="!isBasicMode"
			             :selectedGene="selectedGene"
			             :geneModel="cohortModel.geneModel">
			</gene-links-menu>

			<div style="display:inline-block;margin-left: 20px">
				<transcripts-menu
		        v-if="analyzedTranscript && analyzedTranscript.transcript_id && !isBasicMode&& !isSimpleMode"
		        :selectedGene="selectedGene"
		        :selectedTranscript="analyzedTranscript"
		        :geneSources="geneSources"
		        :geneModel="cohortModel.geneModel"
		        @transcriptMenuOpened="onClickTranscript"
		        @transcriptSelected="onTranscriptSelected"
		        @gene-source-selected="onGeneSourceSelected">
				</transcripts-menu>
			</div>




			<div style="display:inline-block;margin-left:10px">


				<span id="gene-chr" class=" keep-case" >{{ selectedGene.chr }}</span>
				<span id="gene-region"   class="keep-case">
				{{ selectedGene.startOrig | formatRegion }} - {{ selectedGene.endOrig | formatRegion }}
				</span>

				<v-badge id="minus-strand"   class="info" style="margin-left:3px;margin-right:10px" v-if="selectedGene.strand == '-'">reverse strand</v-badge>

				<span  id="gene-plus-minus-label"  v-if="!isBasicMode && !isSimpleMode"  style="padding-left: 15px">+  -</span>
				<div id="region-buffer-box" v-if="!isBasicMode && !isSimpleMode" style="display:inline-block;width:50px;height:21px;"  >
		    		<v-text-field
		            id="gene-region-buffer-input"
		            class="sm fullview"
		            v-model="regionBuffer"
		            v-on:change="onGeneRegionBufferChange">
		    		</v-text-field>
				</div>
			</div>

		</div>

    <div style="display:flex;justify-content:space-between;margin-top:5px">
        <gene-omim-table 
         v-if="!isCommercial && selectedGene && cohortModel"
         :selectedGene="selectedGene" 
         :geneModel="cohortModel.geneModel">
        </gene-omim-table>

        <div>
          <div style="display:flex;height:25px" v-if="selectedGene && cohortModel && Object.keys(selectedGene).length > 0">
            <div class="pubmed-table-title">PubMed</div>
            <gene-pubmed-popup  
            :geneModel="cohortModel.geneModel"
            :selectedGene="selectedGene"
            showAll="true">
            </gene-pubmed-popup>
          </div>
          <gene-pubmed-table
           v-if="selectedGene && cohortModel"
           :selectedGene="selectedGene" 
           :geneModel="cohortModel.geneModel"
           :showSource="true"
           :showAll="false">
          </gene-pubmed-table>
          
        </div>

    </div>

	</div>
</template>

<script>
    import GeneOMIMTable        from '../partials/GeneOMIMTable.vue'
    import GenePubMedTable      from '../partials/GenePubMedTable.vue'
    import GenePubMedPopup      from '../partials/GenePubMedPopup.vue'
    import GeneLinksMenu        from "../partials/GeneLinksMenu.vue"
    import TranscriptsMenu      from '../partials/TranscriptsMenu.vue'
    export default {
        name: 'gene-variants-card',
        components: {
            'gene-omim-table': GeneOMIMTable,
            'gene-pubmed-table': GenePubMedTable,
            'gene-pubmed-popup': GenePubMedPopup,
            GeneLinksMenu,
            TranscriptsMenu,
        },
        props: {
            selectedGene: null,
            selectedTranscript: null,
            genomeBuildHelper: null,
            cohortModel: null,
            sampleModels: null,
            showSfariTrackToggle: false,
            isEduMode: null,
            isBasicMode: null,
            isSimpleMode: null,
            isFullAnalysis: null,
            isCommercial: null,
            isLoaded: null,
            launchedFromClin: null,
            launchedFromHub: null
        },
        data() {
            return {
                geneSource: null,
                geneSources: ['gencode', 'refseq'],
                noTranscriptsWarning: null,
                showNoTranscriptsWarning: false,
                regionBuffer: null,
                analyzedTranscript: null,
                noData: null
            }
        },
        methods: {

            noDataAlert: function(){
                if(this.noData){
                    this.$emit("no-data-warning");
                }
            },

            //assume that no data is loaded, and analyze transcript inside of GeneVariantsCard
            //If we find out later that data is loaded, this will be overwritten
            populateTranscriptData: function(){
                let self = this;
                let transcript = this.cohortModel.geneModel.getCanonicalTranscript(this.selectedGene);
                self.cohortModel.promiseMarkCodingRegions(self.selectedGene, transcript)
                    .then(function(data) {
                        self.analyzedTranscript = data.transcript;
                        self.noData = true;
                        setTimeout(self.noDataAlert, 2000);
                    })
            },

            formatCanonicalTranscript: function() {
                if (this.selectedTranscript) {
                    return this.globalApp.utility.stripTranscriptPrefix(this.selectedTranscript.transcript_id);
                } else {
                    return "";
                }
            },
            onGeneRegionBufferChange: _.debounce(function (newGeneRegionBuffer) {
                this.regionBuffer = Math.min(parseInt(newGeneRegionBuffer), 99999);
                this.$emit('gene-region-buffer-change', this.regionBuffer);
            }, 100),
            onClickTranscript: function(link) {
            },
            onTranscriptSelected: function(transcript) {
                let self = this;
                if(this.sampleModels.length === 0){
                    this.analyzedTranscript = transcript;
                }

                self.$emit('transcript-selected', transcript);
            },
            onGeneSourceSelected: function(geneSource) {
                let self = this;
                var switchMsg = null;
                if (self.cohortModel.geneModel.refseqOnly[self.selectedGene.gene_name] && geneSource != 'refseq') {
                    switchMsg = 'Gene ' + self.selectedGene.gene_name + ' only in RefSeq. Switching to this transcript set.';
                    self.geneSource = 'refseq';
                } else if (self.cohortModel.geneModel.gencodeOnly[self.selectedGene.gene_name] && geneSource != 'gencode') {
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

            selectedTranscript: function(){
              this.analyzedTranscript = this.selectedTranscript;
            },

            //If we find out that data is loaded, overwrite analyzed transcript with the transcript provided
            sampleModels: function(){
                this.analyzedTranscript = this.selectedTranscript;
                this.noData = false;
            },

            selectedGene: function(){
                if(this.sampleModels.length === 0) {
                    if(this.selectedGene.gene_name !== this.analyzedTranscript.gene_name) {
                        this.populateTranscriptData();
                    }
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
        updated: function() {
        },
        mounted: function() {
            this.regionBuffer = this.cohortModel.geneModel.geneRegionBuffer;
            this.populateTranscriptData();
        },
        created: function() {
        }
    }
</script>

