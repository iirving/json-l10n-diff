import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import TreeViewer from '@/components/TreeViewer.vue';

describe('TreeViewer', () => {
  let wrapper;

  const mockData = {
    app: {
      title: 'My App',
      welcome: 'Welcome',
      nested: {
        deep: 'value',
      },
    },
    errors: {
      notFound: 'Not found',
    },
  };

  const mockDiffResults = [
    {
      keyPath: 'app',
      status: 'different',
      valueLeft: { title: 'My App', welcome: 'Welcome' },
      valueRight: { title: 'Mon App', welcome: 'Welcome' },
      depth: 1,
      isLeaf: false,
      parentPath: '',
    },
    {
      keyPath: 'app.title',
      status: 'different',
      valueLeft: 'My App',
      valueRight: 'Mon App',
      depth: 2,
      isLeaf: true,
      parentPath: 'app',
    },
    {
      keyPath: 'app.welcome',
      status: 'identical',
      valueLeft: 'Welcome',
      valueRight: 'Welcome',
      depth: 2,
      isLeaf: true,
      parentPath: 'app',
    },
    {
      keyPath: 'app.nested',
      status: 'missing-left',
      valueLeft: null,
      valueRight: { deep: 'value' },
      depth: 2,
      isLeaf: false,
      parentPath: 'app',
    },
    {
      keyPath: 'errors',
      status: 'different',
      valueLeft: {},
      valueRight: { notFound: 'Not found' },
      depth: 1,
      isLeaf: false,
      parentPath: '',
    },
    {
      keyPath: 'errors.notFound',
      status: 'missing-right',
      valueLeft: null,
      valueRight: 'Not found',
      depth: 2,
      isLeaf: true,
      parentPath: 'errors',
    },
  ];

  beforeEach(() => {
    wrapper = mount(TreeViewer, {
      props: {
        content: mockData,
        fileId: 'file1',
        diffResults: mockDiffResults,
        defaultExpanded: true,
        editable: false,
      },
    });
  });

  describe('Rendering', () => {
    it('should render the tree viewer container', () => {
      expect(wrapper.find('.tree-viewer').exists()).toBe(true);
    });

    it('should render root level keys', () => {
      const treeNodes = wrapper.findAll('.tree-node');
      expect(treeNodes.length).toBeGreaterThan(0);
    });

    it('should render nested keys with correct indentation', () => {
      const nestedNodes = wrapper.findAll('.tree-node[data-depth="1"]');
      expect(nestedNodes.length).toBeGreaterThan(0);
    });

    it('should display key names', () => {
      expect(wrapper.text()).toContain('app');
      expect(wrapper.text()).toContain('errors');
    });

    it('should display leaf values', () => {
      expect(wrapper.text()).toContain('My App');
      expect(wrapper.text()).toContain('Welcome');
    });
  });

  describe('Expand/Collapse', () => {
    it('should show expand/collapse icons for parent nodes', () => {
      const expandIcons = wrapper.findAll('.expand-icon');
      expect(expandIcons.length).toBeGreaterThan(0);
    });

    it('should toggle node expansion on icon click', async () => {
      const expandIcon = wrapper.find('.expand-icon');
      const parentNode = expandIcon.element.closest('.tree-node');
      const isExpanded = parentNode.classList.contains('expanded');

      await expandIcon.trigger('click');
      await wrapper.vm.$nextTick();

      const newParentNode = wrapper
        .find('.expand-icon')
        .element.closest('.tree-node');
      const newIsExpanded = newParentNode.classList.contains('expanded');

      expect(newIsExpanded).toBe(!isExpanded);
    });

    it('should emit node-toggled event when toggling', async () => {
      const expandIcon = wrapper.find('.expand-icon');
      await expandIcon.trigger('click');

      expect(wrapper.emitted('node-toggled')).toBeTruthy();
      expect(wrapper.emitted('node-toggled')[0]).toEqual(['app']);
    });

    it('should hide children when node is collapsed', async () => {
      // First, ensure node is expanded by calling expandAll
      await wrapper.vm.expandAll();
      await wrapper.vm.$nextTick();

      let childNodes = wrapper.findAll('.tree-node[data-parent="app"]');
      expect(childNodes.length).toBeGreaterThan(0);

      // Collapse the node
      const expandIcon = wrapper.find('.expand-icon');
      await expandIcon.trigger('click');
      await wrapper.vm.$nextTick();

      childNodes = wrapper.findAll('.tree-node[data-parent="app"]');
      expect(childNodes.length).toBe(0);
    });

    it('should expand all nodes when expandAll is called', async () => {
      await wrapper.vm.collapseAll();
      await wrapper.vm.$nextTick();

      let expandedNodes = wrapper.findAll('.tree-node.expanded');
      expect(expandedNodes.length).toBe(0);

      await wrapper.vm.expandAll();
      await wrapper.vm.$nextTick();

      expandedNodes = wrapper.findAll('.tree-node.expanded');
      expect(expandedNodes.length).toBeGreaterThan(0);
    });

    it('should collapse all nodes when collapseAll is called', async () => {
      await wrapper.vm.expandAll();
      await wrapper.vm.$nextTick();

      let expandedNodes = wrapper.findAll('.tree-node.expanded');
      expect(expandedNodes.length).toBeGreaterThan(0);

      await wrapper.vm.collapseAll();
      await wrapper.vm.$nextTick();

      expandedNodes = wrapper.findAll('.tree-node.expanded');
      expect(expandedNodes.length).toBe(0);
    });
  });

  describe('Color Coding', () => {
    it('should apply missing-left class for keys missing in left file', () => {
      const missingNode = wrapper.find(
        '.tree-node[data-status="missing-left"]'
      );
      expect(missingNode.exists()).toBe(true);
    });

    it('should apply missing-right class for keys missing in right file', () => {
      const missingNode = wrapper.find(
        '.tree-node[data-status="missing-right"]'
      );
      expect(missingNode.exists()).toBe(true);
    });

    it('should apply identical class for keys with same values', () => {
      const identicalNode = wrapper.find('.tree-node[data-status="identical"]');
      expect(identicalNode.exists()).toBe(true);
    });

    it('should apply different class for keys with different values', () => {
      const differentNode = wrapper.find('.tree-node[data-status="different"]');
      expect(differentNode.exists()).toBe(true);
    });

    it('should use neutral style for keys without diff results', () => {
      const wrapperWithoutDiff = mount(TreeViewer, {
        props: {
          content: mockData,
          fileId: 'file1',
          diffResults: [],
          defaultExpanded: true,
        },
      });

      const nodes = wrapperWithoutDiff.findAll('.tree-node');
      nodes.forEach((node) => {
        expect(node.attributes('data-status')).toBeUndefined();
      });
    });
  });

  describe('Recursion', () => {
    it('should render deeply nested objects', async () => {
      const deepData = {
        level1: {
          level2: {
            level3: {
              level4: 'deep value',
            },
          },
        },
      };

      const deepWrapper = mount(TreeViewer, {
        props: {
          content: deepData,
          fileId: 'file1',
          defaultExpanded: true,
        },
      });

      // Wait for onMounted to complete
      await deepWrapper.vm.$nextTick();

      expect(deepWrapper.text()).toContain('level1');
      expect(deepWrapper.text()).toContain('level2');
      expect(deepWrapper.text()).toContain('level3');
      expect(deepWrapper.text()).toContain('level4');
      expect(deepWrapper.text()).toContain('deep value');
    });

    it('should handle arrays as values', async () => {
      const arrayData = {
        items: ['item1', 'item2', 'item3'],
      };

      const arrayWrapper = mount(TreeViewer, {
        props: {
          content: arrayData,
          fileId: 'file1',
          defaultExpanded: true,
        },
      });

      // Wait for next tick to ensure expandAll completes
      await arrayWrapper.vm.$nextTick();

      expect(arrayWrapper.text()).toContain('items');
      // Arrays are now expandable parent nodes - check for array indices
      expect(arrayWrapper.text()).toContain('0');
      expect(arrayWrapper.text()).toContain('1');
      expect(arrayWrapper.text()).toContain('2');
      // Values are displayed for each index
      expect(arrayWrapper.text()).toContain('item1');
      expect(arrayWrapper.text()).toContain('item2');
      expect(arrayWrapper.text()).toContain('item3');
    });
  });

  describe('Exposed Methods', () => {
    it('should expose scrollToKey method', () => {
      expect(typeof wrapper.vm.scrollToKey).toBe('function');
    });

    it('should expose expandAll method', () => {
      expect(typeof wrapper.vm.expandAll).toBe('function');
    });

    it('should expose collapseAll method', () => {
      expect(typeof wrapper.vm.collapseAll).toBe('function');
    });

    it('should scroll to a specific key when scrollToKey is called', async () => {
      const scrollIntoViewMock = vi.fn();
      const targetElement = document.createElement('div');
      targetElement.scrollIntoView = scrollIntoViewMock;

      // Mock document.querySelector instead of wrapper.$el.querySelector
      const querySelectorSpy = vi
        .spyOn(document, 'querySelector')
        .mockReturnValue(targetElement);

      await wrapper.vm.scrollToKey('app.title');

      expect(querySelectorSpy).toHaveBeenCalledWith(
        '[data-key-path="app.title"]'
      );
      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
      });

      // Cleanup
      querySelectorSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty object', () => {
      const emptyWrapper = mount(TreeViewer, {
        props: {
          content: {},
          fileId: 'file1',
        },
      });

      expect(emptyWrapper.find('.tree-viewer').exists()).toBe(true);
      expect(emptyWrapper.findAll('.tree-node').length).toBe(0);
    });

    it('should handle null values', () => {
      const nullData = {
        nullKey: null,
      };

      const nullWrapper = mount(TreeViewer, {
        props: {
          content: nullData,
          fileId: 'file1',
        },
      });

      expect(nullWrapper.text()).toContain('nullKey');
      expect(nullWrapper.text()).toContain('null');
    });

    it('should handle boolean values', () => {
      const boolData = {
        trueKey: true,
        falseKey: false,
      };

      const boolWrapper = mount(TreeViewer, {
        props: {
          content: boolData,
          fileId: 'file1',
        },
      });

      expect(boolWrapper.text()).toContain('trueKey');
      expect(boolWrapper.text()).toContain('true');
      expect(boolWrapper.text()).toContain('falseKey');
      expect(boolWrapper.text()).toContain('false');
    });

    it('should handle numeric values', () => {
      const numData = {
        intKey: 42,
        floatKey: 3.14,
        zeroKey: 0,
      };

      const numWrapper = mount(TreeViewer, {
        props: {
          content: numData,
          fileId: 'file1',
        },
      });

      expect(numWrapper.text()).toContain('intKey');
      expect(numWrapper.text()).toContain('42');
      expect(numWrapper.text()).toContain('floatKey');
      expect(numWrapper.text()).toContain('3.14');
      expect(numWrapper.text()).toContain('zeroKey');
      expect(numWrapper.text()).toContain('0');
    });
  });

  describe('Default Props', () => {
    it('should use default props when not provided', () => {
      const defaultWrapper = mount(TreeViewer, {
        props: {
          content: mockData,
          fileId: 'file1',
        },
      });

      expect(defaultWrapper.props('diffResults')).toEqual([]);
      expect(defaultWrapper.props('defaultExpanded')).toBe(true);
      expect(defaultWrapper.props('editable')).toBe(false);
    });
  });

  describe('Inline Editing', () => {
    const simpleData = {
      title: 'Hello World',
      count: 42,
      active: true,
    };

    it('should not show edit hint when editable is false', () => {
      const wrapper = mount(TreeViewer, {
        props: {
          content: simpleData,
          fileId: 'file1',
          editable: false,
        },
      });

      expect(wrapper.find('.edit-hint').exists()).toBe(false);
    });

    it('should show edit hint on hover when editable is true', async () => {
      const wrapper = mount(TreeViewer, {
        props: {
          content: simpleData,
          fileId: 'file1',
          editable: true,
        },
      });

      await wrapper.vm.$nextTick();

      // Check that editable values have the editable class
      const editableValues = wrapper.findAll('.node-value.editable');
      expect(editableValues.length).toBeGreaterThan(0);
    });

    it('should show edit input when clicking on an editable value', async () => {
      const wrapper = mount(TreeViewer, {
        props: {
          content: simpleData,
          fileId: 'file1',
          editable: true,
        },
      });

      await wrapper.vm.$nextTick();

      const editableValue = wrapper.find('.node-value.editable');
      await editableValue.trigger('click');

      expect(wrapper.find('.edit-input').exists()).toBe(true);
    });

    it('should populate edit input with current value', async () => {
      const wrapper = mount(TreeViewer, {
        props: {
          content: { name: 'Test Name' },
          fileId: 'file1',
          editable: true,
        },
      });

      await wrapper.vm.$nextTick();

      const editableValue = wrapper.find('.node-value.editable');
      await editableValue.trigger('click');

      const input = wrapper.find('.edit-input');
      expect(input.element.value).toBe('Test Name');
    });

    it('should emit value-edited event when saving edit', async () => {
      const wrapper = mount(TreeViewer, {
        props: {
          content: { name: 'Old Value' },
          fileId: 'file1',
          editable: true,
        },
      });

      await wrapper.vm.$nextTick();

      const editableValue = wrapper.find('.node-value.editable');
      await editableValue.trigger('click');

      const input = wrapper.find('.edit-input');
      await input.setValue('New Value');
      await input.trigger('keydown', { key: 'Enter' });

      const emitted = wrapper.emitted('value-edited');
      expect(emitted).toBeTruthy();
      expect(emitted[0][0]).toEqual({
        keyPath: 'name',
        newValue: 'New Value',
        oldValue: 'Old Value',
        targetFile: 'file1',
      });
    });

    it('should cancel edit on Escape key', async () => {
      const wrapper = mount(TreeViewer, {
        props: {
          content: { name: 'Original' },
          fileId: 'file1',
          editable: true,
        },
      });

      await wrapper.vm.$nextTick();

      const editableValue = wrapper.find('.node-value.editable');
      await editableValue.trigger('click');

      const input = wrapper.find('.edit-input');
      await input.setValue('Changed');
      await input.trigger('keydown', { key: 'Escape' });

      // Should not emit value-edited when canceling
      expect(wrapper.emitted('value-edited')).toBeFalsy();
      // Edit mode should be closed
      expect(wrapper.find('.edit-input').exists()).toBe(false);
    });

    it('should not emit value-edited if value did not change', async () => {
      const wrapper = mount(TreeViewer, {
        props: {
          content: { name: 'Same Value' },
          fileId: 'file1',
          editable: true,
        },
      });

      await wrapper.vm.$nextTick();

      const editableValue = wrapper.find('.node-value.editable');
      await editableValue.trigger('click');

      const input = wrapper.find('.edit-input');
      // Value is already 'Same Value', don't change it
      await input.trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('value-edited')).toBeFalsy();
    });

    it('should parse number values correctly', async () => {
      const wrapper = mount(TreeViewer, {
        props: {
          content: { count: 'old' },
          fileId: 'file1',
          editable: true,
        },
      });

      await wrapper.vm.$nextTick();

      const editableValue = wrapper.find('.node-value.editable');
      await editableValue.trigger('click');

      const input = wrapper.find('.edit-input');
      await input.setValue('123');
      await input.trigger('keydown', { key: 'Enter' });

      const emitted = wrapper.emitted('value-edited');
      expect(emitted).toBeTruthy();
      expect(emitted[0][0].newValue).toBe(123);
      expect(typeof emitted[0][0].newValue).toBe('number');
    });

    it('should parse boolean true correctly', async () => {
      const wrapper = mount(TreeViewer, {
        props: {
          content: { flag: 'old' },
          fileId: 'file1',
          editable: true,
        },
      });

      await wrapper.vm.$nextTick();

      const editableValue = wrapper.find('.node-value.editable');
      await editableValue.trigger('click');

      const input = wrapper.find('.edit-input');
      await input.setValue('true');
      await input.trigger('keydown', { key: 'Enter' });

      const emitted = wrapper.emitted('value-edited');
      expect(emitted).toBeTruthy();
      expect(emitted[0][0].newValue).toBe(true);
      expect(typeof emitted[0][0].newValue).toBe('boolean');
    });

    it('should parse boolean false correctly', async () => {
      const wrapper = mount(TreeViewer, {
        props: {
          content: { flag: 'old' },
          fileId: 'file1',
          editable: true,
        },
      });

      await wrapper.vm.$nextTick();

      const editableValue = wrapper.find('.node-value.editable');
      await editableValue.trigger('click');

      const input = wrapper.find('.edit-input');
      await input.setValue('false');
      await input.trigger('keydown', { key: 'Enter' });

      const emitted = wrapper.emitted('value-edited');
      expect(emitted).toBeTruthy();
      expect(emitted[0][0].newValue).toBe(false);
      expect(typeof emitted[0][0].newValue).toBe('boolean');
    });

    it('should parse null correctly', async () => {
      const wrapper = mount(TreeViewer, {
        props: {
          content: { value: 'old' },
          fileId: 'file1',
          editable: true,
        },
      });

      await wrapper.vm.$nextTick();

      const editableValue = wrapper.find('.node-value.editable');
      await editableValue.trigger('click');

      const input = wrapper.find('.edit-input');
      await input.setValue('null');
      await input.trigger('keydown', { key: 'Enter' });

      const emitted = wrapper.emitted('value-edited');
      expect(emitted).toBeTruthy();
      expect(emitted[0][0].newValue).toBe(null);
    });

    it('should not make parent nodes editable', async () => {
      const wrapper = mount(TreeViewer, {
        props: {
          content: {
            nested: {
              child: 'value',
            },
          },
          fileId: 'file1',
          editable: true,
        },
      });

      await wrapper.vm.$nextTick();

      // The parent node 'nested' should not have a .node-value element
      // (parent nodes have .node-value-hint instead)
      const nestedNode = wrapper.find('[data-key-path="nested"]');
      const nestedNodeContent = nestedNode.find('.tree-node-content');
      // Parent nodes should show hint, not editable value
      expect(nestedNodeContent.find('.node-value-hint').exists()).toBe(true);
      // The direct .node-value should not exist on the parent node's content
      expect(nestedNodeContent.find(':scope > .node-value').exists()).toBe(
        false
      );
    });

    it('should not trigger edit mode when clicking on parent node', async () => {
      const wrapper = mount(TreeViewer, {
        props: {
          content: {
            nested: {
              child: 'value',
            },
          },
          fileId: 'file1',
          editable: true,
        },
      });

      await wrapper.vm.$nextTick();

      const nestedNode = wrapper.find('[data-key-path="nested"]');
      const nodeContent = nestedNode.find('.tree-node-content');

      // Try clicking on the parent node content
      await nodeContent.trigger('click');
      await wrapper.vm.$nextTick();

      // Verify no edit input appears
      expect(wrapper.find('.edit-input').exists()).toBe(false);
    });

    it('should include correct keyPath for nested values', async () => {
      const wrapper = mount(TreeViewer, {
        props: {
          content: {
            parent: {
              child: 'value',
            },
          },
          fileId: 'file1',
          editable: true,
        },
      });

      await wrapper.vm.$nextTick();

      // Find the nested value
      const childNode = wrapper.find('[data-key-path="parent.child"]');
      const editableValue = childNode.find('.node-value.editable');
      await editableValue.trigger('click');

      const input = wrapper.find('.edit-input');
      await input.setValue('newValue');
      await input.trigger('keydown', { key: 'Enter' });

      const emitted = wrapper.emitted('value-edited');
      expect(emitted).toBeTruthy();
      expect(emitted[0][0].keyPath).toBe('parent.child');
    });

    it('should include correct targetFile in event', async () => {
      const wrapper = mount(TreeViewer, {
        props: {
          content: { name: 'value' },
          fileId: 'file2',
          editable: true,
        },
      });

      await wrapper.vm.$nextTick();

      const editableValue = wrapper.find('.node-value.editable');
      await editableValue.trigger('click');

      const input = wrapper.find('.edit-input');
      await input.setValue('changed');
      await input.trigger('keydown', { key: 'Enter' });

      const emitted = wrapper.emitted('value-edited');
      expect(emitted).toBeTruthy();
      expect(emitted[0][0].targetFile).toBe('file2');
    });

    it('should have accessible edit button attributes', async () => {
      const wrapper = mount(TreeViewer, {
        props: {
          content: { name: 'value' },
          fileId: 'file1',
          editable: true,
        },
      });

      await wrapper.vm.$nextTick();

      const editableValue = wrapper.find('.node-value.editable');
      expect(editableValue.attributes('role')).toBe('button');
      expect(editableValue.attributes('tabindex')).toBe('0');
      expect(editableValue.attributes('aria-label')).toContain('Edit');
    });

    it('should start editing on Enter key press', async () => {
      const wrapper = mount(TreeViewer, {
        props: {
          content: { name: 'value' },
          fileId: 'file1',
          editable: true,
        },
      });

      await wrapper.vm.$nextTick();

      const editableValue = wrapper.find('.node-value.editable');
      await editableValue.trigger('keydown.enter');

      expect(wrapper.find('.edit-input').exists()).toBe(true);
    });
  });
});
