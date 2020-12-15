
<style lang="sass">

@import ../../../assets/sass/variables

textarea#copy-paste-genes
  font-size: 14px


.menu__content
  .expansion-panel__header
    padding-left: 10px

#show-genes-button
  min-width: 120px
  margin: 0px
  margin-top: 10px


  .btn__content, .v-btn__content
    padding: 0px
    margin: 0px
    color: $text-color
    font-size: 16px

#show-genes-button.icon
  min-width: 20px
  margin: 0px
  padding: 0px

  .btn__content, .v-btn__content
    padding: 0px
    margin: 0px
    color: $text-color
    font-size: 16px
    
    .button-label
      display: inline-block
      padding-bottom: 5px
      vertical-align: bottom

    .v-badge__badge
      background-color: $nav-badge-color !important;
      left: 80px
      height: 14px
      width: 65px
      top: -11px
      border-radius: 4px

      span
        font-size: 12px !important
        color: white !important
        font-weight: 500 !important
        font-style: italic !important


#acmg-genes-button, #cancel-button,  #apply-button
  height: 30px !important

#apply-button
  background-color: $app-button-color !important
  color: white !important

#enter-genes-input, #phenotype-input
  label
    font-weight: normal

#acmg-genes-button
  margin-bottom: -10px
  .v-btn__content
    color:  $app-button-color 
    .material-icons
      font-size: 18px
      padding-right: 2px
      color:  $app-button-color 

</style>

<template>
    <v-menu
    offset-y
    :close-on-click="false"
    :close-on-content-click="false"
    :nudge-width="isEduMode ? 450 : 400"
    bottom
    :nudge-bottom="isEduMode ? 20 : 0"
    v-model="showGenesMenu"
    >

      <v-btn id="show-genes-button"
       v-bind:class="{'icon': buttonIcon != null}"
       v-bind:raised="isEduMode"
       v-bind:flat="!isEduMode"
       v-bind:small="buttonIcon != null"
       slot="activator"
       @mouseover="onMouseOver()"
       @mouseleave="onMouseLeave()"
       v-tooltip.bottom-left="{content: tooltipContent, show: showTooltipFlag, trigger: 'manual'}"
      >
        
        <v-badge right  >
          <app-icon icon="dnasearch"  width="24" height="24"></app-icon>
          <span class="button-label">
            Gene list
          </span>
          <span v-if="selectedGenePanelName"
            slot="badge">{{ selectedGenePanelShortName }}</span>
        </v-badge>
      </v-btn>


        <div  v-if="isEduMode" class="full-width" style="padding:20px">
          
          <div id="phenolyzer-panel" slot="header">Search by Phenotype</div>
          <div style="margin-bottom:15px;margin-left:16px;">
              <phenotype-search
              v-if="isEduMode"
              :isNav="false"
              :defaultTopGenes="isEduMode ? '6' : '30'"
              :phenotypeLabel="isEduMode ? 'Disorder' : 'Phenotype'"
              :geneModel="geneModel"
              :phenotypeLookupUrl="phenotypeLookupUrl"
              @on-search-genes="onSearchPhenolyzerGenes">
              </phenotype-search>
          </div>
        </div>

      <div class="full-width" style="padding: 10px 20px 10px 20px">


        <div v-if="!isEduMode" style="justify-content:flex-end;display:flex">

          <v-select
            :items="genePanelNames"
            clearable="true"
            v-model="selectedGenePanelName"
            @change="onGenePanelSelected"
            label="Gene panels">
          </v-select>
  
        </div>

          <div id="enter-genes-input">
            <v-textarea
              id="copy-paste-genes"
              multi-line
              rows="12"
              label="Enter or copy/paste gene names"
              v-model="genesToApply"
            >
            </v-textarea>
          </div>
          <div v-if="!isEduMode" style="display:flex;justify-content:flex-end">

                <v-btn id="apply-button"  @click="onApplyGenes">
                 Apply
                </v-btn>

                <v-btn id="cancel-button"  @click="onCancel">
                 Cancel
                </v-btn>

          </div>


      </div>
    </v-menu>
</template>

<script>

import PhenotypeSearch from '../partials/PhenotypeSearch.vue'
import AppIcon from '../partials/AppIcon.vue'




export default {
  name: 'genes-menu',
  components: {
    PhenotypeSearch,
    AppIcon,
  },
  props: {
    geneModel: null,
    isEduMode: null,
    isBasicMode: null,
    buttonIcon: null,
    phenotypeLookupUrl: null
  },
  data () {
    return {
      showGenesMenu: null,
      openPhenolyzerPanel: this.isEduMode,

      genesToApply: null,

      showTooltipFlag: false,
      tooltipContent: null,

      selectedGenePanelName: null


    }
  },
  watch: {
  },
  methods: {
    onApplyGenes: function(options) {
      let self = this;
      if (options == null) {
        options = {isFromClin: false, phenotypes: self.phenotypeTermEntered};
      }
      self.$emit("apply-genes", self.genesToApply, options );
      self.showGenesMenu = false;
    },
    onCancel: function() {
      let self = this;
      self.showGenesMenu = false;
    },
    onACMGGenes: function() {
      this.genesToApply = this.geneModel.getGenePanelGenes("ACMG 59").join(", ")
    },
    onGenePanelSelected: function() {
      let genes = this.geneModel.getGenePanelGenes(this.selectedGenePanelName);
      if (genes && genes.length > 0) {
        this.genesToApply = genes.join(", ");
      }
    },
    onSearchPhenolyzerGenes: function(searchTerm) {
      let self = this;
      if (searchTerm) {
        var geneCount = self.geneModel.phenolyzerGenes.filter(function(gene) {
          return gene.selected;
        }).length;
        self.genesToApply = self.geneModel.phenolyzerGenes
        .filter(function(gene) {
          return gene.selected;
        })
        .map( function(gene) {
          return gene.geneName;
        })
        .join(", ");
        if (self.isEduMode) {
          setTimeout(function() {
            self.onApplyGenes({isFromClin: false, phenotypes: searchTerm});
          }, 1000);
        }
      }
    },
    onClearAllGenes: function() {
      this.$emit("clear-all-genes");
    },
    onMouseOver: function() {
      this.showTooltipFlag = true;
      this.tooltipContent = "Click this button to add / edit the list of genes to be analyzed.  You can add the list of ACMG genes here."
    },
    onMouseLeave: function() {
      this.showTooltipFlag = false;
    },
    showTooltip: function(tooltip) {
      let self = this;
      self.showTooltipFlag = true;
      self.tooltipContent = tooltip;
    },
    hideTooltip: function() {
      let self = this;
      this.showTooltipFlag = false;
    }
  },
  created: function() {
  },
  mounted: function() {
  },
  updated: function() {
  },
  computed: {
    genePanelNames: function() {
      return this.geneModel.getGenePanelNames();
    },
    selectedGenePanelShortName: function() {
      if (this.selectedGenePanelName) {
        return this.geneModel.getGenePanelShortName(this.selectedGenePanelName)
      } else {
        return ""
      }
    }
  },
  watch: {
    showGenesMenu: function() {
      let self = this;
      if (self.showGenesMenu) {
        this.genesToApply = self.geneModel.geneNames.join(", ");
        this.hideTooltip()
      }
    }
  }
}
</script>
