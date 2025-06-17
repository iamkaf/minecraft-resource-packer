import React, { useState } from 'react';
import { Modal, Button } from './daisy/actions';
import { Steps, Step } from './daisy/navigation';
import { RadialProgress } from './daisy/feedback';

interface ImportWizardProps {
  open: boolean;
  onClose: () => void;
}

export default function ImportWizard({ open, onClose }: ImportWizardProps) {
  const [step, setStep] = useState(0);

  const startImport = async () => {
    setStep(1);
    try {
      await window.electronAPI?.importProject();
    } finally {
      setStep(2);
    }
  };

  if (!open) return null;

  return (
    <Modal open className="w-80">
      <Steps className="mb-4">
        <Step active={step >= 0}>Select</Step>
        <Step active={step >= 1}>Import</Step>
        <Step active={step >= 2}>Done</Step>
      </Steps>
      {step === 0 && (
        <>
          <p>Select a project folder or .zip file to import.</p>
          <div className="modal-action">
            <Button onClick={onClose}>Cancel</Button>
            <Button className="btn-secondary" onClick={startImport}>
              Import
            </Button>
          </div>
        </>
      )}
      {step === 1 && (
        <div className="flex flex-col items-center">
          <p className="mb-2">Importing...</p>
          <RadialProgress value={50} size="5rem" />
        </div>
      )}
      {step === 2 && (
        <>
          <p>Import complete.</p>
          <div className="modal-action">
            <Button onClick={onClose}>Close</Button>
          </div>
        </>
      )}
    </Modal>
  );
}
