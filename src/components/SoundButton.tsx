"use client";

import { useEffect, useRef, useState } from "react";
import { isSupported, playGroup, type SynthGroup } from "@/lib/synth";
import { useApp } from "@/providers/AppProvider";
import { cn } from "@/lib/utils";

/**
 * SoundButton — аспап үнін тыңдау батырмасы.
 * Үн Web Audio API арқылы компьютерде жасалады (нақты жазба емес, жуық үлгі).
 */
export function SoundButton({
  group,
  instrumentId,
  label = "Үнін тыңдау",
  className,
}: {
  group: SynthGroup;
  instrumentId?: string;
  label?: string;
  className?: string;
}) {
  const { notify } = useApp();
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  function handleClick() {
    if (!isSupported()) {
      notify("Бұл браузер дыбысты қолдамайды");
      return;
    }
    const duration = playGroup(group, instrumentId);
    setPlaying(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPlaying(false), Math.min(Math.max(duration, 900), 4000));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn("btn btn-sm btn-ghost", playing && "border-accent text-accent", className)}
      aria-label={playing ? "Үн ойналып жатыр" : "Аспап үнін тыңдау"}
    >
      <span className="sound-wave" aria-hidden="true">
        <i style={{ height: "40%" }} />
        <i style={{ height: "100%" }} />
        <i style={{ height: "65%" }} />
      </span>
      {playing ? "Ойналып жатыр..." : label}
    </button>
  );
}
