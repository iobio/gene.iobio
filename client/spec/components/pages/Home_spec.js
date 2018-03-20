import { mount, createLocalVue } from 'vue-test-utils'
import { expect } from 'chai'

import _                    from 'lodash'


import Home from '../../../app/components/pages/Home.vue'

import Util      from '../../../app/globals/Util.js';
import GlobalApp  from '../../../app/globals/GlobalApp.js';


// create an extended `Vue` constructor
const localVue = createLocalVue()

const globalMixin = {
    data: function() {
      return {
        utility: new Util(),
        globalApp: new GlobalApp()
      };
    },
    created: function(){
      this.globalApp.utility = this.utility;
    }
}

// install plugins as normal
localVue.mixin(globalMixin)



describe('Home.vue', () => {



  it('test greeting is gene.iobio.vue', () => {
    let wrapper = mount(Home, {localVue});
    expect(wrapper.vm.greeting).to.equal('gene.iobio.vue');
  });
});