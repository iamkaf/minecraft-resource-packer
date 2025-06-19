import { create } from 'zustand';

export interface AppState {
  projectPath: string | null;
  setProjectPath: (p: string | null) => void;
  selectedAssets: string[];
  setSelectedAssets: (sel: string[]) => void;
  noExport: Set<string>;
  toggleNoExport: (files: string[], flag: boolean) => void;
  deleteFiles: (files: string[]) => void;
  renameTarget: string | null;
  moveTarget: string | null;
  openRename: (file: string) => void;
  openMove: (file: string) => void;
  closeDialogs: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  projectPath: null,
  setProjectPath: (p) => set({ projectPath: p }),
  selectedAssets: [],
  setSelectedAssets: (sel) => set({ selectedAssets: sel }),
  noExport: new Set<string>(),
  toggleNoExport: (files, flag) => {
    const projectPath = get().projectPath;
    if (projectPath) {
      window.electronAPI?.setNoExport(projectPath, files, flag);
    }
    set((state) => {
      const ns = new Set(state.noExport);
      files.forEach((f) => {
        if (flag) ns.add(f);
        else ns.delete(f);
      });
      return { noExport: ns };
    });
  },
  deleteFiles: (files) => {
    files.forEach((f) => window.electronAPI?.deleteFile(f));
    set({ selectedAssets: [] });
  },
  renameTarget: null,
  moveTarget: null,
  openRename: (file) => set({ renameTarget: file }),
  openMove: (file) => set({ moveTarget: file }),
  closeDialogs: () => set({ renameTarget: null, moveTarget: null }),
}));
