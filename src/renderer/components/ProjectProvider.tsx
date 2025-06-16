import React, { createContext, useContext, useState } from 'react';

interface ProjectContextValue {
  path: string | null;
  setPath: (p: string | null) => void;
}

const ProjectContext = createContext<ProjectContextValue>({
  path: null,
  setPath: () => {
    /* noop */
  },
});

export function useProject() {
  return useContext(ProjectContext);
}

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [path, setPath] = useState<string | null>(null);
  return (
    <ProjectContext.Provider value={{ path, setPath }}>
      {children}
    </ProjectContext.Provider>
  );
}

export { ProjectContext };
