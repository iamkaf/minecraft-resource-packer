import React, { useState } from 'react';
import { generateProjectName } from '../../utils/names';
import { InputField, Select } from '../daisy/input';
import { Button } from '../daisy/actions';
import { PlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

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
      <Button
        className="btn-primary btn-sm flex items-center gap-1"
        type="submit"
      >
        <PlusIcon className="w-4 h-4" />
        Create
      </Button>
      <Button
        type="button"
        onClick={onImport}
        className="btn-secondary btn-sm flex items-center gap-1"
      >
        <ArrowDownTrayIcon className="w-4 h-4" />
        Import
      </Button>
    </form>
  );
}
