<style lang="sass" scoped>

@import ../../../assets/sass/variables



</style>
<template>

  <span>

    <app-icon
     v-if="icon == 'pathogenic'"
     icon="clinvar"
     level="high"
     width="18"
     height="18">
    </app-icon>


    <app-icon
     v-if="icon == 'autosomalDominant'"
     icon="autosomal dominant"
     width="20"
     height="20">
    </app-icon>

    <app-icon
     v-if="icon == 'denovo'"
     icon="denovo"
     width="20"
     height="20">
    </app-icon>

    <app-icon
     v-if="icon == 'recessive'"
     icon="recessive"
     width="20"
     height="20">
    </app-icon>



    <app-icon
     v-if="icon == 'xlinked'"
     icon="x-linked"
     width="20"
     height="20">
    </app-icon>


    <app-icon
     v-if="icon == 'compoundHet'"
     icon="compound het"
     width="20"
     height="20">
    </app-icon>




    <span v-if="icon == 'highOrModerate'" >
      <svg width="20" height="20">
        <g transform="translate(0,8)">
          <rect width="9" height="9" class="filter-symbol impact_HIGH snp" style="pointer-events: none;"></rect>
        </g>
        <g transform="translate(10,8)">
          <rect width="9" height="9" class="filter-symbol impact_MODERATE snp" style="pointer-events: none;"></rect>
        </g>
      </svg>
    </span>

    <app-icon
     v-if="icon == 'coverage'"
     icon="coverage"
     width="18"
     height="18">
    </app-icon>


  </span>
</template>

<script>

import AppIcon from '../partials/AppIcon.vue'

export default {
  name: 'filter-icon',
  components: {
    AppIcon
  },
  props: {
    icon: null
  },
  data () {
    return {
    }
  }
}
</script>