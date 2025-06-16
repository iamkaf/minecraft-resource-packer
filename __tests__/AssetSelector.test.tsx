import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import {
  ProjectProvider,
  useProject,
} from '../src/renderer/components/ProjectProvider';

import AssetSelector from '../src/renderer/components/AssetSelector';
import {
  ProjectProvider,
  useProject,
} from '../src/renderer/components/ProjectProvider';

describe('AssetSelector', () => {
  const listTextures = vi.fn();
  const addTexture = vi.fn();
  const getTextureUrl = vi.fn();

  beforeEach(() => {
    interface ElectronAPI {
      listTextures: (path: string) => Promise<string[]>;
      addTexture: (path: string, texture: string) => Promise<void>;
      getTextureUrl: (project: string, tex: string) => Promise<string>;
    }
    (window as unknown as { electronAPI: ElectronAPI }).electronAPI = {
      listTextures,
      addTexture,
      getTextureUrl,
    };
    listTextures.mockResolvedValue([
      'block/grass.png',
      'item/axe.png',
      'other/custom.png',
    ]);
    getTextureUrl.mockImplementation((_p, n) => `vanilla://${n}`);
    vi.clearAllMocks();
  });

  function SetPath({
    path,
    children,
  }: {
    path: string;
    children: React.ReactNode;
  }) {
    const { setPath } = useProject();
    const [ready, setReady] = React.useState(false);
    React.useEffect(() => {
      setPath(path);
      setReady(true);
    }, [path]);
    return ready ? <>{children}</> : null;
  }

  it('lists textures and handles selection', async () => {
    const onSelect = vi.fn();
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetSelector onAssetSelect={onSelect} />
        </SetPath>
      </ProjectProvider>
    );
    expect(listTextures).toHaveBeenCalledWith('/proj');
    const input = screen.getByPlaceholderText('Search texture');
    fireEvent.change(input, { target: { value: 'grass' } });
    const section = await screen.findByText('blocks');
    expect(section.parentElement).not.toBeNull();
    const sectionParent = section.parentElement as HTMLElement;
    const button = within(sectionParent).getByRole('button', {
      name: 'block/grass.png',
    });
    const img = within(sectionParent).getByAltText('Grass') as HTMLImageElement;
    expect(getTextureUrl).toHaveBeenCalledWith('/proj', 'block/grass.png');
    expect(img.src).toContain('vanilla://block/grass.png');
    fireEvent.click(button);
    expect(addTexture).not.toHaveBeenCalled();
    expect(onSelect).toHaveBeenCalledWith('block/grass.png');
  });

  it('shows items in the items category', async () => {
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetSelector />
        </SetPath>
      </ProjectProvider>
    );
    const input = screen.getByPlaceholderText('Search texture');
    fireEvent.change(input, { target: { value: 'axe' } });
    const section = await screen.findByText('items');
    expect(section.parentElement).not.toBeNull();
    const itemParent = section.parentElement as HTMLElement;
    expect(
      within(itemParent).getByRole('button', {
        name: 'item/axe.png',
      })
    ).toBeInTheDocument();
  });

  it('puts uncategorized textures into misc', async () => {
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetSelector />
        </SetPath>
      </ProjectProvider>
    );
    const input = screen.getByPlaceholderText('Search texture');
    fireEvent.change(input, { target: { value: 'custom' } });
    const section = await screen.findByText('misc');
    expect(section.parentElement).not.toBeNull();
    const miscParent = section.parentElement as HTMLElement;
    expect(
      within(miscParent).getByRole('button', {
        name: 'other/custom.png',
      })
    ).toBeInTheDocument();
  });

  it('adjusts zoom level with slider', async () => {
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetSelector />
        </SetPath>
      </ProjectProvider>
    );
    const input = screen.getByPlaceholderText('Search texture');
    fireEvent.change(input, { target: { value: 'grass' } });
    const img = (await screen.findByAltText('Grass')) as HTMLImageElement;
    expect(img.style.width).toBe('64px');
    expect(img.style.imageRendering).toBe('pixelated');
    const slider = screen.getByLabelText('Zoom');
    fireEvent.change(slider, { target: { value: '100' } });
    expect(img.style.width).toBe('100px');
  });

  it('renders only visible items', async () => {
    listTextures.mockResolvedValue(
      Array.from({ length: 50 }, (_, i) => `block/test${i}.png`)
    );
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetSelector />
        </SetPath>
      </ProjectProvider>
    );
    const input = screen.getByPlaceholderText('Search texture');
    fireEvent.change(input, { target: { value: 'test' } });
    await screen.findByText('blocks');
    expect(
      screen.getAllByRole('button', { name: /block\/test/ }).length
    ).toBeLessThan(50);
  });

  it('shows tree view', async () => {
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetSelector />
        </SetPath>
      </ProjectProvider>
    );
    const input = screen.getByPlaceholderText('Search texture');
    fireEvent.change(input, { target: { value: 'grass' } });
    await screen.findByText('blocks');
    fireEvent.click(screen.getByText('Tree'));
    expect(screen.getByText('block')).toBeInTheDocument();
    expect(screen.getByText('grass.png')).toBeInTheDocument();
  });
});
