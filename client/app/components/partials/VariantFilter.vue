<style lang="sass">

    #filterSelect
        width: 200px

</style>

<template>
    <div id="variant-filter">
        Select filters to show/hide variants


        <div id="filterSelect">
    <v-select  outlined
               multiple
               deletable-chips
               :width="200"
               :items="filters"
               item-text='title'
               item-value='name'
               v-model="title">

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
        },
        data() {
            return {
               flagCriteria: null,
                title: null,
                filters: null,
            }
        },
        watch: {
            // geneLists: function(){
            //     console.log("geneLists in variant filter watcher", this.geneLists);
            // },
            filterModel: function(){
                this.flagCriteria = this.filterModel.flagCriteria;
            }
        },

        mounted() {
            this.flagCriteria = this.filterModel.flagCriteria;

            this.filters = [];

            for(let [k, v] of Object.entries(this.flagCriteria)){
                this.filters.push({"name": v.name, 'title': v.title})
            }
        },

        methods: {
        }
    }

</script>
