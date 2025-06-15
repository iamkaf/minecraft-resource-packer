// Global type declarations used by the renderer process.
export {};

import type { IpcRequestMap, IpcResponseMap, IpcEventMap } from './ipc/types';

type IpcInvoke<C extends keyof IpcRequestMap> = (
  ...args: IpcRequestMap[C]
) => Promise<IpcResponseMap[C]>;

type IpcListener<C extends keyof IpcEventMap> = (
  listener: (event: unknown, data: IpcEventMap[C]) => void
) => void;

declare global {
  interface Window {
    electronAPI?: {
      listProjects: IpcInvoke<'list-projects'>;
      listVersions: IpcInvoke<'list-versions'>;
      createProject: IpcInvoke<'create-project'>;
      importProject: IpcInvoke<'import-project'>;
      duplicateProject: IpcInvoke<'duplicate-project'>;
      deleteProject: IpcInvoke<'delete-project'>;
      openProject: IpcInvoke<'open-project'>;
      loadPackMeta: IpcInvoke<'load-pack-meta'>;
      savePackMeta: IpcInvoke<'save-pack-meta'>;
      addTexture: IpcInvoke<'add-texture'>;
      listTextures: IpcInvoke<'list-textures'>;
      getTexturePath: IpcInvoke<'get-texture-path'>;
      getTextureUrl: IpcInvoke<'get-texture-url'>;
      randomizeIcon: IpcInvoke<'randomize-icon'>;
      setPackIcon: IpcInvoke<'set-pack-icon'>;
      exportProject: IpcInvoke<'export-project'>;
      exportProjects: IpcInvoke<'export-projects'>;
      openInFolder: IpcInvoke<'open-in-folder'>;
      openFile: IpcInvoke<'open-file'>;
      readFile: IpcInvoke<'read-file'>;
      writeFile: IpcInvoke<'write-file'>;
      renameFile: IpcInvoke<'rename-file'>;
      deleteFile: IpcInvoke<'delete-file'>;
      editTexture: IpcInvoke<'edit-texture'>;
      watchProject: IpcInvoke<'watch-project'>;
      unwatchProject: IpcInvoke<'unwatch-project'>;
      getNoExport: IpcInvoke<'get-no-export'>;
      setNoExport: IpcInvoke<'set-no-export'>;
      getEditorLayout: IpcInvoke<'get-editor-layout'>;
      setEditorLayout: IpcInvoke<'set-editor-layout'>;
      onOpenProject: IpcListener<'project-opened'>;
      onFileAdded: IpcListener<'file-added'>;
      onFileRemoved: IpcListener<'file-removed'>;
      onFileRenamed: IpcListener<'file-renamed'>;
    };
  }
}
