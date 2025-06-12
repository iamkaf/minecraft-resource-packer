import React, { useEffect, useState } from 'react';
import { watch } from 'chokidar';
import fs from 'fs';
import path from 'path';

// Simple file list that updates whenever files inside the project directory
// change on disk. Uses chokidar to watch for edits and re-read the directory.

interface Props {
  path: string;
}

const AssetBrowser: React.FC<Props> = ({ path: projectPath }) => {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    const loadFiles = () => {
      setFiles(fs.readdirSync(projectPath));
    };

    // Initial load and set up a watcher for future changes.
    loadFiles();
    const watcher = watch(projectPath, { ignoreInitial: true });
    watcher.on('all', loadFiles);
    return () => {
      void watcher.close();
    };
  }, [projectPath]);

  return (
    <ul className="list-disc pl-4">
      {/* Render the list of files */}
      {files.map((f) => {
        const full = path.join(projectPath, f);
        const name = path.basename(f);
        const openFile = () => window.electronAPI?.openFile(full);
        const openFolder = () => window.electronAPI?.openInFolder(full);
        return (
          <li key={f} className="flex items-center space-x-2">
            <span>{name}</span>
            <button className="underline text-blue-600" onClick={openFile}>
              Open
            </button>
            <button className="underline text-blue-600" onClick={openFolder}>
              Show
            </button>
          </li>
        );
      })}
    </ul>
  );
};
export default AssetBrowser;
