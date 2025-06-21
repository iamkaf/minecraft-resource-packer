import React from 'react';

export default function ProjectInfoPanelSkeleton() {
  return (
    <aside className="w-80 p-4" data-testid="info-panel-skeleton">
      <div className="skeleton h-6 w-1/2 mb-2" />
      <div className="skeleton h-48 w-full" />
    </aside>
  );
}
