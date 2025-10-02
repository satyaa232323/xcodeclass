"use client";
import { createContext, useContext, useState } from "react";
import { Check, X as XIcon } from "lucide-react";

interface Toast {
  message: string;
  type: "success" | "error";
}

interface ToastContextProps {
  toast: Toast | null;
  showToast: (message: string, type: "success" | "error") => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const hideToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] flex items-center gap-4 px-6 py-4 rounded-xl shadow-lg bg-white border border-gray-200 min-w-[260px] max-w-xs transition-all duration-300">
          <span
            className={`flex items-center justify-center w-10 h-10 rounded-full text-xl
              ${
                toast.type === "success"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }
            `}
          >
            {toast.type === "success" ? (
              <Check size={28} />
            ) : (
              <XIcon size={28} />
            )}
          </span>
          <span className="text-base font-semibold text-gray-900">
            {toast.message}
          </span>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
