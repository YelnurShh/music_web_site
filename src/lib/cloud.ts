/**
 * cloud.ts — Firebase арқылы деректерді сақтау қабаты.
 *
 * • Firebase қосылған болса: анонимді кіру (аты-жөні сұралмайды) → Firestore-да
 *   таңдаулы аспаптар, викторина нәтижесі және «Үздік оқушылар» кестесі сақталады.
 * • Firebase қосылмаған болса: сол деректер браузерде (localStorage) сақталады.
 */

import { getAuthClient, getDb, isFirebaseConfigured } from "./firebase";
import { prefs } from "./prefs";

export type CloudMode = "local" | "cloud";
export type CloudStatus = "idle" | "connecting" | "ready" | "error";

export interface LeaderboardRow {
  id: string;
  nickname: string;
  score: number;
  total: number;
  /** Firestore-да сақталған уақыт (мәтін түрінде) */
  when: string;
}

export type SaveResult = { ok: true; mode: CloudMode } | { ok: false; mode: CloudMode; error: string };

const COLLECTION_USERS = "users";
const COLLECTION_SCORES = "scores";

/** Firebase жобасы қосылған-қосылмағанын айтады */
export function isCloudAvailable() {
  return isFirebaseConfigured;
}

/**
 * Анонимді кіру. Firebase-да Anonymous Authentication қосулы болуы керек.
 * Пайдаланушыдан ешқандай жеке дерек сұралмайды — тек қайта тануға арналған ID беріледі.
 */
export async function ensureUser(): Promise<string | null> {
  const auth = await getAuthClient();
  if (!auth) return null;
  const { onAuthStateChanged, signInAnonymously } = await import("firebase/auth");

  if (auth.currentUser) return auth.currentUser.uid;

  const uid = await new Promise<string | null>((resolve) => {
    const stop = onAuthStateChanged(auth, (user) => {
      stop();
      resolve(user ? user.uid : null);
    });
    signInAnonymously(auth).catch(() => {
      stop();
      resolve(null);
    });
  });
  return uid;
}

/* ------------------------------------------------------------------ Профиль */

export interface CloudProfile {
  favorites: string[];
  bestScore: number;
  nickname: string;
}

function normalizeFavorites(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : [];
}

export async function fetchProfile(): Promise<CloudProfile | null> {
  const uid = await ensureUser();
  const db = await getDb();
  if (!uid || !db) return null;
  const { doc, getDoc } = await import("firebase/firestore");
  const snap = await getDoc(doc(db, COLLECTION_USERS, uid));
  if (!snap.exists()) {
    return { favorites: prefs.getFavorites(), bestScore: prefs.getBestScore(), nickname: prefs.getNickname() };
  }
  const data = snap.data() ?? {};
  return {
    favorites: normalizeFavorites(data.favorites),
    bestScore: typeof data.bestScore === "number" ? data.bestScore : 0,
    nickname: typeof data.nickname === "string" ? data.nickname : "",
  };
}

export async function saveProfile(patch: Partial<CloudProfile>): Promise<SaveResult> {
  if (!isFirebaseConfigured) {
    return { ok: false, mode: "local", error: "Firebase қосылмаған" };
  }
  try {
    const uid = await ensureUser();
    const db = await getDb();
    if (!uid || !db) return { ok: false, mode: "local", error: "Кіру мүмкін болмады" };
    const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
    await setDoc(
      doc(db, COLLECTION_USERS, uid),
      { ...patch, updatedAt: serverTimestamp() },
      { merge: true },
    );
    return { ok: true, mode: "cloud" };
  } catch (error) {
    return { ok: false, mode: "cloud", error: error instanceof Error ? error.message : "Белгісіз қате" };
  }
}

/* ------------------------------------------------------- Үздік оқушылар кестесі */

/** Нәтижені жалпы кестеге қосады (лақап ат ерікті түрде енгізіледі) */
export async function submitLeaderboardScore(
  nickname: string,
  score: number,
  total: number,
): Promise<SaveResult> {
  if (!isFirebaseConfigured) {
    return { ok: false, mode: "local", error: "Firebase қосылмаған" };
  }
  try {
    const uid = await ensureUser();
    const db = await getDb();
    if (!uid || !db) return { ok: false, mode: "local", error: "Кіру мүмкін болмады" };
    const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
    await addDoc(collection(db, COLLECTION_SCORES), {
      nickname: nickname.trim().slice(0, 24) || "Қонақ",
      score,
      total,
      uid,
      createdAt: serverTimestamp(),
    });
    return { ok: true, mode: "cloud" };
  } catch (error) {
    return { ok: false, mode: "cloud", error: error instanceof Error ? error.message : "Белгісіз қате" };
  }
}

/** Ең жоғары 10 нәтижені оқиды */
export async function fetchLeaderboard(max = 10): Promise<LeaderboardRow[]> {
  const db = await getDb();
  if (!db) return [];
  const { collection, getDocs, limit, orderBy, query } = await import("firebase/firestore");
  const q = query(collection(db, COLLECTION_SCORES), orderBy("score", "desc"), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    const created = data.createdAt as { toDate?: () => Date } | undefined;
    return {
      id: d.id,
      nickname: typeof data.nickname === "string" ? data.nickname : "Қонақ",
      score: typeof data.score === "number" ? data.score : 0,
      total: typeof data.total === "number" ? data.total : 0,
      when: created?.toDate ? created.toDate().toLocaleDateString("kk-KZ") : "",
    };
  });
}
