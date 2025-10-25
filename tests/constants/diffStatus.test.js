import { describe, it, expect } from 'vitest';
import {
  MISSING_LEFT,
  MISSING_RIGHT,
  IDENTICAL,
  DIFFERENT,
  DIFF_STATUSES,
  isValidDiffStatus,
} from '@/constants/diffStatus.js';

describe('diffStatus constants', () => {
  describe('constant values', () => {
    it('should define MISSING_LEFT', () => {
      expect(MISSING_LEFT).toBe('missing-left');
    });

    it('should define MISSING_RIGHT', () => {
      expect(MISSING_RIGHT).toBe('missing-right');
    });

    it('should define IDENTICAL', () => {
      expect(IDENTICAL).toBe('identical');
    });

    it('should define DIFFERENT', () => {
      expect(DIFFERENT).toBe('different');
    });
  });

  describe('DIFF_STATUSES array', () => {
    it('should contain all status constants', () => {
      expect(DIFF_STATUSES).toContain(MISSING_LEFT);
      expect(DIFF_STATUSES).toContain(MISSING_RIGHT);
      expect(DIFF_STATUSES).toContain(IDENTICAL);
      expect(DIFF_STATUSES).toContain(DIFFERENT);
    });

    it('should have exactly 4 statuses', () => {
      expect(DIFF_STATUSES).toHaveLength(4);
    });

    it('should be frozen (immutable)', () => {
      expect(Object.isFrozen(DIFF_STATUSES)).toBe(true);
    });
  });

  describe('isValidDiffStatus', () => {
    it('should return true for MISSING_LEFT', () => {
      expect(isValidDiffStatus(MISSING_LEFT)).toBe(true);
    });

    it('should return true for MISSING_RIGHT', () => {
      expect(isValidDiffStatus(MISSING_RIGHT)).toBe(true);
    });

    it('should return true for IDENTICAL', () => {
      expect(isValidDiffStatus(IDENTICAL)).toBe(true);
    });

    it('should return true for DIFFERENT', () => {
      expect(isValidDiffStatus(DIFFERENT)).toBe(true);
    });

    it('should return false for invalid status', () => {
      expect(isValidDiffStatus('invalid')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidDiffStatus('')).toBe(false);
    });

    it('should return false for null', () => {
      expect(isValidDiffStatus(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isValidDiffStatus(undefined)).toBe(false);
    });
  });

  describe('backwards compatibility', () => {
    it('should maintain string values for existing code', () => {
      expect(MISSING_LEFT).toBe('missing-left');
      expect(MISSING_RIGHT).toBe('missing-right');
      expect(IDENTICAL).toBe('identical');
      expect(DIFFERENT).toBe('different');
    });
  });
});
