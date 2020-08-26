<style lang="sass">
@import ../../../assets/sass/variables



#filterSelect
    display: inline-flex
    justify-content: center
    justify-items: center
    padding-left: 0

#filter-form, #filterSelect
    #dropdownWrapper
        width: 225px
        padding-right: 0px

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

    .v-select__slot
        height: 25px !important

        label
            font-family: Poppins, sans-serif !important
            font-size: 13px !important
            font-weight: 400 !important

            color: $text-color
            padding-bottom: 0 !important
            margin-bottom: 0 !important
</style>

<template>
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
                          label="Show variants by inheritance"
                          :items="filterText"
                          item-text='title'
                          item-value='name'
                          clearable
                          v-model="selectedFilterKeys">
                </v-select>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'variant-toggle',
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
                this.setDropdownWidth();
            },
            selectedGene: function () {
                this.selectedFilters = [];
                this.selectedFilterKeys = [];
            },
            selectedVariant: function () {
                this.setFilteredVariants();
            }
        },

        mounted() {
            this.selectedFilters = [];
            this.selectedFilterKeys = [];
            this.flagCriteria = this.filterModel.flagCriteria;
            this.filterText = ["Autosomal dominant", "Recessive", "De novo", "Compound het", "X-linked"];
            this.filterKeys = {"Autosomal dominant" :"autosomal dominant", "Recessive" :"recessive", "De novo" : "denovo", "Compound het" : "compound het", "X-linked" : "x-linked"};
        },

        methods: {

            setDropdownWidth: function () {
                let self = this;

                setTimeout(function () {
                    let baseWidth = 215;
                    let totalWidth = 65;
                    let padding = self.selectedFilters.length * 3;

                    d3.select("#dropdownWrapper").selectAll(".v-chip__content")
                        .attr("getWidth", function (d, i) {
                            totalWidth += this.getBoundingClientRect().width;
                        });
                    totalWidth += padding;

                    let width = Math.max(baseWidth, totalWidth);

                    d3.select("#dropdownWrapper")
                        .style("width", width.toString() + "px");
                }, 100);
            },

            setFilteredVariants() {
                this.filteredVariants = [];

                console.log("this.selectedFilters", this.selectedFilters);
                if(this.variants && this.variants.features) {
                  let variants = this.variants.features;
                  for (let i = 0; i < variants.length; i++) {
                    let variant = variants[i];
                    console.log("variant", variant.inheritance);
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
        }
    }
</script>
