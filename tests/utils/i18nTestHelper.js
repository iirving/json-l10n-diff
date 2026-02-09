/**
 * Helper utilities for i18n in tests
 * @module tests/utils/i18nTestHelper
 *
 * Purpose: Centralized i18n configuration for test environment
 * Usage: Import and use in component tests that require i18n
 */

import { createI18n } from 'vue-i18n';
import { mount } from '@vue/test-utils';

/**
 * Default English messages for testing
 * Covers all translation keys used in components
 * @type {Object}
 */
const defaultEnglishMessages = {
  app: {
    title: 'JSON l10n Diff Tool',
    subtitle: 'Side-by-side JSON comparison with unified tree view',
  },
  nav: {
    home: 'Home',
    about: 'About',
  },
  upload: {
    file1: 'Upload File 1',
    file2: 'Upload File 2',
    dragDrop: 'Drag & drop a JSON file here, or click to select',
    selectFile: 'Select JSON file',
    fileSelected: 'File selected',
    fileLoaded: '{fileName} ({size} KB, {count} keys)',
    keys: 'keys',
    error: 'Error loading file',
    maxSize: 'File size must be less than {size} MB',
    invalidJson: 'Invalid JSON file',
    parseError: 'Failed to parse JSON',
  },
  controls: {
    clearAll: 'Clear All',
    runComparison: 'Run Comparison',
    expandAll: 'Expand All',
    collapseAll: 'Collapse All',
  },
  legend: {
    title: 'Legend:',
    different: 'Different Values (Green)',
    missingRight: 'Missing in File 2 (Light Red)',
    missingLeft: 'Missing in File 1 / Temporary (Light Blue)',
    identical: 'Identical Values (Yellow)',
  },
  comparison: {
    emptyState: 'Upload two JSON files to compare',
    noResults: 'No comparison results yet',
  },
  instructions: {
    title: 'Features:',
    step1Title: 'Unified Tree Structure:',
    step1: "Uses File 1's keys as the primary structure",
    step2Title: 'Side-by-side Values:',
    step2: 'Shows values from both files for each key',
    step3Title: 'Color-coded Differences:',
    step3a: 'Green highlight = Different values',
    step3b: 'Light red = Missing in File 2',
    step3c: 'Light blue = Missing in File 1 (temporary keys)',
    step4Title: 'Add Missing Keys:',
    step4: 'Click "+ Add" button to add missing keys to either file',
    step5Title: 'Temporary Keys:',
    step5:
      'Keys that exist in File 2 but not in File 1 are shown with "(temp)" badge',
    step6Title: 'Expand/Collapse:',
    step6: 'Click arrows to expand/collapse nested objects',
    step7Title: 'Expand All / Collapse All:',
    step7: 'Buttons at the top for bulk operations',
  },
  diff: {
    different: 'Different',
    missing: 'Missing',
    identical: 'Identical',
    added: 'Added',
    addToFile1: 'Add to File 1',
    addToFile2: 'Add to File 2',
  },
  about: {
    title: 'About JSON l10n Diff Tool',
    description:
      'A powerful tool for comparing and analyzing differences between JSON localization files.',
    features: 'Features',
    feature1: 'Side-by-side comparison of JSON files',
    feature2: 'Visual highlighting of differences',
    feature3: 'Easy identification of missing keys',
    feature4: 'Support for nested JSON structures',
    version: 'Version',
    license: 'License',
    author: 'Author',
  },
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
  },
  editControls: {
    save: 'Save {fileName}',
    saveAriaLabel: 'Save changes to {fileName}',
    prettify: 'Prettify',
    prettifyAriaLabel: 'Format JSON with {spaces}-space indentation',
    reset: 'Reset',
    resetAriaLabel: 'Discard all changes and restore original file',
    unsavedChanges: 'You have unsaved changes',
  },
  actions: {
    addKeyToFile1: 'Add key "{keyPath}" to File 1 with value: {value}',
    addKeyToFile2: 'Add key "{keyPath}" to File 2 with value: {value}',
    addKeyButton: 'Add Key',
    addKeyAriaLabel: 'Add key {keyPath} to {target} file',
  },
  errors: {
    bothFilesRequired: 'Both files must be loaded before running comparison',
    invalidFile: 'Invalid file provided',
    jsonValidationFailed: 'JSON validation failed: {error}',
    jsonValidationFailedLine: 'JSON validation failed: {error} at line {line}',
    parseJsonFailed: 'Failed to parse JSON: {message}',
    readFileFailed: 'Failed to read file',
  },
  defaults: {
    file1: 'File 1',
    file2: 'File 2',
  },
};

/**
 * Creates a test i18n instance with default English messages
 * Configured for Composition API mode (legacy: false)
 *
 * @param {Object} options - Optional configuration
 * @param {string} options.locale - Initial locale (default: 'en')
 * @param {Object} options.messages - Additional or override messages
 * @returns {Object} i18n instance for testing
 *
 * @example
 * // Basic usage
 * const i18n = createTestI18n();
 *
 * @example
 * // With custom messages
 * const i18n = createTestI18n({
 *   messages: {
 *     en: {
 *       custom: {
 *         key: 'Custom value'
 *       }
 *     }
 *   }
 * });
 *
 * @example
 * // In a test file
 * import { createTestI18n } from '../utils/i18nTestHelper.js';
 *
 * const i18n = createTestI18n();
 *
 * const wrapper = mount(Component, {
 *   global: {
 *     plugins: [i18n],
 *   },
 * });
 */
export const createTestI18n = (options = {}) => {
  const { locale = 'en', messages = {} } = options;

  // Deep merge messages with defaults
  const mergedMessages = {
    en: {
      ...defaultEnglishMessages,
      ...(messages.en || {}),
    },
    ...(messages.fr && { fr: messages.fr }),
  };

  return createI18n({
    legacy: false, // Use Composition API mode
    locale,
    fallbackLocale: 'en',
    messages: mergedMessages,
    globalInjection: true,
  });
};

/**
 * Creates a minimal i18n instance with only specified keys
 * Useful for component-specific tests that don't need all translations
 *
 * @param {Object} messages - Message object { locale: { key: value } }
 * @returns {Object} Minimal i18n instance
 *
 * @example
 * const i18n = createMinimalI18n({
 *   en: {
 *     comparison: {
 *       emptyState: 'Upload files',
 *     }
 *   }
 * });
 */
export const createMinimalI18n = (messages = {}) => {
  return createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en: {},
      ...messages,
    },
    globalInjection: true,
  });
};

/**
 * Helper to mount a component with i18n plugin
 * Wraps Vue Test Utils mount with automatic i18n setup
 *
 * @param {Object} component - Vue component to mount
 * @param {Object} options - Mount options
 * @returns {Object} Wrapper instance
 *
 * @example
 * import { mountWithI18n } from '../utils/i18nTestHelper.js';
 *
 * const wrapper = mountWithI18n(MyComponent, {
 *   props: { someProp: 'value' }
 * });
 */
export const mountWithI18n = (component, options = {}) => {
  const i18n = createTestI18n();

  return mount(component, {
    global: {
      plugins: [i18n],
      ...(options.global || {}),
    },
    ...options,
  });
};

/**
 * Gets a specific translation from the default messages
 * Useful for test assertions
 *
 * @param {string} keyPath - Dot notation path to translation key
 * @returns {string|undefined} Translation value
 *
 * @example
 * expect(wrapper.text()).toContain(getTranslation('comparison.emptyState'));
 */
export const getTranslation = (keyPath) => {
  const keys = keyPath.split('.');
  let value = defaultEnglishMessages;

  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) break;
  }

  return value;
};

/**
 * Export default messages for direct access if needed
 */
export { defaultEnglishMessages };
