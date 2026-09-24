import { Suspense } from "react";
import type { Metadata } from "next";
import { Catalog } from "@/components/Catalog";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Аспаптар",
  description:
    "Қазақтың 14 ұлттық музыкалық аспабы: домбыра, қобыз, жетіген, сыбызғы, дауылпаз және басқалары. Топ бойынша сүзгі, іздеу және салыстыру мүмкіндігі бар.",
};

export default function InstrumentsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Басты бет" }, { label: "Аспаптар" }]}
        title="Қазақтың ұлттық аспаптары"
        lead="Осы бетте 14 аспап жинақталған. Топ бойынша сүзгілеп, аты бойынша іздеп, қалаған аспапты таңдаулыға қосып, тіпті екі-үш аспапты бір-бірімен салыстыра аласыз."
      />

      <section className="py-10">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <Suspense fallback={<p className="text-muted">Каталог жүктеліп жатыр...</p>}>
            <Catalog />
          </Suspense>
        </div>
      </section>

      <section className="pb-14">
        <div className="mx-auto grid w-[min(100%-2rem,1180px)] gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card">
            <span className="card-icon" aria-hidden="true">
              ⚖️
            </span>
            <h3 className="font-head text-lg">Салыстыру деген не?</h3>
            <p className="text-[0.94rem] text-ink-soft">
              Карточкадағы «Салыстыру» белгісін қойып, 2–3 аспапты таңдаңыз. Содан кейін «⚖️ Салыстыру»
              батырмасын бассаңыз — олардың айырмашылығы кесте түрінде көрсетіледі.
            </p>
          </div>
          <div className="card">
            <span className="card-icon" aria-hidden="true">
              ⭐
            </span>
            <h3 className="font-head text-lg">Таңдаулылар</h3>
            <p className="text-[0.94rem] text-ink-soft">
              Ұнаған аспапты «☆» белгісімен таңдаулыға қосыңыз. Ол басты бетте де, осы бетте де
              «Тек таңдаулылар» сүзгісінде сақталады.
            </p>
          </div>
          <div className="card">
            <span className="card-icon" aria-hidden="true">
              🔈
            </span>
            <h3 className="font-head text-lg">Үнін тыңдау</h3>
            <p className="text-[0.94rem] text-ink-soft">
              Әр карточкада «Үнін тыңдау» батырмасы бар. Үн компьютерде жасалған жуық үлгі — ол аспаптың
              реңін (жіңішке, қоңыр, ырғақты) сезінуге көмектеседі.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
