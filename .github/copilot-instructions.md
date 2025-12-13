---
applyTo: '**/*.vue, **/*.js'
---

description: GitHub Copilot Guidelines for Vue

# GitHub Copilot Guidelines for Vue

## Code Style

- Use meaningful variable and function names

- Follow naming conventions:
  - **Variables and functions**: camelCase (`parseFile`, `keyCount`)
  - **Components**: PascalCase (`FileUploader.vue`, `TreeViewer.vue`)
  - **Utilities**: camelCase (`jsonValidator.js`, `keyPathUtils.js`)
  - **Composables**: camelCase with `use` prefix (`useJsonDiff`, `useFileStore`)
  - **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`, `DIFF_STATUS`)

- Add JSDoc comments for functions and classes

- Keep functions small and focused on a single responsibility

- Avoid using lodash package utils, make sure new code is generated using native JS

- Import order:
  1. Vue imports (`vue`, `vue-router`, `pinia`)
  2. Third-party libraries (`vue-i18n`)
  3. Local composables and stores (`@/composables`, `@/stores`)
  4. Components (`@/components`)
  5. Utils and constants (`@/utils`, `@/constants`)

- Component structure order in `<script setup>`:
  1. Imports
  2. Props definition (`defineProps`)
  3. Emits definition (`defineEmits`)
  4. Composables and stores
  5. Reactive state (`ref`, `reactive`)
  6. Computed properties
  7. Methods/functions
  8. Lifecycle hooks (if any)

## File Organization

- **Composables**: Place in `/src/composables` directory - reusable Composition API logic
- **Stores**: Place in `/src/stores` directory - Pinia state management stores
- **Pure functions**: Place in `/src/utils` directory - utility functions with no side effects
- **Pages**: Place in `/src/pages` directory - page-level components (not `/views`)
- **Components**: Place in `/src/components` directory - reusable Vue components
- **Constants**: Place in `/src/constants` directory - shared constant values
- **Internationalization**: Place in `/src/i18n` directory - translation files and i18n setup

## Testing

- Write unit tests using Vitest with Vue Test Utils

- Focus on testing behavior, not implementation details

- Use `mount` for full component testing, `shallowMount` for isolation

- Mock global plugins (router, Pinia stores) as needed

- Include test cases for edge cases and error conditions

- Make sure to always use package.json scripts when running tests

- Check test coverage, write test cases to get at least 80% coverage

- Test accessibility using axe-core integration where applicable

## Internationalization (i18n)

- Always use `useI18n()` composable from vue-i18n in components

- Use the `t()` function for all user-facing text and messages

- Never hardcode user-visible strings in templates or components

- Add new translation keys to locale files in `/src/i18n/locales`

- Use descriptive dot-notation keys (e.g., `errors.invalidFile`, `labels.uploadButton`)

- Provide translations for all supported languages when adding new keys

## Best Practices

- Use ES6+ features when appropriate

- Prefer const over let, avoid var

- Use early returns to reduce nesting

- Add error handling where appropriate

- Use pure functions when possible

- Avoid side effects in functions

- Use Prettier for code formatting, make sure new code is formatted according to Prettier rules
  - Configuration exists in `.prettierrc.json`
  - Uses 2 spaces for indentation
  - Uses single quotes for strings
  - Adds trailing comma in multi-line objects and arrays (es5)
  - Max line length: 80 characters

- Use ESLint for code linting, make sure new code follows ESLint rules for Vue3 projects
  - Configuration exists in `eslint.config.js`
  - Uses the Vue3 recommended ruleset
  - Integrated with Prettier via `eslint-plugin-prettier`
  - `prettier/prettier` rule is set to `error`

## Documentation

- Add meaningful comments for complex logic

- Include examples in JSDoc comments

- Document parameters and return types

- Explain any non-obvious implementations

## Composition API Patterns

- Create reusable composables for shared logic (e.g., `useFetch`, `useJsonDiff`)

- For `watch`, dependencies are tracked automatically when using a getter function; only specify dependency arrays when using the array source form. `watchEffect` always tracks dependencies automatically.

- Cleanup side effects in `onUnmounted` or `watch` cleanup callbacks

- Use `provide`/`inject` sparingly for deep dependency injection

- Prefer `computed` over watchers where possible to avoid unnecessary reactivity

## State Management (Pinia)

- Define stores with `defineStore` using Composition API syntax

- Use `storeToRefs` when destructuring reactive state from stores

- Keep state normalized for complex data structures

- Use actions for asynchronous logic; keep getters pure

- Do not modify store state outside of actions

- Use `computed` for derived state in components

## Performance

- Avoid nested loops when possible

- Be mindful of memory usage

- Consider time complexity of operations

- Cache repeated calculations

- Use `v-once` for static content that never changes

- Use `v-memo` for infrequently changing elements in lists

- Lazy-load components with `defineAsyncComponent` for code splitting

- Profile with Vue DevTools Performance tab when debugging

## Error Handling

- Use specific error types

- Provide meaningful error messages

- Handle edge cases explicitly

- Validate function inputs

## Version Control

- Write clear commit messages

- Follow semantic versioning

- Keep commits focused and atomic

- Add proper changelog entries

## Accessibility

- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`) over generic `<div>`

- Add ARIA attributes where semantic HTML is insufficient

- Manage focus for modals and dynamic content (`focus()` on open)

- Provide keyboard navigation for all interactive components

- Ensure color contrast meets WCAG AA standards

- Add meaningful `alt` text for images and `aria-label` for icon buttons

## Dependencies

- Never install or uninstall packages - this must be done by the user themselves

- Never modify package.json dependencies or devDependencies directly

- Never suggest adding new packages. Ask user to consult architects team first

- All package additions/updates must be approved by the architects team before suggesting them

## Priority Areas (Review These)

### Security & Safety

- Sanitize any HTML inputs rigorously if unavoidable
- XSS vulnerabilities from unsanitized user input
- CSRF vulnerabilities in API calls
- Use HTTPS for all API requests
- Credential exposure or hardcoded secrets
- Store sensitive tokens in HTTP-only cookies, not localStorage
- Missing input validation on props and user input
- Improper error handling that could leak sensitive info
- Unsafe direct DOM manipulation

### Correctness Issues

- Logic errors that could cause incorrect behavior
- Race conditions in async code (await/promises)
- Memory leaks (unremoved event listeners, uncleared intervals)
- Off-by-one errors or boundary conditions
- Incorrect error propagation (missing try/catch)
- Reactivity loss (destructuring props without toRefs)
- Incorrect usage of Vue lifecycle hooks
- Mutation of props directly
- Unnecessary watchers or computed properties with side effects

### Architecture & Patterns

- Code that violates existing patterns in the codebase
- Missing error handling
- Async/await misuse or blocking operations
- Improper component composition
- State management anti-patterns (modifying store state outside actions)
- Props drilling (should use Provide/Inject or Pinia)
- Resource leaks (unremoved event listeners, uncleared intervals)
- Overly defensive code with unnecessary checks
- Unnecessary comments that restate obvious code behavior

## CI Pipeline Context

**Important**: You review PRs immediately, before CI completes. Do not flag issues that CI will catch.

CI runs the following checks:

- ESLint
- Prettier
- Vitest with coverage threshold of 80%
<!-- - TypeScript type checking -->
- Security scan with `npm audit`
- Dependency freshness check with `npm outdated`
- Build verification with `npm run build`
- i18n key presence check with custom script
- GitHub Actions workflow validation
- Commit message linting with `commitlint`
  <!-- - Changelog presence check with custom script -->
  <!-- - PR size limit check (max 500 lines changed) -->
  <!-- - Snapshot testing with Vitest -->
- Dead code detection with `eslint-plugin-unused-imports`
<!-- - Accessibility checks with `axe-core` in Storybook -->
- Performance budget checks with `lighthouse-ci`
  <!-- - Type coverage check with `tsc --noEmit` -->
  <!-- - License compliance check with `license-checker` -->
  <!-- - Bundle size analysis with `webpack-bundle-analyzer` -->
- Environment variable usage check with custom script
  <!-- - Dockerfile best practices check with `hadolint` -->
  <!-- - API contract tests with `pact` -->
  <!-- - Storybook build verification with `build-storybook` -->

## Skip These (Low Value)

Do not comment on:

- Style/formatting (handled by Prettier)
- Missing dependencies (npm ci covers this)
- Minor naming suggestions
- Suggestions to add comments
- Refactoring unless addressing a real bug
- Multiple issues in one comment
- Logging suggestions unless security-related
- Pedantic text accuracy unless it affects meaning

## Response Format

1. State the problem (1 sentence)
2. Why it matters (1 sentence, if needed)
3. Suggested fix (snippet or specific action)
4. Reference relevant guideline section (if applicable)

## Reminder

- Always follow these guidelines when generating or reviewing code
- Prioritize correctness, security, and maintainability
- Keep responses concise and focused on high-impact issues
