---
description: 'Task list for JSON i18n Comparison and Diff Tool implementation'
---

# Tasks: JSON i18n Comparison and Diff Tool

**Input**: Design documents from `/specs/001-json-i18n-comparison/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/component-contracts.md

**Tests**: Tests are included as separate tasks for each implementation. Test tasks can be skipped if testing is not required, but they are recommended for quality assurance.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- **[TEST]**: Test task - can be skipped if testing is not desired
- Include exact file paths in descriptions

## Path Conventions

- **Single-page web app**: `src/` at repository root
- All Vue components: `src/components/`
- All composables: `src/composables/`
- All utilities: `src/utils/`
- All tests: `tests/` (mirroring src structure)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create directory structure: `src/components/`, `src/pages/`, `src/stores/`, `src/composables/`, `src/utils/`, `tests/utils/`, `tests/composables/`, `tests/components/`, `tests/stores/`
- [ ] T002 Install and configure Pinia in `src/main.js` (createPinia, app.use(pinia))
- [ ] T003 Update `src/style.css` with base styles for tree viewer, color coding (red/yellow/neutral), navigation, and responsive layout
- [ ] T004 [P] Create placeholder components for FileUploader, TreeViewer, ComparisonView, KeyDiffItem, EditControls, TierGate in `src/components/`
- [ ] T005 [P] Create `src/pages/Index.vue` placeholder (main application page)
- [ ] T006 [P] Create `src/pages/About.vue` with static content (features, pricing, how it works, technical details)
- [ ] T007 Update `src/App.vue` with navigation structure (simple client-side routing between Index and About pages)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities, composables, and Pinia stores that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Implement key counting algorithm in `src/utils/keyCounter.js` (recursive depth-first traversal counting all keys including parents) - **Note: Changed from composable to utility (pure function)**
- [x] T008-TEST [TEST] Write unit tests for keyCounter in `tests/utils/keyCounter.test.js` (test edge cases: null, undefined, arrays, nested objects, empty objects, aim for 90%+ coverage)
- [x] T009 [P] Implement JSON validation utility in `src/utils/jsonValidator.js` (validate JSON, extract error line numbers from SyntaxError)
- [x] T009-TEST [P] [TEST] Write unit tests for jsonValidator in `tests/utils/jsonValidator.test.js` (test valid/invalid JSON, error line extraction, edge cases, aim for 90%+ coverage)
- [x] T010 [P] Implement key path utilities in `src/utils/keyPathUtils.js` (build dot-notation paths, split paths, navigate nested objects)
- [x] T010-TEST [P] [TEST] Write unit tests for keyPathUtils in `tests/utils/keyPathUtils.test.js` (test buildPath, splitPath, getValueByPath, setValueByPath with various inputs, aim for 90%+ coverage)
- [x] T011 Implement JSON parser composable in `src/composables/useJsonParser.js` (parseFile, validateJson, getErrorLine methods using jsonValidator and keyCounter from utils)
- [x] T011-TEST [TEST] Write unit tests for useJsonParser in `tests/composables/useJsonParser.test.js` (test parseFile with valid/invalid files, validateJson, getErrorLine, integration with utilities, aim for 90%+ coverage)
- [x] T012 [P] Create Pinia store `src/stores/useFileStore.js` (state: file1, file2, diffResults; actions: setFile1, setFile2, runComparison, reset)
- [x] T012-TEST [P] [TEST] Write unit tests for useFileStore in `tests/stores/useFileStore.test.js` (test all actions, state updates, runComparison logic, reset functionality, aim for 90%+ coverage)
- [x] T014 [P] Create Pinia store `src/stores/useEditStore.js` (state: editHistory Map, file1Modified, file2Modified; actions: addEdit, applyEdit, clearEdits)
- [x] T014-TEST [P] [TEST] Write unit tests for useEditStore in `tests/stores/useEditStore.test.js` (test edit tracking, applyEdit, clearEdits, history management, aim for 90%+ coverage)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View and Compare Basic i18n Files (Priority: P1) 🎯 MVP

**Goal**: Allow users to upload two JSON i18n files and visualize differences with color-coded highlights (red for missing keys, yellow for identical values, neutral for different values)

**Independent Test**: Upload two valid JSON files with nested keys (e.g., en.json with `{"app": {"title": "My App"}}` and fr.json with `{"app": {"title": "Mon App", "welcome": "Bienvenue"}}`), verify tree displays both files with correct highlighting (red for missing "welcome" in file1, neutral for "title" with different values)

### Implementation for User Story 1

- [ ] T015 [P] [US1] Implement FileUploader component in `src/components/FileUploader.vue` (file input, drag-and-drop, size validation ≤10MB, emit file-loaded/file-error events)
- [ ] T015-TEST [P] [US1] [TEST] Write unit tests for FileUploader in `tests/components/FileUploader.test.js` (test file selection, drag-and-drop, size validation, error emissions, event emissions, aim for 90%+ coverage)
- [x] T016 [P] [US1] Implement recursive diff algorithm in `src/composables/useJsonDiff.js` (compareFiles method returning KeyComparisonResult array with status: missing-left, missing-right, identical, different)
- [x] T016-TEST [P] [US1] [TEST] Write unit tests for useJsonDiff in `tests/composables/useJsonDiff.test.js` (test comparison logic, all status types, nested objects, edge cases, aim for 90%+ coverage)
- [ ] T017 [US1] Implement TreeNode component in `src/components/TreeNode.vue` (recursive rendering, expand/collapse state, accepts diffResults prop for color coding)
- [ ] T017-TEST [US1] [TEST] Write unit tests for TreeNode in `tests/components/TreeNode.test.js` (test rendering, expand/collapse, color coding, recursion, aim for 90%+ coverage)
- [ ] T018 [US1] Implement TreeViewer component in `src/components/TreeViewer.vue` (orchestrates TreeNode recursion, exposes expandAll/collapseAll/scrollToKey methods, emits node-toggled events)
- [ ] T018-TEST [US1] [TEST] Write unit tests for TreeViewer in `tests/components/TreeViewer.test.js` (test TreeNode orchestration, expandAll/collapseAll, scrollToKey, event emissions, aim for 90%+ coverage)
- [ ] T019 [US1] Implement KeyDiffItem component in `src/components/KeyDiffItem.vue` (render single comparison row with color coding based on status, show values inline, emit add-key/edit-value events)
- [ ] T019-TEST [US1] [TEST] Write unit tests for KeyDiffItem in `tests/components/KeyDiffItem.test.js` (test rendering with different statuses, color coding, event emissions, aim for 90%+ coverage)
- [ ] T020 [US1] Implement ComparisonView component in `src/components/ComparisonView.vue` (side-by-side layout, two TreeViewer instances, accepts file1/file2/diffResults props, emits save-requested/prettify-requested/edit-made events)
- [ ] T020-TEST [US1] [TEST] Write unit tests for ComparisonView in `tests/components/ComparisonView.test.js` (test layout, TreeViewer integration, prop handling, event emissions, aim for 90%+ coverage)
- [ ] T021 [US1] Update `src/pages/Index.vue` to integrate FileUploader (two instances for file1/file2) and ComparisonView using Pinia stores (useFileStore), wire up file-loaded handlers to trigger fileStore.runComparison()
- [ ] T021-TEST [US1] [TEST] Write integration tests for Index.vue in `tests/pages/Index.test.js` (test FileUploader integration, store interactions, runComparison trigger, aim for 90%+ coverage)

**Checkpoint**: At this point, User Story 1 should be fully functional - users can upload two files and see color-coded comparison

---

## Phase 4: User Story 2 - Edit and Add Missing Keys (Priority: P1)

**Goal**: Allow users to inline-edit values and add missing keys directly in the comparison view

**Independent Test**: Load two files with a missing key (e.g., "app.welcome" missing in file1), click "add key" button on red-highlighted key, verify key is added to file1's data structure and highlighted yellow if values now match, or neutral if different

### Implementation for User Story 2

- [ ] T022 [P] [US2] Implement EditControls component in `src/components/EditControls.vue` (save button, prettify button, reset button, accept file/modified props, emit save/prettify/reset events, disable when not modified)
- [ ] T022-TEST [P] [US2] [TEST] Write unit tests for EditControls in `tests/components/EditControls.test.js` (test button states, event emissions, disabled states, aim for 90%+ coverage)
- [ ] T023 [US2] Add inline edit functionality to TreeViewer in `src/components/TreeViewer.vue` (contenteditable or input overlay on value click, emit value-edited event with keyPath/newValue/targetFile)
- [ ] T023-TEST [US2] [TEST] Update TreeViewer tests in `tests/components/TreeViewer.test.js` (test inline editing, value-edited event, keyPath tracking, aim for 90%+ coverage)
- [ ] T024 [US2] Add "add key" action to KeyDiffItem in `src/components/KeyDiffItem.vue` (button appears on missing-left/missing-right status, emit add-key event with keyPath/targetFile)
- [ ] T024-TEST [US2] [TEST] Update KeyDiffItem tests in `tests/components/KeyDiffItem.test.js` (test add key button visibility, add-key event, keyPath tracking, aim for 90%+ coverage)
- [ ] T025 [US2] Wire edit events to useEditStore in `src/pages/Index.vue` (call editStore.addEdit, editStore.applyEdit on add-key/value-edited events, re-run fileStore.runComparison after edits)
- [ ] T025-TEST [US2] [TEST] Update Index.vue tests in `tests/pages/Index.test.js` (test edit event wiring, store interactions, comparison re-run, aim for 90%+ coverage)
- [ ] T026 [US2] Add visual feedback for modified state in TreeViewer (e.g., asterisk or badge on modified keys, highlight modified values using editStore.file1Modified/file2Modified)
- [ ] T026-TEST [US2] [TEST] Update TreeViewer tests in `tests/components/TreeViewer.test.js` (test modified state indicators, visual feedback, aim for 90%+ coverage)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - users can view differences and make edits

---

## Phase 5: User Story 3 - Validate and Save Modified Files (Priority: P1)

**Goal**: Allow users to save updated files with proper JSON formatting and validation warnings

**Independent Test**: Make edits to file1, click save, verify downloaded file contains changes and is valid JSON; click prettify, verify file is reformatted with 2-space indentation and warning is displayed

### Implementation for User Story 3

- [ ] T027 [P] [US3] Implement prettify utility in `src/utils/prettifyJson.js` (format JSON with 2-space indentation using JSON.stringify)
- [ ] T027-TEST [P] [US3] [TEST] Write unit tests for prettifyJson in `tests/utils/prettifyJson.test.js` (test formatting, indentation, edge cases, aim for 90%+ coverage)
- [ ] T028 [P] [US3] Implement file download composable in `src/composables/useFileDownload.js` (downloadFile method using Blob API and createElement('a') with download attribute)
- [ ] T028-TEST [P] [US3] [TEST] Write unit tests for useFileDownload in `tests/composables/useFileDownload.test.js` (test Blob creation, download trigger, filename handling, aim for 90%+ coverage)
- [ ] T029 [US3] Wire EditControls save event to useFileDownload in `src/pages/Index.vue` (get file content from fileStore, convert to JSON string, trigger download with original filename)
- [ ] T029-TEST [US3] [TEST] Update Index.vue tests in `tests/pages/Index.test.js` (test save wiring, file content retrieval, download trigger, aim for 90%+ coverage)
- [ ] T030 [US3] Wire EditControls prettify event to prettifyJson in `src/pages/Index.vue` (apply formatting to file content in fileStore, update in-memory state, show warning modal about git diff impacts)
- [ ] T030-TEST [US3] [TEST] Update Index.vue tests in `tests/pages/Index.test.js` (test prettify wiring, state updates, modal display, aim for 90%+ coverage)
- [ ] T031 [US3] Create warning modal component in `src/components/PrettifyWarning.vue` (display "Prettification may cause extra git diff noise" message, OK/Cancel buttons)
- [ ] T031-TEST [US3] [TEST] Write unit tests for PrettifyWarning in `tests/components/PrettifyWarning.test.js` (test modal display, button clicks, event emissions, aim for 90%+ coverage)
- [ ] T032 [US3] Add file validation on upload in FileUploader (display error with line number if JSON.parse fails, show clear message with file size if exceeds 10MB)
- [ ] T032-TEST [US3] [TEST] Update FileUploader tests in `tests/components/FileUploader.test.js` (test validation error display, line number extraction, size error messages, aim for 90%+ coverage)

**Checkpoint**: All P1 user stories complete - MVP is fully functional for core workflow (upload, compare, edit, save)

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and enhance overall quality

- [ ] T042 [P] Add keyboard navigation to TreeViewer in `src/components/TreeViewer.vue` (arrow keys for navigation, Enter to expand/collapse, Tab for focus management)
- [ ] T042-TEST [P] [TEST] Update TreeViewer tests in `tests/components/TreeViewer.test.js` (test keyboard navigation, key bindings, focus management, aim for 90%+ coverage)
- [ ] T043 [P] Add responsive design styles to `src/style.css` (mobile layout: stacked instead of side-by-side, touch-friendly controls)
- [ ] T044 [P] Add accessibility attributes in all components (ARIA labels, roles, focus management, keyboard shortcuts)
- [ ] T044-TEST [P] [TEST] Add accessibility tests for all components in `tests/components/*.test.js` (test ARIA attributes, keyboard navigation, screen reader support, aim for 90%+ coverage)
- [ ] T045 [P] Add loading states to FileUploader in `src/components/FileUploader.vue` (spinner during file parsing, progress indicator for large files)
- [ ] T045-TEST [P] [TEST] Update FileUploader tests in `tests/components/FileUploader.test.js` (test loading state display, spinner visibility, aim for 90%+ coverage)
- [ ] T046 Add edge case handling for circular references in useJsonDiff in `src/composables/useJsonDiff.js` (detect cycles, display error instead of infinite loop)
- [ ] T046-TEST [TEST] Update useJsonDiff tests in `tests/composables/useJsonDiff.test.js` (test circular reference detection, error handling, aim for 90%+ coverage)
- [ ] T047 Add edge case handling for arrays in useJsonDiff in `src/composables/useJsonDiff.js` (compare array elements, show index-based keys in tree)
- [ ] T047-TEST [TEST] Update useJsonDiff tests in `tests/composables/useJsonDiff.test.js` (test array comparison, index-based keys, aim for 90%+ coverage)
- [ ] T048 Optimize TreeViewer for large files in `src/components/TreeViewer.vue` (implement virtual scrolling if performance < 3s for 1000 keys)
- [ ] T048-TEST [TEST] Add performance tests for TreeViewer in `tests/components/TreeViewer.test.js` (test rendering performance with large datasets, virtual scrolling, aim for 90%+ coverage)
- [ ] T049 Add JSDoc comments to all composables in `src/composables/` (document params, return types, usage examples)
- [ ] T050 Add JSDoc comments to all utilities in `src/utils/` (document pure functions, edge cases)
- [ ] T051 Add JSDoc comments to all Pinia stores in `src/stores/` (document state, actions, getters)
- [ ] T052 Run through quickstart.md validation scenarios in `specs/001-json-i18n-comparison/quickstart.md` (verify all examples work as documented)
- [ ] T053 [TEST] Run coverage report and ensure all modules achieve 90%+ coverage: `npm run test:coverage`

**Checkpoint**: All features complete with comprehensive test coverage

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Phase 2
  - User Story 2 (P1): Can start after Phase 2, but Task T019 depends on T010 (useJsonDiff) from US1
  - User Story 3 (P1): Can start after Phase 2
- **Polish (Phase 6)**: Depends on desired user stories being complete (minimally US1-US3 for MVP)

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories - can be fully completed independently
- **User Story 2 (P1)**: Depends on US1 T016 (useJsonDiff) for re-running comparison after edits
- **User Story 3 (P1)**: No dependencies on other stories - can be fully completed independently (but makes most sense after US2 for editing)

### Within Each User Story

- **US1**: T015-T016-T017 can run in parallel ([P]), then T018 depends on T017, T019 can run parallel with T018, T020 depends on T018 and T019, T021 depends on all previous
- **US2**: T022-T023-T024 can run in parallel ([P]), T025 depends on all three, T026 depends on T025
- **US3**: T027-T028-T031 can run in parallel ([P]), T029 depends on T028, T030 depends on T027 and T031, T032 can run parallel with others

### Parallel Opportunities

**Phase 1 (Setup)**:

- T001 must complete first (creates directories)
- T002 must complete second (installs and configures Pinia)
- T003, T004, T005, T006, T007 can run in parallel after T001 and T002

**Phase 2 (Foundational)**:

- T008 must complete first (keyCounter needed by useJsonParser)
- T009, T010, T012, T014 can run in parallel after T008 (2 Pinia stores can be created in parallel)
- T011 depends on T008, T009, T010

**Phase 3 (User Story 1)**:

```bash
# Launch in parallel:
T015: FileUploader component
T016: useJsonDiff composable
T017: TreeNode in TreeViewer

# Then after T017:
T018: Complete TreeViewer

# Then in parallel:
T019: KeyDiffItem component

# Then after T018 and T019:
T020: ComparisonView component

# Finally:
T021: Integrate in Index.vue with Pinia stores
```

**Phase 4 (User Story 2)**:

```bash
# Launch in parallel:
T022: EditControls component
T023: Inline edit in TreeViewer
T024: Add key action in KeyDiffItem

# Then after all three:
T025: Wire edit events to useEditStore in Index.vue
T026: Visual feedback for modified state
```

**Phase 5 (User Story 3)**:

```bash
# Launch in parallel:
T027: prettifyJson utility
T028: useFileDownload composable
T031: PrettifyWarning modal

# Then after T028:
T029: Wire save in Index.vue

# Then after T027 and T031:
T030: Wire prettify in Index.vue

# Can run anytime in parallel:
T032: File validation in FileUploader
```

**Phase 6 (Polish)** - All tasks T042-T053 can run in parallel (different concerns, different files)

---

## Parallel Example: User Story 1 Core Components

```bash
# Three developers can work simultaneously after Phase 2 completes:
Developer A: T015 "Implement FileUploader component in src/components/FileUploader.vue"
Developer B: T016 "Implement recursive diff algorithm in src/composables/useJsonDiff.js"
Developer C: T017 "Implement TreeNode component in src/components/TreeViewer.vue"

# All three can commit without conflicts (different files)
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Phase 1: Setup (T001-T007) - ~4-5 hours (includes Pinia setup)
2. Complete Phase 2: Foundational (T008-T014) - CRITICAL - ~3-4 days (includes 2 Pinia stores)
3. Complete Phase 3: User Story 1 (T015-T021) - ~5-7 days
4. **STOP and VALIDATE**: Upload two JSON files, verify comparison works
5. Complete Phase 4: User Story 2 (T022-T026) - ~2-3 days
6. **STOP and VALIDATE**: Make edits, verify state updates in Pinia stores
7. Complete Phase 5: User Story 3 (T027-T032) - ~2-3 days
8. **STOP and VALIDATE**: Save and download files, verify contents
9. **MVP COMPLETE**: Core workflow functional (~2 weeks total)

### Incremental Delivery

1. Setup + Foundational (Phase 1-2) → Foundation ready
2. Add User Story 1 (Phase 3) → Test independently → **Deploy Demo v0.1** (view-only comparison)
3. Add User Story 2 (Phase 4) → Test independently → **Deploy Demo v0.2** (editable comparison)
4. Add User Story 3 (Phase 5) → Test independently → **Deploy Demo v0.3 (MVP!)** (complete workflow)
5. Add Polish (Phase 6) → **Deploy v1.0** (production-ready)

### Parallel Team Strategy

With 3 developers:

1. **All Together**: Complete Setup + Foundational (Phase 1-2) - ~4 days (includes Pinia stores)
2. **After Foundational Complete**:
   - Developer A: User Story 1 (T015, T018, T021) + User Story 3 (T028, T029, T030)
   - Developer B: User Story 1 (T016) + User Story 2 (T022, T025, T026)
   - Developer C: User Story 1 (T017, T019, T020) + User Story 3 (T027, T031, T032)
3. **After US1-3 Complete**:
   - Developer A: Polish (T042-T044)
   - Developer B: Polish (T045-T047)
   - Developer C: Polish (T048-T053)

**Timeline with parallel work**: ~2 weeks to MVP, ~2.5 weeks to production-ready

---

## Summary

- **Total Tasks**: 73 tasks across 6 phases (36 implementation + 36 test + 1 coverage validation)
- **MVP Scope**: Phases 1-5 (User Stories 1-3) = 64 tasks (32 implementation + 32 test)
- **Full Feature Set**: All phases = 73 tasks
- **Estimated MVP Timeline**: 2-3 weeks (1 developer) or 1.5-2 weeks (3 developers parallel)
- **Estimated Full Timeline**: 3-3.5 weeks (1 developer) or 2-2.5 weeks (3 developers parallel)

### Task Count by User Story

- Setup: 7 implementation tasks
- Foundational: 10 tasks (5 implementation + 5 test) - includes 2 Pinia stores
- User Story 1 (P1): 14 tasks (7 implementation + 7 test) - Core comparison view
- User Story 2 (P1): 10 tasks (5 implementation + 5 test) - Editing functionality
- User Story 3 (P1): 12 tasks (6 implementation + 6 test) - Save and validation
- Polish: 21 tasks (11 implementation + 9 test + 1 coverage validation) - Quality improvements

### Test Strategy

- **Test Location**: All tests in `tests/` directory mirroring `src/` structure
- **Coverage Target**: 90%+ for all modules
- **Test Framework**: Vitest with Vue Test Utils
- **Test Types**: Unit tests for utilities/composables, component tests for Vue components, integration tests for pages
- **Test Tasks**: Marked with [TEST] tag - can be skipped if testing is not required, but recommended for quality
- **Coverage Validation**: Final task T053 runs coverage report to verify 90%+ threshold

### Notes on Testing

- All test tasks are marked with [TEST] tag for easy identification
- Test tasks follow immediately after their implementation tasks
- Tests can be skipped if not desired, but 90%+ coverage is recommended per coding guidelines
- Use Vitest for all testing: `npm run test` or `npm run test:coverage`
- Tests are in separate `tests/` directory to keep src clean
- Component tests should test rendering, props, events, and user interactions
- Store tests should test state management, actions, and getters
- Utility/composable tests should test all code paths and edge cases
