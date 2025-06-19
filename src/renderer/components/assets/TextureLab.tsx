import React from 'react';
import { Modal, Button } from '../daisy/actions';
import AdvancedTextureLab from '../editor/AdvancedTextureLab';

export default function TextureLab({
  file,
  onClose,
}: {
  file: string;
  onClose: () => void;
  stamp?: number;
}) {
  return (
    <Modal open>
      <h3 className="font-bold text-lg mb-2">Texture Lab</h3>
      <AdvancedTextureLab file={file} onSave={onClose} />
      <div className="modal-action">
        <Button type="button" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
