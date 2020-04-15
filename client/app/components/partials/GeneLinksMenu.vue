<style lang="sass">

@import ../../../assets/sass/variables

#show-gene-links-button
  margin: 0px 0px 0px 0px
  padding: 0px
  min-width: 25px
  max-height: 25px
  padding-left: 8px
  margin-left: 20px


  .btn__content, .v-btn__content
    color:  $link-color
    padding-left: 0px
    padding-right: 0px
    font-size: 13px
    font-weight: 500

    i.material-icons
      color: $link-color
      font-size: 20px
      color: $link-color
      vertical-align: top
      padding-right: 3px


#gene-links
  display: inline-block

  .gene-link
    display: inline-block
    margin-right: 10px
    color: $link-color !important
    font-size: 13px
    font-weight: 500

.gene-link-button
  background-color: $link-button-color !important
  padding: 0px
  height: 20px !important
  min-width: 70px
  margin-left: 8px
  margin-right: 0px
  margin-top: -2px
  margin-bottom: 4px

  .btn__content, .v-btn__content
    color: $text-color !important
    padding-left: 4px
    padding-right: 4px
    font-size: 12px

    i.material-icons
      color: $text-color
      font-size: 12px
      padding-right: 2px
      padding-top: 0px

</style>

<template>
    <v-menu
    v-if="!expanded"
    offset-y
    :close-on-content-click="false"
    bottom
    v-model="showMenu"
    >

      <v-btn id="show-gene-links-button"
       flat
       slot="activator"
       v-tooltip.top-center="`External links to ` + selectedGene.gene_name + ` (e.g. OMIM, UCSC brower, GeneCards, etc.`"
      >
          <v-icon>open_in_new</v-icon> External links

      </v-btn>

      <v-list>

          <v-list-tile
           v-for="link in links"
           :key="link.name">

            <v-list-tile-title>
              <a
                :href="link.url"
                :target="`_` + link.name"
                class="gene-link"
                >
                  {{ link.display }}
              </a>
            </v-list-tile-title>

          </v-list-tile>

      </v-list>

    </v-menu>



</template>

<script>



export default {
  name: 'gene-links-menu',
  components: {
  },
  props: {
    geneModel: null,
    selectedGene: null,
    expanded: null
  },
  data () {
    return {
      showMenu: null,
      links: null
    }
  },
  watch: {
  },
  methods: {
    onClickLink: function(link) {
      window.open(link.url, "_" + link.display);
    },
    initLinks: function() {
      if (this.selectedGene && this.geneModel) {
        this.links = this.geneModel.getLinks(this.selectedGene.gene_name);
      }
    }
  },
  created: function() {
  },
  mounted: function() {
    this.initLinks();
  },
  updated: function() {
  },
  watch: {
    showMenu: function() {
      this.initLinks();
    },
    selectedGene: function() {
      this.initLinks();
    }

  }
}
</script>
