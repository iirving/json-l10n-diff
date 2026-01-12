<script setup>
/**
 * EditControls Component
 *
 * Purpose: Provide save, prettify, and reset actions for edited files
 * Features:
 * - Save button (downloads modified file)
 * - Prettify button (formats JSON with 2-space indentation)
 * - Reset button (discards changes)
 * - Disabled state when no modifications or controls disabled
 * - Internationalization support
 *
 * @component
 * @example
 * <EditControls
 *   :file="file1"
 *   :modified="file1Modified"
 *   @save="handleSave"
 *   @prettify="handlePrettify"
 *   @reset="handleReset"
 * />
 */

import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * @typedef {Object} JsonFile
 * @property {string} name - File name
 * @property {Object} data - Parsed JSON data
 * @property {number} keyCount - Number of keys in the file
 * @property {number} fileSize - File size in bytes
 */

const props = defineProps({
  /**
   * The JSON file being controlled
   * @type {JsonFile|null}
   */
  file: {
    type: Object,
    default: null,
  },
  /**
   * Whether the file has been modified
   */
  modified: {
    type: Boolean,
    default: false,
  },
  /**
   * Whether to show the prettify button
   */
  showPrettify: {
    type: Boolean,
    default: true,
  },
  /**
   * Whether all controls are disabled
   */
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  /**
   * Emitted when save button is clicked
   */
  'save',
  /**
   * Emitted when prettify button is clicked
   */
  'prettify',
  /**
   * Emitted when reset button is clicked
   */
  'reset',
]);

const { t } = useI18n();

/**
 * File name to display in save button
 */
const fileName = computed(() => {
  return props.file?.name || 'file.json';
});

/**
 * Whether controls should be disabled
 * Disabled when: explicitly disabled, no file, or not modified
 */
const isDisabled = computed(() => {
  return props.disabled || !props.file;
});

/**
 * Whether save/reset buttons should be disabled
 * Disabled when controls are disabled or file is not modified
 */
const isSaveResetDisabled = computed(() => {
  return isDisabled.value || !props.modified;
});

/**
 * Whether prettify button should be disabled
 * Disabled when controls are disabled (not dependent on modified state)
 */
const isPrettifyDisabled = computed(() => {
  return isDisabled.value;
});

/**
 * Handle save button click
 */
const handleSave = () => {
  emit('save');
};

/**
 * Handle prettify button click
 */
const handlePrettify = () => {
  emit('prettify');
};

/**
 * Handle reset button click
 */
const handleReset = () => {
  if (!isSaveResetDisabled.value) {
    emit('reset');
  }
};
</script>

<template>
  <div class="edit-controls" :class="{ 'edit-controls--disabled': isDisabled }">
    <div class="controls-group">
      <button type="button" class="btn btn--save" :disabled="isSaveResetDisabled"
        :aria-label="t('editControls.saveAriaLabel', { fileName })" @click="handleSave">
        <span class="btn__icon" aria-hidden="true">💾</span>
        <span class="btn__text">
          {{ t('editControls.save', { fileName }) }}
        </span>
      </button>

      <button v-if="showPrettify" type="button" class="btn btn--prettify" :disabled="isPrettifyDisabled"
        :aria-label="t('editControls.prettifyAriaLabel')" @click="handlePrettify">
        <span class="btn__icon" aria-hidden="true">✨</span>
        <span class="btn__text">{{ t('editControls.prettify') }}</span>
      </button>

      <button type="button" class="btn btn--reset" :disabled="isSaveResetDisabled"
        :aria-label="t('editControls.resetAriaLabel')" @click="handleReset">
        <span class="btn__icon" aria-hidden="true">↩️</span>
        <span class="btn__text">{{ t('editControls.reset') }}</span>
      </button>
    </div>

    <p v-if="modified" class="modified-indicator" role="status" aria-live="polite">
      {{ t('editControls.unsavedChanges') }}
    </p>
  </div>
</template>

<style scoped>
.edit-controls {
  padding: var(--spacing-md);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.edit-controls--disabled {
  opacity: 0.6;
}

.controls-group {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  align-items: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs, 0.25rem);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius, 4px);
  background-color: var(--color-bg-secondary, #2d2d2d);
  color: var(--color-text, #ffffff);
  font-size: 0.875rem;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    opacity 0.2s ease,
    border-color 0.2s ease;
}

.btn:hover:not(:disabled) {
  background-color: var(--color-bg-hover, #3d3d3d);
  border-color: rgba(255, 255, 255, 0.4);
}

.btn:focus-visible {
  outline: 2px solid var(--color-focus, #4a9eff);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--save:not(:disabled) {
  background-color: var(--color-success-bg, #1a472a);
  border-color: var(--color-success, #4ade80);
}

.btn--save:hover:not(:disabled) {
  background-color: var(--color-success-hover, #22633a);
}

.btn--reset:not(:disabled) {
  background-color: var(--color-warning-bg, #4a3728);
  border-color: var(--color-warning, #fbbf24);
}

.btn--reset:hover:not(:disabled) {
  background-color: var(--color-warning-hover, #5a4738);
}

.btn__icon {
  font-size: 1rem;
  line-height: 1;
}

.btn__text {
  white-space: nowrap;
}

.modified-indicator {
  margin-top: var(--spacing-sm);
  font-size: 0.75rem;
  color: var(--color-warning, #fbbf24);
  font-style: italic;
}
</style>
