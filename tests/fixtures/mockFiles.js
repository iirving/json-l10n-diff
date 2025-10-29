/**
 * Mock file data for testing comparison views
 * @module tests/fixtures/mockFiles
 *
 * Purpose: Centralized test fixtures for JSON file comparison tests
 * Usage: Import and use in component tests to ensure consistency
 */

/**
 * Basic mock file 1 - English locale
 * @type {Object}
 */
export const mockFile1 = {
  app: {
    title: 'My App',
    description: 'A test app',
  },
  nav: {
    home: 'Home',
  },
};

/**
 * Basic mock file 2 - French locale with additional key
 * @type {Object}
 */
export const mockFile2 = {
  app: {
    title: 'Mon App',
    description: 'Une app de test',
    welcome: 'Bienvenue',
  },
  nav: {
    home: 'Accueil',
  },
};

/**
 * Empty file for testing empty state
 * @type {Object}
 */
export const mockEmptyFile = {};

/**
 * Deep nested file structure for testing deeply nested comparisons
 * @type {Object}
 */
export const mockDeepNestedFile = {
  level1: {
    level2: {
      level3: {
        level4: {
          value: 'deep nested value',
          count: 42,
        },
      },
    },
  },
};

/**
 * File with array values for testing array comparison
 * @type {Object}
 */
export const mockFileWithArrays = {
  colors: ['red', 'green', 'blue'],
  numbers: [1, 2, 3],
  mixed: ['text', 123, true],
};

/**
 * File with different data types for comprehensive testing
 * @type {Object}
 */
export const mockFileWithMixedTypes = {
  string: 'text value',
  number: 42,
  boolean: true,
  nullValue: null,
  array: [1, 2, 3],
  object: { nested: 'value' },
};

/**
 * Large file structure for performance testing
 * @param {number} depth - Depth of nesting
 * @param {number} breadth - Number of keys at each level
 * @returns {Object} Generated large file structure
 */
export const generateLargeFile = (depth = 5, breadth = 10) => {
  const createLevel = (currentDepth) => {
    if (currentDepth === 0) {
      return 'leaf value';
    }

    const obj = {};
    for (let i = 0; i < breadth; i++) {
      obj[`key${i}`] = createLevel(currentDepth - 1);
    }
    return obj;
  };

  return createLevel(depth);
};

/**
 * File pair with structural differences for testing diff algorithm
 * @type {Object}
 */
export const mockFilePairWithDifferences = {
  file1: {
    common: 'same value',
    different: 'value1',
    onlyInFile1: 'unique to file 1',
    nested: {
      shared: 'shared',
      file1Only: 'only in 1',
    },
  },
  file2: {
    common: 'same value',
    different: 'value2',
    onlyInFile2: 'unique to file 2',
    nested: {
      shared: 'shared',
      file2Only: 'only in 2',
    },
  },
};

/**
 * Identical files for testing no-difference scenarios
 * @type {Object}
 */
export const mockIdenticalFile = {
  key1: 'value1',
  key2: 'value2',
  nested: {
    nestedKey: 'nestedValue',
  },
};
