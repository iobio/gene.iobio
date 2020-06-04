<style lang="sass">
    @import ../../../assets/sass/variables



    #filterSelect
        display: inline-flex
        justify-content: center
        justify-items: center
        padding-left: 0
        padding-right: 0

    #dropdownWrapper
        width: 250px
        padding-right: 0px

    .filter-switch
        display: inline-block
        margin-top: 0 !important
        margin-bottom: 0 !important

        label
            padding-top: 7px
            padding-left: 0px
            line-height: 18px
            font-size: 13px
            font-weight: 400
            color: $text-color

    .v-input__slot
        margin-bottom: 0 !important

    .v-select__slot
        label
            font-family: Poppins, sans-serif !important
            font-size: 13px !important
            color: $text-color

    /*font-weight: normal !important*/


</style>

<template>
    <div id="variant-filter">


        <div id="filterSelect">
            <div id="dropdownWrapper">
    <v-select  class="ma-0 pa-0"
               id="v-select-filter"
               outlined
               multiple
               small-chips
               deletable-chips
               dense
               label="Only show"
               :items="filters"
               item-text='title'
               item-value='name'
               clearable

               v-model="selectedFilters">

    </v-select>
            </div>
        </div>
    </div>


</template>

<script>

    export default {
        name: 'variant-filter',
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
                showFilter: false,
                filters: null,
                filteredVariants: null,
                filteredGeneList: null,

            }
        },
        watch: {
            geneLists: function(){
                this.setFilteredVariants();
                this.setFilteredLoadedVariants();
            },

            showFilter: function(){
                this.$emit("show-filter", this.showFilter);
            },

            filterModel: function(){
                this.flagCriteria = this.filterModel.flagCriteria;
            },
            selectedFilters: function(){
                if(this.selectedFilters.length > 0){
                    this.showFilter = true;
                }
                else{
                    this.showFilter = false;
                }
                this.setFilteredVariants();
                this.setFilteredLoadedVariants();
                this.setDropdownWidth();
            },
            selectedGene: function(){

                this.selectedFilters = [];
                this.filteredVariants = this.data;
                // this.setFilteredVariants();
                // this.setFilteredLoadedVariants();
            },
            selectedVariant: function(){
                this.setFilteredVariants();
                this.setFilteredLoadedVariants();
            }
        },

        mounted() {
            this.selectedFilters = [];
            this.flagCriteria = this.filterModel.flagCriteria;
            this.filters = ["autosomalDominant", "recessive", "denovo", "compoundHet", "xlinked"];
        },

        methods: {

            setFilteredGeneList(){
                this.filteredGeneList = [];
                for(let j = 0; j < this.selectedFilters.length; j++){
                    for(let i = 0; i < this.variants.features.length; i++){
                        if(this.selectedFilters[j]=== this.geneLists[i].name){
                            this.filteredGeneList.push(this.geneLists[i]);
                        }
                    }
                }
            },

            setDropdownWidth: function(){

                let self = this;

                setTimeout( function() {

                    let baseWidth = 90;
                    let totalWidth = 65;
                    let padding = self.selectedFilters.length * 5;

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

            setFilteredVariants(){

                this.setFilteredGeneList();

                this.filteredVariants = [];


                for(let i = 0; i < this.filteredGeneList.length; i++){
                    let filter = this.filteredGeneList[i];

                    for(let j = 0; j < filter.genes.length; j++){
                        let gene = filter.genes[j]
                        if(this.selectedGene && gene.gene.name === this.selectedGene.name){
                           for(let k = 0; k < gene.variants.length; k++){
                               this.filteredVariants.push(gene.variants[k]);
                           }
                        }
                    }
                }
            },

            setFilteredLoadedVariants: function(){
                let copyVariants = Object.assign({}, this.variants);
                let features = [];
                if(this.variants && this.variants.features) {
                    for (let i = 0; i < this.filteredVariants.length; i++) {
                        for (let j = 0; j < this.variants.features.length; j++) {
                            let fv = this.filteredVariants[i];
                            let v = this.variants.features[j];
                            if (fv.start === v.start && fv.end === v.end && fv.alt === v.alt && fv.ref === v.ref) {
                                features.push(v);
                            }
                        }
                    }

                    copyVariants.features = features;
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
