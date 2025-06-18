import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import AudioPanel from '../src/renderer/components/assets/assetInfo/AudioPanel';

describe('AudioPanel', () => {
  it('renders nothing', () => {
    const { container } = render(<AudioPanel />);
    expect(container.firstChild).toBeNull();
  });
});
