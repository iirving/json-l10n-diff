/**
 * Constants for JSON diff comparison statuses
 * Used to classify differences between two JSON files
 *
 * @module constants/diffStatus
 */

/**
 * Key exists only in the left file (File 1)
 * @type {string}
 */
export const MISSING_LEFT = 'missing-left';

/**
 * Key exists only in the right file (File 2)
 * @type {string}
 */
export const MISSING_RIGHT = 'missing-right';

/**
 * Key exists in both files with identical values
 * @type {string}
 */
export const IDENTICAL = 'identical';

/**
 * Key exists in both files with different values
 * @type {string}
 */
export const DIFFERENT = 'different';

/**
 * Array of all valid diff status values
 * Used for validation and prop validators
 * @type {readonly string[]}
 */
export const DIFF_STATUSES = Object.freeze([
  MISSING_LEFT,
  MISSING_RIGHT,
  IDENTICAL,
  DIFFERENT,
]);

/**
 * Check if a value is a valid diff status
 * @param {string} status - The status to validate
 * @returns {boolean} True if the status is valid
 */
export const isValidDiffStatus = (status) => DIFF_STATUSES.includes(status);
