import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  ProjectProvider,
  useProject,
} from '../src/renderer/components/ProjectProvider';
import UndoRedoProvider from '../src/renderer/components/UndoRedoProvider';
import AssetSelectorInfoPanel from '../src/renderer/components/AssetSelectorInfoPanel';

describe('AssetSelectorInfoPanel', () => {
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
  it('shows placeholder when no asset', () => {
    render(
      <ProjectProvider>
        <UndoRedoProvider>
          <SetPath path="/p">
            <AssetSelectorInfoPanel asset={null} />
          </SetPath>
        </UndoRedoProvider>
      </ProjectProvider>
    );
    expect(screen.getByText('No asset selected')).toBeInTheDocument();
  });

  it('displays asset name', () => {
    render(
      <ProjectProvider>
        <UndoRedoProvider>
          <SetPath path="/p">
            <AssetSelectorInfoPanel asset="block/a.png" />
          </SetPath>
        </UndoRedoProvider>
      </ProjectProvider>
    );
    expect(screen.getByText('block/a.png')).toBeInTheDocument();
  });

  it('adds asset on button click', () => {
    const addTexture = vi.fn();
    interface API {
      addTexture: typeof addTexture;
    }
    (window as unknown as { electronAPI: API }).electronAPI = { addTexture };
    render(
      <ProjectProvider>
        <UndoRedoProvider>
          <SetPath path="/p">
            <AssetSelectorInfoPanel asset="block/a.png" />
          </SetPath>
        </UndoRedoProvider>
      </ProjectProvider>
    );
    screen.getByText('Add').click();
    expect(addTexture).toHaveBeenCalledWith('/p', 'block/a.png');
  });
});
