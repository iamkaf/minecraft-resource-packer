import React from 'react';
import { InputField, Range, FilterBadge } from '../daisy/input';

export const FILTERS = ['blocks', 'items', 'entity', 'ui', 'audio'] as const;
export type Filter = (typeof FILTERS)[number];

interface Props {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  filters: Filter[];
  toggleFilter: (f: Filter) => void;
}

export default function AssetSelectorControls({
  query,
  setQuery,
  zoom,
  setZoom,
  filters,
  toggleFilter,
}: Props) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <InputField
          className="flex-1"
          placeholder="Search texture"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Range
          min={24}
          max={128}
          step={1}
          value={zoom}
          aria-label="Zoom"
          data-testid="zoom-range"
          onChange={(e) => setZoom(Number(e.target.value))}
          className="range-xs w-32"
        />
      </div>
      <div className="flex gap-1 mb-2">
        {FILTERS.map((f) => (
          <FilterBadge
            key={f}
            label={f.charAt(0).toUpperCase() + f.slice(1)}
            selected={filters.includes(f)}
            onClick={() => toggleFilter(f)}
            onKeyDown={(e) => e.key === 'Enter' && toggleFilter(f)}
          />
        ))}
      </div>
    </div>
  );
}
