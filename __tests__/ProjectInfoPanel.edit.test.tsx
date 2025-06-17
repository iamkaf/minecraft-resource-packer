import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('@monaco-editor/react', () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => (
    <textarea
      data-testid="editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));
import { ProjectProvider } from '../src/renderer/components/ProjectProvider';
import { SetPath, electronAPI } from './test-utils';
import ProjectInfoPanel from '../src/renderer/components/ProjectInfoPanel';

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

  it('opens modal and saves edited metadata', async () => {
    render(
      <ProjectProvider>
        <SetPath path="/p/Pack">
          <ProjectInfoPanel
            onExport={vi.fn()}
            onBack={vi.fn()}
            onSettings={vi.fn()}
          />
        </SetPath>
      </ProjectProvider>
    );

    await screen.findByText('desc');
    fireEvent.click(screen.getByText('desc'));
    await screen.findByTestId('daisy-modal');
    fireEvent.change(screen.getByTestId('editor'), {
      target: {
        value: JSON.stringify({ ...meta, description: 'new desc' }, null, 2),
      },
    });
    fireEvent.click(screen.getByText('Save'));
    expect(save).toHaveBeenCalledWith(
      'Pack',
      expect.objectContaining({ description: 'new desc' })
    );
    await screen.findByText('new desc');
  });
});
