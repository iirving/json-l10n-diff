/**
 * Input sanitization utilities
 * Provides functions to sanitize user inputs and prevent security issues
 *
 * @module utils/sanitize
 */

/**
 * Maximum length for file names to prevent overflow attacks
 */
const MAX_FILENAME_LENGTH = 255;

/**
 * Maximum length for key paths to prevent memory issues
 */
const MAX_KEYPATH_LENGTH = 1000;

/**
 * Sanitize file name to remove potentially dangerous characters
 * Prevents path traversal and command injection
 *
 * @param {string} filename - Original file name
 * @returns {string} Sanitized file name
 *
 * @example
 * sanitizeFileName('../../etc/passwd') // returns '_.._.._.._etc_passwd'
 * sanitizeFileName('test<script>.json') // returns 'test_script_.json'
 * sanitizeFileName('my file (1).json') // returns 'my_file__1_.json'
 */
export function sanitizeFileName(filename) {
  if (!filename || typeof filename !== 'string') {
    return 'untitled';
  }

  // Remove or replace dangerous characters
  let sanitized = filename
    // Handle path traversal patterns first
    .replace(/\.\./g, '_.')
    // Remove path separators
    .replace(/[/\\]/g, '_')
    // Remove leading dots after separators
    .replace(/^\.+/g, '_')
    // Remove null bytes
    .replace(/\0/g, '')
    // Replace special characters that could cause issues
    .replace(/[<>:"|?*]/g, '_')
    // Replace parentheses and brackets
    .replace(/[()[\]{}]/g, '_')
    // Remove control characters
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Collapse multiple underscores
    .replace(/_+/g, '_')
    // Trim underscores from start and end
    .replace(/^_+|_+$/g, '');

  // Truncate to maximum length
  if (sanitized.length > MAX_FILENAME_LENGTH) {
    sanitized = sanitized.substring(0, MAX_FILENAME_LENGTH);
  }

  // Ensure we have a valid filename
  return sanitized || 'untitled';
}

/**
 * Sanitize key path to prevent path traversal attacks
 * Ensures key paths are safe for nested object access
 *
 * @param {string} keyPath - Dot-notation key path
 * @returns {string} Sanitized key path
 *
 * @example
 * sanitizeKeyPath('app.title') // returns 'app.title'
 * sanitizeKeyPath('app..title') // returns 'app.title'
 * sanitizeKeyPath('__proto__.polluted') // returns 'proto.polluted'
 * sanitizeKeyPath('constructor.prototype') // returns 'constructor.prototype'
 */
export function sanitizeKeyPath(keyPath) {
  if (!keyPath || typeof keyPath !== 'string') {
    return '';
  }

  let sanitized = keyPath
    // Remove leading/trailing dots
    .replace(/^\.+|\.+$/g, '')
    // Collapse multiple dots
    .replace(/\.{2,}/g, '.')
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove control characters
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Remove spaces around dots
    .replace(/\s*\.\s*/g, '.')
    // Trim whitespace
    .trim();

  // Remove dangerous property names that could lead to prototype pollution
  const dangerousPatterns = [/^__proto__$/i, /^prototype$/i, /^constructor$/i];

  sanitized = sanitized
    .split('.')
    .filter((segment) => {
      // Remove empty segments
      if (!segment) return false;

      // Check for dangerous patterns
      return !dangerousPatterns.some((pattern) => pattern.test(segment));
    })
    .join('.');

  // Truncate to maximum length
  if (sanitized.length > MAX_KEYPATH_LENGTH) {
    sanitized = sanitized.substring(0, MAX_KEYPATH_LENGTH);
  }

  return sanitized;
}

/**
 * Sanitize JSON string content to remove potentially dangerous patterns
 * Helps prevent XSS and code injection when displaying JSON content
 *
 * @param {string} str - JSON string or any string content
 * @returns {string} Sanitized string
 *
 * @example
 * sanitizeJSONString('<script>alert("xss")</script>') // returns '&lt;script&gt;alert("xss")&lt;/script&gt;'
 * sanitizeJSONString('normal text') // returns 'normal text'
 */
export function sanitizeJSONString(str) {
  if (!str || typeof str !== 'string') {
    return '';
  }

  return (
    str
      // Remove null bytes
      .replace(/\0/g, '')
      // Remove event handlers
      .replace(/on\w+\s*=/gi, '')
      // Remove javascript: protocol
      .replace(/javascript:/gi, '')
      // Remove data: protocol (can be used for XSS)
      .replace(/data:text\/html/gi, '')
      // HTML encode dangerous characters (do this last to avoid double-encoding)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  );
}

/**
 * Validate and sanitize file size
 * Ensures file size is within acceptable limits
 *
 * @param {number} size - File size in bytes
 * @param {number} maxSize - Maximum allowed size in bytes (default: 10MB)
 * @returns {Object} Validation result with sanitized size
 * @returns {boolean} returns.valid - Whether size is valid
 * @returns {number} returns.size - Sanitized size
 * @returns {string} returns.error - Error message if invalid
 *
 * @example
 * sanitizeFileSize(1024) // { valid: true, size: 1024 }
 * sanitizeFileSize(99999999) // { valid: false, size: 0, error: 'File too large' }
 */
export function sanitizeFileSize(size, maxSize = 10 * 1024 * 1024) {
  // Ensure size is a number
  const numSize = Number(size);

  if (isNaN(numSize) || numSize < 0) {
    return {
      valid: false,
      size: 0,
      error: 'Invalid file size',
    };
  }

  if (numSize > maxSize) {
    return {
      valid: false,
      size: 0,
      error: `File too large (max: ${Math.round(maxSize / 1024 / 1024)}MB)`,
    };
  }

  return {
    valid: true,
    size: numSize,
  };
}

/**
 * Sanitize object keys recursively
 * Removes potentially dangerous keys from nested objects
 *
 * @param {Object} obj - Object to sanitize
 * @param {number} maxDepth - Maximum nesting depth (default: 100)
 * @returns {Object} Sanitized object
 *
 * @example
 * sanitizeObjectKeys({ app: { title: 'Test' } })
 * // returns { app: { title: 'Test' } }
 *
 * sanitizeObjectKeys({ __proto__: { polluted: true } })
 * // returns {} (dangerous keys removed)
 */
export function sanitizeObjectKeys(obj, maxDepth = 100) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  if (maxDepth <= 0) {
    console.warn('Maximum object depth exceeded during sanitization');
    return {};
  }

  const sanitized = {};
  const dangerousKeys = ['__proto__', 'prototype', 'constructor'];

  for (const key in obj) {
    // Skip prototype chain properties
    if (!Object.prototype.hasOwnProperty.call(obj, key)) {
      continue;
    }

    // Skip dangerous keys
    if (dangerousKeys.includes(key)) {
      console.warn(`Removed dangerous key: ${key}`);
      continue;
    }

    // Sanitize the key
    const sanitizedKey = sanitizeKeyPath(key);
    if (!sanitizedKey) {
      continue;
    }

    // Recursively sanitize nested objects
    const value = obj[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[sanitizedKey] = sanitizeObjectKeys(value, maxDepth - 1);
    } else {
      sanitized[sanitizedKey] = value;
    }
  }

  return sanitized;
}

/**
 * Sanitize locale code
 * Ensures locale codes follow standard format (e.g., 'en', 'fr', 'en-US')
 *
 * @param {string} locale - Locale code
 * @returns {string} Sanitized locale code or 'en' as fallback
 *
 * @example
 * sanitizeLocale('en') // returns 'en'
 * sanitizeLocale('en-US') // returns 'en-US'
 * sanitizeLocale('<script>') // returns 'en'
 * sanitizeLocale('../../etc') // returns 'en'
 */
export function sanitizeLocale(locale) {
  if (!locale || typeof locale !== 'string') {
    return 'en';
  }

  // Only allow alphanumeric and hyphens
  const sanitized = locale.replace(/[^a-zA-Z0-9-]/g, '');

  // Validate format (2-3 letter language code, optional region)
  const localePattern = /^[a-z]{2,3}(-[A-Z]{2})?$/i;

  if (localePattern.test(sanitized)) {
    return sanitized;
  }

  return 'en';
}

/**
 * Sanitize URL to prevent open redirect vulnerabilities
 * Only allows relative URLs and trusted domains
 *
 * @param {string} url - URL to sanitize
 * @param {string[]} trustedDomains - List of trusted domains (optional)
 * @returns {string} Sanitized URL or '#' if invalid
 *
 * @example
 * sanitizeURL('/about') // returns '/about'
 * sanitizeURL('https://example.com') // returns '#'
 * sanitizeURL('javascript:alert(1)') // returns '#'
 */
export function sanitizeURL(url, trustedDomains = []) {
  if (!url || typeof url !== 'string') {
    return '#';
  }

  const trimmed = url.trim();

  // Block javascript: and data: protocols
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return '#';
  }

  // Allow relative URLs
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  // Allow anchor links
  if (trimmed.startsWith('#')) {
    return trimmed;
  }

  // Check trusted domains for absolute URLs
  if (trustedDomains.length > 0) {
    try {
      const urlObj = new URL(trimmed);
      if (trustedDomains.includes(urlObj.hostname)) {
        return trimmed;
      }
    } catch {
      // Invalid URL
      return '#';
    }
  }

  // Default to safe anchor
  return '#';
}

/**
 * Escape HTML entities in a string
 * Prevents XSS by encoding special HTML characters
 *
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 *
 * @example
 * escapeHTML('<div>Hello</div>') // returns '&lt;div&gt;Hello&lt;/div&gt;'
 */
export function escapeHTML(str) {
  if (!str || typeof str !== 'string') {
    return '';
  }

  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return str.replace(/[&<>"'/]/g, (match) => htmlEntities[match]);
}

/**
 * Check if a string contains only safe characters
 * Useful for validating identifiers, variable names, etc.
 *
 * @param {string} str - String to check
 * @returns {boolean} True if string is safe
 *
 * @example
 * isSafeString('myVariable123') // returns true
 * isSafeString('my-variable') // returns true
 * isSafeString('<script>') // returns false
 */
export function isSafeString(str) {
  if (!str || typeof str !== 'string') {
    return false;
  }

  // Only allow alphanumeric, hyphens, underscores, and dots
  return /^[a-zA-Z0-9._-]+$/.test(str);
}
