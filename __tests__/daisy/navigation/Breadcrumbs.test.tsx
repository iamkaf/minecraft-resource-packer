import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Breadcrumbs } from '../../../src/renderer/components/daisy/navigation';

describe('Breadcrumbs', () => {
  it('renders breadcrumbs container', () => {
    const { container } = render(
      <Breadcrumbs>
        <li>
          <a>Home</a>
        </li>
      </Breadcrumbs>
    );
    expect(container.firstChild).toHaveClass('breadcrumbs');
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});
