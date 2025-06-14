import React, { useState } from 'react';
import { generateProjectName } from '../../utils/names';

export default function ProjectForm({
  versions,
  onCreate,
  onImport,
}: {
  versions: string[];
  onCreate: (name: string, version: string) => void;
  onImport: () => void;
}) {
  const [name, setName] = useState(() => generateProjectName());
  const [version, setVersion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !version) return;
    onCreate(name, version);
    setName(generateProjectName());
    setVersion('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        className="input input-bordered input-sm"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <select
        className="select select-bordered select-sm"
        value={version}
        onChange={(e) => setVersion(e.target.value)}
      >
        <option value="" disabled>
          Select version
        </option>
        {versions.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
      <button className="btn btn-primary btn-sm" type="submit">
        Create
      </button>
      <button
        type="button"
        onClick={onImport}
        className="btn btn-secondary btn-sm"
      >
        Import
      </button>
    </form>
  );
}
