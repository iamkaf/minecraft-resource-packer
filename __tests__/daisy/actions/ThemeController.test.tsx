import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ThemeController from '../../../src/renderer/components/daisy/actions/ThemeController';

describe('daisy ThemeController', () => {
  it('renders select', () => {
    render(<ThemeController />);
    expect(screen.getByTestId('theme-controller')).toBeInTheDocument();
  });
});
