import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import SettingsView from '../src/renderer/views/SettingsView';

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
    } as never;
    getTextureEditor.mockResolvedValue('/usr/bin/gimp');
    setTextureEditor.mockResolvedValue(undefined);
    getTheme.mockResolvedValue('system');
    setTheme.mockResolvedValue(undefined);
    getConfetti.mockResolvedValue(true);
    setConfetti.mockResolvedValue(undefined);
    getDefaultExportDir.mockResolvedValue('/home');
    setDefaultExportDir.mockResolvedValue(undefined);
  });

  it('renders placeholder heading', () => {
    render(<SettingsView />);
    const section = screen.getByTestId('settings-view');
    expect(section).toHaveTextContent('Settings');
  });

  it('opens help link externally', () => {
    render(<SettingsView />);
    const link = screen.getByRole('link', { name: 'Help' });
    link.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true })
    );
    expect(openExternalMock).toHaveBeenCalledWith(
      'https://minecraft.wiki/w/Options'
    );
  });

  it('loads and saves external editor path', async () => {
    render(<SettingsView />);
    const input = await screen.findByLabelText('External texture editor');
    expect(input).toHaveValue('/usr/bin/gimp');
    fireEvent.change(input, { target: { value: '/opt/editor' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Save' })[0]);
    expect(setTextureEditor).toHaveBeenCalledWith('/opt/editor');
  });

  it('loads and saves default export folder', async () => {
    render(<SettingsView />);
    const input = await screen.findByLabelText('Default export folder');
    expect(input).toHaveValue('/home');
    fireEvent.change(input, { target: { value: '/out' } });
    const btn = screen.getAllByRole('button', { name: 'Save' })[1];
    fireEvent.click(btn);
    expect(setDefaultExportDir).toHaveBeenCalledWith('/out');
  });

  it('changes theme via dropdown', async () => {
    render(<SettingsView />);
    const select = await screen.findByLabelText('Theme');
    fireEvent.change(select, { target: { value: 'dark' } });
    await Promise.resolve();
    expect(setTheme).toHaveBeenCalledWith('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe(
      'minecraft'
    );
  });

  it('toggles confetti preference', async () => {
    render(<SettingsView />);
    const toggle = await screen.findByLabelText('Confetti effects');
    expect(toggle).toBeChecked();
    fireEvent.click(toggle);
    expect(setConfetti).toHaveBeenCalledWith(false);
  });
});
