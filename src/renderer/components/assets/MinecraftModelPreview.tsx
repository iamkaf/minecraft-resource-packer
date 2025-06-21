import React, { Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export interface MinecraftModelPreviewProps {
  /** "item" or "block" – influences camera distance */
  modelType: 'item' | 'block';
  /** Raw Java-edition model JSON */
  modelJson: unknown;
  /**
   * Maps a Minecraft texture reference to a URL / data-URI.
   * Receives the modelType ("item" | "block") and the resolved path
   * (e.g. "minecraft:block/oak_planks").
   */
  getTexture: (modelType: 'item' | 'block', mcPath: string) => string;
  width?: number;
  height?: number;
}

/** Render a vanilla Minecraft item/block model using Three.js + R3F. */
export default function MinecraftModelPreview({
  modelType,
  modelJson,
  getTexture,
  width = 300,
  height = 300,
}: MinecraftModelPreviewProps) {
  return (
    <Canvas
      style={{ width, height, borderRadius: 8, background: '#242424' }}
      dpr={window.devicePixelRatio}
      camera={{
        position: modelType === 'item' ? [2.5, 2.5, 2.5] : [3, 3, 3],
        fov: 45,
      }}
    >
      <Suspense fallback={null}>
        <PreviewScene
          modelType={modelType}
          modelJson={modelJson}
          getTexture={getTexture}
        />
      </Suspense>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}

// ───── Helpers ─────
interface ModelData {
  textures?: Record<string, string>;
  elements?: Array<{
    from: [number, number, number];
    to: [number, number, number];
    faces?: Record<string, { texture: string }>;
  }>;
}

function useMinecraftModel(
  modelType: 'item' | 'block',
  modelJson: unknown,
  getTexture: (t: 'item' | 'block', p: string) => string
) {
  return useMemo(() => {
    const group = new THREE.Group();
    const texCache: Record<string, THREE.Texture> = {};
    const loader = new THREE.TextureLoader();

    const resolveTexture = (ref: string) => {
      if (!texCache[ref]) {
        texCache[ref] = loader.load(getTexture(modelType, ref), (t) => {
          t.magFilter = THREE.NearestFilter;
          t.minFilter = THREE.NearestFilter;
          t.needsUpdate = true;
        });
      }
      return texCache[ref];
    };

    try {
      const data = modelJson as ModelData;
      const textureVars = data.textures ?? {};
      const elements = data.elements ?? [];
      elements.forEach((e) => {
        const [x1, y1, z1] = e.from;
        const [x2, y2, z2] = e.to;
        const geom = new THREE.BoxGeometry(
          (x2 - x1) / 16,
          (y2 - y1) / 16,
          (z2 - z1) / 16
        );

        const particleKey = e.faces?.north?.texture?.slice(1) ?? 'particle';
        const defaultMat = new THREE.MeshBasicMaterial({
          map: resolveTexture(textureVars[particleKey] ?? ''),
        });
        const mats: THREE.MeshBasicMaterial[] = Array(6).fill(defaultMat);

        const faceMap: Record<string, number> = {
          north: 2,
          south: 3,
          west: 1,
          east: 0,
          up: 4,
          down: 5,
        };
        Object.entries(e.faces ?? {}).forEach(([face, data]) => {
          const key = data.texture.replace(/^#/, '');
          mats[faceMap[face]] = new THREE.MeshBasicMaterial({
            map: resolveTexture(textureVars[key]),
          });
        });

        const mesh = new THREE.Mesh(geom, mats);
        mesh.position.set(
          (x1 + (x2 - x1) / 2) / 16 - 0.5,
          (y1 + (y2 - y1) / 2) / 16 - 0.5,
          (z1 + (z2 - z1) / 2) / 16 - 0.5
        );
        group.add(mesh);
      });

      if (!elements.length) throw new Error('No elements array');
    } catch (e) {
      window.electronAPI?.log('error', `Model preview failed: ${e}`);
      const tex = loader.load(getTexture(modelType, ''));
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      group.add(
        new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshBasicMaterial({ map: tex })
        )
      );
    }
    return group;
  }, [modelJson, modelType, getTexture]);
}

function PreviewScene({
  modelType,
  modelJson,
  getTexture,
}: {
  modelType: 'item' | 'block';
  modelJson: unknown;
  getTexture: (t: 'item' | 'block', p: string) => string;
}) {
  const modelGroup = useMinecraftModel(modelType, modelJson, getTexture);
  useFrame(
    ({ clock }) => (modelGroup.rotation.y = clock.getElapsedTime() * 0.5)
  );
  return <primitive object={modelGroup} />;
}
