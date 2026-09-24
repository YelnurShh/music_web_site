"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { instruments } from "@/data/instruments";
import { playNote } from "@/lib/synth";
import { shuffle } from "@/lib/utils";
import { useApp } from "@/providers/AppProvider";
import { cn } from "@/lib/utils";

interface MemoryCard {
  key: string;
  instrumentId: string;
  label: string;
  emoji: string;
  kind: "emoji" | "name";
}

const PAIRS = 6;

/** MemoryGame — «Жұп тап»: аспаптың белгісі мен атын сәйкестендіру ойыны */
export function MemoryGame() {
  const { notify } = useApp();
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [done, setDone] = useState(false);
  const lock = useRef(false);
  const timer = useRef<number | null>(null);

  const start = useCallback(() => {
    const picked = shuffle(instruments).slice(0, PAIRS);
    const deck: MemoryCard[] = [];
    picked.forEach((item) => {
      deck.push({ key: `${item.id}-emoji`, instrumentId: item.id, label: item.emoji, emoji: item.emoji, kind: "emoji" });
      deck.push({ key: `${item.id}-name`, instrumentId: item.id, label: item.name, emoji: item.emoji, kind: "name" });
    });
    setCards(shuffle(deck));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setDone(false);
    lock.current = false;
  }, []);

  useEffect(() => {
    start();
  }, [start]);

  useEffect(() => {
    if (done) return;
    timer.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [done]);

  useEffect(() => {
    if (matched.length === PAIRS && matched.length > 0 && !done) {
      setDone(true);
      notify("Жарайсыз! Барлық жұп табылды 🎉");
    }
  }, [matched, done, notify]);

  function flip(card: MemoryCard) {
    if (lock.current || flipped.includes(card.key) || matched.includes(card.instrumentId)) return;
    if (flipped.length === 0) {
      setFlipped([card.key]);
      return;
    }
    if (flipped.length === 1) {
      const firstKey = flipped[0];
      const first = cards.find((c) => c.key === firstKey);
      setFlipped([firstKey, card.key]);
      setMoves((m) => m + 1);

      if (first && first.instrumentId === card.instrumentId) {
        setMatched((list) => [...list, card.instrumentId]);
        setFlipped([]);
        playNote("string", Math.min(matched.length * 2, 12), 0.5);
      } else {
        lock.current = true;
        window.setTimeout(() => {
          setFlipped([]);
          lock.current = false;
        }, 750);
      }
    }
  }

  return (
    <div className="rounded-3xl border border-line bg-surface p-6 shadow-[var(--shadow-md)] sm:p-8">
      <h2 className="mb-2 font-head text-xl">🧠 «Жұп тап» ойыны</h2>
      <p className="mb-4 text-[0.95rem] text-ink-soft">
        12 карточка бар. Бір аспаптың белгісі мен атын жұптастырып табыңыз. Карточканы бассаңыз — аударылады.
      </p>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-[0.92rem]">
        <span>
          <b>Жұп:</b> {matched.length} / {PAIRS}
        </span>
        <span>
          <b>Жүріс:</b> {moves}
        </span>
        <span>
          <b>Уақыт:</b> {seconds} с
        </span>
        <button type="button" className="btn btn-sm btn-ghost" onClick={start}>
          🔄 Қайта бастау
        </button>
      </div>

      {done && (
        <div className="mb-4 rounded-2xl border border-transparent bg-ok-soft p-4">
          <strong className="block">🎉 Барлық жұп табылды!</strong>
          <p className="m-0 text-[0.95rem] text-ink-soft">
            Жүріс саны: {moves} · Уақыт: {seconds} секунд. Барабарсыз!
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((card) => {
          const isOpen = flipped.includes(card.key) || matched.includes(card.instrumentId);
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => flip(card)}
              aria-label={isOpen ? card.label : "Жабық карточка"}
              className={cn("flip-card aspect-square cursor-pointer rounded-2xl", isOpen && "is-flipped")}
            >
              <span className="flip-inner block h-full w-full">
                <span className="flip-face bg-gradient-to-br from-accent to-gold text-3xl text-white">
                  <span aria-hidden="true">🎵</span>
                </span>
                <span
                  className={cn(
                    "flip-face border-2 border-line bg-surface text-lg font-semibold [transform:rotateY(180deg)]",
                    matched.includes(card.instrumentId) && "border-ok bg-ok-soft",
                  )}
                >
                  {card.kind === "emoji" ? <span className="text-4xl">{card.label}</span> : card.label}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
