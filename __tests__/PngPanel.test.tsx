import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import PngPanel from '../src/renderer/components/assets/assetInfo/PngPanel';

describe('PngPanel', () => {
  it('renders nothing', () => {
    const { container } = render(<PngPanel />);
    expect(container.firstChild).toBeNull();
  });
});
