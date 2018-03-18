<style lang="sass">
@import ../../../assets/sass/variables

.flagged-variant
  font-size: 12px

  a
    width: 305px
    color: $text-color !important
    text-decoration: none !important
    font-size: 12px
    cursor: pointer
    display: inline-block
    float: left
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

    .variant-number
      margin-right: 7px
      font-size: 12px
      line-height: 12px
      display: inline-block
      vertical-align: top
      margin-bottom: 1px

    .variant-symbols
      display: inline-block
      width: 270px
      vertical-align: top
      margin-top: -2px


    .variant-label
      display: inline-block

      .coord
        display: inline-block
        width: 122px
        line-height: 12px
        vertical-align: top
        &:hover
          text-decoration: underline !important
      .hgvs
        display: inline-block
        width: 122px
        line-height: 12px
        vertical-align: top
        &:hover
          text-decoration: underline !important
      .vep-consequence
        display: inline-block
        width: 122px
        line-height: 12px
        vertical-align: top
        &:hover
          text-decoration: underline !important
      .rsid
        display: inline-block
        width: 122px
        line-height: 12px
        vertical-align: top
        &:hover
          text-decoration: underline !important

      .af
        display: inline-block
        width: 45px
        vertical-align: top
        line-height: 12px

  #favorite-badge
    stroke: $sidebar-text-color

    &is-favorite
      fill: gold

  .favorite-indicator
    cursor: pointer
    display: inline-block
    padding-top: 18px

  .phenotype-symbol
    stroke: $sidebar-text-color

  .called-variant-indicator
    display: inline-block
    vertical-align: top

  .bookmark
    color: $bookmark-color
    opacity: .7
    font-size: 13px
    vertical-align: top
    float: left
    display: inline-block
    padding-top: 2px
    padding-right: 2px

</style>

<template>

  <div class="flagged-variant">
    <a  @click="onVariantSelected">
      <span class="variant-number">
        {{ variant.index + 1 }}.
      </span>

      <span class="variant-symbols">


        <svg
         v-if="clinvar == 'clinvar_path'"
         class="clinvar-badge" height="13" width="14">
          <g transform="translate(0,1)">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#clinvar-symbol" width="11" height="11" style="pointer-events: none; fill: rgb(173, 73, 74);"></use>
          </g>
        </svg>

        <svg
         v-if="clinvar == 'clinvar_lpath'"
         class="clinvar-badge" height="13" width="14">
          <g transform="translate(0,1)">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#clinvar-symbol" width="11" height="11" style="pointer-events: none; fill: rgb(251, 119, 55);"></use>
          </g>
        </svg>

        <svg
         v-if="variant.inheritance && variant.inheritance == 'recessive'"
         class="inheritance-badge" height="15" width="15">
          <g transform="translate(0,0)">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#recessive-symbol" width="16" height="16" style="pointer-events: none;"></use>
          </g>
        </svg>
        <svg
         v-if="variant.inheritance && variant.inheritance == 'denovo'"
         class="inheritance-badge" height="15" width="15">
          <g transform="translate(0,0)">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#denovo-symbol" width="16" height="16" style="pointer-events: none;"></use>
          </g>
        </svg>
        <svg
         v-if="variant.inheritance && variant.inheritance == 'x-linked'"
         class="inheritance-badge" height="15" width="15">
          <g transform="translate(0,0)">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#x-linked-symbol" width="16" height="16" style="pointer-events: none;"></use>
          </g>
        </svg>
        <svg
         v-if="variant.inheritance && variant.inheritance == 'compound het'"
         class="inheritance-badge" height="15" width="15">
          <g transform="translate(0,0)">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#compound-het-symbol" width="16" height="16" style="pointer-events: none;"></use>
          </g>
        </svg>

        <svg
         v-if="variant.type.toLowerCase() == 'snp' || variant.type.toLowerCase() == 'mnp'"
         class="impact-badge" height="12" width="13">
          <g transform="translate(1,4)">
            <rect width="8" height="8"
            v-bind:class="highestImpactClass"
            style="pointer-events: none;"></rect>
          </g>
        </svg>

        <svg
         v-if="variant.type.toLowerCase() == 'del'"
         class="impact-badge" height="12" width="13">
          <g transform="translate(5,5)">
            <path d="M0,-4.161791450287817L4.805622828269509,4.161791450287817 -4.805622828269509,4.161791450287817Z"
            v-bind:class="highestImpactClass">
            </path>
          </g>
        </svg>

        <svg
         v-if="variant.type.toLowerCase() == 'ins'"
         class="impact-badge" height="12" width="13">
          <g transform="translate(5,5)">
            <path d="M0,3.5682482323055424A3.5682482323055424,3.5682482323055424 0 1,1 0,-3.5682482323055424A3.5682482323055424,3.5682482323055424 0 1,1 0,3.5682482323055424Z"
            v-bind:class="highestImpactClass">
            </path>
          </g>
        </svg>

        <svg
         v-if="variant.type.toLowerCase() == 'complex'"
         class="impact-badge" height="13" width="13">
          <g transform="translate(5,6)">
            <path d="M0,-5.885661912765424L3.398088489694245,0 0,5.885661912765424 -3.398088489694245,0Z"
            v-bind:class="highestImpactClass">
            </path>
          </g>
        </svg>

        <svg v-if="zygosity.toUpperCase() == 'HOM'" width="24" height="14">
          <g transform="translate(0,3)">
            <rect width="24" height="10" class="zyg_hom" style="pointer-events: none;">
            </rect>
            <text x="1" y="8" style="fill: white; font-weight: bold; font-size: 9px;">
            Hom
            </text>
          </g>
        </svg>
        <svg v-if="zygosity.toUpperCase() == 'HET'" width="24" height="14">
          <g transform="translate(0,3)">
            <rect width="24" height="10" class="zyg_het" style="pointer-events: none;">
            </rect>
            <text x="2" y="8" style="fill: white; font-weight: bold; font-size: 9px;">
            Het
            </text>
          </g>
        </svg>

      </span>

      <span
       v-if="variant.fbCalled && variant.fbCalled == 'Y'"
      class="called-variant-indicator">
      </span>

      <span class="variant-label">
        <div style="display:inline-block;width:122px" >
          <span class="coord"> {{ variant.start + " " + variant.ref + "->" + variant.alt }} </span>
          <span class="hgvs">  {{ hgvsP }} </span>
        </div>
        <div style="display:inline-block;width:122px;vertical-align:top">
          <span class="vep-consequence">{{ vepConsequence }}</span>
          <span v-if="!isBasicMode" class="rsid">{{ rsId }}</span>
        </div>
        <span class="af">{{ afDisplay }}</span>
      </span>


    </a>

   <span v-if="!isBasicMode" class="favorite-indicator"
   style="float: right;">
    <svg class="favorite-badge"
     @click="toggleFavorite"
     height="16" width="16">
      <g transform="translate(0,0)">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#star-symbol" id="favorite-badge"
        width="16" height="16"
        v-bind:style="favoriteStyle"></use>
      </g>
    </svg>
  </span>

  </div>

</template>

<script>


export default {
  name: 'flagged-variant',
  components: {
  },
  props: {
    variant: null,
    isEduMode: null,
    isBasicMode: null
  },
  data () {
    return {
      favoriteStyle: null
    }
  },
  methods: {
    onVariantSelected: function(variant) {
      this.$emit("flagged-variant-selected", this.variant);
    },
    toggleFavorite: function() {
      this.variant.isFavorite = !this.variant.isFavorite;
      this.setFavoriteStyle();
    },
    setFavoriteStyle: function() {
      this.favoriteStyle = this.variant.isFavorite
        ? 'fill: gold; pointer-events: all'
        : 'fill: none; pointer-events: all';
    }

  },
  mounted: function() {
    this.setFavoriteStyle();

  },
  computed: {
    clinvar: function() {
      if (this.variant.isProxy) {
        if (this.variant.clinvarClinSig == "pathogenic") {
          return "clinvar_path";
        } else if (this.variant.clinvarClinSig == "likely pathogenic") {
          return "clinvar_lpath";
        } else {
          return "";
        }
      } else {
        return this.variant.clinvar;
      }
    },
    rsId: function() {
      if (this.variant.isProxy) {
        return this.variant.rsId;
      } else {
        return globalApp.utility.getRsId(this.variant);
      }
    },
    hgvsP: function() {
      if (this.variant.isProxy) {
        return globalApp.utility.formatHgvsP(this.variant, this.variant.HGVSp);
      } else {
        return this.variant.extraAnnot ? globalApp.utility.formatHgvsP(this.variant, this.variant.vepHGVSp) : "";
      }
    },
    vepConsequence: function() {
      if (this.variant.isProxy) {
        return this.variant.consequence;
      } else {
        return this.variant.vepConsequence ? Object.keys(this.variant.vepConsequence).join(" ").split("_").join(" ") : "";
      }
    },
    highestImpactClass: function() {
      let clazz = "filter-symbol";
      if (this.variant.isProxy) {
        clazz += " impact_" + this.variant.impact.toUpperCase();
      } else {
        for (var impact in this.variant.highestImpactVep) {
          if (clazz.length > 0) {
            clazz += " ";
          }
          clazz += "impact_" + impact.toUpperCase();
        }
      }
      return clazz;
    },
    afDisplay: function() {
      var label = this.isBasicMode ? "freq " : "af ";
      if (this.variant.isProxy) {
        return  label +  globalApp.utility.percentage(this.variant.afgnomAD ? this.variant.afgnomAD : 0);
      } else {
        return  label +  globalApp.utility.percentage(this.variant.afHighest ? this.variant.afHighest : 0);
      }
    },
    zygosity: function() {
      if (this.variant.isProxy) {
        return this.variant.zygosityProband.toUpperCase();
      } else {
        return this.variant.zygosity.toUpperCase();
      }
    }
  },
  watch: {
  }
}

</script>