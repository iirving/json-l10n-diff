<script setup>
/**
 * Index.vue - Main Application Page
 *
 * Purpose: Main page for JSON i18n comparison tool
 * Features (to be implemented):
 * - Two FileUploader instances (for file1 and file2)
 * - ComparisonView component
 * - Integration with Pinia stores (useFileStore, useTierStore, useEditStore)
 * - Wire up file-loaded handlers to trigger comparison
 * - Handle edit events and save operations
 */

import { ref } from "vue";
import FileUploader from "../components/FileUploader.vue";
import ComparisonView from "../components/ComparisonView.vue";
import EditControls from "../components/EditControls.vue";

// Placeholder state - will be replaced with Pinia stores in Phase 3
const file1 = ref(null);
const file2 = ref(null);
</script>

<template>
  <div class="index-page">
    <header class="page-header">
      <h1>JSON l10n Diff Tool</h1>
      <p class="subtitle">Compare and synchronize your translation files</p>
    </header>

    <main class="page-content">
      <section class="upload-section">
        <div class="upload-group">
          <FileUploader label="Upload File 1" />
        </div>
        <div class="upload-group">
          <FileUploader label="Upload File 2" />
        </div>
      </section>

      <section class="comparison-section">
        <ComparisonView :file1="file1" :file2="file2" :diff-results="[]" />
      </section>

      <section class="controls-section">
        <EditControls file-name="file.json" :modified="false" />
      </section>

      <div class="placeholder-note">
        <p>
          ℹ️ Index.vue placeholder - Full integration with Pinia stores will be
          implemented in Phase 3 (T021)
        </p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.index-page {
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
    rgba(100, 108, 255, 0.05) 100%
  );
}

.page-header h1 {
  margin: 0;
  font-size: 2.5rem;
  background: linear-gradient(135deg, #646cff 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  margin: var(--spacing-sm) 0 0 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.125rem;
}

.page-content {
  flex: 1;
  padding: var(--spacing-lg);
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.upload-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.comparison-section {
  margin-bottom: var(--spacing-lg);
}

.controls-section {
  margin-bottom: var(--spacing-lg);
}

.tier-section {
  margin-bottom: var(--spacing-lg);
}

.placeholder-note {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background-color: rgba(100, 108, 255, 0.1);
  border: 1px solid rgba(100, 108, 255, 0.3);
  text-align: center;
}

.placeholder-note p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .upload-section {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .page-content {
    padding: var(--spacing-md);
  }
}
</style>
