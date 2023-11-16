<style lang="sass">
@import ../../../assets/sass/variables

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
            <div v-if="Object.keys(variantAnnotationsMapObject).length > 0" v-for="key in Object.keys(variantAnnotationsMapObject)" :key="key" class="checkbox-row">
              <input
                type="checkbox"
                :id="key"
                :value="{ key, value: variantAnnotationsMapObject[key].uid }"
                v-model="selectedMosaicVariantAnnotations"
              />
              <span :for="key" class="label-text">{{ key }} </span>
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
        variantAnnotationsMapObject: {},


        selectedInfo: this.selectedVariantInfo,
        selectedFormat: this.selectedVariantFormat,
        selectedMosaicVariantAnnotations: this.selectedVariantMosaic,

        selectedAll: this.selectedVariantAllAnnots,
    
        
      };
    },

    methods: {
      getInfoObject() {
        this.infoObject = this.cohortModel.getModel(this.selectedVariantRelationship).vcf.infoFields.INFO;
        this.infoObject = this.sortObject(this.infoObject);
        return this.infoObject;
      },

      getFormatObject() {
        this.formatObject = this.cohortModel.getModel(this.selectedVariantRelationship).vcf.infoFields.FORMAT;
        this.formatObject = this.sortObject(this.formatObject);
        return this.formatObject;
      },

      getMosaicAnnotationsMap() {
        this.variantAnnotationsMapObject = this.sortObject(this.variantAnnotationsMap)
        return this.variantAnnotationsMapObject  
      },

      cancelAnnotations() {
        this.selectedInfo = this.selectedVariantInfo;
        this.selectedFormat = this.selectedVariantFormat;
        this.selectedMosaicVariantAnnotations = this.selectedVariantMosaic;
        this.selectedAll = this.selectedVariantAllAnnots;
        this.$emit('close-variant-annot-dialog', this.selectedInfo, this.selectedFormat, this.selectedMosaicVariantAnnotations, this.selectedAll);
      },

      applyAnnotations() {
        this.selectedInfo = this.sortSelectedArray(this.selectedInfo);
        this.selectedFormat = this.sortSelectedArray(this.selectedFormat);
        this.selectedMosaicVariantAnnotations = this.sortSelectedArray(this.selectedMosaicVariantAnnotations);
        this.$emit('apply-variant-annot-dialog', this.selectedInfo, this.selectedFormat, this.selectedMosaicVariantAnnotations, this.selectedAll);
      },

      getLength(obj) {
        return Object.keys(obj).length;
      },

      selectAll() {
        if (this.selectedAll) {
          this.selectedInfo = [];
          this.selectedFormat = [];
          this.selectedMosaicVariantAnnotations = [];
          const keysToAddInfo = Object.keys(this.infoObject)
          keysToAddInfo.forEach(key => {
            this.selectedInfo.push({ key, value: this.infoObject[key] });
          });

          const keysToAddFormat = Object.keys(this.formatObject)
          keysToAddFormat.forEach(key => {
            this.selectedFormat.push({ key, value: this.formatObject[key] });
          });

          const keysToAddMosaic = Object.keys(this.variantAnnotationsMapObject)
          keysToAddMosaic.forEach(key => {
            this.selectedMosaicVariantAnnotations.push({ key, value: this.variantAnnotationsMapObject[key].uid });
          });

        } else {
          this.selectedInfo = [];
          this.selectedFormat = [];
          this.selectedMosaicVariantAnnotations = [];
        }
      },

      sortSelectedArray(array) {
        return array.sort((a, b) => {
          if (a.key < b.key) {
            return -1;
          }
          if (a.key > b.key) {
            return 1;
          }
          return 0;
        });
      },

      sortObject(obj) {
        const sortedKeys = Object.keys(obj).sort((a, b) => {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        });

        const upperCaseKeys = sortedKeys.filter(key => key[0] === key[0].toUpperCase());
        const lowerCaseKeys = sortedKeys.filter(key => key[0] === key[0].toLowerCase());

        upperCaseKeys.sort();
        lowerCaseKeys.sort();

        const combinedSortedKeys = upperCaseKeys.concat(lowerCaseKeys);

        const sortedObject = combinedSortedKeys.reduce((result, key) => {
          result[key] = obj[key];
          return result;
        }, {});

        return sortedObject;
        
      },



    },

    mounted() {
      this.getInfoObject();
      this.getFormatObject();
      this.getMosaicAnnotationsMap();
    },

    watch: {
      showDialog: function() {
        this.showSelectVariantAnnotationDialog = this.showDialog
      },
    },

    
  }
</script>
  