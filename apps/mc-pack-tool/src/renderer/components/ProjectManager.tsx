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
    <section>
      <h2 className="font-display text-xl mb-2">Projects</h2>
      <form onSubmit={handleCreate} className="flex gap-2 mb-4">
        <input
          className="input input-bordered input-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <select
          className="select select-bordered select-sm"
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
        <button className="btn btn-primary btn-sm" type="submit">
          Create
        </button>
      </form>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>MC Ver.</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.name}>
              <td>{p.name}</td>
              <td>{p.version}</td>
              <td>
                <button
                  className="btn btn-accent btn-sm"
                  onClick={() => handleOpen(p.name)}
                >
                  Open
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
export default ProjectManager;
