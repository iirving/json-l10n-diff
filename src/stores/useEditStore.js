import { defineStore } from 'pinia';
import { ref, computed, shallowRef } from 'vue';
import { setValueByPath } from '@/utils/keyPathUtils.js';

/**
 * Pinia store for managing edit operations and modified states
 * Tracks edit history and modified JSON data for both files
 * Uses Composition API setup syntax for better consistency and flexibility
 */
export const useEditStore = defineStore('edit', () => {
  // ==========================================
  // State
  // ==========================================

  /**
   * Map of edit operations by file and keyPath
   * Structure: { file1: { 'app.title': {...}, ... }, file2: {...} }
   * Using ref for Map to maintain reactivity
   * @type {import('vue').Ref<Map<string, Map<string, Object>>>}
   */
  const editHistory = ref(
    new Map([
      ['file1', new Map()],
      ['file2', new Map()],
    ])
  );

  /**
   * Modified version of file1 data (null if no edits)
   * Using shallowRef for large objects to optimize performance
   * @type {import('vue').ShallowRef<Object|null>}
   */
  const file1Modified = shallowRef(null);

  /**
   * Modified version of file2 data (null if no edits)
   * Using shallowRef for large objects to optimize performance
   * @type {import('vue').ShallowRef<Object|null>}
   */
  const file2Modified = shallowRef(null);

  // ==========================================
  // Getters (Computed)
  // ==========================================

  /**
   * Check if file1 has any modifications
   * @returns {boolean}
   */
  const hasFile1Edits = computed(
    () => editHistory.value.get('file1')?.size > 0
  );

  /**
   * Check if file2 has any modifications
   * @returns {boolean}
   */
  const hasFile2Edits = computed(
    () => editHistory.value.get('file2')?.size > 0
  );

  /**
   * Check if any file has modifications
   * @returns {boolean}
   */
  const hasAnyEdits = computed(
    () =>
      editHistory.value.get('file1')?.size > 0 ||
      editHistory.value.get('file2')?.size > 0
  );

  /**
   * Get all edits for a specific file
   * @param {string} fileKey - 'file1' or 'file2'
   * @returns {Map<string, Object>}
   */
  const getFileEdits = (fileKey) => {
    return editHistory.value.get(fileKey) || new Map();
  };

  /**
   * Get a specific edit by file and keyPath
   * @param {string} fileKey - 'file1' or 'file2'
   * @param {string} keyPath - Dot-notation key path
   * @returns {Object|undefined}
   */
  const getEdit = (fileKey, keyPath) => {
    return editHistory.value.get(fileKey)?.get(keyPath);
  };

  // ==========================================
  // Actions (Functions)
  // ==========================================

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
  function addEdit(fileKey, keyPath, newValue, editType = 'modify') {
    if (!['file1', 'file2'].includes(fileKey)) {
      throw new Error(
        `Invalid fileKey: ${fileKey}. Must be 'file1' or 'file2'`
      );
    }

    const fileEdits = editHistory.value.get(fileKey);
    fileEdits.set(keyPath, {
      keyPath,
      newValue,
      editType,
      timestamp: Date.now(),
    });
  }

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
  function applyEdit(fileKey, originalData) {
    if (!['file1', 'file2'].includes(fileKey)) {
      throw new Error(
        `Invalid fileKey: ${fileKey}. Must be 'file1' or 'file2'`
      );
    }

    // Create a deep copy of original data
    const modifiedData = JSON.parse(JSON.stringify(originalData));

    // Apply all edits for this file
    const fileEdits = editHistory.value.get(fileKey);
    for (const [keyPath, edit] of fileEdits.entries()) {
      setValueByPath(modifiedData, keyPath, edit.newValue);
    }

    // Store the modified data
    if (fileKey === 'file1') {
      file1Modified.value = modifiedData;
    } else {
      file2Modified.value = modifiedData;
    }

    return modifiedData;
  }

  /**
   * Clear all edits for a specific file
   *
   * @param {string} fileKey - 'file1' or 'file2'
   *
   * @example
   * clearEdits('file1')
   */
  function clearEdits(fileKey) {
    if (!['file1', 'file2'].includes(fileKey)) {
      throw new Error(
        `Invalid fileKey: ${fileKey}. Must be 'file1' or 'file2'`
      );
    }

    editHistory.value.get(fileKey)?.clear();

    if (fileKey === 'file1') {
      file1Modified.value = null;
    } else {
      file2Modified.value = null;
    }
  }

  /**
   * Clear all edits for all files
   * Resets edit history and modified states
   */
  function clearAllEdits() {
    editHistory.value.get('file1')?.clear();
    editHistory.value.get('file2')?.clear();
    file1Modified.value = null;
    file2Modified.value = null;
  }

  /**
   * Get the current data for a file (modified if exists, original otherwise)
   *
   * @param {string} fileKey - 'file1' or 'file2'
   * @param {Object} originalData - Original file data
   * @returns {Object} Current file data (modified or original)
   */
  function getCurrentData(fileKey, originalData) {
    if (fileKey === 'file1') {
      return file1Modified.value || originalData;
    } else if (fileKey === 'file2') {
      return file2Modified.value || originalData;
    }
    return originalData;
  }

  // ==========================================
  // Return public API
  // ==========================================

  return {
    // State
    editHistory,
    file1Modified,
    file2Modified,

    // Getters
    hasFile1Edits,
    hasFile2Edits,
    hasAnyEdits,
    getFileEdits,
    getEdit,

    // Actions
    addEdit,
    applyEdit,
    clearEdits,
    clearAllEdits,
    getCurrentData,
  };
});
