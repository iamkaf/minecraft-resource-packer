import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TextureLab from '../src/renderer/components/TextureLab';

describe('TextureLab', () => {
  it('renders modal with controls', () => {
    render(
      <TextureLab file="/proj/foo.png" projectPath="/proj" onClose={() => {}} />
    );
    expect(screen.getByTestId('daisy-modal')).toBeInTheDocument();
    expect(screen.getByText('Texture Lab')).toBeInTheDocument();
    const img = screen.getByAltText('preview');
    expect(img).toHaveAttribute('src', 'asset://foo.png');
  });
});
