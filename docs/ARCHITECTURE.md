# Architecture Overview

> **Last Updated**: October 13, 2025
> **Status**: Planning Complete, Implementation Pending

## Table of Contents

- [System Overview](#system-overview)
- [Technology Stack](#technology-stack)
- [Architecture Patterns](#architecture-patterns)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Data Flow](#data-flow)
- [Performance Considerations](#performance-considerations)
- [Security Considerations](#security-considerations)

## System Overview

JSON i18n Diff Tool is a **client-side web application** designed for comparing and editing JSON internationalization files. All processing happens in the browser—no backend required.

### Core Capabilities

1. **Upload & Parse** - Accept JSON files via drag-and-drop or file picker
2. **Compare** - Generate diff between two JSON structures
3. **Visualize** - Display nested tree with color-coded differences
4. **Edit** - Inline editing of values and adding missing keys
5. **Export** - Download modified JSON files with formatting
6. **Tier System** - Enforce key limits based on user tier

### Design Principles

- **Client-side First** - No server dependencies, runs entirely in browser
- **Performance** - Handle up to 1000 keys with <3s processing time
- **Simplicity** - Clean UI, minimal friction, intuitive workflow
- **Extensibility** - Modular architecture for future enhancements

## Technology Stack

### Core Framework

- **Vue 3.5.22** - Progressive JavaScript framework
  - Composition API with `<script setup>`
  - Reactive state management
  - Component-based architecture
  - Single File Components (SFC)

### Build Tool

- **Vite 7.1.14** (Rolldown variant) - Next-generation build tool
  - Lightning-fast HMR (Hot Module Replacement)
  - Native ES modules
  - Optimized production builds
  - Plugin ecosystem

### State Management

- **Pinia 2.2.8** - Vue's official state management
  - Intuitive store composition
  - TypeScript-ready (though using JavaScript)
  - Devtools integration
  - Lightweight alternative to Vuex

### Language

- **JavaScript ES6+** - Modern JavaScript features
  - Async/await for asynchronous operations
  - Destructuring and spread operators
  - Arrow functions
  - Optional chaining

## Architecture Patterns

### 1. Component-Based Architecture

Application is decomposed into reusable, single-responsibility components:

```
┌─────────────────────────────────────┐
│           App.vue (Root)            │
│  ┌───────────────────────────────┐  │
│  │      Index.vue (Main Page)    │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │   FileUploader          │  │  │
│  │  └─────────────────────────┘  │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │   ComparisonView        │  │  │
│  │  │  ┌──────────────────┐   │  │  │
│  │  │  │  TreeViewer      │   │  │  │
│  │  │  │  ┌────────────┐  │   │  │  │
│  │  │  │  │KeyDiffItem │  │   │  │  │
│  │  │  │  └────────────┘  │   │  │  │
│  │  │  └──────────────────┘   │  │  │
│  │  └─────────────────────────┘  │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │   EditControls          │  │  │
│  │  └─────────────────────────┘  │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │   TierGate              │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### 2. Composition API Pattern

Leveraging Vue 3's Composition API for:

- **Logic reuse** via composables
- **Type inference** (when using TypeScript)
- **Better organization** of component logic
- **Flexible composition** of functionality

```javascript
// Example: useKeyCounter composable
export function useKeyCounter() {
  const count = ref(0)

  function countKeys(obj) {
    // Logic here
    count.value = result
    return result
  }

  return { count, countKeys }
}
```

### 3. Unidirectional Data Flow

State flows in one direction: **Store → Component → User Action → Store**

```
┌──────────────┐
│  Pinia Store │
└──────┬───────┘
       │ (state/getters)
       ↓
┌──────────────┐
│  Component   │
└──────┬───────┘
       │ (user interaction)
       ↓
┌──────────────┐
│  Action      │
└──────┬───────┘
       │ (mutation)
       ↓
┌──────────────┐
│  Store       │ ← Back to top
└──────────────┘
```

### 4. Layer Separation

Clear separation of concerns:

1. **Presentation Layer** - Components (UI)
2. **State Layer** - Pinia stores (data)
3. **Logic Layer** - Composables (reusable hooks)
4. **Utility Layer** - Pure functions (helpers)

## Component Architecture

### Component Categories

#### 1. Page Components (`src/pages/`)

- **Index.vue** - Main application page
- **About.vue** - Information and pricing page

#### 2. Feature Components (`src/components/`)

- **FileUploader** - File input with validation
- **ComparisonView** - Layout for side-by-side comparison
- **TreeViewer** - Recursive tree display
- **KeyDiffItem** - Individual key comparison row
- **EditControls** - Action buttons (save, prettify, reset)
- **TierGate** - Tier limit enforcement UI

### Component Communication

```
FileUploader  ─→  useFileStore  ─→  ComparisonView
                       ↓
                  TreeViewer
                       ↓
                  KeyDiffItem  ←─  useEditStore
```

Components communicate via:

1. **Pinia Stores** - Shared state (preferred)
2. **Props** - Parent → Child data
3. **Emits** - Child → Parent events
4. **Provide/Inject** - Deep tree communication (sparingly)

## State Management

### Store Structure

Three domain-specific stores:

#### 1. useFileStore

Manages file uploads and comparison:

```javascript
{
  state: {
    fileA: null,           // First uploaded file
    fileB: null,           // Second uploaded file
    parsedA: null,         // Parsed JSON from fileA
    parsedB: null,         // Parsed JSON from fileB
    comparisonResult: null // Diff result
  },
  getters: {
    hasFiles,              // Both files uploaded?
    keyCount,              // Total keys in comparison
    missingInA,            // Keys missing in file A
    missingInB             // Keys missing in file B
  },
  actions: {
    uploadFile,            // Upload and validate file
    compareFiles,          // Generate diff
    reset                  // Clear all files
  }
}
```

#### 2. useTierStore

Handles tier limits:

```javascript
{
  state: {
    selectedTier: 'free',  // Current tier
    tiers: {...}           // Tier definitions
  },
  getters: {
    currentLimit,          // Max keys for tier
    isWithinLimit          // Is current usage within limit?
  },
  actions: {
    selectTier,            // Change user tier
    checkLimit             // Validate against limit
  }
}
```

#### 3. useEditStore

Tracks modifications:

```javascript
{
  state: {
    edits: [],             // Array of edit operations
    hasUnsavedChanges: false
  },
  getters: {
    editCount,             // Number of edits
    modifiedKeys           // List of changed keys
  },
  actions: {
    addEdit,               // Record an edit
    applyEdits,            // Apply all edits
    reset                  // Clear edits
  }
}
```

## Data Flow

### Upload Flow

```
User selects file
      ↓
FileUploader validates
      ↓
useFileStore.uploadFile()
      ↓
Parse JSON
      ↓
Store in state
      ↓
Trigger comparison
      ↓
Update UI
```

### Comparison Flow

```
Both files uploaded
      ↓
useFileStore.compareFiles()
      ↓
Generate flat key paths
      ↓
Compare values
      ↓
Classify differences
      ↓
Build comparison result
      ↓
TreeViewer renders
```

### Edit Flow

```
User edits value in KeyDiffItem
      ↓
useEditStore.addEdit()
      ↓
Mark hasUnsavedChanges
      ↓
User clicks "Save"
      ↓
useEditStore.applyEdits()
      ↓
Update parsedA/parsedB
      ↓
Regenerate comparison
      ↓
Download modified JSON
```

## Performance Considerations

### Target Performance

- **Parsing**: <500ms for 1000-key JSON
- **Comparison**: <2s for 1000-key diff
- **Rendering**: <100ms UI response time
- **File Size**: Support up to 10MB JSON files

### Optimization Strategies

1. **Lazy Rendering** - Virtual scrolling for large trees
2. **Memoization** - Cache comparison results
3. **Debouncing** - Delay expensive operations during typing
4. **Web Workers** - Offload JSON parsing (future enhancement)

### Monitoring

Key metrics to track:

- Time to parse JSON
- Time to generate comparison
- Time to first render
- Memory usage during comparison

## Security Considerations

### Client-Side Security

Since this is a client-side app:

1. **No Server Communication** - All data stays in browser
2. **No Persistence** - Data not stored anywhere (unless user downloads)
3. **Input Validation** - Validate JSON structure and file size
4. **XSS Prevention** - Vue's built-in escaping prevents XSS

### File Validation

```javascript
// Validate file before processing
function validateFile(file) {
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File too large')
  }

  // Check file type
  if (file.type !== 'application/json') {
    throw new Error('Invalid file type')
  }

  // Validate JSON structure
  try {
    JSON.parse(content)
  } catch (e) {
    throw new Error('Invalid JSON')
  }
}
```

## Future Considerations

### Potential Enhancements

1. **Offline Support** - Service worker for PWA
2. **Advanced Diff** - Show value changes, not just presence
3. **Export Formats** - CSV, Excel, etc.
4. **Undo/Redo** - Edit history with rollback
5. **Themes** - Dark mode, custom color schemes
6. **Keyboard Shortcuts** - Power user features

### Scalability

For larger JSON files (>1000 keys):

- Implement virtual scrolling
- Use Web Workers for parsing
- Add pagination or filtering
- Consider IndexedDB for caching

---

**Note**: This architecture is subject to refinement during implementation. Architecture decisions will be documented in this file as they're made.
