#!/usr/bin/env node
/**
 * Seflorner Organic Botanical Audio Engine (Pure Node.js DSP)
 * Menghasilkan 7 file RIFF WAV (PCM 16-bit, Stereo, 44.1 kHz) tanpa dependensi luar.
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

function applyReverb(left, right, wet = 0.28, decay = 0.56) {
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
  console.log(`[SEFLORNER AUDIO] ${name.padEnd(28)} ${(n / SR).toFixed(2)}s`);
}

function midi(m) {
  return 440 * Math.pow(2, (m - 69) / 12);
}

function addFeltNote(left, right, start, durSec, freq, amp, pan = 0) {
  const len = Math.min(Math.floor(durSec * SR), left.length - start);
  if (len <= 0 || start < 0) return;
  const atk = Math.floor(0.016 * SR);
  const gL = Math.cos(((pan + 1) * Math.PI) / 4) * amp;
  const gR = Math.sin(((pan + 1) * Math.PI) / 4) * amp;
  const lpf = new Biquad("lowpass", 1350, 0.72);
  const w1 = (2 * Math.PI * freq) / SR;
  const w2 = (2 * Math.PI * freq * 2.0015) / SR;
  const w3 = (2 * Math.PI * freq * 3.002) / SR;

  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const eAtk = i < atk ? 1 - Math.exp((-5 * i) / atk) : 1;
    const eDec = Math.exp((-1.55 / Math.max(0.4, durSec)) * t);
    const tail = i > len - 360 ? (len - i) / 360 : 1;
    const raw =
      Math.sin(w1 * i) * 0.72 +
      Math.sin(w2 * i) * 0.21 * Math.exp(-2.6 * t) +
      Math.sin(w3 * i) * 0.07 * Math.exp(-4.8 * t);
    const s = lpf.process(raw) * eAtk * eDec * tail;
    left[start + i] += s * gL;
    right[start + i] += s * gR;
  }
}

function addKalimbaPluck(left, right, start, freq, amp, pan = 0) {
  const len = Math.min(Math.floor(0.48 * SR), left.length - start);
  if (len <= 0 || start < 0) return;
  const atk = Math.floor(0.005 * SR);
  const gL = Math.cos(((pan + 1) * Math.PI) / 4) * amp;
  const gR = Math.sin(((pan + 1) * Math.PI) / 4) * amp;
  const w1 = (2 * Math.PI * freq) / SR;
  const w3 = (2 * Math.PI * freq * 2.98) / SR;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const eAtk = i < atk ? i / atk : 1;
    const env = Math.exp(-8.5 * t);
    const s = (Math.sin(w1 * i) * 0.86 + Math.sin(w3 * i) * 0.14 * Math.exp(-26 * t)) * eAtk * env;
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

// 1. BGM Botanical Sunlight (32 detik @ 104 BPM, Fmaj9 -> Dm9 -> Bbmaj7 -> C6(add9))
function genBgm() {
  const DUR = 32;
  const total = DUR * SR;
  const left = new Float32Array(total);
  const right = new Float32Array(total);
  const beat = 60 / 104; // ~0.577s
  const chordBeats = 8; // ~4.615s per chord

  const chords = [
    { sub: 41, notes: [53, 57, 60, 64, 67], arp: [69, 72, 76, 72, 69, 67, 64, 67] }, // Fmaj9
    { sub: 38, notes: [50, 57, 60, 64, 65], arp: [69, 72, 74, 72, 69, 65, 64, 65] }, // Dm9
    { sub: 34, notes: [46, 53, 57, 62, 65], arp: [69, 70, 74, 70, 69, 65, 62, 65] }, // Bbmaj7
    { sub: 36, notes: [48, 55, 57, 62, 64], arp: [67, 72, 74, 72, 67, 64, 62, 64] }, // C6(add9)
  ];

  const totalChords = Math.ceil(DUR / (chordBeats * beat));
  for (let c = 0; c < totalChords; c++) {
    const ch = chords[c % chords.length];
    const startSec = c * chordBeats * beat;
    if (startSec >= DUR - 2.2) break;
    const st = Math.floor(startSec * SR);

    // Arpeggiated warm felt piano chord
    ch.notes.forEach((m, idx) => {
      const pan = -0.38 + (idx / Math.max(1, ch.notes.length - 1)) * 0.76;
      addFeltNote(left, right, st + Math.floor(idx * 0.032 * SR), chordBeats * beat * 0.98, midi(m), 0.24, pan);
    });
    addWarmSub(left, right, st, chordBeats * beat * 0.9, midi(ch.sub), 0.16);

    // Gentle kalimba botanical groove (ramps up slightly in middle scenes 5.5s-24.5s)
    const kalimbaAmp = startSec < 4.5 ? 0.07 : startSec < 24.5 ? 0.14 : 0.05;
    for (let step = 0; step < 8; step++) {
      if (step === 3 || step === 7) continue;
      const stepSec = startSec + step * beat;
      if (stepSec >= DUR - 2.8) break;
      const pan = step % 2 === 0 ? -0.32 : 0.32;
      addKalimbaPluck(left, right, Math.floor(stepSec * SR), midi(ch.arp[step]), kalimbaAmp * (step % 4 === 0 ? 1 : 0.76), pan);
    }
  }

  const [revL, revR] = applyReverb(left, right, 0.28, 0.58);
  // Smooth fade-in (1.0s) & fade-out (2.6s)
  const fi = Math.floor(1.0 * SR);
  const fo = Math.floor(2.6 * SR);
  for (let i = 0; i < fi; i++) {
    const g = (i / fi) * (i / fi);
    revL[i] *= g; revR[i] *= g;
  }
  for (let i = 0; i < fo; i++) {
    const idx = total - fo + i;
    const g = Math.pow(1 - i / fo, 2.2);
    revL[idx] *= g; revR[idx] *= g;
  }
  normalize(revL, revR, 0.80);
  writeWav("seflorner-bgm.wav", revL, revR);
}

// 2. Organic Soft Whoosh (0.36s)
function genWhoosh() {
  const n = Math.floor(0.36 * SR);
  const l = new Float32Array(n), r = new Float32Array(n);
  const rng = createRng(202401);
  const bpL = new Biquad("bandpass", 260, 1.3);
  const bpR = new Biquad("bandpass", 280, 1.3);
  let brown = 0;
  for (let i = 0; i < n; i++) {
    const u = i / n;
    const w = rng() * 2 - 1;
    brown = (brown + 0.05 * w) / 1.05;
    const f = u < 0.45 ? 200 + 820 * Math.sin((u / 0.45) * (Math.PI / 2)) : 260 + 760 * Math.cos(((u - 0.45) / 0.55) * (Math.PI / 2));
    bpL.set(f, 1.3); bpR.set(f * 1.05, 1.3);
    const env = Math.sin(u * Math.PI) * Math.pow(1 - u, 0.4);
    l[i] = bpL.process(brown * 2 + w * 0.2) * env;
    r[i] = bpR.process(brown * 2 + w * 0.2) * env;
  }
  normalize(l, r, 0.62);
  writeWav("seflorner-whoosh.wav", l, r);
}

// 3. Organic Pop / Seed Pill (0.16s)
function genPop() {
  const n = Math.floor(0.16 * SR);
  const l = new Float32Array(n), r = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const atk = i < 160 ? i / 160 : 1;
    const env = Math.exp(-t / 0.04);
    const f = 440 + 130 * (1 - Math.exp(-t / 0.025));
    ph += (2 * Math.PI * f) / SR;
    const s = (Math.sin(ph) * 0.85 + Math.sin(ph * 2) * 0.15 * Math.exp(-t / 0.014)) * atk * env;
    l[i] = s; r[i] = s * 0.96;
  }
  normalize(l, r, 0.68);
  writeWav("seflorner-pop.wav", l, r);
}

// 4. Botanical Bloom Chime (0.65s)
function genBloom() {
  const n = Math.floor(0.65 * SR);
  const l = new Float32Array(n), r = new Float32Array(n);
  addKalimbaPluck(l, r, 0, midi(69), 0.5, -0.25);
  addKalimbaPluck(l, r, Math.floor(0.055 * SR), midi(72), 0.45, 0.1);
  addKalimbaPluck(l, r, Math.floor(0.11 * SR), midi(76), 0.5, 0.3);
  const [rl, rr] = applyReverb(l, r, 0.3, 0.5);
  normalize(rl, rr, 0.72);
  writeWav("seflorner-bloom.wav", rl, rr);
}

// 5. Soft Camera Shutter / Button Click (0.12s)
function genClick() {
  const n = Math.floor(0.12 * SR);
  const l = new Float32Array(n), r = new Float32Array(n);
  const rng = createRng(202405);
  const bp = new Biquad("bandpass", 1450, 1.5);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const click1 = Math.exp(-t / 0.008) * (Math.sin(2 * Math.PI * 820 * t) * 0.6 + bp.process(rng() * 2 - 1) * 0.5);
    const click2 = t > 0.028 ? Math.exp(-(t - 0.028) / 0.012) * Math.sin(2 * Math.PI * 1180 * (t - 0.028)) * 0.5 : 0;
    const s = click1 + click2;
    l[i] = s; r[i] = s * 0.97;
  }
  normalize(l, r, 0.70);
  writeWav("seflorner-click.wav", l, r);
}

// 6. Harvest Sparkle Chime (0.75s)
function genSparkle() {
  const n = Math.floor(0.75 * SR);
  const l = new Float32Array(n), r = new Float32Array(n);
  [72, 76, 79, 84].forEach((m, idx) => {
    addKalimbaPluck(l, r, Math.floor(idx * 0.05 * SR), midi(m), 0.42, -0.35 + idx * 0.23);
  });
  const [rl, rr] = applyReverb(l, r, 0.32, 0.52);
  normalize(rl, rr, 0.70);
  writeWav("seflorner-sparkle.wav", rl, rr);
}

// 7. Finale Resolve Chord Fmaj9 (2.8s)
function genResolve() {
  const n = Math.floor(2.8 * SR);
  const l = new Float32Array(n), r = new Float32Array(n);
  [53, 60, 64, 67, 69, 76].forEach((m, idx) => {
    addFeltNote(l, r, Math.floor(idx * 0.04 * SR), 2.6, midi(m), 0.3, -0.4 + idx * 0.16);
  });
  const [rl, rr] = applyReverb(l, r, 0.34, 0.6);
  const tail = Math.floor(0.8 * SR);
  for (let i = 0; i < tail; i++) {
    const idx = n - tail + i;
    const g = Math.pow(1 - i / tail, 2.2);
    rl[idx] *= g; rr[idx] *= g;
  }
  normalize(rl, rr, 0.78);
  writeWav("seflorner-resolve.wav", rl, rr);
}

genBgm();
genWhoosh();
genPop();
genBloom();
genClick();
genSparkle();
genResolve();
console.log("Selesai generate 7 audio WAV Seflorner.");
