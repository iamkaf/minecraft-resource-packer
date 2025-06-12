// Preload script that safely exposes a small API surface to the renderer.
// The renderer cannot access Node.js directly, so we bridge the required
// functionality via IPC.
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Retrieve a list of saved projects
  listProjects: () =>
  ipcRenderer.invoke('list-projects') as Promise<{ name: string; version: string }[]>,
  
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
});
