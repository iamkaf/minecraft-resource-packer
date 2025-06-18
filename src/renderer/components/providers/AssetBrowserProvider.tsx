import React, { createContext, useContext, useEffect, useState } from 'react';

interface AssetBrowserContextValue {
  selected: Set<string>;
  setSelected: React.Dispatch<React.SetStateAction<Set<string>>>;
  noExport: Set<string>;
  toggleNoExport: (files: string[], flag: boolean) => void;
  deleteFiles: (files: string[]) => void;
  openRename: (file: string) => void;
  openMove: (file: string) => void;
}

const noop = () => {
  /* noop */
};

const AssetBrowserContext = createContext<AssetBrowserContextValue>({
  selected: new Set<string>(),
  setSelected: () => {
    /* noop */
  },
  noExport: new Set<string>(),
  toggleNoExport: noop,
  deleteFiles: noop,
  openRename: noop,
  openMove: noop,
});

export function useAssetBrowser() {
  return useContext(AssetBrowserContext);
}

interface ProviderProps {
  children: React.ReactNode;
  noExport: Set<string>;
  toggleNoExport: (files: string[], flag: boolean) => void;
  openRename: (file: string) => void;
  openMove: (file: string) => void;
  onSelectionChange?: (sel: string[]) => void;
}

export function AssetBrowserProvider({
  children,
  noExport,
  toggleNoExport,
  openRename,
  openMove,
  onSelectionChange,
}: ProviderProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    onSelectionChange?.(Array.from(selected));
  }, [selected, onSelectionChange]);

  const deleteFiles = (files: string[]) => {
    files.forEach((f) => window.electronAPI?.deleteFile(f));
    setSelected(new Set());
  };

  return (
    <AssetBrowserContext.Provider
      value={{
        selected,
        setSelected,
        noExport,
        toggleNoExport,
        deleteFiles,
        openRename,
        openMove,
      }}
    >
      {children}
    </AssetBrowserContext.Provider>
  );
}

export { AssetBrowserContext };
