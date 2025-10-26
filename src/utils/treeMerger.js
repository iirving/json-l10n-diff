/**
 * Tree Merger Utility
 *
 * Purpose: Merge two JSON objects into a unified tree structure
 * that contains all keys from both files with their respective values
 */

/**
 * Merge two JSON objects into a unified tree structure
 * @param {object} file1 - First JSON object
 * @param {object} file2 - Second JSON object
 * @param {Array} diffResults - Diff results for color coding
 * @returns {Array} Array of unified tree nodes
 */
export function mergeJsonTrees(file1 = {}, file2 = {}, diffResults = []) {
  const allKeys = new Set([...Object.keys(file1), ...Object.keys(file2)]);

  const nodes = [];

  allKeys.forEach((key) => {
    const value1 = file1[key];
    const value2 = file2[key];
    const hasValue1 = key in file1;
    const hasValue2 = key in file2;

    // Determine if values are objects (nested)
    const isObject1 =
      hasValue1 &&
      typeof value1 === 'object' &&
      value1 !== null &&
      !Array.isArray(value1);
    const isObject2 =
      hasValue2 &&
      typeof value2 === 'object' &&
      value2 !== null &&
      !Array.isArray(value2);

    const node = {
      key,
      keyPath: key,
      value1: hasValue1 ? value1 : null,
      value2: hasValue2 ? value2 : null,
      hasValue1,
      hasValue2,
      isObject: isObject1 || isObject2,
      status: getNodeStatus(hasValue1, hasValue2, value1, value2),
      children: [],
    };

    // Recursively merge children if either value is an object
    if (isObject1 || isObject2) {
      const childDiffResults = diffResults
        .filter((diff) => {
          return diff.keyPath.startsWith(key + '.');
        })
        .map((diff) => ({
          ...diff,
          keyPath: diff.keyPath.substring(key.length + 1),
        }));

      node.children = mergeJsonTrees(
        isObject1 ? value1 : {},
        isObject2 ? value2 : {},
        childDiffResults
      );

      // Update keyPath for children
      node.children.forEach((child) => {
        child.keyPath = `${key}.${child.keyPath}`;
      });
    }

    nodes.push(node);
  });

  return nodes.sort((a, b) => a.key.localeCompare(b.key));
}

/**
 * Determine the status of a node based on values
 * @param {boolean} hasValue1 - Whether key exists in file1
 * @param {boolean} hasValue2 - Whether key exists in file2
 * @param {*} value1 - Value from file1
 * @param {*} value2 - Value from file2
 * @returns {string} Status: 'missing-left', 'missing-right', 'identical', 'different'
 */
function getNodeStatus(hasValue1, hasValue2, value1, value2) {
  if (!hasValue1 && hasValue2) return 'missing-left';
  if (hasValue1 && !hasValue2) return 'missing-right';

  // For objects, we don't compare them directly
  const isObject1 =
    typeof value1 === 'object' && value1 !== null && !Array.isArray(value1);
  const isObject2 =
    typeof value2 === 'object' && value2 !== null && !Array.isArray(value2);

  if (isObject1 || isObject2) {
    return 'neutral'; // Parent nodes are neutral
  }

  // Deep equality check for primitive values and arrays
  if (JSON.stringify(value1) === JSON.stringify(value2)) {
    return 'identical';
  }

  return 'different';
}
