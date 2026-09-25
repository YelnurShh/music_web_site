/**
 * authors.ts — ғылыми жобаның авторлары туралы мәлімет.
 *
 * Мұнда тек екі жазба бар: жоба жетекшісі (мұғалім) және жоба авторы (оқушы).
 * Аты-жөні басты беттегі хиро бөлімінде және «Жоба туралы» бетінде көрсетіледі.
 */

export interface ProjectAuthor {
  id: "teacher" | "student";
  /** Қызметі — интерфейстегі белгіде жазылады */
  role: string;
  /** Белгі түсі (globals.css ішіндегі tag-* кластары) */
  tagClass: string;
  /** Аватардың бұрышындағы кішкене таңба */
  badge: string;
  /** Тегі */
  surname: string;
  /** Аты */
  given: string;
  /** Әкесінің аты */
  patronymic: string;
  /** Фотосуреттің сипаттамасы (screen reader үшін) */
  photoAlt: string;
}

export const PROJECT_AUTHORS: ProjectAuthor[] = [
  {
    id: "teacher",
    role: "Ғылыми жетекші",
    tagClass: "tag-gold",
    badge: "👩‍🏫",
    surname: "Демеуова",
    given: "Тогжан",
    patronymic: "Абдимуратовна",
    photoAlt: "Ғылыми жетекші Демеуова Тогжан Абдимуратовна",
  },
  {
    id: "student",
    role: "Жоба авторы",
    tagClass: "tag-accent",
    badge: "👩‍🎓",
    surname: "Дөңесова",
    given: "Асылай",
    patronymic: "Кайсарқызы",
    photoAlt: "Жоба авторы Дөңесова Асылай Кайсарқызы",
  },
];

/** Жобаның толық атауы */
export const PROJECT_NAME =
  "«Бабалар үні – цифрлық әлемде: Қазақтың ұлттық музыкалық аспаптарының интерактивті онлайн-энциклопедиясы»";

/** Аты-жөнінің бас әріптері: «Демеуова Тогжан» → «ДТ» */
export function authorInitials(author: ProjectAuthor): string {
  return `${author.surname.charAt(0)}${author.given.charAt(0)}`.toUpperCase();
}

/** Толық аты-жөні: «Демеуова Тогжан Абдимуратовна» */
export function authorFullName(author: ProjectAuthor): string {
  return `${author.surname} ${author.given} ${author.patronymic}`;
}

/** Қысқаша аты-жөні: «Демеуова Т.А.» (футер мен метадеректер үшін) */
export function authorInitialsName(author: ProjectAuthor): string {
  return `${author.surname} ${author.given.charAt(0)}.${author.patronymic.charAt(0)}.`;
}

/** Тегі мен аты: «Демеуова Тогжан» */
export function authorShortName(author: ProjectAuthor): string {
  return `${author.surname} ${author.given}`;
}

/**
 * Ілік септіктегі аты-жөні: «Демеуова Тогжан Абдимуратовна» → «...ның».
 * Жалғау дауыстыға біткен соңғы дыбысқа қарай таңдалады (ның/нің/дың/дің/тың/тің).
 */
export function authorGenitive(author: ProjectAuthor): string {
  const name = authorFullName(author);
  const lower = name.toLowerCase();
  const vowels = "аәеёиоөуұүыіэюя";
  const voiceless = "пфкқтсшчщхһц";
  const backVowels = "аоұыёюяэ";

  const last = lower.slice(-1);
  const lastVowel = [...lower].reverse().find((ch) => vowels.includes(ch)) ?? "а";
  const isBack = backVowels.includes(lastVowel);

  if (vowels.includes(last)) return `${name}${isBack ? "ның" : "нің"}`;
  if (voiceless.includes(last)) return `${name}${isBack ? "тың" : "тің"}`;
  return `${name}${isBack ? "дың" : "дің"}`;
}

export const TEACHER = PROJECT_AUTHORS[0];
export const STUDENT = PROJECT_AUTHORS[1];
