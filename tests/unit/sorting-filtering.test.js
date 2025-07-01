// Sorting and filtering functionality tests

// Mock localStorage for testing
const localStorageMock = {
  data: {},
  getItem: jest.fn(key => localStorageMock.data[key] || null),
  setItem: jest.fn((key, value) => {
    localStorageMock.data[key] = value;
  }),
  removeItem: jest.fn(key => {
    delete localStorageMock.data[key];
  }),
  clear: jest.fn(() => {
    localStorageMock.data = {};
  })
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock console methods
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn()
};

// Extract helper functions for testing
function loadRating(albumKey) {
  try {
    const ratingsJson = localStorage.getItem('albumRatings');
    const ratings = ratingsJson ? JSON.parse(ratingsJson) : {};
    return ratings[albumKey] || 0;
  } catch (error) {
    console.error('Error loading rating:', error);
    return 0;
  }
}

function getAlbumRating(artistName, albumName) {
  const albumKey = `${artistName}/${albumName}`;
  return loadRating(albumKey);
}

function filterAlbumsByRating(albumGroups, ratingFilter) {
  if (ratingFilter === 'all') {
    return albumGroups;
  }

  const filtered = {};
  Object.keys(albumGroups).forEach(artistName => {
    const artistAlbums = albumGroups[artistName];
    const filteredAlbums = {};
    
    Object.keys(artistAlbums).forEach(albumName => {
      const rating = getAlbumRating(artistName, albumName);
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
        filteredAlbums[albumName] = artistAlbums[albumName];
      }
    });

    if (Object.keys(filteredAlbums).length > 0) {
      filtered[artistName] = filteredAlbums;
    }
  });

  return filtered;
}

function sortAlbums(albumGroups, sortOption) {
  const sorted = {};
  
  Object.keys(albumGroups).forEach(artistName => {
    const artistAlbums = albumGroups[artistName];
    const albumEntries = Object.entries(artistAlbums);
    
    albumEntries.sort((a, b) => {
      const [albumNameA, filesA] = a;
      const [albumNameB, filesB] = b;
      const ratingA = getAlbumRating(artistName, albumNameA);
      const ratingB = getAlbumRating(artistName, albumNameB);

      switch (sortOption) {
        case 'name-asc':
          return albumNameA.localeCompare(albumNameB);
        case 'name-desc':
          return albumNameB.localeCompare(albumNameA);
        case 'rating-desc':
          if (ratingB !== ratingA) return ratingB - ratingA;
          return albumNameA.localeCompare(albumNameB);
        case 'rating-asc':
          if (ratingA !== ratingB) return ratingA - ratingB;
          return albumNameA.localeCompare(albumNameB);
        case 'filecount-desc':
          if (filesB.length !== filesA.length) return filesB.length - filesA.length;
          return albumNameA.localeCompare(albumNameB);
        case 'filecount-asc':
          if (filesA.length !== filesB.length) return filesA.length - filesB.length;
          return albumNameA.localeCompare(albumNameB);
        default:
          return albumNameA.localeCompare(albumNameB);
      }
    });

    sorted[artistName] = Object.fromEntries(albumEntries);
  });

  // Sort artists
  const artistEntries = Object.entries(sorted);
  artistEntries.sort((a, b) => {
    const [artistNameA] = a;
    const [artistNameB] = b;

    switch (sortOption) {
      case 'artist-asc':
        return artistNameA.localeCompare(artistNameB);
      case 'artist-desc':
        return artistNameB.localeCompare(artistNameA);
      default:
        return artistNameA.localeCompare(artistNameB);
    }
  });

  return Object.fromEntries(artistEntries);
}

describe('Sorting and Filtering Functions', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('getAlbumRating', () => {
    test('should return correct rating for existing album', () => {
      localStorageMock.data.albumRatings = JSON.stringify({
        'Beatles/Abbey Road': 5,
        'Queen/A Night at the Opera': 4
      });

      expect(getAlbumRating('Beatles', 'Abbey Road')).toBe(5);
      expect(getAlbumRating('Queen', 'A Night at the Opera')).toBe(4);
    });

    test('should return 0 for non-existent album', () => {
      expect(getAlbumRating('NonExistent', 'Album')).toBe(0);
    });
  });

  describe('filterAlbumsByRating', () => {
    const testAlbumGroups = {
      'Beatles': {
        'Abbey Road': ['song1.mp3', 'song2.mp3'],
        'Revolver': ['song3.mp3']
      },
      'Queen': {
        'A Night at the Opera': ['song4.mp3'],
        'News of the World': ['song5.mp3', 'song6.mp3']
      }
    };

    beforeEach(() => {
      localStorageMock.data.albumRatings = JSON.stringify({
        'Beatles/Abbey Road': 5,
        'Beatles/Revolver': 3,
        'Queen/A Night at the Opera': 4,
        // 'Queen/News of the World' is unrated (0)
      });
    });

    test('should return all albums when filter is "all"', () => {
      const result = filterAlbumsByRating(testAlbumGroups, 'all');
      expect(result).toEqual(testAlbumGroups);
    });

    test('should filter albums by exact rating (5 stars)', () => {
      const result = filterAlbumsByRating(testAlbumGroups, '5');
      
      expect(Object.keys(result)).toEqual(['Beatles']);
      expect(Object.keys(result.Beatles)).toEqual(['Abbey Road']);
    });

    test('should filter albums by minimum rating (3+ stars)', () => {
      const result = filterAlbumsByRating(testAlbumGroups, '3');
      
      expect(Object.keys(result)).toEqual(['Beatles', 'Queen']);
      expect(Object.keys(result.Beatles).sort()).toEqual(['Abbey Road', 'Revolver']);
      expect(Object.keys(result.Queen)).toEqual(['A Night at the Opera']);
    });

    test('should filter unrated albums only', () => {
      const result = filterAlbumsByRating(testAlbumGroups, 'unrated');
      
      expect(Object.keys(result)).toEqual(['Queen']);
      expect(Object.keys(result.Queen)).toEqual(['News of the World']);
    });

    test('should filter albums with 1+ stars correctly', () => {
      // All albums have 1+ stars
      localStorageMock.data.albumRatings = JSON.stringify({
        'Beatles/Abbey Road': 5,
        'Beatles/Revolver': 3,
        'Queen/A Night at the Opera': 4,
        'Queen/News of the World': 2
      });

      const result = filterAlbumsByRating(testAlbumGroups, '1');
      expect(Object.keys(result)).toHaveLength(2); // Both artists have albums with 1+ stars
      expect(Object.keys(result.Beatles)).toHaveLength(2); // Both Beatles albums
      expect(Object.keys(result.Queen)).toHaveLength(2); // Both Queen albums
    });
  });

  describe('sortAlbums', () => {
    const testAlbumGroups = {
      'Queen': {
        'A Night at the Opera': ['song1.mp3'],
        'News of the World': ['song2.mp3', 'song3.mp3']
      },
      'Beatles': {
        'Abbey Road': ['song4.mp3', 'song5.mp3', 'song6.mp3'],
        'Revolver': ['song7.mp3']
      }
    };

    beforeEach(() => {
      localStorageMock.data.albumRatings = JSON.stringify({
        'Beatles/Abbey Road': 5,
        'Beatles/Revolver': 3,
        'Queen/A Night at the Opera': 4,
        'Queen/News of the World': 2
      });
    });

    test('should sort albums by name ascending', () => {
      const result = sortAlbums(testAlbumGroups, 'name-asc');
      
      const beatlesAlbums = Object.keys(result.Beatles);
      expect(beatlesAlbums).toEqual(['Abbey Road', 'Revolver']);
      
      const queenAlbums = Object.keys(result.Queen);
      expect(queenAlbums).toEqual(['A Night at the Opera', 'News of the World']);
    });

    test('should sort albums by name descending', () => {
      const result = sortAlbums(testAlbumGroups, 'name-desc');
      
      const beatlesAlbums = Object.keys(result.Beatles);
      expect(beatlesAlbums).toEqual(['Revolver', 'Abbey Road']);
      
      const queenAlbums = Object.keys(result.Queen);
      expect(queenAlbums).toEqual(['News of the World', 'A Night at the Opera']);
    });

    test('should sort albums by rating descending', () => {
      const result = sortAlbums(testAlbumGroups, 'rating-desc');
      
      const beatlesAlbums = Object.keys(result.Beatles);
      expect(beatlesAlbums).toEqual(['Abbey Road', 'Revolver']); // 5, 3
      
      const queenAlbums = Object.keys(result.Queen);
      expect(queenAlbums).toEqual(['A Night at the Opera', 'News of the World']); // 4, 2
    });

    test('should sort albums by rating ascending', () => {
      const result = sortAlbums(testAlbumGroups, 'rating-asc');
      
      const beatlesAlbums = Object.keys(result.Beatles);
      expect(beatlesAlbums).toEqual(['Revolver', 'Abbey Road']); // 3, 5
      
      const queenAlbums = Object.keys(result.Queen);
      expect(queenAlbums).toEqual(['News of the World', 'A Night at the Opera']); // 2, 4
    });

    test('should sort albums by file count descending', () => {
      const result = sortAlbums(testAlbumGroups, 'filecount-desc');
      
      const beatlesAlbums = Object.keys(result.Beatles);
      expect(beatlesAlbums).toEqual(['Abbey Road', 'Revolver']); // 3 files, 1 file
      
      const queenAlbums = Object.keys(result.Queen);
      expect(queenAlbums).toEqual(['News of the World', 'A Night at the Opera']); // 2 files, 1 file
    });

    test('should sort albums by file count ascending', () => {
      const result = sortAlbums(testAlbumGroups, 'filecount-asc');
      
      const beatlesAlbums = Object.keys(result.Beatles);
      expect(beatlesAlbums).toEqual(['Revolver', 'Abbey Road']); // 1 file, 3 files
      
      const queenAlbums = Object.keys(result.Queen);
      expect(queenAlbums).toEqual(['A Night at the Opera', 'News of the World']); // 1 file, 2 files
    });

    test('should sort artists by name ascending', () => {
      const result = sortAlbums(testAlbumGroups, 'artist-asc');
      
      const artistNames = Object.keys(result);
      expect(artistNames).toEqual(['Beatles', 'Queen']);
    });

    test('should sort artists by name descending', () => {
      const result = sortAlbums(testAlbumGroups, 'artist-desc');
      
      const artistNames = Object.keys(result);
      expect(artistNames).toEqual(['Queen', 'Beatles']);
    });

    test('should handle equal ratings with secondary sort by name', () => {
      localStorageMock.data.albumRatings = JSON.stringify({
        'Beatles/Abbey Road': 4,
        'Beatles/Revolver': 4, // Same rating as Abbey Road
      });

      const result = sortAlbums(testAlbumGroups, 'rating-desc');
      const beatlesAlbums = Object.keys(result.Beatles);
      expect(beatlesAlbums).toEqual(['Abbey Road', 'Revolver']); // Alphabetical when ratings are equal
    });
  });

  describe('Integration scenarios', () => {
    test('should combine filtering and sorting correctly', () => {
      const albumGroups = {
        'Beatles': {
          'Abbey Road': ['song1.mp3'],
          'Revolver': ['song2.mp3'],
          'Sgt. Pepper': ['song3.mp3']
        },
        'Queen': {
          'A Night at the Opera': ['song4.mp3'],
          'Bohemian Rhapsody': ['song5.mp3']
        }
      };

      localStorageMock.data.albumRatings = JSON.stringify({
        'Beatles/Abbey Road': 5,
        'Beatles/Revolver': 3,
        'Beatles/Sgt. Pepper': 4,
        'Queen/A Night at the Opera': 5,
        // 'Queen/Bohemian Rhapsody' is unrated
      });

      // Filter 4+ stars and sort by rating descending
      const filtered = filterAlbumsByRating(albumGroups, '4');
      const sorted = sortAlbums(filtered, 'rating-desc');

      expect(Object.keys(sorted)).toEqual(['Beatles', 'Queen']);
      expect(Object.keys(sorted.Beatles)).toEqual(['Abbey Road', 'Sgt. Pepper']); // 5, 4
      expect(Object.keys(sorted.Queen)).toEqual(['A Night at the Opera']); // 5
    });
  });
});