"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { instruments } from "@/data/instruments";

/** HomeFact — «Білдіңіз бе?» блогы: батырманы басқанда жаңа дерек шығады */
export function HomeFact() {
  const facts = useMemo(
    () =>
      instruments.flatMap((i) => [
        { text: i.fun, name: i.name, id: i.id },
        { text: `${i.fact} — ${i.name}`, name: i.name, id: i.id },
      ]),
    [],
  );
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setCurrent(Math.floor(Math.random() * facts.length));
  }, [facts.length]);

  const fact = facts[current];

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
      <div className="flex-1">
        <span className="eyebrow">💡 Қызықты дерек</span>
        <h2 className="font-head text-2xl">Білдіңіз бе?</h2>
        <p className="mb-4 text-ink-soft">
          Батырманы әр басқанда жаңа дерек шығады. Осылайша оқушы біртіндеп көп ақпарат біледі.
        </p>
        <button
          type="button"
          className="btn"
          onClick={() => setCurrent((c) => (c + 1 + Math.floor(Math.random() * 3)) % facts.length)}
        >
          🔄 Жаңа дерек көрсету
        </button>
      </div>

      <div className="card min-h-40 flex-1 justify-center" aria-live="polite">
        {fact && (
          <>
            <p className="mb-1 text-[1.05rem]">{fact.text}</p>
            <Link href={`/aspap/${fact.id}`} className="link-arrow font-semibold text-accent no-underline hover:underline">
              {fact.name} туралы толық оқу →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
