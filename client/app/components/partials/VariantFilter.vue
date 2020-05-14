<style lang="sass">

    #filterSelect
        width: 800px
        display: inline-flex

    #dropdownWrapper
        width: 250px


</style>

<template>
    <div id="variant-filter">
        Select filters to show/hide variants


        <div id="filterSelect">
            <div id="dropdownWrapper">
    <v-select  outlined
               multiple
               chips
               deletable-chips
               dense
               :items="filters"
               item-text='title'
               item-value='name'
               v-model="selectedFilters">

    </v-select>
            </div>

            <v-switch
                      label="filter variant-viz"
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
                filteredGeneList: null,
                filteredVariants: null,

            }
        },
        watch: {
            geneLists: function(){
                this.setFilteredGeneList();
                this.setFilteredVariants();
                this.setFilteredLoadedVariants();
            },

            showFilter: function(){
                console.log("showFilter watcher", this.showFilter);
                this.$emit("show-filter", this.showFilter);
            },

            variants: function(){
                console.log("this.variants in watcher", this.variants);
            },
            filterModel: function(){
                this.flagCriteria = this.filterModel.flagCriteria;
            },
            selectedFilters: function(){
                console.log("selectedFilters in watcher", this.selectedFilters);
                this.setFilteredGeneList();
                this.setFilteredVariants();
                this.setFilteredLoadedVariants();

            },
            selectedGene: function(){
                this.setFilteredGeneList();
                this.setFilteredVariants();
                this.setFilteredLoadedVariants();
            },
            selectedVariant: function(){
                this.setFilteredGeneList();
                this.setFilteredVariants();
                this.setFilteredLoadedVariants();
            }
        },

        mounted() {
            this.flagCriteria = this.filterModel.flagCriteria;

            this.filters = [];
            this.selectedFilters = [];

            for(let [k, v] of Object.entries(this.flagCriteria)){
                this.filters.push({"name": v.key, 'title': v.title})
            }
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
                // console.log("filtered geneLIst after filter", this.filteredGeneList);
            },

            passesFilters: function(variant){
                let filtersPassed = variant.filtersPassedAll;

                let bool = true;

                for(let i = 0; i < this.selectedFilters.length; i++){
                    if(this.selectedFilters[i] === "reviewed"){
                        bool = false;

                        let reviewed = this.geneLists.filter(function(item){
                            return item.name === "reviewed";
                        })[0];

                        for(let r = 0; r < reviewed.genes.length; r++){
                            let gene = reviewed.genes[r];
                            console.log("gene.variants.length", gene.variants.length);
                            for(let j = 0; j < gene.variants.length; j++){
                                let v = gene.variants[j];
                                let fv = variant;

                                if(fv.start === v.start && fv.end === v.end && fv.alt===v.alt && fv.ref === v.ref){
                                    bool = true;
                                    console.log("review passed");
                                }
                            }

                        }
                    }
                    else {
                        if (!filtersPassed.includes(this.selectedFilters[i])) {
                            bool = false;
                        }
                    }
                }
              return bool;

            },
            setFilteredVariants(){
                this.filteredVariants = [];


                for(let i = 0; i < this.geneLists.length; i++){
                    let filter = this.geneLists[i];

                    for(let j = 0; j < filter.genes.length; j++){
                        let gene = filter.genes[j]
                        if(gene.gene.name === this.selectedGene.name){
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
                for(let i = 0; i < this.filteredVariants.length; i++){
                    for(let j = 0; j < this.variants.features.length; j++){
                        let fv = this.filteredVariants[i];
                        let v = this.variants.features[j];
                        if(fv.start === v.start && fv.end === v.end && fv.alt===v.alt && fv.ref === v.ref){
                            features.push(v);
                        }
                    }
                }
                copyVariants.features = features;
                if(this.selectedFilters.length > 0){
                        this.$emit("filtered-variants-update", copyVariants);
                }
            },
        }
    }

</script>
