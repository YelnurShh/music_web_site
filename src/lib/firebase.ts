/**
 * firebase.ts — Firebase-пен байланыс.
 *
 * Firebase тек қоршаған орта айнымалылары (`.env.local`) толтырылған жағдайда қосылады.
 * Егер айнымалылар жоқ болса, сайт бәрібір толық жұмыс істейді: деректер браузерде
 * (localStorage) сақталады. Осылайша жобаны Firebase-сыз да ашып көрсетуге болады.
 */

import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/** Firebase қосылу үшін ең қажетті үш айнымалы жеткілікті */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

let appPromise: Promise<FirebaseApp> | null = null;

/** Firebase қосымшасын тек қажет кезде жүктейді (бастапқы жүктемені ауырлатпау үшін) */
export async function getFirebaseApp(): Promise<FirebaseApp | null> {
  if (!isFirebaseConfigured) return null;
  if (!appPromise) {
    appPromise = (async () => {
      const { initializeApp, getApps, getApp } = await import("firebase/app");
      return getApps().length ? getApp() : initializeApp(firebaseConfig);
    })();
  }
  return appPromise;
}

export async function getAuthClient(): Promise<Auth | null> {
  const app = await getFirebaseApp();
  if (!app) return null;
  const { getAuth } = await import("firebase/auth");
  return getAuth(app);
}

export async function getDb(): Promise<Firestore | null> {
  const app = await getFirebaseApp();
  if (!app) return null;
  const { getFirestore } = await import("firebase/firestore");
  return getFirestore(app);
}

/** Firebase жобасының аты (интерфейсте көрсету үшін) */
export const firebaseProjectId = firebaseConfig.projectId ?? null;
