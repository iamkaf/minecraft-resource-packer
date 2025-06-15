import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from '../../../src/renderer/components/daisy/display/Card';

describe('Card', () => {
  it('renders', () => {
    render(<Card title="Title">Body</Card>);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });
});
