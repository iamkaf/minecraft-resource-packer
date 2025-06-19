import React, { useState, useEffect } from 'react';
import path from 'path';
import { toPosixPath } from '../../../shared/toPosixPath';
import { Loading } from '../daisy/feedback';
import type { TextureEditOptions } from '../../../shared/texture';
import { Modal, Button } from '../daisy/actions';
import { Range, Select, Checkbox } from '../daisy/input';
import { useProject } from '../providers/ProjectProvider';

export default function TextureLab({
  file,
  onClose,
  stamp,
}: {
  file: string;
  onClose: () => void;
  stamp?: number;
}) {
  const { path: projectPath } = useProject();
  const [hue, setHue] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [gray, setGray] = useState(false);
  const [sat, setSat] = useState(1);
  const [bright, setBright] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [resize, setResize] = useState({ width: 0, height: 0 });
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [drawColor, setDrawColor] = useState('#ff0000');
  const [drawing, setDrawing] = useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [busy, setBusy] = useState(false);
  const [version, setVersion] = useState<number | undefined>(stamp);

  useEffect(() => {
    setVersion(stamp);
  }, [stamp]);

  useEffect(() => {
    const relPath = toPosixPath(path.relative(projectPath, file));
    const listener = (_e: unknown, args: { path: string; stamp: number }) => {
      if (args.path === relPath) setVersion(args.stamp);
    };
    const off = window.electronAPI?.onFileChanged(listener);
    return () => {
      off?.();
    };
  }, [file, projectPath]);

  const rel = toPosixPath(path.relative(projectPath, file));
  const filter = `hue-rotate(${hue}deg) saturate(${sat}) brightness(${bright})${
    gray ? ' grayscale(1)' : ''
  }`;

  const apply = () => {
    const opts: TextureEditOptions = {
      hue,
      rotate,
      grayscale: gray,
      saturation: sat,
      brightness: bright,
      crop,
      resize: resize.width && resize.height ? resize : undefined,
      flip: flipH ? 'horizontal' : flipV ? 'vertical' : undefined,
      overlay: canvasRef.current?.toDataURL(),
    };
    setBusy(true);
    window.electronAPI?.editTexture(file, opts).finally(() => setBusy(false));
  };

  return (
    <Modal open>
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          apply();
        }}
      >
        <h3 className="font-bold text-lg">Texture Lab</h3>
        <div style={{ height: '64px' }} className="flex justify-center">
          <img
            src={`asset://${rel}${version ? `?t=${version}` : ''}`}
            alt="preview"
            style={{
              imageRendering: 'pixelated',
              transform: `rotate(${rotate}deg)`,
              filter,
              height: '64px',
              width: '64px',
            }}
          />
        </div>
        <label className="flex items-center gap-2">
          Hue
          <Range
            min={-180}
            max={180}
            value={hue}
            onChange={(e) => setHue(Number(e.target.value))}
            className="range-xs flex-1"
          />
        </label>
        <label className="flex items-center gap-2">
          Rotation
          <Select
            className="select-sm"
            value={rotate}
            onChange={(e) => setRotate(Number(e.target.value))}
          >
            <option value={0}>0°</option>
            <option value={90}>90°</option>
            <option value={180}>180°</option>
            <option value={270}>270°</option>
          </Select>
        </label>
        <label className="flex items-center gap-2">
          <Checkbox
            checked={gray}
            onChange={(e) => setGray(e.target.checked)}
          />
          Grayscale
        </label>
        <label className="flex items-center gap-2">
          Saturation
          <Range
            min={0}
            max={2}
            step={0.1}
            value={sat}
            onChange={(e) => setSat(Number(e.target.value))}
            className="range-xs flex-1"
          />
        </label>
        <label className="flex items-center gap-2">
          Brightness
          <Range
            min={0}
            max={2}
            step={0.1}
            value={bright}
            onChange={(e) => setBright(Number(e.target.value))}
            className="range-xs flex-1"
          />
        </label>
        <div className="flex gap-2">
          <label className="flex items-center gap-1">
            Crop X
            <input
              type="number"
              value={crop.x}
              onChange={(e) => setCrop({ ...crop, x: Number(e.target.value) })}
              className="input input-xs w-16"
            />
          </label>
          <label className="flex items-center gap-1">
            Y
            <input
              type="number"
              value={crop.y}
              onChange={(e) => setCrop({ ...crop, y: Number(e.target.value) })}
              className="input input-xs w-16"
            />
          </label>
          <label className="flex items-center gap-1">
            W
            <input
              type="number"
              value={crop.width}
              onChange={(e) =>
                setCrop({ ...crop, width: Number(e.target.value) })
              }
              className="input input-xs w-16"
            />
          </label>
          <label className="flex items-center gap-1">
            H
            <input
              type="number"
              value={crop.height}
              onChange={(e) =>
                setCrop({ ...crop, height: Number(e.target.value) })
              }
              className="input input-xs w-16"
            />
          </label>
        </div>
        <div className="flex gap-2">
          <label className="flex items-center gap-1">
            Resize W
            <input
              type="number"
              value={resize.width}
              onChange={(e) =>
                setResize({ ...resize, width: Number(e.target.value) })
              }
              className="input input-xs w-16"
            />
          </label>
          <label className="flex items-center gap-1">
            H
            <input
              type="number"
              value={resize.height}
              onChange={(e) =>
                setResize({ ...resize, height: Number(e.target.value) })
              }
              className="input input-xs w-16"
            />
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={flipH}
              onChange={(e) => setFlipH(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            Flip H
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={flipV}
              onChange={(e) => setFlipV(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            Flip V
          </label>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={drawColor}
            onChange={(e) => setDrawColor(e.target.value)}
          />
          <canvas
            ref={canvasRef}
            width={64}
            height={64}
            className="border"
            onMouseDown={() => setDrawing(true)}
            onMouseUp={() => setDrawing(false)}
            onMouseLeave={() => setDrawing(false)}
            onMouseMove={(e) => {
              if (!drawing) return;
              const rect = (
                e.target as HTMLCanvasElement
              ).getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const ctx = canvasRef.current?.getContext('2d');
              if (ctx) {
                ctx.fillStyle = drawColor;
                ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
              }
            }}
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        <div className="modal-action">
          <Button type="button" onClick={onClose}>
            Close
          </Button>
          <Button
            type="button"
            onClick={() => window.electronAPI?.undoTexture(file)}
          >
            Undo
          </Button>
          <Button
            type="button"
            onClick={() => window.electronAPI?.redoTexture(file)}
          >
            Redo
          </Button>
          <Button type="submit" className="btn-primary" disabled={busy}>
            Apply
          </Button>
        </div>
        {busy && (
          <div data-testid="spinner" className="flex justify-center p-2">
            <Loading />
          </div>
        )}
      </form>
    </Modal>
  );
}
