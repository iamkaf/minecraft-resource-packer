import React, { useEffect, useState } from 'react';

// Lists all available projects and lets the user open them.  Mimics the
// project selection dialog used in game engines like Godot.

const ProjectManager: React.FC = () => {
  interface ProjectInfo {
    name: string;
    version: string;
  }
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [name, setName] = useState('');
  const [version, setVersion] = useState('');
  const [versions, setVersions] = useState<string[]>([]);

  const refresh = () => {
    window.electronAPI?.listProjects().then(setProjects);
  };

  useEffect(() => {
    // Fetch the list of projects and available versions when the component loads
    refresh();
    window.electronAPI?.listVersions().then(setVersions);
  }, []);

  const handleOpen = (n: string) => {
    window.electronAPI?.openProject(n);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !version) return;
    window.electronAPI?.createProject(name, version).then(refresh);
    setName('');
    setVersion('');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Projects</h1>
      <form onSubmit={handleCreate} className="space-x-2 mb-4">
        <input
          className="border px-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <select
          className="border px-1"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
        >
          <option value="" disabled>
            Select version
          </option>
          {versions.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <button className="border px-2" type="submit">
          Create
        </button>
      </form>
      <ul className="space-y-1">
        {projects.map((p) => (
          <li key={p.name}>
            <button
              className="underline text-blue-600"
              onClick={() => handleOpen(p.name)}
            >
              {p.name} ({p.version})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ProjectManager;
