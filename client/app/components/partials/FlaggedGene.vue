<style lang="sass">
@import ../../../assets/sass/variables

.bookmark-gene
  font-size: 12px


</style>

<template>

  <div class="flagged-gene">
    <div>
      {{ flaggedGene.gene.gene_name }} {{ flaggedGene.gene.chr }}
    </div>

    <flagged-variant
    v-for="variant in flaggedGene.variants"
    :key="variant.start + ' ' + variant.ref + ' ' + variant.alt"
    :variant="variant"
    @flagged-variant-selected="onFlaggedVariantSelected"
    >
    </flagged-variant>

  </div>

</template>

<script>

import FlaggedVariant from '../partials/FlaggedVariant.vue'


export default {
  name: 'flagged-gene',
  components: {
    FlaggedVariant
  },
  props: {
    flaggedGene: null
  },
  data () {
    return {
    }
  },
  methods: {
    onFlaggedVariantSelected: function(variant) {
      this.$emit("flagged-variant-selected", variant);
    }

  },
  mounted: function() {
  },
  computed: {
  },
  watch: {
  }
}

</script>