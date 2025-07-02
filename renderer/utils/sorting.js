// Sorting and filtering utility functions

// Import rating functions
let ratingUtils;
if (typeof require !== 'undefined') {
  ratingUtils = require('./rating');
} else if (typeof window !== 'undefined' && window.ratingUtils) {
  ratingUtils = window.ratingUtils;
}

/**
 * Filter albums by rating
 * @param {Object} albumGroups - Album groups object
 * @param {string} ratingFilter - Rating filter value ('all', 'unrated', '1', '2', '3', '4', '5')
 * @returns {Object} Filtered album groups
 */
function filterAlbumsByRating(albumGroups, ratingFilter) {
  if (ratingFilter === 'all') {
    return albumGroups;
  }

  const filtered = {};
  const getAlbumRating = ratingUtils ? ratingUtils.getAlbumRating : window.getAlbumRating;

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

/**
 * Sort albums based on specified criteria
 * @param {Object} albumGroups - Album groups object
 * @param {string} sortOption - Sort option
 * @returns {Object} Sorted album groups
 */
function sortAlbums(albumGroups, sortOption) {
  const sorted = {};
  const getAlbumRating = ratingUtils ? ratingUtils.getAlbumRating : window.getAlbumRating;

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
          if (ratingB !== ratingA) {
            return ratingB - ratingA;
          }
          return albumNameA.localeCompare(albumNameB);
        case 'rating-asc':
          if (ratingA !== ratingB) {
            return ratingA - ratingB;
          }
          return albumNameA.localeCompare(albumNameB);
        case 'filecount-desc':
          if (filesB.length !== filesA.length) {
            return filesB.length - filesA.length;
          }
          return albumNameA.localeCompare(albumNameB);
        case 'filecount-asc':
          if (filesA.length !== filesB.length) {
            return filesA.length - filesB.length;
          }
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

// Export for Node.js/Jest
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    filterAlbumsByRating,
    sortAlbums
  };
}