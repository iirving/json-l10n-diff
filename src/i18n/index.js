/**
 * Vue i18n Configuration
 *
 * Sets up internationalization for the application
 * with English and French translations
 */

import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import fr from './locales/fr.json';
import { sanitizeLocale } from '@/utils/sanitize';

// Get saved locale from localStorage or default to 'en'
const savedLocale = sanitizeLocale(localStorage.getItem('locale') || 'en');

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    fr,
  },
  globalInjection: true, // Enable global $t() and $tc()
});

/**
 * Helper function to get translations outside of components
 * @param {string} key - Translation key
 * @param {Object} params - Optional parameters for interpolation
 * @returns {string} Translated string
 */
export const t = (key, params) => {
  return i18n.global.t(key, params);
};

export default i18n;
