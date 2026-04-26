import { describe, it, expect } from 'vitest';
import { prettifyJson } from '@/utils/prettifyJson.js';

describe('prettifyJson', () => {
  describe('object input', () => {
    it('should format a simple flat object with 2-space indentation', () => {
      const input = { a: 1, b: 2 };
      const result = prettifyJson(input);
      expect(result).toBe('{\n  "a": 1,\n  "b": 2\n}');
    });

    it('should format a nested object with 2-space indentation', () => {
      const input = { app: { title: 'My App', welcome: 'Hello' } };
      const result = prettifyJson(input);
      expect(result).toBe(
        '{\n  "app": {\n    "title": "My App",\n    "welcome": "Hello"\n  }\n}'
      );
    });

    it('should format an empty object', () => {
      expect(prettifyJson({})).toBe('{}');
    });

    it('should handle an object with string values', () => {
      const input = { greeting: 'Hello', farewell: 'Goodbye' };
      const result = prettifyJson(input);
      expect(result).toContain('"greeting": "Hello"');
      expect(result).toContain('"farewell": "Goodbye"');
    });

    it('should handle an object with boolean values', () => {
      const input = { active: true, visible: false };
      const result = prettifyJson(input);
      expect(result).toContain('"active": true');
      expect(result).toContain('"visible": false');
    });

    it('should handle an object with null values', () => {
      const input = { key: null };
      const result = prettifyJson(input);
      expect(result).toContain('"key": null');
    });

    it('should handle an object with numeric values', () => {
      const input = { count: 42, ratio: 3.14 };
      const result = prettifyJson(input);
      expect(result).toContain('"count": 42');
      expect(result).toContain('"ratio": 3.14');
    });

    it('should handle an object with array values', () => {
      const input = { items: [1, 2, 3] };
      const result = prettifyJson(input);
      expect(result).toContain('"items"');
      expect(result).toContain('1');
      expect(result).toContain('2');
      expect(result).toContain('3');
    });

    it('should produce valid JSON that can be parsed back', () => {
      const input = { app: { title: 'Test', count: 5, active: true } };
      const result = prettifyJson(input);
      expect(() => JSON.parse(result)).not.toThrow();
      expect(JSON.parse(result)).toEqual(input);
    });
  });

  describe('string input', () => {
    it('should format a valid JSON string with 2-space indentation', () => {
      const input = '{"a":1,"b":2}';
      const result = prettifyJson(input);
      expect(result).toBe('{\n  "a": 1,\n  "b": 2\n}');
    });

    it('should reformat an already-prettified JSON string', () => {
      const input = '{\n    "a": 1,\n    "b": 2\n}';
      const result = prettifyJson(input);
      expect(result).toBe('{\n  "a": 1,\n  "b": 2\n}');
    });

    it('should format a minified nested JSON string', () => {
      const input = '{"app":{"title":"My App","welcome":"Hello"}}';
      const result = prettifyJson(input);
      expect(result).toBe(
        '{\n  "app": {\n    "title": "My App",\n    "welcome": "Hello"\n  }\n}'
      );
    });

    it('should produce valid JSON from a string input', () => {
      const input = '{"greeting":"hello","count":3}';
      const result = prettifyJson(input);
      expect(() => JSON.parse(result)).not.toThrow();
      expect(JSON.parse(result)).toEqual({ greeting: 'hello', count: 3 });
    });

    it.each([
      ['{invalid}', 'malformed JSON'],
      ['not json at all', 'plain text'],
      ['{"a":1,}', 'trailing comma'],
    ])('should throw for invalid JSON string (%s)', (input) => {
      expect(() => prettifyJson(input)).toThrow(
        'Invalid JSON provided for formatting'
      );
    });
  });

  describe('output format', () => {
    it('should use exactly 2 spaces for indentation', () => {
      const result = prettifyJson({ key: 'value' });
      const lines = result.split('\n');
      const indentedLine = lines.find((line) => line.startsWith(' '));
      const leadingSpacesMatch = indentedLine?.match(/^ +/);

      expect(indentedLine).toBeDefined();
      expect(leadingSpacesMatch).toBeDefined();
      expect(leadingSpacesMatch[0].length).toBe(2);
    });

    it('should return a string', () => {
      expect(typeof prettifyJson({})).toBe('string');
      expect(typeof prettifyJson('{"a":1}')).toBe('string');
    });
  });
});
