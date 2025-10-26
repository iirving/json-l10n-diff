/**
 * File Size Utilities
 *
 * Purpose: Utilities for file size calculations and formatting
 */

/**
 * Bytes per kilobyte constant
 * @constant {number}
 */
export const BYTES_PER_KB = 1024;

/**
 * Bytes per megabyte constant
 * @constant {number}
 */
export const BYTES_PER_MB = 1024 * 1024;

/**
 * Format file size in bytes to human-readable format
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted size string (e.g., "1.25 KB", "3.50 MB")
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  if (bytes < BYTES_PER_KB) return `${bytes} Bytes`;
  if (bytes < BYTES_PER_MB)
    return `${(bytes / BYTES_PER_KB).toFixed(decimals)} KB`;
  return `${(bytes / BYTES_PER_MB).toFixed(decimals)} MB`;
};

/**
 * Convert bytes to kilobytes
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {number} Size in kilobytes
 */
export const bytesToKB = (bytes, decimals = 2) => {
  return Number((bytes / BYTES_PER_KB).toFixed(decimals));
};

/**
 * Convert bytes to megabytes
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {number} Size in megabytes
 */
export const bytesToMB = (bytes, decimals = 2) => {
  return Number((bytes / BYTES_PER_MB).toFixed(decimals));
};
