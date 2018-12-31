import Vue from 'vue';
import { mount } from '@vue/test-utils';
import Progress from '../Progress.vue';

describe('Common', () => {
  describe('ImageInput', () => {
    test('mounts correctly', () => {
      const wrapper = mount(Progress);
      expect(wrapper.contains('.nr-progress')).toBe(true);
    });
    describe('Props', () => {
      test(':uploadProgress', () => {
        const consoleErrorSpy = spyOn(console, 'error');
        let wrapper = mount(Progress, {
          propsData: {
            uploadProgress: 20
          }
        });
        expect(wrapper.props().uploadProgress).toBe(20);
        expect(wrapper.text()).toBe('20%');
        wrapper = mount(Progress, {});
        expect(consoleErrorSpy.calls.first().args[0]).toContain(
          'Missing required prop'
        );
      });
    });
  });
});
