# Quickstart Guide

**Feature**: JSON i18n Comparison and Diff Tool
**Date**: October 13, 2025
**Audience**: Developers implementing this feature

## Overview

This guide helps you get started implementing the JSON i18n comparison tool. It covers setup, architecture overview, and step-by-step implementation guidance based on the prioritized user stories.

---

## Prerequisites

- Node.js 18+ installed
- npm 9+ installed
- Familiar with Vue 3 Composition API
- Basic understanding of JSON and i18n concepts

## Project Setup

The project is already initialized with Vue 3 + Vite. Verify your environment:

```bash
# Check Node version
node --version  # Should be 18 or higher

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Architecture Overview

### Technology Stack

- **Frontend Framework**: Vue 3.5.22 (Composition API)
- **Build Tool**: Vite (Rolldown variant 7.1.14)
- **Language**: JavaScript ES6+
- **Styling**: CSS (no framework - keep it simple)
- **State Management**: Vue reactive refs + composables (no Vuex/Pinia)
- **Testing**: Vitest (if explicitly requested)

### Project Structure

```
src/
├── components/          # Vue components
│   ├── FileUploader.vue
│   ├── TreeViewer.vue
│   ├── ComparisonView.vue
│   ├── KeyDiffItem.vue
│   ├── EditControls.vue
│   └── TierGate.vue
├── composables/         # Reusable business logic
│   ├── useJsonParser.js
│   ├── useJsonDiff.js
│   ├── useKeyCounter.js
│   ├── useFileDownload.js
│   └── useTierManager.js
├── utils/               # Pure utility functions
│   ├── jsonValidator.js
│   ├── keyPathUtils.js
│   └── prettifyJson.js
├── App.vue              # Root component
├── main.js              # App initialization
└── style.css            # Global styles
```

### Key Design Patterns

1. **Composition API**: All components use `<script setup>` for cleaner code
2. **Composables**: Extract reusable logic into composables (like React hooks)
3. **Props Down, Events Up**: Parent components pass data via props, children emit events
4. **Pure Functions**: Utils contain pure functions with no side effects
5. **Client-Side Only**: No backend, all processing in browser

---

## Implementation Roadmap

Follow this order based on prioritized user stories:

### Phase 1: Core MVP (P1 Features - 1-2 weeks)

**User Story 1: View and Compare Files**

1. **FileUploader Component** (2-3 days)
   - File input with drag-and-drop
   - Size validation (10 MB limit)
   - JSON parsing and validation
   - Error display with line numbers

2. **TreeViewer Component** (3-4 days)
   - Recursive tree rendering
   - Expand/collapse functionality
   - Value display for leaf nodes
   - Keyboard navigation

3. **Diff Algorithm** (2-3 days)
   - Create `useJsonDiff` composable
   - Implement recursive comparison
   - Generate KeyComparisonResult array
   - Handle edge cases (deep nesting, arrays)

4. **ComparisonView Component** (2 days)
   - Side-by-side layout
   - Integrate two TreeViewers
   - Color-coded highlighting (red/yellow/neutral)
   - Synchronize scroll positions (optional)

**User Story 2: Edit and Add Keys**

5. **Edit Controls** (2-3 days)
   - Inline edit functionality
   - Add missing key button
   - Update in-memory state
   - Re-run comparison after edits

**User Story 3: Save Modified Files**

6. **File Download** (1-2 days)
   - Create `useFileDownload` composable
   - Blob API implementation
   - Prettify with 2-space indent
   - Warning modal for prettify

### Phase 2: Business Logic (P2 Features - 3-5 days)

**User Story 4: Tier Limits**

7. **Key Counter** (1 day)
   - Implement `useKeyCounter` composable
   - Recursive counting algorithm
   - Include parent objects in count

8. **Tier Gate** (2 days)
   - LocalStorage tier management
   - Key limit enforcement
   - Error messages for limit exceeded
   - Usage display

### Phase 3: Monetization (P3 Features - 2-3 days)

**User Story 5: Subscription Tiers**

9. **Tier Selection UI** (2-3 days)
   - Pricing table
   - Tier comparison
   - Upgrade prompts
   - Mock subscription flow

---

## Step-by-Step Implementation

### Step 1: Set Up Basic App Structure

**File**: `src/App.vue`

```vue
<script setup>
import { ref } from 'vue';
import FileUploader from './components/FileUploader.vue';
import ComparisonView from './components/ComparisonView.vue';

// State
const file1 = ref(null);
const file2 = ref(null);
const diffResults = ref([]);

// Handlers
function handleFile1Loaded(file) {
  file1.value = file;
  if (file2.value) {
    runComparison();
  }
}

function handleFile2Loaded(file) {
  file2.value = file;
  if (file1.value) {
    runComparison();
  }
}

function runComparison() {
  // TODO: Implement diff algorithm
  console.log('Running comparison...');
}
</script>

<template>
  <div class="app">
    <header>
      <h1>JSON i18n Diff Tool</h1>
    </header>

    <main>
      <div class="upload-section">
        <FileUploader
          file-id="file1"
          @file-loaded="handleFile1Loaded"
        />
        <FileUploader
          file-id="file2"
          @file-loaded="handleFile2Loaded"
        />
      </div>

      <ComparisonView
        v-if="file1 && file2"
        :file1="file1"
        :file2="file2"
        :diff-results="diffResults"
      />
    </main>
  </div>
</template>

<style>
/* TODO: Add styles */
</style>
```

### Step 2: Implement FileUploader Component

**File**: `src/components/FileUploader.vue`

```vue
<script setup>
import { ref } from 'vue';
import { useJsonParser } from '../composables/useJsonParser';

const props = defineProps({
  fileId: {
    type: String,
    required: true,
    validator: (value) => ['file1', 'file2'].includes(value)
  },
  tier: {
    type: Object,
    default: () => ({ level: 'free', keyLimit: 20 })
  }
});

const emit = defineEmits(['file-loaded', 'file-error']);

const { parseFile } = useJsonParser();
const fileInput = ref(null);
const uploading = ref(false);
const fileName = ref('');

async function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  fileName.value = file.name;
  uploading.value = true;

  try {
    const result = await parseFile(file, props.tier);

    if (result.error) {
      emit('file-error', result);
    } else {
      emit('file-loaded', result);
    }
  } catch (error) {
    emit('file-error', {
      code: 'UNKNOWN_ERROR',
      message: error.message,
      severity: 'error'
    });
  } finally {
    uploading.value = false;
  }
}

function triggerUpload() {
  fileInput.value?.click();
}
</script>

<template>
  <div class="file-uploader">
    <input
      ref="fileInput"
      type="file"
      accept=".json,application/json"
      @change="handleFileSelect"
      hidden
    />

    <button
      @click="triggerUpload"
      :disabled="uploading"
      class="upload-button"
    >
      {{ uploading ? 'Uploading...' : `Upload ${fileId.toUpperCase()}` }}
    </button>

    <div v-if="fileName" class="file-name">
      {{ fileName }}
    </div>
  </div>
</template>

<style scoped>
/* TODO: Add component styles */
</style>
```

### Step 3: Create useJsonParser Composable

**File**: `src/composables/useJsonParser.js`

```javascript
import { useKeyCounter } from './useKeyCounter';

export function useJsonParser() {
  const { countKeys, validateKeyCount } = useKeyCounter();

  async function parseFile(file, tier) {
    // Validate file size
    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      return {
        error: true,
        code: 'FILE_TOO_LARGE',
        message: `File exceeds 10 MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(1)} MB.`,
        details: { actualSize: file.size, limit: maxSize },
        severity: 'error'
      };
    }

    // Read file content
    const content = await readFileAsText(file);

    // Parse JSON
    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (error) {
      const line = extractErrorLine(error);
      return {
        error: true,
        code: 'INVALID_JSON',
        message: `Invalid JSON${line ? ` at line ${line}` : ''}: ${error.message}`,
        details: { line, originalError: error.message },
        severity: 'error'
      };
    }

    // Count keys
    const keyCount = countKeys(parsedContent);

    // Validate against tier limit
    const tierValidation = validateKeyCount(parsedContent, tier);
    if (tierValidation !== true) {
      return tierValidation; // Return the validation error
    }

    // Return parsed file
    return {
      id: `file_${Date.now()}`,
      name: file.name,
      size: file.size,
      content: parsedContent,
      keyCount,
      uploadedAt: new Date().toISOString(),
      modified: false
    };
  }

  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  function extractErrorLine(error) {
    // Try to parse line number from SyntaxError message
    const match = error.message.match(/line (\d+)/i);
    return match ? parseInt(match[1], 10) : null;
  }

  return {
    parseFile
  };
}
```

### Step 4: Implement Key Counter

**File**: `src/composables/useKeyCounter.js`

```javascript
export function useKeyCounter() {
  /**
   * Count all keys including parent objects
   * Per clarification: {"user": {"profile": {"name": "John"}}} = 3 keys
   */
  function countKeys(obj, count = 0) {
    if (typeof obj !== 'object' || obj === null) {
      return count;
    }

    for (const key in obj) {
      count++; // Count this key

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        count = countKeys(obj[key], count); // Recurse
      }
    }

    return count;
  }

  function validateKeyCount(obj, tier) {
    const count = countKeys(obj);
    const limit = tier.keyLimit;

    if (count > limit) {
      return {
        error: true,
        code: 'TIER_LIMIT_EXCEEDED',
        message: `File exceeds ${tier.displayName} tier limit of ${limit} keys. Current: ${count} keys. Upgrade to access larger files.`,
        details: { tier: tier.displayName, limit, count },
        severity: 'error'
      };
    }

    return true;
  }

  return {
    countKeys,
    validateKeyCount
  };
}
```

### Step 5: Build the Diff Algorithm

**File**: `src/composables/useJsonDiff.js`

```javascript
export function useJsonDiff() {
  function compareObjects(obj1, obj2) {
    const results = [];
    const visited = new Set();

    // Compare from obj1 perspective
    traverseObject(obj1, obj2, '', results, visited, 'left');

    // Find keys only in obj2
    traverseObject(obj2, obj1, '', results, visited, 'right');

    return results;
  }

  function traverseObject(source, target, parentPath, results, visited, side) {
    for (const key in source) {
      const currentPath = parentPath ? `${parentPath}.${key}` : key;

      // Skip if already processed
      if (visited.has(currentPath)) continue;
      visited.add(currentPath);

      const sourceValue = source[key];
      const targetValue = target?.[key];

      // Key missing in target
      if (!(key in (target || {}))) {
        results.push({
          keyPath: currentPath,
          status: side === 'left' ? 'missing-right' : 'missing-left',
          valueLeft: side === 'left' ? sourceValue : undefined,
          valueRight: side === 'right' ? sourceValue : undefined,
          depth: currentPath.split('.').length,
          isLeaf: !isObject(sourceValue),
          parentPath: parentPath || null
        });
        continue;
      }

      // Both have the key
      if (isObject(sourceValue) && isObject(targetValue)) {
        // Recurse for nested objects
        traverseObject(sourceValue, targetValue, currentPath, results, visited, side);
      } else {
        // Compare leaf values
        const status = JSON.stringify(sourceValue) === JSON.stringify(targetValue)
          ? 'identical'
          : 'different';

        results.push({
          keyPath: currentPath,
          status,
          valueLeft: side === 'left' ? sourceValue : targetValue,
          valueRight: side === 'right' ? sourceValue : targetValue,
          depth: currentPath.split('.').length,
          isLeaf: true,
          parentPath: parentPath || null
        });
      }
    }
  }

  function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  return {
    compareObjects
  };
}
```

---

## Development Guidelines

### Code Quality (per Constitution)

1. **Use meaningful names**: `parseFile` not `pf`, `keyCount` not `kc`
2. **Keep functions small**: Max 20-30 lines, single responsibility
3. **Use ES6+**: `const`, arrow functions, template literals, destructuring
4. **JSDoc comments**: Document all public functions with params and returns
5. **Pure functions in utils**: No side effects, predictable outputs

### Component Guidelines

1. **Use `<script setup>`**: Cleaner than Options API
2. **Define props explicitly**: Use `defineProps()` with validators
3. **Define emits explicitly**: Use `defineEmits()` for type safety
4. **Keep templates simple**: Complex logic belongs in computed properties
5. **Scoped styles**: Use `<style scoped>` to avoid conflicts

### Testing (if requested)

1. **Run tests**: `npm test` (uses Vitest)
2. **Coverage target**: 90%+ per constitution
3. **Test types**: Unit tests for composables, component tests for Vue components
4. **TDD approach**: Write test first, watch it fail, implement, watch it pass

---

## Common Patterns

### Error Handling

```javascript
// Always emit errors, don't throw (in components)
try {
  const result = await someOperation();
  emit('success', result);
} catch (error) {
  emit('error', {
    code: 'OPERATION_FAILED',
    message: error.message,
    severity: 'error'
  });
}
```

### Reactive State

```javascript
import { ref, computed } from 'vue';

// Use ref for primitive values
const count = ref(0);

// Use computed for derived state
const doubleCount = computed(() => count.value * 2);

// Access with .value in script, without in template
console.log(count.value); // In script
// {{ count }} in template
```

### Composables Pattern

```javascript
export function useFeature() {
  // State
  const state = ref(initialValue);

  // Computed
  const derived = computed(() => transform(state.value));

  // Methods
  function method() {
    // Logic here
  }

  // Expose public API
  return {
    state,
    derived,
    method
  };
}
```

---

## Debugging Tips

### Vue DevTools

Install Vue DevTools browser extension for:

- Component hierarchy inspection
- State/props inspection
- Event tracing
- Performance profiling

### Console Logging

```javascript
// Use structured logging
console.log('[FileUploader] File loaded:', {
  name: file.name,
  size: file.size,
  keyCount
});

// Remove console.logs before committing
```

### Vite HMR (Hot Module Replacement)

- Save file → browser auto-refreshes
- If HMR breaks, refresh browser manually
- Check terminal for build errors

---

## Performance Optimization

### When to Optimize

- **Don't optimize prematurely** (YAGNI per constitution)
- Only optimize if performance targets missed:
  - File parsing > 3 seconds
  - UI feels sluggish (>100ms response)
  - Browser memory issues

### Optimization Strategies

1. **Virtual scrolling**: Only render visible tree nodes
2. **Debounce edits**: Wait 300ms before re-running diff
3. **Web Workers**: Parse large files off main thread
4. **Memoization**: Cache computed diff results

---

## Deployment

### Build for Production

```bash
# Build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

### Output

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js    # Main bundle
│   └── index-[hash].css   # Styles
└── vite.svg               # Favicon
```

### Hosting Options

- **Static hosting**: Netlify, Vercel, GitHub Pages
- **Self-hosted**: Any static file server (nginx, Apache)
- **CDN**: CloudFlare, AWS S3 + CloudFront

---

## Troubleshooting

### Common Issues

**Issue**: "Cannot find module '@vue/...'""
**Solution**: Run `npm install`

**Issue**: Vite server won't start
**Solution**: Check port 5173 not in use, try `npx vite --port 3000`

**Issue**: Changes not reflecting
**Solution**: Clear browser cache, restart dev server

**Issue**: Build fails with syntax errors
**Solution**: Check for ES6+ features not supported in target browsers

---

## Next Steps

1. **Start with Phase 1**: FileUploader → TreeViewer → Diff → ComparisonView
2. **Test incrementally**: Verify each component works before moving to next
3. **Commit often**: Small, focused commits with clear messages
4. **Reference docs**: See `research.md`, `data-model.md`, `contracts/` for details
5. **Ask for help**: If stuck, consult team or review constitution

---

## Useful Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Composition API Guide](https://vuejs.org/guide/extras/composition-api-faq.html)
- Project Constitution: `.specify/memory/constitution.md`
- Feature Spec: `specs/001-json-i18n-comparison/spec.md`

---

**Ready to code! Start with `src/components/FileUploader.vue` and work your way through the roadmap.**
