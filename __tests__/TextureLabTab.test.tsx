import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import TextureLabTab from '../src/renderer/components/editor/TextureLabTab';
import { useAppStore } from '../src/renderer/store';
import { SetPath, electronAPI } from './test-utils';

describe('TextureLabTab', () => {
  beforeEach(() => {
    useAppStore.setState({ selectedAssets: [] });
  });
  it('shows hint when no texture selected', () => {
    render(
      <SetPath path="/proj">
        <TextureLabTab />
      </SetPath>
    );
    expect(screen.getByText(/Select a PNG/)).toBeInTheDocument();
  });

  it('renders controls for selected texture', () => {
    electronAPI.onFileChanged.mockImplementation(() => () => undefined);
    useAppStore.getState().setSelectedAssets(['foo.png']);
    render(
      <SetPath path="/proj">
        <TextureLabTab />
      </SetPath>
    );
    expect(screen.getByTestId('texture-lab-view')).toBeInTheDocument();
    expect(screen.getByAltText('preview')).toBeInTheDocument();
  });
});
