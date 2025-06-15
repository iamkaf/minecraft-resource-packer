import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectInfoPanel from '../src/renderer/components/ProjectInfoPanel';

const meta = { description: 'desc', author: '', urls: [], created: 0 };

describe('ProjectInfoPanel', () => {
  const load = vi.fn();
  const onExport = vi.fn();
  const onBack = vi.fn();

  beforeEach(() => {
    (
      window as unknown as { electronAPI: { loadPackMeta: typeof load } }
    ).electronAPI = {
      loadPackMeta: load,
    } as never;
    load.mockResolvedValue(meta);
    vi.clearAllMocks();
  });

  it('loads metadata and triggers export', async () => {
    render(
      <ProjectInfoPanel
        projectPath="/p/Pack"
        onExport={onExport}
        onBack={onBack}
      />
    );
    expect(load).toHaveBeenCalledWith('Pack');
    await screen.findByText('desc');
    fireEvent.click(screen.getByText('Export Pack'));
    expect(onExport).toHaveBeenCalled();
    fireEvent.click(screen.getByText('Back to Projects'));
    expect(onBack).toHaveBeenCalled();
    expect(screen.getByText('/p/Pack')).toBeInTheDocument();
  });
});
