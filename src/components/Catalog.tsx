"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { groups } from "@/data/groups";
import { instruments } from "@/data/instruments";
import type { GroupId } from "@/data/types";
import { groupById } from "@/lib/utils";
import { useApp } from "@/providers/AppProvider";
import { InstrumentCard } from "./InstrumentCard";
import { Modal } from "./Modal";
import { cn, kzCompare } from "@/lib/utils";

type SortKey = "name" | "group" | "latin" | "rev";

/** Catalog — аспаптар каталогы: сүзгі, іздеу, реттеу, таңдаулылар және салыстыру */
export function Catalog() {
  const params = useSearchParams();
  const { favorites, notify } = useApp();

  const [group, setGroup] = useState<GroupId | "all">((params.get("top") as GroupId) ?? "all");
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [sort, setSort] = useState<SortKey>("name");
  const [favOnly, setFavOnly] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const list = useMemo(() => {
    let items = instruments.slice();
    if (group !== "all") items = items.filter((i) => i.group === group);
    if (favOnly) items = items.filter((i) => favorites.includes(i.id));
    const q = query.trim().toLowerCase();
    if (q) {
      items = items.filter((i) =>
        [i.name, i.latin, i.short, i.desc, i.usage, i.fact].join(" ").toLowerCase().includes(q),
      );
    }
    if (sort === "name") items.sort((a, b) => kzCompare(a.name, b.name));
    if (sort === "latin") items.sort((a, b) => kzCompare(a.latin, b.latin));
    if (sort === "group") items.sort((a, b) => kzCompare(a.group, b.group));
    if (sort === "rev") items.reverse();
    return items;
  }, [group, query, sort, favOnly, favorites]);

  function toggleCompare(id: string) {
    setCompareIds((ids) => {
      if (ids.includes(id)) return ids.filter((x) => x !== id);
      if (ids.length >= 3) {
        notify("Ең көбі 3 аспапты салыстыруға болады");
        return ids;
      }
      return [...ids, id];
    });
  }

  const compareRows = [
    { label: "Тобы", value: (i: (typeof instruments)[number]) => `${groupById(i.group).icon} ${groupById(i.group).name}` },
    { label: "Латынша", value: (i: (typeof instruments)[number]) => i.latin },
    { label: "Қалай ойналады", value: (i: (typeof instruments)[number]) => i.fact },
    { label: "Үні", value: (i: (typeof instruments)[number]) => i.sound },
    { label: "Қысқаша", value: (i: (typeof instruments)[number]) => i.short },
    { label: "Қолданылуы", value: (i: (typeof instruments)[number]) => i.usage },
  ];

  const selected = compareIds
    .map((id) => instruments.find((i) => i.id === id))
    .filter((i): i is (typeof instruments)[number] => Boolean(i));

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Аспап топтары бойынша сүзгі">
          <button
            type="button"
            className={cn("chip", group === "all" && "chip-active")}
            onClick={() => setGroup("all")}
          >
            Барлығы ({instruments.length})
          </button>
          {groups.map((g) => {
            const count = instruments.filter((i) => i.group === g.id).length;
            return (
              <button
                key={g.id}
                type="button"
                className={cn("chip", group === g.id && "chip-active")}
                onClick={() => setGroup(g.id)}
              >
                {g.icon} {g.name} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[0.88rem] text-muted">
          <label className="flex items-center gap-2">
            🔍 Іздеу:
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="аспап атын жазыңыз..."
              className="rounded-full border border-line bg-surface-2 px-3 py-2 text-[0.88rem] text-ink outline-none focus:border-accent"
            />
          </label>

          <label className="flex items-center gap-2">
            Реттеу:
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="cursor-pointer rounded-full border border-line bg-surface-2 px-3 py-2 text-[0.88rem] text-ink outline-none focus:border-accent"
            >
              <option value="name">Аты бойынша (әліпби)</option>
              <option value="group">Тобы бойынша</option>
              <option value="latin">Латын әліпбиімен</option>
              <option value="rev">Кері ретпен</option>
            </select>
          </label>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={favOnly}
              onChange={(event) => setFavOnly(event.target.checked)}
              className="accent-accent"
            />
            ⭐ Тек таңдаулылар
          </label>

          <button
            type="button"
            className="btn btn-sm btn-ghost"
            disabled={compareIds.length < 2}
            onClick={() => setCompareOpen(true)}
          >
            ⚖️ Салыстыру ({compareIds.length})
          </button>
        </div>
      </div>

      <p className="mb-4 text-[0.88rem] text-muted" aria-live="polite">
        Табылған аспап: {list.length} / {instruments.length}
      </p>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-surface-2 p-10 text-center text-muted">
          <p className="mb-1">Ештеңе табылмады 🤔</p>
          <p className="m-0">Сүзгіні өзгертіп немесе іздеу сөзін өшіріп көріңіз.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((instrument) => (
            <InstrumentCard
              key={instrument.id}
              instrument={instrument}
              compare={{
                checked: compareIds.includes(instrument.id),
                onToggle: () => toggleCompare(instrument.id),
              }}
            />
          ))}
        </div>
      )}

      <Modal open={compareOpen} title="Аспаптарды салыстыру" onClose={() => setCompareOpen(false)}>
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="data-table min-w-[32rem]">
            <thead>
              <tr>
                <th>Белгі</th>
                {selected.map((i) => (
                  <th key={i.id}>
                    {i.emoji} {i.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {selected.map((i) => (
                    <td key={i.id}>{row.value(i)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}
