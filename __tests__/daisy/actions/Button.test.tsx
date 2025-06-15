import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from '../../../src/renderer/components/daisy/actions/Button';
describe('daisy Button', () => {
  it('renders button', () => {
    render(<Button>Click</Button>);
    expect(screen.getByTestId('daisy-button')).toBeInTheDocument();
  });
});
