import React, { createContext, useContext } from 'react';

export interface EditorContextValue {
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}

const EditorContext = createContext<EditorContextValue>({
  selected: [],
  setSelected: () => {
    /* noop */
  },
});

export function useEditor() {
  return useContext(EditorContext);
}

export function EditorProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: EditorContextValue;
}) {
  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export { EditorContext };
