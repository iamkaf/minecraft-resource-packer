import React, { useState } from 'react';
import { generateProjectName } from '../../utils/names';
import { InputField, Select } from '../daisy/input';
import { Modal, Button } from '../daisy/actions';
import Tab from '../daisy/navigation/Tab';
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
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'create' | 'import'>('create');
  const [name, setName] = useState(() => generateProjectName());
  const [version, setVersion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !version) return;
    onCreate(name, version);
    setName(generateProjectName());
    setVersion('');
    setOpen(false);
  };

  const handleImport = () => {
    onImport();
    setOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => {
          setTab('create');
          setOpen(true);
        }}
        className="btn-primary btn-sm mb-4 flex items-center gap-1"
      >
        <PlusIcon className="w-4 h-4" /> New Project
      </Button>
      <Modal open={open}>
        <div className="flex flex-col gap-2 w-80">
          <div role="tablist" className="tabs tabs-bordered">
            <Tab
              className={tab === 'create' ? 'tab-active' : ''}
              onClick={() => setTab('create')}
            >
              Create
            </Tab>
            <Tab
              className={tab === 'import' ? 'tab-active' : ''}
              onClick={() => setTab('import')}
            >
              Import
            </Tab>
          </div>
          {tab === 'create' ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-2"
              data-testid="create-form"
            >
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
              <div className="modal-action">
                <Button type="button" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="btn-primary">
                  Create
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-2" data-testid="import-pane">
              <p>Select a project folder to import.</p>
              <div className="modal-action">
                <Button type="button" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleImport}
                  className="btn-secondary"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" /> Import
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
