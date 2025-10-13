# Contributing to JSON i18n Diff Tool

Thank you for your interest in contributing! This project is currently in the **planning phase** with implementation about to begin.

## Project Status

**Current Phase**: Planning Complete → Implementation Starting

- ✅ All specifications finalized
- ✅ Task breakdown complete (52 tasks)
- ⏳ Implementation ready to begin

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Familiarity with Vue 3 Composition API
- Understanding of Pinia state management

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/iirving/json-l10n-diff.git
cd json-l10n-diff

# Install dependencies
npm install

# Start development server
npm run dev
```

## Development Workflow

### 1. Understand the Architecture

Before contributing, review these key documents:

- **[spec.md](specs/001-json-i18n-comparison/spec.md)** - Feature requirements (5 user stories)
- **[plan.md](specs/001-json-i18n-comparison/plan.md)** - Technical implementation plan
- **[tasks.md](specs/001-json-i18n-comparison/tasks.md)** - All 52 tasks with dependencies
- **[quickstart.md](specs/001-json-i18n-comparison/quickstart.md)** - Developer guide

### 2. Pick a Task

All work is tracked in `specs/001-json-i18n-comparison/tasks.md`:

- **Phase 1-2**: Foundation (T001-T014) - Setup and core utilities
- **Phase 3-5**: MVP (T015-T032) - Core comparison functionality
- **Phase 6-8**: Full Feature (T033-T052) - Tier system and polish

Look for tasks marked as:

- `🟢 Ready` - No blockers, can start immediately
- `🟡 Blocked` - Dependencies must be completed first

### 3. Branch Naming Convention

```bash
# Feature branches
git checkout -b feature/T001-create-directory-structure
git checkout -b feature/T015-implement-file-uploader

# Bug fixes
git checkout -b fix/issue-123-json-validation

# Documentation
git checkout -b docs/update-quickstart
```

### 4. Commit Messages

Follow conventional commits:

```
feat(T001): create project directory structure
fix(FileUploader): validate JSON before parsing
docs(readme): update installation instructions
test(jsonValidator): add nested object tests
```

### 5. Code Standards

#### Vue Components

- Use Composition API with `<script setup>`
- Follow component contracts in `specs/001-json-i18n-comparison/contracts/component-contracts.md`
- Keep components under 300 lines (split if larger)
- Use Pinia stores for shared state (no prop drilling)

```vue
<script setup>
import { ref, computed } from 'vue'
import { useFileStore } from '@/stores/useFileStore'

// Props
const props = defineProps({
  // Always define with types
})

// Store
const fileStore = useFileStore()

// Local state
const isExpanded = ref(false)

// Computed
const hasErrors = computed(() => {
  // Logic here
})
</script>
```

#### Pinia Stores

- One store per domain (files, tiers, edits)
- Use actions for mutations (no direct state modification)
- Provide TypeScript-like JSDoc comments

```javascript
export const useFileStore = defineStore('file', () => {
  // State
  const files = ref([])

  // Getters
  const hasFiles = computed(() => files.value.length > 0)

  // Actions
  function uploadFile(file) {
    // Logic here
  }

  return { files, hasFiles, uploadFile }
})
```

#### Utilities

- Pure functions only (no side effects)
- Comprehensive JSDoc comments
- Unit testable

```javascript
/**
 * Generates a flat list of all key paths in a JSON object
 * @param {Object} obj - JSON object to traverse
 * @param {string} prefix - Key path prefix
 * @returns {string[]} Array of key paths (e.g., ['user.name', 'user.age'])
 */
export function getAllKeyPaths(obj, prefix = '') {
  // Implementation
}
```

### 6. Testing

```bash
# Run tests (when test suite is implemented)
npm test

# Run linter
npm run lint

# Type checking (if TypeScript is added)
npm run type-check
```

### 7. Pull Request Process

1. **Complete the checklist**:
   - [ ] Code follows Vue 3 + Pinia best practices
   - [ ] Component contracts are implemented correctly
   - [ ] No console errors or warnings
   - [ ] Manual testing completed
   - [ ] Documentation updated (if needed)

2. **PR Title Format**:

   ```
   feat(T001): Create directory structure
   fix(FileUploader): Handle empty file uploads
   docs: Update component contracts
   ```

3. **PR Description Template**:

   ```markdown
   ## Task Reference
   Implements T001 from specs/001-json-i18n-comparison/tasks.md

   ## Changes
   - Created src/pages/, src/stores/, src/composables/, src/utils/
   - Added .gitkeep files to preserve directory structure

   ## Testing
   - [ ] Verified directories exist
   - [ ] Confirmed no build errors

   ## Screenshots
   (if applicable)
   ```

4. **Review Process**:
   - At least one approval required
   - All CI checks must pass
   - No merge conflicts

## Project Conventions

### File Naming

- **Components**: PascalCase - `FileUploader.vue`, `TreeViewer.vue`
- **Stores**: camelCase with 'use' prefix - `useFileStore.js`
- **Utilities**: camelCase - `jsonValidator.js`, `keyPathUtils.js`
- **Pages**: PascalCase - `Index.vue`, `About.vue`

### Directory Structure

```
src/
├── components/        # Reusable Vue components
├── pages/            # Page-level components (routes)
├── stores/           # Pinia stores (state management)
├── composables/      # Composition API hooks
├── utils/            # Pure utility functions
├── assets/           # Images, fonts, static files
├── App.vue           # Root component
└── main.js           # Entry point
```

### Import Aliases

Use `@/` for src imports:

```javascript
import { useFileStore } from '@/stores/useFileStore'
import { validateJSON } from '@/utils/jsonValidator'
import FileUploader from '@/components/FileUploader.vue'
```

## Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Create an issue with reproduction steps
- **Features**: Check if it's in the spec first, then discuss

## Task Dependencies

Before starting a task, check dependencies in `tasks.md`:

```
T003: Implement App.vue navigation shell
├─ Requires: T001 (directory structure)
├─ Requires: T002 (Pinia setup)
└─ Ready when: Both complete
```

## Recognition

All contributors will be acknowledged in:

- `README.md` contributors section
- Release notes
- Project documentation

---

**Thank you for contributing!** 🎉

For questions, reach out via GitHub Issues or Discussions.
