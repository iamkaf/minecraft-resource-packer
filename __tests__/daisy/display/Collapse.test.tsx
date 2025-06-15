import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Collapse from '../../../src/renderer/components/daisy/display/Collapse';

describe('Collapse', () => {
  it('renders', () => {
    render(<Collapse title="Title">Content</Collapse>);
    expect(screen.getByTestId('collapse')).toBeInTheDocument();
  });
});
