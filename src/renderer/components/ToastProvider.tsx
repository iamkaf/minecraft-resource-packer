import React, { createContext, useContext, useState } from 'react';

type ToastType = 'info' | 'success' | 'warning' | 'error';
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const noop = () => {
  /* noop */
};
const ToastContext =
  createContext<(msg: string, type?: ToastType) => void>(noop);

export const useToast = () => useContext(ToastContext);

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="toast toast-top toast-end z-50" aria-live="assertive">
        {toasts.map((t) => (
          <div key={t.id} className={`alert alert-${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {toasts.map((t) => t.message).join(' ')}
      </div>
    </ToastContext.Provider>
  );
}
