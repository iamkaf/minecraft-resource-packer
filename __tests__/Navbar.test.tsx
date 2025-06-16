import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import Navbar from '../src/renderer/components/Navbar';

// Ensure consistent DOM for each test
let getTheme: ReturnType<typeof vi.fn>;
let setTheme: ReturnType<typeof vi.fn>;

beforeEach(() => {
  document.body.innerHTML = '';
  document.documentElement.setAttribute('data-theme', 'minecraft');
  getTheme = vi.fn().mockResolvedValue('dark');
  setTheme = vi.fn();
  (window as unknown as { electronAPI: unknown }).electronAPI = {
    getTheme,
    setTheme,
  } as never;
});

describe('Navbar', () => {
  it('displays app title', () => {
    render(<Navbar onNavigate={vi.fn()} />);
    expect(screen.getByTestId('app-title')).toHaveTextContent(
      'Minecraft Resource Packer'
    );
  });

  it('toggles theme and calls setTheme', async () => {
    render(<Navbar onNavigate={vi.fn()} />);
    const button = screen.getByLabelText('Toggle theme');
    await fireEvent.click(button);
    await Promise.resolve();
    expect(setTheme).toHaveBeenCalledWith('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('calls onNavigate when nav buttons clicked', () => {
    const nav = vi.fn();
    render(<Navbar onNavigate={nav} />);
    fireEvent.click(screen.getByText('Projects'));
    expect(nav).toHaveBeenCalledWith('manager');
    fireEvent.click(screen.getByText('Settings'));
    expect(nav).toHaveBeenCalledWith('settings');
    fireEvent.click(screen.getByText('About'));
    expect(nav).toHaveBeenCalledWith('about');
  });
});
