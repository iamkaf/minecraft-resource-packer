import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { SetPath, electronAPI } from './test-utils';
import ProjectInfoPanel from '../src/renderer/components/project/ProjectInfoPanel';

const meta = {
  version: '1.21.1',
  description: 'desc',
  author: 'me',
  urls: ['https://a.com'],
  created: 0,
  license: '',
};

describe('ProjectInfoPanel metadata editing', () => {
  const save = electronAPI.savePackMeta as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    electronAPI.loadPackMeta.mockResolvedValue(meta);
    electronAPI.savePackMeta.mockResolvedValue(undefined);
    electronAPI.openInFolder.mockImplementation(() => undefined);
    vi.clearAllMocks();
  });

  it('saves edited metadata using inline form', async () => {
    render(
      <SetPath path="/p/Pack">
        <ProjectInfoPanel
          onExport={vi.fn()}
          onBack={vi.fn()}
          onSettings={vi.fn()}
        />
      </SetPath>
    );

    const input = await screen.findByTestId('description-input');
    fireEvent.change(input, { target: { value: 'new desc' } });
    fireEvent.click(screen.getByText('Save'));
    expect(save).toHaveBeenCalledWith(
      'Pack',
      expect.objectContaining({ description: 'new desc' })
    );
    expect((input as HTMLTextAreaElement).value).toBe('new desc');
  });
});
