import { createContext, useContext, useEffect, useRef, useState } from "react";
import ToastViewport from "../components/ToastViewport";

const ToastContext = createContext(null);

function createToastId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timeoutIdsRef = useRef(new Map());

  function dismissToast(toastId) {
    const timeoutId = timeoutIdsRef.current.get(toastId);

    if (timeoutId) {
      globalThis.clearTimeout(timeoutId);
      timeoutIdsRef.current.delete(toastId);
    }

    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== toastId));
  }

  function showToast(message, options = {}) {
    const toastId = createToastId();
    const nextToast = {
      id: toastId,
      message,
      title: options.title ?? null,
      tone: options.tone ?? "success",
    };

    setToasts((currentToasts) => [...currentToasts, nextToast]);

    const timeoutId = globalThis.setTimeout(() => {
      dismissToast(toastId);
    }, options.durationMs ?? 4000);

    timeoutIdsRef.current.set(toastId, timeoutId);

    return toastId;
  }

  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach((timeoutId) => {
        globalThis.clearTimeout(timeoutId);
      });
      timeoutIdsRef.current.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ dismissToast, showToast }}>
      {children}
      <ToastViewport onDismiss={dismissToast} toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
