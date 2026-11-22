#!/usr/bin/env node
/**
 * Artisanal Organic Motion Audio Engine (Pure Node.js ESM DSP - Zero Dependencies)
 * Menghasilkan 7 file RIFF WAV valid (PCM 16-bit Stereo 44.1 kHz, peak -3 dBFS) ke public/audio/.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const VIDEO_SECONDS = 30;
const BGM_HEADROOM = 2;
const SR = 44100;
const TARGET_PEAK = Math.pow(10, -3.0 / 20);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "..", "public", "audio");
fs.mkdirSync(OUT_DIR, { recursive: true });

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

class Biquad {
  constructor(type, freq, q = 0.707) {
    this.type = type;
    this.x1 = 0; this.x2 = 0; this.y1 = 0; this.y2 = 0;
    this.set(freq, q);
  }
  set(freq, q = 0.707) {
    const f = Math.max(20, Math.min(SR * 0.45, freq));
    const w0 = (2 * Math.PI * f) / SR;
    const cosW = Math.cos(w0);
    const sinW = Math.sin(w0);
    const alpha = sinW / (2 * Math.max(0.1, q));
    let b0, b1, b2, a0, a1, a2;
    if (this.type === "lowpass") {
      b0 = (1 - cosW) / 2; b1 = 1 - cosW; b2 = (1 - cosW) / 2;
      a0 = 1 + alpha; a1 = -2 * cosW; a2 = 1 - alpha;
    } else if (this.type === "highpass") {
      b0 = (1 + cosW) / 2; b1 = -(1 + cosW); b2 = (1 + cosW) / 2;
      a0 = 1 + alpha; a1 = -2 * cosW; a2 = 1 - alpha;
    } else {
      b0 = alpha; b1 = 0; b2 = -alpha;
      a0 = 1 + alpha; a1 = -2 * cosW; a2 = 1 - alpha;
    }
    this.b0 = b0 / a0; this.b1 = b1 / a0; this.b2 = b2 / a0;
    this.a1 = a1 / a0; this.a2 = a2 / a0;
  }
  process(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1; this.x1 = x; this.y2 = this.y1; this.y1 = y;
    return y;
  }
}

function applyReverb(left, right, wet = 0.25, feedback = 0.58) {
  const n = left.length;
  const run = (inp, combD, apD) => {
    const combs = combD.map((d) => ({ buf: new Float64Array(d), idx: 0, lp: 0 }));
    const aps = apD.map((d) => ({ buf: new Float64Array(d), idx: 0 }));
    const out = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const x = inp[i];
      let sum = 0;
      for (let c = 0; c < combs.length; c++) {
        const cb = combs[c];
        const del = cb.buf[cb.idx];
        cb.lp = del * 0.72 + cb.lp * 0.28;
        cb.buf[cb.idx] = x + cb.lp * feedback;
        cb.idx = (cb.idx + 1) % cb.buf.length;
        sum += del;
      }
      let y = sum * 0.25;
      for (let a = 0; a < aps.length; a++) {
        const ap = aps[a];
        const del = ap.buf[ap.idx];
        const v = y - 0.5 * del;
        ap.buf[ap.idx] = v;
        ap.idx = (ap.idx + 1) % ap.buf.length;
        y = del + 0.5 * v;
      }
      out[i] = x * (1 - wet) + y * wet;
    }
    return out;
  };
  return [
    run(left, [1523, 1667, 1831, 1997], [233, 557]),
    run(right, [1549, 1693, 1861, 2029], [257, 577]),
  ];
}

function finalize(left, right, peakTarget = TARGET_PEAK) {
  const n = left.length;
  const mf = Math.min(Math.floor(0.004 * SR), Math.floor(n / 4));
  for (let i = 0; i < mf; i++) {
    const g = i / mf;
    left[i] *= g; right[i] *= g;
    left[n - 1 - i] *= g; right[n - 1 - i] *= g;
  }
  for (let i = 0; i < n; i++) {
    left[i] = Math.tanh(left[i]);
    right[i] = Math.tanh(right[i]);
  }
  let peak = 0;
  for (let i = 0; i < n; i++) {
    const a = Math.abs(left[i]);
    const b = Math.abs(right[i]);
    if (a > peak) peak = a;
    if (b > peak) peak = b;
  }
  if (peak > 1e-9) {
    const g = peakTarget / peak;
    for (let i = 0; i < n; i++) {
      left[i] *= g; right[i] *= g;
    }
  }
}

function writeWav(name, left, right) {
  const n = left.length;
  const dataSize = n * 4;
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(2, 22);
  header.writeUInt32LE(SR, 24);
  header.writeUInt32LE(SR * 4, 28);
  header.writeUInt16LE(4, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  const pcm = Buffer.alloc(dataSize);
  for (let i = 0; i < n; i++) {
    pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, left[i])) * 32767), i * 4);
    pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, right[i])) * 32767), i * 4 + 2);
  }
  const fullPath = path.join(OUT_DIR, name);
  fs.writeFileSync(fullPath, Buffer.concat([header, pcm]));
  return fullPath;
}

function midiHz(m) {
  return 440 * Math.pow(2, (m - 69) / 12);
}

function addFeltPiano(left, right, start, durSec, freq, amp, pan, rng) {
  const len = Math.min(Math.floor(durSec * SR), left.length - start);
  if (len <= 0 || start < 0) return;
  const atk = Math.floor(0.016 * SR);
  const gL = Math.cos(((pan + 1) * Math.PI) / 4) * amp;
  const gR = Math.sin(((pan + 1) * Math.PI) / 4) * amp;
  const lpf = new Biquad("lowpass", 1250, 0.72);
  const w1 = (2 * Math.PI * freq) / SR;
  const w2 = (2 * Math.PI * freq * 2.001) / SR;
  const w3 = (2 * Math.PI * freq * 3.002) / SR;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const eAtk = i < atk ? 1 - Math.exp((-5.2 * i) / atk) : 1;
    const eDec = Math.exp((-1.35 / Math.max(0.4, durSec)) * t);
    const tail = i > len - 380 ? (len - i) / 380 : 1;
    const hammer = (rng() * 2 - 1) * 0.025 * Math.exp(-t / 0.01);
    const raw =
      Math.sin(w1 * i) * 0.74 +
      Math.sin(w2 * i) * 0.19 * Math.exp(-2.8 * t) +
      Math.sin(w3 * i) * 0.07 * Math.exp(-5.0 * t) +
      hammer;
    const s = lpf.process(raw) * eAtk * eDec * tail;
    left[start + i] += s * gL;
    right[start + i] += s * gR;
  }
}

function addKalimba(left, right, start, freq, amp, pan) {
  const len = Math.min(Math.floor(0.42 * SR), left.length - start);
  if (len <= 0 || start < 0) return;
  const atk = Math.floor(0.004 * SR);
  const gL = Math.cos(((pan + 1) * Math.PI) / 4) * amp;
  const gR = Math.sin(((pan + 1) * Math.PI) / 4) * amp;
  const w1 = (2 * Math.PI * freq) / SR;
  const w3 = (2 * Math.PI * freq * 2.98) / SR;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const eAtk = i < atk ? i / atk : 1;
    const env = Math.exp(-8.2 * t);
    const s = (Math.sin(w1 * i) * 0.86 + Math.sin(w3 * i) * 0.14 * Math.exp(-24 * t)) * eAtk * env;
    left[start + i] += s * gL;
    right[start + i] += s * gR;
  }
}

function addWarmPulse(left, right, start, amp) {
  const len = Math.min(Math.floor(0.14 * SR), left.length - start);
  if (len <= 0 || start < 0) return;
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const freq = 48 + 68 * Math.exp(-t / 0.018);
    ph += (2 * Math.PI * freq) / SR;
    const s = Math.sin(ph) * Math.exp(-t / 0.04) * amp;
    left[start + i] += s;
    right[start + i] += s;
  }
}

// 1. bgm-story.wav
function genBgm() {
  const durSec = VIDEO_SECONDS + BGM_HEADROOM;
  const total = Math.round(durSec * SR);
  const left = new Float64Array(total);
  const right = new Float64Array(total);
  const rng = mulberry32(20269001);

  const beat = 60 / 102;
  const barBeats = 8;
  const chords = [
    { notes: [50, 57, 60, 64, 65], arp: [69, 72, 74, 72, 69, 65, 64, 65] },
    { notes: [46, 53, 57, 60, 62], arp: [69, 70, 74, 70, 69, 65, 62, 65] },
    { notes: [53, 57, 60, 64, 67], arp: [69, 72, 76, 72, 69, 67, 64, 67] },
    { notes: [48, 55, 57, 62, 64], arp: [67, 72, 74, 72, 67, 64, 62, 64] },
  ];

  const bars = Math.ceil(VIDEO_SECONDS / (barBeats * beat));
  for (let b = 0; b < bars; b++) {
    const ch = chords[b % chords.length];
    const barStart = b * barBeats * beat;
    if (barStart >= VIDEO_SECONDS - 1.4) break;
    const st = Math.floor(barStart * SR);
    const dur = Math.min(barBeats * beat * 0.98, VIDEO_SECONDS - barStart);

    ch.notes.forEach((m, idx) => {
      const pan = -0.35 + (idx / Math.max(1, ch.notes.length - 1)) * 0.70;
      addFeltPiano(left, right, st + Math.floor(idx * 0.028 * SR), dur, midiHz(m), 0.24, pan, rng);
    });

    const isRestless = barStart < 11.8;
    const isEnding = barStart >= 24.4;
    for (let step = 0; step < 8; step++) {
      const ts = barStart + step * beat;
      if (ts >= VIDEO_SECONDS - 2.4) break;
      const idx = Math.floor(ts * SR);
      if (isRestless && step % 2 === 0) {
        addWarmPulse(left, right, idx, 0.15);
      }
      if (!isEnding && step !== 3 && step !== 7) {
        addKalimba(left, right, idx, midiHz(ch.arp[step]), isRestless ? 0.10 : 0.14, step % 2 === 0 ? -0.32 : 0.32);
      }
    }
  }

  const hpL = new Biquad("highpass", 34, 0.707);
  const hpR = new Biquad("highpass", 34, 0.707);
  for (let i = 0; i < total; i++) {
    left[i] = hpL.process(left[i]);
    right[i] = hpR.process(right[i]);
  }
  const [rl, rr] = applyReverb(left, right, 0.26, 0.56);

  const fi = Math.floor(0.7 * SR);
  const foStart = Math.floor((VIDEO_SECONDS - 2.5) * SR);
  const foEnd = Math.floor(VIDEO_SECONDS * SR);
  const foLen = foEnd - foStart;
  for (let i = 0; i < fi; i++) { const g = (i / fi) * (i / fi); rl[i] *= g; rr[i] *= g; }
  for (let i = foStart; i < total; i++) {
    if (i < foEnd) {
      const g = Math.pow(1 - (i - foStart) / foLen, 2.4);
      rl[i] *= g; rr[i] *= g;
    } else {
      rl[i] = 0; rr[i] = 0;
    }
  }
  finalize(rl, rr);
  return { name: "bgm-story.wav", targetSec: durSec, path: writeWav("bgm-story.wav", rl, rr) };
}

// 2. sfx-glide.wav (0.42s: silky smooth camera air-glide)
function genGlide() {
  const durSec = 0.42;
  const n = Math.round(durSec * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  const rng = mulberry32(20269002);
  const bpL = new Biquad("bandpass", 480, 1.25);
  const bpR = new Biquad("bandpass", 510, 1.25);
  let brown = 0;
  for (let i = 0; i < n; i++) {
    const u = i / n;
    const w = rng() * 2 - 1;
    brown = (brown + 0.06 * w) / 1.06;
    const fc = 280 + 1850 * Math.pow(Math.sin(u * Math.PI), 1.3);
    bpL.set(fc, 1.25); bpR.set(fc * 1.05, 1.25);
    const env = Math.sin(u * Math.PI) * Math.pow(1 - u, 0.35);
    const pan = -0.4 + u * 0.8;
    l[i] = bpL.process(brown * 2.2 + w * 0.24) * env * Math.cos(((pan + 1) * Math.PI) / 4);
    r[i] = bpR.process(brown * 2.2 + w * 0.24) * env * Math.sin(((pan + 1) * Math.PI) / 4);
  }
  finalize(l, r);
  return { name: "sfx-glide.wav", targetSec: durSec, path: writeWav("sfx-glide.wav", l, r) };
}

// 3. sfx-portal.wav (0.56s: luminous morning aperture opening)
function genPortal() {
  const durSec = 0.56;
  const n = Math.round(durSec * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  const rng = mulberry32(20269003);
  const bp = new Biquad("bandpass", 420, 1.15);
  let brown = 0;
  for (let i = 0; i < n; i++) {
    const u = i / n;
    const t = i / SR;
    const w = rng() * 2 - 1;
    brown = (brown + 0.05 * w) / 1.05;
    bp.set(260 + 1700 * Math.sin(u * Math.PI), 1.15);
    const env = Math.sin(u * Math.PI);
    const chime = Math.sin(2 * Math.PI * midiHz(76) * t) * 0.14 * Math.exp(-5.0 * t);
    const s = bp.process(brown * 2.3 + w * 0.18) * env * 0.78 + chime;
    l[i] = s; r[i] = s * 0.96;
  }
  const [rl, rr] = applyReverb(l, r, 0.26, 0.48);
  finalize(rl, rr);
  return { name: "sfx-portal.wav", targetSec: durSec, path: writeWav("sfx-portal.wav", rl, rr) };
}

// 4. sfx-pop.wav (0.14s: soft droplet pop)
function genPop() {
  const durSec = 0.14;
  const n = Math.round(durSec * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const atk = i < 110 ? i / 110 : 1;
    const env = Math.exp(-t / 0.032);
    const f = 430 + 460 * (1 - Math.exp(-t / 0.022));
    ph += (2 * Math.PI * f) / SR;
    const s = (Math.sin(ph) * 0.85 + Math.sin(ph * 2) * 0.15 * Math.exp(-t / 0.012)) * atk * env;
    l[i] = s; r[i] = s * 0.96;
  }
  finalize(l, r);
  return { name: "sfx-pop.wav", targetSec: durSec, path: writeWav("sfx-pop.wav", l, r) };
}

// 5. sfx-tick.wav (0.09s: subtle pulse tick)
function genTick() {
  const durSec = 0.09;
  const n = Math.round(durSec * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  const rng = mulberry32(20269005);
  const lpf = new Biquad("lowpass", 1450, 0.8);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const s = lpf.process(Math.sin(2 * Math.PI * 180 * t) * Math.exp(-t / 0.011) * 0.74 + (rng() * 2 - 1) * Math.exp(-t / 0.003) * 0.24);
    l[i] = s; r[i] = s * 0.98;
  }
  finalize(l, r);
  return { name: "sfx-tick.wav", targetSec: durSec, path: writeWav("sfx-tick.wav", l, r) };
}

// 6. sfx-complete.wav (0.88s: warm resonant harmonic bloom when ring reaches 100%)
function genComplete() {
  const durSec = 0.88;
  const n = Math.round(durSec * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  [69, 72, 76, 81].forEach((m, idx) => {
    addKalimba(l, r, Math.floor(idx * 0.05 * SR), midiHz(m), 0.45, -0.35 + idx * 0.24);
  });
  const [rl, rr] = applyReverb(l, r, 0.30, 0.54);
  finalize(rl, rr);
  return { name: "sfx-complete.wav", targetSec: durSec, path: writeWav("sfx-complete.wav", rl, rr) };
}

// 7. sfx-resolve.wav (2.60s: warm sunlit Fmaj9 closure chord)
function genResolve() {
  const durSec = 2.60;
  const n = Math.round(durSec * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  const rng = mulberry32(20269007);
  [53, 60, 64, 67, 69, 76].forEach((m, idx) => {
    addFeltPiano(l, r, Math.floor(idx * 0.036 * SR), 2.1, midiHz(m), 0.28, -0.38 + idx * 0.15, rng);
  });
  const [rl, rr] = applyReverb(l, r, 0.32, 0.58);
  const sil = Math.floor((durSec - 0.20) * SR);
  const fsStart = Math.floor((durSec - 0.85) * SR);
  const fLen = sil - fsStart;
  for (let i = fsStart; i < n; i++) {
    if (i < sil) {
      const g = Math.pow(1 - (i - fsStart) / fLen, 2.4);
      rl[i] *= g; rr[i] *= g;
    } else {
      rl[i] = 0; rr[i] = 0;
    }
  }
  finalize(rl, rr);
  for (let i = sil; i < n; i++) { rl[i] = 0; rr[i] = 0; }
  return { name: "sfx-resolve.wav", targetSec: durSec, path: writeWav("sfx-resolve.wav", rl, rr) };
}

function validate(entry) {
  const buf = fs.readFileSync(entry.path);
  if (buf.length < 44 || buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WAVE") {
    throw new Error(`${entry.name}: header WAV invalid`);
  }
  const ch = buf.readUInt16LE(22);
  const rate = buf.readUInt32LE(24);
  const bits = buf.readUInt16LE(34);
  const dataBytes = buf.readUInt32LE(40);
  if (ch !== 2 || rate !== SR || bits !== 16) throw new Error(`${entry.name}: format mismatch`);
  const sec = dataBytes / 4 / SR;
  if (Math.abs(sec - entry.targetSec) > 0.02) throw new Error(`${entry.name}: durasi ${sec}s != ${entry.targetSec}s`);
  let peak = 0, sumSq = 0;
  const total = dataBytes / 2;
  for (let i = 0; i < total; i++) {
    const v = buf.readInt16LE(44 + i * 2) / 32768;
    if (!Number.isFinite(v)) throw new Error(`${entry.name}: NaN`);
    const a = Math.abs(v);
    if (a > peak) peak = a;
    sumSq += v * v;
  }
  const peakDb = peak > 0 ? 20 * Math.log10(peak) : -120;
  const rmsDb = sumSq > 0 ? 20 * Math.log10(Math.sqrt(sumSq / total)) : -120;
  if (peakDb > -1.0) throw new Error(`${entry.name}: peak ${peakDb.toFixed(2)} dBFS > -1 dBFS`);
  return { name: entry.name, sec, peakDb, rmsDb };
}

const out = [genBgm(), genGlide(), genPortal(), genPop(), genTick(), genComplete(), genResolve()];
console.log("----------------------------------------------------------------");
console.log("File                        | Durasi | Peak dBFS | RMS dBFS");
console.log("----------------------------------------------------------------");
try {
  for (const item of out) {
    const v = validate(item);
    console.log(`${v.name.padEnd(27)} | ${v.sec.toFixed(2)}s  | ${v.peakDb.toFixed(2).padStart(7)} dB | ${v.rmsDb.toFixed(2).padStart(7)} dB`);
  }
  console.log("----------------------------------------------------------------");
  console.log("Semua 7 file WAV Organic Sound Design LULUS validasi.");
} catch (err) {
  console.error("AUDIO VALIDATION FAILED:", err instanceof Error ? err.message : String(err));
  process.exit(1);
}
