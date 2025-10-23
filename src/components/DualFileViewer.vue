<script setup>
/**
 * DualFileViewer Component
 *
 * Purpose: Display two JSON files side-by-side with unified tree structure
 * Features:
 * - Uses file1 keys as primary structure
 * - Shows both values side-by-side for each key
 * - Highlights differences (yellow for different values)
 * - Shows missing keys with "Add" button
 * - Shows temporary keys from file2 that are missing in file1
 */

import { ref, computed } from 'vue';
import { useJsonDiff } from '@/composables/useJsonDiff.js';
import DualTreeNode from '@/components/DualTreeNode.vue';

const props = defineProps({
  file1: {
    type: Object,
    default: () => null,
  },
  file2: {
    type: Object,
    default: () => null,
  },
});

const emit = defineEmits([
  'add-key-to-file1',
  'add-key-to-file2',
  'value-changed',
]);

const expandedNodes = ref(new Set());
const { compareFiles } = useJsonDiff();

// Check if files are loaded
const hasFiles = computed(() => {
  const has = !!(props.file1 || props.file2);
  console.warn(
    'DualFileViewer - hasFiles:',
    has,
    'file1:',
    props.file1,
    'file2:',
    props.file2
  );
  return has;
});

// Calculate diff results
const diffResults = computed(() => {
  if (!props.file1 || !props.file2) return [];
  return compareFiles(props.file1, props.file2);
});

// Create a map for quick diff status lookup
const diffStatusMap = computed(() => {
  const map = new Map();
  diffResults.value.forEach((result) => {
    map.set(result.keyPath, result);
  });
  return map;
});

// Build unified tree structure
const treeStructure = computed(() => {
  const buildTree = (obj1, obj2, parentPath = '') => {
    const nodes = [];
    const keys1 = obj1 ? Object.keys(obj1) : [];
    const keys2 = obj2 ? Object.keys(obj2) : [];

    // Process keys from file1 first
    for (const key of keys1) {
      const keyPath = parentPath ? `${parentPath}.${key}` : key;

      const value1 = obj1[key];
      const value2 = obj2?.[key];
      const diffResult = diffStatusMap.value.get(keyPath);

      const isObj1 = isObject(value1);
      const isObj2 = isObject(value2);

      const node = {
        key,
        keyPath,
        value1,
        value2,
        status: diffResult?.status || 'unknown',
        isParent: isObj1,
        isMissingInFile2: !keys2.includes(key),
        children: [],
      };

      // Recurse into nested objects
      if (isObj1 && isObj2) {
        node.children = buildTree(value1, value2, keyPath);
      } else if (isObj1) {
        node.children = buildTree(value1, {}, keyPath);
      }

      nodes.push(node);
    }

    // Process keys that exist only in file2 (temporary keys)
    for (const key of keys2) {
      if (!keys1.includes(key)) {
        const keyPath = parentPath ? `${parentPath}.${key}` : key;

        const value2 = obj2[key];
        const isObj2 = isObject(value2);

        const node = {
          key,
          keyPath,
          value1: undefined,
          value2,
          status: 'missing-left',
          isParent: isObj2,
          isMissingInFile1: true,
          isTemporary: true,
          children: [],
        };

        // Recurse into nested objects
        if (isObj2) {
          node.children = buildTree({}, value2, keyPath);
        }

        nodes.push(node);
      }
    }

    return nodes;
  };

  return buildTree(props.file1 || {}, props.file2 || {});
});

/**
 * Check if value is a plain object
 */
const isObject = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
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
  expandedNodes.value = new Set(expandedNodes.value);
};

/**
 * Check if node is expanded
 */
const isExpanded = (keyPath) => {
  return expandedNodes.value.has(keyPath);
};

/**
 * Handle add key to file1
 */
const handleAddToFile1 = (keyPath, value) => {
  emit('add-key-to-file1', { keyPath, value });
};

/**
 * Handle add key to file2
 */
const handleAddToFile2 = (keyPath, value) => {
  emit('add-key-to-file2', { keyPath, value });
};

/**
 * Expand all nodes recursively
 */
const expandAll = () => {
  const allPaths = new Set();
  const collectPaths = (nodes) => {
    nodes.forEach((node) => {
      if (node.isParent) {
        allPaths.add(node.keyPath);
        if (node.children.length > 0) {
          collectPaths(node.children);
        }
      }
    });
  };
  collectPaths(treeStructure.value);
  expandedNodes.value = allPaths;
};

/**
 * Collapse all nodes
 */
const collapseAll = () => {
  expandedNodes.value = new Set();
};

// Expose methods
defineExpose({
  expandAll,
  collapseAll,
});
</script>

<template>
  <div class="dual-file-viewer">
    <div v-if="!hasFiles" class="empty-state">
      <p>No files loaded</p>
    </div>

    <div v-else-if="treeStructure.length === 0" class="empty-state">
      <p>No data to display</p>
    </div>

    <div v-else class="viewer-container">
      <!-- Header -->
      <div class="viewer-header">
        <div class="header-actions">
          <button class="action-btn" @click="expandAll">Expand All</button>
          <button class="action-btn" @click="collapseAll">Collapse All</button>
        </div>
        <div class="file-labels">
          <div class="label-file1">File 1</div>
          <div class="label-file2">File 2</div>
        </div>
      </div>

      <!-- Tree Content -->
      <div class="tree-content">
        <DualTreeNode
          v-for="node in treeStructure"
          :key="node.keyPath"
          :node="node"
          :depth="0"
          :is-expanded="isExpanded(node.keyPath)"
          :expanded-nodes="expandedNodes"
          @toggle="toggleNode"
          @add-to-file1="handleAddToFile1"
          @add-to-file2="handleAddToFile2"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dual-file-viewer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.25rem;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(0, 0, 0, 0.4);
}

.viewer-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.viewer-header {
  background: #f5f5f5;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.75rem 1rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.action-btn {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #e8e8e8;
}

.file-labels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  font-weight: 600;
  color: #000000;
}

.label-file1,
.label-file2 {
  padding: 0.5rem;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
  text-align: center;
}

.tree-content {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}
</style>
