import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import DualTreeNode from '@/components/DualTreeNode.vue';

describe('DualTreeNode', () => {
  /**
   * Helper to create a leaf node with the given status
   */
  const makeNode = (overrides = {}) => ({
    key: 'title',
    keyPath: 'app.title',
    value1: 'Hello',
    value2: 'Hello',
    status: 'identical',
    isParent: false,
    children: [],
    ...overrides,
  });

  const mountNode = (nodeOverrides = {}, propsOverrides = {}) => {
    return mount(DualTreeNode, {
      props: {
        node: makeNode(nodeOverrides),
        depth: 0,
        isExpanded: false,
        expandedNodes: new Set(),
        ...propsOverrides,
      },
    });
  };

  describe('Rendering', () => {
    it('should render node key', () => {
      const wrapper = mountNode();
      expect(wrapper.find('.node-key').text()).toBe('title');
    });

    it('should render file1 and file2 values', () => {
      const wrapper = mountNode();
      expect(
        wrapper.find('[data-testid="value-display-file1"]').text(),
      ).toContain('Hello');
      expect(
        wrapper.find('[data-testid="value-display-file2"]').text(),
      ).toContain('Hello');
    });

    it('should render expand icon for parent nodes', () => {
      const wrapper = mountNode({
        isParent: true,
        value1: { child: 'val' },
        value2: { child: 'val' },
        children: [
          {
            key: 'child',
            keyPath: 'app.title.child',
            value1: 'val',
            value2: 'val',
            status: 'identical',
            isParent: false,
            children: [],
          },
        ],
      });
      expect(wrapper.find('.expand-icon').exists()).toBe(true);
    });

    it('should render placeholder instead of expand icon for leaf nodes', () => {
      const wrapper = mountNode();
      expect(wrapper.find('.expand-icon').exists()).toBe(false);
      expect(wrapper.find('.expand-icon-placeholder').exists()).toBe(true);
    });

    it('should show temporary badge for temporary nodes', () => {
      const wrapper = mountNode({ isTemporary: true });
      expect(wrapper.find('.temporary-badge').exists()).toBe(true);
      expect(wrapper.find('.temporary-badge').text()).toBe('(temp)');
    });
  });

  describe('Background Color', () => {
    it('should apply identical background for identical status', () => {
      const wrapper = mountNode({ status: 'identical' });
      const row = wrapper.find('.node-row');
      expect(row.attributes('style')).toContain('--bg-identical-alt');
    });

    it('should apply different background for different status', () => {
      const wrapper = mountNode({
        status: 'different',
        value1: 'Hello',
        value2: 'Bonjour',
      });
      const row = wrapper.find('.node-row');
      expect(row.attributes('style')).toContain('--bg-different-alt');
    });

    it('should apply missing background for missing-right status', () => {
      const wrapper = mountNode({
        status: 'missing-right',
        value2: undefined,
        isMissingInFile2: true,
      });
      const row = wrapper.find('.node-row');
      expect(row.attributes('style')).toContain('--bg-missing-alt');
    });

    it('should apply temporary background for missing-left status', () => {
      const wrapper = mountNode({
        status: 'missing-left',
        value1: undefined,
        isMissingInFile1: true,
      });
      const row = wrapper.find('.node-row');
      expect(row.attributes('style')).toContain('--bg-temporary-alt');
    });

    it('should apply transparent background for null status', () => {
      const wrapper = mountNode({ status: null });
      const row = wrapper.find('.node-row');
      expect(row.attributes('style')).toContain('transparent');
    });
  });

  describe('Toggle Events', () => {
    it('should emit toggle event when clicking expand icon on parent', async () => {
      const wrapper = mountNode({
        isParent: true,
        value1: { child: 'val' },
        value2: { child: 'val' },
        children: [],
      });
      await wrapper.find('.expand-icon').trigger('click');
      expect(wrapper.emitted('toggle')).toBeTruthy();
      expect(wrapper.emitted('toggle')[0]).toEqual(['app.title']);
    });

    it('should show ▶ when collapsed and ▼ when expanded', () => {
      const collapsedWrapper = mountNode(
        { isParent: true, value1: {}, value2: {}, children: [] },
        { isExpanded: false },
      );
      expect(collapsedWrapper.find('.expand-icon').text()).toBe('▶');

      const expandedWrapper = mountNode(
        { isParent: true, value1: {}, value2: {}, children: [] },
        { isExpanded: true },
      );
      expect(expandedWrapper.find('.expand-icon').text()).toBe('▼');
    });
  });

  describe('Add Key Events', () => {
    it('should emit add-to-file1 when clicking Add button for missing file1', async () => {
      const wrapper = mountNode({
        status: 'missing-left',
        value1: undefined,
        value2: 'Bonjour',
        isMissingInFile1: true,
      });
      await wrapper.find('.add-btn').trigger('click');
      expect(wrapper.emitted('add-to-file1')).toBeTruthy();
      expect(wrapper.emitted('add-to-file1')[0]).toEqual([
        'app.title',
        'Bonjour',
      ]);
    });

    it('should emit add-to-file2 when clicking Add button for missing file2', async () => {
      const wrapper = mountNode({
        status: 'missing-right',
        value1: 'Hello',
        value2: undefined,
        isMissingInFile2: true,
      });
      await wrapper.find('.add-btn').trigger('click');
      expect(wrapper.emitted('add-to-file2')).toBeTruthy();
      expect(wrapper.emitted('add-to-file2')[0]).toEqual([
        'app.title',
        'Hello',
      ]);
    });
  });

  describe('Inline Editing - Identical Status', () => {
    it('should show editable class on values with identical status', () => {
      const wrapper = mountNode({ status: 'identical' });
      const file1Display = wrapper.find(
        '[data-testid="value-display-file1"]',
      );
      const file2Display = wrapper.find(
        '[data-testid="value-display-file2"]',
      );
      expect(file1Display.classes()).toContain('editable');
      expect(file2Display.classes()).toContain('editable');
    });

    it('should not show editable class on values with different status', () => {
      const wrapper = mountNode({
        status: 'different',
        value1: 'Hello',
        value2: 'Bonjour',
      });
      const file1Display = wrapper.find(
        '[data-testid="value-display-file1"]',
      );
      expect(file1Display.classes()).not.toContain('editable');
    });

    it('should not show editable class on parent nodes', () => {
      const wrapper = mountNode({
        status: 'identical',
        isParent: true,
        value1: { child: 'val' },
        value2: { child: 'val' },
        children: [],
      });
      // Parent nodes show values but they should not be editable
      const file1Display = wrapper.find(
        '[data-testid="value-display-file1"]',
      );
      if (file1Display.exists()) {
        expect(file1Display.classes()).not.toContain('editable');
      }
    });

    it('should show edit hint on identical leaf values', () => {
      const wrapper = mountNode({ status: 'identical' });
      const hints = wrapper.findAll('.edit-hint');
      expect(hints.length).toBe(2);
    });

    it('should not show edit hint on non-identical values', () => {
      const wrapper = mountNode({
        status: 'different',
        value1: 'Hello',
        value2: 'Bonjour',
      });
      expect(wrapper.find('.edit-hint').exists()).toBe(false);
    });

    it('should enter edit mode for file1 when clicking file1 value', async () => {
      const wrapper = mountNode();
      await wrapper
        .find('[data-testid="value-display-file1"]')
        .trigger('click');
      await wrapper.vm.$nextTick();

      expect(
        wrapper.find('[data-testid="edit-input-file1"]').exists(),
      ).toBe(true);
    });

    it('should enter edit mode for file2 when clicking file2 value', async () => {
      const wrapper = mountNode();
      await wrapper
        .find('[data-testid="value-display-file2"]')
        .trigger('click');
      await wrapper.vm.$nextTick();

      expect(
        wrapper.find('[data-testid="edit-input-file2"]').exists(),
      ).toBe(true);
    });

    it('should populate edit input with current value', async () => {
      const wrapper = mountNode({ value1: 'Test Value', value2: 'Test Value' });
      await wrapper
        .find('[data-testid="value-display-file1"]')
        .trigger('click');
      await wrapper.vm.$nextTick();

      const input = wrapper.find('[data-testid="edit-input-file1"]');
      expect(input.element.value).toBe('Test Value');
    });

    it('should populate edit input with "null" for null values', async () => {
      const wrapper = mountNode({ value1: null, value2: null });
      await wrapper
        .find('[data-testid="value-display-file1"]')
        .trigger('click');
      await wrapper.vm.$nextTick();

      const input = wrapper.find('[data-testid="edit-input-file1"]');
      expect(input.element.value).toBe('null');
    });

    it('should populate edit input with string for boolean values', async () => {
      const wrapper = mountNode({ value1: true, value2: true });
      await wrapper
        .find('[data-testid="value-display-file1"]')
        .trigger('click');
      await wrapper.vm.$nextTick();

      const input = wrapper.find('[data-testid="edit-input-file1"]');
      expect(input.element.value).toBe('true');
    });

    it('should populate edit input with string for number values', async () => {
      const wrapper = mountNode({ value1: 42, value2: 42 });
      await wrapper
        .find('[data-testid="value-display-file1"]')
        .trigger('click');
      await wrapper.vm.$nextTick();

      const input = wrapper.find('[data-testid="edit-input-file1"]');
      expect(input.element.value).toBe('42');
    });

    it('should emit value-edited on Enter with changed value', async () => {
      const wrapper = mountNode({ value1: 'Old', value2: 'Old' });
      await wrapper
        .find('[data-testid="value-display-file1"]')
        .trigger('click');
      await wrapper.vm.$nextTick();

      const input = wrapper.find('[data-testid="edit-input-file1"]');
      await input.setValue('New');
      await input.trigger('keydown', { key: 'Enter' });

      const emitted = wrapper.emitted('value-edited');
      expect(emitted).toBeTruthy();
      expect(emitted[0][0]).toEqual({
        keyPath: 'app.title',
        newValue: 'New',
        oldValue: 'Old',
        targetFile: 'file1',
      });
    });

    it('should emit value-edited with file2 targetFile when editing file2', async () => {
      const wrapper = mountNode({ value1: 'Same', value2: 'Same' });
      await wrapper
        .find('[data-testid="value-display-file2"]')
        .trigger('click');
      await wrapper.vm.$nextTick();

      const input = wrapper.find('[data-testid="edit-input-file2"]');
      await input.setValue('Changed');
      await input.trigger('keydown', { key: 'Enter' });

      const emitted = wrapper.emitted('value-edited');
      expect(emitted).toBeTruthy();
      expect(emitted[0][0].targetFile).toBe('file2');
      expect(emitted[0][0].newValue).toBe('Changed');
    });

    it('should not emit value-edited when value is unchanged', async () => {
      const wrapper = mountNode({ value1: 'Same', value2: 'Same' });
      await wrapper
        .find('[data-testid="value-display-file1"]')
        .trigger('click');
      await wrapper.vm.$nextTick();

      const input = wrapper.find('[data-testid="edit-input-file1"]');
      // Don't change the value
      await input.trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('value-edited')).toBeFalsy();
    });

    it('should cancel edit on Escape key', async () => {
      const wrapper = mountNode();
      await wrapper
        .find('[data-testid="value-display-file1"]')
        .trigger('click');
      await wrapper.vm.$nextTick();

      const input = wrapper.find('[data-testid="edit-input-file1"]');
      await input.setValue('Changed');
      await input.trigger('keydown', { key: 'Escape' });

      expect(wrapper.emitted('value-edited')).toBeFalsy();
      expect(
        wrapper.find('[data-testid="edit-input-file1"]').exists(),
      ).toBe(false);
    });

    it('should parse number values correctly', async () => {
      const wrapper = mountNode({ value1: 'text', value2: 'text' });
      await wrapper
        .find('[data-testid="value-display-file1"]')
        .trigger('click');
      await wrapper.vm.$nextTick();

      const input = wrapper.find('[data-testid="edit-input-file1"]');
      await input.setValue('123');
      await input.trigger('keydown', { key: 'Enter' });

      const emitted = wrapper.emitted('value-edited');
      expect(emitted[0][0].newValue).toBe(123);
      expect(typeof emitted[0][0].newValue).toBe('number');
    });

    it('should parse boolean true correctly', async () => {
      const wrapper = mountNode({ value1: 'text', value2: 'text' });
      await wrapper
        .find('[data-testid="value-display-file1"]')
        .trigger('click');
      await wrapper.vm.$nextTick();

      const input = wrapper.find('[data-testid="edit-input-file1"]');
      await input.setValue('true');
      await input.trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('value-edited')[0][0].newValue).toBe(true);
    });

    it('should parse boolean false correctly', async () => {
      const wrapper = mountNode({ value1: 'text', value2: 'text' });
      await wrapper
        .find('[data-testid="value-display-file1"]')
        .trigger('click');
      await wrapper.vm.$nextTick();

      const input = wrapper.find('[data-testid="edit-input-file1"]');
      await input.setValue('false');
      await input.trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('value-edited')[0][0].newValue).toBe(false);
    });

    it('should parse null correctly', async () => {
      const wrapper = mountNode({ value1: 'text', value2: 'text' });
      await wrapper
        .find('[data-testid="value-display-file1"]')
        .trigger('click');
      await wrapper.vm.$nextTick();

      const input = wrapper.find('[data-testid="edit-input-file1"]');
      await input.setValue('null');
      await input.trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('value-edited')[0][0].newValue).toBe(null);
    });

    it('should enter edit mode on Enter keydown for accessible trigger', async () => {
      const wrapper = mountNode();
      await wrapper
        .find('[data-testid="value-display-file1"]')
        .trigger('keydown.enter');
      await wrapper.vm.$nextTick();

      expect(
        wrapper.find('[data-testid="edit-input-file1"]').exists(),
      ).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have role=button on editable values', () => {
      const wrapper = mountNode({ status: 'identical' });
      const file1Display = wrapper.find(
        '[data-testid="value-display-file1"]',
      );
      expect(file1Display.attributes('role')).toBe('button');
    });

    it('should have tabindex=0 on editable values', () => {
      const wrapper = mountNode({ status: 'identical' });
      const file1Display = wrapper.find(
        '[data-testid="value-display-file1"]',
      );
      expect(file1Display.attributes('tabindex')).toBe('0');
    });

    it('should have aria-label on editable values', () => {
      const wrapper = mountNode({ status: 'identical' });
      expect(
        wrapper
          .find('[data-testid="value-display-file1"]')
          .attributes('aria-label'),
      ).toBe('Edit File 1 value for title');
      expect(
        wrapper
          .find('[data-testid="value-display-file2"]')
          .attributes('aria-label'),
      ).toBe('Edit File 2 value for title');
    });

    it('should not have role or tabindex on non-editable values', () => {
      const wrapper = mountNode({
        status: 'different',
        value1: 'Hello',
        value2: 'Bonjour',
      });
      const display = wrapper.find('[data-testid="value-display-file1"]');
      expect(display.attributes('role')).toBeUndefined();
      expect(display.attributes('tabindex')).toBeUndefined();
    });

    it('should have aria-hidden on edit hint', () => {
      const wrapper = mountNode({ status: 'identical' });
      const hints = wrapper.findAll('.edit-hint');
      hints.forEach((hint) => {
        expect(hint.attributes('aria-hidden')).toBe('true');
      });
    });
  });

  describe('Recursive Children', () => {
    it('should render children when parent is expanded', () => {
      const childNode = makeNode({
        key: 'child',
        keyPath: 'app.title.child',
        value1: 'val',
        value2: 'val',
      });
      const wrapper = mountNode(
        {
          isParent: true,
          value1: { child: 'val' },
          value2: { child: 'val' },
          children: [childNode],
        },
        { isExpanded: true, expandedNodes: new Set(['app.title']) },
      );
      // Child should be visible via its node-row
      const rows = wrapper.findAll('.node-row');
      expect(rows.length).toBe(2);
    });

    it('should not render children when parent is collapsed', () => {
      const childNode = makeNode({
        key: 'child',
        keyPath: 'app.title.child',
      });
      const wrapper = mountNode(
        {
          isParent: true,
          value1: { child: 'val' },
          value2: { child: 'val' },
          children: [childNode],
        },
        { isExpanded: false },
      );
      // Only the parent row should be visible
      const rows = wrapper.findAll('.node-row');
      expect(rows.length).toBe(1);
    });

    it('should forward value-edited from child nodes', async () => {
      const childNode = makeNode({
        key: 'child',
        keyPath: 'app.title.child',
        value1: 'val',
        value2: 'val',
        status: 'identical',
      });
      const wrapper = mountNode(
        {
          isParent: true,
          value1: { child: 'val' },
          value2: { child: 'val' },
          children: [childNode],
        },
        {
          isExpanded: true,
          expandedNodes: new Set(['app.title']),
        },
      );

      // Find the child's file1 value display (second value-display-file1)
      const displays = wrapper.findAll(
        '[data-testid="value-display-file1"]',
      );
      // The last one is the child's display
      const childDisplay = displays[displays.length - 1];
      await childDisplay.trigger('click');
      await wrapper.vm.$nextTick();

      const input = wrapper.find('[data-testid="edit-input-file1"]');
      await input.setValue('new-val');
      await input.trigger('keydown', { key: 'Enter' });

      const emitted = wrapper.emitted('value-edited');
      expect(emitted).toBeTruthy();
      expect(emitted[0][0].keyPath).toBe('app.title.child');
      expect(emitted[0][0].newValue).toBe('new-val');
      expect(emitted[0][0].targetFile).toBe('file1');
    });
  });

  describe('Depth and Indentation', () => {
    it('should apply padding based on depth', () => {
      const wrapper = mountNode({}, { depth: 3 });
      const row = wrapper.find('.node-row');
      expect(row.attributes('style')).toContain('padding-left: 48px');
    });

    it('should apply zero padding at depth 0', () => {
      const wrapper = mountNode({}, { depth: 0 });
      const row = wrapper.find('.node-row');
      expect(row.attributes('style')).toContain('padding-left: 0px');
    });
  });
});
