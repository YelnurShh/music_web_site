import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { instruments } from "@/data/instruments";
import { groupById, instrumentsByGroup } from "@/lib/utils";
import { FavoriteButton } from "@/components/FavoriteButton";
import { InstrumentCard } from "@/components/InstrumentCard";
import { NoteKeyboard } from "@/components/NoteKeyboard";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import { SoundButton } from "@/components/SoundButton";

/** Барлық аспап беттерін алдын ала жасаймыз (статикалық, жылдам ашылады) */
export function generateStaticParams() {
  return instruments.map((instrument) => ({ id: instrument.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const instrument = instruments.find((i) => i.id === id);
  if (!instrument) return { title: "Аспап табылмады" };
  return {
    title: `${instrument.name} — ${instrument.tagline}`,
    description: instrument.short,
  };
}

export default async function InstrumentPage({ params }: Props) {
  const { id } = await params;
  const instrument = instruments.find((i) => i.id === id);
  if (!instrument) notFound();

  const group = groupById(instrument.group);
  const others = instrumentsByGroup(group.id).filter((i) => i.id !== instrument.id);

  return (
    <>
      <section className="py-8 sm:py-10">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <nav aria-label="Бет навигациясы" className="mb-4 flex flex-wrap gap-1.5 text-[0.85rem] text-muted">
            <Link href="/" className="no-underline hover:text-accent hover:underline">
              Басты бет
            </Link>
            <span className="opacity-50">›</span>
            <Link href="/aspaptar" className="no-underline hover:text-accent hover:underline">
              Аспаптар
            </Link>
            <span className="opacity-50">›</span>
            <Link href={`/aspaptar?top=${group.id}`} className="no-underline hover:text-accent hover:underline">
              {group.name}
            </Link>
            <span className="opacity-50">›</span>
            <span>{instrument.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            {/* --- Сол жақ: сурет және дыбыс --- */}
            <div className="lg:sticky lg:top-32 lg:self-start">
              <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-[var(--shadow-md)]">
                <Image
                  src={instrument.img}
                  alt={`${instrument.name} аспабы`}
                  width={1100}
                  height={1100}
                  priority
                  className="aspect-square w-full bg-bg-alt object-contain p-5"
                />
                <div className="border-t border-line bg-surface-2 px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className={`tag ${group.tag}`}>
                      {group.icon} {group.name}
                    </span>
                    <FavoriteButton id={instrument.id} variant="text" />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <SoundButton group={instrument.group} instrumentId={instrument.id} label="Әуенін тыңдау" />
                    <span className="text-[0.8rem] text-muted">Бұл — компьютер жасаған жуық үн</span>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <NoteKeyboard group={instrument.group} />
              </div>
            </div>

            {/* --- Оң жақ: мәтін --- */}
            <div>
              <span className={`tag ${group.tag}`}>
                {group.icon} {group.name}
              </span>
              <h1 className="mt-3 mb-1 font-head text-[clamp(1.8rem,4vw,2.6rem)] font-semibold">
                {instrument.name}
              </h1>
              <p className="text-[0.78rem] tracking-[0.04em] text-muted uppercase">{instrument.latin}</p>
              <p className="text-[1.08rem] text-ink-soft">{instrument.tagline}</p>
              <p>{instrument.desc}</p>

              <h2 className="mt-8 font-head text-2xl">🔧 Бөлшектері</h2>
              <ul className="fact-list">
                {instrument.parts.map((part, index) => (
                  <li key={part.t}>
                    <span className="fact-num">{index + 1}</span>
                    <span>
                      <strong className="block">{part.t}</strong>
                      <span className="text-[0.92rem] text-ink-soft">{part.d}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="card bg-surface-2">
                  <h3 className="font-head text-lg">🔊 Үні қандай?</h3>
                  <p className="m-0 text-[0.94rem] text-ink-soft">{instrument.sound}</p>
                </div>
                <div className="card bg-surface-2">
                  <h3 className="font-head text-lg">🎯 Қайда қолданылады?</h3>
                  <p className="m-0 text-[0.94rem] text-ink-soft">{instrument.usage}</p>
                </div>
              </div>

              <div className="callout mt-6">
                <h3 className="mb-1 font-head text-lg">📜 Тарихынан</h3>
                <p className="m-0 text-[0.95rem] text-ink-soft">{instrument.history}</p>
              </div>

              <div className="mt-6 rounded-2xl border border-dashed border-line-strong bg-surface p-5">
                <h3 className="mb-2 font-head text-lg">📖 Аңыз: {instrument.legend.title}</h3>
                <p className="text-[0.95rem] text-ink-soft">{instrument.legend.text}</p>
                <ReadAloudButton text={`${instrument.legend.title}. ${instrument.legend.text}`} />
              </div>

              <div className="callout callout-gold mt-6">
                <h3 className="mb-1 font-head text-lg">💡 Қызықты дерек</h3>
                <p className="m-0 text-[0.95rem] text-ink-soft">{instrument.fun}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Осы топтағы басқа аспаптар --- */}
      <section className="bg-bg-alt py-12">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <h2 className="font-head text-2xl">Осы топтағы басқа аспаптар</h2>
          <p className="mb-6 max-w-2xl text-ink-soft">
            {group.icon} {group.name} — {group.desc}
          </p>

          {others.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((item) => (
                <InstrumentCard key={item.id} instrument={item} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-line-strong bg-surface-2 p-8 text-center text-muted">
              Бұл топта басқа аспап жоқ.{" "}
              <Link href="/aspaptar" className="font-semibold text-accent no-underline hover:underline">
                Барлық аспаптарды көру →
              </Link>
            </p>
          )}
        </div>
      </section>
    </>
  );
}
