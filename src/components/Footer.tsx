import Link from "next/link";
import { groups } from "@/data/groups";
import { NAV } from "@/lib/nav";
import { CloudBadge } from "./CloudBadge";

/** Footer — футер: сайт туралы қысқаша, беттер, аспап топтары және көмек бөлімі */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="no-print mt-12 border-t border-line bg-surface-2">
      <div className="mx-auto grid w-[min(100%-2rem,1180px)] gap-8 py-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" className="flex items-center gap-3 no-underline">
            <span
              aria-hidden="true"
              className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-accent to-gold text-lg text-white"
            >
              🎶
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-head font-bold text-ink">Бабалар үні</span>
              <span className="text-xs text-muted">цифрлық әлемде</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-[0.92rem] text-muted">
            Қазақтың ұлттық музыкалық аспаптарының интерактивті онлайн-энциклопедиясы. Сайт 1–6 сынып
            оқушыларына, мұғалімдерге және үлкен кісілерге арналған — қарапайым тілмен, түсінікті етіп жасалды.
          </p>
          <div className="mt-4">
            <CloudBadge />
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-[0.82rem] font-bold tracking-[0.1em] text-muted uppercase">Беттер</h4>
          <ul className="flex flex-col gap-2 text-[0.93rem]">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink-soft no-underline hover:text-accent hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-[0.82rem] font-bold tracking-[0.1em] text-muted uppercase">Аспап топтары</h4>
          <ul className="flex flex-col gap-2 text-[0.93rem]">
            {groups.map((g) => (
              <li key={g.id}>
                <Link
                  href={`/aspaptar?top=${g.id}`}
                  className="text-ink-soft no-underline hover:text-accent hover:underline"
                >
                  {g.icon} {g.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-[0.82rem] font-bold tracking-[0.1em] text-muted uppercase">Көмек</h4>
          <div className="rounded-2xl border border-line bg-surface px-4 py-3 text-[0.88rem] text-ink-soft">
            <p className="mb-2">Сайтта оңай жүру үшін:</p>
            <ul className="mb-2 list-disc pl-4">
              <li>
                <kbd className="rounded border border-line-strong border-b-2 bg-bg-alt px-1.5 text-[0.8rem]">/</kbd>{" "}
                — іздеу терезесін ашады
              </li>
              <li>
                <kbd className="rounded border border-line-strong border-b-2 bg-bg-alt px-1.5 text-[0.8rem]">T</kbd>{" "}
                — ашық/қараңғы түс
              </li>
              <li>
                <kbd className="rounded border border-line-strong border-b-2 bg-bg-alt px-1.5 text-[0.8rem]">+</kbd> /{" "}
                <kbd className="rounded border border-line-strong border-b-2 bg-bg-alt px-1.5 text-[0.8rem]">−</kbd> —
                қаріп өлшемі
              </li>
            </ul>
            <p className="m-0">Барлық мәтін қазақ тілінде, қарапайым сөздермен жазылған.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-[min(100%-2rem,1180px)] flex-wrap justify-between gap-3 border-t border-line py-4 text-[0.84rem] text-muted">
        <span>© {year} «Бабалар үні – цифрлық әлемде» оқу жобасы</span>
        <span>Білім мақсатында жасалған · Мұғалімге де, оқушыға да ашық</span>
      </div>
    </footer>
  );
}
