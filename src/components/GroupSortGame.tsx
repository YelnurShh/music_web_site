"use client";

import { useCallback, useState } from "react";
import { groups } from "@/data/groups";
import { instruments } from "@/data/instruments";
import type { GroupId, Instrument } from "@/data/types";
import { cn, groupById, shuffle } from "@/lib/utils";
import { GroupIcon, InstrumentIcon } from "./InstrumentIcon";

const ROUND_COUNT = 8;

/** GroupSortGame — аспаптарды дыбыс шығару тәсіліне қарай топтастыру ойыны */
export function GroupSortGame() {
  const [rounds, setRounds] = useState<Instrument[]>(() => instruments.slice(0, ROUND_COUNT));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<GroupId | null>(null);
  const [finished, setFinished] = useState(false);

  const start = useCallback(() => {
    setRounds(shuffle(instruments).slice(0, ROUND_COUNT));
    setIndex(0);
    setScore(0);
    setChosen(null);
    setFinished(false);
  }, []);

  const current = rounds[index];

  function choose(groupId: GroupId) {
    if (!current || chosen !== null) return;
    setChosen(groupId);
    if (groupId === current.group) setScore((value) => value + 1);
  }

  function next() {
    if (index + 1 >= rounds.length) {
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
    setChosen(null);
  }

  if (!current) return <p className="text-muted">Ойын дайындалып жатыр...</p>;

  if (finished) {
    const percent = Math.round((score / rounds.length) * 100);
    return (
      <div className="rounded-3xl border border-line bg-surface p-6 text-center shadow-[var(--shadow-md)] sm:p-8">
        <div className="text-5xl" aria-hidden="true">{percent >= 75 ? "🏆" : "🌱"}</div>
        <h2 className="mt-3 font-head text-2xl">Топтастыру аяқталды!</h2>
        <p className="my-3 font-head text-5xl font-bold text-accent" aria-live="polite">
          {score} / {rounds.length}
        </p>
        <p className="mx-auto max-w-lg text-ink-soft">
          {percent >= 75
            ? "Керемет! Аспаптардың қай топқа жататынын жақсы білесіз."
            : "Жақсы талпыныс! Топтардың сипаттамасын қарап, тағы бір рет ойнап көріңіз."}
        </p>
        <button type="button" className="btn mt-4" onClick={start}>🔄 Қайта ойнау</button>
      </div>
    );
  }

  const correctGroup = groupById(current.group);
  const progress = Math.round((index / rounds.length) * 100);

  return (
    <div className="rounded-3xl border border-line bg-surface p-6 shadow-[var(--shadow-md)] sm:p-8">
      <h2 className="mb-2 font-head text-xl">🧩 «Тобына бөл» ойыны</h2>
      <p className="mb-5 text-[0.95rem] text-ink-soft">
        Аспаптың қалай ойналатынын ойлап, оны дұрыс топқа жіберіңіз. Бұл ойында дыбыс қолданылмайды.
      </p>

      <div className="mb-3 flex items-center justify-between gap-3 text-[0.92rem]">
        <b>Аспап {index + 1} / {rounds.length}</b>
        <span className="tag tag-teal">Ұпай: {score}</span>
      </div>
      <div className="progress-track mb-6" role="progressbar" aria-label="Ойын барысы" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <i className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <div className="mb-6 rounded-2xl border border-line bg-bg-alt p-5 text-center">
        <InstrumentIcon instrument={current} className="mx-auto h-20 w-20 rounded-2xl" />
        <h3 className="mt-2 font-head text-2xl">{current.name}</h3>
        <p className="m-0 text-[0.92rem] text-ink-soft">{current.fact}</p>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2" aria-label="Аспап топтары">
        {groups.map((group) => {
          const answered = chosen !== null;
          const isCorrect = group.id === current.group;
          const isChosen = group.id === chosen;
          return (
            <button
              key={group.id}
              type="button"
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-line bg-surface-2 px-4 py-3 text-left font-semibold transition hover:border-accent disabled:cursor-default",
                answered && isCorrect && "border-ok bg-ok-soft",
                answered && isChosen && !isCorrect && "border-err bg-err-soft",
              )}
              onClick={() => choose(group.id)}
              disabled={answered}
            >
              <GroupIcon groupId={group.id} className="h-10 w-10" />
              <span>{group.name}</span>
            </button>
          );
        })}
      </div>

      {chosen !== null && (
        <div className={cn("animate-fade mt-5 rounded-2xl p-4", chosen === current.group ? "bg-ok-soft" : "bg-err-soft")} aria-live="polite">
          <strong className="block">
            {chosen === current.group ? "✅ Дұрыс!" : `❌ Дұрыс жауабы: ${correctGroup.name}`}
          </strong>
          <p className="m-0 text-[0.92rem] text-ink-soft">{correctGroup.desc}</p>
          <button type="button" className="btn mt-4" onClick={next} autoFocus>
            {index + 1 < rounds.length ? "Келесі аспап →" : "Нәтижені көру 🏁"}
          </button>
        </div>
      )}
    </div>
  );
}
