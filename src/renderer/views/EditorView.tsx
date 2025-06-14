import React, { Suspense, useRef, useState } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import AssetBrowser from '../components/AssetBrowser';
import AssetSelector from '../components/AssetSelector';
import AssetInfo from '../components/AssetInfo';
import TextureInfoPanel from '../components/TextureInfoPanel';
import ProjectInfoPanel from '../components/ProjectInfoPanel';
import type { TextureInfo } from '../components/TextureGrid';
// eslint-disable-next-line import/no-unresolved
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import Spinner from '../components/Spinner';
import ExportSummaryModal from '../components/ExportSummaryModal';
import ExternalLink from '../components/ExternalLink';
import { loadLayout, saveLayout } from '../utils/panelLayout';
import type { ExportSummary } from '../../main/exporter';

interface EditorViewProps {
  projectPath: string;
  onBack: () => void;
}

export default function EditorView({ projectPath, onBack }: EditorViewProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [selectorInfo, setSelectorInfo] = useState<TextureInfo | null>(null);
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

  const columns = loadLayout('editor-columns', [20, 40, 40]);
  const selectorLayout = loadLayout('selector-layout', [70, 30]);
  const browserLayout = loadLayout('browser-layout', [70, 30]);

  const HandleH = () => (
    <PanelResizeHandle className="w-1 flex items-center justify-center">
      <div className="w-px h-full bg-base-content/20" />
    </PanelResizeHandle>
  );
  const HandleV = () => (
    <PanelResizeHandle className="h-1 flex items-center justify-center">
      <div className="h-px w-full bg-base-content/20" />
    </PanelResizeHandle>
  );

  return (
    <main
      className="p-4 flex flex-col gap-2 overflow-hidden"
      data-testid="editor-view"
    >
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
        onLayout={(s) => saveLayout('editor-columns', s)}
        autoSaveId="editor-columns"
      >
        <Panel
          defaultSize={columns[0]}
          minSize={15}
          className="overflow-y-auto"
        >
          <ProjectInfoPanel projectPath={projectPath} onExport={handleExport} />
        </Panel>
        <HandleH />
        <Panel
          defaultSize={columns[1]}
          minSize={20}
          className="overflow-hidden"
        >
          <PanelGroup
            direction="vertical"
            onLayout={(s) => saveLayout('selector-layout', s)}
          >
            <Panel
              defaultSize={selectorLayout[0]}
              minSize={20}
              className="overflow-y-auto"
            >
              <Suspense fallback={<Spinner />}>
                <AssetSelector
                  path={projectPath}
                  onSelectInfo={(tex) => setSelectorInfo(tex)}
                />
              </Suspense>
            </Panel>
            <HandleV />
            <Panel
              defaultSize={selectorLayout[1]}
              minSize={10}
              className="overflow-y-auto"
            >
              <TextureInfoPanel texture={selectorInfo} />
            </Panel>
          </PanelGroup>
        </Panel>
        <HandleH />
        <Panel
          defaultSize={columns[2]}
          minSize={20}
          className="overflow-hidden"
        >
          <PanelGroup
            direction="vertical"
            onLayout={(s) => saveLayout('browser-layout', s)}
          >
            <Panel
              defaultSize={browserLayout[0]}
              minSize={20}
              className="overflow-y-auto"
            >
              <Suspense fallback={<Spinner />}>
                <AssetBrowser
                  path={projectPath}
                  onSelectionChange={(sel) => setSelected(sel)}
                />
              </Suspense>
            </Panel>
            <HandleV />
            <Panel
              defaultSize={browserLayout[1]}
              minSize={10}
              className="overflow-y-auto"
            >
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
