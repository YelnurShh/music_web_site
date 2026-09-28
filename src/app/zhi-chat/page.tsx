import type { Metadata } from "next";
import { AiChat } from "@/components/AiChat";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "ЖИ чат",
  description:
    "Қазақтың ұлттық музыкалық аспаптары туралы сұрақтарға қарапайым қазақ тілінде жауап беретін оқу көмекшісі.",
};

export default function AiChatPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Басты бет" }, { label: "ЖИ чат" }]}
        title="Аспаптар туралы ЖИ чат"
        lead="Ұлттық аспаптар, олардың құрылысы, үні, тарихы мен қолданылуы туралы сұраңыз. Көмекші жауапты қысқа әрі түсінікті қазақ тілінде береді."
      />

      <section className="py-10 sm:py-14">
        <div className="mx-auto grid w-[min(100%-2rem,1080px)] gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <AiChat />

          <aside className="space-y-4 lg:order-first" aria-label="ЖИ чатты пайдалану нұсқаулығы">
            <div className="card gap-2">
              <span className="card-icon" aria-hidden="true">🤖</span>
              <h2 className="font-head text-lg">Не сұрауға болады?</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm text-ink-soft">
                <li>Аспап қалай ойналады?</li>
                <li>Қай топқа жатады?</li>
                <li>Екі аспаптың айырмасы қандай?</li>
                <li>Белгісіз сөз нені білдіреді?</li>
              </ul>
            </div>

            <div className="callout callout-gold text-sm text-ink-soft">
              <h2 className="mb-1 font-head text-base text-ink">Қауіпсіздік ережесі</h2>
              <p className="m-0">
                Чатқа аты-жөніңізді, телефон нөміріңізді, мекенжайыңызды немесе басқа жеке мәліметті жазбаңыз.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-4 text-sm text-muted">
              <p className="m-0">
                ЖИ қателесуі мүмкін. Маңызды тарихи деректі аспап бетімен және көрсетілген дереккөздермен салыстырыңыз.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
