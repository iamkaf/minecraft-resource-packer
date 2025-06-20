// Preload script that safely exposes a small API surface to the renderer.
// The renderer cannot access Node.js directly, so we bridge the required
// functionality via IPC.
import { contextBridge, ipcRenderer } from 'electron';
import type {
  IpcRequestMap,
  IpcResponseMap,
  IpcEventMap,
} from '../shared/ipc/types';

function invoke<C extends keyof IpcRequestMap>(
  channel: C,
  ...args: IpcRequestMap[C]
) {
  return ipcRenderer.invoke(channel, ...args) as Promise<IpcResponseMap[C]>;
}

function on<C extends keyof IpcEventMap>(
  channel: C,
  listener: (event: unknown, data: IpcEventMap[C]) => void
) {
  const handler = (_e: unknown, d: IpcEventMap[C]) => listener(_e, d);
  ipcRenderer.on(channel, handler);
  return () => ipcRenderer.removeListener(channel, handler);
}

const api = {
  log: (level: string, message: string) => invoke('log', level, message),
  listProjects: () => invoke('list-projects'),
  listPackFormats: () => invoke('list-formats'),
  createProject: (name: string, minecraftVersion: string) =>
    invoke('create-project', name, minecraftVersion),
  importProject: () => invoke('import-project'),
  duplicateProject: (name: string, newName: string) =>
    invoke('duplicate-project', name, newName),
  renameProject: (name: string, newName: string) =>
    invoke('rename-project', name, newName),
  deleteProject: (name: string) => invoke('delete-project', name),
  openProject: (name: string) => invoke('open-project', name),
  onOpenProject: (listener: (e: unknown, path: string) => void) =>
    on('project-opened', listener),
  exportProject: (project: string) => invoke('export-project', project),
  exportProjects: (paths: string[]) => invoke('export-projects', paths),
  openProjectFolder: (name: string) => invoke('open-project-folder', name),
  addTexture: (project: string, name: string) =>
    invoke('add-texture', project, name),
  listTextures: (project: string) => invoke('list-textures', project),
  getTexturePath: (project: string, name: string) =>
    invoke('get-texture-path', project, name),
  getTextureUrl: (project: string, name: string) =>
    invoke('get-texture-url', project, name),
  createAtlas: (project: string, files: string[]) =>
    invoke('create-atlas', project, files),
  randomizeIcon: (project: string) => invoke('randomize-icon', project),
  savePackIcon: (project: string, file: string, border: string) =>
    invoke('save-pack-icon', project, file, border),
  openInFolder: (file: string) => invoke('open-in-folder', file),
  openFile: (file: string) => invoke('open-file', file),
  openExternalEditor: (file: string) => invoke('open-external-editor', file),
  readFile: (file: string) => invoke('read-file', file),
  writeFile: (file: string, data: string) => invoke('write-file', file, data),
  saveRevision: (project: string, rel: string, data: string) =>
    invoke('save-revision', project, rel, data),
  listRevisions: (project: string, rel: string) =>
    invoke('list-revisions', project, rel),
  restoreRevision: (project: string, rel: string, rev: string) =>
    invoke('restore-revision', project, rel, rev),
  renameFile: (oldPath: string, newPath: string) =>
    invoke('rename-file', oldPath, newPath),
  deleteFile: (file: string) => invoke('delete-file', file),
  editTexture: (
    file: string,
    opts: import('../shared/texture').TextureEditOptions
  ) => invoke('edit-texture', file, opts),
  watchProject: (project: string) => invoke('watch-project', project),
  unwatchProject: (project: string) => invoke('unwatch-project', project),
  getNoExport: (project: string) => invoke('get-no-export', project),
  setNoExport: (project: string, files: string[], flag: boolean) =>
    invoke('set-no-export', project, files, flag),
  getEditorLayout: () => invoke('get-editor-layout'),
  setEditorLayout: (layout: number[]) => invoke('set-editor-layout', layout),
  getTextureEditor: () => invoke('get-texture-editor'),
  setTextureEditor: (path: string) => invoke('set-texture-editor', path),
  getTheme: () => invoke('get-theme'),
  setTheme: (t: 'light' | 'dark' | 'system') => invoke('set-theme', t),
  getConfetti: () => invoke('get-confetti'),
  setConfetti: (c: boolean) => invoke('set-confetti', c),
  getDefaultExportDir: () => invoke('get-default-export-dir'),
  setDefaultExportDir: (d: string) => invoke('set-default-export-dir', d),
  getProjectSort: () => invoke('get-project-sort'),
  setProjectSort: (
    k: keyof import('../main/projects').ProjectInfo,
    asc: boolean
  ) => invoke('set-project-sort', k, asc),
  getAssetSearch: () => invoke('get-asset-search'),
  setAssetSearch: (q: string) => invoke('set-asset-search', q),
  getAssetFilters: () => invoke('get-asset-filters'),
  setAssetFilters: (f: string[]) => invoke('set-asset-filters', f),
  getAssetZoom: () => invoke('get-asset-zoom'),
  setAssetZoom: (z: number) => invoke('set-asset-zoom', z),
  getOpenLastProject: () => invoke('get-open-last-project'),
  setOpenLastProject: (b: boolean) => invoke('set-open-last-project', b),
  getLastProject: () => invoke('get-last-project'),
  setLastProject: (n: string) => invoke('set-last-project', n),
  onFileAdded: (listener: (e: unknown, path: string) => void) =>
    on('file-added', listener),
  onFileRemoved: (listener: (e: unknown, path: string) => void) =>
    on('file-removed', listener),
  onFileRenamed: (
    listener: (e: unknown, args: { oldPath: string; newPath: string }) => void
  ) => on('file-renamed', listener),
  onFileChanged: (
    listener: (e: unknown, args: { path: string; stamp: number }) => void
  ) => on('file-changed', listener),
  loadPackMeta: (name: string) => invoke('load-pack-meta', name),
  savePackMeta: (name: string, meta: import('../main/projects').PackMeta) =>
    invoke('save-pack-meta', name, meta),
};

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('electronAPI', api);
} else {
  // In development we disable context isolation so just attach directly.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).electronAPI = api;
}
