import React, { createContext, useContext, useState } from 'react';
import ReactDOM from 'react-dom';

export type ToastType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'neutral'
  | 'loading';
interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
  closable?: boolean;
}

const noop = () => {
  /* noop */
};
const ToastContext =
  createContext<
    (opts: {
      message: string;
      type?: ToastType;
      duration?: number;
      closable?: boolean;
    }) => void
  >(noop);

export const useToast = () => useContext(ToastContext);

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: number) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  };

  const showToast = ({
    message,
    type = 'info',
    duration = 3000,
    closable = false,
  }: {
    message: string;
    type?: ToastType;
    duration?: number;
    closable?: boolean;
  }) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type, duration, closable }]);
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {ReactDOM.createPortal(
        <div className="toast toast-top toast-end z-50" aria-live="assertive">
          {toasts.map((t) => (
            <div key={t.id} className={`alert alert-${t.type} relative`}>
              {t.message}
              {t.closable && (
                <button
                  className="btn btn-xs btn-circle btn-ghost absolute right-1 top-1"
                  onClick={() => removeToast(t.id)}
                  aria-label="Close"
                >
                  ✕
                </button>
              )}
              {t.duration && t.duration > 0 && (
                <div
                  className={`absolute bottom-0 left-0 h-1 w-full rounded-b ${
                    {
                      info: 'bg-info',
                      success: 'bg-success',
                      warning: 'bg-warning',
                      error: 'bg-error',
                      neutral: 'bg-neutral',
                      loading: 'bg-primary',
                    }[t.type]
                  }`}
                  style={{
                    animation: `toast-progress linear ${t.duration}ms forwards`,
                  }}
                />
              )}
            </div>
          ))}
        </div>,
        document.getElementById('overlay-root') as HTMLElement
      )}
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
