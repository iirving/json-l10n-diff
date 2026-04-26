<script setup>
/**
 * PrettifyWarning Component
 *
 * Purpose: Warning modal displayed before prettifying a JSON file
 * Warns user that prettification may cause extra git diff noise
 * Features:
 * - Modal overlay with warning message
 * - Confirm (Prettify) and Cancel buttons
 * - Accessibility attributes for screen readers (aria-labelledby, aria-describedby)
 * - Keyboard support: Escape key dismisses the dialog
 * - Focus management: focuses cancel button on open, restores prior focus on close
 * - Internationalization support
 *
 * @component
 * @example
 * <PrettifyWarning
 *   v-if="showWarning"
 *   @confirm="handleConfirm"
 *   @cancel="handleCancel"
 * />
 */

import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const emit = defineEmits([
  /**
   * Emitted when the user confirms prettification
   */
  'confirm',
  /**
   * Emitted when the user cancels prettification
   */
  'cancel',
]);

/** Ref to the cancel button — receives initial focus when the dialog opens */
const cancelBtnRef = ref(null);

/** Element that held focus before the dialog opened, restored on close */
let previousActiveElement = null;

/**
 * Handle confirm button click
 */
const handleConfirm = () => {
  emit('confirm');
};

/**
 * Handle cancel button click
 */
const handleCancel = () => {
  emit('cancel');
};

/**
 * Dismiss dialog on Escape key press
 * @param {KeyboardEvent} event
 */
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    handleCancel();
  }
};

onMounted(() => {
  previousActiveElement = document.activeElement;
  cancelBtnRef.value?.focus();
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  previousActiveElement?.focus();
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div
    class="prettify-warning-overlay"
    data-testid="prettify-warning-overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="prettify-warning-title"
    aria-describedby="prettify-warning-desc"
    @click.self="handleCancel"
  >
    <div class="prettify-warning-modal" data-testid="prettify-warning-modal">
      <h3
        id="prettify-warning-title"
        class="prettify-warning__title"
        data-testid="prettify-warning-title"
      >
        {{ t('prettifyWarning.title') }}
      </h3>
      <p
        id="prettify-warning-desc"
        class="prettify-warning__message"
        data-testid="prettify-warning-message"
      >
        {{ t('prettifyWarning.message') }}
      </p>
      <div class="prettify-warning__actions">
        <button
          ref="cancelBtnRef"
          type="button"
          class="prettify-warning__cancel-btn"
          data-testid="prettify-warning-cancel"
          @click="handleCancel"
        >
          {{ t('prettifyWarning.cancel') }}
        </button>
        <button
          type="button"
          class="prettify-warning__confirm-btn"
          data-testid="prettify-warning-confirm"
          @click="handleConfirm"
        >
          {{ t('prettifyWarning.confirm') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prettify-warning-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.prettify-warning-modal {
  background-color: var(--color-background, #fff);
  border-radius: 8px;
  padding: 1.5rem;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}

.prettify-warning__title {
  margin: 0 0 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
}

.prettify-warning__message {
  margin: 0 0 1.25rem;
  color: var(--color-text-muted, #555);
  line-height: 1.5;
}

.prettify-warning__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.prettify-warning__cancel-btn,
.prettify-warning__confirm-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
}

.prettify-warning__cancel-btn {
  background-color: transparent;
  border-color: var(--color-border, #ccc);
  color: var(--color-text, #333);
}

.prettify-warning__cancel-btn:hover {
  background-color: var(--color-background-soft, #f5f5f5);
}

.prettify-warning__confirm-btn {
  background-color: var(--color-primary, #4f46e5);
  color: #fff;
}

.prettify-warning__confirm-btn:hover {
  background-color: var(--color-primary-dark, #4338ca);
}
</style>
