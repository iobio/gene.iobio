<style lang="sass">

@import ../../../assets/sass/variables

#show-gene-menu-button
  margin: 0px 0px 0px 0px
  padding: 0px
  font-size: 15px
  margin-top: -5px

  .btn__content, .v-btn__content
    color:  $app-color
    padding-left: 0px


    i.material-icons
      color: $app-color
      font-size: 17px
      padding-right: 3px


</style>

<template>
    <v-menu
    offset-x
    :close-on-content-click="false"
    :nudge-width="200"
    right
    v-model="showGeneMenu"
    >

      <v-btn id="show-gene-menu-button"
       flat
       slot="activator">
        <span>
          Gene {{ selectedGene.gene_name }}
        </span>
        <v-icon >more_vert</v-icon>
      </v-btn>

      <v-list style="margin-left:5px">

          <v-list-tile
           v-for="link in links"
           :key="link.name">

            <v-list-tile-title @click="onClickLink">
              <v-icon style="font-size:14px;margin-right:3px">open_in_new</v-icon>
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
  name: 'gene-menu',
  components: {
  },
  props: {
    geneModel: null,
    selectedGene: null,
    selectedTranscript: null
  },
  data () {
    return {
      showGeneMenu: null,
      links: null
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    onClickLink: function(link) {
    },
    initLinks: function() {
      if (this.selectedGene && this.geneModel) {
        this.links = this.geneModel.getLinks(this.selectedGene.gene_name);
      }
    },
  },
  created: function() {
  },
  mounted: function() {
  },
  updated: function() {
  },
  filters: {
  },
  watch: {
    showGeneMenu: function() {
      this.initLinks();
    },
    selectedGene: function() {
      this.initLinks();
    },
    geneModel: function() {
    },
  }
}
</script>
