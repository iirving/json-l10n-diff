<script setup>
/**
 * ComparisonView Component
 *
 * Purpose: Side-by-side comparison of two JSON files
 * Features:
 * - Two TreeViewer instances side-by-side
 * - Event forwarding from TreeViewers
 * - Save and prettify functionality
 */

import TreeViewer from '@/components/TreeViewer.vue';

const props = defineProps({
  file1: {
    type: Object,
    default: null,
  },
  file2: {
    type: Object,
    default: null,
  },
  diffResults: {
    type: Array,
    default: () => [],
  },
  editable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  'save-requested',
  'prettify-requested',
  'edit-made',
  'node-toggled',
]);

/**
 * Handle save request
 * Emits save-requested event with both file contents
 */
// eslint-disable-next-line no-unused-vars
function handleSave() {
  if (!props.file1 && !props.file2) {
    return;
  }

  emit('save-requested', {
    file1: props.file1,
    file2: props.file2,
  });
}

/**
 * Handle prettify request
 * @param {string} fileId - Identifier for the file to prettify ('file1' or 'file2')
 */
// eslint-disable-next-line no-unused-vars
function handlePrettify(fileId) {
  emit('prettify-requested', { fileId });
}

/**
 * Handle value edit from TreeViewer
 * @param {object} editDetails - Edit details from TreeViewer
 */
function handleValueEdited(editDetails) {
  emit('edit-made', editDetails);
}

/**
 * Handle node toggle from TreeViewer
 * @param {object} toggleDetails - Toggle details from TreeViewer
 */
function handleNodeToggled(toggleDetails) {
  // Forward the event (can be used for synchronization features)
  emit('node-toggled', toggleDetails);
}
</script>

<template>
  <div class="comparison-view">
    <div v-if="!file1 && !file2" class="empty-state">
      <p>No files loaded</p>
    </div>

    <div v-else class="comparison-container">
      <div class="file-pane" aria-label="File 1 view">
        <div class="file-label">File 1</div>
        <TreeViewer
          :content="file1 || {}"
          :diff-results="diffResults"
          :editable="editable"
          file-id="file1"
          @value-edited="handleValueEdited"
          @node-toggled="handleNodeToggled"
        />
      </div>

      <div class="file-pane" aria-label="File 2 view">
        <div class="file-label">File 2</div>
        <TreeViewer
          :content="file2 || {}"
          :diff-results="diffResults"
          :editable="editable"
          file-id="file2"
          @value-edited="handleValueEdited"
          @node-toggled="handleNodeToggled"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.comparison-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(0, 0, 0, 0.4);
}

.comparison-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  height: 100%;
  overflow: hidden;
}

.file-pane {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.25rem;
  background: #ffffff;
}

.file-label {
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: #000000;
  background: #f5f5f5;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
