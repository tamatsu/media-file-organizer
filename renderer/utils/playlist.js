// Playlist management utility functions for album continuous playback

/**
 * Extract audio files from album files
 * @param {Array} albumFiles - Array of file objects
 * @returns {Array} Array of audio files only
 */
function extractAudioFiles(albumFiles) {
  if (!albumFiles || !Array.isArray(albumFiles)) {
    return [];
  }

  return albumFiles.filter(file => file.type === 'audio');
}

/**
 * Create a simple playlist manager
 * @param {Array} audioFiles - Array of audio file objects
 * @returns {Object} Playlist manager object
 */
function createPlaylist(audioFiles) {
  const files = audioFiles || [];
  let currentIndex = 0;

  return {
    // Get current file
    getCurrentFile() {
      return files[currentIndex] || null;
    },

    // Get current index
    getCurrentIndex() {
      return currentIndex;
    },

    // Get total number of files
    getLength() {
      return files.length;
    },

    // Get all files
    getAllFiles() {
      return [...files];
    },

    // Move to next file
    next() {
      if (files.length === 0) {
        return null;
      }
      currentIndex = (currentIndex + 1) % files.length;
      return files[currentIndex];
    },

    // Move to previous file
    previous() {
      if (files.length === 0) {
        return null;
      }
      currentIndex = currentIndex === 0 ? files.length - 1 : currentIndex - 1;
      return files[currentIndex];
    },

    // Set current index
    setIndex(index) {
      if (index >= 0 && index < files.length) {
        currentIndex = index;
        return files[currentIndex];
      }
      return null;
    },

    // Find index of file by path
    findIndexByPath(filePath) {
      return files.findIndex(file => file.path === filePath);
    },

    // Set current file by path
    setCurrentByPath(filePath) {
      const index = this.findIndexByPath(filePath);
      if (index !== -1) {
        currentIndex = index;
        return files[currentIndex];
      }
      return null;
    },

    // Check if has next file
    hasNext() {
      return files.length > 0;
    },

    // Check if has previous file
    hasPrevious() {
      return files.length > 0;
    },

    // Reset to first file
    reset() {
      currentIndex = 0;
      return files[currentIndex] || null;
    }
  };
}

/**
 * Create playlist manager from album files (convenience function)
 * @param {Array} albumFiles - Array of all album files
 * @returns {Object} Playlist manager for audio files only
 */
function createAlbumPlaylist(albumFiles) {
  const audioFiles = extractAudioFiles(albumFiles);
  return createPlaylist(audioFiles);
}

// Export for Node.js/Jest
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    extractAudioFiles,
    createPlaylist,
    createAlbumPlaylist
  };
}
