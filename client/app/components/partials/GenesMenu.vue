
<style lang="sass">


textarea#copy-paste-genes
  font-size: 14px


.menu__content
  .expansion-panel__header
    padding-left: 10px

#show-genes-button.icon
  min-width: 20px
  margin: 0px
  padding: 0px

  .btn__content
    padding: 0px
    margin: 0px

</style>

<template>
    <v-menu
    offset-y
    :close-on-content-click="false"
    :nudge-width="400"
    top
    v-model="showGenesMenu"
    >

      <v-btn id="show-genes-button"
       v-bind:class="{'icon': buttonIcon != null}"
       v-bind:raised="isEduMode"
       v-bind:flat="!isEduMode"
       v-bind:small="buttonIcon != null"
       slot="activator">
        <v-icon v-if="buttonIcon">
          {{ buttonIcon }}
        </v-icon>
        <span v-if="!buttonIcon">
          Genes
        </span>
      </v-btn>

<!--
      <v-expansion-panel expand>
        <v-expansion-panel-content :value="openPhenolyzerPanel">
          <div id="phenolyzer-panel" slot="header">Search by Phenotype</div>
          <v-card style="margin-bottom:15px">
              <phenotype-search
              :isNav="false"
              :defaultTopGenes="isEduMode ? '5' : '30'"
              :phenotypeLabel="isEduMode ? 'Disorder' : 'Phenotype'"
              :geneModel="geneModel"
              @on-search-genes="onSearchPhenolyzerGenes">
              </phenotype-search>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
-->
      <v-card>

          <div id="enter-genes-input">
            <v-text-field
              id="copy-paste-genes"
              multi-line
              rows="12"
              label="Enter gene names"
              v-model="genesToApply"
            >
            </v-text-field>
          </div>
          <div v-if="!isEduMode">
              <v-btn id="acmg-genes-button" @click="onACMGGenes">
              ACMG Genes
              </v-btn>
              <v-btn style="float:right" @click="onApplyGenes">
               Apply
             </v-btn>
          </div>


      </v-card>
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
    buttonIcon: null
  },
  data () {
    return {
      showGenesMenu: null,
      openPhenolyzerPanel: this.isEduMode,

      genesToApply: null

    }
  },
  watch: {
  },
  methods: {
    onApplyGenes: function() {
      this.$emit("apply-genes", this.genesToApply, this.phenotypeTermEntered);
      this.showGenesMenu = false;
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
            self.onApplyGenes();
          }, 1000);
        }
      }
    }
  },
  created: function() {
  },
  mounted: function() {
  }
}
</script>
