import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Hero from '../../../src/renderer/components/daisy/layout/Hero';

describe('Hero', () => {
  it('renders hero', () => {
    const { container } = render(<Hero>hero</Hero>);
    expect(container.firstChild).toHaveClass('hero');
  });
});
