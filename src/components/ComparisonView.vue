<script setup>
/**
 * ComparisonView Component (Placeholder)
 *
 * Purpose: Side-by-side comparison of two JSON files
 * Features (to be implemented):
 * - Two TreeViewer instances side-by-side
 * - Synchronized scrolling
 * - Display diff results with color coding
 */

defineProps({
  file1: {
    type: Object,
    default: null,
  },
  file2: {
    type: Object,
    default: null,
  },
  diffResults: {
    type: Array,
    default: () => [],
  },
});

defineEmits(['save-requested', 'prettify-requested', 'edit-made']);
</script>

<template>
  <div class="comparison-view">
    <div class="comparison-panel">
      <div class="comparison-panel-header">File 1</div>
      <p class="placeholder-note">
        ComparisonView placeholder - to be implemented in Phase 3
      </p>
    </div>
    <div class="comparison-panel">
      <div class="comparison-panel-header">File 2</div>
      <p class="placeholder-note">
        ComparisonView placeholder - to be implemented in Phase 3
      </p>
    </div>
  </div>
</template>

<style scoped>
.placeholder-note {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}
</style>
