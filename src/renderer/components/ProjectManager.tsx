import React, { useEffect, useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { useToast } from './ToastProvider';
import { generateProjectName } from '../utils/names';
import RenameModal from './RenameModal';
import ConfirmModal from './ConfirmModal';
import ProjectSidebar from './ProjectSidebar';
import Spinner from './Spinner';

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
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState(false);

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

  const handleBulkExport = () => {
    if (selected.size === 0) return;
    setExporting(true);
    window.electronAPI
      ?.exportProjects(Array.from(selected))
      .then(() => {
        toast('Bulk export complete', 'success');
        setSelected(new Set());
      })
      .catch(() => toast('Bulk export failed', 'error'))
      .finally(() => setExporting(false));
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

  const allSelected =
    selected.size > 0 && sortedProjects.every((p) => selected.has(p.name));
  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelected(new Set(sortedProjects.map((p) => p.name)));
    } else {
      setSelected(new Set());
    }
  };

  return (
    <section className="flex gap-4">
      <div className="flex-1">
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
          <button
            className="btn btn-accent btn-sm"
            onClick={handleBulkExport}
            disabled={selected.size === 0}
          >
            Bulk Export
          </button>
        </div>
        <div className="flex-1 overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    aria-label="Select all"
                    checked={allSelected}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => toggleAll(e.target.checked)}
                    className="checkbox checkbox-sm"
                  />
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="cursor-pointer"
                >
                  Name
                </th>
                <th
                  onClick={() => handleSort('version')}
                  className="cursor-pointer"
                >
                  MC Version
                </th>
                <th
                  onClick={() => handleSort('assets')}
                  className="cursor-pointer"
                >
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
                <tr
                  key={p.name}
                  onClick={() => setActiveProject(p.name)}
                  className="cursor-pointer"
                >
                  <td>
                    <input
                      type="checkbox"
                      aria-label={`Select ${p.name}`}
                      checked={selected.has(p.name)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        const ns = new Set(selected);
                        if (e.target.checked) ns.add(p.name);
                        else ns.delete(p.name);
                        setSelected(ns);
                      }}
                      className="checkbox checkbox-sm"
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.version}</td>
                  <td>{p.assets}</td>
                  <td>{new Date(p.lastOpened).toLocaleDateString()}</td>
                  <td className="flex gap-1">
                    <button
                      className="btn btn-accent btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpen(p.name);
                      }}
                    >
                      Open
                    </button>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicate(p.name);
                      }}
                    >
                      Duplicate
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(p.name);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {exporting && (
          <dialog className="modal modal-open" data-testid="bulk-export-modal">
            <div className="modal-box flex flex-col items-center">
              <h3 className="font-bold text-lg mb-2">Exporting...</h3>
              <Spinner />
            </div>
          </dialog>
        )}
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
      </div>
      <ProjectSidebar project={activeProject} />
    </section>
  );
};
export default ProjectManager;
