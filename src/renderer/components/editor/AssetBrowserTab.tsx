import React, { Suspense, useEffect, useRef, useState } from 'react';
import AssetBrowser from '../assets/AssetBrowser';
import AssetSelector from '../assets/AssetSelector';
import AssetInfo from '../assets/AssetInfo';
import ProjectInfoPanel from '../project/ProjectInfoPanel';
import AssetSelectorInfoPanel from '../assets/AssetSelectorInfoPanel';
import { Skeleton } from '../daisy/feedback';
import ExternalLink from '../common/ExternalLink';
import { Modal, Button } from '../daisy/actions';
import { useEditor } from './EditorContext';
/* eslint-disable import/no-unresolved */
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
  ImperativePanelGroupHandle,
} from 'react-resizable-panels';
/* eslint-enable import/no-unresolved */

interface Props {
  onBack: () => void;
  onSettings: () => void;
  onExport: () => void;
}

export default function AssetBrowserTab({
  onBack,
  onSettings,
  onExport,
}: Props) {
  const { selected, setSelected } = useEditor();
  const [selectorAsset, setSelectorAsset] = useState<string | null>(null);
  const [layout, setLayout] = useState<number[]>([20, 80]);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const groupRef = useRef<ImperativePanelGroupHandle>(null);

  useEffect(() => {
    window.electronAPI?.getEditorLayout().then((l) => {
      if (Array.isArray(l)) {
        if (l.length === 2) setLayout(l);
        else if (l.length === 3) setLayout([l[0], l[1] + l[2]]);
      }
    });
  }, []);

  return (
    <div
      className="flex flex-col gap-4 flex-1 min-h-0"
      data-testid="asset-browser-tab"
    >
      <div className="flex items-center justify-end mb-2 gap-2">
        <Button
          className="btn-primary btn-sm"
          onClick={() => setSelectorOpen(true)}
        >
          Add From Vanilla
        </Button>
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
            onExport={onExport}
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
              <Suspense fallback={<Skeleton width="100%" height="8rem" />}>
                <AssetBrowser onSelectionChange={setSelected} />
              </Suspense>
            </Panel>
            <PanelResizeHandle className="flex items-center" tagName="div">
              <div className="w-full h-px bg-base-content"></div>
            </PanelResizeHandle>
            <Panel defaultSize={30} className="overflow-y-auto">
              <AssetInfo asset={selected[0] ?? null} count={selected.length} />
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
      {selectorOpen && (
        <Modal open testId="asset-selector-modal" className="max-w-[1200px]">
          <div className="w-[95%] h-[800px]">
            <h3 className="font-bold text-lg mb-2">Add Assets</h3>
            <div className="flex gap-4 max-h-[70vh]">
              <div className="flex-1 overflow-y-auto">
                <Suspense fallback={<Skeleton width="100%" height="8rem" />}>
                  <AssetSelector onAssetSelect={(n) => setSelectorAsset(n)} />
                </Suspense>
              </div>
              <div className="w-48 overflow-y-auto">
                <AssetSelectorInfoPanel asset={selectorAsset} />
              </div>
            </div>
            <div className="modal-action">
              <Button onClick={() => setSelectorOpen(false)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
