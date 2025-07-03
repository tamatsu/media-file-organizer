// Rating system unit tests
/* global localStorage */

// Mock localStorage for testing
const localStorageMock = (() => {
  let store = {};
  return {
    get data() {
      return store;
    },
    set data(value) {
      store = value;
    },
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

// Set up global localStorage mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock console methods
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn()
};

// Also set global.localStorage for Node.js environment
global.localStorage = localStorageMock;

// Import rating functions from actual implementation
const {
  saveRating,
  loadRating,
  loadAllRatings,
  getAlbumRating
} = require('../../renderer/utils/rating');

describe('Rating System', () => {
  beforeEach(() => {
    // Clear localStorage data
    localStorageMock.clear();

    // Clear all mock call history
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();

    // Reset all mock implementations to default behavior
    localStorageMock.getItem.mockImplementation(key => localStorageMock.data[key] || null);
    localStorageMock.setItem.mockImplementation((key, value) => {
      localStorageMock.data[key] = value;
    });

    // Clear console mocks
    jest.clearAllMocks();
  });

  describe('saveRating', () => {
    test('should save rating to localStorage', () => {
      saveRating('Artist/Album', 4);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'albumRatings',
        JSON.stringify({ 'Artist/Album': 4 })
      );
      expect(console.log).toHaveBeenCalledWith('Saved rating for Artist/Album: 4 stars');
    });

    test('should save multiple ratings', () => {
      saveRating('Artist1/Album1', 3);
      saveRating('Artist2/Album2', 5);

      const expectedData = {
        'Artist1/Album1': 3,
        'Artist2/Album2': 5
      };
      expect(localStorage.setItem).toHaveBeenLastCalledWith(
        'albumRatings',
        JSON.stringify(expectedData)
      );
    });

    test('should update existing rating', () => {
      saveRating('Artist/Album', 3);
      saveRating('Artist/Album', 5);

      expect(localStorage.setItem).toHaveBeenLastCalledWith(
        'albumRatings',
        JSON.stringify({ 'Artist/Album': 5 })
      );
    });

    test('should handle localStorage errors gracefully', () => {
      // Temporarily override setItem to throw error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      saveRating('Artist/Album', 4);

      expect(console.error).toHaveBeenCalledWith('Error saving rating:', expect.any(Error));

      // Restore original mock
      localStorage.setItem = originalSetItem;
    });
  });

  describe('loadRating', () => {
    test('should load existing rating', () => {
      localStorageMock.setItem(
        'albumRatings',
        JSON.stringify({
          'Artist/Album': 4
        })
      );

      const rating = loadRating('Artist/Album');
      expect(rating).toBe(4);
    });

    test('should return 0 for non-existent rating', () => {
      const rating = loadRating('NonExistent/Album');
      expect(rating).toBe(0);
    });

    test('should return 0 when localStorage is empty', () => {
      const rating = loadRating('Artist/Album');
      expect(rating).toBe(0);
    });

    test('should handle localStorage errors gracefully', () => {
      // Temporarily override getItem to throw error
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = jest.fn(() => {
        throw new Error('Storage access denied');
      });

      const rating = loadRating('Artist/Album');

      expect(rating).toBe(0);
      expect(console.error).toHaveBeenCalledWith('Error loading all ratings:', expect.any(Error));

      // Restore original mock
      localStorage.getItem = originalGetItem;
    });

    test('should handle corrupted JSON data', () => {
      localStorageMock.setItem('albumRatings', 'invalid json');

      const rating = loadRating('Artist/Album');

      expect(rating).toBe(0);
      expect(console.error).toHaveBeenCalledWith('Error loading all ratings:', expect.any(Error));
    });
  });

  describe('loadAllRatings', () => {
    test('should load all ratings', () => {
      const testData = {
        'Artist1/Album1': 3,
        'Artist2/Album2': 5,
        'Artist3/Album3': 2
      };
      localStorageMock.setItem('albumRatings', JSON.stringify(testData));

      const ratings = loadAllRatings();
      expect(ratings).toEqual(testData);
    });

    test('should return empty object when no ratings exist', () => {
      const ratings = loadAllRatings();
      expect(ratings).toEqual({});
    });

    test('should handle localStorage errors gracefully', () => {
      // Temporarily override getItem to throw error
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = jest.fn(() => {
        throw new Error('Storage access denied');
      });

      const ratings = loadAllRatings();

      expect(ratings).toEqual({});
      expect(console.error).toHaveBeenCalledWith('Error loading all ratings:', expect.any(Error));

      // Restore original mock
      localStorage.getItem = originalGetItem;
    });

    test('should handle corrupted JSON data', () => {
      localStorageMock.setItem('albumRatings', 'corrupted data');

      const ratings = loadAllRatings();

      expect(ratings).toEqual({});
      expect(console.error).toHaveBeenCalledWith('Error loading all ratings:', expect.any(Error));
    });
  });

  describe('Integration scenarios', () => {
    test('should maintain rating consistency across save/load operations', () => {
      const testRatings = {
        'Beatles/Abbey Road': 5,
        'Pink Floyd/Dark Side': 4,
        'Led Zeppelin/IV': 5
      };

      // Save all ratings
      Object.entries(testRatings).forEach(([albumKey, rating]) => {
        saveRating(albumKey, rating);
      });

      // Load and verify each rating
      Object.entries(testRatings).forEach(([albumKey, expectedRating]) => {
        const actualRating = loadRating(albumKey);
        expect(actualRating).toBe(expectedRating);
      });

      // Verify all ratings can be loaded at once
      const allRatings = loadAllRatings();
      expect(allRatings).toEqual(testRatings);
    });

    test('should handle edge case album keys', () => {
      const edgeCases = {
        '': 3, // Empty artist/album
        'Artist with spaces/Album with spaces': 4,
        'Artist/Sub/Album': 5, // Nested paths
        'アーティスト/アルバム': 2 // Unicode characters
      };

      Object.entries(edgeCases).forEach(([albumKey, rating]) => {
        saveRating(albumKey, rating);
        expect(loadRating(albumKey)).toBe(rating);
      });
    });
  });

  describe('getAlbumRating', () => {
    test('should get rating by artist and album name', () => {
      localStorageMock.setItem(
        'albumRatings',
        JSON.stringify({
          'Beatles/Abbey Road': 5
        })
      );

      const rating = getAlbumRating('Beatles', 'Abbey Road');
      expect(rating).toBe(5);
    });

    test('should return 0 for non-existent album', () => {
      const rating = getAlbumRating('Beatles', 'Sgt Pepper');
      expect(rating).toBe(0);
    });

    test('should handle special characters in names', () => {
      localStorageMock.setItem(
        'albumRatings',
        JSON.stringify({
          'AC/DC/Back in Black': 4
        })
      );

      const rating = getAlbumRating('AC/DC', 'Back in Black');
      expect(rating).toBe(4);
    });

    test('should handle Unicode characters', () => {
      localStorageMock.setItem(
        'albumRatings',
        JSON.stringify({
          'アーティスト/アルバム': 3
        })
      );

      const rating = getAlbumRating('アーティスト', 'アルバム');
      expect(rating).toBe(3);
    });

    test('should handle empty or null parameters', () => {
      const rating1 = getAlbumRating('', '');
      const rating2 = getAlbumRating(null, null);
      const rating3 = getAlbumRating(undefined, undefined);

      expect(rating1).toBe(0);
      expect(rating2).toBe(0);
      expect(rating3).toBe(0);
    });
  });
});
