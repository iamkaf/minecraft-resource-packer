import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import SettingsView from '../src/renderer/views/SettingsView';

// eslint-disable-next-line no-var
var openExternalMock: ReturnType<typeof vi.fn>;
const getTextureEditor = vi.fn();
const setTextureEditor = vi.fn();
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
        };
      }
    ).electronAPI = { getTextureEditor, setTextureEditor } as never;
    getTextureEditor.mockResolvedValue('/usr/bin/gimp');
    setTextureEditor.mockResolvedValue(undefined);
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
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(setTextureEditor).toHaveBeenCalledWith('/opt/editor');
  });
});
