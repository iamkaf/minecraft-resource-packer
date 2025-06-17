import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import TextureLab from '../src/renderer/components/TextureLab';
import { ProjectProvider } from '../src/renderer/components/ProjectProvider';
import { SetPath, electronAPI } from './test-utils';

describe('TextureLab', () => {
  it('renders modal with controls', () => {
    let changed:
      | ((e: unknown, args: { path: string; stamp: number }) => void)
      | undefined;
    electronAPI.onFileChanged.mockImplementation((cb) => {
      changed = cb;
    });

    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <TextureLab file="/proj/foo.png" onClose={() => {}} />
        </SetPath>
      </ProjectProvider>
    );
    expect(screen.getByTestId('daisy-modal')).toBeInTheDocument();
    expect(screen.getByText('Texture Lab')).toBeInTheDocument();
    const img = screen.getByAltText('preview') as HTMLImageElement;
    expect(img).toHaveAttribute('src', 'asset://foo.png');
    act(() => {
      changed?.({}, { path: 'foo.png', stamp: 1 });
    });
    expect(img.src).toContain('t=1');
  });
});
