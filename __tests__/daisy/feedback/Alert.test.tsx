import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import Alert from '../../../src/renderer/components/daisy/feedback/Alert';

describe('Alert', () => {
  it('renders variant and size', () => {
    render(
      <Alert variant="success" size="lg" className="extra">
        done
      </Alert>
    );
    const el = screen.getByRole('alert');
    expect(el).toHaveTextContent('done');
    expect(el).toHaveClass('alert-success');
    expect(el).toHaveClass('alert-lg');
    expect(el).toHaveClass('extra');
  });
});
