import 'babel-polyfill';
import jQuery from 'jquery';
import 'd3';
import Vue from 'vue';


import _                    from 'lodash'


window.jQuery = jQuery;
window.$ = jQuery;
// require('../js/iobio.viz.js');

Vue.config.devtools = false;
Vue.config.productionTip = false;

beforeEach(() => {
  window.sandbox = sinon.sandbox.create();
});

afterEach(() => {
  window.sandbox.restore();
});
