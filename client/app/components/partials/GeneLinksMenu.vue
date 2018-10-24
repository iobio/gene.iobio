<style lang="sass">

@import ../../../assets/sass/variables

#show-gene-links-button
  .btn__content
    color:  $app-color

#gene-links
  display: inline-block

  .gene-link
    display: inline-block
    margin-right: 10px
    color: $link-color !important
    font-size: 13px

</style>

<template>
    <v-menu
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
          External links
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
    selectedGene: null
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
  },
  created: function() {
  },
  mounted: function() {
  },
  updated: function() {
  },
  watch: {
    showMenu:function() {
      this.links = this.geneModel.getLinks(this.selectedGene.gene_name);
    }
  }
}
</script>
