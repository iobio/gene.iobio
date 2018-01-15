import { mount } from 'vue-test-utils'
import { expect } from 'chai'
import Home from '../../../app/components/pages/Home.vue'

describe('Home page component', () => {
  it('sets a hello world greeting', () => {
    let wrapper = mount(Home);
    expect(wrapper.vm.greeting).to.equal('hello world!');
  });
});