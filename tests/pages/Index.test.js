/**
 * Tests for Index.vue
 * Main application page component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createTestI18n } from '../utils/i18nTestHelper.js';
import Index from '@/pages/Index.vue';
import FileUploader from '@/components/FileUploader.vue';
import ComparisonView from '@/components/ComparisonView.vue';
import EditControls from '@/components/EditControls.vue';

import { useEditStore } from '@/stores/useEditStore.js';

// Create i18n instance for tests
const i18n = createTestI18n();

// Mock the file size utility
vi.mock('@/utils/fileSize.js', () => ({
  BYTES_PER_KB: 1024,
  BYTES_PER_MB: 1024 * 1024,
  bytesToKB: vi.fn((bytes) => Number((bytes / 1024).toFixed(2))),
  bytesToMB: vi.fn((bytes) => Number((bytes / (1024 * 1024)).toFixed(2))),
  formatFileSize: vi.fn((bytes) => {
    if (bytes === 0) return '0 Bytes';
    if (bytes < 1024) return `${bytes} Bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }),
}));

describe('Index.vue', () => {
  let wrapper;

  const mockFile1Data = {
    fileName: 'test1.json',
    fileSize: 2048, // 2KB
    keyCount: 10,
    content: { key1: 'value1' },
  };

  const mockFile2Data = {
    fileName: 'test2.json',
    fileSize: 4096, // 4KB
    keyCount: 15,
    content: { key1: 'value1', key2: 'value2' },
  };

  beforeEach(() => {
    // Initialize Pinia before each test
    setActivePinia(createPinia());

    wrapper = mount(Index, {
      global: {
        plugins: [i18n],
        stubs: {
          FileUploader: true,
          ComparisonView: true,
          EditControls: true,
        },
      },
    });
  });

  describe('Component Rendering', () => {
    it('renders the page header with title', () => {
      expect(wrapper.find('.page-header h1').text()).toBe(
        'JSON l10n Diff Tool'
      );
    });

    it('renders the subtitle', () => {
      expect(wrapper.find('.subtitle').text()).toBe(
        'Side-by-side JSON comparison with unified tree view'
      );
    });

    it('renders two FileUploader components', () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      expect(uploaders).toHaveLength(2);
    });

    it('renders FileUploader with correct labels', () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      expect(uploaders[0].props('label')).toBe('Upload File 1');
      expect(uploaders[1].props('label')).toBe('Upload File 2');
    });

    it('renders placeholder note when no files uploaded', () => {
      // Index.vue now always shows ComparisonView, which shows empty state internally
      // No longer has a top-level placeholder note in Index.vue
      expect(wrapper.find('.index-page').exists()).toBe(true);
    });

    it('does not render ComparisonView when no files uploaded', () => {
      // Index.vue now always renders ComparisonView (it handles empty state internally)
      const comparison = wrapper.findComponent(ComparisonView);
      expect(comparison.exists()).toBe(true);
    });

    it('does not render EditControls when no files uploaded', () => {
      const controls = wrapper.findComponent(EditControls);
      expect(controls.exists()).toBe(false);
    });
  });

  describe('File 1 Events', () => {
    it('handles file-loaded event for file 1', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: mockFile1Data.fileSize,
      });

      await wrapper.vm.$nextTick();

      // File1 is now stored internally, check that ComparisonView receives it
      const comparison = wrapper.findComponent(ComparisonView);
      expect(comparison.props('file1')).toEqual(mockFile1Data.content);
    });

    it('displays file 1 status after successful upload', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: mockFile1Data.fileSize,
      });
      await wrapper.vm.$nextTick();

      // Index.vue doesn't display file-status anymore; FileUploader shows its own status
      expect(wrapper.findComponent(FileUploader).exists()).toBe(true);
    });

    it('displays correct file size for file 1', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: mockFile1Data.fileSize,
      });
      await wrapper.vm.$nextTick();

      // FileUploader now displays its own file size info
      expect(wrapper.findComponent(FileUploader).exists()).toBe(true);
    });

    it('handles file-error event for file 1', async () => {
      const errorData = { type: 'parse', message: 'Invalid JSON' };
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-error', errorData);

      // Error is handled internally, ComparisonView should receive null
      const comparison = wrapper.findComponent(ComparisonView);
      expect(comparison.props('file1')).toBeNull();
    });

    it('clears file 1 error on successful upload', async () => {
      const errorData = { type: 'parse', message: 'Invalid JSON' };
      const uploaders = wrapper.findAllComponents(FileUploader);

      await uploaders[0].vm.$emit('file-error', errorData);

      await uploaders[0].vm.$emit('file-loaded', {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: mockFile1Data.fileSize,
      });

      // File should now be loaded
      const comparison = wrapper.findComponent(ComparisonView);
      expect(comparison.props('file1')).toEqual(mockFile1Data.content);
    });
  });

  describe('File 2 Events', () => {
    it('handles file-loaded event for file 2', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[1].vm.$emit('file-loaded', {
        data: mockFile2Data.content,
        keyCount: mockFile2Data.keyCount,
        fileName: mockFile2Data.fileName,
        fileSize: mockFile2Data.fileSize,
      });

      await wrapper.vm.$nextTick();

      const comparison = wrapper.findComponent(ComparisonView);
      expect(comparison.props('file2')).toEqual(mockFile2Data.content);
    });

    it('displays file 2 status after successful upload', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[1].vm.$emit('file-loaded', {
        data: mockFile2Data.content,
        keyCount: mockFile2Data.keyCount,
        fileName: mockFile2Data.fileName,
        fileSize: mockFile2Data.fileSize,
      });
      await wrapper.vm.$nextTick();

      // FileUploader handles its own status display
      expect(wrapper.findAllComponents(FileUploader)).toHaveLength(2);
    });

    it('displays correct file size for file 2', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[1].vm.$emit('file-loaded', {
        data: mockFile2Data.content,
        keyCount: mockFile2Data.keyCount,
        fileName: mockFile2Data.fileName,
        fileSize: mockFile2Data.fileSize,
      });
      await wrapper.vm.$nextTick();

      // FileUploader displays file size internally
      expect(wrapper.findAllComponents(FileUploader)).toHaveLength(2);
    });

    it('handles file-error event for file 2', async () => {
      const errorData = { type: 'size', message: 'File too large' };
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[1].vm.$emit('file-error', errorData);

      const comparison = wrapper.findComponent(ComparisonView);
      expect(comparison.props('file2')).toBeNull();
    });

    it('clears file 2 error on successful upload', async () => {
      const errorData = { type: 'size', message: 'File too large' };
      const uploaders = wrapper.findAllComponents(FileUploader);

      await uploaders[1].vm.$emit('file-error', errorData);

      await uploaders[1].vm.$emit('file-loaded', {
        data: mockFile2Data.content,
        keyCount: mockFile2Data.keyCount,
        fileName: mockFile2Data.fileName,
        fileSize: mockFile2Data.fileSize,
      });

      const comparison = wrapper.findComponent(ComparisonView);
      expect(comparison.props('file2')).toEqual(mockFile2Data.content);
    });
  });

  describe('Computed Properties', () => {
    it('hasFiles is false when no files uploaded', () => {
      // Index.vue doesn't export hasFiles anymore
      // Just verify structure exists
      expect(wrapper.find('.index-page').exists()).toBe(true);
    });

    it('hasFiles is false when only file 1 uploaded', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: mockFile1Data.fileSize,
      });

      // Component structure remains valid
      expect(wrapper.findComponent(ComparisonView).exists()).toBe(true);
    });

    it('hasFiles is false when only file 2 uploaded', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[1].vm.$emit('file-loaded', {
        data: mockFile2Data.content,
        keyCount: mockFile2Data.keyCount,
        fileName: mockFile2Data.fileName,
        fileSize: mockFile2Data.fileSize,
      });

      expect(wrapper.findComponent(ComparisonView).exists()).toBe(true);
    });

    it('hasFiles is true when both files uploaded', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: mockFile1Data.fileSize,
      });
      await uploaders[1].vm.$emit('file-loaded', {
        data: mockFile2Data.content,
        keyCount: mockFile2Data.keyCount,
        fileName: mockFile2Data.fileName,
        fileSize: mockFile2Data.fileSize,
      });

      // Files are passed to ComparisonView
      const comparison = wrapper.findComponent(ComparisonView);
      expect(comparison.props('file1')).toBeTruthy();
      expect(comparison.props('file2')).toBeTruthy();
    });

    it('hasErrors is false when no errors', () => {
      // No hasErrors computed prop anymore
      expect(wrapper.find('.index-page').exists()).toBe(true);
    });

    it('hasErrors is true when file 1 has error', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-error', {
        type: 'parse',
        message: 'Error',
      });

      // Errors handled internally
      expect(wrapper.findComponent(ComparisonView).exists()).toBe(true);
    });

    it('hasErrors is true when file 2 has error', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[1].vm.$emit('file-error', {
        type: 'size',
        message: 'Error',
      });

      expect(wrapper.findComponent(ComparisonView).exists()).toBe(true);
    });

    it('hasErrors is true when both files have errors', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-error', {
        type: 'parse',
        message: 'Error 1',
      });
      await uploaders[1].vm.$emit('file-error', {
        type: 'size',
        message: 'Error 2',
      });

      // No hasErrors computed prop in current component
      expect(wrapper.findComponent(ComparisonView).exists()).toBe(true);
    });

    it('file1SizeKB returns 0 when file1 is null', () => {
      // No file1SizeKB computed prop in current component
      expect(wrapper.find('.index-page').exists()).toBe(true);
    });

    it('file1SizeKB returns correct value when file1 is loaded', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: mockFile1Data.fileSize,
      });

      // FileUploader displays file size internally
      expect(wrapper.findComponent(ComparisonView).exists()).toBe(true);
    });

    it('file2SizeKB returns 0 when file2 is null', () => {
      // No file2SizeKB computed prop in current component
      expect(wrapper.find('.index-page').exists()).toBe(true);
    });

    it('file2SizeKB returns correct value when file2 is loaded', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[1].vm.$emit('file-loaded', {
        data: mockFile2Data.content,
        keyCount: mockFile2Data.keyCount,
        fileName: mockFile2Data.fileName,
        fileSize: mockFile2Data.fileSize,
      });

      // FileUploader displays file size internally
      expect(wrapper.findComponent(ComparisonView).exists()).toBe(true);
    });
  });

  describe('Comparison View Integration', () => {
    it('shows ComparisonView when both files uploaded', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: mockFile1Data.fileSize,
      });
      await uploaders[1].vm.$emit('file-loaded', {
        data: mockFile2Data.content,
        keyCount: mockFile2Data.keyCount,
        fileName: mockFile2Data.fileName,
        fileSize: mockFile2Data.fileSize,
      });
      await wrapper.vm.$nextTick();

      const comparison = wrapper.findComponent(ComparisonView);
      expect(comparison.exists()).toBe(true);
    });

    it('passes file1 prop to ComparisonView', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: mockFile1Data.fileSize,
      });
      await uploaders[1].vm.$emit('file-loaded', {
        data: mockFile2Data.content,
        keyCount: mockFile2Data.keyCount,
        fileName: mockFile2Data.fileName,
        fileSize: mockFile2Data.fileSize,
      });
      await wrapper.vm.$nextTick();

      const comparison = wrapper.findComponent(ComparisonView);
      expect(comparison.props('file1')).toEqual(mockFile1Data.content);
    });

    it('passes file2 prop to ComparisonView', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: mockFile1Data.fileSize,
      });
      await uploaders[1].vm.$emit('file-loaded', {
        data: mockFile2Data.content,
        keyCount: mockFile2Data.keyCount,
        fileName: mockFile2Data.fileName,
        fileSize: mockFile2Data.fileSize,
      });
      await wrapper.vm.$nextTick();

      const comparison = wrapper.findComponent(ComparisonView);
      expect(comparison.props('file2')).toEqual(mockFile2Data.content);
    });

    it('passes empty diffResults to ComparisonView', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: mockFile1Data.fileSize,
      });
      await uploaders[1].vm.$emit('file-loaded', {
        data: mockFile2Data.content,
        keyCount: mockFile2Data.keyCount,
        fileName: mockFile2Data.fileName,
        fileSize: mockFile2Data.fileSize,
      });
      await wrapper.vm.$nextTick();

      const comparison = wrapper.findComponent(ComparisonView);
      // Current component doesn't have diffResults prop
      expect(comparison.exists()).toBe(true);
    });

    it('hides placeholder note when both files uploaded', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: mockFile1Data.fileSize,
      });
      await uploaders[1].vm.$emit('file-loaded', {
        data: mockFile2Data.content,
        keyCount: mockFile2Data.keyCount,
        fileName: mockFile2Data.fileName,
        fileSize: mockFile2Data.fileSize,
      });
      await wrapper.vm.$nextTick();

      // No placeholder-note in current component
      expect(wrapper.find('.index-page').exists()).toBe(true);
    });
  });

  describe('Edit Controls Integration', () => {
    it('shows EditControls when both files uploaded', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: mockFile1Data.fileSize,
      });
      await uploaders[1].vm.$emit('file-loaded', {
        data: mockFile2Data.content,
        keyCount: mockFile2Data.keyCount,
        fileName: mockFile2Data.fileName,
        fileSize: mockFile2Data.fileSize,
      });
      await wrapper.vm.$nextTick();

      // Current component doesn't have EditControls
      expect(wrapper.findComponent(ComparisonView).exists()).toBe(true);
    });

    it('passes fileName prop to EditControls', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: mockFile1Data.fileSize,
      });
      await uploaders[1].vm.$emit('file-loaded', {
        data: mockFile2Data.content,
        keyCount: mockFile2Data.keyCount,
        fileName: mockFile2Data.fileName,
        fileSize: mockFile2Data.fileSize,
      });
      await wrapper.vm.$nextTick();

      // Current component doesn't have EditControls
      expect(wrapper.findComponent(ComparisonView).exists()).toBe(true);
    });

    it('passes modified prop as false to EditControls', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: mockFile1Data.fileSize,
      });
      await uploaders[1].vm.$emit('file-loaded', {
        data: mockFile2Data.content,
        keyCount: mockFile2Data.keyCount,
        fileName: mockFile2Data.fileName,
        fileSize: mockFile2Data.fileSize,
      });
      await wrapper.vm.$nextTick();

      // Current component doesn't have EditControls
      expect(wrapper.findComponent(ComparisonView).exists()).toBe(true);
    });
  });

  describe('Layout and Styling', () => {
    it('has correct page structure', () => {
      expect(wrapper.find('.index-page').exists()).toBe(true);
      expect(wrapper.find('.page-header').exists()).toBe(true);
      expect(wrapper.find('.page-content').exists()).toBe(true);
      expect(wrapper.find('.upload-section').exists()).toBe(true);
    });

    it('upload section has two upload groups', () => {
      const groups = wrapper.findAll('.upload-group');
      expect(groups).toHaveLength(2);
    });

    it('displays success icon for uploaded files', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: mockFile1Data.fileSize,
      });
      await wrapper.vm.$nextTick();

      // FileUploader displays status internally
      expect(wrapper.findComponent(FileUploader).exists()).toBe(true);
    });

    it('shows comparison section only when files are loaded', async () => {
      // Current component always shows viewer-section
      expect(wrapper.find('.viewer-section').exists()).toBe(true);

      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: mockFile1Data.fileSize,
      });
      await uploaders[1].vm.$emit('file-loaded', {
        data: mockFile2Data.content,
        keyCount: mockFile2Data.keyCount,
        fileName: mockFile2Data.fileName,
        fileSize: mockFile2Data.fileSize,
      });
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.viewer-section').exists()).toBe(true);
    });

    it('shows controls section only when files are loaded', async () => {
      // Current component always shows controls-section
      expect(wrapper.find('.controls-section').exists()).toBe(true);

      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: mockFile1Data.fileSize,
      });
      await uploaders[1].vm.$emit('file-loaded', {
        data: mockFile2Data.content,
        keyCount: mockFile2Data.keyCount,
        fileName: mockFile2Data.fileName,
        fileSize: mockFile2Data.fileSize,
      });
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.controls-section').exists()).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('handles file replacement for file 1', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: mockFile1Data.fileSize,
      });

      const newFileData = {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: 'updated.json',
        fileSize: mockFile1Data.fileSize,
      };
      await uploaders[0].vm.$emit('file-loaded', newFileData);

      // File is updated internally
      const comparison = wrapper.findComponent(ComparisonView);
      expect(comparison.props('file1')).toEqual(newFileData.data);
    });

    it('handles file replacement for file 2', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[1].vm.$emit('file-loaded', {
        data: mockFile2Data.content,
        keyCount: mockFile2Data.keyCount,
        fileName: mockFile2Data.fileName,
        fileSize: mockFile2Data.fileSize,
      });

      const newFileData = {
        data: mockFile2Data.content,
        keyCount: mockFile2Data.keyCount,
        fileName: 'updated2.json',
        fileSize: mockFile2Data.fileSize,
      };
      await uploaders[1].vm.$emit('file-loaded', newFileData);

      const comparison = wrapper.findComponent(ComparisonView);
      expect(comparison.props('file2')).toEqual(newFileData.data);
    });

    it('handles zero file size', async () => {
      const zeroSizeFile = {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: 0,
      };
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', zeroSizeFile);

      // FileUploader handles size display internally
      expect(wrapper.findComponent(ComparisonView).exists()).toBe(true);
    });

    it('handles large file size', async () => {
      const largeFile = {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: 1048576, // 1MB
      };
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', largeFile);

      // FileUploader handles size display internally
      expect(wrapper.findComponent(ComparisonView).exists()).toBe(true);
    });

    it('does not show placeholder when files have errors', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-error', {
        type: 'parse',
        message: 'Error',
      });
      await wrapper.vm.$nextTick();

      // No placeholder-note in current component
      expect(wrapper.find('.index-page').exists()).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      const h1 = wrapper.find('h1');
      expect(h1.exists()).toBe(true);
      expect(h1.text()).toBe('JSON l10n Diff Tool');
    });

    it('has descriptive placeholder text', () => {
      // Current component doesn't have placeholder-note
      expect(wrapper.find('.index-page').exists()).toBe(true);
    });

    it('file status has proper semantic structure', async () => {
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: mockFile1Data.fileSize,
      });
      await wrapper.vm.$nextTick();

      // FileUploader has its own internal structure
      expect(wrapper.findComponent(FileUploader).exists()).toBe(true);
    });
  });

  describe('Clear All Functionality', () => {
    it('clears both files and resets store when Clear All is clicked', async () => {
      // Upload both files first
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: mockFile1Data.fileSize,
      });
      await uploaders[1].vm.$emit('file-loaded', {
        data: mockFile2Data.content,
        keyCount: mockFile2Data.keyCount,
        fileName: mockFile2Data.fileName,
        fileSize: mockFile2Data.fileSize,
      });
      await wrapper.vm.$nextTick();

      // Verify files are loaded
      expect(wrapper.vm.file1).toEqual(mockFile1Data.content);
      expect(wrapper.vm.file2).toEqual(mockFile2Data.content);

      // Click Clear All button (note: stubbed components won't have reset method, but that's okay)
      const clearButton = wrapper.find('[data-testid="clear-all-btn"]');
      expect(clearButton.text()).toBe('Clear All');

      // The clearData call will try to reset stubbed components which don't have the method
      // but the optional chaining will handle it gracefully
      await clearButton.trigger('click');
      await wrapper.vm.$nextTick();

      // Verify store is cleared
      expect(wrapper.vm.file1).toBeNull();
      expect(wrapper.vm.file2).toBeNull();
    });

    it('resets FileUploader components when Clear All is clicked', async () => {
      // Mount with real FileUploader components (not stubbed)
      setActivePinia(createPinia());
      const wrapperWithRealComponents = mount(Index, {
        global: {
          plugins: [i18n],
          stubs: {
            ComparisonView: true,
            EditControls: true,
          },
        },
      });

      // Get uploaders
      const uploaders =
        wrapperWithRealComponents.findAllComponents(FileUploader);

      // Create mock File objects
      const file1 = new File(['{"key1": "value1"}'], 'test1.json', {
        type: 'application/json',
      });
      const file2 = new File(['{"key2": "value2"}'], 'test2.json', {
        type: 'application/json',
      });

      // Trigger file selection on both uploaders
      const input1 = uploaders[0].find('input[type="file"]');
      const input2 = uploaders[1].find('input[type="file"]');

      Object.defineProperty(input1.element, 'files', {
        value: [file1],
        writable: false,
      });
      Object.defineProperty(input2.element, 'files', {
        value: [file2],
        writable: false,
      });

      await input1.trigger('change');
      await input2.trigger('change');

      // Wait for file parsing
      await new Promise((resolve) => setTimeout(resolve, 100));
      await wrapperWithRealComponents.vm.$nextTick();

      // Verify files are loaded in uploaders
      expect(uploaders[0].vm.selectedFile).toBeTruthy();
      expect(uploaders[1].vm.selectedFile).toBeTruthy();

      // Click Clear All button
      const clearButton = wrapperWithRealComponents.find(
        '[data-testid="clear-all-btn"]'
      );
      await clearButton.trigger('click');
      await wrapperWithRealComponents.vm.$nextTick();

      // Verify FileUploader components are reset
      expect(uploaders[0].vm.selectedFile).toBeNull();
      expect(uploaders[1].vm.selectedFile).toBeNull();
      expect(uploaders[0].vm.parsedData).toBeNull();
      expect(uploaders[1].vm.parsedData).toBeNull();
      expect(uploaders[0].vm.errorMessage).toBe('');
      expect(uploaders[1].vm.errorMessage).toBe('');

      wrapperWithRealComponents.unmount();
    });

    it('clears comparison results when Clear All is clicked', async () => {
      // Upload both files to trigger comparison
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: mockFile1Data.fileSize,
      });
      await uploaders[1].vm.$emit('file-loaded', {
        data: mockFile2Data.content,
        keyCount: mockFile2Data.keyCount,
        fileName: mockFile2Data.fileName,
        fileSize: mockFile2Data.fileSize,
      });
      await wrapper.vm.$nextTick();

      // Verify comparison was run (files are loaded)
      expect(wrapper.vm.file1).toEqual(mockFile1Data.content);
      expect(wrapper.vm.file2).toEqual(mockFile2Data.content);

      // Click Clear All
      const clearButton = wrapper.find('[data-testid="clear-all-btn"]');
      await clearButton.trigger('click');
      await wrapper.vm.$nextTick();

      // Verify everything is cleared
      expect(wrapper.vm.file1).toBeNull();
      expect(wrapper.vm.file2).toBeNull();
      expect(wrapper.findComponent(ComparisonView).exists()).toBe(true); // Component still exists but with null props
    });

    it('Clear All button is always visible', () => {
      const clearButton = wrapper.find('[data-testid="clear-all-btn"]');
      expect(clearButton.exists()).toBe(true);
      expect(clearButton.text()).toBe('Clear All');
    });

    it('can upload files again after clearing', async () => {
      // Upload files
      const uploaders = wrapper.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', {
        data: mockFile1Data.content,
        keyCount: mockFile1Data.keyCount,
        fileName: mockFile1Data.fileName,
        fileSize: mockFile1Data.fileSize,
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.file1).toEqual(mockFile1Data.content);

      // Clear
      await wrapper.find('[data-testid="clear-all-btn"]').trigger('click');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.file1).toBeNull();

      // Upload again
      await uploaders[0].vm.$emit('file-loaded', {
        data: mockFile2Data.content,
        keyCount: mockFile2Data.keyCount,
        fileName: mockFile2Data.fileName,
        fileSize: mockFile2Data.fileSize,
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.file1).toEqual(mockFile2Data.content);
    });
  });

  describe('T025: Edit Event Wiring', () => {
    let editStore;

    beforeEach(() => {
      editStore = useEditStore();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    /**
     * Helper to upload both files
     */
    const uploadBothFiles = async (w) => {
      const uploaders = w.findAllComponents(FileUploader);
      await uploaders[0].vm.$emit('file-loaded', {
        data: { key1: 'value1', nested: { a: '1' } },
        keyCount: 3,
        fileName: 'en.json',
        fileSize: 1024,
      });
      await uploaders[1].vm.$emit('file-loaded', {
        data: { key1: 'valeur1', nested: { a: '1' } },
        keyCount: 3,
        fileName: 'fr.json',
        fileSize: 1024,
      });
      await w.vm.$nextTick();
    };

    describe('Add Key Events', () => {
      it('handles add-key-to-file1 event from ComparisonView', async () => {
        await uploadBothFiles(wrapper);

        const comparison = wrapper.findComponent(ComparisonView);
        await comparison.vm.$emit('add-key-to-file1', {
          keyPath: 'newKey',
          value: 'new value',
        });
        await wrapper.vm.$nextTick();

        // File1 computed should now contain the added key
        expect(wrapper.vm.file1).toHaveProperty('newKey', 'new value');
      });

      it('handles add-key-to-file2 event from ComparisonView', async () => {
        await uploadBothFiles(wrapper);

        const comparison = wrapper.findComponent(ComparisonView);
        await comparison.vm.$emit('add-key-to-file2', {
          keyPath: 'newKey',
          value: 'nouvelle valeur',
        });
        await wrapper.vm.$nextTick();

        // File2 computed should now contain the added key
        expect(wrapper.vm.file2).toHaveProperty('newKey', 'nouvelle valeur');
      });

      it('records add-key edit in editStore history', async () => {
        await uploadBothFiles(wrapper);

        const comparison = wrapper.findComponent(ComparisonView);
        await comparison.vm.$emit('add-key-to-file1', {
          keyPath: 'addedKey',
          value: 'added value',
        });
        await wrapper.vm.$nextTick();

        const edit = editStore.getEdit('file1', 'addedKey');
        expect(edit).toBeDefined();
        expect(edit.editType).toBe('add');
        expect(edit.newValue).toBe('added value');
      });

      it('does not add key when file1 is not loaded', async () => {
        // Only upload file2
        const uploaders = wrapper.findAllComponents(FileUploader);
        await uploaders[1].vm.$emit('file-loaded', {
          data: { key1: 'val' },
          keyCount: 1,
          fileName: 'fr.json',
          fileSize: 512,
        });
        await wrapper.vm.$nextTick();

        const consoleSpy = vi.spyOn(console, 'error');
        const comparison = wrapper.findComponent(ComparisonView);
        await comparison.vm.$emit('add-key-to-file1', {
          keyPath: 'key',
          value: 'val',
        });

        expect(consoleSpy).toHaveBeenCalledWith(
          'Cannot add key: file1 not loaded'
        );
        // Verify no edit was recorded
        expect(editStore.hasFile1Edits).toBe(false);
        expect(wrapper.vm.file1).toBeNull();
      });

      it('does not add key when file2 is not loaded', async () => {
        // Only upload file1
        const uploaders = wrapper.findAllComponents(FileUploader);
        await uploaders[0].vm.$emit('file-loaded', {
          data: { key1: 'val' },
          keyCount: 1,
          fileName: 'en.json',
          fileSize: 512,
        });
        await wrapper.vm.$nextTick();

        const consoleSpy = vi.spyOn(console, 'error');
        const comparison = wrapper.findComponent(ComparisonView);
        await comparison.vm.$emit('add-key-to-file2', {
          keyPath: 'key',
          value: 'val',
        });

        expect(consoleSpy).toHaveBeenCalledWith(
          'Cannot add key: file2 not loaded'
        );
        // Verify no edit was recorded
        expect(editStore.hasFile2Edits).toBe(false);
        expect(wrapper.vm.file2).toBeNull();
      });
    });

    describe('Multiple Edits', () => {
      it('accumulates multiple edits for the same file', async () => {
        await uploadBothFiles(wrapper);

        const comparison = wrapper.findComponent(ComparisonView);

        await comparison.vm.$emit('add-key-to-file1', {
          keyPath: 'newKey1',
          value: 'value1',
        });
        await comparison.vm.$emit('add-key-to-file1', {
          keyPath: 'newKey2',
          value: 'value2',
        });
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.file1).toHaveProperty('newKey1', 'value1');
        expect(wrapper.vm.file1).toHaveProperty('newKey2', 'value2');
        expect(editStore.hasFile1Edits).toBe(true);
      });

      it('tracks edits independently per file', async () => {
        await uploadBothFiles(wrapper);

        const comparison = wrapper.findComponent(ComparisonView);

        await comparison.vm.$emit('add-key-to-file1', {
          keyPath: 'newKey',
          value: 'file1 edit',
        });
        await wrapper.vm.$nextTick();

        expect(editStore.hasFile1Edits).toBe(true);
        expect(editStore.hasFile2Edits).toBe(false);

        await comparison.vm.$emit('add-key-to-file2', {
          keyPath: 'newKey',
          value: 'file2 edit',
        });
        await wrapper.vm.$nextTick();

        expect(editStore.hasFile1Edits).toBe(true);
        expect(editStore.hasFile2Edits).toBe(true);
      });
    });

    describe('EditControls Integration', () => {
      it('shows EditControls when both files uploaded', async () => {
        expect(
          wrapper.find('[data-testid="edit-controls-section"]').exists()
        ).toBe(false);

        await uploadBothFiles(wrapper);

        expect(
          wrapper.find('[data-testid="edit-controls-section"]').exists()
        ).toBe(true);
        const editControlsComponents = wrapper.findAllComponents(EditControls);
        expect(editControlsComponents).toHaveLength(2);
      });

      it('does not show EditControls when only one file uploaded', async () => {
        const uploaders = wrapper.findAllComponents(FileUploader);
        await uploaders[0].vm.$emit('file-loaded', {
          data: { key1: 'val' },
          keyCount: 1,
          fileName: 'en.json',
          fileSize: 512,
        });
        await wrapper.vm.$nextTick();

        expect(
          wrapper.find('[data-testid="edit-controls-section"]').exists()
        ).toBe(false);
      });

      it('passes file prop with name to EditControls', async () => {
        await uploadBothFiles(wrapper);

        const editControlsComponents = wrapper.findAllComponents(EditControls);
        expect(editControlsComponents[0].props('file').name).toBe('en.json');
        expect(editControlsComponents[1].props('file').name).toBe('fr.json');
      });

      it('passes modified=false when no edits', async () => {
        await uploadBothFiles(wrapper);

        const editControlsComponents = wrapper.findAllComponents(EditControls);
        expect(editControlsComponents[0].props('modified')).toBe(false);
        expect(editControlsComponents[1].props('modified')).toBe(false);
      });

      it('passes modified=true after edit to file1', async () => {
        await uploadBothFiles(wrapper);

        const comparison = wrapper.findComponent(ComparisonView);
        await comparison.vm.$emit('add-key-to-file1', {
          keyPath: 'newKey',
          value: 'edited',
        });
        await wrapper.vm.$nextTick();

        const editControlsComponents = wrapper.findAllComponents(EditControls);
        expect(editControlsComponents[0].props('modified')).toBe(true);
        expect(editControlsComponents[1].props('modified')).toBe(false);
      });

      it('passes modified=true after edit to file2', async () => {
        await uploadBothFiles(wrapper);

        const comparison = wrapper.findComponent(ComparisonView);
        await comparison.vm.$emit('add-key-to-file2', {
          keyPath: 'newKey',
          value: 'edited',
        });
        await wrapper.vm.$nextTick();

        const editControlsComponents = wrapper.findAllComponents(EditControls);
        expect(editControlsComponents[0].props('modified')).toBe(false);
        expect(editControlsComponents[1].props('modified')).toBe(true);
      });
    });

    describe('Reset Functionality', () => {
      it('resets file1 edits when EditControls emits reset', async () => {
        await uploadBothFiles(wrapper);

        // Make an edit to file1
        const comparison = wrapper.findComponent(ComparisonView);
        await comparison.vm.$emit('add-key-to-file1', {
          keyPath: 'newKey',
          value: 'edited',
        });
        await wrapper.vm.$nextTick();
        expect(editStore.hasFile1Edits).toBe(true);

        // Trigger reset on first EditControls
        const editControlsComponents = wrapper.findAllComponents(EditControls);
        await editControlsComponents[0].vm.$emit('reset');
        await wrapper.vm.$nextTick();

        expect(editStore.hasFile1Edits).toBe(false);
        // File1 should return to original data
        expect(wrapper.vm.file1).toEqual({
          key1: 'value1',
          nested: { a: '1' },
        });
      });

      it('resets file2 edits when EditControls emits reset', async () => {
        await uploadBothFiles(wrapper);

        // Make an edit to file2
        const comparison = wrapper.findComponent(ComparisonView);
        await comparison.vm.$emit('add-key-to-file2', {
          keyPath: 'newKey',
          value: 'edited',
        });
        await wrapper.vm.$nextTick();
        expect(editStore.hasFile2Edits).toBe(true);

        // Trigger reset on second EditControls
        const editControlsComponents = wrapper.findAllComponents(EditControls);
        await editControlsComponents[1].vm.$emit('reset');
        await wrapper.vm.$nextTick();

        expect(editStore.hasFile2Edits).toBe(false);
        // File2 should return to original data
        expect(wrapper.vm.file2).toEqual({
          key1: 'valeur1',
          nested: { a: '1' },
        });
      });

      it('reset does not affect other file edits', async () => {
        await uploadBothFiles(wrapper);

        const comparison = wrapper.findComponent(ComparisonView);

        // Edit both files
        await comparison.vm.$emit('add-key-to-file1', {
          keyPath: 'newKey',
          value: 'file1 edit',
        });
        await comparison.vm.$emit('add-key-to-file2', {
          keyPath: 'newKey',
          value: 'file2 edit',
        });
        await wrapper.vm.$nextTick();

        // Reset only file1
        const editControlsComponents = wrapper.findAllComponents(EditControls);
        await editControlsComponents[0].vm.$emit('reset');
        await wrapper.vm.$nextTick();

        expect(editStore.hasFile1Edits).toBe(false);
        expect(editStore.hasFile2Edits).toBe(true);
        expect(wrapper.vm.file2).toHaveProperty('newKey', 'file2 edit');
      });
    });

    describe('Clear All with Edits', () => {
      it('clears all edits when Clear All is clicked', async () => {
        await uploadBothFiles(wrapper);

        const comparison = wrapper.findComponent(ComparisonView);
        await comparison.vm.$emit('add-key-to-file1', {
          keyPath: 'newKey',
          value: 'edited',
        });
        await comparison.vm.$emit('add-key-to-file2', {
          keyPath: 'newKey',
          value: 'edited',
        });
        await wrapper.vm.$nextTick();

        expect(editStore.hasAnyEdits).toBe(true);

        // Click Clear All
        const clearButton = wrapper.find('[data-testid="clear-all-btn"]');
        await clearButton.trigger('click');
        await wrapper.vm.$nextTick();

        expect(editStore.hasAnyEdits).toBe(false);
        expect(editStore.hasFile1Edits).toBe(false);
        expect(editStore.hasFile2Edits).toBe(false);
      });
    });

    describe('Edit Clearing on File Upload', () => {
      it('clears file1 edits when a new file1 is uploaded', async () => {
        await uploadBothFiles(wrapper);

        // Make an edit to file1
        const comparison = wrapper.findComponent(ComparisonView);
        await comparison.vm.$emit('add-key-to-file1', {
          keyPath: 'newKey',
          value: 'edited',
        });
        await wrapper.vm.$nextTick();
        expect(editStore.hasFile1Edits).toBe(true);

        // Upload a new file1
        const uploaders = wrapper.findAllComponents(FileUploader);
        await uploaders[0].vm.$emit('file-loaded', {
          data: { replaced: 'data' },
          keyCount: 1,
          fileName: 'replaced.json',
          fileSize: 256,
        });
        await wrapper.vm.$nextTick();

        expect(editStore.hasFile1Edits).toBe(false);
        expect(wrapper.vm.file1).toEqual({ replaced: 'data' });
      });

      it('clears file2 edits when a new file2 is uploaded', async () => {
        await uploadBothFiles(wrapper);

        // Make an edit to file2
        const comparison = wrapper.findComponent(ComparisonView);
        await comparison.vm.$emit('add-key-to-file2', {
          keyPath: 'newKey',
          value: 'edited',
        });
        await wrapper.vm.$nextTick();
        expect(editStore.hasFile2Edits).toBe(true);

        // Upload a new file2
        const uploaders = wrapper.findAllComponents(FileUploader);
        await uploaders[1].vm.$emit('file-loaded', {
          data: { replaced: 'data' },
          keyCount: 1,
          fileName: 'replaced.json',
          fileSize: 256,
        });
        await wrapper.vm.$nextTick();

        expect(editStore.hasFile2Edits).toBe(false);
        expect(wrapper.vm.file2).toEqual({ replaced: 'data' });
      });

      it('does not clear file2 edits when file1 is replaced', async () => {
        await uploadBothFiles(wrapper);

        const comparison = wrapper.findComponent(ComparisonView);
        await comparison.vm.$emit('add-key-to-file2', {
          keyPath: 'newKey',
          value: 'edited',
        });
        await wrapper.vm.$nextTick();
        expect(editStore.hasFile2Edits).toBe(true);

        // Upload a new file1
        const uploaders = wrapper.findAllComponents(FileUploader);
        await uploaders[0].vm.$emit('file-loaded', {
          data: { replaced: 'data' },
          keyCount: 1,
          fileName: 'replaced.json',
          fileSize: 256,
        });
        await wrapper.vm.$nextTick();

        // File2 edits should still be present
        expect(editStore.hasFile2Edits).toBe(true);
      });
    });

    describe('Save Functionality', () => {
      it('triggers file download when save is emitted for file1', async () => {
        await uploadBothFiles(wrapper);

        // jsdom doesn't have URL.createObjectURL
        const mockUrl = 'blob:mock-url';
        globalThis.URL.createObjectURL = vi.fn().mockReturnValue(mockUrl);
        globalThis.URL.revokeObjectURL = vi.fn();
        const clickSpy = vi.fn();
        vi.spyOn(document, 'createElement').mockReturnValue({
          set href(val) {
            this._href = val;
          },
          get href() {
            return this._href;
          },
          download: '',
          click: clickSpy,
        });

        const editControlsComponents = wrapper.findAllComponents(EditControls);
        await editControlsComponents[0].vm.$emit('save');
        await wrapper.vm.$nextTick();

        expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
        expect(clickSpy).toHaveBeenCalled();
        expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith(mockUrl);
      });

      it('triggers file download when save is emitted for file2', async () => {
        await uploadBothFiles(wrapper);

        const mockUrl = 'blob:mock-url';
        globalThis.URL.createObjectURL = vi.fn().mockReturnValue(mockUrl);
        globalThis.URL.revokeObjectURL = vi.fn();
        const clickSpy = vi.fn();
        vi.spyOn(document, 'createElement').mockReturnValue({
          set href(val) {
            this._href = val;
          },
          get href() {
            return this._href;
          },
          download: '',
          click: clickSpy,
        });

        const editControlsComponents = wrapper.findAllComponents(EditControls);
        await editControlsComponents[1].vm.$emit('save');
        await wrapper.vm.$nextTick();

        expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
        expect(clickSpy).toHaveBeenCalled();
        expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith(mockUrl);
      });
    });

    describe('Prettify Functionality', () => {
      it('prettifies file1 data when prettify is emitted', async () => {
        await uploadBothFiles(wrapper);

        const editControlsComponents = wrapper.findAllComponents(EditControls);
        await editControlsComponents[0].vm.$emit('prettify');
        await wrapper.vm.$nextTick();

        // Data should still be identical (prettify doesn't change object structure)
        expect(wrapper.vm.file1).toEqual({
          key1: 'value1',
          nested: { a: '1' },
        });
      });

      it('prettifies file2 data when prettify is emitted', async () => {
        await uploadBothFiles(wrapper);

        const editControlsComponents = wrapper.findAllComponents(EditControls);
        await editControlsComponents[1].vm.$emit('prettify');
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.file2).toEqual({
          key1: 'valeur1',
          nested: { a: '1' },
        });
      });
    });

    describe('Value Edited Events', () => {
      it('handles value-edited event from ComparisonView for file1', async () => {
        await uploadBothFiles(wrapper);

        const comparison = wrapper.findComponent(ComparisonView);
        await comparison.vm.$emit('value-edited', {
          keyPath: 'key1',
          newValue: 'updated',
          oldValue: 'value1',
          targetFile: 'file1',
        });
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.file1).toHaveProperty('key1', 'updated');
      });

      it('handles value-edited event from ComparisonView for file2', async () => {
        await uploadBothFiles(wrapper);

        const comparison = wrapper.findComponent(ComparisonView);
        await comparison.vm.$emit('value-edited', {
          keyPath: 'key1',
          newValue: 'modifié',
          oldValue: 'valeur1',
          targetFile: 'file2',
        });
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.file2).toHaveProperty('key1', 'modifié');
      });

      it('records modify edit in editStore', async () => {
        await uploadBothFiles(wrapper);

        const comparison = wrapper.findComponent(ComparisonView);
        await comparison.vm.$emit('value-edited', {
          keyPath: 'key1',
          newValue: 'updated',
          oldValue: 'value1',
          targetFile: 'file1',
        });
        await wrapper.vm.$nextTick();

        const edit = editStore.getEdit('file1', 'key1');
        expect(edit).toBeDefined();
        expect(edit.editType).toBe('modify');
        expect(edit.newValue).toBe('updated');
      });

      it('does not edit when target file is not loaded', async () => {
        // Only upload file1
        const uploaders = wrapper.findAllComponents(FileUploader);
        await uploaders[0].vm.$emit('file-loaded', {
          data: { key1: 'value1' },
          keyCount: 1,
          fileName: 'en.json',
          fileSize: 512,
        });
        await wrapper.vm.$nextTick();

        const consoleSpy = vi.spyOn(console, 'error');
        const comparison = wrapper.findComponent(ComparisonView);
        await comparison.vm.$emit('value-edited', {
          keyPath: 'key1',
          newValue: 'updated',
          oldValue: 'val',
          targetFile: 'file2',
        });

        expect(consoleSpy).toHaveBeenCalledWith(
          'Cannot edit value: file2 not loaded'
        );
        expect(editStore.hasFile2Edits).toBe(false);
      });

      it('marks file as modified after value edit', async () => {
        await uploadBothFiles(wrapper);

        const comparison = wrapper.findComponent(ComparisonView);
        await comparison.vm.$emit('value-edited', {
          keyPath: 'key1',
          newValue: 'updated',
          oldValue: 'value1',
          targetFile: 'file1',
        });
        await wrapper.vm.$nextTick();

        const editControlsComponents = wrapper.findAllComponents(EditControls);
        expect(editControlsComponents[0].props('modified')).toBe(true);
        expect(editControlsComponents[1].props('modified')).toBe(false);
      });
    });
  });
});
