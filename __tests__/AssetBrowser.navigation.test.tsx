import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectProvider } from '../src/renderer/components/providers/ProjectProvider';
import { SetPath, electronAPI } from './test-utils';
import AssetBrowser from '../src/renderer/components/assets/AssetBrowser';

const watchProject = vi.fn(async () => [
  'a.png',
  'b.png',
  'c.png',
  'd.png',
  'e.png',
  'f.png',
  'g.png',
  'h.png',
]);
const unwatchProject = vi.fn();
const onFileAdded = vi.fn();
const onFileRemoved = vi.fn();
const onFileRenamed = vi.fn();
const onFileChanged = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  electronAPI.watchProject.mockImplementation(watchProject);
  electronAPI.unwatchProject.mockImplementation(unwatchProject);
  electronAPI.onFileAdded.mockImplementation(onFileAdded);
  electronAPI.onFileRemoved.mockImplementation(onFileRemoved);
  electronAPI.onFileRenamed.mockImplementation(onFileRenamed);
  electronAPI.onFileChanged.mockImplementation(onFileChanged);
  electronAPI.getNoExport.mockResolvedValue([]);
  electronAPI.setNoExport.mockImplementation(() => undefined);
  electronAPI.getAssetSearch.mockResolvedValue('');
  electronAPI.getAssetFilters.mockResolvedValue([]);
  electronAPI.getAssetZoom.mockResolvedValue(64);
  electronAPI.setAssetSearch.mockImplementation(() => undefined);
  electronAPI.setAssetFilters.mockImplementation(() => undefined);
  electronAPI.setAssetZoom.mockImplementation(() => undefined);
});

describe('AssetBrowser thumbnail navigation', () => {
  it('moves selection with arrow keys', async () => {
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetBrowser />
        </SetPath>
      </ProjectProvider>
    );
    await screen.findAllByText('a.png');
    const wrapper = screen.getByTestId('asset-browser');
    wrapper.focus();

    fireEvent.keyDown(wrapper, { key: 'ArrowRight' });
    const bItem = screen
      .getAllByText('b.png')[0]
      .closest('div[tabindex="0"]') as HTMLElement;
    expect(bItem).toHaveClass('ring');
    expect(bItem).toHaveFocus();

    fireEvent.keyDown(wrapper, { key: 'ArrowLeft' });
    const aItem = screen
      .getAllByText('a.png')[0]
      .closest('div[tabindex="0"]') as HTMLElement;
    expect(aItem).toHaveClass('ring');
    expect(aItem).toHaveFocus();

    fireEvent.keyDown(wrapper, { key: 'ArrowDown' });
    const gItem = screen
      .getAllByText('g.png')[0]
      .closest('div[tabindex="0"]') as HTMLElement;
    expect(gItem).toHaveClass('ring');
    expect(gItem).toHaveFocus();

    fireEvent.keyDown(wrapper, { key: 'ArrowUp' });
    const againA = screen
      .getAllByText('a.png')[0]
      .closest('div[tabindex="0"]') as HTMLElement;
    expect(againA).toHaveClass('ring');
    expect(againA).toHaveFocus();
  });
});
