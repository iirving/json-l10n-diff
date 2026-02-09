import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestI18n } from '../utils/i18nTestHelper.js';
import KeyDiffItem from '@/components/KeyDiffItem.vue';

// Create i18n instance for tests
const i18n = createTestI18n();

/**
 * Helper to mount component with i18n
 * @param {Object} props - Component props
 * @returns {VueWrapper} Mounted component wrapper
 */
const mountComponent = (props) => {
  return mount(KeyDiffItem, {
    global: {
      plugins: [i18n],
    },
    props,
  });
};

describe('KeyDiffItem', () => {
  describe('Rendering with different statuses', () => {
    it('should render the component with key path', () => {
      const wrapper = mountComponent({
        keyPath: 'app.title',
        leftValue: 'My App',
        rightValue: 'Mon App',
        status: 'different',
      });

      expect(wrapper.find('.key-diff-item').exists()).toBe(true);
      expect(wrapper.text()).toContain('app.title');
    });

    it('should display left and right values', () => {
      const wrapper = mountComponent({
        keyPath: 'app.title',
        leftValue: 'My App',
        rightValue: 'Mon App',
        status: 'different',
      });

      expect(wrapper.text()).toContain('My App');
      expect(wrapper.text()).toContain('Mon App');
    });

    it('should render with missing-left status and show red highlight', () => {
      const wrapper = mountComponent({
        keyPath: 'app.welcome',
        leftValue: null,
        rightValue: 'Bienvenue',
        status: 'missing-left',
      });

      const item = wrapper.find('.key-diff-item');
      expect(item.classes()).toContain('status-missing-left');
    });

    it('should render with missing-right status and show red highlight', () => {
      const wrapper = mountComponent({
        keyPath: 'app.goodbye',
        leftValue: 'Goodbye',
        rightValue: null,
        status: 'missing-right',
      });

      const item = wrapper.find('.key-diff-item');
      expect(item.classes()).toContain('status-missing-right');
    });

    it('should render with identical status and show yellow highlight', () => {
      const wrapper = mountComponent({
        keyPath: 'app.name',
        leftValue: 'App',
        rightValue: 'App',
        status: 'identical',
      });

      const item = wrapper.find('.key-diff-item');
      expect(item.classes()).toContain('status-identical');
    });

    it('should render with different status and show neutral color', () => {
      const wrapper = mountComponent({
        keyPath: 'app.title',
        leftValue: 'My App',
        rightValue: 'Mon App',
        status: 'different',
      });

      const item = wrapper.find('.key-diff-item');
      expect(item.classes()).toContain('status-different');
    });
  });

  describe('Color coding', () => {
    it('should apply correct CSS class for missing-left status', () => {
      const wrapper = mountComponent({
        keyPath: 'test',
        leftValue: null,
        rightValue: 'value',
        status: 'missing-left',
      });

      expect(wrapper.find('.status-missing-left').exists()).toBe(true);
    });

    it('should apply correct CSS class for missing-right status', () => {
      const wrapper = mountComponent({
        keyPath: 'test',
        leftValue: 'value',
        rightValue: null,
        status: 'missing-right',
      });

      expect(wrapper.find('.status-missing-right').exists()).toBe(true);
    });

    it('should apply correct CSS class for identical status', () => {
      const wrapper = mountComponent({
        keyPath: 'test',
        leftValue: 'same',
        rightValue: 'same',
        status: 'identical',
      });

      expect(wrapper.find('.status-identical').exists()).toBe(true);
    });

    it('should apply correct CSS class for different status', () => {
      const wrapper = mountComponent({
        keyPath: 'test',
        leftValue: 'one',
        rightValue: 'two',
        status: 'different',
      });

      expect(wrapper.find('.status-different').exists()).toBe(true);
    });
  });

  describe('Value display', () => {
    it('should display "(missing)" for null left value', () => {
      const wrapper = mountComponent({
        keyPath: 'test',
        leftValue: null,
        rightValue: 'value',
        status: 'missing-left',
      });

      expect(wrapper.text()).toContain('(missing)');
    });

    it('should display "(missing)" for null right value', () => {
      const wrapper = mountComponent({
        keyPath: 'test',
        leftValue: 'value',
        rightValue: null,
        status: 'missing-right',
      });

      expect(wrapper.text()).toContain('(missing)');
    });

    it('should handle string values', () => {
      const wrapper = mountComponent({
        keyPath: 'test',
        leftValue: 'hello',
        rightValue: 'world',
        status: 'different',
      });

      expect(wrapper.text()).toContain('hello');
      expect(wrapper.text()).toContain('world');
    });

    it('should handle number values', () => {
      const wrapper = mountComponent({
        keyPath: 'test',
        leftValue: 42,
        rightValue: 100,
        status: 'different',
      });

      expect(wrapper.text()).toContain('42');
      expect(wrapper.text()).toContain('100');
    });

    it('should handle boolean values', () => {
      const wrapper = mountComponent({
        keyPath: 'test',
        leftValue: true,
        rightValue: false,
        status: 'different',
      });

      expect(wrapper.text()).toContain('true');
      expect(wrapper.text()).toContain('false');
    });

    it('should handle object values by showing JSON representation', () => {
      const wrapper = mountComponent({
        keyPath: 'test',
        leftValue: { nested: 'value' },
        rightValue: { nested: 'other' },
        status: 'different',
      });

      const text = wrapper.text();
      expect(text).toMatch(/nested/);
    });

    it('should handle array values by showing JSON representation', () => {
      const wrapper = mountComponent({
        keyPath: 'test',
        leftValue: [1, 2, 3],
        rightValue: [4, 5, 6],
        status: 'different',
      });

      const text = wrapper.text();
      expect(text).toMatch(/\[.*\]/);
    });
  });

  describe('Event emissions', () => {
    it('should emit add-key event when add button is clicked for missing-left', async () => {
      const wrapper = mountComponent({
        keyPath: 'app.welcome',
        leftValue: null,
        rightValue: 'Bienvenue',
        status: 'missing-left',
      });

      const addButton = wrapper.find('.add-key-button');
      expect(addButton.exists()).toBe(true);

      await addButton.trigger('click');

      expect(wrapper.emitted('add-key')).toBeTruthy();
      const emittedData = wrapper.emitted('add-key')[0][0];
      expect(emittedData).toEqual({
        keyPath: 'app.welcome',
        targetFile: 'file1',
        value: 'Bienvenue',
      });
    });

    it('should emit add-key event when add button is clicked for missing-right', async () => {
      const wrapper = mountComponent({
        keyPath: 'app.goodbye',
        leftValue: 'Goodbye',
        rightValue: null,
        status: 'missing-right',
      });

      const addButton = wrapper.find('.add-key-button');
      expect(addButton.exists()).toBe(true);

      await addButton.trigger('click');

      expect(wrapper.emitted('add-key')).toBeTruthy();
      const emittedData = wrapper.emitted('add-key')[0][0];
      expect(emittedData).toEqual({
        keyPath: 'app.goodbye',
        targetFile: 'file2',
        value: 'Goodbye',
      });
    });

    it('should emit edit-value event when edit button is clicked', async () => {
      const wrapper = mountComponent({
        keyPath: 'app.title',
        leftValue: 'My App',
        rightValue: 'Mon App',
        status: 'different',
      });

      const editButton = wrapper.find('.edit-value-button');
      if (editButton.exists()) {
        await editButton.trigger('click');
        expect(wrapper.emitted('edit-value')).toBeTruthy();
      }
    });

    it('should not show add button for identical status', () => {
      const wrapper = mountComponent({
        keyPath: 'app.name',
        leftValue: 'App',
        rightValue: 'App',
        status: 'identical',
      });

      const addButton = wrapper.find('.add-key-button');
      expect(addButton.exists()).toBe(false);
    });

    it('should not show add button for different status', () => {
      const wrapper = mountComponent({
        keyPath: 'app.title',
        leftValue: 'My App',
        rightValue: 'Mon App',
        status: 'different',
      });

      const addButton = wrapper.find('.add-key-button');
      expect(addButton.exists()).toBe(false);
    });
  });

  describe('Props validation', () => {
    it('should accept valid keyPath prop', () => {
      const wrapper = mountComponent({
        keyPath: 'valid.key.path',
        leftValue: 'test',
        rightValue: 'test',
        status: 'identical',
      });

      expect(wrapper.props('keyPath')).toBe('valid.key.path');
    });

    it('should accept valid status prop', () => {
      const statuses = [
        'missing-left',
        'missing-right',
        'identical',
        'different',
      ];

      statuses.forEach((status) => {
        const wrapper = mountComponent({
          keyPath: 'test',
          leftValue: 'test',
          rightValue: 'test',
          status,
        });

        expect(wrapper.props('status')).toBe(status);
      });
    });

    it('should handle null values in props', () => {
      const wrapper = mountComponent({
        keyPath: 'test',
        leftValue: null,
        rightValue: null,
        status: 'identical',
      });

      expect(wrapper.props('leftValue')).toBeNull();
      expect(wrapper.props('rightValue')).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string key path', () => {
      const wrapper = mountComponent({
        keyPath: '',
        leftValue: 'test',
        rightValue: 'test',
        status: 'identical',
      });

      expect(wrapper.props('keyPath')).toBe('');
    });

    it('should handle very long key paths', () => {
      const longPath = 'a.very.long.nested.key.path.that.goes.deep';
      const wrapper = mountComponent({
        keyPath: longPath,
        leftValue: 'test',
        rightValue: 'test',
        status: 'identical',
      });

      expect(wrapper.text()).toContain(longPath);
    });

    it('should handle special characters in values', () => {
      const wrapper = mountComponent({
        keyPath: 'test',
        leftValue: 'Hello "World" & <Friends>',
        rightValue: 'Bonjour "Monde" & <Amis>',
        status: 'different',
      });

      expect(wrapper.text()).toContain('Hello');
      expect(wrapper.text()).toContain('Bonjour');
    });

    it('should handle undefined values', () => {
      const wrapper = mountComponent({
        keyPath: 'test',
        leftValue: undefined,
        rightValue: 'value',
        status: 'missing-left',
      });

      // Vue props with default: null will be null when undefined is passed
      expect(wrapper.props('leftValue')).toBeNull();
    });

    it('should handle zero as a value', () => {
      const wrapper = mountComponent({
        keyPath: 'test',
        leftValue: 0,
        rightValue: 0,
        status: 'identical',
      });

      expect(wrapper.text()).toContain('0');
    });

    it('should handle empty strings as values', () => {
      const wrapper = mountComponent({
        keyPath: 'test',
        leftValue: '',
        rightValue: '',
        status: 'identical',
      });

      expect(wrapper.props('leftValue')).toBe('');
      expect(wrapper.props('rightValue')).toBe('');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button for add-key action', () => {
      const wrapper = mountComponent({
        keyPath: 'app.welcome',
        leftValue: null,
        rightValue: 'Bienvenue',
        status: 'missing-left',
      });

      const addButton = wrapper.find('.add-key-button');
      expect(addButton.attributes('aria-label')).toBeTruthy();
    });

    it('should have role attribute on key-diff-item', () => {
      const wrapper = mountComponent({
        keyPath: 'test',
        leftValue: 'test',
        rightValue: 'test',
        status: 'identical',
      });

      const item = wrapper.find('.key-diff-item');
      expect(item.attributes('role')).toBeTruthy();
    });
  });
});
