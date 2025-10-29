<script setup>
/**
 * LanguageSwitcher.vue
 *
 * Dropdown component to switch between available languages
 */

import { useI18n } from 'vue-i18n';

const { locale, availableLocales } = useI18n();

const languages = {
  en: 'English',
  fr: 'Français',
};

const switchLanguage = (lang) => {
  locale.value = lang;
  // Save to localStorage
  localStorage.setItem('locale', lang);
};
</script>

<template>
  <div class="language-switcher">
    <select
      :value="locale"
      class="language-select"
      @change="switchLanguage($event.target.value)"
    >
      <option v-for="lang in availableLocales" :key="lang" :value="lang">
        {{ languages[lang] }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.language-switcher {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.language-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-sm);
  background: var(--bg-primary);
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.language-select:hover {
  border-color: var(--color-primary);
}

.language-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--bg-primary-faded);
}
</style>
