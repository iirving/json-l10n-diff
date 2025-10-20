/**
 * File Upload Constants
 *
 * Purpose: Centralized constants for file upload functionality
 */

import { BYTES_PER_MB } from '@/utils/fileSize.js';

/**
 * Maximum allowed file size in bytes
 * @constant {number}
 */
export const MAX_FILE_SIZE = 1 * BYTES_PER_MB; // 1MB in bytes

/**
 * Maximum allowed file size in MB (for display purposes)
 * @constant {number}
 */
export const MAX_FILE_SIZE_MB = 1;

/**
 * Allowed file types for upload
 * @constant {string}
 */
export const ALLOWED_FILE_TYPES = '.json';
