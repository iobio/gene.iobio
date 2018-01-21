<style lang="css">

</style>


<template>

  <v-card tile id="variant-card" class="app-card">
    <v-card-title primary-title>
    {{ name }}
    </v-card-title>

  </v-card>



</template>

<script>

export default {
  name: 'variant-card',
  components: {
  },
  props: {
    name: "",
    vcfData: {},
    fbData: {},
    selectedGene: {},
    selectedTranscript: {}
  },
  data() {
    return {
      margin: {
        top: isLevelBasic || isLevelEdu ? 0 : 20,
        right: isLevelBasic || isLevelEdu ? 7 : 2,
        bottom: 18,
        left: isLevelBasic || isLevelEdu ? 9 : 4
      }
    }
  },


  methods: {

  },


  filters: {
  },

  computed: {


  },



  mounted: function() {


  },

  created: function() {
  }


}
</script>
