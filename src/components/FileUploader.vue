<script setup>
/**
 * FileUploader Component
 *
 * Purpose: Handle file upload via drag-and-drop or file input
 * Features:
 * - File input with drag-and-drop support
 * - Size validation (≤10MB)
 * - Emit file-loaded/file-error events
 * - Visual feedback for drag state and errors
 */

import { ref, computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: 'Upload JSON File',
  },
  accept: {
    type: String,
    default: '.json',
  },
});

const emit = defineEmits(['file-loaded', 'file-error']);

// Constants
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes

/**
 * Generate a unique file input ID
 * @returns {string} - Unique ID string
 */
const generateFileInputId = () => {
  return `file-input-${Math.random().toString(36).substring(2, 11)}`;
};

// State
const isDragOver = ref(false);
const selectedFile = ref(null);
const errorMessage = ref('');
const fileInputId = ref(generateFileInputId());

// Computed
const hasError = computed(() => !!errorMessage.value);
const hasFile = computed(() => !!selectedFile.value);

/**
 * Validate file size
 * @param {File} file - File to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const validateFileSize = (file) => {
  if (file.size > MAX_FILE_SIZE) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    errorMessage.value = `File size (${fileSizeMB}MB) exceeds the maximum allowed size of 10MB`;
    emit('file-error', errorMessage.value);
    return false;
  }
  return true;
};

/**
 * Handle file selection/upload
 * @param {File} file - Selected file
 */
const handleFile = (file) => {
  if (!file) return;

  // Clear previous error
  errorMessage.value = '';

  // Validate file size
  if (!validateFileSize(file)) {
    selectedFile.value = null;
    return;
  }

  // File is valid
  selectedFile.value = file;
  emit('file-loaded', file);
};

/**
 * Handle file input change event
 * @param {Event} event - Input change event
 */
const handleFileInputChange = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    handleFile(file);
  }
};

/**
 * Handle drag enter event
 * @param {DragEvent} event - Drag event
 */
const handleDragEnter = (event) => {
  event.preventDefault();
  isDragOver.value = true;
};

/**
 * Handle drag leave event
 */
const handleDragLeave = () => {
  isDragOver.value = false;
};

/**
 * Handle drag over event
 * @param {DragEvent} event - Drag event
 */
const handleDragOver = (event) => {
  event.preventDefault();
};

/**
 * Handle drop event
 * @param {DragEvent} event - Drop event
 */
const handleDrop = (event) => {
  event.preventDefault();
  isDragOver.value = false;

  const file = event.dataTransfer?.files?.[0];
  if (file) {
    handleFile(file);
  }
};

/**
 * Trigger file input click
 */
const triggerFileInput = () => {
  document.getElementById(fileInputId.value)?.click();
};
</script>

<template>
  <div class="file-uploader">
    <label :for="fileInputId" class="file-uploader__label">
      {{ label }}
    </label>

    <div
      class="file-uploader__drop-zone"
      :class="{ 'drag-over': isDragOver, 'has-error': hasError }"
      data-testid="drop-zone"
      role="button"
      tabindex="0"
      :aria-label="`${label} - Drag and drop or click to upload`"
      @click="triggerFileInput"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @dragover="handleDragOver"
      @drop="handleDrop"
      @keydown.enter="triggerFileInput"
      @keydown.space.prevent="triggerFileInput"
    >
      <input
        :id="fileInputId"
        type="file"
        :accept="accept"
        class="file-uploader__input"
        @change="handleFileInputChange"
      />

      <div v-if="!hasFile" class="file-uploader__instructions">
        <svg
          class="file-uploader__icon"
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
        <p class="file-uploader__text">
          <span class="file-uploader__text--primary"
            >Drag and drop your file here</span
          >
          <span class="file-uploader__text--secondary">or click to browse</span>
        </p>
      </div>

      <div v-else class="file-uploader__file-info">
        <svg
          class="file-uploader__icon file-uploader__icon--success"
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
        <p class="file-uploader__filename">{{ selectedFile.name }}</p>
      </div>
    </div>

    <div
      v-if="hasError"
      class="file-uploader__error"
      data-testid="error-message"
      role="alert"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.file-uploader {
  width: 100%;
}

.file-uploader__label {
  display: block;
  margin-bottom: var(--spacing-sm, 0.5rem);
  font-weight: 600;
  color: var(--text-primary, #fff);
  font-size: 0.875rem;
}

.file-uploader__input {
  display: none;
}

.file-uploader__drop-zone {
  border: 2px dashed var(--border-color, rgba(255, 255, 255, 0.3));
  border-radius: var(--radius-md, 0.5rem);
  padding: var(--spacing-xl, 2rem);
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: var(--bg-secondary, rgba(255, 255, 255, 0.05));
}

.file-uploader__drop-zone:hover {
  border-color: var(--primary-color, #646cff);
  background-color: var(--bg-hover, rgba(100, 108, 255, 0.1));
}

.file-uploader__drop-zone:focus {
  outline: 2px solid var(--primary-color, #646cff);
  outline-offset: 2px;
}

.file-uploader__drop-zone.drag-over {
  border-color: var(--primary-color, #646cff);
  background-color: var(--bg-hover, rgba(100, 108, 255, 0.2));
  transform: scale(1.02);
}

.file-uploader__drop-zone.has-error {
  border-color: var(--error-color, #ef4444);
}

.file-uploader__instructions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md, 1rem);
}

.file-uploader__icon {
  width: 48px;
  height: 48px;
  color: var(--text-secondary, rgba(255, 255, 255, 0.6));
}

.file-uploader__icon--success {
  color: var(--success-color, #10b981);
}

.file-uploader__text {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs, 0.25rem);
  margin: 0;
}

.file-uploader__text--primary {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary, #fff);
}

.file-uploader__text--secondary {
  font-size: 0.875rem;
  color: var(--text-secondary, rgba(255, 255, 255, 0.6));
}

.file-uploader__file-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm, 0.5rem);
}

.file-uploader__filename {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary, #fff);
  word-break: break-all;
}

.file-uploader__error {
  margin-top: var(--spacing-sm, 0.5rem);
  padding: var(--spacing-sm, 0.5rem) var(--spacing-md, 1rem);
  background-color: var(--error-bg, rgba(239, 68, 68, 0.1));
  border: 1px solid var(--error-color, #ef4444);
  border-radius: var(--radius-sm, 0.25rem);
  color: var(--error-color, #ef4444);
  font-size: 0.875rem;
}
</style>
