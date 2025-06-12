import React, { useEffect, useState } from 'react';

// Lists all available projects and lets the user open them.  Mimics the
// project selection dialog used in game engines like Godot.

const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<string[]>([]);

  useEffect(() => {
    // Fetch the list of projects from the main process when the component loads
    window.electronAPI?.listProjects().then(setProjects);
  }, []);

  const handleOpen = (name: string) => {
    window.electronAPI?.openProject(name);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Projects</h1>
      <ul className="space-y-1">
        {projects.map(p => (
          <li key={p}>
            {/* Each project name opens the corresponding folder */}
            <button
              className="underline text-blue-600"
              onClick={() => handleOpen(p)}
            >
              {p}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ProjectManager;
