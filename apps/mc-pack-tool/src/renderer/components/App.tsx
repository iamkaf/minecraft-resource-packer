import React, { useEffect, useState } from 'react';
import AssetBrowser from './AssetBrowser';
import AssetSelector from './AssetSelector';

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
    return <div className="p-4">No project loaded</div>;
  }

  const handleExport = () => {
    if (projectPath) {
      window.electronAPI?.exportProject(projectPath);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Project: {projectPath}</h1>
      <button
        className="bg-blue-500 text-white px-2 py-1 rounded mb-2"
        onClick={handleExport}
      >
        Export Pack
      </button>
      <AssetSelector path={projectPath} />
      {/* Display the files inside the selected project */}
      <AssetBrowser path={projectPath} />
    </div>
  );
};

export default App;
