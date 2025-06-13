import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import DrawerLayout from '../src/renderer/components/DrawerLayout';
import Navbar from '../src/renderer/components/Navbar';

// JSDOM doesn't support layout, so we test DOM structure and toggle behaviour

describe('DrawerLayout', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders children and menu', () => {
    render(
      <DrawerLayout>
        <Navbar />
        <div>content</div>
      </DrawerLayout>
    );
    expect(screen.getByText('content')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('contains drawer toggle checkbox', () => {
    render(
      <DrawerLayout>
        <Navbar />
        <div>content</div>
      </DrawerLayout>
    );
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });
});
