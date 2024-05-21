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
            flex-wrap: wrap
            margin-bottom: 10px
        .v-input
            margin-top: -8px
            padding-top: 0px
            .v-input__slot
                margin-bottom: 0px
                input
                  padding-bottom: 0px
        #aliases
          display: flex
          align-items: center
          margin-right: 40px
          #alias-label
            color: $app-color
            font-size: 14px
            line-height: 15px
          #alias-text
            color: $text-color
            font-size: 14px
            line-height: 15px
            max-width: 330px
            min-width: 90px

        #gene-variants-heading
            color: $heading-color
            font-size: 17px
            display: flex
            padding-left: 0px
            margin-left: 0px
            min-width: 193px
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
            margin-left: 0px
            margin-right: 4px
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

        #hpo-term-table

            .hpo-table-body
                max-height: 100px
                min-height: 100px
                overflow-y: scroll

        #hpo-disease-table
            .disease-table-body
                max-height: 100px
                min-height: 100px
                overflow-y: scroll

</style>


<template>


	<div v-if="selectedGene && selectedGene.gene_name && selectedGene.gene_name.length > 0">
		<div   class="gene-info text-xs-left">
			<div id="gene-variants-heading">
				<span id="gene-name">{{ selectedGene.gene_name}} </span> GENE
			</div>

			<div style="display:inline-block;margin-left:10px">


				<span id="gene-chr" class=" keep-case" >{{ selectedGene.chr }}</span>
				<span id="gene-region"   class="keep-case">
				{{ selectedGene.startOrig | formatRegion }} - {{ selectedGene.endOrig | formatRegion }}
				</span>

				<v-badge id="minus-strand"   class="info" style="margin-left:3px;margin-right:10px" v-if="selectedGene.strand == '-'">reverse strand</v-badge>

				<span  id="gene-plus-minus-label"  v-if="!isBasicMode && !isSimpleMode"  style="padding-left: 15px">+  -</span>
				<div id="region-buffer-box" v-if="!isBasicMode && !isSimpleMode" style="display:inline-block;width:50px;height:21px;margin-right:40px"  >
		    		<v-text-field
		            id="gene-region-buffer-input"
		            class="sm fullview"
		            v-model="regionBuffer"
		            v-on:change="onGeneRegionBufferChange">
		    		</v-text-field>
				</div>
			</div>

      <div id="aliases" v-if="!isBasicMode && !isSimpleMode && aliases">
        <div class="mr-2"id="alias-label">Aliases</div>
        <div id="alias-text">{{ aliases }}</div>
      </div>

      <!-- PubMed -->
      <div style="margin-right:30px;" v-if="selectedGene && cohortModel && Object.keys(selectedGene).length > 0 && !isSimpleMode && !isBasicMode">
        <gene-pubmed-table
         v-if="selectedGene && cohortModel && !isSimpleMode && !isBasicMode"
         :selectedGene="selectedGene"
         :geneModel="cohortModel.geneModel"
         :showSource="true"
         :showFullDate="false"
         :showDetailsButton="true"
         :showAll="false"
         titleText="PubMed"
         :showCountOnly="true"
         @show-pubmed-dialog="onShowPubMedDialog(true)"
         >
        </gene-pubmed-table>
      </div>

      <gene-links-menu v-if="!isBasicMode"
                   :selectedGene="selectedGene"
                   :geneModel="cohortModel.geneModel">
      </gene-links-menu>


		</div>

    <div v-if="isOMIMPermitted || (selectedGene && cohortModel && !isSimpleMode && !isBasicMode)"
      style="display:flex;justify-content:flex-start;margin-top:5px">

      <!-- Gene:Phenotypes -->
      <gene-phenotype-table  style="flex-grow:2;margin-right:5px"
       v-if="selectedGene && cohortModel && !isSimpleMode && !isBasicMode"
       :selectedGene="selectedGene"
       :geneModel="cohortModel.geneModel"
       :cohortModel="cohortModel"
       :highlightMatches="true"
       :showDetailsButton="cohortModel && cohortModel.isLoaded"
       :showTitle="true"
       @show-patient-phenotypes-dialog="onShowPatientGenePhenotypeDialog(true)">
      </gene-phenotype-table>

      <!-- Gene:Diseases -->
      <gene-disease-table  style="flex-grow:2;margin-right:5px"
       v-if="selectedGene && cohortModel && !isSimpleMode && !isBasicMode"
       :selectedGene="selectedGene"
       :geneModel="cohortModel.geneModel">
      </gene-disease-table>

      <!-- OMIM -->
      <gene-omim-table  style="margin-right:5px"
       v-if="false && isOMIMPermitted && selectedGene && cohortModel && !isSimpleMode && !isBasicMode"
       :selectedGene="selectedGene"
       :geneModel="cohortModel.geneModel">
      </gene-omim-table>



    </div>

    <patient-gene-phenotype-dialog
         v-if="cohortModel && cohortModel.isLoaded"
         :showDialog="showPatientGenePhenotypeDialog"
         :cohortModel="cohortModel"
         :selectedGene="selectedGene"
         :launchedFromHub="launchedFromHub"
         @hide-patient-gene-phenotype-dialog="onShowPatientGenePhenotypeDialog(false)">
    </patient-gene-phenotype-dialog>

    <gene-pubmed-popup
    :geneModel="cohortModel.geneModel"
    :selectedGene="selectedGene"
    :showDialog="showPubMedDialog"
    @hide-pubmed-dialog="onShowPubMedDialog(false)">
    </gene-pubmed-popup>

	</div>

</template>

<script>
    import GeneOMIMTable        from '../partials/GeneOMIMTable.vue'
    import GenePubMedTable      from '../partials/GenePubMedTable.vue'
    import GenePubMedPopup      from '../partials/GenePubMedPopup.vue'
    import GenePhenotypeTable     from '../partials/GenePhenotypeTable.vue'
    import GeneDiseaseTable  from '../partials/GeneDiseaseTable.vue'
    import GeneLinksMenu        from "../partials/GeneLinksMenu.vue"
    import TranscriptsMenu      from '../partials/TranscriptsMenu.vue'
    import PatientGenePhenotypeDialog      from '../partials/PatientGenePhenotypeDialog.vue'

    export default {
        name: 'gene-variants-card',
        components: {
            'gene-omim-table': GeneOMIMTable,
            'gene-phenotype-table': GenePhenotypeTable,
            'gene-disease-table': GeneDiseaseTable,
            'gene-pubmed-table': GenePubMedTable,
            'gene-pubmed-popup': GenePubMedPopup,
            'gene-links-menu': GeneLinksMenu,
            'transcripts-menu': TranscriptsMenu,
            'patient-gene-phenotype-dialog': PatientGenePhenotypeDialog
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
            isOMIMPermitted: null,
            isLoaded: null,
            launchedFromClin: null,
            launchedFromHub: null
        },
        data() {
            let self = this;
            return {
                geneSource: null,
                noTranscriptsWarning: null,
                showNoTranscriptsWarning: false,
                regionBuffer: null,
                noData: null,
                showPatientGenePhenotypeDialog: false,
                showPubMedDialog: false,
                aliases: null
            }
        },
        methods: {

            noDataAlert: function(){
                if(this.noData){
                    this.$emit("no-data-warning");
                }
            },

            populateData: function() {
              this.populateTranscriptData();
              this.promisePopulateAliases();
            },

            //assume that no data is loaded, and analyze transcript inside of GeneVariantsCard
            //If we find out later that data is loaded, this will be overwritten
            populateTranscriptData: function(){
              if (this.selectedGene && this.selectedGene.gene_name.length > 0) {
                let self = this;
                let transcript = this.cohortModel.geneModel.getCanonicalTranscript(this.selectedGene);
                self.cohortModel.promiseMarkCodingRegions(self.selectedGene, transcript)
                .then(function(data) {
                    self.analyzedTranscript = data.transcript;
                    self.noData = true;
                    setTimeout(self.noDataAlert, 2000);
                })

              }
            },

            promisePopulateAliases: function() {
              let self = this;
              self.aliases = ""
              self.cohortModel.geneModel.promiseGetKnownGene(self.selectedGene.gene_name)
              .then(function(knownGeneEntry) {
                if (knownGeneEntry && knownGeneEntry.aliases && knownGeneEntry.aliases.length > 0) {
                  // Add a space after the comma for word wrapping
                  self.aliases =  knownGeneEntry.aliases.split(",").join(", ");
                }
              })
              .catch(function(error) {
                console.log(error)
              })
            },

            formatCanonicalTranscript: function() {
                if (this.selectedTranscript) {
                    return this.globalApp.utility.stripTranscriptPrefix(this.selectedTranscript.transcript_id);
                } else {
                    return "";
                }
            },
            onShowPatientGenePhenotypeDialog(show) {
                this.showPatientGenePhenotypeDialog = show;
            },
            onShowPubMedDialog(show) {
                this.showPubMedDialog = show;
            },
            onGeneRegionBufferChange: _.debounce(function (newGeneRegionBuffer) {
                this.regionBuffer = Math.min(parseInt(newGeneRegionBuffer), 99999);
                this.$emit('gene-region-buffer-change', this.regionBuffer);
            }, 100)
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
                if(this.selectedGene &&
                  this.selectedGene.gene_name &&
                  this.analyzedTranscript &&
                  this.selectedGene.gene_name !== this.analyzedTranscript.gene_name) {
                    this.populateData();
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
            this.populateData();
        },
        created: function() {
        }
    }
</script>

