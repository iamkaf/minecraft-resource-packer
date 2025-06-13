import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import AssetBrowser from './AssetBrowser';
import AssetSelector from './AssetSelector';
import ProjectManager from './ProjectManager';
import DrawerLayout from './DrawerLayout';

// Main React component shown in the editor window.  It waits for the main
// process to notify which project is open and then displays an AssetBrowser for
// that directory.

const App: React.FC = () => {
  const [projectPath, setProjectPath] = useState<string | null>(null);

  useEffect(() => {
    // Listen for the main process telling us which project to load.
    window.electronAPI?.onOpenProject((_event, path: string) => {
      setProjectPath(path);
    });
  }, []);

  if (!projectPath) {
    return (
      <DrawerLayout>
        <Navbar />
        <main className="p-4 flex flex-col gap-6">
          <ProjectManager />
        </main>
      </DrawerLayout>
    );
  }

  const handleExport = () => {
    if (projectPath) {
      window.electronAPI?.exportProject(projectPath);
    }
  };

  return (
    <DrawerLayout>
      <Navbar />
      <main className="p-4 flex flex-col gap-4">
        <button
          className="link link-primary w-fit"
          onClick={() => setProjectPath(null)}
        >
          Back to Projects
        </button>
        <h1 className="font-display text-xl mb-2">Project: {projectPath}</h1>
        <button className="btn btn-accent mb-2" onClick={handleExport}>
          Export Pack
        </button>
        <AssetSelector path={projectPath} />
        <AssetBrowser path={projectPath} />
      </main>
    </DrawerLayout>
  );
};

export default App;
