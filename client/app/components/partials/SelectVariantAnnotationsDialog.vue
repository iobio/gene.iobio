<style lang="sass">
@import ../../../assets/sass/variables

#select-variant-annot-container
  #select-variant-annot-dialog-divider
    margin-top: 10px !important
    margin-bottom: 1px !important

.small-label
  transform: scale(0.8) !important

.subtitle
  font-size: 15px !important

</style>

<template>
    <v-dialog 
    v-model="showDialog" 
    :close-on-content-click="false" 
    :persistent="true"
    id="variant-annotation-dialog" 
    width="1000px">

      <v-card class="full-width" id="select-variant-annot-container">
        <div class="container">
          <v-card-title class="headline" style="padding-top: 10px;">
            <span style="padding-left:3px">
              Select Annotations
            </span>
          </v-card-title>
        </div>

        <v-divider id="select-variant-annot-dialog-divider"></v-divider>
       
          
        <v-card-text style="max-height: 600px; overflow-y: auto;"> 
          <v-container fluid>
            <v-card-title class="subtitle" style="padding-top: 10px;">Variant Annotations</v-card-title>
            <v-checkbox 
            v-for="(key, value) in infoObject"
            :key="key"
            :label="key"          
            v-model="selectedInfo"
            :value="value"
            hide-details
            class="small-label"
            ></v-checkbox>
            
          
            <v-card-title class="subtitle" style="padding-top: 10px;">Genotype Annotations</v-card-title>
            <v-checkbox 
            v-for="(key, value) in formatObject"
            :key="key"
            :label="key" 
            v-model="selectedFormat"
            :value="value"
            hide-details
            class="small-label"
            > </v-checkbox>   

          </v-container>        
        </v-card-text>
        

        <v-card-actions class="justify-end">
          <v-btn @click="applyAnnotations">Apply</v-btn>
          <v-btn @click="closeDialog">Cancel</v-btn>
        </v-card-actions>
        
      </v-card>
    </v-dialog>
</template>
  
<script>

  export default {
    name: 'select-variant-annotations-dialog',

    props: {
      showDialog: false,
      infoObject: Object,
      formatObject: Object,
    },
    data() {
      return {
        selectedInfo: [],
        selectedFormat: [],
      
      };
    },
    methods: {
      closeDialog() {
        this.$emit('close-variant-annot-dialog', this.selectedInfo, this.selectedFormat);
      },
      applyAnnotations() {
        // emit the selected annotations to the parent component
        this.$emit('apply-variant-annot-dialog', this.selectedInfo, this.selectedFormat);
      },
      
    },

  }
</script>
  