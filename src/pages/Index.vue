<script setup>
/**
 * Index.vue - Main Application Page
 *
 * Purpose: Compare two JSON files side-by-side with unified tree view
 * T021: Integration with Pinia stores and file upload workflow
 * Uses storeToRefs for cleaner component code
 * Uses vue-i18n for internationalization
 */

import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useFileStore } from '@/stores/useFileStore.js';
import { useEditStore } from '@/stores/useEditStore.js';
import ComparisonView from '@/components/ComparisonView.vue';
import FileUploader from '@/components/FileUploader.vue';

// Composables and stores
const { t } = useI18n();
const fileStore = useFileStore();
const editStore = useEditStore();
const { hasFiles } = storeToRefs(fileStore);
const { setFile1, setFile2, runComparison, reset } = fileStore;

// Reactive state
const fileUploader1 = ref(null);
const fileUploader2 = ref(null);

// Computed properties
const file1 = computed(() => {
  const originalData = fileStore.file1?.data || null;
  return editStore.getCurrentData('file1', originalData);
});
const file2 = computed(() => {
  const originalData = fileStore.file2?.data || null;
  return editStore.getCurrentData('file2', originalData);
});

/**
 * Clear data - reset store and file uploaders
 */
const clearData = () => {
  reset();
  editStore.clearAllEdits();

  // Reset both file uploaders if they have the reset method
  if (fileUploader1.value && typeof fileUploader1.value.reset === 'function') {
    fileUploader1.value.reset();
  }
  if (fileUploader2.value && typeof fileUploader2.value.reset === 'function') {
    fileUploader2.value.reset();
  }
};

/**
 * Handle file 1 loaded
 * Sets file in store and triggers comparison if both files loaded
 */
const handleFile1Loaded = (parsedData) => {
  setFile1(parsedData);

  // Auto-run comparison if both files are now loaded
  if (hasFiles.value) {
    try {
      runComparison();
    } catch (error) {
      console.error('Comparison failed:', error);
    }
  }
};

/**
 * Handle file 1 error
 */
const handleFile1Error = (errorData) => {
  setFile1(null);
  console.error('File 1 error:', errorData);
};

/**
 * Handle file 2 loaded
 * Sets file in store and triggers comparison if both files loaded
 */
const handleFile2Loaded = (parsedData) => {
  setFile2(parsedData);

  // Auto-run comparison if both files are now loaded
  if (hasFiles.value) {
    try {
      runComparison();
    } catch (error) {
      console.error('Comparison failed:', error);
    }
  }
};

/**
 * Handle file 2 error
 */
const handleFile2Error = (errorData) => {
  setFile2(null);
  console.error('File 2 error:', errorData);
};

/**
 * Handle add key to file1
 * @param {object} param0 - Add key details
 * @param {string} param0.keyPath - Dot-notation path to the key
 * @param {*} param0.value - Value to add
 */
const handleAddKeyToFile1 = ({ keyPath, value }) => {
  const originalData = fileStore.file1?.data;
  if (!originalData) {
    console.error('Cannot add key: file1 not loaded');
    return;
  }

  // Add the edit to history
  editStore.addEdit('file1', keyPath, value, 'add');

  // Apply edits to get updated data
  editStore.applyEdit('file1', originalData);

  // Re-run comparison with updated data
  if (hasFiles.value) {
    try {
      runComparison();
    } catch (error) {
      console.error('Comparison failed after adding key:', error);
    }
  }
};

/**
 * Handle add key to file2
 * @param {object} param0 - Add key details
 * @param {string} param0.keyPath - Dot-notation path to the key
 * @param {*} param0.value - Value to add
 */
const handleAddKeyToFile2 = ({ keyPath, value }) => {
  const originalData = fileStore.file2?.data;
  if (!originalData) {
    console.error('Cannot add key: file2 not loaded');
    return;
  }

  // Add the edit to history
  editStore.addEdit('file2', keyPath, value, 'add');

  // Apply edits to get updated data
  editStore.applyEdit('file2', originalData);

  // Re-run comparison with updated data
  if (hasFiles.value) {
    try {
      runComparison();
    } catch (error) {
      console.error('Comparison failed after adding key:', error);
    }
  }
};

/**
 * Handle value changed event
 * @param {object} param0 - Value change details
 * @param {string} param0.keyPath - Dot-notation path to the key
 * @param {*} param0.newValue - New value
 * @param {string} param0.targetFile - 'file1' or 'file2'
 */
const handleValueChanged = ({ keyPath, newValue, targetFile }) => {
  const fileKey = targetFile || 'file1';
  const originalData =
    fileKey === 'file1' ? fileStore.file1?.data : fileStore.file2?.data;

  if (!originalData) {
    console.error(`Cannot edit value: ${fileKey} not loaded`);
    return;
  }

  // Add the edit to history
  editStore.addEdit(fileKey, keyPath, newValue, 'modify');

  // Apply edits to get updated data
  editStore.applyEdit(fileKey, originalData);

  // Re-run comparison with updated data
  if (hasFiles.value) {
    try {
      runComparison();
    } catch (error) {
      console.error('Comparison failed after editing value:', error);
    }
  }
};
</script>

<template>
  <div class="index-page">
    <header class="page-header">
      <h1>{{ t('app.title') }}</h1>
      <p class="subtitle">
        {{ t('app.subtitle') }}
      </p>
    </header>

    <main class="page-content">
      <!-- Controls -->
      <section class="controls-section">
        <div class="button-group">
          <button class="control-btn" @click="clearData">
            {{ t('controls.clearAll') }}
          </button>
        </div>

        <div class="upload-section">
          <div class="upload-row">
            <div class="upload-group">
              <FileUploader
                ref="fileUploader1"
                :label="t('upload.file1')"
                @file-loaded="handleFile1Loaded"
                @file-error="handleFile1Error"
              />
            </div>

            <div class="upload-group">
              <FileUploader
                ref="fileUploader2"
                :label="t('upload.file2')"
                @file-loaded="handleFile2Loaded"
                @file-error="handleFile2Error"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Legend -->
      <section class="legend-section">
        <h3>{{ t('legend.title') }}</h3>
        <div class="legend-items">
          <div class="legend-item">
            <span class="legend-color legend-different"></span>
            <span>{{ t('legend.different') }}</span>
          </div>
          <div class="legend-item">
            <span class="legend-color legend-missing-right"></span>
            <span>{{ t('legend.missingRight') }}</span>
          </div>
          <div class="legend-item">
            <span class="legend-color legend-missing-left"></span>
            <span>{{ t('legend.missingLeft') }}</span>
          </div>
          <div class="legend-item">
            <span class="legend-color legend-identical"></span>
            <span>{{ t('legend.identical') }}</span>
          </div>
        </div>
      </section>

      <!-- Comparison View -->
      <section class="viewer-section">
        <ComparisonView
          :file1="file1"
          :file2="file2"
          :file1-name="fileStore.file1?.fileName || t('defaults.file1')"
          :file2-name="fileStore.file2?.fileName || t('defaults.file2')"
          @add-key-to-file1="handleAddKeyToFile1"
          @add-key-to-file2="handleAddKeyToFile2"
          @value-changed="handleValueChanged"
        />
      </section>

      <!-- Instructions -->
      <section class="instructions-section">
        <h3>{{ t('instructions.title') }}</h3>
        <ul>
          <li>
            <strong>{{ t('instructions.step1Title') }}</strong>
            {{ t('instructions.step1') }}
          </li>
          <li>
            <strong>{{ t('instructions.step2Title') }}</strong>
            {{ t('instructions.step2') }}
          </li>
          <li>
            <strong>{{ t('instructions.step3Title') }}</strong>
            <ul>
              <li>{{ t('instructions.step3a') }}</li>
              <li>{{ t('instructions.step3b') }}</li>
              <li>{{ t('instructions.step3c') }}</li>
            </ul>
          </li>
          <li>
            <strong>{{ t('instructions.step4Title') }}</strong>
            {{ t('instructions.step4') }}
          </li>
          <li>
            <strong>{{ t('instructions.step5Title') }}</strong>
            {{ t('instructions.step5') }}
          </li>
          <li>
            <strong>{{ t('instructions.step6Title') }}</strong>
            {{ t('instructions.step6') }}
          </li>
          <li>
            <strong>{{ t('instructions.step7Title') }}</strong>
            {{ t('instructions.step7') }}
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<style scoped>
.index-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
}

.page-header {
  padding: var(--spacing-xl) var(--spacing-lg);
  text-align: center;
  background: var(--gradient-header);
  border-bottom: 1px solid var(--border-medium);
}

.page-header h1 {
  margin: 0;
  font-size: 2.5rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  margin: var(--spacing-sm) 0 0 0;
  color: var(--color-text-tertiary);
  font-size: 1.125rem;
}

.page-content {
  flex: 1;
  padding: var(--spacing-lg);
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
}

.controls-section {
  margin-bottom: var(--spacing-lg);
}

.button-group {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.control-btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-dark);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:hover {
  background: var(--bg-tertiary);
}

.upload-section {
  background: var(--bg-primary);
  padding: var(--spacing-md);
  border-radius: 0.5rem;
  border: 1px solid var(--border-medium);
}

.upload-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

.upload-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.file-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.file-status--success {
  background-color: var(--bg-success);
  border: 1px solid var(--border-success);
  flex-direction: column;
  gap: var(--spacing-xs, 0.25rem);
}

.file-status--error {
  background-color: var(--bg-error);
  border: 1px solid var(--border-error);
}

.file-status__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: var(--color-success-alt);
}

.file-status--error .file-status__icon {
  color: var(--color-error);
}

.file-status__info {
  flex: 1;
}

.file-status__text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-success-alt);
}

.file-status--error .file-status__text {
  color: var(--color-error);
}

.file-status__details {
  font-size: 0.75rem;
  color: var(--color-success-alt);
}

.file-status--error .file-status__details {
  color: var(--color-error);
}

.legend-section {
  background: var(--bg-primary);
  padding: var(--spacing-md);
  border-radius: 0.5rem;
  border: 1px solid var(--border-medium);
  margin-bottom: var(--spacing-lg);
}

.legend-section h3 {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: 1rem;
}

.legend-items {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.legend-color {
  width: 32px;
  height: 20px;
  border: 1px solid var(--border-dark);
  border-radius: 0.25rem;
}

.legend-different {
  background: var(--bg-different-alt);
}

.legend-missing-right {
  background: var(--bg-missing-alt);
}

.legend-missing-left {
  background: var(--bg-temporary-alt);
}

.legend-identical {
  background: var(--bg-identical-alt);
}

.viewer-section {
  margin-bottom: var(--spacing-lg);
  height: 600px;
}

.instructions-section {
  background: var(--bg-primary);
  padding: var(--spacing-md);
  border-radius: 0.5rem;
  border: 1px solid var(--border-medium);
}

.instructions-section h3 {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: 1rem;
}

.instructions-section ul {
  margin: 0;
  padding-left: var(--spacing-lg);
}

.instructions-section li {
  margin-bottom: var(--spacing-xs);
}

.instructions-section ul ul {
  margin-top: var(--spacing-xs);
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .upload-row {
    grid-template-columns: 1fr;
  }

  .legend-items {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .viewer-section {
    height: 400px;
  }
}
</style>
