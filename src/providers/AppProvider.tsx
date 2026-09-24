"use client";

/**
 * AppProvider — бүкіл сайтқа ортақ күй (state):
 * түс режимі, қаріп өлшемі, дыбыс қосу/өшіру, таңдаулы аспаптар, хабарламалар (toast)
 * және Firebase жағдайы (қосылған/қосылмаған).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ensureUser,
  fetchProfile,
  isCloudAvailable,
  saveProfile,
  type CloudStatus,
} from "@/lib/cloud";
import { isMuted, isSupported, setMuted } from "@/lib/synth";
import { prefs, type Theme } from "@/lib/prefs";

interface Toast {
  id: number;
  message: string;
}

interface AppState {
  theme: Theme;
  toggleTheme: () => void;

  scale: number;
  increaseScale: () => void;
  decreaseScale: () => void;
  resetScale: () => void;

  soundOn: boolean;
  toggleSound: () => void;

  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;

  bestScore: number;
  registerScore: (score: number) => void;

  cloud: { available: boolean; status: CloudStatus; uid: string | null };

  toasts: Toast[];
  notify: (message: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [scale, setScale] = useState(1);
  const [soundOn, setSoundOn] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [bestScore, setBestScore] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  // Firebase қосылу күйі. `isCloudAvailable()` тек қоршаған орта айнымалыларын оқиды,
  // сондықтан серверде де, браузерде де бірдей мән қайтарады (гидратация қауіпсіз).
  const [cloud, setCloud] = useState<AppState["cloud"]>(() => ({
    available: isCloudAvailable(),
    status: isCloudAvailable() ? "connecting" : "idle",
    uid: null,
  }));
  const hydrated = useRef(false);
  const toastId = useRef(0);

  /* --- 1. Браузерде сақталған баптауларды оқу (тек қосылғаннан кейін) --- */
  useEffect(() => {
    const savedTheme: Theme = prefs.getTheme();
    const savedScale = prefs.getScale();
    const savedMuted = prefs.getMuted();
    const savedFavorites = prefs.getFavorites();
    const savedBest = prefs.getBestScore();

    setTheme(savedTheme);
    setScale(savedScale);
    setFavorites(savedFavorites);
    setBestScore(savedBest);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
    document.documentElement.style.setProperty("--ui-scale", String(savedScale));
    setMuted(savedMuted);
    setSoundOn(!savedMuted);
    hydrated.current = true;
  }, []);

  /* --- 2. Түс режимін қолдану және сақтау --- */
  useEffect(() => {
    if (!hydrated.current) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    prefs.setTheme(theme);
  }, [theme]);

  /* --- 3. Firebase қосылуы (бар болса) --- */
  useEffect(() => {
    if (!isCloudAvailable()) return;
    let cancelled = false;

    (async () => {
      try {
        const uid = await ensureUser();
        if (cancelled) return;
        if (!uid) {
          setCloud({ available: true, status: "error", uid: null });
          return;
        }
        setCloud({ available: true, status: "ready", uid });

        const profile = await fetchProfile();
        if (cancelled || !profile) return;

        // Сервердегі және браузердегі таңдаулыларды біріктіреміз
        setFavorites((local) => {
          const merged = Array.from(new Set([...local, ...profile.favorites]));
          if (merged.length !== local.length) void saveProfile({ favorites: merged });
          return merged;
        });
        setBestScore((local) => Math.max(local, profile.bestScore));
        if (profile.nickname) prefs.setNickname(profile.nickname);
      } catch {
        if (!cancelled) setCloud({ available: true, status: "error", uid: null });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* --- 4. Хабарламалар (toast) --- */
  const notify = useCallback((message: string) => {
    const id = ++toastId.current;
    setToasts((list) => [...list, { id, message }]);
    window.setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
    }, 2400);
  }, []);

  /* --- 5. Түс режимі --- */
  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  /* --- 6. Қаріп өлшемі (үлкен кісілерге арналған мүмкіндік) --- */
  const applyScale = useCallback((value: number) => {
    const next = Math.min(1.5, Math.max(0.85, Math.round(value * 100) / 100));
    setScale(next);
    document.documentElement.style.setProperty("--ui-scale", String(next));
    prefs.setScale(next);
  }, []);

  const increaseScale = useCallback(() => applyScale(prefs.getScale() + 0.1), [applyScale]);
  const decreaseScale = useCallback(() => applyScale(prefs.getScale() - 0.1), [applyScale]);
  const resetScale = useCallback(() => {
    applyScale(1);
  }, [applyScale]);

  /* --- 7. Дыбыс --- */
  const toggleSound = useCallback(() => {
    setSoundOn((on) => {
      const next = !on;
      setMuted(!next);
      prefs.setMuted(!next);
      if (isSupported()) void isMuted();
      return next;
    });
  }, []);

  /* --- 8. Таңдаулылар --- */
  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavorites((list) => {
        const has = list.includes(id);
        const next = has ? list.filter((x) => x !== id) : [...list, id];
        prefs.setFavorites(next);
        if (isCloudAvailable()) void saveProfile({ favorites: next });
        notify(has ? "Таңдаулылардан алынды" : "Таңдаулыларға қосылды ⭐");
        return next;
      });
    },
    [notify],
  );

  /* --- 9. Викторина нәтижесі --- */
  const registerScore = useCallback(
    (score: number) => {
      setBestScore((prev) => {
        if (score <= prev) return prev;
        prefs.setBestScore(score);
        if (isCloudAvailable()) void saveProfile({ bestScore: score });
        return score;
      });
    },
    [],
  );

  const value = useMemo<AppState>(
    () => ({
      theme,
      toggleTheme,
      scale,
      increaseScale,
      decreaseScale,
      resetScale,
      soundOn,
      toggleSound,
      favorites,
      isFavorite,
      toggleFavorite,
      bestScore,
      registerScore,
      cloud,
      toasts,
      notify,
    }),
    [
      theme,
      toggleTheme,
      scale,
      increaseScale,
      decreaseScale,
      resetScale,
      soundOn,
      toggleSound,
      favorites,
      isFavorite,
      toggleFavorite,
      bestScore,
      registerScore,
      cloud,
      toasts,
      notify,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp тек AppProvider ішінде қолданылады");
  return ctx;
}
