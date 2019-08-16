<style lang="sass">

@import ../../../assets/sass/variables


#show-hgvs-button
  margin: 0px 0px 0px 0px
  padding: 0px
  font-size: 14px
  margin-top: -4px

  .btn__content, .v-btn__content
    color:  $text-color
    padding-left: 0px

    i.material-icons
      color: $text-color
      font-size: 15px
      padding-right: 3px


</style>

<template>
  <span>
    <v-menu
    offset-y
    :close-on-content-click="false"
    bottom
    v-model="showMenu"
    >

      <v-btn id="show-hgvs-button"
       flat
       slot="activator"
       v-tooltip.top-center="`HGVSc and HGVSp for variant`"
      >
        <v-icon>location_on</v-icon>
        HGVS
      </v-btn>

      <div class="variant-info" style="padding: 20px;" >
        <div class="card-label">
             HGVSc: {{ info.HGVSc }}
        </div>
        <div class="card-label">
             HGVSp: {{ info.HGVSp }}
        </div>
      </div>

    </v-menu>

  </span>
</template>

<script>



export default {
  name: 'variant-aliases-menu',
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
      showMenu: null
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
  computed: {

  },
  watch: {
  }
}
</script>