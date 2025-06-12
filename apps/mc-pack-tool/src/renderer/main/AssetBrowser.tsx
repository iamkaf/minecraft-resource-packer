import React, { useEffect, useState } from 'react';
import { watch } from 'chokidar';
import fs from 'fs';

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
      {files.map(f => (
        <li key={f}>{f}</li>
      ))}
    </ul>
  );
};
export default AssetBrowser;
