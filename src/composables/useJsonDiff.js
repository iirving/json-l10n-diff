import {
  MISSING_LEFT,
  MISSING_RIGHT,
  IDENTICAL,
  DIFFERENT,
} from '@/constants/diffStatus.js';

/** Sentinel status for circular reference detection */
export const CIRCULAR = 'circular';

/**
 * Composable for comparing two JSON objects and generating diff results
 * Provides methods to compare files and return comparison results
 *
 * @returns {{ compareFiles: Function }} JSON diff methods
 */
export const useJsonDiff = () => {
  /**
   * Whether a value can participate in reference cycles.
   * Arrays are included because they are objects and can self-reference.
   * @param {*} value
   * @returns {boolean}
   */
  const isTrackableRef = (value) => {
    return value !== null && typeof value === 'object';
  };

  /**
   * Internal recursive comparison with ancestor tracking for circular
   * reference detection and array index-based recursion.
   *
   * @param {*} o1 - Left-side value
   * @param {*} o2 - Right-side value
   * @param {string} path - Dot-notation key path at this level
   * @param {Set} seen - Set of ancestor object references for cycle detection
   * @returns {Array<Object>} Flat array of comparison result objects
   */
  const _compare = (o1, o2, path, seen) => {
    // --- Circular reference detection ---
    const isTrackable1 = isTrackableRef(o1);
    const isTrackable2 = isTrackableRef(o2);

    if (isTrackable1 && seen.has(o1)) {
      return [
        {
          keyPath: path || '(root)',
          status: CIRCULAR,
          leftValue: '[Circular Reference]',
          rightValue: o2,
          error: 'Circular reference detected in left value',
        },
      ];
    }
    if (isTrackable2 && seen.has(o2)) {
      return [
        {
          keyPath: path || '(root)',
          status: CIRCULAR,
          leftValue: o1,
          rightValue: '[Circular Reference]',
          error: 'Circular reference detected in right value',
        },
      ];
    }

    // Build the ancestor set for the next recursion level
    const nextSeen = new Set(seen);
    if (isTrackable1) nextSeen.add(o1);
    if (isTrackable2) nextSeen.add(o2);

    const results = [];
    const keys1 = new Set(o1 ? Object.keys(o1) : []);
    const keys2 = new Set(o2 ? Object.keys(o2) : []);
    const allKeys = new Set([...keys1, ...keys2]);

    for (const key of allKeys) {
      const keyPath = path ? `${path}.${key}` : key;
      const value1 = o1?.[key];
      const value2 = o2?.[key];

      // Check for circular references in child values before anything else
      const v1IsObj =
        value1 !== null && typeof value1 === 'object' && !Array.isArray(value1);
      const v2IsObj =
        value2 !== null && typeof value2 === 'object' && !Array.isArray(value2);
      const v1IsTrackable = isTrackableRef(value1);
      const v2IsTrackable = isTrackableRef(value2);

      if (v1IsTrackable && nextSeen.has(value1)) {
        results.push({
          keyPath,
          status: CIRCULAR,
          leftValue: '[Circular Reference]',
          rightValue: value2,
          error: 'Circular reference detected in left value',
        });
        continue;
      }
      if (v2IsTrackable && nextSeen.has(value2)) {
        results.push({
          keyPath,
          status: CIRCULAR,
          leftValue: value1,
          rightValue: '[Circular Reference]',
          error: 'Circular reference detected in right value',
        });
        continue;
      }

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

      // Both values are plain objects - recurse (with cycle check)
      if (v1IsObj && v2IsObj) {
        results.push(..._compare(value1, value2, keyPath, nextSeen));
        continue;
      }

      // Both values are arrays - recurse with index-based keys
      if (Array.isArray(value1) && Array.isArray(value2)) {
        const arraySeen = new Set(nextSeen);
        arraySeen.add(value1);
        arraySeen.add(value2);

        const maxLen = Math.max(value1.length, value2.length);
        for (let i = 0; i < maxLen; i++) {
          const indexPath = `${keyPath}.${i}`;
          const elem1 = i < value1.length ? value1[i] : undefined;
          const elem2 = i < value2.length ? value2[i] : undefined;

          if (isTrackableRef(elem1) && arraySeen.has(elem1)) {
            results.push({
              keyPath: indexPath,
              status: CIRCULAR,
              leftValue: '[Circular Reference]',
              rightValue: elem2,
              error: 'Circular reference detected in left value',
            });
            continue;
          }
          if (isTrackableRef(elem2) && arraySeen.has(elem2)) {
            results.push({
              keyPath: indexPath,
              status: CIRCULAR,
              leftValue: elem1,
              rightValue: '[Circular Reference]',
              error: 'Circular reference detected in right value',
            });
            continue;
          }

          if (i >= value1.length) {
            results.push({
              keyPath: indexPath,
              status: MISSING_LEFT,
              leftValue: undefined,
              rightValue: elem2,
            });
          } else if (i >= value2.length) {
            results.push({
              keyPath: indexPath,
              status: MISSING_RIGHT,
              leftValue: elem1,
              rightValue: undefined,
            });
          } else {
            const elemIsObj =
              elem1 !== null &&
              typeof elem1 === 'object' &&
              elem2 !== null &&
              typeof elem2 === 'object';
            if (elemIsObj) {
              results.push(..._compare(elem1, elem2, indexPath, arraySeen));
            } else if (JSON.stringify(elem1) === JSON.stringify(elem2)) {
              results.push({
                keyPath: indexPath,
                status: IDENTICAL,
                leftValue: elem1,
                rightValue: elem2,
              });
            } else {
              results.push({
                keyPath: indexPath,
                status: DIFFERENT,
                leftValue: elem1,
                rightValue: elem2,
              });
            }
          }
        }
        continue;
      }

      // Compare primitive / mixed-type values
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

  /**
   * Compare two JSON objects and return diff results.
   * Uses a recursive algorithm that:
   * - Detects circular references and returns a `circular` status entry
   * - Recurses into plain objects (dot-notation key paths)
   * - Recurses into arrays using numeric index keys (e.g. `items.0`)
   *
   * @param {Object|null|undefined} obj1 - Left (first) JSON object
   * @param {Object|null|undefined} obj2 - Right (second) JSON object
   * @param {string} [parentPath=''] - Dot-notation prefix (used internally)
   * @returns {Array<{keyPath: string, status: string, leftValue: *, rightValue: *}>}
   *   Flat array of comparison results, one entry per leaf key
   *
   * @example
   * const { compareFiles } = useJsonDiff();
   * const results = compareFiles(
   *   { app: { title: 'App1' } },
   *   { app: { title: 'App2', welcome: 'Hello' } }
   * );
   * // [
   * //   { keyPath: 'app.title', status: 'different', ... },
   * //   { keyPath: 'app.welcome', status: 'missing-left', ... },
   * // ]
   */
  const compareFiles = (obj1, obj2, parentPath = '') => {
    return _compare(obj1, obj2, parentPath, new Set());
  };

  return {
    compareFiles,
  };
};
