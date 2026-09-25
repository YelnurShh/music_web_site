import Link from "next/link";
import { groups } from "@/data/groups";
import { instruments } from "@/data/instruments";
import { legends } from "@/data/legends";
import { glossary } from "@/data/glossary";
import { quiz } from "@/data/quiz";
import { instrumentsByGroup } from "@/lib/utils";
import { CountUp } from "@/components/CountUp";
import { FavoritesSection } from "@/components/FavoritesSection";
import { HomeFact } from "@/components/HomeFact";
import { InstrumentCard } from "@/components/InstrumentCard";
import { GroupIcon } from "@/components/InstrumentIcon";
import { ProjectAuthors } from "@/components/ProjectAuthors";
import { Reveal } from "@/components/Reveal";

const FEATURES = [
  {
    href: "/aspaptar",
    icon: "📚",
    title: "Аспаптарды оқып білу",
    text: "14 аспап туралы толық мәлімет: қалай жасалады, бөлшектері қандай, үні қандай.",
  },
  {
    href: "/anyzdar",
    icon: "📖",
    title: "Аңыздарды оқу",
    text: "Қорқыт ата, жетігеннің жеті күйі, Ақсақ құлан — халық аңыздары қарапайым тілмен.",
  },
  {
    href: "/oiyn",
    icon: "🎯",
    title: "Ойнап білім тексеру",
    text: "Викторина, «Жұп тап», «Тобына бөл» және «Сөз құрастыр» ойындары.",
  },
  {
    href: "/tarih",
    icon: "🕰️",
    title: "Тарихпен танысу",
    text: "Аспаптар қай дәуірде пайда болды? Кезең-кезеңімен тарихи жолды көріңіз.",
  },
  {
    href: "/sozdik",
    icon: "📘",
    title: "Сөздіктен сөз іздеу",
    text: "32 түсінік: шанақ, тиек, перне, күй, асық — қарапайым түсіндірмемен.",
  },
  {
    href: "/about",
    icon: "ℹ️",
    title: "Сайтты пайдалану",
    text: "Қаріпті үлкейту, дыбысты қосу, басып шығару — үлкен кісілерге арналған нұсқаулық.",
  },
];

export default function HomePage() {
  const popular = instruments.filter((i) => i.popular);

  return (
    <>
      {/* ============================ ХИРО ============================ */}
      <section className="relative overflow-hidden bg-[radial-gradient(900px_420px_at_88%_-10%,var(--gold-soft),transparent_60%),radial-gradient(700px_400px_at_-10%_20%,var(--accent-soft),transparent_60%)] py-10 sm:py-14">
        <div className="mx-auto grid w-[min(100%-2rem,1180px)] items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Сол жақ: күшті цитата */}
          <div>
            <span className="eyebrow">🎵 Ұлттық аспаптар энциклопедиясы</span>
            <h1 className="font-head text-[clamp(1.9rem,4.2vw,3.1rem)] font-semibold">
              Бабалар үні — цифрлық әлемде
            </h1>
            <p className="max-w-xl text-[1.08rem] text-ink-soft">
              Қазақтың ұлттық музыкалық аспаптары туралы қарапайым тілмен жазылған интерактивті оқу сайты.
              Мұнда әр аспапты оқып, үнін тыңдап, аңызын біліп, ойын арқылы біліміңізді тексере аласыз.
            </p>

            <blockquote className="my-6 border-l-4 border-accent pl-5">
              <p className="mb-2 font-head text-[clamp(1.4rem,3vw,2.2rem)] leading-tight font-semibold">
                «Ән — халықтың жаны, күй — халықтың сыры»
              </p>
              <p className="text-[0.95rem] text-muted">— Халық даналығы</p>
            </blockquote>

            <div className="flex flex-wrap gap-3">
              <Link href="/aspaptar" className="btn btn-lg no-underline">
                🎼 Аспаптарды таны
              </Link>
              <Link href="/oiyn" className="btn btn-lg btn-ghost no-underline">
                🎯 Ойынды бастау
              </Link>
            </div>
          </div>

          {/* Оң жақ: жоба авторлары — ғылыми жетекші мен оқушы */}
          <Reveal delay={120}>
            <ProjectAuthors />
          </Reveal>
        </div>

        {/* Сандар */}
        <div className="mx-auto mt-10 grid w-[min(100%-2rem,1180px)] grid-cols-2 gap-4 border-t border-line pt-6 sm:grid-cols-3 lg:grid-cols-5">
          <div>
            <CountUp to={instruments.length} className="block font-head text-3xl font-bold text-accent" />
            <span className="text-[0.85rem] text-muted">ұлттық аспап</span>
          </div>
          <div>
            <CountUp to={groups.length} className="block font-head text-3xl font-bold text-accent" />
            <span className="text-[0.85rem] text-muted">аспап тобы</span>
          </div>
          <div>
            <CountUp to={legends.length} className="block font-head text-3xl font-bold text-accent" />
            <span className="text-[0.85rem] text-muted">халық аңызы</span>
          </div>
          <div>
            <CountUp to={glossary.length} className="block font-head text-3xl font-bold text-accent" />
            <span className="text-[0.85rem] text-muted">сөздік сөз</span>
          </div>
          <div>
            <CountUp to={quiz.length} className="block font-head text-3xl font-bold text-accent" />
            <span className="text-[0.85rem] text-muted">викторина сұрағы</span>
          </div>
        </div>
      </section>

      {/* ============================ ТОПТАР ============================ */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <span className="eyebrow">Бес топ</span>
          <h2 className="font-head text-3xl">Аспаптар қалай топталады?</h2>
          <p className="mb-8 max-w-2xl text-ink-soft">
            Барлық аспап дыбыс шығару тәсіліне қарай топтарға бөлінеді. Топ атауын басып, сол топтың
            аспаптарын көре аласыз.
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group, index) => (
              <Reveal key={group.id} delay={index * 60}>
                <Link
                  href={`/aspaptar?top=${group.id}`}
                  className="card card-hover h-full no-underline"
                >
                  <GroupIcon groupId={group.id} className="h-12 w-12 rounded-2xl" />
                  <h3 className="font-head text-xl">{group.name}</h3>
                  <p className="text-[0.94rem] text-ink-soft">{group.desc}</p>
                  <span className={`tag self-start ${group.tag}`}>
                    {instrumentsByGroup(group.id).length} аспап
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ ТАНЫМАЛ АСПАПТАР ============================ */}
      <section className="bg-bg-alt py-12 sm:py-16">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <span className="eyebrow">Ең танымалдары</span>
          <h2 className="font-head text-3xl">Балалар жиі сұрайтын аспаптар</h2>
          <p className="mb-8 max-w-2xl text-ink-soft">
            Карточкадағы «Үнін тыңдау» батырмасын басып, аспап үнін естіп көріңіз. «☆» белгісімен
            таңдаулыға қоса аласыз.
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((instrument) => (
              <InstrumentCard key={instrument.id} instrument={instrument} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/aspaptar" className="btn btn-lg btn-ghost no-underline">
              Барлық {instruments.length} аспапты көру →
            </Link>
          </div>
        </div>
      </section>

      {/* ============================ ТАҢДАУЛЫЛАР ============================ */}
      <FavoritesSection />

      {/* ============================ САЙТТА НЕ БАР ============================ */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <span className="eyebrow">Сайттың мүмкіндіктері</span>
            <h2 className="font-head text-3xl">Осы сайтта не істеуге болады?</h2>
            <p className="text-ink-soft">
              Барлық бөлім тегін, тіркелусіз жұмыс істейді. Қарапайым тілмен, суреттермен түсіндірілген.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <Reveal key={feature.href} delay={index * 60}>
                <Link href={feature.href} className="card card-hover h-full no-underline">
                  <span className="card-icon text-2xl" aria-hidden="true">
                    {feature.icon}
                  </span>
                  <h3 className="font-head text-lg">{feature.title}</h3>
                  <p className="text-[0.94rem] text-ink-soft">{feature.text}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ БІЛДІҢІЗ БЕ ============================ */}
      <section className="bg-bg-alt py-12 sm:py-16">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <HomeFact />
        </div>
      </section>

      {/* ============================ CTA ============================ */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <div className="rounded-3xl bg-accent-soft px-6 py-10 text-center sm:px-10">
            <h2 className="font-head text-3xl">Біліміңізді тексеріп көріңіз!</h2>
            <p className="mx-auto max-w-2xl text-ink-soft">
              10 сұрақтан тұратын викторина. Әр жауаптан кейін дұрыс түсіндірме шығады — осылайша
              қателескен жеріңізді бірден білесіз.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/oiyn" className="btn btn-lg no-underline">
                🎯 Викторинаны бастау
              </Link>
              <Link href="/sozdik" className="btn btn-lg btn-ghost no-underline">
                📘 Сөздікті ашу
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
