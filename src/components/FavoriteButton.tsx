"use client";

import { useApp } from "@/providers/AppProvider";
import { cn } from "@/lib/utils";

/** FavoriteButton — аспапты таңдаулыларға қосу батырмасы (браузерде және Firebase-да сақталады) */
export function FavoriteButton({
  id,
  variant = "icon",
  className,
}: {
  id: string;
  variant?: "icon" | "text";
  className?: string;
}) {
  const { isFavorite, toggleFavorite } = useApp();
  const active = isFavorite(id);

  if (variant === "text") {
    return (
      <button
        type="button"
        onClick={() => toggleFavorite(id)}
        aria-pressed={active}
        className={cn("btn btn-sm btn-ghost", active && "border-accent bg-accent-soft text-accent-dark", className)}
      >
        {active ? "⭐ Таңдаулыда" : "☆ Таңдаулыға қосу"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(id)}
      aria-pressed={active}
      title={active ? "Таңдаулылардан алу" : "Таңдаулыға қосу"}
      aria-label={active ? "Таңдаулылардан алу" : "Таңдаулыға қосу"}
      className={cn(
        "absolute top-3 right-3 z-20 grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-line text-lg transition hover:scale-105",
        active ? "border-accent bg-accent text-white" : "bg-surface/90",
        className,
      )}
    >
      {active ? "⭐" : "☆"}
    </button>
  );
}
