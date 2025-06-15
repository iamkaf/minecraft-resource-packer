import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Status from '../../../src/renderer/components/daisy/display/Status';

describe('Status', () => {
  it('renders', () => {
    render(<Status />);
    expect(screen.getByTestId('status')).toBeInTheDocument();
  });
});
