// Thumbnail utility functions unit tests

// Import actual implementations
const {
  getAlbumThumbnail,
  createThumbnailElement,
  createThumbnailPlaceholder,
  handleThumbnailError,
  getAlbumThumbnailElement
} = require('../../renderer/utils/thumbnail');

// Mock DOM methods
const mockElement = () => {
  let className = '';
  const classList = {
    add: jest.fn(cls => {
      className += className ? ` ${cls}` : cls;
    }),
    remove: jest.fn()
  };

  return {
    get className() {
      return className;
    },
    set className(value) {
      className = value;
    },
    textContent: '',
    title: '',
    src: '',
    alt: '',
    appendChild: jest.fn(),
    remove: jest.fn(),
    addEventListener: jest.fn(),
    querySelector: jest.fn(),
    classList
  };
};

const mockCreateElement = jest.fn(() => mockElement());

global.document = {
  createElement: mockCreateElement
};

describe('Thumbnail Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAlbumThumbnail', () => {
    test('should return first image file from album', () => {
      const albumFiles = [
        { name: 'song1.mp3', type: 'audio', path: '/path/song1.mp3' },
        { name: 'cover.jpg', type: 'image', path: '/path/cover.jpg' },
        { name: 'song2.mp3', type: 'audio', path: '/path/song2.mp3' },
        { name: 'back.png', type: 'image', path: '/path/back.png' }
      ];

      const result = getAlbumThumbnail(albumFiles);

      expect(result).toEqual({
        name: 'cover.jpg',
        type: 'image',
        path: '/path/cover.jpg'
      });
    });

    test('should return null when no image files exist', () => {
      const albumFiles = [
        { name: 'song1.mp3', type: 'audio', path: '/path/song1.mp3' },
        { name: 'song2.mp3', type: 'audio', path: '/path/song2.mp3' },
        { name: 'video.mp4', type: 'video', path: '/path/video.mp4' }
      ];

      const result = getAlbumThumbnail(albumFiles);

      expect(result).toBeNull();
    });

    test('should return null for empty album', () => {
      const result = getAlbumThumbnail([]);
      expect(result).toBeNull();
    });

    test('should handle invalid input', () => {
      expect(getAlbumThumbnail(null)).toBeNull();
      expect(getAlbumThumbnail(undefined)).toBeNull();
      expect(getAlbumThumbnail('not an array')).toBeNull();
    });
  });

  describe('createThumbnailElement', () => {
    test('should create thumbnail container with image', () => {
      const container = createThumbnailElement('/path/to/image.jpg', 'Test Album');

      expect(container.className).toBe('album-thumbnail-container loading');
    });

    test('should create container with proper structure', () => {
      const imagePath = '/path/to/cover.jpg';
      const albumName = 'My Album';

      const container = createThumbnailElement(imagePath, albumName);

      expect(container.className).toBe('album-thumbnail-container loading');
    });
  });

  describe('createThumbnailPlaceholder', () => {
    test('should create placeholder container with correct properties', () => {
      const placeholder = createThumbnailPlaceholder('Test Album');

      expect(placeholder.className).toBe('album-thumbnail-container placeholder');
    });

    test('should handle empty album name', () => {
      const placeholder = createThumbnailPlaceholder('');

      expect(placeholder.className).toBe('album-thumbnail-container placeholder');
    });
  });

  describe('handleThumbnailError', () => {
    test('should update container classes when handling error', () => {
      const container = {
        querySelector: jest.fn(() => ({ remove: jest.fn() })),
        classList: {
          add: jest.fn(),
          remove: jest.fn()
        },
        appendChild: jest.fn()
      };

      handleThumbnailError(container);

      expect(container.classList.add).toHaveBeenCalledWith('error');
      expect(container.classList.remove).toHaveBeenCalledWith('loading');
    });

    test('should handle case when no image exists', () => {
      const container = {
        querySelector: jest.fn(() => null),
        classList: {
          add: jest.fn(),
          remove: jest.fn()
        },
        appendChild: jest.fn()
      };

      handleThumbnailError(container);

      expect(container.classList.add).toHaveBeenCalledWith('error');
    });
  });

  describe('getAlbumThumbnailElement', () => {
    test('should return thumbnail element when image exists', () => {
      const albumFiles = [{ name: 'cover.jpg', type: 'image', path: '/path/cover.jpg' }];

      const result = getAlbumThumbnailElement(albumFiles, 'Test Album');

      expect(result.className).toBe('album-thumbnail-container loading');
    });

    test('should return placeholder when no image exists', () => {
      const albumFiles = [{ name: 'song.mp3', type: 'audio', path: '/path/song.mp3' }];

      const result = getAlbumThumbnailElement(albumFiles, 'Test Album');

      expect(result.className).toBe('album-thumbnail-container placeholder');
    });

    test('should handle empty album', () => {
      const result = getAlbumThumbnailElement([], 'Empty Album');

      expect(result.className).toBe('album-thumbnail-container placeholder');
    });
  });
});
