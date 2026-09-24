"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/providers/AppProvider";

/** Тостер — қысқа хабарламалар (мысалы «Таңдаулыға қосылды») */
export function Toasts() {
  const { toasts } = useApp();
  return (
    <div
      className="no-print pointer-events-none fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-toast rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-bg shadow-[var(--shadow-lg)]"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

/** Беттің жоғарысына қайтатын батырма және оқу прогресі жолағы */
export function ScrollTools() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    function onScroll() {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? (window.scrollY / height) * 100 : 0);
      setShowTop(window.scrollY > 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        className="no-print fixed top-0 left-0 z-[70] h-[3px] bg-gradient-to-r from-accent to-gold transition-[width] duration-100"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Беттің басына қайту"
        className={`no-print fixed right-4 bottom-4 z-[60] grid h-12 w-12 place-items-center rounded-full border border-line bg-surface text-xl shadow-[var(--shadow-md)] transition hover:border-accent hover:text-accent ${
          showTop ? "grid" : "hidden"
        }`}
      >
        ↑
      </button>
    </>
  );
}
