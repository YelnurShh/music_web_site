"use client";

import { useApp } from "@/providers/AppProvider";

/**
 * Firebase жағдайын көрсететін кішкене белгі.
 * Пайдаланушы деректері қайда сақталып жатқанын ашық айтады.
 */
export function CloudBadge({ compact = false }: { compact?: boolean }) {
  const { cloud } = useApp();

  const text = !cloud.available
    ? "Firebase қосылмаған · деректер тек осы браузерде сақталады"
    : cloud.status === "ready"
      ? "Firebase қосылған · таңдаулылар мен нәтижелер серверде сақталады"
      : cloud.status === "connecting"
        ? "Firebase-ке қосылып жатыр..."
        : "Firebase қосылу қатесі · деректер браузерде сақталады";

  const tone = !cloud.available
    ? "bg-bg-alt text-muted"
    : cloud.status === "ready"
      ? "bg-ok-soft text-ok"
      : cloud.status === "connecting"
        ? "bg-gold-soft text-gold"
        : "bg-err-soft text-err";

  const icon = !cloud.available ? "💾" : cloud.status === "ready" ? "☁️" : cloud.status === "connecting" ? "⏳" : "⚠️";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.78rem] font-semibold ${tone}`}
      title={text}
    >
      <span aria-hidden="true">{icon}</span>
      {compact ? (cloud.available && cloud.status === "ready" ? "Firebase қосылған" : "Браузерде сақтау") : text}
    </span>
  );
}
