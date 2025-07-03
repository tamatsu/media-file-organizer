// Playlist functionality unit tests

// Import playlist functions from actual implementation
const {
  extractAudioFiles,
  createPlaylist,
  createAlbumPlaylist
} = require('../../renderer/utils/playlist');

describe('Playlist Functions', () => {
  describe('extractAudioFiles', () => {
    test('should extract only audio files from album files', () => {
      const albumFiles = [
        { name: 'song1.mp3', type: 'audio', path: '/music/song1.mp3' },
        { name: 'cover.jpg', type: 'image', path: '/music/cover.jpg' },
        { name: 'song2.wav', type: 'audio', path: '/music/song2.wav' },
        { name: 'video.mp4', type: 'video', path: '/music/video.mp4' },
        { name: 'song3.flac', type: 'audio', path: '/music/song3.flac' }
      ];

      const audioFiles = extractAudioFiles(albumFiles);

      expect(audioFiles).toHaveLength(3);
      expect(audioFiles.every(file => file.type === 'audio')).toBe(true);
      expect(audioFiles.map(f => f.name)).toEqual(['song1.mp3', 'song2.wav', 'song3.flac']);
    });

    test('should return empty array for no audio files', () => {
      const albumFiles = [
        { name: 'cover.jpg', type: 'image', path: '/music/cover.jpg' },
        { name: 'video.mp4', type: 'video', path: '/music/video.mp4' }
      ];

      const audioFiles = extractAudioFiles(albumFiles);

      expect(audioFiles).toHaveLength(0);
    });

    test('should handle null or undefined input', () => {
      expect(extractAudioFiles(null)).toEqual([]);
      expect(extractAudioFiles(undefined)).toEqual([]);
      expect(extractAudioFiles([])).toEqual([]);
    });

    test('should handle non-array input', () => {
      expect(extractAudioFiles('not an array')).toEqual([]);
      expect(extractAudioFiles({})).toEqual([]);
    });
  });

  describe('createPlaylist', () => {
    const audioFiles = [
      { name: 'song1.mp3', type: 'audio', path: '/music/song1.mp3' },
      { name: 'song2.wav', type: 'audio', path: '/music/song2.wav' },
      { name: 'song3.flac', type: 'audio', path: '/music/song3.flac' }
    ];

    test('should create playlist with correct initial state', () => {
      const playlist = createPlaylist(audioFiles);

      expect(playlist.getCurrentFile()).toEqual(audioFiles[0]);
      expect(playlist.getCurrentIndex()).toBe(0);
      expect(playlist.getLength()).toBe(3);
      expect(playlist.getAllFiles()).toEqual(audioFiles);
    });

    test('should handle empty playlist', () => {
      const playlist = createPlaylist([]);

      expect(playlist.getCurrentFile()).toBeNull();
      expect(playlist.getCurrentIndex()).toBe(0);
      expect(playlist.getLength()).toBe(0);
      expect(playlist.getAllFiles()).toEqual([]);
    });

    test('should navigate to next file correctly', () => {
      const playlist = createPlaylist(audioFiles);

      const nextFile = playlist.next();
      expect(nextFile).toEqual(audioFiles[1]);
      expect(playlist.getCurrentIndex()).toBe(1);

      playlist.next();
      expect(playlist.getCurrentIndex()).toBe(2);

      // Should wrap around to first file
      const wrappedFile = playlist.next();
      expect(wrappedFile).toEqual(audioFiles[0]);
      expect(playlist.getCurrentIndex()).toBe(0);
    });

    test('should navigate to previous file correctly', () => {
      const playlist = createPlaylist(audioFiles);

      // Should wrap around to last file
      const prevFile = playlist.previous();
      expect(prevFile).toEqual(audioFiles[2]);
      expect(playlist.getCurrentIndex()).toBe(2);

      playlist.previous();
      expect(playlist.getCurrentIndex()).toBe(1);

      playlist.previous();
      expect(playlist.getCurrentIndex()).toBe(0);
    });

    test('should set index correctly', () => {
      const playlist = createPlaylist(audioFiles);

      const result = playlist.setIndex(2);
      expect(result).toEqual(audioFiles[2]);
      expect(playlist.getCurrentIndex()).toBe(2);

      // Invalid index should return null and not change current
      const invalidResult = playlist.setIndex(10);
      expect(invalidResult).toBeNull();
      expect(playlist.getCurrentIndex()).toBe(2);
    });

    test('should find index by path correctly', () => {
      const playlist = createPlaylist(audioFiles);

      expect(playlist.findIndexByPath('/music/song1.mp3')).toBe(0);
      expect(playlist.findIndexByPath('/music/song2.wav')).toBe(1);
      expect(playlist.findIndexByPath('/music/nonexistent.mp3')).toBe(-1);
    });

    test('should set current by path correctly', () => {
      const playlist = createPlaylist(audioFiles);

      const result = playlist.setCurrentByPath('/music/song3.flac');
      expect(result).toEqual(audioFiles[2]);
      expect(playlist.getCurrentIndex()).toBe(2);

      // Non-existent path should return null
      const invalidResult = playlist.setCurrentByPath('/music/nonexistent.mp3');
      expect(invalidResult).toBeNull();
      expect(playlist.getCurrentIndex()).toBe(2); // Should not change
    });

    test('should check hasNext and hasPrevious correctly', () => {
      const playlist = createPlaylist(audioFiles);

      expect(playlist.hasNext()).toBe(true);
      expect(playlist.hasPrevious()).toBe(true);

      const emptyPlaylist = createPlaylist([]);
      expect(emptyPlaylist.hasNext()).toBe(false);
      expect(emptyPlaylist.hasPrevious()).toBe(false);
    });

    test('should reset to first file correctly', () => {
      const playlist = createPlaylist(audioFiles);

      playlist.setIndex(2);
      expect(playlist.getCurrentIndex()).toBe(2);

      const resetFile = playlist.reset();
      expect(resetFile).toEqual(audioFiles[0]);
      expect(playlist.getCurrentIndex()).toBe(0);
    });

    test('should handle null/undefined audioFiles parameter', () => {
      const playlist = createPlaylist(null);

      expect(playlist.getCurrentFile()).toBeNull();
      expect(playlist.getLength()).toBe(0);
      expect(playlist.next()).toBeNull();
      expect(playlist.previous()).toBeNull();
    });
  });

  describe('createAlbumPlaylist', () => {
    test('should create playlist from album files with audio extraction', () => {
      const albumFiles = [
        { name: 'song1.mp3', type: 'audio', path: '/music/song1.mp3' },
        { name: 'cover.jpg', type: 'image', path: '/music/cover.jpg' },
        { name: 'song2.wav', type: 'audio', path: '/music/song2.wav' }
      ];

      const playlist = createAlbumPlaylist(albumFiles);

      expect(playlist.getLength()).toBe(2);
      expect(playlist.getCurrentFile().name).toBe('song1.mp3');
      expect(playlist.getAllFiles().every(file => file.type === 'audio')).toBe(true);
    });

    test('should handle album with no audio files', () => {
      const albumFiles = [
        { name: 'cover.jpg', type: 'image', path: '/music/cover.jpg' },
        { name: 'video.mp4', type: 'video', path: '/music/video.mp4' }
      ];

      const playlist = createAlbumPlaylist(albumFiles);

      expect(playlist.getLength()).toBe(0);
      expect(playlist.getCurrentFile()).toBeNull();
    });
  });

  describe('Integration scenarios', () => {
    test('should handle typical album browsing scenario', () => {
      const albumFiles = [
        { name: '01-intro.mp3', type: 'audio', path: '/album/01-intro.mp3' },
        { name: '02-verse.mp3', type: 'audio', path: '/album/02-verse.mp3' },
        { name: '03-chorus.mp3', type: 'audio', path: '/album/03-chorus.mp3' },
        { name: 'album-art.jpg', type: 'image', path: '/album/album-art.jpg' }
      ];

      const playlist = createAlbumPlaylist(albumFiles);

      // Should start with first audio file
      expect(playlist.getCurrentFile().name).toBe('01-intro.mp3');

      // User clicks on third audio file
      const thirdFile = playlist.setCurrentByPath('/album/03-chorus.mp3');
      expect(thirdFile.name).toBe('03-chorus.mp3');
      expect(playlist.getCurrentIndex()).toBe(2);

      // Audio ends, should go to next (wraparound to first)
      const nextFile = playlist.next();
      expect(nextFile.name).toBe('01-intro.mp3');

      // User goes to previous
      const prevFile = playlist.previous();
      expect(prevFile.name).toBe('03-chorus.mp3');
    });
  });
});
