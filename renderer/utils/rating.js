// Rating management utility functions
/* global localStorage */

/**
 * Save album rating to localStorage
 * @param {string} albumKey - Album key in format "Artist/Album"
 * @param {number} rating - Rating value (1-5)
 */
function saveRating(albumKey, rating) {
  try {
    const ratings = loadAllRatings();
    ratings[albumKey] = rating;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('albumRatings', JSON.stringify(ratings));
    }
    console.log(`Saved rating for ${albumKey}: ${rating} stars`);
  } catch (error) {
    console.error('Error saving rating:', error);
  }
}

/**
 * Load rating for specific album
 * @param {string} albumKey - Album key in format "Artist/Album"
 * @returns {number} Rating value (0 if not found)
 */
function loadRating(albumKey) {
  try {
    const ratings = loadAllRatings();
    return ratings[albumKey] || 0;
  } catch (error) {
    console.error('Error loading rating:', error);
    return 0;
  }
}

/**
 * Load all album ratings from localStorage
 * @returns {Object} Object with album keys and ratings
 */
function loadAllRatings() {
  try {
    if (typeof localStorage === 'undefined') {
      return {};
    }
    const ratingsJson = localStorage.getItem('albumRatings');
    return ratingsJson ? JSON.parse(ratingsJson) : {};
  } catch (error) {
    console.error('Error loading all ratings:', error);
    return {};
  }
}

/**
 * Get album rating by artist and album names
 * @param {string} artistName - Artist name
 * @param {string} albumName - Album name
 * @returns {number} Rating value (0 if not found)
 */
function getAlbumRating(artistName, albumName) {
  const albumKey = `${artistName}/${albumName}`;
  return loadRating(albumKey);
}

// Export for Node.js/Jest
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    saveRating,
    loadRating,
    loadAllRatings,
    getAlbumRating
  };
}
