<!--
SYNC IMPACT REPORT - 2025-10-12
===============================================================================
Version Change: 1.0.0 → 1.1.0 (minor)

Modified Principles:
- II. Code Quality - Enhanced documentation requirements (JSDoc parameters/returns)
- V. User Experience - Clarified error message specificity requirements

Added Sections:
- Development Standards > Version Control (new subsection with commit practices)
- Development Standards > Documentation (expanded with JSDoc examples requirement)

Removed Sections:
- None

Templates Requiring Updates:
- ✅ .specify/templates/plan-template.md (reviewed - constitution check compatible)
- ✅ .specify/templates/spec-template.md (reviewed - requirements alignment maintained)
- ✅ .specify/templates/tasks-template.md (reviewed - task categories align with principles)
- ✅ .github/INSTRUCTIONS.md (source of update - fully aligned)

Follow-up TODOs:
- None
===============================================================================
-->

# JSON i18n Diff Constitution

## Core Principles

### I. Component Architecture

All features MUST be built using modular Vue 3 components following these rules:

- Components are self-contained with clear, single responsibilities
- Components use Composition API (`<script setup>`) for reactivity and logic
- Props and emits are explicitly defined and documented
- Components are reusable and testable in isolation
- Clear separation between UI components and business logic

**Rationale**: Component modularity ensures maintainability, testability, and enables
independent development of features. The Composition API provides better TypeScript
support and more flexible code organization than Options API.

### II. Code Quality

Code MUST adhere to these quality standards:

- Use meaningful, descriptive variable and function names (camelCase convention)
- Functions remain small, focused on single responsibility
- ES6+ features are preferred (const over let, avoid var)
- Use pure functions when possible; minimize side effects
- Early returns to reduce nesting
- JSDoc comments for functions and classes with parameter/return type documentation
- Include examples in JSDoc comments for non-obvious implementations
- No lodash or similar utility libraries; use native JavaScript methods

**Rationale**: Consistent, clean code reduces cognitive load, makes onboarding easier,
and prevents bugs. Comprehensive JSDoc documentation enables better IntelliSense and
serves as inline API documentation. Native JavaScript methods keep bundle size small
and dependencies minimal.

### III. Testing (When Requested)

When testing is explicitly requested, tests MUST follow these principles:

- Use Vitest as the testing framework
- Write unit tests for all new functionality
- Tests written FIRST and must FAIL before implementation (TDD when applicable)
- Target 90%+ code coverage; check coverage and write additional tests as needed
- Test edge cases and error conditions explicitly
- Run tests via package.json scripts ONLY (never run test commands directly)
- Tests validate component behavior, not implementation details

**Rationale**: Tests ensure reliability and catch regressions. Test-first approach
forces clear requirement thinking. High coverage (90%+) provides confidence in changes
and ensures comprehensive test suites. Using package.json scripts ensures consistent
test environment across all developers.

### IV. Simplicity & YAGNI

Implementation MUST prioritize simplicity:

- Start with the simplest solution that solves the problem
- No premature optimization or over-engineering
- No speculative features (You Aren't Gonna Need It)
- Complexity must be explicitly justified in documentation
- Favor clear, obvious code over clever solutions

**Rationale**: Simple code is easier to understand, maintain, and debug. Over-engineering
creates unnecessary maintenance burden and slows development velocity.

### V. User Experience

User-facing features MUST prioritize experience and accessibility:

- Responsive design that works across device sizes
- Clear visual feedback for user actions
- Meaningful, specific error messages that guide users to solutions
- Use specific error types with actionable messages
- Fast, performant interactions (avoid janky UI)
- Accessible to keyboard navigation and screen readers where applicable

**Rationale**: The tool serves users; their experience is paramount. Poor UX drives
users away regardless of underlying functionality quality. Specific error messages
reduce support burden and improve user confidence.

## Technology Stack

This project uses the following technology constraints:

**Framework**: Vue 3.5+ with Composition API (`<script setup>`)
**Build Tool**: Vite (using Rolldown variant)
**Language**: Modern JavaScript (ES6+)
**Testing**: Vitest (when tests are required)
**Package Management**: npm (package.json defines all dependencies)

**Dependency Policy** (NON-NEGOTIABLE):

- Dependencies MUST NOT be installed or uninstalled by agents or automated tools
- Dependencies MUST NOT be added to package.json without explicit user action
- All package additions/updates MUST be approved by architects team before suggesting
- Never suggest adding new packages; ask user to consult architects team first
- Keep dependencies minimal to reduce bundle size and maintenance surface
- Prefer native browser APIs and Vue built-ins over third-party libraries

**Rationale**: Dependency management is a critical architectural decision with long-term
implications for security, maintenance, and bundle size. Only humans make these decisions.

## Development Standards

**File Organization**:

- Components live in `src/components/`
- Shared utilities in `src/utils/` or `src/lib/`
- Assets in `src/assets/`
- Public static files in `public/`

**Naming Conventions**:

- Vue component files: PascalCase (e.g., `JsonDiffViewer.vue`)
- JavaScript files: camelCase (e.g., `diffUtils.js`)
- Variables/functions: camelCase
- Constants: UPPER_SNAKE_CASE

**Documentation**:

- Add meaningful comments for complex logic explaining "why", not "what"
- Include examples in JSDoc comments for non-obvious implementations
- Document parameters and return types in JSDoc format
- Component props documented via JSDoc or comments
- README updated when user-facing features change
- Explain any non-obvious implementations with rationale

**Error Handling**:

- Use specific error types (not generic Error)
- Provide meaningful, actionable error messages
- Handle edge cases explicitly with clear fallback behavior
- Validate function inputs before processing
- Use try-catch for operations that can fail

**Performance**:

- Avoid nested loops where possible
- Be mindful of memory usage in data structures
- Consider time complexity of operations (prefer O(n) over O(n²))
- Cache repeated calculations using computed properties or memoization
- Be mindful of reactivity overhead (use computed properties appropriately)
- Lazy-load components if they're not immediately needed

**Version Control**:

- Write clear, descriptive commit messages
- Follow semantic versioning for releases
- Keep commits focused and atomic (one logical change per commit)
- Add proper changelog entries for user-facing changes

## Governance

**Authority**: This constitution supersedes all other practices and guidelines.
Changes to the constitution require:

1. Documentation of rationale
2. User approval
3. Version bump according to semantic versioning
4. Update to dependent templates and guidance files

**Compliance**:

- All code reviews MUST verify constitution compliance
- Principle violations require explicit justification in complexity tracking
- Refer to `.github/INSTRUCTIONS.md` for agent-specific runtime guidance

**Versioning Policy**:

- MAJOR: Breaking changes to core principles or removal of principles
- MINOR: New principle added or significant expansion of existing principle
- PATCH: Clarifications, wording improvements, non-semantic fixes

**Constitution Amendments**:

- Changes MUST update `.specify/memory/constitution.md`
- Sync Impact Report MUST be prepended as HTML comment
- Dependent templates MUST be reviewed and updated if needed
- Amendment date MUST be recorded in version footer

**Version**: 1.1.0 | **Ratified**: 2025-10-12 | **Last Amended**: 2025-10-12
