import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectInfoPanel from '../src/renderer/components/ProjectInfoPanel';

describe('ProjectInfoPanel', () => {
  it('loads metadata and exports', async () => {
    const load = vi.fn(async () => ({
      description: 'desc',
      author: '',
      urls: [],
      created: 0,
    }));
    const exportFn = vi.fn();
    interface API {
      loadPackMeta: typeof load;
    }
    (window as unknown as { electronAPI: API }).electronAPI = {
      loadPackMeta: load,
    };
    render(<ProjectInfoPanel projectPath="/path/proj" onExport={exportFn} />);
    expect(load).toHaveBeenCalledWith('proj');
    fireEvent.click(screen.getByText('Export Pack'));
    expect(exportFn).toHaveBeenCalled();
  });
});
