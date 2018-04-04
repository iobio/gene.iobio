<style lang="sass">
@import ../../../assets/sass/variables

#legend
  margin: 10px


#legend-tooltip.tooltip
  font-size: 11px

#legend-placeholder.level-basic
  display: block !important

#legend.level-basic
  display: block !important
  margin-top: 40px
  margin-bottom: 40px


.legend-help-link
  font-size: 12px
  display: inline-block
  vertical-align: top

.legend-help
  font-size: 11px

.legend-symbol
  stroke: #000 !important
  stroke-width: 1.5px !important
  stroke-opacity: 0.3 !important

#close-legend
  float: right
  font-size: 15px
  color: $text-color !important

#show-legend
  color: $text-color !important
  font-size: 13px
  margin-left: 80px
  float: left


#close-legend
  float: right
  color: $text-color
  font-size: 18px

#legend
  .legend-element
    cursor: auto
    padding: 1px

    text
      cursor: auto
      fill:  $text-color
      font-size: 12px

  .legend-text
    color:  $text-color
    font-size: 12px
    cursor: auto


  .legend-label
    font-size: 13px
    color: $text-color
    margin-bottom: 5px
    cursor: auto


#legend

  .legend-symbol.exon
    cursor: pointer
    fill: rgba(93, 128, 157, 0.63)
    stroke: rgb(93, 128, 157)

  .exon-symbol
    text
      font-size: 14px
      fill: $text-color



</style>

<template>
  <div id="legend" >
    Legend
    <div style="margin-top:20px;display:flex;flex-wrap:wrap;justify-content:flex-start">


      <div v-if="isBasicMode" style="text-align:left;margin-right:10px">
        <div class="legend-label" style="width:130px">Exon (coding region)</div>
        <svg id="exon" class="exon-symbol legend-element pl-4" width="130" height="30">
          <rect class="legend-symbol exon" rx="1" ry="1" x="25" width="9" y="4" height="24">
          </rect>
          <line x1="0" x2="60" y1="17" y2="17" style="stroke: #b0b0b0;stroke-width: 1.5px;"></line>
        </svg>
      </div>


      <div v-if="!isBasicMode" style="text-align:left;width:150px;margin-right:10px;margin-bottom:15px">
        <div class="legend-label" style="width:130px">Inheritance</div>
          <svg id="autosomal-dominant" class="legend-element" width="150" height="16" transform="translate(0,0)">
            <g class="denovo" transform="translate(0,0)" style="opacity: 1;">
              <use xmlns:xlink="http://www.w4.org/1999/xlink" xlink:href="#autosomal-dominant-symbol" width="16" height="16"></use>
            </g>
            <text class="name" style="fill-opacity: 1;" x="20" y="11">Autosomal dominant</text></svg>
          </svg>
          <svg id="denovo" class="legend-element" width="150" height="16" transform="translate(0,0)">
            <g class="denovo" transform="translate(0,0)" style="opacity: 1;">
              <use xmlns:xlink="http://www.w4.org/1999/xlink" xlink:href="#denovo-symbol" width="16" height="16"></use>
            </g>
            <text class="name" style="fill-opacity: 1;" x="20" y="11">De novo</text></svg>
          </svg>
          <svg id="recessive" class="legend-element" width="150" height="16" transform="translate(0,0)">
            <g class=" recessive" style="opacity: 1;" transform="translate(0,0)">
              <use xmlns:xlink="http://www.w4.org/1999/xlink" xlink:href="#recessive-symbol" width="16" height="16"></use>
            </g>
            <text class="name" style="fill-opacity: 1;" x="20" y="11">Recessive</text></svg>
          </svg>
          <svg id="x-linked" class="legend-element" width="150" height="16" transform="translate(0,0)">
            <g class="denovo" transform="translate(0,0)" style="opacity: 1;">
              <use xmlns:xlink="http://www.w4.org/1999/xlink" xlink:href="#x-linked-symbol" width="16" height="16"></use>
            </g>
            <text class="name" style="fill-opacity: 1;" x="20" y="11">X-linked</text></svg>
          </svg>
          <svg id="compound-het" class="legend-element" width="150" height="16" transform="translate(0,0)">
            <g class="denovo" transform="translate(0,0)" style="opacity: 1;">
              <use xmlns:xlink="http://www.w4.org/1999/xlink" xlink:href="#compound-het-symbol" width="16" height="16"></use>
            </g>
            <text class="name" style="fill-opacity: 1;" x="20" y="11">Compound het</text></svg>
          </svg>
      </div>

      <div style="text-align:left;width:80px;margin-right:10px;margin-bottom:15px">
        <div class="legend-label">Impact</div>
        <svg id="HIGH" class="legend-element" width="80" height="14" transform="translate(0,0)">
          <text class="name" x="15" y="10" style="fill-opacity: 1;font-size: 12px;">High</text>
          <rect class="legend-symbol impact_HIGH" rx="1" ry="1" x="1" width="10" y="0" height="10" style="opacity: 1;"></rect>
        </svg>
        <svg id="MODERATE" class="legend-element" width="80" height="14" transform="translate(0,0)">
          <text class="name" x=15 y="10" style="fill-opacity: 1;font-size: 12px;">Moderate</text>
          <rect class="legend-symbol impact_MODERATE" rx="1" ry="1" x="1" width="10" y="0" height="10" style="opacity: 1;"></rect>
        </svg>
        <svg id="MODIFIER" class="legend-element" width="80" height="14" transform="translate(0,0)">
          <text class="name" x=15 y="10" style="fill-opacity: 1;font-size: 12px;">Modifier</text>
          <rect class="legend-symbol impact_MODIFIER" rx="1" ry="1" x="1" width="10" y="0" height="10" style="opacity: 1;"></rect>
        </svg>
        <svg id="LOW" class="  legend-element" width="80" height="14" transform="translate(0,0)">
          <text class="name" x="15" y="10" style="fill-opacity: 1;font-size: 12px;">Low</text>
          <rect class="legend-symbol  impact_LOW" rx="1" ry="1" x="1" width="10" y="0" height="10" style="opacity: 1;"></rect>
        </svg>
      </div>

      <div style="width:140px;margin-right:10px;margin-bottom:15px">
          <div class="legend-label">Clinvar</div>
            <svg id="clinvar_path" class="legend-element" width="110" height="14" transform="translate(0,0)">
            <g class="clinvar_path" transform="translate(1,0)" style="opacity: 1;">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#clinvar-symbol" width="11" height="11" style="fill: #ad494A;"></use>
            </g>
            <text class="name" style="fill-opacity: 1;" x="15" y="10">Pathogenic</text>

            </svg>

            <svg id="clinvar_lpath" class="legend-element" width="140" height="14" transform="translate(0,0)">
            <g class="clinvar_lpath" transform="translate(1,0)" style="opacity: 1;">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#clinvar-symbol" width="11" height="11" style="fill: #FB7737;"></use>
            </g>
            <text class="name" style="fill-opacity: 1;" x="15" y="10">Likely Pathogenic</text>
            </svg>

            <svg id="clinvar_uc" class="legend-element" width="140" height="14" transform="translate(0,0)">
              <g class="clinvar_uc" transform="translate(1,0)" style="opacity: 1;">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#clinvar-symbol" width="11" height="11" style="fill:rgba(231, 186, 82, 1);"></use>
              </g>
              <text class="name" style="fill-opacity: 1;" x="15" y="10">Unknown significance </text>
            </svg>

            <svg id="clinvar_cd" class="legend-element" width="110" height="14" transform="translate(0,0)">
              <g class="clinvar_cd" transform="translate(1,0)" style="opacity: 1;">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#clinvar-symbol" width="11" height="11" style="fill: rgb(111, 182, 180);"></use>
              </g>
              <text class="name" style="fill-opacity: 1;" x="15" y="10">Conflicting data</text>
            </svg>


            <svg id="clinvar_other" class="legend-element" width="73" height="14" transform="translate(0,0)">
              <g class="clinvar_other" transform="translate(1,0)" style="opacity: 1;">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#clinvar-symbol" width="11" height="11" style="fill: rgb(189, 189, 189);"></use>
              </g>
              <text class="name" style="fill-opacity: 1;" x="15" y="10">Other </text>
            </svg>

            <svg id="clinvar_benign" class="legend-element" width="73" height="14" transform="translate(0,0)">
              <g class="clinvar_benign" transform="translate(1,0)" style="opacity: 1;">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#clinvar-symbol" width="11" height="11" style="fill: rgba(156, 194, 49, 1);"></use>
              </g>
              <text class="name" style="fill-opacity: 1;" x="15" y="10">Benign</text>
            </svg>

            <svg id="clinvar_lbenign" class="legend-element" width="93" height="14" transform="translate(0,0)">
              <g class="clinvar_lbenign" transform="translate(1,0)" style="opacity: 1;">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#clinvar-symbol" width="11" height="11" style="fill: rgba(181, 207, 107, 1);"></use>
              </g>
              <text class="name" style="fill-opacity: 1;" x="15" y="10">Likely Benign</text>
            </svg>
      </div>

      <div v-if="!isBasicMode" style="width:150px;margin-right:10px;">
          <div class="legend-label">Coverage</div>
          <svg height="36" width="150" class="gene-badge-coverage-problem legend-element" >
            <g transform="translate(0,1)">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#trending-down-symbol" width="13" height="13"  style="pointer-events: none;">
              </use>
            </g>
            <text class="name" style="fill-opacity: 1;" x="17" y="11">Insufficient coverage</text>
            <text class="name" style="fill-opacity: 1;" x="17" y="23">in exons</text>
          </svg>
      </div>

      <div style="text-align:left;width:80px;margin-right:10px;margin-bottom:15px">
          <div class="legend-label">Type</div>
          <svg id="snp" class="  legend-element" width="80" height="14" transform="translate(0,0)">
            <text class="name" x="15" y="10" style="fill-opacity: 1;font-size: 12px;">SNP</text>
            <rect class="legend-symbol snp" rx="2" ry="1" x="1" width="10" y="1" height="10" style="opacity: 1; fill: none; stroke: rgb(0, 0, 0); stroke-width: 1px;"></rect>
          </svg>

          <svg id="ins" class="  legend-element" width="80" height="14" transform="translate(0,0)">
            <text class="name" x="15" y="10" style="fill-opacity: 1;font-size: 12px;"> Insertion</text>
            <circle class="legend-symbol ins" cx="5" cy="5" r="5" style="fill: none; stroke: rgb(0, 0, 0); stroke-width: 1px; opacity: 1;"></circle>
          </svg>

          <svg id="del" class="  legend-element" width="80" height="14" transform="translate(0,0)">
            <text class="name" x="15" y="10" style="fill-opacity: 1;font-size: 12px;">Deletion</text>

            <polygon class="legend-symbol del  legend-element" points="0,10 5,0 10,10" rx="1" ry="1" x="1" y="2" style="fill: none; stroke: rgb(0, 0, 0); stroke-width: 1px; opacity: 1;">
            </polygon>
          </svg>

          <svg id="complex" class="  legend-element" width="80" height="14" transform="translate(0,0)">
            <text class="name" x="15" y="11" style="fill-opacity: 1;font-size: 12px;">Complex</text>
            <g transform="translate(7,6)">
              <path d="M0,-6.771323825530848L5.79617697938849,0 0,6.771323825530848 -5.79617697938849,0Z" class="legend-symbol complex" style="opacity: 1;fill: none;stroke-width: 1.5px !important;"></path>
            </g>
          </svg>
      </div>

      <div v-if="!isBasicMode" style="width:140px;margin-right:10px;margin-bottom:15px">
        <div class="legend-label">Allele Frequency</div>
        <svg id="afexac_unique" class="legend-element" width="70" height="14" transform="translate(0,0)">
          <text class="name" x="20" y="11" style="fill-opacity: 1;">&lt; 5%</text>
          <g class=" afexac_unique">
            <use xmlns:xlink="http://www.w4.org/1999/xlink" xlink:href="#af-symbol" width="12" height="12" style="fill: rgb(199, 0, 1);"></use>
          </g>
        </svg>



      </div>





      <div v-if="!isBasicMode" style="width:150px;margin-right:10px;margin-bottom:10px">
        <div class="legend-label">PolyPhen</div>
        <svg id="polyphen_probably_damaging" class="legend-element " width="130" height="14" transform="translate(0,0)">
          <g class="polyphen_probably_damaging" transform="translate(1,0)" style="opacity: 1;">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#biohazard-symbol" width="12" height="12" style="fill: #ad494A"></use>
          </g>
          <text class="name" style="fill-opacity: 1;" x="15" y="10">Probably damaging</text>
        </svg>

        <svg id="polyphen_possibly_damaging" class="legend-element " width="130" height="14" transform="translate(0,0)">
          <g class="polyphen_possibly_damaging" transform="translate(1,0)" style="opacity: 1;">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#biohazard-symbol" width="12" height="12" style="fill: #FB7737"></use>
          </g>
          <text class="name" style="fill-opacity: 1;" x="17" y="10">Possibly damaging</text>
        </svg>

        <svg id="polyphen_benign" class="legend-element " width="130" height="14" transform="translate(0,0)">
          <g class="polyphen_benign" transform="translate(1,0)" style="opacity: 1;">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#biohazard-symbol" width="12" height="12" style="fill: rgba(181, 207, 107,1)"></use>
          </g>
          <text class="name" style="fill-opacity: 1;" x="15" y="10">Benign</text>
        </svg>
      </div>

      <div v-if="!isBasicMode"  style="width:160px;margin-right:10px;margin-bottom:10px">
        <div class="legend-label">SIFT</div>
        <svg id="sift_deleterious" class="legend-element " width="110" height="14" transform="translate(0,0)">
          <g class="sift_deleterious" transform="translate(1,0)" style="opacity: 1;">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#danger-symbol" width="12" height="12" style="fill: #ad494A"></use>
          </g>
          <text class="name" style="fill-opacity: 1;" x="14" y="9">Deleterious</text>
        </svg>

        <svg id="sift_deleterious_low_confidence" class="legend-element " height="14" width="175"  transform="translate(0,0)">
          <g class="sift_deleterious_low_confidence" transform="translate(1,0)" style="opacity: 1;">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#danger-symbol" width="12" height="12" style="fill: #FB7737"></use>
          </g>
          <text class="name" style="fill-opacity: 1;" x="15" y="9">Deleterious (low confidence)</text>
        </svg>

        <svg id="sift_tolerated" class="legend-element " width="67" height="14" transform="translate(0,0)">
          <g class="sift_tolerated" transform="translate(1,0)" style="opacity: 1;">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#danger-symbol" width="12" height="12" style="fill: rgba(181, 207, 107,1)"></use>
          </g>
          <text class="name" style="fill-opacity: 1;" x="14" y="9">Tolerated</text>
        </svg>

        <svg id="sift_tolerated_low_confidence" class="legend-element " height="14" width="180" transform="translate(0,0)">
          <g class="sift_tolerated_low_confidence" transform="translate(1,0)" style="opacity: 1;">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#danger-symbol" width="12" height="12" style="fill: rgba(231,186,82,1)"></use>
          </g>
          <text class="name" style="fill-opacity: 1;" x="15" y="9">Tolerated (low confidence)</text>
        </svg>
      </div>




    </div>


  </div>
</template>

<script>
export default {
  name: 'legend-panel',
  components: {
  },
  props: {
    isBasicMode: null
  },
  data () {
      return {
      }
  },
  watch: {
  },
  methods: {
  },
  mounted: function() {
  }
}

</script>