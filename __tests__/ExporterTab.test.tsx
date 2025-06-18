import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import os from 'os';
import path from 'path';
import ExporterTab from '../src/renderer/components/editor/ExporterTab';
import { ProjectProvider } from '../src/renderer/components/providers/ProjectProvider';
import { EditorProvider } from '../src/renderer/components/editor';
import { SetPath } from './test-utils';

describe('ExporterTab', () => {
  it('calls onExport when button clicked', () => {
    const onExport = vi.fn();
    render(
      <ProjectProvider>
        <SetPath path={path.join(os.tmpdir(), 'proj')}>
          <EditorProvider value={{ selected: [], setSelected: vi.fn() }}>
            <ExporterTab onExport={onExport} />
          </EditorProvider>
        </SetPath>
      </ProjectProvider>
    );
    fireEvent.click(screen.getByText('Export Pack'));
    expect(onExport).toHaveBeenCalled();
  });
});
