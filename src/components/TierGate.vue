<script setup>
/**
 * TierGate Component (Placeholder)
 *
 * Purpose: Display tier limits and blocking modal when exceeded
 * Features (to be implemented):
 * - Show current tier and key limits
 * - Blocking modal when file exceeds tier limit
 * - Upgrade prompts with pricing
 */

import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps({
  currentTier: {
    type: String,
    default: 'free',
  },
  keyCount: {
    type: Number,
    default: 0,
  },
  keyLimit: {
    type: Number,
    default: 20,
  },
  exceeded: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['upgrade-requested', 'dismissed']);
</script>

<template>
  <div class="tier-gate">
    <p class="placeholder-note">
      {{ t('tierGate.placeholder') }}
    </p>
    <p>
      {{
        t('tierGate.currentTier', {
          tier: currentTier,
          count: keyCount,
          limit: keyLimit,
        })
      }}
    </p>
  </div>
</template>

<style scoped>
.tier-gate {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.placeholder-note {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
  margin-bottom: var(--spacing-sm);
}
</style>
