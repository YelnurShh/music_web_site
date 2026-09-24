import type { Metadata } from "next";
import Link from "next/link";
import { groups } from "@/data/groups";
import { instruments } from "@/data/instruments";
import { legends } from "@/data/legends";
import { glossary } from "@/data/glossary";
import { quiz } from "@/data/quiz";
import { instrumentsByGroup } from "@/lib/utils";
import { CloudBadge } from "@/components/CloudBadge";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Жоба туралы",
  description:
    "«Бабалар үні – цифрлық әлемде» оқу сайты туралы: мақсаты, құрылымы, мұғалім мен оқушыға арналған нұсқаулық және қолжетімділік мүмкіндіктері.",
};

const STEPS = [
  { title: "Хидерден керек бетті таңдаңыз", text: "Жоғарғы жақта «Басты бет», «Аспаптар», «Аңыздар», «Тарих», «Ойындар», «Сөздік» беттері тұр." },
  { title: "Іздеуді қолданыңыз", text: "Жоғарғы оң жақтағы іздеу терезесіне сөз жазыңыз. Пернетақтадағы «/» белгісін бассаңыз, іздеу терезесі бірден ашылады." },
  { title: "Мәтінді үлкейтіңіз", text: "Жоғарғы оң жақтағы A−, A, A+ батырмалары қаріп өлшемін өзгертеді. Үлкен кісілерге бұл өте қолайлы." },
  { title: "Түсті ауыстырыңыз", text: "🌙 белгісін бассаңыз, сайт қараңғы түске өтеді — кешке көзге жеңіл болады. «T» пернесі де осы әрекетті істейді." },
  { title: "Дыбысты басқарыңыз", text: "🔊 белгісі — дыбысты қосады немесе толық өшіреді. Аспап үні компьютерде жасалған жуық үлгі екенін есте сақтаңыз." },
  { title: "Аңызды дауыстап тыңдаңыз", text: "«🔊 Дыбыстап оқу» батырмасы мәтінді дауыстап оқып береді. Ол оқуға қиналатын оқушыға көмектеседі." },
  { title: "Басып шығарыңыз", text: "Сөздік пен тарих беттерінде «🖨️ Басып шығару» батырмасы бар. Бет мәзірсіз, таза күйінде шығады." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Басты бет" }, { label: "Жоба туралы" }]}
        title="Жоба туралы"
        lead="«Бабалар үні – цифрлық әлемде: Қазақтың ұлттық музыкалық аспаптарының интерактивті онлайн-энциклопедиясы» — 1–6 сынып оқушыларына арналған оқу-білім сайты. Сайт мұғалімге де, ата-анаға да, оқушыға да бірдей түсінікті болуы үшін қарапайым тілмен жасалды."
      />

      <section className="py-10">
        <div className="mx-auto grid w-[min(100%-2rem,1180px)] gap-5 lg:grid-cols-2">
          <div className="card">
            <span className="card-icon" aria-hidden="true">
              🎯
            </span>
            <h3 className="font-head text-lg">Жобаның мақсаты</h3>
            <ul className="m-0 list-disc pl-5 text-ink-soft">
              <li>Оқушыларға қазақтың ұлттық музыкалық аспаптарын таныстыру.</li>
              <li>Тек мәтін емес — тыңдау, ойнау, салыстыру арқылы үйрету.</li>
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
                <b>{instruments.length} аспап</b> — толық сипаттамасымен.
              </li>
              <li>
                <b>{groups.length} аспап тобы</b> — дыбыс шығару тәсіліне қарай.
              </li>
              <li>
                <b>{legends.length} халық аңызы</b> — қарапайым тілмен баяндалған.
              </li>
              <li>
                <b>{quiz.length} викторина сұрағы</b> және 3 ойын.
              </li>
              <li>
                <b>{glossary.length} сөздік түсінігі</b> және 8 кезеңнен тұратын тарихи жол.
              </li>
            </ul>
          </div>

          <div className="card lg:col-span-2">
            <span className="card-icon" aria-hidden="true">
              ☁️
            </span>
            <h3 className="font-head text-lg">Деректер қайда сақталады?</h3>
            <p className="text-ink-soft">
              Сайт Firebase жобасына қосылуға дайын. Қосылған жағдайда таңдаулы аспаптар, викторина
              нәтижесі және «Үздік оқушылар» кестесі Firestore дерекқорында сақталады; пайдаланушы
              анонимді түрде кіреді, аты-жөні сұралмайды (лақап ат ерікті түрде жазылады). Қосылмаған
              жағдайда сол деректер браузерде сақталып, сайт толық жұмыс істей берді.
            </p>
            <div className="mt-2">
              <CloudBadge />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bg-alt py-12">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <span className="eyebrow">Нұсқаулық</span>
          <h2 className="font-head text-2xl">Сайтты қалай пайдалану керек?</h2>
          <p className="mb-6 max-w-2xl text-ink-soft">
            Үлкен кісілерге де, кіші оқушыларға да оңай болуы үшін қарапайым ретпен жазылды.
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
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <h2 className="font-head text-2xl">Аспап топтарының құрылымы</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-surface">
            <table className="data-table min-w-[32rem]">
              <caption className="sr-only">Аспап топтары және олардың саны</caption>
              <thead>
                <tr>
                  <th>Топ</th>
                  <th>Дыбыс шығару тәсілі</th>
                  <th>Аспап саны</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => (
                  <tr key={group.id}>
                    <th scope="row">
                      {group.icon} {group.name}
                    </th>
                    <td>{group.short}</td>
                    <td>{instrumentsByGroup(group.id).length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-bg-alt py-12">
        <div className="mx-auto grid w-[min(100%-2rem,1180px)] gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card bg-surface">
            <span className="card-icon" aria-hidden="true">
              ♿
            </span>
            <h3 className="font-head text-lg">Қолжетімділік</h3>
            <p className="text-[0.94rem] text-ink-soft">
              Үлкен қаріп, ашық/қараңғы түс, пернетақтамен жүру, дауыстап оқу және экранды оқу
              құралдарына арналған белгілер қарастырылған.
            </p>
          </div>
          <div className="card bg-surface">
            <span className="card-icon" aria-hidden="true">
              📱
            </span>
            <h3 className="font-head text-lg">Кез келген құрылғыда</h3>
            <p className="text-[0.94rem] text-ink-soft">
              Сайт телефонда, планшетте және компьютерде бірдей жұмыс істейді. Қаріптер сайттың ішінде
              сақталған, сондықтан интернет баяу болса да мәтін дұрыс көрінеді.
            </p>
          </div>
          <div className="card bg-surface">
            <span className="card-icon" aria-hidden="true">
              🔒
            </span>
            <h3 className="font-head text-lg">Қауіпсіз және жарнамасыз</h3>
            <p className="text-[0.94rem] text-ink-soft">
              Сайтта жарнама жоқ, тіркелу жоқ, жеке деректер сұралмайды. Таңдаулылар мен баптаулар
              браузерде сақталады.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto w-[min(100%-2rem,820px)]">
          <div className="callout callout-gold">
            <h3 className="mb-1 font-head text-lg">📚 Дереккөздер туралы</h3>
            <p className="m-0 text-[0.95rem] text-ink-soft">
              Сайттағы мәтіндер қазақ халқының музыкалық аспаптары туралы ашық білім көздері мен
              оқулықтар негізінде, оқушыға түсінікті тілмен қайта жазылды. Аңыздар — халық ауыз
              әдебиетінің үлгісі, олар ғылыми дерек ретінде емес, мәдени мұра ретінде берілген. Аспап
              үндері компьютерлік үлгімен жасалған, ал суреттерді нақты фотосуреттермен ауыстыруға
              болады.
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
