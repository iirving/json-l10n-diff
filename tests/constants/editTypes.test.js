import { describe, it, expect } from 'vitest';
import {
  EDIT_TYPE_MODIFY,
  EDIT_TYPE_ADD,
  EDIT_TYPE_DELETE,
  EDIT_TYPES,
  isValidEditType,
} from '@/constants/editTypes.js';

describe('editTypes constants', () => {
  describe('constant values', () => {
    it('should define EDIT_TYPE_MODIFY', () => {
      expect(EDIT_TYPE_MODIFY).toBe('modify');
    });

    it('should define EDIT_TYPE_ADD', () => {
      expect(EDIT_TYPE_ADD).toBe('add');
    });

    it('should define EDIT_TYPE_DELETE', () => {
      expect(EDIT_TYPE_DELETE).toBe('delete');
    });
  });

  describe('EDIT_TYPES array', () => {
    it('should contain all edit type constants', () => {
      expect(EDIT_TYPES).toContain(EDIT_TYPE_MODIFY);
      expect(EDIT_TYPES).toContain(EDIT_TYPE_ADD);
      expect(EDIT_TYPES).toContain(EDIT_TYPE_DELETE);
    });

    it('should have exactly 3 edit types', () => {
      expect(EDIT_TYPES).toHaveLength(3);
    });

    it('should be frozen (immutable)', () => {
      expect(Object.isFrozen(EDIT_TYPES)).toBe(true);
    });
  });

  describe('isValidEditType', () => {
    it('should return true for EDIT_TYPE_MODIFY', () => {
      expect(isValidEditType(EDIT_TYPE_MODIFY)).toBe(true);
    });

    it('should return true for EDIT_TYPE_ADD', () => {
      expect(isValidEditType(EDIT_TYPE_ADD)).toBe(true);
    });

    it('should return true for EDIT_TYPE_DELETE', () => {
      expect(isValidEditType(EDIT_TYPE_DELETE)).toBe(true);
    });

    it('should return false for invalid edit type', () => {
      expect(isValidEditType('invalid')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidEditType('')).toBe(false);
    });

    it('should return false for null', () => {
      expect(isValidEditType(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isValidEditType(undefined)).toBe(false);
    });
  });

  describe('use cases', () => {
    it('should support switch statements', () => {
      const getActionName = (editType) => {
        switch (editType) {
          case EDIT_TYPE_MODIFY:
            return 'Modified';
          case EDIT_TYPE_ADD:
            return 'Added';
          case EDIT_TYPE_DELETE:
            return 'Deleted';
          default:
            return 'Unknown';
        }
      };

      expect(getActionName(EDIT_TYPE_MODIFY)).toBe('Modified');
      expect(getActionName(EDIT_TYPE_ADD)).toBe('Added');
      expect(getActionName(EDIT_TYPE_DELETE)).toBe('Deleted');
      expect(getActionName('invalid')).toBe('Unknown');
    });
  });
});
