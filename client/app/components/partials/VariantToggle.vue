<style lang="sass">
@import ../../../assets/sass/variables




#filterSelect
    display: inline-flex
    justify-content: center
    justify-items: center
    padding-left: 0


#filter-form, #filterSelect
    #dropdownWrapper
        min-width: 240px
        padding-right: 0
        max-width: 250px


    .filter-switch
        display: inline-block
        margin-top: 0 !important
        margin-bottom: 0 !important

        label
            padding-top: 7px
            padding-left: 0px
            line-height: 18px
            font-size: 13px !important
            font-weight: 400 !important
            color: $text-color

    .v-input__slot
        margin-bottom: 0 !important

        label
            font-family: Poppins, sans-serif !important
            font-size: 13px !important
            font-weight: 400 !important

            color: $text-color
            padding-bottom: 0 !important
            margin-bottom: 0 !important
</style>

<template>
    <div style="display: inline-flex;">
        <div id="variant-toggle">
            <div id="filterSelect">
                <div id="dropdownWrapper">
                    <v-select class="ma-0 pa-0"
                              id="v-select-filter"
                              outlined
                              multiple
                              small-chips
                              deletable-chips
                              dense
                              label="Filter by inheritance..."
                              :items="filterText"
                              item-text='title'
                              item-value='name'
                              clearable
                              v-model="selectedFilterKeys">
                    </v-select>
                </div>
            </div>
        </div>
        <info-popup v-if="filterText && filterText.length > 0" name="variant-toggle"></info-popup>

    </div>
</template>

<script>
import InfoPopup            from "../partials/InfoPopup.vue";

    export default {
        name: 'variant-toggle',
        components: {
            InfoPopup
        },
        props: {
            variants: null,
            filterModel: null,
            geneLists: null,
            selectedGene: null,
            selectedVariant: null,

        },
        data() {
            return {
                flagCriteria: null,
                selectedFilters: null,
                selectedFilterKeys: null,
                showFilter: false,
                filterText: null,
                filterKeys: null,
                filteredVariants: null,
                filteredGeneList: null,
            }
        },
        watch: {
            geneLists: function () {
                this.setFilteredVariants();

            },

            showFilter: function () {
                this.$emit("show-filter", this.showFilter);
            },

            filterModel: function () {
                this.flagCriteria = this.filterModel.flagCriteria;
            },

            selectedFilterKeys: function(){
                this.selectedFilters = [];
                for(let i = 0; i < this.selectedFilterKeys.length; i++){
                    let key = this.selectedFilterKeys[i];
                    this.selectedFilters.push(this.filterKeys[key]);
                }
            },

            selectedFilters: function () {
                if (this.selectedFilters.length > 0) {
                    this.showFilter = true;
                } else {
                    this.showFilter = false;
                }
                this.setFilteredVariants();
            },
            selectedGene: function () {
                let self = this;
                this.selectedFilters = [];
                this.selectedFilterKeys = [];

            },
            selectedVariant: function () {
                this.setFilteredVariants();
            },
            variants: function() {
                this.populateInheritanceOptions();
            }
        },

        mounted() {
            this.selectedFilters = [];
            this.selectedFilterKeys = [];
            this.flagCriteria = this.filterModel.flagCriteria;
            this.filterText = ["Autosomal dominant", "Recessive", "De novo", "Compound het", "X-linked"];
            this.filterKeyToDisplay = {
                "autosomal dominant": "Autosomal dominant",
                "recessive": "Recessive",
                "denovo": "De novo",
                "compound het": "Compound het",
                "x-linked": "X-linked"
            }
            this.filterKeys = {"Autosomal dominant" :"autosomal dominant", "Recessive" :"recessive", "De novo" : "denovo", "Compound het" : "compound het", "X-linked" : "x-linked"};
        },

        methods: {

            setFilteredVariants() {
              this.filteredVariants = [];
              if(this.variants && this.variants.features) {
                let variants = this.variants.features;
                for (let i = 0; i < variants.length; i++) {
                  let variant = variants[i];
                  if (this.selectedFilters.includes(variant.inheritance)) {
                    this.filteredVariants.push(variant);
                  }
                }
                let copyVariants = Object.assign({}, this.variants);
                copyVariants.features = this.filteredVariants;

                if (this.selectedFilters.length > 0) {
                  this.$emit("filtered-variants-update", copyVariants);
                } else {
                  this.$emit("filtered-variants-update", this.variants);
                }
              }
            },
            populateInheritanceOptions() {
                let self = this;
                if (this.variants && this.variants.features) {
                    this.filterText = [];
                    let inheritanceInUse = [];
                    this.variants.features.forEach(function(v) {
                        if (v.inheritance && v.inheritance != "" && 
                            v.inheritance != "none" && 
                            self.filterKeyToDisplay[v.inheritance] &&
                            inheritanceInUse.indexOf(v.inheritance) == -1) {

                            inheritanceInUse.push(v.inheritance)                                           
                        }
                    })
                    
                    if (inheritanceInUse.length > 0) {
                        for (let key in self.filterKeyToDisplay) {
                            let display = self.filterKeyToDisplay[key]
                            if (inheritanceInUse.indexOf(key) >= 0) {
                                self.filterText.push(display)
                            }
                        }                    
                    }
                }
            }

        }
    }
</script>
