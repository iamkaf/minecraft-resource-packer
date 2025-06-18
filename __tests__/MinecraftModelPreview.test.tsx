import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import * as THREE from 'three';

import MinecraftModelPreview from '../src/renderer/components/assets/MinecraftModelPreview';

// Minimal mock for r3f
let frameCb:
  | ((state: { clock: { getElapsedTime: () => number } }) => void)
  | null = null;
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: (cb: typeof frameCb) => {
    frameCb = cb;
  },
}));
vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="ctrl" />,
}));

// Mock WebGL renderer so three doesn't try to access real context
let lastGroup: THREE.Group | null = null;
vi.mock('three', async () => {
  const actual: typeof THREE = await vi.importActual('three');
  class WebGLRenderer {
    domElement = document.createElement('canvas');
    setPixelRatio() {}
    setSize() {}
    render() {}
    dispose() {}
  }
  class TextureLoader {
    load(url: string, onLoad?: (t: THREE.Texture) => void) {
      const tex = new actual.Texture();
      onLoad?.(tex);
      return tex;
    }
  }
  const groups: THREE.Group[] = [];
  class Group {
    rotation = { y: 0 };
    children: unknown[] = [];
    add(obj: unknown) {
      this.children.push(obj);
    }
    constructor() {
      groups.push(this as unknown as THREE.Group);
    }
  }
  return { ...actual, WebGLRenderer, TextureLoader, Group, __groups: groups };
});

const sampleModel = {
  textures: {
    particle: 'minecraft:block/stone',
    top: 'minecraft:block/stone',
    side: 'minecraft:block/cobblestone',
    bottom: 'minecraft:block/dirt',
  },
  elements: [
    {
      from: [0, 0, 0],
      to: [16, 16, 16],
      faces: {
        north: { texture: '#side' },
        south: { texture: '#side' },
        east: { texture: '#side' },
        west: { texture: '#side' },
        up: { texture: '#top' },
        down: { texture: '#bottom' },
      },
    },
  ],
};

describe('MinecraftModelPreview', () => {
  beforeEach(() => {
    frameCb = null;
  });

  it('renders without crashing', () => {
    const getTex = vi.fn(() => 'vanilla://block/stone');
    render(
      <MinecraftModelPreview
        modelType="block"
        modelJson={sampleModel}
        getTexture={getTex}
      />
    );
    expect(
      document.querySelector('[data-testid="canvas"]')
    ).toBeInTheDocument();
  });

  it('rotates model over time', () => {
    const getTex = vi.fn(() => 'vanilla://block/stone');
    render(
      <MinecraftModelPreview
        modelType="block"
        modelJson={sampleModel}
        getTexture={getTex}
      />
    );
    expect(frameCb).toBeTruthy();
    const groups = (THREE as unknown as { __groups: THREE.Group[] }).__groups;
    lastGroup = groups[groups.length - 1];
    frameCb!({ clock: { getElapsedTime: () => 1 } });
    expect(lastGroup.rotation.y).toBeCloseTo(0.5);
  });

  it('invokes getTexture for each texture key', () => {
    const getTex = vi.fn(() => 'vanilla://block/stone');
    render(
      <MinecraftModelPreview
        modelType="block"
        modelJson={sampleModel}
        getTexture={getTex}
      />
    );
    expect(getTex).toHaveBeenCalledWith('block', 'minecraft:block/stone');
    expect(getTex).toHaveBeenCalledWith('block', 'minecraft:block/cobblestone');
    expect(getTex).toHaveBeenCalledWith('block', 'minecraft:block/dirt');
  });
});
