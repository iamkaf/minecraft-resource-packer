import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import {
  EditorViewSkeleton,
  SettingsViewSkeleton,
  AboutViewSkeleton,
  ProjectManagerSkeleton,
  ProjectSidebarSkeleton,
} from '../src/renderer/components/skeleton';

describe('View skeletons', () => {
  it('renders editor skeleton', () => {
    render(<EditorViewSkeleton />);
    expect(screen.getByTestId('editor-skeleton')).toBeInTheDocument();
  });

  it('renders settings skeleton', () => {
    render(<SettingsViewSkeleton />);
    expect(screen.getByTestId('settings-skeleton')).toBeInTheDocument();
  });

  it('renders about skeleton', () => {
    render(<AboutViewSkeleton />);
    expect(screen.getByTestId('about-skeleton')).toBeInTheDocument();
  });

  it('renders manager skeleton', () => {
    render(<ProjectManagerSkeleton />);
    expect(screen.getByTestId('manager-skeleton')).toBeInTheDocument();
  });

  it('renders sidebar skeleton', () => {
    render(<ProjectSidebarSkeleton />);
    expect(screen.getByTestId('sidebar-skeleton')).toBeInTheDocument();
  });
});
