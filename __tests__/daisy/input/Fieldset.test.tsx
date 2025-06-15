import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Fieldset } from '../../../src/renderer/components/daisy/input';

describe('Fieldset', () => {
  it('renders', () => {
    render(<Fieldset data-testid="fs">content</Fieldset>);
    expect(screen.getByTestId('fs')).toBeInTheDocument();
  });
});
