import React, { Suspense, useEffect, useRef, useState } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import AssetBrowser from '../components/AssetBrowser';
import AssetSelector from '../components/AssetSelector';
import AssetInfo from '../components/AssetInfo';
import ProjectInfoPanel from '../components/ProjectInfoPanel';
import AssetSelectorInfoPanel from '../components/AssetSelectorInfoPanel';
import Spinner from '../components/Spinner';
import ExportSummaryModal from '../components/ExportSummaryModal';
import ExternalLink from '../components/ExternalLink';
import type { ExportSummary } from '../../main/exporter';
// eslint-disable-next-line import/no-unresolved
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

interface EditorViewProps {
  projectPath: string;
  onBack: () => void;
}

export default function EditorView({ projectPath, onBack }: EditorViewProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [selectorAsset, setSelectorAsset] = useState<string | null>(null);
  const [layout, setLayout] = useState<number[]>([20, 40, 40]);
  const [summary, setSummary] = useState<ExportSummary | null>(null);
  const confetti = useRef<((opts: unknown) => void) | null>(null);

  useEffect(() => {
    window.electronAPI?.getEditorLayout().then((l) => {
      if (Array.isArray(l)) setLayout(l);
    });
  }, []);

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
    <main className="p-4 flex flex-col gap-4 h-full" data-testid="editor-view">
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
        layout={layout}
        onLayout={(l) => {
          setLayout(l);
          window.electronAPI?.setEditorLayout(l);
        }}
        className="flex-1"
      >
        <Panel minSize={15} defaultSize={layout[0]}>
          <ProjectInfoPanel projectPath={projectPath} onExport={handleExport} />
        </Panel>
        <PanelResizeHandle className="flex items-center" tagName="div">
          <div className="w-1 bg-base-content h-full mx-auto"></div>
        </PanelResizeHandle>
        <Panel minSize={20} defaultSize={layout[1]} className="overflow-hidden">
          <PanelGroup direction="vertical" className="h-full">
            <Panel defaultSize={70} className="overflow-y-auto">
              <Suspense fallback={<Spinner />}>
                <AssetSelector
                  path={projectPath}
                  onAssetSelect={(n) => setSelectorAsset(n)}
                />
              </Suspense>
            </Panel>
            <PanelResizeHandle className="flex items-center" tagName="div">
              <div className="w-full h-px bg-base-content"></div>
            </PanelResizeHandle>
            <Panel defaultSize={30} className="overflow-y-auto">
              <AssetSelectorInfoPanel asset={selectorAsset} />
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle className="flex items-center" tagName="div">
          <div className="w-1 bg-base-content h-full mx-auto"></div>
        </PanelResizeHandle>
        <Panel minSize={20} defaultSize={layout[2]} className="overflow-hidden">
          <PanelGroup direction="vertical" className="h-full">
            <Panel defaultSize={70} className="overflow-y-auto">
              <Suspense fallback={<Spinner />}>
                <AssetBrowser
                  path={projectPath}
                  onSelectionChange={(sel) => setSelected(sel)}
                />
              </Suspense>
            </Panel>
            <PanelResizeHandle className="flex items-center" tagName="div">
              <div className="w-full h-px bg-base-content"></div>
            </PanelResizeHandle>
            <Panel defaultSize={30} className="overflow-y-auto">
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
