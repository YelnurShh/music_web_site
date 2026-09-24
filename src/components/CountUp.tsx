"use client";

import { useEffect, useRef, useState } from "react";

/** CountUp — санды 0-ден бастап жұмсақ өсіріп көрсетеді (статистика үшін) */
export function CountUp({ to, className }: { to: number; className?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function run() {
      if (started.current) return;
      started.current = true;
      const step = Math.max(1, Math.ceil(to / 40));
      const timer = window.setInterval(() => {
        setValue((current) => {
          const next = current + step;
          if (next >= to) {
            window.clearInterval(timer);
            return to;
          }
          return next;
        });
      }, 30);
    }

    if (typeof IntersectionObserver === "undefined") {
      run();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && run()),
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [to]);

  return (
    <span ref={ref} className={className} aria-label={String(to)}>
      {value}
    </span>
  );
}
