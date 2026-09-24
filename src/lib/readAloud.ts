/**
 * readAloud.ts — мәтінді дауыстап оқу (браузердің сөйлеу синтезі арқылы).
 * Оқуға қиналатын оқушы мен үлкен кісіге көмектеседі.
 */

export type ReadResult = "ok" | "unsupported" | "empty";

export function speak(text: string): ReadResult {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return "unsupported";
  const clean = text.trim();
  if (!clean) return "empty";

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(clean);
  const voices = window.speechSynthesis.getVoices() ?? [];
  const lang = (v: SpeechSynthesisVoice) => (v.lang ?? "").toLowerCase();
  const kk = voices.find((v) => lang(v).startsWith("kk"));
  const ru = voices.find((v) => lang(v).startsWith("ru"));

  if (kk) {
    utterance.voice = kk;
    utterance.lang = "kk-KZ";
  } else if (ru) {
    utterance.voice = ru;
    utterance.lang = "ru-RU";
  } else {
    utterance.lang = "kk-KZ";
  }
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
  return "ok";
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
