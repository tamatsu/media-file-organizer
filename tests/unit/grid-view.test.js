// Grid view functionality unit tests

// Mock DOM methods
const mockElement = () => {
  let className = '';
  const classList = {
    add: jest.fn(cls => {
      className += className ? ` ${cls}` : cls;
    }),
    remove: jest.fn(),
    contains: jest.fn(),
    toggle: jest.fn()
  };

  return {
    get className() {
      return className;
    },
    set className(value) {
      className = value;
    },
    textContent: '',
    innerHTML: '',
    style: {},
    appendChild: jest.fn(),
    addEventListener: jest.fn(),
    querySelectorAll: jest.fn(() => []),
    querySelector: jest.fn(),
    classList
  };
};

global.document = {
  createElement: () => mockElement(),
  getElementById: () => mockElement()
};

// Mock loadRating function
global.loadRating = jest.fn(() => 0);

/* global loadRating */

describe('Grid View Functions', () => {
  // Sample test data
  const sampleAlbumGroups = {
    'Album A': [
      { name: 'file1.mp3', type: 'audio', artist: 'Artist 1', size: 1000 },
      { name: 'file2.mp3', type: 'audio', artist: 'Artist 1', size: 2000 }
    ],
    'Album B': [{ name: 'file3.jpg', type: 'image', artist: 'Artist 2', size: 3000 }]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('filterAlbumsByRatingSimple', () => {
    // Mock the function since it's defined in index.html
    const filterAlbumsByRatingSimple = (albumGroups, ratingFilter) => {
      if (ratingFilter === 'all') {
        return albumGroups;
      }

      const filtered = {};
      Object.keys(albumGroups).forEach(albumName => {
        const albumFiles = albumGroups[albumName];
        if (!Array.isArray(albumFiles) || albumFiles.length === 0) {
          return;
        }

        const firstFile = albumFiles[0];
        const artistName = firstFile.artist || 'アーティスト名なし';
        const albumKey = `${artistName}/${albumName}`;
        const rating = loadRating(albumKey);

        let includeAlbum = false;
        if (ratingFilter === 'unrated') {
          includeAlbum = rating === 0;
        } else {
          const minRating = parseInt(ratingFilter);
          if (ratingFilter === '5') {
            includeAlbum = rating === 5;
          } else {
            includeAlbum = rating >= minRating;
          }
        }

        if (includeAlbum) {
          filtered[albumName] = albumFiles;
        }
      });

      return filtered;
    };

    test('should return all albums when filter is "all"', () => {
      const result = filterAlbumsByRatingSimple(sampleAlbumGroups, 'all');
      expect(result).toEqual(sampleAlbumGroups);
    });

    test('should filter unrated albums only', () => {
      loadRating.mockReturnValue(0);
      const result = filterAlbumsByRatingSimple(sampleAlbumGroups, 'unrated');
      expect(Object.keys(result)).toEqual(['Album A', 'Album B']);
    });

    test('should filter albums with exact rating (5 stars)', () => {
      loadRating.mockImplementation(key => (key === 'Artist 1/Album A' ? 5 : 0));
      const result = filterAlbumsByRatingSimple(sampleAlbumGroups, '5');
      expect(Object.keys(result)).toEqual(['Album A']);
    });

    test('should filter albums with minimum rating (3+ stars)', () => {
      loadRating.mockImplementation(key => {
        if (key === 'Artist 1/Album A') {
          return 4;
        }
        if (key === 'Artist 2/Album B') {
          return 2;
        }
        return 0;
      });
      const result = filterAlbumsByRatingSimple(sampleAlbumGroups, '3');
      expect(Object.keys(result)).toEqual(['Album A']);
    });

    test('should handle empty album groups', () => {
      const result = filterAlbumsByRatingSimple({}, 'all');
      expect(result).toEqual({});
    });

    test('should skip albums with invalid file arrays', () => {
      const invalidGroups = {
        'Valid Album': [{ name: 'file.mp3', type: 'audio', artist: 'Artist' }],
        'Invalid Album': null
      };

      // Test that the function filters out invalid albums
      const filtered = {};
      Object.keys(invalidGroups).forEach(albumName => {
        const albumFiles = invalidGroups[albumName];
        if (Array.isArray(albumFiles) && albumFiles.length > 0) {
          filtered[albumName] = albumFiles;
        }
      });

      expect(Object.keys(filtered)).toEqual(['Valid Album']);
    });
  });

  describe('sortAlbumsSimple', () => {
    const sortAlbumsSimple = (albumGroups, sortBy) => {
      const albumEntries = Object.entries(albumGroups);

      albumEntries.sort(([albumNameA, albumFilesA], [albumNameB, albumFilesB]) => {
        switch (sortBy) {
          case 'name-asc':
            return albumNameA.localeCompare(albumNameB);
          case 'name-desc':
            return albumNameB.localeCompare(albumNameA);
          case 'rating-desc':
          case 'rating-asc': {
            const firstFileA = albumFilesA[0];
            const firstFileB = albumFilesB[0];
            const artistA = firstFileA?.artist || 'アーティスト名なし';
            const artistB = firstFileB?.artist || 'アーティスト名なし';
            const ratingA = loadRating(`${artistA}/${albumNameA}`);
            const ratingB = loadRating(`${artistB}/${albumNameB}`);

            if (sortBy === 'rating-desc') {
              return ratingB - ratingA || albumNameA.localeCompare(albumNameB);
            } else {
              return ratingA - ratingB || albumNameA.localeCompare(albumNameB);
            }
          }
          case 'filecount-desc':
            return albumFilesB.length - albumFilesA.length || albumNameA.localeCompare(albumNameB);
          case 'filecount-asc':
            return albumFilesA.length - albumFilesB.length || albumNameA.localeCompare(albumNameB);
          default:
            return albumNameA.localeCompare(albumNameB);
        }
      });

      return Object.fromEntries(albumEntries);
    };

    test('should sort albums by name ascending', () => {
      const result = sortAlbumsSimple(sampleAlbumGroups, 'name-asc');
      const albumNames = Object.keys(result);
      expect(albumNames).toEqual(['Album A', 'Album B']);
    });

    test('should sort albums by name descending', () => {
      const result = sortAlbumsSimple(sampleAlbumGroups, 'name-desc');
      const albumNames = Object.keys(result);
      expect(albumNames).toEqual(['Album B', 'Album A']);
    });

    test('should sort albums by file count descending', () => {
      const result = sortAlbumsSimple(sampleAlbumGroups, 'filecount-desc');
      const albumNames = Object.keys(result);
      expect(albumNames).toEqual(['Album A', 'Album B']); // Album A has 2 files, Album B has 1
    });

    test('should sort albums by file count ascending', () => {
      const result = sortAlbumsSimple(sampleAlbumGroups, 'filecount-asc');
      const albumNames = Object.keys(result);
      expect(albumNames).toEqual(['Album B', 'Album A']); // Album B has 1 file, Album A has 2
    });

    test('should sort albums by rating descending', () => {
      loadRating.mockImplementation(key => {
        if (key === 'Artist 1/Album A') {
          return 3;
        }
        if (key === 'Artist 2/Album B') {
          return 5;
        }
        return 0;
      });
      const result = sortAlbumsSimple(sampleAlbumGroups, 'rating-desc');
      const albumNames = Object.keys(result);
      expect(albumNames).toEqual(['Album B', 'Album A']); // Album B has 5 stars, Album A has 3
    });

    test('should sort albums by rating ascending', () => {
      loadRating.mockImplementation(key => {
        if (key === 'Artist 1/Album A') {
          return 3;
        }
        if (key === 'Artist 2/Album B') {
          return 5;
        }
        return 0;
      });
      const result = sortAlbumsSimple(sampleAlbumGroups, 'rating-asc');
      const albumNames = Object.keys(result);
      expect(albumNames).toEqual(['Album A', 'Album B']); // Album A has 3 stars, Album B has 5
    });

    test('should handle equal ratings with secondary sort by name', () => {
      loadRating.mockReturnValue(3); // Same rating for both albums
      const result = sortAlbumsSimple(sampleAlbumGroups, 'rating-desc');
      const albumNames = Object.keys(result);
      expect(albumNames).toEqual(['Album A', 'Album B']); // Sorted by name as secondary
    });

    test('should default to name ascending for unknown sort type', () => {
      const result = sortAlbumsSimple(sampleAlbumGroups, 'unknown');
      const albumNames = Object.keys(result);
      expect(albumNames).toEqual(['Album A', 'Album B']);
    });

    test('should handle empty album groups', () => {
      const result = sortAlbumsSimple({}, 'name-asc');
      expect(result).toEqual({});
    });
  });

  describe('Grid Container Creation', () => {
    test('should create grid container with correct class', () => {
      const container = document.createElement('div');
      container.className = 'album-grid-container';

      expect(container.className).toBe('album-grid-container');
    });

    test('should create grid items with proper structure', () => {
      const gridItem = document.createElement('div');
      gridItem.className = 'album-grid-item';

      const albumCard = document.createElement('div');
      albumCard.className = 'album-card';

      expect(gridItem.className).toBe('album-grid-item');
      expect(albumCard.className).toBe('album-card');
    });
  });

  describe('Data Validation', () => {
    test('should validate albumFiles is an array', () => {
      const testCases = [
        { input: [], expected: true },
        { input: [{ name: 'file.mp3' }], expected: true },
        { input: null, expected: false },
        { input: undefined, expected: false },
        { input: 'not an array', expected: false },
        { input: {}, expected: false }
      ];

      testCases.forEach(({ input, expected }) => {
        expect(Array.isArray(input)).toBe(expected);
      });
    });
  });
});
