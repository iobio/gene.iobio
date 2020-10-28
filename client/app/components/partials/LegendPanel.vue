<style lang="sass">
@import ../../../assets/sass/variables

#legend
  margin-left: 10px
  margin-right: 10px
  margin-top: 5px
  margin-bottom: 0px

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



  .called-variant
    font-size: 15px
    color: $called-variant-color
    vertical-align: top

  .legend-text
    color:  $text-color
    font-size: 12px
    cursor: auto
    vertical-align: top


  .legend-label
    font-size: 13px
    color: $text-color
    margin-bottom: 5px
    cursor: auto
    line-height: 15px


#legend

  .legend-symbol.exon
    cursor: pointer
    fill: rgba(93, 128, 157, 0.63)
    stroke: rgb(93, 128, 157)

  .exon-symbol
    text
      font-size: 12px
      fill: $text-color


.legend-wrap-text
  display: inline-block !important
  line-height: 12px !important

.clinvar-legend
  width: 150px
  margin-right:  10px
  margin-bottom:  15px

  &.narrow
    width: 115px
    margin-bottom: 0px

  .legend-text
    padding-top: 2px
    display: inline-block

.legend-title
  color:  $app-color

</style>

<template>
  <div id="legend" >



    <div class="legend-title" v-if="showLegendTitle" :style="isBasicMode || isSimpleMode? 'margin-bottom:10px;' : 'margin-bottom:20px'">
    Legend
    </div>
    <div style="display:flex;flex-wrap:wrap;justify-content:flex-start">


      <div v-if="isBasicMode || isSimpleMode" style="text-align:left;margin-right:20px;margin-left:0px;margin-bottom:20px;margin-top:-5px">
        <svg id="exon" class="exon-symbol legend-element" width="200" height="50">
          <rect class="legend-symbol exon" rx="1" ry="1" x="100" width="50" y="8" height="16">
          </rect>
          <line x1="0" x2="200" y1="17" y2="17" style="stroke: #b0b0b0;stroke-width: 1.5px;"></line>
          <text  x="0" y="40">Intron</text>
          <text  x="100" y="40">Exon</text>
        </svg>
        <div style="display:flex;width:200px">
          <div class="legend-text" style="width:50%;line-height:12.5px">Part of gene that does not encode a protein.</div>
          <div class="legend-text" style="width:50%;line-height:12.5px">Part of gene that encodes how to produce a protein.</div>
        </div>
      </div>

      <div style="text-align:left;width:80px;margin-right:10px;margin-bottom:15px">
        <div v-if="!isBasicMode" class="legend-label">Impact
         <info-popup name="impact"></info-popup>
        </div>
        <div v-if="isBasicMode" class="legend-label">Predicted Impact</div>


        <legend-icon
         icon="impact"
         type="snp"
         clazz="impact_HIGH"
         width="14"
         height="14"
         label="High">
        </legend-icon>
        <legend-icon
         icon="impact"
         type="snp"
         clazz="impact_MODERATE"
         width="14"
         height="14"
         label="Moderate">
        </legend-icon>
        <legend-icon
         icon="impact"
         type="snp"
         clazz="impact_MODIFIER"
         width="14"
         height="14"
         label="Modifier">
        </legend-icon>
        <legend-icon
         icon="impact"
         type="snp"
         clazz="impact_LOW"
         width="14"
         height="14"
         label="Low">
        </legend-icon>
        <legend-icon
            icon="impact"
            type="snp"
            clazz="impact_UNKNOWN"
            width="14"
            height="14"
            label="Unknown">
        </legend-icon>

      </div>
      <div v-if="!isBasicMode && !isSimpleMode" style="text-align:left;width:150px;margin-right:10px;margin-bottom:15px">
        <div class="legend-label" style="width:130px">Inheritance
            <info-popup name="inheritance"></info-popup>
          </div>

        <legend-icon
         icon="autosomal dominant"
         width="16"
         height="16"
         label="Autosomal dominant">
        </legend-icon>
        <legend-icon
         icon="denovo"
         width="16"
         height="16"
         label="De novo">
        </legend-icon>
        <legend-icon
         icon="recessive"
         width="16"
         height="16"
         label="Recessive">
        </legend-icon>
        <legend-icon
         icon="x-linked"
         width="16"
         height="16"
         label="X-linked">
        </legend-icon>
        <legend-icon
         icon="compound-het"
         width="16"
         height="16"
         label="Compound het">
        </legend-icon>
     </div>



      <div :class="{'clinvar-legend': true}">
          <div class="legend-label">ClinVar
            <info-popup name="clinvar"></info-popup>
          </div>

          <div>
            <legend-icon
            style="display:inline-block"
            icon="clinvar"
            width="12"
            height="12"
            level="high"
            label="Pathogenic">
            </legend-icon>
          </div>

         <div>
            <legend-icon
            style="display:inline-block"
            icon="clinvar"
            width="12"
            height="12"
            level="likely-high"
            label="Likely pathogenic">
            </legend-icon>
          </div>

          <legend-icon v-if="!isBasicMode && !isSimpleMode"
          icon="clinvar"
          width="12"
          height="12"
          level="unknown-significance"
          label="Unknown significance">
          </legend-icon>

          <legend-icon v-if="!isBasicMode && !isSimpleMode"
          icon="clinvar"
          width="12"
          height="12"
          level="conflicting"
          label="Conflicting data">
          </legend-icon>

          <legend-icon v-if="!isBasicMode && !isSimpleMode"
          icon="clinvar"
          width="12"
          height="12"
          level="other"
          label="Other">
          </legend-icon>

          <legend-icon v-if="!isBasicMode && !isSimpleMode"
          icon="clinvar"
          width="12"
          height="12"
          level="low"
          label="Benign">
          </legend-icon>

          <legend-icon v-if="!isBasicMode && !isSimpleMode"
          icon="clinvar"
          width="12"
          height="12"
          level="likely-low"
          label="Likely benign">
          </legend-icon>
      </div>

      <div style="text-align:left;margin-bottom:15px">
        <div  class="legend-label">Evidence for Pathogenic
          <info-popup style="padding-left:1px" name="evidence"></info-popup>
        </div>
          <legend-icon
              icon="evidence"
              width="16"
              height="16"
              class="level-high"
              label="Strong evidence"></legend-icon>
          <legend-icon
              icon="evidence"
              width="16"
              height="16"
              class="level-likely-high"
              label="Moderate evidence"></legend-icon>
          <legend-icon
              icon="evidence"
              width="16"
              height="16"
              class="level-medium"
              label="Supporting evidence"></legend-icon>
      </div>

      <div style="text-align:left;width:105px;margin-bottom:15px">
          <div class="legend-label">Variant type
            <info-popup name="variantType"></info-popup>
          </div>

        <div style="display:flex">
          <legend-icon
           style="display:inline-block"
           icon="impact"
           type="snp"
           level="none"
           width="14"
           height="14"
           label="SNP">
          </legend-icon>
        </div>

        <legend-icon
         icon="impact"
         type="del"
         level="none"
         width="16"
         height="16"
         label="Deletion">
        </legend-icon>

        <legend-icon
         icon="impact"
         type="ins"
         level="none"
         width="16"
         height="16"
         label="Insertion">
        </legend-icon>

        <legend-icon
         icon="impact"
         type="complex"
         level="none"
         width="18"
         height="18"
         label="Complex">
        </legend-icon>

      </div>

      <div v-if="!isBasicMode && !isSimpleMode" style="width:70px;margin-right:10px;margin-bottom:15px">
        <div class="legend-label">Allele Frequency</div>
        <legend-icon
          icon="af"
          width="12"
          height="12"
          level="high"
          label="< 5%">
        </legend-icon>
      </div>

      <div v-if="!isBasicMode && !isSimpleMode" style="width:120px;margin-right:10px;margin-bottom:15px">
        <div class="legend-label">Called variant</div>
        <legend-icon
          icon="called-variant"
          label="Variants called from alignments"
          wrapLabel="true">
        </legend-icon>
      </div>

      <div v-if="!isBasicMode && !isSimpleMode" style="width:80px;margin-right:0px;margin-bottom:15px">
          <div class="legend-label">Coverage</div>

          <legend-icon
            icon="coverage"
            width="13"
            height="13"
            level="high"
            wrapLabel="true"
            label="Insufficient coverage in exons">
          </legend-icon>

      </div>


      <div v-if="!isBasicMode && !isSimpleMode" style="width:170px;margin-right:10px;margin-bottom:10px">
        <div class="legend-label">Zygosity</div>

        <legend-icon
         icon="zygosity"
         type="het"
         height="14" width="24"
         iconStyle="margin-top:-2px"
         label="Heterozygous alternate">
        </legend-icon>


        <legend-icon
         icon="zygosity"
         type="hom"
         height="14" width="24"
         iconStyle="margin-top:-2px"
         label="Homozygous alternate">
        </legend-icon>
      </div>

     <div v-if="!isBasicMode && !isSimpleMode && false" style="width:150px;margin-right:10px;margin-bottom:15px">
       <div class="legend-label">Affected Siblings</div>
        <legend-icon id="thumbs-green-symbol"
         icon="thumbs-up"
         width="14"
         height="14"
         wrapWidth="130"
         wrapLabel="true"
         label="All affected sibs have variant">
        </legend-icon>
        <legend-icon
         icon="thumbs-down"
         width="14"
         height="14"
         wrapLabel="true"
         wrapWidth="130"
         label="None of affected sibs have variant">
        </legend-icon>
        <legend-icon
         icon="question-mark"
         width="14"
         height="14"
         wrapWidth="130"
         wrapLabel="true"
         label="Only some affected sibs have variant">
        </legend-icon>
      </div>


     <div v-if="!isBasicMode && !isSimpleMode && false" style="width:150px;margin-right:10px;margin-bottom:15px">
       <div class="legend-label">Unaffected Siblings</div>
        <legend-icon id="thumbs-green-symbol"
         icon="thumbs-up"
         width="14"
         height="14"
         wrapWidth="130"
         wrapLabel="true"
         label="None of unaffected sibs have variant">
        </legend-icon>
        <legend-icon
         icon="thumbs-down"
         width="14"
         height="14"
         wrapWidth="130"
         wrapLabel="true"
         label="All unaffected sibs have variant">
        </legend-icon>
        <legend-icon
         icon="question-mark"
         width="14"
         height="14"
         wrapWidth="130"
         wrapLabel="true"
         label="Some unaffected sibs have variant">
        </legend-icon>
      </div>

      <div v-if="!isBasicMode" v-show="false" style="width:150px;margin-right:10px;margin-bottom:10px">
        <div class="legend-label">PolyPhen</div>

          <legend-icon
            icon="polyphen"
            width="12"
            height="12"
            level="high"
            label="Probably damaging">
          </legend-icon>


          <legend-icon
            icon="polyphen"
            width="12"
            height="12"
            level="likely-high"
            label="Possibly damaging">
          </legend-icon>

          <legend-icon
            icon="polyphen"
            width="12"
            height="12"
            level="low"
            label="Benign">
          </legend-icon>
      </div>

      <div v-if="!isBasicMode && !isSimpleMode" v-show="false" style="width:180px;margin-right:10px;margin-bottom:10px">
        <div class="legend-label">SIFT</div>


          <legend-icon
            icon="sift"
            width="12"
            height="12"
            level="high"
            label="Deleterious">
          </legend-icon>

          <legend-icon
            icon="sift"
            width="12"
            height="12"
            level="likely-high"
            label="Deleterious (low confidence)">
          </legend-icon>

          <legend-icon
            icon="sift"
            width="12"
            height="12"
            level="low"
            label="Tolerated">
          </legend-icon>

          <legend-icon
            icon="sift"
            width="12"
            height="12"
            level="medium"
            label="Tolerated (low confidence)">
          </legend-icon>
      </div>




    </div>


  </div>
</template>

<script>

import LegendIcon from "../partials/LegendIcon.vue"
import AppIcon from "../partials/AppIcon.vue"
import InfoPopup from "../partials/InfoPopup.vue"

export default {
  name: 'legend-panel',
  components: {
    AppIcon,
    LegendIcon,
    InfoPopup
  },
  props: {
    isBasicMode: null,
    isSimpleMode: null,
    showLegendTitle: true
  },
  data () {
      return {
      }
  },
  watch: {
  },
  computed: {
  },
  methods: {
  },
  mounted: function() {
  }
}

</script>
