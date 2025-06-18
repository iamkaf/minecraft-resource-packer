import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ShortcutSettings from '../src/renderer/views/settings/ShortcutSettings';

describe('ShortcutSettings', () => {
  it('renders shortcut list', () => {
    render(<ShortcutSettings />);
    expect(screen.getByText(/open all selected projects/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('kbd')[0]).toHaveTextContent('Enter');
  });
});
