<script setup>
/**
 * Index.vue - Main Application Page
 *
 * Purpose: Compare two JSON files side-by-side with unified tree view
 * T021: Integration with Pinia stores and file upload workflow
 */

import { computed, ref } from 'vue';
import { useFileStore } from '@/stores/useFileStore.js';
import ComparisonView from '@/components/ComparisonView.vue';
import FileUploader from '@/components/FileUploader.vue';

// Use Pinia store for file state management
const fileStore = useFileStore();

// Refs to FileUploader components
const fileUploader1 = ref(null);
const fileUploader2 = ref(null);

// Computed properties from store
const file1 = computed(() => fileStore.file1?.data || null);
const file2 = computed(() => fileStore.file2?.data || null);

/**
 * Clear data - reset store and file uploaders
 */
const clearData = () => {
  fileStore.reset();

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
  fileStore.setFile1(parsedData);

  // Auto-run comparison if both files are now loaded
  if (fileStore.hasFiles) {
    try {
      fileStore.runComparison();
    } catch (error) {
      console.error('Comparison failed:', error);
    }
  }
};

/**
 * Handle file 1 error
 */
const handleFile1Error = (errorData) => {
  fileStore.setFile1(null);
  console.error('File 1 error:', errorData);
};

/**
 * Handle file 2 loaded
 * Sets file in store and triggers comparison if both files loaded
 */
const handleFile2Loaded = (parsedData) => {
  fileStore.setFile2(parsedData);

  // Auto-run comparison if both files are now loaded
  if (fileStore.hasFiles) {
    try {
      fileStore.runComparison();
    } catch (error) {
      console.error('Comparison failed:', error);
    }
  }
};

/**
 * Handle file 2 error
 */
const handleFile2Error = (errorData) => {
  fileStore.setFile2(null);
  console.error('File 2 error:', errorData);
};

/**
 * Handle add key to file1
 */
const handleAddKeyToFile1 = ({ keyPath, value }) => {
  // In a real implementation, this would update the file1 data
  alert(`Add key "${keyPath}" to File 1 with value: ${JSON.stringify(value)}`);
};

/**
 * Handle add key to file2
 */
const handleAddKeyToFile2 = ({ keyPath, value }) => {
  // In a real implementation, this would update the file2 data
  alert(`Add key "${keyPath}" to File 2 with value: ${JSON.stringify(value)}`);
};
</script>

<template>
  <div class="index-page">
    <header class="page-header">
      <h1>JSON l10n Diff Tool</h1>
      <p class="subtitle">
        Side-by-side JSON comparison with unified tree view
      </p>
    </header>

    <main class="page-content">
      <!-- Controls -->
      <section class="controls-section">
        <div class="button-group">
          <button class="control-btn" @click="clearData">Clear All</button>
        </div>

        <div class="upload-section">
          <div class="upload-row">
            <div class="upload-group">
              <FileUploader
                ref="fileUploader1"
                label="Upload File 1"
                @file-loaded="handleFile1Loaded"
                @file-error="handleFile1Error"
              />
            </div>

            <div class="upload-group">
              <FileUploader
                ref="fileUploader2"
                label="Upload File 2"
                @file-loaded="handleFile2Loaded"
                @file-error="handleFile2Error"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Legend -->
      <section class="legend-section">
        <h3>Legend:</h3>
        <div class="legend-items">
          <div class="legend-item">
            <span class="legend-color" style="background: #fff9c4"></span>
            <span>Different Values (Yellow)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #ffebee"></span>
            <span>Missing in File 2 (Light Red)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #e3f2fd"></span>
            <span>Missing in File 1 / Temporary (Light Blue)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: transparent"></span>
            <span>Identical Values</span>
          </div>
        </div>
      </section>

      <!-- Comparison View -->
      <section class="viewer-section">
        <ComparisonView
          :file1="file1"
          :file2="file2"
          :file1-name="fileStore.file1?.fileName || 'File 1'"
          :file2-name="fileStore.file2?.fileName || 'File 2'"
          @add-key-to-file1="handleAddKeyToFile1"
          @add-key-to-file2="handleAddKeyToFile2"
        />
      </section>

      <!-- Instructions -->
      <section class="instructions-section">
        <h3>Features:</h3>
        <ul>
          <li>
            <strong>Unified Tree Structure:</strong> Uses File 1's keys as the
            primary structure
          </li>
          <li>
            <strong>Side-by-side Values:</strong> Shows values from both files
            for each key
          </li>
          <li>
            <strong>Color-coded Differences:</strong>
            <ul>
              <li>Yellow highlight = Different values</li>
              <li>Light red = Missing in File 2</li>
              <li>Light blue = Missing in File 1 (temporary keys)</li>
            </ul>
          </li>
          <li>
            <strong>Add Missing Keys:</strong> Click "+ Add" button to add
            missing keys to either file
          </li>
          <li>
            <strong>Temporary Keys:</strong> Keys that exist in File 2 but not
            in File 1 are shown with "(temp)" badge
          </li>
          <li>
            <strong>Expand/Collapse:</strong> Click arrows to expand/collapse
            nested objects
          </li>
          <li>
            <strong>Expand All / Collapse All:</strong> Buttons at the top for
            bulk operations
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
  background: #fafafa;
}

.page-header {
  padding: var(--spacing-xl) var(--spacing-lg);
  text-align: center;
  background: linear-gradient(
    135deg,
    rgba(100, 108, 255, 0.1) 0%,
    rgba(100, 108, 255, 0.05) 100%
  );
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.page-header h1 {
  margin: 0;
  font-size: 2.5rem;
  background: linear-gradient(135deg, #646cff 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  margin: var(--spacing-sm) 0 0 0;
  color: rgba(0, 0, 0, 0.6);
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
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:hover {
  background: #f5f5f5;
}

.upload-section {
  background: #ffffff;
  padding: var(--spacing-md);
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
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
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  flex-direction: column;
  gap: var(--spacing-xs, 0.25rem);
}

.file-status--error {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.file-status__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: var(--success-color, #10b981);
}

.file-status--error .file-status__icon {
  color: var(--error-color, #ef4444);
}

.file-status__info {
  flex: 1;
}

.file-status__text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--success-color, #10b981);
}

.file-status--error .file-status__text {
  color: var(--error-color, #ef4444);
}

.file-status__details {
  font-size: 0.75rem;
  color: var(--success-color, #10b981);
}

.file-status--error .file-status__details {
  color: var(--error-color, #ef4444);
}

.legend-section {
  background: #ffffff;
  padding: var(--spacing-md);
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
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
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.25rem;
}

.viewer-section {
  margin-bottom: var(--spacing-lg);
  height: 600px;
}

.instructions-section {
  background: #ffffff;
  padding: var(--spacing-md);
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
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
