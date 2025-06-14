import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ShellLayout from '../src/renderer/components/ShellLayout';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('ShellLayout', () => {
  it('highlights active view and triggers navigation', () => {
    const nav = vi.fn();
    render(
      <ShellLayout view="projects" onNavigate={nav}>
        <div>content</div>
      </ShellLayout>
    );
    expect(screen.getByText('content')).toBeInTheDocument();
    const projects = screen.getByText('Projects');
    expect(projects.className).toContain('active');
    fireEvent.click(screen.getByText('About'));
    expect(nav).toHaveBeenCalledWith('about');
  });
});
