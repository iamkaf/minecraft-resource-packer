import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectProvider } from '../src/renderer/components/providers/ProjectProvider';
import { SetPath, electronAPI } from './test-utils';
import AssetSelectorInfoPanel from '../src/renderer/components/assets/AssetSelectorInfoPanel';

describe('AssetSelectorInfoPanel', () => {
  it('shows placeholder when no asset', () => {
    render(
      <ProjectProvider>
        <SetPath path="/p">
          <AssetSelectorInfoPanel asset={null} />
        </SetPath>
      </ProjectProvider>
    );
    expect(screen.getByText('No asset selected')).toBeInTheDocument();
  });

  it('displays asset name', () => {
    render(
      <ProjectProvider>
        <SetPath path="/p">
          <AssetSelectorInfoPanel asset="block/a.png" />
        </SetPath>
      </ProjectProvider>
    );
    expect(screen.getByText('block/a.png')).toBeInTheDocument();
  });

  it('adds asset on button click', () => {
    const addTexture = vi.fn();
    electronAPI.addTexture.mockImplementation(addTexture);
    render(
      <ProjectProvider>
        <SetPath path="/p">
          <AssetSelectorInfoPanel asset="block/a.png" />
        </SetPath>
      </ProjectProvider>
    );
    screen.getByText('Add').click();
    expect(addTexture).toHaveBeenCalledWith('/p', 'block/a.png');
  });
});
