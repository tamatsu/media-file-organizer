// Search and filter utility functions

/**
 * Filter files by search term
 * @param {Array} files - Array of file objects
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered files
 */
function filterFilesBySearch(files, searchTerm) {
  if (!files || !Array.isArray(files) || !searchTerm) {
    return files || [];
  }

  const term = searchTerm.toLowerCase();
  return files.filter(file => {
    if (!file) {
      return false;
    }

    const matchesName = file.name && file.name.toLowerCase().includes(term);
    const matchesArtist = file.artist && file.artist.toLowerCase().includes(term);
    const matchesAlbum = file.album && file.album.toLowerCase().includes(term);
    return matchesName || matchesArtist || matchesAlbum;
  });
}

/**
 * Filter files by type
 * @param {Array} files - Array of file objects
 * @param {string} type - File type filter ('all', 'image', 'video', 'audio')
 * @returns {Array} Filtered files
 */
function filterFilesByType(files, type) {
  if (!files || !Array.isArray(files)) {
    return [];
  }
  if (type === 'all') {
    return files;
  }
  return files.filter(file => file && file.type === type);
}

/**
 * Group files by artist and album
 * @param {Array} files - Array of file objects
 * @returns {Object} Grouped files by artist and album
 */
function groupFilesByArtist(files) {
  if (!files || !Array.isArray(files)) {
    return {};
  }

  const artistGroups = {};

  files.forEach(file => {
    if (!file) {
      return;
    }

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

  return artistGroups;
}

/**
 * Group files by album only
 * @param {Array} files - Array of file objects
 * @returns {Object} Grouped files by album
 */
function groupFilesByAlbum(files) {
  if (!files || !Array.isArray(files)) {
    return {};
  }

  const albumGroups = {};

  files.forEach(file => {
    if (!file) {
      return;
    }

    const album = file.album || 'アルバム名なし';
    if (!albumGroups[album]) {
      albumGroups[album] = [];
    }
    albumGroups[album].push(file);
  });

  return albumGroups;
}

// Export for Node.js/Jest
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    filterFilesBySearch,
    filterFilesByType,
    groupFilesByArtist,
    groupFilesByAlbum
  };
}
