<style lang="css">
    #select-transcripts-box .theme--light .btn,
    #select-transcripts-box.application .theme--light.btn {
        color:  rgb(113,113,113);
        padding: 20px;
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
    #edit-transcript-dropdown
        background-color: $dropdown-button-color
        margin: 0px 8px 0px 0px
        padding: 0px
        padding-left: 8px
        padding-right: 0px
        height: 24px
        border-radius: 4px 
        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)
        #edit-transcript-button-content
            display:flex
            align-items:center
            color: $dropdown-text-color

        .v-btn__content
            padding: 0px
            text-align: left
            font-weight: 500
            font-size: 14px

            .left-icon
                padding-left: 4px
                padding-right: 6px

            .button-label
                font-size:  13px

            .right-icon
                padding-left:  10px
    #select-transcript-viz
        .selected
            outline: solid 1px $current-color
            .selection-box
                cursor: pointer
        .current
            font-weight: bold
            outline: solid 2px $current-color
            .selection-box
    #select-transcripts-box
        .btn--floating.btn--small
            height: 20px !important
            width: 22px !important
            padding: 0px !important
            margin: 0px;
            margin-left: 4px;
        .btn--floating.btn--small .btn__content,
        .btn--floating.btn--small .v-btn__content
            padding: 0px
        .btn__content, .v-btn__content
            color: $text-color
        
    .gene-info
        .v-badge
            background-color: white !important
            border: thin solid #9c9c9c !important
            color: inherit !important
    #transcript-card
        .v-badge.info.mane-select
            background-color: transparent !important

    #transcript-menu-gene-source-chip.settings-badge
        padding: 0px
        margin: 2px
        margin-left: 10px
        margin-right: 10px
        background-color: $nav-badge-color
        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)

        .v-chip__content
          border-radius: 10px
          height: 22px 
          padding: 0px 5px
          font-size: 11px
          font-weight: 500

  

</style>

<template>
    <div>
    <v-menu
            offset-y
            :close-on-content-click="false"
            :nudge-width="500"
            bottom
            left
            v-model="showTranscriptsMenu"
    >


        <v-btn id="edit-transcript-dropdown"
               slot="activator"
               flat
               v-tooltip.top-center="{content: `Change the current transcript for this gene`}"
        >
            <div id="edit-transcript-button-content">
                <span class="button-label">{{ selectedTranscript.transcript_id }}</span>
                <v-icon class="right-icon" >arrow_drop_down</v-icon>
            </div>
        </v-btn>



        <v-card id="select-transcripts-box" class="full-width">
            <div id="gene-source-box" v-if="false" >
                <v-select
                        v-bind:items="geneSources"
                        v-model="geneSource"
                        label="Gene source"
                        item-value="text"
                        @input="onGeneSourceSelected">
                </v-select>
            </div>

            <div style="min-height:100px;max-height: 300px;overflow-y:scroll">
                <gene-viz id="select-transcript-viz"
                          :data="orderedTranscripts"
                          :margin=margin
                          :trackHeight=trackHeight
                          :cdsHeight=cdsHeight
                          :showLabel=true
                          :fixedWidth=600
                          :regionStart="selectedGene.start"
                          :regionEnd="selectedGene.end"
                          :showBrush=false
                          :showXAxis=false
                          @transcript-selected="onTranscriptSelected">
                </gene-viz>

            </div>
            <div class="text-xs-right">
                <v-btn small class="mb-0" raised @click.native="onTranscriptVizClose">Close</v-btn>
            </div>
        </v-card>



    </v-menu>

    <v-chip @click="onShowSettingsForGeneSource" id="transcript-menu-gene-source-chip" class="settings-badge" text-color="white">
        {{ geneModel.geneSource }}
    </v-chip>

    <v-badge class="info" style="margin-left:5px;" v-if="selectedTranscript.transcript_type != 'null' && selectedTranscript.transcript_type != 'protein_coding'"> {{ selectedTranscript.transcript_type }} </v-badge>

   
    <v-badge class="info mane-select" style="margin-left:5px;" v-if="selectedTranscript.is_mane_select == 'true'">MANE SELECT</v-badge>

    </div>


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
            selectedTranscript: null,
            geneSources: null,
            geneModel: null
        },
        data() {
            return {
                margin: {top: 5, right: 5, bottom: 5, left: 200},
                trackHeight: 20,
                cdsHeight: 15,
                showTranscriptsMenu: false,
                newTranscript: null,
                geneSource: null,
                isCanonical: true
            }
        },
        mounted: function() {
            this.geneSource = this.geneModel.geneSource;
            if (this.selectedTranscript) {
                let canonical = this.geneModel.getCanonicalTranscript(this.selectedGene);
                this.isCanonical = canonical.transcript_id == this.selectedTranscript.transcript_id;
            }
        },
        methods: {
            onShowSettingsForGeneSource: function() {
                this.$emit("show-settings-for-gene-source");
            },
            onTranscriptSelected: function(theTranscript) {
                this.newTranscript = theTranscript;
                let canonical = this.geneModel.getCanonicalTranscript(this.selectedGene);
                this.isCanonical = canonical.transcript_id == this.newTranscript.transcript_id;
                this.onTranscriptVizClose();
            },
            onTranscriptVizClose: function() {
                var self = this;
                if (self.newTranscript == null) {
                    self.newTranscript = self.selectedTranscript;
                }
                self.$emit('transcriptSelected', self.newTranscript);
                self.showTranscriptsMenu = false;
            },
            onGeneSourceSelected: function() {
                let self = this;
                self.$emit('gene-source-selected', self.geneSource);
            },
        },
        watch:  {
            showTranscriptsMenu: function() {
                if (this.showTranscriptsMenu) {
                    this.$emit("transcriptMenuOpened");
                }
            },
            selectedTranscript: function() {
                if (this.selectedTranscript) {
                    let canonical = this.geneModel.getCanonicalTranscript(this.selectedGene);
                    this.isCanonical = canonical.transcript_id == this.selectedTranscript.transcript_id;
                }
            },
            selectedGene: function(){
                if (this.newTranscript && this.newTranscript.transcript_id && Object.keys(this.selectedGene).length > 0) {
                    let canonical = this.geneModel.getCanonicalTranscript(this.selectedGene);
                    if (canonical && canonical.transcript_id) {

                    this.isCanonical = (canonical.transcript_id == this.newTranscript.transcript_id) ? true : false;                   
                    }
                }
            }

        },
        computed: {
            orderedTranscripts: function() {
                let transcripts = this.selectedGene.transcripts;
                let ordered = transcripts;
                let max = (Object.keys(transcripts).length - 1);
                for (let transcript in ordered) {
                    if (ordered[transcript]["is_mane_select"] == "true") {
                        let last = ordered[max];
                        if (last == ordered[transcript]) {
                            return ordered;
                        } else {
                            ordered[max] = ordered[transcript];
                            ordered[transcript] = last;
                            return ordered;
                        }
                    }
                }
            }
        }
    }
</script>
