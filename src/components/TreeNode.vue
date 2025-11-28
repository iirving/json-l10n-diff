<script setup>
import { computed, inject } from 'vue';
import { formatValue } from '@/composables/useValueFormatter.js';

/**
 * TreeNode Component (Recursive)
 * Renders a single node in the tree with support for recursion
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
});

// Emits
// eslint-disable-next-line no-unused-vars
const emit = defineEmits(['value-edited']);

// Composables (inject)
const isExpandedFn = inject('isExpanded', () => false);
const getDiffStatusFn = inject('getDiffStatus', () => null);
const toggleNodeFn = inject('toggleNode', () => {});

// Methods (needed for computed properties)
const isObject = (val) => {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
};

// Computed properties
const isParent = computed(() => isObject(props.value));
const isExpanded = computed(() => isExpandedFn(props.keyPath));
const diffStatus = computed(() => getDiffStatusFn(props.keyPath));

const buildKeyPath = (parentPath, key) => {
  return parentPath ? `${parentPath}.${key}` : key;
};

const handleToggle = () => {
  if (isParent.value) {
    toggleNodeFn(props.keyPath);
  }
};
</script>

<template>
  <div
    class="tree-node"
    :class="{ expanded: isExpanded }"
    :data-depth="depth"
    :data-key-path="keyPath"
    :data-status="diffStatus"
    :data-parent="parentPath"
  >
    <div class="tree-node-content" :style="{ paddingLeft: depth * 4 + 'px' }">
      <span v-if="isParent" class="expand-icon" @click="handleToggle">
        {{ isExpanded ? '▼' : '▶' }}
      </span>
      <span v-else class="expand-icon-placeholder"></span>

      <span class="node-key">{{ nodeKey }}</span>
      <span class="node-separator">: </span>

      <span v-if="!isParent" class="node-value">{{ formatValue(value) }}</span>
      <span v-else class="node-value-hint">{{
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
</style>
