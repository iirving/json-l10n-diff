import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestI18n } from '../utils/i18nTestHelper.js';
import PrettifyWarning from '@/components/PrettifyWarning.vue';

const i18n = createTestI18n();

describe('PrettifyWarning', () => {
  const mountComponent = (options = {}) =>
    mount(PrettifyWarning, {
      attachTo: document.body,
      global: {
        plugins: [i18n],
      },
      ...options,
    });

  afterEach(() => {
    // Clean up any mounted components attached to the document
    document.body.innerHTML = '';
  });

  describe('rendering', () => {
    it('renders the overlay', () => {
      const wrapper = mountComponent();
      expect(
        wrapper.find('[data-testid="prettify-warning-overlay"]').exists()
      ).toBe(true);
    });

    it('renders the modal', () => {
      const wrapper = mountComponent();
      expect(
        wrapper.find('[data-testid="prettify-warning-modal"]').exists()
      ).toBe(true);
    });

    it('renders the title', () => {
      const wrapper = mountComponent();
      expect(
        wrapper.find('[data-testid="prettify-warning-title"]').text()
      ).toBe('Prettify JSON');
    });

    it('renders the warning message', () => {
      const wrapper = mountComponent();
      const message = wrapper
        .find('[data-testid="prettify-warning-message"]')
        .text();
      expect(message).toContain('git diff noise');
    });

    it('renders cancel button', () => {
      const wrapper = mountComponent();
      expect(
        wrapper.find('[data-testid="prettify-warning-cancel"]').exists()
      ).toBe(true);
      expect(
        wrapper.find('[data-testid="prettify-warning-cancel"]').text()
      ).toBe('Cancel');
    });

    it('renders confirm button', () => {
      const wrapper = mountComponent();
      expect(
        wrapper.find('[data-testid="prettify-warning-confirm"]').exists()
      ).toBe(true);
      expect(
        wrapper.find('[data-testid="prettify-warning-confirm"]').text()
      ).toBe('Prettify');
    });

    it('has role="dialog" on overlay', () => {
      const wrapper = mountComponent();
      expect(
        wrapper
          .find('[data-testid="prettify-warning-overlay"]')
          .attributes('role')
      ).toBe('dialog');
    });

    it('has aria-modal="true" on overlay', () => {
      const wrapper = mountComponent();
      expect(
        wrapper
          .find('[data-testid="prettify-warning-overlay"]')
          .attributes('aria-modal')
      ).toBe('true');
    });
  });

  describe('accessibility', () => {
    it('has aria-labelledby referencing the title id', () => {
      const wrapper = mountComponent();
      const overlay = wrapper.find('[data-testid="prettify-warning-overlay"]');
      expect(overlay.attributes('aria-labelledby')).toBe(
        'prettify-warning-title'
      );
    });

    it('has aria-describedby referencing the message id', () => {
      const wrapper = mountComponent();
      const overlay = wrapper.find('[data-testid="prettify-warning-overlay"]');
      expect(overlay.attributes('aria-describedby')).toBe(
        'prettify-warning-desc'
      );
    });

    it('does not use aria-label (replaced by aria-labelledby)', () => {
      const wrapper = mountComponent();
      const overlay = wrapper.find('[data-testid="prettify-warning-overlay"]');
      expect(overlay.attributes('aria-label')).toBeUndefined();
    });

    it('title element has id matching aria-labelledby', () => {
      const wrapper = mountComponent();
      const title = wrapper.find('[data-testid="prettify-warning-title"]');
      expect(title.attributes('id')).toBe('prettify-warning-title');
    });

    it('message element has id matching aria-describedby', () => {
      const wrapper = mountComponent();
      const message = wrapper.find('[data-testid="prettify-warning-message"]');
      expect(message.attributes('id')).toBe('prettify-warning-desc');
    });

    it('focuses the cancel button on mount', async () => {
      const wrapper = mountComponent();
      await wrapper.vm.$nextTick();
      const cancelBtn = wrapper.find('[data-testid="prettify-warning-cancel"]');
      expect(document.activeElement).toBe(cancelBtn.element);
    });

    it('restores focus to the previously focused element on unmount', async () => {
      const trigger = document.createElement('button');
      document.body.appendChild(trigger);
      trigger.focus();
      expect(document.activeElement).toBe(trigger);

      const wrapper = mountComponent();
      await wrapper.vm.$nextTick();

      wrapper.unmount();
      await wrapper.vm.$nextTick();

      expect(document.activeElement).toBe(trigger);
      trigger.remove();
    });

    it('emits "cancel" when Escape key is pressed', async () => {
      const wrapper = mountComponent();
      await wrapper.vm.$nextTick();

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('cancel')).toHaveLength(1);
    });

    it('removes the keydown listener on unmount', async () => {
      const removeSpy = vi.spyOn(document, 'removeEventListener');

      const wrapper = mountComponent();
      await wrapper.vm.$nextTick();

      wrapper.unmount();

      expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      removeSpy.mockRestore();
    });

    it('does not emit "cancel" for other key presses', async () => {
      const wrapper = mountComponent();
      await wrapper.vm.$nextTick();

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event);
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('cancel')).toBeFalsy();
    });
  });

  describe('events', () => {
    it('emits "confirm" when confirm button is clicked', async () => {
      const wrapper = mountComponent();
      await wrapper
        .find('[data-testid="prettify-warning-confirm"]')
        .trigger('click');
      expect(wrapper.emitted('confirm')).toHaveLength(1);
    });

    it('emits "cancel" when cancel button is clicked', async () => {
      const wrapper = mountComponent();
      await wrapper
        .find('[data-testid="prettify-warning-cancel"]')
        .trigger('click');
      expect(wrapper.emitted('cancel')).toHaveLength(1);
    });

    it('emits "cancel" when overlay is clicked (self)', async () => {
      const wrapper = mountComponent();
      await wrapper
        .find('[data-testid="prettify-warning-overlay"]')
        .trigger('click');
      expect(wrapper.emitted('cancel')).toHaveLength(1);
    });

    it('does not emit "cancel" when modal content is clicked', async () => {
      const wrapper = mountComponent();
      // Click on the modal itself (child of overlay), should NOT trigger cancel
      // because @click.self only fires on self not children
      await wrapper
        .find('[data-testid="prettify-warning-modal"]')
        .trigger('click');
      expect(wrapper.emitted('cancel')).toBeFalsy();
    });

    it('does not emit "confirm" before button is clicked', () => {
      const wrapper = mountComponent();
      expect(wrapper.emitted('confirm')).toBeFalsy();
    });

    it('can emit confirm multiple times', async () => {
      const wrapper = mountComponent();
      const confirmBtn = wrapper.find(
        '[data-testid="prettify-warning-confirm"]'
      );
      await confirmBtn.trigger('click');
      await confirmBtn.trigger('click');
      expect(wrapper.emitted('confirm')).toHaveLength(2);
    });
  });
});
