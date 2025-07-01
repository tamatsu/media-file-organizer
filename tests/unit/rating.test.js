// Rating system unit tests

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

// Extract rating functions from index.html for testing
function saveRating(albumKey, rating) {
  try {
    const ratings = loadAllRatings();
    ratings[albumKey] = rating;
    localStorage.setItem('albumRatings', JSON.stringify(ratings));
    console.log(`Saved rating for ${albumKey}: ${rating} stars`);
  } catch (error) {
    console.error('Error saving rating:', error);
  }
}

function loadRating(albumKey) {
  try {
    const ratings = loadAllRatings();
    return ratings[albumKey] || 0;
  } catch (error) {
    console.error('Error loading rating:', error);
    return 0;
  }
}

function loadAllRatings() {
  try {
    const ratingsJson = localStorage.getItem('albumRatings');
    return ratingsJson ? JSON.parse(ratingsJson) : {};
  } catch (error) {
    console.error('Error loading all ratings:', error);
    return {};
  }
}

describe('Rating System', () => {
  beforeEach(() => {
    // Clear localStorage and mocks before each test
    localStorageMock.clear();
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
      localStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      saveRating('Artist/Album', 4);

      expect(console.error).toHaveBeenCalledWith(
        'Error saving rating:',
        expect.any(Error)
      );
    });
  });

  describe('loadRating', () => {
    test('should load existing rating', () => {
      localStorageMock.data.albumRatings = JSON.stringify({
        'Artist/Album': 4
      });

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
      localStorage.getItem.mockImplementation(() => {
        throw new Error('Storage access denied');
      });

      const rating = loadRating('Artist/Album');

      expect(rating).toBe(0);
      expect(console.error).toHaveBeenCalledWith(
        'Error loading rating:',
        expect.any(Error)
      );
    });

    test('should handle corrupted JSON data', () => {
      localStorageMock.data.albumRatings = 'invalid json';

      const rating = loadRating('Artist/Album');

      expect(rating).toBe(0);
      expect(console.error).toHaveBeenCalledWith(
        'Error loading all ratings:',
        expect.any(Error)
      );
    });
  });

  describe('loadAllRatings', () => {
    test('should load all ratings', () => {
      const testData = {
        'Artist1/Album1': 3,
        'Artist2/Album2': 5,
        'Artist3/Album3': 2
      };
      localStorageMock.data.albumRatings = JSON.stringify(testData);

      const ratings = loadAllRatings();
      expect(ratings).toEqual(testData);
    });

    test('should return empty object when no ratings exist', () => {
      const ratings = loadAllRatings();
      expect(ratings).toEqual({});
    });

    test('should handle localStorage errors gracefully', () => {
      localStorage.getItem.mockImplementation(() => {
        throw new Error('Storage access denied');
      });

      const ratings = loadAllRatings();

      expect(ratings).toEqual({});
      expect(console.error).toHaveBeenCalledWith(
        'Error loading all ratings:',
        expect.any(Error)
      );
    });

    test('should handle corrupted JSON data', () => {
      localStorageMock.data.albumRatings = 'corrupted data';

      const ratings = loadAllRatings();

      expect(ratings).toEqual({});
      expect(console.error).toHaveBeenCalledWith(
        'Error loading all ratings:',
        expect.any(Error)
      );
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
});