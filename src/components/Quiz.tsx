"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { quiz as allQuestions } from "@/data/quiz";
import type { QuizQuestion } from "@/data/types";
import { isCloudAvailable, submitLeaderboardScore } from "@/lib/cloud";
import { prefs } from "@/lib/prefs";
import { shuffle } from "@/lib/utils";
import { useApp } from "@/providers/AppProvider";
import { cn } from "@/lib/utils";
import { Leaderboard } from "./Leaderboard";

const QUIZ_LENGTH = 10;
const OPTION_KEYS = ["А", "Ә", "Б", "В"];

interface Mistake {
  question: string;
  right: string;
  why: string;
}

/** Quiz — викторина: 10 сұрақ, әр жауаптан кейін түсіндірме, соңында нәтиже мен медаль */
export function Quiz() {
  const { notify, bestScore, registerScore } = useApp();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [finished, setFinished] = useState(false);
  const [nickname, setNickname] = useState("");
  const [sent, setSent] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const start = useCallback(() => {
    setQuestions(shuffle(allQuestions).slice(0, QUIZ_LENGTH));
    setIndex(0);
    setScore(0);
    setChosen(null);
    setMistakes([]);
    setFinished(false);
    setSent(false);
  }, []);

  useEffect(() => {
    start();
    setNickname(prefs.getNickname());
  }, [start]);

  const current = questions[index];
  const progress = questions.length ? Math.round((index / questions.length) * 100) : 0;

  const medal = useMemo(() => {
    const percent = questions.length ? Math.round((score / questions.length) * 100) : 0;
    if (percent >= 90) return { icon: "🥇", title: "Керемет! Сіз нағыз білгір!", text: "Қазақтың аспаптарын жақсы білесіз екенсіз. Енді достарыңызға да үйретіңіз!" };
    if (percent >= 70) return { icon: "🥈", title: "Өте жақсы!", text: "Тағы біраз жаттығып, 100%-ға жетуге болады." };
    if (percent >= 50) return { icon: "🥉", title: "Жаман емес!", text: "Аспап беттерін қайта оқып, викторинаны тағы бір рет көріңіз." };
    return { icon: "📘", title: "Жақсы бастама!", text: "Мәтінді тағы оқып, қайта көріңіз — білім жинала береді." };
  }, [score, questions.length]);

  function answer(optionIndex: number) {
    if (!current || chosen !== null) return;
    setChosen(optionIndex);
    if (optionIndex === current.answer) {
      setScore((s) => s + 1);
    } else {
      setMistakes((list) => [
        ...list,
        { question: current.q, right: current.options[current.answer], why: current.why },
      ]);
    }
  }

  function next() {
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setChosen(null);
      return;
    }
    const finalScore = score;
    setFinished(true);
    registerScore(finalScore);
    if (finalScore > bestScore) notify(`Жаңа рекорд: ${finalScore} ұпай! 🏆`);
  }

  async function sendScore() {
    const name = nickname.trim() || "Қонақ";
    prefs.setNickname(name);
    const result = await submitLeaderboardScore(name, score, questions.length);
    if (result.ok) {
      setSent(true);
      setRefreshKey((k) => k + 1);
      notify("Нәтиже жалпы кестеге қосылды ☁️");
    } else {
      notify(result.mode === "local" ? "Firebase қосылмаған — нәтиже тек осында сақталды" : `Сақтау мүмкін болмады: ${result.error}`);
    }
  }

  /* --- Нәтиже беті --- */
  if (finished) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="rounded-3xl border border-line bg-surface p-6 shadow-[var(--shadow-md)] sm:p-8">
        <div className="text-center">
          <div className="text-5xl" aria-hidden="true">
            {medal.icon}
          </div>
          <p className="my-2 font-head text-5xl font-bold text-accent" aria-live="polite">
            {score} / {questions.length}
          </p>
          <p className="text-sm text-muted">{percent}% дұрыс жауап</p>
          <h3 className="mt-3">{medal.title}</h3>
          <p className="mx-auto max-w-xl text-ink-soft">{medal.text}</p>
          {bestScore > 0 && <p className="mt-2 text-sm text-muted">Сіздің рекордыңыз: {Math.max(bestScore, score)} ұпай</p>}
        </div>

        {isCloudAvailable() && (
          <div className="mt-6 rounded-2xl border border-line bg-surface-2 p-4">
            <h4 className="mb-1 font-head text-lg">☁️ Нәтижені жалпы кестеге қосу</h4>
            <p className="mb-3 text-[0.9rem] text-muted">
              Лақап ат жазыңыз (аты-жөніңізді жазу міндетті емес) — нәтиже сыныптастарыңызға көрінеді.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={nickname}
                maxLength={24}
                onChange={(event) => setNickname(event.target.value)}
                placeholder="Лақап ат (мысалы: Айгүл)"
                className="rounded-full border border-line bg-surface px-4 py-2 text-[0.9rem] outline-none focus:border-accent"
              />
              <button type="button" className="btn btn-sm" onClick={sendScore} disabled={sent}>
                {sent ? "Қосылды ✓" : "Кестеге қосу"}
              </button>
            </div>
          </div>
        )}

        {mistakes.length > 0 && (
          <div className="mt-6">
            <h3>📝 Қайталауға керек сұрақтар</h3>
            <ul className="fact-list">
              {mistakes.map((m) => (
                <li key={m.question}>
                  <span className="fact-num">!</span>
                  <span>
                    <strong className="block">{m.question}</strong>
                    <span className="text-[0.9rem] text-ink-soft">
                      Дұрыс жауап: <b>{m.right}</b>. {m.why}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" className="btn btn-lg" onClick={start}>
            🔄 Қайта бастау
          </button>
          <Link href="/aspaptar" className="btn btn-lg btn-ghost no-underline">
            📚 Аспаптарды қайталау
          </Link>
        </div>

        <Leaderboard refreshKey={refreshKey} />
      </div>
    );
  }

  if (!current) return <p className="text-muted">Сұрақтар дайындалып жатыр...</p>;

  /* --- Сұрақ беті --- */
  return (
    <div className="rounded-3xl border border-line bg-surface p-6 shadow-[var(--shadow-md)] sm:p-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="font-bold">
          Сұрақ {index + 1} / {questions.length}
        </span>
        <span className="tag tag-teal">Ұпай: {score}</span>
      </div>

      <div className="progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <i className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <h3 className="my-5 font-head text-[1.3rem] leading-snug font-semibold">{current.q}</h3>

      <div className="grid gap-2.5">
        {current.options.map((option, optionIndex) => {
          const isCorrect = optionIndex === current.answer;
          const isChosen = chosen === optionIndex;
          return (
            <button
              key={option}
              type="button"
              className={cn(
                "option",
                chosen !== null && isCorrect && "option-correct",
                chosen !== null && isChosen && !isCorrect && "option-wrong",
              )}
              onClick={() => answer(optionIndex)}
              disabled={chosen !== null}
            >
              <span className="option-key">{OPTION_KEYS[optionIndex] ?? optionIndex + 1}</span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {chosen !== null && (
        <div className="animate-fade mt-5">
          <div
            className={cn(
              "rounded-2xl border border-line bg-surface-2 p-4",
              chosen === current.answer ? "border-transparent bg-ok-soft" : "border-transparent bg-err-soft",
            )}
          >
            <strong className="block">
              {chosen === current.answer ? "✅ Дұрыс! Жарайсың!" : "❌ Дұрыс емес."}
            </strong>
            <p className="m-0 text-[0.95rem] text-ink-soft">{current.why}</p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" className="btn" onClick={next} autoFocus>
              {index + 1 < questions.length ? "Келесі сұрақ →" : "Нәтижені көрсету 🏁"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
