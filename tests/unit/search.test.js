const {
  filterFilesBySearch,
  filterFilesByType,
  groupFilesByArtist,
  groupFilesByAlbum
} = require('../../renderer/utils/search.js');

describe('Search and Filter Utility Functions', () => {
  // Sample test data
  const sampleFiles = [
    {
      name: 'Come Together.mp3',
      artist: 'Beatles',
      album: 'Abbey Road',
      type: 'audio',
      path: '/music/Beatles/Abbey Road/Come Together.mp3'
    },
    {
      name: 'Something.mp3',
      artist: 'Beatles',
      album: 'Abbey Road',
      type: 'audio',
      path: '/music/Beatles/Abbey Road/Something.mp3'
    },
    {
      name: 'Lucy in the Sky.mp3',
      artist: 'Beatles',
      album: 'Sgt Pepper',
      type: 'audio',
      path: '/music/Beatles/Sgt Pepper/Lucy in the Sky.mp3'
    },
    {
      name: 'Stairway to Heaven.mp3',
      artist: 'Led Zeppelin',
      album: 'IV',
      type: 'audio',
      path: '/music/Led Zeppelin/IV/Stairway to Heaven.mp3'
    },
    {
      name: 'album_cover.jpg',
      artist: 'Beatles',
      album: 'Abbey Road',
      type: 'image',
      path: '/music/Beatles/Abbey Road/album_cover.jpg'
    },
    {
      name: 'concert_video.mp4',
      artist: 'Led Zeppelin',
      album: 'IV',
      type: 'video',
      path: '/music/Led Zeppelin/IV/concert_video.mp4'
    },
    {
      name: 'untitled.mp3',
      artist: null,
      album: null,
      type: 'audio',
      path: '/music/misc/untitled.mp3'
    },
    {
      name: 'photo.png',
      artist: undefined,
      album: undefined,
      type: 'image',
      path: '/music/misc/photo.png'
    }
  ];

  describe('filterFilesBySearch', () => {
    test('should return all files when search term is empty', () => {
      const result = filterFilesBySearch(sampleFiles, '');
      expect(result).toEqual(sampleFiles);
    });

    test('should return all files when search term is null', () => {
      const result = filterFilesBySearch(sampleFiles, null);
      expect(result).toEqual(sampleFiles);
    });

    test('should return all files when search term is undefined', () => {
      const result = filterFilesBySearch(sampleFiles, undefined);
      expect(result).toEqual(sampleFiles);
    });

    test('should filter files by name', () => {
      const result = filterFilesBySearch(sampleFiles, 'come together');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Come Together.mp3');
    });

    test('should filter files by artist name', () => {
      const result = filterFilesBySearch(sampleFiles, 'beatles');
      expect(result).toHaveLength(4); // 3 Beatles songs + 1 image
      result.forEach(file => {
        expect(file.artist).toBe('Beatles');
      });
    });

    test('should filter files by album name', () => {
      const result = filterFilesBySearch(sampleFiles, 'abbey road');
      expect(result).toHaveLength(3); // 2 songs + 1 image from Abbey Road
      result.forEach(file => {
        expect(file.album).toBe('Abbey Road');
      });
    });

    test('should be case insensitive', () => {
      const result1 = filterFilesBySearch(sampleFiles, 'BEATLES');
      const result2 = filterFilesBySearch(sampleFiles, 'beatles');
      const result3 = filterFilesBySearch(sampleFiles, 'BeAtLeS');

      expect(result1).toEqual(result2);
      expect(result1).toEqual(result3);
      expect(result1).toHaveLength(4);
    });

    test('should handle partial matches', () => {
      const result = filterFilesBySearch(sampleFiles, 'stair');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Stairway to Heaven.mp3');
    });

    test('should return empty array when no matches found', () => {
      const result = filterFilesBySearch(sampleFiles, 'nonexistent');
      expect(result).toEqual([]);
    });

    test('should handle special characters', () => {
      const specialFiles = [
        {
          name: 'Song & Dance.mp3',
          artist: 'Artist & Co',
          album: 'Album #1',
          type: 'audio'
        }
      ];
      const result = filterFilesBySearch(specialFiles, '&');
      expect(result).toHaveLength(1);
    });

    test('should handle Unicode characters', () => {
      const unicodeFiles = [
        {
          name: 'さくら.mp3',
          artist: 'アーティスト',
          album: 'アルバム',
          type: 'audio'
        }
      ];
      const result = filterFilesBySearch(unicodeFiles, 'さくら');
      expect(result).toHaveLength(1);
    });

    test('should handle files with null/undefined artist or album', () => {
      const result = filterFilesBySearch(sampleFiles, 'untitled');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('untitled.mp3');
    });
  });

  describe('filterFilesByType', () => {
    test('should return all files when type is "all"', () => {
      const result = filterFilesByType(sampleFiles, 'all');
      expect(result).toEqual(sampleFiles);
    });

    test('should filter audio files', () => {
      const result = filterFilesByType(sampleFiles, 'audio');
      expect(result).toHaveLength(5);
      result.forEach(file => {
        expect(file.type).toBe('audio');
      });
    });

    test('should filter image files', () => {
      const result = filterFilesByType(sampleFiles, 'image');
      expect(result).toHaveLength(2);
      result.forEach(file => {
        expect(file.type).toBe('image');
      });
    });

    test('should filter video files', () => {
      const result = filterFilesByType(sampleFiles, 'video');
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('video');
    });

    test('should return empty array for non-existent type', () => {
      const result = filterFilesByType(sampleFiles, 'document');
      expect(result).toEqual([]);
    });

    test('should handle empty files array', () => {
      const result = filterFilesByType([], 'audio');
      expect(result).toEqual([]);
    });
  });

  describe('groupFilesByArtist', () => {
    test('should group files by artist and album', () => {
      const result = groupFilesByArtist(sampleFiles);

      expect(result['Beatles']).toBeDefined();
      expect(result['Beatles']['Abbey Road']).toHaveLength(3); // 2 songs + 1 image
      expect(result['Beatles']['Sgt Pepper']).toHaveLength(1);

      expect(result['Led Zeppelin']).toBeDefined();
      expect(result['Led Zeppelin']['IV']).toHaveLength(2); // 1 song + 1 video
    });

    test('should handle files with null/undefined artist', () => {
      const result = groupFilesByArtist(sampleFiles);

      expect(result['アーティスト名なし']).toBeDefined();
      expect(result['アーティスト名なし']['アルバム名なし']).toHaveLength(2);
    });

    test('should handle files with null/undefined album', () => {
      const filesWithNullAlbum = [
        {
          name: 'single.mp3',
          artist: 'Solo Artist',
          album: null,
          type: 'audio'
        }
      ];

      const result = groupFilesByArtist(filesWithNullAlbum);
      expect(result['Solo Artist']['アルバム名なし']).toHaveLength(1);
    });

    test('should handle empty files array', () => {
      const result = groupFilesByArtist([]);
      expect(result).toEqual({});
    });

    test('should preserve file objects in groups', () => {
      const result = groupFilesByArtist(sampleFiles);
      const beatlesAbbeyRoad = result['Beatles']['Abbey Road'];

      expect(beatlesAbbeyRoad[0]).toHaveProperty('name');
      expect(beatlesAbbeyRoad[0]).toHaveProperty('path');
      expect(beatlesAbbeyRoad[0]).toHaveProperty('type');
    });

    test('should handle duplicate artist/album combinations', () => {
      const duplicateFiles = [
        { name: 'track1.mp3', artist: 'Artist', album: 'Album', type: 'audio' },
        { name: 'track2.mp3', artist: 'Artist', album: 'Album', type: 'audio' },
        { name: 'track3.mp3', artist: 'Artist', album: 'Album', type: 'audio' }
      ];

      const result = groupFilesByArtist(duplicateFiles);
      expect(result['Artist']['Album']).toHaveLength(3);
    });
  });

  describe('groupFilesByAlbum', () => {
    test('should group files by album only', () => {
      const result = groupFilesByAlbum(sampleFiles);

      expect(result['Abbey Road']).toHaveLength(3); // 2 songs + 1 image
      expect(result['Sgt Pepper']).toHaveLength(1);
      expect(result['IV']).toHaveLength(2); // 1 song + 1 video
    });

    test('should handle files with null/undefined album', () => {
      const result = groupFilesByAlbum(sampleFiles);

      expect(result['アルバム名なし']).toBeDefined();
      expect(result['アルバム名なし']).toHaveLength(2);
    });

    test('should handle empty files array', () => {
      const result = groupFilesByAlbum([]);
      expect(result).toEqual({});
    });

    test('should preserve file objects in groups', () => {
      const result = groupFilesByAlbum(sampleFiles);
      const abbeyRoadFiles = result['Abbey Road'];

      expect(abbeyRoadFiles[0]).toHaveProperty('name');
      expect(abbeyRoadFiles[0]).toHaveProperty('artist');
      expect(abbeyRoadFiles[0]).toHaveProperty('type');
    });

    test('should handle albums with same name from different artists', () => {
      const sameAlbumFiles = [
        { name: 'track1.mp3', artist: 'Artist1', album: 'Greatest Hits', type: 'audio' },
        { name: 'track2.mp3', artist: 'Artist2', album: 'Greatest Hits', type: 'audio' }
      ];

      const result = groupFilesByAlbum(sameAlbumFiles);
      expect(result['Greatest Hits']).toHaveLength(2);
    });
  });

  describe('Integration scenarios', () => {
    test('should chain filtering operations', () => {
      // First filter by type, then by search term
      const audioFiles = filterFilesByType(sampleFiles, 'audio');
      const beatlesAudio = filterFilesBySearch(audioFiles, 'beatles');

      expect(beatlesAudio).toHaveLength(3);
      beatlesAudio.forEach(file => {
        expect(file.type).toBe('audio');
        expect(file.artist).toBe('Beatles');
      });
    });

    test('should filter then group files', () => {
      const audioFiles = filterFilesByType(sampleFiles, 'audio');
      const grouped = groupFilesByArtist(audioFiles);

      // Should not contain image or video files
      Object.values(grouped).forEach(artistAlbums => {
        Object.values(artistAlbums).forEach(albumFiles => {
          albumFiles.forEach(file => {
            expect(file.type).toBe('audio');
          });
        });
      });
    });

    test('should handle complex search and grouping workflow', () => {
      // Search for Beatles, filter audio, then group by album
      const searchResults = filterFilesBySearch(sampleFiles, 'beatles');
      const audioResults = filterFilesByType(searchResults, 'audio');
      const albumGroups = groupFilesByAlbum(audioResults);

      expect(albumGroups['Abbey Road']).toHaveLength(2);
      expect(albumGroups['Sgt Pepper']).toHaveLength(1);
      expect(albumGroups['IV']).toBeUndefined(); // Led Zeppelin album not in results
    });
  });

  describe('Edge cases and error handling', () => {
    test('should handle null/undefined files array', () => {
      expect(filterFilesBySearch(null, 'test')).toEqual([]);
      expect(filterFilesByType(undefined, 'audio')).toEqual([]);
      expect(groupFilesByArtist(null)).toEqual({});
      expect(groupFilesByAlbum(undefined)).toEqual({});
    });

    test('should handle files with missing properties', () => {
      const incompleteFiles = [
        { name: 'file1.mp3' }, // missing artist, album, type
        { artist: 'Artist' }, // missing name, album, type
        { album: 'Album' }, // missing name, artist, type
        {} // completely empty
      ];

      expect(() => filterFilesBySearch(incompleteFiles, 'test')).not.toThrow();
      expect(() => filterFilesByType(incompleteFiles, 'audio')).not.toThrow();
      expect(() => groupFilesByArtist(incompleteFiles)).not.toThrow();
      expect(() => groupFilesByAlbum(incompleteFiles)).not.toThrow();
    });

    test('should handle very long search terms', () => {
      const longTerm = 'a'.repeat(1000);
      const result = filterFilesBySearch(sampleFiles, longTerm);
      expect(result).toEqual([]);
    });

    test('should handle special regex characters in search', () => {
      const specialFiles = [
        { name: '[test].mp3', artist: 'Artist (1)', album: 'Album $1', type: 'audio' }
      ];

      const result1 = filterFilesBySearch(specialFiles, '[test]');
      const result2 = filterFilesBySearch(specialFiles, '(1)');
      const result3 = filterFilesBySearch(specialFiles, '$1');

      expect(result1).toHaveLength(1);
      expect(result2).toHaveLength(1);
      expect(result3).toHaveLength(1);
    });
  });
});
