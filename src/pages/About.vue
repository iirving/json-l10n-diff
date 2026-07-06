<script setup>
/**
 * About.vue - Static Information Page
 *
 * Purpose: Provide information about the tool, features, and how it works
 * Content:
 * - Feature overview
 * - How it works
 * - Technical details
 * - Privacy & security information
 */

import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const featureCards = [
  {
    icon: '📤',
    titleKey: 'about.featureCards.uploadCompare.title',
    descriptionKey: 'about.featureCards.uploadCompare.description',
  },
  {
    icon: '🌳',
    titleKey: 'about.featureCards.visualTree.title',
    descriptionKey: 'about.featureCards.visualTree.description',
  },
  {
    icon: '🎨',
    titleKey: 'about.featureCards.smartDiff.title',
    descriptionKey: 'about.featureCards.smartDiff.description',
  },
  {
    icon: '✏️',
    titleKey: 'about.featureCards.inlineEditing.title',
    descriptionKey: 'about.featureCards.inlineEditing.description',
  },
  {
    icon: '➕',
    titleKey: 'about.featureCards.addMissingKeys.title',
    descriptionKey: 'about.featureCards.addMissingKeys.description',
  },
  {
    icon: '💾',
    titleKey: 'about.featureCards.saveDownload.title',
    descriptionKey: 'about.featureCards.saveDownload.description',
  },
  {
    icon: '🎨',
    titleKey: 'about.featureCards.jsonPrettify.title',
    descriptionKey: 'about.featureCards.jsonPrettify.description',
  },
  {
    icon: '🔒',
    titleKey: 'about.featureCards.privacyFirst.title',
    descriptionKey: 'about.featureCards.privacyFirst.description',
  },
];

const steps = [
  {
    number: 1,
    titleKey: 'about.steps.upload.title',
    descriptionKey: 'about.steps.upload.description',
  },
  {
    number: 2,
    titleKey: 'about.steps.parse.title',
    descriptionKey: 'about.steps.parse.description',
  },
  {
    number: 3,
    titleKey: 'about.steps.compare.title',
    descriptionKey: 'about.steps.compare.description',
  },
  {
    number: 4,
    titleKey: 'about.steps.edit.title',
    descriptionKey: 'about.steps.edit.description',
  },
  {
    number: 5,
    titleKey: 'about.steps.export.title',
    descriptionKey: 'about.steps.export.description',
  },
];

const techItems = [
  {
    labelKey: 'about.tech.framework.label',
    valueKey: 'about.tech.framework.value',
  },
  {
    labelKey: 'about.tech.buildTool.label',
    valueKey: 'about.tech.buildTool.value',
  },
  {
    labelKey: 'about.tech.stateManagement.label',
    valueKey: 'about.tech.stateManagement.value',
  },
  {
    labelKey: 'about.tech.language.label',
    valueKey: 'about.tech.language.value',
  },
  {
    labelKey: 'about.tech.fileSizeLimit.label',
    valueKey: 'about.tech.fileSizeLimit.value',
  },
  {
    labelKey: 'about.tech.supportedFormat.label',
    valueKey: 'about.tech.supportedFormat.value',
  },
];

const privacyItems = [
  {
    titleKey: 'about.privacy.clientSide.title',
    descriptionKey: 'about.privacy.clientSide.description',
  },
  {
    titleKey: 'about.privacy.noServerUploads.title',
    descriptionKey: 'about.privacy.noServerUploads.description',
  },
  {
    titleKey: 'about.privacy.noTracking.title',
    descriptionKey: 'about.privacy.noTracking.description',
  },
];

const useCases = [
  {
    titleKey: 'about.useCases.missingTranslations.title',
    descriptionKey: 'about.useCases.missingTranslations.description',
    exampleLinesKey: 'about.useCases.missingTranslations.exampleLines',
  },
  {
    titleKey: 'about.useCases.untranslatedPlaceholders.title',
    descriptionKey: 'about.useCases.untranslatedPlaceholders.description',
    exampleLinesKey: 'about.useCases.untranslatedPlaceholders.exampleLines',
  },
  {
    titleKey: 'about.useCases.teamSynchronization.title',
    descriptionKey: 'about.useCases.teamSynchronization.description',
    exampleLinesKey: 'about.useCases.teamSynchronization.exampleLines',
  },
];
</script>

<template>
  <div class="about-page">
    <header class="page-header">
      <h1>{{ t('about.title') }}</h1>
      <p class="subtitle">{{ t('about.subtitle') }}</p>
    </header>

    <main class="page-content">
      <!-- Features Section -->
      <section class="content-section">
        <h2>✨ {{ t('about.sections.features') }}</h2>
        <div class="feature-grid">
          <div
            v-for="feature in featureCards"
            :key="feature.titleKey"
            class="feature-card"
          >
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3>{{ t(feature.titleKey) }}</h3>
            <p>{{ t(feature.descriptionKey) }}</p>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="content-section">
        <h2>💡 {{ t('about.sections.howItWorks') }}</h2>
        <div class="steps-container">
          <div v-for="step in steps" :key="step.titleKey" class="step">
            <div class="step-number">{{ step.number }}</div>
            <div class="step-content">
              <h3>{{ t(step.titleKey) }}</h3>
              <p>{{ t(step.descriptionKey) }}</p>
            </div>
          </div>
        </div>
        <p class="highlight-box">
          {{ t('about.steps.highlight') }}
        </p>
      </section>

      <!-- Technical Details Section -->
      <section class="content-section">
        <h2>🛠️ {{ t('about.sections.technicalDetails') }}</h2>
        <div class="tech-grid">
          <div v-for="item in techItems" :key="item.labelKey" class="tech-item">
            <h4>{{ t(item.labelKey) }}</h4>
            <p>{{ t(item.valueKey) }}</p>
          </div>
        </div>
      </section>

      <!-- Privacy & Security Section -->
      <section class="content-section">
        <h2>🔒 {{ t('about.sections.privacySecurity') }}</h2>
        <div class="privacy-list">
          <div
            v-for="item in privacyItems"
            :key="item.titleKey"
            class="privacy-item"
          >
            <span class="check-icon">✓</span>
            <div>
              <h4>{{ t(item.titleKey) }}</h4>
              <p>{{ t(item.descriptionKey) }}</p>
            </div>
          </div>

          <div class="privacy-item">
            <span class="check-icon">✓</span>
            <div>
              <h4>{{ t('about.privacy.openSource.title') }}</h4>
              <p>
                {{ t('about.privacy.openSource.descriptionPrefix') }}
                <a
                  href="https://github.com/iirving/json-l10n-diff"
                  target="_blank"
                  rel="noopener noreferrer"
                  >{{ t('about.privacy.openSource.linkLabel') }}</a
                >
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Use Cases Section -->
      <section class="content-section">
        <h2>📝 {{ t('about.sections.useCases') }}</h2>
        <div
          v-for="useCase in useCases"
          :key="useCase.titleKey"
          class="use-case"
        >
          <h3>{{ t(useCase.titleKey) }}</h3>
          <p>{{ t(useCase.descriptionKey) }}</p>
          <div class="example-box">
            <code>{{ t(useCase.exampleLinesKey) }}</code>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.about-page {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.page-header {
  padding: var(--spacing-xl) var(--spacing-lg);
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(
    135deg,
    rgba(100, 108, 255, 0.1) 0%,
    rgba(139, 92, 246, 0.1) 100%
  );
}

.page-header h1 {
  margin: 0;
  font-size: 2.5rem;
}

.subtitle {
  margin: var(--spacing-sm) 0 0 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.125rem;
}

.page-content {
  flex: 1;
  padding: var(--spacing-xl) var(--spacing-lg);
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.content-section {
  margin-bottom: var(--spacing-xl);
}

.content-section h2 {
  font-size: 2rem;
  margin-bottom: var(--spacing-lg);
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: var(--spacing-sm);
}

/* Feature Grid */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.feature-card {
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition:
    transform 0.2s,
    border-color 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-primary);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-sm);
}

.feature-card h3 {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: 1.25rem;
}

.feature-card p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Steps Container */
.steps-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.step {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.step-number {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, #8b5cf6 100%);
  border-radius: 50%;
  font-weight: 600;
  font-size: 1.25rem;
}

.step-content h3 {
  margin: 0 0 var(--spacing-xs) 0;
}

.step-content p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
}

.highlight-box {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background-color: rgba(100, 108, 255, 0.1);
  border: 1px solid rgba(100, 108, 255, 0.3);
  text-align: center;
  font-weight: 500;
}

/* Tech Grid */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.tech-item {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tech-item h4 {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--color-primary);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tech-item p {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
}

/* Privacy List */
.privacy-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.privacy-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.check-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-success);
  border-radius: 50%;
  font-weight: 600;
  color: white;
}

.privacy-item h4 {
  margin: 0 0 var(--spacing-xs) 0;
}

.privacy-item p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
}

.privacy-item a {
  color: var(--color-primary);
  text-decoration: underline;
}

.privacy-item a:hover {
  color: #8b5cf6;
}

/* Use Cases */
.use-case {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.use-case h3 {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-primary);
}

.use-case p {
  margin: 0 0 var(--spacing-md) 0;
  color: rgba(255, 255, 255, 0.8);
}

.example-box {
  padding: var(--spacing-md);
  border-radius: var(--radius-sm);
  background-color: rgba(0, 0, 0, 0.4);
  border-left: 3px solid var(--color-primary);
}

.example-box code {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  white-space: pre-line;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .content-section h2 {
    font-size: 1.5rem;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .tech-grid {
    grid-template-columns: 1fr;
  }

  .page-content {
    padding: var(--spacing-lg) var(--spacing-md);
  }
}
</style>
