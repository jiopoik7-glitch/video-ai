#!/usr/bin/env node
/**
 * Tactile Finishing SFX Engine (Pure Node.js ESM DSP - Zero Dependencies)
 * Khusus untuk overlay di atas video mentah yang sudah memiliki suara vokal & musik latar.
 * Menghasilkan 4 file WAV SFX halus (PCM 16-bit Stereo 44.1 kHz, peak -3 dBFS) ke public/audio/.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

function finalize(left, right) {
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
    const g = TARGET_PEAK / peak;
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

// 1. sfx-whoosh.wav (0.30s: silky air-sweep for cut punch-ins)
function genWhoosh() {
  const dur = 0.30;
  const n = Math.round(dur * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  const rng = mulberry32(20268801);
  const bpL = new Biquad("bandpass", 520, 1.35);
  const bpR = new Biquad("bandpass", 550, 1.35);
  let brown = 0;
  for (let i = 0; i < n; i++) {
    const u = i / n;
    const w = rng() * 2 - 1;
    brown = (brown + 0.07 * w) / 1.07;
    const fc = 300 + 2100 * Math.pow(Math.sin(u * Math.PI), 1.3);
    bpL.set(fc, 1.35); bpR.set(fc * 1.04, 1.35);
    const env = Math.sin(u * Math.PI) * Math.pow(1 - u, 0.32);
    const pan = -0.38 + u * 0.76;
    l[i] = bpL.process(brown * 2.2 + w * 0.25) * env * Math.cos(((pan + 1) * Math.PI) / 4);
    r[i] = bpR.process(brown * 2.2 + w * 0.25) * env * Math.sin(((pan + 1) * Math.PI) / 4);
  }
  finalize(l, r);
  return { name: "sfx-whoosh.wav", targetSec: dur, path: writeWav("sfx-whoosh.wav", l, r) };
}

// 2. sfx-focus-ping.wav (0.28s: refined optical camera focus ping)
function genFocusPing() {
  const dur = 0.28;
  const n = Math.round(dur * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  const w1 = (2 * Math.PI * 880) / SR;
  const w2 = (2 * Math.PI * 1318.5) / SR;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const atk = i < 120 ? i / 120 : 1;
    const s1 = Math.sin(w1 * i) * Math.exp(-t / 0.055) * 0.55;
    const s2 = t > 0.045 ? Math.sin(w2 * (i - 0.045 * SR)) * Math.exp(-(t - 0.045) / 0.07) * 0.65 : 0;
    l[i] = (s1 + s2) * atk;
    r[i] = (s1 * 0.94 + s2 * 1.04) * atk;
  }
  finalize(l, r);
  return { name: "sfx-focus-ping.wav", targetSec: dur, path: writeWav("sfx-focus-ping.wav", l, r) };
}

// 3. sfx-step-pop.wav (0.14s: subtle droplet pop for chain steps & spec pills)
function genStepPop() {
  const dur = 0.14;
  const n = Math.round(dur * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const atk = i < 100 ? i / 100 : 1;
    const f = 460 + 440 * (1 - Math.exp(-t / 0.02));
    ph += (2 * Math.PI * f) / SR;
    const s = (Math.sin(ph) * 0.85 + Math.sin(ph * 2) * 0.15 * Math.exp(-t / 0.012)) * atk * Math.exp(-t / 0.032);
    l[i] = s; r[i] = s * 0.96;
  }
  finalize(l, r);
  return { name: "sfx-step-pop.wav", targetSec: dur, path: writeWav("sfx-step-pop.wav", l, r) };
}

// 4. sfx-haptic-cta.wav (0.12s: warm iPhone haptic tap for CTA pulse)
function genHapticCta() {
  const dur = 0.12;
  const n = Math.round(dur * SR);
  const l = new Float64Array(n), r = new Float64Array(n);
  const rng = mulberry32(20268804);
  const lpf = new Biquad("lowpass", 1300, 0.85);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const body = Math.sin(2 * Math.PI * 135 * t) * Math.exp(-t / 0.014) * 0.76;
    const click = t < 0.0035 ? (rng() * 2 - 1) * Math.exp(-t / 0.0018) * 0.36 : 0;
    const s = lpf.process(body + click);
    l[i] = s; r[i] = s * 0.98;
  }
  finalize(l, r);
  return { name: "sfx-haptic-cta.wav", targetSec: dur, path: writeWav("sfx-haptic-cta.wav", l, r) };
}

function validate(entry) {
  const buf = fs.readFileSync(entry.path);
  if (buf.length < 44 || buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WAVE") {
    throw new Error(`${entry.name}: WAV header invalid`);
  }
  const ch = buf.readUInt16LE(22);
  const rate = buf.readUInt32LE(24);
  const bits = buf.readUInt16LE(34);
  const dataBytes = buf.readUInt32LE(40);
  if (ch !== 2 || rate !== SR || bits !== 16) throw new Error(`${entry.name}: format mismatch`);
  const sec = dataBytes / 4 / SR;
  if (Math.abs(sec - entry.targetSec) > 0.02) throw new Error(`${entry.name}: durasi ${sec}s != ${entry.targetSec}s`);
  let peak = 0;
  const total = dataBytes / 2;
  for (let i = 0; i < total; i++) {
    const v = buf.readInt16LE(44 + i * 2) / 32768;
    if (!Number.isFinite(v)) throw new Error(`${entry.name}: NaN`);
    const a = Math.abs(v);
    if (a > peak) peak = a;
  }
  const peakDb = peak > 0 ? 20 * Math.log10(peak) : -120;
  if (peakDb > -1.0) throw new Error(`${entry.name}: peak ${peakDb.toFixed(2)} dBFS > -1 dBFS`);
  console.log(`[SFX OK] ${entry.name.padEnd(20)} ${sec.toFixed(2)}s  peak ${peakDb.toFixed(2)} dBFS`);
}

[genWhoosh(), genFocusPing(), genStepPop(), genHapticCta()].forEach(validate);
