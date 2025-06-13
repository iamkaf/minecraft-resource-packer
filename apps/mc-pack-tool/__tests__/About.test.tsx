import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import About from '../src/renderer/components/About';
import pkg from '../package.json';

describe('About', () => {
  it('shows logo, version and license', () => {
    render(<About />);
    expect(screen.getByAltText('App logo')).toBeInTheDocument();
    expect(
      screen.getByText(`Minecraft Resource Packer v${pkg.version}`)
    ).toBeInTheDocument();
    expect(screen.getByTestId('license')).toHaveTextContent('MIT License');
    expect(screen.getByText('GitHub').getAttribute('href')).toContain(
      'github.com'
    );
  });
});
