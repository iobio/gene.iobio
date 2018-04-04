<style lang="sass" scoped>

@import ../../../assets/sass/variables



</style>
<template>

  <span>

    <span v-if="icon == 'pathogenic'">
      <svg>
        <g transform="translate(1,0)">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#clinvar-symbol" width="18" height="18" style="pointer-events: none; fill: rgb(173, 73, 74);">
          </use>
        </g>
      </svg>
    </span>

    <span v-if="icon == 'autosomalDominant'">
      <svg id="autosomal-dominant-badge" class="inheritance-badge">
        <g transform="translate(0,0)">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#autosomal-dominant-symbol" width="20" height="20" style="pointer-events: none;">
          </use>
        </g>
      </svg>
    </span>

    <span v-if="icon == 'denovo'">
      <svg id="denovo-badge" class="inheritance-badge">
        <g transform="translate(0,0)">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#denovo-symbol" width="20" height="20" style="pointer-events: none;">
          </use>
        </g>
      </svg>
    </span>

    <span v-if="icon == 'recessive'">
      <svg id="recessive-badge" class="inheritance-badge">
        <g transform="translate(0,0)">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#recessive-symbol" width="20" height="20" style="pointer-events: none;">
          </use>
        </g>
      </svg>
    </span>


    <span v-if="icon == 'xlinked'">
      <svg id="xlinked-badge" class="inheritance-badge">
        <g transform="translate(0,0)">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#x-linked-symbol" width="20" height="20" style="pointer-events: none;">
          </use>
        </g>
      </svg>
    </span>

    <span v-if="icon == 'compoundHet'">
      <svg id="compoundHet-badge" class="inheritance-badge">
        <g transform="translate(0,0)">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#compound-het-symbol" width="20" height="20" style="pointer-events: none;">
          </use>
        </g>
      </svg>
    </span>


    <span v-if="icon == 'highOrModerate'" >
      <svg>
        <g transform="translate(0,8)">
          <rect width="9" height="9" class="filter-symbol impact_HIGH snp" style="pointer-events: none;"></rect>
        </g>
        <g transform="translate(10,8)">
          <rect width="9" height="9" class="filter-symbol impact_MODERATE snp" style="pointer-events: none;"></rect>
        </g>
      </svg>
    </span>


    <span v-if="icon == 'coverage'">
      <svg class="gene-badge-coverage-problem" >
        <g transform="translate(0,1)">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#trending-down-symbol" width="17" height="17"  style="pointer-events: none;">
          </use>
        </g>
      </svg>
    </span>

  </span>
</template>

<script>

export default {
  name: 'filter-icon',
  components: {
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