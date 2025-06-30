const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

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

// IPC handlers
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
    console.error('Error accessing file:', error);
    return null;
  }
});

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
    console.error('Error reading folder:', error);
    return null;
  }
}

function parseDirectoryHierarchy(relativePath) {
  if (!relativePath) {
    return { artist: null, album: null };
  }
  
  const pathParts = relativePath.split(path.sep);
  
  return {
    artist: pathParts.length >= 1 ? pathParts[0] : null,
    album: pathParts.length >= 2 ? pathParts[1] : null
  };
}

function getFileType(ext) {
  const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  const videoExts = ['.mp4', '.avi', '.mov', '.wmv'];
  const audioExts = ['.mp3', '.wav', '.flac', '.m4a'];
  
  if (imageExts.includes(ext)) return 'image';
  if (videoExts.includes(ext)) return 'video';
  if (audioExts.includes(ext)) return 'audio';
  return 'unknown';
}