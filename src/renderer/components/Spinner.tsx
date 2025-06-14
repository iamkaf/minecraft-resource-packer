import React from 'react';
export default function Spinner() {
  return (
    <div className="flex justify-center p-4" data-testid="spinner">
      <span
        className="loading loading-spinner text-primary"
        aria-label="loading"
      />
    </div>
  );
}
