<style lang="sass">

@import ../../../assets/sass/variables



#show-variant-links-button
  margin: 0px 0px 0px 0px
  padding: 0px
  min-width: 25px
  max-height: 25px
  padding-right: 5px
  padding-left: 8px
  margin-left: 14px
  margin-right: 10px
  padding-bottom: 2px

  .btn__content, .v-btn__content
    color:  $text-color
    padding-left: 0px
    padding-right: 0px
    color: $link-color
    font-size: 13px
    font-weight: 500

    i.material-icons
      font-size: 20px
      color: $link-color
      vertical-align: top
      padding-right: 3px


.variant-link
  .rsid
    color: $text-color




</style>

<template>
  <span>
    <v-menu
    offset-y
    :close-on-content-click="false"
    bottom
    v-model="showMenu"
    >

      <v-btn id="show-variant-links-button"
       flat
       slot="activator"
       v-tooltip.top-center="`External links to variant info (e.g. VarSome, UCSC Browser, etc.`"
      >
        <v-icon>open_in_new</v-icon> External links
      </v-btn>

      <hr style="margin-top:0px;margin-bottom:0px">

      <v-list class="variant-links">

          <v-list-tile
           v-for="link in links"
           :key="link.name">

            <v-list-tile-title>
              <v-icon style="font-size:14px;margin-right:3px">open_in_new</v-icon>
              <a
                :href="link.url"
                :target="`_` + link.name"
                class="variant-link"
                >
                  {{ link.display }} 
                  <span class="rsid" v-if="info.rsId && link.display == 'dbSNP'">{{ info.rsId }}</span>
              </a>
            </v-list-tile-title>

          </v-list-tile>

      </v-list>

    </v-menu>

  </span>
</template>

<script>



export default {
  name: 'variant-links-menu',
  components: {
  },
  props: {
    geneModel: null,
    selectedGene: null,
    selectedVariant: null,
    info: null
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
      if (this.selectedGene && this.selectedVariant && this.geneModel) {
        this.links = this.geneModel.getVariantLinks(this.selectedGene.gene_name, this.selectedVariant);
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
  computed: {
  },
  watch: {
    showMenu: function() {
      this.initLinks();
    },
    selectedVariant: function() {
      this.initLinks();
    }
  }
}
</script>