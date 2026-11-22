#!/usr/bin/env node
/**
 * Liquid Glass Tactile Audio Engine (Pure Node.js ESM DSP - Zero Dependencies)
 * PERINGATAN SINKRONISASI: Jika VIDEO_SECONDS di src/data/videoData.ts diubah,
 * ubah juga konstanta VIDEO_SECONDS di bawah ini agar durasi BGM tetap cocok!
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const VIDEO_SECONDS = 20;
const BGM_HEADROOM_SECONDS = 2;
const SR = 44100;
const TARGET_PEAK_LINEAR = Math.pow(10, -3.0 / 20); // -3.0 dBFS

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

function applyStereoReverb(left, right, wet = 0.22, feedback = 0.62) {
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
    run(left, [1553, 1697, 1861, 2027], [241, 563]),
    run(right, [1579, 1723, 1889, 2053], [263, 587]),
  ];
}

function finalizeBuffer(left, right, targetPeak = TARGET_PEAK_LINEAR) {
  const n = left.length;
  const microFade = Math.min(Math.floor(0.004 * SR), Math.floor(n / 4));
  for (let i = 0; i < microFade; i++) {
    const g = i / microFade;
    left[i] *= g;
    right[i] *= g;
    const j = n - 1 - i;
    left[j] *= g;
    right[j] *= g;
  }
  // Soft-limiter (tanh gentle saturation)
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
    const gain = targetPeak / peak;
    for (let i = 0; i < n; i++) {
      left[i] *= gain;
      right[i] *= gain;
    }
  }
}

function writeWavFile(filename, left, right) {
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
    const sL = Math.max(-1, Math.min(1, left[i]));
    const sR = Math.max(-1, Math.min(1, right[i]));
    pcm.writeInt16LE(Math.round(sL * 32767), i * 4);
    pcm.writeInt16LE(Math.round(sR * 32767), i * 4 + 2);
  }
  const fullPath = path.join(OUT_DIR, filename);
  fs.writeFileSync(fullPath, Buffer.concat([header, pcm]));
  return fullPath;
}

function midiToHz(m) {
  return 440 * Math.pow(2, (m - 69) / 12);
}

function addFeltPiano(left, right, start, durSec, freq, amp, pan, rng) {
  const len = Math.min(Math.floor(durSec * SR), left.length - start);
  if (len <= 0 || start < 0) return;
  const atk = Math.floor(0.014 * SR);
  const gL = Math.cos(((pan + 1) * Math.PI) / 4) * amp;
  const gR = Math.sin(((pan + 1) * Math.PI) / 4) * amp;
  const lpf = new Biquad("lowpass", 1180, 0.72);
  const w1 = (2 * Math.PI * freq) / SR;
  const w2 = (2 * Math.PI * freq * 2.001) / SR;
  const w3 = (2 * Math.PI * freq * 3.002) / SR;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const eAtk = i < atk ? 1 - Math.exp((-5.5 * i) / atk) : 1;
    const eDec = Math.exp((-1.4 / Math.max(0.4, durSec)) * t);
    const tail = i > len - 400 ? (len - i) / 400 : 1;
    const feltNoise = (rng() * 2 - 1) * 0.035 * Math.exp(-t / 0.012);
    const raw =
      Math.sin(w1 * i) * 0.74 +
      Math.sin(w2 * i) * 0.19 * Math.exp(-2.8 * t) +
      Math.sin(w3 * i) * 0.07 * Math.exp(-5.0 * t) +
      feltNoise;
    const s = lpf.process(raw) * eAtk * eDec * tail;
    left[start + i] += s * gL;
    right[start + i] += s * gR;
  }
}

function addGlassBell(left, right, start, durSec, freq, amp, pan) {
  const len = Math.min(Math.floor(durSec * SR), left.length - start);
  if (len <= 0 || start < 0) return;
  const atk = Math.floor(0.004 * SR);
  const gL = Math.cos(((pan + 1) * Math.PI) / 4) * amp;
  const gR = Math.sin(((pan + 1) * Math.PI) / 4) * amp;
  const w1 = (2 * Math.PI * freq) / SR;
  const w2 = (2 * Math.PI * freq * 2.756) / SR; // inharmonic glass partial
  const w3 = (2 * Math.PI * freq * 5.404) / SR;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const eAtk = i < atk ? i / atk : 1;
    const env = Math.exp((-4.8 / Math.max(0.35, durSec)) * t);
    const s =
      (Math.sin(w1 * i) * 0.82 +
        Math.sin(w2 * i) * 0.13 * Math.exp(-10 * t) +
        Math.sin(w3 * i) * 0.05 * Math.exp(-22 * t)) *
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
    const env = Math.exp(-0.48 * t);
    const tail = i > len - 1800 ? (len - i) / 1800 : 1;
    const s = Math.sin(w * i) * eAtk * env * tail * amp;
    left[start + i] += s;
    right[start + i] += s;
  }
}

// 1. bgm-liquid-bed.wav (VIDEO_SECONDS + 2s headroom, 78 BPM, Fmaj9 -> Dm9 -> Bbmaj9 -> C6/9)
function generateBgm() {
  const durSec = VIDEO_SECONDS + BGM_HEADROOM_SECONDS;
  const total = Math.round(durSec * SR);
  const left = new Float64Array(total);
  const right = new Float64Array(total);
  const rng = mulberry32(20261101);

  const beat = 60 / 78; // ~0.769s
  const chordBeats = 8; // ~6.15s per chord
  const chords = [
    { sub: 41, notes: [53, 57, 60, 64, 67], bells: [72, 76, 79, 76] }, // Fmaj9
    { sub: 38, notes: [50, 57, 60, 64, 65], bells: [72, 74, 77, 74] }, // Dm9
    { sub: 34, notes: [46, 53, 57, 60, 62], bells: [70, 74, 77, 74] }, // Bbmaj9
    { sub: 36, notes: [48, 55, 57, 62, 64], bells: [72, 74, 76, 74] }, // C6/9
  ];

  const count = Math.ceil(VIDEO_SECONDS / (chordBeats * beat));
  for (let c = 0; c < count; c++) {
    const ch = chords[c % chords.length];
    const startSec = c * chordBeats * beat;
    if (startSec >= VIDEO_SECONDS - 1.2) break;
    const st = Math.floor(startSec * SR);
    const chordDur = Math.min(chordBeats * beat * 0.98, VIDEO_SECONDS - startSec);
    ch.notes.forEach((m, idx) => {
      const pan = -0.34 + (idx / Math.max(1, ch.notes.length - 1)) * 0.68;
      addFeltPiano(left, right, st + Math.floor(idx * 0.032 * SR), chordDur, midiToHz(m), 0.24, pan, rng);
    });
    addWarmSub(left, right, st, chordDur * 0.92, midiToHz(ch.sub), 0.16);

    for (let step = 0; step < 4; step++) {
      const tStep = startSec + step * beat * 2;
      if (tStep >= VIDEO_SECONDS - 2.2) break;
      addGlassBell(left, right, Math.floor(tStep * SR), 0.9, midiToHz(ch.bells[step]), 0.085, step % 2 === 0 ? -0.35 : 0.35);
    }
  }

  // High-pass 35 Hz to keep sub clean, then short stereo reverb (wet 22%)
  const hpL = new Biquad("highpass", 35, 0.707);
  const hpR = new Biquad("highpass", 35, 0.707);
  for (let i = 0; i < total; i++) {
    left[i] = hpL.process(left[i]);
    right[i] = hpR.process(right[i]);
  }
  const [rl, rr] = applyStereoReverb(left, right, 0.22, 0.60);

  // Fade-in 1.0s; exponential fade-out 2.5s finishing EXACTLY at VIDEO_SECONDS (remaining 2s = quiet tail/silence)
  const fadeInSamples = Math.floor(1.0 * SR);
  const fadeOutStart = Math.floor((VIDEO_SECONDS - 2.5) * SR);
  const fadeOutEnd = Math.floor(VIDEO_SECONDS * SR);
  const fadeOutLen = fadeOutEnd - fadeOutStart;

  for (let i = 0; i < fadeInSamples; i++) {
    const g = (i / fadeInSamples) * (i / fadeInSamples);
    rl[i] *= g;
    rr[i] *= g;
  }
  for (let i = fadeOutStart; i < total; i++) {
    if (i < fadeOutEnd) {
      const u = (i - fadeOutStart) / fadeOutLen;
      const g = Math.pow(1 - u, 2.5);
      rl[i] *= g;
      rr[i] *= g;
    } else {
      rl[i] = 0;
      rr[i] = 0;
    }
  }
  finalizeBuffer(rl, rr);
  return { name: "bgm-liquid-bed.wav", targetSec: durSec, path: writeWavFile("bgm-liquid-bed.wav", rl, rr) };
}

// 2. sfx-ios-notif.wav (0.45s: 3 ascending pentatonic major glass-marimba tones)
function generateNotif() {
  const durSec = 0.45;
  const n = Math.round(durSec * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  addGlassBell(l, r, 0, 0.36, midiToHz(77), 0.48, -0.18); // F5
  addGlassBell(l, r, Math.floor(0.072 * SR), 0.34, midiToHz(81), 0.44, 0.12); // A5
  addGlassBell(l, r, Math.floor(0.144 * SR), 0.30, midiToHz(84), 0.50, 0.24); // C6
  const [rl, rr] = applyStereoReverb(l, r, 0.22, 0.46);
  finalizeBuffer(rl, rr);
  return { name: "sfx-ios-notif.wav", targetSec: durSec, path: writeWavFile("sfx-ios-notif.wav", rl, rr) };
}

// 3. sfx-droplet-check.wav (0.18s: pitch-lift liquid crystal droplet pop)
function generateDroplet() {
  const durSec = 0.18;
  const n = Math.round(durSec * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  const atk = Math.floor(0.0025 * SR);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const eAtk = i < atk ? i / atk : 1;
    const env = Math.exp(-t / 0.042);
    const freq = 430 + 450 * (1 - Math.exp(-t / 0.028));
    ph += (2 * Math.PI * freq) / SR;
    const shimmer = Math.sin(2 * Math.PI * 1760 * t) * 0.08 * Math.exp(-t / 0.026);
    const s = (Math.sin(ph) * 0.86 + Math.sin(ph * 2) * 0.14 * Math.exp(-t / 0.018) + shimmer) * eAtk * env;
    l[i] = s;
    r[i] = s * 0.96;
  }
  finalizeBuffer(l, r);
  return { name: "sfx-droplet-check.wav", targetSec: durSec, path: writeWavFile("sfx-droplet-check.wav", l, r) };
}

// 4. sfx-glass-glide.wav (0.38s: swept band-pass brown/pink noise + subtle shimmer + stereo pan)
function generateGlide() {
  const durSec = 0.38;
  const n = Math.round(durSec * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  const rng = mulberry32(20261104);
  const bpL = new Biquad("bandpass", 1200, 1.4);
  const bpR = new Biquad("bandpass", 1240, 1.4);
  let brown = 0;
  for (let i = 0; i < n; i++) {
    const u = i / n;
    const t = i / SR;
    const w = rng() * 2 - 1;
    brown = (brown + 0.06 * w) / 1.06;
    const fc = 1200 + 1800 * Math.sin(u * Math.PI * 0.85);
    bpL.set(fc, 1.4);
    bpR.set(fc * 1.04, 1.4);
    const env = Math.sin(u * Math.PI) * Math.pow(1 - u, 0.35);
    const pan = -0.35 + u * 0.7;
    const gL = Math.cos(((pan + 1) * Math.PI) / 4);
    const gR = Math.sin(((pan + 1) * Math.PI) / 4);
    const shimmer = Math.sin(2 * Math.PI * 2093 * t) * 0.03 * env;
    const src = brown * 2.2 + w * 0.22;
    l[i] = bpL.process(src) * env * gL + shimmer * gL;
    r[i] = bpR.process(src) * env * gR + shimmer * gR;
  }
  finalizeBuffer(l, r);
  return { name: "sfx-glass-glide.wav", targetSec: durSec, path: writeWavFile("sfx-glass-glide.wav", l, r) };
}

// 5. sfx-haptic-tap.wav (0.11s: damped Taptic Engine 115Hz sine + 3ms low-pass noise click)
function generateHaptic() {
  const durSec = 0.11;
  const n = Math.round(durSec * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  const rng = mulberry32(20261105);
  const lpf = new Biquad("lowpass", 1100, 0.8);
  const atk = Math.floor(0.001 * SR);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const eAtk = i < atk ? i / atk : 1;
    const body = Math.sin(2 * Math.PI * 115 * t) * Math.exp(-t / 0.014) * 0.78;
    const click = t < 0.0035 ? (rng() * 2 - 1) * Math.exp(-t / 0.0018) * 0.42 : 0;
    const s = lpf.process(body + click) * eAtk;
    l[i] = s;
    r[i] = s * 0.98;
  }
  finalizeBuffer(l, r);
  return { name: "sfx-haptic-tap.wav", targetSec: durSec, path: writeWavFile("sfx-haptic-tap.wav", l, r) };
}

// 6. sfx-crystal-resolve.wav (2.60s: Fmaj9 felt piano + upper glass chime fading cleanly to strict 0 in last 200ms)
function generateResolve() {
  const durSec = 2.60;
  const n = Math.round(durSec * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  const rng = mulberry32(20261106);
  [53, 60, 64, 67, 69, 76].forEach((m, idx) => {
    addFeltPiano(l, r, Math.floor(idx * 0.036 * SR), 2.1, midiToHz(m), 0.28, -0.36 + idx * 0.14, rng);
  });
  addGlassBell(l, r, Math.floor(0.14 * SR), 1.4, midiToHz(84), 0.24, 0.22);
  addGlassBell(l, r, Math.floor(0.24 * SR), 1.3, midiToHz(88), 0.18, -0.20);
  const [rl, rr] = applyStereoReverb(l, r, 0.28, 0.56);

  const silenceStart = Math.floor((durSec - 0.20) * SR);
  const fadeStart = Math.floor((durSec - 0.85) * SR);
  const fadeLen = silenceStart - fadeStart;
  for (let i = fadeStart; i < n; i++) {
    if (i < silenceStart) {
      const u = (i - fadeStart) / fadeLen;
      const g = Math.pow(1 - u, 2.4);
      rl[i] *= g;
      rr[i] *= g;
    } else {
      rl[i] = 0;
      rr[i] = 0;
    }
  }
  finalizeBuffer(rl, rr);
  // Guarantee final 200ms strictly zero
  for (let i = silenceStart; i < n; i++) {
    rl[i] = 0;
    rr[i] = 0;
  }
  return { name: "sfx-crystal-resolve.wav", targetSec: durSec, path: writeWavFile("sfx-crystal-resolve.wav", rl, rr) };
}

function validateWav(entry) {
  const buf = fs.readFileSync(entry.path);
  if (buf.length < 44) throw new Error(`${entry.name}: file terlalu kecil`);
  const riff = buf.toString("ascii", 0, 4);
  const wave = buf.toString("ascii", 8, 12);
  const fmt = buf.toString("ascii", 12, 16);
  const audioFmt = buf.readUInt16LE(20);
  const channels = buf.readUInt16LE(22);
  const sampleRate = buf.readUInt32LE(24);
  const bits = buf.readUInt16LE(34);
  const dataTag = buf.toString("ascii", 36, 40);
  const dataBytes = buf.readUInt32LE(40);

  if (riff !== "RIFF" || wave !== "WAVE" || fmt !== "fmt " || dataTag !== "data") {
    throw new Error(`${entry.name}: header RIFF/WAVE/fmt/data tidak valid`);
  }
  if (audioFmt !== 1 || channels !== 2 || sampleRate !== SR || bits !== 16) {
    throw new Error(`${entry.name}: format bukan PCM 16-bit Stereo 44.1kHz`);
  }
  const samplesPerChannel = dataBytes / 4;
  const actualSec = samplesPerChannel / SR;
  if (Math.abs(actualSec - entry.targetSec) > 0.02) {
    throw new Error(`${entry.name}: durasi ${actualSec.toFixed(3)}s menyimpang > 20ms dari ${entry.targetSec}s`);
  }

  let peak = 0;
  let sumSq = 0;
  const totalSamples = dataBytes / 2;
  for (let i = 0; i < totalSamples; i++) {
    const val = buf.readInt16LE(44 + i * 2) / 32768;
    if (!Number.isFinite(val)) throw new Error(`${entry.name}: ditemukan NaN`);
    const abs = Math.abs(val);
    if (abs > peak) peak = abs;
    sumSq += val * val;
  }
  const peakDb = peak > 0 ? 20 * Math.log10(peak) : -120;
  const rmsDb = sumSq > 0 ? 20 * Math.log10(Math.sqrt(sumSq / totalSamples)) : -120;
  if (peakDb > -1.0) {
    throw new Error(`${entry.name}: peak ${peakDb.toFixed(2)} dBFS melebihi -1 dBFS`);
  }
  return { name: entry.name, actualSec, peakDb, rmsDb };
}

const results = [
  generateBgm(),
  generateNotif(),
  generateDroplet(),
  generateGlide(),
  generateHaptic(),
  generateResolve(),
];

console.log("--------------------------------------------------------------------");
console.log("File                        | Durasi  | Peak dBFS  | RMS dBFS");
console.log("--------------------------------------------------------------------");
try {
  for (const item of results) {
    const v = validateWav(item);
    console.log(
      `${v.name.padEnd(27)} | ${v.actualSec.toFixed(2)}s  | ${v.peakDb.toFixed(2).padStart(7)} dB | ${v.rmsDb.toFixed(2).padStart(7)} dB`
    );
  }
  console.log("--------------------------------------------------------------------");
  console.log("Validasi 6 file WAV LULUS (PCM 16-bit Stereo 44.1kHz, Peak <= -1 dBFS).");
} catch (err) {
  console.error("VALIDASI AUDIO GAGAL:", err instanceof Error ? err.message : String(err));
  process.exit(1);
}
