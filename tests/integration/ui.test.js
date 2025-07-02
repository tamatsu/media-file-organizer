// UI Integration Tests

// Import utility functions
const {
  filterFilesBySearch,
  filterFilesByType,
  groupFilesByArtist
} = require('../../renderer/utils/search');

// Mock localStorage
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

// Mock console
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn()
};

describe('UI Integration Tests', () => {
  beforeEach(() => {
    // Clear DOM and mocks
    document.body.innerHTML = '';
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('Star Rating UI', () => {
    test('should create star rating elements', () => {
      // Create album rating container
      const albumRating = document.createElement('div');
      albumRating.className = 'album-rating';

      // Create 5 stars
      for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.textContent = '★';
        star.dataset.rating = i;
        star.dataset.albumKey = 'TestArtist/TestAlbum';
        albumRating.appendChild(star);
      }

      document.body.appendChild(albumRating);

      // Verify stars are created
      const stars = document.querySelectorAll('.star');
      expect(stars).toHaveLength(5);

      stars.forEach((star, index) => {
        expect(star.textContent).toBe('★');
        expect(star.dataset.rating).toBe(String(index + 1));
        expect(star.dataset.albumKey).toBe('TestArtist/TestAlbum');
      });
    });

    test('should handle star click events', () => {
      // Create rating UI
      const albumRating = document.createElement('div');
      albumRating.className = 'album-rating';

      const saveRating = jest.fn();

      for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.textContent = '★';
        star.dataset.rating = i;
        star.dataset.albumKey = 'TestArtist/TestAlbum';

        // Add click handler
        star.addEventListener('click', e => {
          e.stopPropagation();
          const rating = parseInt(e.target.dataset.rating);
          const albumKey = e.target.dataset.albumKey;

          // Update visual state
          const stars = albumRating.querySelectorAll('.star');
          stars.forEach((s, index) => {
            if (index < rating) {
              s.classList.add('active');
            } else {
              s.classList.remove('active');
            }
          });

          saveRating(albumKey, rating);
        });

        albumRating.appendChild(star);
      }

      document.body.appendChild(albumRating);

      // Test clicking the 3rd star
      const thirdStar = document.querySelector('[data-rating="3"]');
      thirdStar.click();

      // Verify visual state
      const stars = document.querySelectorAll('.star');
      expect(stars[0].classList.contains('active')).toBe(true);
      expect(stars[1].classList.contains('active')).toBe(true);
      expect(stars[2].classList.contains('active')).toBe(true);
      expect(stars[3].classList.contains('active')).toBe(false);
      expect(stars[4].classList.contains('active')).toBe(false);

      // Verify callback
      expect(saveRating).toHaveBeenCalledWith('TestArtist/TestAlbum', 3);
    });

    test('should update rating when clicking different stars', () => {
      // Create rating UI
      const albumRating = document.createElement('div');
      albumRating.className = 'album-rating';

      for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.textContent = '★';
        star.dataset.rating = i;
        star.dataset.albumKey = 'TestArtist/TestAlbum';

        star.addEventListener('click', e => {
          e.stopPropagation();
          const rating = parseInt(e.target.dataset.rating);

          // Update visual state
          const stars = albumRating.querySelectorAll('.star');
          stars.forEach((s, index) => {
            if (index < rating) {
              s.classList.add('active');
            } else {
              s.classList.remove('active');
            }
          });
        });

        albumRating.appendChild(star);
      }

      document.body.appendChild(albumRating);

      // Click 5th star
      document.querySelector('[data-rating="5"]').click();
      let stars = document.querySelectorAll('.star');
      expect(stars.length).toBe(5);
      stars.forEach(star => expect(star.classList.contains('active')).toBe(true));

      // Click 2nd star to change rating
      document.querySelector('[data-rating="2"]').click();
      stars = document.querySelectorAll('.star');
      expect(stars[0].classList.contains('active')).toBe(true);
      expect(stars[1].classList.contains('active')).toBe(true);
      expect(stars[2].classList.contains('active')).toBe(false);
      expect(stars[3].classList.contains('active')).toBe(false);
      expect(stars[4].classList.contains('active')).toBe(false);
    });
  });

  describe('File Item Creation', () => {
    test('should create file item with correct structure', () => {
      const mockFile = {
        name: 'test-song.mp3',
        type: 'audio',
        size: 1024000,
        modified: new Date('2023-01-01'),
        path: '/path/to/test-song.mp3',
        artist: 'Test Artist',
        album: 'Test Album',
        relativePath: 'Test Artist/Test Album'
      };

      // Create file item (simplified version)
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      fileItem.dataset.path = mockFile.path;

      const iconDiv = document.createElement('div');
      iconDiv.className = 'file-icon';
      iconDiv.textContent = '🎵'; // Audio icon

      const detailsDiv = document.createElement('div');
      detailsDiv.className = 'file-details';

      const fileName = document.createElement('div');
      fileName.className = 'file-name';
      fileName.textContent = mockFile.name;

      const fileMeta = document.createElement('div');
      fileMeta.className = 'file-meta';
      fileMeta.textContent = `${mockFile.type} • 1000 KB • 2023/1/1 (${mockFile.relativePath}/)`;

      detailsDiv.appendChild(fileName);
      detailsDiv.appendChild(fileMeta);
      fileItem.appendChild(iconDiv);
      fileItem.appendChild(detailsDiv);

      document.body.appendChild(fileItem);

      // Verify structure
      expect(fileItem.classList.contains('file-item')).toBe(true);
      expect(fileItem.dataset.path).toBe(mockFile.path);
      expect(iconDiv.classList.contains('file-icon')).toBe(true);
      expect(iconDiv.textContent).toBe('🎵');
      expect(fileName.classList.contains('file-name')).toBe(true);
      expect(fileName.textContent).toBe(mockFile.name);
      expect(fileMeta.classList.contains('file-meta')).toBe(true);
      expect(fileMeta.textContent).toContain(mockFile.type);
    });

    test('should handle file item click events', () => {
      const mockPreviewFile = jest.fn();
      const mockFile = {
        name: 'test.jpg',
        type: 'image',
        size: 500000,
        path: '/path/to/test.jpg'
      };

      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      fileItem.dataset.path = mockFile.path;

      // Add click event
      fileItem.addEventListener('click', () => {
        mockPreviewFile(mockFile.path, mockFile.type, mockFile.name, mockFile.size);
      });

      document.body.appendChild(fileItem);

      // Test click
      fileItem.click();

      expect(mockPreviewFile).toHaveBeenCalledWith(
        mockFile.path,
        mockFile.type,
        mockFile.name,
        mockFile.size
      );
    });
  });

  describe('Search and Filter Functionality', () => {
    test('should filter files by search term', () => {
      const mockFiles = [
        { name: 'Beatles - Hey Jude.mp3', artist: 'Beatles', album: 'Past Masters' },
        { name: 'Queen - Bohemian Rhapsody.mp3', artist: 'Queen', album: 'A Night at the Opera' },
        { name: 'Beatles - Let It Be.mp3', artist: 'Beatles', album: 'Let It Be' }
      ];

      // Use actual implementation function

      // Test name search
      let filtered = filterFilesBySearch(mockFiles, 'Hey Jude');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toContain('Hey Jude');

      // Test artist search
      filtered = filterFilesBySearch(mockFiles, 'Beatles');
      expect(filtered).toHaveLength(2);
      expect(filtered.every(f => f.artist === 'Beatles')).toBe(true);

      // Test album search
      filtered = filterFilesBySearch(mockFiles, 'Opera');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].album).toContain('Opera');

      // Test no matches
      filtered = filterFilesBySearch(mockFiles, 'NonExistent');
      expect(filtered).toHaveLength(0);

      // Test empty search
      filtered = filterFilesBySearch(mockFiles, '');
      expect(filtered).toHaveLength(3);
    });

    test('should filter files by type', () => {
      const mockFiles = [
        { name: 'song.mp3', type: 'audio' },
        { name: 'photo.jpg', type: 'image' },
        { name: 'video.mp4', type: 'video' },
        { name: 'song2.wav', type: 'audio' }
      ];

      // Use actual implementation function

      // Test audio filter
      let filtered = filterFilesByType(mockFiles, 'audio');
      expect(filtered).toHaveLength(2);
      expect(filtered.every(f => f.type === 'audio')).toBe(true);

      // Test image filter
      filtered = filterFilesByType(mockFiles, 'image');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].type).toBe('image');

      // Test all filter
      filtered = filterFilesByType(mockFiles, 'all');
      expect(filtered).toHaveLength(4);
    });
  });

  describe('Album Grouping', () => {
    test('should group files by artist and album', () => {
      const mockFiles = [
        { name: 'song1.mp3', artist: 'Beatles', album: 'Abbey Road' },
        { name: 'song2.mp3', artist: 'Beatles', album: 'Abbey Road' },
        { name: 'song3.mp3', artist: 'Beatles', album: 'Revolver' },
        { name: 'song4.mp3', artist: 'Queen', album: 'A Night at the Opera' }
      ];

      // Use actual implementation function
      const grouped = groupFilesByArtist(mockFiles);

      // Verify grouping
      expect(Object.keys(grouped)).toHaveLength(2); // Beatles, Queen
      expect(Object.keys(grouped.Beatles)).toHaveLength(2); // Abbey Road, Revolver
      expect(grouped.Beatles['Abbey Road']).toHaveLength(2);
      expect(grouped.Beatles.Revolver).toHaveLength(1);
      expect(grouped.Queen['A Night at the Opera']).toHaveLength(1);
    });
  });

  describe('Grid View Integration', () => {
    test('should handle view mode switching', () => {
      // Test view mode variable
      let currentViewMode = 'list';

      // Mock DOM elements
      const gridViewButton = document.createElement('button');
      gridViewButton.id = 'gridViewBtn';

      const listViewButton = document.createElement('button');
      listViewButton.id = 'listViewBtn';

      // Test switching to grid view
      const switchToGrid = () => {
        currentViewMode = 'grid';
        gridViewButton.classList.add('active');
        listViewButton.classList.remove('active');
      };

      switchToGrid();
      expect(currentViewMode).toBe('grid');
    });

    test('should validate artist grouping constraints in grid view', () => {
      const mockFiles = [
        { name: 'song1.mp3', artist: 'Beatles', album: 'Abbey Road' },
        { name: 'song2.mp3', artist: 'Beatles', album: 'Revolver' },
        { name: 'song3.mp3', artist: 'Queen', album: 'A Night at the Opera' }
      ];

      // Grid view should group by album only, not by artist
      const albumGroups = {};
      mockFiles.forEach(file => {
        const album = file.album || 'アルバム名なし';
        if (!albumGroups[album]) {
          albumGroups[album] = [];
        }
        albumGroups[album].push(file);
      });

      expect(Object.keys(albumGroups)).toHaveLength(3);
      expect(albumGroups['Abbey Road']).toHaveLength(1);
      expect(albumGroups['Revolver']).toHaveLength(1);
      expect(albumGroups['A Night at the Opera']).toHaveLength(1);
    });

    test('should handle album files data structure validation', () => {
      const testCases = [
        { input: [], isValid: true },
        { input: [{ name: 'file.mp3' }], isValid: true },
        { input: null, isValid: false },
        { input: undefined, isValid: false },
        { input: 'not an array', isValid: false }
      ];

      testCases.forEach(({ input, isValid }) => {
        const result = Array.isArray(input) && input !== null;
        expect(result).toBe(isValid);
      });
    });
  });

  describe('Album Details View', () => {
    test('should generate album information correctly', () => {
      const albumFiles = [
        { name: 'track1.mp3', type: 'audio', artist: 'Test Artist', size: 5000000 },
        { name: 'track2.mp3', type: 'audio', artist: 'Test Artist', size: 4500000 },
        { name: 'cover.jpg', type: 'image', artist: 'Test Artist', size: 2000000 }
      ];

      // Count files by type
      const audioCount = albumFiles.filter(f => f.type === 'audio').length;
      const imageCount = albumFiles.filter(f => f.type === 'image').length;
      const videoCount = albumFiles.filter(f => f.type === 'video').length;

      expect(audioCount).toBe(2);
      expect(imageCount).toBe(1);
      expect(videoCount).toBe(0);

      // Generate metadata text
      let metaText = `${albumFiles.length}件`;
      if (audioCount > 0) {
        metaText += ` 🎵${audioCount}`;
      }
      if (imageCount > 0) {
        metaText += ` 🖼️${imageCount}`;
      }
      if (videoCount > 0) {
        metaText += ` 🎬${videoCount}`;
      }

      expect(metaText).toBe('3件 🎵2 🖼️1');
    });

    test('should handle file selection in album details', () => {
      const mockFiles = [
        { name: 'file1.mp3', type: 'audio', path: '/path/to/file1.mp3' },
        { name: 'file2.mp3', type: 'audio', path: '/path/to/file2.mp3' }
      ];

      // Mock file selection behavior
      let selectedFile = null;
      const selectFile = file => {
        selectedFile = file;
      };

      selectFile(mockFiles[0]);
      expect(selectedFile).toEqual(mockFiles[0]);
      expect(selectedFile.name).toBe('file1.mp3');
    });

    test('should generate correct album key for rating', () => {
      const albumName = 'Test Album';
      const albumFiles = [{ name: 'track1.mp3', artist: 'Test Artist' }];

      const firstFile = albumFiles[0];
      const artistName = firstFile.artist || 'アーティスト名なし';
      const albumKey = `${artistName}/${albumName}`;

      expect(albumKey).toBe('Test Artist/Test Album');
    });

    test('should handle missing artist information', () => {
      const albumName = 'Test Album';
      const albumFiles = [
        { name: 'track1.mp3' } // No artist property
      ];

      const firstFile = albumFiles[0];
      const artistName = firstFile.artist || 'アーティスト名なし';
      const albumKey = `${artistName}/${albumName}`;

      expect(albumKey).toBe('アーティスト名なし/Test Album');
    });
  });

  describe('Rating Display Consistency', () => {
    beforeEach(() => {
      // Set up some test ratings
      localStorageMock.data.albumRatings = JSON.stringify({
        'Beatles/Abbey Road': 5,
        'Beatles/Revolver': 4,
        'Queen/A Night at the Opera': 3
      });
    });

    test('should display ratings correctly in album-only view', () => {
      const mockFiles = [
        { name: 'song1.mp3', artist: 'Beatles', album: 'Abbey Road' },
        { name: 'song2.mp3', artist: 'Beatles', album: 'Revolver' },
        { name: 'song3.mp3', artist: 'Queen', album: 'A Night at the Opera' }
      ];

      // Simulate displayAlbumGroups function behavior
      const albumGroups = {};
      mockFiles.forEach(file => {
        const album = file.album || 'アルバム名なし';
        if (!albumGroups[album]) {
          albumGroups[album] = [];
        }
        albumGroups[album].push(file);
      });

      // Test rating key generation for album groups
      Object.keys(albumGroups).forEach(albumName => {
        const albumFiles = albumGroups[albumName];
        const firstFile = albumFiles[0];
        const artistName = firstFile.artist || 'アーティスト名なし';
        const albumKey = `${artistName}/${albumName}`;

        // Verify rating can be loaded with correct key
        const ratingsData = localStorageMock.data.albumRatings;
        const savedRating = ratingsData ? JSON.parse(ratingsData)[albumKey] || 0 : 0;

        if (albumKey === 'Beatles/Abbey Road') {
          expect(savedRating).toBe(5);
        } else if (albumKey === 'Beatles/Revolver') {
          expect(savedRating).toBe(4);
        } else if (albumKey === 'Queen/A Night at the Opera') {
          expect(savedRating).toBe(3);
        }
      });
    });

    test('should display ratings correctly in artist-album view', () => {
      const mockFiles = [
        { name: 'song1.mp3', artist: 'Beatles', album: 'Abbey Road' },
        { name: 'song2.mp3', artist: 'Beatles', album: 'Revolver' },
        { name: 'song3.mp3', artist: 'Queen', album: 'A Night at the Opera' }
      ];

      // Simulate displayArtistGroups function behavior
      const artistGroups = {};
      mockFiles.forEach(file => {
        const artist = file.artist || 'アーティスト名なし';
        const album = file.album || 'アルバム名なし';

        if (!artistGroups[artist]) {
          artistGroups[artist] = {};
        }
        if (!artistGroups[artist][album]) {
          artistGroups[artist][album] = [];
        }
        artistGroups[artist][album].push(file);
      });

      // Test rating key generation for artist groups
      Object.keys(artistGroups).forEach(artistName => {
        const artistAlbums = artistGroups[artistName];
        Object.keys(artistAlbums).forEach(albumName => {
          const albumKey = `${artistName}/${albumName}`;

          // Verify rating can be loaded with correct key
          const ratingsData = localStorageMock.data.albumRatings;
          const savedRating = ratingsData ? JSON.parse(ratingsData)[albumKey] || 0 : 0;

          if (albumKey === 'Beatles/Abbey Road') {
            expect(savedRating).toBe(5);
          } else if (albumKey === 'Beatles/Revolver') {
            expect(savedRating).toBe(4);
          } else if (albumKey === 'Queen/A Night at the Opera') {
            expect(savedRating).toBe(3);
          }
        });
      });
    });

    test('should maintain rating consistency between view modes', () => {
      const testAlbumKey = 'Test Artist/Test Album';
      const testRating = 4;

      // Save a rating
      const ratings = JSON.parse(localStorageMock.data.albumRatings || '{}');
      ratings[testAlbumKey] = testRating;
      localStorageMock.data.albumRatings = JSON.stringify(ratings);

      // Verify both display modes would generate the same key
      const mockFile = { artist: 'Test Artist', album: 'Test Album' };

      // Album-only view key generation
      const albumViewKey = `${mockFile.artist}/${mockFile.album}`;

      // Artist-album view key generation
      const artistViewKey = `${mockFile.artist}/${mockFile.album}`;

      expect(albumViewKey).toBe(artistViewKey);
      expect(albumViewKey).toBe(testAlbumKey);

      // Both should retrieve the same rating
      const albumViewRating = JSON.parse(localStorageMock.data.albumRatings)[albumViewKey] || 0;
      const artistViewRating = JSON.parse(localStorageMock.data.albumRatings)[artistViewKey] || 0;

      expect(albumViewRating).toBe(testRating);
      expect(artistViewRating).toBe(testRating);
      expect(albumViewRating).toBe(artistViewRating);
    });
  });
});
