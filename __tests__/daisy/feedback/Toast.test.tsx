import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import Toast from '../../../src/renderer/components/daisy/feedback/Toast';

describe('Toast', () => {
  it('renders with position', () => {
    render(
      <Toast position="top">
        <span>hello</span>
      </Toast>
    );
    const el = screen.getByText('hello').parentElement;
    expect(el).toHaveClass('toast-top');
  });
});
