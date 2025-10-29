import { t } from '@/i18n/index.js';
import { validateJson } from '@/utils/jsonValidator.js';
import { countKeys } from '@/utils/keyCounter.js';
import { sanitizeObjectKeys } from '@/utils/sanitize.js';

/**
 * Composable for parsing and validating JSON files
 * Provides methods to parse files, validate JSON, and extract error information
 * Includes input sanitization to prevent prototype pollution attacks
 *
 * @returns {Object} JSON parser methods
 */
export const useJsonParser = () => {
  /**
   * Parse a file and return its JSON content with sanitization
   *
   * @param {File} file - The file to parse
   * @returns {Promise<Object>} Parsed JSON object with metadata
   * @throws {Error} If file reading or parsing fails
   *
   * @example
   * const { parseFile } = useJsonParser();
   * const result = await parseFile(file);
   * // { data: {...}, keyCount: 10, isValid: true }
   */
  const parseFile = async (file) => {
    if (!file || !(file instanceof File)) {
      throw new Error(t('errors.invalidFile'));
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const content = event.target.result;
        const validation = validateJson(content);

        if (!validation.isValid) {
          const errorMessage = validation.line
            ? t('errors.jsonValidationFailedLine', {
                error: validation.error,
                line: validation.line,
              })
            : t('errors.jsonValidationFailed', { error: validation.error });

          reject(new Error(errorMessage));
          return;
        }

        try {
          const rawData = JSON.parse(content);

          // Sanitize object keys to prevent prototype pollution
          const data = sanitizeObjectKeys(rawData);

          const keyCount = countKeys(data);

          resolve({
            data,
            keyCount,
            isValid: true,
            fileName: file.name,
            fileSize: file.size,
          });
        } catch (error) {
          reject(
            new Error(t('errors.parseJsonFailed', { message: error.message }))
          );
        }
      };

      reader.onerror = () => {
        reject(new Error(t('errors.readFileFailed')));
      };

      reader.readAsText(file);
    });
  };

  /**
   * Validate a JSON string
   *
   * @param {string} jsonString - The JSON string to validate
   * @returns {Object} Validation result with isValid flag and optional error details
   *
   * @example
   * const { validateJsonString } = useJsonParser();
   * const result = validateJsonString('{"valid": "json"}');
   * // { isValid: true }
   */
  const validateJsonString = (jsonString) => {
    return validateJson(jsonString);
  };

  /**
   * Extract error line number from validation result
   *
   * @param {Object} validationResult - Result from validateJson
   * @returns {number|null} Line number where error occurred, or null
   *
   * @example
   * const { getErrorLine } = useJsonParser();
   * const validation = validateJson('invalid json');
   * const line = getErrorLine(validation); // Returns line number or null
   */
  const getErrorLine = (validationResult) => {
    if (!validationResult || validationResult.isValid) {
      return null;
    }
    return validationResult.line !== undefined && validationResult.line !== null
      ? validationResult.line
      : null;
  };

  return {
    parseFile,
    validateJsonString,
    getErrorLine,
  };
};
