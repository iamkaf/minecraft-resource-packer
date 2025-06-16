import React from 'react';

export default function EditorViewSkeleton() {
  return (
    <div
      className="p-4 flex flex-col gap-4 flex-1"
      data-testid="editor-skeleton"
    >
      <div className="flex items-center justify-end mb-2 gap-2">
        <div className="skeleton h-8 w-32" />
        <div className="skeleton h-8 w-8 rounded-full" />
      </div>
      <div className="flex flex-1 gap-2">
        <div className="w-48 flex flex-col gap-2">
          <div className="skeleton h-8 w-full" />
          <div className="skeleton flex-1 w-full" />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="skeleton h-64 w-full" />
          <div className="skeleton h-32 w-full" />
        </div>
      </div>
    </div>
  );
}
