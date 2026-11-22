#!/usr/bin/env node
/**
 * Kinetic Morph & Botanical Calm Audio Engine (Pure Node.js ESM DSP)
 * Zero external dependencies. Deterministic mulberry32 PRNG.
 * Menghasilkan 7 file RIFF WAV valid (PCM 16-bit Stereo 44.1 kHz, peak -3 dBFS) ke public/audio/.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const VIDEO_SECONDS = 30;
const BGM_HEADROOM = 2;
const SR = 44100;
const TARGET_PEAK = Math.pow(10, -3.0 / 20); // -3.0 dBFS

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

function applyReverb(left, right, wet = 0.22, feedback = 0.56) {
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
    run(left, [1493, 1637, 1789, 1951], [229, 547]),
    run(right, [1511, 1663, 1811, 1979], [251, 569]),
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
      left[i] *= g;
      right[i] *= g;
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

function addWarmChordTone(left, right, start, durSec, freq, amp, pan) {
  const len = Math.min(Math.floor(durSec * SR), left.length - start);
  if (len <= 0 || start < 0) return;
  const atk = Math.floor(0.018 * SR);
  const gL = Math.cos(((pan + 1) * Math.PI) / 4) * amp;
  const gR = Math.sin(((pan + 1) * Math.PI) / 4) * amp;
  const lpf = new Biquad("lowpass", 1320, 0.72);
  const w1 = (2 * Math.PI * freq) / SR;
  const w2 = (2 * Math.PI * freq * 2.0012) / SR;
  const w3 = (2 * Math.PI * freq * 3.002) / SR;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const eAtk = i < atk ? 1 - Math.exp((-5 * i) / atk) : 1;
    const eDec = Math.exp((-1.35 / Math.max(0.4, durSec)) * t);
    const tail = i > len - 360 ? (len - i) / 360 : 1;
    const raw =
      Math.sin(w1 * i) * 0.72 +
      Math.sin(w2 * i) * 0.21 * Math.exp(-2.8 * t) +
      Math.sin(w3 * i) * 0.07 * Math.exp(-5.0 * t);
    const s = lpf.process(raw) * eAtk * eDec * tail;
    left[start + i] += s * gL;
    right[start + i] += s * gR;
  }
}

function addPluck(left, right, start, freq, amp, pan) {
  const len = Math.min(Math.floor(0.32 * SR), left.length - start);
  if (len <= 0 || start < 0) return;
  const atk = Math.floor(0.003 * SR);
  const gL = Math.cos(((pan + 1) * Math.PI) / 4) * amp;
  const gR = Math.sin(((pan + 1) * Math.PI) / 4) * amp;
  const lpf = new Biquad("lowpass", 2200, 0.85);
  const w1 = (2 * Math.PI * freq) / SR;
  const w2 = (2 * Math.PI * freq * 2.0) / SR;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const eAtk = i < atk ? i / atk : 1;
    const env = Math.exp(-11.5 * t);
    const s = lpf.process(Math.sin(w1 * i) * 0.82 + Math.sin(w2 * i) * 0.18 * Math.exp(-18 * t)) * eAtk * env;
    left[start + i] += s * gL;
    right[start + i] += s * gR;
  }
}

function addPulseKick(left, right, start, amp) {
  const len = Math.min(Math.floor(0.14 * SR), left.length - start);
  if (len <= 0 || start < 0) return;
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const freq = 46 + 78 * Math.exp(-t / 0.018);
    ph += (2 * Math.PI * freq) / SR;
    const env = Math.exp(-t / 0.042);
    const s = Math.sin(ph) * env * amp;
    left[start + i] += s;
    right[start + i] += s;
  }
}

function addShakerTick(left, right, start, amp, pan, rng) {
  const len = Math.min(Math.floor(0.045 * SR), left.length - start);
  if (len <= 0 || start < 0) return;
  const hp = new Biquad("highpass", 6500, 0.8);
  const gL = Math.cos(((pan + 1) * Math.PI) / 4) * amp;
  const gR = Math.sin(((pan + 1) * Math.PI) / 4) * amp;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const env = Math.exp(-t / 0.011);
    const s = hp.process(rng() * 2 - 1) * env;
    left[start + i] += s * gL;
    right[start + i] += s * gR;
  }
}

// 1. bgm-kinetic-calm.wav (32s @ 112 BPM — modern SaaS kinetic groove that softens into botanical calm)
function genBgm() {
  const durSec = VIDEO_SECONDS + BGM_HEADROOM;
  const total = Math.round(durSec * SR);
  const left = new Float64Array(total);
  const right = new Float64Array(total);
  const rng = mulberry32(20265001);

  const beat = 60 / 112; // ~0.5357s
  const barBeats = 8;    // ~4.285s per chord
  const chords = [
    { notes: [53, 57, 60, 64, 67], arp: [69, 72, 76, 72, 69, 67, 64, 67] }, // Fmaj9
    { notes: [50, 57, 60, 64, 65], arp: [69, 72, 74, 72, 69, 65, 64, 65] }, // Dm9
    { notes: [46, 53, 57, 62, 65], arp: [69, 70, 74, 70, 69, 65, 62, 65] }, // Bbmaj7
    { notes: [48, 55, 57, 62, 64], arp: [67, 72, 74, 72, 67, 64, 62, 64] }, // C6/9
  ];

  const bars = Math.ceil(VIDEO_SECONDS / (barBeats * beat));
  for (let b = 0; b < bars; b++) {
    const ch = chords[b % chords.length];
    const barStart = b * barBeats * beat;
    if (barStart >= VIDEO_SECONDS - 1.5) break;
    const st = Math.floor(barStart * SR);
    const dur = Math.min(barBeats * beat * 0.96, VIDEO_SECONDS - barStart);

    ch.notes.forEach((m, idx) => {
      const pan = -0.35 + (idx / Math.max(1, ch.notes.length - 1)) * 0.70;
      addWarmChordTone(left, right, st + Math.floor(idx * 0.025 * SR), dur, midiHz(m), 0.22, pan);
    });

    // Kinetic subtle pulse & plucks active during Act 1-4 (0..25s), softening in Act 5
    const energy = barStart < 23.5 ? 1.0 : 0.35;
    for (let step = 0; step < 8; step++) {
      const tStep = barStart + step * beat;
      if (tStep >= VIDEO_SECONDS - 2.2) break;
      const sIdx = Math.floor(tStep * SR);
      if (step % 2 === 0 && energy > 0.5) {
        addPulseKick(left, right, sIdx, 0.20 * energy);
      }
      if (step % 2 === 1 && energy > 0.5) {
        addShakerTick(left, right, sIdx, 0.065 * energy, step % 4 === 1 ? -0.3 : 0.3, rng);
      }
      if (step !== 3 && step !== 7) {
        addPluck(left, right, sIdx, midiHz(ch.arp[step]), 0.14 * energy, step % 2 === 0 ? -0.32 : 0.32);
      }
    }
  }

  const hpL = new Biquad("highpass", 34, 0.707);
  const hpR = new Biquad("highpass", 34, 0.707);
  for (let i = 0; i < total; i++) {
    left[i] = hpL.process(left[i]);
    right[i] = hpR.process(right[i]);
  }
  const [rl, rr] = applyReverb(left, right, 0.22, 0.54);

  const fi = Math.floor(0.6 * SR);
  const foStart = Math.floor((VIDEO_SECONDS - 2.4) * SR);
  const foEnd = Math.floor(VIDEO_SECONDS * SR);
  const foLen = foEnd - foStart;
  for (let i = 0; i < fi; i++) { const g = (i / fi) * (i / fi); rl[i] *= g; rr[i] *= g; }
  for (let i = foStart; i < total; i++) {
    if (i < foEnd) {
      const u = (i - foStart) / foLen;
      const g = Math.pow(1 - u, 2.4);
      rl[i] *= g; rr[i] *= g;
    } else {
      rl[i] = 0; rr[i] = 0;
    }
  }
  finalize(rl, rr);
  return { name: "bgm-kinetic-calm.wav", targetSec: durSec, path: writeWav("bgm-kinetic-calm.wav", rl, rr) };
}

// 2. sfx-whip.wav (0.28s: high-velocity kinetic whip-pan sweep)
function genWhip() {
  const durSec = 0.28;
  const n = Math.round(durSec * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  const rng = mulberry32(20265002);
  const bpL = new Biquad("bandpass", 600, 1.5);
  const bpR = new Biquad("bandpass", 640, 1.5);
  let brown = 0;
  for (let i = 0; i < n; i++) {
    const u = i / n;
    const w = rng() * 2 - 1;
    brown = (brown + 0.08 * w) / 1.08;
    const fc = 360 + 2600 * Math.pow(Math.sin(u * Math.PI), 1.3);
    bpL.set(fc, 1.5); bpR.set(fc * 1.05, 1.5);
    const env = Math.sin(u * Math.PI) * Math.pow(1 - u, 0.3);
    const pan = -0.5 + u * 1.0;
    l[i] = bpL.process(brown * 2.2 + w * 0.35) * env * Math.cos(((pan + 1) * Math.PI) / 4);
    r[i] = bpR.process(brown * 2.2 + w * 0.35) * env * Math.sin(((pan + 1) * Math.PI) / 4);
  }
  finalize(l, r);
  return { name: "sfx-whip.wav", targetSec: durSec, path: writeWav("sfx-whip.wav", l, r) };
}

// 3. sfx-blob-wipe.wav (0.50s: deep organic liquid swell for lime blob screen transition)
function genBlobWipe() {
  const durSec = 0.50;
  const n = Math.round(durSec * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  const rng = mulberry32(20265003);
  const bp = new Biquad("bandpass", 420, 1.1);
  let ph = 0;
  let brown = 0;
  for (let i = 0; i < n; i++) {
    const u = i / n;
    const w = rng() * 2 - 1;
    brown = (brown + 0.05 * w) / 1.05;
    const fSub = 68 + 95 * Math.sin(u * Math.PI);
    ph += (2 * Math.PI * fSub) / SR;
    bp.set(240 + 1350 * Math.sin(u * Math.PI), 1.15);
    const env = Math.sin(u * Math.PI);
    const s = (Math.sin(ph) * 0.45 + bp.process(brown * 2.5 + w * 0.2) * 0.75) * env;
    l[i] = s; r[i] = s * 0.96;
  }
  finalize(l, r);
  return { name: "sfx-blob-wipe.wav", targetSec: durSec, path: writeWav("sfx-blob-wipe.wav", l, r) };
}

// 4. sfx-pop.wav (0.14s: snappy liquid pop for cards/pills/items)
function genPop() {
  const durSec = 0.14;
  const n = Math.round(durSec * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const atk = i < 110 ? i / 110 : 1;
    const env = Math.exp(-t / 0.032);
    const f = 420 + 520 * (1 - Math.exp(-t / 0.02));
    ph += (2 * Math.PI * f) / SR;
    const s = (Math.sin(ph) * 0.85 + Math.sin(ph * 2) * 0.15 * Math.exp(-t / 0.012)) * atk * env;
    l[i] = s; r[i] = s * 0.97;
  }
  finalize(l, r);
  return { name: "sfx-pop.wav", targetSec: durSec, path: writeWav("sfx-pop.wav", l, r) };
}

// 5. sfx-click.wav (0.09s: crisp tactile submit click)
function genClick() {
  const durSec = 0.09;
  const n = Math.round(durSec * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  const rng = mulberry32(20265005);
  const lpf = new Biquad("lowpass", 1800, 0.85);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const thud = Math.sin(2 * Math.PI * 160 * t) * Math.exp(-t / 0.012) * 0.72;
    const snap = (Math.sin(2 * Math.PI * 1240 * t) * 0.4 + (rng() * 2 - 1) * 0.25) * Math.exp(-t / 0.004);
    const s = lpf.process(thud + snap);
    l[i] = s; r[i] = s * 0.98;
  }
  finalize(l, r);
  return { name: "sfx-click.wav", targetSec: durSec, path: writeWav("sfx-click.wav", l, r) };
}

// 6. sfx-type.wav (0.06s: soft crisp keycap tick)
function genType() {
  const durSec = 0.06;
  const n = Math.round(durSec * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  const rng = mulberry32(20265006);
  const bp = new Biquad("bandpass", 2400, 1.8);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const s = (bp.process(rng() * 2 - 1) * 0.7 + Math.sin(2 * Math.PI * 920 * t) * 0.3) * Math.exp(-t / 0.006);
    l[i] = s; r[i] = s * 0.96;
  }
  finalize(l, r);
  return { name: "sfx-type.wav", targetSec: durSec, path: writeWav("sfx-type.wav", l, r) };
}

// 7. sfx-resolve.wav (2.60s: warm botanical Fmaj9 closure chord fading to pure silence)
function genResolve() {
  const durSec = 2.60;
  const n = Math.round(durSec * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  [53, 60, 64, 67, 69, 76].forEach((m, idx) => {
    addWarmChordTone(l, r, Math.floor(idx * 0.036 * SR), 2.1, midiHz(m), 0.28, -0.38 + idx * 0.15);
  });
  const [rl, rr] = applyReverb(l, r, 0.30, 0.58);
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

const out = [genBgm(), genWhip(), genBlobWipe(), genPop(), genClick(), genType(), genResolve()];
console.log("----------------------------------------------------------------");
console.log("File                        | Durasi | Peak dBFS | RMS dBFS");
console.log("----------------------------------------------------------------");
try {
  for (const item of out) {
    const v = validate(item);
    console.log(`${v.name.padEnd(27)} | ${v.sec.toFixed(2)}s  | ${v.peakDb.toFixed(2).padStart(7)} dB | ${v.rmsDb.toFixed(2).padStart(7)} dB`);
  }
  console.log("----------------------------------------------------------------");
  console.log("Semua 7 file WAV Kinetic Sound Design LULUS validasi.");
} catch (err) {
  console.error("AUDIO VALIDATION FAILED:", err instanceof Error ? err.message : String(err));
  process.exit(1);
}
