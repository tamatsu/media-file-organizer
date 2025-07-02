// UI utility functions unit tests

// Import actual implementations
const { getFileIcon, formatFileSize, formatDate } = require('../../renderer/utils/ui');

describe('UI Utility Functions', () => {
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
      expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
      expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB');
    });

    test('should format gigabytes correctly', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
      expect(formatFileSize(2.5 * 1024 * 1024 * 1024)).toBe('2.5 GB');
    });

    test('should handle large numbers', () => {
      expect(formatFileSize(1000000000)).toBe('953.67 MB');
      expect(formatFileSize(5000000000)).toBe('4.66 GB');
    });

    test('should round properly', () => {
      expect(formatFileSize(1025)).toBe('1 KB');
      expect(formatFileSize(1023)).toBe('1023 B');
    });

    test('should handle edge cases', () => {
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
});
