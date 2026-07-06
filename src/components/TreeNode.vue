<script setup>
import { ref, computed, inject, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatValue } from '@/composables/useValueFormatter.js';

/**
 * TreeNode Component (Recursive)
 * Renders a single node in the tree with support for recursion and inline editing
 */

// Props
const props = defineProps({
  nodeKey: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number, Boolean, Object, Array],
    default: null,
  },
  depth: {
    type: Number,
    default: 0,
  },
  keyPath: {
    type: String,
    required: true,
  },
  parentPath: {
    type: String,
    default: '',
  },
  editable: {
    type: Boolean,
    default: false,
  },
  fileId: {
    type: String,
    default: 'file1',
  },
});

// Emits
const emit = defineEmits(['value-edited']);
const { t } = useI18n();

// Composables (inject)
const isExpandedFn = inject('isExpanded', () => false);
const getDiffStatusFn = inject('getDiffStatus', () => null);
const toggleNodeFn = inject('toggleNode', () => {});
const isModifiedFn = inject('isModified', () => false);
const activeTreeItemRef = inject('activeTreeItem', ref(''));
const setActiveTreeItemFn = inject('setActiveTreeItem', () => {});

// Reactive state for inline editing
const isEditing = ref(false);
const editValue = ref('');
const editInputRef = ref(null);

// Methods (needed for computed properties)
const isObject = (val) => {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
};

const isArray = (val) => {
  return Array.isArray(val);
};

// Computed properties
const isParent = computed(() => isObject(props.value) || isArray(props.value));
const isExpanded = computed(() => isExpandedFn(props.keyPath));
const diffStatus = computed(() => getDiffStatusFn(props.keyPath));
const modified = computed(() => isModifiedFn(props.keyPath));
const treeItemTabIndex = computed(() => {
  return activeTreeItemRef.value === props.keyPath ? 0 : -1;
});

/**
 * Check if this node's value can be edited inline
 * Only primitive values (string, number, boolean, null) can be edited
 */
const canEdit = computed(() => {
  return props.editable && !isParent.value;
});

const buildKeyPath = (parentPath, key) => {
  return parentPath ? `${parentPath}.${key}` : key;
};

const handleToggle = () => {
  if (isParent.value) {
    toggleNodeFn(props.keyPath);
  }
};

/**
 * Keep roving tabindex state in sync when this node receives focus.
 */
const handleNodeFocus = () => {
  setActiveTreeItemFn(props.keyPath);
};

/**
 * Focus a tree item and update roving tabindex ownership.
 * @param {HTMLElement|undefined|null} element
 */
const focusTreeItem = (element) => {
  if (!element) return;
  const keyPath = element.getAttribute('data-key-path');
  if (keyPath) {
    setActiveTreeItemFn(keyPath);
  }
  element.focus();
};

/**
 * Handle keyboard navigation on the tree node content element.
 * Implements ARIA tree widget keyboard interaction pattern.
 * @param {KeyboardEvent} event
 */
const handleNodeKeyDown = (event) => {
  switch (event.key) {
    case 'ArrowRight':
      event.preventDefault();
      if (isParent.value && !isExpanded.value) {
        // Expand collapsed node
        toggleNodeFn(props.keyPath);
      } else if (isParent.value && isExpanded.value) {
        // Move focus to first child
        const firstChild = event.currentTarget
          .closest('.tree-node')
          ?.querySelector('.tree-node > .tree-node-content');
        focusTreeItem(firstChild);
      }
      break;
    case 'ArrowLeft':
      event.preventDefault();
      if (isParent.value && isExpanded.value) {
        // Collapse expanded node
        toggleNodeFn(props.keyPath);
      } else {
        // Move focus to parent node
        const parentContent = event.currentTarget
          .closest('.tree-node')
          ?.parentElement?.closest('.tree-node')
          ?.querySelector(':scope > .tree-node-content');
        focusTreeItem(parentContent);
      }
      break;
    case 'ArrowDown': {
      event.preventDefault();
      const treeRoot = event.currentTarget.closest('[role="tree"]');
      if (!treeRoot) break;
      const allItems = [...treeRoot.querySelectorAll('.tree-node-content')];
      const idx = allItems.indexOf(event.currentTarget);
      focusTreeItem(allItems[idx + 1]);
      break;
    }
    case 'ArrowUp': {
      event.preventDefault();
      const treeRoot = event.currentTarget.closest('[role="tree"]');
      if (!treeRoot) break;
      const allItems = [...treeRoot.querySelectorAll('.tree-node-content')];
      const idx = allItems.indexOf(event.currentTarget);
      focusTreeItem(allItems[idx - 1]);
      break;
    }
    case 'Home': {
      event.preventDefault();
      const treeRoot = event.currentTarget.closest('[role="tree"]');
      focusTreeItem(treeRoot?.querySelector('.tree-node-content'));
      break;
    }
    case 'End': {
      event.preventDefault();
      const treeRoot = event.currentTarget.closest('[role="tree"]');
      if (!treeRoot) break;
      const allItems = [...treeRoot.querySelectorAll('.tree-node-content')];
      focusTreeItem(allItems[allItems.length - 1]);
      break;
    }
    case 'Enter':
    case ' ':
      if (isParent.value) {
        event.preventDefault();
        toggleNodeFn(props.keyPath);
      }
      break;
    default:
      break;
  }
};

/**
 * Start inline editing mode
 */
const startEditing = () => {
  if (!canEdit.value) return;

  // Convert value to string for editing
  if (props.value === null) {
    editValue.value = 'null';
  } else if (typeof props.value === 'boolean') {
    editValue.value = props.value.toString();
  } else if (typeof props.value === 'number') {
    editValue.value = props.value.toString();
  } else {
    editValue.value = String(props.value);
  }

  isEditing.value = true;

  // Focus the input after DOM update
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
 * @returns {any} - Parsed value (string, number, boolean, or null)
 */
const parseEditedValue = (str) => {
  const trimmed = str.trim();

  // Check for null
  if (trimmed === 'null') {
    return null;
  }

  // Check for boolean
  if (trimmed === 'true') {
    return true;
  }
  if (trimmed === 'false') {
    return false;
  }

  // Check for number
  if (trimmed !== '' && !isNaN(Number(trimmed))) {
    const num = Number(trimmed);
    // Only convert if it's a valid finite number
    if (isFinite(num)) {
      return num;
    }
  }

  // Default to string
  return str;
};

/**
 * Save the edited value and exit editing mode
 */
const saveEdit = () => {
  if (!isEditing.value) return;

  const newValue = parseEditedValue(editValue.value);

  // Only emit if value actually changed
  if (newValue !== props.value) {
    emit('value-edited', {
      keyPath: props.keyPath,
      newValue,
      oldValue: props.value,
      targetFile: props.fileId,
    });
  }

  isEditing.value = false;
};

/**
 * Cancel editing and restore original value
 */
const cancelEdit = () => {
  isEditing.value = false;
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
  // Use nextTick to allow related click handlers (e.g., cancel) to run first
  nextTick(() => {
    if (isEditing.value) {
      saveEdit();
    }
  });
};
</script>

<template>
  <div
    class="tree-node"
    :class="{ expanded: isExpanded, editing: isEditing, modified: modified }"
    data-testid="tree-node"
    :data-depth="depth"
    :data-key-path="keyPath"
    :data-status="diffStatus"
    :data-parent="parentPath"
    :data-modified="modified || undefined"
  >
    <div
      class="tree-node-content"
      data-testid="tree-node-content"
      :data-key-path="keyPath"
      :style="{ paddingLeft: depth * 4 + 'px' }"
      role="treeitem"
      :tabindex="treeItemTabIndex"
      :aria-expanded="isParent ? isExpanded : undefined"
      :aria-level="depth + 1"
      :aria-label="nodeKey"
      @focus="handleNodeFocus"
      @keydown="handleNodeKeyDown"
    >
      <span
        v-if="isParent"
        class="expand-icon"
        data-testid="expand-icon"
        aria-hidden="true"
        @click="handleToggle"
      >
        {{ isExpanded ? '▼' : '▶' }}
      </span>
      <span
        v-else
        class="expand-icon-placeholder"
        data-testid="expand-icon-placeholder"
      ></span>

      <span class="node-key" data-testid="node-key">{{ nodeKey }}</span>
      <span
        v-if="modified"
        class="modified-badge"
        data-testid="modified-badge"
        :aria-label="t('treeNode.modifiedAriaLabel')"
        >*</span
      >
      <span class="node-separator" data-testid="node-separator">: </span>

      <!-- Editable value display -->
      <template v-if="!isParent">
        <!-- Edit mode -->
        <span v-if="isEditing" class="node-value-edit">
          <input
            ref="editInputRef"
            v-model="editValue"
            type="text"
            class="edit-input"
            data-testid="edit-input"
            @keydown="handleEditKeydown"
            @blur="handleEditBlur"
          />
        </span>
        <!-- View mode -->
        <span
          v-else
          class="node-value"
          data-testid="node-value"
          :class="{ editable: canEdit }"
          :role="canEdit ? 'button' : undefined"
          :tabindex="canEdit ? 0 : undefined"
          :aria-label="
            canEdit
              ? t('treeNode.editValueAriaLabel', { key: nodeKey })
              : undefined
          "
          @click="canEdit && startEditing()"
          @keydown.enter="canEdit && startEditing()"
        >
          {{ formatValue(value) }}
          <span
            v-if="canEdit"
            class="edit-hint"
            data-testid="edit-hint"
            aria-hidden="true"
            >✏️</span
          >
        </span>
      </template>
      <span v-else class="node-value-hint" data-testid="node-value-hint">{{
        isExpanded ? '' : '{...}'
      }}</span>
    </div>

    <!-- Recursive children -->
    <template v-if="isParent && isExpanded">
      <TreeNode
        v-for="(childValue, childKey) in value"
        :key="childKey"
        :node-key="String(childKey)"
        :value="childValue"
        :depth="depth + 1"
        :key-path="buildKeyPath(keyPath, String(childKey))"
        :parent-path="keyPath"
        :editable="editable"
        :file-id="fileId"
        @value-edited="$emit('value-edited', $event)"
      />
    </template>
  </div>
</template>

<style scoped>
.tree-node {
  line-height: 1.6;
  user-select: none;
}

.tree-node-content {
  display: flex;
  align-items: center;
  padding: 2px 4px;
  border-radius: 2px;
  transition: background-color 0.15s ease;
}

.tree-node-content:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.expand-icon {
  cursor: pointer;
  width: 16px;
  display: inline-block;
  text-align: center;
  color: rgba(0, 0, 0, 0.6);
  margin-right: 4px;
  font-size: 0.75rem;
  user-select: none;
}

.expand-icon:hover {
  color: rgba(0, 0, 0, 0.9);
}

.expand-icon-placeholder {
  width: 16px;
  display: inline-block;
  margin-right: 4px;
}

.node-key {
  font-weight: 600;
  color: #000000;
  margin-right: 4px;
}

.node-separator {
  color: rgba(0, 0, 0, 0.5);
  margin-right: 4px;
}

.node-value {
  color: #0066cc;
  background-color: #e8e8e8;
  padding: 2px 6px;
  border-radius: 3px;
  position: relative;
}

.node-value.editable {
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    box-shadow 0.15s ease;
}

.node-value.editable:hover {
  background-color: #d8e8f8;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
}

.node-value.editable:focus {
  outline: 2px solid #0066cc;
  outline-offset: 1px;
}

.edit-hint {
  margin-left: 4px;
  opacity: 0;
  font-size: 0.75rem;
  transition: opacity 0.15s ease;
}

.node-value.editable:hover .edit-hint,
.node-value.editable:focus .edit-hint {
  opacity: 0.7;
}

.node-value-edit {
  display: inline-flex;
  align-items: center;
}

.edit-input {
  font-family: inherit;
  font-size: inherit;
  padding: 2px 6px;
  border: 2px solid #0066cc;
  border-radius: 3px;
  background-color: #ffffff;
  color: #000000;
  min-width: 100px;
  max-width: 300px;
}

.edit-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.3);
}

.node-value-hint {
  color: rgba(255, 255, 255, 0.3);
  font-style: italic;
}

/* Diff status color coding */
.tree-node[data-status='missing-left'] .tree-node-content {
  background-color: rgba(255, 0, 0, 0.08);
  border-left: 3px solid rgba(255, 0, 0, 0.5);
}

.tree-node[data-status='missing-right'] .tree-node-content {
  background-color: rgba(255, 0, 0, 0.08);
  border-left: 3px solid rgba(255, 0, 0, 0.5);
}

.tree-node[data-status='identical'] .tree-node-content {
  background-color: rgba(255, 255, 0, 0.15);
  border-left: 3px solid rgba(204, 204, 0, 0.6);
}

.tree-node[data-status='different'] .tree-node-content {
  background-color: rgba(100, 100, 255, 0.08);
  border-left: 3px solid rgba(100, 100, 255, 0.4);
}

/* Hover states for diff status */
.tree-node[data-status='missing-left'] .tree-node-content:hover,
.tree-node[data-status='missing-right'] .tree-node-content:hover {
  background-color: rgba(255, 0, 0, 0.12);
}

.tree-node[data-status='identical'] .tree-node-content:hover {
  background-color: rgba(255, 255, 0, 0.2);
}

.tree-node[data-status='different'] .tree-node-content:hover {
  background-color: rgba(100, 100, 255, 0.12);
}

/* Editing state */
.tree-node.editing .tree-node-content {
  background-color: rgba(0, 102, 204, 0.1);
}

/* Modified state */
.modified-badge {
  color: #e67e00;
  font-weight: 700;
  font-size: 1rem;
  margin-left: 2px;
  margin-right: 2px;
  line-height: 1;
}

.tree-node.modified > .tree-node-content {
  background-color: rgba(230, 126, 0, 0.08);
  border-left: 3px solid rgba(230, 126, 0, 0.6);
}

.tree-node.modified > .tree-node-content .node-key {
  color: #b36200;
}

.tree-node.modified > .tree-node-content:hover {
  background-color: rgba(230, 126, 0, 0.14);
}
</style>
