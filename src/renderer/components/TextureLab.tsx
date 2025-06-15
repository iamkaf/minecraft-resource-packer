import React, { useState } from 'react';
import Spinner from './Spinner';
import type { TextureEditOptions } from '../../shared/texture';

export default function TextureLab({
  file,
  onClose,
}: {
  file: string;
  onClose: () => void;
}) {
  const [hue, setHue] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [gray, setGray] = useState(false);
  const [sat, setSat] = useState(1);
  const [bright, setBright] = useState(1);
  const [busy, setBusy] = useState(false);

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
    <dialog className="modal modal-open" data-testid="texture-lab">
      <form
        className="modal-box flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          apply();
        }}
      >
        <h3 className="font-bold text-lg">Texture Lab</h3>
        <label className="flex items-center gap-2">
          Hue
          <input
            type="range"
            min={-180}
            max={180}
            value={hue}
            onChange={(e) => setHue(Number(e.target.value))}
            className="range range-xs flex-1"
          />
        </label>
        <label className="flex items-center gap-2">
          Rotation
          <select
            className="select select-sm"
            value={rotate}
            onChange={(e) => setRotate(Number(e.target.value))}
          >
            <option value={0}>0°</option>
            <option value={90}>90°</option>
            <option value={180}>180°</option>
            <option value={270}>270°</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="checkbox"
            checked={gray}
            onChange={(e) => setGray(e.target.checked)}
          />
          Grayscale
        </label>
        <label className="flex items-center gap-2">
          Saturation
          <input
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={sat}
            onChange={(e) => setSat(Number(e.target.value))}
            className="range range-xs flex-1"
          />
        </label>
        <label className="flex items-center gap-2">
          Brightness
          <input
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={bright}
            onChange={(e) => setBright(Number(e.target.value))}
            className="range range-xs flex-1"
          />
        </label>
        <div className="modal-action">
          <button type="button" className="btn" onClick={onClose}>
            Close
          </button>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            Apply
          </button>
        </div>
        {busy && <Spinner />}
      </form>
    </dialog>
  );
}
