import { defineStore } from 'pinia';
import { ref, computed, shallowRef } from 'vue';
import { t } from '@/i18n/index.js';
import { useJsonDiff } from '@/composables/useJsonDiff.js';

/**
 * Pinia store for managing file state and comparison results
 * Handles file1, file2, and their comparison diff results
 * Uses Composition API setup syntax for better consistency and flexibility
 */
export const useFileStore = defineStore('file', () => {
  // ==========================================
  // State
  // ==========================================

  /**
   * First file data and metadata
   * Using shallowRef for large objects to optimize performance
   * @type {import('vue').ShallowRef<Object|null>}
   */
  const file1 = shallowRef(null);

  /**
   * Second file data and metadata
   * Using shallowRef for large objects to optimize performance
   * @type {import('vue').ShallowRef<Object|null>}
   */
  const file2 = shallowRef(null);

  /**
   * Comparison results array
   * Using shallowRef for large arrays to optimize performance
   * @type {import('vue').ShallowRef<Array<Object>|null>}
   */
  const diffResults = shallowRef(null);

  /**
   * Loading state
   * @type {import('vue').Ref<boolean>}
   */
  const isLoading = ref(false);

  /**
   * Error state
   * @type {import('vue').Ref<string|null>}
   */
  const error = ref(null);

  // ==========================================
  // Getters (Computed)
  // ==========================================

  /**
   * Check if both files are loaded
   * @returns {boolean}
   */
  const hasFiles = computed(() => file1.value !== null && file2.value !== null);

  /**
   * Check if comparison has been run
   * @returns {boolean}
   */
  const hasComparison = computed(() => diffResults.value !== null);

  /**
   * Get total keys in file1
   * @returns {number}
   */
  const file1KeyCount = computed(() =>
    file1.value ? file1.value.keyCount || 0 : 0
  );

  /**
   * Get total keys in file2
   * @returns {number}
   */
  const file2KeyCount = computed(() =>
    file2.value ? file2.value.keyCount || 0 : 0
  );

  // ==========================================
  // Actions (Functions)
  // ==========================================

  /**
   * Set file1 data
   *
   * @param {Object} fileData - Parsed file data with metadata
   * @example
   * setFile1({ data: {...}, keyCount: 10, fileName: 'en.json' })
   */
  function setFile1(fileData) {
    file1.value = fileData;
    error.value = null;
    // Clear diff results when file changes
    diffResults.value = null;
  }

  /**
   * Set file2 data
   *
   * @param {Object} fileData - Parsed file data with metadata
   * @example
   * setFile2({ data: {...}, keyCount: 15, fileName: 'fr.json' })
   */
  function setFile2(fileData) {
    file2.value = fileData;
    error.value = null;
    // Clear diff results when file changes
    diffResults.value = null;
  }

  /**
   * Run comparison between file1 and file2
   * Uses useJsonDiff composable to generate diff results
   *
   * @returns {Array<Object>} Comparison results
   * @throws {Error} If files are not loaded
   */
  function runComparison() {
    if (!file1.value || !file2.value) {
      error.value = t('errors.bothFilesRequired');
      throw new Error(error.value);
    }

    try {
      isLoading.value = true;
      error.value = null;

      const { compareFiles } = useJsonDiff();
      diffResults.value = compareFiles(file1.value.data, file2.value.data);

      return diffResults.value;
    } catch (err) {
      error.value = err.message || 'Failed to run comparison';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Reset all state to initial values
   * Clears files, comparison results, and errors
   */
  function reset() {
    file1.value = null;
    file2.value = null;
    diffResults.value = null;
    isLoading.value = false;
    error.value = null;
  }

  /**
   * Clear only comparison results
   * Keeps file data intact
   */
  function clearComparison() {
    diffResults.value = null;
    error.value = null;
  }

  // ==========================================
  // Return public API
  // ==========================================

  return {
    // State
    file1,
    file2,
    diffResults,
    isLoading,
    error,

    // Getters
    hasFiles,
    hasComparison,
    file1KeyCount,
    file2KeyCount,

    // Actions
    setFile1,
    setFile2,
    runComparison,
    reset,
    clearComparison,
  };
});
