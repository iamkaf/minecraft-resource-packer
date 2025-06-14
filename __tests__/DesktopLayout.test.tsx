import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DesktopLayout from '../src/renderer/components/DesktopLayout';
import Navbar from '../src/renderer/components/Navbar';

// Basic layout tests similar to DrawerLayout but without responsive logic

describe('DesktopLayout', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders children and sidebar', () => {
    render(
      <DesktopLayout view="projects" onNavigate={vi.fn()}>
        <Navbar />
        <div>content</div>
      </DesktopLayout>
    );
    expect(screen.getByText('content')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-title')).toHaveTextContent(
      'Minecraft Resource Packer'
    );
  });

  it('triggers navigation when menu item clicked', () => {
    const nav = vi.fn();
    render(
      <DesktopLayout view="projects" onNavigate={nav}>
        <Navbar />
        <div>content</div>
      </DesktopLayout>
    );
    fireEvent.click(screen.getByText('About'));
    expect(nav).toHaveBeenCalledWith('about');
  });
});
