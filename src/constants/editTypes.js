/**
 * Constants for edit operation types
 * Used to track different kinds of modifications in the edit store
 *
 * @module constants/editTypes
 */

/**
 * Value was modified/updated
 * @type {string}
 */
export const EDIT_TYPE_MODIFY = 'modify';

/**
 * Key was added from the other file
 * @type {string}
 */
export const EDIT_TYPE_ADD = 'add';

/**
 * Key was removed/deleted
 * @type {string}
 */
export const EDIT_TYPE_DELETE = 'delete';

/**
 * Array of all valid edit types
 * Used for validation and prop validators
 * @type {readonly string[]}
 */
export const EDIT_TYPES = Object.freeze([
  EDIT_TYPE_MODIFY,
  EDIT_TYPE_ADD,
  EDIT_TYPE_DELETE,
]);

/**
 * Check if a value is a valid edit type
 * @param {string} editType - The edit type to validate
 * @returns {boolean} True if the edit type is valid
 */
export const isValidEditType = (editType) => EDIT_TYPES.includes(editType);
