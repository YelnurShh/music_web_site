"use client";

import { useEffect, useRef, useState } from "react";
import { isSupported, playGroup } from "@/lib/synth";
import { cn } from "@/lib/utils";

interface Pattern {
  name: string;
  steps: number[];
  instrumentId: string;
  group: "perc";
}

const PATTERNS: Pattern[] = [
  { name: "Дауылпаз ырғағы", steps: [1, 0, 0, 1, 0, 0, 1, 0], instrumentId: "dauylpaz", group: "perc" },
  { name: "Той ырғағы", steps: [1, 0, 1, 0, 1, 1, 0, 0], instrumentId: "dangyra", group: "perc" },
  { name: "Жорық дабылы", steps: [1, 1, 0, 1, 0, 1, 1, 0], instrumentId: "shyndauyl", group: "perc" },
];

const STEP_MS = 520;

/** RhythmStudio — ұрмалы аспаптардың ырғағын тыңдау жаттығуы */
export function RhythmStudio() {
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, []);

  function stop() {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
    setPlaying(false);
    setStep(-1);
  }

  function play() {
    if (!isSupported()) return;
    const pattern = PATTERNS[selected];
    stop();
    setPlaying(true);
    let current = 0;
    timer.current = window.setInterval(() => {
      setStep(current);
      if (pattern.steps[current] === 1) playGroup(pattern.group, pattern.instrumentId);
      current = (current + 1) % pattern.steps.length;
    }, STEP_MS);
  }

  return (
    <div className="rounded-3xl border border-line bg-surface p-6 shadow-[var(--shadow-md)] sm:p-8">
      <h2 className="mb-2 font-head text-xl">🥁 Ырғақ жаттығуы</h2>
      <p className="mb-4 text-[0.95rem] text-ink-soft">
        Ұрмалы аспаптардың ырғағын таңдап тыңдаңыз. Дауылпаз, даңғыра және шыңдауыл әрқалай соғылады —
        қайсысы тойға, қайсысы жорыққа арналғанын салыстырыңыз.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {PATTERNS.map((pattern, i) => (
          <button
            key={pattern.name}
            type="button"
            className={cn("chip", selected === i && "chip-active")}
            onClick={() => {
              setSelected(i);
              stop();
            }}
          >
            {pattern.name}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-sm" onClick={play} disabled={!isSupported()}>
          ▶️ Ырғақты тыңдау
        </button>
        <button type="button" className="btn btn-sm btn-ghost" onClick={stop} disabled={!playing}>
          ⏹ Тоқтату
        </button>
        <span className="text-[0.88rem] text-muted">
          {isSupported() ? `${PATTERNS[selected].name} таңдалды` : "Бұл браузер дыбысты қолдамайды"}
        </span>
      </div>

      <div className="flex flex-wrap gap-2" aria-hidden="true">
        {PATTERNS[selected].steps.map((hit, i) => (
          <span
            key={i}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-lg border text-lg",
              step === i ? "border-accent bg-accent-soft text-accent" : "border-line text-muted",
              hit === 1 ? "font-bold" : "opacity-50",
            )}
          >
            {hit === 1 ? "●" : "•"}
          </span>
        ))}
      </div>
    </div>
  );
}
