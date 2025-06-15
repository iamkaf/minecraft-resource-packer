import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Diff from '../../../src/renderer/components/daisy/display/Diff';

describe('Diff', () => {
  it('renders', () => {
    render(<Diff before="a" after="b" />);
    expect(screen.getByTestId('diff')).toBeInTheDocument();
  });
});
