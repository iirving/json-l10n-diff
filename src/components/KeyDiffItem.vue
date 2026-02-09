<script setup>
/**
 * KeyDiffItem Component
 *
 * Purpose: Display a single key comparison row with diff status
 * Features:
 * - Color coding based on status (missing-left, missing-right, identical, different)
 * - Show values inline
 * - Add key button for missing keys
 * - Edit value functionality
 */

import { useI18n } from 'vue-i18n';

import {
  MISSING_LEFT,
  MISSING_RIGHT,
  DIFF_STATUSES,
} from '@/constants/diffStatus.js';

const { t } = useI18n();

const props = defineProps({
  keyPath: {
    type: String,
    required: true,
  },
  leftValue: {
    type: [String, Number, Boolean, Object, Array],
    default: null,
  },
  rightValue: {
    type: [String, Number, Boolean, Object, Array],
    default: null,
  },
  status: {
    type: String,
    required: true,
    validator: (value) => DIFF_STATUSES.includes(value),
  },
});

const emit = defineEmits(['add-key', 'edit-value']);

/**
 * Format a value for display
 */
const formatValue = (value) => {
  if (value === null || value === undefined) {
    return '(missing)';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
};

/**
 * Handle add key button click
 */
const handleAddKey = () => {
  const targetFile = props.status === MISSING_LEFT ? 'file1' : 'file2';
  const value =
    props.status === MISSING_LEFT ? props.rightValue : props.leftValue;

  emit('add-key', {
    keyPath: props.keyPath,
    targetFile,
    value,
  });
};

/**
 * Handle edit value button click
 */
const handleEditValue = () => {
  emit('edit-value', {
    keyPath: props.keyPath,
  });
};

/**
 * Check if add button should be shown
 */
const showAddButton = () => {
  return props.status === MISSING_LEFT || props.status === MISSING_RIGHT;
};
</script>

<template>
  <div class="key-diff-item" :class="`status-${status}`" role="listitem">
    <div class="key-path">
      {{ keyPath }}
    </div>

    <div class="values-container">
      <div class="value left-value">
        <span class="value-label">Left:</span>
        <span class="value-content">{{ formatValue(leftValue) }}</span>
      </div>

      <div class="value right-value">
        <span class="value-label">Right:</span>
        <span class="value-content">{{ formatValue(rightValue) }}</span>
      </div>
    </div>

    <div class="actions">
      <button v-if="showAddButton()" class="add-key-button"
        :aria-label="t('actions.addKeyAriaLabel', { keyPath, target: status === 'missing-left' ? 'left' : 'right' })"
        @click="handleAddKey">
        {{ t('actions.addKeyButton') }}
      </button>

      <button v-if="status === 'different'" class="edit-value-button" :aria-label="`Edit value for ${keyPath}`"
        @click="handleEditValue">
        Edit
      </button>
    </div>
  </div>
</template>

<style scoped>
.key-diff-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  margin: 0.25rem 0;
  border-radius: 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color 0.2s;
}

.key-diff-item:hover {
  background-color: rgba(255, 255, 255, 0.02);
}

/* Status-based color coding */
.status-missing-left {
  background-color: rgba(239, 68, 68, 0.1);
  border-left: 3px solid #ef4444;
}

.status-missing-right {
  background-color: rgba(239, 68, 68, 0.1);
  border-left: 3px solid #ef4444;
}

.status-identical {
  background-color: rgba(234, 179, 8, 0.1);
  border-left: 3px solid #eab308;
}

.status-different {
  background-color: rgba(34, 197, 94, 0.1);
  border-left: 3px solid #22c55e;
}

/* Key path */
.key-path {
  font-weight: 600;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
}

/* Values container */
.values-container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.value {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 200px;
}

.value-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.value-content {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  padding: 0.25rem 0.5rem;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 0.25rem;
  word-break: break-word;
}

/* Actions */
.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.add-key-button,
.edit-value-button {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.25rem;
  background-color: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: all 0.2s;
}

.add-key-button:hover,
.edit-value-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.add-key-button:active,
.edit-value-button:active {
  transform: translateY(1px);
}

.add-key-button {
  background-color: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
  color: #60a5fa;
}

.add-key-button:hover {
  background-color: rgba(59, 130, 246, 0.3);
  border-color: rgba(59, 130, 246, 0.6);
}
</style>
