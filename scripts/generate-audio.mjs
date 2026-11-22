#!/usr/bin/env node
/**
 * iOS 26 Tactile Glass Audio Engine (Pure Node.js ESM DSP - Zero Dependencies)
 * PERINGATAN SINKRONISASI: Pastikan VIDEO_SECONDS sama dengan src/data/videoData.ts.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const VIDEO_SECONDS = 20;
const BGM_HEADROOM_SECONDS = 2;
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

function applyStereoReverb(left, right, wet = 0.22, feedback = 0.58) {
  const n = left.length;
  const run = (inp, combDelays, apDelays) => {
    const combs = combDelays.map((d) => ({ buf: new Float64Array(d), idx: 0, lp: 0 }));
    const aps = apDelays.map((d) => ({ buf: new Float64Array(d), idx: 0 }));
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

function finalizeBuffer(left, right, targetPeak = TARGET_PEAK) {
  const n = left.length;
  const microFade = Math.min(Math.floor(0.004 * SR), Math.floor(n / 4));
  for (let i = 0; i < microFade; i++) {
    const g = i / microFade;
    left[i] *= g; right[i] *= g;
    const j = n - 1 - i;
    left[j] *= g; right[j] *= g;
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
    const g = targetPeak / peak;
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

function addFeltPiano(left, right, start, durSec, freq, amp, pan, rng) {
  const len = Math.min(Math.floor(durSec * SR), left.length - start);
  if (len <= 0 || start < 0) return;
  const atk = Math.floor(0.015 * SR);
  const gL = Math.cos(((pan + 1) * Math.PI) / 4) * amp;
  const gR = Math.sin(((pan + 1) * Math.PI) / 4) * amp;
  const lpf = new Biquad("lowpass", 1150, 0.72);
  const w1 = (2 * Math.PI * freq) / SR;
  const w2 = (2 * Math.PI * freq * 2.001) / SR;
  const w3 = (2 * Math.PI * freq * 3.002) / SR;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const eAtk = i < atk ? 1 - Math.exp((-5.5 * i) / atk) : 1;
    const eDec = Math.exp((-1.45 / Math.max(0.4, durSec)) * t);
    const tail = i > len - 400 ? (len - i) / 400 : 1;
    const hammer = (rng() * 2 - 1) * 0.03 * Math.exp(-t / 0.011);
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

function addGlassChime(left, right, start, durSec, freq, amp, pan) {
  const len = Math.min(Math.floor(durSec * SR), left.length - start);
  if (len <= 0 || start < 0) return;
  const atk = Math.floor(0.004 * SR);
  const gL = Math.cos(((pan + 1) * Math.PI) / 4) * amp;
  const gR = Math.sin(((pan + 1) * Math.PI) / 4) * amp;
  const w1 = (2 * Math.PI * freq) / SR;
  const w2 = (2 * Math.PI * freq * 2.756) / SR;
  const w3 = (2 * Math.PI * freq * 5.404) / SR;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const eAtk = i < atk ? i / atk : 1;
    const env = Math.exp((-5.0 / Math.max(0.32, durSec)) * t);
    const s =
      (Math.sin(w1 * i) * 0.82 +
        Math.sin(w2 * i) * 0.13 * Math.exp(-11 * t) +
        Math.sin(w3 * i) * 0.05 * Math.exp(-24 * t)) *
      eAtk *
      env;
    left[start + i] += s * gL;
    right[start + i] += s * gR;
  }
}

function addWarmSub(left, right, start, durSec, freq, amp) {
  const len = Math.min(Math.floor(durSec * SR), left.length - start);
  if (len <= 0 || start < 0) return;
  const f = freq > 105 ? freq / 2 : freq;
  const atk = Math.floor(0.07 * SR);
  const w = (2 * Math.PI * f) / SR;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const eAtk = i < atk ? i / atk : 1;
    const env = Math.exp(-0.5 * t);
    const tail = i > len - 1800 ? (len - i) / 1800 : 1;
    const s = Math.sin(w * i) * eAtk * env * tail * amp;
    left[start + i] += s;
    right[start + i] += s;
  }
}

// 1. bgm-ios-ambient.wav (22s = 20s + 2s headroom, Eb maj9 -> C min9 -> Ab maj9 -> Bb 6/9)
function genBgm() {
  const durSec = VIDEO_SECONDS + BGM_HEADROOM_SECONDS;
  const total = Math.round(durSec * SR);
  const left = new Float64Array(total);
  const right = new Float64Array(total);
  const rng = mulberry32(20263001);

  const beat = 60 / 80;
  const chordBeats = 8; // 6.0s per chord
  const chords = [
    { sub: 39, notes: [51, 55, 58, 62, 65], bells: [70, 74, 77, 74] }, // Ebmaj9
    { sub: 36, notes: [48, 55, 58, 62, 63], bells: [70, 72, 75, 72] }, // Cm9
    { sub: 32, notes: [44, 51, 55, 58, 60], bells: [68, 72, 75, 72] }, // Abmaj9
    { sub: 34, notes: [46, 53, 55, 60, 62], bells: [70, 72, 74, 72] }, // Bb6/9
  ];

  const count = Math.ceil(VIDEO_SECONDS / (chordBeats * beat));
  for (let c = 0; c < count; c++) {
    const ch = chords[c % chords.length];
    const startSec = c * chordBeats * beat;
    if (startSec >= VIDEO_SECONDS - 1.0) break;
    const st = Math.floor(startSec * SR);
    const cDur = Math.min(chordBeats * beat * 0.98, VIDEO_SECONDS - startSec);
    ch.notes.forEach((m, idx) => {
      const pan = -0.34 + (idx / Math.max(1, ch.notes.length - 1)) * 0.68;
      addFeltPiano(left, right, st + Math.floor(idx * 0.03 * SR), cDur, midiHz(m), 0.24, pan, rng);
    });
    addWarmSub(left, right, st, cDur * 0.9, midiHz(ch.sub), 0.16);
    for (let step = 0; step < 4; step++) {
      const ts = startSec + step * beat * 2;
      if (ts >= VIDEO_SECONDS - 2.0) break;
      addGlassChime(left, right, Math.floor(ts * SR), 0.85, midiHz(ch.bells[step]), 0.08, step % 2 === 0 ? -0.34 : 0.34);
    }
  }

  const hpL = new Biquad("highpass", 35, 0.707);
  const hpR = new Biquad("highpass", 35, 0.707);
  for (let i = 0; i < total; i++) {
    left[i] = hpL.process(left[i]);
    right[i] = hpR.process(right[i]);
  }
  const [rl, rr] = applyStereoReverb(left, right, 0.22, 0.58);

  const fi = Math.floor(0.8 * SR);
  const foStart = Math.floor((VIDEO_SECONDS - 2.2) * SR);
  const foEnd = Math.floor(VIDEO_SECONDS * SR);
  const foLen = foEnd - foStart;
  for (let i = 0; i < fi; i++) {
    const g = (i / fi) * (i / fi);
    rl[i] *= g; rr[i] *= g;
  }
  for (let i = foStart; i < total; i++) {
    if (i < foEnd) {
      const u = (i - foStart) / foLen;
      const g = Math.pow(1 - u, 2.4);
      rl[i] *= g; rr[i] *= g;
    } else {
      rl[i] = 0; rr[i] = 0;
    }
  }
  finalizeBuffer(rl, rr);
  return { name: "bgm-ios-ambient.wav", targetSec: durSec, path: writeWav("bgm-ios-ambient.wav", rl, rr) };
}

// 2. sfx-ios-notif.wav (0.45s: crystalline 3-note iOS marimba chime)
function genNotif() {
  const durSec = 0.45;
  const n = Math.round(durSec * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  addGlassChime(l, r, 0, 0.36, midiHz(75), 0.48, -0.20); // Eb5
  addGlassChime(l, r, Math.floor(0.068 * SR), 0.34, midiHz(79), 0.44, 0.12); // G5
  addGlassChime(l, r, Math.floor(0.136 * SR), 0.30, midiHz(82), 0.50, 0.25); // Bb5
  const [rl, rr] = applyStereoReverb(l, r, 0.22, 0.46);
  finalizeBuffer(rl, rr);
  return { name: "sfx-ios-notif.wav", targetSec: durSec, path: writeWav("sfx-ios-notif.wav", rl, rr) };
}

// 3. sfx-glass-whoosh.wav (0.35s: silky band-pass air sweep for unlock & modal sheet)
function genWhoosh() {
  const durSec = 0.35;
  const n = Math.round(durSec * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  const rng = mulberry32(20263003);
  const bpL = new Biquad("bandpass", 1100, 1.4);
  const bpR = new Biquad("bandpass", 1140, 1.4);
  let brown = 0;
  for (let i = 0; i < n; i++) {
    const u = i / n;
    const t = i / SR;
    const w = rng() * 2 - 1;
    brown = (brown + 0.06 * w) / 1.06;
    const fc = 1100 + 1800 * Math.sin(u * Math.PI * 0.85);
    bpL.set(fc, 1.4); bpR.set(fc * 1.04, 1.4);
    const env = Math.sin(u * Math.PI) * Math.pow(1 - u, 0.35);
    const pan = -0.32 + u * 0.64;
    const gL = Math.cos(((pan + 1) * Math.PI) / 4);
    const gR = Math.sin(((pan + 1) * Math.PI) / 4);
    const shimmer = Math.sin(2 * Math.PI * 1864 * t) * 0.03 * env;
    const src = brown * 2.2 + w * 0.20;
    l[i] = bpL.process(src) * env * gL + shimmer * gL;
    r[i] = bpR.process(src) * env * gR + shimmer * gR;
  }
  finalizeBuffer(l, r);
  return { name: "sfx-glass-whoosh.wav", targetSec: durSec, path: writeWav("sfx-glass-whoosh.wav", l, r) };
}

// 4. sfx-droplet-check.wav (0.16s: liquid crystal droplet pop)
function genDroplet() {
  const durSec = 0.16;
  const n = Math.round(durSec * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  const atk = Math.floor(0.0025 * SR);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const eAtk = i < atk ? i / atk : 1;
    const env = Math.exp(-t / 0.038);
    const freq = 450 + 470 * (1 - Math.exp(-t / 0.025));
    ph += (2 * Math.PI * freq) / SR;
    const shimmer = Math.sin(2 * Math.PI * 1864 * t) * 0.07 * Math.exp(-t / 0.022);
    const s = (Math.sin(ph) * 0.86 + Math.sin(ph * 2) * 0.14 * Math.exp(-t / 0.016) + shimmer) * eAtk * env;
    l[i] = s; r[i] = s * 0.96;
  }
  finalizeBuffer(l, r);
  return { name: "sfx-droplet-check.wav", targetSec: durSec, path: writeWav("sfx-droplet-check.wav", l, r) };
}

// 5. sfx-haptic-tap.wav (0.10s: damped iPhone Taptic Engine click)
function genHaptic() {
  const durSec = 0.10;
  const n = Math.round(durSec * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  const rng = mulberry32(20263005);
  const lpf = new Biquad("lowpass", 1120, 0.8);
  const atk = Math.floor(0.001 * SR);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const eAtk = i < atk ? i / atk : 1;
    const body = Math.sin(2 * Math.PI * 120 * t) * Math.exp(-t / 0.013) * 0.78;
    const click = t < 0.0032 ? (rng() * 2 - 1) * Math.exp(-t / 0.0016) * 0.40 : 0;
    const s = lpf.process(body + click) * eAtk;
    l[i] = s; r[i] = s * 0.98;
  }
  finalizeBuffer(l, r);
  return { name: "sfx-haptic-tap.wav", targetSec: durSec, path: writeWav("sfx-haptic-tap.wav", l, r) };
}

// 6. sfx-resolve-chord.wav (2.40s: warm Ebmaj9 felt piano + glass chime to pure silence)
function genResolve() {
  const durSec = 2.40;
  const n = Math.round(durSec * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  const rng = mulberry32(20263006);
  [51, 58, 62, 65, 67, 74].forEach((m, idx) => {
    addFeltPiano(l, r, Math.floor(idx * 0.034 * SR), 1.95, midiHz(m), 0.28, -0.36 + idx * 0.14, rng);
  });
  addGlassChime(l, r, Math.floor(0.13 * SR), 1.3, midiHz(82), 0.22, 0.24);
  const [rl, rr] = applyStereoReverb(l, r, 0.28, 0.56);

  const silenceStart = Math.floor((durSec - 0.20) * SR);
  const fadeStart = Math.floor((durSec - 0.80) * SR);
  const fadeLen = silenceStart - fadeStart;
  for (let i = fadeStart; i < n; i++) {
    if (i < silenceStart) {
      const u = (i - fadeStart) / fadeLen;
      const g = Math.pow(1 - u, 2.4);
      rl[i] *= g; rr[i] *= g;
    } else {
      rl[i] = 0; rr[i] = 0;
    }
  }
  finalizeBuffer(rl, rr);
  for (let i = silenceStart; i < n; i++) { rl[i] = 0; rr[i] = 0; }
  return { name: "sfx-resolve-chord.wav", targetSec: durSec, path: writeWav("sfx-resolve-chord.wav", rl, rr) };
}

function validateWav(entry) {
  const buf = fs.readFileSync(entry.path);
  if (buf.length < 44) throw new Error(`${entry.name}: terlalu kecil`);
  if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WAVE") {
    throw new Error(`${entry.name}: header RIFF/WAVE tidak valid`);
  }
  const channels = buf.readUInt16LE(22);
  const rate = buf.readUInt32LE(24);
  const bits = buf.readUInt16LE(34);
  const dataBytes = buf.readUInt32LE(40);
  if (channels !== 2 || rate !== SR || bits !== 16) {
    throw new Error(`${entry.name}: bukan PCM 16-bit Stereo 44.1kHz`);
  }
  const actualSec = dataBytes / 4 / SR;
  if (Math.abs(actualSec - entry.targetSec) > 0.02) {
    throw new Error(`${entry.name}: durasi menyimpang (${actualSec.toFixed(3)}s)`);
  }
  let peak = 0, sumSq = 0;
  const total = dataBytes / 2;
  for (let i = 0; i < total; i++) {
    const v = buf.readInt16LE(44 + i * 2) / 32768;
    if (!Number.isFinite(v)) throw new Error(`${entry.name}: NaN terdeteksi`);
    const a = Math.abs(v);
    if (a > peak) peak = a;
    sumSq += v * v;
  }
  const peakDb = peak > 0 ? 20 * Math.log10(peak) : -120;
  const rmsDb = sumSq > 0 ? 20 * Math.log10(Math.sqrt(sumSq / total)) : -120;
  if (peakDb > -1.0) throw new Error(`${entry.name}: peak ${peakDb.toFixed(2)} dBFS > -1 dBFS`);
  return { name: entry.name, actualSec, peakDb, rmsDb };
}

const files = [genBgm(), genNotif(), genWhoosh(), genDroplet(), genHaptic(), genResolve()];
console.log("------------------------------------------------------------------");
console.log("File                        | Durasi  | Peak dBFS | RMS dBFS");
console.log("------------------------------------------------------------------");
try {
  for (const f of files) {
    const v = validateWav(f);
    console.log(
      `${v.name.padEnd(27)} | ${v.actualSec.toFixed(2)}s  | ${v.peakDb.toFixed(2).padStart(7)} dB | ${v.rmsDb.toFixed(2).padStart(7)} dB`
    );
  }
  console.log("------------------------------------------------------------------");
  console.log("Semua 6 file WAV iOS 26 Tactile Glass LULUS validasi.");
} catch (err) {
  console.error("VALIDASI GAGAL:", err instanceof Error ? err.message : String(err));
  process.exit(1);
}
