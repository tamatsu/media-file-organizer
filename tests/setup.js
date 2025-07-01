// Jest setup file for Electron testing

// Mock Electron modules for testing
jest.mock('electron', () => ({
  app: {
    whenReady: jest.fn(() => Promise.resolve()),
    on: jest.fn(),
    quit: jest.fn()
  },
  BrowserWindow: jest.fn(() => ({
    loadFile: jest.fn(),
    webContents: {
      openDevTools: jest.fn()
    },
    on: jest.fn()
  })),
  dialog: {
    showOpenDialog: jest.fn()
  },
  ipcMain: {
    handle: jest.fn()
  },
  ipcRenderer: {
    invoke: jest.fn()
  }
}));

// Mock fs promises for file system operations
const mockFs = {
  promises: {
    readdir: jest.fn(),
    stat: jest.fn(),
    access: jest.fn()
  }
};

jest.mock('fs', () => mockFs);

// Global test utilities
global.mockFs = mockFs;