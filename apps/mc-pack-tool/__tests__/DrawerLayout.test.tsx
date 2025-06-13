import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DrawerLayout from '../src/renderer/components/DrawerLayout';
import Navbar from '../src/renderer/components/Navbar';

// JSDOM doesn't support layout, so we test DOM structure and toggle behaviour

describe('DrawerLayout', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('collapses to icons on mobile and expands when toggled', () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    render(
      <DrawerLayout view="projects" onNavigate={vi.fn()}>
        <Navbar />
        <div>content</div>
      </DrawerLayout>
    );

    expect(screen.getByText('content')).toBeInTheDocument();
    const label = screen.getByText('Projects');
    expect(label.className).toContain('hidden');
    fireEvent.click(screen.getByTestId('drawer-toggle'));
    expect(label.className).not.toContain('hidden');
  });

  it('shows full drawer on desktop by default', () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    render(
      <DrawerLayout view="projects" onNavigate={vi.fn()}>
        <Navbar />
        <div>content</div>
      </DrawerLayout>
    );

    const label = screen.getByText('Projects');
    expect(label.className).not.toContain('hidden');
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('triggers navigation when menu item clicked', () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    const nav = vi.fn();
    render(
      <DrawerLayout view="projects" onNavigate={nav}>
        <Navbar />
        <div>content</div>
      </DrawerLayout>
    );
    fireEvent.click(screen.getByText('About'));
    expect(nav).toHaveBeenCalledWith('about');
  });
});
