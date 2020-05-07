<style lang="sass">

    #filterSelect
        width: 400px

</style>

<template>
    <div id="variant-filter">
        Select filters to show/hide variants


        <div id="filterSelect">
    <v-select  outlined
               multiple
               chips
               :width="200"
               :items="filters"
               item-text='title'
               item-value='name'
               v-model="selectedFilters">

    </v-select>
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
        },
        data() {
            return {
               flagCriteria: null,
                selectedFilters: null,
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

            variants: function(){
                console.log("this.variants in watcher", this.variants);
            },
            filterModel: function(){
                this.flagCriteria = this.filterModel.flagCriteria;
            },
            selectedFilters: function(){
                this.setFilteredGeneList();
                this.setFilteredVariants();
                this.setFilteredLoadedVariants();

            },
            selectedGene: function(){
                this.setFilteredGeneList();
                this.setFilteredVariants();
                this.setFilteredLoadedVariants();
            }
        },

        mounted() {
            this.flagCriteria = this.filterModel.flagCriteria;

            console.log("this.variants on mounted", this.variants);

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
            },
            setFilteredVariants(){
                this.filteredVariants = [];
                for(let i = 0; i < this.filteredGeneList.length; i++){
                    let filter = this.filteredGeneList[i];
                    for(let j = 0; j < filter.genes.length; j++){
                        let gene = filter.genes[j]
                        if(gene.gene.name === this.selectedGene.name){
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
                for(let i = 0; i < this.filteredVariants.length; i++){
                    for(let j = 0; j < this.variants.features.length; j++){
                        let fv = this.filteredVariants[i];
                        let v = this.variants.features[j];
                        if(fv.start === v.start && fv.end === v.end && fv.alt===v.alt && fv.ref === v.ref){
                            console.log("variants match");
                            features.push(v);
                        }
                    }
                }
                console.log("features", features);
                copyVariants.features = features;
                if(features.length > 1){
                    if(this.filteredVariants.length > 0) {
                        this.$emit("filtered-variants-update", copyVariants);
                    }
                }
            },
        }
    }

</script>
