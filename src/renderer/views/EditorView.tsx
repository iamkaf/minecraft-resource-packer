import React, { Suspense, useRef, useState } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import AssetBrowser from '../components/AssetBrowser';
import AssetSelector from '../components/AssetSelector';
import AssetInfo from '../components/AssetInfo';
import ProjectInfoPanel from '../components/ProjectInfoPanel';
import SelectorInfoPanel from '../components/SelectorInfoPanel';
import Spinner from '../components/Spinner';
import ExportSummaryModal from '../components/ExportSummaryModal';
import ExternalLink from '../components/ExternalLink';
// eslint-disable-next-line import/no-unresolved
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import panelStorage from '../utils/panelStorage';
import type { ExportSummary } from '../../main/exporter';

interface EditorViewProps {
  projectPath: string;
  onBack: () => void;
}

export default function EditorView({ projectPath, onBack }: EditorViewProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [selectorAsset, setSelectorAsset] = useState<string | null>(null);
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
      <div className="flex items-center gap-2 mb-2">
        <h1 className="font-display text-xl flex-1">Project: {projectPath}</h1>
        <ExternalLink
          href="https://minecraft.wiki/w/Resource_pack"
          aria-label="Help"
          className="btn btn-circle btn-ghost btn-sm"
        >
          ?
        </ExternalLink>
      </div>
      <PanelGroup
        direction="horizontal"
        autoSaveId="editor-panels"
        storage={panelStorage}
        className="flex-1 overflow-hidden"
      >
        <Panel defaultSize={20} minSize={15} className="overflow-y-auto">
          <ProjectInfoPanel projectPath={projectPath} onExport={handleExport} />
        </Panel>
        <PanelResizeHandle className="w-4 cursor-col-resize">
          <div className="w-px bg-base-300 mx-auto" />
        </PanelResizeHandle>
        <Panel defaultSize={40} minSize={20} className="overflow-hidden">
          <PanelGroup
            direction="vertical"
            autoSaveId="editor-middle"
            storage={panelStorage}
            className="h-full"
          >
            <Panel minSize={30} className="overflow-y-auto">
              <Suspense fallback={<Spinner />}>
                <AssetSelector
                  path={projectPath}
                  onAssetSelected={(n) => setSelectorAsset(n)}
                />
              </Suspense>
            </Panel>
            <PanelResizeHandle className="h-4 cursor-row-resize">
              <div className="h-px bg-base-300 mx-auto w-full" />
            </PanelResizeHandle>
            <Panel minSize={20} className="overflow-y-auto">
              <SelectorInfoPanel asset={selectorAsset} />
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle className="w-4 cursor-col-resize">
          <div className="w-px bg-base-300 mx-auto" />
        </PanelResizeHandle>
        <Panel defaultSize={40} minSize={20} className="overflow-hidden">
          <PanelGroup
            direction="vertical"
            autoSaveId="editor-right"
            storage={panelStorage}
            className="h-full"
          >
            <Panel minSize={30} className="overflow-y-auto">
              <Suspense fallback={<Spinner />}>
                <AssetBrowser
                  path={projectPath}
                  onSelectionChange={(sel) => setSelected(sel)}
                />
              </Suspense>
            </Panel>
            <PanelResizeHandle className="h-4 cursor-row-resize">
              <div className="h-px bg-base-300 mx-auto w-full" />
            </PanelResizeHandle>
            <Panel minSize={20} className="overflow-y-auto">
              <AssetInfo
                projectPath={projectPath}
                asset={selected[0] ?? null}
                count={selected.length}
              />
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
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
