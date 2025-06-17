import React from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

export default function TextIcon({ size = 24 }: { size?: number }) {
  return (
    <DocumentTextIcon
      data-testid="text-icon"
      className="text-base-content"
      style={{ width: size, height: size }}
    />
  );
}
