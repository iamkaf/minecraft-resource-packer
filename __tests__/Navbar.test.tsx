import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';

import Navbar from '../src/renderer/components/Navbar';

function HashSync() {
  const location = useLocation();
  React.useEffect(() => {
    window.location.hash = `#${location.pathname}`;
  }, [location]);
  return null;
}

const renderNav = () =>
  render(
    <MemoryRouter>
      <HashSync />
      <Navbar />
    </MemoryRouter>
  );

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
    renderNav();
    expect(screen.getByTestId('app-title')).toHaveTextContent(
      'Minecraft Resource Packer'
    );
  });

  it('toggles theme and calls setTheme', async () => {
    renderNav();
    const button = screen.getByLabelText('Toggle theme');
    await fireEvent.click(button);
    await Promise.resolve();
    expect(setTheme).toHaveBeenCalledWith('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('updates hash when nav buttons clicked', () => {
    renderNav();
    fireEvent.click(screen.getByText('Projects'));
    expect(window.location.hash).toBe('#/');
    fireEvent.click(screen.getByText('Settings'));
    expect(window.location.hash).toBe('#/settings');
    fireEvent.click(screen.getByText('About'));
    expect(window.location.hash).toBe('#/about');
  });
});
