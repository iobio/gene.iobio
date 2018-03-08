
<style lang="sass">

#phenolyzer-loader
  width: 18px

textarea#copy-paste-genes
  font-size: 14px

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
    <v-menu
    offset-y
    :close-on-content-click="false"
    :nudge-width="400"
    v-model="showGenesMenu"
    >

      <v-btn id="show-genes-button" flat slot="activator">Genes</v-btn>

      <v-expansion-panel expand>
        <v-expansion-panel-content>
          <div id="phenolyzer-panel" slot="header">Search by Phenotype</div>
          <v-card style="margin-bottom:15px">
              <div id="phenotype-input" style="display:inline-block;width:260px">
                <v-text-field id="phenotype-term" hide-details v-model="phenotypeTermEntered"
                label="enter phenotype">
                </v-text-field>
                <typeahead
                 v-model="phenotypeTerm"
                hide-details="false"
                force-select match-start
                target="#phenotype-term"
                async-src="http://nv-blue.iobio.io/hpo/hot/lookup/?term=" item-key="value"/>
              </div>
              <div style="display:inline-block;width:95px;margin-left:10px">
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
              <div style="float:right;display:inline-block;margin-top:10px">
               <v-btn  small @click="onSearchPhenolyzerGenes" >Search</v-btn>
              </div>
              <div >
                <img style="width:22px;height:22px"
                   v-if="phenolyzerStatus == 'queued' || phenolyzerStatus == 'running'"
                   class="loader  glyph" src="../../../assets/images/wheel.gif"/>
                {{ phenolyzerStatus }}
              </div>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
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
          <div>
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

import { Typeahead } from 'uiv'


export default {
  name: 'genes-menu',
  components: {
    Typeahead
  },
  props: {
    geneModel: null
  },
  data () {
    return {
      showGenesMenu: null,

      genesToApply: null,

      phenolyzerTopCounts: [30, 50, 80, 100],
      phenolyzerTop: 50,
      phenotypeTerm: "",
      phenotypeTermEntered: "",
      allPhenotypeTerms: [],
      phenolyzerStatus: null
    }
  },
  watch: {
    phenolyzerTop: function() {
      if (this.geneModel.phenolyzerGenes.length > 0) {
        this.onSearchPhenolyzerGenes();
      }
    }
  },
  methods: {
    onApplyGenes: function() {
      this.$emit("apply-genes", this.genesToApply);
      this.showGenesMenu = false;
    },
    onACMGGenes: function() {
      this.genesToApply = this.geneModel.ACMG_GENES.join(", ");
    },
    onSearchPhenolyzerGenes: function() {
      let self = this;
      self.phenolyzerStatus = null;
      self.genesToApply = "";
      var searchTerm = self.phenotypeTerm.value;
      self.phenotypeTermEntered = self.phenotypeTerm.value;
      self.geneModel.searchPhenolyzerGenes(searchTerm, this.phenolyzerTop,
      function(status, error) {
        if (status == 'done') {
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
          }
        } else {
          self.phenolyzerStatus = status;
        }
      });
    }
  },
  created: function() {
  },
  mounted: function() {
     $("#phenotype-term").attr('autocomplete', 'off');
  }
}
</script>
