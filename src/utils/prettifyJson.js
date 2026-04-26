/**
 * Format JSON with 2-space indentation
 * @param {string|object} json - The JSON string or object to format
 * @returns {string} Formatted JSON with 2-space indentation
 */
export function prettifyJson(json) {
  if (typeof json === 'string') {
    try {
      const parsed = JSON.parse(json);
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Invalid JSON provided for formatting: ${errorMessage}`);
    }
  }

  return JSON.stringify(json, null, 2);
}
