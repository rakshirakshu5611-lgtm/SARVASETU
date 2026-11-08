
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import "./Toast.css";

const ToastContext = createContext(null);

const toastStyles = {
  success: {
    title: "Success",
    accent: "#596B5A",
  },
  saved: {
    title: "Saved",
    accent: "#A86E7D",
  },
  info: {
    title: "Information",
    accent: "#77718F",
  },
  warning: {
    title: "Warning",
    accent: "#9A8146",
  },
  error: {
    title: "Something went wrong",
    accent: "#A6534D",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());
  const nextId = useRef(0);

  const dismissToast = useCallback((id) => {
    const timer = timers.current.get(id);

    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }

    setToasts((current) =>
      current.filter((toast) => toast.id !== id)
    );
  }, []);

  const showToast = useCallback(
    (message, type = "success", duration = 3500) => {
      const id = ++nextId.current;
      const safeType = toastStyles[type] ? type : "info";

      setToasts((current) => [
        ...current,
        {
          id,
          message: String(message),
          type: safeType,
        },
      ]);

      const timer = window.setTimeout(() => {
        dismissToast(id);
      }, Math.max(1000, duration));

      timers.current.set(id, timer);

      return id;
    },
    [dismissToast]
  );

  useEffect(() => {
    const activeTimers = timers.current;

    return () => {
      activeTimers.forEach((timer) => {
        window.clearTimeout(timer);
      });

      activeTimers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}

      <div
        className="sarvasetu-toast-container"
        aria-live="polite"
        aria-relevant="additions"
      >
        {toasts.map((toast) => {
          const style = toastStyles[toast.type];

          return (
            <div
              key={toast.id}
              className={`sarvasetu-toast sarvasetu-toast-${toast.type}`}
              style={{ "--toast-accent": style.accent }}
              role={toast.type === "error" ? "alert" : "status"}
            >
              <div className="sarvasetu-toast-content">
                <strong>{style.title}</strong>
                <p>{toast.message}</p>
              </div>

              <button
                type="button"
                className="sarvasetu-toast-close"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider"
    );
  }

  return context;
}