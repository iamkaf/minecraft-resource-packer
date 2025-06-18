import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AssetInfoHeader from '../src/renderer/components/assets/AssetInfoHeader';
import {
  EditorContext,
  EditorTab,
} from '../src/renderer/components/providers/EditorProvider';

vi.mock('../src/renderer/components/assets/PreviewPane', () => ({
  __esModule: true,
  default: ({ texture }: { texture: string | null }) => (
    <div data-testid="preview" data-texture={texture ?? ''} />
  ),
}));

describe('AssetInfoHeader', () => {
  it('shows png actions and fires callbacks', async () => {
    const ext = vi.fn();
    const openLab = vi.fn();
    const diff = vi.fn();
    const revs = vi.fn();
    render(
      <EditorContext.Provider
        value={{
          tab: 'browser' as EditorTab,
          setTab: vi.fn(),
          labFile: null,
          labStamp: undefined,
          openLab,
        }}
      >
        <AssetInfoHeader
          asset="foo.png"
          count={1}
          isText={false}
          isPng
          isAudio={false}
          stamp={1}
          onOpenExternal={ext}
          onOpenDiff={diff}
          onOpenRevisions={revs}
        />
      </EditorContext.Provider>
    );
    screen.getByText('Edit Externally').click();
    screen.getByText('Open Texture Lab').click();
    screen.getByText('Compare with Vanilla').click();
    screen.getByText('Revisions').click();
    expect(ext).toHaveBeenCalled();
    expect(openLab).toHaveBeenCalled();
    expect(diff).toHaveBeenCalled();
    expect(revs).toHaveBeenCalled();
    const preview = await screen.findByTestId('preview');
    expect(preview.getAttribute('data-texture')).toBe('foo.png');
  });

  it('shows text actions', () => {
    const save = vi.fn();
    const reset = vi.fn();
    render(
      <EditorContext.Provider
        value={{
          tab: 'browser' as EditorTab,
          setTab: vi.fn(),
          labFile: null,
          labStamp: undefined,
          openLab: vi.fn(),
        }}
      >
        <AssetInfoHeader
          asset="a.txt"
          count={1}
          isText
          isPng={false}
          isAudio={false}
          onSave={save}
          onReset={reset}
        />
      </EditorContext.Provider>
    );
    screen.getByText('Save').click();
    screen.getByText('Reset').click();
    expect(save).toHaveBeenCalled();
    expect(reset).toHaveBeenCalled();
  });
});
