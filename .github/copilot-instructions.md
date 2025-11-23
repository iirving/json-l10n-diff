---
applyTo: '**/*.vue, **/*.js'
---

description: GitHub Copilot Guidelines for Vue

# GitHub Copilot Guidelines for Vue

## Code Style

- Use meaningful variable and function names

- Follow camelCase naming convention for variables and functions

- Add JSDoc comments for functions and classes

- Keep functions small and focused on a single responsibility

- Avoid using lodash package utils, make sure new code is generated using native JS

## File Organization

- **Composables**: Place in `/src/composables` directory - reusable Composition API logic
- **Stores**: Place in `/src/stores` directory - Pinia state management stores
- **Pure functions**: Place in `/src/utils` directory - utility functions with no side effects
- **Pages**: Place in `/src/pages` directory - page-level components (not `/views`)
- **Components**: Place in `/src/components` directory - reusable Vue components
- **Constants**: Place in `/src/constants` directory - shared constant values
- **Internationalization**: Place in `/src/i18n` directory - translation files and i18n setup

## Testing

- Write unit tests

- Use Vitest for testing

- Include test cases for edge cases and error conditions

- Make sure to always use package.json scripts when running test

- Check test coverage, write test cases to get at least 80% of coverage

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

## Performance

- Avoid nested loops when possible

- Be mindful of memory usage

- Consider time complexity of operations

- Cache repeated calculations

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

## Dependencies

- Never install or uninstall packages - this must be done by the user themselves

- Never modify package.json dependencies or devDependencies directly

- Never suggest adding new packages. Ask user to consult architects team first

- All package additions/updates must be approved by the architects team before suggesting them
