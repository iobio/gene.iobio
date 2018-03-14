<style lang="sass">
@import ../../../assets/sass/variables

$tour-button-color:      rgba(165, 185, 65, 1)
$tour-hilite-color:      #F05B5B

// Don't show the number box
.tlypageguide_index
  display: none !important


.tlypageguide_shadow
  background-color: rgba(255, 255, 255, 0)
  box-shadow: 0 0 1px 1px rgba(255, 255, 255, 0)

  &.tlypageguide-active
    background-color: transparent !important
    webkit-box-shadow: none !important
    box-shadow: none !important
    border: $tour-hilite-color solid 6px !important


#tlyPageGuideWrapper #tlyPageGuideMessages a.tlypageguide_close
  color: white !important

  &:hover, &:focus
    color: white !important

.dropdown-menu > li > a
  color: $text-color !important


.tlypageguide_text
  padding-bottom: 10px !important

.tlyPageGuideStepIndex
  opacity: .3

.tlypageguide-active
  .tlyPageGuideStepIndex
    opacity: 1

// This is for the new next and prev buttons
#tlyPageGuideWrapper
  #tlyPageGuideMessages
    min-height: 130px

    span
      top: 35px !important

    a.tlypageguide_listen
      color: white !important
      background-color:  $tour-button-color
      -webkit-border-radius: 3px 3px 3px 3px
      -moz-border-radius: 3px 3px 3px 3px
      -o-border-radius: 3px 3px 3px 3px
      border-radius: 3px 3px 3px 3px
      display: block
      font-size: 12px
      height: 24px
      line-height: 26px
      text-align: center
      text-decoration: none
      width: 50px

    .tlypageguide_text
      margin-left: 200px
      margin-right: 200px
      margin-top: 10px
      margin-bottom: 10px


    .pageguide-nav
      text-align: center
      position: absolute
      bottom: 10px
      width: 100%
      margin-top: 13px


    a.pageguide-prev
      color: white !important
      background-color:  $tour-button-color
      text-align: left
      padding-right: 0px
      vertical-align: top
      margin-left: -15px
      margin-right: 40% !important
      font-size: 28px
      padding-top: 2px
      padding-bottom: 3px
      border-radius: 3px 3px 3px 3px


      &:focus
        text-decoration: none !important
        color: white !important

      &:hover
        text-decoration: none !important
        color: white !important

      &:before
        position: relative
        display: inline-block
        border-top: 30px solid transparent
        border-right: 19px solid $tour-button-color
        border-bottom: 30px solid transparent
        left: -11px
        bottom: 10px
        content: ""

      &.hide
        visibility: hidden !important
        display: inline-block !important


    a.pageguide-next
      color: white !important
      background-color: $tour-button-color
      text-align: left
      padding-right: 2px
      vertical-align: top
      margin-left: 40% !important
      margin-right: 10px
      font-size: 28px
      padding-top: 2px
      padding-bottom: 3px
      border-radius: 3px 3px 3px 3px
      visibility: visible

      &:focus
        text-decoration: none !important
        color: white !important

      &:hover
        text-decoration: none !important
        color: white !important

      &:before
        position: relative
        display: inline-block
        border-top: 30px solid transparent
        border-left: 19px solid  $tour-button-color
        border-bottom: 30px solid transparent
        right: -87px
        bottom: 11px
        content: ""

      &.disabled
        color: rgba(0, 0, 0, 0.26) !important
        opacity: .65 !important
        cursor: not-allowed !important

      &.hide
        visibility: hidden !important
        display: inline-block !important


    a.pageguide-close
      color: white !important
      background-color: transparent
      position: absolute
      top: 0px
      right: 15px
      font-size: 28px
      text-decoration: none

      &:focus
        text-decoration: none !important
        color: white !important

      &:hover
        text-decoration: none !important
        color: white !important

</style>
<template>
    <div class="hide">
        <div id="tourPanelWrapper" class="hide">
          <div id="tourPanel">

          </div>
        </div>


        <!-- Tour for colon cancer screening case -->
        <ul id="tourEduCase1"  data-tourtitle="coloncancer">


          <li class="tlypageguide_down" data-tourtarget="#edu-tour-label">
          </li>


          <li class="tlypageguide_right" data-tourtarget="#app-tour-genes-menu">
            <div>
               Look at the father’s genome first. Select 'Colon cancer' from the ‘Phenolyzer’ box at the left of the screen.
            </div>
          </li>


          <li class="tlypageguide_right" data-tourtarget="#gene-badge-container #gene-badge-button">
            <div>
              #gene-badge-container #gene-badge-button
            </div>
          </li>

          <li class="tlypageguide_right" data-tourtarget="#variant-card.proband #gene-viz">
            <div>
              Gene model
            </div>
          </li>



          <li class="tlypageguide_left" data-tourtarget="#gene-badge-container">

            <div style="display:inline-block;float:left;width: 50%;text-align: left;margin-left: 20px;margin-bottom:20px">
              Examine the genes at the top of the screen for
             harmful variants. Touch a gene’s name to search it. Variants predicted
             to be harmful will have bright red icons.
             If you find a harmful variant for the father, tap the red icon.
            </div>
            <div style="display:inline-block;float:left">
               <img width="300" src="assets/images/edutour/impact_legend.png">
            </div>
          </li>

           <li class="tlypageguide_up" data-tourtarget="#edu-tour-1 #start-over">
            <div>
              #edu-tour-1 #start-over
            </div>
          </li>

           <li class="tlypageguide_down" data-tourtarget="#children-buttons">
            <div style="margin-right:100px">
            Search the APC genes of the children for the harmful variant. Touch each child’s name at the top of the screen. Based on what you find, select which children should get frequent colon cancer screenings below.

              <div style="text-align:center;margin-top:20px;margin-bottom:0px;">

                <div  id="jimmy-answers" class="answers custom-checkbox" style="display:inline-block;margin-right:20px">
                    <input type="checkbox" onclick="onTour1Check($(this))"  id="jimmy">
                    <label for="jimmy">Jimmy</label>
                 </div>
                <div id="bobby-answers" class="answers custom-checkbox" style="display:inline-block;margin-right:20px">
                    <input type="checkbox"   onclick="onTour1Check($(this))" id="bobby">
                    <label for="bobby">Bobby</label>
                 </div>
                <div id="sarah-answers" class="answers custom-checkbox" style="display:inline-block">
                    <input type="checkbox"   onclick="onTour1Check($(this))" id="sarah">
                    <label for="sarah" >Sarah</label>
                 </div>
              </div>

              <div style="text-align:center;margin-top: -5px;margin-bottom:0px;">
                  <div style="display:inline-block;margin-right: 45px;margin-left: -8px;">
                      <label id="jimmy-answer" class=" edu-tour-answer" style="visibility:hidden">correct</label>
                  </div>
                  <div style="display:inline-block;margin-right: 36px;">
                      <label id="bobby-answer" class="incorrect edu-tour-answer" style="visibility:hidden">incorrect</label>
                   </div>
                  <div style="display:inline-block">
                      <label id="sarah-answer" class=" edu-tour-answer" style="visibility:hidden">correct</label>
                   </div>
                </div>
            </div>
          </li>

           <li class="tlypageguide_down" data-tourtarget=".edu-tour-1-child-buttons">
          </li>
        </ul>

        <!-- Tour for warfarin screening case -->
        <ul id="tourEduCase2"  data-tourtitle="warfarin">


          <li class="tlypageguide_up" data-tourtarget="#edu-tour-2-label">
          </li>

          <li class="tlypageguide_up" data-tourtarget="#edu-tour-2 #start-over">
          </li>

          <li class="tlypageguide_down" data-tourtarget="#variant-card.proband #loaded-variant-viz">
              <div style="margin-right:120px">
                The variant with a red circle around it determines Warfarin sensitivity. This is the variant you need to examine in your patients.
              </div>
          </li>

          <li class="tlypageguide_down" data-tourtarget="#child-buttons-tour2">
            <div>
            Select each patient. Determine their genotype and choose the correct dosage for them below.
            <br><br>
            </div>
            <div    style="margin-bottom:0px;margin-top:10px;">


              <div id="john-answers"  class="answers selected" >
                <div class="answer-label">John</div>
                <div  style="text-align:left;margin-top:0px;margin-bottom:0px">
                  <div class="custom-checkbox" style="display:block;">
                      <input type="checkbox" class="john-checkbox" onclick="onTour2Check($(this))" id="john-normal">
                      <label for="john-normal" >Normal GG</label>
                  </div>
                  <div class="custom-checkbox" style="display:block;">
                      <input type="checkbox" class="john-checkbox" onclick="onTour2Check($(this))" id="john-lower">
                      <label for="john-lower">Lower AG</label>
                   </div>
                  <div class="custom-checkbox" style="display:inline">
                      <input type="checkbox" class="john-checkbox" onclick="onTour2Check($(this))" id="john-lowest">
                      <label for="john-lowest" >Lowest AA</label>
                   </div>
                   <div  style="text-align:left;margin-top:-7px;margin-bottom:0px;">
                    <label id="john-normal-answer" class="john-answer incorrect hide edu-tour-answer" >incorrect</label>
                    <label id="john-lower-answer"  class="john-answer hide edu-tour-answer" >correct</label>
                    <label id="john-lowest-answer" class="john-answer hide incorrect edu-tour-answer">incorrect</label>
                   </div>
                </div>

              </div>
              <div  id="diego-answers" class="answers" >
                <div class="answer-label">Diego</div>
                <div  style="text-align:left;margin-top:0px;margin-bottom:0px">
                  <div class="custom-checkbox" style="display:block;">
                      <input type="checkbox" class="diego-checkbox" onclick="onTour2Check($(this))" id="diego-normal">
                      <label for="diego-normal" >Normal GG</label>
                  </div>
                  <div class="custom-checkbox" style="display:block;">
                      <input type="checkbox" class="diego-checkbox" onclick="onTour2Check($(this))" id="diego-lower">
                      <label for="diego-lower">Lower AG</label>
                   </div>
                  <div class="custom-checkbox" style="display:inline">
                      <input type="checkbox" class="diego-checkbox" onclick="onTour2Check($(this))" id="diego-lowest">
                      <label for="diego-lowest" >Lowest AA</label>
                   </div>
                   <div  style="text-align:left;margin-top:-7px;margin-bottom:0px;">
                    <label id="diego-normal-answer" class="diego-answer incorrect hide edu-tour-answer" >incorrect</label>
                    <label id="diego-lower-answer"  class="diego-answer hide incorrect edu-tour-answer" >incorrect</label>
                    <label id="diego-lowest-answer" class="diego-answer hide  edu-tour-answer">correct</label>
                   </div>
                </div>
              </div>


              <div  id="anna-answers"  class="answers" >
                <div class="answer-label">Anna</div>
                <div style="text-align:left;margin-top:0px;margin-bottom:0px">
                  <div class="custom-checkbox" style="display:block;">
                      <input type="checkbox" class="anna-checkbox" onclick="onTour2Check($(this))" id="anna-normal">
                      <label for="anna-normal" >Normal GG</label>
                  </div>
                  <div class="custom-checkbox" style="display:block;">
                      <input type="checkbox" class="anna-checkbox" onclick="onTour2Check($(this))" id="anna-lower">
                      <label for="anna-lower">Lower AG</label>
                   </div>
                  <div class="custom-checkbox" style="display:inline">
                      <input type="checkbox" class="anna-checkbox" onclick="onTour2Check($(this))" id="anna-lowest">
                      <label for="anna-lowest" >Lowest AA</label>
                   </div>
                   <div  style="text-align:left;margin-top:-7px;margin-bottom:0px;">
                    <label id="anna-normal-answer" class="anna-answer  hide edu-tour-answer" >correct</label>
                    <label id="anna-lower-answer"  class="anna-answer hide incorrect edu-tour-answer" >incorrect</label>
                    <label id="anna-lowest-answer" class="anna-answer hide incorrect edu-tour-answer">incorrect</label>
                   </div>
                </div>
              </div>

              <!-- <div style="margin-top:20px;float:left;width:25%;background-color:white;padding: 10px;">
                <img width="200" src="assets/images/edutour/dose_legend.png">
              </div>
             -->
            </div>
          </li>

          <li class="tlypageguide_up" data-tourtarget="#edu-tour-2">

              <img width="450" src="assets/images/edutour/patient_to_dose_legend.png">

          </li>




        </ul>


        <!-- Main tour -->
        <ul id="tourMain" data-tourtitle="main">
         <li class="tlypageguide_left" data-tourtarget="#search-gene-name">
            <div>
              Type in the gene name BRCA2 and select from the dropdown list.
              <br><br>
              <strong><em>Click on next arrow > to continue to next step.</em></strong>
              <br><br>
            </div>
          </li>


          <li class="tlypageguide_top" data-tourtarget="#variant-card.proband #gene-viz">
            <div>
              This shows the gene model for the canonical transcript.
            </div>
          </li>

          <li class="tlypageguide_bottom" data-tourtarget="#files-menu-button">
            <div>
              Click on the 'Files' link in the navigation bar to load your variant and alignment files.
              <br><br>
            </div>
            <div>
              1. Select 'GRCh37' from the genome build dropdown. <br><br>
            </div>
            <div>
              2. Click on the 'Variants' dropdown and select 'Platinum Trio'.
              <br><br>
            </div>
            <div>
              3. Click on the 'Alignments' dropdown and select 'Platinum Trio'.
              <br><br>
            </div>
             <div>
              4. Click 'Load' to load all of the selected data into the app.
              <br><br>
            </div>
          </li>


          <li class="tlypageguide_top" data-tourtarget="#variant-card.proband #loaded-variant-viz">
            <div>
              The variants for the gene are annotated using VEP to determine functional impact and effect, the allele frequencies from 1000 Genomes and ExAC are retrieved, and queries to ClinVar flag any variants with clinical significance.  All of this processing occurs in real-time.
              Hover over or click on the variants symbols to see more information.
              <br><br>

            </div>
          </li>


          <li class="tlypageguide_top" data-tourtarget="#variant-card.proband #bam-track">
            <div>
              When an alignment file is specified, the base coverage chart is displayed, allowing the user to identify regions of abnormal or unexpected sequence coverage.
            </div>
          </li>
          <li class="tlypageguide_top" data-tourtarget="#matrix-card">
            <div>
              The variants are ranked according to different criteria.
              <br><br>
              Click on a column to see details about the variant.  Click the column again and the tooltip disappears.
            </div>
          </li>
          <li class="tlypageguide_top" data-tourtarget="#matrix-card .show-settings-button">
            <div>
             The criteria used to rank the variants can be reordered by clicking on their respective arrows. Click on 'Reorder' link and then click on the up/down arrows to reorder variants.
            </div>
          </li>



          <li class="tlypageguide_right" data-tourtarget="select-transcripts-box show-transcripts-button">
            <div>
              For the gene BRCA2, the variants were annotated and ranked based on the canonical transcript.
              <br><br>
              Other transcripts for this gene can be selected from this dropdown.
              <br><br>
              Click on the dropdown and select another transcript.  Notice how the variants are re-annotated
              according to this transcript.
            </div>
          </li>
          <li class="tlypageguide_top" data-tourtarget="#show-gene-source-button">
            <div>
             The Gencode transcript set is currently loaded.  To switch to the RefSeq transcripts, select it from the dropdown.
            </div>
          </li>

          <li class="tlypageguide_top" data-tourtarget="#variant-card.proband #zoom-switch">
            <div>
             To zoom into a region of a gene, drag and drop to select a region.
             <br><br>
             To zoom back out, click anywhere on the gene model.
            </div>
          </li>
          <li class="tlypageguide_right" data-tourtarget="#gene-region-buffer-input">
            <div>
              Adjust this value to modify the displayed genomic region. Increasing the amount of upstream and downstream DNA analyzed increases the potential for detecting cis regulatory variants for this gene.
            </div>
          </li>


          <li class="tlypageguide_right" data-tourtarget="#call-variants-dropdown">
            <div>
              Variants can be called in real-time when an alignment file is present.
              <br><br>
              Push the 'Call Variants' dropdown and select 'Current gene'.
              <br><br>
              Variants are called in real-time.  In a few seconds, Freebayes will return
              the called variants.
            </div>
          </li>
          <li class="tlypageguide_bottom" data-tourtarget="#variant-card.proband #called-variant-viz">
            <div>
              Variants not present in the VCF file will be displayed above the loaded variants.
            </div>
          </li>
          <li class="tlypageguide_right" data-tourtarget="#gene-count-badges">
            <div>
              The badges show the number of genes that are flagged. .....
            </div>
          </li>

          <li class="tlypageguide_top" data-tourtarget="#variant-card.proband #loaded-count">
            <div>
              The proband variant card now shows one variant.
            </div>
          </li>


          <li class="tlypageguide_top" data-tourtarget="#variant-card.proband #loaded-variant-viz svg g.group g.snp">
            <div>
              Click on a variant to lock the tooltip and examine the variant in more detail.
            </div>
          </li>


          <li class="tlypageguide_top" data-tourtarget="#variant-detail">
            <div>
              Variant details are shown here.
            </div>
          </li>

          </li>
          <li class="tlypageguide_right" data-tourtarget="#show-variants-button">
            <div>
              Click on the 'Bookmarks' link in the navigation bar to see a list of all flagged variants.
            </div>
          </li>
          </li>
          <li class="tlypageguide_right" data-tourtarget="#flagged-variants-card">
            <div>
              All variants that are flagged are listed here.
            </div>
          </li>
          <li class="tlypageguide_top" data-tourtarget="#flagged-variants-card .favorite-indicator">
            <div>
              When reviewing the variants, you can star the ones that are noteworthy.
            </div>
          </li>

          <li class="tlypageguide_top" data-tourtarget="#help-menu-button">
            <div>
              To learn more about the Flagged Variants feature, select 'Tour flagged variants' from the 'Help' menu.
            </div>
          </li>

           <li class="tlypageguide_right" data-tourtarget="#show-genes-button">
            <div>
              Click on the 'Genes' link in the navigation bar.
            </div>
          </li>


           <li class="tlypageguide_right" data-tourtarget="#copy-paste-genes">
            <div>
              You can type in or copy/paste a gene list here.
            </div>
          </li>


           <li class="tlypageguide_right" data-tourtarget="#acmg-genes-button">
            <div>
              Click on 'ACMG 56 Genes' button.  These genes have been selected and now appear in the Genes panel.
            </div>
          </li>


           <li class="tlypageguide_right" data-tourtarget="#phenolyzer-panel">
            <div>
              Our application has integrated Phenolyzer, which produces a ranked gene list based on
              a phenotype terms.
            </div>
          </li>

           <li class="tlypageguide_right" data-tourtarget="#help-button">
            <div>
               To learn more about running Phenolyzer in gene.iobio, select  'Tour phenolyzer' from the 'Help' menu.
            </div>
          </li>

           <li class="tlypageguide_right" data-tourtarget="#help-button">
            <div>
              This completes the gene.iobio tour.  You can run the tour any time by
              selecting 'Tour gene.iobio' from the 'Help' menu.
              <br>
              <br>
              <strong><em>Click the close button to end or click on next arrow > to re-run the tour.</em></strong>
              <br>
              <br>
            </div>
          </li>
           <li class="tlypageguide_right" data-tourtarget="#app">
            <div>
              Starting the gene.iobio tour over...
              <br>
              <br>
              <strong><em>To end this tour, click the close button.</em></strong>
              <br>
              <br>
            </div>
          </li>

        </ul>


        <!-- Tour of bookmarks functionality -->
        <ul id="tourBookmarks"  data-tourtitle="bookmarks">



          <li class="tlypageguide_top" data-tourtarget="#feature-matrix">
            <div>
              You can bookmark variants by clicking on a variant column in the Ranked Variants card.
              <br><br>
              Bookmark a variant now by clicking on a column and then clicking on the 'Bookmark' link in the tooltip.
              Do this a few times to bookmark multiple variants.
            </div>
          </li>
          <li class="tlypageguide_top" data-tourtarget="#proband-variant-card #vcf-track">
            <div>
              You can also bookmark a variant by clicking on a variant and then clicking on the 'Bookmark' link in the
              tooltip.
              <br><br>
              Click on a variant and click on the 'Bookmark' link in the tooltip.
            </div>
          </li>
          <li class="tlypageguide_top" data-tourtarget="#vcf-variants .tooltip #bookmarkLink">
            <div>
              Or you can click on the 'bookmark variant' link here to bookmark variant you are inspecting.
            </div>
          </li>
          </li>
          <li class="tlypageguide_right" data-tourtarget="#show-bookmarks-link">
            <div>
              Click on the 'Bookmark Variants' to see a list of all bookmarked variants.
            </div>
          </li>
          </li>
          <li class="tlypageguide_right" data-tourtarget="#bookmark-card #bookmark-panel">
            <div>
              All variants that are bookmarked are listed here.  You can click on a bookmark
              link to show the variant in the main app area.
            </div>
          </li>
          <li class="tlypageguide_top" data-tourtarget="#bookmark-card .favorite-indicator">
            <div>
              When reviewing a number of bookmarks, you can star the ones that are noteworthy.
            </div>
          </li>
          <li class="tlypageguide_left" data-tourtarget="#bookmark-card #edit-bookmarks">
            <div>
              To remove any bookmarks, click on the Edit link.  Then click the X next to the bookmarks you wish to remove.
            </div>
          </li>

          <li class="tlypageguide_top" data-tourtarget="#bookmark-card #import-bookmarks-dropdown">
            <div>
              If you are using a variant priorization app like GEMINI and have a list of variants,
              you can import them as bookmarks here.
              <br><br>
              1. Copy (ctrl+C) a tab-delimited list of variants.
              <br><br>
              2. Click on the 'Import' dropdown.
              <br><br>
              3. Paste (ctrl+V) your buffer into the text area.
              <br><br>
              4. Press the 'Done' button.
            </div>
          </li>
           <li class="tlypageguide_top" data-tourtarget="#bookmark-card #export-bookmarks-dropdown">
            <div>
              You can export the bookmarked variants into a tab-delimited file by clicking
              on the 'Export' dropdown.
              <br><br>
              The exported list will appear in a new tab in your browser window.
            </div>
          </li>

        </ul>


        <!-- Tour of phenolyzer functionality -->
        <ul id="tourPhenolyzer" data-tourtitle="phenolyzer">

           <li class="tlypageguide_right" data-tourtarget="#show-select-genes-link">
            <div>
              Click on the 'Genes' link in the navigation bar.
            </div>
           </li>

           <li class="tlypageguide_right" data-tourtarget="#genes-card #phenolyzer-search-box .selectize-control">
            <div>
              Our application has integrated Phenolyzer, which produces a ranked gene list based on
              a phenotype terms.
              <br><br>
              Enter the search term 'breast cancer'
            </div>
           </li>


           <li class="tlypageguide_top" data-tourtarget="#genes-card #phenolyzer-go-button">
            <div>
              Press the 'Run' button.  In about a minute, phenolyzer will return a
              ranked gene list.
            </div>
           </li>


           <li class="tlypageguide_top" data-tourtarget="#genes-card #phenolyzer-results">
            <div>
              When the Phenolyzer run has finished, the ranked gene list will appear.
              By default, the top 10 genes are selected.
              <br><br>
              By checking a gene, it will appear as a
              gene button in the main navigation area.
            </div>
           </li>


           <li class="tlypageguide_top" data-tourtarget="#gene-badge-button:eq(0)">
            <div>
              For each of the selected genes, a gene button will appear.
              <br><br>
              Notice that a checkmark will appear when analysis is done for a gene.
            </div>
            </li>

            <li class="tlypageguide_top" data-tourtarget="#analyze-all-genes">
              <div>
                To analyze the variants across all of the genes, click the 'Analyze all' link.  The
                app will analyze each gene, one at a time, in the background.  When analysis is complete for
                a gene, the green checkmark along with any gene badges will appear.
              </div>
            </li>

        </ul>

    </div>
</template>

<script>



export default {
  name: 'app-tour',
  components: {
  },
  props: {
    selectedGene: null,
    selectedVariant: null
  },
  data () {
    let self = this;
    return {
      pageGuide: null,
      pageGuideBookmarks: null,
      pageGuidePhenolyzer: null,
      pageGuideEduTour1: null,
      pageGuideEduTour2: null,
      edgeObject: null,

      tour1Check: true,


      mainTourSteps: {
        '#enter-gene-name': {},
        '#gene-track': {},
        '#add-data-button': {},
        '#vcf-track': {
          position: {top: '100px', bottom: 'initial'}
        },
        '#bam-depth': {
          position: {top: '100px', bottom: 'initial'}
        },
        '#matrix-track': {},
        '#transcript-btn-group': {},
        '#set-gene-source': {},
        '#gene-viz': {},
        '#gene-region-buffer-input': {},
        '#call-variants-link': {},
        '#button-call-variants': {},
        '#proband-variant-card #fb-variants': {
          position: {top: '100px', bottom: 'initial'}
        },
        '#show-filters-link': {},
        '#filter-track svg#MODERATE': {},
        '#proband-variant-card #displayed-variant-count': {
          position: {top: '100px', bottom: 'initial'}
        },
        '#proband-variant-card #vcf-track #vcf-variants svg g.group g.snp': {
          position: {top: '100px', bottom: 'initial'}
        },
        '#vcf-variants .tooltip': {
          position: {top: '100px', bottom: 'initial'}
        },
        "#vcf-variants .tooltip #bookmarkLink": {
          position: {top: '100px', bottom: 'initial'}
        },
        '#show-bookmarks-link': {},
        '#bookmark-card #bookmark-panel': {},
        '#bookmark-card .favorite-indicator': {},
        '#show-select-genes-link': {},
        '#help-link': {}
      },

      bookmarkTourSteps: {
        '#proband-variant-card #vcf-track': {
          position: {top: '100px', bottom: 'initial'}
        }
      },


      eduTour1Steps: {
        '#edu-tour-label':
          {index: 0, first: true, noElement: true, disableTourButtons: false,
          audio: '#tour1-recording1',
          height: 'full',
          animation: {
            name: 'use-case01-scene01-v2',
            clazz: 'EDGE-462912531',
              width: "1200px",
              height: "468px",
            container: "animation-container-1",
            showFunction: this.showAnimation,
            delay: 0}
          },
        '#app-tour-genes-menu': {index: 1, height: '20px', disableNext: false, correct: false, disableTourButtons: false},
        '#gene-badge-container #gene-badge-button':                              {index: 2, disableTourButtons: false,
          audio: '#tour1-recording2'
        },
        '#variant-card.proband #gene-viz':         {index: 3, audio: '#tour1-recording3', height: '0px', disableTourButtons: false},
        '#gene-badge-container':                            {index: 4, disableNext: false, correct: false, disableTourButtons: false},
        '#edu-tour-1 #start-over':                          {index: 5, audio: '#tour1-recording4', noElement: true, disableTourButtons: false},
        '#children-buttons':                                {index: 6, disableNext: false, height: '100px', correct: false, disableTourButtons: false},
        '.edu-tour-1-child-buttons':                        {index: 7, close: true, noElement: true, disableTourButtons: false,
          audio: '#tour1-recording5',
          height: 'full',
          animation: {
            name: 'use-case01-scene07-v1',
            clazz: 'EDGE-462912531',
              width: "1200px",
              height: "468px",
            container: "animation-container-1",
            showFunction: this.showAnimation,
            delay: 0}
          }
      },

      eduTour2Steps: {
        '#edu-tour-2-label': { index: 0, first: true, noElement: true, audio: '#tour2-recording1', disableTourButtons: true,
            height: 'full',
          animation: {
            name: 'use-case02-scene01-v1',
            clazz: 'EDGE-462912531',
            width: "1200px",
              height: "468px",
            container: "animation-container-1",
            showFunction: this.showAnimation,
            delay: 0
          }
        },
        '#edu-tour-2 #start-over':       {index: 1, noElement: true, audio: '#tour2-recording2', disableTourButtons: false,
            height: 'full',
          animation: {
                name: 'use-case02-scene02-v1',
                clazz: 'EDGE-462912531',
                width: "1200px",
                  height: "468px",
                container: "animation-container-1",
                showFunction: this.showAnimation,
                delay: 0
              }
          },
        '#variant-card.proband #loaded-variant-viz':    {index: 2, noElement: true, disableTourButtons: false},
        '#child-buttons-tour2':          {index: 3, disableNext: true, height: '120px', correct: false, disableTourButtons: false},
        '#edu-tour-2':                   {index: 4, noElement: true, audio: '#tour2-recording3', close: true, disableTourButtons: false}
      }
    }
  },
  mounted: function() {
    this.init();
  },
  methods: {
    init: function() {
      let me = this;
      if (!isLevelEdu) {
          // Initialize app tour
        me.pageGuide = tl.pg.init({
          'auto_refresh': true,
          'show_numbers': false,
          'close_button_text': 'X',
          'default_zindex': 1031,
          'custom_open_button': '#show-main-tour',
          'steps_element': '#tourMain',
          'track_events_cb': function(interactionName) {

          },
          'handle_doc_switch': function(currentTour, prevTour) {

            var step = me.mainTourSteps[currentTour];
            if (step) {
              me.customizeStep(me.pageGuide, step);
            } else {
              $('#tlyPageGuideMessages').css("top", "initial");
              $('#tlyPageGuideMessages').css("bottom", "0px");
            }

          }
        });
         // Initialize bookmarks tour
        me.pageGuideBookmarks = tl.pg.init({
          'auto_refresh': true,
          'show_numbers': false,
          'close_button_text': 'X',
          'custom_open_button': '#show-bookmarks-tour',
          'steps_element': '#tourBookmarks',
          'track_events_cb': function(interactionName) {

          },
          'handle_doc_switch': function(currentTour, prevTour) {
            var step = me.bookmarkTourSteps[currentTour];
            if (step) {
              me.customizeStep(me.pageGuideBookmarks, step);
            } else {
              $('#tlyPageGuideMessages').css("top", "initial");
              $('#tlyPageGuideMessages').css("bottom", "0px");
            }
          }
        });

            // Initialize phenolyzer tour
        me.pageGuidePhenolyzer = tl.pg.init({
          'auto_refresh': true,
          'show_numbers': false,
          'close_button_text': 'X',
          'custom_open_button': '#show-phenolyzer-tour',
          'steps_element': '#tourPhenolyzer',
          'track_events_cb': function(interactionName) {

          },
          'handle_doc_switch': function(currentTour, prevTour) {
          }
        });

      }


      // Initialize colon cancer tour
      if (isLevelEdu) {

        me.pageGuideEduTour1 = tl.pg.init({
          'auto_refresh': true,
          'show_numbers': false,
          'close_button_text': 'close',
          'custom_open_button': '#show-main-tour',
          'steps_element': '#tourEduCase1',
          'track_events_cb': function(interactionName) {

            if (interactionName == "PG.close") {
              me.completeTour();
            }

            for (let key in me.eduTour1Steps) {
              var step = me.eduTour1Steps[key];
              if (step.audio) {
                $(step.audio)[0].pause();
                $(step.audio)[0].currentTime = 0;
              }
            }

          },
          'handle_doc_switch': function(currentTour, prevTour) {


            if (currentTour == '.edu-tour-1-child-buttons') {
              $('#button-load-father-data').addClass("emphasize");
              $('.edu-tour-1-child-buttons .edu-tour-button:eq(0)').addClass("emphasize");
              $('.edu-tour-1-child-buttons .edu-tour-button:eq(1)').addClass("healthy");
              $('.edu-tour-1-child-buttons .edu-tour-button:eq(2)').addClass("emphasize");
            } else {
              $('.edu-tour-1-child-buttons .edu-tour-button').removeClass("emphasize");
              $('.edu-tour-1-child-buttons .edu-tour-button').removeClass("healthy");
              $('#button-load-father-data').removeClass("emphasize");
            }

            var step = me.eduTour1Steps[currentTour];
            if (step) {
              me.customizeTourStep(me.pageGuideEduTour1, step);
            } else {
              console.log("step " + currentTour + " not found.");
            }


          }
        });


        me.pageGuideEduTour2 = tl.pg.init({
          'auto_refresh': true,
          'custom_open_button': '#show-case2-tour',
          'show_numbers': false,
          'close_button_text': 'close',
          'steps_element': '#tourEduCase2',
          'track_events_cb': function(interactionName) {
            if (interactionName == "PG.close") {
              me.completeTour();
            }
            for (let key in me.eduTour2Steps) {
              var step = me.eduTour2Steps[key];
              if (step.audio) {
                $(step.audio)[0].pause();
                $(step.audio)[0].currentTime = 0;
              }
            }
          },
          'handle_doc_switch': function(currentTour, prevTour) {

            var step = me.eduTour2Steps[currentTour];
            me.customizeTourStep(me.pageGuideEduTour2, step);

            //if (currentTour == "#variant-card.proband #loaded-variant-viz") {
              me.$emit('circle-variant', 2);
            //}

          }
        });



        if (eduTourNumber == "1") {
          me.pageGuideEduTour1.open();
        } else if (eduTourNumber == "2") {
          me.pageGuideEduTour2.open();
        }
      }

    },


    startTour: function(tour) {
      var me = this;

      if (me.pageGuide == null || me.pageGuideEduTour1 == null || me.pageGuideEduTour2 == null) {
        me.init();
      }

      if (tour == 'main') {
        me.pageGuide.open();
      } else if (tour == '1') {
        me.pageGuideEduTour1.open();
      } else if (tour == '2') {
        me.pageGuideEduTour2.open();
      }
    },

    customizeStep: function(pageGuide, step) {
      let me = this;
      if (step.position) {
        $('#tlyPageGuideMessages').css("top", step.position.top);
        $('#tlyPageGuideMessages').css("bottom", step.position.bottom);
      } else {
        $('#tlyPageGuideMessages').css("top", "initial");
        $('#tlyPageGuideMessages').css("bottom", "0px");
      }
    },


    customizeTourStep: function(pageGuide, step) {
      let me = this;
      if (step.hasOwnProperty('noElement') && step.noElement == true) {
        $('.tlypageguide_shadow')[step.index].style.visibility = 'hidden';
      } else {
        $('.tlypageguide_shadow')[step.index].style.visibility = 'visible';
      }

      if (step.disableNext == true && step.correct == false) {
        $('.pageguide-next').addClass("disabled");
      } else {
        $('.pageguide-next').removeClass("disabled");
      }
      if (step.disableTourButtons) {
        $('.edu-tour-data-button').addClass("disabled");
      } else {
        $('.edu-tour-data-button').removeClass("disabled");
      }
      if (step.position) {
        $('#tlyPageGuideMessages').css("top", step.position.top);
        $('#tlyPageGuideMessages').css("bottom", step.position.bottom);
      } else {
        $('#tlyPageGuideMessages').css("top", "initial");
        $('#tlyPageGuideMessages').css("bottom", "0px");
      }
      if (step.height) {
        if (step.height == 'full') {
          var stepHeight = window.innerHeight - 10;
          $('#tlyPageGuideMessages .tlypageguide_text').css("min-height", stepHeight);
        } else {
          $('#tlyPageGuideMessages .tlypageguide_text').css("min-height", step.height);
        }
      } else {
        $('#tlyPageGuideMessages .tlypageguide_text').css("min-height", "10px");
      }
      if (step.animation) {
        setTimeout( function() {
          step.animation.showFunction(true, step)},
          step.animation.delay);
      } else {
        this.showAnimation(false);
      }
      if (step.audio) {
        var audioSelector = step.audio;
        $(audioSelector)[0].play();
        // When audio finished, automatically move to next step
        $(audioSelector).on("ended", function() {
          if (!step.close && step.index == pageGuide.cur_idx) {
            pageGuide.navigateForward();
          } else if (step.close) {
            setTimeout(function() {
              me.completeTour();
            },2000);
          }
        });
      } else {
        $('#page-guide-listen-button').addClass('hide');
      }
      if (step.first) {
        $('#pageguide-prev-button').addClass("hide");
      } else {
        $('#pageguide-prev-button').removeClass("hide");
      }
      if (step.close) {
        $('#pageguide-close-button').removeClass("hide");
        $('#pageguide-next-button').addClass("hide");
      } else {
        $('#pageguide-close-button').addClass("hide");
        $('#pageguide-next-button').removeClass("hide");
      }

      if (step.animation  && hideNextButtonAnim) {
        $('#pageguide-next-button').addClass("hide");
      }
    },

    checkPhenolyzer: function() {
      let me = this;
      $('#select-phenotype-edutour').selectize();
      $('#select-phenotype-edutour')[0].selectize.clear();
      $('#select-phenotype-edutour')[0].selectize.on('change', function() {
        var phenotype = $('#select-phenotype-edutour')[0].selectize.getValue().toLowerCase();
        var correct = true;
        if (isLevelEdu && eduTourNumber == 1) {
          if (phenotype != 'colon_cancer') {
            alertify.alert("Please select 'Colon cancer' to continue with this tour.")
            correct = false;
          }
        }
        if (correct) {
          me.eduTour1Steps['#phenolyzer-search-box .selectize-control.single'].correct = true;
          genesCard.getPhenolyzerGenes(phenotype);
          if (eduTourNumber == 1  && me.pageGuideEduTour1.cur_idx == 1) {
            me.pageGuideEduTour1.navigateForward();
          }

        } else {
          me.eduTour1Steps['#phenolyzer-search-box .selectize-control.single'].correct = false;
        }
      });
    },

    checkVariant: function(variant) {
      let me = this;
      if (isLevelEdu && eduTourNumber == "1"
        && me.pageGuideEduTour1.cur_idx == 4
        && variant.vepImpact[HIGH] != "HIGH"
        && variant.start == 112116592
        && me.selectedGene.gene_name == 'APC') {
        me.eduTour1Steps['#gene-badge-container'].correct = true;
        $('.pageguide-next').addClass("disabled");
        me.pageGuideEduTour1.navigateForward();
      } else {
        me.eduTour1Steps['#gene-badge-container'].correct = false;

      }
    },


    showAnimation: function(show, step) {
      let me = this;
      if (show) {


        $('#' + step.animation.container).removeClass("hide");

        if (step.animation.edgeObject && step.animation.edgeObject.getStage()) {
          step.animation.edgeObject.getStage().play(0);
        } else {


          AdobeEdge.loadComposition(
            step.animation.name,
            step.animation.clazz, {
                scaleToFit: "both",
                centerStage: "both",
                minW: "0px",
                maxW: "800px",
                width:  step.animation.width,
                height: step.animation.height,
                htmlRoot: "assets/animations/"
            },
            {"dom":{}},
            {"dom":{}}
          );
          step.animation.edgeObject = AdobeEdge.getComposition(step.animation.clazz);
        }

        return me.edgeObject;


      } else {
        $('.tour-animation-container').addClass("hide");
      }

    },

    completeTour: function() {
      if (isLevelEdu) {
        if (eduTourNumber == "1") {
          this.pageGuideEduTour1.close();
        } else if (eduTourNumber == "2") {
          this.pageGuideEduTour2.close();
        }
        this.showAnimation(false);
        completedEduTourNumber = eduTourNumber;
        eduTourNumber = completedEduTourNumber == "1" ? "2" : "1";
        this.$router.push(
        { name: 'exhibit-case-complete',
          query: {mode: 'edu', tour: eduTourNumber}
        });
      }
    }

  }
}
</script>