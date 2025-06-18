import React from 'react';
import { Modal, Button } from '../daisy/actions';

export default function AudioPreview({
  asset,
  onClose,
}: {
  asset: string;
  onClose: () => void;
}) {
  return (
    <Modal open>
      <h3 className="font-bold text-lg mb-2">Audio Preview</h3>
      <audio controls data-testid="audio-player" className="w-full">
        <source src={`asset://${asset}`} />
        Your browser does not support the audio element.
      </audio>
      <div className="modal-action">
        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}
