import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useEditStore } from '@/stores/useEditStore.js';

describe('useEditStore', () => {
  let store;

  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia());
    store = useEditStore();
  });

  describe('initial state', () => {
    it('should have empty editHistory maps for both files', () => {
      expect(store.editHistory.get('file1').size).toBe(0);
      expect(store.editHistory.get('file2').size).toBe(0);
    });

    it('should have null file1Modified initially', () => {
      expect(store.file1Modified).toBeNull();
    });

    it('should have null file2Modified initially', () => {
      expect(store.file2Modified).toBeNull();
    });
  });

  describe('getters', () => {
    describe('hasFile1Edits', () => {
      it('should return false when no edits exist for file1', () => {
        expect(store.hasFile1Edits).toBe(false);
      });

      it('should return true when edits exist for file1', () => {
        store.addEdit('file1', 'app.title', 'New Title');
        expect(store.hasFile1Edits).toBe(true);
      });
    });

    describe('hasFile2Edits', () => {
      it('should return false when no edits exist for file2', () => {
        expect(store.hasFile2Edits).toBe(false);
      });

      it('should return true when edits exist for file2', () => {
        store.addEdit('file2', 'app.title', 'New Title');
        expect(store.hasFile2Edits).toBe(true);
      });
    });

    describe('hasAnyEdits', () => {
      it('should return false when no edits exist', () => {
        expect(store.hasAnyEdits).toBe(false);
      });

      it('should return true when file1 has edits', () => {
        store.addEdit('file1', 'app.title', 'New Title');
        expect(store.hasAnyEdits).toBe(true);
      });

      it('should return true when file2 has edits', () => {
        store.addEdit('file2', 'app.title', 'New Title');
        expect(store.hasAnyEdits).toBe(true);
      });

      it('should return true when both files have edits', () => {
        store.addEdit('file1', 'app.title', 'New Title 1');
        store.addEdit('file2', 'app.title', 'New Title 2');
        expect(store.hasAnyEdits).toBe(true);
      });
    });

    describe('getFileEdits', () => {
      it('should return empty map for file with no edits', () => {
        const edits = store.getFileEdits('file1');
        expect(edits.size).toBe(0);
      });

      it('should return all edits for a file', () => {
        store.addEdit('file1', 'app.title', 'New Title');
        store.addEdit('file1', 'app.welcome', 'Welcome');

        const edits = store.getFileEdits('file1');
        expect(edits.size).toBe(2);
        expect(edits.has('app.title')).toBe(true);
        expect(edits.has('app.welcome')).toBe(true);
      });

      it('should return empty map for invalid fileKey', () => {
        const edits = store.getFileEdits('invalid');
        expect(edits.size).toBe(0);
      });
    });

    describe('getEdit', () => {
      it('should return undefined for non-existent edit', () => {
        const edit = store.getEdit('file1', 'app.title');
        expect(edit).toBeUndefined();
      });

      it('should return specific edit by fileKey and keyPath', () => {
        store.addEdit('file1', 'app.title', 'New Title', 'modify');

        const edit = store.getEdit('file1', 'app.title');
        expect(edit).toBeDefined();
        expect(edit.newValue).toBe('New Title');
        expect(edit.editType).toBe('modify');
      });

      it('should return correct edit for different files', () => {
        store.addEdit('file1', 'app.title', 'Title 1');
        store.addEdit('file2', 'app.title', 'Title 2');

        const edit1 = store.getEdit('file1', 'app.title');
        const edit2 = store.getEdit('file2', 'app.title');

        expect(edit1.newValue).toBe('Title 1');
        expect(edit2.newValue).toBe('Title 2');
      });
    });
  });

  describe('actions', () => {
    describe('addEdit', () => {
      it('should add edit to file1 history', () => {
        store.addEdit('file1', 'app.title', 'New Title');

        const edits = store.editHistory.get('file1');
        expect(edits.has('app.title')).toBe(true);
      });

      it('should add edit to file2 history', () => {
        store.addEdit('file2', 'app.welcome', 'Welcome');

        const edits = store.editHistory.get('file2');
        expect(edits.has('app.welcome')).toBe(true);
      });

      it('should store edit details correctly', () => {
        store.addEdit('file1', 'app.title', 'New Title', 'modify');

        const edit = store.editHistory.get('file1').get('app.title');
        expect(edit.keyPath).toBe('app.title');
        expect(edit.newValue).toBe('New Title');
        expect(edit.editType).toBe('modify');
        expect(edit.timestamp).toBeDefined();
      });

      it('should default editType to modify', () => {
        store.addEdit('file1', 'app.title', 'New Title');

        const edit = store.editHistory.get('file1').get('app.title');
        expect(edit.editType).toBe('modify');
      });

      it('should update existing edit if keyPath already exists', () => {
        store.addEdit('file1', 'app.title', 'First Value');
        store.addEdit('file1', 'app.title', 'Second Value');

        const edits = store.editHistory.get('file1');
        expect(edits.size).toBe(1);
        expect(edits.get('app.title').newValue).toBe('Second Value');
      });

      it('should throw error for invalid fileKey', () => {
        expect(() => {
          store.addEdit('invalid', 'app.title', 'Value');
        }).toThrow("Invalid fileKey: invalid. Must be 'file1' or 'file2'");
      });

      it('should add multiple edits to same file', () => {
        store.addEdit('file1', 'app.title', 'Title');
        store.addEdit('file1', 'app.welcome', 'Welcome');
        store.addEdit('file1', 'app.footer', 'Footer');

        const edits = store.editHistory.get('file1');
        expect(edits.size).toBe(3);
      });
    });

    describe('applyEdit', () => {
      it('should apply single edit to file data', () => {
        const originalData = { app: { title: 'Original' } };
        store.addEdit('file1', 'app.title', 'Modified');

        const modifiedData = store.applyEdit('file1', originalData);

        expect(modifiedData.app.title).toBe('Modified');
      });

      it('should apply multiple edits to file data', () => {
        const originalData = { app: { title: 'Title', welcome: 'Welcome' } };
        store.addEdit('file1', 'app.title', 'New Title');
        store.addEdit('file1', 'app.welcome', 'New Welcome');

        const modifiedData = store.applyEdit('file1', originalData);

        expect(modifiedData.app.title).toBe('New Title');
        expect(modifiedData.app.welcome).toBe('New Welcome');
      });

      it('should not mutate original data', () => {
        const originalData = { app: { title: 'Original' } };
        store.addEdit('file1', 'app.title', 'Modified');

        store.applyEdit('file1', originalData);

        expect(originalData.app.title).toBe('Original');
      });

      it('should store modified data in file1Modified', () => {
        const originalData = { app: { title: 'Original' } };
        store.addEdit('file1', 'app.title', 'Modified');

        store.applyEdit('file1', originalData);

        expect(store.file1Modified).not.toBeNull();
        expect(store.file1Modified.app.title).toBe('Modified');
      });

      it('should store modified data in file2Modified', () => {
        const originalData = { app: { title: 'Original' } };
        store.addEdit('file2', 'app.title', 'Modified');

        store.applyEdit('file2', originalData);

        expect(store.file2Modified).not.toBeNull();
        expect(store.file2Modified.app.title).toBe('Modified');
      });

      it('should throw error for invalid fileKey', () => {
        expect(() => {
          store.applyEdit('invalid', {});
        }).toThrow("Invalid fileKey: invalid. Must be 'file1' or 'file2'");
      });

      it('should handle nested key paths', () => {
        const originalData = { app: { ui: { header: { title: 'Original' } } } };
        store.addEdit('file1', 'app.ui.header.title', 'New Title');

        const modifiedData = store.applyEdit('file1', originalData);

        expect(modifiedData.app.ui.header.title).toBe('New Title');
      });

      it('should create nested objects for new keys', () => {
        const originalData = { app: {} };
        store.addEdit('file1', 'app.new.nested.key', 'Value');

        const modifiedData = store.applyEdit('file1', originalData);

        expect(modifiedData.app.new.nested.key).toBe('Value');
      });
    });

    describe('clearEdits', () => {
      it('should clear edits for file1', () => {
        store.addEdit('file1', 'app.title', 'Title');
        store.addEdit('file1', 'app.welcome', 'Welcome');

        store.clearEdits('file1');

        expect(store.editHistory.get('file1').size).toBe(0);
      });

      it('should clear edits for file2', () => {
        store.addEdit('file2', 'app.title', 'Title');

        store.clearEdits('file2');

        expect(store.editHistory.get('file2').size).toBe(0);
      });

      it('should clear file1Modified when clearing file1 edits', () => {
        store.file1Modified = { app: { title: 'Modified' } };
        store.clearEdits('file1');

        expect(store.file1Modified).toBeNull();
      });

      it('should clear file2Modified when clearing file2 edits', () => {
        store.file2Modified = { app: { title: 'Modified' } };
        store.clearEdits('file2');

        expect(store.file2Modified).toBeNull();
      });

      it('should not affect other file when clearing one', () => {
        store.addEdit('file1', 'app.title', 'Title 1');
        store.addEdit('file2', 'app.title', 'Title 2');

        store.clearEdits('file1');

        expect(store.editHistory.get('file1').size).toBe(0);
        expect(store.editHistory.get('file2').size).toBe(1);
      });

      it('should throw error for invalid fileKey', () => {
        expect(() => {
          store.clearEdits('invalid');
        }).toThrow("Invalid fileKey: invalid. Must be 'file1' or 'file2'");
      });
    });

    describe('clearAllEdits', () => {
      it('should clear all edits for both files', () => {
        store.addEdit('file1', 'app.title', 'Title 1');
        store.addEdit('file2', 'app.title', 'Title 2');

        store.clearAllEdits();

        expect(store.editHistory.get('file1').size).toBe(0);
        expect(store.editHistory.get('file2').size).toBe(0);
      });

      it('should clear both modified file states', () => {
        store.file1Modified = { app: { title: 'Modified 1' } };
        store.file2Modified = { app: { title: 'Modified 2' } };

        store.clearAllEdits();

        expect(store.file1Modified).toBeNull();
        expect(store.file2Modified).toBeNull();
      });
    });

    describe('getCurrentData', () => {
      it('should return original data when no edits exist', () => {
        const originalData = { app: { title: 'Original' } };

        const currentData = store.getCurrentData('file1', originalData);

        expect(currentData).toEqual(originalData);
      });

      it('should return modified data when edits have been applied', () => {
        const originalData = { app: { title: 'Original' } };
        store.addEdit('file1', 'app.title', 'Modified');
        store.applyEdit('file1', originalData);

        const currentData = store.getCurrentData('file1', originalData);

        expect(currentData.app.title).toBe('Modified');
      });

      it('should return file2 modified data correctly', () => {
        const originalData = { app: { title: 'Original' } };
        store.addEdit('file2', 'app.title', 'Modified');
        store.applyEdit('file2', originalData);

        const currentData = store.getCurrentData('file2', originalData);

        expect(currentData.app.title).toBe('Modified');
      });

      it('should return original data for invalid fileKey', () => {
        const originalData = { app: { title: 'Original' } };

        const currentData = store.getCurrentData('invalid', originalData);

        expect(currentData).toEqual(originalData);
      });
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete edit workflow', () => {
      const originalData = { app: { title: 'Original', welcome: 'Hello' } };

      // Add edits
      store.addEdit('file1', 'app.title', 'New Title');
      store.addEdit('file1', 'app.welcome', 'Welcome');

      expect(store.hasFile1Edits).toBe(true);

      // Apply edits
      const modifiedData = store.applyEdit('file1', originalData);

      expect(modifiedData.app.title).toBe('New Title');
      expect(modifiedData.app.welcome).toBe('Welcome');

      // Get current data
      const currentData = store.getCurrentData('file1', originalData);
      expect(currentData).toEqual(modifiedData);

      // Clear edits
      store.clearEdits('file1');

      expect(store.hasFile1Edits).toBe(false);
      expect(store.file1Modified).toBeNull();
    });

    it('should handle edits on both files independently', () => {
      const file1Data = { app: { title: 'App1' } };
      const file2Data = { app: { title: 'App2' } };

      // Edit both files
      store.addEdit('file1', 'app.title', 'Modified1');
      store.addEdit('file2', 'app.title', 'Modified2');

      // Apply edits
      store.applyEdit('file1', file1Data);
      store.applyEdit('file2', file2Data);

      // Verify independence
      expect(store.file1Modified.app.title).toBe('Modified1');
      expect(store.file2Modified.app.title).toBe('Modified2');

      // Clear one file
      store.clearEdits('file1');

      expect(store.file1Modified).toBeNull();
      expect(store.file2Modified).not.toBeNull();
    });

    it('should maintain edit history across multiple modifications', () => {
      const originalData = { app: { title: 'Original' } };

      // First edit
      store.addEdit('file1', 'app.title', 'First');
      store.applyEdit('file1', originalData);

      // Second edit (update same key)
      store.addEdit('file1', 'app.title', 'Second');
      store.applyEdit('file1', originalData);

      // History should show latest edit
      const edit = store.getEdit('file1', 'app.title');
      expect(edit.newValue).toBe('Second');

      // Applied data should reflect latest
      expect(store.file1Modified.app.title).toBe('Second');
    });
  });

  describe('edge cases', () => {
    it('should handle empty original data', () => {
      const originalData = {};
      store.addEdit('file1', 'new.key', 'value');

      const modifiedData = store.applyEdit('file1', originalData);

      expect(modifiedData.new.key).toBe('value');
    });

    it('should handle deeply nested paths', () => {
      const originalData = { a: { b: { c: { d: { e: 'deep' } } } } };
      store.addEdit('file1', 'a.b.c.d.e', 'modified');

      const modifiedData = store.applyEdit('file1', originalData);

      expect(modifiedData.a.b.c.d.e).toBe('modified');
    });

    it('should handle special characters in values', () => {
      const originalData = { app: { title: 'Normal' } };
      store.addEdit(
        'file1',
        'app.title',
        'Title with "quotes" and \\backslashes\\'
      );

      const modifiedData = store.applyEdit('file1', originalData);

      expect(modifiedData.app.title).toBe(
        'Title with "quotes" and \\backslashes\\'
      );
    });

    it('should handle null and undefined values', () => {
      const originalData = { app: { title: 'Title' } };

      store.addEdit('file1', 'app.nullValue', null);
      store.addEdit('file1', 'app.undefinedValue', undefined);

      const modifiedData = store.applyEdit('file1', originalData);

      expect(modifiedData.app.nullValue).toBeNull();
      expect(modifiedData.app.undefinedValue).toBeUndefined();
    });

    it('should handle array values', () => {
      const originalData = { app: { items: [] } };
      store.addEdit('file1', 'app.items', ['item1', 'item2', 'item3']);

      const modifiedData = store.applyEdit('file1', originalData);

      expect(modifiedData.app.items).toEqual(['item1', 'item2', 'item3']);
    });
  });
});
