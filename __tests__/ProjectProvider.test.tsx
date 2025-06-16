import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  ProjectProvider,
  useProject,
} from '../src/renderer/components/ProjectProvider';

function TestComp() {
  const { path, setPath } = useProject();
  return (
    <div>
      <span>{path ?? 'none'}</span>
      <button onClick={() => setPath('/foo')}>set</button>
    </div>
  );
}

describe('ProjectProvider', () => {
  it('provides path state and updater', () => {
    render(
      <ProjectProvider>
        <TestComp />
      </ProjectProvider>
    );
    expect(screen.getByText('none')).toBeInTheDocument();
    fireEvent.click(screen.getByText('set'));
    expect(screen.getByText('/foo')).toBeInTheDocument();
  });
});
