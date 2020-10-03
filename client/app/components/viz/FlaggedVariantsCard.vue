<style lang="sass">
@import ../../../assets/sass/variables

#remove-filter-card
  box-shadow: none !important

.info-button
  margin: 0px !important
  padding: 0px !important
  min-width: 18px !important
  height: 18px !important
  margin-top: -6px !important

  .btn__content, .v-btn__content
    padding: 0px
    max-width: 18px
    max-height: 18px

    i.material-icons
      font-size: 18px
      color: $link-color
      opacity: .6

.close-button
  margin: 0px !important
  padding: 0px !important
  min-width: 25px !important
  height: 25px !important
  margin-bottom: 15px !important

  .btn__content, .v-btn__content
    padding: 0px
    max-width: 25px
    max-height: 25px

    i.material-icons
      font-size: 25px
      color: $text-color

.info-title
  font-size: 20px
  color: $app-color
  margin-bottom: 15px

.info-card
  padding: 15px 15px 20px 15px

.info-description
  font-size: 13px

.info-publication
  margin-top: 20px
  font-size: 13px
  a
    font-style: italic
    font-size: 13px
    line-height: 16px

.v-select__selections
  max-height: 100px
  overflow-y: scroll

.in-iframe .v-dialog--persistent
  position: sticky !important
  top: 10px !important
  max-height: 480px !important

#flagged-variants-card
  padding-left: 5px
  padding-bottom: 20px
  background-color: white

  #add-filter-button
    margin: 0px 0px 0px 0px
    padding: 0px
    min-width: 25px
    max-height: 25px
    padding-right: 5px
    padding-left: 5px

    .btn__content, .v-btn__content
      padding-left: 0px
      padding-right: 0px
      color: $link-color
      font-size: 13px
      font-weight: 500

      i.material-icons
        font-size: 20px
        color: $link-color
        vertical-align: top
        padding-right: 3px

  &.v-card
    box-shadow: none !important
    -webkit-box-shadow: none !important

  .gene-ranks
    .chip, .v-chip
      margin-top: 0px
      margin-bottom: 2px
      margin-left: 0px
      margin-right: 0px

    .chip__content, .v-chip__content
      padding: 8px
      height: 18px
      justify-content: center
      font-size:  11px
      background-color:  $high-impact-color
      color:  white

    .pheno-source
      width: 40px
      display: inline-block
      font-size: 12px
      font-style: italic
      vertical-align: top

  #clinvar-symbol
    display: inline-block
    vertical-align: top
    margin-top: 2px


  .variant-toolbar
    padding-right: 20px
    background-color: white
    margin-bottom: 10px
    margin-top: 20px

    #mygene2-basic-title
      word-break: break-word
      display: inline-block
      white-space: normal
      line-height: 18px
      margin-left: 10px
      margin-right: 10px
      color: $text-color
      margin-bottom: 10px



    .toolbar__title, .v-toolbar__title
      font-family: inherit
      font-size: 15px
      min-width: initial
      padding-top: 10px
      display: inline-block
      color:  $text-color
      margin-top: 5px
      margin-left: 0px
      padding-right: 0px

      span
        padding-right: 30px
        margin-left: 8px
        white-space: normal
        font-size: 14px
        line-height: 15px
        display: inline-block
        color: $app-color


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


  .filtered-variants-panel
    margin-top: 10px
    margin-left: 10px

  .user-flagged-variants-panel
    margin-top: 30px
    margin-left: 10px


  #mygene2-basic-none
    display: inline-block
    white-space: normal
    line-height: 18px
    font-style: italic
    margin-left: 20px

  .remove-filter-description
    font-size: 16px

  .expansion-panel, .v-expansion-panel
    -webkit-box-shadow : none
    box-shadow: none
    padding-bottom: 0px

  .expansion-panel__body, .v-expansion-panel-content
    padding-left: 3px
    padding-right: 4px



  li.selected, .list-item.selected
    border-color: $current-color
    border-width: 2px
    border-style: solid
    border-radius: 4px

  .subheader
    color: $text-color
    height: initial
    padding: 0 6px 0 6px

    span
      width: 100%
      text-align: center
      background-color: #f2f1f1

  .expansion-panel__header, .v-expansion-panel__header
    border-top: #e1e1e1
    border-top-style: solid
    border-top-width: 1px
    padding:  6px 10px 6px 2px
    background-color: #f3f3f3

  .v-expansion-panel__header
    min-height: 28px
    padding-left: 10px
    padding-right: 8px

    .header__icon
      i.material-icons
        color: $app-color

  .expansion-panel__container, .v-expansion-panel__container
    border-top: none

    .edit-filter-button, .remove-filter-button
      margin: 0px 0px 0px 0px
      padding: 0px 0px 0px 0px
      min-width: 25px
      max-width: 25px
      margin-left: 40px

      i.material-icons
        font-size: 20px
        color: $app-button-color

    .remove-filter-button
      margin-left: 0px

    .badge, .v-badge
      background-color: transparent

      span.filter-label
        color: $app-button-color
        border-color: none
        font-size: 15px
        font-weight: 500
        display: inline-block
        text-align: left
        width: 175px

    .badge__badge.primary, .v-badge__badge.primary
      background-color: $light-badge-color !important
      font-size: 12px
      color: white
      top: 2px
      width: 20px
      height: 20px

    &.empty

      span.filter-label
       color: $text-color !important
       font-weight: normal

      .badge__badge.primary, .v-badge__badge.primary
        background-color: #d6d6d6 !important

      .edit-filter-button
        i.material-icons
          color: $light-badge-color !important

      .v-expansion-panel__header__icon
        display: none

  .filter-variant-count
    float: right
    padding-right: 8px
    font-size: 12px
    color: $text-color

  .list--three-line, .v-list--three-line
    margin-bottom: 0px
    padding-top: 5px


    .filter-subheader
      margin-left: -20px

    .subheader
      height: initial
      font-size: 13px
      margin-left: 0px
      text-color: $text-color
      margin-top: 5px
      padding: 0 12px 0 5px

    .avatar
      width: 32px !important
      height: 32px !important

    li
      margin-left: 0px

    .list__tile__avatar, .v-list__tile__avatar
      margin-left: 0px

    .list__tile__content, .v-list__tile__content
      margin-left: 0px

    hr
      margin-bottom: 4px
      margin-top: 4px

    .divider--inset
      margin-left: 22px
      width: calc(100% - 42px)

    .list__tile, .v-list__tile
      padding: 0px
      height: initial
      padding-left: 0px
      padding-top: 10px

    .list__tile__avatar, .v-list__tile__avatar
      min-width: initial

    .list__tile__sub-title, .v-list__tile__sub-title
      height: initial
      line-height: 18px

    .list__tile__title, .v-list__tile__title
      height: auto
      line-height: 18px
      padding-top: 5px
      padding-bottom: 5px

    .reviewed-variant-filter
      font-size: 13px
      margin-left: 10px
      display: inline-block
      vertical-align: bottom

    .variant-number
      margin-right: 0px
      margin-left: 0px
      display: inline-block
      vertical-align: top
      margin-bottom: 0px
      background-color: transparent
      width: 18px !important
      height: 18px !important

      .chip__content, .v-chip__content
        width: 18px !important
        height: 18px !important
        justify-content: space-around
        padding: 0px
        font-size: 11px
        background-color: transparent
        color: $text-color
        border: #d5d5d5 solid thin

    #select-interpretation
      width: 22px

    .af-small
      display: inline-block
      width: 50px
      font-size: 12px
      margin-left: 4px
      vertical-align: top
      padding-top: 0px
      line-height: 12px

      &.level-high
        color: $high-impact-color  !important
      &.level-medium
        color: $moderate-impact-color !important

    .revel
      display: inline-block
      vertical-align: top
      font-size: 12px

    .vep-consequence
      display: inline-block
      width: 260px
      line-height: 14px
      vertical-align: top
      font-size: 13px
      white-space: normal

    .variant-label
      font-size: 13px
      color: $text-color !important
      line-height: 14px


      .coord
        display: inline-block
        width: 115px
        line-height: 12px
        vertical-align: top
      .hgvsp
        display: inline-block
        width: 115px
        line-height: 12px
        vertical-align: top



      .rsid
        display: inline-block
        width: 103px
        line-height: 12px
        vertical-align: top

      .af
        display: inline-block
        width: 90px
        vertical-align: top
        line-height: 13px
        padding-bottom: 10px

      .hgvsc
        display: inline-block
        width: 228px
        line-height: 12px
        vertical-align: top


    .variant-symbols
      .variant-moniker
        width: 170px
        display: inline-block

        .gene-name
          display: inline-block
          vertical-align: top
          font-weight: 500
          font-size: 15px
          line-height: 16px
          margin-right: 4px
          padding-top: 2px

        .variant-glyphs
          display: inline-block
          padding-top: 0px

        .has-called-variants
          font-size: 15px
          color: $called-variant-color
          margin-top: 0px
          margin-left: 0px


      .variant-notes
        margin-top: -6px



#flagged-variants-card.basic

  .toolbar__title, .v-toolbar__title
    margin-top: 0px
    padding-top: 0px
    padding-left: 3px

  .expansion-panel, .v-expansion-panel
    -webkit-box-shadow : none
    box-shadow: none
    margin-top: 0px


  .expansion-panel__header, .v-expansion-panel__header
    display: none

  .list--three-line, .v-list--three-line
    li
      margin-left: 0px


.variant-source-indicator
  display: inline-block
  width: 260px
  line-height: 14px
  vertical-align: top
  font-size: 13px
  white-space: normal

.source-indicator-badge
  background-color: #efeeee 
  border-radius: 90px 
  height: 16px
  color: #717171 
  margin-left: 1px 
  text-align: center 
  vertical-align: middle
  width: 16px
  display: inline-block
  font-size: 11px
  font-family: raleway
  padding-top: 2px
</style>

<template>
<div>
  <v-card  style="padding: 0px" id="flagged-variants-card" :class="{basic: isBasicMode}">

    <div class="variant-toolbar" >

      <v-btn v-if="!isSimpleMode && !isBasicMode" id="add-filter-button" @click="onNewFilter" flat>
        <v-icon>add</v-icon>
        New filter
      </v-btn>

      <span  v-show="isBasicMode && !launchedFromClin && variantCount > 0" id="mygene2-basic-title">
        Clinvar Pathogenic/Likely Pathogenic Variants &lt; 1% frequency
      </span>

    </div>

    <div v-if="!isSimpleMode" style="display:flex;justify-content:center;margin-top:15px;margin-bottom:15px">
      <v-badge v-if="variantSetCounts.total && variantSetCounts.total > 0" class="info">
       {{ variantSetCounts.total }} variants imported from genome-wide filters</v-badge>
    </div>


    <span id="mygene2-basic-none" v-show="isBasicMode && variantCount == 0">
      (none)
    </span>





  <v-expansion-panel expand v-model="expansionControl" >
    <v-expansion-panel-content v-for="geneList in geneLists"  :key="geneList.label"
      v-if="geneList.show" :class="{'empty': geneList.variantCount == 0}">
      <template v-slot:header>
        <div  v-show="!isBasicMode" >

          <span  class="filter-subheader">
            <filter-icon v-if="false" :icon="geneList.name"></filter-icon>


            <v-badge>
              <span  class="filter-badge-count" slot="badge">{{ geneList.variantCount }}</span>
              <span class="filter-label">{{ geneList.label }}</span>
            </v-badge>

            <v-btn v-if="!isSimpleMode && geneList.label != 'Reviewed' && geneList.label !== 'Filtered variants'" flat @click="onEditFilter(geneList)" class="edit-filter-button">
              <v-icon>create</v-icon>
            </v-btn>

            <v-dialog width="500" v-model="showPopup" lazy>
              <v-btn v-if="!isSimpleMode &&  geneList.filter.custom" @click="setGenesList(geneList)" slot="activator" flat
                     class="remove-filter-button">
                <v-icon>delete</v-icon>
              </v-btn>
              <v-card class="info-card full-width" id="remove-filter-card">
                <v-card-title style="justify-content:space-between">
                  <span class="info-title">{{ "Remove filter"}}</span>
                  <v-btn @click="onClose" flat class="close-button">
                    <v-icon>close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text class="remove-filter-description" v-html="' Are you sure you want to remove this filter?'">
                </v-card-text>
                <v-btn @click="onClose" color="normal">Cancel</v-btn>
                <v-btn @click="onRemoveFilter" color="error">Remove filter</v-btn>
              </v-card>
            </v-dialog>
          </span>
        </div>
      </template>
      <v-list three-line>
        <template
         v-for="flaggedGene in geneList.genes">

          <template v-for="variant in flaggedGene.variants">

            <v-list-tile
            :key="variant.start + ' ' + variant.ref + ' ' + variant.alt"
            ripple
            :class="{'list-item': true, selected: clickedVariant == variant ? true : false}"
            @click="onVariantSelected(variant)">

              <v-list-tile-avatar >
               <v-chip class="variant-number" >
                {{ variant.ordinalFilter  }}
               </v-chip>
              </v-list-tile-avatar>

              <v-list-tile-content>

                <v-list-tile-title>
                  <variant-interpretation-badge
                   v-if="geneList.label == 'Reviewed'"
                   :interpretation="variant.interpretation"
                   :interpretationMap="interpretationMap">
                  </variant-interpretation-badge>

                  <div>
                    <div  class="gene-ranks" v-if="!isBasicMode && !variant.notFound && launchedFromClin">
                      <span v-show="geneRankGTR(flaggedGene.gene.gene_name) != ''">
                        <v-chip class="white--text mr-2"
                          v-tooltip.top-center="`Cumulative rank for all selected conditions`">
                            {{ geneRankGTR(flaggedGene.gene.gene_name) }}  GTR
                        </v-chip>
                      </span>
                      <span v-show="geneRankPhenolyzer(flaggedGene.gene.gene_name) != ''">
                        <v-chip class="white--text mr-2"
                          v-tooltip.top-center="`Cumulative rank for all selected phenotypes`">
                            {{ geneRankPhenolyzer(flaggedGene.gene.gene_name) }}  Phen.
                        </v-chip>
                      </span>
                      <span v-show="geneRankHPO(flaggedGene.gene.gene_name) != ''">
                        <v-chip class="white--text mr-2" >
                          HPO
                        </v-chip>
                      </span>
                    </div>
                    <div class="variant-symbols">

                      <span class="variant-moniker">
                        <span class="gene-name"> {{ flaggedGene.gene.gene_name }}</span>

                        <span class="variant-glyphs">
                          <app-icon
                           icon="clinvar"
                           v-if="clinvar(variant) == 'clinvar_path' || clinvar(variant) == 'clinvar_lpath'"
                           :level="clinvar(variant) == 'clinvar_path' ? 'high' : 'likely-high'"
                           class="clinvar-badge" height="13" width="13">
                          </app-icon>

                          <app-icon
                          style="width: 15px;height: 15px;display: inline-block;margin-top: 2px;"
                           :icon="variant.inheritance"
                           v-if="!isBasicMode && variant.inheritance && variant.inhertance != '' && variant.inheritance.indexOf('n/a') == -1"
                           class="inheritance-badge" height="15" width="15">
                          </app-icon>

                          <app-icon
                           icon="impact"
                           v-if="false && variant.type"
                           :type="variant.type.toLowerCase()"
                           :clazz="highestImpactClass(variant)"
                           class="impact-badge" height="15" width="11">
                          </app-icon>

                          <app-icon
                           icon="zygosity" v-if="!isBasicMode && zygosity(variant).toLowerCase() == 'hom'"
                           :type="zygosity(variant).toLowerCase()"
                           :isSimpleMode="isSimpleMode"
                           height="14" :width="isSimpleMode ? 70 : 24">
                          </app-icon>
                        </span>

                        <v-icon v-if="variant.fbCalled == 'Y'" class="has-called-variants">
                          check_circle
                        </v-icon>
                      </span>

                    </div>
                    <div style="line-height:12px">
                      <div v-if="launchedFromClin && flaggedGene.gene.gene_name">
                        <div>
                          <span id="source-indicator-text" class="chart-label">Source: </span>
                          <span v-for="(source, idx) in getSourceIndicatorBadge(flaggedGene.gene.gene_name)" :key="idx">
                            <span
                              v-tooltip.top-center="`${selectedGeneSources.source[idx]}`"
                              class="ml-1 mr-1">
                              <div left color="grey lighten-1" class="source-indicator-badge">
                                <span> {{ source }}</span>
                              </div>
                            </span>
                          </span>
                        </div>
                      </div>
                      <div  v-if="!isBasicMode && !variant.notFound"
                      style="display:inline-block">
                        <span class="vep-consequence">
                          <span v-if="highestImpactRecs(variant).length == 0">
                            {{ capitalize(vepConsequence(variant)) }}
                          </span>

                          <span
                           v-for="(impactRec, idx) in highestImpactRecs(variant)" :key="impactRec.impact">
                            <span v-for="(effectRec, idx1) in impactRec.effects" :key="effectRec.key">
                              {{ capitalize(getNonCanonicalEffectDisplay(idx1, effectRec)) }}
                            </span>

                          </span>

                        </span>
                        <span v-if="false" :class="getAfClass(variant)">{{ afDisplay(variant) }}</span>
                      </div>
                    </div>
                    <div  v-if="!isBasicMode && !variant.notFound && launchedFromClin">
                      <span class="revel">{{ capitalize(revel(variant)) }}</span>
                    </div>
                  </div>


                  <div>

                    <span v-if="variant.notFound && isFullAnalysis"
                      class="coord"> {{ coord(flaggedGene, variant) }} </span>
                  </div>
                </v-list-tile-title>

                <v-list-tile-sub-title v-if="isBasicMode" >
                  <div class="variant-label">
                    <div v-if="isBasicMode" style="display:inline-block;" >
                      <span class="coord"> {{ coord(flaggedGene, variant) }} </span>
                    </div>
                    <div style="display:inline-block;vertical-align:top">
                      <span class="vep-consequence">{{ vepConsequence(variant) }}</span>
                    </div>
                    <span v-if="isBasicMode" class="af">{{ afDisplay(variant) }}</span>
                  </div>
                  <div class="variant-label" v-if="isBasicMode">
                    <div style="display:inline-block;" >
                      <span class="hgvsc">  {{ hgvsC(variant) }} </span>
                    </div>
                  </div>
                  <div class="variant-label" >
                    <div style="display:inline-block;" v-if="isBasicMode" >
                      <span class="hgvsp">  {{ hgvsP(variant) }} </span>
                    </div>
                  </div>
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </template>
      </v-list>
    </v-expansion-panel-content>
  </v-expansion-panel>
  

  </v-card>

  <v-dialog v-model="showEditFilter" persistent :scrollable="launchedFromClin" max-width="650">
      <v-card v-if="currentFilter" class="full-width" style="padding:10px">
        <v-card-title style="margin-left:20px" class="headline">
          {{editAddText}}
          {{ currentFilter.title }}  Filter
          <v-spacer></v-spacer>
          <v-btn text icon @click="onCancelFilter"><v-icon>close</v-icon></v-btn>
        </v-card-title>
        <filter-settings
          ref="currentFilterSettingRef"
          v-if="currentFilter && currentFilter.name != 'coverage'"
          :filterModel="cohortModel.filterModel"
          :filter="currentFilter"
          @apply-filter="onApplyFilter"
          @cancel-filter="onCancelFilter"
          :launchedFromClin="launchedFromClin">
        </filter-settings>
      </v-card>
  </v-dialog>
</div>
</template>


<script>


import AppIcon                    from '../partials/AppIcon.vue'
import FilterIcon                 from '../partials/FilterIcon.vue'
import VariantInterpretationBadge from '../partials/VariantInterpretationBadge.vue'
import FilterSettings             from '../partials/FilterSettings.vue'
import FilterSettingsCoverage     from '../partials/FilterSettingsCoverage.vue'

export default {
  name: 'flagged-variants-card',
  components: {
    AppIcon,
    FilterIcon,
    VariantInterpretationBadge,
    FilterSettings,
    FilterSettingsCoverage
  },
  props: {
    isEduMode: null,
    isBasicMode: null,
    isSimpleMode: null,
    forMyGene2: null,
    activeFilterName: null,
    cohortModel: null,
    launchedFromClin: null,
    isFullAnalysis: null,
    geneNames: null,
    genesInProgress: null,
    interpretationMap: null,
    toClickVariant: null,
    variantSetCounts: null
  },

  data() {
    return {
      readyToDownload: false,
      geneLists: null,
      clickedVariant: null,
      variantCount: 0,
      interpretationFilters: null,
      showEditFilter: false,
      currentFilter: null,
      expansionControl: null,
      editAddText: 'Edit',
      showPopup: false,
      selectedGeneList: null,
      variantExpansionControl: [true],
      selectedGeneSources: {},
    }
  },
  methods: {

    onClose(){
      this.showPopup = false;
    },

    setGenesList(genesList){
      this.selectedGenesList = genesList;

      setTimeout(function(){
        let overlaySelection = d3.selectAll(".v-overlay--active");
        let dialogSelection = d3.selectAll(".v-dialog__content--active");

        for(let i = 0; i < overlaySelection[0].length-1; i++){
          d3.select(".v-overlay--active").remove();
        }
        for(let j = 0; j < dialogSelection[0].length-1; j++){
          d3.select(".v-dialog__content--active").remove();
        }
      }, 100)
    },

    onApplyInterpretationFilter: function(interpretation) {
      this.interpretationFilters = interpretation
      this.populateGeneLists();
    },
    onVariantSelected: function(variant) {
      this.clickedVariant = variant;
      this.$emit("flagged-variant-selected", variant);
    },
    deselectVariant: function() {
      this.clickedVariant = null;
    },
    populateGeneLists: function(variant) {
      let self = this;
      self.geneLists = [];
      self.variantCount = 0;

      if( variant && variant.interpretation && variant.interpretation !== "not-reviewed"){
        if(variant.filtersPassedAll){
          if(!variant.filtersPassedAll.includes("reviewed")){
            variant.filtersPassedAll.push("reviewed");
          }
        }
        else{
          variant.filtersPassedAll = ["reviewed"];
        }
        variant.isUserFlagged = true;
      }

      var filters = self.cohortModel.organizeVariantsByFilterAndGene(self.activeFilterName, self.isFullAnalysis, self.interpretationFilters, variant);
      self.geneLists = filters.map(function(filterObject, idx) {
        self.variantCount += filterObject.variantCount;
        filterObject.filter.key = filterObject.key;
        return {
          name:  filterObject.key,
          label: filterObject.filter.title,
          filter: filterObject.filter,
          show:  (filterObject.filter.active
                  && filterObject.filter.title != 'Reviewed'
                  && filterObject.filter.title != 'Not found'
                  && filterObject.filter.title != 'Not categorized'
                  && filterObject.filter.title != 'Flagged by user')
                 || filterObject.genes.length > 0,
          genes: filterObject.genes,
          variantCount: filterObject.variantCount,
          expand: true
        }
      })

      self.flattenGenesList();

      self.$emit("count-changed", self.variantCount);
      self.$emit("gene-lists-changed", self.geneLists);

      self.expansionControl =  self.geneLists.map(function(geneList) {
        return geneList.expand;
      })
    },
    onApplyVariantNotes: function(variant) {
      this.$emit("apply-variant-notes", variant);
    },
    onApplyVariantInterpretation: function(variant) {
      this.$emit("apply-variant-interpretation", variant);
    },


    flattenGenesList(){
      let self = this;
      let geneLists = [];
      let reviewed = Object.assign({}, self.geneLists[0]);

      if(reviewed.name === "reviewed") {
        let genes = reviewed.genes;
        let flattenedGenes = [];

        for (let i = 0; i < genes.length; i++) {

          let geneCopy = Object.assign({}, genes[i]);

          for(let i = 0; i < geneCopy.variants.length; i++){
            let copiedGene = Object.assign({},geneCopy);
            copiedGene.variants = [];
            copiedGene.variants.push(geneCopy.variants[i]);
            flattenedGenes.push(copiedGene);
          }
        }
        flattenedGenes = this.sortFlattenedGenes(flattenedGenes);
        this.geneLists[0].genes = flattenedGenes;
      }

    },

    sortFlattenedGenes: function(flattenedGenes){
      let sig = [];
      let unsig = [];
      let unknownSig = [];
      let poorQual = [];
      let sortedGenes = [];

      let ordinalFilter = 1;

      for(let i = 0; i < flattenedGenes.length; i++){
        let variant = Object.assign({}, flattenedGenes[i].variants[0]);
        if(variant.interpretation === "sig"){
          sig.push(flattenedGenes[i]);
        }
        else if(variant.interpretation === "unknown-sig"){
          unknownSig.push(flattenedGenes[i]);
        }
        else if(variant.interpretation === "not-sig"){
          unsig.push(flattenedGenes[i]);
        }
        else if(variant.interpretation === "poor-qual"){
          poorQual.push(flattenedGenes[i]);
        }
      }
      for(let i = 0; i < sig.length; i++){
        sig[i].variants[0].ordinalFilter = ordinalFilter;
        sortedGenes.push(sig[i]);
        ordinalFilter++;
      }
      for(let i = 0; i < unknownSig.length; i++){
        unknownSig[i].variants[0].ordinalFilter = ordinalFilter;
        sortedGenes.push(unknownSig[i]);
        ordinalFilter++;
      }
      for(let i = 0; i < unsig.length; i++){
        unsig[i].variants[0].ordinalFilter = ordinalFilter;
        sortedGenes.push(unsig[i]);
        ordinalFilter++;
      }
      for(let i = 0; i < poorQual.length; i++){
        poorQual[i].variants[0].ordinalFilter = ordinalFilter;
        sortedGenes.push(poorQual[i]);
        ordinalFilter++;
      }
      return sortedGenes;
    },

    onEditFilter: function(geneList, text) {
      let self = this;
      if(text === "Add"){
        this.editAddText = 'Add ';
      }
      else{
        this.editAddText = "Edit "
      }
      self.showEditFilter = true;
      self.currentFilter = geneList.filter;
      setTimeout(function() {
        if (self.$refs.currentFilterSettingRef) {
          self.$refs.currentFilterSettingRef.init();
        }
      }, 20);
    },
    onApplyFilter: function() {
      let self = this;
      self.showEditFilter = false;
      self.currentFilter = null;
      self.$emit("filter-settings-applied");
    },
    onCancelFilter: function() {
      let self = this;
      self.showEditFilter = false;
      self.currentFilter = null;
    },
    onRemoveFilter: function() {
      let self = this;

      delete self.cohortModel.filterModel.flagCriteria[self.selectedGenesList.filter.key]

      self.$emit("filter-settings-applied");
      self.showEditFilter = false;
      self.currentFilter = null;

    },
    onNewFilter: function() {
      let self = this;

      self.geneLists = self.geneLists.filter(function(geneList){
        return geneList.filter.key !== "undefined"
      });

      let nonCustomCount = self.geneLists.filter(function(geneList) {
        return !geneList.filter.custom;
      }).length;


      let newFilter = {
          name: 'Custom-Filter-' + (self.geneLists.length - nonCustomCount),
          display: 'custom',
          active: true,
          custom: true,
          showTooltip: false,
          tooltip: '',
          showEdit: true,
          tooltip: '',
      };
      let newGeneList =  {
          name:  newFilter.name,
          label: newFilter.name,
          filter: newFilter,
          show: true,
          genes: [],
          variantCount: 0,
          expand: true
      }

      let flagCriteria = {};
      flagCriteria.custom = true;
      flagCriteria.active = false;
      flagCriteria.name = newFilter.name;
      flagCriteria.maxAf = null;
      flagCriteria.minRevel = null;
      flagCriteria.clinvar = null;
      flagCriteria.impact = null;
      flagCriteria.consequence = null;
      flagCriteria.inheritance = null;
      flagCriteria.zygosity = null;
      flagCriteria.genotypeDepth = null;
      flagCriteria.exclusiveOf = ['reviewed', 'pathogenic', 'autosomalDominant', 'recessive', 'denovo', 'compoundHet', 'xlinked', 'high'];
      self.cohortModel.filterModel.flagCriteria[newFilter.name] = flagCriteria;

      self.geneLists.push(newGeneList);
      self.onEditFilter(newGeneList, "Add");
      self.$emit("filter-settings-applied")
    },

    coord: function(flaggedGene, variant) {
      return this.globalApp.utility.stripRefName(flaggedGene.gene.chr) + ":" + variant.start + " " + variant.ref + ">" + variant.alt;
    },

    clinvar: function(variant) {
      if (variant.isProxy) {
        if (variant.clinvarClinSig == "pathogenic") {
          return "clinvar_path";
        } else if (variant.clinvarClinSig == "likely pathogenic") {
          return "clinvar_lpath";
        } else {
          return "";
        }
      } else {
        return variant.clinvar ? variant.clinvar : "";
      }
    },
    rsId: function(variant) {
      if (variant.isProxy) {
        return variant.rsId;
      } else {
        return this.globalApp.utility.getRsId(variant);
      }
    },
    revel: function(variant) {
      if (variant.isProxy) {
        return variant.REVEL && variant.REVEL.length > 0 ?  "REVEL " + variant.REVEL : "";
      } else {
        if (variant.vepREVEL && Object.keys(variant.vepREVEL).join(",").length > 0) {
          return "REVEL " + Object.keys(variant.vepREVEL).join(",");
        } else {
          return "";
        }
      }
    },
    hgvsP: function(variant) {
      if (variant.isProxy) {
        return this.globalApp.utility.formatHgvsP(variant, variant.HGVSp);
      } else {
        return variant.extraAnnot ? this.globalApp.utility.formatHgvsP(variant, variant.vepHGVSp) : "";
      }
    },
    hgvsC: function(variant) {
      if (variant.isProxy) {
        return this.globalApp.utility.formatHgvsC(variant, variant.HGVSc, false);
      } else {
        return variant.extraAnnot ? this.globalApp.utility.formatHgvsC(variant, variant.vepHGVSc, false) : "";
      }
    },
    vepConsequence: function(variant) {
      if (variant.isProxy) {
        return variant.consequence;
      } else {
        return variant.vepConsequence ? Object.keys(variant.vepConsequence).join(" ").split("_").join(" ") : "";
      }
    },
    highestImpactClass: function(variant) {
      let clazz = "filter-symbol";
      if (variant.isProxy) {
        clazz += " impact_" + (variant.impact && variant.impact.length > 0 ? variant.impact.toUpperCase() : 'none');
      } else {
        if (variant.highestImpactVep) {
          for (var impact in variant.highestImpactVep) {
            if (clazz.length > 0) {
              clazz += " ";
            }
            clazz += "impact_" + impact.toUpperCase();
          }
        }
      }
      return clazz;
    },
    highestImpactRecs: function(variant) {
      let self = this;
      let info = {};
      this.globalApp.utility.formatHighestImpactInfo(variant, info, self.cohortModel.translator);
      return info.vepHighestImpactRecs;
    },
    getNonCanonicalImpactDisplay: function(idx, impactRec) {
      let buf = "";
      if (idx > 0) {
        buf += " | ";
      }
      buf += impactRec.impact.toLowerCase() + ' impact - ';
      return buf;
    },
    getNonCanonicalEffectDisplay: function(idx, effectRec) {
      let buf = "";
      if (idx > 0) {
        buf += " ,";
      }
      buf += effectRec.display + " in non-canonical transcripts ";
      return buf;
    },
    afDisplay: function(variant) {
      var label = this.isBasicMode ? "freq " : "af ";
      if (variant.isProxy) {
        return  label +  this.globalApp.utility.percentage(variant.afgnomAD ? variant.afgnomAD : 0);
      } else {
        return  label +  this.globalApp.utility.percentage(variant.afHighest ? variant.afHighest : 0);
      }
    },
    zygosity: function(variant) {
      if (variant.isProxy) {
        return variant.zygosityProband ? variant.zygosityProband.toUpperCase() : (variant.zygosity ? variant.zygosity.toUpperCase() : "");
      } else {
        return variant.zygosity ? variant.zygosity.toUpperCase() : "";
      }
    },
    getAfClass: function(variant) {
      let af = null;
      if (variant.isProxy) {
        af = variant.afgnomAD ? variant.afgnomAD : 0;
      } else {
        af = variant.afHighest ? variant.afHighest : 0;
      }

      if (af <= .01) {
        return 'af-small level-high';
      } else if (af <= .05) {
        return 'af-small level-medium';
      } else {
        return '';
      }
    },
    geneRankGTR: function(geneName) {
      let rankInfo = this.cohortModel.geneModel.getGeneRank(geneName);
      let buf = "";
      if (rankInfo) {
        if (rankInfo.gtrRank) {
          buf += "#" + rankInfo.gtrRank;
        }
      }
      return buf;
    },
    geneRankPhenolyzer: function(geneName) {
      let rankInfo = this.cohortModel.geneModel.getGeneRank(geneName);
      let buf = "";
      if (rankInfo) {
        if (rankInfo.phenolyzerRank) {
          buf += "#" + rankInfo.phenolyzerRank;
        }
      }
      return buf;
    },
    geneRankHPO: function(geneName) {
      let rankInfo = this.cohortModel.geneModel.getGeneRank(geneName);
      let buf = "";
      if (rankInfo) {
        if (rankInfo.hpoRank) {
          buf += "#" + rankInfo.hpoRank;
        }
      }
      return buf;
    },
    getVariantSource: function(geneName) {
      if(this.launchedFromClin) {
        let label = "";
        let source = this.cohortModel.geneModel.getSourceForGenes()[geneName].sourceIndicator.join(", ")
        label += source
        return label;
      }
    },
    
    getSourceIndicatorBadge: function(gene_name) {
      if(this.launchedFromClin){
        this.selectedGeneSources.source = this.cohortModel.geneModel.getSourceForGenes()[gene_name].source;
        this.selectedGeneSources.sourceIndicator = this.cohortModel.geneModel.getSourceForGenes()[gene_name].sourceIndicator;
        return this.cohortModel.geneModel.getSourceForGenes()[gene_name].sourceIndicator;
      }
    },

    capitalize: function(buf) {
      if (buf) {
        return this.globalApp.utility.capitalizeFirstLetter(buf);
      } else {
        return "";
      }
    },

  },
  mounted: function() {
    this.populateGeneLists();
  },
  computed: {



  },
  watch: {
    geneNames: function(newGeneNames, oldGeneNames) {
      this.populateGeneLists();
    },
    isFullAnalysis: function() {
      this.populateGeneLists();
    },
    toClickVariant: function() {
      this.populateGeneLists();
      this.clickedVariant = this.toClickVariant;
    }
  }
}

</script>
