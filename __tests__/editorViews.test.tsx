import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SetPath } from './test-utils';
import BrowserView from '../src/renderer/views/editor/BrowserView';
import TextureLabView from '../src/renderer/views/editor/TextureLabView';
import ExporterView from '../src/renderer/views/editor/ExporterView';

vi.mock('../src/renderer/components/editor/AssetBrowserTab', () => ({
  __esModule: true,
  default: () => <div data-testid="asset-browser-tab" />,
}));
vi.mock('../src/renderer/components/editor/TextureLabTab', () => ({
  __esModule: true,
  default: () => <div data-testid="texture-lab-view" />,
}));
vi.mock('../src/renderer/components/editor/ExporterTab', () => ({
  __esModule: true,
  default: () => <div data-testid="exporter-tab" />,
}));

describe('Editor tab views', () => {
  it('renders AssetBrowserTab', () => {
    render(
      <MemoryRouter>
        <SetPath path="/proj">
          <BrowserView onExport={() => {}} />
        </SetPath>
      </MemoryRouter>
    );
    expect(screen.getByTestId('asset-browser-tab')).toBeInTheDocument();
  });

  it('renders TextureLabTab', () => {
    render(
      <MemoryRouter>
        <SetPath path="/proj">
          <TextureLabView />
        </SetPath>
      </MemoryRouter>
    );
    expect(screen.getByTestId('texture-lab-view')).toBeInTheDocument();
  });

  it('renders ExporterTab', () => {
    render(
      <MemoryRouter>
        <SetPath path="/proj">
          <ExporterView onExport={() => {}} />
        </SetPath>
      </MemoryRouter>
    );
    expect(screen.getByTestId('exporter-tab')).toBeInTheDocument();
  });
});
