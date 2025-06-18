import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AssetSelectorControls, {
  FILTERS,
} from '../src/renderer/components/assets/AssetSelectorControls';

function Wrapper() {
  const [query, setQuery] = React.useState('');
  const [zoom, setZoom] = React.useState(64);
  const [filters, setFilters] = React.useState<(typeof FILTERS)[number][]>([]);
  const toggleFilter = (f: (typeof FILTERS)[number]) => {
    setFilters((prev) =>
      prev.includes(f) ? prev.filter((p) => p !== f) : [...prev, f]
    );
  };
  return (
    <AssetSelectorControls
      query={query}
      setQuery={setQuery}
      zoom={zoom}
      setZoom={setZoom}
      filters={filters}
      toggleFilter={toggleFilter}
    />
  );
}

describe('AssetSelectorControls', () => {
  it('updates query and zoom and toggles filters', () => {
    render(<Wrapper />);
    const input = screen.getByPlaceholderText('Search texture');
    fireEvent.change(input, { target: { value: 'stone' } });
    expect(input).toHaveValue('stone');
    const slider = screen.getByLabelText('Zoom') as HTMLInputElement;
    fireEvent.change(slider, { target: { value: '80' } });
    expect(slider.value).toBe('80');
    const badge = screen.getByRole('button', { name: 'Items' });
    fireEvent.click(badge);
    expect(badge).toHaveClass('badge-primary');
    fireEvent.keyDown(badge, { key: 'Enter' });
    expect(badge).not.toHaveClass('badge-primary');
  });
});
