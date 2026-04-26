/**
 * Format JSON with 2-space indentation
 * @param {string|object} json - The JSON string or object to format
 * @returns {string} Formatted JSON with 2-space indentation
 * @throws {Error} If the input is an invalid JSON string or cannot be
 *   serialized to JSON (e.g., circular references, BigInt, undefined,
 *   functions, or symbols)
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

  let result;
  try {
    result = JSON.stringify(json, null, 2);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON provided for formatting: ${errorMessage}`);
  }

  if (result === undefined) {
    throw new Error(
      'Invalid JSON provided for formatting: value cannot be serialized to JSON'
    );
  }

  return result;
}
