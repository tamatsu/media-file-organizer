// Renderer functions unit tests
// Note: These functions are extracted from index.html for testing

// Extract functions from index.html for testing
function getFileIcon(type) {
  switch (type) {
    case 'image':
      return '🖼️';
    case 'video':
      return '🎬';
    case 'audio':
      return '🎵';
    default:
      return '📄';
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) {
    return '0 B';
  }
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Extract date formatting function for testing
function formatDate(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

// Extract preview file function for testing
function previewFile(filePath, fileType, fileName, fileSize) {
  try {
    const previewArea = document.getElementById('preview-area');
    const previewContent = document.getElementById('preview-content');
    const previewInfo = document.getElementById('preview-info');

    if (!previewArea || !previewContent || !previewInfo) {
      throw new Error('Preview elements not found');
    }

    // Clear previous content
    previewContent.innerHTML = '';

    // Update info
    previewInfo.textContent = `${fileName} (${formatFileSize(fileSize)})`;

    // Create preview based on file type
    let previewElement;
    switch (fileType) {
      case 'image':
        previewElement = document.createElement('img');
        previewElement.src = `file://${filePath}`;
        previewElement.style.maxWidth = '100%';
        previewElement.style.maxHeight = '400px';
        break;
      case 'video':
        previewElement = document.createElement('video');
        previewElement.src = `file://${filePath}`;
        previewElement.controls = true;
        previewElement.style.maxWidth = '100%';
        previewElement.style.maxHeight = '400px';
        break;
      case 'audio':
        previewElement = document.createElement('audio');
        previewElement.src = `file://${filePath}`;
        previewElement.controls = true;
        previewElement.style.width = '100%';
        break;
      default:
        previewElement = document.createElement('div');
        previewElement.textContent = 'プレビューできません';
        previewElement.style.textAlign = 'center';
        previewElement.style.padding = '50px';
    }

    previewContent.appendChild(previewElement);
    previewArea.style.display = 'block';

    return true;
  } catch (error) {
    console.error('Error previewing file:', error);
    return false;
  }
}

describe('Renderer Functions', () => {
  describe('getFileIcon', () => {
    test('should return correct icon for image files', () => {
      expect(getFileIcon('image')).toBe('🖼️');
    });

    test('should return correct icon for video files', () => {
      expect(getFileIcon('video')).toBe('🎬');
    });

    test('should return correct icon for audio files', () => {
      expect(getFileIcon('audio')).toBe('🎵');
    });

    test('should return default icon for unknown file types', () => {
      expect(getFileIcon('unknown')).toBe('📄');
      expect(getFileIcon('document')).toBe('📄');
      expect(getFileIcon('')).toBe('📄');
      expect(getFileIcon(null)).toBe('📄');
      expect(getFileIcon(undefined)).toBe('📄');
    });
  });

  describe('formatFileSize', () => {
    test('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(512)).toBe('512 B');
      expect(formatFileSize(1023)).toBe('1023 B');
    });

    test('should format kilobytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(2048)).toBe('2 KB');
    });

    test('should format megabytes correctly', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1.5)).toBe('1.5 MB');
      expect(formatFileSize(1024 * 1024 * 2.5)).toBe('2.5 MB');
    });

    test('should format gigabytes correctly', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
      expect(formatFileSize(1024 * 1024 * 1024 * 2.5)).toBe('2.5 GB');
    });

    test('should handle large numbers', () => {
      expect(formatFileSize(1024 * 1024 * 1024 * 1000)).toBe('1000 GB');
    });

    test('should round properly', () => {
      expect(formatFileSize(1024 * 1.234)).toBe('1.23 KB');
      expect(formatFileSize(1024 * 1.999)).toBe('2 KB');
    });

    test('should handle edge cases', () => {
      expect(formatFileSize(1)).toBe('1 B');
      expect(formatFileSize(1023)).toBe('1023 B');
      expect(formatFileSize(1025)).toBe('1 KB');
    });
  });

  describe('formatDate', () => {
    test('should format valid dates correctly', () => {
      const testDate = new Date('2023-05-15');
      expect(formatDate(testDate)).toBe('2023/5/15');
    });

    test('should format dates with single digit months and days', () => {
      const testDate = new Date('2023-01-05');
      expect(formatDate(testDate)).toBe('2023/1/5');
    });

    test('should handle December correctly', () => {
      const testDate = new Date('2023-12-25');
      expect(formatDate(testDate)).toBe('2023/12/25');
    });

    test('should handle invalid dates', () => {
      expect(formatDate(null)).toBe('Invalid Date');
      expect(formatDate(undefined)).toBe('Invalid Date');
      expect(formatDate('not a date')).toBe('Invalid Date');
      expect(formatDate(new Date('invalid'))).toBe('Invalid Date');
    });

    test('should handle edge case dates', () => {
      const leapYear = new Date('2024-02-29');
      expect(formatDate(leapYear)).toBe('2024/2/29');

      const newYear = new Date('2023-01-01');
      expect(formatDate(newYear)).toBe('2023/1/1');
    });
  });

  describe('previewFile', () => {
    beforeEach(() => {
      // Set up DOM elements
      document.body.innerHTML = `
        <div id="preview-area" style="display: none;">
          <div id="preview-content"></div>
          <div id="preview-info"></div>
        </div>
      `;

      // Mock console.error
      global.console = {
        ...console,
        error: jest.fn()
      };
    });

    test('should preview image files', () => {
      const result = previewFile('/path/to/image.jpg', 'image', 'image.jpg', 1024000);

      expect(result).toBe(true);

      const previewContent = document.getElementById('preview-content');
      const img = previewContent.querySelector('img');

      expect(img).toBeTruthy();
      expect(img.src).toBe('file:///path/to/image.jpg');
      expect(img.style.maxWidth).toBe('100%');
      expect(img.style.maxHeight).toBe('400px');

      const previewInfo = document.getElementById('preview-info');
      expect(previewInfo.textContent).toBe('image.jpg (1000 KB)');

      const previewArea = document.getElementById('preview-area');
      expect(previewArea.style.display).toBe('block');
    });

    test('should preview video files', () => {
      const result = previewFile('/path/to/video.mp4', 'video', 'video.mp4', 2048000);

      expect(result).toBe(true);

      const previewContent = document.getElementById('preview-content');
      const video = previewContent.querySelector('video');

      expect(video).toBeTruthy();
      expect(video.src).toBe('file:///path/to/video.mp4');
      expect(video.controls).toBe(true);
      expect(video.style.maxWidth).toBe('100%');
      expect(video.style.maxHeight).toBe('400px');
    });

    test('should preview audio files', () => {
      const result = previewFile('/path/to/audio.mp3', 'audio', 'audio.mp3', 512000);

      expect(result).toBe(true);

      const previewContent = document.getElementById('preview-content');
      const audio = previewContent.querySelector('audio');

      expect(audio).toBeTruthy();
      expect(audio.src).toBe('file:///path/to/audio.mp3');
      expect(audio.controls).toBe(true);
      expect(audio.style.width).toBe('100%');
    });

    test('should handle unknown file types', () => {
      const result = previewFile('/path/to/file.txt', 'unknown', 'file.txt', 1024);

      expect(result).toBe(true);

      const previewContent = document.getElementById('preview-content');
      const div = previewContent.querySelector('div');

      expect(div).toBeTruthy();
      expect(div.textContent).toBe('プレビューできません');
      expect(div.style.textAlign).toBe('center');
      expect(div.style.padding).toBe('50px');
    });

    test('should handle missing DOM elements', () => {
      document.body.innerHTML = ''; // Remove preview elements

      const result = previewFile('/path/to/file.jpg', 'image', 'file.jpg', 1024);

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith('Error previewing file:', expect.any(Error));
    });

    test('should clear previous content', () => {
      // Add some initial content
      const previewContent = document.getElementById('preview-content');
      previewContent.innerHTML = '<div>Previous content</div>';

      previewFile('/path/to/image.jpg', 'image', 'image.jpg', 1024);

      // Should only contain the new image element
      expect(previewContent.children.length).toBe(1);
      expect(previewContent.querySelector('img')).toBeTruthy();
      expect(previewContent.textContent).not.toContain('Previous content');
    });
  });
});
