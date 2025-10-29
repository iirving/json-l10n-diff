# Test Fixtures

This directory contains centralized mock data and test fixtures used across the test suite.

## Purpose

- **Consistency**: Ensures all tests use the same baseline data
- **Maintainability**: Single source of truth for test data
- **Reusability**: Shared fixtures reduce duplication
- **Documentation**: Self-documenting test data with JSDoc comments

## Available Fixtures

### `mockFiles.js`

Mock JSON file data for testing comparison functionality.

#### Basic Files

```javascript
import { mockFile1, mockFile2 } from '../fixtures/mockFiles.js';

// mockFile1 - English locale
// mockFile2 - French locale with additional key
```

**Usage Example:**

```javascript
const wrapper = mount(ComparisonView, {
  props: {
    file1: mockFile1,
    file2: mockFile2,
  },
});
```

#### Specialized Files

- **`mockEmptyFile`** - Empty object for testing empty states
- **`mockDeepNestedFile`** - Deeply nested structure (4+ levels)
- **`mockFileWithArrays`** - Contains array values
- **`mockFileWithMixedTypes`** - Various data types (string, number, boolean, null, array, object)
- **`mockIdenticalFile`** - Use for both file1 and file2 to test no-difference scenarios

#### File Pairs

```javascript
import { mockFilePairWithDifferences } from '../fixtures/mockFiles.js';

const { file1, file2 } = mockFilePairWithDifferences;
```

#### Generators

```javascript
import { generateLargeFile } from '../fixtures/mockFiles.js';

// Generate large nested structure for performance testing
const largeFile = generateLargeFile(5, 10); // depth=5, breadth=10
```

## Best Practices

1. **Import fixtures** instead of creating inline mock data
2. **Use descriptive names** when destructuring
3. **Don't modify fixtures** - create copies if mutations needed:

   ```javascript
   const modifiedFile = { ...mockFile1, newKey: 'value' };
   ```

4. **Add new fixtures here** when creating reusable test data
5. **Document new fixtures** with JSDoc comments

## Adding New Fixtures

When adding new fixtures:

1. Add to appropriate fixture file (or create new file)
2. Add JSDoc comments explaining purpose
3. Export the fixture
4. Document in this README
5. Consider if existing tests can benefit from the new fixture

## File Structure

```plaintext
tests/
├── fixtures/
│   ├── README.md          # This file
│   ├── mockFiles.js       # JSON file comparison fixtures
│   └── [future files]     # Other fixture categories
├── components/
├── composables/
└── utils/
```

## Related Documentation

- [Testing Best Practices](../../CONTRIBUTING.md)
- [Component Tests](../components/README.md)
