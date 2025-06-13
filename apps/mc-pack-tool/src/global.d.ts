// Global type declarations used by the renderer process.
export {};

declare global {
  interface Window {
    /** API provided by the preload script for communicating with the main process */
    electronAPI?: {
      listProjects: () => Promise<
        { name: string; version: string; assets: number; lastOpened: number }[]
      >;
      listVersions: () => Promise<string[]>;
      createProject: (name: string, version: string) => Promise<void>;
      importProject: () => Promise<void>;
      duplicateProject: (name: string, newName: string) => Promise<void>;
      deleteProject: (name: string) => Promise<void>;
      openProject: (name: string) => Promise<void>;
      onOpenProject: (listener: (event: unknown, path: string) => void) => void;
      exportProject: (
        path: string
      ) => Promise<import('./main/exporter').ExportSummary>;
      addTexture: (project: string, name: string) => Promise<void>;
      listTextures: (project: string) => Promise<string[]>;
      getTexturePath: (project: string, texture: string) => Promise<string>;
      getTextureUrl: (project: string, texture: string) => Promise<string>;
      openInFolder: (file: string) => Promise<void>;
      openFile: (file: string) => Promise<void>;
      renameFile: (oldPath: string, newPath: string) => Promise<void>;
      deleteFile: (file: string) => Promise<void>;
      loadPackMeta: (
        name: string
      ) => Promise<import('./main/projects').PackMeta>;
      savePackMeta: (
        name: string,
        meta: import('./main/projects').PackMeta
      ) => Promise<void>;
    };
  }
}
