"use client";

import Image from "next/image";
import Link from "next/link";
import type { Instrument } from "@/data/types";
import { groupById } from "@/lib/utils";
import { FavoriteButton } from "./FavoriteButton";
import { GroupIcon, InstrumentIcon } from "./InstrumentIcon";
import { SoundButton } from "./SoundButton";

/** InstrumentCard — аспап туралы қысқаша карточка (каталог пен басты бетте қолданылады) */
export function InstrumentCard({
  instrument,
  compare,
}: {
  instrument: Instrument;
  /** Каталогтағы «Салыстыру» бекіштіктері — карточканың төменгі жолағында (ағымында) тұрады */
  compare?: { checked: boolean; onToggle: () => void };
}) {
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
        <InstrumentIcon instrument={instrument} className="absolute top-3 left-3 h-12 w-12 bg-surface/95" />
      </Link>

      <div className="flex flex-1 flex-col gap-2 px-5 pt-4 pb-5">
        <span className={`tag self-start ${group.tag}`}>
          <GroupIcon groupId={group.id} className="h-5 w-5 rounded-md border-0 shadow-none" /> {group.name}
        </span>
        <h3 className="font-head text-[1.2rem] font-semibold">
          <Link href={`/aspap/${instrument.id}`} className="no-underline hover:text-accent">
            {instrument.name}
          </Link>
        </h3>
        <span className="text-[0.78rem] tracking-[0.04em] text-muted uppercase">{instrument.latin}</span>
        <p className="text-[0.94rem] text-ink-soft">{instrument.short}</p>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          <SoundButton instrumentId={instrument.id} />
          <Link href={`/aspap/${instrument.id}`} className="btn btn-sm no-underline">
            Толық оқу →
          </Link>
        </div>
      </div>

      {compare && (
        <label className="flex cursor-pointer items-center gap-2 border-t border-line bg-surface-2 px-5 py-2.5 text-[0.8rem] font-bold text-ink-soft select-none">
          <input
            type="checkbox"
            className="accent-accent"
            checked={compare.checked}
            onChange={compare.onToggle}
          />
          Салыстыру
        </label>
      )}
    </article>
  );
}
