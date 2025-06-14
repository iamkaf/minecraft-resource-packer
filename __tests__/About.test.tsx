import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import About from '../src/renderer/components/About';
import pkg from '../package.json';

// eslint-disable-next-line no-var
var openExternalMock: ReturnType<typeof vi.fn>;
vi.mock('electron', () => ({
  shell: { openExternal: (openExternalMock = vi.fn()) },
}));

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

  it('opens links externally', () => {
    render(<About />);
    const gh = screen.getByText('GitHub');
    const docs = screen.getByText('Documentation');
    gh.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true })
    );
    docs.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true })
    );
    expect(openExternalMock).toHaveBeenCalledWith(
      'https://github.com/iamkaf/minecraft-resource-packer'
    );
    expect(openExternalMock).toHaveBeenCalledWith(
      'https://github.com/iamkaf/minecraft-resource-packer/blob/main/docs/developer-handbook.md'
    );
  });
});
