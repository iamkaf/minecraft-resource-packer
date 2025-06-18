import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AssetCategorySection from '../src/renderer/components/assets/AssetCategorySection';

vi.mock('../src/renderer/components/assets/AssetBrowserItem', () => ({
  __esModule: true,
  default: ({ file }: { file: string }) => <div data-testid="item">{file}</div>,
}));

describe('AssetCategorySection', () => {
  it('renders items inside accordion', () => {
    render(
      <AssetCategorySection
        title="blocks"
        files={['a.png']}
        projectPath="/proj"
        versions={{ 'a.png': 1 }}
        zoom={64}
      />
    );
    expect(screen.getByText('blocks')).toBeInTheDocument();
    expect(screen.getByTestId('item')).toHaveTextContent('a.png');
  });

  it('returns null for empty list', () => {
    const { container } = render(
      <AssetCategorySection
        title="blocks"
        files={[]}
        projectPath="/p"
        versions={{}}
        zoom={64}
      />
    );
    expect(container.firstChild).toBeNull();
  });
});
