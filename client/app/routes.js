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
