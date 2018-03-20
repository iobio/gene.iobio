import { mount, shallow, createLocalVue } from '@vue/test-utils';

import Home from '../../../app/components/pages/Home.vue';
import Navigation from '../../../app/components/viz/Navigation.vue';


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


describe('Home', () => {

  it('sets a greeting', () => {
    let wrapper = shallow(Home, {localVue});
    expect(wrapper.vm.greeting).to.equal('gene.iobio.vue')
  });

  it('load demo data', () => {
    const clickHandler = sinon.stub()
    localVue.propsData = { clickHandler };
    let wrapper = mount(Home, {localVue});
    wrapper.vm.$nextTick(() => {
      const nav = wrapper.find(Navigation);
      expect(nav.is(Navigation)).to.equal(true);
      nav.find('#help-menu-button').trigger('click');
      nav.find("#load-demo-data-menu-item").trigger('click');
    })
  });

});