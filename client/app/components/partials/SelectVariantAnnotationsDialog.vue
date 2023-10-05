<style lang="sass">
@import ../../../assets/sass/variables

#select-variant-annot-container
  #select-variant-annot-dialog-divider
    margin-top: 10px !important
    margin-bottom: 1px !important

.checkbox-container .checkbox-label 
  display: flex
  align-items: flex-start
  margin-bottom: 10px


.checkbox-container input 
  margin-right: 8px !important


.checkbox-container label 
  font-size: 12px !important
  color: $text-color !important

.subtitle
  font-size: 15px !important

.apply-btn
  background-color: #30638e !important
  color: white !important


</style>

<template>
    <v-dialog 
    v-model="showSelectVariantAnnotationDialog" 
    :close-on-content-click="false" 
    :persistent="true"
    class="variant-annotation-dialog" 
    width="750px">

      <v-card id="select-variant-annot-container">
        <div class="container">
          <v-card-title class="headline" style="padding-top: 10px;">
            <span style="padding-left:3px">
              Select Annotations
            </span>
          </v-card-title>
        </div>

        <v-divider id="select-variant-annot-dialog-divider"></v-divider>
       
        <v-card-title class="subtitle" style="padding-top: 10px; margin-left:20px;">Variant Annotations(From VCF file)</v-card-title>
        <div style="max-height: 180px; overflow-y: scroll;">
          <div class="checkbox-container" style="padding-top:15px; margin-left:20px;">
            <div v-for="key in Object.keys(infoObject)" :key="key" class="checkbox-label">
              <input
                type="checkbox"
                :id="key"
                :value="{ key, value: infoObject[key] }"
                v-model="selectedInfo"
              />
              <label :for="key">{{ infoObject[key] }} ({{ key }})</label>
            </div>
          </div>
        </div>
        
        <v-card-title class="subtitle" style="padding-top: 10px; margin-left:20px;">Genotype Annotations(From VCF file)</v-card-title>
        <div style="max-height: 180px; overflow-y: scroll;">
          <div class="checkbox-container" style="padding-top:15px; margin-left:20px;">
            <div v-for="key in Object.keys(formatObject)" :key="key" class="checkbox-label">
              <input
                type="checkbox"
                :id="key"
                :value="{ key, value: formatObject[key] }"
                v-model="selectedFormat"
              />
              <label :for="key">{{ formatObject[key] }} ({{ key}})</label>
            </div>
          </div>
        </div>

        <v-card-title v-if="Object.keys(variantAnnotationsMap).length > 0" class="subtitle" style="padding-top: 10px; margin-left:20px;">Variant Annotations(From Mosaic)</v-card-title>
        <div style="max-height: 180px; overflow-y: scroll;">
          <div class="checkbox-container" style="padding-top:15px; margin-left:20px;">
            <div v-if="Object.keys(variantAnnotationsMap).length > 0" v-for="key in Object.keys(variantAnnotationsMap)" :key="key" class="checkbox-label">
              <input
                type="checkbox"
                :id="key"
                :value="{ key: variantAnnotationsMap[key].uid, value: variantAnnotationsMap[key].name }"
                v-model="selectedMosaicVariantAnnotations"
              />
              <label :for="key">{{ variantAnnotationsMap[key].name }} </label>
            </div>
          </div>
        </div>
        
        
        <v-card-actions class="justify-end">
          <v-btn @click="applyAnnotations" class="apply-btn">Apply</v-btn>
          <v-btn @click="cancelAnnotations">Cancel</v-btn>
        </v-card-actions>
        
      </v-card>
    </v-dialog>
</template>
  
<script>

  export default {
    name: 'select-variant-annotations-dialog',

    props: {
      showDialog: null,
      cohortModel: Object,
      selectedVariantRelationship: String,
      variantAnnotationsMap: Object,
      selectedVariantInfo: null,
      selectedVariantFormat: null,
      selectedVariantMosaic: null,

    },
    data() {
      return {

        showSelectVariantAnnotationDialog: false,
        infoObject: {},
        formatObject: {},


        selectedInfo: this.selectedVariantInfo,
        selectedFormat: this.selectedVariantFormat,
        selectedMosaicVariantAnnotations: this.selectedVariantMosaic,
    
        
      };
    },

    methods: {
      getInfoObject() {
        this.infoObject = this.cohortModel.getModel(this.selectedVariantRelationship).vcf.infoFields.INFO;
        return this.infoObject;
      },

      getFormatObject() {
        this.formatObject = this.cohortModel.getModel(this.selectedVariantRelationship).vcf.infoFields.FORMAT;
        return this.formatObject;
      },

      cancelAnnotations() {
        this.selectedInfo = [];
        this.selectedFormat = [];
        this.selectedMosaicVariantAnnotations = [];
        this.$emit('close-variant-annot-dialog', this.selectedInfo, this.selectedFormat, this.selectedMosaicVariantAnnotations);
      },

      applyAnnotations() {
        this.$emit('apply-variant-annot-dialog', this.selectedInfo, this.selectedFormat, this.selectedMosaicVariantAnnotations);
      },
      
    },

    mounted() {
      this.getInfoObject();
      this.getFormatObject();
    },

    watch: {
      showDialog: function() {
        this.showSelectVariantAnnotationDialog = this.showDialog
      },
    },

    
  }
</script>
  