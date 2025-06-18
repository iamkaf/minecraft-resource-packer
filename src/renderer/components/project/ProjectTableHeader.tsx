import React from 'react';
import { Checkbox } from '../daisy/input';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import type { ProjectInfo } from './ProjectTable';

interface Props {
  allSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  sortKey: keyof ProjectInfo;
  asc: boolean;
  onSort: (k: keyof ProjectInfo) => void;
}

export default function ProjectTableHeader({
  allSelected,
  onSelectAll,
  sortKey,
  asc,
  onSort,
}: Props) {
  return (
    <thead>
      <tr>
        <th>
          <Checkbox
            aria-label="Select all"
            checked={allSelected}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="checkbox checkbox-primary checkbox-sm"
          />
        </th>
        <th onClick={() => onSort('name')} className="cursor-pointer">
          Name
          {sortKey === 'name' &&
            (asc ? (
              <ChevronUpIcon className="w-3 h-3 inline-block ml-1" />
            ) : (
              <ChevronDownIcon className="w-3 h-3 inline-block ml-1" />
            ))}
        </th>
        <th onClick={() => onSort('version')} className="cursor-pointer">
          MC Version
          {sortKey === 'version' &&
            (asc ? (
              <ChevronUpIcon className="w-3 h-3 inline-block ml-1" />
            ) : (
              <ChevronDownIcon className="w-3 h-3 inline-block ml-1" />
            ))}
        </th>
        <th onClick={() => onSort('assets')} className="cursor-pointer">
          Assets
          {sortKey === 'assets' &&
            (asc ? (
              <ChevronUpIcon className="w-3 h-3 inline-block ml-1" />
            ) : (
              <ChevronDownIcon className="w-3 h-3 inline-block ml-1" />
            ))}
        </th>
        <th onClick={() => onSort('lastOpened')} className="cursor-pointer">
          Last opened
          {sortKey === 'lastOpened' &&
            (asc ? (
              <ChevronUpIcon className="w-3 h-3 inline-block ml-1" />
            ) : (
              <ChevronDownIcon className="w-3 h-3 inline-block ml-1" />
            ))}
        </th>
        <th></th>
      </tr>
    </thead>
  );
}
