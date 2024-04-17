<style lang="sass">

@import ../../../assets/sass/variables

.hgvs-info
  font-size: 13px
  line-height: 15px
  color: $app-color
  margin-right: 10px
  align-items: flex-start
  .hgvs-label
    color: $app-color
    max-width: 55px
    min-width: 55px
  .hgvs-text
    color: $text-color

</style>

<template>
  <div class="hgvs-info" style="" >
    <div class="d-flex" >
         <div class="hgvs-label">HGVSc:</div>
         <div class="hgvs-text">{{ info.HGVSc }}</div>
    </div>
    <div class="d-flex">
         <div class="hgvs-label">HGVSp:</div>
         <div class="hgvs-text">{{ info.HGVSp == '' ? '-' : info.HGVSp }}</div>
    </div>
  </div>
</template>

<script>



export default {
  name: 'hgvs-labels',
  components: {
  },
  props: {
    info: null
  },
  data () {
    return {
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