import { describe, it, expect, beforeEach } from 'vitest';
import { useJsonParser } from '../../src/composables/useJsonParser.js';

describe('useJsonParser', () => {
  let jsonParser;

  beforeEach(() => {
    jsonParser = useJsonParser();
  });

  describe('parseFile', () => {
    it('should parse valid JSON file successfully', async () => {
      const content = JSON.stringify({
        app: { title: 'My App', welcome: 'Hello' },
      });
      const file = new File([content], 'test.json', {
        type: 'application/json',
      });

      const result = await jsonParser.parseFile(file);

      expect(result.isValid).toBe(true);
      expect(result.data).toEqual({
        app: { title: 'My App', welcome: 'Hello' },
      });
      expect(result.keyCount).toBe(3); // app, title, welcome
      expect(result.fileName).toBe('test.json');
      expect(result.fileSize).toBe(content.length);
    });

    it('should reject when file is null', async () => {
      await expect(jsonParser.parseFile(null)).rejects.toThrow(
        'Invalid file provided'
      );
    });

    it('should reject when file is undefined', async () => {
      await expect(jsonParser.parseFile(undefined)).rejects.toThrow(
        'Invalid file provided'
      );
    });

    it('should reject when file is not a File instance', async () => {
      await expect(jsonParser.parseFile({ name: 'fake.json' })).rejects.toThrow(
        'Invalid file provided'
      );
    });

    it('should reject when JSON is invalid', async () => {
      const invalidContent = '{"invalid": }';
      const file = new File([invalidContent], 'invalid.json', {
        type: 'application/json',
      });

      await expect(jsonParser.parseFile(file)).rejects.toThrow(
        'JSON validation failed'
      );
    });

    it('should parse empty object successfully', async () => {
      const content = JSON.stringify({});
      const file = new File([content], 'empty.json', {
        type: 'application/json',
      });

      const result = await jsonParser.parseFile(file);

      expect(result.isValid).toBe(true);
      expect(result.data).toEqual({});
      expect(result.keyCount).toBe(0);
    });

    it('should parse nested objects correctly', async () => {
      const content = JSON.stringify({
        level1: {
          level2: {
            level3: 'value',
          },
        },
      });
      const file = new File([content], 'nested.json', {
        type: 'application/json',
      });

      const result = await jsonParser.parseFile(file);

      expect(result.isValid).toBe(true);
      expect(result.keyCount).toBe(3); // level1, level2, level3
    });

    it('should handle arrays in JSON', async () => {
      const content = JSON.stringify({ items: ['a', 'b', 'c'], count: 3 });
      const file = new File([content], 'array.json', {
        type: 'application/json',
      });

      const result = await jsonParser.parseFile(file);

      expect(result.isValid).toBe(true);
      expect(result.data.items).toEqual(['a', 'b', 'c']);
      expect(result.keyCount).toBe(2); // items, count
    });

    it('should handle unicode characters', async () => {
      const content = JSON.stringify({ message: '你好世界', emoji: '🎉' });
      const file = new File([content], 'unicode.json', {
        type: 'application/json',
      });

      const result = await jsonParser.parseFile(file);

      expect(result.isValid).toBe(true);
      expect(result.data.message).toBe('你好世界');
      expect(result.data.emoji).toBe('🎉');
    });

    it('should handle special characters in keys', async () => {
      const content = JSON.stringify({
        'key-with-dash': 'value1',
        'key.with.dot': 'value2',
      });
      const file = new File([content], 'special.json', {
        type: 'application/json',
      });

      const result = await jsonParser.parseFile(file);

      expect(result.isValid).toBe(true);
      expect(result.data['key-with-dash']).toBe('value1');
      expect(result.data['key.with.dot']).toBe('value2');
    });
  });

  describe('validateJsonString', () => {
    it('should validate correct JSON string', () => {
      const result = jsonParser.validateJsonString('{"valid": "json"}');

      expect(result.isValid).toBe(true);
    });

    it('should reject invalid JSON string', () => {
      const result = jsonParser.validateJsonString('{"invalid": }');

      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject empty string', () => {
      const result = jsonParser.validateJsonString('');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Input must be a non-empty string');
    });

    it('should reject null', () => {
      const result = jsonParser.validateJsonString(null);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Input must be a non-empty string');
    });

    it('should reject undefined', () => {
      const result = jsonParser.validateJsonString(undefined);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Input must be a non-empty string');
    });

    it('should validate JSON array', () => {
      const result = jsonParser.validateJsonString('["item1", "item2"]');

      expect(result.isValid).toBe(true);
    });

    it('should validate JSON primitives', () => {
      expect(jsonParser.validateJsonString('true').isValid).toBe(true);
      expect(jsonParser.validateJsonString('false').isValid).toBe(true);
      expect(jsonParser.validateJsonString('null').isValid).toBe(true);
      expect(jsonParser.validateJsonString('123').isValid).toBe(true);
      expect(jsonParser.validateJsonString('"string"').isValid).toBe(true);
    });
  });

  describe('getErrorLine', () => {
    it('should return null for valid JSON', () => {
      const validation = { isValid: true };
      const line = jsonParser.getErrorLine(validation);

      expect(line).toBeNull();
    });

    it('should return line number when present in validation result', () => {
      const validation = { isValid: false, error: 'Parse error', line: 5 };
      const line = jsonParser.getErrorLine(validation);

      expect(line).toBe(5);
    });

    it('should return null when line number is not present', () => {
      const validation = { isValid: false, error: 'Parse error' };
      const line = jsonParser.getErrorLine(validation);

      expect(line).toBeNull();
    });

    it('should return null when validation result is null', () => {
      const line = jsonParser.getErrorLine(null);

      expect(line).toBeNull();
    });

    it('should return null when validation result is undefined', () => {
      const line = jsonParser.getErrorLine(undefined);

      expect(line).toBeNull();
    });

    it('should handle line number 0', () => {
      const validation = { isValid: false, error: 'Parse error', line: 0 };
      const line = jsonParser.getErrorLine(validation);

      expect(line).toBe(0);
    });
  });

  describe('integration with utilities', () => {
    it('should integrate with jsonValidator for validation', async () => {
      const invalidContent = '{"broken": json}';
      const file = new File([invalidContent], 'broken.json', {
        type: 'application/json',
      });

      await expect(jsonParser.parseFile(file)).rejects.toThrow();
    });

    it('should integrate with keyCounter for counting keys', async () => {
      const content = JSON.stringify({
        a: { b: { c: 'value' } },
        x: { y: 'value' },
      });
      const file = new File([content], 'count.json', {
        type: 'application/json',
      });

      const result = await jsonParser.parseFile(file);

      expect(result.keyCount).toBe(5); // a, b, c, x, y
    });

    it('should provide complete metadata for parsed file', async () => {
      const content = JSON.stringify({ test: 'data' });
      const file = new File([content], 'metadata.json', {
        type: 'application/json',
      });

      const result = await jsonParser.parseFile(file);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('keyCount');
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('fileName');
      expect(result).toHaveProperty('fileSize');
    });
  });

  describe('edge cases', () => {
    it('should handle very deeply nested objects', async () => {
      const deepObject = {
        l1: {
          l2: {
            l3: { l4: { l5: { l6: { l7: { l8: { l9: { l10: 'deep' } } } } } } },
          },
        },
      };
      const content = JSON.stringify(deepObject);
      const file = new File([content], 'deep.json', {
        type: 'application/json',
      });

      const result = await jsonParser.parseFile(file);

      expect(result.isValid).toBe(true);
      expect(result.keyCount).toBe(10);
    });

    it('should handle file with only whitespace', async () => {
      const content = '   \n\t  ';
      const file = new File([content], 'whitespace.json', {
        type: 'application/json',
      });

      await expect(jsonParser.parseFile(file)).rejects.toThrow();
    });

    it('should handle large JSON file', async () => {
      const largeObject = {};
      for (let i = 0; i < 100; i++) {
        largeObject[`key${i}`] = `value${i}`;
      }
      const content = JSON.stringify(largeObject);
      const file = new File([content], 'large.json', {
        type: 'application/json',
      });

      const result = await jsonParser.parseFile(file);

      expect(result.isValid).toBe(true);
      expect(result.keyCount).toBe(100);
    });
  });
});
