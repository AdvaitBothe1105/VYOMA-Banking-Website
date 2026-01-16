"use client";

import { useToast } from "./ToastContext";
import { X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start justify-between gap-3 rounded-md px-4 py-3 text-sm font-medium animate-in fade-in slide-in-from-right-4 ${
            toast.type === "success"
              ? "bg-green-500/15 border border-green-500/30 text-green-700 dark:text-green-400"
              : toast.type === "error"
              ? "bg-destructive/15 border border-destructive/30 text-destructive"
              : "bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-400"
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
