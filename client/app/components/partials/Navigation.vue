
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

</style>

<template>
  <div>
    <v-toolbar fixed app :clipped-left="clipped"  dark prominent >
      <v-toolbar-side-icon @click.stop="leftDrawer = !leftDrawer"></v-toolbar-side-icon>
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
        :nudge-width="200"
        v-model="menuGenes"
        >
          <v-btn flat slot="activator">Genes</v-btn>

          <v-card>
             <v-text-field
              id="copy-paste-genes"
              multi-line
              label="Enter gene names genes"
              v-model="copyPasteGenes"
            >
            </v-text-field>
            <v-divider></v-divider>
            <v-btn @click="onACMGGenes">
              ACMG Genes
            </v-btn>
          </v-card>


        </v-menu>

        <v-btn flat>
          <v-icon>tune</v-icon>
          Filter
        </v-btn>

        <v-btn flat>
          <v-icon>bookmark</v-icon>
          Bookmark
        </v-btn>

        <v-btn flat>
         <v-icon>input</v-icon>
         Files
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
    >
      <div></div>

    </v-navigation-drawer>

  </div>
</template>

<script>

import { Typeahead } from 'uiv'


export default {
  name: 'navigation',
  components: {
    Typeahead
  },
  props: {
    geneModel: null
  },
  data () {
      return {
        title: 'gene.iobio',

        selectedGene: {},
        clipped: false,
        leftDrawer: false,
        rightDrawer: false,

        menuGenes: false,
        copyPasteGenes: null
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
      if (!this.menuGenes) {
        this.$emit("copy-paste-genes", this.copyPasteGenes);
      }
    },
    onACMGGenes: function() {
      this.copyPasteGenes = this.geneModel.ACMG_GENES.join(", ");
    }
  },
  mounted: function() {
     $("#search-gene-name").attr('autocomplete', 'off');
  }
}

</script>