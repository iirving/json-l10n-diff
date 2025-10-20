<script setup>
/**
 * Index.vue - Main Application Page
 *
 * Purpose: Main page for JSON i18n comparison tool
 * Features (to be implemented):
 * - Two FileUploader instances (for file1 and file2)
 * - ComparisonView component
 * - Integration with Pinia stores (useFileStore, useTierStore, useEditStore)
 * - Wire up file-loaded handlers to trigger comparison
 * - Handle edit events and save operations
 */

import { ref, computed } from 'vue';
import FileUploader from '@/components/FileUploader.vue';
import ComparisonView from '@/components/ComparisonView.vue';
import EditControls from '@/components/EditControls.vue';
import { bytesToKB } from '@/utils/fileSize.js';

// File state
const file1 = ref(null);
const file2 = ref(null);
const file1Error = ref(null);
const file2Error = ref(null);

// Computed
const hasFiles = computed(() => file1.value && file2.value);
const hasErrors = computed(() => file1Error.value || file2Error.value);

/**
 * Get formatted file size in KB
 * @param {Ref} fileRef - File ref to get size from
 * @returns {ComputedRef<number>} - Formatted file size in KB
 */
const getFileSizeKB = (fileRef) => {
  return computed(() => {
    return fileRef.value ? bytesToKB(fileRef.value.fileSize) : 0;
  });
};

const file1SizeKB = getFileSizeKB(file1);
const file2SizeKB = getFileSizeKB(file2);

/**
 * Handle file 1 loaded successfully
 * @param {Object} parsedData - Parsed file data
 */
const handleFile1Loaded = (parsedData) => {
  file1.value = parsedData;
  file1Error.value = null;
};

/**
 * Handle file 1 error
 * @param {Object} errorData - Error information
 */
const handleFile1Error = (errorData) => {
  file1.value = null;
  file1Error.value = errorData;
};

/**
 * Handle file 2 loaded successfully
 * @param {Object} parsedData - Parsed file data
 */
const handleFile2Loaded = (parsedData) => {
  file2.value = parsedData;
  file2Error.value = null;
};

/**
 * Handle file 2 error
 * @param {Object} errorData - Error information
 */
const handleFile2Error = (errorData) => {
  file2.value = null;
  file2Error.value = errorData;
};
</script>

<template>
  <div class="index-page">
    <header class="page-header">
      <h1>JSON l10n Diff Tool</h1>
      <p class="subtitle">Compare and synchronize your translation files</p>
    </header>

    <main class="page-content">
      <section class="upload-section">
        <div class="upload-group">
          <FileUploader
            label="Upload File 1"
            @file-loaded="handleFile1Loaded"
            @file-error="handleFile1Error"
          />
          <div
            v-if="file1 && !file1Error"
            class="file-status file-status--success"
          >
            <svg
              class="file-status__icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div class="file-status__info">
              <span class="file-status__text">{{ file1.fileName }}</span>
              <span class="file-status__details">
                {{ file1.keyCount }} keys • {{ file1SizeKB }} KB
              </span>
            </div>
          </div>
        </div>
        <div class="upload-group">
          <FileUploader
            label="Upload File 2"
            @file-loaded="handleFile2Loaded"
            @file-error="handleFile2Error"
          />
          <div
            v-if="file2 && !file2Error"
            class="file-status file-status--success"
          >
            <svg
              class="file-status__icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div class="file-status__info">
              <span class="file-status__text">{{ file2.fileName }}</span>
              <span class="file-status__details">
                {{ file2.keyCount }} keys • {{ file2SizeKB }} KB
              </span>
            </div>
          </div>
        </div>
      </section>

      <section v-if="hasFiles" class="comparison-section">
        <ComparisonView :file1="file1" :file2="file2" :diff-results="[]" />
      </section>

      <section v-if="hasFiles" class="controls-section">
        <EditControls file-name="file.json" :modified="false" />
      </section>

      <div v-if="!hasFiles && !hasErrors" class="placeholder-note">
        <svg
          class="placeholder-note__icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p class="placeholder-note__text">
          Upload two JSON files to start comparing
        </p>
        <p class="placeholder-note__subtext">
          Drag and drop or click to browse for files
        </p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.index-page {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.page-header {
  padding: var(--spacing-xl) var(--spacing-lg);
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(
    135deg,
    rgba(100, 108, 255, 0.1) 0%,
    rgba(100, 108, 255, 0.05) 100%
  );
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
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.125rem;
}

.page-content {
  flex: 1;
  padding: var(--spacing-lg);
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.upload-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.comparison-section {
  margin-bottom: var(--spacing-lg);
}

.controls-section {
  margin-bottom: var(--spacing-lg);
}

.tier-section {
  margin-bottom: var(--spacing-lg);
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
}

.file-status__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: var(--success-color, #10b981);
}

.file-status__info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs, 0.25rem);
  flex: 1;
}

.file-status__text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--success-color, #10b981);
}

.file-status__details {
  font-size: 0.75rem;
  color: var(--success-color, #10b981);
}

.placeholder-note {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xl) var(--spacing-md);
  border-radius: var(--radius-md);
  background-color: rgba(100, 108, 255, 0.05);
  border: 2px dashed rgba(100, 108, 255, 0.3);
  text-align: center;
  margin-top: var(--spacing-xl);
}

.placeholder-note__icon {
  width: 64px;
  height: 64px;
  color: rgba(100, 108, 255, 0.5);
}

.placeholder-note__text {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.125rem;
  font-weight: 500;
}

.placeholder-note__subtext {
  margin: 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .upload-section {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .page-content {
    padding: var(--spacing-md);
  }
}
</style>
