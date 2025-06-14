import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import SettingsView from '../src/renderer/views/SettingsView';

describe('SettingsView', () => {
  it('renders placeholder heading', () => {
    render(<SettingsView />);
    const section = screen.getByTestId('settings-view');
    expect(section).toHaveTextContent('Settings');
  });
});
