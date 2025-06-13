// Preload script that safely exposes a small API surface to the renderer.
// The renderer cannot access Node.js directly, so we bridge the required
// functionality via IPC.
import { contextBridge, ipcRenderer } from 'electron';

const api = {
  // Retrieve a list of saved projects
  listProjects: () =>
    ipcRenderer.invoke('list-projects') as Promise<
      { name: string; version: string; assets: number; lastOpened: number }[]
    >,

  // Retrieve the list of official Minecraft versions
  listVersions: () => ipcRenderer.invoke('list-versions') as Promise<string[]>,

  // Create a new project
  createProject: (name: string, version: string) =>
    ipcRenderer.invoke('create-project', name, version) as Promise<void>,

  // Import an existing project directory
  importProject: () => ipcRenderer.invoke('import-project') as Promise<void>,

  // Duplicate an existing project
  duplicateProject: (name: string, newName: string) =>
    ipcRenderer.invoke('duplicate-project', name, newName) as Promise<void>,

  // Delete a project directory
  deleteProject: (name: string) =>
    ipcRenderer.invoke('delete-project', name) as Promise<void>,

  // Request the main process to open an existing project
  openProject: (name: string) =>
    ipcRenderer.invoke('open-project', name) as Promise<void>,

  // Listen for the main window reporting that a project has been opened
  onOpenProject: (listener: (event: unknown, path: string) => void) =>
    ipcRenderer.on('project-opened', listener),

  // Ask the main process to export the current project as a zip
  exportProject: (path: string) =>
    ipcRenderer.invoke('export-project', path) as Promise<
      import('./main/exporter').ExportSummary
    >,

  // Download and copy a texture from the cached client jar
  addTexture: (project: string, name: string) =>
    ipcRenderer.invoke('add-texture', project, name) as Promise<void>,

  // Retrieve the list of texture paths for this project
  listTextures: (project: string) =>
    ipcRenderer.invoke('list-textures', project),

  // Get absolute path for a texture within the cached client jar
  getTexturePath: (project: string, name: string) =>
    ipcRenderer.invoke('get-texture-path', project, name),

  // Return a URL to load a texture via the custom protocol
  getTextureUrl: (project: string, name: string) =>
    ipcRenderer.invoke('get-texture-url', project, name),

  // Reveal a file in the OS file manager
  openInFolder: (file: string) =>
    ipcRenderer.invoke('open-in-folder', file) as Promise<void>,

  // Open a file with the default application
  openFile: (file: string) =>
    ipcRenderer.invoke('open-file', file) as Promise<void>,

  // Rename a file on disk
  renameFile: (oldPath: string, newPath: string) =>
    ipcRenderer.invoke('rename-file', oldPath, newPath) as Promise<void>,

  // Delete a file from disk
  deleteFile: (file: string) =>
    ipcRenderer.invoke('delete-file', file) as Promise<void>,

  // Load metadata from pack.json
  loadPackMeta: (name: string) =>
    ipcRenderer.invoke('load-pack-meta', name) as Promise<
      import('./main/projects').PackMeta
    >,

  // Save metadata to pack.json
  savePackMeta: (name: string, meta: import('./main/projects').PackMeta) =>
    ipcRenderer.invoke('save-pack-meta', name, meta) as Promise<void>,
};

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('electronAPI', api);
} else {
  // In development we disable context isolation so just attach directly.
  window.electronAPI = api;
}
