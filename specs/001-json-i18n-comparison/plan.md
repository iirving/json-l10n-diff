# Implementation Plan: JSON i18n Comparison and Diff Tool

**Branch**: `001-json-i18n-comparison` | **Date**: October 13, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-json-i18n-comparison/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

A client-side single-page application that allows developers to upload and compare two JSON i18n files, visualizing differences in a tree structure with color-coded highlights (red for missing keys, yellow for identical values, neutral for different values). Users can inline-edit values, add missing keys, and save modified files. The tool includes tier-based access control (Free: 20 keys, Medium: 100 keys, Enterprise: 1000 keys) and enforces a 1 MB file size limit. Built with Vue 3 Composition API and Vite, following a component-based architecture for modularity and testability.

## Technical Context

**Language/Version**: JavaScript ES6+ / Vue 3.5.22
**Primary Dependencies**: Vue 3.5.22, Vite (Rolldown variant 7.1.14), @vitejs/plugin-vue 6.0.1, Pinia (state management)
**State Management**: Pinia (<https://pinia.vuejs.org/>) - Vue's official state management library
**Storage**: Client-side only (browser memory, Pinia stores for reactive state, LocalStorage for tier preferences)
**Testing**: Vitest (when explicitly requested per constitution)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
**Project Type**: Single-page web application
**Performance Goals**: <3 seconds to parse and display files up to 1000 keys; <100ms UI response to edits
**Constraints**: <1 MB file size limit; client-side processing only (no server); must work offline after initial load
**Scale/Scope**: Single-user application; up to 1000 keys per file (Enterprise tier); up to 2 files compared simultaneously

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Component Architecture ✅

- **Status**: PASS
- **Validation**: Feature naturally decomposes into Vue components (FileUploader, TreeViewer, ComparisonEngine, EditControls, TierManager)
- **Action**: None required

### Code Quality ✅

- **Status**: PASS
- **Validation**: Will use Vue 3 Composition API, ES6+ features, meaningful names, JSDoc comments
- **Action**: Ensure all components follow camelCase, use pure functions for diff logic

### Testing ⚠️

- **Status**: CONDITIONAL
- **Validation**: Tests only required when explicitly requested by user
- **Action**: If requested, use Vitest with 90%+ coverage target

### Simplicity & YAGNI ✅

- **Status**: PASS
- **Validation**: MVP focuses on P1 user stories (view, edit, save); tier system deferred to P2/P3
- **Action**: Start with simplest diff algorithm; optimize only if performance targets missed

### User Experience ✅

- **Status**: PASS
- **Validation**: Clear visual feedback (color coding), responsive design, specific error messages required
- **Action**: Design for mobile and desktop; keyboard navigation for accessibility

### Dependency Policy ✅

- **Status**: PASS
- **Validation**: Minimal dependencies (Vue + Vite + Pinia only); Pinia is Vue's official state management library
- **Action**: Use native browser APIs for file upload, JSON parsing, downloads; use Pinia stores for reactive state management

### Re-evaluation Post-Design

- [x] Component boundaries respect single responsibility (FileUploader, TreeViewer, ComparisonView, etc. each have clear, focused purpose)
- [x] No premature abstractions in diff algorithm (simple recursive comparison, optimize only if needed)
- [x] Error messages are specific and actionable (includes file size, line numbers, key counts with upgrade suggestions)
- [x] Pinia added as official state management (lightweight, type-safe, Vue 3 native)

**Final Status**: ✅ All constitution checks passed. Design adheres to all principles.

## Project Structure

### Documentation (this feature)

```
specs/001-json-i18n-comparison/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
├── checklists/          # Quality validation
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
src/
├── components/
│   ├── FileUploader.vue       # Handles file upload, validation, size/format checks
│   ├── TreeViewer.vue         # Displays JSON as collapsible tree
│   ├── ComparisonView.vue     # Orchestrates tree + comparison overlay
│   ├── KeyDiffItem.vue        # Individual key comparison row (red/yellow/neutral)
│   ├── EditControls.vue       # Inline edit, add key, save buttons
│   └── TierGate.vue           # Enforces key limits, shows upgrade prompts
├── pages/
│   ├── Index.vue              # Main application page (comparison tool)
│   └── About.vue              # About page (feature info, documentation)
├── stores/
│   ├── useFileStore.js        # Pinia store: file1, file2, diffResults state
│   ├── useTierStore.js        # Pinia store: tier management, key limits
│   └── useEditStore.js        # Pinia store: edit operations, modified flags
├── composables/
│   ├── useJsonParser.js       # Parse, validate JSON
│   ├── useJsonDiff.js         # Compare two JSON objects, return diff
│   ├── useKeyCounter.js       # Count keys including parents
│   └── useFileDownload.js     # Generate and download modified JSON
├── utils/
│   ├── jsonValidator.js       # JSON validation with error line numbers
│   ├── keyPathUtils.js        # Utilities for nested key paths
│   └── prettifyJson.js        # Format JSON with 2-space indentation
├── App.vue                    # Root component with navigation/routing
├── main.js                    # Vue app initialization
└── style.css                  # Global styles

tests/                         # Created only if tests explicitly requested
├── unit/
│   ├── jsonParser.test.js
│   ├── jsonDiff.test.js
│   └── keyCounter.test.js
└── component/
    ├── FileUploader.test.js
    └── ComparisonView.test.js

public/                        # Static assets
```

**Structure Decision**: Single-page web application structure chosen based on Vue 3 + Vite stack. Pages directory added to organize main application view (Index.vue) and supporting pages (About.vue). Simple client-side navigation between pages. Pinia stores centralize reactive state management for files, tiers, and edits. All logic is client-side with no backend. Components use Composition API for clear separation of concerns. Composables encapsulate business logic (diff, validation, counting) for reusability and testability. Utils contain pure functions for data transformations.

## Complexity Tracking

_No constitution violations detected. All requirements align with simplicity principles._

---

## Planning Phase Completion

### Phase 0: Outline & Research ✅

**Status**: Complete
**Output**: [`research.md`](./research.md)

**Key Decisions Made**:

- Custom recursive diff algorithm (no external dependencies)
- Vue component tree with expand/collapse
- Native File API for upload/download
- Blob API for file generation
- Client-side tier management with LocalStorage
- 2-space JSON prettification standard
- Last-edit-wins conflict resolution

**All NEEDS CLARIFICATION items resolved**: No blocking unknowns remain.

### Phase 1: Design & Contracts ✅

**Status**: Complete
**Outputs**:

- [`data-model.md`](./data-model.md) - Entity definitions and relationships
- [`contracts/component-contracts.md`](./contracts/component-contracts.md) - Component and composable interfaces
- [`quickstart.md`](./quickstart.md) - Developer onboarding guide
- Agent context updated: `.github/copilot-instructions.md`

**Data Model Entities Defined**:

1. JsonFile - Uploaded file representation
2. KeyComparisonResult - Individual key comparison state
3. EditOperation - User modification tracking
4. UserTier - Subscription tier limits
5. ValidationError - Structured error messages

**Component Contracts Defined**:

- 6 Vue components (FileUploader, TreeViewer, ComparisonView, KeyDiffItem, EditControls, TierGate)
- 5 Composables (useJsonParser, useJsonDiff, useKeyCounter, useFileDownload, useTierManager)
- 3 Utility modules (jsonValidator, keyPathUtils, prettifyJson)

**Constitution Re-Check**: ✅ All principles maintained in design

### Phase 2: Task Breakdown (NOT COMPLETED)

**Status**: Not started (requires `/speckit.tasks` command)
**Expected Output**: `tasks.md` with granular implementation tasks

**Note**: Phase 2 is intentionally not included in `/speckit.plan` command. Run `/speckit.tasks` next to break down the implementation into concrete, actionable tasks.

---

## Next Steps

1. **Review Artifacts**: Examine `research.md`, `data-model.md`, `contracts/`, and `quickstart.md`
2. **Run `/speckit.tasks`**: Generate detailed implementation tasks from this plan
3. **Begin Implementation**: Follow the roadmap in `quickstart.md` starting with Phase 1 (P1 user stories)
4. **Track Progress**: Use generated `tasks.md` to monitor completion

---

## Summary

This plan establishes a solid technical foundation for the JSON i18n comparison tool. All research is complete, architecture is defined, and contracts are documented. The design adheres strictly to the project constitution with:

- ✅ No new dependencies beyond Vue 3 + Vite
- ✅ Simple, testable component architecture
- ✅ Clear separation of concerns (components, composables, utils)
- ✅ Client-side only (no backend complexity)
- ✅ Native browser APIs (File, Blob, LocalStorage)
- ✅ Specific, actionable error messages
- ✅ Performance targets defined and achievable

**Implementation is ready to begin after task breakdown.**
