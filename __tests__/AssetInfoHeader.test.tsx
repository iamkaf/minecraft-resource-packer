import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AssetInfoHeader from '../src/renderer/components/assets/AssetInfoHeader';

vi.mock('../src/renderer/components/assets/PreviewPane', () => ({
  __esModule: true,
  default: ({ texture }: { texture: string | null }) => (
    <div data-testid="preview" data-texture={texture ?? ''} />
  ),
}));

describe('AssetInfoHeader', () => {
  it('shows png actions and fires callbacks', async () => {
    const ext = vi.fn();
    const lab = vi.fn();
    const diff = vi.fn();
    const revs = vi.fn();
    render(
      <AssetInfoHeader
        asset="foo.png"
        count={1}
        isText={false}
        isPng
        isAudio={false}
        stamp={1}
        onOpenExternal={ext}
        onOpenLab={lab}
        onOpenDiff={diff}
        onOpenRevisions={revs}
      />
    );
    screen.getByText('Edit Externally').click();
    screen.getByText('Open Texture Lab').click();
    screen.getByText('Compare with Vanilla').click();
    screen.getByText('Revisions').click();
    expect(ext).toHaveBeenCalled();
    expect(lab).toHaveBeenCalled();
    expect(diff).toHaveBeenCalled();
    expect(revs).toHaveBeenCalled();
    const preview = await screen.findByTestId('preview');
    expect(preview.getAttribute('data-texture')).toBe('foo.png');
  });

  it('shows text actions', () => {
    const save = vi.fn();
    const reset = vi.fn();
    render(
      <AssetInfoHeader
        asset="a.txt"
        count={1}
        isText
        isPng={false}
        isAudio={false}
        onSave={save}
        onReset={reset}
      />
    );
    screen.getByText('Save').click();
    screen.getByText('Reset').click();
    expect(save).toHaveBeenCalled();
    expect(reset).toHaveBeenCalled();
  });
});
