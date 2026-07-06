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

import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import DualFileViewer from '@/components/DualFileViewer.vue';

// Props
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
    default: null,
  },
  file2Name: {
    type: String,
    default: null,
  },
});

// Emits
const emit = defineEmits([
  'add-key-to-file1',
  'add-key-to-file2',
  'value-edited',
  'node-toggled',
]);

// Composables
const { t } = useI18n();
const resolvedFile1Name = computed(
  () => props.file1Name || t('defaults.file1')
);
const resolvedFile2Name = computed(
  () => props.file2Name || t('defaults.file2')
);

// Methods

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
 * Handle value edited from DualFileViewer
 * @param {object} editDetails - Edit details with keyPath, newValue, oldValue, targetFile
 */
function handleValueEdited(editDetails) {
  emit('value-edited', editDetails);
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
  <section
    class="comparison-view"
    data-testid="comparison-view"
    :aria-label="t('comparison.ariaLabel')"
  >
    <p
      v-if="!file1 && !file2"
      class="empty-state"
      data-testid="empty-state"
      role="status"
    >
      {{ t('comparison.emptyState') }}
    </p>

    <div v-else class="comparison-container" data-testid="comparison-container">
      <DualFileViewer
        :file1="file1"
        :file2="file2"
        :file1-name="resolvedFile1Name"
        :file2-name="resolvedFile2Name"
        @add-key-to-file1="handleAddKeyToFile1"
        @add-key-to-file2="handleAddKeyToFile2"
        @value-edited="handleValueEdited"
        @node-toggled="handleNodeToggled"
      />
    </div>
  </section>
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
