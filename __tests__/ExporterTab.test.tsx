import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import os from 'os';
import path from 'path';
import ExporterTab from '../src/renderer/components/editor/ExporterTab';
import { SetPath } from './test-utils';

describe('ExporterTab', () => {
  it('calls onExport when button clicked', () => {
    const onExport = vi.fn();
    render(
      <SetPath path={path.join(os.tmpdir(), 'proj')}>
        <ExporterTab onExport={onExport} />
      </SetPath>
    );
    fireEvent.click(screen.getByText('Export Pack'));
    expect(onExport).toHaveBeenCalled();
  });
});
