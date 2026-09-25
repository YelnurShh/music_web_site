"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { GroupSortGame } from "./GroupSortGame";
import { MemoryGame } from "./MemoryGame";
import { Quiz } from "./Quiz";
import { WordBuilderGame } from "./WordBuilderGame";

type TabId = "quiz" | "memory" | "groups" | "words";

const TABS: { id: TabId; label: string }[] = [
  { id: "quiz", label: "🎯 Викторина" },
  { id: "memory", label: "🧠 Жұп тап" },
  { id: "groups", label: "🧩 Тобына бөл" },
  { id: "words", label: "🔤 Сөз құрастыр" },
];

/** GamesTabs — ойындарды қойындылар (tabs) арқылы көрсетеді */
export function GamesTabs() {
  const [tab, setTab] = useState<TabId>("quiz");

  useEffect(() => {
    function syncFromHash() {
      const hash = window.location.hash.replace("#", "");
      if (TABS.some((item) => item.id === hash)) setTab(hash as TabId);
    }

    const timer = window.setTimeout(syncFromHash, 0);
    window.addEventListener("hashchange", syncFromHash);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", syncFromHash);
    };
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
        {tab === "groups" && <GroupSortGame />}
        {tab === "words" && <WordBuilderGame />}
      </div>
    </>
  );
}
