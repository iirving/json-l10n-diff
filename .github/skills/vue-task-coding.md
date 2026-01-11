# Skill: Coding a New Task in Vue.js

## Objective

Guide for implementing new features or tasks in the Vue.js application following project standards.

## Pre-Task Checklist

- [ ] Understand the requirement clearly
- [ ] Identify which layers are affected (UI, composable, store, utility)
- [ ] Check if i18n keys need to be added
- [ ] Determine if new tests are needed

## Implementation Steps

### 1. Plan the Task Structure

- Break down into logical components
- Identify reusable logic (composables vs utilities)
- Determine state management needs (Pinia store vs local state)

### 2. File Organization Decision Tree

**Question: Is this pure logic with no side effects?**

- YES → Create in `/src/utils/` as a pure function
- NO → Continue

**Question: Is this reusable Vue composition logic?**

- YES → Create in `/src/composables/` using Composition API
- NO → Continue

**Question: Is this shared state across components?**

- YES → Create/update Pinia store in `/src/stores/`
- NO → Continue

**Question: Is this a reusable UI component?**

- YES → Create in `/src/components/`
- NO → Create in `/src/pages/`

### 3. Code Implementation Order

#### For Components (`<script setup>`):

```javascript
// 1. Imports (grouped by type)
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMyStore } from '@/stores/useMyStore';
import MyComponent from '@/components/MyComponent.vue';
import { myUtil } from '@/utils/myUtil';

// 2. Props
const props = defineProps({
  // ...
});

// 3. Emits
const emit = defineEmits(['update', 'change']);

// 4. Composables and stores
const { t } = useI18n();
const store = useMyStore();

// 5. Reactive state
const myRef = ref(null);

// 6. Computed properties
const myComputed = computed(() => {
  // ...
});

// 7. Methods/functions
const handleAction = () => {
  // ...
};

// 8. Lifecycle hooks (if needed)
```

#### For Composables:

```javascript
// Structure: useFeatureName.js
export function useFeatureName() {
  // Reactive state
  const state = ref(null);

  // Computed values
  const computed = computed(() => state.value);

  // Methods
  const method = () => {
    // logic
  };

  // Return public API
  return {
    state,
    computed,
    method,
  };
}
```

#### For Utils:

```javascript
// Pure function with JSDoc
/**
 * Description of what this does
 * @param {Type} param - Description
 * @returns {Type} Description
 */
export function utilFunction(param) {
  // No side effects
  // No external dependencies
  return result;
}
```

### 4. Internationalization Requirements

**CRITICAL: Never hardcode user-facing text**

For every user-visible string:

1. Add key to `/src/i18n/locales/en.json`
2. Add translation to `/src/i18n/locales/fr.json`
3. Use `t()` function in component:
   ```javascript
   const { t } = useI18n();
   const message = t('errors.invalidFile');
   ```

Key naming convention: `category.subcategory.key`

- `errors.*` - Error messages
- `labels.*` - UI labels and buttons
- `messages.*` - Info messages
- `tooltips.*` - Help text

### 5. Code Quality Standards

**Naming Conventions:**

- Variables/functions: `camelCase`
- Components: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Composables: `use` prefix (`useMyFeature`)

**Best Practices:**

- Use `const` over `let`, never `var`
- Prefer native JS over lodash
- Use early returns to reduce nesting
- Keep functions small and focused
- Add JSDoc for complex functions
- Avoid nested loops
- Cache repeated calculations

**Vue-Specific:**

- Never mutate props directly
- Use `toRefs()` when destructuring props
- Prefer computed over watchers for derived state
- Use Provide/Inject instead of props drilling
- Clean up event listeners in `onUnmounted`

### 6. Error Handling

```javascript
try {
  // risky operation
} catch (error) {
  // Log for debugging
  console.error('Context:', error);

  // Show user-friendly message
  errorMessage.value = t('errors.operationFailed');
}
```

- Validate inputs early
- Provide meaningful error messages via i18n
- Handle edge cases explicitly
- Don't leak sensitive info in errors

### 7. Testing Requirements

**Before submitting:**

- [ ] Write unit tests for new functions/composables
- [ ] Test edge cases and error conditions
- [ ] Ensure 80%+ test coverage
- [ ] Use `npm test` (never run vitest directly)

**Test file structure:**

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { mountWithI18n } from '../utils/i18nTestHelper';

describe('FeatureName', () => {
  beforeEach(() => {
    // setup
  });

  it('should handle normal case', () => {
    // test
  });

  it('should handle edge case', () => {
    // test
  });

  it('should handle error condition', () => {
    // test
  });
});
```

### 8. Code Review Self-Check

Before committing, verify:

- [ ] No hardcoded user-facing strings (all use `t()`)
- [ ] Follows naming conventions
- [ ] No security issues (XSS, input validation)
- [ ] No direct prop mutations
- [ ] Proper error handling
- [ ] Tests written and passing
- [ ] No unnecessary watchers or computed with side effects
- [ ] Code formatted with Prettier
- [ ] No ESLint errors
- [ ] Imports properly ordered

### 9. Commit and Push

```bash
# Stage changes
git add .

# Commit with conventional commit message
git commit -m "feat(component): add new feature description"

# Push to branch
git push -u origin feature/branch-name
```

**Commit message format:**

- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code restructure
- `test:` - Add/update tests
- `docs:` - Documentation
- `style:` - Formatting
- `chore:` - Maintenance

## Common Patterns

### Pattern: Form Input Handling

```javascript
const formData = reactive({
  field1: '',
  field2: '',
});

const errors = ref({});

const validate = () => {
  errors.value = {};
  if (!formData.field1) {
    errors.value.field1 = t('errors.required');
  }
  return Object.keys(errors.value).length === 0;
};

const handleSubmit = () => {
  if (validate()) {
    // process
  }
};
```

### Pattern: API Call with Loading State

```javascript
const isLoading = ref(false);
const error = ref(null);
const data = ref(null);

const fetchData = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    data.value = await apiCall();
  } catch (err) {
    error.value = t('errors.fetchFailed');
    console.error('Fetch error:', err);
  } finally {
    isLoading.value = false;
  }
};
```

### Pattern: Computed Property with Store

```javascript
const store = useMyStore();
const computed = computed(() => {
  return store.items.filter((item) => item.active);
});
```

## What NOT to Do

❌ Don't install packages without approval  
❌ Don't modify dependencies in package.json  
❌ Don't use `v-html` without sanitization  
❌ Don't create watchers with side effects  
❌ Don't destructure props without `toRefs()`  
❌ Don't use lodash (use native JS)  
❌ Don't hardcode strings (use i18n)  
❌ Don't run test commands directly (use npm scripts)

## Resources

- [Project Architecture](../../docs/ARCHITECTURE.md)
- [Contributing Guidelines](../../CONTRIBUTING.md)
- [Vue 3 Composition API](https://vuejs.org/api/composition-api-setup.html)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue i18n](https://vue-i18n.intlify.dev/)
