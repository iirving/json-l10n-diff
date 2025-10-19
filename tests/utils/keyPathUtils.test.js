import { describe, it, expect } from 'vitest';
import {
  buildPath,
  splitPath,
  getValueByPath,
  setValueByPath,
} from '@/utils/keyPathUtils.js';

describe('buildPath', () => {
  it('should build path from array of keys', () => {
    expect(buildPath(['app', 'title'])).toBe('app.title');
  });

  it('should build path with multiple levels', () => {
    expect(buildPath(['user', 'profile', 'name'])).toBe('user.profile.name');
  });

  it('should handle single key', () => {
    expect(buildPath(['app'])).toBe('app');
  });

  it('should return empty string for empty array', () => {
    expect(buildPath([])).toBe('');
  });

  it('should return empty string for non-array input', () => {
    expect(buildPath(null)).toBe('');
    expect(buildPath(undefined)).toBe('');
    expect(buildPath('string')).toBe('');
  });

  it('should filter out null and undefined keys', () => {
    expect(buildPath(['app', null, 'title'])).toBe('app.title');
    expect(buildPath(['app', undefined, 'title'])).toBe('app.title');
  });

  it('should filter out empty string keys', () => {
    expect(buildPath(['app', '', 'title'])).toBe('app.title');
  });

  it('should handle numeric keys', () => {
    expect(buildPath(['items', 0, 'name'])).toBe('items.0.name');
  });
});

describe('splitPath', () => {
  it('should split dot-notation path', () => {
    expect(splitPath('app.title')).toEqual(['app', 'title']);
  });

  it('should split path with multiple levels', () => {
    expect(splitPath('user.profile.name')).toEqual(['user', 'profile', 'name']);
  });

  it('should handle single key', () => {
    expect(splitPath('app')).toEqual(['app']);
  });

  it('should return empty array for empty string', () => {
    expect(splitPath('')).toEqual([]);
  });

  it('should return empty array for null input', () => {
    expect(splitPath(null)).toEqual([]);
  });

  it('should return empty array for undefined input', () => {
    expect(splitPath(undefined)).toEqual([]);
  });

  it('should return empty array for non-string input', () => {
    expect(splitPath(123)).toEqual([]);
    expect(splitPath({})).toEqual([]);
  });

  it('should filter out empty segments', () => {
    expect(splitPath('app..title')).toEqual(['app', 'title']);
    expect(splitPath('.app.title.')).toEqual(['app', 'title']);
  });

  it('should handle paths with numeric segments', () => {
    expect(splitPath('items.0.name')).toEqual(['items', '0', 'name']);
  });
});

describe('getValueByPath', () => {
  const testObj = {
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
    count: 42,
    enabled: true,
    nullValue: null,
  };

  it('should get value at simple path', () => {
    expect(getValueByPath(testObj, 'count')).toBe(42);
    expect(getValueByPath(testObj, 'enabled')).toBe(true);
  });

  it('should get value at nested path', () => {
    expect(getValueByPath(testObj, 'app.title')).toBe('My App');
    expect(getValueByPath(testObj, 'app.welcome')).toBe('Hello');
  });

  it('should get value at deeply nested path', () => {
    expect(getValueByPath(testObj, 'user.profile.name')).toBe('John');
    expect(getValueByPath(testObj, 'user.profile.email')).toBe(
      'john@example.com'
    );
  });

  it('should return undefined for missing path', () => {
    expect(getValueByPath(testObj, 'missing')).toBeUndefined();
    expect(getValueByPath(testObj, 'app.missing')).toBeUndefined();
    expect(getValueByPath(testObj, 'user.profile.missing')).toBeUndefined();
  });

  it('should return null for null values', () => {
    expect(getValueByPath(testObj, 'nullValue')).toBeNull();
  });

  it('should return undefined for non-object input', () => {
    expect(getValueByPath(null, 'app.title')).toBeUndefined();
    expect(getValueByPath(undefined, 'app.title')).toBeUndefined();
    expect(getValueByPath('string', 'app.title')).toBeUndefined();
  });

  it('should return undefined for empty path', () => {
    expect(getValueByPath(testObj, '')).toBeUndefined();
  });

  it('should handle path through null values', () => {
    const obj = { a: { b: null } };
    expect(getValueByPath(obj, 'a.b.c')).toBeUndefined();
  });

  it('should get nested object', () => {
    const result = getValueByPath(testObj, 'user.profile');
    expect(result).toEqual({
      name: 'John',
      email: 'john@example.com',
    });
  });
});

describe('setValueByPath', () => {
  it('should set value at simple path', () => {
    const obj = {};
    setValueByPath(obj, 'key', 'value');
    expect(obj).toEqual({ key: 'value' });
  });

  it('should set value at nested path', () => {
    const obj = {};
    setValueByPath(obj, 'app.title', 'My App');
    expect(obj).toEqual({ app: { title: 'My App' } });
  });

  it('should set value at deeply nested path', () => {
    const obj = {};
    setValueByPath(obj, 'user.profile.name', 'John');
    expect(obj).toEqual({ user: { profile: { name: 'John' } } });
  });

  it('should create intermediate objects if they do not exist', () => {
    const obj = {};
    setValueByPath(obj, 'a.b.c.d', 'deep');
    expect(obj).toEqual({ a: { b: { c: { d: 'deep' } } } });
  });

  it('should overwrite existing values', () => {
    const obj = { app: { title: 'Old' } };
    setValueByPath(obj, 'app.title', 'New');
    expect(obj.app.title).toBe('New');
  });

  it('should handle setting multiple values', () => {
    const obj = {};
    setValueByPath(obj, 'app.title', 'My App');
    setValueByPath(obj, 'app.welcome', 'Hello');
    expect(obj).toEqual({
      app: {
        title: 'My App',
        welcome: 'Hello',
      },
    });
  });

  it('should return the modified object', () => {
    const obj = {};
    const result = setValueByPath(obj, 'key', 'value');
    expect(result).toBe(obj);
    expect(result.key).toBe('value');
  });

  it('should handle non-object input gracefully', () => {
    expect(setValueByPath(null, 'key', 'value')).toBeNull();
    expect(setValueByPath(undefined, 'key', 'value')).toBeUndefined();
  });

  it('should handle empty path', () => {
    const obj = { existing: 'value' };
    setValueByPath(obj, '', 'newValue');
    expect(obj).toEqual({ existing: 'value' });
  });

  it('should overwrite non-object intermediate values', () => {
    const obj = { app: 'string' };
    setValueByPath(obj, 'app.title', 'My App');
    expect(obj).toEqual({ app: { title: 'My App' } });
  });

  it('should handle setting null values', () => {
    const obj = {};
    setValueByPath(obj, 'key', null);
    expect(obj).toEqual({ key: null });
  });

  it('should handle setting undefined values', () => {
    const obj = {};
    setValueByPath(obj, 'key', undefined);
    expect(obj).toEqual({ key: undefined });
  });

  it('should handle setting array values', () => {
    const obj = {};
    setValueByPath(obj, 'items', [1, 2, 3]);
    expect(obj).toEqual({ items: [1, 2, 3] });
  });

  it('should handle setting object values', () => {
    const obj = {};
    setValueByPath(obj, 'nested', { a: 1, b: 2 });
    expect(obj).toEqual({ nested: { a: 1, b: 2 } });
  });

  it('should preserve existing sibling keys', () => {
    const obj = { app: { title: 'My App' } };
    setValueByPath(obj, 'app.welcome', 'Hello');
    expect(obj).toEqual({
      app: {
        title: 'My App',
        welcome: 'Hello',
      },
    });
  });
});
