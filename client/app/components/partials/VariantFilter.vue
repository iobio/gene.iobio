<style lang="sass">
    @import ../../../assets/sass/variables


    #filterSelect
        display: inline-flex
        padding-left: 30px
        padding-right: 0
        height: 25px

    #dropdownWrapper
        width: 250px
        padding-right: 20px

    .filter-switch
        display: inline-block
        margin-top: 0 !important
        float: right
        padding-right: 34px
        padding-top: 0
        padding-bottom: 3px

        label
            padding-top: 7px
            padding-left: 0px
            line-height: 18px
            font-size: 13px
            font-weight: 400
            color: $text-color


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
               label="Select filters"
               :items="filters"
               item-text='title'
               item-value='name'
               height="25"

               v-model="selectedFilters">

    </v-select>
            </div>
            <v-switch
                      class="filter-switch"
                      label="Filter tracks"
                      height="25"

                      v-model="showFilter"
                      dense
            >
            </v-switch>
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

            }
        },
        watch: {
            geneLists: function(){

                this.populateFilters();
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
                this.setFilteredVariants();
                this.setFilteredLoadedVariants();

                this.setDropdownWidth();



            },
            selectedGene: function(){
                this.setFilteredVariants();
                this.setFilteredLoadedVariants();
            },
            selectedVariant: function(){
                this.setFilteredVariants();
                this.setFilteredLoadedVariants();
            }
        },

        mounted() {
            this.selectedFilters = [];
            this.flagCriteria = this.filterModel.flagCriteria;
            this.populateFilters();
        },

        methods: {

            populateFilters(){
                this.filters = [];

                //todo: handle custom filters differnet structure
                for(let [k, v] of Object.entries(this.flagCriteria)){
                    if(v.key !== "undefined") {
                        this.filters.push({"name": v.key, 'title': v.title})
                    }
                }
            },

            setDropdownWidth: function(){

                let self = this;


                setTimeout( function() {

                    let baseWidth = 125;
                    let totalWidth = 40;


                    let padding = 20 * self.selectedFilters.length;

                    let selection = d3.select("#dropdownWrapper").selectAll(".v-chip__content")
                        .attr("swag", function (d, i) {
                            console.log("d", d);
                            console.log("i", i);
                            console.log("width", this.getBoundingClientRect().width);
                            totalWidth += this.getBoundingClientRect().width;
                        });

                    let width = Math.max(baseWidth, totalWidth);


                    d3.select("#dropdownWrapper")
                        .style("width", width.toString() + "px");
                }, 100);



            },

            passesFilters: function(variant){
                let filtersPassed = variant.filtersPassedAll;

                let bool = true;
                let reviewPassed = true;

                for(let i = 0; i < this.selectedFilters.length; i++){
                    if(this.selectedFilters[i] === "reviewed"){
                        reviewPassed = false;

                        let reviewed = this.geneLists.filter(function(item){
                            return item.name === "reviewed";
                        })[0];

                        for(let r = 0; r < reviewed.genes.length; r++){
                            let gene = reviewed.genes[r];
                            for(let j = 0; j < gene.variants.length; j++){
                                let v = gene.variants[j];
                                let fv = variant;

                                if(fv.start === v.start && fv.end === v.end && fv.alt===v.alt && fv.ref === v.ref){
                                    reviewPassed = true;
                                }
                            }

                        }
                    }
                    else {
                        if(!filtersPassed){
                            bool = false;
                        }
                        else if (!filtersPassed.includes(this.selectedFilters[i])) {
                            bool = false;
                        }
                    }
                }
              return bool && reviewPassed;

            },
            setFilteredVariants(){
                this.filteredVariants = [];


                for(let i = 0; i < this.geneLists.length; i++){
                    let filter = this.geneLists[i];

                    for(let j = 0; j < filter.genes.length; j++){
                        let gene = filter.genes[j]
                        if(this.selectedGene && gene.gene.name === this.selectedGene.name){
                           for(let k = 0; k < gene.variants.length; k++){
                               let variant = gene.variants[k];
                               if(this.passesFilters(variant)){
                                   this.filteredVariants.push(variant);
                               }
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
