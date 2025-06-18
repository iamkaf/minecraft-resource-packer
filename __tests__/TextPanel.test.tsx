import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TextPanel from '../src/renderer/components/assets/assetInfo/TextPanel';

vi.mock('@monaco-editor/react', () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => (
    <textarea
      data-testid="editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

describe('TextPanel', () => {
  it('renders editor and updates text', () => {
    const setText = vi.fn();
    render(
      <TextPanel text="a" setText={setText} error={null} isJson={false} />
    );
    const box = screen.getByTestId('editor');
    fireEvent.change(box, { target: { value: 'b' } });
    expect(setText).toHaveBeenCalledWith('b');
  });
});
