import { bootstrap } from 'global-agent';
bootstrap();

// Entry point for the Electron main process.
// This file creates a single window and exposes IPC handlers used by the
// renderer process.

import { app, BrowserWindow, ipcMain, protocol } from 'electron';
import { registerFileHandlers } from './ipcFiles';
import { registerFileWatcherHandlers } from './ipc/fileWatcher';
import path from 'path';
import { registerExportHandlers } from './exporter';
import { registerProjectHandlers, openProject } from './projects';
import { registerNoExportHandlers } from './noExport';
import {
  registerAssetHandlers,
  registerVanillaProtocol,
  registerAssetProtocol,
  setActiveProject,
} from './assets';
import { registerIconHandlers } from './icon';
import { registerTextureLabHandlers } from './textureLab';
import {
  registerLayoutHandlers,
  getOpenLastProject,
  getLastProject,
  setLastProject,
} from './layout';
import { registerExternalEditorHandlers } from './externalEditor';
import {
  getWindowBounds,
  setWindowBounds,
  isMaximized,
  setMaximized,
} from './windowBounds';

protocol.registerSchemesAsPrivileged([
  { scheme: 'vanilla', privileges: { standard: true, secure: true } },
  { scheme: 'asset', privileges: { standard: true, secure: true } },
]);

// Webpack's DefinePlugin in Electron Forge exposes entry point URLs as
// `NAME_WEBPACK_ENTRY` and preload scripts as
// `NAME_PRELOAD_WEBPACK_ENTRY` where `NAME` is the entry point name in
// `forge.config.ts` converted to upper case.
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let mainWindow: BrowserWindow | null = null;

// Directory that stores the local projects on disk.	Under Electron's
// userData path to keep everything self contained.
const projectsDir = path.join(app.getPath('userData'), 'projects');

// Create the main application window for a specific project.
// Once the window loads we emit the selected project path so the renderer can
// display its contents.
const createMainWindow = () => {
  const savedBounds = getWindowBounds();
  const maximized = isMaximized();
  const options: Electron.BrowserWindowConstructorOptions = {
    width: savedBounds?.width ?? 1200,
    height: savedBounds?.height ?? 900,
    icon: path.resolve(__dirname, '../..', 'resources', 'icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  };
  if (savedBounds?.x !== undefined && savedBounds?.y !== undefined) {
    options.x = savedBounds.x;
    options.y = savedBounds.y;
  }
  mainWindow = new BrowserWindow(options);
  if (maximized) {
    mainWindow.maximize();
  }
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  registerFileWatcherHandlers(ipcMain, mainWindow);
  mainWindow.on('close', () => {
    setWindowBounds(mainWindow!.getBounds());
    setMaximized(mainWindow!.isMaximized());
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

registerProjectHandlers(ipcMain, projectsDir, (p) => {
  mainWindow?.webContents.send('project-opened', p);
});

registerAssetHandlers(ipcMain);
registerExportHandlers(ipcMain, projectsDir);
registerNoExportHandlers(ipcMain);
registerLayoutHandlers(ipcMain);
registerTextureLabHandlers(ipcMain);
registerIconHandlers(ipcMain);
registerExternalEditorHandlers(ipcMain);

// Register file-related IPC handlers
registerFileHandlers(ipcMain);

// Once Electron is ready register protocols and show the main window.
app.whenReady().then(() => {
  registerVanillaProtocol(protocol);
  registerAssetProtocol(protocol);
  createMainWindow();
  const shouldOpen = getOpenLastProject();
  const last = getLastProject();
  if (shouldOpen && last) {
    mainWindow?.webContents.once('did-finish-load', async () => {
      const projectPath = await openProject(projectsDir, last);
      setLastProject(last);
      await setActiveProject(projectPath);
      mainWindow?.webContents.send('project-opened', projectPath);
    });
  }
});

// Standard OS X behaviour: quit the app when all windows are closed on Windows
// and Linux, but keep it alive on macOS so the user can re-open it from the
// dock.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// macOS re-creates the window when the dock icon is clicked and there are no
// other windows open.
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
