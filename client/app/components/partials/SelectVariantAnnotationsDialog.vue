<style lang="sass">
@import ../../../assets/sass/variables

.in-iframe .v-dialog--persistent
  position: sticky !important
  top: 100px !important
  max-height: none !important

#select-variant-annot-container
  #select-variant-annot-dialog-divider
    margin-top: 10px !important
    margin-bottom: 1px !important

.checkbox-container .checkbox-row
  display: flex
  margin-bottom: 3px

.checkbox-row
  padding-top: 0px
  padding-right:  0px
  padding-bottom: 5px
  padding-left: 0px
  margin-bottom: 0px
  line-height: 15px
  >span
    display: inline-block
    vertical-align: middle
    font-size: 13px
    line-height: 15px

  .checkbox-id
    min-width: 180px
    max-width: 180px
     
  .label-text
    min-width: 600px 
    max-width: 600px 

  input
    display: inline-block
    margin-right: 10px !important
    margin-top: 0px !important
    margin-left: 0px !important
    margin-bottom: 0px !important
    padding-top: 0px !important
    padding-bottom: 5px !important
    padding-left: 0px !important
    padding-right: 0px !important
    width: 15px !important
    height: 15px !important
    vertical-align: middle !important
    position: relative !important
    top: 0px !important
    left: 0px !important

.subtitle
  font-size: 18px !important
  color: #434343

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
      width="900px">

      <v-card id="select-variant-annot-container">
        <div class="container">
          <v-card-title class="headline" style="padding-top: 10px;">
            <span style="padding-left:3px">
              Select Annotations
            </span>
          </v-card-title>
        </div>

        <v-divider id="select-variant-annot-dialog-divider"></v-divider>
        <div class="checkbox-row" style="padding-top: 15px; margin-left:20px;">
          <input
            type="checkbox"
            id="selectAll"
            v-model="selectedAll"
            @change="selectAll"
          />
          <span for="selectAll" class="checkbox-id">Select All</span>

        </div>
       
        <v-card-title class="subtitle" style="padding-top: 15px; margin-left:20px;">
          Variant Annotations
          <v-badge v-if="getLength(infoObject) != ''" class="count" style="margin-left: 10px;">
            <span v-if="getLength(infoObject) != ''" slot="badge">
               {{ getLength(infoObject) }} 
            </span>
          </v-badge>
        </v-card-title>
        
        <div style="max-height: 150px; overflow-y: scroll;">
          <div class="checkbox-container" style="padding-top:15px; margin-left:20px;">
            <div v-for="key in Object.keys(infoObject)" :key="key" class="checkbox-row">
              <input
                type="checkbox"
                :id="key"
                :value="{ key, value: infoObject[key] }"
                v-model="selectedInfo"
              />
              <span :for="key" class="checkbox-id">{{ key }}</span>
              <span :for="key" class="label-text">{{ infoObject[key] }} </span>
            </div>
          </div>
        </div>
        
        <v-card-title class="subtitle" style="padding-top: 15px; margin-left:20px;">
          Genotype Annotations
          <v-badge v-if="getLength(formatObject) != ''" class="count" style="margin-left: 10px;">
            <span v-if="getLength(formatObject) != ''" slot="badge">
               {{ getLength(formatObject) }} 
            </span>
          </v-badge>
        </v-card-title>
       
        <div style="max-height: 150px; overflow-y: scroll;">
          <div class="checkbox-container" style="padding-top:15px; margin-left:20px;">
            <div v-for="key in Object.keys(formatObject)" :key="key" class="checkbox-row">
              <input
                type="checkbox"
                :id="key"
                :value="{ key, value: formatObject[key] }"
                v-model="selectedFormat"
              />
              <span :for="key" class="checkbox-id">{{ key }}</span>
              <span :for="key" class="label-text">{{ formatObject[key] }} </span>
            </div>
          </div>
        </div>

        <v-card-title v-if="Object.keys(variantAnnotationsMap).length > 0" class="subtitle" style="padding-top: 15px; margin-left:20px;">
          Mosaic Variant Annotations
          <v-badge v-if="getLength(variantAnnotationsMap) != ''" class="count" style="margin-left: 10px;">
            <span v-if="getLength(variantAnnotationsMap) != ''" slot="badge">
               {{ getLength(variantAnnotationsMap) }} 
            </span>
          </v-badge>
        </v-card-title>
       
        <div style="max-height: 150px; overflow-y: scroll;">
          <div class="checkbox-container" style="padding-top:15px; margin-left:20px;">
            <div v-if="Object.keys(variantAnnotationsMap).length > 0" v-for="key in Object.keys(variantAnnotationsMap)" :key="key" class="checkbox-row">
              <input
                type="checkbox"
                :id="key"
                :value="{ key: variantAnnotationsMap[key].uid, value: variantAnnotationsMap[key].name }"
                v-model="selectedMosaicVariantAnnotations"
              />
              <span :for="key" class="label-text">{{ variantAnnotationsMap[key].name }} </span>
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
      selectedVariantAllAnnots: Boolean,

    },
    data() {
      return {

        showSelectVariantAnnotationDialog: false,
        infoObject: {},
        formatObject: {},


        selectedInfo: this.selectedVariantInfo,
        selectedFormat: this.selectedVariantFormat,
        selectedMosaicVariantAnnotations: this.selectedVariantMosaic,

        selectedAll: this.selectedVariantAllAnnots,
    
        
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
        this.selectedAll = false;
        this.$emit('close-variant-annot-dialog', this.selectedInfo, this.selectedFormat, this.selectedMosaicVariantAnnotations, this.selectedAll);
      },

      applyAnnotations() {
        this.$emit('apply-variant-annot-dialog', this.selectedInfo, this.selectedFormat, this.selectedMosaicVariantAnnotations, this.selectedAll);
      },

      getLength(obj) {
        return Object.keys(obj).length;
      },

      selectAll() {
        if (this.selectedAll) {
          const selectedInfoKeys = this.selectedInfo.map(item => item.key);
          const keysToAdd = Object.keys(this.infoObject).filter(key => !selectedInfoKeys.includes(key));
          keysToAdd.forEach(key => {
            this.selectedInfo.push({ key, value: this.infoObject[key] });
          });

          const selectedFormatKeys = this.selectedFormat.map(item => item.key);
          const keysToAddFormat = Object.keys(this.formatObject).filter(key => !selectedFormatKeys.includes(key));
          keysToAddFormat.forEach(key => {
            this.selectedFormat.push({ key, value: this.formatObject[key] });
          });

          const selectedMosaicVariantAnnotationsKeys = this.selectedMosaicVariantAnnotations.map(item => item.key);
          const keysToAddMosaic = Object.keys(this.variantAnnotationsMap).filter(key => !selectedMosaicVariantAnnotationsKeys.includes(this.variantAnnotationsMap[key].uid));
          keysToAddMosaic.forEach(key => {
            this.selectedMosaicVariantAnnotations.push({ key: this.variantAnnotationsMap[key].uid, value: this.variantAnnotationsMap[key].name });
          });

        } else {
          this.selectedInfo = [];
          this.selectedFormat = [];
          this.selectedMosaicVariantAnnotations = [];
        }
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
  