"use client";

import Image from "next/image";
import Link from "next/link";
import type { Instrument } from "@/data/types";
import { groupById } from "@/lib/utils";
import { FavoriteButton } from "./FavoriteButton";
import { SoundButton } from "./SoundButton";

/** InstrumentCard — аспап туралы қысқаша карточка (каталог пен басты бетте қолданылады) */
export function InstrumentCard({ instrument }: { instrument: Instrument }) {
  const group = groupById(instrument.group);

  return (
    <article className="card-hover relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-sm)]">
      <FavoriteButton id={instrument.id} />

      <Link
        href={`/aspap/${instrument.id}`}
        className="relative block aspect-square bg-bg-alt"
        aria-label={`${instrument.name} туралы толық оқу`}
      >
        <Image
          src={instrument.img}
          alt={`${instrument.name} аспабы`}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          className="object-contain p-3"
        />
        <span
          aria-hidden="true"
          className="absolute top-3 left-3 grid h-10 w-10 place-items-center rounded-xl bg-surface/90 text-xl shadow-[var(--shadow-sm)]"
        >
          {instrument.emoji}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2 px-5 pt-4 pb-5">
        <span className={`tag self-start ${group.tag}`}>
          {group.icon} {group.name}
        </span>
        <h3 className="font-head text-[1.2rem] font-semibold">
          <Link href={`/aspap/${instrument.id}`} className="no-underline hover:text-accent">
            {instrument.name}
          </Link>
        </h3>
        <span className="text-[0.78rem] tracking-[0.04em] text-muted uppercase">{instrument.latin}</span>
        <p className="text-[0.94rem] text-ink-soft">{instrument.short}</p>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          <SoundButton group={instrument.group} instrumentId={instrument.id} />
          <Link href={`/aspap/${instrument.id}`} className="btn btn-sm no-underline">
            Толық оқу →
          </Link>
        </div>
      </div>
    </article>
  );
}
