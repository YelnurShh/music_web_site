"use client";

import { useEffect } from "react";
import { playNote, isSupported } from "@/lib/synth";
import type { SynthGroup } from "@/lib/synth";
import { useApp } from "@/providers/AppProvider";

const NOTES: { label: string; semitone: number; key: string }[] = [
  { label: "до", semitone: 0, key: "1" },
  { label: "ре", semitone: 2, key: "2" },
  { label: "ми", semitone: 4, key: "3" },
  { label: "соль", semitone: 7, key: "4" },
  { label: "ля", semitone: 9, key: "5" },
  { label: "до¹", semitone: 12, key: "6" },
];

/**
 * NoteKeyboard — аспап бетіндегі дыбыс пернелері.
 * Оқушы батырманы басып, аспаптың дыбысын өзі шығарып көреді.
 */
export function NoteKeyboard({ group }: { group: SynthGroup }) {
  const { notify } = useApp();

  /* Пернетақтадағы 1–6 сандары да нота шығарады */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      const note = NOTES.find((n) => n.key === event.key);
      if (note && isSupported()) playNote(group, note.semitone, 0.9);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [group]);

  function handle(semitone: number) {
    if (!isSupported()) {
      notify("Бұл браузер дыбысты қолдамайды");
      return;
    }
    playNote(group, semitone, 0.9);
  }

  return (
    <div className="card">
      <h3 className="font-head text-lg">🎹 Дыбыс пернелері</h3>
      <p className="text-[0.92rem] text-ink-soft">
        Төмендегі батырмаларды басып, дыбысты өзіңіз шығарып көріңіз. Пернетақтадағы 1–6 сандары да жұмыс істейді.
      </p>
      <div className="flex flex-wrap gap-2">
        {NOTES.map((note) => (
          <button
            key={note.label}
            type="button"
            onClick={() => handle(note.semitone)}
            className="btn btn-sm btn-ghost"
            aria-label={`${note.label} нотасын ойнау`}
          >
            🎵 {note.label} <span className="text-[0.75rem] text-muted">({note.key})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
