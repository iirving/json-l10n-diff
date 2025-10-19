import { defineStore } from 'pinia';
import { setValueByPath } from '@/utils/keyPathUtils.js';

/**
 * Pinia store for managing edit operations and modified states
 * Tracks edit history and modified JSON data for both files
 */
export const useEditStore = defineStore('edit', {
  state: () => ({
    /**
     * Map of edit operations by file and keyPath
     * Structure: { file1: { 'app.title': {...}, ... }, file2: {...} }
     * @type {Map<string, Map<string, Object>>}
     */
    editHistory: new Map([
      ['file1', new Map()],
      ['file2', new Map()],
    ]),

    /**
     * Modified version of file1 data (null if no edits)
     * @type {Object|null}
     */
    file1Modified: null,

    /**
     * Modified version of file2 data (null if no edits)
     * @type {Object|null}
     */
    file2Modified: null,
  }),

  getters: {
    /**
     * Check if file1 has any modifications
     * @returns {boolean}
     */
    hasFile1Edits: (state) => state.editHistory.get('file1')?.size > 0,

    /**
     * Check if file2 has any modifications
     * @returns {boolean}
     */
    hasFile2Edits: (state) => state.editHistory.get('file2')?.size > 0,

    /**
     * Check if any file has modifications
     * @returns {boolean}
     */
    hasAnyEdits: (state) =>
      state.editHistory.get('file1')?.size > 0 ||
      state.editHistory.get('file2')?.size > 0,

    /**
     * Get all edits for a specific file
     * @param {string} fileKey - 'file1' or 'file2'
     * @returns {Map<string, Object>}
     */
    getFileEdits: (state) => (fileKey) => {
      return state.editHistory.get(fileKey) || new Map();
    },

    /**
     * Get a specific edit by file and keyPath
     * @param {string} fileKey - 'file1' or 'file2'
     * @param {string} keyPath - Dot-notation key path
     * @returns {Object|undefined}
     */
    getEdit: (state) => (fileKey, keyPath) => {
      return state.editHistory.get(fileKey)?.get(keyPath);
    },
  },

  actions: {
    /**
     * Add an edit to the history
     *
     * @param {string} fileKey - 'file1' or 'file2'
     * @param {string} keyPath - Dot-notation path to the key
     * @param {*} newValue - New value for the key
     * @param {string} editType - Type of edit: 'modify' or 'add'
     *
     * @example
     * addEdit('file1', 'app.title', 'New Title', 'modify')
     */
    addEdit(fileKey, keyPath, newValue, editType = 'modify') {
      if (!['file1', 'file2'].includes(fileKey)) {
        throw new Error(
          `Invalid fileKey: ${fileKey}. Must be 'file1' or 'file2'`
        );
      }

      const fileEdits = this.editHistory.get(fileKey);
      fileEdits.set(keyPath, {
        keyPath,
        newValue,
        editType,
        timestamp: Date.now(),
      });
    },

    /**
     * Apply all edits to a file's data and update the modified state
     *
     * @param {string} fileKey - 'file1' or 'file2'
     * @param {Object} originalData - Original file data to apply edits to
     * @returns {Object} Modified file data with all edits applied
     *
     * @example
     * const modified = applyEdit('file1', originalFileData)
     */
    applyEdit(fileKey, originalData) {
      if (!['file1', 'file2'].includes(fileKey)) {
        throw new Error(
          `Invalid fileKey: ${fileKey}. Must be 'file1' or 'file2'`
        );
      }

      // Create a deep copy of original data
      const modifiedData = JSON.parse(JSON.stringify(originalData));

      // Apply all edits for this file
      const fileEdits = this.editHistory.get(fileKey);
      for (const [keyPath, edit] of fileEdits.entries()) {
        setValueByPath(modifiedData, keyPath, edit.newValue);
      }

      // Store the modified data
      if (fileKey === 'file1') {
        this.file1Modified = modifiedData;
      } else {
        this.file2Modified = modifiedData;
      }

      return modifiedData;
    },

    /**
     * Clear all edits for a specific file
     *
     * @param {string} fileKey - 'file1' or 'file2'
     *
     * @example
     * clearEdits('file1')
     */
    clearEdits(fileKey) {
      if (!['file1', 'file2'].includes(fileKey)) {
        throw new Error(
          `Invalid fileKey: ${fileKey}. Must be 'file1' or 'file2'`
        );
      }

      this.editHistory.get(fileKey)?.clear();

      if (fileKey === 'file1') {
        this.file1Modified = null;
      } else {
        this.file2Modified = null;
      }
    },

    /**
     * Clear all edits for all files
     * Resets edit history and modified states
     */
    clearAllEdits() {
      this.editHistory.get('file1')?.clear();
      this.editHistory.get('file2')?.clear();
      this.file1Modified = null;
      this.file2Modified = null;
    },

    /**
     * Get the current data for a file (modified if exists, original otherwise)
     *
     * @param {string} fileKey - 'file1' or 'file2'
     * @param {Object} originalData - Original file data
     * @returns {Object} Current file data (modified or original)
     */
    getCurrentData(fileKey, originalData) {
      if (fileKey === 'file1') {
        return this.file1Modified || originalData;
      } else if (fileKey === 'file2') {
        return this.file2Modified || originalData;
      }
      return originalData;
    },
  },
});
