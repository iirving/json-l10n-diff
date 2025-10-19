import { describe, it, expect } from 'vitest';
import { countKeys } from '../../src/utils/keyCounter.js';

describe('countKeys', () => {
  it('should return 0 for null input', () => {
    expect(countKeys(null)).toBe(0);
  });

  it('should return 0 for undefined input', () => {
    expect(countKeys(undefined)).toBe(0);
  });

  it('should return 0 for non-object input', () => {
    expect(countKeys('string')).toBe(0);
    expect(countKeys(123)).toBe(0);
    expect(countKeys(true)).toBe(0);
  });

  it('should return 0 for array input', () => {
    expect(countKeys([1, 2, 3])).toBe(0);
    expect(countKeys(['a', 'b'])).toBe(0);
  });

  it('should return 0 for empty object', () => {
    expect(countKeys({})).toBe(0);
  });

  it('should count single-level keys', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(countKeys(obj)).toBe(3);
  });

  it('should count nested keys including parent keys', () => {
    const obj = {
      app: {
        title: 'My App',
        welcome: 'Hello',
      },
    };
    expect(countKeys(obj)).toBe(3);
  });

  it('should count deeply nested keys', () => {
    const obj = {
      level1: {
        level2: {
          level3: {
            value: 'deep',
          },
        },
      },
    };
    expect(countKeys(obj)).toBe(4);
  });

  it('should count keys in complex nested structure', () => {
    const obj = {
      app: {
        title: 'My App',
        welcome: 'Hello',
      },
      user: {
        profile: {
          name: 'John',
          email: 'john@example.com',
        },
      },
    };
    expect(countKeys(obj)).toBe(7);
  });

  it('should not count array elements as keys', () => {
    const obj = {
      list: [1, 2, 3],
      nested: {
        items: ['a', 'b'],
      },
    };
    expect(countKeys(obj)).toBe(3);
  });

  it('should handle objects with null values', () => {
    const obj = {
      a: null,
      b: {
        c: null,
      },
    };
    expect(countKeys(obj)).toBe(3);
  });

  it('should handle objects with undefined values', () => {
    const obj = {
      a: undefined,
      b: {
        c: undefined,
      },
    };
    expect(countKeys(obj)).toBe(3);
  });

  it('should handle mixed value types', () => {
    const obj = {
      string: 'text',
      number: 42,
      boolean: true,
      nullValue: null,
      nested: {
        array: [1, 2, 3],
        obj: {
          deep: 'value',
        },
      },
    };
    expect(countKeys(obj)).toBe(8);
  });

  it('should handle objects with numeric keys', () => {
    const obj = {
      1: 'one',
      2: {
        nested: 'two',
      },
    };
    expect(countKeys(obj)).toBe(3);
  });

  it('should handle empty nested objects', () => {
    const obj = {
      empty: {},
      notEmpty: {
        key: 'value',
      },
    };
    expect(countKeys(obj)).toBe(3);
  });
});
