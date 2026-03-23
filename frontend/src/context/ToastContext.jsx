import { createContext, useContext, useState } from 'react';

import ToastViewport from '../components/ToastViewport';

const ToastContext = createContext(null);

let nextToastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  };

  const pushToast = (message, tone = 'info') => {
    const id = nextToastId++;

    setToasts((currentToasts) => [...currentToasts, { id, message, tone }]);

    window.setTimeout(() => {
      removeToast(id);
    }, 3600);
  };

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
