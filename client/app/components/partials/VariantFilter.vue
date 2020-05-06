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


            },
            filterModel: function(){
                this.flagCriteria = this.filterModel.flagCriteria;
            },
            selectedFilters: function(){
                this.setFilteredGeneList();
                this.setFilteredVariants();
            },
            selectedGene: function(){
                this.setFilteredGeneList();
                this.setFilteredVariants();
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
                    for(let i = 0; i < this.geneLists.length; i++){
                        if(this.selectedFilters[j]=== this.geneLists[i].name){
                            this.filteredGeneList.push(this.geneLists[i]);
                            console.log("pushing gene to filteredGeneList");

                        }
                    }
                }
            },
            setFilteredVariants(){
                this.filteredVariants = [];
                for(let i = 0; i < this.filteredGeneList.length; i++){
                    let filter = this.filteredGeneList[i];
                    console.log("filter.genes", filter.genes);
                    for(let j = 0; j < filter.genes.length; j++){
                        let gene = filter.genes[j]
                        console.log("this.selectedGene", this.selectedGene);
                        if(gene.gene.name === this.selectedGene.name){
                           for(let k = 0; k < gene.variants.length; k++){
                               this.filteredVariants.push(gene.variants[k]);
                           }
                        }
                    }
                }
                console.log("this.filteredVariants", this.filteredVariants);
            }
        }
    }

</script>
