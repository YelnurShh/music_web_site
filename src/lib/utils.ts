/**
 * utils.ts — көмекші функциялар.
 */

import { groups } from "@/data/groups";
import { instruments } from "@/data/instruments";
import type { Group, GroupId, Instrument } from "@/data/types";

export function shuffle<T>(list: readonly T[]): T[] {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function groupById(id: GroupId | string): Group {
  return groups.find((g) => g.id === id) ?? groups[0];
}

export function instrumentById(id: string | undefined): Instrument | undefined {
  return id ? instruments.find((i) => i.id === id) : undefined;
}

export function instrumentsByGroup(id: GroupId | string): Instrument[] {
  return instruments.filter((i) => i.group === id);
}

/** Сурет жүктелмесе — әдемі уақытша сурет (SVG деректер жолы) қоямыз */
export function placeholderImage(name: string, emoji = "🎵") {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
<rect width="800" height="800" fill="#f4eee5"/>
<circle cx="400" cy="360" r="180" fill="#ffffff" opacity="0.85"/>
<text x="400" y="430" font-size="180" text-anchor="middle">${emoji}</text>
<text x="400" y="620" font-size="52" font-family="sans-serif" fill="#b4552d" text-anchor="middle">${name}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** Бірнеше класты біріктіру (className={cn("a", cond && "b")}) */
/**
 * kzCompare — қазақ әліпбиінің тұрақты реті бойынша салыстыру.
 *
 * Неге localeCompare емес? Өйткені `localeCompare(..., "kk")` нәтижесі
 * серверде (Node) және браузерде әртүрлі болуы мүмкін. Ол тізім ретін
 * өзгертіп, гидратация қатесін тудырады. Сондықтан әліпби ретін қолмен
 * жазып, әрқашан бірдей нәтиже аламыз.
 */
const KZ_ALPHABET = "АӘБВГҒДЕЁЖЗИЙКҚЛМНҢОӨПРСТУҰҮФХҺЦЧШЩЪЫІЬЭЮЯ";

function kzRank(char: string): number {
  const upper = char.toUpperCase();
  const index = KZ_ALPHABET.indexOf(upper);
  /* Әліпбиде жоқ таңбалар (сан, латын әрпі, өзге) — соңынан */
  return index === -1 ? 1000 + upper.charCodeAt(0) : index;
}

export function kzCompare(a: string, b: string): number {
  const left = a.toUpperCase();
  const right = b.toUpperCase();
  const length = Math.min(left.length, right.length);
  for (let i = 0; i < length; i += 1) {
    const diff = kzRank(left[i]) - kzRank(right[i]);
    if (diff !== 0) return diff;
  }
  return left.length - right.length;
}

export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m} мин ${s} с` : `${s} с`;
}

/** Іздеу индексі: аспаптар, аңыздар, сөздік, беттер */
export interface SearchItem {
  kind: string;
  emoji: string;
  title: string;
  subtitle: string;
  href: string;
  haystack: string;
}
