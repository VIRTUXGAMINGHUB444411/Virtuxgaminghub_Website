"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { CheckCircle2, AlertCircle, Info } from "@/components/Icons";

export const Toast: React.FC = () => {
  const { toasts } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
      {toasts.map((toast) => {
        const isError = toast.type === "error";
        const isInfo = toast.type === "info";
        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-3 p-4 rounded-xl border bg-[#0b0b0c] text-white transition-all duration-300 shadow-2xl backdrop-blur-md"
            style={{
              borderColor: isError
                ? "rgba(239, 68, 68, 0.4)"
                : isInfo
                ? "rgba(14, 165, 233, 0.4)"
                : "rgba(225, 6, 0, 0.4)",
            }}
          >
            <div className="shrink-0">
              {isError ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : isInfo ? (
                <Info className="w-5 h-5 text-sky-400" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-[#e10600]" />
              )}
            </div>
            <span className="text-xs font-semibold text-white/90 font-rajdhani tracking-wide">
              {toast.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};
