import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TextureLabTab from '../src/renderer/components/editor/TextureLabTab';
import { ProjectProvider } from '../src/renderer/components/providers/ProjectProvider';
import { EditorProvider } from '../src/renderer/components/editor';
import { SetPath, electronAPI } from './test-utils';

describe('TextureLabTab', () => {
  it('shows hint when no texture selected', () => {
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <EditorProvider value={{ selected: [], setSelected: vi.fn() }}>
            <TextureLabTab />
          </EditorProvider>
        </SetPath>
      </ProjectProvider>
    );
    expect(screen.getByText(/Select a PNG/)).toBeInTheDocument();
  });

  it('renders controls for selected texture', () => {
    electronAPI.onFileChanged.mockImplementation(() => () => undefined);
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <EditorProvider
            value={{ selected: ['foo.png'], setSelected: vi.fn() }}
          >
            <TextureLabTab />
          </EditorProvider>
        </SetPath>
      </ProjectProvider>
    );
    expect(screen.getByTestId('texture-lab-view')).toBeInTheDocument();
    expect(screen.getByAltText('preview')).toBeInTheDocument();
  });
});
