/**
 * synth.ts — аспап үндерін компьютерде жасап шығаратын қарапайым дыбыс қозғалтқышы.
 *
 * ЕСКЕРТУ: бұл — нақты жазба емес, Web Audio API көмегімен жасалған жуық үлгі (модель).
 * Мақсаты — оқушыға аспап үнінің реңін (шертпелі, ыспалы, үрмелі, ұрмалы) сезінуге көмектесу.
 */

export type SynthGroup = "string" | "bow" | "wind" | "perc" | "noise";

type Phrase = {
  base: number;
  notes: number[];
  step: number;
  dur: number;
  kind: "pluck" | "bowed" | "blow" | "drum" | "metal";
};

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;

function ensure(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor: typeof AudioContext | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) {
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Нота жиілігі: A4 = 440 Гц, offset — жартытон */
function freq(semitone: number, base = 440): number {
  return base * Math.pow(2, semitone / 12);
}

/* --- 1. Шертпелі ішек (домбыра, жетіген, шертер) --- */
function pluck(f: number, start: number, dur: number, vol: number) {
  const c = ensure();
  if (!c || !master) return;
  const n = Math.max(2, Math.round(c.sampleRate / f));
  const buf = c.createBuffer(1, n, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;

  const src = c.createBufferSource();
  src.buffer = buf;
  src.loop = true;

  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(Math.min(6000, f * 9), start);
  lp.frequency.exponentialRampToValueAtTime(Math.max(400, f * 2), start + dur);
  lp.Q.value = 0.7;

  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(vol, start + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);

  src.connect(lp).connect(g).connect(master);
  src.start(start);
  src.stop(start + dur + 0.05);
}

/* --- 2. Ыспалы ішек (қобыз, адырна) --- */
function bowed(f: number, start: number, dur: number, vol: number) {
  const c = ensure();
  if (!c || !master) return;
  const o1 = c.createOscillator();
  o1.type = "sawtooth";
  o1.frequency.value = f;
  const o2 = c.createOscillator();
  o2.type = "triangle";
  o2.frequency.value = f * 1.005;

  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = Math.min(3000, f * 6);

  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(vol, start + 0.16);
  g.gain.setValueAtTime(vol, start + dur * 0.7);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);

  const vib = c.createOscillator();
  vib.frequency.value = 5.2;
  const vibGain = c.createGain();
  vibGain.gain.value = f * 0.008;
  vib.connect(vibGain);
  vibGain.connect(o1.frequency);
  vibGain.connect(o2.frequency);

  o1.connect(lp);
  o2.connect(lp);
  lp.connect(g).connect(master);
  [o1, o2, vib].forEach((o) => {
    o.start(start);
    o.stop(start + dur + 0.05);
  });
}

/* --- 3. Үрмелі (сыбызғы, керней, ұран, мүйізсырнай) --- */
function blow(f: number, start: number, dur: number, vol: number) {
  const c = ensure();
  if (!c || !master) return;
  const o = c.createOscillator();
  o.type = "triangle";
  o.frequency.value = f;
  const o2 = c.createOscillator();
  o2.type = "sine";
  o2.frequency.value = f * 2;

  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = f * 3;
  bp.Q.value = 1.2;

  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(vol, start + 0.09);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);

  const vib = c.createOscillator();
  vib.frequency.value = 4.6;
  const vg = c.createGain();
  vg.gain.value = f * 0.012;
  vib.connect(vg);
  vg.connect(o.frequency);

  o.connect(bp);
  o2.connect(bp);
  bp.connect(g).connect(master);
  [o, o2, vib].forEach((n) => {
    n.start(start);
    n.stop(start + dur + 0.05);
  });
}

/* --- 4. Соқпалы-ұрмалы (дауылпаз, даңғыра, шыңдауыл) --- */
function drum(start: number, dur: number, vol: number) {
  const c = ensure();
  if (!c || !master) return;
  const len = Math.max(1, Math.floor(c.sampleRate * dur));
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);

  const src = c.createBufferSource();
  src.buffer = buf;
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1200;
  const g = c.createGain();
  g.gain.setValueAtTime(vol, start);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  src.connect(lp).connect(g).connect(master);
  src.start(start);
  src.stop(start + dur + 0.02);

  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(150, start);
  o.frequency.exponentialRampToValueAtTime(60, start + Math.min(0.3, dur));
  const og = c.createGain();
  og.gain.setValueAtTime(vol * 0.8, start);
  og.gain.exponentialRampToValueAtTime(0.0001, start + Math.min(0.35, dur));
  o.connect(og).connect(master);
  o.start(start);
  o.stop(start + Math.min(0.4, dur) + 0.02);
}

/* --- 5. Шулы / тілшекті (шаңқобыз, асатаяқ) --- */
function metal(f: number, start: number, dur: number, vol: number) {
  const c = ensure();
  if (!c || !master) return;
  const o = c.createOscillator();
  o.type = "sawtooth";
  o.frequency.value = f;

  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = f * 2.4;
  bp.Q.value = 6;

  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(vol, start + 0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);

  const trem = c.createOscillator();
  trem.type = "sine";
  trem.frequency.value = 9;
  const tg = c.createGain();
  tg.gain.value = vol * 0.6;
  trem.connect(tg);
  tg.connect(g.gain);

  o.connect(bp).connect(g).connect(master);
  o.start(start);
  o.stop(start + dur + 0.05);
  trem.start(start);
  trem.stop(start + dur + 0.05);
}

/** Қазақ музыкасындағы бес дауысты (пентатоника) саздар */
const PHRASES: Record<SynthGroup, Phrase> = {
  string: { base: 293.66, notes: [0, 2, 4, 7, 9, 7, 4, 2, 0], step: 0.34, dur: 0.75, kind: "pluck" },
  bow: { base: 220.0, notes: [0, 3, 5, 7, 5, 3, 0, -2], step: 0.62, dur: 1.0, kind: "bowed" },
  wind: { base: 523.25, notes: [0, 2, 4, 7, 9, 12, 9, 4], step: 0.4, dur: 0.6, kind: "blow" },
  perc: { base: 0, notes: [0, 0, 1, 0, 0, 1, 0, 1], step: 0.26, dur: 0.3, kind: "drum" },
  noise: { base: 660, notes: [0, 0, 5, 5, 7, 7, 3, 0], step: 0.3, dur: 0.5, kind: "metal" },
};

/** Аспапқа қарай үн реңкін өзгертетін түзетулер (жартытон) */
const INSTRUMENT_TUNE: Record<string, number> = {
  dombyra: 0,
  zhetigen: 5,
  sherter: -2,
  kobyz: -3,
  adyrna: -5,
  sybyzgy: 3,
  "muyiz-syrnai": -7,
  uran: -10,
  kernei: -12,
  dauylpaz: 0,
  dangyra: 2,
  shyndauyl: -1,
  asatayaq: 4,
  shankobyz: 6,
};

/** Топқа (және аспапқа) сәйкес қысқа әуен ойнайды. Ойнау ұзақтығын миллисекундпен қайтарады. */
export function playGroup(group: SynthGroup, instrumentId?: string): number {
  const c = ensure();
  if (!c || muted) return 0;
  const p = PHRASES[group] ?? PHRASES.string;
  const shift = (instrumentId && INSTRUMENT_TUNE[instrumentId]) || 0;
  const t0 = c.currentTime + 0.06;
  let total = 0;

  p.notes.forEach((n, i) => {
    const start = t0 + i * p.step;
    const dur = p.dur * (group === "bow" ? 0.85 : 1);
    switch (p.kind) {
      case "drum":
        drum(start, 0.32, n === 1 ? 0.55 : 0.34);
        break;
      case "metal":
        metal(freq(n + shift, p.base), start, dur, 0.3);
        break;
      case "bowed":
        bowed(freq(n + shift, p.base), start, dur, 0.38);
        break;
      case "blow":
        blow(freq(n + shift, p.base), start, dur, 0.38);
        break;
      default:
        pluck(freq(n + shift, p.base), start, dur, 0.5);
    }
    total = Math.max(total, i * p.step + dur);
  });
  return total * 1000;
}

/** Бір нота шығару (аспап бетіндегі дыбыс пернелері үшін) */
export function playNote(group: SynthGroup, semitone: number, seconds = 0.8) {
  const c = ensure();
  if (!c || muted) return;
  const p = PHRASES[group] ?? PHRASES.string;
  const t = c.currentTime + 0.02;
  switch (p.kind) {
    case "drum":
      drum(t, 0.3, 0.55);
      return;
    case "metal":
      metal(freq(semitone, 660), t, seconds, 0.3);
      return;
    case "bowed":
      bowed(freq(semitone, p.base), t, seconds, 0.45);
      return;
    case "blow":
      blow(freq(semitone, p.base), t, seconds, 0.45);
      return;
    default:
      pluck(freq(semitone, p.base), t, seconds, 0.45);
  }
}

export function setMuted(value: boolean) {
  muted = value;
  const c = ensure();
  if (c && master) master.gain.value = value ? 0 : 0.5;
}

export function isMuted() {
  return muted;
}

export function isSupported() {
  if (typeof window === "undefined") return false;
  return Boolean(window.AudioContext ?? (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext);
}
