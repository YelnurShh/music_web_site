"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Flashcards } from "./Flashcards";
import { MemoryGame } from "./MemoryGame";
import { Quiz } from "./Quiz";
import { RhythmStudio } from "./RhythmStudio";

type TabId = "quiz" | "memory" | "flash" | "rhythm";

const TABS: { id: TabId; label: string }[] = [
  { id: "quiz", label: "🎯 Викторина" },
  { id: "memory", label: "🧠 Жұп тап" },
  { id: "flash", label: "🗂️ Флеш-карталар" },
  { id: "rhythm", label: "🥁 Ырғақ" },
];

/** GamesTabs — ойындарды қойындылар (tabs) арқылы көрсетеді */
export function GamesTabs() {
  const [tab, setTab] = useState<TabId>("quiz");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && TABS.some((t) => t.id === hash)) setTab(hash as TabId);
  }, []);

  function choose(id: TabId) {
    setTab(id);
    window.history.replaceState(null, "", `#${id}`);
  }

  return (
    <>
      <div
        role="tablist"
        aria-label="Ойын түрлері"
        className="mb-6 flex flex-wrap gap-2 rounded-full border border-line bg-bg-alt p-1.5"
      >
        {TABS.map((item) => (
          <button
            key={item.id}
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls={`panel-${item.id}`}
            className={cn(
              "cursor-pointer rounded-full px-4 py-2.5 text-[0.92rem] font-semibold transition",
              tab === item.id ? "bg-surface text-accent-dark shadow-[var(--shadow-sm)]" : "text-ink-soft hover:text-accent",
            )}
            onClick={() => choose(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} key={tab} className="animate-fade">
        {tab === "quiz" && <Quiz />}
        {tab === "memory" && <MemoryGame />}
        {tab === "flash" && <Flashcards />}
        {tab === "rhythm" && <RhythmStudio />}
      </div>
    </>
  );
}
