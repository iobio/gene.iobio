<style lang="sass">

@import ../../../assets/sass/variables

#load-saved-analysis-button
    button
      color: $text-color
      font-size: 14px
      padding-left: 0px
      box-shadow: none !important
      padding: 24px 24px 40px 24px
      margin: 0px
      margin-left: -24px
      margin-right: -24px

      .v-btn__content
        font-weight: normal

#legend-drawer-close-button, #error-drawer-close-button, #notification-drawer-close-button
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

.dialog.dialog--active
  button
    padding: 0px
    height: 30px !important

nav .v-toolbar__content
  padding-left: 15px !important
  #file-upload-symbol
    fill: white !important
  #dna-search-symbol
    fill: white !important
  #show-genes-button
    margin-left: 5px
    padding-left: 5px
    padding-right: 8px
    height: 34px
    background-color: $nav-button-color
    .v-btn__content
      min-width: 70px
      span
        font-size: 14px
        color: white
        font-weight: 500 !important
  
       
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
            font-size: 16px
            font-weight: normal
            text-transform: none

        .badge__badge.primary, .v-badge__badge.primary
          background-color: $default-badge-color !important
          font-size: 11px
          color: white
          top: 0px
          min-width: 20px
          max-width: 30px
          height: 20px
          border-radius: 10px !important
          
          .badge-count
            padding-left: 5px
            padding-right: 5px


  #side-panel-container
    .v-tabs
      .v-tabs__bar
        .v-tabs__container
          .v-tabs__div
            .v-tabs__item
              .v-badge
                min-width: 80px !important



    .toolbar-button
      min-width: 70px
      color: $text-color
      margin-right: 5px
      margin-left: 0px
      font-size: 13px
      height: 30px
      margin-top: -7px

      .btn__content, .v-btn__content
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
      margin-top: -10px
      margin-bottom: 32px
      padding: 0px
      padding-top: 0px
      border: #9b9b9b solid 2px !important
      background-color: #f5f5f5

#side-panel-container

  #genes-panel
    #gene-badge-container
      clear: both
      display: flex
      flex-flow: column
      #gene-badge
        margin-bottom: 5px
        margin-right: 0px !important

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
    margin-top: 15px
    margin-bottom: 0px

  .tabs__container
    .tabs__slider
      background-color: transparent !important
      border-color: transparent !important

    .tabs__item
      margin-left: -18px


nav.toolbar, nav.v-toolbar
  padding-top: 5px

  .navbar-outline-button, #show-genes-button, .navbar-icon-button
    background: transparent !important
    border: .5px solid transparent !important

  .navbar-icon-button
    min-width: 40px !important

  .v-toolbar__content
    padding-right: 0px

  #more-menu-button
    padding: 0px
    min-width: 30px
    margin-right: 10px
    margin-left: 0px

  #coverage-settings-button, #notification-button
    font-size: 14px
    font-weight: 500
    background-color: $nav-button-color
    height: 34px
    padding-left: 5px
    padding-right: 8px
    margin-left: 0px

    .v-btn__content
      padding-top: 2px

    .v-badge__badge
      color: white !important
      background-color: $coverage-problem-color !important
      right: -14px
      height: 20px
      width: 20px
      font-size: 13px
      font-weight: 500

  #notification-button 
    padding-right: 0px
    margin-right: -3px
    .v-badge__badge
      right: -14px !important
      font-weight: 500 !important


  #coverage-settings-button
    .v-badge__badge
      background-color: $coverage-problem-color !important

  #notification-button
    .v-badge__badge
      background-color: transparent !important

  #error-badge, #warning-badge, #coverage-badge
    padding-left: 0px
    padding-right: 0px
    margin-left: -0px
    margin-top: -24px
    font-size: 20px
    min-width: 20px !important

  #error-badge
    color: $badge-error-color !important

  #warning-badge
    color: $badge-warning-color !important

  #coverage-badge
    color: $coverage-problem-color !important


  #legend-button, #settings-button
    font-size: 14px
    font-weight: 500
    height: 36px
    margin-bottom: 6px

    .v-btn__content
      padding-top: 2px

  #settings-button 
    margin-right: 0px
    padding-right: 0px
    padding-left: 0px
    min-width: 40px
    margin-left: 20px

  .settings-badge
    padding: 0px
    margin: 2px
    margin-top: -20px
    margin-left: 0px
    margin-right: 3px
    background-color: $nav-badge-color

    .v-chip__content
      border-radius: 10px
      height: 22px 
      padding: 0px 5px
      font-size: 11px
      font-weight: 500

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
    margin-left: 5px
    margin-right: 6px
    color: $nav-text-color

  #phenolyzer-search
    margin-left: 5px


  #phenolyzer-top-input, #gene-source-box
    .input-group__input
      height: 14px
    .primary--text input, .primary--text textarea
      caret-color: $nav-text-color !important

      i.material-icons
        color:  $nav-text-color-clin !important


        color: $text-color


  #phenotype-input, #gene-name-input, #phenolyzer-top-input, #gene-source-box
    margin-top: 4px
    .v-text-field__slot
      margin-top: 4px !important

      input
        padding-bottom: 0px
        padding-top: 4px
    .v-input input
      color: $nav-text-color
    .v-input
      padding: 0px 0 0
    .v-text-field__slot
      min-height: 0px
      margin-top: 8px
    .v-text-field__slot
      min-height: 0px
      margin-top: 8px
    .v-select__slot input
      padding-bottom: 0px

    .v-select__slot label
      top: 9px
    .v-text-field__slot
      label
        font-size: 14px
        font-weight: 500
      input
        font-size: 14px
        font-weight: 500


  #gene-source-box
    margin-right: 20px
    margin-top: -4px
    width: 100px
    .v-select__selection--comma
      color: $nav-label-color
      margin-bottom: 0px
      font-size: 14px
      font-weight: 500


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

    .btn__content, .v-btn__content
      padding: 0 0px


  i.material-icons
    color:  $nav-text-color !important
    margin-bottom: 3px

  .toolbar__title
    font-size: 18px
    margin-right: 5px
    margin-left: 5px
    padding-bottom: 13px
    min-width: 130px

  #phenotype-input, #gene-name-input, #phenolyzer-top-input, #gene-source-box
    label
      color: $nav-text-color !important
    .material-icons
      color: $nav-text-color !important
    .input-group__selections__comma
      color: $nav-text-color !important
      margin-top: -4px

  #gene-name-input
    width: 140px
    margin-left: 5px

  #load-data-button, #save-json-analysis-button
    margin-left: 8px
    margin-right: 0px
    padding-left: 8px
    padding-right: 8px



  #search-phenotype-button
    background-color: #ffffff1f
    min-width: 70px

    .btn__content, .v-btn__content
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

    #phenotype-input, #gene-name-input, #phenolyzer-top-input, #gene-source-box
      label
        color: $nav-text-color-clin !important
      .material-icons
        color: $nav-text-color-clin !important
      .input-group__selections__comma
        color: $nav-text-color-clin !important

    #phenotype-input, #gene-name-input, #phenolyzer-top-input, #gene-source-box
      .input-group input
        color: $nav-text-color-clin !important
      .input-group__details:before
        background-color: $nav-text-color-clin !important
      .input-group__details:after
        background-color: $nav-text-color-clin !important


    i.material-icons
      color:  $nav-text-color-clin !important

.nav-link
    text-decoration: none
    color: white
    cursor: pointer

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

#options
  .clear-cache-button
    color: $text-color
    margin-left: 0px
    .v-btn__content
      width: 200px
  #load-cache-file-button
    button
      color: $text-color
      margin-left: 0px
      height: 36px;
      font-size: 14px;
      font-weight: normal !important;
      .v-btn__content
            width: 200px

    #file-label-area
      .v-btn__content
        width: 40px
  #save-cache-button
    color: $text-color
    margin-left: 0px
    .v-btn__content
          width: 200px
</style>

<style>
.badge-wrapper {
  display: inline;
  justify-content: center;
  align-items: center;
  min-height: 20px;
}

.badge {
    display: inline-block;
    min-width: 19px;
    padding: 4px 6.5px;
    border-radius: 10px;
    font-size: 11px;
    text-align: center;
    background: #adabab !important;
    color: #fefefe !important;
    position: absolute;
}

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
    <v-toolbar fixed  height="50"   dark  :class="launchedFromClin ? 'clin' : '' " >

      <v-toolbar-side-icon v-if="!isSimpleMode" style="margin-top:5px"  @click.stop="leftDrawer = !leftDrawer">
      </v-toolbar-side-icon>


      <v-toolbar-title style="font-weight:400;margin-top:-6px" v-text="title">
      </v-toolbar-title>

      <v-spacer v-if="!isFullAnalysis"></v-spacer>

      <v-btn  class="navbar-icon-button" v-if="(appAlerts && appAlerts.length > 0) || (badgeCounts && badgeCounts.coverage)" id="notification-button"  @click="onShowNotificationDrawer" flat 
        v-tooltip.bottom-left="{content: 'Notifications (errors, warnings and information). Click to see detailed list.'}">
        <v-badge right  >
          <v-icon>notifications</v-icon>
        </v-badge>
      </v-btn>
      <v-icon class="navbar-icon-button" v-if="appAlertCounts && appAlertCounts.error && appAlertCounts.error > 0"  id="error-badge" 
        v-tooltip.bottom-left="{content: 'The app has encountered at an error. Click on notifications button (bell) to see details.'}">
       error
      </v-icon>
      <v-icon class="navbar-icon-button" v-if="appAlertCounts && appAlertCounts.warning && appAlertCounts.warning > 0"  id="warning-badge" 
        v-tooltip.bottom-left="{content: 'The app has issued a warning. Click on notifications button (bell) to see details.'}">
        warning
      </v-icon>

      <v-icon id="coverage-badge" class="navbar-icon-button" v-if="badgeCounts && badgeCounts.coverage"
           v-tooltip.bottom-left="{content: 'Some genes have insufficient sequence coverage (based in user-defined thresholds'}">
        trending_down
      </v-icon>

      <v-spacer></v-spacer>


      <v-toolbar-items style="flex-grow: 6;padding-top:3px;margin-left: 10px;margin-right:0px">

        <v-icon>search</v-icon>

        <span id="gene-name-input"  style="display:inline-block">
          <v-text-field id="search-gene-name"
          :class="clazzAttention"
          :hide-details="true"
          v-model="geneEntered" label="Gene name" >
          </v-text-field>
          <typeahead v-model="lookupGene"
          force-select v-bind:limit="typeaheadLimit" match-start
          target="#search-gene-name" :data="knownGenes"
          item-key="gene_name"/>
        </span>


        <div v-if="!launchedFromClin && !isEduMode && !isBasicMode" id="search-or" style="display:inline-block">
          or
        </div>

        <genes-menu
         ref="genesMenuRef"
         v-if="!launchedFromClin && !isEduMode && !isBasicMode"
         :buttonIcon="`add_circle`"
         :geneModel="geneModel"
         :isBasicMode="isBasicMode"
         :isEduMode="isEduMode"
         @apply-genes="onApplyGenes"
         @clear-all-genes="onClearAllGenes">
        </genes-menu>

        <div v-if="!isEduMode  && (!isSimpleMode || isPhenolyzerPermitted) && !launchedFromClin" id="search-or" style="display:inline-block">
          or
        </div>

        <phenotype-search style="flex-grow:4"
         id="phenolyzer-search"
         v-if="!isEduMode && !launchedFromClin && (!isSimpleMode || isPhenolyzerPermitted)"
         :classAttention="clazzAttention"
         :isNav="true"
         :phenotypeLabel="isBasicMode ? 'Disorder' : 'Phenotype'"
         :defaultTopGenes="10"
         :geneModel="geneModel"
         :phenotypeLookupUrl="phenotypeLookupUrl"
         :lastPhenotypeTermEntered="lastPhenotypeTermEntered"
         :phenolyzerTopGenes="geneModel.phenolyzerTopGenesToKeep"
         @on-search-genes="onSearchPhenolyzerGenes"
         @on-start-search-genes="onStartSearchPhenolyzerGenes"
         @show-snackbar="onShowSnackbar"
         @hide-snackbar="onHideSnackbar">
        </phenotype-search>


        <v-spacer v-if="!isFullAnalysis"></v-spacer>
      

      </v-toolbar-items>

      
      <v-spacer></v-spacer>


      <v-btn id="settings-button" flat v-if="!isBasicMode && !isSimpleMode && !launchedFromClin" 
        @click="onShowSettingsDialog(true)" 
        v-tooltip.bottom-left="{content: 'App settings'}">
        <v-icon>settings</v-icon>
      </v-btn>


     <v-chip v-if="!isSimpleMode && !isBasicMode && !isEduMode && cohortModel.isLoaded" 
         id="build-name" class="settings-badge" text-color="white">{{ currentBuildName }}</v-chip>

     <v-chip v-if="!isSimpleMode && !isBasicMode && !isEduMode && cohortModel.isLoaded" 
          id="gene-source-chip" class="settings-badge" text-color="white">{{ currentGeneSource }}</v-chip>

     <v-chip v-if="!isSimpleMode && !isBasicMode && !isEduMode && cohortModel.isLoaded && cohortModel.analyzeCodingVariantsOnly"
          id="analyze-coding-variants-only-chip" class="settings-badge" text-color="white">
          coding regions only
      </v-chip>

      <v-spacer></v-spacer>

      <div class="text-xs-center" v-if="!launchedFromHub && !launchedFromClin && !isSimpleMode && !isBasicMode && !isEduMode">
        <v-menu offset-y :value="showLoadMenu">
          <template v-slot:activator="{ on }">
            <v-btn id="load-data-button"
              :outline="cohortModel && !cohortModel.isLoaded"
              :flat="cohortModel && cohortModel.isLoaded" 
              v-on="on"
            >
              <v-icon>file_upload</v-icon>
              <span style="font-size:14px;font-weight:500">Load</span>
            </v-btn>
          </template>
          <v-list>
            <v-list-tile @click="onShowFiles">
              <v-list-tile-title>Specify files</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click.stop="">
                <file-chooser id="load-saved-analysis-button"
                title="Load saved analysis"
                :isMultiple="false" :accept="`.json`"
                :showLabel="false"
                @file-selected="onAnalysisFileSelected">
                </file-chooser>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>

      <v-btn id="files-button"   icon v-if="showFilesButton && (launchedFromHub || launchedFromSFARI || isSimpleMode || isBasicMode) " 
        @click="onShowFiles" 
        v-tooltip.bottom-left="{content: 'Load your data'}">
        <app-icon icon="fileupload"  width="32" height="32"></app-icon>
      </v-btn>


      <v-btn id="save-json-analysis-button" 
        :outline="cohortModel && cohortModel.isLoaded" 
        :flat="cohortModel && !cohortModel.isLoaded"
         v-if="!launchedFromHub && !launchedFromSFARI && !launchedFromClin && cohortModel && cohortModel.isLoaded && !isBasicMode && !isSimpleMode" 
        @click="onSaveAnalysisFile" 
        v-tooltip.bottom-left="{content: 'Save your analysis'}">
        <v-icon>file_download</v-icon>
        Save
      </v-btn>  
      <a id="download-json-file" v-show="false" download="gene_iobio_analysis.json" href="#">
      </a>



      <save-button
        v-if="!isSimpleMode && !isBasicMode && launchedFromHub && !launchedFromSFARI && !launchedFromClin && cohortModel && cohortModel.isLoaded"
        :showing-save-modal="showSaveModal"
        :analysis="analysis"
        :isDirty="isDirty"
        @save-modal:set-visibility="toggleSaveModal"
      />
      
      <v-spacer></v-spacer>


      <v-btn id="legend-button" 
      icon v-if="!isSimpleMode && !isBasicMode" 
      @click="onShowLegendDrawer"
      v-tooltip.bottom-left="{content: 'Show legend'}">
        <v-icon>map</v-icon>
      </v-btn>
    


      <v-menu>
        <v-btn id="more-menu-button" flat slot="activator">
          <v-icon style="font-size:32px;">more_vert</v-icon>
        </v-btn>
        <v-list dense style="overflow-y: scroll">

          <v-list-tile  @click="onShowVersion">
            <v-list-tile-title>About</v-list-tile-title>
          </v-list-tile>

          <v-list-tile  @click="onShowPublication">
            <v-list-tile-title>Cite</v-list-tile-title>
          </v-list-tile>

          <v-divider v-if="!isEduMode && !isBasicMode & !isSimpleMode"></v-divider>
          
          <v-list-tile v-if="!isEduMode && !isBasicMode && !isSimpleMode"
            @click="onShowCoverageThreshold">
            <v-list-tile-title dense>Set sequencing coverage cutoffs</v-list-tile-title>
          </v-list-tile>


          <v-divider v-if="!isEduMode && !isBasicMode & !isSimpleMode"></v-divider>

          <v-list-tile v-if="!isEduMode && !isBasicMode && !launchedFromClin && !isSimpleMode && cohortModel.isLoaded"
            @click="onShowImportVariants">
            <v-list-tile-title dense>Import filtered variants</v-list-tile-title>
          </v-list-tile>

          <v-list-tile v-if="!isEduMode && !isBasicMode && !isSimpleMode && cohortModel.flaggedVariants && cohortModel.flaggedVariants.length > 0" @click="onShowExportVariants">
            <v-list-tile-title>Export filtered variants</v-list-tile-title>
          </v-list-tile>

          <v-list-tile v-if="!isSimpleMode && !isBasicMode" @click="onClearCache">
            <v-list-tile-title>Clear analysis</v-list-tile-title>
          </v-list-tile>

          <v-divider ></v-divider>

          <v-list-tile  @click="onShowTermsOfService">
            <v-list-tile-title>Terms of Service</v-list-tile-title>
          </v-list-tile>
          <v-list-tile  @click="onShowDisclaimer">
            <v-list-tile-title>Disclaimer</v-list-tile-title>
          </v-list-tile>

          <v-list-tile  @click="onShowCitations">
            <v-list-tile-title>Software and resources</v-list-tile-title>
          </v-list-tile>

          <v-divider v-if="!isSimpleMode && showBlogsAndTutorials"></v-divider>

          <v-list-tile v-if="!isSimpleMode && !isBasicMode && showBlogsAndTutorials" @click="onShowBlog">
            <v-list-tile-title>Blog</v-list-tile-title>
          </v-list-tile>

          <v-list-tile v-if="!isSimpleMode && !isBasicMode && showBlogsAndTutorials" @click="onShowTutorial" >
            <v-list-tile-title>Tutorials</v-list-tile-title>
          </v-list-tile>

          <v-list-tile v-if="!isSimpleMode && showBlogsAndTutorials" @click="onShowIOBIO" >
            <v-list-tile-title>iobio</v-list-tile-title>
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
      :width="isSimpleMode ? 355 : 315"
    >
      <div id="side-panel-container" :class="{'basic': isBasicMode}">

        <v-btn v-if="!isFullAnalysis && !launchedFromClin && showFilesButton" id="close-button" class="toolbar-button" flat @click="leftDrawer = false">
          <v-icon >close</v-icon>
        </v-btn>

        <v-progress-circular id="overall-progress"  style="padding-top:6px" :size="12"  :width="2" color="blue darken-1"
          v-if="analyzeAllInProgress || callAllInProgress"
          :indeterminate="true">
        </v-progress-circular>

        <v-tabs
          v-if="cohortModel && cohortModel.isLoaded"
          v-model="activeTab"
          light
        >
          <v-tab v-if="!isBasicMode" >
            <v-badge>
              
              <div class="badge-wrapper">
                <span style="margin-right: 3px" class="badge-label"> Genes </span>
                <span class="badge">{{ geneCount }}</span>
              </div>
            </v-badge>
            
          </v-tab>
          <v-tab>

            <v-badge>

              <div class="badge-wrapper">
                <span style="margin-right: 3px" class="badge-label"> Variants </span>
                <span class="badge">{{ flaggedVariantCount }}</span>
              </div>

            </v-badge>

          </v-tab>

          <v-tab-item v-if="!isBasicMode">

            <genes-panel
             style="margin: 15px 10px 10px 10px"
             ref="genesPanelRef"
             :isEduMode="isEduMode"
             :isBasicMode="isBasicMode"
             :isFullAnalysis="isFullAnalysis"
             :isSimpleMode="isSimpleMode"
             :launchedFromClin="launchedFromClin"
             :isLoaded="cohortModel && cohortModel.isLoaded"
             :hasAlignments="cohortModel && cohortModel.isLoaded && cohortModel.hasAlignments()"
             :geneModel="geneModel"
             :selectedGene="selectedGene"
             :filteredGeneNames="filteredGeneNames"
             :geneNames="geneModel.sortedGeneNames"
             :analyzeAllInProgress="analyzeAllInProgress"
             :callAllInProgress="callAllInProgress"
             :loadedDangerSummaries="Object.keys(geneModel.geneDangerSummaries)"
             :genesInProgress="cohortModel.genesInProgress"
             :appAlerts="appAlerts"
             :geneToAppAlerts="geneToAppAlerts"
             @gene-selected="onGeneSelected"
             @remove-gene="onRemoveGene"
             @count-changed="onGeneCountChanged"
             @analyze-all="onAnalyzeAll"
             @call-variants="onCallVariants"
             @stop-analysis="onStopAnalysis"
            >
            </genes-panel>



          </v-tab-item>


          <v-tab-item>

            <flagged-variants-card
             ref="flaggedVariantsRef"
             :isEduMode="isEduMode"
             :isBasicMode="isBasicMode"
             :isSimpleMode="isSimpleMode"
             :forMyGene2="forMyGene2"
             :cohortModel="cohortModel"
             :isLoaded="cohortModel && cohortModel.isLoaded"
             :hasAlignments="cohortModel && cohortModel.isLoaded && cohortModel.hasAlignments()"
             :activeFilterName="activeFilterName"
             :launchedFromClin="launchedFromClin"
             :launchedFromHub="launchedFromHub"
             :isFullAnalysis="isFullAnalysis"
             :geneNames="geneNames"
             :genesInProgress="genesInProgress"
             :interpretationMap="interpretationMap"
             :toClickVariant="toClickVariant"
             :variantSetCounts="variantSetCounts"
             :selectedVariant="selectedVariant"
             :analyzeAllInProgress="analyzeAllInProgress"
             :callAllInProgress="callAllInProgress"
             @flagged-variant-selected="onFlaggedVariantSelected"
             @apply-variant-notes="onApplyVariantNotes"
             @apply-variant-interpretation="onApplyVariantInterpretation"
             @count-changed="onFlaggedVariantCountChanged"
             @gene-lists-changed="onGeneListsChanged"
             @filter-settings-applied="onFilterSettingsApplied"
             @filter-settings-closed="onFilterSettingsClose"
             @analyze-all="onAnalyzeAll"
             @call-variants="onCallVariants"
             @stop-analysis="onStopAnalysis"
            >
            </flagged-variants-card>

          </v-tab-item>

        </v-tabs>



        <v-card id="legend-card" v-if="(isBasicMode || isSimpleMode) && cohortModel && cohortModel.isLoaded" >
          <legend-panel
            :isBasicMode="isBasicMode"
            :isSimpleMode="isSimpleMode"
            :showLegendTitle="true">
          </legend-panel>
        </v-card>




      </div>

    </v-navigation-drawer>

    <v-navigation-drawer
      v-if="!launchedFromClin"
      v-model="showLegendDrawer"
      absolute
      right
      width="200"
      style="z-index:6; height: calc(100vh - 50px); position: fixed;"
    >
        <v-btn v-if="!isFullAnalysis && !launchedFromClin" id="legend-drawer-close-button" class="toolbar-button" flat @click="showLegendDrawer = false">
          <v-icon >close</v-icon>
        </v-btn>

        <legend-panel
           :showLegendTitle="true"
           :isBasicMode="isBasicMode"
           :isSimpleMode="isSimpleMode">
          </legend-panel>


    </v-navigation-drawer>

    <v-navigation-drawer  
      v-model="showNotificationDrawer"
      absolute right  width="340"
      :class="launchedFromClin ? 'clin' : '' "
      style="z-index:6; height: calc(100vh - 50px); position: fixed;">
        <v-btn  id="error-drawer-close-button" class="toolbar-button" flat @click="showNotificationDrawer = false">
          <v-icon >close</v-icon>
        </v-btn>
        <alert-panel :isBasicMode="isBasicMode"
           :isSimpleMode="isSimpleMode"
           :appAlerts=appAlerts
           @clear-app-alert="onClearAppAlert"
           @clear-all-app-alerts="onClearAllAppAlerts">
        </alert-panel>
    </v-navigation-drawer>


    <files-dialog
     v-if="!isEduMode && !isBasicMode && !isFullAnalysis"
     :cohortModel="cohortModel"
     :showDialog="showFiles"
     :showDialogForAnalysis="showFilesForAnalysis"
     :infoMessage="filesDialogInfoMessage"
     :launchedFromDemo="launchedFromDemo"
     @on-files-loaded="onFilesLoaded"
     @load-demo-data="onLoadDemoData"
     @on-close="onCloseFilesDialog"
     @on-files-load-error="onFilesLoadError"
     @isDemo="onIsDemo"
     @isTrio="onIsTrio"
    >
    </files-dialog>

    <import-variants
     :cohortModel="cohortModel"
     :showDialog="showImportVariants"
     @close-import-variants="onCloseImportVariants"
     @flagged-variants-imported="onFlaggedVariantsImported">
    </import-variants>

    <export-variants
     :cohortModel="cohortModel"
     @close-export-variants="onCloseExportVariants"
     :showDialog="showExportVariants">
    </export-variants>

    <settings-dialog 
      ref="settingsDialogRef"
      :showDialog="showSettingsDialog"
      :cohortModel="cohortModel"
      :geneModel="geneModel"
      :genomeBuildHelper="genomeBuildHelper"
      :filterModel="filterModel"
      :settingsCoverageOnly="settingsCoverageOnly"
      @hide-settings="onShowSettingsDialog(false)"
      @gene-source-selected="onGeneSourceSelected"
      @coverage-threshold-applied="onCoverageThresholdApplied"
      @coverage-threshold-closed="onCoverageThresholdClosed"
      @phenolyzer-top-changed="onPhenolyzerTopChanged"
      @genome-build-selected="onGenomeBuildSelected"
      @coding-variants-only-changed="onCodingVariantsOnlyChange">
    </settings-dialog>


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

    <v-dialog v-model="showTermsOfService" max-width="400">
      <v-card class="full-width">
        <v-card-title class="headline">Terms of service</v-card-title>
        <v-card-text>
          <strong>Academic Use </strong>
          <br> gene.iobio is free for academic use.
          <br><br>
          <strong>Commercial Use </strong>
          <br>
          Commercial use of gene.iobio is licensed through Frameshift Genomics. Please contact Frameshift at
          <a href="mailto:admin@frameshift.io" target="_top">admin@frameshift.io</a>
          to discuss any commercial use of this tool.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn raised  @click.native="showTermsOfService= false">Close</v-btn>
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
                <div><div class="version-label">Phenolyzer</div><div class="number">Oct 2019</div></div>
                <div><div class="version-label">Variant Effect Predictor</div><div class="number">Version 105</div></div>               
                <div><div class="version-label">REVEL</div> <div class="number">v1.3</div></div>
                <div><div class="version-label">FreeBayes</div><div class="number">v1.3.1</div></div>
                <div><div class="version-label">Samtools</div><div class="number">
                1.9</div></div>
                <div><div class="version-label">Tabix</div><div class="number">1.9</div></div>
                <div><div class="version-label">vt subset, normalize</div><div class="number">v0.57721</div></div>
                <div><div class="version-label">gnomAD </div><div class="number">v2.1 for GRCh37, v3  for GRCh38</div></div>                
                <div><div class="version-label">ACMG Genes</div> <div class="number">v3.2</div></div>


              </div>
            </div>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn raised  @click.native="showVersion = false">Close</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>


   <v-dialog v-model="showPublication" max-width="600" max-height="">
        <v-card class="full-width" >
          <v-card-title class="headline">Cite</v-card-title>
          <v-card-text>

            <div style="max-width: 550px;min-width: 550px;font-size: 15px;text-align: justify;">
              Di Sera, T., Velinder, M., Ward, A. et al. Gene.iobio: an interactive web tool for versatile, clinically-driven variant interrogation and prioritization. Sci Rep 11, 20307 (2021). <a href="https://doi.org/10.1038/s41598-021-99752-5" target="_new">https://doi.org/10.1038/s41598-021-99752-5</a>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn raised  @click.native="showPublication = false">Close</v-btn>
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
import FilesDialog         from '../partials/FilesDialog.vue'
import LegendPanel         from '../partials/LegendPanel.vue'
import FlaggedVariantsCard from '../viz/FlaggedVariantsCard.vue'
import GenesPanel          from '../partials/GenesPanel.vue'
import PhenotypeSearch     from '../partials/PhenotypeSearch.vue'
import ImportVariants      from '../partials/ImportVariants.vue'
import ExportVariants      from '../partials/ExportVariants.vue'
import FilterIcon          from '../partials/FilterIcon.vue'
import SaveButton          from '../partials/SaveButton.vue'
import AppIcon             from '../partials/AppIcon.vue'
import FileChooser         from '../partials/FileChooser.vue'
import AlertPanel          from '../partials/AlertPanel.vue'
import SettingsDialog      from '../partials/SettingsDialog.vue'

export default {
  name: 'navigation',

  components: {
    Typeahead,
    GenesMenu,
    FilesDialog,
    FlaggedVariantsCard,
    GenesPanel,
    LegendPanel,
    PhenotypeSearch,
    ImportVariants,
    ExportVariants,
    FilterIcon,
    SaveButton,
    AppIcon,
    FileChooser,
    AlertPanel,
    SettingsDialog
  },
  props: {
    showFilesProp: null,
    showFilesForAnalysis: null,
    filesDialogInfoMessage: null,
    isEduMode: null,
    isBasicMode: null,
    isSimpleMode: null,
    showBlogsAndTutorials: null,
    isPhenolyzerPermitted: null,
    forMyGene2: null,
    showFilesButton: null,
    launchedFromSFARI: null,
    launchedFromHub: null,
    analysis: null,
    isDirty: null,
    analyzeAllInProgress: null,
    callAllInProgress: null,
    selectedGene: null,
    selectedVariant: null,
    filteredGeneNames: null,
    geneModel: null,
    cohortModel: null,
    genomeBuildHelper: null,
    filterModel: null,
    cacheHelper: null,
    activeFilterName: null,
    launchedFromClin: null,
    showSaveModal: null,
    isLoaded: null,
    isFullAnalysis: null,
    isClinFrameVisible: null,
    bringAttention: null,
    phenotypeLookupUrl: null,
    geneNames: null,
    genesInProgress: null,
    interpretationMap: null,
    lastPhenotypeTermEntered: null,
    toClickVariant: null,
    variantSetCounts: null,
    badgeCounts: null,
    showWelcome: null,
    launchedFromDemo: null,
    appAlerts: null,
    appAlertCounts: null,
    geneToAppAlerts: null,
    settingsCoverageOnly: null,
    analysisModel: null
  },
  data () {
    let self = this;
    return {
      title: 'gene.iobio',
      showFiles: false,

      lookupGene: {},
      geneEntered: null,
      clipped: false,
      leftDrawer: self.forMyGene2 | self.isSimpleMode ? true : false,
      rightDrawer: false,

      showImportVariants: false,
      showExportVariants: false,
      showTermsOfService: false,
      showDisclaimer: false,
      showVersion: false,
      showCitations: false,
      showPublication: false,
      typeaheadLimit: parseInt(100),
      showLegendDrawer: false,
      showErrorDrawer: false,
      showNotificationDrawer: false,
      showLoadMenu: false,


      activeTab: 0,

      geneCount: 0,
      flaggedVariantCount: 0,

      showKnownVariantsCard: false,

      geneSource: null,
      geneSources: ['gencode', 'refseq'],

      analysisFileName: "",

      showSettingsDialog: false


    }
  },
  watch: {
    lookupGene: function(a, b) {
      if (this.selectedGene && this.lookupGene && this.lookupGene.gene_name) {
        this.geneEntered = this.lookupGene.gene_name;
        this.$emit("input", this.lookupGene.gene_name);
      }
    },
    showFilesProp: function(){
      this.showFiles = this.showFilesProp;
    },
    showFiles: function(){
      this.$emit('show-files', this.showFiles);
    },
    showWelcome: function(){
      if(this.showWelcome){
        this.leftDrawer = false;
      }
      else{
        this.leftDrawer = true;
      }
    },
    leftDrawer: function() {
      this.$emit("on-left-drawer", this.leftDrawer);
    },
    showKnownVariantsCard: function() {
      this.$emit("show-known-variants", this.showKnownVariantsCard);
    },
    lastPhenotypeTermEntered: function() {
      if (this.lastPhenotypeTermEntered != null) {
        this.phenotypeTermEntered = this.lastPhenotypeTermEntered;
      }
    }
  },
  methods: {
    onLoadDemoData: function(loadAction) {
      this.$emit("load-demo-data", loadAction);
    },
    navigateHome: function(){
      if(this.analyzeAllInProgress || this.isLoaded) {
        this.$emit('on-welcome-changed', true);
      }
    },
    onFilesLoadError: function(error) {
      this.$emit('on-files-load-error', error)
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
    onIsDemo: function(bool){
      this.$emit("isDemo", bool);
    },
    onIsTrio: function(bool){
      this.$emit("isTrio", bool);
    },
    getCacheHelper: function() {
      return this.cohortModel.cacheHelper
    },
    onCoverageThresholdApplied() {
      return this.$emit('coverage-threshold-applied')
    },
    onCoverageThresholdClosed() {
      return this.$emit('coverage-threshold-closed')
    },
    onSaveAnalysisFile: function(){
      let self = this;

      self.$emit("on-show-progress", "Formatting analysis data")
              
      self.analysisModel.promiseSaveAnalysisFile(self.appAlerts, 
          self.currentBuildName, self.currentGeneSource)
      .then(function(data) {

        self.globalApp.utility.createDownloadLink("#download-json-file",
          data.dataStr,
          data.jsonFileName);
        self.$emit("on-hide-progress")
        document.getElementById('download-json-file').click();
      })      
      .catch(function(error) {
        self.$emit("on-hide-progress")
        console.log("Unable to output cache", error)
      })
    },
    onAnalysisFileSelected: function(fileSelection) {
      let me = this;


      if (fileSelection.target.files.length > 0) {
        let analysisFileName = fileSelection.target.files[0].name;  
        let start = new Date();
        let dataIsCompressed = true;

        
        me.showLoadMenu = true;
        setTimeout(function() {
          me.showLoadMenu = false;

        }, 1000)

        me.analysisModel.promiseLoadAnalysisFromFile(fileSelection)
        .then(function(modelInfoProvided) {

          if (me.$refs && me.$refs.settingsDialogRef) {
            me.$refs.settingsDialogRef.init();
          }

          console.log("Time to load analysis from file " + analysisFileName + ": " + (new Date() - start) / 1000 + " seconds ");
          if (modelInfoProvided) {
            me.onShowVariantsTab();
            me.$emit("on-analysis-file-loaded", analysisFileName);            
          }
        })
        .catch(function(error) {
          let msg = "Error loading analysis .json file " + analysisFileName;
          console.log(msg, error)
          me.$emit("on-analysis-file-error", msg, error)

          me.showLoadMenu = true;
          setTimeout(function() {
            me.showLoadMenu = false;

          }, 1000)
        })        
      }
      
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
          if (!self.isEduMode) {
            self.leftDrawer = true;
          }
        }
      })
    },
    onShowVariantsTab: function() {
      let self = this;
      this.activeTab = 1;
      this.$nextTick(function() {
        if (!self.launchedFromClin || self.isClinFrameVisible) {
          if (!self.isEduMode) {
            self.leftDrawer = true;
          }
        }
      })
    },
    onShowGenesTab: function() {
      let self = this;
      this.activeTab = 0;
      this.$nextTick(function() {
        if (!self.launchedFromClin || self.isClinFrameVisible) {
          if (!self.isEduMode) {
            self.leftDrawer = true;
          }
        }
      })
    },
    onShowSettingsDialog: function(show) {
      this.showSettingsDialog = show;
    },
    onFlaggedVariantSelected: function(variant) {
      this.$emit("flagged-variant-selected", variant)
    },
    onFlaggedVariantsImported: function() {
      this.$emit("flagged-variants-imported")
    },
    onFilesLoaded: function(analyzeAll) {
      this.showFiles = false;
      this.$emit("on-files-loaded", analyzeAll);
    },
    onCloseFilesDialog: function() {
      this.showFiles = false
      this.$emit("on-close-files-dialog", false)
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
    onShowFiles: function() {
      this.showFiles = true;
      this.showLoadMenu = false;
    },
    onShowLegendDrawer: function() {
      this.showLegendDrawer = !this.showLegendDrawer;
    },
    onShowErrorDrawer: function() {
      this.showErrorDrawer = !this.showErrorDrawer;
    },
    onShowNotificationDrawer: function() {
      this.showNotificationDrawer = !this.showNotificationDrawer;
    },
    onShowNotificationDrawerShowLast: function() {
      this.showNotificationDrawer = true;
      setTimeout(function() {
        let items = $("#alert-panel .alert-item");
        if (items && items.length > 1) {
          let last = items[items.length-1];
          last.scrollIntoView();          
        }
      }, 1000);
    },
    onShowCoverageThreshold: function() {
      this.$emit('show-coverage-threshold', true)
    },
    onShowTermsOfService: function(){
      this.showTermsOfService = true;
    },
    onShowDisclaimer: function() {
      this.showDisclaimer = true;
    },
    onShowVersion: function() {
      this.showVersion = true;
    },
    onShowPublication: function() {
      this.showPublication = true;
    },
    onShowCitations: function() {
      this.showCitations = true;
    },
    onShowImportVariants: function() {
      this.showImportVariants = true;
    },
    onCloseImportVariants: function() {
      this.showImportVariants = false;
    },
    onShowExportVariants: function() {
      this.showExportVariants = true;
    },
    onCloseExportVariants: function() {
      this.showExportVariants = false;
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
      window.open("/tutorial", "tutorial");
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
    onGeneListsChanged: function(geneLists){
      this.$emit("gene-lists-changed", geneLists);
    },
    onFlaggedVariantCountChanged: function(count) {
      this.flaggedVariantCount = count;
      if(this.flaggedVariantCount === 0){
        this.$emit("flagged-variant-selected", null)
      }
      this.$emit("variant-count-changed", count);
    },

    onFilterSettingsApplied: function() {
      this.$emit("filter-settings-applied");
    },
    onFilterSettingsClose: function() {
      this.$emit('filter-settings-closed');
    },
    onAnalyzeAll: function() {
      this.$emit("analyze-all");
    },
    onCallVariants: function(action) {
      this.activeTab = 0;
      this.$emit("call-variants", action)
    },
    onStopAnalysis: function() {
      this.$emit("stop-analysis");
    },
    toggleSaveModal(bool) {
      this.$emit("toggle-save-modal", bool);
    },
    onGeneSourceSelected: function(theGeneSource) {
      let self = this;
      if (theGeneSource) {
        self.geneSource = theGeneSource;
      }
      self.$emit('gene-source-selected', self.geneSource);
    },
    onPhenolyzerTopChanged: function(phenolyzerTop) {
      this.$emit('phenolyzer-top-changed', phenolyzerTop)
    },
    onCodingVariantsOnlyChange: function(codingVariantsOnly) {
      this.$emit('coding-variants-only-changed', codingVariantsOnly)
    },
    onGenomeBuildSelected: function(buildName) {
      this.$emit('genome-build-selected', buildName)
    },
    onClearAppAlert: function(key) {
      this.$emit('clear-app-alert', key)
    },
    onClearAllAppAlerts: function() {
      this.$emit('clear-all-app-alerts')
    }

  },
  created: function() {
  },
  mounted: function() {
     $("#search-gene-name").attr('autocomplete', 'off');
     this.geneSource = this.geneModel.geneSource;
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
    currentBuildName: function() {
      return this.genomeBuildHelper.getCurrentBuildName()
    },
    currentGeneSource: function() {
      return this.geneModel.geneSource
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
