import {
  MISSING_LEFT,
  MISSING_RIGHT,
  IDENTICAL,
  DIFFERENT,
} from '@/constants/diffStatus.js';

/**
 * Composable for comparing two JSON objects and generating diff results
 * Provides methods to compare files and return comparison results
 *
 * @returns {Object} JSON diff methods
 */
export const useJsonDiff = () => {
  /**
   * Compare two JSON objects and return diff results
   * Uses recursive algorithm to traverse nested structures
   *
   * @param {Object} obj1 - First JSON object
   * @param {Object} obj2 - Second JSON object
   * @param {string} parentPath - Parent key path (for recursion)
   * @returns {Array<Object>} Array of comparison results
   *
   * @example
   * const { compareFiles } = useJsonDiff();
   * const results = compareFiles(
   *   { app: { title: 'App1' } },
   *   { app: { title: 'App2', welcome: 'Hello' } }
   * );
   * // Returns array with status for each key
   */
  const compareFiles = (obj1, obj2, parentPath = '') => {
    const results = [];
    const keys1 = new Set(obj1 ? Object.keys(obj1) : []);
    const keys2 = new Set(obj2 ? Object.keys(obj2) : []);
    const allKeys = new Set([...keys1, ...keys2]);

    for (const key of allKeys) {
      const keyPath = parentPath ? `${parentPath}.${key}` : key;
      const value1 = obj1?.[key];
      const value2 = obj2?.[key];

      // Key missing in left file
      if (!keys1.has(key)) {
        results.push({
          keyPath,
          status: MISSING_LEFT,
          leftValue: undefined,
          rightValue: value2,
        });
        continue;
      }

      // Key missing in right file
      if (!keys2.has(key)) {
        results.push({
          keyPath,
          status: MISSING_RIGHT,
          leftValue: value1,
          rightValue: undefined,
        });
        continue;
      }

      // Both values are objects - recurse
      if (
        value1 &&
        typeof value1 === 'object' &&
        !Array.isArray(value1) &&
        value2 &&
        typeof value2 === 'object' &&
        !Array.isArray(value2)
      ) {
        const nestedResults = compareFiles(value1, value2, keyPath);
        results.push(...nestedResults);
        continue;
      }

      // Compare values
      if (JSON.stringify(value1) === JSON.stringify(value2)) {
        results.push({
          keyPath,
          status: IDENTICAL,
          leftValue: value1,
          rightValue: value2,
        });
      } else {
        results.push({
          keyPath,
          status: DIFFERENT,
          leftValue: value1,
          rightValue: value2,
        });
      }
    }

    return results;
  };

  return {
    compareFiles,
  };
};
