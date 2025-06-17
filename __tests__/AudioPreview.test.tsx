import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AudioPreview from '../src/renderer/components/assets/AudioPreview';

describe('AudioPreview', () => {
  it('renders modal with audio source', () => {
    render(<AudioPreview asset="foo.ogg" onClose={() => {}} />);
    const modal = screen.getByTestId('daisy-modal');
    expect(modal).toBeInTheDocument();
    const audio = screen.getByTestId('audio-player');
    const src = audio.querySelector('source') as HTMLSourceElement;
    expect(src.getAttribute('src')).toBe('asset://foo.ogg');
  });
});
