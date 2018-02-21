
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

</style>

<template>
  <div>
    <v-toolbar fixed app :clipped-left="clipped"  dark prominent >

      <v-toolbar-side-icon @click.stop="leftDrawer = !leftDrawer">
      </v-toolbar-side-icon>

      <v-toolbar-title v-text="title"></v-toolbar-title>

      <v-toolbar-items style="margin-left:20px" class="hidden-sm-and-down">

        <v-icon>search</v-icon>
        <v-form >
          <v-text-field id="search-gene-name" label="Gene">
          </v-text-field>
          <typeahead v-model="selectedGene" force-select match-start  target="#search-gene-name" :data="geneModel.allKnownGenes" item-key="gene_name"/>
        </v-form>


        <genes-menu
         :gene-model="geneModel"
         @apply-genes="onApplyGenes">
        </genes-menu>



        <v-btn flat  @click="onVariants">
         <v-icon>bookmark</v-icon>
         Variants
        </v-btn>


        <files-menu
         :cohortModel="cohortModel"
         @on-files-loaded="onFilesLoaded"
        >
        </files-menu>


      </v-toolbar-items>

      <v-spacer></v-spacer>

      <v-menu
      offset-y
      :close-on-content-click="false"
      :nudge-width="400"
      v-model="showLegendMenu"
      >
        <v-btn flat slot="activator">
          <v-icon>description</v-icon>
          Legend
        </v-btn>

        <legend-panel>
        </legend-panel>
      </v-menu>


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

        <flagged-variants-card
         v-if="leftDrawerContents == 'flagged-variants'"
         :cohortModel="cohortModel"
         :flaggedVariants="flaggedVariants"
         @flagged-variants-imported="onFlaggedVariantsImported"
         @flagged-variant-selected="onFlaggedVariantSelected"
        >
        </flagged-variants-card>



      </div>

    </v-navigation-drawer>

  </div>
</template>

<script>

import { Typeahead }       from 'uiv'
import GenesMenu           from '../partials/GenesMenu.vue'
import FilesMenu           from '../partials/FilesMenu.vue'
import LegendPanel         from '../partials/LegendPanel.vue'
import FlaggedVariantsCard from '../viz/FlaggedVariantsCard.vue'


export default {
  name: 'navigation',
  components: {
    Typeahead,
    GenesMenu,
    FilesMenu,
    FlaggedVariantsCard,
    LegendPanel
  },
  props: {
    geneModel: null,
    cohortModel: null,
    flaggedVariants: null,
  },
  data () {
    return {
      title: 'gene.iobio',

      selectedGene: {},
      clipped: false,
      leftDrawer: false,
      rightDrawer: false,

      leftDrawerContents: "",
      showLegendMenu: false

    }
  },
  watch: {
    selectedGene: function(a, b) {
      if (this.selectedGene) {
        this.$emit("input", this.selectedGene.gene_name);
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
    onApplyGenes: function(genesToApply) {
      this.$emit("apply-genes", genesToApply);
    },
    onVariants: function() {
      this.leftDrawerContents = "flagged-variants";
      this.leftDrawer = true;
    },
    onLegend: function() {
      this.leftDrawerContents = "legend";
      this.leftDrawer = true;
    },
    onShowFlaggedVariants: function() {
      this.leftDrawerContents = "flagged-variants";
      this.leftDrawer = true;
    },
    onFlaggedVariantSelected: function(variant) {
      this.$emit("flagged-variant-selected", variant)
    },
    onFlaggedVariantsImported: function() {
      this.$emit("flagged-variants-imported")
    },
    onFilesLoaded: function() {
      this.$emit("on-files-loaded");
    }
  },
  created: function() {
  },
  mounted: function() {
     $("#search-gene-name").attr('autocomplete', 'off');

  }
}

</script>