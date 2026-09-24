"use client";

import { instruments } from "@/data/instruments";
import { useApp } from "@/providers/AppProvider";
import { InstrumentCard } from "./InstrumentCard";

/**
 * FavoritesSection — басты бетте «Менің таңдаулыларым» бөлімі.
 * Таңдаулылар болмаса, бөлім мүлде көрсетілмейді.
 */
export function FavoritesSection() {
  const { favorites } = useApp();
  const list = instruments.filter((i) => favorites.includes(i.id));

  if (list.length === 0) return null;

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto w-[min(100%-2rem,1180px)]">
        <span className="eyebrow">⭐ Менің таңдаулыларым</span>
        <h2 className="font-head text-2xl">Сіз таңдаған аспаптар</h2>
        <p className="mb-6 max-w-2xl text-ink-soft">
          Бұл тізім браузерде сақталады. Firebase қосылған жағдайда ол сіздің құрылғыларыңызда да
          қолжетімді болады.
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((instrument) => (
            <InstrumentCard key={instrument.id} instrument={instrument} />
          ))}
        </div>
      </div>
    </section>
  );
}
