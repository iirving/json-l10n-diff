<script setup>
import { ref, computed, onMounted, provide } from 'vue';
import TreeNode from '@/components/TreeNode.vue';

/**
 * TreeViewer Component
 *
 * Purpose: Display JSON structure as an expandable tree with color-coded diff highlighting
 * Features:
 * - Recursive tree node rendering
 * - Expand/collapse functionality
 * - Color-coded diff highlighting (red for missing, yellow for identical, green for different)
 * - scrollToKey, expandAll, collapseAll methods
 */

// Props
const props = defineProps({
  content: {
    type: Object,
    default: () => ({}),
  },
  fileId: {
    type: String,
    required: true,
    validator: (value) => ['file1', 'file2'].includes(value),
  },
  diffResults: {
    type: Array,
    default: () => [],
  },
  defaultExpanded: {
    type: Boolean,
    default: true,
  },
  editable: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(['node-toggled', 'value-edited']);

// Reactive state
const expandedNodes = ref(new Set());

// Computed properties
const diffStatusMap = computed(() => {
  const map = new Map();
  props.diffResults.forEach((result) => {
    map.set(result.keyPath, result.status);
  });
  return map;
});

// Methods
/**
 * Check if a node is expanded
 */
const isExpanded = (keyPath) => {
  return expandedNodes.value.has(keyPath);
};

/**
 * Toggle node expansion
 */
const toggleNode = (keyPath) => {
  if (expandedNodes.value.has(keyPath)) {
    expandedNodes.value.delete(keyPath);
  } else {
    expandedNodes.value.add(keyPath);
  }
  // Trigger reactivity
  expandedNodes.value = new Set(expandedNodes.value);
  emit('node-toggled', keyPath);
};

/**
 * Get the diff status for a key path
 */
const getDiffStatus = (keyPath) => {
  return diffStatusMap.value.get(keyPath);
};

/**
 * Check if a value is an object (but not null or array)
 */
const isObject = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

/**
 * Check if a value is an array
 */
const isArray = (value) => {
  return Array.isArray(value);
};

/**
 * Check if a value is a parent node (object or array)
 */
const isParent = (value) => {
  return isObject(value) || isArray(value);
};

/**
 * Build key path from parent and current key
 */
const buildKeyPath = (parentPath, key) => {
  return parentPath ? `${parentPath}.${key}` : key;
};

/**
 * Expand all nodes
 */
const expandAll = () => {
  const allPaths = new Set();
  const collectPaths = (obj, parentPath = '') => {
    if (!isParent(obj)) return;
    const keys = isArray(obj) ? obj.map((_, i) => i) : Object.keys(obj);
    keys.forEach((key) => {
      const keyPath = buildKeyPath(parentPath, String(key));
      allPaths.add(keyPath);
      if (isParent(obj[key])) {
        collectPaths(obj[key], keyPath);
      }
    });
  };
  collectPaths(props.content);
  expandedNodes.value = allPaths;
};

/**
 * Collapse all nodes
 */
const collapseAll = () => {
  expandedNodes.value = new Set();
};

/**
 * Scroll to a specific key
 */
const scrollToKey = (keyPath) => {
  const element = document.querySelector(`[data-key-path="${keyPath}"]`);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }
};

// Provide functions to child TreeNode components
provide('isExpanded', isExpanded);
provide('getDiffStatus', getDiffStatus);
provide('toggleNode', toggleNode);

// Lifecycle hooks
onMounted(() => {
  if (props.defaultExpanded) {
    expandAll();
  }
});

// Expose methods for parent components
defineExpose({
  expandAll,
  collapseAll,
  scrollToKey,
});
</script>

<template>
  <div class="tree-viewer">
    <div v-if="Object.keys(content).length === 0" class="empty-state">
      No data to display
    </div>
    <div v-for="(value, key) in content" :key="key" class="tree-node-container">
      <TreeNode :node-key="String(key)" :value="value" :depth="0" :key-path="String(key)" :parent-path="''"
        :editable="editable" :file-id="fileId" @value-edited="emit('value-edited', $event)" />
    </div>
  </div>
</template>

<style scoped>
.tree-viewer {
  font-family: 'Courier New', Monaco, monospace;
  font-size: 0.9rem;
  padding: var(--spacing-md, 16px);
  text-align: left;
  overflow-x: auto;
  overflow-y: auto;
  max-height: 600px;
}

.tree-node-container {
  margin-bottom: 2px;
}

.empty-state {
  color: rgba(0, 0, 0, 0.4);
  font-style: italic;
  padding: var(--spacing-lg, 24px);
  text-align: center;
}
</style>
