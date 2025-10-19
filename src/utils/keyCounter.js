/**
 * Recursively counts all keys in a nested object including parent keys
 * Uses depth-first traversal to count every key at every level
 * 
 * @param {Object} obj - The object to count keys in
 * @returns {number} Total count of all keys including nested parent keys
 * 
 * @example
 * const obj = { app: { title: "My App", welcome: "Hello" } };
 * countKeys(obj); // Returns 3 (app, title, welcome)
 */
export const countKeys = (obj) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return 0;
  }

  const keys = Object.keys(obj);
  let count = keys.length;

  // Recursively count keys in nested objects
  for (const key of keys) {
    const value = obj[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      count += countKeys(value);
    }
  }

  return count;
};
