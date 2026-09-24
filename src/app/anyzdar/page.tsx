import type { Metadata } from "next";
import Link from "next/link";
import { Legends } from "@/components/Legends";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Халық аңыздары",
  description:
    "Қазақтың музыкалық аспаптары туралы 6 халық аңызы: Қорқыт ата, жетігеннің жеті күйі, Ақсақ құлан, шертер, адырна және дауылпаз. Дауыстап оқу мүмкіндігі бар.",
};

export default function LegendsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Басты бет" }, { label: "Аңыздар" }]}
        title="Аспаптар туралы халық аңыздары"
        lead="Аңыз — халық ауызша айтып жеткізген әңгіме. Оның ішінде шын тарих та, қиял да болады. Аңыздың атын бассаңыз, мәтіні ашылады. «🔊 Дыбыстап оқу» батырмасымен аңызды дауыстап тыңдауға болады."
      >
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/oiyn" className="btn btn-sm btn-ghost no-underline">
            🎯 Аңыздар бойынша сұрақтар
          </Link>
          <Link href="/aspaptar" className="btn btn-sm btn-ghost no-underline">
            🎼 Аспаптар каталогы
          </Link>
        </div>
      </PageHero>

      <section className="py-10">
        <div className="mx-auto w-[min(100%-2rem,820px)]">
          <Legends />
        </div>
      </section>

      <section className="pb-14">
        <div className="mx-auto grid w-[min(100%-2rem,1180px)] gap-5 lg:grid-cols-2">
          <div className="card bg-surface-2">
            <h3 className="font-head text-lg">📌 Аңызды оқығанда не істеу керек?</h3>
            <ol className="m-0 list-decimal pl-5">
              <li>Аңызды түгел оқып шығыңыз.</li>
              <li>Қай аспап туралы екенін анықтаңыз.</li>
              <li>Аспап бетін ашып, қосымша мәлімет оқыңыз.</li>
              <li>Аңыздың соңындағы «💭 Ой» бөлігін бірге талқылаңыз.</li>
            </ol>
          </div>
          <div className="card bg-surface-2">
            <h3 className="font-head text-lg">🗣️ Сыныпта талқылауға арналған сұрақтар</h3>
            <ul className="m-0 list-disc pl-5">
              <li>Аңыздағы басты кейіпкер неге осы аспапты таңдады?</li>
              <li>Аспаптың үні адамның көңіл-күйін қалай жеткізеді?</li>
              <li>Бүгінгі күнмен салыстырғанда қандай айырмашылық бар?</li>
              <li>Сіз қай аспап туралы өз аңызыңызды жазар едіңіз?</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
