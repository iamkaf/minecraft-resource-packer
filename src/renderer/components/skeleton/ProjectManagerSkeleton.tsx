import React from 'react';

export default function ProjectManagerSkeleton() {
  return (
    <section
      className="flex gap-4 max-w-5xl mx-auto"
      data-testid="manager-skeleton"
    >
      <div className="flex-1">
        <div className="flex items-center mb-2 gap-2">
          <div className="skeleton h-8 w-32 flex-1" />
          <div className="skeleton h-8 w-8 rounded-full" />
        </div>
        <div className="skeleton h-24 w-full mb-4" />
        <div className="skeleton h-8 w-full mb-2" />
        <div className="skeleton h-64 w-full" />
      </div>
      <div className="w-80">
        <div className="skeleton h-6 w-3/4 mb-2" />
        <div className="skeleton h-64 w-full" />
      </div>
    </section>
  );
}
