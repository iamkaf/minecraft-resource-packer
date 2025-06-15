import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Tab } from '../../../src/renderer/components/daisy/navigation';

describe('Tab', () => {
  it('renders button with role tab', () => {
    render(<Tab>Tab 1</Tab>);
    const btn = screen.getByRole('tab');
    expect(btn).toHaveClass('tab');
    expect(btn).toHaveTextContent('Tab 1');
  });
});
