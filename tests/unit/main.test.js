const { parseDirectoryHierarchy, getFileType } = require('../../main.js');

describe('Main Process Functions', () => {
  describe('parseDirectoryHierarchy', () => {
    test('should parse artist and album from directory path', () => {
      const result = parseDirectoryHierarchy('Beatles/Abbey Road');
      expect(result).toEqual({
        artist: 'Beatles',
        album: 'Abbey Road'
      });
    });

    test('should parse only artist when no album directory', () => {
      const result = parseDirectoryHierarchy('Beatles');
      expect(result).toEqual({
        artist: 'Beatles',
        album: null
      });
    });

    test('should handle empty path', () => {
      const result = parseDirectoryHierarchy('');
      expect(result).toEqual({
        artist: null,
        album: null
      });
    });

    test('should handle null path', () => {
      const result = parseDirectoryHierarchy(null);
      expect(result).toEqual({
        artist: null,
        album: null
      });
    });

    test('should handle undefined path', () => {
      const result = parseDirectoryHierarchy(undefined);
      expect(result).toEqual({
        artist: null,
        album: null
      });
    });

    test('should handle complex directory path', () => {
      const result = parseDirectoryHierarchy('The Beatles/Abbey Road/Disc 1');
      expect(result).toEqual({
        artist: 'The Beatles',
        album: 'Abbey Road'
      });
    });

    test('should handle Windows-style path separators', () => {
      const result = parseDirectoryHierarchy('Beatles\\Abbey Road');
      expect(result).toEqual({
        artist: 'Beatles',
        album: 'Abbey Road'
      });
    });
  });

  describe('getFileType', () => {
    test('should identify image file extensions', () => {
      expect(getFileType('.jpg')).toBe('image');
      expect(getFileType('.jpeg')).toBe('image');
      expect(getFileType('.png')).toBe('image');
      expect(getFileType('.gif')).toBe('image');
      expect(getFileType('.bmp')).toBe('image');
      expect(getFileType('.webp')).toBe('image');
    });

    test('should identify video file extensions', () => {
      expect(getFileType('.mp4')).toBe('video');
      expect(getFileType('.avi')).toBe('video');
      expect(getFileType('.mov')).toBe('video');
      expect(getFileType('.wmv')).toBe('video');
    });

    test('should identify audio file extensions', () => {
      expect(getFileType('.mp3')).toBe('audio');
      expect(getFileType('.wav')).toBe('audio');
      expect(getFileType('.flac')).toBe('audio');
      expect(getFileType('.m4a')).toBe('audio');
    });

    test('should handle case-insensitive extensions', () => {
      expect(getFileType('.JPG')).toBe('image');
      expect(getFileType('.Mp4')).toBe('video');
      expect(getFileType('.MP3')).toBe('audio');
    });

    test('should return unknown for unsupported extensions', () => {
      expect(getFileType('.txt')).toBe('unknown');
      expect(getFileType('.doc')).toBe('unknown');
      expect(getFileType('.exe')).toBe('unknown');
      expect(getFileType('')).toBe('unknown');
    });

    test('should handle extensions without dots', () => {
      expect(getFileType('jpg')).toBe('unknown');
      expect(getFileType('mp4')).toBe('unknown');
    });
  });
});
