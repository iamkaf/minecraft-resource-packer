import React, { useEffect, useState } from 'react';

interface Props {
  file: string;
  onClose: () => void;
}

export default function TextureLab({ file, onClose }: Props) {
  const [hue, setHue] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [gray, setGray] = useState(false);
  const [sat, setSat] = useState(0);
  const [bright, setBright] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = (_: unknown, p: number) => setProgress(p);
    window.electronAPI?.onTextureProgress(handler);
    return () => {
      // no remove function but event listeners are cleaned when window reloads
    };
  }, []);

  const apply = () => {
    setProgress(0);
    window.electronAPI
      ?.applyTextureOps(file, {
        hue,
        rotate,
        grayscale: gray,
        saturation: sat,
        brightness: bright,
      })
      .catch(() => {
        /* ignore */
      });
  };

  return (
    <dialog className="modal modal-open" data-testid="texture-lab">
      <form method="dialog" className="modal-box flex flex-col gap-2">
        <h3 className="font-bold text-lg">Texture Lab</h3>
        <label className="flex items-center gap-2">
          <span className="w-24">Hue</span>
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
          <span className="w-24">Rotate</span>
          <select
            value={rotate}
            onChange={(e) => setRotate(Number(e.target.value))}
            className="select select-sm flex-1"
          >
            <option value={0}>0°</option>
            <option value={90}>90°</option>
            <option value={180}>180°</option>
            <option value={270}>270°</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span className="w-24">Grayscale</span>
          <input
            type="checkbox"
            checked={gray}
            onChange={(e) => setGray(e.target.checked)}
            className="checkbox"
          />
        </label>
        <label className="flex items-center gap-2">
          <span className="w-24">Saturation</span>
          <input
            type="range"
            min={-100}
            max={100}
            value={sat}
            onChange={(e) => setSat(Number(e.target.value))}
            className="range range-xs flex-1"
          />
        </label>
        <label className="flex items-center gap-2">
          <span className="w-24">Brightness</span>
          <input
            type="range"
            min={-100}
            max={100}
            value={bright}
            onChange={(e) => setBright(Number(e.target.value))}
            className="range range-xs flex-1"
          />
        </label>
        <progress
          className="progress w-full"
          value={progress}
          max={100}
        ></progress>
        <div className="modal-action">
          <button type="button" className="btn" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn btn-primary" onClick={apply}>
            Apply
          </button>
        </div>
      </form>
    </dialog>
  );
}
