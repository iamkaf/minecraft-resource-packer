import { bootstrap } from 'global-agent';
bootstrap();

// Entry point for the Electron main process.
// This file creates a single window and exposes IPC handlers used by the
// renderer process.

import { app, BrowserWindow, ipcMain, dialog, protocol } from 'electron';
import { registerFileHandlers } from './main/ipcFiles';
import path from 'path';
import fs from 'fs';
import { exportPack, ExportSummary } from './main/exporter';
import { createProject } from './main/projects';
import {
  addTexture,
  listTextures,
  listVersions,
  getTexturePath,
  getTextureURL,
  registerTextureProtocol,
  registerProjectTextureProtocol,
  setActiveProject,
} from './main/assets';
import { ProjectMetadataSchema } from './minecraft/project';

protocol.registerSchemesAsPrivileged([
  { scheme: 'texture', privileges: { standard: true, secure: true } },
  { scheme: 'ptex', privileges: { standard: true, secure: true } },
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
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// Return the names of sub directories within the projects folder.
ipcMain.handle('list-projects', async () => {
  if (!fs.existsSync(projectsDir))
    fs.mkdirSync(projectsDir, { recursive: true });
  return fs
    .readdirSync(projectsDir)
    .filter((f) => fs.statSync(path.join(projectsDir, f)).isDirectory())
    .map((name) => {
      const metaPath = path.join(projectsDir, name, 'project.json');
      if (fs.existsSync(metaPath)) {
        try {
          const data = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
          const meta = ProjectMetadataSchema.parse(data);
          return {
            name: meta.name,
            version: meta.version,
            assets: meta.assets.length,
            lastOpened: meta.lastOpened ?? 0,
          };
        } catch {
          return { name, version: 'unknown', assets: 0, lastOpened: 0 };
        }
      }
      return { name, version: 'unknown', assets: 0, lastOpened: 0 };
    });
});

ipcMain.handle('list-versions', async () => {
  return listVersions();
});

// Create or open an existing project and show it in the main window.
ipcMain.handle('open-project', (_e, name: string) => {
  const projectPath = path.join(projectsDir, name);
  if (!fs.existsSync(projectPath))
    fs.mkdirSync(projectPath, { recursive: true });
  const metaPath = path.join(projectsDir, name, 'project.json');
  if (fs.existsSync(metaPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      const meta = ProjectMetadataSchema.parse(data);
      meta.lastOpened = Date.now();
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
    } catch {
      // ignore corrupted metadata
    }
  }
  void setActiveProject(projectPath);
  mainWindow?.webContents.send('project-opened', projectPath);
});

ipcMain.handle('create-project', (_e, name: string, version: string) => {
  if (!fs.existsSync(projectsDir))
    fs.mkdirSync(projectsDir, { recursive: true });
  createProject(projectsDir, name, version);
});

ipcMain.handle('add-texture', (_e, projectPath: string, texture: string) => {
  void addTexture(projectPath, texture);
});

ipcMain.handle('list-textures', (_e, projectPath: string) => {
  return listTextures(projectPath);
});

ipcMain.handle('get-texture-path', (_e, projectPath: string, tex: string) => {
  return getTexturePath(projectPath, tex);
});

ipcMain.handle('get-texture-url', (_e, projectPath: string, tex: string) => {
  return getTextureURL(projectPath, tex);
});

// Trigger pack export for the given project directory.
ipcMain.handle(
  'export-project',
  async (_e, projectPath: string): Promise<ExportSummary | void> => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Export Pack',
      defaultPath: path.join(projectPath, 'pack.zip'),
      filters: [{ name: 'Zip Files', extensions: ['zip'] }],
    });
    if (canceled || !filePath) return;
    let version = '1.21.1';
    try {
      const metaPath = path.join(projectPath, 'project.json');
      const data = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      const meta = ProjectMetadataSchema.parse(data);
      version = meta.version;
    } catch {
      // Use default version if metadata can't be read
    }
    const summary = await exportPack(projectPath, filePath, version);
    return summary;
  }
);

// Register file-related IPC handlers
registerFileHandlers();

// Once Electron is ready register protocols and show the main window.
app.whenReady().then(() => {
  registerTextureProtocol(protocol);
  registerProjectTextureProtocol(protocol);
  createMainWindow();
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
