/**
 * prefs.ts — пайдаланушының баптауларын браузерде сақтау (localStorage).
 * Мұнда жеке деректер сақталмайды: тек түс режимі, қаріп өлшемі, дыбыс күйі,
 * таңдаулы аспаптар және викторина нәтижесі.
 */

export type Theme = "light" | "dark";

const KEYS = {
  theme: "kz_theme",
  scale: "kz_scale",
  muted: "kz_muted",
  favorites: "kz_favorites",
  bestScore: "kz_best_score",
  nickname: "kz_nickname",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* браузер жады жабық болса — үнсіз өтеміз */
  }
}

export const prefs = {
  getTheme: (): Theme => read<Theme>(KEYS.theme, "light"),
  setTheme: (t: Theme) => write(KEYS.theme, t),

  getScale: (): number => {
    const s = read<number>(KEYS.scale, 1);
    return typeof s === "number" && Number.isFinite(s) ? s : 1;
  },
  setScale: (s: number) => write(KEYS.scale, s),

  getMuted: (): boolean => read<boolean>(KEYS.muted, false),
  setMuted: (v: boolean) => write(KEYS.muted, v),

  getFavorites: (): string[] => {
    const list = read<string[]>(KEYS.favorites, []);
    return Array.isArray(list) ? list.filter((x) => typeof x === "string") : [];
  },
  setFavorites: (ids: string[]) => write(KEYS.favorites, ids),

  getBestScore: (): number => {
    const n = read<number>(KEYS.bestScore, 0);
    return typeof n === "number" && Number.isFinite(n) ? n : 0;
  },
  setBestScore: (n: number) => write(KEYS.bestScore, n),

  getNickname: (): string => read<string>(KEYS.nickname, ""),
  setNickname: (s: string) => write(KEYS.nickname, s),
};

/** Бет ашылғанша түс режимін орнатуға арналған скрипт (жарық жыпылықтамауы үшін) */
export const THEME_BOOT_SCRIPT = `(function(){try{
var t=JSON.parse(localStorage.getItem("kz_theme")||'"light"');
document.documentElement.classList.toggle("dark",t==="dark");
var s=JSON.parse(localStorage.getItem("kz_scale")||"1");
if(s&&s!==1)document.documentElement.style.setProperty("--ui-scale",String(s));
}catch(e){}})();`;
