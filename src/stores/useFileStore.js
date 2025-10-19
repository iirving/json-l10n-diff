import { defineStore } from 'pinia';
import { useJsonDiff } from '@/composables/useJsonDiff.js';

/**
 * Pinia store for managing file state and comparison results
 * Handles file1, file2, and their comparison diff results
 */
export const useFileStore = defineStore('file', {
  state: () => ({
    /**
     * First file data and metadata
     * @type {Object|null}
     */
    file1: null,

    /**
     * Second file data and metadata
     * @type {Object|null}
     */
    file2: null,

    /**
     * Comparison results array
     * @type {Array<Object>|null}
     */
    diffResults: null,

    /**
     * Loading state
     * @type {boolean}
     */
    isLoading: false,

    /**
     * Error state
     * @type {string|null}
     */
    error: null,
  }),

  getters: {
    /**
     * Check if both files are loaded
     * @returns {boolean}
     */
    hasFiles: (state) => state.file1 !== null && state.file2 !== null,

    /**
     * Check if comparison has been run
     * @returns {boolean}
     */
    hasComparison: (state) => state.diffResults !== null,

    /**
     * Get total keys in file1
     * @returns {number}
     */
    file1KeyCount: (state) => (state.file1 ? state.file1.keyCount || 0 : 0),

    /**
     * Get total keys in file2
     * @returns {number}
     */
    file2KeyCount: (state) => (state.file2 ? state.file2.keyCount || 0 : 0),
  },

  actions: {
    /**
     * Set file1 data
     *
     * @param {Object} fileData - Parsed file data with metadata
     * @example
     * setFile1({ data: {...}, keyCount: 10, fileName: 'en.json' })
     */
    setFile1(fileData) {
      this.file1 = fileData;
      this.error = null;
      // Clear diff results when file changes
      this.diffResults = null;
    },

    /**
     * Set file2 data
     *
     * @param {Object} fileData - Parsed file data with metadata
     * @example
     * setFile2({ data: {...}, keyCount: 15, fileName: 'fr.json' })
     */
    setFile2(fileData) {
      this.file2 = fileData;
      this.error = null;
      // Clear diff results when file changes
      this.diffResults = null;
    },

    /**
     * Run comparison between file1 and file2
     * Uses useJsonDiff composable to generate diff results
     *
     * @returns {Array<Object>} Comparison results
     * @throws {Error} If files are not loaded
     */
    runComparison() {
      if (!this.file1 || !this.file2) {
        this.error = 'Both files must be loaded before running comparison';
        throw new Error(this.error);
      }

      try {
        this.isLoading = true;
        this.error = null;

        const { compareFiles } = useJsonDiff();
        this.diffResults = compareFiles(this.file1.data, this.file2.data);

        return this.diffResults;
      } catch (error) {
        this.error = error.message || 'Failed to run comparison';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Reset all state to initial values
     * Clears files, comparison results, and errors
     */
    reset() {
      this.file1 = null;
      this.file2 = null;
      this.diffResults = null;
      this.isLoading = false;
      this.error = null;
    },

    /**
     * Clear only comparison results
     * Keeps file data intact
     */
    clearComparison() {
      this.diffResults = null;
      this.error = null;
    },
  },
});
