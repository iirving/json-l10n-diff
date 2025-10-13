# Research & Technical Decisions

**Feature**: JSON i18n Comparison and Diff Tool
**Date**: October 13, 2025
**Status**: Complete

## Overview

This document captures research findings and technical decisions for implementing the JSON i18n comparison tool. All decisions are informed by the project constitution, existing technology stack (Vue 3 + Vite), and the requirement for client-side-only processing.

---

## Decision 1: JSON Diff Algorithm

**Decision**: Implement custom recursive diff algorithm with path tracking

**Rationale**:

- No external dependency needed (aligns with constitution's dependency policy)
- Full control over diff output format for color-coding requirements
- Can optimize for i18n-specific patterns (flat vs nested keys)
- Native JavaScript sufficient for required functionality

**Algorithm Approach**:

```
1. Parse both JSON files into objects
2. Recursively traverse both structures simultaneously
3. Track full key path at each level (e.g., "user.profile.name")
4. Classify each key as: missing-left, missing-right, identical, different
5. Return array of comparison results with metadata
```

**Alternatives Considered**:

- **json-diff npm package**: Rejected - adds dependency, output format not suitable for UI requirements
- **Deep-diff library**: Rejected - adds dependency, too general-purpose
- **Text-based diff**: Rejected - loses semantic understanding of JSON structure

**Performance Notes**:

- Time complexity: O(n) where n = total keys across both files
- Space complexity: O(n) for storing comparison results
- Suitable for up to 1000 keys per constitution constraints

---

## Decision 2: Tree Visualization Component

**Decision**: Build custom collapsible tree using Vue components with virtual scrolling consideration

**Rationale**:

- Vue's reactivity handles expand/collapse state elegantly
- Full control over styling for red/yellow/neutral highlighting
- Can implement keyboard navigation for accessibility
- Recursive component pattern natural fit for nested JSON

**Component Structure**:

```
TreeViewer (root)
  └─ TreeNode (recursive)
      ├─ Expand/collapse control
      ├─ Key display with highlighting
      ├─ Value display (if leaf node)
      └─ Child TreeNode components (if parent)
```

**Alternatives Considered**:

- **vue-json-tree-view**: Rejected - adds dependency, limited customization
- **Flat list with indentation**: Rejected - harder to implement expand/collapse, less intuitive
- **HTML <details> elements**: Rejected - limited styling control, accessibility concerns

**Optimization Strategy**:

- Initially render all nodes (1000 keys acceptable for modern browsers)
- If performance issues emerge, implement virtual scrolling (only render visible nodes)
- Defer optimization until actual performance testing (YAGNI principle)

---

## Decision 3: File Upload and Validation

**Decision**: Use native File API with immediate validation feedback

**Rationale**:

- No dependency needed - File API widely supported
- Can validate file size before reading (10 MB limit)
- Can provide line-number error messages using JSON.parse error position
- Drag-and-drop enhances UX without additional libraries

**Validation Flow**:

```
1. Check file size <= 10 MB (reject immediately if over)
2. Check file extension is .json (warn if not, allow override)
3. Read file content using FileReader API
4. Parse with JSON.parse wrapped in try-catch
5. Extract line number from SyntaxError message if parsing fails
6. Count keys using recursive traversal
7. Check against tier limit
8. Display specific error or proceed to display
```

**Error Message Examples** (per constitution's specific error requirement):

- "File exceeds 10 MB limit. Current size: 12.3 MB. Please reduce file size."
- "Invalid JSON at line 42: Unexpected token '}'. Check for missing comma or bracket."
- "File exceeds Free tier limit of 20 keys. Current: 35 keys. Upgrade to Medium tier."

**Alternatives Considered**:

- **FileReader with progress events**: Deferred - not needed for <10 MB files
- **Web Workers for parsing**: Deferred - unlikely to block UI for target file sizes
- **Streaming JSON parser**: Rejected - adds complexity, not needed for size constraints

---

## Decision 4: Key Counting Algorithm

**Decision**: Recursive depth-first traversal counting all keys including parent objects

**Rationale**:

- Clarification confirmed: count every key in hierarchy path
- Example: `{"user": {"profile": {"name": "John"}}}` = 3 keys ("user", "profile", "name")
- Simple recursive implementation, O(n) time complexity
- Can short-circuit if limit exceeded for efficiency

**Algorithm**:

```javascript
function countKeys(obj, count = 0) {
  for (const key in obj) {
    count++; // Count this key
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      count = countKeys(obj[key], count); // Recurse for nested objects
    }
  }
  return count;
}
```

**Edge Cases Handled**:

- Null values: Not counted as objects (explicit null check)
- Arrays: Each array element's keys counted separately
- Empty objects: Parent key still counted
- Circular references: Prevented by JSON.parse (throws error)

---

## Decision 5: State Management

**Decision**: Vue 3 reactive state with composables (no Vuex/Pinia)

**Rationale**:

- Simple single-page app doesn't need global state library
- Composition API provides sufficient reactivity
- Composables encapsulate state logic for reusability
- Follows constitution's simplicity principle

**State Structure**:

```javascript
// In ComparisonView component or composable
const file1 = ref(null);           // Parsed JSON object
const file2 = ref(null);           // Parsed JSON object
const diffResults = ref([]);       // Array of comparison results
const editHistory = ref(new Map()); // Track changes for save
const currentTier = ref('free');   // User's subscription tier
```

**Alternatives Considered**:

- **Pinia**: Rejected - overkill for single-page app, adds dependency
- **Vuex**: Rejected - deprecated in favor of Pinia, adds complexity
- **Local component state only**: Rejected - harder to share between components

---

## Decision 6: File Download Strategy

**Decision**: Use Blob API with dynamically generated URLs

**Rationale**:

- Native browser API, no dependency needed
- Supports all modern browsers
- Can prettify JSON with JSON.stringify(obj, null, 2)
- Triggers browser's download UI automatically

**Implementation**:

```javascript
function downloadFile(jsonObject, filename) {
  const jsonString = JSON.stringify(jsonObject, null, 2); // 2-space indent
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url); // Clean up memory
}
```

**Alternatives Considered**:

- **FileSaver.js**: Rejected - adds dependency, native API sufficient
- **Data URLs**: Rejected - size limitations, less efficient than Blob URLs
- **Server-side generation**: Rejected - violates client-side-only requirement

---

## Decision 7: Prettify Warning Implementation

**Decision**: Modal dialog with "Don't show again" checkbox

**Rationale**:

- Clear, visible warning per requirements
- User can dismiss permanently to avoid annoyance
- Preference stored in LocalStorage
- Accessible with keyboard navigation

**Warning Text**:
> "Prettifying will reformat the JSON with consistent spacing. This may create additional lines in git diffs, making it harder to see actual translation changes. Proceed with prettify?"

**Alternatives Considered**:

- **Inline banner**: Rejected - less prominent, easier to miss
- **Tooltip on hover**: Rejected - not accessible, easy to miss on mobile
- **Always show warning**: Rejected - annoying for repeat users

---

## Decision 8: Tier Management (P2/P3 Feature)

**Decision**: Client-side tier simulation with LocalStorage

**Rationale**:

- MVP doesn't require real payment integration
- LocalStorage allows testing tier limits without backend
- Real payment integration deferred to later phase
- Can swap to API calls when backend added

**Tier Storage**:

```javascript
// Store in LocalStorage
{
  tier: 'free' | 'medium' | 'enterprise',
  keyLimit: 20 | 100 | 1000,
  // Future: subscriptionId, expiryDate, etc.
}
```

**Alternatives Considered**:

- **Hard-coded free tier only**: Rejected - requirement specifies tier system
- **Mock payment flow**: Deferred - not needed for MVP testing
- **Backend integration now**: Rejected - premature, violates YAGNI

---

## Decision 9: Accessibility Strategy

**Decision**: Semantic HTML + ARIA attributes + keyboard navigation

**Rationale**:

- Constitution requires accessibility consideration
- Screen reader compatibility important for developer tools
- Keyboard navigation essential for power users
- No additional dependencies needed

**Implementation Points**:

- Tree nodes use `<button>` for expand/collapse (keyboard accessible)
- Edit controls have clear `aria-label` attributes
- File upload has visible label (not just icon)
- Color coding supplemented with icons (not color-only)
- Focus management for modal dialogs
- Skip links for screen readers

**Testing Strategy**:

- Manual keyboard navigation testing
- Screen reader testing with NVDA/JAWS (if available)
- Lighthouse accessibility audit (target: 90+ score)

---

## Decision 10: Browser Compatibility

**Decision**: Target modern evergreen browsers (last 2 versions)

**Rationale**:

- Developer tool for technical users with modern browsers
- Simplifies development (no polyfills needed)
- Vue 3 already requires modern browsers
- File API, Blob API, ES6+ widely supported

**Supported Browsers**:

- Chrome 115+ (current: 131)
- Firefox 115+ (current: 132)
- Safari 16.5+ (current: 18)
- Edge 115+ (current: 131)

**Unsupported**:

- Internet Explorer (any version)
- Chrome <115, Firefox <115, Safari <16.5
- Mobile browsers (initial version - can add responsive design later)

**Testing Strategy**:

- Primary development: Chrome
- Cross-browser testing: Firefox, Safari, Edge before release
- BrowserStack or similar for automated testing (if available)

---

## Implementation Priorities

Based on user story priorities from spec:

### Phase 1 (P1 - Core MVP)

1. File upload with validation (US1)
2. JSON parsing and tree display (US1)
3. Diff algorithm and color highlighting (US1)
4. Inline editing capabilities (US2)
5. Add missing key functionality (US2)
6. Save/download modified files (US3)
7. Prettify with warning (US3)

### Phase 2 (P2 - Business Logic)

8. Tier limit enforcement (US4)
9. Key counter with all-keys-inclusive logic (US4)
10. Tier limit UI messaging (US4)

### Phase 3 (P3 - Monetization)

11. Tier selection UI (US5)
12. Subscription information display (US5)
13. Upgrade prompts and CTAs (US5)

---

## Open Questions / Future Considerations

**For Implementation Phase**:

- [ ] Should tree nodes be collapsed or expanded by default?
- [ ] Should there be a "expand all" / "collapse all" control?
- [ ] What icons to use for red/yellow highlighting (supplement color)?
- [ ] Should edit history be clearable without page refresh?

**For Future Versions** (out of scope for MVP):

- Command-line version architecture
- Electron app packaging
- VS Code extension integration
- Payment provider selection and integration
- Backend API design for tier management

---

## Dependencies Summary

**Production**:

- Vue 3.5.22 (already installed)
- No additional dependencies needed for MVP

**Development**:

- Vite (Rolldown variant) 7.1.14 (already installed)
- @vitejs/plugin-vue 6.0.1 (already installed)
- Vitest (only if tests explicitly requested)

**Rationale**: All MVP features achievable with native browser APIs and Vue 3. This aligns with constitution's dependency minimization principle and keeps bundle size small.

---

## Conclusion

All technical decisions support the MVP requirements while adhering to the project constitution. The architecture is simple, testable, and extensible for future enhancements (CLI, Electron, VS Code extension). No critical unknowns remain that would block implementation.

**Ready to proceed to Phase 1: Design & Contracts**
