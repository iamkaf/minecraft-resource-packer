import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PreviewPane from '../src/renderer/components/PreviewPane';

describe('PreviewPane zoom behaviour', () => {
  it('zooms image with mouse wheel', () => {
    render(<PreviewPane texture="foo.png" />);
    const pane = screen.getByTestId('preview-pane');
    const img = screen.getByRole('img') as HTMLImageElement;
    fireEvent.wheel(pane, { deltaY: -100 });
    expect(img.style.transform).toBe('scale(2)');
    fireEvent.wheel(pane, { deltaY: 100 });
    expect(img.style.transform).toBe('scale(1)');
  });
});
