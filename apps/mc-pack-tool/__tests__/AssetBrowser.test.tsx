import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import AssetBrowser from '../src/renderer/components/AssetBrowser';

const onMock = vi.fn();
const closeMock = vi.fn();

vi.mock('chokidar', () => ({
  watch: vi.fn(() => ({ on: onMock, close: closeMock })),
}));

vi.mock('fs', () => ({
  default: {
    readdirSync: vi.fn(() => [
      { name: 'a.txt', isDirectory: () => false },
      { name: 'b.png', isDirectory: () => false },
    ]),
  },
}));

describe('AssetBrowser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders files from directory', () => {
    render(<AssetBrowser path="/proj" />);
    expect(screen.getByText('a.txt')).toBeInTheDocument();
    const img = screen.getByAltText('b.png') as HTMLImageElement;
    expect(img.src).toContain('ptex://b.png');
  });
});
