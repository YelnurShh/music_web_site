"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { instrumentRecordings } from "@/data/instrumentRecordings";
import { cn } from "@/lib/utils";

/**
 * SoundButton — аспап үнін тыңдау батырмасы.
 * Интернеттен табылған нақты орындауды YouTube плеерінде ашады.
 */
export function SoundButton({
  instrumentId,
  label = "Үнін тыңдау",
  className,
}: {
  instrumentId: string;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const recording = instrumentRecordings[instrumentId];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  if (!recording) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setLoading(true);
          setOpen(true);
        }}
        className={cn("btn btn-sm btn-ghost", className)}
        aria-haspopup="dialog"
        aria-label={`${recording.title} жазбасын тыңдау`}
      >
        <span className="sound-wave" aria-hidden="true">
          <i style={{ height: "40%" }} />
          <i style={{ height: "100%" }} />
          <i style={{ height: "65%" }} />
        </span>
        {label}
      </button>

      {mounted && open &&
        createPortal(
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-[radial-gradient(circle_at_top_left,#f8efdc_0%,#faf7f2_48%,#e2f0ee_100%)] p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={recording.title}
              className="w-full max-w-3xl overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
                <div>
                  <h2 className="m-0 font-head text-xl">{recording.title}</h2>
                  <p className="m-0 mt-1 text-sm text-muted">Дереккөз: {recording.source}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn btn-sm btn-ghost"
                  aria-label="Тыңдалымды жабу"
                >
                  ✕
                </button>
              </div>
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gold-soft via-surface-2 to-teal-soft">
                {loading && (
                  <div
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 text-center"
                    role="status"
                    aria-live="polite"
                  >
                    <span className="h-12 w-12 animate-spin rounded-full border-4 border-line-strong border-t-accent" />
                    <span className="font-semibold text-ink-soft">Тыңдалым жүктеліп жатыр...</span>
                  </div>
                )}
                <iframe
                  className={cn("h-full w-full transition-opacity duration-300", loading ? "opacity-0" : "opacity-100")}
                  src={`https://www.youtube-nocookie.com/embed/${recording.youtubeId}?autoplay=1&rel=0`}
                  title={recording.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  onLoad={() => setLoading(false)}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm text-muted">
                <span>Бұл — аспаптың интернеттегі нақты орындалу жазбасы.</span>
                <a
                  href={`https://www.youtube.com/watch?v=${recording.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-accent no-underline hover:underline"
                >
                  YouTube-та ашу ↗
                </a>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
