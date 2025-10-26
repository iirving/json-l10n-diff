import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useFileStore } from '@/stores/useFileStore.js';

// Mock useJsonDiff composable
vi.mock('@/composables/useJsonDiff.js', () => ({
  useJsonDiff: () => ({
    compareFiles: vi.fn((file1Data, file2Data) => {
      // Simple mock comparison logic
      return [
        {
          keyPath: 'app.title',
          status: 'different',
          leftValue: file1Data.app?.title,
          rightValue: file2Data.app?.title,
        },
      ];
    }),
  }),
}));

describe('useFileStore', () => {
  let store;

  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia());
    store = useFileStore();
  });

  describe('initial state', () => {
    it('should have null files initially', () => {
      expect(store.file1).toBeNull();
      expect(store.file2).toBeNull();
    });

    it('should have null diffResults initially', () => {
      expect(store.diffResults).toBeNull();
    });

    it('should not be loading initially', () => {
      expect(store.isLoading).toBe(false);
    });

    it('should have no error initially', () => {
      expect(store.error).toBeNull();
    });
  });

  describe('getters', () => {
    describe('hasFiles', () => {
      it('should return false when no files are loaded', () => {
        expect(store.hasFiles).toBe(false);
      });

      it('should return false when only file1 is loaded', () => {
        store.setFile1({ data: { test: 'data' }, keyCount: 1 });
        expect(store.hasFiles).toBe(false);
      });

      it('should return false when only file2 is loaded', () => {
        store.setFile2({ data: { test: 'data' }, keyCount: 1 });
        expect(store.hasFiles).toBe(false);
      });

      it('should return true when both files are loaded', () => {
        store.setFile1({ data: { test: 'data1' }, keyCount: 1 });
        store.setFile2({ data: { test: 'data2' }, keyCount: 1 });
        expect(store.hasFiles).toBe(true);
      });
    });

    describe('hasComparison', () => {
      it('should return false when no comparison has been run', () => {
        expect(store.hasComparison).toBe(false);
      });

      it('should return true when comparison results exist', () => {
        store.diffResults = [{ keyPath: 'test', status: 'different' }];
        expect(store.hasComparison).toBe(true);
      });
    });

    describe('file1KeyCount', () => {
      it('should return 0 when file1 is null', () => {
        expect(store.file1KeyCount).toBe(0);
      });

      it('should return keyCount from file1', () => {
        store.setFile1({ data: {}, keyCount: 42 });
        expect(store.file1KeyCount).toBe(42);
      });

      it('should return 0 when file1 has no keyCount', () => {
        store.setFile1({ data: {} });
        expect(store.file1KeyCount).toBe(0);
      });
    });

    describe('file2KeyCount', () => {
      it('should return 0 when file2 is null', () => {
        expect(store.file2KeyCount).toBe(0);
      });

      it('should return keyCount from file2', () => {
        store.setFile2({ data: {}, keyCount: 58 });
        expect(store.file2KeyCount).toBe(58);
      });

      it('should return 0 when file2 has no keyCount', () => {
        store.setFile2({ data: {} });
        expect(store.file2KeyCount).toBe(0);
      });
    });
  });

  describe('actions', () => {
    describe('setFile1', () => {
      it('should set file1 data', () => {
        const fileData = { data: { app: { title: 'Test' } }, keyCount: 2 };
        store.setFile1(fileData);

        expect(store.file1).toEqual(fileData);
      });

      it('should clear error when setting file1', () => {
        store.error = 'Previous error';
        store.setFile1({ data: {}, keyCount: 0 });

        expect(store.error).toBeNull();
      });

      it('should clear diffResults when setting file1', () => {
        store.diffResults = [{ keyPath: 'test', status: 'different' }];
        store.setFile1({ data: {}, keyCount: 0 });

        expect(store.diffResults).toBeNull();
      });
    });

    describe('setFile2', () => {
      it('should set file2 data', () => {
        const fileData = { data: { app: { title: 'Test' } }, keyCount: 2 };
        store.setFile2(fileData);

        expect(store.file2).toEqual(fileData);
      });

      it('should clear error when setting file2', () => {
        store.error = 'Previous error';
        store.setFile2({ data: {}, keyCount: 0 });

        expect(store.error).toBeNull();
      });

      it('should clear diffResults when setting file2', () => {
        store.diffResults = [{ keyPath: 'test', status: 'different' }];
        store.setFile2({ data: {}, keyCount: 0 });

        expect(store.diffResults).toBeNull();
      });
    });

    describe('runComparison', () => {
      it('should throw error when file1 is not loaded', () => {
        store.setFile2({ data: {}, keyCount: 0 });

        expect(() => store.runComparison()).toThrow(
          'Both files must be loaded before running comparison'
        );
      });

      it('should throw error when file2 is not loaded', () => {
        store.setFile1({ data: {}, keyCount: 0 });

        expect(() => store.runComparison()).toThrow(
          'Both files must be loaded before running comparison'
        );
      });

      it('should set error when files are not loaded', () => {
        try {
          store.runComparison();
        } catch {
          // Expected error
        }

        expect(store.error).toBe(
          'Both files must be loaded before running comparison'
        );
      });

      it('should run comparison when both files are loaded', () => {
        store.setFile1({ data: { app: { title: 'App1' } }, keyCount: 2 });
        store.setFile2({ data: { app: { title: 'App2' } }, keyCount: 2 });

        const results = store.runComparison();

        expect(results).toBeDefined();
        expect(Array.isArray(results)).toBe(true);
      });

      it('should store diffResults after comparison', () => {
        store.setFile1({ data: { app: { title: 'App1' } }, keyCount: 2 });
        store.setFile2({ data: { app: { title: 'App2' } }, keyCount: 2 });

        store.runComparison();

        expect(store.diffResults).not.toBeNull();
        expect(Array.isArray(store.diffResults)).toBe(true);
      });

      it('should clear error on successful comparison', () => {
        store.error = 'Previous error';
        store.setFile1({ data: { test: 'data1' }, keyCount: 1 });
        store.setFile2({ data: { test: 'data2' }, keyCount: 1 });

        store.runComparison();

        expect(store.error).toBeNull();
      });

      it('should set isLoading to false after comparison', () => {
        store.setFile1({ data: { test: 'data1' }, keyCount: 1 });
        store.setFile2({ data: { test: 'data2' }, keyCount: 1 });

        store.runComparison();

        expect(store.isLoading).toBe(false);
      });
    });

    describe('reset', () => {
      it('should reset file1 to null', () => {
        store.setFile1({ data: {}, keyCount: 0 });
        store.reset();

        expect(store.file1).toBeNull();
      });

      it('should reset file2 to null', () => {
        store.setFile2({ data: {}, keyCount: 0 });
        store.reset();

        expect(store.file2).toBeNull();
      });

      it('should reset diffResults to null', () => {
        store.diffResults = [{ keyPath: 'test', status: 'different' }];
        store.reset();

        expect(store.diffResults).toBeNull();
      });

      it('should reset isLoading to false', () => {
        store.isLoading = true;
        store.reset();

        expect(store.isLoading).toBe(false);
      });

      it('should reset error to null', () => {
        store.error = 'Some error';
        store.reset();

        expect(store.error).toBeNull();
      });

      it('should reset all state at once', () => {
        store.setFile1({ data: {}, keyCount: 1 });
        store.setFile2({ data: {}, keyCount: 1 });
        store.diffResults = [{ keyPath: 'test', status: 'different' }];
        store.isLoading = true;
        store.error = 'Error';

        store.reset();

        expect(store.file1).toBeNull();
        expect(store.file2).toBeNull();
        expect(store.diffResults).toBeNull();
        expect(store.isLoading).toBe(false);
        expect(store.error).toBeNull();
      });
    });

    describe('clearComparison', () => {
      it('should clear diffResults', () => {
        store.diffResults = [{ keyPath: 'test', status: 'different' }];
        store.clearComparison();

        expect(store.diffResults).toBeNull();
      });

      it('should clear error', () => {
        store.error = 'Some error';
        store.clearComparison();

        expect(store.error).toBeNull();
      });

      it('should keep file1 intact', () => {
        const fileData = { data: {}, keyCount: 1 };
        store.setFile1(fileData);
        store.clearComparison();

        expect(store.file1).toEqual(fileData);
      });

      it('should keep file2 intact', () => {
        const fileData = { data: {}, keyCount: 1 };
        store.setFile2(fileData);
        store.clearComparison();

        expect(store.file2).toEqual(fileData);
      });
    });
  });

  describe('integration scenarios', () => {
    it('should handle full workflow: load files, compare, reset', () => {
      // Load files
      store.setFile1({ data: { app: { title: 'App1' } }, keyCount: 2 });
      store.setFile2({ data: { app: { title: 'App2' } }, keyCount: 2 });

      expect(store.hasFiles).toBe(true);

      // Run comparison
      store.runComparison();

      expect(store.hasComparison).toBe(true);

      // Reset
      store.reset();

      expect(store.hasFiles).toBe(false);
      expect(store.hasComparison).toBe(false);
    });

    it('should handle file replacement and re-comparison', () => {
      // Initial files
      store.setFile1({ data: { test: 'data1' }, keyCount: 1 });
      store.setFile2({ data: { test: 'data2' }, keyCount: 1 });
      store.runComparison();

      // Replace file1
      store.setFile1({ data: { test: 'newData1' }, keyCount: 1 });

      expect(store.diffResults).toBeNull(); // Should clear on file change

      // Re-run comparison
      store.runComparison();

      expect(store.diffResults).not.toBeNull();
    });

    it('should maintain state across multiple comparisons', () => {
      store.setFile1({ data: { a: 1 }, keyCount: 1 });
      store.setFile2({ data: { b: 2 }, keyCount: 1 });

      // First comparison
      store.runComparison();
      expect(store.diffResults).not.toBeNull();

      // Clear comparison only
      store.clearComparison();

      expect(store.file1).not.toBeNull();
      expect(store.file2).not.toBeNull();
      expect(store.diffResults).toBeNull();

      // Second comparison with same files
      store.runComparison();

      expect(store.diffResults).toBeDefined();
      expect(store.file1).not.toBeNull();
      expect(store.file2).not.toBeNull();
    });
  });
});
