import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Prose } from '../../../src/renderer/components/daisy/typography';

describe('Prose', () => {
  it('renders', () => {
    render(
      <Prose>
        <p>text</p>
      </Prose>
    );
    expect(screen.getByTestId('prose')).toBeInTheDocument();
  });
});
