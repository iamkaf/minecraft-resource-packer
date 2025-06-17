import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import SettingsView from '../src/renderer/views/SettingsView';
import ToastProvider from '../src/renderer/components/ToastProvider';

// eslint-disable-next-line no-var
var openExternalMock: ReturnType<typeof vi.fn>;
const getTextureEditor = vi.fn();
const setTextureEditor = vi.fn();
const getTheme = vi.fn();
const setTheme = vi.fn();
const getConfetti = vi.fn();
const setConfetti = vi.fn();
const getDefaultExportDir = vi.fn();
const setDefaultExportDir = vi.fn();
const getOpenLastProject = vi.fn();
const setOpenLastProject = vi.fn();
vi.mock('electron', () => ({
  shell: { openExternal: (openExternalMock = vi.fn()) },
}));

describe('SettingsView', () => {
  beforeEach(() => {
    openExternalMock.mockResolvedValue(undefined);
    (
      window as unknown as {
        electronAPI: {
          getTextureEditor: typeof getTextureEditor;
          setTextureEditor: typeof setTextureEditor;
          getTheme: typeof getTheme;
          setTheme: typeof setTheme;
          getConfetti: typeof getConfetti;
          setConfetti: typeof setConfetti;
          getDefaultExportDir: typeof getDefaultExportDir;
          setDefaultExportDir: typeof setDefaultExportDir;
          getOpenLastProject: typeof getOpenLastProject;
          setOpenLastProject: typeof setOpenLastProject;
        };
      }
    ).electronAPI = {
      getTextureEditor,
      setTextureEditor,
      getTheme,
      setTheme,
      getConfetti,
      setConfetti,
      getDefaultExportDir,
      setDefaultExportDir,
      getOpenLastProject,
      setOpenLastProject,
    } as never;
    getTextureEditor.mockResolvedValue('/usr/bin/gimp');
    setTextureEditor.mockResolvedValue(undefined);
    getTheme.mockResolvedValue('system');
    setTheme.mockResolvedValue(undefined);
    getConfetti.mockResolvedValue(true);
    setConfetti.mockResolvedValue(undefined);
    getDefaultExportDir.mockResolvedValue('/home');
    setDefaultExportDir.mockResolvedValue(undefined);
    getOpenLastProject.mockResolvedValue(true);
    setOpenLastProject.mockResolvedValue(undefined);
  });

  it('renders placeholder heading', () => {
    render(
      <ToastProvider>
        <SettingsView />
      </ToastProvider>
    );
    const section = screen.getByTestId('settings-view');
    expect(section).toHaveTextContent('Settings');
  });

  it('opens help link externally', () => {
    render(
      <ToastProvider>
        <SettingsView />
      </ToastProvider>
    );
    const link = screen.getByRole('link', { name: 'Help' });
    link.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true })
    );
    expect(openExternalMock).toHaveBeenCalledWith(
      'https://minecraft.wiki/w/Options'
    );
  });

  it('loads and saves external editor path', async () => {
    render(
      <ToastProvider>
        <SettingsView />
      </ToastProvider>
    );
    const input = await screen.findByLabelText('External texture editor');
    expect(input).toHaveValue('/usr/bin/gimp');
    fireEvent.change(input, { target: { value: '/opt/editor' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Save' })[0]);
    expect(setTextureEditor).toHaveBeenCalledWith('/opt/editor');
    expect(await screen.findAllByText('Editor path saved')).toHaveLength(2);
  });

  it('loads and saves default export folder', async () => {
    render(
      <ToastProvider>
        <SettingsView />
      </ToastProvider>
    );
    const input = await screen.findByLabelText('Default export folder');
    await screen.findByDisplayValue('/home');
    fireEvent.change(input, { target: { value: '/out' } });
    const btn = screen.getAllByRole('button', { name: 'Save' })[1];
    fireEvent.click(btn);
    expect(setDefaultExportDir).toHaveBeenCalledWith('/out');
    expect(await screen.findAllByText('Export directory saved')).toHaveLength(
      2
    );
  });

  it('changes theme via dropdown', async () => {
    render(
      <ToastProvider>
        <SettingsView />
      </ToastProvider>
    );
    const select = await screen.findByLabelText('Theme');
    fireEvent.change(select, { target: { value: 'dark' } });
    await Promise.resolve();
    expect(setTheme).toHaveBeenCalledWith('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe(
      'minecraft'
    );
    expect(await screen.findAllByText('Theme updated')).toHaveLength(2);
  });

  it('toggles confetti preference', async () => {
    render(
      <ToastProvider>
        <SettingsView />
      </ToastProvider>
    );
    const toggle = await screen.findByLabelText('Confetti effects');
    expect(toggle).toBeChecked();
    fireEvent.click(toggle);
    expect(setConfetti).toHaveBeenCalledWith(false);
    expect(await screen.findAllByText('Preference saved')).toHaveLength(2);
  });
});
