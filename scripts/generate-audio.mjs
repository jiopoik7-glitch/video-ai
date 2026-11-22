#!/usr/bin/env node
/**
 * Procedural Audio Engine — Swiss Editorial Historical Documentary
 * Generates 7 studio-clean RIFF WAV files (PCM 16-bit, Stereo, 44.1 kHz)
 * Zero external dependencies. Deterministic seeded PRNG. Chunk/buffer safe.
 */
import fs from "node:fs";
import path from "node:path";

const SAMPLE_RATE = 44100;
const OUT_DIR = path.resolve(process.cwd(), "public", "audio");
fs.mkdirSync(OUT_DIR, { recursive: true });

// Deterministic Mulberry32 PRNG
function createRng(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Biquad Filter (Low-Pass & Band-Pass)
class Biquad {
  constructor(type, freq, q) {
    this.type = type;
    this.x1 = 0;
    this.x2 = 0;
    this.y1 = 0;
    this.y2 = 0;
    this.setParams(freq, q);
  }
  setParams(freq, q = 0.707) {
    const f = Math.max(20, Math.min(SAMPLE_RATE * 0.45, freq));
    const w0 = (2 * Math.PI * f) / SAMPLE_RATE;
    const cosW = Math.cos(w0);
    const sinW = Math.sin(w0);
    const alpha = sinW / (2 * Math.max(0.1, q));
    let b0, b1, b2, a0, a1, a2;
    if (this.type === "lowpass") {
      b0 = (1 - cosW) / 2;
      b1 = 1 - cosW;
      b2 = (1 - cosW) / 2;
      a0 = 1 + alpha;
      a1 = -2 * cosW;
      a2 = 1 - alpha;
    } else {
      // bandpass (constant skirt gain -> normalized peak)
      b0 = alpha;
      b1 = 0;
      b2 = -alpha;
      a0 = 1 + alpha;
      a1 = -2 * cosW;
      a2 = 1 - alpha;
    }
    this.b0 = b0 / a0;
    this.b1 = b1 / a0;
    this.b2 = b2 / a0;
    this.a1 = a1 / a0;
    this.a2 = a2 / a0;
  }
  process(x) {
    const y =
      this.b0 * x +
      this.b1 * this.x1 +
      this.b2 * this.x2 -
      this.a1 * this.y1 -
      this.a2 * this.y2;
    this.x2 = this.x1;
    this.x1 = x;
    this.y2 = this.y1;
    this.y1 = y;
    return y;
  }
}

// Lightweight stereo Schroeder-style algorithmic reverb (4 comb + 2 allpass per channel)
function applyStereoReverb(left, right, wet = 0.22, decay = 0.58) {
  const n = left.length;
  const combDelaysL = [1559, 1613, 1777, 1931];
  const combDelaysR = [1583, 1637, 1789, 1951];
  const apDelays = [227, 557];

  const runChannel = (input, combDelays) => {
    const combs = combDelays.map((d) => ({
      buf: new Float32Array(d),
      idx: 0,
      lp: 0,
    }));
    const aps = apDelays.map((d) => ({ buf: new Float32Array(d), idx: 0 }));
    const out = new Float32Array(n);

    for (let i = 0; i < n; i++) {
      const x = input[i];
      let sum = 0;
      for (let c = 0; c < combs.length; c++) {
        const cb = combs[c];
        const delayed = cb.buf[cb.idx];
        // Damped lowpass feedback for warm room feel
        cb.lp = delayed * 0.72 + cb.lp * 0.28;
        cb.buf[cb.idx] = x + cb.lp * decay;
        cb.idx = (cb.idx + 1) % cb.buf.length;
        sum += delayed;
      }
      let y = sum * 0.25;
      for (let a = 0; a < aps.length; a++) {
        const ap = aps[a];
        const delayed = ap.buf[ap.idx];
        const g = 0.5;
        const v = y - g * delayed;
        ap.buf[ap.idx] = v;
        ap.idx = (ap.idx + 1) % ap.buf.length;
        y = delayed + g * v;
      }
      out[i] = x * (1 - wet) + y * wet;
    }
    return out;
  };

  return [runChannel(left, combDelaysL), runChannel(right, combDelaysR)];
}

function normalizeStereo(left, right, targetPeak = 0.86) {
  let maxVal = 0;
  for (let i = 0; i < left.length; i++) {
    const a = Math.abs(left[i]);
    const b = Math.abs(right[i]);
    if (a > maxVal) maxVal = a;
    if (b > maxVal) maxVal = b;
  }
  if (maxVal < 1e-6) return;
  const gain = targetPeak / maxVal;
  for (let i = 0; i < left.length; i++) {
    left[i] = Math.max(-0.99, Math.min(0.99, left[i] * gain));
    right[i] = Math.max(-0.99, Math.min(0.99, right[i] * gain));
  }
}

function writeWavStereo(filename, left, right) {
  const numSamples = left.length;
  const numChannels = 2;
  const bitsPerSample = 16;
  const byteRate = (SAMPLE_RATE * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = numSamples * blockAlign;
  const filePath = path.join(OUT_DIR, filename);

  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // PCM chunk size
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  // Stream in chunks to keep memory usage steady on mobile/CI
  const fd = fs.openSync(filePath, "w");
  fs.writeSync(fd, header);
  const CHUNK = 65536;
  const buf = Buffer.alloc(CHUNK * 4);
  for (let offset = 0; offset < numSamples; offset += CHUNK) {
    const count = Math.min(CHUNK, numSamples - offset);
    for (let i = 0; i < count; i++) {
      const sL = Math.max(-1, Math.min(1, left[offset + i]));
      const sR = Math.max(-1, Math.min(1, right[offset + i]));
      buf.writeInt16LE(Math.round(sL * 32767), i * 4);
      buf.writeInt16LE(Math.round(sR * 32767), i * 4 + 2);
    }
    fs.writeSync(fd, buf, 0, count * 4);
  }
  fs.closeSync(fd);

  const stat = fs.statSync(filePath);
  const dur = (numSamples / SAMPLE_RATE).toFixed(2);
  console.log(`[AUDIO OK] ${filename.padEnd(26)} | ${dur}s | ${(stat.size / 1024).toFixed(1)} KB`);
}

function midiToFreq(m) {
  return 440 * Math.pow(2, (m - 69) / 12);
}

// Add a warm damped felt piano note into stereo buffers
function addFeltPianoNote(left, right, startSample, durSec, freq, amp, pan = 0) {
  const len = Math.min(Math.floor(durSec * SAMPLE_RATE), left.length - startSample);
  if (len <= 0 || startSample < 0) return;
  const attackSamples = Math.floor(0.018 * SAMPLE_RATE); // 18ms soft felt attack
  const decayRate = 1.65 / Math.max(0.4, durSec);
  const gainL = Math.cos(((pan + 1) * Math.PI) / 4) * amp;
  const gainR = Math.sin(((pan + 1) * Math.PI) / 4) * amp;

  const lpf = new Biquad("lowpass", 1100, 0.707);
  const w1 = (2 * Math.PI * freq) / SAMPLE_RATE;
  const w2 = (2 * Math.PI * freq * 2.001) / SAMPLE_RATE;
  const w3 = (2 * Math.PI * freq * 3.003) / SAMPLE_RATE;

  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const envAtk = i < attackSamples ? 1 - Math.exp((-5 * i) / attackSamples) : 1;
    const envDec = Math.exp(-decayRate * t);
    const tailFade = i > len - 400 ? (len - i) / 400 : 1;
    // Fundamental + soft 2nd & 3rd harmonics that decay faster
    const raw =
      Math.sin(w1 * i) * 0.74 +
      Math.sin(w2 * i) * 0.20 * Math.exp(-2.8 * t) +
      Math.sin(w3 * i) * 0.06 * Math.exp(-5.0 * t);
    const filtered = lpf.process(raw) * envAtk * envDec * tailFade;
    left[startSample + i] += filtered * gainL;
    right[startSample + i] += filtered * gainR;
  }
}

// Add muted marimba / kalimba note
function addMutedMarimbaNote(left, right, startSample, freq, amp, pan = 0) {
  const durSec = 0.42;
  const len = Math.min(Math.floor(durSec * SAMPLE_RATE), left.length - startSample);
  if (len <= 0 || startSample < 0) return;
  const attackSamples = Math.floor(0.006 * SAMPLE_RATE);
  const gainL = Math.cos(((pan + 1) * Math.PI) / 4) * amp;
  const gainR = Math.sin(((pan + 1) * Math.PI) / 4) * amp;
  const w1 = (2 * Math.PI * freq) / SAMPLE_RATE;
  const w4 = (2 * Math.PI * freq * 3.98) / SAMPLE_RATE;

  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const atk = i < attackSamples ? i / attackSamples : 1;
    const env = Math.exp(-10.5 * t);
    const s =
      (Math.sin(w1 * i) * 0.88 + Math.sin(w4 * i) * 0.12 * Math.exp(-28 * t)) *
      atk *
      env;
    left[startSample + i] += s * gainL;
    right[startSample + i] += s * gainR;
  }
}

// Add analog sub-pulse (<115 Hz)
function addSubPulse(left, right, startSample, durSec, freq, amp) {
  const len = Math.min(Math.floor(durSec * SAMPLE_RATE), left.length - startSample);
  if (len <= 0 || startSample < 0) return;
  const safeFreq = freq > 110 ? freq / 2 : freq;
  const attackSamples = Math.floor(0.08 * SAMPLE_RATE);
  const w = (2 * Math.PI * safeFreq) / SAMPLE_RATE;
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const atk = i < attackSamples ? i / attackSamples : 1;
    const env = Math.exp(-0.55 * t);
    const fadeOut = i > len - 2200 ? (len - i) / 2200 : 1;
    const s = Math.sin(w * i) * atk * env * fadeOut * amp;
    left[startSample + i] += s;
    right[startSample + i] += s;
  }
}

// ============================================================================
// A. BGM Editorial Bed (215s, 96 BPM, Cmaj9 -> Am9 -> Fmaj7(#11) -> G6(add9))
// ============================================================================
function generateBgm() {
  const DURATION = 215;
  const totalSamples = DURATION * SAMPLE_RATE;
  const left = new Float32Array(totalSamples);
  const right = new Float32Array(totalSamples);

  const BPM = 96;
  const beatSec = 60 / BPM; // 0.625s per beat
  const chordBeats = 8; // 8 beats = 5.0s per chord

  // Chords in MIDI notes: [rootSub, ...voicing]
  const progression = [
    // Cmaj9: C2 sub, C3, G3, B3, D4, E4
    { sub: 36, notes: [48, 55, 59, 62, 64], marimba: [64, 67, 71, 74, 71, 67, 62, 64] },
    // Am9: A1 sub, A2, E3, G3, B3, C4
    { sub: 33, notes: [45, 52, 55, 59, 60], marimba: [60, 64, 67, 71, 67, 64, 59, 60] },
    // Fmaj7(#11): F1/F2 sub, F2, C3, E3, A3, B3
    { sub: 41, notes: [41, 48, 52, 57, 59], marimba: [60, 64, 69, 71, 69, 64, 57, 60] },
    // G6(add9): G1/G2 sub, G2, D3, E3, A3, B3
    { sub: 43, notes: [43, 50, 52, 57, 59], marimba: [62, 64, 67, 71, 67, 64, 62, 59] },
  ];

  // Dynamic profile matching the 7 documentary scenes (in seconds)
  function getDynamics(tSec) {
    if (tSec < 15) return { piano: 0.22, sub: 0.14, marimba: 0.03 }; // Intro: calm & spacious
    if (tSec < 35) return { piano: 0.24, sub: 0.16, marimba: 0.08 }; // Opening: steady & focused
    if (tSec < 75) return { piano: 0.25, sub: 0.17, marimba: 0.13 }; // Budi Utomo: soft piano + gentle rhythm
    if (tSec < 115) return { piano: 0.26, sub: 0.19, marimba: 0.16 }; // Indische Partij: editorial & moving
    if (tSec < 155) return { piano: 0.28, sub: 0.23, marimba: 0.17 }; // PNI: assertive & energetic
    if (tSec < 195) return { piano: 0.25, sub: 0.17, marimba: 0.12 }; // PI: spacious international feel
    return { piano: 0.23, sub: 0.14, marimba: 0.04 }; // Outro: warm & resolving
  }

  const totalChords = Math.ceil(DURATION / (chordBeats * beatSec));
  for (let c = 0; c < totalChords; c++) {
    const chord = progression[c % progression.length];
    const startSec = c * chordBeats * beatSec;
    if (startSec >= DURATION - 2.5) break;

    const dyn = getDynamics(startSec);
    const startSample = Math.floor(startSec * SAMPLE_RATE);

    // 1. Felt Piano chord (slightly rolled for human touch)
    chord.notes.forEach((midi, idx) => {
      const rollOffset = Math.floor(idx * 0.028 * SAMPLE_RATE);
      const pan = -0.35 + (idx / Math.max(1, chord.notes.length - 1)) * 0.7;
      addFeltPianoNote(
        left,
        right,
        startSample + rollOffset,
        chordBeats * beatSec * 0.96,
        midiToFreq(midi),
        dyn.piano * (idx === 0 ? 0.9 : 0.62),
        pan
      );
    });

    // Gentle mid-bar piano echo on beat 5
    const midBeatStart = Math.floor((startSec + 4 * beatSec) * SAMPLE_RATE);
    addFeltPianoNote(
      left,
      right,
      midBeatStart,
      3.5 * beatSec,
      midiToFreq(chord.notes[chord.notes.length - 1]),
      dyn.piano * 0.42,
      0.28
    );
    addFeltPianoNote(
      left,
      right,
      midBeatStart + Math.floor(0.03 * SAMPLE_RATE),
      3.5 * beatSec,
      midiToFreq(chord.notes[2]),
      dyn.piano * 0.36,
      -0.25
    );

    // 2. Analog Sub-Pulse on beat 1 and gentle re-pulse on beat 5
    addSubPulse(left, right, startSample, 4.2 * beatSec, midiToFreq(chord.sub), dyn.sub);
    addSubPulse(left, right, midBeatStart, 3.6 * beatSec, midiToFreq(chord.sub), dyn.sub * 0.72);

    // 3. Muted Marimba / Kalimba ostinato (16th/8th gentle editorial pulse)
    if (dyn.marimba > 0.02) {
      for (let step = 0; step < 8; step++) {
        // Leave breathing space on selected steps so voice/captions stay clear
        if (step === 3 || step === 7) continue;
        const stepSec = startSec + step * beatSec;
        if (stepSec >= DURATION - 3.5) break;
        const noteMidi = chord.marimba[step % chord.marimba.length];
        const pan = step % 2 === 0 ? -0.3 : 0.3;
        const accent = step === 0 || step === 4 ? 1.0 : 0.72;
        addMutedMarimbaNote(
          left,
          right,
          Math.floor(stepSec * SAMPLE_RATE),
          midiToFreq(noteMidi),
          dyn.marimba * accent,
          pan
        );
      }
    }
  }

  // Soft stereo algorithmic reverb
  const [revL, revR] = applyStereoReverb(left, right, 0.24, 0.56);

  // Smooth 1.2s fade-in and 3.0s exponential fade-out
  const fadeInSamples = Math.floor(1.2 * SAMPLE_RATE);
  const fadeOutSamples = Math.floor(3.0 * SAMPLE_RATE);
  for (let i = 0; i < fadeInSamples; i++) {
    const g = i / fadeInSamples;
    revL[i] *= g * g;
    revR[i] *= g * g;
  }
  for (let i = 0; i < fadeOutSamples; i++) {
    const idx = totalSamples - fadeOutSamples + i;
    const progress = i / fadeOutSamples;
    const g = Math.pow(1 - progress, 2.4);
    revL[idx] *= g;
    revR[idx] *= g;
  }

  normalizeStereo(revL, revR, 0.82);
  writeWavStereo("bgm-editorial-bed.wav", revL, revR);
}

// ============================================================================
// B. SFX Paper Whip (0.38s, brown/pink noise, band-pass sweep 180->950->240 Hz)
// ============================================================================
function generatePaperWhip() {
  const n = Math.floor(0.38 * SAMPLE_RATE);
  const left = new Float32Array(n);
  const right = new Float32Array(n);
  const rng = createRng(190801);
  const bpL = new Biquad("bandpass", 240, 1.4);
  const bpR = new Biquad("bandpass", 250, 1.4);
  let brown = 0;

  for (let i = 0; i < n; i++) {
    const u = i / n;
    const white = rng() * 2 - 1;
    brown = (brown + 0.05 * white) / 1.05;
    const src = brown * 2.2 + white * 0.22;

    // Sweep 180 -> 950 -> 240 Hz
    const freq =
      u < 0.42
        ? 180 + (950 - 180) * Math.sin((u / 0.42) * (Math.PI / 2))
        : 240 + (950 - 240) * Math.cos(((u - 0.42) / 0.58) * (Math.PI / 2));
    bpL.setParams(freq, 1.35);
    bpR.setParams(freq * 1.04, 1.35);

    const env = Math.sin(u * Math.PI) * Math.pow(1 - u, 0.45);
    const panShift = 0.85 + 0.15 * Math.sin(u * Math.PI);
    left[i] = bpL.process(src) * env * panShift;
    right[i] = bpR.process(src) * env * (1.7 - panShift);
  }
  normalizeStereo(left, right, 0.65);
  writeWavStereo("sfx-paper-whip.wav", left, right);
}

// ============================================================================
// C. SFX Stabilo Swipe (0.32s, filtered noise 700-1800Hz + soft harmonic shimmer)
// ============================================================================
function generateStabiloSwipe() {
  const n = Math.floor(0.32 * SAMPLE_RATE);
  const left = new Float32Array(n);
  const right = new Float32Array(n);
  const rng = createRng(191202);
  const bp = new Biquad("bandpass", 1100, 1.6);

  for (let i = 0; i < n; i++) {
    const u = i / n;
    const t = i / SAMPLE_RATE;
    const freq = 720 + 1060 * u;
    bp.setParams(freq, 1.7);
    const friction = bp.process(rng() * 2 - 1) * 0.7;
    const shimmer =
      (Math.sin(2 * Math.PI * 1046.5 * t) * 0.07 +
        Math.sin(2 * Math.PI * 1318.5 * t) * 0.05) *
      Math.exp(-6.5 * t);
    const env = Math.pow(Math.sin(u * Math.PI), 0.75);
    // Subtle left-to-right stereo swipe
    const panL = Math.cos(u * 0.65 * (Math.PI / 2));
    const panR = Math.sin((0.35 + u * 0.65) * (Math.PI / 2));
    const s = (friction + shimmer) * env;
    left[i] = s * panL;
    right[i] = s * panR;
  }
  normalizeStereo(left, right, 0.62);
  writeWavStereo("sfx-stabilo-swipe.wav", left, right);
}

// ============================================================================
// D. SFX Year Tick (0.12s, damped wooden/analog click, 650Hz & 1200Hz, 35ms decay)
// ============================================================================
function generateYearTick() {
  const n = Math.floor(0.12 * SAMPLE_RATE);
  const left = new Float32Array(n);
  const right = new Float32Array(n);
  const rng = createRng(192503);
  const lpf = new Biquad("lowpass", 1800, 0.8);

  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const atk = i < 40 ? i / 40 : 1;
    const decay = Math.exp(-t / 0.035);
    const transient = (rng() * 2 - 1) * Math.exp(-t / 0.004) * 0.35;
    const tone =
      Math.sin(2 * Math.PI * 650 * t) * 0.65 +
      Math.sin(2 * Math.PI * 1200 * t) * 0.35 * Math.exp(-t / 0.018);
    const s = lpf.process(tone + transient) * atk * decay;
    left[i] = s;
    right[i] = s * 0.96;
  }
  normalizeStereo(left, right, 0.72);
  writeWavStereo("sfx-year-tick.wav", left, right);
}

// ============================================================================
// E. SFX Card Pop (0.18s, warm soft marimba pop, slight upward pitch lift)
// ============================================================================
function generateCardPop() {
  const n = Math.floor(0.18 * SAMPLE_RATE);
  const left = new Float32Array(n);
  const right = new Float32Array(n);
  let phase = 0;

  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const atk = i < 180 ? i / 180 : 1;
    const env = Math.exp(-t / 0.045);
    // Warm upward pitch inflection (392 Hz -> 440 Hz)
    const freq = 392 + 48 * (1 - Math.exp(-t / 0.03));
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;
    const body = Math.sin(phase) * 0.85 + Math.sin(phase * 2) * 0.15 * Math.exp(-t / 0.015);
    const s = body * atk * env;
    left[i] = s * 0.98;
    right[i] = s;
  }
  normalizeStereo(left, right, 0.68);
  writeWavStereo("sfx-card-pop.wav", left, right);
}

// ============================================================================
// F. SFX Impact Sub (1.1s, low-pass cinematic sub drop 85->42Hz + low felt piano)
// ============================================================================
function generateImpactSub() {
  const n = Math.floor(1.1 * SAMPLE_RATE);
  const left = new Float32Array(n);
  const right = new Float32Array(n);
  let phase = 0;

  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const u = i / n;
    const atk = i < 660 ? i / 660 : 1; // 15ms smooth attack
    const env = Math.exp(-t / 0.34) * (u > 0.85 ? (1 - u) / 0.15 : 1);
    const freq = 42 + 43 * Math.exp(-t / 0.24);
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;
    const sub = Math.sin(phase) * atk * env * 0.78;
    left[i] += sub;
    right[i] += sub;
  }

  // Add one soft low felt piano note (C2 = 65.41 Hz & C3 = 130.81 Hz)
  addFeltPianoNote(left, right, 0, 1.05, 65.41, 0.38, -0.15);
  addFeltPianoNote(left, right, 120, 1.0, 130.81, 0.26, 0.15);

  const [revL, revR] = applyStereoReverb(left, right, 0.18, 0.45);
  normalizeStereo(revL, revR, 0.80);
  writeWavStereo("sfx-impact-sub.wav", revL, revR);
}

// ============================================================================
// G. SFX Outro Resolve (3.2s, warm Cmaj9 felt piano chord + gentle reverb to silence)
// ============================================================================
function generateOutroResolve() {
  const n = Math.floor(3.2 * SAMPLE_RATE);
  const left = new Float32Array(n);
  const right = new Float32Array(n);
  const chordMidi = [48, 55, 59, 62, 64, 71]; // Cmaj9 warm spread

  chordMidi.forEach((m, idx) => {
    const start = Math.floor(idx * 0.045 * SAMPLE_RATE);
    const pan = -0.4 + (idx / (chordMidi.length - 1)) * 0.8;
    addFeltPianoNote(left, right, start, 3.0, midiToFreq(m), 0.32, pan);
  });

  const [revL, revR] = applyStereoReverb(left, right, 0.34, 0.64);
  const tailFade = Math.floor(0.9 * SAMPLE_RATE);
  for (let i = 0; i < tailFade; i++) {
    const idx = n - tailFade + i;
    const g = Math.pow(1 - i / tailFade, 2.2);
    revL[idx] *= g;
    revR[idx] *= g;
  }
  normalizeStereo(revL, revR, 0.78);
  writeWavStereo("sfx-outro-resolve.wav", revL, revR);
}

console.log("Generating 7 procedural WAV files into public/audio/ ...");
generateBgm();
generatePaperWhip();
generateStabiloSwipe();
generateYearTick();
generateCardPop();
generateImpactSub();
generateOutroResolve();
console.log("All 7 WAV files generated successfully.");
