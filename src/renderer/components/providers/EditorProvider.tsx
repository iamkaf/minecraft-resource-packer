import React, { createContext, useContext, useState } from 'react';

export type EditorTab = 'browser' | 'lab' | 'exporter';

interface EditorContextValue {
  tab: EditorTab;
  setTab: (t: EditorTab) => void;
  labFile: string | null;
  labStamp?: number;
  openLab: (file: string, stamp?: number) => void;
}

export const EditorContext = createContext<EditorContextValue>({
  tab: 'browser',
  setTab: () => {
    /* noop */
  },
  labFile: null,
  labStamp: undefined,
  openLab: () => {
    /* noop */
  },
});

export const useEditor = () => useContext(EditorContext);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState<EditorTab>('browser');
  const [labFile, setLabFile] = useState<string | null>(null);
  const [labStamp, setLabStamp] = useState<number | undefined>(undefined);

  const openLab = (file: string, stamp?: number) => {
    setLabFile(file);
    setLabStamp(stamp);
    setTab('lab');
  };

  return (
    <EditorContext.Provider value={{ tab, setTab, labFile, labStamp, openLab }}>
      {children}
    </EditorContext.Provider>
  );
}
