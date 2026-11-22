#!/usr/bin/env node
/**
 * iOS Liquid Glass Tactile Audio Engine (Pure Node.js DSP)
 * Menghasilkan 6 file RIFF WAV valid (PCM 16-bit, Stereo, 44.1 kHz) ke public/audio/
 * Zero external dependencies. Deterministic seeded PRNG.
 */
import fs from "node:fs";
import path from "node:path";

const SR = 44100;
const OUT_DIR = path.resolve(process.cwd(), "public", "audio");
fs.mkdirSync(OUT_DIR, { recursive: true });

function createRng(seed) {
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
    const f = Math.max(25, Math.min(SR * 0.45, freq));
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

function applyStereoReverb(left, right, wet = 0.25, decay = 0.52) {
  const n = left.length;
  const run = (inp, delays) => {
    const combs = delays.map((d) => ({ buf: new Float32Array(d), idx: 0, lp: 0 }));
    const aps = [227, 541].map((d) => ({ buf: new Float32Array(d), idx: 0 }));
    const out = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = inp[i];
      let sum = 0;
      for (let c = 0; c < combs.length; c++) {
        const cb = combs[c];
        const del = cb.buf[cb.idx];
        cb.lp = del * 0.72 + cb.lp * 0.28;
        cb.buf[cb.idx] = x + cb.lp * decay;
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
  return [run(left, [1487, 1619, 1783, 1949]), run(right, [1511, 1657, 1801, 1973])];
}

function normalize(left, right, peak = 0.84) {
  let m = 0;
  for (let i = 0; i < left.length; i++) {
    const a = Math.abs(left[i]);
    const b = Math.abs(right[i]);
    if (a > m) m = a;
    if (b > m) m = b;
  }
  if (m < 1e-6) return;
  const g = peak / m;
  for (let i = 0; i < left.length; i++) {
    left[i] = Math.max(-0.99, Math.min(0.99, left[i] * g));
    right[i] = Math.max(-0.99, Math.min(0.99, right[i] * g));
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

  const filePath = path.join(OUT_DIR, name);
  const fd = fs.openSync(filePath, "w");
  fs.writeSync(fd, header);
  const buf = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, left[i])) * 32767), i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, right[i])) * 32767), i * 4 + 2);
  }
  fs.writeSync(fd, buf);
  fs.closeSync(fd);
  console.log(`[LIQUID AUDIO] ${name.padEnd(26)} ${(n / SR).toFixed(2)}s`);
}

function midi(m) {
  return 440 * Math.pow(2, (m - 69) / 12);
}

function addFeltPiano(left, right, start, durSec, freq, amp, pan = 0) {
  const len = Math.min(Math.floor(durSec * SR), left.length - start);
  if (len <= 0 || start < 0) return;
  const atk = Math.floor(0.018 * SR);
  const gL = Math.cos(((pan + 1) * Math.PI) / 4) * amp;
  const gR = Math.sin(((pan + 1) * Math.PI) / 4) * amp;
  const lpf = new Biquad("lowpass", 1250, 0.72);
  const w1 = (2 * Math.PI * freq) / SR;
  const w2 = (2 * Math.PI * freq * 2.0012) / SR;
  const w3 = (2 * Math.PI * freq * 3.002) / SR;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const eAtk = i < atk ? 1 - Math.exp((-5 * i) / atk) : 1;
    const eDec = Math.exp((-1.5 / Math.max(0.35, durSec)) * t);
    const tail = i > len - 360 ? (len - i) / 360 : 1;
    const raw =
      Math.sin(w1 * i) * 0.74 +
      Math.sin(w2 * i) * 0.19 * Math.exp(-2.8 * t) +
      Math.sin(w3 * i) * 0.07 * Math.exp(-5.0 * t);
    const s = lpf.process(raw) * eAtk * eDec * tail;
    left[start + i] += s * gL;
    right[start + i] += s * gR;
  }
}

function addGlassChime(left, right, start, durSec, freq, amp, pan = 0) {
  const len = Math.min(Math.floor(durSec * SR), left.length - start);
  if (len <= 0 || start < 0) return;
  const atk = Math.floor(0.005 * SR);
  const gL = Math.cos(((pan + 1) * Math.PI) / 4) * amp;
  const gR = Math.sin(((pan + 1) * Math.PI) / 4) * amp;
  const w1 = (2 * Math.PI * freq) / SR;
  const w2 = (2 * Math.PI * freq * 2.0) / SR;
  const w3 = (2 * Math.PI * freq * 3.01) / SR;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const eAtk = i < atk ? i / atk : 1;
    const env = Math.exp(-6.2 * t);
    const s =
      (Math.sin(w1 * i) * 0.8 +
        Math.sin(w2 * i) * 0.14 * Math.exp(-12 * t) +
        Math.sin(w3 * i) * 0.06 * Math.exp(-22 * t)) *
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
    const env = Math.exp(-0.55 * t);
    const tail = i > len - 1800 ? (len - i) / 1800 : 1;
    const s = Math.sin(w * i) * eAtk * env * tail * amp;
    left[start + i] += s;
    right[start + i] += s;
  }
}

// 1. bgm-liquid-bed.wav (22s = 20s video + 2s headroom)
function genBgm() {
  const DUR = 22;
  const total = DUR * SR;
  const left = new Float32Array(total);
  const right = new Float32Array(total);
  const beat = 60 / 106;
  const chordBeats = 8;

  // Airy Fmaj9 -> Dm9 -> Bbmaj7 -> C6(add9)
  const chords = [
    { sub: 41, notes: [53, 57, 60, 64, 67], chime: [72, 76, 79, 76, 72, 69, 67, 72] },
    { sub: 38, notes: [50, 57, 60, 64, 65], chime: [72, 74, 77, 74, 72, 69, 65, 69] },
    { sub: 34, notes: [46, 53, 57, 62, 65], chime: [70, 74, 77, 74, 70, 69, 65, 69] },
    { sub: 36, notes: [48, 55, 57, 62, 64], chime: [72, 74, 76, 74, 72, 67, 64, 67] },
  ];

  const totalChords = Math.ceil(DUR / (chordBeats * beat));
  for (let c = 0; c < totalChords; c++) {
    const ch = chords[c % chords.length];
    const startSec = c * chordBeats * beat;
    if (startSec >= DUR - 2.0) break;
    const st = Math.floor(startSec * SR);

    ch.notes.forEach((m, idx) => {
      const pan = -0.35 + (idx / Math.max(1, ch.notes.length - 1)) * 0.7;
      addFeltPiano(left, right, st + Math.floor(idx * 0.03 * SR), chordBeats * beat * 0.96, midi(m), 0.24, pan);
    });
    addWarmSub(left, right, st, chordBeats * beat * 0.88, midi(ch.sub), 0.16);

    const kAmp = startSec < 3.0 ? 0.06 : startSec < 16.8 ? 0.11 : 0.04;
    for (let step = 0; step < 8; step++) {
      if (step === 3 || step === 7) continue;
      const stepSec = startSec + step * beat;
      if (stepSec >= DUR - 2.5) break;
      addGlassChime(
        left,
        right,
        Math.floor(stepSec * SR),
        0.5,
        midi(ch.chime[step]),
        kAmp * (step % 4 === 0 ? 1 : 0.72),
        step % 2 === 0 ? -0.32 : 0.32
      );
    }
  }

  const [rl, rr] = applyStereoReverb(left, right, 0.26, 0.54);
  const fi = Math.floor(1.0 * SR);
  const fo = Math.floor(2.5 * SR);
  for (let i = 0; i < fi; i++) { const g = (i / fi) * (i / fi); rl[i] *= g; rr[i] *= g; }
  for (let i = 0; i < fo; i++) { const idx = total - fo + i; const g = Math.pow(1 - i / fo, 2.3); rl[idx] *= g; rr[idx] *= g; }
  normalize(rl, rr, 0.80);
  writeWav("bgm-liquid-bed.wav", rl, rr);
}

// 2. sfx-ios-notif.wav (~0.45s: 3-note harmonious glass-marimba chime)
function genIosNotif() {
  const n = Math.floor(0.48 * SR);
  const l = new Float32Array(n), r = new Float32Array(n);
  addGlassChime(l, r, 0, 0.42, midi(77), 0.46, -0.2); // F5
  addGlassChime(l, r, Math.floor(0.065 * SR), 0.40, midi(81), 0.42, 0.15); // A5
  addGlassChime(l, r, Math.floor(0.13 * SR), 0.34, midi(84), 0.48, 0.25); // C6
  const [rl, rr] = applyStereoReverb(l, r, 0.28, 0.48);
  normalize(rl, rr, 0.72);
  writeWav("sfx-ios-notif.wav", rl, rr);
}

// 3. sfx-droplet-check.wav (~0.18s: liquid crystal droplet pop with pitch lift)
function genDropletCheck() {
  const n = Math.floor(0.18 * SR);
  const l = new Float32Array(n), r = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const atk = i < 140 ? i / 140 : 1;
    const env = Math.exp(-t / 0.038);
    const freq = 520 + 290 * (1 - Math.exp(-t / 0.022));
    ph += (2 * Math.PI * freq) / SR;
    const s = (Math.sin(ph) * 0.82 + Math.sin(ph * 2) * 0.18 * Math.exp(-t / 0.015)) * atk * env;
    l[i] = s;
    r[i] = s * 0.96;
  }
  normalize(l, r, 0.68);
  writeWav("sfx-droplet-check.wav", l, r);
}

// 4. sfx-glass-glide.wav (~0.38s: silky filtered air-glass sweep + micro shimmer)
function genGlassGlide() {
  const n = Math.floor(0.38 * SR);
  const l = new Float32Array(n), r = new Float32Array(n);
  const rng = createRng(202611);
  const bpL = new Biquad("bandpass", 280, 1.35);
  const bpR = new Biquad("bandpass", 300, 1.35);
  let brown = 0;
  for (let i = 0; i < n; i++) {
    const u = i / n;
    const t = i / SR;
    const w = rng() * 2 - 1;
    brown = (brown + 0.05 * w) / 1.05;
    const f = u < 0.45
      ? 220 + 980 * Math.sin((u / 0.45) * (Math.PI / 2))
      : 280 + 920 * Math.cos(((u - 0.45) / 0.55) * (Math.PI / 2));
    bpL.set(f, 1.35);
    bpR.set(f * 1.05, 1.35);
    const env = Math.sin(u * Math.PI) * Math.pow(1 - u, 0.38);
    const shimmer = Math.sin(2 * Math.PI * 1568 * t) * 0.045 * Math.exp(-7 * t);
    l[i] = bpL.process(brown * 2.1 + w * 0.18) * env + shimmer;
    r[i] = bpR.process(brown * 2.1 + w * 0.18) * env + shimmer * 0.9;
  }
  normalize(l, r, 0.64);
  writeWav("sfx-glass-glide.wav", l, r);
}

// 5. sfx-haptic-tap.wav (~0.11s: damped iPhone Taptic Engine micro click)
function genHapticTap() {
  const n = Math.floor(0.11 * SR);
  const l = new Float32Array(n), r = new Float32Array(n);
  const rng = createRng(202622);
  const lpf = new Biquad("lowpass", 1500, 0.85);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const atk = i < 36 ? i / 36 : 1;
    const thud = Math.sin(2 * Math.PI * 165 * t) * Math.exp(-t / 0.014) * 0.72;
    const click = (Math.sin(2 * Math.PI * 980 * t) * 0.35 + (rng() * 2 - 1) * 0.18) * Math.exp(-t / 0.0045);
    const s = lpf.process(thud + click) * atk;
    l[i] = s;
    r[i] = s * 0.98;
  }
  normalize(l, r, 0.74);
  writeWav("sfx-haptic-tap.wav", l, r);
}

// 6. sfx-crystal-resolve.wav (~2.6s: warm Fmaj9 felt piano + crystal shimmer to silence)
function genCrystalResolve() {
  const n = Math.floor(2.6 * SR);
  const l = new Float32Array(n), r = new Float32Array(n);
  [53, 60, 64, 67, 69, 76].forEach((m, idx) => {
    addFeltPiano(l, r, Math.floor(idx * 0.036 * SR), 2.4, midi(m), 0.30, -0.38 + idx * 0.15);
  });
  addGlassChime(l, r, Math.floor(0.14 * SR), 1.4, midi(84), 0.24, 0.25);
  const [rl, rr] = applyStereoReverb(l, r, 0.32, 0.58);
  const tail = Math.floor(0.75 * SR);
  for (let i = 0; i < tail; i++) {
    const idx = n - tail + i;
    const g = Math.pow(1 - i / tail, 2.3);
    rl[idx] *= g;
    rr[idx] *= g;
  }
  normalize(rl, rr, 0.78);
  writeWav("sfx-crystal-resolve.wav", rl, rr);
}

genBgm();
genIosNotif();
genDropletCheck();
genGlassGlide();
genHapticTap();
genCrystalResolve();
console.log("Selesai generate 6 file WAV iOS Liquid Glass.");
