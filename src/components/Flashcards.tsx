"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { instruments } from "@/data/instruments";
import { groupById, shuffle } from "@/lib/utils";
import { SoundButton } from "./SoundButton";

/** Flashcards — флеш-карталар: карточканы аударып, аспап туралы қысқаша мәліметті жаттау */
export function Flashcards() {
  const [order, setOrder] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const reshuffle = useCallback(() => {
    setOrder(shuffle(instruments.map((_, i) => i)));
    setIndex(0);
    setFlipped(false);
  }, []);

  useEffect(() => {
    reshuffle();
  }, [reshuffle]);

  if (order.length === 0) return <p className="text-muted">Карточкалар дайындалып жатыр...</p>;

  const instrument = instruments[order[index]];
  const group = groupById(instrument.group);

  function move(delta: number) {
    setIndex((i) => (i + delta + order.length) % order.length);
    setFlipped(false);
  }

  return (
    <div className="rounded-3xl border border-line bg-surface p-6 shadow-[var(--shadow-md)] sm:p-8">
      <h2 className="mb-2 font-head text-xl">🗂️ Флеш-карталар</h2>
      <p className="mb-5 text-[0.95rem] text-ink-soft">
        Карточканы басып аударыңыз: алдында аспаптың аты, артында — қысқаша сипаты мен қызықты дерегі.
      </p>

      <div className="mx-auto max-w-md">
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-label="Карточканы аудару"
          className={`flip-card block h-56 w-full cursor-pointer rounded-2xl ${flipped ? "is-flipped" : ""}`}
        >
          <span className="flip-inner block h-full w-full">
            <span className="flip-face border border-line bg-surface shadow-[var(--shadow-sm)]">
              <span className="text-4xl" aria-hidden="true">
                {instrument.emoji}
              </span>
              <strong className="font-head text-xl">{instrument.name}</strong>
              <span className={`tag ${group.tag}`}>{group.name}</span>
              <span className="text-[0.82rem] text-muted">Аудару үшін басыңыз 👆</span>
            </span>
            <span className="flip-face bg-teal-soft [transform:rotateY(180deg)]">
              <strong className="font-head text-lg">{instrument.name}</strong>
              <span className="text-[0.92rem]">{instrument.fact}</span>
              <span className="text-[0.85rem] text-ink-soft">{instrument.short}</span>
            </span>
          </span>
        </button>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button type="button" className="btn btn-sm btn-ghost" onClick={() => move(-1)}>
            ← Артқа
          </button>
          <span>
            <b>{index + 1}</b> / {order.length}
          </span>
          <button type="button" className="btn btn-sm btn-ghost" onClick={() => move(1)}>
            Алға →
          </button>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button type="button" className="btn btn-sm btn-ghost" onClick={reshuffle}>
            🔀 Араластыру
          </button>
          <SoundButton group={instrument.group} instrumentId={instrument.id} />
          <Link href={`/aspap/${instrument.id}`} className="btn btn-sm btn-ghost no-underline">
            📖 Толық оқу
          </Link>
        </div>
      </div>
    </div>
  );
}
