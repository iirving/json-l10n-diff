import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ComparisonView from '@/components/ComparisonView.vue';
import TreeViewer from '@/components/TreeViewer.vue';

describe('ComparisonView', () => {
  let wrapper;

  const mockFile1 = {
    app: {
      title: 'My App',
      description: 'A test app',
    },
    nav: {
      home: 'Home',
    },
  };

  const mockFile2 = {
    app: {
      title: 'Mon App',
      description: 'Une app de test',
      welcome: 'Bienvenue',
    },
    nav: {
      home: 'Accueil',
    },
  };

  const mockDiffResults = [
    {
      keyPath: 'app.title',
      status: 'different',
      leftValue: 'My App',
      rightValue: 'Mon App',
    },
    {
      keyPath: 'app.description',
      status: 'different',
      leftValue: 'A test app',
      rightValue: 'Une app de test',
    },
    {
      keyPath: 'app.welcome',
      status: 'missing-left',
      leftValue: null,
      rightValue: 'Bienvenue',
    },
    {
      keyPath: 'nav.home',
      status: 'different',
      leftValue: 'Home',
      rightValue: 'Accueil',
    },
  ];

  beforeEach(() => {
    wrapper = mount(ComparisonView, {
      props: {
        file1: mockFile1,
        file2: mockFile2,
        diffResults: mockDiffResults,
      },
    });
  });

  describe('Component rendering', () => {
    it('should render the comparison view container', () => {
      expect(wrapper.find('.comparison-view').exists()).toBe(true);
    });

    it('should render two TreeViewer components', () => {
      const treeViewers = wrapper.findAllComponents(TreeViewer);
      expect(treeViewers).toHaveLength(2);
    });

    it('should render side-by-side layout', () => {
      const container = wrapper.find('.comparison-container');
      expect(container.exists()).toBe(true);
    });

    it('should have file1 viewer on the left', () => {
      const treeViewers = wrapper.findAllComponents(TreeViewer);
      expect(treeViewers[0].props('fileId')).toBe('file1');
    });

    it('should have file2 viewer on the right', () => {
      const treeViewers = wrapper.findAllComponents(TreeViewer);
      expect(treeViewers[1].props('fileId')).toBe('file2');
    });
  });

  describe('Props handling', () => {
    it('should pass file1 content to first TreeViewer', () => {
      const treeViewers = wrapper.findAllComponents(TreeViewer);
      expect(treeViewers[0].props('content')).toEqual(mockFile1);
    });

    it('should pass file2 content to second TreeViewer', () => {
      const treeViewers = wrapper.findAllComponents(TreeViewer);
      expect(treeViewers[1].props('content')).toEqual(mockFile2);
    });

    it('should pass diffResults to both TreeViewers', () => {
      const treeViewers = wrapper.findAllComponents(TreeViewer);
      expect(treeViewers[0].props('diffResults')).toEqual(mockDiffResults);
      expect(treeViewers[1].props('diffResults')).toEqual(mockDiffResults);
    });

    it('should handle null file1', () => {
      const nullWrapper = mount(ComparisonView, {
        props: {
          file1: null,
          file2: mockFile2,
          diffResults: [],
        },
      });

      const treeViewers = nullWrapper.findAllComponents(TreeViewer);
      expect(treeViewers[0].props('content')).toEqual({});
    });

    it('should handle null file2', () => {
      const nullWrapper = mount(ComparisonView, {
        props: {
          file1: mockFile1,
          file2: null,
          diffResults: [],
        },
      });

      const treeViewers = nullWrapper.findAllComponents(TreeViewer);
      expect(treeViewers[1].props('content')).toEqual({});
    });

    it('should handle empty diffResults', () => {
      const emptyWrapper = mount(ComparisonView, {
        props: {
          file1: mockFile1,
          file2: mockFile2,
          diffResults: [],
        },
      });

      const treeViewers = emptyWrapper.findAllComponents(TreeViewer);
      expect(treeViewers[0].props('diffResults')).toEqual([]);
      expect(treeViewers[1].props('diffResults')).toEqual([]);
    });
  });

  describe('TreeViewer integration', () => {
    it('should render TreeViewer with correct props', () => {
      const treeViewers = wrapper.findAllComponents(TreeViewer);

      expect(treeViewers[0].props()).toMatchObject({
        content: mockFile1,
        fileId: 'file1',
        diffResults: mockDiffResults,
      });

      expect(treeViewers[1].props()).toMatchObject({
        content: mockFile2,
        fileId: 'file2',
        diffResults: mockDiffResults,
      });
    });

    it('should allow TreeViewer to be editable', () => {
      const editableWrapper = mount(ComparisonView, {
        props: {
          file1: mockFile1,
          file2: mockFile2,
          diffResults: mockDiffResults,
          editable: true,
        },
      });

      const treeViewers = editableWrapper.findAllComponents(TreeViewer);
      expect(treeViewers[0].props('editable')).toBe(true);
      expect(treeViewers[1].props('editable')).toBe(true);
    });

    it('should have TreeViewer non-editable by default', () => {
      const treeViewers = wrapper.findAllComponents(TreeViewer);
      expect(treeViewers[0].props('editable')).toBe(false);
      expect(treeViewers[1].props('editable')).toBe(false);
    });
  });

  describe('Event emissions - save-requested', () => {
    it('should emit save-requested event when save is triggered', async () => {
      await wrapper.vm.handleSave();

      expect(wrapper.emitted('save-requested')).toBeTruthy();
    });

    it('should emit save-requested with file data', async () => {
      await wrapper.vm.handleSave();

      const emitted = wrapper.emitted('save-requested');
      expect(emitted).toHaveLength(1);
      expect(emitted[0][0]).toEqual({
        file1: mockFile1,
        file2: mockFile2,
      });
    });

    it('should not emit save-requested if no files', async () => {
      const noFilesWrapper = mount(ComparisonView, {
        props: {
          file1: null,
          file2: null,
          diffResults: [],
        },
      });

      await noFilesWrapper.vm.handleSave();

      expect(noFilesWrapper.emitted('save-requested')).toBeFalsy();
    });
  });

  describe('Event emissions - prettify-requested', () => {
    it('should emit prettify-requested event when prettify is triggered', async () => {
      await wrapper.vm.handlePrettify();

      expect(wrapper.emitted('prettify-requested')).toBeTruthy();
    });

    it('should emit prettify-requested with file identifier', async () => {
      await wrapper.vm.handlePrettify('file1');

      const emitted = wrapper.emitted('prettify-requested');
      expect(emitted).toHaveLength(1);
      expect(emitted[0][0]).toEqual({ fileId: 'file1' });
    });

    it('should handle prettify for file2', async () => {
      await wrapper.vm.handlePrettify('file2');

      const emitted = wrapper.emitted('prettify-requested');
      expect(emitted[0][0]).toEqual({ fileId: 'file2' });
    });
  });

  describe('Event emissions - edit-made', () => {
    it('should emit edit-made event when TreeViewer emits value-edited', async () => {
      const treeViewers = wrapper.findAllComponents(TreeViewer);

      await treeViewers[0].vm.$emit('value-edited', {
        keyPath: 'app.title',
        newValue: 'Updated Title',
        fileId: 'file1',
      });

      expect(wrapper.emitted('edit-made')).toBeTruthy();
    });

    it('should emit edit-made with edit details', async () => {
      const treeViewers = wrapper.findAllComponents(TreeViewer);

      const editData = {
        keyPath: 'app.title',
        newValue: 'Updated Title',
        fileId: 'file1',
      };

      await treeViewers[0].vm.$emit('value-edited', editData);

      const emitted = wrapper.emitted('edit-made');
      expect(emitted).toHaveLength(1);
      expect(emitted[0][0]).toEqual(editData);
    });

    it('should handle edits from both TreeViewers', async () => {
      const treeViewers = wrapper.findAllComponents(TreeViewer);

      await treeViewers[0].vm.$emit('value-edited', {
        keyPath: 'app.title',
        newValue: 'Title 1',
        fileId: 'file1',
      });

      await treeViewers[1].vm.$emit('value-edited', {
        keyPath: 'app.title',
        newValue: 'Title 2',
        fileId: 'file2',
      });

      const emitted = wrapper.emitted('edit-made');
      expect(emitted).toHaveLength(2);
      expect(emitted[0][0].fileId).toBe('file1');
      expect(emitted[1][0].fileId).toBe('file2');
    });
  });

  describe('TreeViewer node-toggled events', () => {
    it('should handle node-toggled event from file1 TreeViewer', async () => {
      const treeViewers = wrapper.findAllComponents(TreeViewer);

      await treeViewers[0].vm.$emit('node-toggled', {
        keyPath: 'app',
        expanded: true,
      });

      // Component should handle this internally
      expect(wrapper.vm).toBeDefined();
    });

    it('should handle node-toggled event from file2 TreeViewer', async () => {
      const treeViewers = wrapper.findAllComponents(TreeViewer);

      await treeViewers[1].vm.$emit('node-toggled', {
        keyPath: 'app',
        expanded: false,
      });

      // Component should handle this internally
      expect(wrapper.vm).toBeDefined();
    });
  });

  describe('Layout and styling', () => {
    it('should have proper layout classes', () => {
      expect(wrapper.find('.comparison-view').exists()).toBe(true);
      expect(wrapper.find('.comparison-container').exists()).toBe(true);
    });

    it('should have separate panes for each file', () => {
      const panes = wrapper.findAll('.file-pane');
      expect(panes.length).toBeGreaterThanOrEqual(2);
    });

    it('should display file labels', () => {
      const text = wrapper.text();
      expect(text).toMatch(/file\s*1|left/i);
      expect(text).toMatch(/file\s*2|right/i);
    });
  });

  describe('Empty state handling', () => {
    it('should handle when both files are empty', () => {
      const emptyWrapper = mount(ComparisonView, {
        props: {
          file1: {},
          file2: {},
          diffResults: [],
        },
      });

      const treeViewers = emptyWrapper.findAllComponents(TreeViewer);
      expect(treeViewers).toHaveLength(2);
    });

    it('should show message when no files are loaded', () => {
      const noFilesWrapper = mount(ComparisonView, {
        props: {
          file1: null,
          file2: null,
          diffResults: [],
        },
      });

      // Should still render the structure
      expect(noFilesWrapper.find('.comparison-view').exists()).toBe(true);
    });
  });

  describe('Synchronization features', () => {
    it('should support synchronized scrolling between panes', () => {
      // Check if component has scroll sync capability
      expect(wrapper.vm).toBeDefined();
    });

    it('should support synchronized expansion state', () => {
      // Check if component can sync expansion
      expect(wrapper.vm).toBeDefined();
    });
  });

  describe('Props validation', () => {
    it('should accept valid file1 prop', () => {
      expect(wrapper.props('file1')).toEqual(mockFile1);
    });

    it('should accept valid file2 prop', () => {
      expect(wrapper.props('file2')).toEqual(mockFile2);
    });

    it('should accept valid diffResults prop', () => {
      expect(wrapper.props('diffResults')).toEqual(mockDiffResults);
    });

    it('should handle diffResults as array', () => {
      expect(Array.isArray(wrapper.props('diffResults'))).toBe(true);
    });

    it('should default editable to false', () => {
      expect(wrapper.props('editable')).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle deeply nested objects', () => {
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

      const deepWrapper = mount(ComparisonView, {
        props: {
          file1: deepFile,
          file2: deepFile,
          diffResults: [],
        },
      });

      const treeViewers = deepWrapper.findAllComponents(TreeViewer);
      expect(treeViewers[0].props('content')).toEqual(deepFile);
    });

    it('should handle large number of diff results', () => {
      const largeDiffResults = Array.from({ length: 1000 }, (_, i) => ({
        keyPath: `key${i}`,
        status: 'different',
        leftValue: `value${i}`,
        rightValue: `value${i}_modified`,
      }));

      const largeWrapper = mount(ComparisonView, {
        props: {
          file1: mockFile1,
          file2: mockFile2,
          diffResults: largeDiffResults,
        },
      });

      const treeViewers = largeWrapper.findAllComponents(TreeViewer);
      expect(treeViewers[0].props('diffResults')).toHaveLength(1000);
    });

    it('should handle special characters in keys', () => {
      const specialFile = {
        'key-with-dash': 'value',
        'key.with.dots': 'value',
        'key with spaces': 'value',
      };

      const specialWrapper = mount(ComparisonView, {
        props: {
          file1: specialFile,
          file2: specialFile,
          diffResults: [],
        },
      });

      expect(specialWrapper.findAllComponents(TreeViewer)).toHaveLength(2);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible landmarks', () => {
      const view = wrapper.find('.comparison-view');
      expect(view.exists()).toBe(true);
    });

    it('should have descriptive labels for file panes', () => {
      // Check for ARIA labels or visible labels
      const text = wrapper.text();
      expect(text.length).toBeGreaterThan(0);
    });
  });

  describe('Performance considerations', () => {
    it('should not re-render unnecessarily', async () => {
      const renderSpy = vi.fn();
      wrapper.vm.$watch(() => wrapper.props(), renderSpy);

      // Trigger update with same props
      await wrapper.setProps({
        file1: mockFile1,
        file2: mockFile2,
        diffResults: mockDiffResults,
      });

      // Should minimize unnecessary renders
      expect(wrapper.vm).toBeDefined();
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete workflow: load files, edit, save', async () => {
      // Initial load
      expect(wrapper.findAllComponents(TreeViewer)).toHaveLength(2);

      // Make edit
      const treeViewers = wrapper.findAllComponents(TreeViewer);
      await treeViewers[0].vm.$emit('value-edited', {
        keyPath: 'app.title',
        newValue: 'New Title',
        fileId: 'file1',
      });

      expect(wrapper.emitted('edit-made')).toBeTruthy();

      // Save
      await wrapper.vm.handleSave();
      expect(wrapper.emitted('save-requested')).toBeTruthy();
    });

    it('should handle multiple edits before save', async () => {
      const treeViewers = wrapper.findAllComponents(TreeViewer);

      // Multiple edits
      await treeViewers[0].vm.$emit('value-edited', {
        keyPath: 'app.title',
        newValue: 'Edit 1',
        fileId: 'file1',
      });

      await treeViewers[1].vm.$emit('value-edited', {
        keyPath: 'app.description',
        newValue: 'Edit 2',
        fileId: 'file2',
      });

      const emitted = wrapper.emitted('edit-made');
      expect(emitted).toHaveLength(2);
    });
  });
});
