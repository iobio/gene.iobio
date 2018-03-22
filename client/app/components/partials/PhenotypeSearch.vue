
<style lang="sass">

#phenolyzer-loader
  width: 18px

#phenotype-input, #enter-genes-input, #phenolyzer-top-input
  .input-group label
    font-size: 13px
    line-height: 25px
    height: 25px
  .input-group__input
    min-height: 0px
    margin-top: 13px
  .input-group--text-field input
    font-size: 13px
  .input-group
    padding-top: 0px
  .input-group__selections__comma
    font-size: 13px


.menu__content
  .expansion-panel__header
    padding-left: 10px

</style>

<template>
  <v-layout row no-wrap>
    <v-flex id="phenotype-input" style="vertical-align:bottom;display:inline-block;">
      <v-text-field id="phenotype-term" hide-details v-model="phenotypeTermEntered"
      v-bind:label="phenotypeLabel ? phenotypeLabel : 'Phenotype'"  v-bind:loading="loadingStatus">
      </v-text-field>
      <typeahead
      v-model="phenotypeTerm"
      hide-details="false"
      v-bind:limit="typeaheadLimit"
      target="#phenotype-term"
      async-src="http://nv-blue.iobio.io/hpo/hot/lookup/?term=" item-key="value"/>
    </v-flex>
    <v-flex id="phenolyzer-top-input" style="display:inline-block;max-width:60px;width:60px;margin-left:5px;padding-top:4px">
      <v-select
      v-model="phenolyzerTop"
      label="Genes"
      hide-details
      hint="Genes"
      combobox
      :items="phenolyzerTopCounts"
      >
      </v-select>
    </v-flex>
    <v-flex  v-bind:class="isNav ? 'mt-3 ml-1' : 'mt-2'" style="float:right;display:inline-block;">
     <v-btn  id="search-phenotype-button" small raised @click="onSearch" >Search</v-btn>
    </v-flex>
    <v-flex v-if="!isNav">
      <img style="width:22px;height:22px"
         v-if="phenolyzerStatus == 'queued' || phenolyzerStatus == 'running'"
         class="loader  glyph" src="../../../assets/images/wheel.gif"/>
      {{ phenolyzerStatus }}
    </v-flex>
  </v-layout>
</template>

<script>

import { Typeahead } from 'uiv'

export default {
  name: 'phenotype-search',
  components: {
    Typeahead
  },
  props: {
    geneModel: null,
    isNav: null,
    defaultTopGenes: null,
    phenotypeLabel: null
  },
  data () {
    return {
      genesToApply: null,

      phenolyzerTopCounts: [5, 10, 30, 50, 80, 100],
      phenolyzerTop: this.defaultTopGenes ? this.defaultTopGenes : (this.isNav ? 10 : 50),
      phenotypeTerm: "",
      phenotypeTermEntered: "",
      allPhenotypeTerms: [],
      phenolyzerStatus: null,
      loadingStatus: false,
      typeaheadLimit: parseInt(100)

    }
  },
  watch: {
    phenolyzerTop: function() {
      if (this.geneModel.phenolyzerGenes.length > 0) {
        this.onSearch();
      }
    }
  },
  methods: {
    onSearch: function() {
      let self = this;
      self.phenolyzerStatus = null;
      self.genesToApply = "";
      var searchTerm = null;
      if (self.phenotypeTerm) {
        searchTerm = self.phenotypeTerm.value;
        self.phenotypeTermEntered = self.phenotypeTerm.value;
      } else if (self.phenotypeTermEntered) {
        searchTerm = self.phenotypeTermEntered;
      }
      if (searchTerm) {
        self.geneModel.searchPhenolyzerGenes(searchTerm, this.phenolyzerTop,
        function(status, error) {
          if (status == 'done') {
            self.loadingStatus = false;
            if (self.geneModel.phenolyzerGenes.length == 0) {
              self.phenolyzerStatus = "no genes found."
              self.genesToApply = "";
              if (self.isNav) {
                alertify.set('notifier','position', 'top-left');
                alertify.warning("No genes found.");
              }
            } else {
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
              self.phenolyzerStatus = geneCount + " genes shown."
              self.$emit("on-search-genes", searchTerm);
            }
          } else {
            self.phenolyzerStatus = status;
            self.loadingStatus = 'success'
          }
        });

      }
    }
  },
  created: function() {
  },
  computed:  {
  },
  mounted: function() {
     $("#phenotype-term").attr('autocomplete', 'off');
  }
}
</script>
