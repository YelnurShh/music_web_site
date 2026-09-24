"use client";

import { useEffect, type ReactNode } from "react";

/** Modal — қарапайым терезе (мысалы, аспаптарды салыстыру кестесі үшін) */
export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgb(20_25_27/0.55)] p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="animate-fade max-h-[88vh] w-[min(44rem,100%)] overflow-y-auto rounded-3xl border border-line bg-surface p-6 shadow-[var(--shadow-lg)]"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="m-0 font-head text-xl">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Терезені жабу"
            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-line bg-surface-2 text-lg hover:border-accent hover:text-accent"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
