import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

import EditorView from '../src/renderer/views/EditorView';

vi.mock('react-canvas-confetti', () => ({
  __esModule: true,
  default: () => <canvas />,
}));
vi.mock('../src/renderer/components/AssetSelector', () => ({
  default: () => <div>selector</div>,
}));
vi.mock('../src/renderer/components/AssetBrowser', () => ({
  default: () => <div>browser</div>,
}));

const summary = {
  fileCount: 1,
  totalSize: 1024,
  durationMs: 1000,
  warnings: [],
};

describe('EditorView', () => {
  const exportProject = vi.fn();

  beforeEach(() => {
    interface API {
      exportProject: (path: string) => Promise<typeof summary>;
    }
    (window as unknown as { electronAPI: API }).electronAPI = {
      exportProject,
    };
    exportProject.mockResolvedValue(summary);
    vi.clearAllMocks();
  });

  it('shows project path and exports pack', async () => {
    render(<EditorView projectPath="/tmp/proj" onBack={() => undefined} />);
    expect(screen.getByText('Project: /tmp/proj')).toBeInTheDocument();
    const btn = screen.getByText('Export Pack');
    await act(async () => {
      fireEvent.click(btn);
      await Promise.resolve();
    });
    expect(exportProject).toHaveBeenCalledWith('/tmp/proj');
    expect(screen.getByTestId('export-summary')).toBeInTheDocument();
  });

  it('calls onBack when Back clicked', () => {
    const back = vi.fn();
    render(<EditorView projectPath="/tmp" onBack={back} />);
    fireEvent.click(screen.getByText('Back to Projects'));
    expect(back).toHaveBeenCalled();
  });
});
