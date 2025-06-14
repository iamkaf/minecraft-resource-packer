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
/* eslint-disable import/no-unresolved */
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
  ImperativePanelGroupHandle,
} from 'react-resizable-panels';
/* eslint-enable import/no-unresolved */

interface EditorViewProps {
  projectPath: string;
  onBack: () => void;
  onSettings: () => void;
}

export default function EditorView({
  projectPath,
  onBack,
  onSettings,
}: EditorViewProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [selectorAsset, setSelectorAsset] = useState<string | null>(null);
  const [layout, setLayout] = useState<number[]>([20, 80]);
  const [summary, setSummary] = useState<ExportSummary | null>(null);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [allowConfetti, setAllowConfetti] = useState(true);
  const confetti = useRef<((opts: unknown) => void) | null>(null);
  const groupRef = useRef<ImperativePanelGroupHandle>(null);

  useEffect(() => {
    window.electronAPI?.getEditorLayout().then((l) => {
      if (Array.isArray(l)) {
        if (l.length === 2) setLayout(l);
        else if (l.length === 3) setLayout([l[0], l[1] + l[2]]);
      }
    });
    window.electronAPI?.getConfetti().then((c) => setAllowConfetti(c));
  }, []);

  const handleExport = () => {
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
      });
  };

  return (
    <main
      className="p-4 flex flex-col gap-4 flex-1 min-h-0"
      data-testid="editor-view"
    >
      <div className="flex items-center justify-end mb-2 gap-2">
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setSelectorOpen(true)}
        >
          Add From Vanilla
        </button>
        <ExternalLink
          href="https://minecraft.wiki/w/Resource_pack"
          aria-label="Help"
          className="btn btn-circle btn-ghost btn-sm"
        >
          ?
        </ExternalLink>
      </div>
      <PanelGroup
        ref={groupRef}
        direction="horizontal"
        onLayout={(l) => {
          setLayout(l);
          window.electronAPI?.setEditorLayout(l);
        }}
        className="flex-1 min-h-0"
      >
        <Panel
          minSize={15}
          defaultSize={layout[0]}
          className="bg-base-100 border border-base-300 rounded flex flex-col"
        >
          <ProjectInfoPanel
            projectPath={projectPath}
            onExport={handleExport}
            onBack={onBack}
            onSettings={onSettings}
          />
        </Panel>
        <PanelResizeHandle className="flex items-center" tagName="div">
          <div className="w-1 bg-base-content h-full mx-auto"></div>
        </PanelResizeHandle>
        <Panel
          minSize={20}
          defaultSize={layout[1]}
          className="overflow-hidden bg-base-100 border border-base-300 rounded"
        >
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
      {selectorOpen && (
        <dialog className="modal modal-open" data-testid="asset-selector-modal">
          <div className="modal-box w-11/12 max-w-5xl">
            <h3 className="font-bold text-lg mb-2">Add Assets</h3>
            <div className="flex gap-4 max-h-[70vh]">
              <div className="flex-1 overflow-y-auto">
                <Suspense fallback={<Spinner />}>
                  <AssetSelector
                    path={projectPath}
                    onAssetSelect={(n) => setSelectorAsset(n)}
                  />
                </Suspense>
              </div>
              <div className="w-48 overflow-y-auto">
                <AssetSelectorInfoPanel
                  projectPath={projectPath}
                  asset={selectorAsset}
                />
              </div>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectorOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </dialog>
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
