import React from 'react';

export default function AboutViewSkeleton() {
  return (
    <section
      className="p-4 flex flex-col gap-4 items-center"
      data-testid="about-skeleton"
    >
      <div className="skeleton w-32 h-32" />
      <div className="skeleton h-8 w-64" />
      <div className="skeleton h-6 w-32" />
      <div className="skeleton h-40 w-full max-w-md" />
    </section>
  );
}
