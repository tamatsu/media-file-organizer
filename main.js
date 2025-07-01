// Only require electron in non-test environments
let app, BrowserWindow, dialog, ipcMain;
if (process.env.NODE_ENV !== 'test') {
  ({ app, BrowserWindow, dialog, ipcMain } = require('electron'));
}
const path = require('path');
const fs = require('fs');

// Global error handlers for main process
process.on('uncaughtException', (error) => {
  console.error('=== UNCAUGHT EXCEPTION (MAIN) ===');
  console.error('Error message:', error.message);
  console.error('Error stack:', error.stack);
  console.error('Error type:', error.constructor.name);
  console.error('================================');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('=== UNHANDLED REJECTION (MAIN) ===');
  console.error('Reason:', reason);
  console.error('Promise:', promise);
  console.error('Stack:', reason?.stack);
  console.error('=================================');
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  mainWindow.loadFile('index.html');

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

// Only set up Electron app in non-test environments
if (process.env.NODE_ENV !== 'test') {
  app.whenReady().then(createWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}

// IPC handlers - only set up in non-test environments
if (process.env.NODE_ENV !== 'test') {
  ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
      const folderPath = result.filePaths[0];
      return await getMediaFiles(folderPath);
    }
    
    return null;
  });

  ipcMain.handle('get-file-url', async (event, filePath) => {
    try {
      // Check if file exists
      await fs.promises.access(filePath);
      
      // Return file:// URL directly - no size limitations
      return `file://${filePath.replace(/\\/g, '/')}`;
    } catch (error) {
      console.error('=== FILE ACCESS ERROR ===');
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('File path:', filePath);
      console.error('Error type:', error.constructor.name);
      console.error('========================');
      return null;
    }
  });
}

async function getMediaFiles(folderPath) {
  const mediaExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.mp4', '.avi', '.mov', '.wmv', '.mp3', '.wav', '.flac', '.m4a'];
  
  async function scanDirectory(currentPath, relativePath = '') {
    const mediaFiles = [];
    
    try {
      const files = await fs.promises.readdir(currentPath);
      
      for (const file of files) {
        const filePath = path.join(currentPath, file);
        const stat = await fs.promises.stat(filePath);
        
        if (stat.isDirectory()) {
          // Recursively scan subdirectories
          const subPath = relativePath ? path.join(relativePath, file) : file;
          const subFiles = await scanDirectory(filePath, subPath);
          mediaFiles.push(...subFiles);
        } else if (stat.isFile()) {
          const ext = path.extname(file).toLowerCase();
          if (mediaExtensions.includes(ext)) {
            // Extract artist/album from directory hierarchy
            let hierarchy = parseDirectoryHierarchy(relativePath);
            
            mediaFiles.push({
              name: file,
              path: filePath,
              relativePath: relativePath,
              size: stat.size,
              type: getFileType(ext),
              modified: stat.mtime,
              album: hierarchy.album,
              artist: hierarchy.artist,
              title: null
            });
          }
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${currentPath}:`, error);
    }
    
    return mediaFiles;
  }
  
  try {
    const mediaFiles = await scanDirectory(folderPath);
    
    return {
      folder: folderPath,
      files: mediaFiles
    };
  } catch (error) {
    console.error('=== FOLDER READING ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Folder path:', folderPath);
    console.error('Error type:', error.constructor.name);
    console.error('============================');
    return null;
  }
}

function parseDirectoryHierarchy(relativePath) {
  if (!relativePath) {
    return { artist: null, album: null };
  }
  
  // Handle both forward slashes and backslashes
  const pathParts = relativePath.split(/[\/\\]/);
  
  return {
    artist: pathParts.length >= 1 ? pathParts[0] : null,
    album: pathParts.length >= 2 ? pathParts[1] : null
  };
}

function getFileType(ext) {
  const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  const videoExts = ['.mp4', '.avi', '.mov', '.wmv'];
  const audioExts = ['.mp3', '.wav', '.flac', '.m4a'];
  
  // Convert to lowercase for case-insensitive comparison
  const lowerExt = ext.toLowerCase();
  
  if (imageExts.includes(lowerExt)) return 'image';
  if (videoExts.includes(lowerExt)) return 'video';
  if (audioExts.includes(lowerExt)) return 'audio';
  return 'unknown';
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    parseDirectoryHierarchy,
    getFileType
  };
}