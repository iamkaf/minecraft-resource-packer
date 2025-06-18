import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import os from 'os';

import SettingsView from '../src/renderer/views/SettingsView';
import ToastProvider from '../src/renderer/components/providers/ToastProvider';

const getOpenLastProject = vi.fn();
const setOpenLastProject = vi.fn();
const getTextureEditor = vi.fn();
const getTheme = vi.fn();
const getConfetti = vi.fn();
const getDefaultExportDir = vi.fn();

beforeEach(() => {
  (
    window as unknown as {
      electronAPI: {
        getTextureEditor: typeof getTextureEditor;
        setTextureEditor: () => void;
        getTheme: typeof getTheme;
        setTheme: () => void;
        getConfetti: typeof getConfetti;
        setConfetti: () => void;
        getDefaultExportDir: typeof getDefaultExportDir;
        setDefaultExportDir: () => void;
        getOpenLastProject: typeof getOpenLastProject;
        setOpenLastProject: typeof setOpenLastProject;
      };
    }
  ).electronAPI = {
    getTextureEditor,
    setTextureEditor: vi.fn(),
    getTheme,
    setTheme: vi.fn(),
    getConfetti,
    setConfetti: vi.fn(),
    getDefaultExportDir,
    setDefaultExportDir: vi.fn(),
    getOpenLastProject,
    setOpenLastProject,
  };
  getTextureEditor.mockResolvedValue('');
  getTheme.mockResolvedValue('system');
  getConfetti.mockResolvedValue(true);
  getDefaultExportDir.mockResolvedValue(os.tmpdir());
  getOpenLastProject.mockResolvedValue(true);
  setOpenLastProject.mockResolvedValue(undefined);
});

describe('openLastProject preference', () => {
  it('toggles openLastProject via switch', async () => {
    render(
      <ToastProvider>
        <SettingsView />
      </ToastProvider>
    );
    const toggle = await screen.findByLabelText(
      'Open the most recently used project on startup'
    );
    expect(toggle).toBeChecked();
    fireEvent.click(toggle);
    expect(setOpenLastProject).toHaveBeenCalledWith(false);
    expect(await screen.findAllByText('Preference saved')).toHaveLength(2);
  });
});
