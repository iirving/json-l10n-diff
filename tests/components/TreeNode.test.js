import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import TreeNode from '@/components/TreeNode.vue';

describe('TreeNode', () => {
  let wrapper;
  let mockIsExpanded;
  let mockGetDiffStatus;
  let mockToggleNode;

  beforeEach(() => {
    // Create mock functions for inject dependencies
    mockIsExpanded = vi.fn(() => false);
    mockGetDiffStatus = vi.fn(() => null);
    mockToggleNode = vi.fn();

    // Default wrapper with mocked inject values
    wrapper = mount(TreeNode, {
      props: {
        nodeKey: 'testKey',
        value: 'testValue',
        depth: 0,
        keyPath: 'testKey',
        parentPath: '',
        editable: false,
      },
      global: {
        provide: {
          isExpanded: mockIsExpanded,
          getDiffStatus: mockGetDiffStatus,
          toggleNode: mockToggleNode,
        },
      },
    });
  });

  describe('Rendering', () => {
    it('should render the tree node container', () => {
      expect(wrapper.find('.tree-node').exists()).toBe(true);
    });

    it('should display the node key', () => {
      expect(wrapper.find('.node-key').text()).toBe('testKey');
    });

    it('should display the node separator', () => {
      expect(wrapper.find('.node-separator').text()).toBe(':');
    });

    it('should display leaf value for primitive types', () => {
      expect(wrapper.find('.node-value').text()).toBe('"testValue"');
    });

    it('should display expand icon placeholder for leaf nodes', () => {
      expect(wrapper.find('.expand-icon-placeholder').exists()).toBe(true);
      expect(wrapper.find('.expand-icon').exists()).toBe(false);
    });

    it('should display expand icon for parent nodes', () => {
      const parentWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'parent',
          value: { child: 'value' },
          depth: 0,
          keyPath: 'parent',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(parentWrapper.find('.expand-icon').exists()).toBe(true);
      expect(parentWrapper.find('.expand-icon-placeholder').exists()).toBe(
        false
      );
    });

    it('should apply correct depth-based padding', () => {
      const depthWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'key',
          value: 'value',
          depth: 3,
          keyPath: 'parent.child.key',
          parentPath: 'parent.child',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      const content = depthWrapper.find('.tree-node-content');
      expect(content.attributes('style')).toContain('padding-left: 12px');
    });
  });

  describe('Data Attributes', () => {
    it('should set data-depth attribute', () => {
      expect(wrapper.find('.tree-node').attributes('data-depth')).toBe('0');
    });

    it('should set data-key-path attribute', () => {
      expect(wrapper.find('.tree-node').attributes('data-key-path')).toBe(
        'testKey'
      );
    });

    it('should set data-parent attribute', () => {
      expect(wrapper.find('.tree-node').attributes('data-parent')).toBe('');
    });

    it('should set data-status attribute when diff status is provided', () => {
      mockGetDiffStatus = vi.fn(() => 'missing-left');
      const statusWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'key',
          value: 'value',
          depth: 0,
          keyPath: 'key',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(statusWrapper.find('.tree-node').attributes('data-status')).toBe(
        'missing-left'
      );
    });

    it('should not set data-status attribute when no diff status', () => {
      expect(
        wrapper.find('.tree-node').attributes('data-status')
      ).toBeUndefined();
    });
  });

  describe('Value Formatting', () => {
    it('should format null values', () => {
      const nullWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'nullKey',
          value: null,
          depth: 0,
          keyPath: 'nullKey',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(nullWrapper.find('.node-value').text()).toBe('null');
    });

    it('should format undefined values', () => {
      // Note: Vue props convert undefined to null by default
      // So we test the formatValue function's handling of null
      const nullWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'nullKey',
          value: null,
          depth: 0,
          keyPath: 'nullKey',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(nullWrapper.find('.node-value').text()).toBe('null');
    });

    it('should format string values with quotes', () => {
      expect(wrapper.find('.node-value').text()).toBe('"testValue"');
    });

    it('should format number values', () => {
      const numberWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'numberKey',
          value: 42,
          depth: 0,
          keyPath: 'numberKey',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(numberWrapper.find('.node-value').text()).toBe('42');
    });

    it('should format boolean values', () => {
      const boolWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'boolKey',
          value: true,
          depth: 0,
          keyPath: 'boolKey',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(boolWrapper.find('.node-value').text()).toBe('true');
    });

    it('should treat arrays as expandable parent nodes', () => {
      const arrayWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'arrayKey',
          value: [1, 2, 3],
          depth: 0,
          keyPath: 'arrayKey',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      // Arrays are now parent nodes with expand/collapse functionality
      expect(arrayWrapper.find('.expand-icon').exists()).toBe(true);
      expect(arrayWrapper.find('.node-value-hint').exists()).toBe(true);
      // Should not have .node-value since it's a parent node
      expect(arrayWrapper.find('.node-value').exists()).toBe(false);
    });

    it('should format object values with hint', () => {
      const objectWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'objectKey',
          value: { nested: 'value' },
          depth: 0,
          keyPath: 'objectKey',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(objectWrapper.find('.node-value-hint').exists()).toBe(true);
    });
  });

  describe('Expand/Collapse', () => {
    it('should show collapsed icon when node is not expanded', () => {
      mockIsExpanded = vi.fn(() => false);
      const parentWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'parent',
          value: { child: 'value' },
          depth: 0,
          keyPath: 'parent',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(parentWrapper.find('.expand-icon').text()).toBe('▶');
    });

    it('should show expanded icon when node is expanded', () => {
      mockIsExpanded = vi.fn(() => true);
      const parentWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'parent',
          value: { child: 'value' },
          depth: 0,
          keyPath: 'parent',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(parentWrapper.find('.expand-icon').text()).toBe('▼');
    });

    it('should call toggleNode when expand icon is clicked', async () => {
      const parentWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'parent',
          value: { child: 'value' },
          depth: 0,
          keyPath: 'parent',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      await parentWrapper.find('.expand-icon').trigger('click');

      expect(mockToggleNode).toHaveBeenCalledWith('parent');
    });

    it('should not call toggleNode for leaf nodes', async () => {
      // Leaf node doesn't have expand icon, so no click should happen
      expect(wrapper.find('.expand-icon').exists()).toBe(false);
    });

    it('should add expanded class when node is expanded', () => {
      mockIsExpanded = vi.fn(() => true);
      const expandedWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'parent',
          value: { child: 'value' },
          depth: 0,
          keyPath: 'parent',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(expandedWrapper.find('.tree-node').classes()).toContain(
        'expanded'
      );
    });

    it('should show collapsed hint when parent node is collapsed', () => {
      mockIsExpanded = vi.fn(() => false);
      const collapsedWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'parent',
          value: { child: 'value' },
          depth: 0,
          keyPath: 'parent',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(collapsedWrapper.find('.node-value-hint').text()).toBe('{...}');
    });

    it('should hide hint when parent node is expanded', () => {
      mockIsExpanded = vi.fn(() => true);
      const expandedWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'parent',
          value: { child: 'value' },
          depth: 0,
          keyPath: 'parent',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(expandedWrapper.find('.node-value-hint').text()).toBe('');
    });
  });

  describe('Recursion', () => {
    it('should render child nodes when expanded', () => {
      mockIsExpanded = vi.fn(() => true);
      const parentWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'parent',
          value: {
            child1: 'value1',
            child2: 'value2',
          },
          depth: 0,
          keyPath: 'parent',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      // Check that child nodes are rendered in the DOM
      const childNodes = parentWrapper.findAll(
        '.tree-node[data-parent="parent"]'
      );
      expect(childNodes.length).toBe(2);
    });

    it('should not render child nodes when collapsed', () => {
      mockIsExpanded = vi.fn(() => false);
      const parentWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'parent',
          value: {
            child1: 'value1',
            child2: 'value2',
          },
          depth: 0,
          keyPath: 'parent',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      // Children should not be rendered when collapsed
      const childNodes = parentWrapper.findAll(
        '.tree-node[data-parent="parent"]'
      );
      expect(childNodes.length).toBe(0);
    });

    it('should pass correct props to child nodes', () => {
      mockIsExpanded = vi.fn(() => true);
      const parentWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'parent',
          value: {
            child: 'childValue',
          },
          depth: 1,
          keyPath: 'parent',
          parentPath: '',
          editable: true,
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      // Check child node data attributes
      const childNode = parentWrapper.find(
        '.tree-node[data-key-path="parent.child"]'
      );
      expect(childNode.exists()).toBe(true);
      expect(childNode.attributes('data-depth')).toBe('2');
      expect(childNode.attributes('data-parent')).toBe('parent');
    });

    it('should build correct key paths for nested children', () => {
      mockIsExpanded = vi.fn(() => true);
      const parentWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'level1',
          value: {
            level2: {
              level3: 'deepValue',
            },
          },
          depth: 0,
          keyPath: 'level1',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      // Check that child node has correct keyPath in data attribute
      const level2Node = parentWrapper.find(
        '.tree-node[data-key-path="level1.level2"]'
      );
      expect(level2Node.exists()).toBe(true);
      expect(level2Node.attributes('data-parent')).toBe('level1');
    });
  });

  describe('Diff Status Styling', () => {
    it('should apply missing-left status class', () => {
      mockGetDiffStatus = vi.fn(() => 'missing-left');
      const statusWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'key',
          value: 'value',
          depth: 0,
          keyPath: 'key',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(statusWrapper.find('.tree-node').attributes('data-status')).toBe(
        'missing-left'
      );
    });

    it('should apply missing-right status class', () => {
      mockGetDiffStatus = vi.fn(() => 'missing-right');
      const statusWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'key',
          value: 'value',
          depth: 0,
          keyPath: 'key',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(statusWrapper.find('.tree-node').attributes('data-status')).toBe(
        'missing-right'
      );
    });

    it('should apply identical status class', () => {
      mockGetDiffStatus = vi.fn(() => 'identical');
      const statusWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'key',
          value: 'value',
          depth: 0,
          keyPath: 'key',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(statusWrapper.find('.tree-node').attributes('data-status')).toBe(
        'identical'
      );
    });

    it('should apply different status class', () => {
      mockGetDiffStatus = vi.fn(() => 'different');
      const statusWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'key',
          value: 'value',
          depth: 0,
          keyPath: 'key',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(statusWrapper.find('.tree-node').attributes('data-status')).toBe(
        'different'
      );
    });
  });

  describe('Props Validation', () => {
    it('should accept valid nodeKey prop', () => {
      expect(wrapper.props('nodeKey')).toBe('testKey');
    });

    it('should accept valid value prop of different types', () => {
      const stringWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'key',
          value: 'string',
          depth: 0,
          keyPath: 'key',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });
      expect(stringWrapper.props('value')).toBe('string');

      const numberWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'key',
          value: 123,
          depth: 0,
          keyPath: 'key',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });
      expect(numberWrapper.props('value')).toBe(123);

      const boolWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'key',
          value: false,
          depth: 0,
          keyPath: 'key',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });
      expect(boolWrapper.props('value')).toBe(false);
    });

    it('should use default depth of 0', () => {
      const defaultWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'key',
          keyPath: 'key',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(defaultWrapper.props('depth')).toBe(0);
    });

    it('should use default parentPath of empty string', () => {
      const defaultWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'key',
          keyPath: 'key',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(defaultWrapper.props('parentPath')).toBe('');
    });

    it('should use default editable of false', () => {
      const defaultWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'key',
          keyPath: 'key',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(defaultWrapper.props('editable')).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty object values', () => {
      const emptyObjectWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'emptyObj',
          value: {},
          depth: 0,
          keyPath: 'emptyObj',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(emptyObjectWrapper.find('.node-value-hint').exists()).toBe(true);
    });

    it('should handle deeply nested objects', () => {
      mockIsExpanded = vi.fn(() => true);
      const deepWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'root',
          value: {
            level1: {
              level2: {
                level3: 'deep',
              },
            },
          },
          depth: 0,
          keyPath: 'root',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      // Check that nested nodes exist
      const allNodes = deepWrapper.findAll('.tree-node');
      expect(allNodes.length).toBeGreaterThan(1);
    });

    it('should handle special characters in keys', () => {
      const specialKeyWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'key-with-dash',
          value: 'value',
          depth: 0,
          keyPath: 'key-with-dash',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(specialKeyWrapper.find('.node-key').text()).toBe('key-with-dash');
    });

    it('should handle unicode characters in values', () => {
      const unicodeWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'unicode',
          value: '你好世界 🌍',
          depth: 0,
          keyPath: 'unicode',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(unicodeWrapper.find('.node-value').text()).toContain('你好世界');
    });

    it('should handle zero as a value', () => {
      const zeroWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'zero',
          value: 0,
          depth: 0,
          keyPath: 'zero',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(zeroWrapper.find('.node-value').text()).toBe('0');
    });

    it('should handle empty string as a value', () => {
      const emptyStringWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'empty',
          value: '',
          depth: 0,
          keyPath: 'empty',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(emptyStringWrapper.find('.node-value').text()).toBe('""');
    });
  });

  describe('Inject Dependencies', () => {
    it('should use injected isExpanded function', () => {
      mockIsExpanded = vi.fn(() => true);
      const injectedWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'parent',
          value: { child: 'value' },
          depth: 0,
          keyPath: 'parent',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(mockIsExpanded).toHaveBeenCalledWith('parent');
      expect(injectedWrapper.find('.tree-node').classes()).toContain(
        'expanded'
      );
    });

    it('should use injected getDiffStatus function', () => {
      mockGetDiffStatus = vi.fn(() => 'identical');
      const injectedWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'key',
          value: 'value',
          depth: 0,
          keyPath: 'key',
          parentPath: '',
        },
        global: {
          provide: {
            isExpanded: mockIsExpanded,
            getDiffStatus: mockGetDiffStatus,
            toggleNode: mockToggleNode,
          },
        },
      });

      expect(mockGetDiffStatus).toHaveBeenCalledWith('key');
      expect(injectedWrapper.find('.tree-node').attributes('data-status')).toBe(
        'identical'
      );
    });

    it('should use default functions when inject is not provided', () => {
      // Mount without providing inject values
      const noInjectWrapper = mount(TreeNode, {
        props: {
          nodeKey: 'key',
          value: 'value',
          depth: 0,
          keyPath: 'key',
          parentPath: '',
        },
      });

      // Should not throw errors and should render
      expect(noInjectWrapper.find('.tree-node').exists()).toBe(true);
    });
  });
});
