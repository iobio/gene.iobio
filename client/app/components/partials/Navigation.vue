
<style type="text/css">
  nav.toolbar {
    background-color: rgb(93, 128, 157) !important;
    font-weight: 300 !important;
  }
  nav.toolbar i.material-icons {
    margin-right: 2px
  }


  .toolbar__title {
    font-family: Quicksand;
    font-size: 28px;
    margin-right: 20px;
    padding-bottom: 5px;
  }
</style>

<template>
  <div>
    <v-toolbar fixed app :clipped-left="clipped"  dark prominent >
      <v-toolbar-side-icon @click.stop="leftDrawer = !leftDrawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat>
         <v-icon>input</v-icon>
         Files
        </v-btn>

        <v-icon>search</v-icon>
        <v-form >
          <v-text-field id="search-gene-name" label="Gene">
          </v-text-field>
          <typeahead v-model="selectedGene" force-select match-start  target="#search-gene-name" :data="allGenes" item-key="gene_name"/>
        </v-form>

        <v-btn flat>
          <v-icon>explore</v-icon>
          Genes
        </v-btn>

        <v-btn flat>
          <v-icon>tune</v-icon>
          Filter
        </v-btn>

        <v-btn flat>
          <v-icon>bookmark</v-icon>
          Bookmark
        </v-btn>


      </v-toolbar-items>

      <v-spacer></v-spacer>

      <v-menu offset-y>
        <v-btn flat slot="activator">Help</v-btn>
        <v-list>
          <v-list-tile  @click="onLoadDemoData">
            <v-list-tile-title>Load Demo Data</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-navigation-drawer
      fixed
      :clipped="clipped"
      v-model="leftDrawer"
      app
    >
      <div></div>

    </v-navigation-drawer>

  </div>
</template>

<script>

import { Typeahead } from 'uiv'
import geneData from '../../../data/genes.json'

export default {
  name: 'navigation',
  components: {
    Typeahead
  },
  props: {
  },
  data () {
      return {
        title: 'gene.iobio',
        selectedGene: {},
        clipped: false,
        allGenes: geneData,
        leftDrawer: false,
        rightDrawer: false
      }
  },
  watch: {
    selectedGene: function(a, b) {
      if (this.selectedGene) {
        this.$emit("input", this.selectedGene);
      }
    }
  },
  methods: {
    onLoadDemoData: function() {
      this.$emit("navLoadDemoData");
    }
  },
  mounted: function() {
     $("#search-gene-name").attr('autocomplete', 'off');
  }
}

</script>