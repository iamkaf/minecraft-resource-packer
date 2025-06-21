import React from 'react';
import { ExporterTab } from '../../components/editor';

export default function ExporterView({ onExport }: { onExport: () => void }) {
  return <ExporterTab onExport={onExport} />;
}
