<style lang="sass">

@import ../../../assets/sass/variables


#show-more-gnomad-button
  margin: 0px 0px 0px 0px
  padding: 0px
  min-width: 25px
  max-height: 25px
  padding-right: 5px
  padding-left: 8px
  margin-right: 20px
  padding-bottom: 2px
  margin-left: 15px
  margin-bottom: 10px
  margin-top: -5px

  .btn__content, .v-btn__content
    color:  $text-color
    padding-left: 0px
    padding-right: 0px
    color: $link-color
    font-size: 12px
    font-weight: 500

    i.material-icons
      font-size: 20px
      color: $link-color
      vertical-align: top
      padding-right: 3px
.gnomad-pop-entry-label
   display: inline-block
   width: 40px
   color: $app-color
   font-size: 13px

.gnomad-pop-entry-value
    display: inline-block
    margin-left: 5px
    width: 40px
    font-size: 13px

</style>

<template>
  <span>
    <v-menu
    offset-y
    :close-on-content-click="false"
    bottom
    v-model="showMenu"
    >

      <v-btn id="show-more-gnomad-button"
       flat
       slot="activator"
       v-tooltip.top-center="`Show gnomAD population allele frequencies`"
      >
        Population frequencies
      </v-btn>

      <div class="gnomad-pop-info" style="padding: 20px;"  >
        <div class="gnomad-pop-entry"  v-for="(pop, popKey) in selectedVariant.gnomAD.pop">            
            <span class="gnomad-pop-entry-label">
                {{ popKey }}</span>
            <span class="gnomad-pop-entry-value">
                {{ getAf(pop.af) }}
            </span>
        </div>
      </div>

    </v-menu>

  </span>
</template>

<script>



export default {
  name: 'variant-af-pop-menu',
  components: {
  },
  props: {
    selectedVariant: null,
  },
  data () {
    return {
      showMenu: null
    }
  },
  methods: {
    getAf: function(popAf) {
      return ((popAf == null || popAf == '' || popAf == 0  || popAf == '.') ? '0' : d3.format(".3n")(popAf))
    }
  },
  created: function() {
  },
  mounted: function() {
  },
  updated: function() {
  },
  computed: {
  },
  watch: {
  }
}
</script>