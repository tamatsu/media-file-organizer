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
});
