<style lang="sass">
@import ../../../assets/sass/variables

#show-variant-annot-info-divider
    margin-top: 10px !important
    margin-bottom: 1px !important

.close-button
    right: 10px !important
    top: 15px !important
    position: absolute !important
    min-width: 40px !important

.info-text
    font-size: 12px !important
    color: $text-color !important
    padding-top: 0px !important
    padding-bottom: 0px !important

.subtitle
    font-size: 15px !important

.v-card__text
    padding-top: 3px !important
    padding-bottom: 0px !important
   




</style>



<template>
    <v-dialog 
        v-model="showDialog" 
        :close-on-content-click="false" 
        :persistent="true"
        id="variant-annotation-info-dialog" 
        width="1000px">

        <v-card class="full-width" id="select-variant-annot-container" style="overflow-y: scroll;">
            <div class="container" >
                <v-card-title class="headline" style="padding-top: 10px;">
                    <span style="padding-left:3px">
                    Variant Annotations Information
                    </span>
                </v-card-title>
                <v-btn flat @click="onCancel" class="close-button">
                    <v-icon>close</v-icon>
                </v-btn>
            </div>
            <v-divider id="show-variant-annot-info-divider"></v-divider>

            <v-card-title class="subtitle" style="padding-top: 20px; margin-left:15px;">Variant Annotations(From VCF file)</v-card-title>
            <v-card-text class="info-text" v-for="(description, id) in infoObject" :key="description">
                {{ description }} ({{ id }})
            </v-card-text>
           
            <v-card-title class="subtitle" style="padding-top: 20px; margin-left:15px;">Genotype Annotations(From VCF file)</v-card-title>
            <v-card-text class="info-text" v-for="(description, id) in formatObject" :key="description">
                {{ description}} ({{ id }}) 
            </v-card-text>

            <v-card-title v-if="Object.keys(variantAnnotationsMap).length > 0" class="subtitle" style="padding-top: 20px; margin-left:15px;">Variant Annotations(From Mosaic)</v-card-title>
            <v-card-text class="info-text" v-if="Object.keys(variantAnnotationsMap).length > 0" v-for="key in Object.keys(variantAnnotationsMap)" :key="key">
                {{ variantAnnotationsMap[key].name }} 
            </v-card-text>
           
            
        </v-card>
    </v-dialog>
</template>

<script>

  export default {
    name: 'variant-annotations-info-popup',

    props: {
      showDialog: false,
      cohortModel: Object,
      selectedVariantRelationship: String,
      variantAnnotationsMap: Object
    },
    data() {
      return {
        infoObject: {},
        formatObject: {},
      
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

        onCancel() {
            this.$emit('close-variant-annot-info-dialog');
        }
   
      
    },

    mounted() {
        this.getInfoObject();
        this.getFormatObject();
    }

  }
</script>