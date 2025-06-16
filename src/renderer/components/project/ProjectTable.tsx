import React from 'react';
import { Checkbox } from '../daisy/input';
import { Button } from '../daisy/actions';

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
              <Checkbox
                aria-label="Select all"
                checked={allSelected}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="checkbox-sm"
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
              onDoubleClick={() => onOpen(p.name)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onOpen(p.name);
                if (e.key === 'Delete') onDelete(p.name);
              }}
              tabIndex={0}
              className="cursor-pointer"
            >
              <td>
                <Checkbox
                  aria-label={`Select ${p.name}`}
                  checked={selected.has(p.name)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation();
                    onSelect(p.name, e.target.checked);
                  }}
                  className="checkbox-sm"
                />
              </td>
              <td>{p.name}</td>
              <td>{p.version}</td>
              <td>{p.assets}</td>
              <td>{new Date(p.lastOpened).toLocaleDateString()}</td>
              <td className="flex gap-1">
                <Button
                  className="btn-accent btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen(p.name);
                  }}
                >
                  Open
                </Button>
                <Button
                  className="btn-info btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(p.name);
                  }}
                >
                  Duplicate
                </Button>
                <Button
                  className="btn-error btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(p.name);
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
