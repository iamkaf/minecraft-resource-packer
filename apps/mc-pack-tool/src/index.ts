// Entry point for the Electron main process.
// This file creates both the project manager window and the main editor window
// and exposes a few IPC handlers used by the renderer process.

import { app, BrowserWindow, ipcMain } from 'electron';
import { registerFileHandlers } from './main/ipcFiles';
import path from 'path';
import fs from 'fs';
import { exportPack } from './main/exporter';
import { createProject } from './main/projects';
import { addTexture, listTextures, getTexturePath } from './main/assets';
import { ProjectMetadataSchema } from './minecraft/project';

declare const MANAGER_WEBPACK_ENTRY: string;
declare const MANAGER_PRELOAD_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let managerWindow: BrowserWindow | null = null;
let mainWindow: BrowserWindow | null = null;

// Directory that stores the local projects on disk.	Under Electron's
// userData path to keep everything self contained.
const projectsDir = path.join(app.getPath('userData'), 'projects');

// Create the initial project manager window.	 This lists available projects
// and lets the user open one or create a new one.
const createManagerWindow = () => {
  managerWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      preload: MANAGER_PRELOAD_WEBPACK_ENTRY,
    },
  });
  managerWindow.loadURL(MANAGER_WEBPACK_ENTRY);
};

// Create the main application window for a specific project.
// Once the window loads we emit the selected project path so the renderer can
// display its contents.
const createMainWindow = (projectPath: string) => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send('project-opened', projectPath);
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
          return { name: meta.name, version: meta.version };
        } catch {
          return { name, version: 'unknown' };
        }
      }
      return { name, version: 'unknown' };
    });
});

// Create or open an existing project and show it in the main window.
ipcMain.handle('open-project', (_e, name: string) => {
  const projectPath = path.join(projectsDir, name);
  if (!fs.existsSync(projectPath))
    fs.mkdirSync(projectPath, { recursive: true });
  if (managerWindow) managerWindow.close();
  createMainWindow(projectPath);
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

// Trigger pack export for the given project directory.
ipcMain.handle('export-project', (_e, projectPath: string, out: string) => {
  let version = '1.21.1';
  try {
    const metaPath = path.join(projectPath, 'project.json');
    const data = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    const meta = ProjectMetadataSchema.parse(data);
    version = meta.version;
  } catch {
    // Use default version if metadata can't be read
  }
  exportPack(projectPath, out, version);
});

// Register file-related IPC handlers
registerFileHandlers();

// Once Electron is ready show the manager window.
app.whenReady().then(createManagerWindow);

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
    createManagerWindow();
  }
});
