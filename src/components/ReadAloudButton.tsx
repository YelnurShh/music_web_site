"use client";

import { useApp } from "@/providers/AppProvider";
import { speak } from "@/lib/readAloud";
import { cn } from "@/lib/utils";

/**
 * ReadAloudButton — мәтінді дауыстап оқу.
 * Оқуға қиналатын оқушыға да, көзі нашар көретін үлкен кісіге де көмектеседі.
 */
export function ReadAloudButton({ text, className }: { text: string; className?: string }) {
  const { notify } = useApp();

  function handleClick() {
    const result = speak(text);
    if (result === "unsupported") notify("Бұл браузер дауыстап оқуды қолдамайды");
    else if (result === "empty") notify("Оқитын мәтін табылмады");
    else notify("Дауыстап оқылуда... 🔉");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn("btn btn-sm btn-ghost", className)}
      aria-label="Мәтінді дауыстап оқу"
    >
      🔊 Дыбыстап оқу
    </button>
  );
}
