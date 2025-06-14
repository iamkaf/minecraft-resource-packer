import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ShellLayout from '../src/renderer/components/ShellLayout';
import Navbar from '../src/renderer/components/Navbar';

describe('ShellLayout', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders children and highlights active view', () => {
    render(
      <ShellLayout view="projects" onNavigate={vi.fn()}>
        <Navbar />
        <div>content</div>
      </ShellLayout>
    );
    expect(screen.getByText('content')).toBeInTheDocument();
    const link = screen.getByText('Projects').closest('a');
    expect(link?.className).toContain('active');
  });

  it('triggers navigation when menu item clicked', () => {
    const nav = vi.fn();
    render(
      <ShellLayout view="projects" onNavigate={nav}>
        <Navbar />
        <div>content</div>
      </ShellLayout>
    );
    fireEvent.click(screen.getByText('About'));
    expect(nav).toHaveBeenCalledWith('about');
  });
});
