import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { groups } from "@/data/groups";
import { instruments } from "@/data/instruments";
import { timeline } from "@/data/timeline";
import { instrumentsByGroup } from "@/lib/utils";
import { PageHero } from "@/components/PageHero";
import { GroupIcon } from "@/components/InstrumentIcon";
import { PrintButton } from "@/components/PrintButton";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Аспаптар тарихы",
  description:
    "Қазақтың музыкалық аспаптарының тарихы: ежелгі дәуірден бүгінгі цифрлық әлемге дейінгі 8 кезең.",
};

const ERA_DETAILS = [
  {
    icon: "🏹",
    image: "/img/instruments/adyrna.jpg",
    imageAlt: "Адырна аспабы",
    instrumentIds: ["adyrna", "muyiz-syrnai"],
  },
  {
    icon: "🔥",
    image: "/img/instruments/kobyz.jpg",
    imageAlt: "Қобыз аспабы",
    instrumentIds: ["kobyz"],
  },
  {
    icon: "🌾",
    image: "/img/instruments/sybyzgy.jpg",
    imageAlt: "Сыбызғы аспабы",
    instrumentIds: ["dombyra", "zhetigen", "sybyzgy"],
  },
  {
    icon: "🐎",
    image: "/img/instruments/dombyra.jpg",
    imageAlt: "Домбыра аспабы",
    instrumentIds: ["dombyra"],
  },
  {
    icon: "🛡️",
    image: "/img/instruments/kernei.jpg",
    imageAlt: "Керней аспабы",
    instrumentIds: ["kernei", "dauylpaz"],
  },
  {
    icon: "🎼",
    image: "/img/instruments/sherter.jpg",
    imageAlt: "Шертер аспабы",
    instrumentIds: ["dombyra", "sherter"],
  },
  {
    icon: "🏛️",
    image: "/img/instruments/zhetigen.jpg",
    imageAlt: "Жетіген аспабы",
    instrumentIds: ["zhetigen", "kobyz", "sybyzgy"],
  },
  {
    icon: "🌐",
    image: "/img/digital-world.png",
    imageAlt: "Цифрлық дәуірдегі домбыра",
    instrumentIds: ["dombyra", "zhetigen", "shankobyz"],
  },
] as const;

const HISTORY_FACTS = [
  { value: "8", label: "тарихи кезең", icon: "⌛" },
  { value: "Б.з.б.", label: "дәуірден басталады", icon: "🏺" },
  { value: "1934", label: "ұлттық оркестр құрылған жыл", icon: "🎻" },
  { value: "XXI", label: "цифрлық жаңғыру ғасыры", icon: "✨" },
];

export default function HistoryPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Басты бет" }, { label: "Тарих" }]}
        title="Дала үнінің ғасырлар жолы"
        lead="Аңшының садағы мен табиғи мүйізден басталған үн қобыздың сарынына, домбыраның күйіне, ұлттық оркестрге және бүгінгі цифрлық сахнаға дейін жетті. Осы жолды кезең-кезеңімен таныңыз."
      >
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="#tarikhi-zhol" className="btn btn-sm no-underline">
            ⌛ Тарихи жолды бастау
          </a>
          <PrintButton />
        </div>
      </PageHero>

      <section className="border-b border-line bg-surface py-8">
        <div className="mx-auto grid w-[min(100%-2rem,1180px)] grid-cols-2 gap-3 lg:grid-cols-4">
          {HISTORY_FACTS.map((fact) => (
            <div
              key={fact.label}
              className="rounded-2xl border border-line bg-bg-alt px-4 py-4 text-center shadow-[var(--shadow-sm)]"
            >
              <span className="mb-1 block text-2xl" aria-hidden="true">
                {fact.icon}
              </span>
              <strong className="block font-head text-xl text-accent">{fact.value}</strong>
              <span className="text-xs text-muted sm:text-sm">{fact.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section
        id="tarikhi-zhol"
        className="scroll-mt-28 bg-[radial-gradient(circle_at_top_left,var(--gold-soft),transparent_30%),radial-gradient(circle_at_bottom_right,var(--teal-soft),transparent_34%)] py-12 sm:py-16"
      >
        <div className="mx-auto w-[min(100%-2rem,1080px)]">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="eyebrow">Хронология</span>
            <h2 className="font-head text-3xl">Сегіз дәуір, бір үзілмеген үн</h2>
            <p className="text-ink-soft">
              Әр кезеңдегі сурет пен аспап атауын басып, оның жеке парағына өте аласыз.
            </p>
          </div>

          <div className="relative space-y-7 lg:space-y-10">
            <div
              className="absolute top-4 bottom-4 left-5 hidden w-px bg-gradient-to-b from-accent via-gold to-teal lg:left-1/2 lg:block"
              aria-hidden="true"
            />

            {timeline.map((era, index) => {
              const detail = ERA_DETAILS[index];
              const related = detail.instrumentIds
                .map((id) => instruments.find((instrument) => instrument.id === id))
                .filter((instrument) => instrument !== undefined);
              const imageFirst = index % 2 === 0;

              return (
                <Reveal
                  as="article"
                  key={era.era}
                  delay={index * 45}
                  className="relative grid items-stretch gap-5 lg:grid-cols-2 lg:gap-14"
                >
                  <span
                    className="absolute top-1/2 left-1/2 z-10 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-bg bg-surface text-lg shadow-[var(--shadow-md)] lg:grid"
                    aria-hidden="true"
                  >
                    {detail.icon}
                  </span>

                  <Link
                    href={`/aspap/${related[0]?.id}`}
                    className={`group relative min-h-60 overflow-hidden rounded-3xl border border-line bg-white shadow-[var(--shadow-md)] no-underline ${
                      imageFirst ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <Image
                      src={detail.image}
                      alt={detail.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 92vw, 470px"
                      className="object-contain p-4 transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-5 pt-14 pb-4 text-sm font-semibold text-white">
                      {related.map((instrument) => instrument.name).join(" · ")}
                    </span>
                  </Link>

                  <div
                    className={`flex flex-col justify-center rounded-3xl border border-line bg-surface p-6 shadow-[var(--shadow-sm)] sm:p-8 ${
                      imageFirst ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="tag tag-accent">{era.era}</span>
                      <span className="font-head text-sm font-bold text-muted">
                        {String(index + 1).padStart(2, "0")} / {String(timeline.length).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mb-3 font-head text-2xl">{era.title}</h3>
                    <p className="m-0 leading-relaxed text-ink-soft">{era.text}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {related.map((instrument) => (
                        <Link
                          key={instrument.id}
                          href={`/aspap/${instrument.id}`}
                          className="tag no-underline transition hover:border-accent hover:text-accent"
                        >
                          {instrument.name} →
                        </Link>
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <div className="mb-7 max-w-2xl">
            <span className="eyebrow">Дыбыстан топқа</span>
            <h2 className="font-head text-3xl">Аспаптар қалай ерекшеленеді?</h2>
            <p className="text-ink-soft">
              Ғасырлар бойы аспаптар дыбыс шығару тәсіліне қарай бес негізгі топқа қалыптасты.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group, index) => {
              const groupedInstruments = instrumentsByGroup(group.id);
              return (
                <Reveal
                  key={group.id}
                  delay={index * 55}
                  className="card card-hover flex h-full flex-col bg-surface"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <GroupIcon groupId={group.id} className="h-12 w-12 rounded-2xl" />
                    <div>
                      <span className={`tag ${group.tag}`}>{groupedInstruments.length} аспап</span>
                      <h3 className="mt-1 font-head text-lg">{group.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-ink-soft">{group.short}.</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-3">
                    {groupedInstruments.map((instrument) => (
                      <Link
                        key={instrument.id}
                        href={`/aspap/${instrument.id}`}
                        className="rounded-full border border-line bg-bg-alt px-2.5 py-1 text-xs font-semibold text-ink-soft no-underline hover:border-accent hover:text-accent"
                      >
                        {instrument.name}
                      </Link>
                    ))}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-bg-alt py-12 sm:py-16">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="card bg-surface">
              <span className="card-icon" aria-hidden="true">🏛️</span>
              <h3 className="font-head text-lg">Оркестрге бірігу</h3>
              <p className="text-[0.95rem] text-ink-soft">
                1934 жылы Құрманғазы атындағы Қазақ ұлттық халық аспаптар оркестрі құрылып, көне
                аспаптар қайта жаңғыртылып, үлкен сахнаға шықты.
              </p>
            </div>
            <div className="card bg-surface">
              <span className="card-icon" aria-hidden="true">🔎</span>
              <h3 className="font-head text-lg">Ғылыми зерттеу</h3>
              <p className="text-[0.95rem] text-ink-soft">
                Зерттеушілер ұмыт қалған аспаптарды жинап, құрылысын сипаттап, олардың үнін жаңа
                ұрпаққа жеткізуге көмектесті.
              </p>
            </div>
            <div className="card bg-surface">
              <span className="card-icon" aria-hidden="true">🌍</span>
              <h3 className="font-head text-lg">Бүгінгі жаңа тыныс</h3>
              <p className="text-[0.95rem] text-ink-soft">
                Ұлттық аспаптар қазір оркестрде, фольклорлық ансамбльде, заманауи сахнада және
                цифрлық білім жобаларында өмір сүруін жалғастырып келеді.
              </p>
            </div>
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/aspaptar" className="btn btn-lg no-underline">
              🎼 Барлық {instruments.length} аспапты көру
            </Link>
            <PrintButton />
          </div>
        </div>
      </section>
    </>
  );
}
