import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      onDismiss(toasts[0].id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-card toast-${toast.type}`}>
          <div className="toast-icon">
            {toast.type === 'success' ? (
              <CheckCircle2 size={20} className="icon-success" />
            ) : (
              <AlertCircle size={20} className="icon-error" />
            )}
          </div>
          <span className="toast-text">{toast.text}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            className="toast-close"
            title="Cerrar notificación"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
