import type { Metadata } from "next";
import { glossary } from "@/data/glossary";
import { Glossary } from "@/components/Glossary";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Сөздік",
  description:
    "Қазақтың музыкалық аспаптарына қатысты 32 түсінік: шанақ, тиек, перне, күй, асық, бақсы және басқалары қарапайым тілмен түсіндірілген.",
};

export default function GlossaryPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Басты бет" }, { label: "Сөздік" }]}
        title="Түсініктер сөздігі"
        lead={`Мұнда музыкаға қатысты ${glossary.length} сөз қарапайым тілмен түсіндірілген. Мәтінді оқығанда бейтаныс сөз кездессе, осы беттен іздеп көріңіз. Басып шығарып, дәптерге қысқаша көшіріп алуға да болады.`}
      />

      <section className="py-10">
        <div className="mx-auto w-[min(100%-2rem,820px)]">
          <Glossary />
        </div>
      </section>

      <section className="pb-14">
        <div className="mx-auto w-[min(100%-2rem,820px)]">
          <div className="callout">
            <h3 className="mb-1 font-head text-lg">📖 Сөзді қалай оқу керек?</h3>
            <p className="m-0 text-[0.95rem] text-ink-soft">
              Сөздің мағынасын бірден жаттап алудың қажеті жоқ. Ең бастысы — түсіну. Мысалы, «тиек» деген
              сөзді білсеңіз, домбыраның ішегі неге дыбыс шығаратынын да түсінесіз.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
