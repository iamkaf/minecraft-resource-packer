import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import {
  EditorViewSkeleton,
  SettingsViewSkeleton,
  AboutViewSkeleton,
  ProjectManagerSkeleton,
  ProjectInfoPanelSkeleton,
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

  it('renders info panel skeleton', () => {
    render(<ProjectInfoPanelSkeleton />);
    expect(screen.getByTestId('info-panel-skeleton')).toBeInTheDocument();
  });
});
