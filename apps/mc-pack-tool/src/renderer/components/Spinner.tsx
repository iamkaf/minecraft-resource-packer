import React from 'react';
import { TailSpin } from 'react-loader-spinner';

export default function Spinner() {
  return (
    <div className="flex justify-center p-4" data-testid="spinner">
      <TailSpin
        height={48}
        width={48}
        color="hsl(var(--bc))"
        ariaLabel="loading"
      />
    </div>
  );
}
