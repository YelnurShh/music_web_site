/** search.ts — сайт бойынша іздеу индексі (браузерде жұмыс істейді, сервер қажет емес) */

import { glossary } from "@/data/glossary";
import { groups } from "@/data/groups";
import { instruments } from "@/data/instruments";
import { legends } from "@/data/legends";
import { NAV } from "./nav";
import type { SearchItem } from "./utils";

let cached: SearchItem[] | null = null;

function lower(...parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(" ").toLowerCase();
}

export function buildSearchIndex(): SearchItem[] {
  if (cached) return cached;

  const items: SearchItem[] = [];

  instruments.forEach((i) => {
    items.push({
      kind: "Аспап",
      emoji: i.emoji,
      title: i.name,
      subtitle: `${i.latin} · ${i.fact}`,
      href: `/aspap/${i.id}`,
      haystack: lower(i.name, i.latin, i.short, i.desc, i.usage, i.sound, i.fact, i.group),
    });
  });

  legends.forEach((l) => {
    items.push({
      kind: "Аңыз",
      emoji: "📖",
      title: l.title,
      subtitle: `Аспап: ${l.instrument}`,
      href: `/anyzdar#${l.id}`,
      haystack: lower(l.title, l.instrument, l.paras.join(" ")),
    });
  });

  glossary.forEach((g) => {
    items.push({
      kind: "Сөздік",
      emoji: "📘",
      title: g.term,
      subtitle: g.def.slice(0, 70),
      href: `/sozdik?h=${encodeURIComponent(g.term.charAt(0).toUpperCase())}`,
      haystack: lower(g.term, g.def),
    });
  });

  groups.forEach((g) => {
    items.push({
      kind: "Топ",
      emoji: g.icon,
      title: g.name,
      subtitle: g.short,
      href: `/aspaptar?top=${g.id}`,
      haystack: lower(g.name, g.desc, g.short),
    });
  });

  NAV.forEach((n) => {
    items.push({
      kind: "Бет",
      emoji: "🔗",
      title: n.label,
      subtitle: n.hint,
      href: n.href,
      haystack: lower(n.label, n.hint, "бет"),
    });
  });

  cached = items;
  return items;
}

export function searchSite(query: string, max = 8): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (q.length < 1) return [];
  const words = q.split(/\s+/);

  return buildSearchIndex()
    .map((item) => {
      let score = 0;
      const title = item.title.toLowerCase();
      words.forEach((w) => {
        if (title.startsWith(w)) score += 6;
        else if (title.includes(w)) score += 4;
        if (item.haystack.includes(w)) score += 2;
      });
      return { item, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((r) => r.item);
}
