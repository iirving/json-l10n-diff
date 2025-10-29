/**
 * Tests for ComparisonView Component
 * Tests rendering, prop handling, and event forwarding
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestI18n } from '../utils/i18nTestHelper.js';
import ComparisonView from '@/components/ComparisonView.vue';
import DualFileViewer from '@/components/DualFileViewer.vue';
import { mockFile1, mockFile2 } from '../fixtures/mockFiles.js';

// Create i18n instance for tests
const i18n = createTestI18n();

describe('ComparisonView', () => {
  let wrapper;

  // Helper function to mount with i18n
  const mountComparisonView = (options = {}) => {
    return mount(ComparisonView, {
      global: {
        plugins: [i18n],
        stubs: {
          DualFileViewer: true,
        },
        ...(options.global || {}),
      },
      ...options,
    });
  };

  beforeEach(() => {
    wrapper = mountComparisonView({
      props: {
        file1: mockFile1,
        file2: mockFile2,
      },
    });
  });

  describe('Component Rendering', () => {
    it('should render the comparison view container element', () => {
      expect(wrapper.find('.comparison-view').exists()).toBe(true);
    });

    it('should render DualFileViewer component when files are provided', () => {
      const dualViewer = wrapper.findComponent(DualFileViewer);
      expect(dualViewer.exists()).toBe(true);
    });

    it('should render comparison container when both files are present', () => {
      const container = wrapper.find('.comparison-container');
      expect(container.exists()).toBe(true);
    });

    it('should not render empty state message when files are present', () => {
      expect(wrapper.find('.empty-state').exists()).toBe(false);
    });
  });

  describe('Empty State', () => {
    it('should render empty state message when no files are loaded', () => {
      const emptyWrapper = mountComparisonView({
        props: {
          file1: null,
          file2: null,
        },
      });
      expect(emptyWrapper.find('.empty-state').exists()).toBe(true);
      expect(emptyWrapper.find('.empty-state p').text()).toBe(
        'Upload two JSON files to compare'
      );
    });

    it('should not render DualFileViewer component when no files are loaded', () => {
      const emptyWrapper = mountComparisonView({
        props: {
          file1: null,
          file2: null,
        },
      });
      expect(emptyWrapper.findComponent(DualFileViewer).exists()).toBe(false);
    });

    it('should render comparison view when only file1 is present', () => {
      const wrapper1 = mountComparisonView({
        props: {
          file1: mockFile1,
          file2: null,
        },
      });
      expect(wrapper1.find('.comparison-container').exists()).toBe(true);
      expect(wrapper1.find('.empty-state').exists()).toBe(false);
    });

    it('should render comparison view when only file2 is present', () => {
      const wrapper2 = mountComparisonView({
        props: {
          file1: null,
          file2: mockFile2,
        },
      });
      expect(wrapper2.find('.comparison-container').exists()).toBe(true);
      expect(wrapper2.find('.empty-state').exists()).toBe(false);
    });
  });

  describe('Props Handling', () => {
    it('should pass file1 data as prop to DualFileViewer component', () => {
      const dualViewer = wrapper.findComponent(DualFileViewer);
      expect(dualViewer.props('file1')).toEqual(mockFile1);
    });

    it('should pass file2 data as prop to DualFileViewer component', () => {
      const dualViewer = wrapper.findComponent(DualFileViewer);
      expect(dualViewer.props('file2')).toEqual(mockFile2);
    });

    it('should pass default file names to DualFileViewer when not specified', () => {
      const dualViewer = wrapper.findComponent(DualFileViewer);
      expect(dualViewer.props('file1Name')).toBe('File 1');
      expect(dualViewer.props('file2Name')).toBe('File 2');
    });

    it('should pass custom file names to DualFileViewer when provided as props', () => {
      const customWrapper = mountComparisonView({
        props: {
          file1: mockFile1,
          file2: mockFile2,
          file1Name: 'en.json',
          file2Name: 'fr.json',
        },
      });
      const dualViewer = customWrapper.findComponent(DualFileViewer);
      expect(dualViewer.props('file1Name')).toBe('en.json');
      expect(dualViewer.props('file2Name')).toBe('fr.json');
    });
  });

  describe('Event Forwarding', () => {
    it('should forward add-key-to-file1 event from DualFileViewer to parent', async () => {
      const dualViewer = wrapper.findComponent(DualFileViewer);
      const addKeyDetails = { keyPath: 'app.welcome', value: 'Welcome' };

      await dualViewer.vm.$emit('add-key-to-file1', addKeyDetails);

      expect(wrapper.emitted('add-key-to-file1')).toBeTruthy();
      expect(wrapper.emitted('add-key-to-file1')[0]).toEqual([addKeyDetails]);
    });

    it('should forward add-key-to-file2 event from DualFileViewer to parent', async () => {
      const dualViewer = wrapper.findComponent(DualFileViewer);
      const addKeyDetails = { keyPath: 'nav.about', value: 'À propos' };

      await dualViewer.vm.$emit('add-key-to-file2', addKeyDetails);

      expect(wrapper.emitted('add-key-to-file2')).toBeTruthy();
      expect(wrapper.emitted('add-key-to-file2')[0]).toEqual([addKeyDetails]);
    });

    it('should forward value-changed event from DualFileViewer to parent', async () => {
      const dualViewer = wrapper.findComponent(DualFileViewer);
      const editDetails = {
        keyPath: 'app.title',
        newValue: 'Updated Title',
        targetFile: 'file1',
      };

      await dualViewer.vm.$emit('value-changed', editDetails);

      expect(wrapper.emitted('value-changed')).toBeTruthy();
      expect(wrapper.emitted('value-changed')[0]).toEqual([editDetails]);
    });

    it('should forward node-toggled event from DualFileViewer to parent', async () => {
      const dualViewer = wrapper.findComponent(DualFileViewer);
      const toggleDetails = { keyPath: 'app', expanded: true };

      await dualViewer.vm.$emit('node-toggled', toggleDetails);

      expect(wrapper.emitted('node-toggled')).toBeTruthy();
      expect(wrapper.emitted('node-toggled')[0]).toEqual([toggleDetails]);
    });
  });

  describe('Multiple Event Emissions', () => {
    it('should handle multiple add-key-to-file1 events in sequence', async () => {
      const dualViewer = wrapper.findComponent(DualFileViewer);

      await dualViewer.vm.$emit('add-key-to-file1', {
        keyPath: 'key1',
        value: 'value1',
      });
      await dualViewer.vm.$emit('add-key-to-file1', {
        keyPath: 'key2',
        value: 'value2',
      });

      expect(wrapper.emitted('add-key-to-file1')).toHaveLength(2);
    });

    it('should handle multiple value-changed events in sequence', async () => {
      const dualViewer = wrapper.findComponent(DualFileViewer);

      await dualViewer.vm.$emit('value-changed', {
        keyPath: 'app.title',
        newValue: 'Title 1',
      });
      await dualViewer.vm.$emit('value-changed', {
        keyPath: 'app.description',
        newValue: 'Description 1',
      });

      expect(wrapper.emitted('value-changed')).toHaveLength(2);
    });
  });

  describe('Props Reactivity', () => {
    it('should update DualFileViewer when file1 prop changes', async () => {
      const newFile1 = { app: { title: 'New App' } };
      await wrapper.setProps({ file1: newFile1 });

      const dualViewer = wrapper.findComponent(DualFileViewer);
      expect(dualViewer.props('file1')).toEqual(newFile1);
    });

    it('should update DualFileViewer when file2 prop changes', async () => {
      const newFile2 = { app: { title: 'Nouvelle App' } };
      await wrapper.setProps({ file2: newFile2 });

      const dualViewer = wrapper.findComponent(DualFileViewer);
      expect(dualViewer.props('file2')).toEqual(newFile2);
    });

    it('should display empty state when both file props become null', async () => {
      await wrapper.setProps({ file1: null, file2: null });

      expect(wrapper.find('.empty-state').exists()).toBe(true);
      expect(wrapper.find('.comparison-container').exists()).toBe(false);
    });

    it('should display comparison view when files are provided after being null', async () => {
      const emptyWrapper = mountComparisonView({
        props: {
          file1: null,
          file2: null,
        },
      });

      await emptyWrapper.setProps({ file1: mockFile1, file2: mockFile2 });

      expect(emptyWrapper.find('.comparison-container').exists()).toBe(true);
      expect(emptyWrapper.find('.empty-state').exists()).toBe(false);
    });
  });

  describe('Styling', () => {
    it('should apply correct CSS class to main container element', () => {
      const mainDiv = wrapper.find('.comparison-view');
      expect(mainDiv.exists()).toBe(true);
    });

    it('should apply correct CSS class to comparison container element', () => {
      const container = wrapper.find('.comparison-container');
      expect(container.exists()).toBe(true);
    });

    it('should apply empty-state CSS class when no files are loaded', () => {
      const emptyWrapper = mountComparisonView({
        props: {
          file1: null,
          file2: null,
        },
      });
      expect(emptyWrapper.find('.empty-state').exists()).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty objects as files', () => {
      const emptyWrapper = mountComparisonView({
        props: {
          file1: {},
          file2: {},
        },
      });
      expect(emptyWrapper.find('.comparison-container').exists()).toBe(true);
      expect(emptyWrapper.findComponent(DualFileViewer).exists()).toBe(true);
    });

    it('handles deeply nested file structures', () => {
      const deepFile = {
        level1: {
          level2: {
            level3: {
              level4: {
                value: 'deep',
              },
            },
          },
        },
      };
      const deepWrapper = mountComparisonView({
        props: {
          file1: deepFile,
          file2: deepFile,
        },
      });
      expect(deepWrapper.findComponent(DualFileViewer).exists()).toBe(true);
    });

    it('handles files with different structures', () => {
      const file1 = { app: { title: 'Title' } };
      const file2 = { settings: { theme: 'dark' } };
      const diffWrapper = mountComparisonView({
        props: {
          file1,
          file2,
        },
      });
      expect(diffWrapper.findComponent(DualFileViewer).exists()).toBe(true);
    });
  });
});
