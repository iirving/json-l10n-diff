<script setup>
/**
 * DualTreeNode Component
 *
 * Purpose: Render a single row in the dual file viewer
 * Shows key and values from both files side-by-side
 */

import { computed } from 'vue';
import { formatValue } from '@/composables/useValueFormatter.js';
import {
  DIFFERENT,
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

const emit = defineEmits(['toggle', 'add-to-file1', 'add-to-file2']);

/**
 * Get background color based on status
 */
const getRowColor = computed(() => {
  switch (props.node.status) {
    case DIFFERENT:
      return '#fff9c4'; // Yellow for different values
    case MISSING_RIGHT:
      return '#ffebee'; // Light red for missing in file2
    case MISSING_LEFT:
      return '#e3f2fd'; // Light blue for missing in file1 (temporary)
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
          <span v-if="node.value1 !== undefined">
            {{ formatValue(node.value1) }}
          </span>
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
          <span v-if="node.value2 !== undefined">
            {{ formatValue(node.value2) }}
          </span>
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
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s;
}

.node-row:hover {
  filter: brightness(0.95);
}

.expand-icon {
  width: 20px;
  cursor: pointer;
  user-select: none;
  color: #666;
  font-size: 0.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.expand-icon:hover {
  color: #000;
}

.expand-icon-placeholder {
  width: 20px;
  display: inline-block;
}

.node-key {
  font-weight: 600;
  color: #000000;
  margin-right: 1rem;
  min-width: 150px;
  flex-shrink: 0;
}

.node-key.temporary {
  color: #1976d2;
  font-style: italic;
}

.temporary-badge {
  font-size: 0.75rem;
  font-weight: normal;
  color: #1976d2;
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
  background: rgba(0, 0, 0, 0.02);
}

.file2-value {
  background: rgba(0, 0, 0, 0.02);
}

.value-cell span {
  color: #0066cc;
  word-break: break-word;
}

.missing-indicator {
  color: rgba(0, 0, 0, 0.3);
  font-style: italic;
}

.add-btn {
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  background: #45a049;
  transform: scale(1.05);
}
</style>
