import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import SettingsView from '../src/renderer/views/SettingsView';

// eslint-disable-next-line no-var
var openExternalMock: ReturnType<typeof vi.fn>;
vi.mock('electron', () => ({
  shell: { openExternal: (openExternalMock = vi.fn()) },
}));

describe('SettingsView', () => {
  beforeEach(() => {
    openExternalMock.mockResolvedValue(undefined);
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
});
