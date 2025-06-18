import React, { useEffect, useRef, useState } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import ProjectInfoPanel from '../components/project/ProjectInfoPanel';
import ExternalLink from '../components/common/ExternalLink';
import { Tab } from '../components/daisy/navigation';
/* eslint-disable import/no-unresolved */
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
  ImperativePanelGroupHandle,
} from 'react-resizable-panels';
/* eslint-enable import/no-unresolved */
import AssetBrowserTab from './editor/AssetBrowserTab';
import TextureLabTab from './editor/TextureLabTab';
import ExporterTab from './editor/ExporterTab';
import {
  EditorProvider,
  useEditor,
} from '../components/providers/EditorProvider';
import type { ExportSummary } from '../../main/exporter';
import { BulkProgress } from '../components/modals/ExportWizardModal';
import { useProject } from '../components/providers/ProjectProvider';

interface Props {
  onBack: () => void;
  onSettings: () => void;
}

function EditorContent({ onBack, onSettings }: Props) {
  const { path: projectPath } = useProject();
  const { tab, setTab } = useEditor();
  const [layout, setLayout] = useState<number[]>([20, 80]);
  const [summary, setSummary] = useState<ExportSummary | null>(null);
  const [progress, setProgress] = useState<BulkProgress | null>(null);
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
    setTab('exporter');
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
      <div className="flex items-center justify-end mb-2 gap-2">
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
          <div className="flex flex-col h-full">
            <div role="tablist" className="tabs tabs-bordered mb-2">
              <Tab
                className={tab === 'browser' ? 'tab-active' : ''}
                onClick={() => setTab('browser')}
              >
                Asset Browser
              </Tab>
              <Tab
                className={tab === 'lab' ? 'tab-active' : ''}
                onClick={() => setTab('lab')}
              >
                Texture Lab
              </Tab>
              <Tab
                className={tab === 'exporter' ? 'tab-active' : ''}
                onClick={() => setTab('exporter')}
              >
                Exporter
              </Tab>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              {tab === 'browser' && <AssetBrowserTab />}
              {tab === 'lab' && <TextureLabTab />}
              {tab === 'exporter' && (
                <ExporterTab
                  progress={progress}
                  summary={summary}
                  onClose={() => setSummary(null)}
                />
              )}
            </div>
          </div>
        </Panel>
      </PanelGroup>
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

export default function EditorView(props: Props) {
  return (
    <EditorProvider>
      <EditorContent {...props} />
    </EditorProvider>
  );
}
