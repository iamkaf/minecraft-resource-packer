import React, { useEffect, useRef, useState } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import ExportWizardModal, {
  BulkProgress,
} from '../components/modals/ExportWizardModal';
import type { ExportSummary } from '../../main/exporter';
import { useAppStore } from '../store';
import {
  AssetBrowserTab,
  TextureLabTab,
  ExporterTab,
} from '../components/editor';
import Tab from '../components/daisy/navigation/Tab';

export default function EditorView() {
  const projectPath = useAppStore((s) => s.projectPath)!;
  const selected = useAppStore((s) => s.selectedAssets);
  const setSelected = useAppStore((s) => s.setSelectedAssets);
  const [mode, setMode] = useState<'browser' | 'lab' | 'exporter'>('browser');
  const [summary, setSummary] = useState<ExportSummary | null>(null);
  const [progress, setProgress] = useState<BulkProgress | null>(null);
  const [allowConfetti, setAllowConfetti] = useState(true);
  const confetti = useRef<((opts: unknown) => void) | null>(null);

  useEffect(() => {
    window.electronAPI?.getConfetti().then((c) => setAllowConfetti(c));
  }, []);

  const handleExport = () => {
    setProgress({ current: 0, total: 0 });
    window.electronAPI
      ?.exportProject(projectPath)
      .then((s) => {
        if (s) setSummary(s);
        if (
          allowConfetti &&
          !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
          confetti.current?.({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      })
      .catch(() => {
        /* ignore */
      })
      .finally(() => setProgress(null));
  };

  return (
    <main
      className="p-4 flex flex-col gap-4 flex-1 min-h-0"
      data-testid="editor-view"
    >
      <div role="tablist" className="tabs tabs-bordered mb-2">
        <Tab
          className={mode === 'browser' ? 'tab-active' : ''}
          onClick={() => setMode('browser')}
        >
          Asset Browser
        </Tab>
        <Tab
          className={mode === 'lab' ? 'tab-active' : ''}
          onClick={() => setMode('lab')}
        >
          Texture Lab
        </Tab>
        <Tab
          className={mode === 'exporter' ? 'tab-active' : ''}
          onClick={() => setMode('exporter')}
        >
          Exporter
        </Tab>
      </div>
      {mode === 'browser' && <AssetBrowserTab onExport={handleExport} />}
      {mode === 'lab' && <TextureLabTab />}
      {mode === 'exporter' && <ExporterTab onExport={handleExport} />}
      {(progress || summary) && (
        <ExportWizardModal
          progress={progress ?? undefined}
          summary={summary ?? undefined}
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
