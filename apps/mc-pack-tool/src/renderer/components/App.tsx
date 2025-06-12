import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import AssetBrowser from './AssetBrowser';
import AssetSelector from './AssetSelector';
import ProjectManager from './ProjectManager';

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
      <div className="drawer drawer-mobile min-h-screen bg-base-200">
        <input id="nav-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <Navbar />
          <main className="p-4 flex flex-col gap-6">
            <ProjectManager />
          </main>
        </div>
        <div className="drawer-side">
          <label htmlFor="nav-drawer" className="drawer-overlay" />
          <ul className="menu p-4 w-80 bg-base-100" />
        </div>
      </div>
    );
  }

  const handleExport = () => {
    if (projectPath) {
      window.electronAPI?.exportProject(projectPath);
    }
  };

  return (
    <div className="drawer drawer-mobile min-h-screen bg-base-200">
      <input id="nav-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
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
      </div>
      <div className="drawer-side">
        <label htmlFor="nav-drawer" className="drawer-overlay" />
        <ul className="menu p-4 w-80 bg-base-100" />
      </div>
    </div>
  );
};

export default App;
