/**
 * Validates JSON string and extracts error details
 *
 * @param {string} jsonString - The JSON string to validate
 * @returns {Object} Validation result with isValid flag and optional error details
 *
 * @example
 * validateJson('{"valid": "json"}'); // { isValid: true }
 * validateJson('{"invalid": }'); // { isValid: false, error: '...', line: 1 }
 */
export const validateJson = (jsonString) => {
  if (!jsonString || typeof jsonString !== 'string') {
    return {
      isValid: false,
      error: 'Input must be a non-empty string',
      line: null,
    };
  }

  try {
    JSON.parse(jsonString);
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: error.message,
      line: extractErrorLine(error.message),
    };
  }
};

/**
 * Extracts line number from JSON parse error message
 * Handles various error message formats from different browsers
 *
 * @param {string} errorMessage - The error message from JSON.parse
 * @returns {number|null} The line number where the error occurred, or null if not found
 *
 * @example
 * extractErrorLine('Unexpected token } in JSON at position 12'); // null
 * extractErrorLine('JSON.parse: unexpected character at line 3'); // 3
 */
const extractErrorLine = (errorMessage) => {
  if (!errorMessage) {
    return null;
  }

  // Pattern 1: "at line X" or "line X"
  const lineMatch = errorMessage.match(/line\s+(\d+)/i);
  if (lineMatch) {
    return parseInt(lineMatch[1], 10);
  }

  // Pattern 2: Calculate line from position in string
  // This is a fallback for browsers that only report position
  const positionMatch = errorMessage.match(/position\s+(\d+)/i);
  if (positionMatch) {
    // Note: This would require the original string to calculate line
    // For now, return null as we can't determine line from position alone
    return null;
  }

  return null;
};
