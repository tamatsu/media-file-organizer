const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
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
    const fileBuffer = await fs.promises.readFile(filePath);
    const base64Data = fileBuffer.toString('base64');
    const ext = path.extname(filePath).toLowerCase();
    
    let mimeType = 'application/octet-stream';
    
    // Image types
    if (['.jpg', '.jpeg'].includes(ext)) mimeType = 'image/jpeg';
    else if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.gif') mimeType = 'image/gif';
    else if (ext === '.webp') mimeType = 'image/webp';
    else if (ext === '.bmp') mimeType = 'image/bmp';
    else if (ext === '.svg') mimeType = 'image/svg+xml';
    
    // Video types
    else if (ext === '.mp4') mimeType = 'video/mp4';
    else if (ext === '.avi') mimeType = 'video/x-msvideo';
    else if (ext === '.mov') mimeType = 'video/quicktime';
    else if (ext === '.wmv') mimeType = 'video/x-ms-wmv';
    else if (ext === '.webm') mimeType = 'video/webm';
    
    // Audio types
    else if (ext === '.mp3') mimeType = 'audio/mpeg';
    else if (ext === '.wav') mimeType = 'audio/wav';
    else if (ext === '.flac') mimeType = 'audio/flac';
    else if (ext === '.m4a') mimeType = 'audio/mp4';
    else if (ext === '.ogg') mimeType = 'audio/ogg';
    
    return `data:${mimeType};base64,${base64Data}`;
  } catch (error) {
    console.error('Error reading file:', error);
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
            mediaFiles.push({
              name: file,
              path: filePath,
              relativePath: relativePath,
              size: stat.size,
              type: getFileType(ext),
              modified: stat.mtime
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

function getFileType(ext) {
  const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  const videoExts = ['.mp4', '.avi', '.mov', '.wmv'];
  const audioExts = ['.mp3', '.wav', '.flac', '.m4a'];
  
  if (imageExts.includes(ext)) return 'image';
  if (videoExts.includes(ext)) return 'video';
  if (audioExts.includes(ext)) return 'audio';
  return 'unknown';
}