# Data Model

**Feature**: JSON i18n Comparison and Diff Tool
**Date**: October 13, 2025
**Status**: Complete

## Overview

This document defines the data structures and entities used throughout the application. Since this is a client-side-only application, all data is ephemeral (held in browser memory during session) or persisted in LocalStorage for user preferences.

---

## Core Entities

### 1. JsonFile

Represents an uploaded JSON i18n file in memory.

**Properties**:

| Property     | Type    | Required | Description                     | Validation                           |
| ------------ | ------- | -------- | ------------------------------- | ------------------------------------ |
| `id`         | string  | Yes      | Unique identifier (file1/file2) | Must be 'file1' or 'file2'           |
| `name`       | string  | Yes      | Original filename               | Must end with .json (warning if not) |
| `size`       | number  | Yes      | File size in bytes              | Must be <= 1048576 (1 MB)            |
| `content`    | object  | Yes      | Parsed JSON object              | Valid JSON structure                 |
| `keyCount`   | number  | Yes      | Total keys (including parents)  | Calculated, >= 0                     |
| `uploadedAt` | Date    | Yes      | Upload timestamp                | ISO 8601 format                      |
| `modified`   | boolean | No       | Has user made edits?            | Default: false                       |

**State Lifecycle**:

```
null → uploaded → validated → parsed → displayed → [edited] → saved/downloaded
```

**Example**:

```json
{
  "id": "file1",
  "name": "en.json",
  "size": 2048,
  "content": {
    "app": {
      "title": "My App",
      "welcome": "Welcome"
    },
    "errors": {
      "notFound": "Not found"
    }
  },
  "keyCount": 5,
  "uploadedAt": "2025-10-13T10:30:00Z",
  "modified": false
}
```

**Notes**:

- `keyCount` includes all keys: "app", "title", "welcome", "errors", "notFound" = 5 keys
- `content` is the actual JavaScript object (not stringified)
- `modified` flag triggers save button enabled state

---

### 2. KeyComparisonResult

Represents the comparison result for a single key path across two files.

**Properties**:

| Property     | Type    | Required | Description                | Validation                                                |
| ------------ | ------- | -------- | -------------------------- | --------------------------------------------------------- |
| `keyPath`    | string  | Yes      | Dot-notation path          | e.g., "user.profile.name"                                 |
| `status`     | enum    | Yes      | Comparison status          | One of: missing-left, missing-right, identical, different |
| `valueLeft`  | any     | No       | Value in file1 (if exists) | Any JSON-serializable value                               |
| `valueRight` | any     | No       | Value in file2 (if exists) | Any JSON-serializable value                               |
| `depth`      | number  | Yes      | Nesting depth              | >= 0                                                      |
| `isLeaf`     | boolean | Yes      | Is this a leaf node?       | true if value is not object/array                         |
| `parentPath` | string  | No       | Parent key path            | null for root-level keys                                  |

**Status Values**:

- **missing-left**: Key exists in file2 but not file1 (highlight red on left)
- **missing-right**: Key exists in file1 but not file2 (highlight red on right)
- **identical**: Key exists in both files with exact same value (highlight yellow)
- **different**: Key exists in both files with different values (neutral/default color)

**Example**:

```json
[
  {
    "keyPath": "app.title",
    "status": "different",
    "valueLeft": "My App",
    "valueRight": "Mon App",
    "depth": 2,
    "isLeaf": true,
    "parentPath": "app"
  },
  {
    "keyPath": "app.welcome",
    "status": "identical",
    "valueLeft": "Welcome",
    "valueRight": "Welcome",
    "depth": 2,
    "isLeaf": true,
    "parentPath": "app"
  },
  {
    "keyPath": "errors.notFound",
    "status": "missing-right",
    "valueLeft": null,
    "valueRight": "Not found",
    "depth": 2,
    "isLeaf": true,
    "parentPath": "errors"
  }
]
```

**Notes**:

- Results are flat array for easy iteration in UI
- `keyPath` is unique identifier for each comparison
- `depth` helps with tree indentation in UI
- `isLeaf` determines if node can have children

---

### 3. EditOperation

Represents a user edit action (add key, modify value, delete key).

**Properties**:

| Property     | Type    | Required | Description          | Validation                              |
| ------------ | ------- | -------- | -------------------- | --------------------------------------- |
| `id`         | string  | Yes      | Unique operation ID  | UUID or timestamp-based                 |
| `type`       | enum    | Yes      | Operation type       | One of: add-key, edit-value, delete-key |
| `targetFile` | enum    | Yes      | Which file to modify | 'file1' or 'file2'                      |
| `keyPath`    | string  | Yes      | Affected key path    | Dot-notation path                       |
| `oldValue`   | any     | No       | Previous value       | For edit-value and delete-key           |
| `newValue`   | any     | No       | New value            | For add-key and edit-value              |
| `timestamp`  | Date    | Yes      | When edit occurred   | ISO 8601 format                         |
| `applied`    | boolean | Yes      | Is edit applied?     | Default: true                           |

**Type Values**:

- **add-key**: User clicked "add key" on missing key
- **edit-value**: User modified value inline
- **delete-key**: User removed a key (future feature, not MVP)

**Example**:

```json
{
  "id": "edit_1697234567890",
  "type": "add-key",
  "targetFile": "file2",
  "keyPath": "errors.notFound",
  "oldValue": null,
  "newValue": "Not found",
  "timestamp": "2025-10-13T10:35:00Z",
  "applied": true
}
```

**Notes**:

- Edit history stored in Map for O(1) lookup by keyPath
- `applied` flag supports future undo/redo (not MVP)
- Last-edit-wins: newer timestamp overwrites older edit

---

### 4. UserTier

Represents the user's subscription tier and associated limits.

**Properties**:

| Property      | Type   | Required | Description             | Validation                       |
| ------------- | ------ | -------- | ----------------------- | -------------------------------- |
| `level`       | enum   | Yes      | Tier level              | One of: free, medium, enterprise |
| `keyLimit`    | number | Yes      | Maximum keys allowed    | 20, 100, or 1000                 |
| `displayName` | string | Yes      | User-friendly tier name | "Free", "Medium", "Enterprise"   |
| `price`       | string | No       | Monthly price           | "$0", "$5/month", "$99/month"    |
| `features`    | array  | No       | Tier-specific features  | Array of strings                 |

**Tier Definitions**:

| Level      | Key Limit | Price     | Features                               |
| ---------- | --------- | --------- | -------------------------------------- |
| free       | 20        | $0        | Basic comparison, edit, save           |
| medium     | 100       | $5/month  | All Free features + larger files       |
| enterprise | 1000      | $99/month | All Medium features + priority support |

**Example**:

```json
{
  "level": "free",
  "keyLimit": 20,
  "displayName": "Free",
  "price": "$0",
  "features": [
    "Compare files up to 20 keys",
    "Inline editing",
    "Download modified files"
  ]
}
```

**Storage**:

```javascript
// Stored in LocalStorage as:
localStorage.setItem(
  'userTier',
  JSON.stringify({
    level: 'free',
    selectedAt: '2025-10-13T10:00:00Z',
  })
);
```

**Notes**:

- MVP uses LocalStorage simulation
- Future: Backend API validates tier via subscription service
- Tier check happens before file parsing (fail fast)

---

### 5. ValidationError

Represents validation errors during file upload or parsing.

**Properties**:

| Property   | Type   | Required | Description                 | Validation            |
| ---------- | ------ | -------- | --------------------------- | --------------------- |
| `code`     | enum   | Yes      | Error code                  | See error codes below |
| `message`  | string | Yes      | User-friendly error message | Specific, actionable  |
| `details`  | object | No       | Additional error context    | Varies by error code  |
| `severity` | enum   | Yes      | Error severity              | 'error' or 'warning'  |

**Error Codes**:

| Code                | Message Template                                                         | Details                                          |
| ------------------- | ------------------------------------------------------------------------ | ------------------------------------------------ |
| FILE_TOO_LARGE      | "File exceeds 1 MB limit. Current size: {size} MB."                      | `{ actualSize: number }`                         |
| INVALID_JSON        | "Invalid JSON at line {line}: {reason}"                                  | `{ line: number, reason: string }`               |
| TIER_LIMIT_EXCEEDED | "File exceeds {tier} tier limit of {limit} keys. Current: {count} keys." | `{ tier: string, limit: number, count: number }` |
| NOT_JSON_FILE       | "File does not have .json extension. Proceed anyway?"                    | `{ extension: string }`                          |
| EMPTY_FILE          | "File is empty or contains no keys."                                     | `{}`                                             |

**Example**:

```json
{
  "code": "TIER_LIMIT_EXCEEDED",
  "message": "File exceeds Free tier limit of 20 keys. Current: 35 keys. Upgrade to Medium tier.",
  "details": {
    "tier": "Free",
    "limit": 20,
    "count": 35
  },
  "severity": "error"
}
```

**Notes**:

- All error messages are specific and actionable per constitution
- `severity: 'warning'` allows user to proceed (e.g., NOT_JSON_FILE)
- `severity: 'error'` blocks operation (e.g., FILE_TOO_LARGE)

---

## Relationships

```
JsonFile (file1) ─────┐
                      ├──> KeyComparisonResult[]
JsonFile (file2) ─────┘

KeyComparisonResult <──── EditOperation (modifies via keyPath)

UserTier ──> validates ──> JsonFile.keyCount
```

**Description**:

- Two `JsonFile` entities are compared to produce array of `KeyComparisonResult`
- User edits create `EditOperation` records linked by `keyPath`
- `UserTier` validates `JsonFile.keyCount` before allowing upload

---

## Data Flow

### Upload Flow

```
1. User selects file
2. Read file metadata (name, size)
3. Validate size <= 1 MB → ValidationError if fails
4. Read file content
5. Parse JSON → ValidationError if invalid
6. Count keys recursively
7. Check against UserTier.keyLimit → ValidationError if exceeds
8. Create JsonFile entity
9. Store in reactive ref
```

### Comparison Flow

```
1. Check both file1 and file2 exist
2. Call diff algorithm with both JsonFile.content objects
3. Generate KeyComparisonResult[] array
4. Store in reactive ref
5. Trigger UI re-render with color-coded tree
```

### Edit Flow

```
1. User clicks edit/add button on KeyComparisonResult
2. Create EditOperation record
3. Apply change to target JsonFile.content
4. Set JsonFile.modified = true
5. Re-run comparison to update KeyComparisonResult[]
6. Update UI to reflect changes
```

### Save Flow

```
1. User clicks save button for target file
2. Check JsonFile.modified === true
3. Apply all EditOperation changes (already applied, this confirms)
4. Stringify JsonFile.content with 2-space indent
5. Create Blob and download URL
6. Trigger browser download
7. Optional: Reset JsonFile.modified = false
```

---

## Validation Rules

### JsonFile Validation

- **File size**: Must be <= 1048576 bytes (1 MB)
- **File name**: Should end with .json (warning if not, allow override)
- **JSON structure**: Must parse without SyntaxError
- **Key count**: Must be <= UserTier.keyLimit
- **Content**: Cannot be null or undefined after parsing

### KeyPath Validation

- **Format**: Must use dot notation (e.g., "parent.child.grandchild")
- **Characters**: Alphanumeric, underscores, hyphens only in key names
- **Depth**: Practical limit ~50 levels (browser stack limit)
- **Special chars**: Keys with dots/spaces must be accessed via bracket notation in code

### EditOperation Validation

- **Target file**: Must reference existing file (file1 or file2)
- **Key path**: Must be valid path in target file structure
- **New value**: Must be JSON-serializable (no functions, undefined)
- **Timestamp**: Must be valid Date object

---

## Performance Considerations

### Memory Usage

- **Typical file**: 100 keys \* 50 bytes avg = 5 KB per file
- **Large file**: 1000 keys \* 100 bytes avg = 100 KB per file
- **Comparison results**: 1000 keys \* 200 bytes = 200 KB
- **Total memory**: ~500 KB for Enterprise tier worst case
- **Acceptable**: Well within browser limits (GB range)

### Computational Complexity

- **Key counting**: O(n) where n = total keys
- **Diff algorithm**: O(n + m) where n, m = keys in each file
- **Tree rendering**: O(n) initial render, O(1) per expand/collapse
- **Edit application**: O(1) for single edit, O(n) for re-comparison

### Optimization Strategies (if needed)

1. **Lazy tree rendering**: Only render visible nodes (virtual scrolling)
2. **Debounced comparison**: Wait 300ms after edit before re-comparing
3. **Memoized key paths**: Cache dot-notation paths to avoid recalculation
4. **Web Worker parsing**: Offload JSON.parse for large files (>5 MB)

**Note**: Initial implementation should be simple; optimize only if performance targets missed (YAGNI principle per constitution).

---

## State Persistence

### Session Storage (temporary)

- Current file contents (lost on page refresh)
- Edit history (lost on page refresh)
- Comparison results (lost on page refresh)

### LocalStorage (persistent)

- User tier preference
- "Don't show prettify warning again" flag
- UI preferences (future: theme, tree expansion state)

**Example LocalStorage Schema**:

```json
{
  "userTier": {
    "level": "free",
    "selectedAt": "2025-10-13T10:00:00Z"
  },
  "preferences": {
    "hidePrettifyWarning": false,
    "theme": "light"
  }
}
```

---

## Conclusion

This data model supports all MVP requirements while maintaining simplicity. All entities are designed for client-side operation with clear validation rules and performance characteristics. The model is extensible for future features (undo/redo, multi-file comparison, backend integration) without breaking changes.

**Ready to proceed to API contracts generation**
