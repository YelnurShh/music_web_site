"use client";

import { useEffect, useMemo, useState } from "react";
import { glossary } from "@/data/glossary";
import { kzCompare } from "@/lib/utils";

/** Glossary — түсініктер сөздігі: әліпби бойынша жүру, іздеу және басып шығару */
export function Glossary() {
  const [query, setQuery] = useState("");

  const letters = useMemo(() => {
    const map = new Map<string, typeof glossary>();
    glossary.forEach((term) => {
      const letter = term.term.charAt(0).toUpperCase();
      map.set(letter, [...(map.get(letter) ?? []), term]);
    });
    return new Map([...map.entries()].sort((a, b) => kzCompare(a[0], b[0])));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const map = new Map<string, typeof glossary>();
    letters.forEach((terms, letter) => {
      const list = q ? terms.filter((t) => `${t.term} ${t.def}`.toLowerCase().includes(q)) : terms;
      if (list.length) map.set(letter, [...list].sort((a, b) => kzCompare(a.term, b.term)));
    });
    return map;
  }, [letters, query]);

  /* Сілтеме арқылы келгенде (?h=Ш) сол әріпке жылжытамыз */
  useEffect(() => {
    const letter = new URLSearchParams(window.location.search).get("h");
    if (!letter) return;
    const target = document.getElementById(`letter-${letter.toUpperCase()}`);
    if (target) window.setTimeout(() => target.scrollIntoView({ block: "start", behavior: "smooth" }), 250);
  }, []);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-4">
        <label className="flex flex-1 items-center gap-2 text-[0.88rem] text-muted">
          🔍 Сөз іздеу:
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="мысалы: шанақ, күй, перне..."
            className="flex-1 rounded-full border border-line bg-surface-2 px-4 py-2 text-[0.92rem] text-ink outline-none focus:border-accent"
          />
        </label>
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => window.print()}>
          🖨️ Басып шығару
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-1.5" role="group" aria-label="Әліпби бойынша өту">
        {[...letters.keys()].map((letter) => (
          <button
            key={letter}
            type="button"
            onClick={() => document.getElementById(`letter-${letter}`)?.scrollIntoView({ block: "start", behavior: "smooth" })}
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-line bg-surface text-[0.85rem] font-bold text-ink-soft transition hover:border-accent hover:text-accent"
            aria-label={`${letter} әрпіне өту`}
          >
            {letter}
          </button>
        ))}
      </div>

      {filtered.size === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-surface-2 p-10 text-center text-muted">
          Сөз табылмады 🤔
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {[...filtered.entries()].map(([letter, terms]) => (
            <section key={letter} id={`letter-${letter}`} className="scroll-mt-32">
              <h2 className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-accent-soft font-head text-xl text-accent-dark">
                {letter}
              </h2>
              <dl className="m-0">
                {terms.map((term) => (
                  <div key={term.term} className="border-b border-dashed border-line py-3 last:border-b-0">
                    <dt className="font-head font-bold">{term.term}</dt>
                    <dd className="mt-1 mb-0 text-[0.95rem] text-ink-soft">{term.def}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
