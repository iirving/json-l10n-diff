# Component Contracts

**Feature**: JSON i18n Comparison and Diff Tool
**Date**: October 13, 2025
**Type**: Vue 3 Component Interface Specifications

## Overview

Since this is a client-side-only application, there are no REST/GraphQL APIs. Instead, this document defines the contracts (props, emits, exposed methods) for Vue 3 components and composables. These contracts ensure components can be developed and tested independently.

---

## Page Components

### Index.vue (Main Application Page)

**Purpose**: Main page that hosts the JSON comparison tool functionality

**Location**: `src/pages/Index.vue`

**Props**: None (root page)

**State**:

- `file1`: Ref<JsonFile | null> - First uploaded file
- `file2`: Ref<JsonFile | null> - Second uploaded file
- `diffResults`: Ref<KeyComparisonResult[]> - Comparison results

**Child Components Used**:

- FileUploader (x2)
- ComparisonView
- EditControls
- TierGate

**Note**: This page contains the core application logic previously in App.vue

---

### About.vue (About/Documentation Page)

**Purpose**: Static informational page about the tool, features, and pricing

**Location**: `src/pages/About.vue`

**Props**: None (root page)

**Content Sections**:

- Features list (color-coded highlights explanation)
- Pricing tiers table (Free/Medium/Enterprise)
- How It Works guide
- Technical details (client-side processing, file size limits)

**Note**: This is a static content page with no interactive functionality

---

## Core Components

### 1. FileUploader Component

### Purpose

Handles file selection, validation, and parsing for JSON i18n files.

### Props

```typescript
interface FileUploaderProps {
  /** Which file slot this uploader represents */
  fileId: 'file1' | 'file2';

  /** Current user tier for validation */
  tier: UserTier;

  /** Label text for the upload button */
  label?: string; // default: "Upload JSON File"

  /** Accept attribute for file input */
  accept?: string; // default: ".json,application/json"

  /** Maximum file size in bytes */
  maxSize?: number; // default: 10485760 (10 MB)
}
```

### Emits

```typescript
interface FileUploaderEmits {
  /** Emitted when file successfully parsed and validated */
  'file-loaded': (file: JsonFile) => void;

  /** Emitted when validation fails */
  'file-error': (error: ValidationError) => void;

  /** Emitted when upload is cancelled */
  'upload-cancelled': () => void;
}
```

### Exposed Methods

```typescript
interface FileUploaderExposed {
  /** Programmatically trigger file input click */
  triggerUpload(): void;

  /** Clear current file */
  clearFile(): void;

  /** Get current upload status */
  getStatus(): 'idle' | 'uploading' | 'validating' | 'success' | 'error';
}
```

### Usage Example

```vue
<FileUploader
  file-id="file1"
  :tier="currentTier"
  label="Upload First File"
  @file-loaded="handleFile1Loaded"
  @file-error="handleUploadError"
/>
```

---

## 2. TreeViewer Component

### Purpose

Displays JSON structure as an interactive, collapsible tree.

### Props

```typescript
interface TreeViewerProps {
  /** JSON content to display */
  content: object;

  /** File identifier for context */
  fileId: 'file1' | 'file2';

  /** Comparison results for color coding */
  diffResults?: KeyComparisonResult[];

  /** Initial expansion state */
  defaultExpanded?: boolean; // default: true

  /** Enable inline editing */
  editable?: boolean; // default: false
}
```

### Emits

```typescript
interface TreeViewerEmits {
  /** Emitted when user clicks add key button */
  'add-key-requested': (keyPath: string, targetFile: 'file1' | 'file2') => void;

  /** Emitted when user edits a value */
  'value-edited': (keyPath: string, newValue: any, targetFile: 'file1' | 'file2') => void;

  /** Emitted when user expands/collapses a node */
  'node-toggled': (keyPath: string, expanded: boolean) => void;
}
```

### Exposed Methods

```typescript
interface TreeViewerExposed {
  /** Expand all nodes */
  expandAll(): void;

  /** Collapse all nodes */
  collapseAll(): void;

  /** Scroll to specific key path */
  scrollToKey(keyPath: string): void;

  /** Get current expansion state */
  getExpansionState(): Record<string, boolean>;
}
```

### Usage Example

```vue
<TreeViewer
  :content="file1Content"
  file-id="file1"
  :diff-results="comparisonResults"
  :editable="true"
  @add-key-requested="handleAddKey"
  @value-edited="handleValueEdit"
/>
```

---

## 3. ComparisonView Component

### Purpose

Orchestrates the comparison UI, managing two tree viewers side-by-side.

### Props

```typescript
interface ComparisonViewProps {
  /** First JSON file */
  file1: JsonFile | null;

  /** Second JSON file */
  file2: JsonFile | null;

  /** Comparison results */
  diffResults: KeyComparisonResult[];

  /** Layout mode */
  layout?: 'side-by-side' | 'stacked'; // default: 'side-by-side'
}
```

### Emits

```typescript
interface ComparisonViewEmits {
  /** Emitted when user requests to save a file */
  'save-requested': (fileId: 'file1' | 'file2') => void;

  /** Emitted when user requests to prettify a file */
  'prettify-requested': (fileId: 'file1' | 'file2') => void;

  /** Emitted when user makes an edit */
  'edit-made': (operation: EditOperation) => void;
}
```

### Exposed Methods

```typescript
interface ComparisonViewExposed {
  /** Refresh comparison (re-run diff) */
  refreshComparison(): void;

  /** Focus on specific key in both views */
  focusKey(keyPath: string): void;
}
```

### Usage Example

```vue
<ComparisonView
  :file1="file1"
  :file2="file2"
  :diff-results="diffResults"
  @save-requested="handleSave"
  @prettify-requested="handlePrettify"
  @edit-made="handleEdit"
/>
```

---

## 4. KeyDiffItem Component

### Purpose

Renders a single key comparison row with appropriate color coding and controls.

### Props

```typescript
interface KeyDiffItemProps {
  /** Comparison result data */
  comparison: KeyComparisonResult;

  /** Enable edit controls */
  editable?: boolean; // default: true

  /** Show values inline */
  showValues?: boolean; // default: true
}
```

### Emits

```typescript
interface KeyDiffItemEmits {
  /** Emitted when add key button clicked */
  'add-key': (keyPath: string, targetFile: 'file1' | 'file2') => void;

  /** Emitted when edit button clicked */
  'edit-value': (keyPath: string, currentValue: any, targetFile: 'file1' | 'file2') => void;
}
```

### Usage Example

```vue
<KeyDiffItem
  :comparison="result"
  :editable="true"
  @add-key="handleAddKey"
  @edit-value="handleEditValue"
/>
```

---

## 5. EditControls Component

### Purpose

Provides save, prettify, and other file operation controls.

### Props

```typescript
interface EditControlsProps {
  /** File being controlled */
  file: JsonFile;

  /** Has file been modified? */
  modified: boolean;

  /** Show prettify button */
  showPrettify?: boolean; // default: true

  /** Disable controls */
  disabled?: boolean; // default: false
}
```

### Emits

```typescript
interface EditControlsEmits {
  /** Emitted when save button clicked */
  'save': () => void;

  /** Emitted when prettify button clicked */
  'prettify': () => void;

  /** Emitted when reset button clicked */
  'reset': () => void;
}
```

### Usage Example

```vue
<EditControls
  :file="file1"
  :modified="file1Modified"
  @save="handleSave"
  @prettify="handlePrettify"
  @reset="handleReset"
/>
```

---

## 6. TierGate Component

### Purpose

Displays tier limits, usage, and upgrade prompts.

### Props

```typescript
interface TierGateProps {
  /** Current tier */
  tier: UserTier;

  /** Current key count */
  currentKeyCount: number;

  /** Show as blocking modal */
  blocking?: boolean; // default: false

  /** Show upgrade CTA */
  showUpgrade?: boolean; // default: true
}
```

### Emits

```typescript
interface TierGateEmits {
  /** Emitted when user clicks upgrade button */
  'upgrade-requested': (targetTier: 'medium' | 'enterprise') => void;

  /** Emitted when user dismisses gate */
  'dismissed': () => void;
}
```

### Usage Example

```vue
<TierGate
  :tier="currentTier"
  :current-key-count="file1.keyCount"
  :blocking="true"
  @upgrade-requested="handleUpgrade"
/>
```

---

## Composables Contracts

### useJsonParser

```typescript
interface UseJsonParser {
  /**
   * Parse and validate JSON file
   * @param file - Raw File object from input
   * @param tier - Current user tier for validation
   * @returns Parsed JsonFile or ValidationError
   */
  parseFile(file: File, tier: UserTier): Promise<JsonFile | ValidationError>;

  /**
   * Validate JSON string
   * @param jsonString - JSON content as string
   * @returns true if valid, ValidationError if invalid
   */
  validateJson(jsonString: string): true | ValidationError;

  /**
   * Get error line number from SyntaxError
   * @param error - SyntaxError from JSON.parse
   * @returns Line number or null
   */
  getErrorLine(error: SyntaxError): number | null;
}
```

### useJsonDiff

```typescript
interface UseJsonDiff {
  /**
   * Compare two JSON objects
   * @param obj1 - First JSON object
   * @param obj2 - Second JSON object
   * @returns Array of comparison results
   */
  compareObjects(obj1: object, obj2: object): KeyComparisonResult[];

  /**
   * Get comparison status for specific key
   * @param keyPath - Dot-notation key path
   * @returns Comparison result or null if not found
   */
  getKeyStatus(keyPath: string): KeyComparisonResult | null;

  /**
   * Filter results by status
   * @param status - Status to filter by
   * @returns Filtered comparison results
   */
  filterByStatus(status: KeyComparisonResult['status']): KeyComparisonResult[];
}
```

### useKeyCounter

```typescript
interface UseKeyCounter {
  /**
   * Count all keys including parent objects
   * @param obj - JSON object to count
   * @returns Total key count
   */
  countKeys(obj: object): number;

  /**
   * Count keys with early exit if limit exceeded
   * @param obj - JSON object to count
   * @param limit - Stop counting after this many keys
   * @returns Key count or -1 if limit exceeded
   */
  countKeysWithLimit(obj: object, limit: number): number;

  /**
   * Check if key count exceeds tier limit
   * @param obj - JSON object to validate
   * @param tier - User tier with key limit
   * @returns true if within limit, ValidationError if exceeds
   */
  validateKeyCount(obj: object, tier: UserTier): true | ValidationError;
}
```

### useFileDownload

```typescript
interface UseFileDownload {
  /**
   * Download JSON object as file
   * @param jsonObject - Object to download
   * @param filename - Target filename
   * @param prettify - Apply 2-space formatting
   */
  downloadJson(jsonObject: object, filename: string, prettify?: boolean): void;

  /**
   * Prettify JSON with warning check
   * @param jsonObject - Object to prettify
   * @returns Prettified string
   */
  prettifyJson(jsonObject: object): string;

  /**
   * Check if user has dismissed prettify warning
   * @returns true if warning should be shown
   */
  shouldShowPrettifyWarning(): boolean;

  /**
   * Dismiss prettify warning permanently
   */
  dismissPrettifyWarning(): void;
}
```

### useTierManager

```typescript
interface UseTierManager {
  /**
   * Get current user tier from LocalStorage
   * @returns Current tier
   */
  getCurrentTier(): Ref<UserTier>;

  /**
   * Set user tier (LocalStorage persistence)
   * @param tier - New tier level
   */
  setTier(tier: 'free' | 'medium' | 'enterprise'): void;

  /**
   * Check if operation allowed for current tier
   * @param keyCount - Number of keys in file
   * @returns true if allowed, ValidationError if not
   */
  checkTierLimit(keyCount: number): true | ValidationError;

  /**
   * Get all available tiers
   * @returns Array of all tier definitions
   */
  getAllTiers(): UserTier[];
}
```

---

## Utility Functions Contracts

### jsonValidator.js

```typescript
/**
 * Validate JSON file format and content
 * @param file - File object from input
 * @returns ValidationError or null if valid
 */
export function validateFileFormat(file: File): ValidationError | null;

/**
 * Parse JSON with detailed error information
 * @param jsonString - JSON string to parse
 * @returns Parsed object or ValidationError
 */
export function safeJsonParse(jsonString: string): object | ValidationError;

/**
 * Extract line number from JSON SyntaxError
 * @param error - SyntaxError from JSON.parse
 * @returns Line number or null
 */
export function extractErrorLine(error: SyntaxError): number | null;
```

### keyPathUtils.js

```typescript
/**
 * Convert array path to dot notation
 * @param path - Array of keys
 * @returns Dot-notation string
 * @example ['user', 'profile', 'name'] => 'user.profile.name'
 */
export function pathArrayToDotNotation(path: string[]): string;

/**
 * Convert dot notation to array path
 * @param dotPath - Dot-notation path
 * @returns Array of keys
 * @example 'user.profile.name' => ['user', 'profile', 'name']
 */
export function dotNotationToPathArray(dotPath: string): string[];

/**
 * Get value at path in object
 * @param obj - Object to traverse
 * @param path - Dot-notation or array path
 * @returns Value at path or undefined
 */
export function getValueAtPath(obj: object, path: string | string[]): any;

/**
 * Set value at path in object (immutable)
 * @param obj - Object to update
 * @param path - Dot-notation or array path
 * @param value - Value to set
 * @returns New object with value set
 */
export function setValueAtPath(obj: object, path: string | string[], value: any): object;

/**
 * Check if path exists in object
 * @param obj - Object to check
 * @param path - Dot-notation or array path
 * @returns true if path exists
 */
export function hasPath(obj: object, path: string | string[]): boolean;
```

### prettifyJson.js

```typescript
/**
 * Format JSON with 2-space indentation
 * @param obj - Object to format
 * @returns Formatted JSON string
 */
export function prettify(obj: object): string;

/**
 * Minify JSON (remove whitespace)
 * @param obj - Object to minify
 * @returns Minified JSON string
 */
export function minify(obj: object): string;

/**
 * Compare two JSON strings ignoring formatting
 * @param json1 - First JSON string
 * @param json2 - Second JSON string
 * @returns true if structurally equal
 */
export function jsonEquals(json1: string, json2: string): boolean;
```

---

## Error Handling Contract

All components and composables must handle errors consistently:

### Error Response Format

```typescript
interface ErrorResponse {
  /** Error code from ValidationError.code */
  code: string;

  /** User-friendly message */
  message: string;

  /** Additional context */
  details?: object;

  /** Severity level */
  severity: 'error' | 'warning';

  /** Suggested action */
  action?: string;
}
```

### Error Emission Pattern

```typescript
// Components emit errors, don't throw
emit('error', {
  code: 'FILE_TOO_LARGE',
  message: 'File exceeds 10 MB limit. Current size: 12.3 MB.',
  details: { actualSize: 12.3, limit: 10 },
  severity: 'error',
  action: 'Please reduce file size and try again.'
});
```

### Error Display

All errors must be displayed via a global error handler or toast notification system.

---

## Testing Contracts

Each component/composable must export test utilities:

```typescript
// For each component
export function createTestProps(): ComponentProps;
export function createMockEmits(): MockEmitFn;

// For each composable
export function createMockContext(): ComposableContext;
```

---

## Conclusion

These contracts define clear boundaries between components and composables, enabling independent development and testing. All contracts follow Vue 3 Composition API patterns and align with the project constitution's emphasis on simplicity and testability.

**Next: Generate quickstart.md for developers**
