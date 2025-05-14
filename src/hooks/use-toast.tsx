
import * as React from "react";
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
  id?: string;
};

type ToastContextType = {
  toast: (props: ToastProps) => void;
  toasts: ToastProps[];
  dismissToast: (index: number) => void;
};

export const ToastContext = React.createContext<ToastContextType>({
  toast: () => {},
  toasts: [],
  dismissToast: () => {},
});

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<(ToastProps & { id: string })[]>([]);

  const toast = (props: ToastProps) => {
    const id = props.id || Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { ...props, id }]);

    // Display using sonner toast
    const variant = props.variant || "default";
    if (variant === "destructive") {
      sonnerToast.error(props.title || '', {
        description: props.description,
        duration: props.duration || 5000,
        id
      });
    } else if (variant === "success") {
      sonnerToast.success(props.title || '', {
        description: props.description,
        duration: props.duration || 5000,
        id
      });
    } else {
      sonnerToast.info(props.title || '', {
        description: props.description,
        duration: props.duration || 5000,
        id
      });
    }

    // Auto dismiss after duration
    const duration = props.duration || 5000;
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }, duration);
  };

  const dismissToast = (index: number) => {
    setToasts((prevToasts) => prevToasts.filter((_, i) => i !== index));
  };

  return (
    <ToastContext.Provider value={{ toast, toasts, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Export the toast directly for easier usage
export const toast = sonnerToast;
