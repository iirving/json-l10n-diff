<script setup>
/**
 * FileUploader Component
 *
 * Purpose: Handle file upload via drag-and-drop or file input
 * Features:
 * - File input with drag-and-drop support
 * - Size validation (≤10MB)
 * - Input sanitization for security
 * - Emit file-loaded/file-error events
 * - Visual feedback for drag state and errors
 * - Internationalization support
 */

import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useJsonParser } from '@/composables/useJsonParser.js';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_MB } from '@/constants/fileUpload.js';
import { bytesToMB, bytesToKB } from '@/utils/fileSize.js';
import { sanitizeFileName, sanitizeFileSize } from '@/utils/sanitize.js';

// i18n
const { t } = useI18n();

// eslint-disable-next-line no-unused-vars
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

// JSON Parser
const { parseFile } = useJsonParser();

/**
 * Generate a unique file input ID
 * @returns {string} - Unique ID string
 */
const generateFileInputId = () => {
  return `file-input-${Math.random().toString(36).substring(2, 11)}`;
};

// State
const selectedFile = ref(null);
const parsedData = ref(null);
const errorMessage = ref('');
const errorType = ref(''); // 'size', 'parse', or ''
const fileInputId = ref(generateFileInputId());
const isValidating = ref(false);

// Computed
const hasError = computed(() => !!errorMessage.value);
const hasFile = computed(() => !!selectedFile.value && !hasError.value);
const hasNoError = computed(
  () => !hasFile.value && !isValidating.value && !hasError.value
);

// Computed for file info display
const fileSizeKB = computed(() => {
  if (!parsedData.value) return 0;
  return bytesToKB(parsedData.value.fileSize, 1);
});

const keyCount = computed(() => {
  if (!parsedData.value) return 0;
  return parsedData.value.keyCount || 0;
});

/**
 * Validate file size with sanitization
 * @param {File} file - File to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const validateFileSize = (file) => {
  // Sanitize and validate file size
  const sizeValidation = sanitizeFileSize(file.size, MAX_FILE_SIZE);

  if (!sizeValidation.valid) {
    const fileSizeMB = bytesToMB(file.size);
    errorMessage.value = `File size (${fileSizeMB}MB) exceeds the maximum allowed size of ${MAX_FILE_SIZE_MB}MB`;
    errorType.value = 'size';
    emit('file-error', { type: 'size', message: errorMessage.value, file });
    return false;
  }
  return true;
};

/**
 * Handle file selection/upload with input sanitization
 * @param {File} file - Selected file
 */
const handleFile = async (file) => {
  if (!file) return;

  // Clear previous error
  errorMessage.value = '';
  errorType.value = '';
  selectedFile.value = file;

  // Validate file size
  if (!validateFileSize(file)) {
    selectedFile.value = null;
    return;
  }

  // Validate and parse JSON
  isValidating.value = true;
  try {
    const data = await parseFile(file);
    // Sanitize file name for security after successful parsing
    data.fileName = sanitizeFileName(data.fileName);
    // File is valid
    parsedData.value = data;
    errorMessage.value = '';
    errorType.value = '';
    emit('file-loaded', data);
  } catch (error) {
    // JSON parsing/validation error
    errorMessage.value = error.message;
    errorType.value = 'parse';
    emit('file-error', { type: 'parse', message: error.message, file });
  } finally {
    isValidating.value = false;
  }
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
 * Trigger file input click
 */
const triggerFileInput = () => {
  document.getElementById(fileInputId.value)?.click();
};

/**
 * Reset the uploader to initial state
 * Clears file, parsed data, and errors
 */
const reset = () => {
  selectedFile.value = null;
  parsedData.value = null;
  errorMessage.value = '';
  errorType.value = '';
  isValidating.value = false;

  // Reset the file input
  const fileInput = document.getElementById(fileInputId.value);
  if (fileInput) {
    fileInput.value = '';
  }
};

// Expose reset method to parent components
defineExpose({
  reset,
});
</script>

<template>
  <div class="file-uploader">
    <input
      :id="fileInputId"
      type="file"
      :accept="accept"
      class="file-uploader__input"
      @change="handleFileInputChange"
    />

    <button
      type="button"
      class="file-uploader__button"
      :class="{ 'has-error': hasError, 'has-file': hasFile && !hasError }"
      @click="triggerFileInput"
    >
      <svg
        v-if="hasNoError"
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

      <svg
        v-else-if="hasError"
        class="file-uploader__icon file-uploader__icon--error"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      <svg
        v-else-if="isValidating"
        class="file-uploader__icon file-uploader__icon--spinner"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>

      <svg
        v-else
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

      <span v-if="hasNoError" class="file-uploader__text">
        {{ label }}
      </span>
      <span v-else-if="hasError" class="file-uploader__text">
        <span class="file-uploader__error-type">
          {{
            errorType === 'size' ? t('upload.error') : t('upload.parseError')
          }}
        </span>
        <span class="file-uploader__error-message">{{ errorMessage }}</span>
      </span>
      <span v-else-if="isValidating" class="file-uploader__text">
        {{ t('common.loading') }}
      </span>
      <span v-else class="file-uploader__text">
        <span class="file-uploader__filename">{{ selectedFile.name }}</span>
        <span class="file-uploader__details"
          >{{ keyCount }} {{ t('upload.keys') }} • {{ fileSizeKB }} KB</span
        >
      </span>
    </button>
  </div>
</template>

<style scoped>
.file-uploader {
  width: 100%;
}

.file-uploader__input {
  display: none;
}

.file-uploader__button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm, 0.5rem);
  width: 100%;
  padding: var(--spacing-md, 1rem);
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-md, 0.5rem);
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
  color: #000;
}

.file-uploader__button:hover {
  border-color: var(--primary-color, #646cff);
  background-color: rgba(100, 108, 255, 0.05);
}

.file-uploader__button:focus {
  outline: 2px solid var(--primary-color, #646cff);
  outline-offset: 2px;
}

.file-uploader__button.has-file {
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.file-uploader__button.has-error {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.file-uploader__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: rgba(0, 0, 0, 0.6);
}

.file-uploader__icon--success {
  color: var(--success-color, #10b981);
}

.file-uploader__icon--spinner {
  color: var(--primary-color, #646cff);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.file-uploader__text {
  flex: 1;
  text-align: left;
  color: #000;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.file-uploader__filename {
  font-weight: 500;
  color: var(--success-color, #10b981);
}

.file-uploader__icon--success {
  color: var(--success-color, #10b981);
}

.file-uploader__icon--error {
  color: var(--error-color, #ef4444);
}

.file-uploader__icon--spinner {
  color: var(--primary-color, #646cff);
  animation: spin 1s linear infinite;
}

.file-uploader__details {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 400;
}

.file-uploader__error-type {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--error-color, #ef4444);
}

.file-uploader__error-message {
  font-size: 0.75rem;
  color: var(--error-color, #ef4444);
  font-weight: 400;
  line-height: 1.4;
}
</style>
