import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FileInput } from '../../../src/renderer/components/daisy/input';

describe('FileInput', () => {
  it('renders', () => {
    render(<FileInput data-testid="file" />);
    expect(screen.getByTestId('file')).toBeInTheDocument();
  });
});
