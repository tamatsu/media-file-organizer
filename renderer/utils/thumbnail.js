// Thumbnail utility functions

/**
 * Get the first image file from an album for thumbnail display
 * @param {Array} albumFiles - Array of file objects in the album
 * @returns {Object|null} First image file object or null if no images found
 */
function getAlbumThumbnail(albumFiles) {
  if (!albumFiles || !Array.isArray(albumFiles)) {
    return null;
  }

  // Find the first image file in the album
  const imageFile = albumFiles.find(file => file.type === 'image');
  return imageFile || null;
}

/**
 * Create a thumbnail image element for an album
 * @param {string} imagePath - Path to the image file
 * @param {string} albumName - Name of the album for alt text
 * @returns {HTMLElement} Thumbnail container element
 */
function createThumbnailElement(imagePath, albumName) {
  const container = document.createElement('div');
  container.className = 'album-thumbnail-container';

  const img = document.createElement('img');
  img.className = 'album-thumbnail';
  img.src = `file://${imagePath}`;
  img.alt = `${albumName} thumbnail`;

  // Add error handling
  img.addEventListener('error', () => {
    handleThumbnailError(container);
  });

  // Add loading placeholder
  img.addEventListener('load', () => {
    container.classList.remove('loading');
  });

  container.classList.add('loading');
  container.appendChild(img);

  return container;
}

/**
 * Create a placeholder element when no thumbnail is available
 * @param {string} albumName - Name of the album
 * @returns {HTMLElement} Placeholder container element
 */
function createThumbnailPlaceholder(albumName) {
  const container = document.createElement('div');
  container.className = 'album-thumbnail-container placeholder';

  const placeholder = document.createElement('div');
  placeholder.className = 'album-thumbnail-placeholder';
  placeholder.textContent = '📁';
  placeholder.title = `${albumName} - No thumbnail available`;

  container.appendChild(placeholder);
  return container;
}

/**
 * Handle thumbnail loading errors
 * @param {HTMLElement} container - Thumbnail container element
 */
function handleThumbnailError(container) {
  // Remove the failed image
  const img = container.querySelector('img');
  if (img) {
    img.remove();
  }

  // Add error placeholder
  const errorPlaceholder = document.createElement('div');
  errorPlaceholder.className = 'album-thumbnail-error';
  errorPlaceholder.textContent = '❌';
  errorPlaceholder.title = 'Failed to load thumbnail';

  container.classList.add('error');
  container.classList.remove('loading');
  container.appendChild(errorPlaceholder);
}

/**
 * Get or create appropriate thumbnail element for an album
 * @param {Array} albumFiles - Array of file objects in the album
 * @param {string} albumName - Name of the album
 * @returns {HTMLElement} Thumbnail element (image or placeholder)
 */
function getAlbumThumbnailElement(albumFiles, albumName) {
  const thumbnailFile = getAlbumThumbnail(albumFiles);

  if (thumbnailFile && thumbnailFile.path) {
    return createThumbnailElement(thumbnailFile.path, albumName);
  } else {
    return createThumbnailPlaceholder(albumName);
  }
}

// Export for Node.js/Jest
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getAlbumThumbnail,
    createThumbnailElement,
    createThumbnailPlaceholder,
    handleThumbnailError,
    getAlbumThumbnailElement
  };
}
