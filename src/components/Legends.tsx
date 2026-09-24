"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { legends } from "@/data/legends";
import { cn } from "@/lib/utils";
import { ReadAloudButton } from "./ReadAloudButton";

/** Legends — аңыздар тізімі: атын бассаңыз мәтіні ашылады, дауыстап оқуға болады */
export function Legends() {
  const [openIds, setOpenIds] = useState<string[]>([]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && legends.some((l) => l.id === hash)) {
      setOpenIds([hash]);
      window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 200);
    }
  }, []);

  const allOpen = openIds.length === legends.length;

  function toggle(id: string) {
    setOpenIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  }

  return (
    <>
      <div className="mb-5">
        <button
          type="button"
          className="btn btn-sm btn-ghost"
          onClick={() => setOpenIds(allOpen ? [] : legends.map((l) => l.id))}
        >
          {allOpen ? "📕 Барлығын жабу" : "📖 Барлығын ашу"}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {legends.map((legend, index) => {
          const open = openIds.includes(legend.id);
          return (
            <article
              key={legend.id}
              id={legend.id}
              className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-sm)] scroll-mt-32"
            >
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`legend-${legend.id}`}
                onClick={() => toggle(legend.id)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-surface-2"
              >
                <span>
                  <span className="block text-[0.82rem] text-muted">
                    {index + 1}-аңыз · Аспап: {legend.instrument}
                  </span>
                  <span className="block font-head text-[1.1rem] font-semibold">📖 {legend.title}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={cn("text-xl text-accent transition-transform", open && "rotate-180")}
                >
                  ▾
                </span>
              </button>

              {open && (
                <div className="animate-fade border-t border-line px-5 pt-4 pb-5">
                  {legend.paras.map((paragraph, i) => (
                    <p key={i} className="text-ink-soft">
                      {paragraph}
                    </p>
                  ))}
                  <div className="mt-4 rounded-xl bg-gold-soft px-4 py-3 text-[0.94rem]">💭 {legend.moral}</div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <ReadAloudButton text={`${legend.title}. ${legend.paras.join(" ")}`} />
                    <Link href={`/aspaptar?q=${encodeURIComponent(legend.instrument)}`} className="btn btn-sm btn-ghost no-underline">
                      🎵 {legend.instrument} туралы оқу
                    </Link>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}
