<style lang="sass">

@import ../../../assets/sass/variables


.dialog.dialog--active
  button
    padding: 0px
    height: 30px !important

aside.navigation-drawer, aside.v-navigation-drawer
  margin-top: 55px !important
  z-index: 0
  padding-bottom: 0px


  &.clin
    margin-top: 0px !important



  #side-panel-container
    display: flex
    flex-flow: column
    flex: 1 1 auto
    justify-content: space-between
    margin-bottom: 0px
    overflow-y: hidden
    padding-bottom: 10px
    height: calc(100% - 15px)
    overflow-y: scroll

    .v-tabs
      .v-window__container.v-window__container--is-active
        height: -webkit-fill-available !important


    .tabs__bar, .v-tabs__bar
      padding-left: 10px

    .tabs__container, .v-tabs__container
      height: 40px !important

      .tabs__item, .v-tabs__item
        margin-right: 20px !important

        .badge, .v-badge
          background-color: transparent

          span.badge-label
            color: $app-color
            border-color: none
            font-size: 14px
            font-weight: normal
            text-transform: none

        .badge__badge.primary, .v-badge__badge.primary
          background-color: $app-color !important
          font-size: 11px
          color: white
          top: 0px
          width: 19px
          height: 19px




    .toolbar-button
      min-width: 70px
      color: $text-color
      margin-right: 5px
      margin-left: 0px
      font-size: 13px
      height: 30px
      margin-top: -7px

      .btn__content
        padding: 0px

      i.material-icons
        font-size: 16px
        padding-right: 4px

    #overall-progress
      position: fixed
      left: 7px
      top: 10px
      z-index: 1


    #close-button
      position: absolute
      padding-right: 0px
      position: absolute
      right: 0px
      display: inline-block
      margin-left: 0px
      min-width: 22px
      margin-top: 0px
      top: 0px
      z-index: 1

      i.material-icons
        font-size: 22px

    #flagged-variants-card
      flex-grow: 1

    #legend-card
      margin-top: 5px
      margin-bottom: 38px
      padding: 0px
      padding-top: 5px
      border-top: $text-color solid 1px

#side-panel-container

  #genes-panel
    #gene-badge-container
      clear: both
      display: flex
      flex-flow: column
      #gene-badge
        margin-bottom: 5px

        #gene-badge-button
          min-width: 150px
          border-radius: 4px
          #gene-badge-symbols
            width: 80px

          #gene-badge-name
            width: 100px
        &.selected

          #gene-badge-button
            border-color: $current-color
            border-width: 2px


#side-panel-container.basic
  .variant-toolbar
    margin-top: 0px
    margin-bottom: 0px

  .tabs__container
    .tabs__slider
      background-color: transparent !important
      border-color: transparent !important

    .tabs__item
      margin-left: -18px


nav.toolbar, nav.v-toolbar
  padding-top: 5px

  .toolbar__content
    margin-top: 2px
    align-items: flex-end
    margin-bottom: 2px

  background-color: $nav-color !important
  font-weight: 300 !important

  .toolbar__title
    color: $nav-title-color
    font-family: $iobio-font
  .btn
    color: $nav-text-color

  #variants-button
    margin-left: 20px
    margin-right: 30px

  #gene-name-input
    .input-group--text-field.input-group--prepend-icon
      .input-group__prepend-icon
        padding-right: 13px

  #search-or
    display: inline-block
    padding-top: 16px
    margin-left: 10px
    margin-right: 16px
    color: $nav-text-color

  #phenolyzer-search
    margin-left: 5px
    margin-right: 60px

  #phenotype-input, #gene-name-input, #phenolyzer-top-input
    margin-top: 8px
    .input-group input
      color: $nav-text-color
    .input-group
      padding: 10px 0 0
    .input-group
      label
        font-size: 13px
        line-height: 14px
        height: 18px
        top: 8px
        font-weight: normal
    .input-group__input
      min-height: 0px
      margin-top: 8px
    .input-group--text-field input
      font-size: 13px
      height: 14px
    .input-group
      padding-top: 0px
    .input-group__selections__comma
      font-size: 13px
    .input-group__details:before
      background-color: $nav-text-color
    .input-group__details:after
      background-color: $nav-text-color

  #phenolyzer-top-input
    .input-group__input
      height: 14px
  .primary--text input, .primary--text textarea
    caret-color: $nav-text-color !important

    i.material-icons
      color:  $nav-text-color-clin !important


      color: $text-color


  .clinvar-switch
    padding: 0px
    width: 130px
    display: inline-block
    vertical-align: top
    text-align: left
    padding-top: 6px
    margin-left: 30px

    label
      padding-left: 7px
      line-height: 18px
      font-size: 13px
      font-weight: normal
      padding-top: 6px
      color: $text-color !important

    .input-group--selection-controls__toggle
      color: rgba(0,0,0,0.38) !important

  .toolbar__side-icon.btn.btn--icon
    max-width: 40px
    min-width: 40px
    margin-bottom: 0px !important

  .toolbar__items
    width: 60%

  .btn
    margin: 0px
    min-width: 78px

    .btn__content
      padding: 0 0px


  i.material-icons
    margin-right: 2px
    color:  $nav-text-color !important

  .toolbar__title
    font-size: 18px
    margin-right: 5px
    margin-left: 5px
    padding-bottom: 13px
    min-width: 130px

  #phenotype-input, #gene-name-input, #phenolyzer-top-input
    label
      color: $nav-text-color !important
    .material-icons
      color: $nav-text-color !important
    .input-group__selections__comma
      color: $nav-text-color !important
      margin-top: -4px

  #gene-name-input
    width: 130px
    margin-left: 5px

  #search-phenotype-button
    background-color: #ffffff1f
    min-width: 70px

    .btn__content
      padding: 0px

  &.clin
    display: none !important
    background-color: $nav-color-clin !important
    box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.05), 0px 1px 1px 0px rgba(0, 0, 0, 0.03), 0px 1px 3px 0px rgba(0, 0, 0, 0.01) !important
    -webkit-box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.05), 0px 1px 1px 0px rgba(0, 0, 0, 0.03), 0px 1px 3px 0px rgba(0, 0, 0, 0.01) !important

    .toolbar__title
      color: $nav-title-color-clin

    .btn
      color: $nav-text-color-clin

    #phenotype-input, #gene-name-input, #phenolyzer-top-input
      label
        color: $nav-text-color-clin !important
      .material-icons
        color: $nav-text-color-clin !important
      .input-group__selections__comma
        color: $nav-text-color-clin !important

    #phenotype-input, #gene-name-input, #phenolyzer-top-input
      .input-group input
        color: $nav-text-color-clin !important
      .input-group__details:before
        background-color: $nav-text-color-clin !important
      .input-group__details:after
        background-color: $nav-text-color-clin !important


    i.material-icons
      color:  $nav-text-color-clin !important

#versions
  font-size: 14px
  color:  rgb(132,132,132)
  padding-top: 5px
  margin-bottom: 20px !important

  div
    margin-bottom: 0px !important
    clear: both

    .version-label
      width: 230px
      float: left
      padding-right: 5px
      clear: none
      padding-bottom: 7px
      color: #717171
      font-weight: 600
      font-size: 13px !important

    .number
      width: 220px
      float: left
      padding-bottom: 7px
      clear: none
      font-size: 13px !important

#credits
  font-size: 12px

.citation-title
  margin-bottom: 0px !important
  margin-top: 15px !important
  font-size: 14px
  color: $app-color
  font-weight: 600
  clear: both

.mode-switch

  label
    padding-left: 7px
    line-height: 18px
    font-size: 12px
    font-weight: bold
    padding-top: 2px
    color: $nav-text-color


.coding-variants-only-switch
  min-width: 180px !important


  label
    padding-left: 8px !important
    line-height: 18px !important
    color: $text-color !important
    font-weight: normal !important
    font-size: 13px !important
    padding-left: 8px !important
    padding-top: 6px !important

</style>

<style>

@media only screen and (max-width: 600px) {
#phenolyzer-search {
  margin-right: 0px !important;
}
#search-or {
  display: none !important;
}
.nav.toolbar.toolbar__title {
  margin-right: 0px !important;
  margin-left: 0px !important;
  min-width: 110px !important;
}
}
</style>

<template>
  <div>
    <v-toolbar fixed  height="45"   dark  :class="launchedFromClin ? 'clin' : '' " >

      <v-toolbar-side-icon   style="margin-bottom:2px" @click.stop="leftDrawer = !leftDrawer">
      </v-toolbar-side-icon>


      <v-toolbar-title v-text="title">
      </v-toolbar-title>


      <v-spacer v-if="!isFullAnalysis"></v-spacer>

      <v-btn v-if="false" id="variants-button" flat @click.stop="leftDrawer = !leftDrawer">
        Variants
      </v-btn>



      <v-spacer></v-spacer>


      <v-toolbar-items  lass="hidden-sm-and-down" style="padding-top:3px">

        <v-icon>
          search
        </v-icon>

        <span id="gene-name-input"  style="display:inline-block">
          <v-text-field id="search-gene-name"
          :class="clazzAttention"
          :hide-details="true"
          v-model="geneEntered" label="Gene" >
          </v-text-field>
          <typeahead v-model="lookupGene"
          force-select v-bind:limit="typeaheadLimit" match-start
          target="#search-gene-name" :data="knownGenes"
          item-key="gene_name"/>
        </span>




        <genes-menu
         ref="genesMenuRef"
         v-if="!launchedFromClin && !isEduMode && !isBasicMode"
         :buttonIcon="`edit`"
         :geneModel="geneModel"
         :isBasicMode="isBasicMode"
         :isEduMode="isEduMode"
         @apply-genes="onApplyGenes"
         @clear-all-genes="onClearAllGenes">
        </genes-menu>

        <div v-if="!isEduMode && !isBasicMode && !launchedFromClin" id="search-or" style="display:inline-block">
          or
        </div>


        <phenotype-search
         id="phenolyzer-search"
         v-if="!isEduMode && !launchedFromClin"
         :classAttention="clazzAttention"
         :isNav="true"
         :phenotypeLabel="isBasicMode ? 'Disorder' : 'Phenotype'"
         :defaultTopGenes="10"
         :geneModel="geneModel"
         :phenotypeLookupUrl="phenotypeLookupUrl"
         @on-search-genes="onSearchPhenolyzerGenes"
         @on-start-search-genes="onStartSearchPhenolyzerGenes"
         @show-snackbar="onShowSnackbar"
         @hide-snackbar="onHideSnackbar">
        </phenotype-search>


        <v-switch class="clinvar-switch"
          v-if="launchedFromClin"
          label="ClinVar track"
          v-model="showKnownVariantsCard"
          >
        </v-switch>



      </v-toolbar-items>


      <v-menu
       v-if="!isEduMode && !isBasicMode"
       offset-y
      :close-on-content-click="false"
      >
        <v-btn  flat slot="activator">
          Options
        </v-btn>

        <v-card style="min-width:150px">
          <v-switch class="coding-variants-only-switch"
            label="Coding variants only"
            v-model="analyzeCodingVariantsOnly"
            >
          </v-switch>
        </v-card>
      </v-menu>

      <files-menu
       v-if="!isEduMode && !isBasicMode && !isFullAnalysis"
       :cohortModel="cohortModel"
       @on-files-loaded="onFilesLoaded"
       @load-demo-data="onLoadDemoData"
      >
      </files-menu>

      <v-menu
      offset-y
      :close-on-content-click="false"
      :nudge-width="isBasicMode ? 300 : 350"
      v-model="showLegendMenu"
      >
        <v-btn  flat slot="activator">
          Legend
        </v-btn>

        <legend-panel
        :isBasicMode="isBasicMode"
        style="max-width:410px">
        </legend-panel>
      </v-menu>


      <v-menu offset-y>
        <v-btn id="help-menu-button" flat slot="activator">Help</v-btn>
        <v-list>

          <v-list-tile  @click="onShowDisclaimer">
            <v-list-tile-title>Disclaimer</v-list-tile-title>
          </v-list-tile>
          <v-list-tile  @click="onShowVersion">
            <v-list-tile-title>About</v-list-tile-title>
          </v-list-tile>
          <v-list-tile  @click="onShowCitations">
            <v-list-tile-title>Software and resources</v-list-tile-title>
          </v-list-tile>

          <v-divider></v-divider>

          <v-list-tile id="load-demo-data-menu-item"  @click="onLoadDemoData">
            <v-list-tile-title>Load demo data</v-list-tile-title>
          </v-list-tile>

          <v-divider></v-divider>

          <v-list-tile  @click="onClearCache">
            <v-list-tile-title>Clear session data</v-list-tile-title>
          </v-list-tile>

          <v-divider></v-divider>

          <v-list-tile  @click="onWelcome">
            <v-list-tile-title>Show welcome page</v-list-tile-title>
          </v-list-tile>

          <v-list-tile @click="onShowBlog">
            <v-list-tile-title>Blog</v-list-tile-title>
          </v-list-tile>

          <v-list-tile @click="onShowTutorial" >
            <v-list-tile-title>Tutorials</v-list-tile-title>
          </v-list-tile>

          <v-list-tile @click="onShowIOBIO" >
            <v-list-tile-title>iobio</v-list-tile-title>
          </v-list-tile>

          <v-list-tile @click="onSupportIOBIO" >
            <v-list-tile-title>Support the iobio project</v-list-tile-title>
          </v-list-tile>



        </v-list>
      </v-menu>
    </v-toolbar>
    <v-navigation-drawer  :class="launchedFromClin ? 'clin' : '' "
      mobile-break-point="800"
      clipped
      :permanent="launchedFromClin ? true : false"
      fixed
      app
      :hide-overlay="true"
      v-model="leftDrawer"
      :stateless="true"
      :width="launchedFromClin ? 315 : 293"
    >
      <div id="side-panel-container" :class="{'basic': isBasicMode}">

        <v-btn v-if="!isFullAnalysis && !launchedFromClin" id="close-button" class="toolbar-button" flat @click="leftDrawer = false">
          <v-icon >close</v-icon>
        </v-btn>

        <v-progress-circular id="overall-progress"  :size="19"  :width="5" color="grey darken-1"
          v-if="analyzeAllInProgress || callAllInProgress"
          :indeterminate="true">
        </v-progress-circular>

        <v-tabs
          v-model="activeTab"
          light
        >
          <v-tab v-if="!isBasicMode" >
            <v-badge>
              <span class="badge-count" slot="badge">{{ geneCount }}</span>
              <span v-if="launchedFromClin && !isFullAnalysis" class="badge-label">Candidate Genes</span>
              <span v-if="launchedFromClin && isFullAnalysis" class="badge-label">All Genes</span>
              <span v-if="!launchedFromClin" class="badge-label">Genes</span>
            </v-badge>

          </v-tab>
          <v-tab>

            <v-badge>
              <span class="badge-count" slot="badge">{{ flaggedVariantCount }}</span>
              <span class="badge-label">Variants</span>
            </v-badge>

          </v-tab>

          <v-tab-item v-if="!isBasicMode">

            <genes-panel
             style="margin: 15px 10px 10px 10px"
             ref="genesPanelRef"
             :isEduMode="isEduMode"
             :isBasicMode="isBasicMode"
             :isFullAnalysis="isFullAnalysis"
             :launchedFromClin="launchedFromClin"
             :geneModel="geneModel"
             :selectedGene="selectedGene"
             :filteredGeneNames="filteredGeneNames"
             :geneNames="geneModel.sortedGeneNames"
             :analyzeAllInProgress="analyzeAllInProgress"
             :callAllInProgress="callAllInProgress"
             :loadedDangerSummaries="Object.keys(geneModel.geneDangerSummaries)"
             :genesInProgress="cohortModel.genesInProgress"
             @gene-selected="onGeneSelected"
             @remove-gene="onRemoveGene"
             @count-changed="onGeneCountChanged"
            >
            </genes-panel>



          </v-tab-item>


          <v-tab-item>

            <flagged-variants-card
             ref="flaggedVariantsRef"
             :isEduMode="isEduMode"
             :isBasicMode="isBasicMode"
             :forMyGene2="forMyGene2"
             :cohortModel="cohortModel"
             :activeFilterName="activeFilterName"
             :launchedFromClin="launchedFromClin"
             :isFullAnalysis="isFullAnalysis"
             :geneNames="geneNames"
             :genesInProgress="genesInProgress"
             :interpretationMap="interpretationMap"
             @flagged-variants-imported="onFlaggedVariantsImported"
             @flagged-variant-selected="onFlaggedVariantSelected"
             @apply-variant-notes="onApplyVariantNotes"
             @apply-variant-interpretation="onApplyVariantInterpretation"
             @count-changed="onFlaggedVariantCountChanged"

            >
            </flagged-variants-card>

          </v-tab-item>

        </v-tabs>



        <v-card id="legend-card" v-if="isBasicMode" >
          <legend-panel :isBasicMode="isBasicMode">
          </legend-panel>
        </v-card>




      </div>

    </v-navigation-drawer>

    <v-dialog v-model="showDisclaimer" max-width="400">
        <v-card class="full-width">
          <v-card-title class="headline">Disclaimer</v-card-title>
          <v-card-text>

                  The University of Utah makes no claims that iobio applications, including gene.iobio are approved for clinical use. All users of iobio applications including gene.iobio understand and accept that any information gained by using these applications, whether the information comes from visualization, processing, internal or external databases, or analysis, may not in any way be used for clinical purposes. The University of Utah makes no representation that iobio or gene.iobio is either safe or effective for any intended use for which research may currently be performed.
                  <br><br>
                  iobio, or any iobio applications ARE TO BE USED FOR RESEARCH PURPOSES ONLY. USE FOR CLINICAL PURPOSES IS EXPRESSLY FORBIDDEN. Approval of iobio applications for clinical use has neither been applied for, nor received, in any country, including the United States of America.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn raised  @click.native="showDisclaimer = false">Close</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>


    <v-dialog v-model="showVersion" max-width="580">
        <v-card class="full-width">
          <v-card-title class="headline">gene.iobio {{ globalApp.version }}</v-card-title>
          <v-card-text>


            <div  style="margin-top:4px;padding-top:0px;padding-bottom:0px;font-size:12px;color:rgb(132,132,132)">
              <div id="versions" >
                <div><span class="version-label">Human Genome Reference</span><span class="number">GRCh37, GRCh38</span></div>
                <div><span class="version-label">Gencode Human Reference</span><span class="number">19, 25</span></div>
                <div><span class="version-label">REFSEQ Human Reference</span><span class="number">ref_GRCh37.p5, ref_GRCh38.p7</span></div>
                <div><span class="version-label">Human Phenotype Ontology</span><span class="number">Build #102 (12-15-2015)</span></div>
                <div><div class="version-label">Phenolyzer</div><div class="number">1.0.5 (02-21-2015)</div></div>
                <div><div class="version-label">Variant Effect Predictor</div><div class="number">Version 92</div></div>
                <div><div class="version-label">&nbsp;&nbsp;&nbsp;SIFT</div><div class="number">5.2.2</div></div>
                <div><div class="version-label">&nbsp;&nbsp;&nbsp;PolyPhen</div><div class="number">2.2.2</div></div>
                <div><div class="version-label">FreeBayes</div><div class="number">v1.0.2-33-gdbb6160-dirty</div></div>
                <div><div class="version-label">Samtools</div><div class="number">samtools 1.3.1-33-gb25695b-dirty</div></div>
                <div><div class="version-label">vt subset, normalize</div><div class="number">0.577</div></div>
                <div><div class="version-label">gnomAD</div><div class="number">version 2.0.2 (October 3, 2017)</div></div>
                <div><div class="version-label">ExAC</div><div class="number">Release 0.3.1 (03-13-2016)</div></div>
                <div><div class="version-label">1000G</div><div class="number">Phase 3 (05-02-2013)</div></div>
                <div><div class="version-label">ACMG Genes</div> <div class="number">v2.0</div></div>


              </div>
            </div>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn raised  @click.native="showVersion = false">Close</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>


   <v-dialog v-model="showCitations" max-width="700" max-height="">
        <v-card class="full-width" style="overflow-y:scroll;height:500px">
          <v-card-title class="headline">Software and Resources</v-card-title>
          <v-card-text>


            <div id="credits" >

              <div class="citation-title">Variant Effect Predictor</div>
              McLaren W, Pritchard B, Rios D, Chen Y, Flicek P, Cunningham F.Deriving the consequences of genomic variants with the Ensembl API and SNP Effect Predictor.
              <a href="http://dx.doi.org/10.1093/bioinformatics/btq330" target="_new">Bioinformatics 26(16):2069-70(2010)doi:10.1093/bioinformatics/btq330</a>

              <div class="citation-title">FreeBayes</div>
              Garrison E, Marth G. Haplotype-based variant detection from short-read sequencing
              <a href="/abs/1207.3907v2">arXiv:1207.3907v2</a> [q-bio.GN]


              <div class="citation-title">ClinVar</div>
              Landrum MJ, Lee JM, Riley GR, Jang W, Rubinstein WS, Church DM, Maglott DR. <u>ClinVar: public archive of relationships among sequence variation and human phenotype</u>. Nucleic Acids Res. 2014 Jan 1;42(1):D980-5. doi: 10.1093/nar/gkt1113. PubMed PMID: <a href="/pubmed/24234437">24234437</a>

              <div class="citation-title">Samtools</div>
              Li H.*, Handsaker B.*, Wysoker A., Fennell T., Ruan J., Homer N.,
              Marth G., Abecasis G., Durbin R. and 1000 Genome Project Data
              Processing Subgroup (2009) The Sequence alignment/map (SAM) format and
              SAMtools. Bioinformatics, 25,
              2078-9. [PMID: <a href="http://www.ncbi.nlm.nih.gov/pubmed/19505943">19505943</a>]

              <div class="citation-title">Bamtools</div>
              BamTools: a C++ API and toolkit for analyzing and managing BAM files</span>. Bioinformatics 2011;27:1691-1692.
              <a href="/cgi/ijlink?linkType=ABST&amp;journalCode=bioinfo&amp;resid=27/12/1691" class="cit-ref-sprinkles cit-ref-sprinkles-ijlinks"><span class="cit-reflinks-abstract">Abstract</span><span class="cit-sep cit-reflinks-variant-name-sep">/</span><span class="cit-reflinks-full-text"><span class="free-full-text">FREE </span>Full Text</span></a>

              <div class="citation-title">vt</div>
              <a rel="nofollow" class="external text" href="http://bioinformatics.oxfordjournals.org/content/31/13/2202">Adrian Tan, Gonçalo R. Abecasis and Hyun Min Kang. Unified Representation of Genetic Variants. Bioinformatics (2015) 31(13): 2202-2204</a>

              <div class="citation-title">GNomAD and ExAC</div>
                Monkol Lek, Konrad J. Karczewski[…]Exome Aggregation Consortium  Analysis of protein-coding genetic variation in 60,706 humans
                <a href="https://www.nature.com/articles/nature19057">Nature volume 536, pages 285–291 (18 August 2016)
                </a>
              <br>
                      The authors would like to thank the Exome Aggregation Consortium and the groups that provided exome variant data for comparison. A full list of contributing groups can be found at
                      <a href="/about">http://exac.broadinstitute.org/about</a>.

              <div class="citation-title">1000 Genomes</div>
              Pilot Analysis
              <br>
                <a href="http://www.nature.com/nature/journal/v467/n7319/full/nature09534.html">A map of human genome variation from population-scale sequencing</a>
                <em>Nature 467, 1061–1073 (28 October 2010)</em>
                <br>Phase 1 Analysis<br>
                    <a href="http://www.nature.com/nature/journal/v491/n7422/full/nature11632.html">An integrated map of genetic variation from 1,092 human genomes</a>
                    <em>Nature 491, 56–65 (01 November 2012)</em>
                <br>Phase 3 Analysis <br>
                    <a href="http://www.nature.com/nature/journal/v526/n7571/full/nature15393.html">A global reference for human genetic variation</a>
                    <em>Nature 526, 68–74 (01 October 2015)</em>
                <br>
                    <a href="http://www.nature.com/nature/journal/v526/n7571/full/nature15394.html">An integrated map of structural variation in 2,504 human genomes</a>
                    <em>Nature 526, 75–81 (01 October 2015)</em>




              <div class="citation-title">Human Phenotype Ontology</div>
              Sebastian Köhler, Sandra C Doelken, Christopher J. Mungall, Sebastian Bauer, Helen V. Firth, et al.The Human Phenotype Ontology project: linking molecular biology and disease through phenotype data
              <a href="http://nar.oxfordjournals.org/content/42/D1/D966.full" target="_new">Nucliec Acids Res. (1 January 2014) 42 (D1): D966-D974 doi:10.1093/nar/gkt1026</a>


              <div class="citation-title">Phenolyzer</div>
              Yang, Hui, Peter N. Robinson, and Kai Wang. Phenolyzer: phenotype-based prioritization of candidate genes for human diseases.
              <a href="http://www.nature.com/nmeth/journal/v12/n9/abs/nmeth.3484.html" target="_new">Nature Methods (2015).
              </a>

              <div class="citation-title">igv.js</div>
              <a href="https://github.com/igvteam/igv.js/wiki">Getting started guide</a>


              <div class="citation-title">PolyPhen</div>
              Adzhubei IA, Schmidt S, Peshkin L, Ramensky VE, Gerasimova A, Bork P, Kondrashov AS, Sunyaev SR. Nat Methods <strong>7</strong>(4):248-249 (2010). <a href="http://www.ncbi.nlm.nih.gov/pubmed/20354512" class="urlextern" title="http://www.ncbi.nlm.nih.gov/pubmed/20354512" rel="nofollow">PubMed</a> <a href="/pph2/dokuwiki/_media/nmeth0410-248.pdf" class="media mediafile mf_pdf" title="nmeth0410-248.pdf">PDF</a> <a href="/pph2/dokuwiki/_media/nmeth0410-248-s1.pdf" class="media mediafile mf_pdf" title="nmeth0410-248-s1.pdf">Supplemental Information</a>

              <div class="citation-title">SIFT</div>
                       Kumar P, Henikoff S, Ng PC. Predicting the effects of coding non-synonymous variants on
                       protein function using the SIFT algorithm.
                       <i>Nat Protoc. 2009</i>;4(7):1073-81.
               <a href="http://www.ncbi.nlm.nih.gov/pubmed/19561590">PubMed</a> <a href="/www/nprot.2009.86.pdf" target="_blank">PDF</a>

              <div class="citation-title">REVEL</div>
              Ioannidis NM, Rothstein JH, Pejaver V, et al. REVEL: An Ensemble Method for Predicting the Pathogenicity of Rare Missense Variants.  <a href="https://www.cell.com/ajhg/fulltext/S0002-9297(16)30370-6">Am J Hum Genet. 2016;99(4):877-885.</a>


            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn raised  @click.native="showCitations = false">Close</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>

  </div>
</template>

<script>

import { Typeahead }       from 'uiv'
import GenesMenu           from '../partials/GenesMenu.vue'
import FilesMenu           from '../partials/FilesMenu.vue'
import LegendPanel         from '../partials/LegendPanel.vue'
import FlaggedVariantsCard from '../viz/FlaggedVariantsCard.vue'
import GenesPanel          from '../partials/GenesPanel.vue'
import PhenotypeSearch     from '../partials/PhenotypeSearch.vue'

export default {
  name: 'navigation',
  components: {
    Typeahead,
    GenesMenu,
    FilesMenu,
    FlaggedVariantsCard,
    GenesPanel,
    LegendPanel,
    PhenotypeSearch
  },
  props: {
    isEduMode: null,
    isBasicMode: null,
    forMyGene2: null,
    analyzeAllInProgress: null,
    callAllInProgress: null,
    selectedGene: null,
    selectedVariant: null,
    filteredGeneNames: null,
    geneModel: null,
    cohortModel: null,
    cacheHelper: null,
    activeFilterName: null,
    launchedFromClin: null,
    isFullAnalysis: null,
    isClinFrameVisible: null,
    bringAttention: null,
    phenotypeLookupUrl: null,
    geneNames: null,
    genesInProgress: null,
    interpretationMap: null
  },
  data () {
    let self = this;
    return {
      title: 'gene.iobio',

      lookupGene: {},
      geneEntered: null,
      clipped: false,
      leftDrawer: self.forMyGene2  ? true : false,
      rightDrawer: false,

      showLegendMenu: false,
      showDisclaimer: false,
      showVersion: false,
      showCitations: false,
      typeaheadLimit: parseInt(100),

      activeTab: 0,

      geneCount: 0,
      flaggedVariantCount: 0,


      analyzeCodingVariantsOnly: false,

      showKnownVariantsCard: false


    }
  },
  watch: {
    lookupGene: function(a, b) {
      if (this.selectedGene && this.lookupGene && this.lookupGene.gene_name) {
        this.geneEntered = this.lookupGene.gene_name;
        this.$emit("input", this.lookupGene.gene_name);
      }
    },
    leftDrawer: function() {
      this.$emit("on-left-drawer", this.leftDrawer);
    },
    analyzeCodingVariantsOnly: function() {
      this.$emit("analyze-coding-variants-only", this.analyzeCodingVariantsOnly)
    },
    showKnownVariantsCard: function() {
      this.$emit("show-known-variants", this.showKnownVariantsCard);
    }
  },
  methods: {
    onLoadDemoData: function(loadAction) {
      this.$emit("load-demo-data", loadAction);
    },
    onClearCache: function() {
      this.$emit("clear-cache")
    },
    onClearAllGenes: function() {
      this.$emit("clear-all-genes");
    },
    onApplyGenes: function(genesToApply, options) {
      options.replace = true;
      options.warnOnDup = false;
      this.$emit("apply-genes", genesToApply, options);
    },
    onApplyVariantNotes: function(variant) {
      this.$emit("apply-variant-notes", variant);
    },
    onApplyVariantInterpretation: function(variant) {
      this.$emit("apply-variant-interpretation", variant);
    },
    onSearchPhenolyzerGenes: function(searchTerm) {
      let self = this;
      let genesToApply = null;
      if (searchTerm) {
        var geneCount = self.geneModel.phenolyzerGenes.filter(function(gene) {
          return gene.selected;
        }).length;
        genesToApply = self.geneModel.phenolyzerGenes
        .filter(function(gene) {
          return gene.selected;
        })
        .map( function(gene) {
          return gene.geneName;
        })
        .join(", ");
        this.$emit("apply-genes", genesToApply, {phenotypes: searchTerm, replace: true});
      }
    },
    onStartSearchPhenolyzerGenes: function() {
      this.$emit("on-start-search-genes");
    },
    onVariants: function() {
      let self = this;
      this.activeTab = 1;
      self.$nextTick(function() {
        if (!self.launchedFromClin || self.isClinFrameVisible) {
          self.leftDrawer = true;
        }
      })
    },
    onShowVariantsTab: function() {
      let self = this;
      this.activeTab = 1;
      this.$nextTick(function() {
        if (!self.launchedFromClin || self.isClinFrameVisible) {
          self.leftDrawer = true;
        }
      })
    },
    onShowGenesTab: function() {
      let self = this;
      this.activeTab = 0;
      this.$nextTick(function() {
        if (!self.launchedFromClin || self.isClinFrameVisible) {
          self.leftDrawer = true;
        }
      })
    },
    onFlaggedVariantSelected: function(variant) {
      this.$emit("flagged-variant-selected", variant)
    },
    onFlaggedVariantsImported: function() {
      this.$emit("flagged-variants-imported")
    },
    onFilesLoaded: function(analyzeAll) {
      this.$emit("on-files-loaded", analyzeAll);
    },
    onGeneSelected: function(geneName) {
      this.$emit('gene-selected', geneName);
    },
    onRemoveGene: function(geneName) {
      this.$emit('remove-gene', geneName);
    },
    onWelcome: function() {
      this.$emit("on-show-welcome");
    },
    onShowDisclaimer: function() {
      this.showDisclaimer = true;
    },
    onShowVersion: function() {
      this.showVersion = true;
    },
    onShowCitations: function() {
      this.showCitations = true;
    },
    onShowSnackbar: function(snackbar) {
      this.$emit('show-snackbar', snackbar)
    },
    onHideSnackbar: function() {
      this.$emit('hide-snackbar')
    },
    onShowBlog: function() {
      window.open("http://iobio.io/tags/gene.iobio/", "_iobio");
    },
    onShowTutorial: function() {
      window.open("#/tutorial", "_tutorial");
    },
    onShowIOBIO: function() {
      window.open("http://iobio.io", "_iobio");
    },
    onSupportIOBIO: function() {
      window.open("http://iobio.io/support.html", "_iobio");
    },
    onGeneCountChanged: function(count) {
      this.geneCount = count;
    },
    onFlaggedVariantCountChanged: function(count) {
      this.flaggedVariantCount = count;
    }
  },
  created: function() {
  },
  mounted: function() {
     $("#search-gene-name").attr('autocomplete', 'off');

  },
  computed:  {
    knownGenes: function() {
      let self = this;
      if (self.launchedFromClin) {
        return self.geneModel.sortedGeneNames.map(function(geneName) {
          return {gene_name: geneName};
        });
      } else {
        return self.geneModel.allKnownGenes;
      }
    },
    clazzAttention: function() {
      if (this.bringAttention && this.bringAttention == 'gene' && this.lookupGene && Object.keys(this.lookupGene).length == 0) {
        return 'attention';
      } else {
        return '';
      }
    }
  }
}

</script>