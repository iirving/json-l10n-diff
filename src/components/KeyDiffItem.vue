<script setup>
/**
 * KeyDiffItem Component (Placeholder)
 *
 * Purpose: Display a single key comparison row with diff status
 * Features (to be implemented):
 * - Color coding based on status (missing-left, missing-right, identical, different)
 * - Show values inline
 * - Add key button for missing keys
 * - Edit value functionality
 */

defineProps({
  keyPath: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    validator: (value) =>
      ['missing-left', 'missing-right', 'identical', 'different'].includes(
        value
      ),
  },
  value1: {
    type: [String, Number, Boolean, Object],
    default: null,
  },
  value2: {
    type: [String, Number, Boolean, Object],
    default: null,
  },
});

defineEmits(['add-key', 'edit-value']);
</script>

<template>
  <div class="key-diff-item" :class="`diff-${status}`">
    <span class="key-path">{{ keyPath }}</span>
    <p class="placeholder-note">
      KeyDiffItem placeholder - to be implemented in Phase 3
    </p>
  </div>
</template>

<style scoped>
.key-diff-item {
  padding: var(--spacing-sm);
  margin: var(--spacing-xs) 0;
  border-radius: var(--radius-sm);
}

.key-path {
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.placeholder-note {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
  margin: var(--spacing-xs) 0 0 0;
}
</style>
