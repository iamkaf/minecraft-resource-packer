import React, { Suspense, useRef, useState } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import AssetBrowser from '../components/AssetBrowser';
import AssetSelector from '../components/AssetSelector';
import AssetInfo from '../components/AssetInfo';
import Spinner from '../components/Spinner';
import ExportSummaryModal from '../components/ExportSummaryModal';
import type { ExportSummary } from '../../main/exporter';

interface EditorViewProps {
  projectPath: string;
  onBack: () => void;
}

export default function EditorView({ projectPath, onBack }: EditorViewProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [summary, setSummary] = useState<ExportSummary | null>(null);
  const confetti = useRef<((opts: unknown) => void) | null>(null);

  const handleExport = () => {
    window.electronAPI
      ?.exportProject(projectPath)
      .then((s) => {
        if (s) setSummary(s);
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          confetti.current?.({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      })
      .catch(() => {
        /* ignore */
      });
  };

  return (
    <main className="p-4 flex flex-col gap-4" data-testid="editor-view">
      <button className="link link-primary w-fit" onClick={onBack}>
        Back to Projects
      </button>
      <h1 className="font-display text-xl mb-2">Project: {projectPath}</h1>
      <button className="btn btn-accent mb-2" onClick={handleExport}>
        Export Pack
      </button>
      <div className="flex gap-4 flex-1">
        <div className="w-64 overflow-y-auto">
          <Suspense fallback={<Spinner />}>
            <AssetSelector path={projectPath} />
          </Suspense>
        </div>
        <div className="flex-1 flex flex-col">
          <Suspense fallback={<Spinner />}>
            <AssetBrowser
              path={projectPath}
              onSelectionChange={(sel) => setSelected(sel)}
            />
          </Suspense>
          <AssetInfo asset={selected[0] ?? null} />
        </div>
      </div>
      {summary && (
        <ExportSummaryModal
          summary={summary}
          onClose={() => setSummary(null)}
        />
      )}
      <ReactCanvasConfetti
        onInit={({ confetti: c }) => {
          confetti.current = c;
        }}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
        }}
      />
    </main>
  );
}
