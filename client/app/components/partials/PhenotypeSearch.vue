
<style lang="sass">

#phenolyzer-loader
  width: 18px





.menu__content
  .expansion-panel__header
    padding-left: 10px


</style>

<template>
  <v-layout row no-wrap>
    <v-flex id="phenotype-input" style="vertical-align:bottom;display:inline-block;">
      <v-text-field id="phenotype-term" hide-details v-model="phenotypeTermEntered"
      v-on:keyup.13="onTextEntered"
      :class="classAttention"
      v-bind:label="phenotypeLabel ? phenotypeLabel : 'Phenotype'"  v-bind:loading="loadingStatus">
      </v-text-field>
      <typeahead
      v-model="phenotypeTerm"
      :hide-details="false"
      :limit="typeaheadLimit"
      target="#phenotype-term"
      :async-function="phenotypeLookup"
      item-key="value"
      :forceSelect="true"
      :preselect="false"/>
    </v-flex>
    <v-flex id="phenolyzer-top-input" style="display:inline-block;max-width:60px;width:60px;margin-left:5px;padding-top:4px">
      <v-select
      v-model="phenolyzerTop"
      label="Genes"
      :hide-details="true"
      hint="Genes"
      combobox
      :items="phenolyzerTopCounts"
      >
      </v-select>
    </v-flex>
    <v-flex v-if="!isNav" >
      <img style="width:22px;height:22px"
         v-if="phenolyzerStatus == 'queued' || phenolyzerStatus == 'running'"
         class="loader  glyph" src="../../../assets/images/wheel.gif"/>
      {{ phenolyzerStatus }}
    </v-flex>
  </v-layout>
</template>

<script>

import { Typeahead } from 'uiv'
import Vue                  from 'vue'

export default {
  name: 'phenotype-search',
  components: {
    Typeahead
  },
  props: {
    geneModel: null,
    isNav: null,
    defaultTopGenes: null,
    phenotypeLabel: null,
    classAttention: null,
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
      typeaheadLimit: parseInt(100),
      typeaheadlist: [],

      phenolyzerLink: "<a target='_phenolyzer' style='padding-left:10px;color:white;font-style:italic;color:white' href='http://phenolyzer.wglab.org/'>learn more</a>"


    }
  },
  watch: {
    phenolyzerTop: function() {
      if (this.geneModel.phenolyzerGenes.length > 0) {
        this.onSearch();
      }
    },
    phenotypeTerm: function() {
      let self = this;
      if (self.phenotypeTerm && self.phenotypeTerm.value) {
        self.onSearch();
      }
    }
  },
  methods: {
    onSearch: function() {
      let self = this;


      setTimeout(function () {
        self.phenolyzerStatus = null;
        self.genesToApply = "";
        var searchTerm = null;
        if (self.phenotypeTerm && self.phenotypeTerm.value) {
          searchTerm = self.phenotypeTerm.value;
          self.phenotypeTermEntered = self.phenotypeTerm.value;
        } if (self.phenotypeTerm && self.phenotypeTerm.length > 0) {
          searchTerm = self.phenotypeTerm;
          self.phenotypeTermEntered = self.phenotypeTerm;
        } else if (self.phenotypeTermEntered) {
          searchTerm = self.phenotypeTermEntered;
        }
        if (searchTerm) {
          let runningMsg = "Running Phenolyzer to get genes associated with <br>'" + searchTerm + "'.<br><br>" + self.phenolyzerLink;
          self.$emit('show-snackbar', { message: runningMsg, timeout: 10000 });
          self.$emit("on-start-search-genes");

          self.geneModel.searchPhenolyzerGenes(searchTerm, self.phenolyzerTop,
          function(data) {
            if (data.status == 'done') {
              self.loadingStatus = false;
              if (data.genes.length == 0) {
                self.phenolyzerStatus = "no genes found."
                self.genesToApply = "";
                if (self.isNav) {
                  self.$emit('show-snackbar',
                    { message: "No genes found for <br><br>'" + data.phenotypeTerm + "'", timeout: 4000 });
                }
              } else {
                var geneCount = data.genes.filter(function(gene) {
                  return gene.selected;
                }).length;
                self.genesToApply = data.genes.filter(function(gene) {
                  return gene.selected;
                })
                .map( function(gene) {
                  return gene.geneName;
                })
                .join(", ");
                self.phenolyzerStatus = geneCount + " genes shown."
                self.$emit("on-search-genes", data.phenotypeTerm);
                self.$emit('hide-snackbar');
              }
            } else {
              self.phenolyzerStatus = data.status;
              self.loadingStatus = true;
            }
          });

        }
      },
      200);
    },
    onTextEntered: function() {
      let self = this;
      setTimeout(() => {
        let bypass = false;
        if (self.phenotypeTerm && self.phenotypeTerm.value) {
          bypass = true;
        } else if (self.typeaheadlist && self.typeaheadlist.length > 0) {
          bypass = true;
        } else if (self.phenotypeTermEntered == null || self.phenotypeTermEntered.length == 0) {
          bypass = true;
        }
        if (!bypass) {
          let msg = "Search on non-standard term '" + self.phenotypeTermEntered + "?'"
          alertify.confirm("",
            msg,
            function (e) {
              // ok
              self.onSearch();
            },
            function() {
              // cancel
            }

          ).set('labels', {ok:'OK', cancel:'Cancel'});

        }
      }, 200)
    },
    phenotypeLookup: function(term, done) {
      let self = this;

      $.ajax({
          url: self.globalApp.hpoLookupUrl + encodeURIComponent(term),
          type: 'GET',
          error: function() {
              done([])
          },
          success: function(res) {
            if (!res.length) {
              done([]);
            }
            self.typeaheadlist = res.sort(function(a,b) {
              if (a.label < b.label) {
                return -1;
              } else if (a.label > b.label) {
                return 1;
              } else {
                return 0;
              }
            });
            done(self.typeaheadlist);
          }
      });
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
