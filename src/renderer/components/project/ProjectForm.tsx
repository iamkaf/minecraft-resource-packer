import React, { useState } from 'react';
import { generateProjectName } from '../../utils/names';
import { InputField, Select } from '../daisy/input';
import { Button } from '../daisy/actions';

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
      <InputField
        className="input-sm"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <Select
        className="select-bordered select-sm"
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
      </Select>
      <Button className="btn-primary btn-sm" type="submit">
        Create
      </Button>
      <Button type="button" onClick={onImport} className="btn-secondary btn-sm">
        Import
      </Button>
    </form>
  );
}
