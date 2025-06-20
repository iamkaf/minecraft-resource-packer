import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FileInput } from '../../../src/renderer/components/daisy/input';

describe('FileInput', () => {
  it('renders variant and size', () => {
    render(<FileInput data-testid="file" variant="primary" size="sm" />);
    const el = screen.getByTestId('file');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('file-input-primary');
    expect(el).toHaveClass('file-input-sm');
  });
});
