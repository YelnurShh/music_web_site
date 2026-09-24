import type { Metadata } from "next";
import { GamesTabs } from "@/components/GamesTabs";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Ойындар мен викторина",
  description:
    "Қазақтың ұлттық аспаптары туралы интерактивті ойындар: 16 сұрақтан тұратын викторина, «Жұп тап» жады ойыны, флеш-карталар және ырғақ жаттығуы.",
};

export default function GamesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Басты бет" }, { label: "Ойындар" }]}
        title="Ойнап жүріп үйрену"
        lead="Төрт ойын бар: білімді тексеретін викторина, есте сақтауды жаттықтыратын «Жұп тап», аспаптарды қайталауға арналған флеш-карталар және ырғақ жаттығуы. Барлығы тегін, тіркелудің қажеті жоқ."
      />

      <section className="py-10">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <GamesTabs />
        </div>
      </section>

      <section className="pb-14">
        <div className="mx-auto w-[min(100%-2rem,820px)]">
          <div className="callout callout-accent">
            <h3 className="mb-1 font-head text-lg">👩‍🏫 Мұғалімге арналған ескерту</h3>
            <p className="m-0 text-[0.95rem] text-ink-soft">
              Викторинаны сыныпта үш топқа бөліп ұйымдастыруға болады: әр топ сұраққа кезекпен жауап береді.
              Ойын нәтижесі баға ретінде емес, қайталау құралы ретінде қолданылғаны дұрыс.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
