import type { Metadata } from "next";
import Link from "next/link";
import { groups } from "@/data/groups";
import { instruments } from "@/data/instruments";
import { legends } from "@/data/legends";
import { glossary } from "@/data/glossary";
import { PageHero } from "@/components/PageHero";
import { ProjectAuthors } from "@/components/ProjectAuthors";

export const metadata: Metadata = {
  title: "Жоба туралы",
  description:
    "«Бабалар үні – цифрлық әлемде» оқу сайтының мақсаты, авторлары мен мазмұны туралы.",
};

const STEPS = [
  {
    title: "Қажетті бөлімді таңдаңыз",
    text: "Жоғарғы мәзірден аспаптар, аңыздар, тарих, ойындар немесе сөздік бетіне өтіңіз.",
  },
  {
    title: "Іздеуді қолданыңыз",
    text: "Іздеу жолағына аспаптың не ұғымның атауын жазыңыз. «/» пернесі іздеуді бірден ашады.",
  },
  {
    title: "Аспапты зерттеңіз",
    text: "Аспап карточкасын ашып, суретін, қысқаша сипаттамасын және нақты орындалған үнін тыңдаңыз.",
  },
  {
    title: "Біліміңізді тексеріңіз",
    text: "Ойындар мен викторина арқылы аспап атауларын және олардың топтарын қайталаңыз.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Басты бет" }, { label: "Жоба туралы" }]}
        title="Жоба туралы"
        lead="«Бабалар үні – цифрлық әлемде: Қазақтың ұлттық музыкалық аспаптарының интерактивті онлайн-энциклопедиясы» — 1–6 сынып оқушыларына арналған оқу-білім сайты. Сайт мұғалімге де, ата-анаға да, оқушыға да бірдей түсінікті болуы үшін қарапайым тілмен жасалды."
      />

      {/* ================= ЖОБА АВТОРЛАРЫ ================= */}
      <section className="py-10 sm:py-12">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <div className="mx-auto mb-6 max-w-2xl text-center">
            <span className="eyebrow">Авторлар</span>
            <h2 className="font-head text-3xl">Жоба авторлары</h2>
            <p className="text-ink-soft">
              Бұл сайт — ғылыми жобаның нәтижесі. Оның идеясын, мазмұнын және құрылымын оқушы
              мұғалімнің жетекшілігімен бірлесіп жасады.
            </p>
          </div>
          <ProjectAuthors title={null} eyebrow="🎓 Ғылыми жоба" className="mx-auto max-w-3xl" />
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="mx-auto grid w-[min(100%-2rem,1180px)] gap-5 lg:grid-cols-2">
          <div className="card">
            <span className="card-icon" aria-hidden="true">
              🎯
            </span>
            <h3 className="font-head text-lg">Жобаның мақсаты</h3>
            <ul className="m-0 list-disc pl-5 text-ink-soft">
              <li>Оқушыларға қазақтың ұлттық музыкалық аспаптарын таныстыру.</li>
              <li>Мәтін, сурет, тыңдалым және ойын арқылы үйрету.</li>
              <li>Ұлттық мұраны цифрлық әлемде сақтау және тарату.</li>
              <li>Мұғалімге сабақ материалын тез табуға көмектесу.</li>
            </ul>
          </div>

          <div className="card">
            <span className="card-icon" aria-hidden="true">
              📊
            </span>
            <h3 className="font-head text-lg">Сайттың мазмұны</h3>
            <ul className="m-0 list-disc pl-5 text-ink-soft">
              <li>
                <b>{instruments.length} аспап</b> — суреті, сипаттамасы және тыңдалымымен.
              </li>
              <li>
                <b>{groups.length} аспап тобы</b> — дыбыс шығару тәсіліне қарай.
              </li>
              <li>
                <b>{legends.length} халық аңызы</b> — қарапайым тілмен баяндалған.
              </li>
              <li>
                <b>10 викторина сұрағы</b> және 3 ойын.
              </li>
              <li>
                <b>{glossary.length} сөздік түсінігі</b> және 8 кезеңнен тұратын тарихи жол.
              </li>
            </ul>
          </div>

        </div>
      </section>

      <section className="bg-bg-alt py-12">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <span className="eyebrow">Нұсқаулық</span>
          <h2 className="font-head text-2xl">Сайтты қалай пайдалану керек?</h2>
          <p className="mb-6 max-w-2xl text-ink-soft">
            Керек материалды табу және біліміңізді тексеру үшін мына ретпен пайдаланыңыз.
          </p>

          <ul className="fact-list max-w-3xl">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <span className="fact-num">{index + 1}</span>
                <span>
                  <strong className="block">{step.title}</strong>
                  <span className="text-[0.92rem] text-ink-soft">{step.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto w-[min(100%-2rem,820px)]">
          <div className="callout callout-gold">
            <h3 className="mb-1 font-head text-lg">📚 Дереккөздер туралы</h3>
            <p className="m-0 text-[0.95rem] text-ink-soft">
              Сайттағы мәтіндер қазақ халқының музыкалық аспаптары туралы ашық білім көздері мен
              оқулықтар негізінде, оқушыға түсінікті тілмен қайта жазылды. Аңыздар — халық ауыз
              әдебиетінің үлгісі, олар ғылыми дерек ретінде емес, мәдени мұра ретінде берілген.
              Аспап суреттері мен тыңдалымдары ашық интернет дереккөздерінен таңдалды.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link href="/aspaptar" className="btn btn-lg no-underline">
              🎼 Аспаптарды оқуды бастау
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
