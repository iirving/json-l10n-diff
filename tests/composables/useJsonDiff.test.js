import { describe, it, expect, beforeEach } from 'vitest';
import { useJsonDiff } from '@/composables/useJsonDiff.js';

describe('useJsonDiff', () => {
  let jsonDiff;

  beforeEach(() => {
    jsonDiff = useJsonDiff();
  });

  describe('compareFiles', () => {
    describe('basic comparisons', () => {
      it('should identify missing keys in left file', () => {
        const obj1 = { app: { title: 'App1' } };
        const obj2 = { app: { title: 'App1', welcome: 'Hello' } };

        const results = jsonDiff.compareFiles(obj1, obj2);

        const missingLeft = results.find((r) => r.keyPath === 'app.welcome');
        expect(missingLeft).toBeDefined();
        expect(missingLeft.status).toBe('missing-left');
        expect(missingLeft.leftValue).toBeUndefined();
        expect(missingLeft.rightValue).toBe('Hello');
      });

      it('should identify missing keys in right file', () => {
        const obj1 = { app: { title: 'App1', welcome: 'Hello' } };
        const obj2 = { app: { title: 'App1' } };

        const results = jsonDiff.compareFiles(obj1, obj2);

        const missingRight = results.find((r) => r.keyPath === 'app.welcome');
        expect(missingRight).toBeDefined();
        expect(missingRight.status).toBe('missing-right');
        expect(missingRight.leftValue).toBe('Hello');
        expect(missingRight.rightValue).toBeUndefined();
      });

      it('should identify identical values', () => {
        const obj1 = { app: { title: 'Same Title' } };
        const obj2 = { app: { title: 'Same Title' } };

        const results = jsonDiff.compareFiles(obj1, obj2);

        const identical = results.find((r) => r.keyPath === 'app.title');
        expect(identical).toBeDefined();
        expect(identical.status).toBe('identical');
        expect(identical.leftValue).toBe('Same Title');
        expect(identical.rightValue).toBe('Same Title');
      });

      it('should identify different values', () => {
        const obj1 = { app: { title: 'Title 1' } };
        const obj2 = { app: { title: 'Title 2' } };

        const results = jsonDiff.compareFiles(obj1, obj2);

        const different = results.find((r) => r.keyPath === 'app.title');
        expect(different).toBeDefined();
        expect(different.status).toBe('different');
        expect(different.leftValue).toBe('Title 1');
        expect(different.rightValue).toBe('Title 2');
      });
    });

    describe('nested objects', () => {
      it('should handle deeply nested objects', () => {
        const obj1 = { a: { b: { c: { d: { e: 'deep1' } } } } };
        const obj2 = { a: { b: { c: { d: { e: 'deep2' } } } } };

        const results = jsonDiff.compareFiles(obj1, obj2);

        const deep = results.find((r) => r.keyPath === 'a.b.c.d.e');
        expect(deep).toBeDefined();
        expect(deep.status).toBe('different');
        expect(deep.leftValue).toBe('deep1');
        expect(deep.rightValue).toBe('deep2');
      });

      it('should recursively compare nested objects', () => {
        const obj1 = {
          app: {
            ui: { header: 'Header 1', footer: 'Footer 1' },
            messages: { welcome: 'Welcome' },
          },
        };
        const obj2 = {
          app: {
            ui: { header: 'Header 2', footer: 'Footer 1' },
            messages: { welcome: 'Welcome', goodbye: 'Bye' },
          },
        };

        const results = jsonDiff.compareFiles(obj1, obj2);

        // Should have results for all keys
        expect(results.length).toBeGreaterThan(0);

        // Check specific comparisons
        const headerDiff = results.find((r) => r.keyPath === 'app.ui.header');
        expect(headerDiff.status).toBe('different');

        const footerDiff = results.find((r) => r.keyPath === 'app.ui.footer');
        expect(footerDiff.status).toBe('identical');

        const welcomeDiff = results.find(
          (r) => r.keyPath === 'app.messages.welcome'
        );
        expect(welcomeDiff.status).toBe('identical');

        const goodbyeDiff = results.find(
          (r) => r.keyPath === 'app.messages.goodbye'
        );
        expect(goodbyeDiff.status).toBe('missing-left');
      });

      it('should handle missing nested branches', () => {
        const obj1 = { app: { ui: { header: 'Header' } } };
        const obj2 = { app: { messages: { welcome: 'Welcome' } } };

        const results = jsonDiff.compareFiles(obj1, obj2);

        // When entire branches are missing, the algorithm compares at the parent level
        // So 'ui' is missing-right and 'messages' is missing-left
        const uiMissing = results.find((r) => r.keyPath.includes('ui'));
        expect(uiMissing).toBeDefined();
        expect(uiMissing.status).toBe('missing-right');

        const messagesMissing = results.find((r) =>
          r.keyPath.includes('messages')
        );
        expect(messagesMissing).toBeDefined();
        expect(messagesMissing.status).toBe('missing-left');
      });
    });

    describe('array handling', () => {
      it('should compare identical primitive arrays using index-based keys', () => {
        const obj1 = { items: [1, 2, 3] };
        const obj2 = { items: [1, 2, 3] };

        const results = jsonDiff.compareFiles(obj1, obj2);

        // Each element gets its own result with index-based key path
        expect(results.length).toBe(3);
        results.forEach((r) => expect(r.status).toBe('identical'));
        expect(results.map((r) => r.keyPath)).toEqual([
          'items.0',
          'items.1',
          'items.2',
        ]);
      });

      it('should detect different array elements using index-based keys', () => {
        const obj1 = { items: [1, 2, 3] };
        const obj2 = { items: [1, 2, 4] };

        const results = jsonDiff.compareFiles(obj1, obj2);

        expect(results.find((r) => r.keyPath === 'items.0').status).toBe(
          'identical'
        );
        expect(results.find((r) => r.keyPath === 'items.1').status).toBe(
          'identical'
        );
        expect(results.find((r) => r.keyPath === 'items.2').status).toBe(
          'different'
        );
      });

      it('should report missing-right for extra left-array elements', () => {
        const obj1 = { items: [1, 2, 3] };
        const obj2 = { items: [1, 2] };

        const results = jsonDiff.compareFiles(obj1, obj2);

        expect(results.find((r) => r.keyPath === 'items.2').status).toBe(
          'missing-right'
        );
      });

      it('should recurse into object elements of arrays', () => {
        const obj1 = { items: [{ id: 1 }, { id: 2 }] };
        const obj2 = { items: [{ id: 1 }, { id: 3 }] };

        const results = jsonDiff.compareFiles(obj1, obj2);

        // Recurses into each element: items.0.id and items.1.id
        const id0 = results.find((r) => r.keyPath === 'items.0.id');
        expect(id0.status).toBe('identical');

        const id1 = results.find((r) => r.keyPath === 'items.1.id');
        expect(id1.status).toBe('different');
      });

      it('should report missing-left when right array is longer', () => {
        const obj1 = { items: [1] };
        const obj2 = { items: [1, 2] };

        const results = jsonDiff.compareFiles(obj1, obj2);

        expect(results.find((r) => r.keyPath === 'items.1').status).toBe(
          'missing-left'
        );
      });
    });

    describe('circular reference handling', () => {
      it('should detect a circular reference in the left value', () => {
        const circular = {};
        circular.self = circular;

        const results = jsonDiff.compareFiles(circular, {});

        expect(results.length).toBe(1);
        expect(results[0].status).toBe('circular');
        expect(results[0].leftValue).toBe('[Circular Reference]');
      });

      it('should detect a circular reference in the right value', () => {
        const circular = {};
        circular.self = circular;

        const results = jsonDiff.compareFiles({}, circular);

        expect(results.length).toBe(1);
        expect(results[0].status).toBe('circular');
        expect(results[0].rightValue).toBe('[Circular Reference]');
      });

      it('should detect deep circular references', () => {
        const a = { b: { c: {} } };
        a.b.c.back = a;

        const results = jsonDiff.compareFiles(a, { b: { c: {} } });

        const circularResult = results.find((r) => r.status === 'circular');
        expect(circularResult).toBeDefined();
      });

      it('should detect circular references in arrays', () => {
        const circularArray = [];
        circularArray.push(circularArray);

        const results = jsonDiff.compareFiles(
          { items: circularArray },
          { items: [] }
        );

        expect(results.length).toBe(1);
        expect(results[0].keyPath).toBe('items.0');
        expect(results[0].status).toBe('circular');
        expect(results[0].leftValue).toBe('[Circular Reference]');
      });

      it('should not flag shared objects (non-circular) as circular', () => {
        const obj1 = { a: 'value', b: 'other' };
        const obj2 = { a: 'value', b: 'other' };

        const results = jsonDiff.compareFiles(obj1, obj2);

        expect(results.every((r) => r.status !== 'circular')).toBe(true);
      });
    });

    describe('value type comparisons', () => {
      it('should handle string values', () => {
        const obj1 = { text: 'Hello' };
        const obj2 = { text: 'World' };

        const results = jsonDiff.compareFiles(obj1, obj2);

        expect(results[0].status).toBe('different');
        expect(results[0].leftValue).toBe('Hello');
        expect(results[0].rightValue).toBe('World');
      });

      it('should handle number values', () => {
        const obj1 = { count: 42 };
        const obj2 = { count: 42 };

        const results = jsonDiff.compareFiles(obj1, obj2);

        expect(results[0].status).toBe('identical');
      });

      it('should handle boolean values', () => {
        const obj1 = { enabled: true };
        const obj2 = { enabled: false };

        const results = jsonDiff.compareFiles(obj1, obj2);

        expect(results[0].status).toBe('different');
        expect(results[0].leftValue).toBe(true);
        expect(results[0].rightValue).toBe(false);
      });

      it('should handle null values', () => {
        const obj1 = { value: null };
        const obj2 = { value: null };

        const results = jsonDiff.compareFiles(obj1, obj2);

        expect(results[0].status).toBe('identical');
      });

      it('should detect null vs undefined differences', () => {
        const obj1 = { value: null };
        const obj2 = { value: undefined };

        const results = jsonDiff.compareFiles(obj1, obj2);

        expect(results[0].status).toBe('different');
      });

      it('should handle mixed type comparisons', () => {
        const obj1 = { value: '42' };
        const obj2 = { value: 42 };

        const results = jsonDiff.compareFiles(obj1, obj2);

        expect(results[0].status).toBe('different');
      });
    });

    describe('edge cases', () => {
      it('should handle empty objects', () => {
        const obj1 = {};
        const obj2 = {};

        const results = jsonDiff.compareFiles(obj1, obj2);

        expect(results).toEqual([]);
      });

      it('should handle one empty object', () => {
        const obj1 = {};
        const obj2 = { key: 'value' };

        const results = jsonDiff.compareFiles(obj1, obj2);

        expect(results.length).toBe(1);
        expect(results[0].status).toBe('missing-left');
      });

      it('should handle null as obj1', () => {
        const obj1 = null;
        const obj2 = { key: 'value' };

        const results = jsonDiff.compareFiles(obj1, obj2);

        expect(results.length).toBe(1);
        expect(results[0].status).toBe('missing-left');
      });

      it('should handle null as obj2', () => {
        const obj1 = { key: 'value' };
        const obj2 = null;

        const results = jsonDiff.compareFiles(obj1, obj2);

        expect(results.length).toBe(1);
        expect(results[0].status).toBe('missing-right');
      });

      it('should handle undefined as obj1', () => {
        const obj1 = undefined;
        const obj2 = { key: 'value' };

        const results = jsonDiff.compareFiles(obj1, obj2);

        expect(results.length).toBe(1);
        expect(results[0].status).toBe('missing-left');
      });

      it('should handle undefined as obj2', () => {
        const obj1 = { key: 'value' };
        const obj2 = undefined;

        const results = jsonDiff.compareFiles(obj1, obj2);

        expect(results.length).toBe(1);
        expect(results[0].status).toBe('missing-right');
      });

      it('should handle both objects null', () => {
        const obj1 = null;
        const obj2 = null;

        const results = jsonDiff.compareFiles(obj1, obj2);

        expect(results).toEqual([]);
      });

      it('should handle special characters in keys', () => {
        const obj1 = { 'key-with-dash': 'value1', 'key.with.dot': 'value2' };
        const obj2 = { 'key-with-dash': 'value1', 'key.with.dot': 'value3' };

        const results = jsonDiff.compareFiles(obj1, obj2);

        const dashKey = results.find((r) => r.keyPath === 'key-with-dash');
        expect(dashKey.status).toBe('identical');

        const dotKey = results.find((r) => r.keyPath === 'key.with.dot');
        expect(dotKey.status).toBe('different');
      });

      it('should handle unicode characters', () => {
        const obj1 = { message: '你好世界', emoji: '🎉' };
        const obj2 = { message: '你好世界', emoji: '🎊' };

        const results = jsonDiff.compareFiles(obj1, obj2);

        const messageDiff = results.find((r) => r.keyPath === 'message');
        expect(messageDiff.status).toBe('identical');

        const emojiDiff = results.find((r) => r.keyPath === 'emoji');
        expect(emojiDiff.status).toBe('different');
      });

      it('should handle very long strings', () => {
        const longString1 = 'a'.repeat(10000);
        const longString2 = 'a'.repeat(10000);

        const obj1 = { text: longString1 };
        const obj2 = { text: longString2 };

        const results = jsonDiff.compareFiles(obj1, obj2);

        expect(results[0].status).toBe('identical');
      });
    });

    describe('result structure', () => {
      it('should return array of comparison results', () => {
        const obj1 = { a: 1, b: 2 };
        const obj2 = { a: 1, c: 3 };

        const results = jsonDiff.compareFiles(obj1, obj2);

        expect(Array.isArray(results)).toBe(true);
        expect(results.length).toBeGreaterThan(0);
      });

      it('should include all required fields in results', () => {
        const obj1 = { key: 'value1' };
        const obj2 = { key: 'value2' };

        const results = jsonDiff.compareFiles(obj1, obj2);

        expect(results[0]).toHaveProperty('keyPath');
        expect(results[0]).toHaveProperty('status');
        expect(results[0]).toHaveProperty('leftValue');
        expect(results[0]).toHaveProperty('rightValue');
      });

      it('should use correct status values', () => {
        const obj1 = { a: 'same', b: 'diff1', c: 'only-left' };
        const obj2 = { a: 'same', b: 'diff2', d: 'only-right' };

        const results = jsonDiff.compareFiles(obj1, obj2);

        const statuses = results.map((r) => r.status);
        expect(statuses).toContain('identical');
        expect(statuses).toContain('different');
        expect(statuses).toContain('missing-left');
        expect(statuses).toContain('missing-right');
      });
    });

    describe('complex real-world scenarios', () => {
      it('should handle i18n translation files', () => {
        const enJson = {
          app: { title: 'My App', welcome: 'Welcome' },
          errors: { notFound: 'Not found', serverError: 'Server error' },
          buttons: { save: 'Save', cancel: 'Cancel' },
        };

        const frJson = {
          app: { title: 'Mon App', welcome: 'Bienvenue' },
          errors: { notFound: 'Non trouvé', serverError: 'Erreur serveur' },
          buttons: {
            save: 'Enregistrer',
            cancel: 'Annuler',
            delete: 'Supprimer',
          },
        };

        const results = jsonDiff.compareFiles(enJson, frJson);

        // All keys should be present
        expect(results.length).toBe(7); // 3 app + 2 errors + 3 buttons (including delete)

        // All translations are different
        const differentKeys = results.filter((r) => r.status === 'different');
        expect(differentKeys.length).toBe(6);

        // Delete button missing in English
        const deleteMissing = results.find(
          (r) => r.keyPath === 'buttons.delete'
        );
        expect(deleteMissing.status).toBe('missing-left');
      });

      it('should handle config files with mixed types', () => {
        const config1 = {
          version: '1.0.0',
          enabled: true,
          maxUsers: 100,
          features: { darkMode: true, beta: false },
          tags: ['prod', 'stable'],
        };

        const config2 = {
          version: '1.0.1',
          enabled: true,
          maxUsers: 150,
          features: { darkMode: true, beta: true, experimental: true },
          tags: ['prod', 'stable'],
        };

        const results = jsonDiff.compareFiles(config1, config2);

        // Version different
        const version = results.find((r) => r.keyPath === 'version');
        expect(version.status).toBe('different');

        // Enabled identical
        const enabled = results.find((r) => r.keyPath === 'enabled');
        expect(enabled.status).toBe('identical');

        // MaxUsers different
        const maxUsers = results.find((r) => r.keyPath === 'maxUsers');
        expect(maxUsers.status).toBe('different');

        // Beta different
        const beta = results.find((r) => r.keyPath === 'features.beta');
        expect(beta.status).toBe('different');

        // Experimental missing in config1
        const experimental = results.find(
          (r) => r.keyPath === 'features.experimental'
        );
        expect(experimental.status).toBe('missing-left');

        // Tags identical (array element comparison via index-based keys)
        const tag0 = results.find((r) => r.keyPath === 'tags.0');
        expect(tag0.status).toBe('identical');
        const tag1 = results.find((r) => r.keyPath === 'tags.1');
        expect(tag1.status).toBe('identical');
      });
    });

    describe('parentPath parameter', () => {
      it('should use parentPath to build full key paths', () => {
        const obj1 = { title: 'Title 1' };
        const obj2 = { title: 'Title 2' };

        const results = jsonDiff.compareFiles(obj1, obj2, 'parent');

        expect(results[0].keyPath).toBe('parent.title');
      });

      it('should handle nested parentPath', () => {
        const obj1 = { title: 'Title 1' };
        const obj2 = { title: 'Title 2' };

        const results = jsonDiff.compareFiles(obj1, obj2, 'a.b.c');

        expect(results[0].keyPath).toBe('a.b.c.title');
      });

      it('should work with empty parentPath', () => {
        const obj1 = { title: 'Title 1' };
        const obj2 = { title: 'Title 2' };

        const results = jsonDiff.compareFiles(obj1, obj2, '');

        expect(results[0].keyPath).toBe('title');
      });
    });
  });
});
