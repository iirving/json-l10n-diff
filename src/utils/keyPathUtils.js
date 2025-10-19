/**
 * Builds a dot-notation path from an array of keys
 *
 * @param {string[]} keys - Array of keys to join
 * @returns {string} Dot-notation path
 *
 * @example
 * buildPath(['app', 'title']); // 'app.title'
 * buildPath(['user', 'profile', 'name']); // 'user.profile.name'
 */
export const buildPath = (keys) => {
  if (!Array.isArray(keys)) {
    return '';
  }
  return keys
    .filter((key) => key !== null && key !== undefined && key !== '')
    .join('.');
};

/**
 * Splits a dot-notation path into an array of keys
 *
 * @param {string} path - Dot-notation path to split
 * @returns {string[]} Array of keys
 *
 * @example
 * splitPath('app.title'); // ['app', 'title']
 * splitPath('user.profile.name'); // ['user', 'profile', 'name']
 */
export const splitPath = (path) => {
  if (!path || typeof path !== 'string') {
    return [];
  }
  return path.split('.').filter((key) => key !== '');
};

/**
 * Navigates to a value in a nested object using a dot-notation path
 *
 * @param {Object} obj - The object to navigate
 * @param {string} path - Dot-notation path to the value
 * @returns {*} The value at the path, or undefined if not found
 *
 * @example
 * const obj = { app: { title: 'My App' } };
 * getValueByPath(obj, 'app.title'); // 'My App'
 * getValueByPath(obj, 'app.missing'); // undefined
 */
export const getValueByPath = (obj, path) => {
  if (!obj || typeof obj !== 'object') {
    return undefined;
  }

  const keys = splitPath(path);

  // Return undefined for empty path instead of the entire object
  if (keys.length === 0) {
    return undefined;
  }

  return keys.reduce((current, key) => {
    if (current && typeof current === 'object') {
      return current[key];
    }
    return undefined;
  }, obj);
};

/**
 * Sets a value in a nested object using a dot-notation path
 * Creates intermediate objects if they don't exist
 *
 * @param {Object} obj - The object to modify
 * @param {string} path - Dot-notation path where to set the value
 * @param {*} value - The value to set
 * @returns {Object} The modified object
 *
 * @example
 * const obj = {};
 * setValueByPath(obj, 'app.title', 'My App'); // { app: { title: 'My App' } }
 */
export const setValueByPath = (obj, path, value) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const keys = splitPath(path);
  if (keys.length === 0) {
    return obj;
  }

  keys.reduce((current, key, index) => {
    if (index === keys.length - 1) {
      current[key] = value;
    } else {
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
    }
    return current[key];
  }, obj);

  return obj;
};
