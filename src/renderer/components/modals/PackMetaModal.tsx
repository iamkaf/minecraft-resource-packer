import React, { useState } from 'react';
import path from 'path';
import { app } from 'electron';
import { PackMetaSchema } from '../../../shared/project';
import type { PackMeta } from '../../../main/projects';
import { Modal, Button } from '../daisy/actions';
import { InputField, Textarea } from '../daisy/input';
import { useToast } from '../providers/ToastProvider';

export function PackMetaForm({
  project,
  meta,
  onSave,
  onCancel,
  showActions = true,
}: {
  project: string;
  meta: PackMeta;
  onSave: (m: PackMeta) => void;
  onCancel?: () => void;
  showActions?: boolean;
}) {
  const toast = useToast();
  const [version, setVersion] = useState(meta.version);
  const [description, setDescription] = useState(meta.description);
  const [author, setAuthor] = useState(meta.author);
  const [urls, setUrls] = useState(meta.urls.join('\n'));
  const [license, setLicense] = useState(meta.license);

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        try {
          const data = {
            version,
            description,
            author,
            urls: urls
              .split(/\n+/)
              .map((u) => u.trim())
              .filter(Boolean),
            license,
          };
          const parsed = PackMetaSchema.parse(data);
          onSave({ ...parsed, updated: Date.now() });
        } catch {
          toast({ message: 'Invalid metadata', type: 'error' });
        }
      }}
    >
      <h3 className="font-bold text-lg">Edit Metadata</h3>
      <label className="flex items-center gap-2">
        Version
        <InputField
          data-testid="version-input"
          className="flex-1"
          type="text"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1">
        Description
        <Textarea
          data-testid="description-input"
          className="textarea-bordered"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label className="flex items-center gap-2">
        Author
        <InputField
          data-testid="author-input"
          className="flex-1"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1">
        URLs (one per line)
        <Textarea
          data-testid="urls-input"
          className="textarea-bordered"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
        />
      </label>
      <label className="flex items-center gap-2">
        License
        <InputField
          data-testid="license-input"
          className="flex-1"
          value={license}
          onChange={(e) => setLicense(e.target.value)}
        />
      </label>
      {showActions && (
        <div className="modal-action">
          <Button
            type="button"
            className="btn-secondary"
            onClick={() =>
              window.electronAPI?.randomizeIcon(
                path.join(app.getPath('userData'), 'projects', project)
              )
            }
          >
            Randomize Icon
          </Button>
          {onCancel && (
            <Button type="button" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" className="btn-primary">
            Save
          </Button>
        </div>
      )}
    </form>
  );
}

export default function PackMetaModal(props: {
  project: string;
  meta: PackMeta;
  onSave: (m: PackMeta) => void;
  onCancel: () => void;
}) {
  return (
    <Modal open>
      <PackMetaForm {...props} />
    </Modal>
  );
}
