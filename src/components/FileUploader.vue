<script setup>
/**
 * FileUploader Component (Placeholder)
 *
 * Purpose: Handle file upload via drag-and-drop or file input
 * Features (to be implemented):
 * - File input with drag-and-drop support
 * - Size validation (≤10MB)
 * - JSON validation
 * - Emit file-loaded/file-error events
 */

defineProps({
  label: {
    type: String,
    default: 'Upload JSON File',
  },
});

defineEmits(['file-loaded', 'file-error']);
</script>

<template>
  <div class="file-uploader">
    <p>{{ label }}</p>
    <p class="placeholder-note">
      FileUploader placeholder - to be implemented in Phase 3
    </p>
  </div>
</template>

<style scoped>
.file-uploader {
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  text-align: center;
}

.placeholder-note {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}
</style>
