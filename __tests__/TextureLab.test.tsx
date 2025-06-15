import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TextureLab from '../src/renderer/components/TextureLab';

describe('TextureLab component', () => {
  it('renders modal', () => {
    render(<TextureLab file="foo.png" onClose={() => {}} />);
    expect(screen.getByTestId('texture-lab')).toBeInTheDocument();
    expect(screen.getByText('Texture Lab')).toBeInTheDocument();
  });
});
