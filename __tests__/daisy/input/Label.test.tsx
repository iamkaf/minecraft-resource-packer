import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Label } from '../../../src/renderer/components/daisy/input';

describe('Label', () => {
  it('renders', () => {
    render(<Label data-testid="lab">L</Label>);
    expect(screen.getByTestId('lab')).toBeInTheDocument();
  });
});
