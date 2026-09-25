"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { NAV, isActivePath } from "@/lib/nav";
import { searchSite } from "@/lib/search";
import { useApp } from "@/providers/AppProvider";
import { cn } from "@/lib/utils";

/**
 * Header — хидер: жоғарғы көмекші жолақ (іздеу және түс режимі) және негізгі мәзір.
 * Барлық бетте көрінеді.
 */
export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useApp();

  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [openResults, setOpenResults] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => (openResults ? searchSite(query) : []), [query, openResults]);

  /* Бет ауысқанда мәзір жабылады */
  useEffect(() => {
    setMenuOpen(false);
    setOpenResults(false);
  }, [pathname]);

  /* Сыртқа басқанда іздеу нәтижелері жабылады */
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!searchRef.current?.contains(event.target as Node)) setOpenResults(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  /* Пернетақта тіркестері: / — іздеу, T — түс */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if (event.key === "/" && !typing) {
        event.preventDefault();
        inputRef.current?.focus();
        setOpenResults(true);
      }
      if (typing) return;
      if (event.key === "t" || event.key === "T" || event.key === "е") toggleTheme();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleTheme]);

  function onSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && results.length) {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp" && results.length) {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === "Enter" && results.length) {
      event.preventDefault();
      const item = results[Math.max(0, activeIndex)] ?? results[0];
      window.location.href = item.href;
    } else if (event.key === "Escape") {
      setOpenResults(false);
      setActiveIndex(-1);
    }
  }

  const iconButton =
    "grid h-9 min-w-9 cursor-pointer place-items-center rounded-full border border-line bg-surface px-2 text-sm font-semibold text-ink-soft transition hover:-translate-y-0.5 hover:border-accent hover:text-accent";

  return (
    <header className="no-print sticky top-0 z-50">
      {/* --- Көмекші жолақ --- */}
      <div className="border-b border-line bg-surface-2 text-[0.85rem]">
        <div className="mx-auto flex min-h-11 w-[min(100%-2rem,1180px)] flex-wrap items-center justify-between gap-3 py-1">
          <span className="hidden items-center gap-2 text-muted sm:flex">
            🎵 1–6 сынып оқушыларына арналған оқу-білім сайты
          </span>

          <div className="flex flex-1 flex-wrap items-center justify-end gap-1.5">
            <div className="relative max-sm:w-full" ref={searchRef}>
              <label htmlFor="site-search" className="sr-only">
                Сайттан іздеу
              </label>
              <div className="flex h-9 items-center rounded-full border border-line bg-surface pr-1.5 pl-3 transition focus-within:border-accent focus-within:ring-3 focus-within:ring-accent-soft max-sm:w-full">
                <span aria-hidden="true" className="mr-1.5 opacity-60">
                  🔍
                </span>
                <input
                  id="site-search"
                  ref={inputRef}
                  type="search"
                  value={query}
                  placeholder="Аспап не сөз іздеу..."
                  autoComplete="off"
                  role="combobox"
                  aria-expanded={openResults}
                  aria-controls="search-results"
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setOpenResults(true);
                    setActiveIndex(-1);
                  }}
                  onFocus={() => setOpenResults(true)}
                  onKeyDown={onSearchKeyDown}
                  className="w-40 bg-transparent text-[0.85rem] outline-none max-sm:w-full sm:w-52"
                />
              </div>

              {openResults && query.trim().length > 0 && (
                <div
                  id="search-results"
                  role="listbox"
                  className="animate-fade absolute right-0 z-50 mt-2 max-h-[60vh] w-[min(26rem,88vw)] overflow-y-auto rounded-2xl border border-line bg-surface p-1.5 shadow-[var(--shadow-lg)] max-sm:left-0 max-sm:w-full"
                >
                  {results.length === 0 ? (
                    <p className="px-3 py-3 text-sm text-muted">
                      Ештеңе табылмады. Басқа сөзбен іздеп көріңіз (мысалы: <b>домбыра</b>, <b>қобыз</b>, <b>аңыз</b>).
                    </p>
                  ) : (
                    results.map((item, index) => (
                      <Link
                        key={`${item.href}-${item.title}`}
                        href={item.href}
                        role="option"
                        aria-selected={index === activeIndex}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2 no-underline transition hover:bg-bg-alt",
                          index === activeIndex && "bg-bg-alt",
                        )}
                      >
                        <span className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-accent-soft text-lg">
                          {item.image ? (
                            <Image src={item.image} alt="" fill sizes="36px" className="bg-white object-contain p-0.5" />
                          ) : (
                            item.emoji
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-ink">{item.title}</span>
                          <span className="block truncate text-xs text-muted">
                            {item.kind} · {item.subtitle}
                          </span>
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              className={iconButton}
              onClick={toggleTheme}
              title="Ашық/қараңғы түс"
              aria-label="Түс режимін ауыстыру"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

          </div>
        </div>
      </div>

      {/* --- Негізгі мәзір --- */}
      <div className="border-b border-line bg-surface">
        <div className="relative mx-auto flex min-h-[3.6rem] w-[min(100%-2rem,1180px)] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 py-2 no-underline">
            <Image
              src="/site-icon.svg"
              alt=""
              width={40}
              height={40}
              aria-hidden="true"
              className="h-10 w-10 rounded-xl shadow-[var(--shadow-sm)]"
              priority
            />
            <span className="flex flex-col leading-tight">
              <span className="font-head text-[1rem] font-bold text-ink">Бабалар үні</span>
              <span className="text-[0.72rem] text-muted">Ұлттық аспаптар энциклопедиясы</span>
            </span>
          </Link>

          <button
            type="button"
            className="cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold lg:hidden max-lg:inline-flex"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
          >
            {menuOpen ? "✕ Жабу" : "☰ Мәзір"}
          </button>

          <nav
            id="main-nav"
            aria-label="Негізгі мәзір"
            className={cn(
              "items-center gap-0.5 lg:flex",
              menuOpen
                ? "absolute top-full right-0 left-0 z-40 flex flex-col items-stretch gap-1 rounded-b-2xl border border-line bg-surface p-3 shadow-[var(--shadow-md)] lg:static lg:border-0 lg:p-0 lg:shadow-none"
                : "max-lg:hidden",
            )}
          >
            {NAV.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3 py-2 text-[0.92rem] font-semibold whitespace-nowrap no-underline transition",
                    active
                      ? "bg-accent-soft text-accent-dark"
                      : "text-ink-soft hover:bg-bg-alt hover:text-accent",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
