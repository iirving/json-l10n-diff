/**
 * Vitest global setup file
 * Provides missing browser APIs for jsdom test environment
 */

// Mock localStorage if not properly available (fixes @vue/devtools-kit issue)
let hasLocalStorage = false;

try {
  hasLocalStorage =
    typeof globalThis.localStorage !== 'undefined' &&
    typeof globalThis.localStorage.getItem === 'function';
} catch (error) {
  // jsdom with opaque origin can throw a SecurityError when accessing localStorage
  if (!error || error.name !== 'SecurityError') {
    throw error;
  }
}

if (!hasLocalStorage) {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
    get length() {
      return store.size;
    },
    key: (index) => [...store.keys()][index] ?? null,
  };
}
