<script setup>
/**
 * EditControls Component (Placeholder)
 *
 * Purpose: Provide save, prettify, and reset actions
 * Features (to be implemented):
 * - Save button (downloads modified file)
 * - Prettify button (formats JSON with 2-space indentation)
 * - Reset button (discards changes)
 * - Disabled state when no modifications
 */

defineProps({
  fileName: {
    type: String,
    default: 'file.json',
  },
  modified: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['save', 'prettify', 'reset']);
</script>

<template>
  <div class="edit-controls">
    <p class="placeholder-note">
      EditControls placeholder - to be implemented in Phase 4
    </p>
    <div class="controls-group">
      <button disabled>Save {{ fileName }}</button>
      <button disabled>Prettify</button>
      <button disabled>Reset</button>
    </div>
  </div>
</template>

<style scoped>
.edit-controls {
  padding: var(--spacing-md);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.controls-group {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.placeholder-note {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
  margin-bottom: var(--spacing-sm);
}

button {
  opacity: 0.5;
}
</style>
