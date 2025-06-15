import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TextureLab from '../src/renderer/components/TextureLab';

describe('TextureLab', () => {
  it('renders modal with controls', () => {
    render(<TextureLab file="foo.png" onClose={() => {}} />);
    expect(screen.getByTestId('texture-lab')).toBeInTheDocument();
    expect(screen.getByText('Texture Lab')).toBeInTheDocument();
  });
});
