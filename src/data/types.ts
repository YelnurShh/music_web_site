/** Сайттағы барлық мазмұнның типтері. Мәтінді өзгерту үшін осы қалтадағы файлдарды ашыңыз. */

export type GroupId = 'string' | 'bow' | 'wind' | 'perc' | 'noise';

export interface Group {
  id: GroupId;
  /** Топ атауы (қазақша) */
  name: string;
  icon: string;
  /** Tailwind түс класы үшін белгі (tag-accent, tag-teal, ...) */
  tag: string;
  short: string;
  desc: string;
}

export interface Part {
  /** Бөлшектің аты */
  t: string;
  /** Бөлшектің түсіндірмесі */
  d: string;
}

export interface Instrument {
  id: string;
  name: string;
  latin: string;
  group: GroupId;
  emoji: string;
  /** Сурет жолы (public/img қалтасынан) */
  img: string;
  popular?: boolean;
  tagline: string;
  fact: string;
  short: string;
  desc: string;
  parts: Part[];
  sound: string;
  usage: string;
  history: string;
  legend: { title: string; text: string };
  fun: string;
}

export interface Legend {
  id: string;
  title: string;
  instrument: string;
  paras: string[];
  moral: string;
}

export interface Era {
  era: string;
  title: string;
  text: string;
}

export interface Term {
  term: string;
  def: string;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  why: string;
}
