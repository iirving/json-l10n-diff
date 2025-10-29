/**
 * Vue i18n Configuration
 *
 * Sets up internationalization for the application
 * with English and French translations
 */

import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import fr from './locales/fr.json';

// Get saved locale from localStorage or default to 'en'
const savedLocale = localStorage.getItem('locale') || 'en';

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

export default i18n;
