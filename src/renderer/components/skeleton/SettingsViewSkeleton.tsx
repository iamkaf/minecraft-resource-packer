import React from 'react';

export default function SettingsViewSkeleton() {
  return (
    <section className="p-4 flex gap-4" data-testid="settings-skeleton">
      <aside className="w-48">
        <div className="flex flex-col gap-2">
          <div className="skeleton h-6 w-32" />
          <div className="skeleton h-6 w-32" />
          <div className="skeleton h-6 w-32" />
        </div>
      </aside>
      <div className="flex-1">
        <div className="flex items-center mb-2 gap-2">
          <div className="skeleton h-8 w-32 flex-1" />
          <div className="skeleton h-8 w-8 rounded-full" />
        </div>
        <div className="flex flex-col gap-4 max-w-md">
          <div className="skeleton h-10 w-full" />
          <div className="skeleton h-10 w-full" />
          <div className="skeleton h-10 w-full" />
        </div>
      </div>
    </section>
  );
}
