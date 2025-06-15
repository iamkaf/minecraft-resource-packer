import React from 'react';

export default function Status({ color = 'primary' }: { color?: string }) {
  return <span className={`status status-${color}`} data-testid="status" />;
}
