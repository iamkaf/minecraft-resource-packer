import React, { useEffect, useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { useToast } from './ToastProvider';
import { generateProjectName } from '../utils/names';
import RenameModal from './RenameModal';
import ConfirmModal from './ConfirmModal';

// Lists all available projects and lets the user open them.  Mimics the
// project selection dialog used in game engines like Godot.

const ProjectManager: React.FC = () => {
  interface ProjectInfo {
    name: string;
    version: string;
    assets: number;
    lastOpened: number;
  }
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [sortKey, setSortKey] = useState<keyof ProjectInfo>('name');
  const [asc, setAsc] = useState(true);
  const [name, setName] = useState(() => generateProjectName());
  const [version, setVersion] = useState('');
  const [versions, setVersions] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [filterVersion, setFilterVersion] = useState<string | null>(null);
  const [duplicateTarget, setDuplicateTarget] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

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

  const handleImport = () => {
    window.electronAPI?.importProject().then(refresh);
  };

  const handleDuplicate = (n: string) => {
    setDuplicateTarget(n);
  };

  const handleDelete = (n: string) => {
    setDeleteTarget(n);
  };

  const toast = useToast();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !version) return;
    window.electronAPI?.createProject(name, version).then(() => {
      refresh();
      toast('Project created', 'success');
    });
    setName(generateProjectName());
    setVersion('');
  };

  const handleSort = (key: keyof ProjectInfo) => {
    if (sortKey === key) {
      setAsc(!asc);
    } else {
      setSortKey(key);
      setAsc(true);
    }
  };

  const chipVersions = useMemo(
    () => Array.from(new Set(projects.map((p) => p.version))),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    let list = projects;
    if (filterVersion) list = list.filter((p) => p.version === filterVersion);
    if (search) {
      const fuse = new Fuse(list, { keys: ['name'], threshold: 0.4 });
      list = fuse.search(search).map((r) => r.item);
    }
    return list;
  }, [projects, filterVersion, search]);

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const dir = asc ? 1 : -1;
    if (a[sortKey] < b[sortKey]) return -1 * dir;
    if (a[sortKey] > b[sortKey]) return 1 * dir;
    return 0;
  });

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
        <button
          type="button"
          onClick={handleImport}
          className="btn btn-secondary btn-sm"
        >
          Import
        </button>
      </form>
      <div className="flex items-center gap-2 mb-2">
        <input
          className="input input-bordered input-sm w-40"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
        />
        <div className="flex gap-1">
          {chipVersions.map((v) => (
            <span
              key={v}
              role="button"
              tabIndex={0}
              onClick={() => setFilterVersion(filterVersion === v ? null : v)}
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                setFilterVersion(filterVersion === v ? null : v)
              }
              className={`badge badge-outline cursor-pointer select-none ${filterVersion === v ? 'badge-primary' : ''}`}
            >
              {v}
            </span>
          ))}
        </div>
      </div>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')} className="cursor-pointer">
              Name
            </th>
            <th
              onClick={() => handleSort('version')}
              className="cursor-pointer"
            >
              MC Version
            </th>
            <th onClick={() => handleSort('assets')} className="cursor-pointer">
              Assets
            </th>
            <th
              onClick={() => handleSort('lastOpened')}
              className="cursor-pointer"
            >
              Last opened
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortedProjects.map((p) => (
            <tr key={p.name}>
              <td>{p.name}</td>
              <td>{p.version}</td>
              <td>{p.assets}</td>
              <td>{new Date(p.lastOpened).toLocaleDateString()}</td>
              <td className="flex gap-1">
                <button
                  className="btn btn-accent btn-sm"
                  onClick={() => handleOpen(p.name)}
                >
                  Open
                </button>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => handleDuplicate(p.name)}
                >
                  Duplicate
                </button>
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => handleDelete(p.name)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {duplicateTarget && (
        <RenameModal
          current={`${duplicateTarget} Copy`}
          title="Duplicate Project"
          confirmText="Duplicate"
          onCancel={() => setDuplicateTarget(null)}
          onRename={(newName) => {
            const src = duplicateTarget;
            setDuplicateTarget(null);
            window.electronAPI?.duplicateProject(src, newName).then(() => {
              refresh();
              toast('Project duplicated', 'success');
            });
          }}
        />
      )}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Project"
          message={`Delete project ${deleteTarget}?`}
          confirmText="Delete"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            const target = deleteTarget;
            setDeleteTarget(null);
            window.electronAPI?.deleteProject(target).then(() => {
              refresh();
              toast('Project deleted', 'info');
            });
          }}
        />
      )}
    </section>
  );
};
export default ProjectManager;
