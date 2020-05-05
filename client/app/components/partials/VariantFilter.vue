<style>

</style>

<template>
    <div id="variant-filter">
        Select filters to show/hide variants

    <v-select  outlined
               multiple
               chips
               :items="filters"
               item-text='title'
               item-value='name'
               v-model="title">

    </v-select>
    <span>Selected: {{ value}}</span>
    </div>


</template>

<script>

    export default {
        name: 'variant-filter',
        props: {
            variants: null,
            filterModel: null,
        },
        data() {
            return {
               flagCriteria: null,
                title: null,
                filters: null,
            }
        },
        watch: {
            variants: function(){
                console.log("change in this.variants in watcher", this.variants);
            },
            filterModel: function(){
                console.log("filterModel in watcher", this.filterModel);
                this.flagCriteria = this.filterModel.flagCriteria;
                console.log("this.flagCriteria in watcher", this.flagCriteria);


            }
        },

        mounted() {
            console.log("filterModel in mounted", this.filterModel);
            this.flagCriteria = this.filterModel.flagCriteria;

            this.filters = [];

            for(let [k, v] of Object.entries(this.flagCriteria)){
                console.log("k,v", k,v);
                this.filters.push({"name": v.name, 'title': v.title})
            }


            console.log("this.flagCriteria in mounted", this.filters);
        },

        methods: {
        }
    }

</script>
