import React, { useEffect, useState } from 'react';
import { InputField, Range, FilterBadge } from '../daisy/input';

export const FILTERS = [
  'blocks',
  'items',
  'entity',
  'ui',
  'audio',
  'lang',
] as const;
export type Filter = (typeof FILTERS)[number];

export interface ControlsState {
  query: string;
  zoom: number;
  filters: Filter[];
}

interface Props {
  onChange?: (state: ControlsState) => void;
}

export default function AssetBrowserControls({ onChange }: Props) {
  const [query, setQuery] = useState('');
  const [zoom, setZoom] = useState(64);
  const [filters, setFilters] = useState<Filter[]>([]);

  useEffect(() => {
    Promise.all([
      window.electronAPI?.getAssetSearch?.(),
      window.electronAPI?.getAssetFilters?.(),
      window.electronAPI?.getAssetZoom?.(),
    ]).then(([search, filts, z]) => {
      if (search) setQuery(search);
      if (filts) setFilters(filts as Filter[]);
      if (z) setZoom(z);
      onChange?.({
        query: search ?? '',
        filters: (filts as Filter[]) ?? [],
        zoom: z ?? 64,
      });
    });
  }, []);

  useEffect(() => {
    window.electronAPI?.setAssetSearch?.(query);
    window.electronAPI?.setAssetFilters?.(filters);
    window.electronAPI?.setAssetZoom?.(zoom);
    onChange?.({ query, filters, zoom });
  }, [query, filters, zoom]);

  const toggleFilter = (f: Filter) => {
    setFilters((prev) =>
      prev.includes(f) ? prev.filter((p) => p !== f) : [...prev, f]
    );
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <InputField
          className="flex-1"
          placeholder="Search files"
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
    </>
  );
}
