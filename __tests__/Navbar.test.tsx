import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import Navbar from '../src/renderer/components/Navbar';

// Ensure consistent DOM for each test
beforeEach(() => {
  document.body.innerHTML = '';
  document.documentElement.setAttribute('data-theme', 'minecraft');
  localStorage.clear();
});

describe('Navbar', () => {
  it('displays app title', () => {
    render(<Navbar />);
    expect(screen.getByTestId('app-title')).toHaveTextContent(
      'Minecraft Resource Packer'
    );
  });

  it('toggles theme and saves preference', () => {
    render(<Navbar />);
    const button = screen.getByLabelText('Toggle theme');
    fireEvent.click(button);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
