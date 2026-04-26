import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useFileDownload } from '@/composables/useFileDownload.js';

describe('useFileDownload', () => {
  let mockUrl;
  let clickSpy;
  let mockLink;

  beforeEach(() => {
    mockUrl = 'blob:mock-url-123';
    clickSpy = vi.fn();
    mockLink = {
      href: '',
      download: '',
      click: clickSpy,
    };

    globalThis.URL.createObjectURL = vi.fn().mockReturnValue(mockUrl);
    globalThis.URL.revokeObjectURL = vi.fn();
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('useFileDownload()', () => {
    it('returns a downloadFile function', () => {
      const { downloadFile } = useFileDownload();
      expect(typeof downloadFile).toBe('function');
    });
  });

  describe('downloadFile()', () => {
    it('creates a Blob with JSON content', () => {
      const { downloadFile } = useFileDownload();
      const data = { key: 'value' };
      downloadFile('test.json', data);

      expect(URL.createObjectURL).toHaveBeenCalledOnce();
      const blob = URL.createObjectURL.mock.calls[0][0];
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/json');
    });

    it('serializes data with 2-space indentation', async () => {
      const { downloadFile } = useFileDownload();
      const data = { key: 'value' };
      downloadFile('test.json', data);

      const blob = URL.createObjectURL.mock.calls[0][0];
      const text = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsText(blob);
      });
      expect(text).toBe(JSON.stringify(data, null, 2));
    });

    it('sets the link href to the object URL', () => {
      const { downloadFile } = useFileDownload();
      downloadFile('test.json', { a: 1 });

      expect(mockLink.href).toBe(mockUrl);
    });

    it('sets the link download attribute to the filename', () => {
      const { downloadFile } = useFileDownload();
      downloadFile('my-file.json', { a: 1 });

      expect(mockLink.download).toBe('my-file.json');
    });

    it('triggers a click on the link element', () => {
      const { downloadFile } = useFileDownload();
      downloadFile('test.json', {});

      expect(clickSpy).toHaveBeenCalledOnce();
    });

    it('revokes the object URL after clicking', () => {
      const { downloadFile } = useFileDownload();
      downloadFile('test.json', {});

      expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockUrl);
    });

    it('creates an anchor element', () => {
      const { downloadFile } = useFileDownload();
      downloadFile('test.json', {});

      expect(document.createElement).toHaveBeenCalledWith('a');
    });

    it('handles nested objects correctly', async () => {
      const { downloadFile } = useFileDownload();
      const data = { app: { title: 'Test', nested: { deep: true } } };
      downloadFile('nested.json', data);

      const blob = URL.createObjectURL.mock.calls[0][0];
      const text = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsText(blob);
      });
      expect(JSON.parse(text)).toEqual(data);
    });

    it('handles empty object', () => {
      const { downloadFile } = useFileDownload();
      expect(() => downloadFile('empty.json', {})).not.toThrow();
      expect(clickSpy).toHaveBeenCalledOnce();
    });

    it('uses provided filename including extension', () => {
      const { downloadFile } = useFileDownload();
      downloadFile('en.json', { hello: 'world' });
      expect(mockLink.download).toBe('en.json');
    });
  });
});
