import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TextureDiff from '../src/renderer/components/TextureDiff';
import {
  ProjectProvider,
  useProject,
} from '../src/renderer/components/ProjectProvider';

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

describe('TextureDiff', () => {
  it('renders vanilla comparison', async () => {
    const getTextureUrl = vi.fn().mockResolvedValue('vanilla://foo.png');
    (
      window as unknown as {
        electronAPI: { getTextureUrl: typeof getTextureUrl };
      }
    ).electronAPI = {
      getTextureUrl,
    } as never;

    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <TextureDiff asset="block/a.png" onClose={() => undefined} />
        </SetPath>
      </ProjectProvider>
    );

    expect(getTextureUrl).toHaveBeenCalledWith('/proj', 'block/a.png');
    expect(await screen.findByTestId('diff')).toBeInTheDocument();
    const imgs = screen.getAllByRole('img');
    expect(imgs[0]).toHaveAttribute('src', 'vanilla://foo.png');
    expect(imgs[1]).toHaveAttribute('src', 'asset://block/a.png');
  });

  it('calls onClose', async () => {
    const getTextureUrl = vi.fn().mockResolvedValue('vanilla://foo.png');
    const onClose = vi.fn();
    (
      window as unknown as {
        electronAPI: { getTextureUrl: typeof getTextureUrl };
      }
    ).electronAPI = {
      getTextureUrl,
    } as never;

    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <TextureDiff asset="block/a.png" onClose={onClose} />
        </SetPath>
      </ProjectProvider>
    );

    const btn = await screen.findByRole('button', { name: 'Close' });
    fireEvent.click(btn);
    expect(onClose).toHaveBeenCalled();
  });
});
