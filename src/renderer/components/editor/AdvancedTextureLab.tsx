import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Image } from 'fabric';
import path from 'path';
import { Button } from '../daisy/actions';
import { useProject } from '../providers/ProjectProvider';
import { toPosixPath } from '../../../shared/toPosixPath';

interface Props {
  file: string;
  onSave?: () => void;
}

export default function AdvancedTextureLab({ file, onSave }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const opsRef = useRef<import('../../../shared/texture').ImageEditOperation[]>(
    []
  );
  const { path: projectPath } = useProject();
  const [loading, setLoading] = useState(true);

  const rel = toPosixPath(path.relative(projectPath, file));

  useEffect(() => {
    const canvas = new Canvas(canvasRef.current as HTMLCanvasElement, {
      backgroundColor: '#fff',
    });
    fabricRef.current = canvas;
    Image.fromURL(`asset://${rel}`).then((img: Image) => {
      canvas.setWidth(img.width || 64);
      canvas.setHeight(img.height || 64);
      canvas.add(img);
      canvas.setActiveObject(img);
      setLoading(false);
    });
    return () => {
      canvas.dispose();
    };
  }, [file]);

  const addOp = (op: import('../../../shared/texture').ImageEditOperation) => {
    opsRef.current.push(op);
  };

  const rotate = () => {
    const obj = fabricRef.current?.getActiveObject();
    if (obj) {
      obj.rotate(((obj.angle || 0) + 90) % 360);
      fabricRef.current?.renderAll();
      addOp({ op: 'rotate', angle: 90 });
    }
  };

  const flipX = () => {
    const obj = fabricRef.current?.getActiveObject();
    if (obj) {
      obj.set('flipX', !obj.flipX);
      fabricRef.current?.renderAll();
      addOp({ op: 'flipX' });
    }
  };

  const flipY = () => {
    const obj = fabricRef.current?.getActiveObject();
    if (obj) {
      obj.set('flipY', !obj.flipY);
      fabricRef.current?.renderAll();
      addOp({ op: 'flipY' });
    }
  };

  const save = () => {
    if (opsRef.current.length) {
      window.electronAPI?.applyImageEdits(file, opsRef.current);
      opsRef.current = [];
      onSave?.();
    }
  };

  return (
    <div className="flex flex-col gap-2" data-testid="advanced-lab">
      <canvas ref={canvasRef} className="border" />
      <div className="flex gap-2">
        <Button onClick={rotate}>Rotate</Button>
        <Button onClick={flipX}>Flip X</Button>
        <Button onClick={flipY}>Flip Y</Button>
        <Button onClick={save} className="btn-primary">
          Save
        </Button>
      </div>
      {loading && <span>Loading...</span>}
    </div>
  );
}
