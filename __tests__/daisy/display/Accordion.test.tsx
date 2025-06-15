import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Accordion from '../../../src/renderer/components/daisy/display/Accordion';

describe('Accordion', () => {
  it('renders', () => {
    render(<Accordion title="Title">Content</Accordion>);
    expect(screen.getByTestId('accordion')).toBeInTheDocument();
  });
});
