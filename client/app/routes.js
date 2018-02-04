import jQuery from 'jquery'
global.jQuery = jQuery
global.$ = jQuery
import d3 from 'd3'
import _ from 'lodash'

import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App.vue'
import Home from './components/pages/Home.vue'

import bootstrap from 'bootstrap/dist/css/bootstrap.css'
import { Typeahead } from 'uiv'
Vue.use(Typeahead)

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import '../assets/css/siteVuetify.css'
Vue.use(Vuetify)


global.bus = new Vue();



Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Home,
    props: (route) => ({
        paramGene:             route.query.gene,
        paramGenes:            route.query.genes,
        paramSpecies:          route.query.species,
        paramBuild:            route.query.build,
        paramBatchSize:        route.query.batchSize,
        paramGeneSource:       route.query.geneSource,
        paramMyGene2:          route.query.mygene2,
        paramMode:             route.query.mode,
        paramAffectedSibs:     route.query.affectedSibs,
        paramUnaffectedSibs:   route.query.unaffectedSibs,

        paramRelationships:    [route.query.rel0, route.query.rel1, route.query.rel2],
        paramSamples:          [route.query.sample0, route.query.sample1, route.query.sample2],
        paramNames:            [route.query.name0, route.query.name1, route.query.name2],
        paramBams:             [route.query.bam0, route.query.bam1, route.query.bam2],
        paramBais:             [route.query.bai0, route.query.bai1, route.query.bai2],
        paramVcfs:             [route.query.vcf0, route.query.vcf1, route.query.vcf2],
        paramTbis:             [route.query.tbi0, route.query.tbi1, route.query.tbi2],
        paramAffectedStatuses: [route.query.affectedStatus0, route.query.affectedStatus1, route.query.affectedStatus2]
    })
  }
]

const router = new VueRouter({
  routes
})


window.vm = new Vue({
  el: '#app',
  created: function() {
  },
  render: h => h(App),
  router
})
