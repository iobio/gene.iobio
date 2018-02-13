
<style lang="sass">
nav.toolbar
  background-color: rgb(93, 128, 157) !important
  font-weight: 300 !important

  i.material-icons
    margin-right: 2px

  .toolbar__title
    font-family: Quicksand
    font-size: 28px
    margin-right: 20px
    padding-bottom: 5px


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

</style>

<template>
  <div>
    <v-toolbar fixed app :clipped-left="clipped"  dark prominent >

      <v-toolbar-side-icon @click.stop="leftDrawer = !leftDrawer">
      </v-toolbar-side-icon>

      <v-toolbar-title v-text="title"></v-toolbar-title>

      <v-toolbar-items class="hidden-sm-and-down">

        <v-icon>search</v-icon>
        <v-form >
          <v-text-field id="search-gene-name" label="Gene">
          </v-text-field>
          <typeahead v-model="selectedGene" force-select match-start  target="#search-gene-name" :data="geneModel.allKnownGenes" item-key="gene_name"/>
        </v-form>


        <v-menu
        offset-y
        :close-on-content-click="false"
        :nudge-width="400"
        v-model="menuGenes"
        >

        <v-btn flat slot="activator">Genes</v-btn>

        <v-expansion-panel expand>
          <v-expansion-panel-content>
            <div slot="header">Search by Phenotype</div>
            <v-card>
                <div id="phenotype-input" style="display:inline-block;width:260px">
                  <v-text-field v-model="phenotypeTerm" hide-details label="enter phenotype">
                  </v-text-field>
                </div>
                <div style="display:inline-block;width:95px;margin-left:10px">
                  <v-select
                  v-model="phenolyzerTop"
                  label="Select top"
                  hint="Genes"
                  combobox
                  :items="phenolyzerTopCounts"
                  >
                  </v-select>
                </div>
                <div style="float:right;display:inline-block;margin-top:10px">
                 <v-btn  small @click="onSearchPhenolyzerGenes" >Search</v-btn>
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
                v-model="copyPasteGenes"
                hide-details="true"
              >
              </v-text-field>
            </div>
            <div>
                <v-btn @click="onACMGGenes">
                ACMG Genes
                </v-btn>
                <v-btn style="float:right" @click="onCopyPasteGenes">
                 Apply
               </v-btn>
            </div>


          </v-card>
        <!--
        <v-card>
          <div id="phenotype-input">
            <v-text-field  label="enter phenotype">
            </v-text-field>
          </div>
          <div>
            <div style="display:inline-block;width:100px">
              <v-select
              v-model="phenolyzerTop"
              label="Select top"
              hint="Genes"
              combobox
              :items="phenolyzerTopCounts"
              >
              </v-select>
            </div>
            <div style="float:right;display:inline-block">
              <v-btn >Search</v-btn>
            </div>

          </div>
          <v-divider></v-divider>
          <v-card>

            <div id="enter-genes-input">
              <v-text-field
                id="copy-paste-genes"
                multi-line
                rows="12"
                label="Enter gene names"
                v-model="copyPasteGenes"
                hide-details="true"
              >
              </v-text-field>
            </div>
            <div>
                <v-btn @click="onACMGGenes">
                ACMG Genes
                </v-btn>
                <v-btn style="float:right" @click="onCopyPasteGenes">
                 Apply
               </v-btn>
            </div>


          </v-card>
      </v-card>
    -->

        </v-menu>
<!--
        <v-btn flat>
          <v-icon>tune</v-icon>
          Filter
        </v-btn>

        <v-btn flat @click="onBookmarks">
          <v-icon>bookmark</v-icon>
          Bookmark
        </v-btn>

-->

        <v-btn flat>
         <v-icon>input</v-icon>
         Files
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn flat @click="onLegend">
          <v-icon>description</v-icon>
          Legend
        </v-btn>

      </v-toolbar-items>

      <v-spacer></v-spacer>

      <v-menu offset-y>
        <v-btn flat slot="activator">Help</v-btn>
        <v-list>
          <v-list-tile  @click="onLoadDemoData">
            <v-list-tile-title>Load Demo Data</v-list-tile-title>
          </v-list-tile>
          <v-list-tile  @click="onClearCache">
            <v-list-tile-title>Clear session data</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-navigation-drawer
      fixed
      :clipped="clipped"
      v-model="leftDrawer"
      app
      width=350
    >
      <div>
        <bookmarks-card
         v-if="leftDrawerContents == 'bookmarks'"
         :bookmarkModel="bookmarkModel"
         @bookmark-selected="onBookmarkSelected"
        >
        </bookmarks-card>

        <flagged-variants-card
         v-if="leftDrawerContents == 'flagged-variants'"
         :cohortModel="cohortModel"
         @flagged-variant-selected="onFlaggedVariantSelected"
        >
        </flagged-variants-card>

        <legend-panel
         v-if="leftDrawerContents == 'legend'"
        >
        </legend-panel>


      </div>

    </v-navigation-drawer>

  </div>
</template>

<script>

import { Typeahead } from 'uiv'
import BookmarksCard from '../viz/BookmarksCard.vue'
import FlaggedVariantsCard from '../viz/FlaggedVariantsCard.vue'
import LegendPanel from '../partials/LegendPanel.vue'


export default {
  name: 'navigation',
  components: {
    Typeahead,
    BookmarksCard,
    FlaggedVariantsCard,
    LegendPanel
  },
  props: {
    geneModel: null,
    bookmarkModel: null,
    cohortModel: null

  },
  data () {
      return {
        title: 'gene.iobio',

        selectedGene: {},
        clipped: false,
        leftDrawer: false,
        rightDrawer: false,

        leftDrawerContents: "",

        menuGenes: false,
        copyPasteGenes: null,

        phenolyzerTopCounts: [30, 50, 80, 100],
        phenolyzerTop: 50,
        phenotypeTerm: null
      }
  },
  watch: {
    selectedGene: function(a, b) {
      if (this.selectedGene) {
        this.$emit("input", this.selectedGene.gene_name);
      }
    },
    menuGenes: function() {
      if (!this.menuGenes && this.copyPasteGenes && this.copyPasteGenes.length > 0) {
        this.onCopyPasteGenes();
      } else {
        if (this.geneModel) {
          this.copyPasteGenes = this.geneModel.geneNames.join(", ");
        }
      }
    },
    phenolyzerTop: function() {
      if (this.geneModel.phenolyzerGenes.length > 0) {
        this.onSearchPhenolyzerGenes();
      }
    }
  },
  methods: {
    onLoadDemoData: function() {
      this.$emit("load-demo-data");
    },
    onClearCache: function() {
      this.$emit("clear-cache")
    },
    onCopyPasteGenes: function() {
      this.$emit("copy-paste-genes", this.copyPasteGenes);
      this.menuGenes = false;
    },
    onACMGGenes: function() {
      this.copyPasteGenes = this.geneModel.ACMG_GENES.join(", ");
    },
    onBookmarks: function() {
      this.leftDrawerContents = "bookmarks";
      this.leftDrawer = true;
    },
    onBookmarkSelected: function(bookmark) {
      this.$emit("bookmark-selected", bookmark)
    },
    onLegend: function() {
      this.leftDrawerContents = "legend";
      this.leftDrawer = true;
    },
    onFlaggedVariants: function() {
      this.leftDrawerContents = "flagged-variants";
      this.leftDrawer = true;
    },
    onFlaggedVariantSelected: function(variant) {
      this.$emit("flagged-variant-selected", variant)
    },
    onSearchPhenolyzerGenes: function() {
      let self = this;
      self.geneModel.searchPhenolyzerGenes(this.phenotypeTerm, this.phenolyzerTop,
      function(status, error) {
        if (status == 'done') {
          self.copyPasteGenes = self.geneModel.phenolyzerGenes
          .filter(function(gene) {
            return gene.selected;
          })
          .map( function(gene) {
            return gene.geneName;
          })
          .join(", ");
        }
      });
    }
  },
  created: function() {
  },
  mounted: function() {
     $("#search-gene-name").attr('autocomplete', 'off');
  }
}

</script>