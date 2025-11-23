<script setup>
/**
 * ComparisonView Component
 *
 * Purpose: Unified tree comparison of two JSON files
 * Features:
 * - Single unified tree with side-by-side values
 * - DualFileViewer for merged key structure
 * - Event forwarding and save/prettify functionality
 * - Internationalization support
 */

import { useI18n } from 'vue-i18n';
import DualFileViewer from '@/components/DualFileViewer.vue';

// Props
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  file1: {
    type: Object,
    default: null,
  },
  file2: {
    type: Object,
    default: null,
  },
  file1Name: {
    type: String,
    default: 'File 1',
  },
  file2Name: {
    type: String,
    default: 'File 2',
  },
});

// Emits
const emit = defineEmits([
  'add-key-to-file1',
  'add-key-to-file2',
  'value-changed',
  'node-toggled',
]);

// Composables
const { t } = useI18n();

// Methods

/**
 * Handle value edit from DualFileViewer
 * @param {object} editDetails - Edit details from DualFileViewer
 */
function handleValueEdited(editDetails) {
  emit('value-changed', editDetails);
}

/**
 * Handle add key request from DualFileViewer
 * @param {object} addKeyDetails - Add key details
 */
function handleAddKeyToFile1(addKeyDetails) {
  emit('add-key-to-file1', addKeyDetails);
}

/**
 * Handle add key request from DualFileViewer
 * @param {object} addKeyDetails - Add key details
 */
function handleAddKeyToFile2(addKeyDetails) {
  emit('add-key-to-file2', addKeyDetails);
}

/**
 * Handle node toggle from DualFileViewer
 * @param {object} toggleDetails - Toggle details from DualFileViewer
 */
function handleNodeToggled(toggleDetails) {
  // Forward the event (can be used for synchronization features)
  emit('node-toggled', toggleDetails);
}
</script>

<template>
  <div class="comparison-view">
    <div v-if="!file1 && !file2" class="empty-state">
      <p>{{ t('comparison.emptyState') }}</p>
    </div>

    <div v-else class="comparison-container">
      <DualFileViewer
        :file1="file1"
        :file2="file2"
        :file1-name="file1Name"
        :file2-name="file2Name"
        @add-key-to-file1="handleAddKeyToFile1"
        @add-key-to-file2="handleAddKeyToFile2"
        @value-changed="handleValueEdited"
        @node-toggled="handleNodeToggled"
      />
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
  color: var(--color-text-muted);
}

.comparison-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
</style>
