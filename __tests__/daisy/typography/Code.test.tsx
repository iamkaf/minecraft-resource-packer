import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Code } from '../../../src/renderer/components/daisy/typography';

describe('Code', () => {
  it('renders', () => {
    render(<Code>const x=1;</Code>);
    expect(screen.getByTestId('code')).toBeInTheDocument();
  });
});
