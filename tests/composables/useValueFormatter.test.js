import { describe, it, expect } from 'vitest';
import {
  formatValue,
  truncateValue,
  useValueFormatter,
} from '@/composables/useValueFormatter.js';

describe('useValueFormatter', () => {
  describe('formatValue', () => {
    it('should format null as "null"', () => {
      expect(formatValue(null)).toBe('null');
    });

    it('should format undefined as "—"', () => {
      expect(formatValue(undefined)).toBe('—');
    });

    it('should format strings with quotes', () => {
      expect(formatValue('hello')).toBe('"hello"');
      expect(formatValue('world')).toBe('"world"');
      expect(formatValue('')).toBe('""');
    });

    it('should format arrays as JSON strings', () => {
      expect(formatValue([1, 2, 3])).toBe('[1,2,3]');
      expect(formatValue(['a', 'b'])).toBe('["a","b"]');
      expect(formatValue([])).toBe('[]');
    });

    it('should format objects as "{...}"', () => {
      expect(formatValue({ a: 1 })).toBe('{...}');
      expect(formatValue({ nested: { obj: true } })).toBe('{...}');
      expect(formatValue({})).toBe('{...}');
    });

    it('should format numbers as strings', () => {
      expect(formatValue(42)).toBe('42');
      expect(formatValue(0)).toBe('0');
      expect(formatValue(-123)).toBe('-123');
      expect(formatValue(3.14)).toBe('3.14');
    });

    it('should format booleans as strings', () => {
      expect(formatValue(true)).toBe('true');
      expect(formatValue(false)).toBe('false');
    });

    it('should handle edge cases', () => {
      expect(formatValue(NaN)).toBe('NaN');
      expect(formatValue(Infinity)).toBe('Infinity');
      expect(formatValue(-Infinity)).toBe('-Infinity');
    });
  });

  describe('truncateValue', () => {
    it('should not truncate short strings', () => {
      const shortString = 'short';
      expect(truncateValue(shortString)).toBe('"short"');
    });

    it('should truncate long strings with default length', () => {
      const longString = 'a'.repeat(100);
      const result = truncateValue(longString);
      expect(result.endsWith('...')).toBe(true);
      expect(result.length).toBe(50);
    });

    it('should truncate with custom max length', () => {
      const string = 'hello world';
      const result = truncateValue(string, 10);
      expect(result).toBe('"hello ...');
      expect(result.length).toBe(10);
    });

    it('should handle values that are exactly at max length', () => {
      const string = 'exact';
      const result = truncateValue(string, 7); // "exact" = 7 chars with quotes
      expect(result).toBe('"exact"');
    });

    it('should truncate arrays', () => {
      const longArray = Array(100).fill('item');
      const result = truncateValue(longArray, 30);
      expect(result.endsWith('...')).toBe(true);
      expect(result.length).toBe(30);
    });

    it('should not truncate if formatted value is shorter than maxLength', () => {
      expect(truncateValue(null, 10)).toBe('null');
      expect(truncateValue(undefined, 10)).toBe('—');
      expect(truncateValue(42, 10)).toBe('42');
    });
  });

  describe('useValueFormatter hook', () => {
    it('should return formatValue and truncateValue functions', () => {
      const { formatValue: fv, truncateValue: tv } = useValueFormatter();
      expect(typeof fv).toBe('function');
      expect(typeof tv).toBe('function');
    });

    it('should return working functions', () => {
      const { formatValue: fv, truncateValue: tv } = useValueFormatter();
      expect(fv('test')).toBe('"test"');
      expect(tv('test', 5)).toBe('"t...');
    });

    it('should be reusable across multiple calls', () => {
      const formatter1 = useValueFormatter();
      const formatter2 = useValueFormatter();

      expect(formatter1.formatValue('test')).toBe('"test"');
      expect(formatter2.formatValue('test')).toBe('"test"');
    });
  });

  describe('consistency with original implementation', () => {
    it('should match DualTreeNode formatValue behavior', () => {
      // Original implementation from DualTreeNode.vue
      const originalFormatValue = (value) => {
        if (value === null) return 'null';
        if (value === undefined) return '—';
        if (typeof value === 'string') return `"${value}"`;
        if (Array.isArray(value)) return JSON.stringify(value);
        if (typeof value === 'object') return '{...}';
        return String(value);
      };

      const testCases = [
        null,
        undefined,
        'string',
        123,
        true,
        [1, 2, 3],
        { a: 1 },
      ];

      testCases.forEach((testCase) => {
        expect(formatValue(testCase)).toBe(originalFormatValue(testCase));
      });
    });
  });
});
