# Feature Specification: JSON i18n Comparison and Diff Tool

**Feature Branch**: `001-json-i18n-comparison`
**Created**: October 12, 2025
**Status**: Draft
**Input**: User description: "Upload one and then another JSON file used for internationalization (i18n). Basic validation of json files. For main initial file show tree of nested keys, with values. When second json file is loaded show: new values in the matching nested key hierarchy, where a key is missing in the hierarchy RED with a way to add key to key (This could be in either file), where a value is the same for a key in both files YELLOW with a way to edit values (This could be a legitimate placeholder or a value update missing). Ability to save update either file. Ability to prettify either file with warning that that cause extra git diffing. Versions: Single page app, Downloadable git repo, Host website with simple free version (Limit 20 keys), Medium ($5 monthly, Limited number of keys <100), and enterprise versions ($99 monthly, 100-1000 keys, Additional features?), Command line version, Electron app, VS extension."

## Clarifications

### Session 2025-10-13

- Q: How should nested keys be counted toward tier limits? → A: Count every key including parent objects (e.g., `user.profile.name` = 3 keys: "user", "profile", "name")
- Q: What indentation should prettify use? → A: 2 spaces (modern standard, compact)
- Q: Should yellow highlights appear for ALL identical values, or only for suspected placeholders? → A: All identical values get yellow (user decides if it's a problem)
- Q: Should there be a file size limit? → A: 10 MB per file (very generous)
- Q: How should conflicting edits be handled? → A: Last edit wins (simplest for single-user)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View and Compare Basic i18n Files (Priority: P1)

A developer uploads two JSON i18n files (e.g., en.json and fr.json) to compare translations. The tool displays the first file's key hierarchy as a tree structure with values, then overlays the comparison when the second file is loaded, highlighting differences.

**Why this priority**: This is the core value proposition - allowing users to visualize and compare i18n files. Without this, the tool has no purpose.

**Independent Test**: Can be fully tested by uploading two valid JSON files with nested keys and verifying that the tree structure displays correctly and differences are visually highlighted.

**Acceptance Scenarios**:

1. **Given** no files are loaded, **When** user uploads a valid JSON i18n file, **Then** system displays a tree view of all nested keys with their corresponding values
2. **Given** a first JSON file is displayed, **When** user uploads a second JSON file, **Then** system overlays comparison highlighting new keys, missing keys (in red), and identical values (in yellow)
3. **Given** two files are loaded, **When** a key exists in file 1 but not in file 2, **Then** system highlights this key in red in file 1's position in the hierarchy
4. **Given** two files are loaded, **When** a key exists in file 2 but not in file 1, **Then** system highlights this key in red in file 2's position in the hierarchy
5. **Given** two files are loaded, **When** a key exists in both files with the same value, **Then** system highlights this key in yellow

---

### User Story 2 - Edit and Add Missing Keys (Priority: P1)

A developer notices missing translation keys between files and uses inline editing to add the missing key to the appropriate file or modify values directly in the comparison view.

**Why this priority**: Identifying differences is only useful if users can act on them. This provides immediate value by allowing users to fix issues without switching tools.

**Independent Test**: Can be fully tested by loading two files with missing keys, clicking the "add key" action on a red-highlighted missing key, and verifying the key is added to the target file's data structure.

**Acceptance Scenarios**:

1. **Given** a key is missing in file 2 (highlighted in red), **When** user clicks the "add key" action, **Then** system adds the key to file 2's data structure at the correct nested position
2. **Given** a key is missing in file 1 (highlighted in red), **When** user clicks the "add key" action, **Then** system adds the key to file 1's data structure at the correct nested position
3. **Given** a key exists with identical values in both files (highlighted in yellow), **When** user clicks the "edit" action, **Then** system allows inline editing of the value in either file
4. **Given** user has made edits to values, **When** user saves changes, **Then** system updates the in-memory representation of the modified file

---

### User Story 3 - Validate and Save Modified Files (Priority: P1)

A developer completes their comparison and edits, then saves the updated files back to their local system with proper JSON formatting.

**Why this priority**: Users must be able to persist their changes to complete their workflow. This closes the loop on the core user journey.

**Independent Test**: Can be fully tested by making edits to one or both files, clicking save for each file, and verifying the downloaded files contain the correct changes and are valid JSON.

**Acceptance Scenarios**:

1. **Given** user has made changes to file 1, **When** user clicks "save file 1", **Then** system downloads the updated file with changes applied and valid JSON formatting
2. **Given** user has made changes to file 2, **When** user clicks "save file 2", **Then** system downloads the updated file with changes applied and valid JSON formatting
3. **Given** user uploads an invalid JSON file, **When** the file is parsed, **Then** system displays a clear error message indicating the validation failure and line number if possible
4. **Given** a valid JSON file is loaded, **When** user clicks "prettify", **Then** system reformats the file with consistent indentation and spacing
5. **Given** user clicks "prettify", **When** the operation completes, **Then** system displays a warning that prettification may cause additional git diff noise

---

### User Story 4 - Work Within Free Tier Limits (Priority: P2)

A developer with small translation files uses the free version of the tool, which limits them to files with 20 or fewer keys.

**Why this priority**: Defines the free tier business model and ensures users understand limitations. Essential for monetization strategy but not core functionality.

**Independent Test**: Can be fully tested by uploading files with exactly 20 keys (success), 21 keys (rejection), and verifying the limit enforcement message.

**Acceptance Scenarios**:

1. **Given** user is on the free tier, **When** user uploads a file with 20 or fewer keys (counting nested keys), **Then** system loads the file successfully
2. **Given** user is on the free tier, **When** user uploads a file with more than 20 keys, **Then** system displays an error message indicating the key limit and suggests upgrading
3. **Given** user is on the free tier, **When** viewing the interface, **Then** system displays current key count and the 20-key limit

---

### User Story 5 - Subscribe to Paid Tiers (Priority: P3)

A developer with larger translation files subscribes to a Medium ($5/month, up to 100 keys) or Enterprise ($99/month, 100-1000 keys) plan to work with larger files.

**Why this priority**: Enables monetization but is not required for the tool to provide value. Can be added after core functionality is proven.

**Independent Test**: Can be fully tested by simulating a subscription, uploading files within the new tier's limits, and verifying access.

**Acceptance Scenarios**:

1. **Given** user is on Medium tier ($5/month), **When** user uploads a file with up to 100 keys, **Then** system loads the file successfully
2. **Given** user is on Enterprise tier ($99/month), **When** user uploads a file with up to 1000 keys, **Then** system loads the file successfully
3. **Given** user is on Medium tier, **When** user uploads a file with more than 100 keys, **Then** system displays an error message suggesting Enterprise upgrade
4. **Given** user wants to upgrade, **When** user navigates to subscription page, **Then** system displays clear pricing and feature comparison for all tiers

---

### Edge Cases

- What happens when a JSON file has circular references or invalid structure?
- How does the system handle extremely deep nesting (10+ levels)?
- What happens when both files have the same key but different nesting depths?
- How does the system handle very large files (approaching memory limits)? System enforces 10 MB file size limit to prevent browser memory issues.
- What happens when a user tries to add a key that already exists?
- How does the system handle special characters in key names or values?
- What happens if a user uploads non-JSON files (e.g., .txt, .xml)?
- How does the system handle empty files or files with no keys?
- What happens when a user makes conflicting edits in quick succession? System applies last-edit-wins strategy; most recent edit overwrites previous changes.

## Requirements *(mandatory)*

### Functional Requirements

#### Core Comparison Features

- **FR-001**: System MUST accept two JSON files uploaded by the user in sequence
- **FR-002**: System MUST validate that uploaded files are valid JSON format before processing
- **FR-003**: System MUST display the first uploaded file as a tree structure showing all nested keys and their values
- **FR-004**: System MUST overlay the second file's data onto the tree structure when uploaded
- **FR-005**: System MUST highlight keys that exist in one file but not the other in red
- **FR-006**: System MUST highlight keys that exist in both files with identical values in yellow; all identical values are highlighted regardless of content (user determines if match is intentional or requires attention)
- **FR-007**: System MUST display keys with different values in both files in a neutral color (default/uncolored)
- **FR-008**: System MUST preserve and display the nested hierarchy structure of JSON keys

#### Editing and Modification

- **FR-009**: System MUST provide an actionable "add key" control on red-highlighted (missing) keys
- **FR-010**: System MUST allow users to specify which file (1 or 2) to add the missing key to
- **FR-011**: System MUST provide an actionable "edit value" control on yellow-highlighted (identical) keys
- **FR-012**: System MUST allow inline editing of values for any key in either file
- **FR-013**: System MUST maintain the correct nested position when adding new keys
- **FR-014**: System MUST update the visual tree immediately when edits are made
- **FR-015**: System MUST apply last-edit-wins strategy for conflicting edits; most recent change overwrites previous changes to the same key

#### File Operations

- **FR-016**: System MUST provide a "save" action for each file independently
- **FR-017**: System MUST download the modified file with all user changes applied when saved
- **FR-018**: System MUST ensure saved files are valid JSON format
- **FR-019**: System MUST provide a "prettify" action for each file independently
- **FR-020**: System MUST apply consistent 2-space indentation and formatting when prettifying
- **FR-021**: System MUST display a warning when prettify is used, indicating potential git diff impacts

#### Validation and Error Handling

- **FR-022**: System MUST display clear error messages when invalid JSON is uploaded
- **FR-023**: System MUST indicate the location of JSON syntax errors when possible (line number)
- **FR-024**: System MUST prevent processing of files that exceed the user's tier key limit
- **FR-025**: System MUST count all keys including nested keys for tier limit enforcement; counting includes parent objects and all descendant keys (e.g., `user.profile.name` counts as 3 keys: "user", "profile", and "name")
- **FR-026**: System MUST reject files larger than 10 MB with a clear error message indicating the file size limit

#### Tier Management

- **FR-027**: System MUST enforce a 20-key limit for free tier users (counting all keys including parent objects)
- **FR-028**: System MUST enforce a 100-key limit for Medium tier ($5/month) users (counting all keys including parent objects)
- **FR-029**: System MUST enforce a 1000-key limit for Enterprise tier ($99/month) users (counting all keys including parent objects)
- **FR-030**: System MUST display the current key count and limit to the user
- **FR-031**: System MUST provide clear messaging about tier limits when exceeded
- **FR-032**: System MUST allow users to view tier options and pricing

### Key Entities

- **JSON i18n File**: Represents an uploaded internationalization file; contains nested key-value pairs where keys are translation identifiers and values are localized strings; can be modified and re-saved
- **Key Comparison Result**: Represents the comparison state of a single key across two files; can be "missing in file 1", "missing in file 2", "identical in both", or "different in both"; determines visual highlighting
- **User Tier**: Represents the subscription level of a user; determines maximum key limit (20 for free, 100 for Medium, 1000 for Enterprise); affects file upload validation
- **Edit Operation**: Represents a user modification; can be "add key", "edit value", or "delete key"; tracked to enable save functionality

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can upload two valid JSON files and see the complete tree comparison within 3 seconds (for files under tier limit)
- **SC-002**: Users can identify all missing keys between two files in under 30 seconds by scanning the red highlights
- **SC-003**: Users can add a missing key to either file in under 10 seconds using the inline "add key" action
- **SC-004**: Users can edit a value and save the modified file in under 20 seconds
- **SC-005**: 90% of users successfully complete their first file comparison without external help or documentation
- **SC-006**: System correctly validates and rejects 100% of invalid JSON files with clear error messages
- **SC-007**: System correctly enforces tier limits 100% of the time based on total key count
- **SC-008**: Users can process files with up to 1000 keys (Enterprise tier) without performance degradation or crashes
- **SC-009**: Saved files maintain 100% JSON validity and contain all user modifications
- **SC-010**: 95% of users understand the difference between red (missing) and yellow (identical) highlights without explanation

## Assumptions

- Users are familiar with JSON file structure and i18n concepts
- Users have two i18n files to compare (e.g., different language versions or old vs new versions)
- Files will use standard JSON format (no custom extensions or non-standard syntax)
- Key limits are counted as total keys including all nested levels; each key in the hierarchy path counts toward the limit (e.g., `{"user": {"profile": {"name": "John"}}}` contains 3 keys: "user", "profile", "name")
- "Prettify" will use 2-space indentation following modern JSON formatting standards
- Payment processing for paid tiers will be handled by a standard payment provider
- The single-page app version will be the primary version, with other versions (CLI, Electron, VS extension) as future enhancements
- Users have modern web browsers with JavaScript enabled
- File uploads will be processed entirely client-side (no server-side storage for privacy)
- Files will not exceed 10 MB in size; larger files are rejected to prevent browser memory issues

## Out of Scope

- Automatic translation or suggestion of missing values
- Integration with translation management systems or APIs
- Version control or history tracking of edits
- Collaboration features (real-time multi-user editing)
- Support for non-JSON i18n formats (YAML, XML, properties files)
- Bulk operations across more than 2 files simultaneously
- Command-line version, Electron app, and VS Code extension (future versions)
- Advanced enterprise features beyond increased key limits
- Custom validation rules or schema enforcement
- Import/export of comparison reports
