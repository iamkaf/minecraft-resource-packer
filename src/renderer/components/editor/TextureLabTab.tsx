import React from 'react';
import path from 'path';
import { useProject } from '../providers/ProjectProvider';
import { useEditor } from './EditorContext';
import AdvancedTextureLab from './AdvancedTextureLab';

export default function TextureLabTab() {
  const { path: projectPath } = useProject();
  const { selected } = useEditor();
  const file =
    selected.length === 1 ? path.join(projectPath, selected[0]) : null;
  if (!file || path.extname(file).toLowerCase() !== '.png') {
    return (
      <div className="p-4">Select a PNG texture in the Asset Browser.</div>
    );
  }
  return (
    <div className="p-4" data-testid="texture-lab-view">
      <AdvancedTextureLab file={file} />
    </div>
  );
}
