import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TextureLab from '../src/renderer/components/TextureLab';
import {
  ProjectProvider,
  useProject,
} from '../src/renderer/components/ProjectProvider';

describe('TextureLab', () => {
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
  it('renders modal with controls', () => {
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <TextureLab file="/proj/foo.png" onClose={() => {}} />
        </SetPath>
      </ProjectProvider>
    );
    expect(screen.getByTestId('daisy-modal')).toBeInTheDocument();
    expect(screen.getByText('Texture Lab')).toBeInTheDocument();
    const img = screen.getByAltText('preview');
    expect(img).toHaveAttribute('src', 'asset://foo.png');
  });
});
