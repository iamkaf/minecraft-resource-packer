import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Modal from '../../../src/renderer/components/daisy/actions/Modal';

describe('daisy Modal', () => {
  it('renders modal when open and uses custom test id', () => {
    render(
      <Modal open testId="custom">
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });
});
