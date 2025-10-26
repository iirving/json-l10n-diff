/**
 * Composable for formatting values for display in the UI
 * Provides consistent formatting across TreeNode and DualTreeNode components
 *
 * @module composables/useValueFormatter
 */

/**
 * Format a value for display in the tree viewer
 * Handles null, undefined, strings, arrays, objects, and primitives
 *
 * @param {*} value - The value to format
 * @returns {string} The formatted value as a string
 *
 * @example
 * formatValue(null) // returns 'null'
 * formatValue(undefined) // returns '—'
 * formatValue('hello') // returns '"hello"'
 * formatValue([1, 2, 3]) // returns '[1,2,3]'
 * formatValue({ a: 1 }) // returns '{...}'
 * formatValue(42) // returns '42'
 * formatValue(true) // returns 'true'
 */
export const formatValue = (value) => {
  if (value === null) return 'null';
  if (value === undefined) return '—';
  if (typeof value === 'string') return `"${value}"`;
  if (Array.isArray(value)) return JSON.stringify(value);
  if (typeof value === 'object') return '{...}';
  return String(value);
};

/**
 * Get truncated value for display with ellipsis
 * Useful for long strings or arrays
 *
 * @param {*} value - The value to truncate
 * @param {number} maxLength - Maximum length before truncation (default: 50)
 * @returns {string} The truncated formatted value
 *
 * @example
 * truncateValue('This is a very long string that needs truncating', 20)
 * // returns '"This is a very lon..."'
 */
export const truncateValue = (value, maxLength = 50) => {
  const formatted = formatValue(value);
  if (formatted.length <= maxLength) return formatted;
  return formatted.substring(0, maxLength - 3) + '...';
};

/**
 * Composable hook for value formatting
 * Returns formatting utilities
 *
 * @returns {Object} Object containing formatValue and truncateValue functions
 *
 * @example
 * const { formatValue, truncateValue } = useValueFormatter();
 * const displayValue = formatValue(node.value);
 */
export const useValueFormatter = () => {
  return {
    formatValue,
    truncateValue,
  };
};
