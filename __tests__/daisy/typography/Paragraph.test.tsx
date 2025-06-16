import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Paragraph } from '../../../src/renderer/components/daisy/typography';

describe('Paragraph', () => {
  it('renders', () => {
    render(<Paragraph>Text</Paragraph>);
    expect(screen.getByTestId('paragraph')).toBeInTheDocument();
  });
});
