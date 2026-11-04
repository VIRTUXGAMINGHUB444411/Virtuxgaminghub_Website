"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";

export const Toast: React.FC = () => {
  const { toasts } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 p-4 rounded-xl border bg-white text-slate-900 transition-all duration-300 shadow-xl"
          style={{
            borderColor:
              toast.type === "error"
                ? "#fecaca"
                : toast.type === "info"
                ? "#e2e8f0"
                : "#fca5a5",
          }}
        >
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{
              backgroundColor:
                toast.type === "error"
                  ? "#ef4444"
                  : toast.type === "info"
                  ? "#0284c7"
                  : "#f92f35",
            }}
          />
          <span className="text-xs font-semibold text-slate-800 font-sans tracking-wide">
            {toast.text}
          </span>
        </div>
      ))}
    </div>
  );
};
