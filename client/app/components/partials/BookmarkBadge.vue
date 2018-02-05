<style lang="sass">
@import ../../../assets/sass/variables

.bookmark-badge
  font-size: 12px

  a.bookmark
    color: $text-color !important
    text-decoration: none !important
    font-size: 12px
    cursor: pointer
    display: inline-block
    float: left
    width: 100%
    text-align: left
    padding-top: 4px
    margin-left: 0px
    padding-left: 1px

    span.not-found
      color: #c70001
      font-style: italic
      padding-left: 6px
      display: inline-block
      vertical-align: top

    .bookmark-number
      margin-right: 7px
      font-size: 12px
      line-height: 12px
      display: inline-block
      vertical-align: top
      margin-bottom: 1px

    .variant-symbols
      display: inline-block
      width: 50px
      vertical-align: top
      margin-top: -2px


    .variant-label
      display: inline-block

      .coord
        display: inline-block
        width: 97px
        line-height: 12px
        vertical-align: top
        &:hover
          text-decoration: underline !important
      .hgvs
        margin-left: 3px
        display: inline-block
        width: 70px
        line-height: 12px
        vertical-align: top
        &:hover
          text-decoration: underline !important
      .vep-consequence
        display: inline-block
        width: 97px
        line-height: 12px
        vertical-align: top
        &:hover
          text-decoration: underline !important
      .rsid
        display: inline-block
        margin-left: 3px
        width: 70px
        line-height: 12px
        vertical-align: top
        &:hover
          text-decoration: underline !important


  .phenotype-symbol
    stroke: $sidebar-text-color

  .bookmark-call-button
    margin: 0px 0px 0px 12px
    padding: 0px 8px 0px 8px

  .called-variant-indicator
    display: inline-block
    vertical-align: top

  #favorite-badge
    stroke: $sidebar-text-color

    &is-favorite
      fill: gold

  .favorite-indicator
    cursor: pointer
    float: right
    display: inline-block
    vertical-align: top
    margin-top: -2px
    margin-left: 5px
    margin-right: 5px

  i#remove-bookmark
    color: #E0292B !important
    font-weight: bold
    font-size: 13px
    display: none
    float: right
    padding-top: 3px

</style>

<template>

  <div class="bookmark-badge">
    <a class="bookmark">
      <span class="bookmark-number">
        {{ index+1 }}.
      </span>

      <span class="variant-symbols">
        <svg
         v-if="bookmark.variant.type == 'snp'"
         class="impact-badge" height="12" width="13">
          <g transform="translate(1,3)">
            <rect width="8" height="8"
            v-bind:class="highestImpactClass"
            style="pointer-events: none;"></rect>
          </g>
        </svg>

        <svg
         v-if="bookmark.variant.type == 'del'"
         class="impact-badge" height="12" width="13">
          <g transform="translate(5,6)">
            <path d="M0,-4.161791450287817L4.805622828269509,4.161791450287817 -4.805622828269509,4.161791450287817Z"
            v-bind:class="highestImpactClass">
            </path>
          </g>
        </svg>

        <svg
         v-if="bookmark.variant.type == 'ins'"
         class="impact-badge" height="12" width="13">
          <g transform="translate(5,6)">
            <path d="M0,3.5682482323055424A3.5682482323055424,3.5682482323055424 0 1,1 0,-3.5682482323055424A3.5682482323055424,3.5682482323055424 0 1,1 0,3.5682482323055424Z"
            v-bind:class="highestImpactClass">
            </path>
          </g>
        </svg>

        <svg
         v-if="bookmark.variant.type == 'complex'"
         class="impact-badge" height="12" width="13">
          <g transform="translate(5,6)">
            <path d="M0,-5.885661912765424L3.398088489694245,0 0,5.885661912765424 -3.398088489694245,0Z"
            v-bind:class="highestImpactClass">
            </path>
          </g>
        </svg>

        <svg
         v-if="bookmark.variant.clinvar && bookmark.variant.clinvar == 'clinvar_path'"
         class="clinvar-badge" height="12" width="13">
          <g transform="translate(0,1)">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#clinvar-symbol" width="10" height="10" style="pointer-events: none; fill: rgb(173, 73, 74);"></use>
          </g>
        </svg>

        <svg
         v-if="bookmark.variant.inheritance && bookmark.variant.inheritance == 'recessive'"
         class="inheritance-badge" height="13" width="13">
          <g transform="translate(0,0)">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#recessive-symbol" width="15" height="15" style="pointer-events: none;"></use>
          </g>
        </svg>
        <svg
         v-if="bookmark.variant.inheritance && bookmark.variant.inheritance == 'denovo'"
         class="inheritance-badge" height="13" width="13">
          <g transform="translate(0,0)">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#denovo-symbol" width="15" height="15" style="pointer-events: none;"></use>
          </g>
        </svg>
      </span>

      <span
       v-if="bookmark.variant.fbCalled && bookmark.variant.fbCalled == 'Y'"
      class="called-variant-indicator">
      </span>

      <span class="variant-label">
        <div style="display:inline-block" >
          <span class="coord"> {{ bookmark.variant.start + " " + bookmark.variant.ref + "->" + bookmark.variant.alt }} </span>
          <span class="hgvs">  {{ hgvsP }} </span>
        </div>
        <div>
          <span class="vep-consequence">{{ vepConsequence }}</span>
          <span class="rsid">{{ rsId }}</span>
        </div>
      </span>

      <span
       v-if="bookmark.variant == null"
       class="not-found">
        Variant not found
      </span>
      <span class="favorite-indicator"
       style="float: right;">
        <svg class="favorite-badge" height="15" width="14">
          <g transform="translate(0,0)">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#star-symbol" id="favorite-badge"
            width="14" height="14"
            v-bind:style="favoriteStyle"></use>
          </g>
        </svg>
        <i class="material-icons" id="remove-bookmark">close</i>
      </span>
    </a>
  </div>

</template>

<script>


export default {
  name: 'bookmark-badge',
  components: {
  },
  props: {
    bookmark: null,
    index: null
  },
  data () {
    return {
    }
  },
  methods: {

  },
  mounted: function() {
  },
  computed: {
    rsId: function() {
      return this.bookmark && this.bookmark.variant ? utility.getRsId(this.bookmark.variant) : "";
    },
    hgvsP: function() {
      return this.bookmark && this.bookmark.variant && this.bookmark.variant.extraAnnot ? utility.formatHgvsP(this.bookmark.variant, this.bookmark.variant.vepHGVSp) : "";
    },
    vepConsequence: function() {
      return this.bookmark.variant && this.bookmark.variant.vepConsequence ? Object.keys(this.bookmark.variant.vepConsequence).join(" ") : "";
    },
    highestImpactClass: function() {
      let clazz = "filter-symbol";
      for (var impact in this.bookmark.variant.highestImpactVep) {
        if (clazz.length > 0) {
          clazz += " ";
        }
        clazz += "impact_" + impact.toUpperCase();
      }
      return clazz;
    },
    favoriteStyle: function() {
      return this.bookmark.isFavorite ? 'fill: gold; pointer-events: none' : 'fill: none; pointer-events: none';
    }

  },
  watch: {
  }
}

</script>