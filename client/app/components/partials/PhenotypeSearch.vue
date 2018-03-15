
<style lang="sass">

#phenolyzer-loader
  width: 18px

#phenotype-input, #enter-genes-input
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

.menu__content
  .expansion-panel__header
    padding-left: 10px

</style>

<template>
  <div>
    <div id="phenotype-input" style="display:inline-block;width:260px">
      <v-text-field id="phenotype-term" hide-details v-model="phenotypeTermEntered"
      v-bind:label="isBasicMode ? 'Disorder' : 'Phenotype'" prepend-icon="search" v-bind:loading="loadingStatus">
      </v-text-field>
      <typeahead
      v-model="phenotypeTerm"
      hide-details="false"
      force-select match-start
      target="#phenotype-term"
      async-src="http://nv-blue.iobio.io/hpo/hot/lookup/?term=" item-key="value"/>
    </div>
    <div v-if="!isBasicMode" style="display:inline-block;width:95px;margin-left:10px">
      <v-select
      v-model="phenolyzerTop"
      label="Select top"
      hide-details
      hint="Genes"
      combobox
      :items="phenolyzerTopCounts"
      >
      </v-select>
    </div>
    <div  v-bind:class="isBasicMode ? 'mt-3' : 'mt-2'" style="float:right;display:inline-block;">
     <v-btn  small flat @click="onSearch" >Search</v-btn>
    </div>
    <div v-if="!isBasicMode">
      <img style="width:22px;height:22px"
         v-if="phenolyzerStatus == 'queued' || phenolyzerStatus == 'running'"
         class="loader  glyph" src="../../../assets/images/wheel.gif"/>
      {{ phenolyzerStatus }}
    </div>
  </div>
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
    isEduMode: null,
    isBasicMode: null
  },
  data () {
    return {
      genesToApply: null,

      phenolyzerTopCounts: [5, 10, 30, 50, 80, 100],
      phenolyzerTop: this.isEduMode ? 5 : (this.isBasicMode ? 10 : 50),
      phenotypeTerm: "",
      phenotypeTermEntered: "",
      allPhenotypeTerms: [],
      phenolyzerStatus: null,
      loadingStatus: false

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
