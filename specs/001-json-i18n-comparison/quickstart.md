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

# Install dependencies (includes Pinia)
npm install
npm install pinia  # If not already in package.json

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Test Data Files

The `./data` directory contains l10n JSON test files for test scenarios and examples:

```
data/
└── test1/
    ├── test1.en.json    # English test file
    └── test1.fr.json    # French test file
```

These files can be used during development to test:

- File upload functionality
- Diff comparison algorithms
- Missing key detection
- Identical value highlighting
- Edit and save operations

Use these test files when implementing features to verify functionality before testing with real localization files.

**Setup Pinia in main.js**:

```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
```

---

## Architecture Overview

### Technology Stack

- **Frontend Framework**: Vue 3.5.22 (Composition API)
- **Build Tool**: Vite (Rolldown variant 7.1.14)
- **Language**: JavaScript ES6+
- **Styling**: CSS (no framework - keep it simple)
- **State Management**: Pinia (<https://pinia.vuejs.org/>) - Vue's official state management library
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
├── pages/               # Page components
│   ├── Index.vue        # Main application page
│   └── About.vue        # About/documentation page
├── stores/              # Pinia stores (state management)
│   ├── useFileStore.js  # Files and comparison state
│   ├── useTierStore.js  # Tier management
│   └── useEditStore.js  # Edit operations tracking
├── composables/         # Reusable business logic
│   ├── useJsonParser.js
│   ├── useJsonDiff.js
│   ├── useKeyCounter.js
│   └── useFileDownload.js
├── utils/               # Pure utility functions
│   ├── jsonValidator.js
│   ├── keyPathUtils.js
│   └── prettifyJson.js
├── App.vue              # Root component with navigation
├── main.js              # App initialization (with Pinia setup)
└── style.css            # Global styles
```

### Key Design Patterns

1. **Composition API**: All components use `<script setup>` for cleaner code
2. **Pinia Stores**: Centralized reactive state management for files, tiers, and edits
3. **Composables**: Extract reusable logic into composables (like React hooks)
4. **Props Down, Events Up**: Parent components pass data via props, children emit events
5. **Pure Functions**: Utils contain pure functions with no side effects
6. **Client-Side Only**: No backend, all processing in browser
7. **Simple Navigation**: Pages organized in src/pages/ with client-side routing in App.vue

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

### Step 1: Set Up Basic App Structure with Pages

**File**: `src/App.vue`

```vue
<script setup>
import { ref } from 'vue';
import Index from './pages/Index.vue';
import About from './pages/About.vue';

// Simple client-side navigation
const currentPage = ref('index');

function navigateTo(page) {
  currentPage.value = page;
}
</script>

<template>
  <div class="app">
    <header>
      <h1>JSON i18n Diff Tool</h1>
      <nav>
        <button
          @click="navigateTo('index')"
          :class="{ active: currentPage === 'index' }"
        >
          Home
        </button>
        <button
          @click="navigateTo('about')"
          :class="{ active: currentPage === 'about' }"
        >
          About
        </button>
      </nav>
    </header>

    <main>
      <Index v-if="currentPage === 'index'" />
      <About v-if="currentPage === 'about'" />
    </main>
  </div>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid #ddd;
}

nav button {
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

nav button.active {
  font-weight: bold;
  background-color: #007bff;
  color: white;
}
</style>
```

**File**: `src/pages/Index.vue`

```vue
<script setup>
import { storeToRefs } from 'pinia';
import FileUploader from '../components/FileUploader.vue';
import ComparisonView from '../components/ComparisonView.vue';
import { useFileStore } from '../stores/useFileStore';
import { useTierStore } from '../stores/useTierStore';

// Pinia stores
const fileStore = useFileStore();
const tierStore = useTierStore();

// Reactive state from stores
const { file1, file2, diffResults } = storeToRefs(fileStore);
const { currentTier } = storeToRefs(tierStore);

// Handlers
function handleFile1Loaded(file) {
  fileStore.setFile1(file);
  if (file2.value) {
    fileStore.runComparison();
  }
}

function handleFile2Loaded(file) {
  fileStore.setFile2(file);
  if (file1.value) {
    fileStore.runComparison();
  }
}
</script>

<template>
  <div class="index-page">
    <div class="upload-section">
      <FileUploader
        file-id="file1"
        :tier="currentTier"
        @file-loaded="handleFile1Loaded"
      />
      <FileUploader
        file-id="file2"
        :tier="currentTier"
        @file-loaded="handleFile2Loaded"
      />
    </div>

    <ComparisonView
      v-if="file1 && file2"
      :file1="file1"
      :file2="file2"
      :diff-results="diffResults"
    />
  </div>
</template>

<style scoped>
.upload-section {
  display: flex;
  gap: 2rem;
  margin: 2rem;
}
</style>
```

**File**: `src/pages/About.vue`

```vue
<script setup>
// No state needed for static about page
</script>

<template>
  <div class="about-page">
    <h2>About JSON i18n Diff Tool</h2>

    <section>
      <h3>Features</h3>
      <ul>
        <li>Upload and compare two JSON i18n files</li>
        <li>Visual tree structure with nested keys</li>
        <li>Color-coded differences:
          <ul>
            <li><strong style="color: red;">Red</strong>: Missing keys</li>
            <li><strong style="color: #ffa500;">Yellow</strong>: Identical values</li>
            <li>Neutral: Different values</li>
          </ul>
        </li>
        <li>Inline editing and adding missing keys</li>
        <li>Save modified files with prettify option</li>
      </ul>
    </section>

    <section>
      <h3>Pricing Tiers</h3>
      <table>
        <thead>
          <tr>
            <th>Tier</th>
            <th>Price</th>
            <th>Key Limit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Free</td>
            <td>$0</td>
            <td>20 keys</td>
          </tr>
          <tr>
            <td>Medium</td>
            <td>$5/month</td>
            <td>100 keys</td>
          </tr>
          <tr>
            <td>Enterprise</td>
            <td>$99/month</td>
            <td>1000 keys</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section>
      <h3>How It Works</h3>
      <ol>
        <li>Upload your first JSON i18n file (e.g., en.json)</li>
        <li>Upload your second JSON i18n file (e.g., fr.json)</li>
        <li>View the comparison with color-coded highlights</li>
        <li>Edit values or add missing keys directly in the interface</li>
        <li>Download your modified files</li>
      </ol>
    </section>

    <section>
      <h3>Technical Details</h3>
      <p>
        This tool is built with Vue 3 and processes all files client-side
        for privacy. No data is sent to any server. Maximum file size is 10 MB.
      </p>
    </section>
  </div>
</template>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 2rem;
}

section {
  margin: 2rem 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

th, td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
}
</style>
```

### Step 2: Implement File Upload

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
