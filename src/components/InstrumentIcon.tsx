import Image from "next/image";
import { instruments } from "@/data/instruments";
import type { GroupId, Instrument } from "@/data/types";
import { cn } from "@/lib/utils";

const GROUP_INSTRUMENT: Record<GroupId, string> = {
  string: "dombyra",
  bow: "kobyz",
  wind: "sybyzgy",
  perc: "dauylpaz",
  noise: "shankobyz",
};

/** Нақты аспап суретін интерфейске арналған біркелкі шағын белгіге айналдырады. */
export function InstrumentIcon({
  instrument,
  className,
}: {
  instrument: Pick<Instrument, "name" | "img">;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-block h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-line bg-white align-middle shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      <Image src={instrument.img} alt="" fill sizes="64px" className="object-contain p-0.5" />
    </span>
  );
}

/** Аспап тобының белгісі ретінде сол топтағы ең танымал аспапты көрсетеді. */
export function GroupIcon({ groupId, className }: { groupId: GroupId; className?: string }) {
  const instrument = instruments.find((item) => item.id === GROUP_INSTRUMENT[groupId]) ?? instruments[0];
  return <InstrumentIcon instrument={instrument} className={className} />;
}
