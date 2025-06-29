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

async function getMediaFiles(folderPath) {
  const mediaExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.mp4', '.avi', '.mov', '.wmv', '.mp3', '.wav', '.flac', '.m4a'];
  
  try {
    const files = await fs.promises.readdir(folderPath);
    const mediaFiles = [];
    
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stat = await fs.promises.stat(filePath);
      
      if (stat.isFile()) {
        const ext = path.extname(file).toLowerCase();
        if (mediaExtensions.includes(ext)) {
          mediaFiles.push({
            name: file,
            path: filePath,
            size: stat.size,
            type: getFileType(ext),
            modified: stat.mtime
          });
        }
      }
    }
    
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