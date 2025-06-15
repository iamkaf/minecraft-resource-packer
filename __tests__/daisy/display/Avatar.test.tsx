import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Avatar from '../../../src/renderer/components/daisy/display/Avatar';

describe('Avatar', () => {
  it('renders', () => {
    render(<Avatar src="a.png" />);
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
  });
});
