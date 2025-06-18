import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GeneralSettings from '../src/renderer/views/settings/GeneralSettings';
import ToastProvider from '../src/renderer/components/providers/ToastProvider';

const getTextureEditor = vi.fn();
const setTextureEditor = vi.fn();
const getDefaultExportDir = vi.fn();
const setDefaultExportDir = vi.fn();
const getOpenLastProject = vi.fn();
const setOpenLastProject = vi.fn();

beforeEach(() => {
  (window as unknown as { electronAPI: Record<string, unknown> }).electronAPI =
    {
      getTextureEditor,
      setTextureEditor,
      getDefaultExportDir,
      setDefaultExportDir,
      getOpenLastProject,
      setOpenLastProject,
    };
  getTextureEditor.mockResolvedValue('/usr/bin/gimp');
  setTextureEditor.mockResolvedValue(undefined);
  getDefaultExportDir.mockResolvedValue('/home');
  setDefaultExportDir.mockResolvedValue(undefined);
  getOpenLastProject.mockResolvedValue(true);
  setOpenLastProject.mockResolvedValue(undefined);
});

describe('GeneralSettings', () => {
  it('loads and saves values', async () => {
    render(
      <ToastProvider>
        <GeneralSettings />
      </ToastProvider>
    );
    const editorInput = await screen.findByLabelText('External texture editor');
    expect(editorInput).toHaveValue('/usr/bin/gimp');
    fireEvent.change(editorInput, { target: { value: '/opt/editor' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Save' })[0]);
    expect(setTextureEditor).toHaveBeenCalledWith('/opt/editor');

    const exportInput = await screen.findByLabelText('Default export folder');
    expect(exportInput).toHaveValue('/home');
    fireEvent.change(exportInput, { target: { value: '/out' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Save' })[1]);
    expect(setDefaultExportDir).toHaveBeenCalledWith('/out');
  });

  it('toggles open last project', async () => {
    render(
      <ToastProvider>
        <GeneralSettings />
      </ToastProvider>
    );
    const toggle = await screen.findByLabelText(
      'Open the most recently used project on startup'
    );
    expect(toggle).toBeChecked();
    fireEvent.click(toggle);
    expect(setOpenLastProject).toHaveBeenCalledWith(false);
  });
});
