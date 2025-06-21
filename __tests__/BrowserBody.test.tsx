import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BrowserBody from '../src/renderer/components/assets/BrowserBody';
import { useAppStore } from '../src/renderer/store';

describe('BrowserBody', () => {
  it('renders categories and file tree', () => {
    useAppStore.setState({ selectedAssets: [] });
    render(
      <BrowserBody
        projectPath="/proj"
        files={[
          'assets/minecraft/textures/block/stone.png',
          'lang/en_us.json',
        ]}
        versions={{}}
        zoom={64}
        onControlsChange={() => {}}
      />
    );
    expect(screen.getByRole('heading', { name: 'blocks' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'lang' })).toBeInTheDocument();
    expect(screen.getByTestId('file-tree')).toBeInTheDocument();
  });
});
