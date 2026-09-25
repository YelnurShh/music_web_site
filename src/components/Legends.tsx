"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { legends } from "@/data/legends";
import { instruments } from "@/data/instruments";
import { cn } from "@/lib/utils";

/** Legends — аңыздар тізімі: атын бассаңыз мәтіні ашылады. */
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
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4 shadow-[var(--shadow-sm)]">
        <div>
          <p className="m-0 text-sm font-semibold text-accent">6 халық аңызы</p>
          <p className="m-0 text-sm text-muted">Карточканы басып, аңызды толық оқыңыз</p>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-ghost"
          onClick={() => setOpenIds(allOpen ? [] : legends.map((l) => l.id))}
        >
          {allOpen ? "📕 Барлығын жабу" : "📖 Барлығын ашу"}
        </button>
      </div>

      <div className="grid items-start gap-6 md:grid-cols-2">
        {legends.map((legend, index) => {
          const open = openIds.includes(legend.id);
          const instrument = instruments.find((item) => item.name === legend.instrument);
          return (
            <article
              key={legend.id}
              id={legend.id}
              className={cn(
                "group overflow-hidden rounded-3xl border bg-surface shadow-[var(--shadow-sm)] transition duration-300 scroll-mt-32",
                open ? "border-accent/40 shadow-[var(--shadow-md)]" : "border-line hover:-translate-y-1 hover:shadow-[var(--shadow-md)]",
              )}
            >
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`legend-${legend.id}`}
                onClick={() => toggle(legend.id)}
                className="w-full cursor-pointer text-left"
              >
                <span className="relative block aspect-[16/9] overflow-hidden bg-gradient-to-br from-gold-soft to-teal-soft">
                  {instrument && (
                    <Image
                      src={instrument.img}
                      alt={`${legend.instrument} аспабы — ${legend.title} аңызы`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain p-5 transition duration-500 group-hover:scale-105"
                    />
                  )}
                  <span className="absolute top-4 left-4 rounded-full border border-white/60 bg-surface/90 px-3 py-1 text-xs font-bold text-accent shadow-sm backdrop-blur">
                    {String(index + 1).padStart(2, "0")} · Халық аңызы
                  </span>
                </span>
                <span className="flex items-center justify-between gap-4 px-5 py-5">
                  <span>
                    <span className="mb-1 block text-[0.78rem] font-bold tracking-[0.08em] text-teal uppercase">
                      {legend.instrument}
                    </span>
                    <span className="block font-head text-[1.2rem] font-semibold text-ink">{legend.title}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-soft text-xl text-accent transition-transform",
                      open && "rotate-180",
                    )}
                  >
                    ▾
                  </span>
                </span>
              </button>

              {open && (
                <div id={`legend-${legend.id}`} className="animate-fade border-t border-line px-5 pt-5 pb-6">
                  {legend.paras.map((paragraph, i) => (
                    <p key={i} className={cn("text-ink-soft", i === 0 && "first-letter:float-left first-letter:mr-2 first-letter:font-head first-letter:text-5xl first-letter:font-bold first-letter:text-accent")}>
                      {paragraph}
                    </p>
                  ))}
                  <div className="mt-5 rounded-2xl border border-gold/25 bg-gold-soft px-4 py-4 text-[0.94rem]">
                    <span className="mr-2" aria-hidden="true">💭</span>
                    {legend.moral}
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
