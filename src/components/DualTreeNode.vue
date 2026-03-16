<script setup>
/**
 * DualTreeNode Component
 *
 * Purpose: Render a single row in the dual file viewer
 * Shows key and values from both files side-by-side
 */

import { ref, computed, nextTick } from 'vue';
import { formatValue } from '@/composables/useValueFormatter.js';
import {
  DIFFERENT,
  IDENTICAL,
  MISSING_LEFT,
  MISSING_RIGHT,
  isValidDiffStatus,
} from '@/constants/diffStatus.js';

const props = defineProps({
  node: {
    type: Object,
    required: true,
    validator: (value) => {
      // Validate that node has required properties
      if (!value.keyPath || typeof value.keyPath !== 'string') {
        return false;
      }
      // Validate status if present
      if (value.status && !isValidDiffStatus(value.status)) {
        console.warn(`Invalid status: ${value.status}`);
        return false;
      }
      return true;
    },
  },
  depth: {
    type: Number,
    default: 0,
  },
  isExpanded: {
    type: Boolean,
    default: false,
  },
  expandedNodes: {
    type: Set,
    default: () => new Set(),
  },
});

const emit = defineEmits([
  'toggle',
  'add-to-file1',
  'add-to-file2',
  'value-edited',
]);

// Reactive state for inline editing
const editingFile = ref(null);
const editValue = ref('');
const editInputRef = ref(null);

/**
 * Check if a value is editable (leaf node with identical status)
 * @param {Object} node - The tree node
 * @returns {boolean}
 */
const isEditable = computed(() => {
  return props.node.status === IDENTICAL && !props.node.isParent;
});

/**
 * Start inline editing for a specific file's value
 * @param {'file1'|'file2'} fileKey - Which file's value to edit
 * @param {*} currentValue - Current value to populate input
 */
const startEditing = (fileKey, currentValue) => {
  if (!isEditable.value) return;

  editingFile.value = fileKey;
  if (currentValue === null) {
    editValue.value = 'null';
  } else if (typeof currentValue === 'boolean') {
    editValue.value = currentValue.toString();
  } else if (typeof currentValue === 'number') {
    editValue.value = currentValue.toString();
  } else {
    editValue.value = String(currentValue);
  }

  nextTick(() => {
    if (editInputRef.value) {
      editInputRef.value.focus();
      editInputRef.value.select();
    }
  });
};

/**
 * Parse the edited string value back to its appropriate type
 * @param {string} str - The string value from the input
 * @returns {*} Parsed value
 */
const parseEditedValue = (str) => {
  const trimmed = str.trim();
  if (trimmed === 'null') return null;
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed !== '' && !isNaN(Number(trimmed)) && isFinite(Number(trimmed))) {
    return Number(trimmed);
  }
  return str;
};

/**
 * Save the edited value and exit editing mode
 */
const saveEdit = () => {
  if (!editingFile.value) return;

  const newValue = parseEditedValue(editValue.value);
  const oldValue =
    editingFile.value === 'file1' ? props.node.value1 : props.node.value2;

  if (newValue !== oldValue) {
    emit('value-edited', {
      keyPath: props.node.keyPath,
      newValue,
      oldValue,
      targetFile: editingFile.value,
    });
  }

  editingFile.value = null;
  editValue.value = '';
};

/**
 * Cancel editing and restore original value
 */
const cancelEdit = () => {
  editingFile.value = null;
  editValue.value = '';
};

/**
 * Handle keyboard events in edit mode
 * @param {KeyboardEvent} event
 */
const handleEditKeydown = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    saveEdit();
  } else if (event.key === 'Escape') {
    event.preventDefault();
    cancelEdit();
  }
};

/**
 * Handle blur event - save on blur
 */
const handleEditBlur = () => {
  nextTick(() => {
    if (editingFile.value) {
      saveEdit();
    }
  });
};

/**
 * Get background color based on status
 */
const getRowColor = computed(() => {
  switch (props.node.status) {
    case DIFFERENT:
      return 'var(--bg-different-alt)'; // Green for different values
    case IDENTICAL:
      return 'var(--bg-identical-alt)'; // Yellow for identical values
    case MISSING_RIGHT:
      return 'var(--bg-missing-alt)'; // Light red for missing in file2
    case MISSING_LEFT:
      return 'var(--bg-temporary-alt)'; // Light blue for missing in file1 (temporary)
    default:
      return 'transparent';
  }
});

/**
 * Handle toggle click
 */
const handleToggle = () => {
  if (props.node.isParent) {
    emit('toggle', props.node.keyPath);
  }
};

/**
 * Handle add to file1
 */
const handleAddToFile1 = () => {
  emit('add-to-file1', props.node.keyPath, props.node.value2);
};

/**
 * Handle add to file2
 */
const handleAddToFile2 = () => {
  emit('add-to-file2', props.node.keyPath, props.node.value1);
};
</script>

<template>
  <div class="dual-tree-node">
    <div
      class="node-row"
      :style="{
        paddingLeft: depth * 16 + 'px',
        backgroundColor: getRowColor,
      }"
    >
      <!-- Expand icon -->
      <span v-if="node.isParent" class="expand-icon" @click="handleToggle">
        {{ isExpanded ? '▼' : '▶' }}
      </span>
      <span v-else class="expand-icon-placeholder"></span>

      <!-- Key name -->
      <span class="node-key" :class="{ temporary: node.isTemporary }">
        {{ node.key }}
        <span v-if="node.isTemporary" class="temporary-badge">(temp)</span>
      </span>

      <!-- Values from both files -->
      <div class="node-values">
        <!-- File 1 Value -->
        <div class="value-cell file1-value">
          <template v-if="node.value1 !== undefined">
            <!-- Edit mode for file1 -->
            <span v-if="editingFile === 'file1'" class="node-value-edit">
              <input
                ref="editInputRef"
                v-model="editValue"
                type="text"
                class="edit-input"
                data-testid="edit-input-file1"
                @keydown="handleEditKeydown"
                @blur="handleEditBlur"
              />
            </span>
            <!-- View mode for file1 -->
            <span
              v-else
              class="value-display"
              :class="{ editable: isEditable }"
              :role="isEditable ? 'button' : undefined"
              :tabindex="isEditable ? 0 : undefined"
              :aria-label="
                isEditable ? `Edit File 1 value for ${node.key}` : undefined
              "
              data-testid="value-display-file1"
              @click="isEditable && startEditing('file1', node.value1)"
              @keydown.enter="isEditable && startEditing('file1', node.value1)"
            >
              {{ formatValue(node.value1) }}
              <span v-if="isEditable" class="edit-hint" aria-hidden="true"
                >✏️</span
              >
            </span>
          </template>
          <span v-else class="missing-indicator">
            <button
              v-if="node.isMissingInFile1"
              class="add-btn"
              @click="handleAddToFile1"
            >
              + Add
            </button>
          </span>
        </div>

        <!-- File 2 Value -->
        <div class="value-cell file2-value">
          <template v-if="node.value2 !== undefined">
            <!-- Edit mode for file2 -->
            <span v-if="editingFile === 'file2'" class="node-value-edit">
              <input
                ref="editInputRef"
                v-model="editValue"
                type="text"
                class="edit-input"
                data-testid="edit-input-file2"
                @keydown="handleEditKeydown"
                @blur="handleEditBlur"
              />
            </span>
            <!-- View mode for file2 -->
            <span
              v-else
              class="value-display"
              :class="{ editable: isEditable }"
              :role="isEditable ? 'button' : undefined"
              :tabindex="isEditable ? 0 : undefined"
              :aria-label="
                isEditable ? `Edit File 2 value for ${node.key}` : undefined
              "
              data-testid="value-display-file2"
              @click="isEditable && startEditing('file2', node.value2)"
              @keydown.enter="isEditable && startEditing('file2', node.value2)"
            >
              {{ formatValue(node.value2) }}
              <span v-if="isEditable" class="edit-hint" aria-hidden="true"
                >✏️</span
              >
            </span>
          </template>
          <span v-else class="missing-indicator">
            <button
              v-if="node.isMissingInFile2"
              class="add-btn"
              @click="handleAddToFile2"
            >
              + Add
            </button>
          </span>
        </div>
      </div>
    </div>

    <!-- Recursive children -->
    <template v-if="node.isParent && isExpanded && node.children.length > 0">
      <DualTreeNode
        v-for="child in node.children"
        :key="child.keyPath"
        :node="child"
        :depth="depth + 1"
        :is-expanded="expandedNodes.has(child.keyPath)"
        :expanded-nodes="expandedNodes"
        @toggle="(keyPath) => $emit('toggle', keyPath)"
        @add-to-file1="
          (keyPath, value) => $emit('add-to-file1', keyPath, value)
        "
        @add-to-file2="
          (keyPath, value) => $emit('add-to-file2', keyPath, value)
        "
        @value-edited="(details) => $emit('value-edited', details)"
      />
    </template>
  </div>
</template>

<style scoped>
.dual-tree-node {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
}

.node-row {
  display: flex;
  align-items: center;
  min-height: 28px;
  padding: 0.25rem 0.5rem;
  border-bottom: 1px solid var(--border-light);
  transition: background-color 0.2s;
}

.node-row:hover {
  filter: brightness(0.95);
}

.expand-icon {
  width: 20px;
  cursor: pointer;
  user-select: none;
  color: var(--color-text-dark-secondary);
  font-size: 0.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.expand-icon:hover {
  color: var(--color-text-dark);
}

.expand-icon-placeholder {
  width: 20px;
  display: inline-block;
}

.node-key {
  font-weight: 600;
  color: var(--color-text-dark);
  margin-right: 1rem;
  min-width: 150px;
  flex-shrink: 0;
}

.node-key.temporary {
  color: var(--color-info-alt);
  font-style: italic;
}

.temporary-badge {
  font-size: 0.75rem;
  font-weight: normal;
  color: var(--color-info-alt);
  margin-left: 0.25rem;
}

.node-values {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  flex: 1;
}

.value-cell {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  min-height: 24px;
  display: flex;
  align-items: center;
}

.file1-value {
  background: var(--bg-overlay-light);
}

.file2-value {
  background: var(--bg-overlay-light);
}

.value-cell span {
  color: var(--color-link);
  word-break: break-word;
}

.missing-indicator {
  color: var(--color-text-disabled);
  font-style: italic;
}

.add-btn {
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  background: var(--color-success-dark);
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  background: var(--color-success-darker);
  transform: scale(1.05);
}

.value-display {
  color: var(--color-link);
  word-break: break-word;
}

.value-display.editable {
  cursor: pointer;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  transition:
    background-color 0.15s ease,
    box-shadow 0.15s ease;
}

.value-display.editable:hover {
  background-color: rgba(0, 102, 204, 0.1);
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
}

.value-display.editable:focus {
  outline: 2px solid #0066cc;
  outline-offset: 1px;
}

.edit-hint {
  margin-left: 4px;
  opacity: 0;
  font-size: 0.75rem;
  transition: opacity 0.15s ease;
}

.value-display.editable:hover .edit-hint,
.value-display.editable:focus .edit-hint {
  opacity: 0.7;
}

.node-value-edit {
  display: inline-flex;
  align-items: center;
}

.edit-input {
  font-family: inherit;
  font-size: inherit;
  padding: 0.125rem 0.375rem;
  border: 2px solid #0066cc;
  border-radius: 0.25rem;
  background-color: #ffffff;
  color: #000000;
  min-width: 100px;
  max-width: 300px;
}

.edit-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.3);
}
</style>
