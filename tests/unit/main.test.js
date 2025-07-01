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

  describe('Error handling', () => {
    test('should handle invalid input types gracefully', () => {
      // Test parseDirectoryHierarchy with various invalid inputs
      expect(parseDirectoryHierarchy(123)).toEqual({ artist: null, album: null });
      expect(parseDirectoryHierarchy({})).toEqual({ artist: null, album: null });
      expect(parseDirectoryHierarchy([])).toEqual({ artist: null, album: null });
      expect(parseDirectoryHierarchy(true)).toEqual({ artist: null, album: null });
    });

    test('should handle special characters in paths', () => {
      const result = parseDirectoryHierarchy('Artist With Spaces/Album & Title');
      expect(result).toEqual({
        artist: 'Artist With Spaces',
        album: 'Album & Title'
      });
    });

    test('should handle Unicode characters in paths', () => {
      const result = parseDirectoryHierarchy('アーティスト/アルバム名');
      expect(result).toEqual({
        artist: 'アーティスト',
        album: 'アルバム名'
      });
    });

    test('should handle very long path strings', () => {
      const longArtist = 'A'.repeat(1000);
      const longAlbum = 'B'.repeat(1000);
      const result = parseDirectoryHierarchy(`${longArtist}/${longAlbum}`);
      expect(result).toEqual({
        artist: longArtist,
        album: longAlbum
      });
    });

    test('should handle mixed path separators', () => {
      const result = parseDirectoryHierarchy('Artist\\Album/Song');
      expect(result).toEqual({
        artist: 'Artist',
        album: 'Album'
      });
    });

    test('should handle multiple consecutive separators', () => {
      const result = parseDirectoryHierarchy('Artist//Album');
      expect(result).toEqual({
        artist: 'Artist',
        album: ''
      });
    });

    test('should handle getFileType with invalid inputs', () => {
      expect(getFileType(null)).toBe('unknown');
      expect(getFileType(undefined)).toBe('unknown');
      expect(getFileType(123)).toBe('unknown');
      expect(getFileType({})).toBe('unknown');
      expect(getFileType([])).toBe('unknown');
    });

    test('should handle getFileType with special characters', () => {
      expect(getFileType('.jp@g')).toBe('unknown');
      expect(getFileType('.m4a!')).toBe('unknown');
      expect(getFileType('..jpg')).toBe('unknown');
    });

    test('should handle extremely long extensions', () => {
      const longExt = '.js' + 'x'.repeat(1000);
      expect(getFileType(longExt)).toBe('unknown');
    });

    test('should handle extensions with Unicode characters', () => {
      expect(getFileType('.jpgあ')).toBe('unknown');
      expect(getFileType('.мp3')).toBe('unknown');
    });
  });
});
