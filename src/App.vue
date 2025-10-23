<script setup>
/**
 * App.vue - Root Application Component
 *
 * Purpose: Main application shell with simple client-side routing
 * Features:
 * - Navigation between Index and About pages
 * - Simple hash-based routing (no vue-router dependency)
 * - Responsive navigation bar
 */

import { ref, computed } from 'vue';
import Index from '@/pages/Index.vue';
import About from '@/pages/About.vue';

// Simple hash-based routing
const currentRoute = ref(window.location.hash.slice(1) || '/');

// Update route on hash change
window.addEventListener('hashchange', () => {
  currentRoute.value = window.location.hash.slice(1) || '/';
});

// Computed component based on route
const currentComponent = computed(() => {
  switch (currentRoute.value) {
    case '/about':
      return About;
    case '/':
    default:
      return Index;
  }
});

// Navigation helper
const navigate = (path) => {
  window.location.hash = path;
};

// Check if route is active
const isActive = (path) => {
  return currentRoute.value === path;
};
</script>

<template>
  <div id="app">
    <nav class="main-nav">
      <div class="nav-brand">
        <a href="#/" @click.prevent="navigate('/')">
          <h1>JSON l10n Diff</h1>
        </a>
      </div>
      <div class="nav-links">
        <a
          href="#/"
          :class="{ active: isActive('/') }"
          @click.prevent="navigate('/')"
        >
          Home
        </a>
        <a
          href="#/about"
          :class="{ active: isActive('/about') }"
          @click.prevent="navigate('/about')"
        >
          About
        </a>
      </div>
    </nav>

    <component :is="currentComponent" />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand h1 {
  margin: 0;
  font-size: 1.5rem;
  background: linear-gradient(135deg, #646cff 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
  transition: transform 0.2s;
}

.nav-brand a {
  text-decoration: none;
}

.nav-brand h1:hover {
  transform: scale(1.05);
}

.nav-links {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.nav-links a {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: rgba(255, 255, 255, 0.87);
  font-weight: 500;
  transition:
    background-color 0.2s,
    color 0.2s;
  cursor: pointer;
}

.nav-links a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-links a.active {
  background-color: var(--color-primary);
  color: white;
}

/* Responsive Navigation */
@media (max-width: 768px) {
  .main-nav {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: flex-start;
  }

  .nav-links {
    width: 100%;
    justify-content: flex-start;
  }

  .nav-brand h1 {
    font-size: 1.25rem;
  }
}
</style>
