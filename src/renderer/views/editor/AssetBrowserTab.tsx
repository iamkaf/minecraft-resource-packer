import React, { Suspense, useState } from 'react';
/* eslint-disable import/no-unresolved */
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
/* eslint-enable import/no-unresolved */
import AssetBrowser from '../../components/assets/AssetBrowser';
import AssetInfo from '../../components/assets/AssetInfo';
import AssetSelector from '../../components/assets/AssetSelector';
import AssetSelectorInfoPanel from '../../components/assets/AssetSelectorInfoPanel';
import { Skeleton } from '../../components/daisy/feedback';
import { Modal, Button } from '../../components/daisy/actions';

export default function AssetBrowserTab() {
  const [selected, setSelected] = useState<string[]>([]);
  const [selectorAsset, setSelectorAsset] = useState<string | null>(null);
  const [selectorOpen, setSelectorOpen] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-end mb-2 gap-2">
        <Button
          className="btn-primary btn-sm"
          onClick={() => setSelectorOpen(true)}
        >
          Add From Vanilla
        </Button>
      </div>
      <PanelGroup direction="vertical" className="flex-1">
        <Panel defaultSize={70} className="overflow-y-auto">
          <Suspense fallback={<Skeleton width="100%" height="8rem" />}>
            <AssetBrowser onSelectionChange={(sel) => setSelected(sel)} />
          </Suspense>
        </Panel>
        <PanelResizeHandle className="flex items-center" tagName="div">
          <div className="w-full h-px bg-base-content"></div>
        </PanelResizeHandle>
        <Panel defaultSize={30} className="overflow-y-auto">
          <AssetInfo asset={selected[0] ?? null} count={selected.length} />
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
