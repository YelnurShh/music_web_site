/* ==========================================================================
   synth.js — аспаптар үнін компьютерде жасап шығаратын қарапайым дыбыс қозғалтқышы
   ЕСКЕРТУ: бұл — нақты жазба емес, компьютер жасаған жуық үлгі (модель).
   Ол оқушыға аспап үнінің реңін (жіңішке/қоңыр, шертпелі/ыспалы) сезінуге көмектеседі.
   ========================================================================== */

var KZ = (window.KZ = window.KZ || {});

KZ.Synth = (function () {
  let ctx = null;
  let master = null;
  let muted = false;

  function ensure() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  /* Нота жиілігі: A4 = 440 Гц, offset — жартытон */
  function freq(offset, base) {
    return (base || 440) * Math.pow(2, offset / 12);
  }

  /* --- 1. Шертпелі ішек (домбыра, жетіген, шертер) --- */
  function pluck(f, start, dur, vol) {
    const c = ensure(); if (!c) return;
    const sr = c.sampleRate;
    const N = Math.max(2, Math.round(sr / f));
    const buf = c.createBuffer(1, N, sr);
    const data = buf.getChannelData(0);
    for (let i = 0; i < N; i++) data[i] = Math.random() * 2 - 1;

    const src = c.createBufferSource();
    src.buffer = buf; src.loop = true;

    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(Math.min(6000, f * 9), start);
    lp.frequency.exponentialRampToValueAtTime(Math.max(400, f * 2), start + dur);
    lp.Q.value = 0.7;

    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol || 0.5, start + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);

    src.connect(lp); lp.connect(g); g.connect(master);
    src.start(start); src.stop(start + dur + 0.05);
  }

  /* --- 2. Ыспалы ішек (қобыз, адырна) --- */
  function bowed(f, start, dur, vol) {
    const c = ensure(); if (!c) return;
    const o1 = c.createOscillator(); o1.type = "sawtooth"; o1.frequency.value = f;
    const o2 = c.createOscillator(); o2.type = "triangle"; o2.frequency.value = f * 1.005;
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = Math.min(3000, f * 6);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime((vol || 0.35), start + 0.16);
    g.gain.setValueAtTime((vol || 0.35), start + dur * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);

    const vib = c.createOscillator(); vib.frequency.value = 5.2;
    const vibGain = c.createGain(); vibGain.gain.value = f * 0.008;
    vib.connect(vibGain); vibGain.connect(o1.frequency); vibGain.connect(o2.frequency);

    o1.connect(lp); o2.connect(lp); lp.connect(g); g.connect(master);
    o1.start(start); o2.start(start); vib.start(start);
    o1.stop(start + dur + 0.05); o2.stop(start + dur + 0.05); vib.stop(start + dur + 0.05);
  }

  /* --- 3. Үрмелі (сыбызғы, керней, ұран, мүйізсырнай) --- */
  function blow(f, start, dur, vol) {
    const c = ensure(); if (!c) return;
    const o = c.createOscillator(); o.type = "triangle"; o.frequency.value = f;
    const o2 = c.createOscillator(); o2.type = "sine"; o2.frequency.value = f * 2;
    const bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = f * 3; bp.Q.value = 1.2;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime((vol || 0.4), start + 0.09);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);

    const vib = c.createOscillator(); vib.frequency.value = 4.6;
    const vg = c.createGain(); vg.gain.value = f * 0.012;
    vib.connect(vg); vg.connect(o.frequency);

    o.connect(bp); o2.connect(bp); bp.connect(g); g.connect(master);
    o.start(start); o2.start(start); vib.start(start);
    o.stop(start + dur + 0.05); o2.stop(start + dur + 0.05); vib.stop(start + dur + 0.05);
  }

  /* --- 4. Соқпалы-ұрмалы (дауылпаз, даңғыра, шыңдауыл) --- */
  function drum(start, dur, vol) {
    const c = ensure(); if (!c) return;
    const sr = c.sampleRate;
    const len = Math.max(1, Math.floor(sr * dur));
    const buf = c.createBuffer(1, len, sr);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
    const src = c.createBufferSource(); src.buffer = buf;
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1200;
    const g = c.createGain();
    g.gain.setValueAtTime((vol || 0.6), start);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    src.connect(lp); lp.connect(g); g.connect(master);
    src.start(start); src.stop(start + dur + 0.02);

    const o = c.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(150, start);
    o.frequency.exponentialRampToValueAtTime(60, start + Math.min(0.3, dur));
    const og = c.createGain();
    og.gain.setValueAtTime((vol || 0.6) * 0.8, start);
    og.gain.exponentialRampToValueAtTime(0.0001, start + Math.min(0.35, dur));
    o.connect(og); og.connect(master);
    o.start(start); o.stop(start + Math.min(0.4, dur) + 0.02);
  }

  /* --- 5. Шулы / тілшекті (шаңқобыз, асатаяқ) --- */
  function metallic(f, start, dur, vol) {
    const c = ensure(); if (!c) return;
    const o = c.createOscillator(); o.type = "sawtooth"; o.frequency.value = f;
    const bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = f * 2.4; bp.Q.value = 6;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime((vol || 0.3), start + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    const trem = c.createOscillator(); trem.type = "sine"; trem.frequency.value = 9;
    const tg = c.createGain(); tg.gain.value = (vol || 0.3) * 0.6;
    trem.connect(tg); tg.connect(g.gain);
    o.connect(bp); bp.connect(g); g.connect(master);
    o.start(start); o.stop(start + dur + 0.05); trem.start(start); trem.stop(start + dur + 0.05);
  }

  /* --- Әуендер: қазақ музыкасындағы бес дауысты (пентатоника) саз --- */
  const PHRASES = {
    string: { base: 293.66, notes: [0, 2, 4, 7, 9, 7, 4, 2, 0], step: 0.34, dur: 0.75, fn: pluck },
    bow: { base: 220.0, notes: [0, 3, 5, 7, 5, 3, 0, -2], step: 0.62, dur: 1.0, fn: bowed },
    wind: { base: 523.25, notes: [0, 2, 4, 7, 9, 12, 9, 4], step: 0.4, dur: 0.6, fn: blow },
    perc: { base: 0, notes: [0, 0, 1, 0, 0, 1, 0, 1, 0, 0], step: 0.26, dur: 0.3, fn: null },
    noise: { base: 660, notes: [0, 0, 5, 5, 7, 7, 3, 0], step: 0.3, dur: 0.5, fn: metallic }
  };

  /* Аспап тобына қарай қысқа әуен орындайды */
  function playGroup(group, instrumentId) {
    const c = ensure(); if (!c || muted) return 0;
    const p = PHRASES[group] || PHRASES.string;
    const t0 = c.currentTime + 0.06;

    /* Аспапқа қарай реңк өзгертеді */
    const tune = {
      dombyra: 0, zhetigen: 5, sherter: -2, kobyz: -3, adyrna: -5,
      sybyzgy: 3, "muyiz-syrnai": -7, uran: -10, kernei: -12,
      dauylpaz: 0, dangyra: 2, shyndauyl: -1, asatayaq: 4, shankobyz: 6
    };
    const shift = tune[instrumentId] || 0;
    const base = p.base ? freq(shift, p.base) : 0;

    let total = 0;
    p.notes.forEach(function (n, i) {
      const start = t0 + i * p.step;
      const dur = p.dur * (group === "bow" ? 0.85 : 1);
      if (group === "perc") {
        const swing = (n === 1) ? 1.0 : 0.62;
        drum(start, 0.32, 0.55 * swing);
      } else {
        p.fn(freq(n + shift, p.base), start, dur, group === "string" ? 0.5 : 0.38);
      }
      total = Math.max(total, i * p.step + dur);
    });
    return total * 1000;
  }

  /* Бір нота шығару (пернетақта батырмалары үшін) */
  function playNote(group, semitone, seconds) {
    ensure(); if (!ctx || muted) return;
    const g = group || "string";
    const p = PHRASES[g] || PHRASES.string;
    const t = ctx.currentTime + 0.02;
    if (g === "perc") return drum(t, 0.3, 0.55);
    if (g === "noise") return metallic(freq(semitone, 660), t, seconds || 0.6, 0.3);
    const fn = g === "string" ? pluck : (g === "bow" ? bowed : blow);
    fn(freq(semitone, p.base), t, seconds || 0.8, 0.45);
  }

  function setMuted(v) {
    muted = !!v;
    if (master) master.gain.value = muted ? 0 : 0.5;
  }
  function isMuted() { return muted; }
  function supported() {
    return !!(window.AudioContext || window.webkitAudioContext);
  }

  return { playGroup, playNote, setMuted, isMuted, supported, ensure };
})();
