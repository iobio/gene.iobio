<style lang="sass">

@import ../../../assets/sass/variables

.variant-info
  padding-left: 20px
  padding-right: 20px
  padding-bottom: 5px
  padding-top: 20px

  .card-label
    color: $app-color
    font-size: 14px
    margin-bottom: 2px


#show-variant-links-button
  margin: 0px 0px 0px 0px
  padding: 0px
  font-size: 15px
  margin-top: -4px

  .btn__content, .v-btn__content
    color:  $app-color
    padding-left: 0px

    i.material-icons
      color: $app-color
      font-size: 17px
      padding-right: 3px

.variant-link
  .rsid
    color: $app-color




</style>

<template>
  <span>
    <v-menu
    offset-x
    :close-on-content-click="false"
    right
    v-model="showMenu"
    >

      <v-btn id="show-variant-links-button"
       flat
       slot="activator"
       v-tooltip.top-center="`External links to variant info (e.g. VarSome, UCSC Browser, etc.`"
      >
        Variant
        <v-icon>more_vert</v-icon>
      </v-btn>

      <div class="variant-info" >
        <div class="card-label">
             HGVSc: {{ info.HGVSc }}
        </div>
        <div class="card-label">
             HGVSp: {{ info.HGVSp }}
        </div>
      </div>

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
                  <span class="rsid" v-if="link.display == 'dbSNP'">{{ info.rsId }}</span>
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
    refAlt: function() {
      let self = this;
      var refAlt = "";
      if (self.selectedGene && self.selectedGene.strand && self.selectedVariant) {
        if (self.isEduMode) {
          if (self.selectedGene.strand == "-") {
            refAlt = self.globalApp.utility.switchGenotype(self.selectedVariant.eduGenotype)
          } else {
            refAlt = self.selectedVariant.eduGenotype;
          }
        } else {
          refAlt =   self.info.refalt;
        }
      }
      return refAlt;
    }
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