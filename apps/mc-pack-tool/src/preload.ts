// Preload script that safely exposes a small API surface to the renderer.
// The renderer cannot access Node.js directly, so we bridge the required
// functionality via IPC.
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Retrieve a list of saved projects
  listProjects: () =>
    ipcRenderer.invoke('list-projects') as Promise<
      { name: string; version: string }[]
    >,

  // Retrieve the list of official Minecraft versions
  listVersions: () => ipcRenderer.invoke('list-versions') as Promise<string[]>,

  // Create a new project
  createProject: (name: string, version: string) =>
    ipcRenderer.invoke('create-project', name, version),

  // Request the main process to open an existing project
  openProject: (name: string) => ipcRenderer.invoke('open-project', name),

  // Listen for the main window reporting that a project has been opened
  onOpenProject: (listener: (event: unknown, path: string) => void) =>
    ipcRenderer.on('project-opened', listener),

  // Ask the main process to export the current project as a zip
  exportProject: (path: string, out: string) =>
    ipcRenderer.invoke('export-project', path, out),

  // Download and copy a texture from the cached client jar
  addTexture: (project: string, name: string) =>
    ipcRenderer.invoke('add-texture', project, name),

  // Retrieve the list of texture paths for this project
  listTextures: (project: string) =>
    ipcRenderer.invoke('list-textures', project),

  // Reveal a file in the OS file manager
  openInFolder: (file: string) => ipcRenderer.invoke('open-in-folder', file),

  // Open a file with the default application
  openFile: (file: string) => ipcRenderer.invoke('open-file', file),
});
