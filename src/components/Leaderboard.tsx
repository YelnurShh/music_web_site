"use client";

import { useEffect, useState } from "react";
import { fetchLeaderboard, isCloudAvailable, type LeaderboardRow } from "@/lib/cloud";

/**
 * Leaderboard — «Үздік оқушылар» кестесі (Firebase Firestore).
 * Firebase қосылмаған болса, қалай қосу керектігі түсіндіріледі.
 */
export function Leaderboard({ refreshKey = 0 }: { refreshKey?: number }) {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "unavailable" | "error">(
    isCloudAvailable() ? "loading" : "unavailable",
  );

  useEffect(() => {
    if (!isCloudAvailable()) return;
    let cancelled = false;
    setState("loading");
    fetchLeaderboard()
      .then((data) => {
        if (cancelled) return;
        setRows(data);
        setState("ready");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  if (state === "unavailable") {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-line-strong bg-surface-2 p-4 text-[0.9rem] text-muted">
        <b className="mb-1 block text-ink">☁️ Жалпы кесте қазір өшірулі</b>
        Сайт Firebase жобасына қосылмағандықтан, нәтижелер тек осы браузерде сақталады. Firebase қосу үшін
        жобаның <code>README.md</code> файлындағы «Firebase қосу» бөлімін оқыңыз.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h4 className="mb-2 font-head text-lg">🏆 Үздік оқушылар</h4>
      {state === "loading" && <p className="text-muted">Кесте жүктеліп жатыр...</p>}
      {state === "error" && <p className="text-muted">Кестені жүктеу мүмкін болмады.</p>}
      {state === "ready" &&
        (rows.length === 0 ? (
          <p className="text-muted">Әзірге ешкім нәтиже қоспаған. Бірінші болыңыз!</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="data-table min-w-[24rem]">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Оқушы</th>
                  <th>Ұпай</th>
                  <th>Күні</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id}>
                    <td>{index + 1}</td>
                    <td>{row.nickname}</td>
                    <td>
                      {row.score} / {row.total}
                    </td>
                    <td>{row.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
}
