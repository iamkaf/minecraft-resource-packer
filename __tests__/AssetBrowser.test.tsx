import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { ProjectProvider } from '../src/renderer/components/providers/ProjectProvider';
import { SetPath, electronAPI } from './test-utils';
import path from 'path';

import AssetBrowser from '../src/renderer/components/assets/AssetBrowser';

const watchProject = vi.fn(async () => ['a.txt', 'b.png']);
const unwatchProject = vi.fn();
const onFileAdded = vi.fn(() => () => undefined);
const onFileRemoved = vi.fn(() => () => undefined);
const onFileRenamed = vi.fn(() => () => undefined);
const onFileChanged = vi.fn(() => () => undefined);

describe('AssetBrowser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    watchProject.mockResolvedValue(['a.txt', 'b.png']);
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

  it('renders files from directory', async () => {
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetBrowser />
        </SetPath>
      </ProjectProvider>
    );
    expect(watchProject).toHaveBeenCalledWith('/proj');
    expect((await screen.findAllByText('a.txt'))[0]).toBeInTheDocument();
    const img = screen.getByAltText('B') as HTMLImageElement;
    expect(img.src).toContain('asset://b.png');
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getAllByText('b.png')[0]).toBeInTheDocument();
    expect(img.style.imageRendering).toBe('pixelated');
  });

  it('filters out .history files', async () => {
    watchProject.mockResolvedValue(['.history/a.txt', 'visible.txt']);
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetBrowser />
        </SetPath>
      </ProjectProvider>
    );
    expect((await screen.findAllByText('visible.txt')).length).toBeGreaterThan(
      0
    );
    expect(screen.queryByText('a.txt')).toBeNull();
  });

  it('hides project.json', async () => {
    watchProject.mockResolvedValue(['project.json', 'visible.txt']);
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetBrowser />
        </SetPath>
      </ProjectProvider>
    );
    expect((await screen.findAllByText('visible.txt')).length).toBeGreaterThan(
      0
    );
    expect(screen.queryByText('project.json')).toBeNull();
  });

  it('context menu triggers IPC calls', async () => {
    const openInFolder = vi.fn();
    const openFile = vi.fn();
    const renameFile = vi.fn();
    const deleteFile = vi.fn();
    electronAPI.openInFolder.mockImplementation(openInFolder);
    electronAPI.openFile.mockImplementation(openFile);
    electronAPI.renameFile.mockImplementation(renameFile);
    electronAPI.deleteFile.mockImplementation(deleteFile);
    electronAPI.watchProject.mockImplementation(watchProject);
    electronAPI.unwatchProject.mockImplementation(unwatchProject);
    electronAPI.onFileAdded.mockImplementation(onFileAdded);
    electronAPI.onFileRemoved.mockImplementation(onFileRemoved);
    electronAPI.onFileRenamed.mockImplementation(onFileRenamed);
    electronAPI.onFileChanged.mockImplementation(onFileChanged);
    electronAPI.getNoExport.mockResolvedValue([]);
    electronAPI.setNoExport.mockImplementation(() => undefined);
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetBrowser />
        </SetPath>
      </ProjectProvider>
    );
    const item = (await screen.findAllByText('a.txt'))[0];
    fireEvent.contextMenu(item);
    const revealBtn = (
      await screen.findAllByRole('menuitem', { name: 'Reveal' })
    )[0];
    fireEvent.click(revealBtn);
    expect(openInFolder).toHaveBeenCalledWith(path.join('/proj', 'a.txt'));
    fireEvent.contextMenu(item);
    fireEvent.click(
      (await screen.findAllByRole('menuitem', { name: 'Open' }))[0]
    );
    expect(openFile).toHaveBeenCalledWith(path.join('/proj', 'a.txt'));
    fireEvent.contextMenu(item);
    fireEvent.click(
      (await screen.findAllByRole('menuitem', { name: 'Rename' }))[0]
    );
    const rmodal = await screen.findByTestId('daisy-modal');
    const input = within(rmodal).getByDisplayValue('a.txt');
    fireEvent.change(input, { target: { value: 'renamed.txt' } });
    const form = input.closest('form');
    if (!form) throw new Error('form not found');
    fireEvent.submit(form);
    expect(renameFile).toHaveBeenCalledWith(
      path.join('/proj', 'a.txt'),
      path.join('/proj', 'renamed.txt')
    );
    expect(screen.queryByTestId('daisy-modal')).toBeNull();
    fireEvent.contextMenu(item);
    fireEvent.click(
      (await screen.findAllByRole('menuitem', { name: 'Delete' }))[0]
    );
    expect(deleteFile).toHaveBeenCalledWith(path.join('/proj', 'a.txt'));
  });

  it('updates when file watcher events fire', async () => {
    let added: ((e: unknown, p: string) => void) | undefined;
    let removed: ((e: unknown, p: string) => void) | undefined;
    let renamed:
      | ((e: unknown, args: { oldPath: string; newPath: string }) => void)
      | undefined;
    let changed:
      | ((e: unknown, args: { path: string; stamp: number }) => void)
      | undefined;
    onFileAdded.mockImplementation((cb) => {
      added = cb;
    });
    onFileRemoved.mockImplementation((cb) => {
      removed = cb;
    });
    onFileRenamed.mockImplementation((cb) => {
      renamed = cb;
    });
    onFileChanged.mockImplementation((cb) => {
      changed = cb;
    });

    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetBrowser />
        </SetPath>
      </ProjectProvider>
    );
    await screen.findAllByText('a.txt');

    added?.({}, 'c.txt');
    expect((await screen.findAllByText('c.txt'))[0]).toBeInTheDocument();

    removed?.({}, 'a.txt');
    await screen.findAllByText('c.txt');
    expect(screen.queryByText('a.txt')).toBeNull();

    renamed?.({}, { oldPath: 'b.png', newPath: 'd.png' });
    await screen.findAllByText('d.png');
    expect(screen.queryByText('b.png')).toBeNull();
    expect(screen.getAllByText('d.png')[0]).toBeInTheDocument();

    const img = screen.getByAltText('D') as HTMLImageElement;
    const before = img.src;

    await act(async () => {
      changed?.({}, { path: 'd.png', stamp: 42 });
    });
    const updated = await screen.findByAltText('D');
    expect(updated.src).not.toBe(before);
    expect(updated.src).toContain('t=42');
  });

  it('supports multi selection and delete key', async () => {
    const deleteFile = vi.fn();
    electronAPI.deleteFile.mockImplementation(deleteFile);
    electronAPI.watchProject.mockImplementation(watchProject);
    electronAPI.unwatchProject.mockImplementation(unwatchProject);
    electronAPI.onFileAdded.mockImplementation(onFileAdded);
    electronAPI.onFileRemoved.mockImplementation(onFileRemoved);
    electronAPI.onFileRenamed.mockImplementation(onFileRenamed);
    electronAPI.onFileChanged.mockImplementation(onFileChanged);
    electronAPI.getNoExport.mockResolvedValue([]);
    electronAPI.setNoExport.mockImplementation(() => undefined);
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetBrowser />
        </SetPath>
      </ProjectProvider>
    );
    const a = (await screen.findAllByText('a.txt'))[0];
    const b = screen.getAllByText('b.png')[0];
    fireEvent.click(a);
    fireEvent.click(b, { ctrlKey: true });
    const wrapper = screen.getByTestId('asset-browser');
    fireEvent.keyDown(wrapper, { key: 'Delete' });
    expect(deleteFile).toHaveBeenCalledTimes(2);
  });

  it('toggles noExport for selected files', async () => {
    const setNoExport = vi.fn();
    const getNoExport = vi.fn(async () => []);
    electronAPI.setNoExport.mockImplementation(setNoExport);
    electronAPI.getNoExport.mockImplementation(getNoExport);
    electronAPI.watchProject.mockImplementation(watchProject);
    electronAPI.unwatchProject.mockImplementation(unwatchProject);
    electronAPI.onFileAdded.mockImplementation(onFileAdded);
    electronAPI.onFileRemoved.mockImplementation(onFileRemoved);
    electronAPI.onFileRenamed.mockImplementation(onFileRenamed);
    electronAPI.onFileChanged.mockImplementation(onFileChanged);
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetBrowser />
        </SetPath>
      </ProjectProvider>
    );
    const a = (await screen.findAllByText('a.txt'))[0];
    const b = screen.getAllByText('b.png')[0];
    fireEvent.click(a);
    fireEvent.click(b, { ctrlKey: true });
    fireEvent.contextMenu(a);
    const menus = await screen.findAllByRole('menu');
    const menu = menus.find(
      (m) => (m as HTMLElement).style.display === 'block'
    ) as HTMLElement;
    const toggle = within(menu).getByRole('checkbox', { name: /No Export/i });
    fireEvent.click(toggle);
    expect(setNoExport).toHaveBeenCalledWith('/proj', ['a.txt', 'b.png'], true);
  });

  it('shows noExport files dimmed', async () => {
    const getNoExport = vi.fn(async () => ['a.txt']);
    electronAPI.getNoExport.mockImplementation(getNoExport);
    electronAPI.setNoExport.mockImplementation(() => undefined);
    electronAPI.watchProject.mockImplementation(watchProject);
    electronAPI.unwatchProject.mockImplementation(unwatchProject);
    electronAPI.onFileAdded.mockImplementation(onFileAdded);
    electronAPI.onFileRemoved.mockImplementation(onFileRemoved);
    electronAPI.onFileRenamed.mockImplementation(onFileRenamed);
    electronAPI.onFileChanged.mockImplementation(onFileChanged);
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetBrowser />
        </SetPath>
      </ProjectProvider>
    );
    const el = (await screen.findAllByText('a.txt'))[0];
    const container = el.closest('div[tabindex="0"]') as HTMLElement;
    expect(container.className).toMatch(/border-gray-400/);
    const inner = container.querySelector('figure') as HTMLElement;
    expect(inner.className).toMatch(/opacity-50/);
  });

  it('filters by search and adjusts zoom', async () => {
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetBrowser />
        </SetPath>
      </ProjectProvider>
    );
    await screen.findAllByText('a.txt');
    const search = screen.getByPlaceholderText('Search files');
    fireEvent.change(search, { target: { value: 'b.png' } });
    expect(screen.queryByText('a.txt')).toBeNull();
    expect(screen.getAllByText('b.png')[0]).toBeInTheDocument();
    const slider = screen.getByLabelText('Zoom');
    const img = screen.getByAltText('B') as HTMLImageElement;
    expect(img.style.width).toBe('64px');
    fireEvent.change(slider, { target: { value: '80' } });
    expect(img.style.width).toBe('80px');
  });

  it('filters by category chip', async () => {
    watchProject.mockResolvedValue([
      'assets/minecraft/textures/block/stone.png',
      'assets/minecraft/textures/item/apple.png',
    ]);
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetBrowser />
        </SetPath>
      </ProjectProvider>
    );
    await screen.findAllByText('stone.png');
    const itemsChip = screen.getByText('Items');
    fireEvent.click(itemsChip);
    expect(itemsChip).toHaveClass('badge-primary');
    expect(screen.queryByText('stone.png')).toBeNull();
    expect(screen.getAllByText('apple.png')[0]).toBeInTheDocument();
  });

  it('renders grid and tree together', async () => {
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetBrowser />
        </SetPath>
      </ProjectProvider>
    );
    await screen.findAllByText('a.txt');
    expect(screen.getByTestId('file-tree')).toBeInTheDocument();
    expect(screen.getAllByText('a.txt')[0]).toBeInTheDocument();
    const tree = screen.getByTestId('file-tree');
    expect(within(tree).getByAltText('b.png')).toBeInTheDocument();
  });
});
