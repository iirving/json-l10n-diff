---
description: "Task list for JSON i18n Comparison and Diff Tool implementation"
---

# Tasks: JSON i18n Comparison and Diff Tool

**Input**: Design documents from `/specs/001-json-i18n-comparison/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/component-contracts.md

**Tests**: Tests are OPTIONAL for this project (per constitution). Test tasks are NOT included unless explicitly requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

- **Single-page web app**: `src/` at repository root
- All Vue components: `src/components/`
- All composables: `src/composables/`
- All utilities: `src/utils/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create directory structure: `src/components/`, `src/pages/`, `src/stores/`, `src/composables/`, `src/utils/`
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
- [x] T009 [P] Implement JSON validation utility in `src/utils/jsonValidator.js` (validate JSON, extract error line numbers from SyntaxError)
- [x] T010 [P] Implement key path utilities in `src/utils/keyPathUtils.js` (build dot-notation paths, split paths, navigate nested objects)
- [ ] T011 Implement JSON parser composable in `src/composables/useJsonParser.js` (parseFile, validateJson, getErrorLine methods using jsonValidator and keyCounter from utils)
- [ ] T012 [P] Create Pinia store `src/stores/useFileStore.js` (state: file1, file2, diffResults; actions: setFile1, setFile2, runComparison, reset)
- [ ] T013 [P] Create Pinia store `src/stores/useTierStore.js` (state: currentTier; actions: setTier, checkKeyLimit, loadTier; getters: keyLimit, tierDisplayName; persists to LocalStorage)
- [ ] T014 [P] Create Pinia store `src/stores/useEditStore.js` (state: editHistory Map, file1Modified, file2Modified; actions: addEdit, applyEdit, clearEdits)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View and Compare Basic i18n Files (Priority: P1) 🎯 MVP

**Goal**: Allow users to upload two JSON i18n files and visualize differences with color-coded highlights (red for missing keys, yellow for identical values, neutral for different values)

**Independent Test**: Upload two valid JSON files with nested keys (e.g., en.json with `{"app": {"title": "My App"}}` and fr.json with `{"app": {"title": "Mon App", "welcome": "Bienvenue"}}`), verify tree displays both files with correct highlighting (red for missing "welcome" in file1, neutral for "title" with different values)

### Implementation for User Story 1

- [ ] T015 [P] [US1] Implement FileUploader component in `src/components/FileUploader.vue` (file input, drag-and-drop, size validation ≤10MB, emit file-loaded/file-error events)
- [ ] T016 [P] [US1] Implement recursive diff algorithm in `src/composables/useJsonDiff.js` (compareFiles method returning KeyComparisonResult array with status: missing-left, missing-right, identical, different)
- [ ] T017 [US1] Implement TreeNode component in `src/components/TreeViewer.vue` (recursive rendering, expand/collapse state, accepts diffResults prop for color coding)
- [ ] T018 [US1] Implement TreeViewer component in `src/components/TreeViewer.vue` (orchestrates TreeNode recursion, exposes expandAll/collapseAll/scrollToKey methods, emits node-toggled events)
- [ ] T019 [US1] Implement KeyDiffItem component in `src/components/KeyDiffItem.vue` (render single comparison row with color coding based on status, show values inline, emit add-key/edit-value events)
- [ ] T020 [US1] Implement ComparisonView component in `src/components/ComparisonView.vue` (side-by-side layout, two TreeViewer instances, accepts file1/file2/diffResults props, emits save-requested/prettify-requested/edit-made events)
- [ ] T021 [US1] Update `src/pages/Index.vue` to integrate FileUploader (two instances for file1/file2) and ComparisonView using Pinia stores (useFileStore, useTierStore), wire up file-loaded handlers to trigger fileStore.runComparison()

**Checkpoint**: At this point, User Story 1 should be fully functional - users can upload two files and see color-coded comparison

---

## Phase 4: User Story 2 - Edit and Add Missing Keys (Priority: P1)

**Goal**: Allow users to inline-edit values and add missing keys directly in the comparison view

**Independent Test**: Load two files with a missing key (e.g., "app.welcome" missing in file1), click "add key" button on red-highlighted key, verify key is added to file1's data structure and highlighted yellow if values now match, or neutral if different

### Implementation for User Story 2

- [ ] T022 [P] [US2] Implement EditControls component in `src/components/EditControls.vue` (save button, prettify button, reset button, accept file/modified props, emit save/prettify/reset events, disable when not modified)
- [ ] T023 [US2] Add inline edit functionality to TreeViewer in `src/components/TreeViewer.vue` (contenteditable or input overlay on value click, emit value-edited event with keyPath/newValue/targetFile)
- [ ] T024 [US2] Add "add key" action to KeyDiffItem in `src/components/KeyDiffItem.vue` (button appears on missing-left/missing-right status, emit add-key event with keyPath/targetFile)
- [ ] T025 [US2] Wire edit events to useEditStore in `src/pages/Index.vue` (call editStore.addEdit, editStore.applyEdit on add-key/value-edited events, re-run fileStore.runComparison after edits)
- [ ] T026 [US2] Add visual feedback for modified state in TreeViewer (e.g., asterisk or badge on modified keys, highlight modified values using editStore.file1Modified/file2Modified)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - users can view differences and make edits

---

## Phase 5: User Story 3 - Validate and Save Modified Files (Priority: P1)

**Goal**: Allow users to save updated files with proper JSON formatting and validation warnings

**Independent Test**: Make edits to file1, click save, verify downloaded file contains changes and is valid JSON; click prettify, verify file is reformatted with 2-space indentation and warning is displayed

### Implementation for User Story 3

- [ ] T027 [P] [US3] Implement prettify utility in `src/utils/prettifyJson.js` (format JSON with 2-space indentation using JSON.stringify)
- [ ] T028 [P] [US3] Implement file download composable in `src/composables/useFileDownload.js` (downloadFile method using Blob API and createElement('a') with download attribute)
- [ ] T029 [US3] Wire EditControls save event to useFileDownload in `src/pages/Index.vue` (get file content from fileStore, convert to JSON string, trigger download with original filename)
- [ ] T030 [US3] Wire EditControls prettify event to prettifyJson in `src/pages/Index.vue` (apply formatting to file content in fileStore, update in-memory state, show warning modal about git diff impacts)
- [ ] T031 [US3] Create warning modal component in `src/components/PrettifyWarning.vue` (display "Prettification may cause extra git diff noise" message, OK/Cancel buttons)
- [ ] T032 [US3] Add file validation on upload in FileUploader (display error with line number if JSON.parse fails, show clear message with file size if exceeds 10MB)

**Checkpoint**: All P1 user stories complete - MVP is fully functional for core workflow (upload, compare, edit, save)

---

## Phase 6: User Story 4 - Work Within Free Tier Limits (Priority: P2)

**Goal**: Enforce tier-based key limits (Free: 20, Medium: 100, Enterprise: 1000) and display clear error messages when exceeded

**Independent Test**: Set tier to Free in LocalStorage, upload file with exactly 20 keys (success), upload file with 21 keys (rejection with error message showing key count and upgrade suggestion)

### Implementation for User Story 4

- [ ] T033 [P] [US4] Implement TierGate component in `src/components/TierGate.vue` (display tier limits from tierStore, current key count, blocking modal when limit exceeded, emit upgrade-requested/dismissed events)
- [ ] T034 [US4] Integrate useKeyCounter in FileUploader validation flow in `src/components/FileUploader.vue` (count keys on file parse, check against tier limit from tierStore.checkKeyLimit, emit file-error if exceeded)
- [ ] T035 [US4] Add key count display to ComparisonView in `src/components/ComparisonView.vue` (show "File 1: X keys / [tier limit]" and "File 2: Y keys / [tier limit]" badges using tierStore.keyLimit)
- [ ] T036 [US4] Add tier limit error messaging in FileUploader in `src/components/FileUploader.vue` (display "File exceeds Free tier limit of 20 keys. Current: 35 keys. Upgrade to Medium tier for up to 100 keys.")
- [ ] T037 [US4] Initialize default tier (Free) in `src/pages/Index.vue` using tierStore (call tierStore.loadTier() on mount to load from LocalStorage or default to free tier)

**Checkpoint**: Tier limits are enforced - users see clear feedback when files exceed their tier limits

---

## Phase 7: User Story 5 - Subscribe to Paid Tiers (Priority: P3)

**Goal**: Allow users to view tier options and select their subscription level (Free/Medium/Enterprise)

**Independent Test**: Open tier selection UI, select Medium tier, verify LocalStorage updated, upload file with 50 keys (success), verify key count display shows "50 / 100"

### Implementation for User Story 5

- [ ] T038 [P] [US5] Create TierSelector component in `src/components/TierSelector.vue` (pricing table showing all tiers, feature comparison, select tier buttons, emit tier-selected event)
- [ ] T039 [US5] Add tier selection UI to Index.vue in `src/pages/Index.vue` (settings button to open TierSelector modal, handle tier-selected event to call tierStore.setTier)
- [ ] T040 [US5] Add upgrade prompts to TierGate in `src/components/TierGate.vue` (when limit exceeded, show "Upgrade to Medium ($5/month)" or "Upgrade to Enterprise ($99/month)" CTAs)
- [ ] T041 [US5] Add current tier indicator to App header in `src/App.vue` (badge showing tierStore.tierDisplayName - "Free", "Medium", or "Enterprise")

**Checkpoint**: All user stories complete - full feature set implemented including monetization UI

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and enhance overall quality

- [ ] T042 [P] Add keyboard navigation to TreeViewer in `src/components/TreeViewer.vue` (arrow keys for navigation, Enter to expand/collapse, Tab for focus management)
- [ ] T043 [P] Add responsive design styles to `src/style.css` (mobile layout: stacked instead of side-by-side, touch-friendly controls)
- [ ] T044 [P] Add accessibility attributes in all components (ARIA labels, roles, focus management, keyboard shortcuts)
- [ ] T045 [P] Add loading states to FileUploader in `src/components/FileUploader.vue` (spinner during file parsing, progress indicator for large files)
- [ ] T046 Add edge case handling for circular references in useJsonDiff in `src/composables/useJsonDiff.js` (detect cycles, display error instead of infinite loop)
- [ ] T047 Add edge case handling for arrays in useJsonDiff in `src/composables/useJsonDiff.js` (compare array elements, show index-based keys in tree)
- [ ] T048 Optimize TreeViewer for large files in `src/components/TreeViewer.vue` (implement virtual scrolling if performance < 3s for 1000 keys)
- [ ] T049 Add JSDoc comments to all composables in `src/composables/` (document params, return types, usage examples)
- [ ] T050 Add JSDoc comments to all utilities in `src/utils/` (document pure functions, edge cases)
- [ ] T051 Add JSDoc comments to all Pinia stores in `src/stores/` (document state, actions, getters)
- [ ] T052 Run through quickstart.md validation scenarios in `specs/001-json-i18n-comparison/quickstart.md` (verify all examples work as documented)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Phase 2
  - User Story 2 (P1): Can start after Phase 2, but Task T019 depends on T010 (useJsonDiff) from US1
  - User Story 3 (P1): Can start after Phase 2
  - User Story 4 (P2): Can start after Phase 2, but T028 depends on T009 (FileUploader) from US1
  - User Story 5 (P3): Can start after Phase 2, but T035 depends on T027 (TierGate) from US4
- **Polish (Phase 8)**: Depends on desired user stories being complete (minimally US1-US3 for MVP)

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories - can be fully completed independently
- **User Story 2 (P1)**: Depends on US1 T013 (useJsonDiff) for re-running comparison after edits
- **User Story 3 (P1)**: No dependencies on other stories - can be fully completed independently (but makes most sense after US2 for editing)
- **User Story 4 (P2)**: Depends on US1 T012 (FileUploader) for integration
- **User Story 5 (P3)**: Depends on US4 T030 (TierGate) for upgrade prompts

### Within Each User Story

- **US1**: T015-T016-T017 can run in parallel ([P]), then T018 depends on T017, T019 can run parallel with T018, T020 depends on T018 and T019, T021 depends on all previous
- **US2**: T022-T023-T024 can run in parallel ([P]), T025 depends on all three, T026 depends on T025
- **US3**: T027-T028-T031 can run in parallel ([P]), T029 depends on T028, T030 depends on T027 and T031, T032 can run parallel with others
- **US4**: T033-T034 can run in parallel ([P]), T035-T036-T037 depend on T033-T034 completion
- **US5**: T038 runs first, T039 can run after T038, T040 depends on T038 and US4 T033, T041 depends on T039

### Parallel Opportunities

**Phase 1 (Setup)**:

- T001 must complete first (creates directories)
- T002 must complete second (installs and configures Pinia)
- T003, T004, T005, T006, T007 can run in parallel after T001 and T002

**Phase 2 (Foundational)**:

- T008 must complete first (useKeyCounter needed by useJsonParser)
- T009, T010, T012, T013, T014 can run in parallel after T008 (3 Pinia stores can be created in parallel)
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

**Phase 6 (User Story 4)**:

```bash
# Launch in parallel:
T033: TierGate component
T034: Integrate useKeyCounter in FileUploader

# Then after both:
T035: Key count display in ComparisonView
T036: Error messaging in FileUploader
T037: Initialize tier in Index.vue
```

**Phase 7 (User Story 5)**:

```bash
# First:
T038: TierSelector component

# Then in parallel:
T039: Tier selection UI in Index.vue

# Then after T038 and US4 T033:
T040: Upgrade prompts in TierGate

# Then after T039:
T041: Current tier indicator in App.vue
```

**Phase 8 (Polish)** - All tasks T042-T052 can run in parallel (different concerns, different files)

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
2. Complete Phase 2: Foundational (T008-T014) - CRITICAL - ~3-4 days (includes 3 Pinia stores)
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
5. Add User Story 4 (Phase 6) → Test independently → **Deploy v1.0** (with tier limits)
6. Add User Story 5 (Phase 7) → Test independently → **Deploy v1.1** (with tier selection)
7. Add Polish (Phase 8) → **Deploy v1.2** (production-ready)

### Parallel Team Strategy

With 3 developers:

1. **All Together**: Complete Setup + Foundational (Phase 1-2) - ~4 days (includes Pinia stores)
2. **After Foundational Complete**:
   - Developer A: User Story 1 (T015, T018, T021) + User Story 3 (T028, T029, T030)
   - Developer B: User Story 1 (T016) + User Story 2 (T022, T025, T026)
   - Developer C: User Story 1 (T017, T019, T020) + User Story 4 (T033-T037)
3. **After US1-4 Complete**:
   - Developer A: User Story 5 (T038-T041)
   - Developer B: Polish (T042-T047)
   - Developer C: Polish (T048-T052)

**Timeline with parallel work**: ~2 weeks to MVP, ~3 weeks to full feature set

---

## Summary

- **Total Tasks**: 52 tasks across 8 phases
- **MVP Scope**: Phases 1-5 (User Stories 1-3) = 32 tasks
- **Full Feature Set**: All phases = 52 tasks
- **Estimated MVP Timeline**: 2 weeks (1 developer) or 1 week (3 developers parallel)
- **Estimated Full Timeline**: 3-4 weeks (1 developer) or 2 weeks (3 developers parallel)

### Task Count by User Story

- Setup: 7 tasks (includes pages structure and Pinia setup)
- Foundational: 7 tasks (BLOCKS all stories - includes 3 Pinia stores)
- User Story 1 (P1): 7 tasks - Core comparison view
- User Story 2 (P1): 5 tasks - Editing functionality
- User Story 3 (P1): 6 tasks - Save and validation
- User Story 4 (P2): 5 tasks - Tier limits
- User Story 5 (P3): 4 tasks - Tier selection
- Polish: 11 tasks - Quality improvements

### Parallel Opportunities Identified

- **Phase 1**: 5 parallel tasks after directory creation and Pinia setup (T003-T007)
- **Phase 2**: 6 parallel tasks (utilities, composables, and 3 Pinia stores)
- **Phase 3 (US1)**: 3 initial parallel tasks (FileUploader, useJsonDiff, TreeNode)
- **Phase 4 (US2)**: 3 parallel tasks (EditControls, inline edit, add key action)
- **Phase 5 (US3)**: 4 parallel tasks (utilities, modal, validation)
- **Phase 6 (US4)**: 2 initial parallel tasks
- **Phase 7 (US5)**: 1 parallel task after TierSelector
- **Phase 8**: All 11 polish tasks can run in parallel

### Independent Test Criteria

Each user story has clear acceptance criteria:

- **US1**: Upload two files → See color-coded comparison
- **US2**: Click add key on missing key → Key added to target file
- **US3**: Make edits → Save → Downloaded file contains changes
- **US4**: Upload 21-key file on Free tier → Error with upgrade message
- **US5**: Select Medium tier → Upload 50-key file → Success

### Suggested MVP Scope

**Minimum Viable Product**: User Stories 1-3 (Phases 1-5, tasks T001-T032)

This delivers complete core workflow:

1. Upload two JSON i18n files
2. View color-coded comparison
3. Edit values and add missing keys
4. Save modified files
5. Navigate between main app and About page
6. Reactive state management with Pinia stores

**Time to MVP**: ~2 weeks (solo) or ~1 week (team of 3)

---

## Notes

- [P] tasks = different files, no dependencies within same phase
- [Story] label (US1, US2, etc.) maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Tests are NOT included per constitution (only if explicitly requested)
- Commit after each task or logical group
- Stop at each checkpoint to validate story independently
- FileUploader and TreeViewer are shared across multiple stories but developed in US1
- Tier system (US4-US5) is separable from core functionality (US1-US3)
- Pages structure added: Index.vue (main app) and About.vue (static info)
- App.vue now handles simple client-side navigation between pages
- **Pinia stores centralize state management**: useFileStore (files/comparison), useTierStore (tiers), useEditStore (edits)
