
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
  padding: 0px

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

#acmg-genes-button, #aclear-all-genes-button,  #apply-button

  padding: 0px
  height: 30px !important

#enter-genes-input, #phenotype-input
  label
    font-weight: normal

</style>

<template>
    <v-menu
    offset-y
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
       v-tooltip.top-center="{content: tooltipContent, show: showTooltipFlag, trigger: 'manual'}"
      >
        <v-icon v-if="buttonIcon">
          {{ buttonIcon }}
        </v-icon>
        <span v-if="!buttonIcon">
          Genes
        </span>
      </v-btn>


        <div class="full-width" style="padding:20px">
          <div id="phenolyzer-panel" slot="header">Search by Phenotype</div>
          <div style="margin-bottom:15px;margin-left:16px;">
              <phenotype-search
              :isNav="false"
              :defaultTopGenes="isEduMode ? '6' : '30'"
              :phenotypeLabel="isEduMode ? 'Disorder' : 'Phenotype'"
              :geneModel="geneModel"
              :phenotypeLookupUrl="phenotypeLookupUrl"
              @on-search-genes="onSearchPhenolyzerGenes">
              </phenotype-search>
          </div>
        </div>

      <div class="full-width" style="padding: 20px">

          <div id="enter-genes-input">
            <v-textarea
              id="copy-paste-genes"
              multi-line
              rows="12"
              label="Enter gene names"
              v-model="genesToApply"
            >
            </v-textarea>
          </div>
          <div v-if="!isEduMode">
              <v-btn id="aclear-all-genes-button" @click="onClearAllGenes">
              Clear all
              </v-btn>
              <v-btn id="acmg-genes-button" @click="onACMGGenes">
              ACMG Genes
              </v-btn>
              <v-btn id="apply-button" style="float:right" @click="onApplyGenes">
               Apply
             </v-btn>
          </div>


      </div>
    </v-menu>
</template>

<script>

import PhenotypeSearch from '../partials/PhenotypeSearch.vue'



export default {
  name: 'genes-menu',
  components: {
    PhenotypeSearch
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
      tooltipContent: null

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
    onACMGGenes: function() {
      this.genesToApply = this.geneModel.ACMG_GENES.join(", ");
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
      this.showGenesMenu = false;
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
  watch: {
    showGenesMenu: function() {
      let self = this;
      if (self.showGenesMenu) {
        this.genesToApply = self.geneModel.geneNames.join(", ");
      }
    }
  }
}
</script>
