import React from 'react';
import { FilterBadge, InputField } from '../daisy/input';
import { Button } from '../daisy/actions';
export default function SearchToolbar({
  search,
  onSearchChange,
  versions,
  activeVersion,
  onToggleVersion,
  onBulkExport,
  disableExport,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  versions: string[];
  activeVersion: string | null;
  onToggleVersion: (v: string) => void;
  onBulkExport: () => void;
  disableExport: boolean;
}) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <InputField
        className="input-sm w-40"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search"
      />
      <div className="flex gap-1">
        {versions.map((v) => (
          <FilterBadge
            key={v}
            label={v}
            selected={activeVersion === v}
            onClick={() => onToggleVersion(v)}
            onKeyDown={(e) => e.key === 'Enter' && onToggleVersion(v)}
          />
        ))}
      </div>
      <Button
        className="btn-accent btn-sm"
        onClick={onBulkExport}
        disabled={disableExport}
      >
        Bulk Export
      </Button>
    </div>
  );
}
