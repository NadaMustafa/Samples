import Vue from 'vue';
import { mount } from '@vue/test-utils';
import ImageInput from '../ImageInput.vue';

describe('Common', () => {
  describe('ImageInput', () => {
    test('mounts correctly', () => {
      const wrapper = mount(ImageInput);
      expect(wrapper.contains('.nr-image-input')).toBe(true);
      expect(wrapper.contains('.nr-image-input__icon')).toBe(true);
      expect(wrapper.contains('.nr-image-input__img')).toBe(false);
      expect(wrapper.contains('.nr-image-input__input')).toBe(true);
    });
    describe('Props', () => {
      test('square', () => {
        const wrapper = mount(ImageInput, {
          propsData: {
            round: true
          }
        });
        expect(wrapper.contains('.nr-image-input--round')).toBe(true);
        expect(wrapper.props().round).toEqual(true);
      });
      test('maxSize', () => {
        const wrapper = mount(ImageInput, {
          propsData: {
            maxSize: 200000
          }
        });
        expect(wrapper.props().maxSize).toEqual(200000);
      });
      test('aspectRatio', () => {
        const wrapper = mount(ImageInput, {
          propsData: {
            aspectRatio: 4 / 3
          }
        });
        expect(wrapper.props().aspectRatio).toEqual(4 / 3);
      });
    });
  });
});
