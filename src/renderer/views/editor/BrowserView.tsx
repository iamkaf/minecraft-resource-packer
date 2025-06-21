import React from 'react';
import { AssetBrowserTab } from '../../components/editor';

export default function BrowserView({ onExport }: { onExport: () => void }) {
  return <AssetBrowserTab onExport={onExport} />;
}
