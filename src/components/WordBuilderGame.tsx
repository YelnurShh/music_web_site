"use client";

import { useCallback, useState } from "react";
import { instruments } from "@/data/instruments";
import type { Instrument } from "@/data/types";
import { cn, shuffle } from "@/lib/utils";
import { InstrumentIcon } from "./InstrumentIcon";

interface LetterTile {
  id: number;
  letter: string;
}

const ROUND_COUNT = 6;
const words = instruments.filter((instrument) => Array.from(instrument.name).length <= 9);
const initialRounds = words.slice(0, ROUND_COUNT);

function initialLetters(word: string): LetterTile[] {
  return Array.from(word)
    .map((letter, id) => ({ id, letter }))
    .reverse();
}

function mixedLetters(word: string): LetterTile[] {
  const source = Array.from(word).map((letter, id) => ({ id, letter }));
  let mixed = shuffle(source);
  if (mixed.map((tile) => tile.letter).join("") === word && mixed.length > 1) {
    mixed = [...mixed.slice(1), mixed[0]];
  }
  return mixed;
}

/** WordBuilderGame — аралас әріптерден аспап атауын құрастыру ойыны */
export function WordBuilderGame() {
  const [rounds, setRounds] = useState<Instrument[]>(initialRounds);
  const [index, setIndex] = useState(0);
  const [available, setAvailable] = useState<LetterTile[]>(() => initialLetters(initialRounds[0].name));
  const [built, setBuilt] = useState<LetterTile[]>([]);
  const [score, setScore] = useState(0);
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);

  const prepare = useCallback((instrument: Instrument) => {
    setAvailable(mixedLetters(instrument.name));
    setBuilt([]);
    setChecked(false);
    setShowHint(false);
  }, []);

  const start = useCallback(() => {
    const nextRounds = shuffle(words).slice(0, ROUND_COUNT);
    setRounds(nextRounds);
    setIndex(0);
    setScore(0);
    setFinished(false);
    if (nextRounds[0]) prepare(nextRounds[0]);
  }, [prepare]);

  const current = rounds[index];
  const answer = built.map((tile) => tile.letter).join("");
  const isCorrect = current ? answer === current.name : false;

  function addLetter(tile: LetterTile) {
    if (checked) return;
    setAvailable((list) => list.filter((item) => item.id !== tile.id));
    setBuilt((list) => [...list, tile]);
  }

  function removeLetter(tile: LetterTile) {
    if (checked) return;
    setBuilt((list) => list.filter((item) => item.id !== tile.id));
    setAvailable((list) => [...list, tile]);
  }

  function checkAnswer() {
    if (!current || built.length !== Array.from(current.name).length || checked) return;
    setChecked(true);
    if (isCorrect) setScore((value) => value + 1);
  }

  function tryAgain() {
    if (!current) return;
    prepare(current);
  }

  function next() {
    const nextIndex = index + 1;
    if (nextIndex >= rounds.length) {
      setFinished(true);
      return;
    }
    setIndex(nextIndex);
    prepare(rounds[nextIndex]);
  }

  if (!current) return <p className="text-muted">Ойын дайындалып жатыр...</p>;

  if (finished) {
    return (
      <div className="rounded-3xl border border-line bg-surface p-6 text-center shadow-[var(--shadow-md)] sm:p-8">
        <div className="text-5xl" aria-hidden="true">🔤</div>
        <h2 className="mt-3 font-head text-2xl">Сөздер құрастырылды!</h2>
        <p className="my-3 font-head text-5xl font-bold text-accent" aria-live="polite">{score} / {rounds.length}</p>
        <p className="text-ink-soft">Аспап атауларын тағы бір рет араластырып ойнауға болады.</p>
        <button type="button" className="btn mt-4" onClick={start}>🔄 Қайта ойнау</button>
      </div>
    );
  }

  const complete = built.length === Array.from(current.name).length;
  const progress = Math.round((index / rounds.length) * 100);

  return (
    <div className="rounded-3xl border border-line bg-surface p-6 shadow-[var(--shadow-md)] sm:p-8">
      <h2 className="mb-2 font-head text-xl">🔤 «Сөз құрастыр» ойыны</h2>
      <p className="mb-5 text-[0.95rem] text-ink-soft">
        Аралас әріптерді ретімен басып, қазақтың ұлттық аспабының атауын табыңыз.
      </p>

      <div className="mb-3 flex items-center justify-between gap-3 text-[0.92rem]">
        <b>Сөз {index + 1} / {rounds.length}</b>
        <span className="tag tag-gold">Ұпай: {score}</span>
      </div>
      <div className="progress-track mb-6" role="progressbar" aria-label="Ойын барысы" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <i className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <div className="rounded-2xl border border-line bg-bg-alt p-5 text-center">
        <InstrumentIcon instrument={current} className="mx-auto h-16 w-16 rounded-2xl" />
        <p className="mb-1 mt-2 text-sm font-bold uppercase tracking-wider text-muted">Белгі</p>
        <p className="m-0 text-[0.95rem] text-ink-soft">{current.tagline}</p>
        {showHint && <p className="animate-fade mb-0 mt-3 text-sm"><b>Қосымша көмек:</b> бірінші әрпі — «{Array.from(current.name)[0]}». {current.fact}</p>}
      </div>

      <div className="my-5 flex min-h-14 flex-wrap justify-center gap-2 rounded-2xl border-2 border-dashed border-line-strong p-3" aria-label="Құрастырылған сөз" aria-live="polite">
        {built.length === 0 && <span className="self-center text-sm text-muted">Әріптерді осы жерге жинаңыз</span>}
        {built.map((tile) => (
          <button key={tile.id} type="button" onClick={() => removeLetter(tile)} disabled={checked} aria-label={`${tile.letter} әрпін қайтару`} className="grid h-11 min-w-11 place-items-center rounded-xl border border-accent bg-accent-soft px-2 text-lg font-bold text-accent-dark disabled:cursor-default">
            {tile.letter}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2" aria-label="Аралас әріптер">
        {available.map((tile) => (
          <button key={tile.id} type="button" onClick={() => addLetter(tile)} disabled={checked} className="grid h-11 min-w-11 cursor-pointer place-items-center rounded-xl border border-line-strong bg-surface px-2 text-lg font-bold shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-accent disabled:cursor-default">
            {tile.letter}
          </button>
        ))}
      </div>

      {!checked && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button type="button" className="btn" onClick={checkAnswer} disabled={!complete}>Тексеру</button>
          <button type="button" className="btn btn-ghost" onClick={() => setShowHint(true)} disabled={showHint}>💡 Көмек</button>
          <button type="button" className="btn btn-ghost" onClick={tryAgain} disabled={built.length === 0}>Тазарту</button>
        </div>
      )}

      {checked && (
        <div className={cn("animate-fade mt-5 rounded-2xl p-4", isCorrect ? "bg-ok-soft" : "bg-err-soft")} aria-live="polite">
          <strong className="block">{isCorrect ? `✅ Дұрыс: ${current.name}` : `❌ Дұрыс жауабы: ${current.name}`}</strong>
          <p className="m-0 text-[0.92rem] text-ink-soft">{current.short}</p>
          <button type="button" className="btn mt-4" onClick={next} autoFocus>
            {index + 1 < rounds.length ? "Келесі сөз →" : "Нәтижені көру 🏁"}
          </button>
        </div>
      )}
    </div>
  );
}
