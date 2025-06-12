// Global type declarations used by the renderer process.
export {};

declare global {
  interface Window {
    /** API provided by the preload script for communicating with the main process */
    electronAPI?: {
      listProjects: () => Promise<{ name: string; version: string }[]>;
      createProject: (name: string, version: string) => void;
      openProject: (name: string) => void;
      onOpenProject: (listener: (event: unknown, path: string) => void) => void;
      exportProject: (path: string, out: string) => void;
      addTexture: (project: string, name: string) => void;
      listTextures: (project: string) => Promise<string[]>;
      getTexturePath: (project: string, texture: string) => Promise<string>;
      openInFolder: (file: string) => void;
      openFile: (file: string) => void;
    };
  }
}
