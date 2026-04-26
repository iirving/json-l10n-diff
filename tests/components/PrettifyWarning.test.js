import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestI18n } from '../utils/i18nTestHelper.js';
import PrettifyWarning from '@/components/PrettifyWarning.vue';

const i18n = createTestI18n();

describe('PrettifyWarning', () => {
  const mountComponent = () =>
    mount(PrettifyWarning, {
      global: {
        plugins: [i18n],
      },
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
