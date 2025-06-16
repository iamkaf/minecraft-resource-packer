import React, { useState } from 'react';
import path from 'path';
import Spinner from './Spinner';
import type { TextureEditOptions } from '../../shared/texture';
import { Modal, Button } from './daisy/actions';
import { Range, Select, Checkbox } from './daisy/input';

export default function TextureLab({
  file,
  projectPath,
  onClose,
}: {
  file: string;
  projectPath: string;
  onClose: () => void;
}) {
  const [hue, setHue] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [gray, setGray] = useState(false);
  const [sat, setSat] = useState(1);
  const [bright, setBright] = useState(1);
  const [busy, setBusy] = useState(false);

  const rel = path.relative(projectPath, file).split(path.sep).join('/');
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
            src={`asset://${rel}`}
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
        <div className="modal-action">
          <Button type="button" onClick={onClose}>
            Close
          </Button>
          <Button type="submit" className="btn-primary" disabled={busy}>
            Apply
          </Button>
        </div>
        {busy && <Spinner />}
      </form>
    </Modal>
  );
}
