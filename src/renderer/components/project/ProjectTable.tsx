import React from 'react';

export interface ProjectInfo {
  name: string;
  version: string;
  assets: number;
  lastOpened: number;
}

export default function ProjectTable({
  projects,
  onSort,
  selected,
  onSelect,
  onSelectAll,
  onOpen,
  onDuplicate,
  onDelete,
  onRowClick,
}: {
  projects: ProjectInfo[];
  onSort: (k: keyof ProjectInfo) => void;
  selected: Set<string>;
  onSelect: (name: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onOpen: (name: string) => void;
  onDuplicate: (name: string) => void;
  onDelete: (name: string) => void;
  onRowClick: (name: string) => void;
}) {
  const allSelected =
    selected.size > 0 && projects.every((p) => selected.has(p.name));

  return (
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
                onChange={(e) => onSelectAll(e.target.checked)}
                className="checkbox checkbox-sm"
              />
            </th>
            <th onClick={() => onSort('name')} className="cursor-pointer">
              Name
            </th>
            <th onClick={() => onSort('version')} className="cursor-pointer">
              MC Version
            </th>
            <th onClick={() => onSort('assets')} className="cursor-pointer">
              Assets
            </th>
            <th onClick={() => onSort('lastOpened')} className="cursor-pointer">
              Last opened
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr
              key={p.name}
              onClick={() => onRowClick(p.name)}
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
                    onSelect(p.name, e.target.checked);
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
                    onOpen(p.name);
                  }}
                >
                  Open
                </button>
                <button
                  className="btn btn-info btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(p.name);
                  }}
                >
                  Duplicate
                </button>
                <button
                  className="btn btn-error btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(p.name);
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
  );
}
