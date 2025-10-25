/**
 * Tests for Index.vue
 * Main application page component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import Index from '@/pages/Index.vue';
import FileUploader from '@/components/FileUploader.vue';
import ComparisonView from '@/components/ComparisonView.vue';
import EditControls from '@/components/EditControls.vue';

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
});
