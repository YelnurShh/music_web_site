import type { Metadata } from "next";
import Link from "next/link";
import { groups } from "@/data/groups";
import { instruments } from "@/data/instruments";
import { timeline } from "@/data/timeline";
import { instrumentsByGroup } from "@/lib/utils";
import { PageHero } from "@/components/PageHero";
import { PrintButton } from "@/components/PrintButton";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Аспаптар тарихы",
  description:
    "Қазақтың музыкалық аспаптарының тарихы: ежелгі дәуірден бүгінгі цифрлық әлемге дейінгі 8 кезең және аспап топтарының кестесі.",
};

export default function HistoryPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Басты бет" }, { label: "Тарих" }]}
        title="Аспаптар тарихы: садақтан оркестрге"
        lead="Музыкалық аспаптар бір күнде пайда болған жоқ. Олар мыңдаған жыл бойы халықтың тұрмысымен бірге өзгеріп, дамып отырды. Төмендегі кезеңдерді ретімен оқып шығыңыз."
      >
        <div className="mt-4">
          <PrintButton />
        </div>
      </PageHero>

      <section className="py-10">
        <div className="mx-auto w-[min(100%-2rem,820px)]">
          <ol className="timeline">
            {timeline.map((era, index) => (
              <Reveal as="li" key={era.era} delay={index * 40}>
                <span className="font-head font-bold text-accent">{era.era}</span>
                <h3 className="mt-1 mb-1 font-head text-[1.15rem]">{era.title}</h3>
                <p className="text-ink-soft">{era.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-bg-alt py-12">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <span className="eyebrow">Кесте</span>
          <h2 className="font-head text-2xl">Аспап топтары және олардың қолданылуы</h2>
          <p className="mb-6 max-w-2xl text-ink-soft">
            Топ атауын білу маңызды: егер үрмелі аспаптың аты аталса, онда ол ауа үрлеп ойналатынын бірден
            білесіз.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
            <table className="data-table min-w-[40rem]">
              <caption className="sr-only">Аспап топтары, сипаттамасы және құрамы</caption>
              <thead>
                <tr>
                  <th>Топ</th>
                  <th>Топтың сипаттамасы</th>
                  <th>Қандай аспаптар кіреді</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => (
                  <tr key={group.id}>
                    <th scope="row">
                      {group.icon} {group.name}
                    </th>
                    <td>{group.desc}</td>
                    <td>
                      {instrumentsByGroup(group.id).map((instrument, index) => (
                        <span key={instrument.id}>
                          {index > 0 && ", "}
                          <Link
                            href={`/aspap/${instrument.id}`}
                            className="font-semibold text-accent no-underline hover:underline"
                          >
                            {instrument.name}
                          </Link>
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto grid w-[min(100%-2rem,1180px)] gap-5 sm:grid-cols-2">
          <div className="card">
            <span className="card-icon" aria-hidden="true">
              🏛️
            </span>
            <h3 className="font-head text-lg">Оркестр тарихы</h3>
            <p className="text-[0.95rem] text-ink-soft">
              1934 жылы Құрманғазы атындағы Қазақ ұлттық халық аспаптар оркестрі құрылды. Осы кезеңнен
              бастап көне аспаптар қайта жаңғыртылып, нотаға түсірілді. Домбыра, қобыз, жетіген, сыбызғы
              сияқты аспаптар үлкен сахнаға шықты.
            </p>
          </div>
          <div className="card">
            <span className="card-icon" aria-hidden="true">
              🎓
            </span>
            <h3 className="font-head text-lg">Зерттеуші ғалымдар</h3>
            <p className="text-[0.95rem] text-ink-soft">
              Аспаптардың тарихын ғалымдар зерттеген. Мысалы, Болат Сарыбаев кернейдің қазақта болғанын
              ғылыми жолмен дәлелдеп, жетігеннің ноталық жүйесін анықтады.
            </p>
          </div>
          <div className="card">
            <span className="card-icon" aria-hidden="true">
              🌍
            </span>
            <h3 className="font-head text-lg">Бүгінгі күн</h3>
            <p className="text-[0.95rem] text-ink-soft">
              Қазір қазақтың ұлттық аспаптары тек Қазақстанда емес, шетелдерде де танымал. Шаңқобыз бен
              жетіген әлемдік фестивальдерде ойналады, ал ұлттық аспап үлгілері электронды музыкада
              қолданылады.
            </p>
          </div>
          <div className="card">
            <span className="card-icon" aria-hidden="true">
              📚
            </span>
            <h3 className="font-head text-lg">Сабаққа дайын материал</h3>
            <p className="text-[0.95rem] text-ink-soft">
              Бұл бетті басып шығарып, сабақта үлестірме материал ретінде қолдануға болады. Басып шығарғанда
              мәзір мен батырмалар шықпайды.
            </p>
            <div className="mt-1">
              <PrintButton />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div className="mx-auto w-[min(100%-2rem,1180px)] text-center">
          <Link href="/aspaptar" className="btn btn-lg no-underline">
            🎼 Барлық {instruments.length} аспапты көру
          </Link>
        </div>
      </section>
    </>
  );
}
