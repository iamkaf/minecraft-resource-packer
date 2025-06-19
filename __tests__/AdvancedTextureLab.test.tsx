import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import AdvancedTextureLab from '../src/renderer/components/editor/AdvancedTextureLab';
import { ProjectProvider } from '../src/renderer/components/providers/ProjectProvider';
import { SetPath, electronAPI } from './test-utils';

vi.mock('fabric', () => {
  const mockImage = {
    width: 2,
    height: 2,
    rotate: vi.fn(),
    flipX: false,
    flipY: false,
    set: vi.fn(),
  };
  const canvasInstance = {
    add: vi.fn(),
    setActiveObject: vi.fn(),
    getActiveObject: vi.fn(() => mockImage),
    setWidth: vi.fn(),
    setHeight: vi.fn(),
    dispose: vi.fn(),
    renderAll: vi.fn(),
  };
  return {
    Canvas: vi.fn(() => canvasInstance),
    Image: { fromURL: vi.fn(() => Promise.resolve(mockImage)) },
  };
});

describe('AdvancedTextureLab', () => {
  it('sends edit ops to IPC on save', async () => {
    electronAPI.applyImageEdits.mockResolvedValue(undefined);
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AdvancedTextureLab file="/proj/foo.png" />
        </SetPath>
      </ProjectProvider>
    );
    await act(async () => {
      await Promise.resolve();
    });
    const rotateBtn = screen.getByText('Rotate');
    await act(async () => {
      fireEvent.click(rotateBtn);
      await Promise.resolve();
    });
    const saveBtn = screen.getByText('Save');
    await act(async () => {
      fireEvent.click(saveBtn);
      await Promise.resolve();
    });
    expect(electronAPI.applyImageEdits).toHaveBeenCalled();
  });
});
